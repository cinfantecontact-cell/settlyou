import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: req, error } = await admin
    .from("requests")
    .select("id, club_id, athlete_name, sport")
    .eq("upload_token", token)
    .single();

  if (error || !req) {
    return NextResponse.json({ error: "Invalid upload link" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const documentType = formData.get("document_type");

    if (!file || !documentType) {
      return NextResponse.json({ error: "File and document type are required" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    const path = `${req.id}/${documentType}_${Date.now()}.${ext}`;

    const { error: uploadError } = await admin.storage
      .from("athlete-documents")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = admin.storage.from("athlete-documents").getPublicUrl(path);

    const { error: insertError } = await admin
      .from("athlete_documents")
      .insert({
        request_id: req.id,
        document_type: documentType,
        file_name: file.name,
        file_url: publicUrl,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Fire in-app notification for document upload
    await admin.from("events").insert({
      event_type: "document_uploaded",
      request_id: req.id,
      club_id: req.club_id,
      metadata: {
        athlete_name: req.athlete_name || null,
        document_type: documentType,
        file_name: file.name,
        sport: req.sport || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[upload-submit]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
