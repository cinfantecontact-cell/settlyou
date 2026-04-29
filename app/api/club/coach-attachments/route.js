import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (profile?.role !== "coach") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const fd = await request.formData();
  const file = fd.get("file");
  const label = fd.get("label") || file?.name || "Attachment";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = file.name.split(".").pop().toLowerCase();
  const id = crypto.randomUUID();
  const sportSlug = (profile.sport || "general").toLowerCase().replace(/[^a-z0-9]/g, "-");
  const path = `coach-attachments/${profile.club_id}/${sportSlug}/${id}.${ext}`;

  const buffer = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from("club-documents")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = admin.storage.from("club-documents").getPublicUrl(path);

  // Fetch existing record
  const { data: existing } = await admin
    .from("coach_sport_notes")
    .select("id, coach_attachments")
    .eq("club_id", profile.club_id)
    .eq("sport", profile.sport)
    .single();

  const currentAttachments = existing?.coach_attachments || [];
  const newAttachment = { id, label, file_name: file.name, url: publicUrl, path };

  if (existing) {
    await admin.from("coach_sport_notes")
      .update({ coach_attachments: [...currentAttachments, newAttachment] })
      .eq("id", existing.id);
  } else {
    await admin.from("coach_sport_notes")
      .upsert({ club_id: profile.club_id, sport: profile.sport, coach_attachments: [newAttachment] }, { onConflict: "club_id,sport" });
  }

  return NextResponse.json({ ok: true, attachment: newAttachment });
}

export async function DELETE(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (profile?.role !== "coach") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { attachmentId } = await request.json();

  const { data: existing } = await admin
    .from("coach_sport_notes")
    .select("id, coach_attachments")
    .eq("club_id", profile.club_id)
    .eq("sport", profile.sport)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const toRemove = existing.coach_attachments?.find(a => a.id === attachmentId);
  if (toRemove?.path) {
    await admin.storage.from("club-documents").remove([toRemove.path]);
  }

  const updated = (existing.coach_attachments || []).filter(a => a.id !== attachmentId);
  await admin.from("coach_sport_notes").update({ coach_attachments: updated }).eq("id", existing.id);

  return NextResponse.json({ ok: true });
}
