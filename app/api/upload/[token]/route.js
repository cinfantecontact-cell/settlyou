import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BASE_DOCUMENT_TYPES, getSportDocTypes } from "@/lib/documents/types";

export async function GET(request, { params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: req, error } = await admin
    .from("requests")
    .select("id, athlete_name, club_id, sport, clubs(name)")
    .eq("upload_token", token)
    .single();

  if (error || !req) {
    return NextResponse.json({ error: "Invalid upload link" }, { status: 404 });
  }

  const [{ data: submitted }, { data: sportConfig }, { data: custom }] = await Promise.all([
    admin.from("athlete_documents")
      .select("id, document_type, file_name, uploaded_at")
      .eq("request_id", req.id)
      .order("uploaded_at", { ascending: false }),
    req.sport ? admin.from("sport_document_config")
      .select("disabled_base_docs, custom_docs")
      .eq("club_id", req.club_id)
      .eq("sport", req.sport)
      .single() : Promise.resolve({ data: null }),
    admin.from("custom_document_types")
      .select("id, label, required")
      .eq("club_id", req.club_id)
      .order("created_at"),
  ]);

  const documentTypes = sportConfig
    ? getSportDocTypes(sportConfig)
    : [
        ...BASE_DOCUMENT_TYPES,
        ...(custom ?? []).map(c => ({ key: `custom_${c.id}`, label: c.label, required: c.required })),
      ];

  return NextResponse.json({
    athleteName: req.athlete_name,
    clubName: req.clubs?.name,
    documentTypes,
    submitted: submitted ?? [],
  });
}
