export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import { formatCountry } from "@/lib/format-country";
import ResendButton from "../_components/ResendButton";
import ResendWhatsAppButton from "../_components/ResendWhatsAppButton";
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

export default async function AthleteDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (!["club_admin", "coach"].includes(profile?.role)) redirect("/login");

  const { data: r } = await admin
    .from("requests")
    .select("*")
    .eq("id", id)
    .eq("club_id", profile.club_id)
    .single();

  if (!r) notFound();

  const [{ data: athleteDocs }, { data: sportConfig }, { data: customDocTypes }] = await Promise.all([
    admin.from("athlete_documents").select("id, document_type, file_name, file_url, uploaded_at").eq("request_id", id).order("uploaded_at", { ascending: false }),
    r.sport ? admin.from("sport_document_config").select("disabled_base_docs, custom_docs").eq("club_id", profile.club_id).eq("sport", r.sport).single() : Promise.resolve({ data: null }),
    admin.from("custom_document_types").select("id, label, required").eq("club_id", profile.club_id).order("created_at"),
  ]);

  const allDocTypes = sportConfig
    ? getSportDocTypes(sportConfig)
    : [
        ...BASE_DOCUMENT_TYPES,
        ...(customDocTypes ?? []).map(c => ({ key: `custom_${c.id}`, label: c.label, required: c.required })),
      ];
  const submittedMap = Object.fromEntries((athleteDocs ?? []).map(d => [d.document_type, d]));

  function cleanFileName(docLabel, originalFileName) {
    const ext = originalFileName?.split(".").pop()?.toLowerCase() || "pdf";
    const safeName = (r.athlete_name || "Athlete").replace(/[^a-zA-Z0-9]/g, "_");
    const safeLabel = docLabel.replace(/[^a-zA-Z0-9]/g, "_");
    return `${safeName}_${safeLabel}.${ext}`;
  }

  const currentStep = STATUS_STEPS.indexOf(r.status);

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

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{r.athlete_name || "Unnamed student"}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={r.status} />
            {r.sport && <span className="text-sm text-muted">{r.sport}</span>}
            <span className="text-sm text-muted">
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
            {r.athlete_email && <ResendButton requestId={r.id} />}
            {r.athlete_phone && <ResendWhatsAppButton requestId={r.id} />}
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

        <div className="md:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-surface flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Documents</h2>
            <span className="text-xs text-muted">
              {Object.keys(submittedMap).length} / {allDocTypes.length} submitted
            </span>
          </div>
          <div className="divide-y divide-border">
            {allDocTypes.map(doc => {
              const sub = submittedMap[doc.key];
              return (
                <div key={doc.key} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${sub ? "border-brand-500 bg-brand-500" : "border-border bg-white"}`}>
                      {sub && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${sub ? "text-brand-700" : "text-foreground"}`}>{doc.label}</p>
                      {sub && <p className="text-xs text-muted truncate">{sub.file_name}</p>}
                    </div>
                  </div>
                  {sub ? (
                    <DownloadButton fileUrl={sub.file_url} fileName={cleanFileName(doc.label, sub.file_name)} />
                  ) : (
                    <span className="text-xs text-muted shrink-0">Pending</span>
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

        <div className="md:col-span-2">
          <AthleteActions
            requestId={r.id}
            athleteEmail={r.athlete_email}
            athleteName={r.athlete_name}
            reportToken={r.athlete_link_token}
            status={r.status}
          />
        </div>

      </div>
    </div>
  );
}

function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-white border border-border rounded-xl overflow-hidden ${className}`}>
      <div className="px-5 py-3 border-b border-border bg-surface">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  if (value === null || value === undefined || value === "" || value === false) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted shrink-0">{label}</span>
      <span className="text-xs text-foreground text-right">{String(value)}</span>
    </div>
  );
}

