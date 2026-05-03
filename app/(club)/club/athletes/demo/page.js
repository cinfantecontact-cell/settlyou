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
};

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
  const submittedCount = DEMO_UPLOADED_KEYS.filter(k => docTypes.some(d => d.key === k)).length;
  const docPct = docTypes.length > 0 ? Math.round((submittedCount / docTypes.length) * 100) : 0;
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

      {/* Profile header card */}
      <div className="bg-white border border-border rounded-xl p-6 flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 bg-orange-100 text-orange-700">
          CM
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground tracking-tight">Carlos Mendez</h1>
          <p className="text-sm text-muted mt-0.5">carlos.m@example.com</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status="delivered" />
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface border border-border text-muted">
              Men&apos;s Soccer
            </span>
            <span className="text-xs text-muted">Submitted Apr 22, 2026</span>
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
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-foreground">Documents</h2>
              <p className="text-xs text-muted mt-0.5">{submittedCount} of {docTypes.length} submitted</p>
            </div>
            {docTypes.length > 0 && (
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
            {docTypes.map(doc => {
              const isUploaded = DEMO_UPLOADED_KEYS.includes(doc.key);
              const sub = isUploaded ? { file_name: `carlos_${doc.key}.pdf` } : null;
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
                      <p className={`text-sm font-medium truncate ${sub ? "text-brand-700" : "text-foreground"}`}>{doc.label}</p>
                      {sub && <p className="text-xs text-muted truncate mt-0.5">{sub.file_name}</p>}
                    </div>
                  </div>
                  {sub ? (
                    <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted opacity-60 cursor-default select-none">
                      Sample file
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface border border-border text-muted shrink-0">Pending</span>
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
  const meta = CARD_META[title] ?? { bg: "bg-gray-50", border: "border-gray-200", color: "text-gray-500", icon: null };
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
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
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted shrink-0 w-32">{label}</span>
      <span className="text-xs text-foreground text-right font-medium">{value}</span>
    </div>
  );
}
