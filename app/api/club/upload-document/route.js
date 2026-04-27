import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: club } = await admin.from("clubs").select("slug").eq("id", profile.club_id).single();
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  try {
    const url = new URL(request.url);
    const fileName = url.searchParams.get("name") || "document.pdf";
    const fileType = url.searchParams.get("type") || "application/pdf";

    const buffer = new Uint8Array(await request.arrayBuffer());
    if (!buffer.length) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = fileName.split(".").pop();
    const path = `${club.slug}/${Date.now()}.${ext}`;

    const { error: uploadError } = await admin.storage
      .from("club-documents")
      .upload(path, buffer, { contentType: fileType, upsert: false });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: { publicUrl } } = admin.storage.from("club-documents").getPublicUrl(path);
    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    console.error("[upload-document]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
