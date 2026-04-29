export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import UploadClient from "./_components/UploadClient";
import { BASE_DOCUMENT_TYPES, getSportDocTypes } from "@/lib/documents/types";

export default async function UploadPage({ params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: req } = await admin
    .from("requests")
    .select("id, athlete_name, club_id, sport, clubs(name)")
    .eq("upload_token", token)
    .single();

  if (!req) notFound();

  const [{ data: submitted }, { data: sportConfig }, { data: custom }, { data: allSportNotes }] = await Promise.all([
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
    admin.from("coach_sport_notes")
      .select("sport, coach_attachments")
      .eq("club_id", req.club_id),
  ]);

  // Normalize sport match for attachments
  const normSport = s => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const coachAttachments = (allSportNotes ?? [])
    .filter(n => normSport(n.sport) === normSport(req.sport))
    .flatMap(n => n.coach_attachments?.filter(a => a.url) ?? []);

  // Use sport-specific config if available, otherwise fall back to base + club custom types
  const documentTypes = sportConfig
    ? getSportDocTypes(sportConfig)
    : [
        ...BASE_DOCUMENT_TYPES,
        ...(custom ?? []).map(c => ({ key: `custom_${c.id}`, label: c.label, required: true })),
      ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7 mb-8" />
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Hi {req.athlete_name?.split(" ")[0]},
          </h1>
          <p className="text-sm text-muted">
            Upload your documents for <strong>{req.clubs?.name}</strong> below. You can come back to this page anytime to add more.
          </p>
        </div>

        <UploadClient
          token={token}
          documentTypes={documentTypes}
          initialSubmitted={submitted ?? []}
          coachAttachments={coachAttachments}
        />
      </div>
    </div>
  );
}
