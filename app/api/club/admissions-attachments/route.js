import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!["club_admin", "admissions"].includes(profile?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const fd = await request.formData();
  const file = fd.get("file");
  const label = fd.get("label") || file?.name || "Attachment";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = file.name.split(".").pop().toLowerCase();
  const id = crypto.randomUUID();
  const path = `admissions/${profile.club_id}/${id}.${ext}`;

  const buffer = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from("club-documents")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = admin.storage.from("club-documents").getPublicUrl(path);

  // Fetch existing config
  const { data: existing } = await admin
    .from("admissions_doc_config")
    .select("id, attachments")
    .eq("club_id", profile.club_id)
    .single();

  const currentAttachments = existing?.attachments || [];
  const newAttachment = { id, label, file_name: file.name, url: publicUrl, path, visibility: "all" };

  if (existing) {
    await admin.from("admissions_doc_config")
      .update({ attachments: [...currentAttachments, newAttachment] })
      .eq("id", existing.id);
  } else {
    await admin.from("admissions_doc_config")
      .upsert({ club_id: profile.club_id, attachments: [newAttachment] }, { onConflict: "club_id" });
  }

  return NextResponse.json({ ok: true, attachment: newAttachment });
}

export async function DELETE(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!["club_admin", "admissions"].includes(profile?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { attachmentId } = await request.json();

  const { data: existing } = await admin
    .from("admissions_doc_config")
    .select("id, attachments")
    .eq("club_id", profile.club_id)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const toRemove = existing.attachments?.find(a => a.id === attachmentId);
  if (toRemove?.path) {
    await admin.storage.from("club-documents").remove([toRemove.path]);
  }

  const updated = (existing.attachments || []).filter(a => a.id !== attachmentId);
  await admin.from("admissions_doc_config").update({ attachments: updated }).eq("id", existing.id);

  return NextResponse.json({ ok: true });
}
