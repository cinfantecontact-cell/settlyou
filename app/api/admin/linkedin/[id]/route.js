import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { publishPost } from "@/lib/linkedin/client";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "settl_admin" ? user : null;
}

export async function PATCH(request, { params }) {
  const user = await verifyAdmin();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const admin = createAdminClient();

  const update = {};
  if (body.content !== undefined) update.content = body.content;
  if (body.status === "scheduled") {
    update.status = "scheduled";
    update.scheduled_for =
      body.scheduled_for || new Date(Date.now() + 86400000).toISOString();
  } else if (body.status === "draft") {
    update.status = "draft";
    update.scheduled_for = null;
  } else if (body.status === "published") {
    update.status = "published";
    update.published_at = new Date().toISOString();
  }

  if (Object.keys(update).length === 0)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const { error } = await admin
    .from("linkedin_posts")
    .update(update)
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function POST(request, { params }) {
  const user = await verifyAdmin();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { data: post } = await admin.from("linkedin_posts").select("content").eq("id", id).single();
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  try {
    const response = await publishPost(post.content);
    await admin.from("linkedin_posts").update({
      status: "published",
      published_at: new Date().toISOString(),
      linkedin_post_id: response.id || null,
    }).eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    await admin.from("linkedin_posts").update({ status: "failed", error_message: err.message }).eq("id", id);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await verifyAdmin();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { error } = await admin.from("linkedin_posts").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
