import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "settl_admin" ? user : null;
}

export async function PATCH(request, { params }) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { welcome_letter, generated_summary } = await request.json();

  const admin = createAdminClient();

  // Fetch current document
  const { data: doc, error: fetchError } = await admin
    .from("documents").select("content").eq("id", id).single();

  if (fetchError || !doc)
    return NextResponse.json({ error: "Document not found" }, { status: 404 });

  // Merge edits into content
  const updated = {
    ...doc.content,
    meta: {
      ...doc.content.meta,
      ...(welcome_letter !== undefined && { welcome_letter }),
      ...(generated_summary !== undefined && { generated_summary }),
    },
  };

  const { error } = await admin
    .from("documents").update({ content: updated }).eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
