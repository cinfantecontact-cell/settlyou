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
    .select("id, athlete_name, club_id, sport, athlete_nationality, clubs(name)")
    .eq("upload_token", token)
    .single();

  if (!req) notFound();

  const [{ data: submitted }, { data: sportConfig }, { data: custom }, { data: allSportNotes }, { data: admissionsConfig }] = await Promise.all([
    admin.from("athlete_documents")
      .select("id, document_type, file_name, uploaded_at")
      .eq("request_id", req.id)
      .order("uploaded_at", { ascending: false }),
    req.sport ? admin.from("sport_document_config")
      .select("disabled_base_docs, custom_docs, doc_settings, form_questions")
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
    admin.from("admissions_doc_config")
      .select("active_base_docs, custom_docs, doc_settings, form_questions, attachments")
      .eq("club_id", req.club_id)
      .single(),
  ]);

  // Normalize sport match for attachments
  const normSport = s => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const isDomestic = ["US", "UNITED STATES"].includes((req.athlete_nationality || "").trim().toUpperCase());
  const nationalityKnown = !!req.athlete_nationality;
  const coachAttachments = (allSportNotes ?? [])
    .filter(n => normSport(n.sport) === normSport(req.sport))
    .flatMap(n => n.coach_attachments?.filter(a => a.url) ?? [])
    .filter(a => {
      if (!nationalityKnown || !a.visibility || a.visibility === "all") return true;
      if (a.visibility === "international") return !isDomestic;
      if (a.visibility === "domestic") return isDomestic;
      return true;
    });

  // Coach docs (sport-specific config or base + club custom types)
  const coachDocs = (sportConfig
    ? getSportDocTypes(sportConfig, req.athlete_nationality ?? null)
    : BASE_DOCUMENT_TYPES.map(d => ({ ...d }))
  ).map(d => ({ ...d, source: "coach" }));

  // Admissions docs (if config exists) — filtered by nationality
  const admissionsDocSettings = admissionsConfig?.doc_settings || {};
  function admissionsVisibilityMatches(visibility) {
    if (!nationalityKnown || !visibility || visibility === "all") return true;
    if (visibility === "international") return !isDomestic;
    if (visibility === "domestic") return isDomestic;
    return true;
  }
  const admissionsBaseDocs = admissionsConfig
    ? BASE_DOCUMENT_TYPES
        .filter(d => (admissionsConfig.active_base_docs || []).includes(d.key))
        .map(d => {
          const vis = (admissionsDocSettings[d.key] || {}).visibility || "all";
          return { ...d, visibility: vis, source: "admissions" };
        })
        .filter(d => admissionsVisibilityMatches(d.visibility))
    : [];
  const admissionsCustomDocs = (admissionsConfig?.custom_docs || [])
    .filter(d => admissionsVisibilityMatches(d.visibility || "all"))
    .map(d => ({
      key: `admissions_custom_${d.id}`,
      label: d.label,
      required: true,
      source: "admissions",
      visibility: d.visibility || "all",
    }));

  // Merge: union base docs by key, upgrading source to "both" when required by coach AND admissions
  const admissionsKeys = new Set(admissionsBaseDocs.map(d => d.key));
  const mergedCoachDocs = coachDocs.map(d =>
    admissionsKeys.has(d.key) ? { ...d, source: "both" } : d
  );
  const coachKeys = new Set(mergedCoachDocs.map(d => d.key));
  const extraFromAdmissions = admissionsBaseDocs.filter(d => !coachKeys.has(d.key));
  const documentTypes = [...mergedCoachDocs, ...extraFromAdmissions, ...admissionsCustomDocs];

  // Form questions: merge coach + admissions, dedup by label
  const coachQuestions = (sportConfig?.form_questions ?? []).map(q => ({ ...q, source: "coach" }));
  const admissionsQuestions = (admissionsConfig?.form_questions ?? []).map(q => ({ ...q, source: "admissions" }));
  const coachQLabels = new Map(coachQuestions.map(q => [q.label, q]));
  const mergedQuestions = [...coachQuestions];
  for (const q of admissionsQuestions) {
    if (coachQLabels.has(q.label)) {
      const idx = mergedQuestions.findIndex(mq => mq.label === q.label);
      if (idx !== -1) mergedQuestions[idx] = { ...mergedQuestions[idx], source: "both" };
    } else {
      mergedQuestions.push(q);
    }
  }
  const formQuestions = mergedQuestions;

  // Merge coach attachments with admissions attachments
  const admissionsAttachments = (admissionsConfig?.attachments ?? [])
    .filter(a => a.url)
    .filter(a => {
      if (!nationalityKnown || !a.visibility || a.visibility === "all") return true;
      if (a.visibility === "international") return !isDomestic;
      if (a.visibility === "domestic") return isDomestic;
      return true;
    })
    .map(a => ({ ...a, source: "admissions" }));
  const allAttachments = [
    ...coachAttachments.map(a => ({ ...a, source: "coach" })),
    ...admissionsAttachments,
  ];

  const { data: formResponsesRaw } = formQuestions.length
    ? await admin.from("athlete_form_responses")
        .select("question_id, answer")
        .eq("request_id", req.id)
    : { data: [] };
  const initialResponses = formResponsesRaw ?? [];

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
          coachAttachments={allAttachments}
          formQuestions={formQuestions}
          initialResponses={initialResponses}
        />
      </div>
    </div>
  );
}
