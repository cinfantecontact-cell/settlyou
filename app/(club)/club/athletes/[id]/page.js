export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import { formatCountry } from "@/lib/format-country";
import ResendButton from "../_components/ResendButton";
import AthleteActions from "./_components/AthleteActions";
import StatusBadge from "../../_components/StatusBadge";
import { BASE_DOCUMENT_TYPES, getSportDocTypes } from "@/lib/documents/types";
import DownloadButton from "./_components/DownloadButton";

const STATUS_STEPS = ["submitted", "generating", "under_review", "approved", "delivered"];
const STATUS_LABELS = {
  submitted: "Submitted",
  generating: "Generating",
  under_review: "Quality Check",
  approved: "Approved",
  delivered: "Delivered",
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-brand-100 text-brand-700",
  "bg-pink-100 text-pink-700",
];

const CARD_META = {
  "Student": {
    bg: "bg-brand-50", border: "border-brand-100", color: "text-brand-600",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  "Destination & Housing": {
    bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-600",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  "Family": {
    bg: "bg-pink-50", border: "border-pink-100", color: "text-pink-600",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  },
  "Lifestyle": {
    bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  "Schools, Cars & Healthcare": {
    bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-600",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  },
  "Additional Notes": {
    bg: "bg-gray-50", border: "border-gray-200", color: "text-gray-500",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  },
};

export default async function AthleteDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (!["club_admin", "coach", "admissions"].includes(profile?.role)) redirect("/login");

  const { data: r } = await admin
    .from("requests")
    .select("*")
    .eq("id", id)
    .eq("club_id", profile.club_id)
    .single();

  if (!r) notFound();

  const [{ data: athleteDocs }, { data: sportConfig }, { data: customDocTypes }, { data: admissionsConfig }, { data: formResponsesRaw }] = await Promise.all([
    admin.from("athlete_documents").select("id, document_type, file_name, file_url, uploaded_at").eq("request_id", id).order("uploaded_at", { ascending: false }),
    r.sport ? admin.from("sport_document_config").select("disabled_base_docs, custom_docs, form_questions").eq("club_id", profile.club_id).eq("sport", r.sport).single() : Promise.resolve({ data: null }),
    admin.from("custom_document_types").select("id, label, required").eq("club_id", profile.club_id).order("created_at"),
    admin.from("admissions_doc_config").select("active_base_docs, custom_docs, doc_settings, form_questions").eq("club_id", profile.club_id).single(),
    admin.from("athlete_form_responses").select("question_id, answer").eq("request_id", id),
  ]);

  const coachDocTypes = (sportConfig
    ? getSportDocTypes(sportConfig)
    : [
        ...BASE_DOCUMENT_TYPES,
        ...(customDocTypes ?? []).map(c => ({ key: `custom_${c.id}`, label: c.label, required: c.required })),
      ]).map(d => ({ ...d, source: "coach" }));

  const admissionsDocSettings = admissionsConfig?.doc_settings || {};
  const isDomestic = ["US", "UNITED STATES"].includes((r.athlete_nationality || "").trim().toUpperCase());
  const nationalityKnown = !!r.athlete_nationality;
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
  const admissionsBaseKeys = new Set(admissionsBaseDocs.map(d => d.key));
  const mergedCoachDocs = coachDocTypes.map(d =>
    admissionsBaseKeys.has(d.key) ? { ...d, source: "both" } : d
  );
  const coachKeys = new Set(mergedCoachDocs.map(d => d.key));
  const allDocTypes = [
    ...mergedCoachDocs,
    ...admissionsBaseDocs.filter(d => !coachKeys.has(d.key)),
    ...admissionsCustomDocs,
  ];

  // Merge form questions from coach + admissions, dedup by label
  const coachQuestions = (sportConfig?.form_questions ?? []).map(q => ({ ...q, source: "coach" }));
  const admissionsQuestions = (admissionsConfig?.form_questions ?? []).map(q => ({ ...q, source: "admissions" }));
  const coachQLabels = new Map(coachQuestions.map(q => [q.label, q]));
  const mergedFormQuestions = [...coachQuestions];
  for (const q of admissionsQuestions) {
    if (coachQLabels.has(q.label)) {
      const idx = mergedFormQuestions.findIndex(mq => mq.label === q.label);
      if (idx !== -1) mergedFormQuestions[idx] = { ...mergedFormQuestions[idx], source: "both" };
    } else {
      mergedFormQuestions.push(q);
    }
  }
  const formResponsesMap = Object.fromEntries((formResponsesRaw ?? []).map(r => [r.question_id, r.answer]));
  const submittedMap = Object.fromEntries((athleteDocs ?? []).map(d => [d.document_type, d]));
  const submittedCount = Object.keys(submittedMap).length;

  function cleanFileName(docLabel, originalFileName) {
    const ext = originalFileName?.split(".").pop()?.toLowerCase() || "pdf";
    const safeName = (r.athlete_name || "Athlete").replace(/[^a-zA-Z0-9]/g, "_");
    const safeLabel = docLabel.replace(/[^a-zA-Z0-9]/g, "_");
    return `${safeName}_${safeLabel}.${ext}`;
  }

  const currentStep = STATUS_STEPS.indexOf(r.status);
  const name = r.athlete_name || "Unnamed student";
  const initials = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  const avatarColor = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const docPct = allDocTypes.length > 0 ? Math.round((submittedCount / allDocTypes.length) * 100) : 0;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back */}
      <a
        href="/club/athletes"
        className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors mb-6"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        All students
      </a>

      {/* Profile header card */}
      <div className="bg-white border border-border rounded-xl p-6 flex items-center gap-5 mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${avatarColor}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground tracking-tight">{name}</h1>
          {r.athlete_email && <p className="text-sm text-muted mt-0.5">{r.athlete_email}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status={r.status} />
            {r.sport && (
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface border border-border text-muted">
                {r.sport}
              </span>
            )}
            <span className="text-xs text-muted">
              Submitted {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
        {r.status === "delivered" && r.athlete_link_token && (
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/report/${r.athlete_link_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
            >
              View guide
            </a>
            {r.athlete_email && profile.role !== "admissions" && <ResendButton requestId={r.id} />}
          </div>
        )}
      </div>

      {/* Status timeline */}
      <div className="bg-white border border-border rounded-xl px-6 py-5 mb-6">
        <div className="flex items-center">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            const last = i === STATUS_STEPS.length - 1;
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? "border-brand-500 bg-brand-500" :
                    done ? "border-brand-400 bg-brand-400" :
                    "border-border bg-white"
                  }`}>
                    {done && !active && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${active ? "text-brand-600 font-semibold" : done ? "text-brand-500" : "text-muted"}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
                {!last && (
                  <div className={`h-0.5 flex-1 mb-5 mx-1 ${i < currentStep ? "bg-brand-400" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Card title="Student">
          <Row label="Name" value={r.athlete_name} />
          <Row label="Email" value={r.athlete_email} />
          <Row label="Age" value={r.athlete_age} />
          <Row label="Nationality" value={r.athlete_nationality ? formatCountry(r.athlete_nationality) : null} />
          <Row label="Languages" value={r.athlete_languages?.join(", ")} />
          <Row label="From" value={[r.current_city, r.current_country ? formatCountry(r.current_country) : null].filter(Boolean).join(", ")} />
          <Row label="University" value={r.university_name} />
          <Row label="Visa" value={r.visa_type} />
          <Row label="On campus" value={r.living_on_campus ? "Yes" : null} />
          <Row label="International" value={r.is_international ? "Yes" : null} />
          <Row label="Club joining" value={r.club_joining} />
          <Row label="Contract" value={r.contract_duration} />
        </Card>

        <Card title="Destination & Housing">
          <Row label="City" value={r.destination_city || r.campus_city} />
          <Row label="Country" value={(r.destination_country || r.campus_country) ? formatCountry(r.destination_country || r.campus_country) : null} />
          <Row label="Move date" value={r.move_date ? new Date(r.move_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null} />
          <Row label="Semester start" value={r.semester_start ? new Date(r.semester_start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null} />
          <Row label="Budget" value={r.budget_usd ? `$${Number(r.budget_usd).toLocaleString()} / mo` : null} />
          <Row label="Housing type" value={r.housing_type} />
          <Row label="Bedrooms" value={r.min_bedrooms} />
          <Row label="Max commute" value={r.max_commute_minutes ? `${r.max_commute_minutes} min` : null} />
          <Row label="Must-haves" value={r.housing_must_haves?.join(", ")} />
        </Card>

        <Card title="Family">
          <Row label="Family size" value={r.family_size} />
          <Row label="Children ages" value={r.children_ages?.join(", ")} />
          <Row label="Partner" value={r.partner_name} />
          <Row label="Partner languages" value={r.partner_languages?.join(", ")} />
          <Row label="Partner profession" value={r.partner_profession} />
          <Row label="Pets" value={r.has_pets ? (r.pet_details || "Yes") : null} />
          <Row label="Medical needs" value={r.medical_needs} />
        </Card>

        <Card title="Lifestyle">
          <Row label="Training schedule" value={r.training_schedule} />
          <Row label="Diet" value={r.diet?.join(", ")} />
          <Row label="Fitness" value={r.fitness?.join(", ")} />
          <Row label="Hobbies" value={r.hobbies?.join(", ")} />
          <Row label="Religious needs" value={r.religious_needs} />
          <Row label="Language classes" value={r.interested_in_language_classes ? "Yes" : null} />
          <Row label="Community" value={r.community_preference} />
        </Card>

        <Card title="Schools, Cars & Healthcare">
          <Row label="Needs school" value={r.needs_school ? "Yes" : "No"} />
          {r.needs_school && <Row label="School type" value={r.school_type} />}
          {r.needs_school && <Row label="Curriculum" value={r.school_curriculum} />}
          <Row label="Needs car" value={r.needs_car ? "Yes" : "No"} />
          {r.needs_car && <Row label="Cars" value={r.num_cars} />}
          {r.needs_car && <Row label="Car type" value={r.car_type} />}
          {r.needs_car && <Row label="Buy or rent" value={r.car_buy_or_rent} />}
          {r.needs_car && <Row label="License from" value={r.license_country ? formatCountry(r.license_country) : null} />}
          <Row label="Private healthcare" value={r.needs_private_healthcare ? "Yes" : "No"} />
          <Row label="Specialists" value={r.medical_specialists} />
        </Card>

        {r.additional_notes && (
          <Card title="Additional Notes" className="md:col-span-2">
            <p className="text-sm text-muted leading-relaxed">{r.additional_notes}</p>
          </Card>
        )}

        {/* Documents */}
        <div className="md:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-foreground">Documents</h2>
              <p className="text-xs text-muted mt-0.5">{submittedCount} of {allDocTypes.length} submitted</p>
            </div>
            {allDocTypes.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${docPct === 100 ? "bg-brand-500" : docPct >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${docPct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-muted">{docPct}%</span>
              </div>
            )}
          </div>
          <div className="divide-y divide-border">
            {allDocTypes.map(doc => {
              const sub = submittedMap[doc.key];
              return (
                <div key={doc.key} className={`px-5 py-3.5 flex items-center justify-between gap-4 ${sub ? "bg-brand-50/30" : ""}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${sub ? "border-brand-500 bg-brand-500" : "border-border bg-white"}`}>
                      {sub && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-medium truncate ${sub ? "text-brand-700" : "text-foreground"}`}>{doc.label}</p>
                        {doc.source === "coach" && (
                          <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700">coach</span>
                        )}
                        {doc.source === "admissions" && (
                          <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-purple-100 bg-purple-50 text-purple-700">admissions</span>
                        )}
                        {doc.source === "both" && (
                          <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700">coach & admissions</span>
                        )}
                      </div>
                      {sub && <p className="text-xs text-muted truncate mt-0.5">{sub.file_name}</p>}
                    </div>
                  </div>
                  {sub ? (
                    <DownloadButton fileUrl={sub.file_url} fileName={cleanFileName(doc.label, sub.file_name)} />
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface border border-border text-muted shrink-0">Pending</span>
                  )}
                </div>
              );
            })}
          </div>
          {r.upload_token && (
            <div className="px-5 py-3 border-t border-border bg-surface">
              <p className="text-xs text-muted">
                Athlete upload link:{" "}
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/upload/${r.upload_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline"
                >
                  {`/upload/${r.upload_token}`}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Form Responses */}
        {mergedFormQuestions.length > 0 && (
          <div className="md:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Form Responses</h2>
                <p className="text-xs text-muted mt-0.5">{Object.keys(formResponsesMap).length} of {mergedFormQuestions.length} answered</p>
              </div>
            </div>
            {Object.keys(formResponsesMap).length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-muted italic">No responses yet. The athlete has not answered any questions.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {mergedFormQuestions.map(q => {
                  const answer = formResponsesMap[q.id];
                  return (
                    <div key={q.id} className="px-5 py-3.5 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <p className="text-sm text-foreground">{q.label}</p>
                        {q.source === "coach" && (
                          <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700">coach</span>
                        )}
                        {q.source === "admissions" && (
                          <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-purple-100 bg-purple-50 text-purple-700">admissions</span>
                        )}
                        {q.source === "both" && (
                          <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700">coach & admissions</span>
                        )}
                      </div>
                      <span className={`text-sm shrink-0 text-right ${answer ? "text-foreground font-medium" : "text-muted italic"}`}>
                        {answer || "No answer"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {profile.role !== "admissions" && (
          <div className="md:col-span-2">
            <AthleteActions
              requestId={r.id}
              athleteEmail={r.athlete_email}
              athleteName={r.athlete_name}
              reportToken={r.athlete_link_token}
              status={r.status}
            />
          </div>
        )}

      </div>
    </div>
  );
}

function Card({ title, children, className = "" }) {
  const meta = CARD_META[title] ?? { bg: "bg-gray-50", border: "border-gray-200", color: "text-gray-500", icon: null };
  return (
    <div className={`bg-white border border-border rounded-xl overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        {meta.icon && (
          <div className={`w-8 h-8 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center ${meta.color} shrink-0`}>
            {meta.icon}
          </div>
        )}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  if (value === null || value === undefined || value === "" || value === false) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted shrink-0 w-32">{label}</span>
      <span className="text-xs text-foreground text-right font-medium">{String(value)}</span>
    </div>
  );
}
