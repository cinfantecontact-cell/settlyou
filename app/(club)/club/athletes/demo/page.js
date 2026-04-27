export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import StatusBadge from "../../_components/StatusBadge";
import { getSportDocTypes, BASE_DOCUMENT_TYPES } from "@/lib/documents/types";

const STATUS_STEPS = ["submitted", "generating", "under_review", "approved", "delivered"];
const STATUS_LABELS = {
  submitted: "Submitted",
  generating: "Generating",
  under_review: "Quality Check",
  approved: "Approved",
  delivered: "Delivered",
};

const DEMO_UPLOADED_KEYS = ["passport", "transcript"];

export default async function DemoAthletePage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (!["club_admin", "coach"].includes(profile?.role)) redirect("/login");

  const { data: sportConfig } = profile.sport ? await admin
    .from("sport_document_config")
    .select("disabled_base_docs, custom_docs")
    .eq("club_id", profile.club_id)
    .eq("sport", profile.sport)
    .single() : { data: null };

  const docTypes = getSportDocTypes(sportConfig ?? null);

  const currentStep = STATUS_STEPS.indexOf("delivered");

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

      {/* Example banner */}
      <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl border border-brand-200 bg-brand-50 text-sm text-brand-700">
        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        <span>This is a sample student for demonstration purposes. Real students will look exactly like this once they submit the form and upload their documents.</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carlos Mendez</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status="delivered" />
            <span className="text-sm text-muted">Men&apos;s Soccer</span>
            <span className="text-sm text-muted">Submitted Apr 22, 2026</span>
          </div>
        </div>
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
          <Row label="Name" value="Carlos Mendez" />
          <Row label="Email" value="carlos.m@example.com" />
          <Row label="Age" value="21" />
          <Row label="Nationality" value="Mexico" />
          <Row label="Languages" value="Spanish, English" />
          <Row label="From" value="Monterrey, Mexico" />
          <Row label="Visa" value="F-1 Student Visa" />
          <Row label="International" value="Yes" />
        </Card>

        <Card title="Destination & Housing">
          <Row label="City" value="Lansing, MI" />
          <Row label="Country" value="United States" />
          <Row label="Move date" value="Aug 10, 2026" />
          <Row label="Semester start" value="Aug 25, 2026" />
          <Row label="Budget" value="$900 / mo" />
          <Row label="Housing type" value="Apartment" />
          <Row label="Bedrooms" value="1" />
          <Row label="Max commute" value="20 min" />
          <Row label="Must-haves" value="Gym access, pet-friendly" />
        </Card>

        <Card title="Family">
          <Row label="Family size" value="1" />
          <Row label="Pets" value="Yes — small dog" />
        </Card>

        <Card title="Lifestyle">
          <Row label="Training schedule" value="Morning practice 6–8am, afternoon gym 4–5:30pm" />
          <Row label="Diet" value="High protein, no pork" />
          <Row label="Hobbies" value="Music, hiking, video games" />
          <Row label="Community" value="Latin American community preferred" />
          <Row label="Language classes" value="Yes" />
        </Card>

        <Card title="Schools, Cars & Healthcare">
          <Row label="Needs school" value="No" />
          <Row label="Needs car" value="Yes" />
          <Row label="Cars" value="1" />
          <Row label="Car type" value="Compact or sedan" />
          <Row label="Buy or rent" value="Rent" />
          <Row label="License from" value="Mexico" />
          <Row label="Private healthcare" value="No" />
        </Card>

        {/* Documents */}
        <div className="md:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-surface flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Documents</h2>
            <span className="text-xs text-muted">{DEMO_UPLOADED_KEYS.filter(k => docTypes.some(d => d.key === k)).length} / {docTypes.length} submitted</span>
          </div>
          <div className="divide-y divide-border">
            {docTypes.map(doc => {
              const isUploaded = DEMO_UPLOADED_KEYS.includes(doc.key);
              const sub = isUploaded ? { file_name: `carlos_${doc.key}.pdf` } : null;
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
                    <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted opacity-60 cursor-default select-none">
                      Sample file
                    </span>
                  ) : (
                    <span className="text-xs text-muted shrink-0">Pending</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-surface">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted shrink-0">{label}</span>
      <span className="text-xs text-foreground text-right">{value}</span>
    </div>
  );
}
