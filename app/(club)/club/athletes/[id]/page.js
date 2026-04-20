export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import { formatCountry } from "@/lib/format-country";
import ResendButton from "../_components/ResendButton";

const STATUS_STEPS = ["submitted", "generating", "under_review", "approved", "delivered"];
const STATUS_LABELS = {
  submitted: "Submitted",
  generating: "Generating",
  under_review: "Under Review",
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
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") redirect("/login");

  const { data: club } = await admin
    .from("clubs").select("plan").eq("id", profile.club_id).single();
  const isPremium = club?.plan === "premium";

  const { data: r } = await admin
    .from("requests")
    .select("*")
    .eq("id", id)
    .eq("club_id", profile.club_id)
    .single();

  if (!r) notFound();

  // Premium: fetch guide activity events
  let openEvents = [];
  let printCount = 0;
  if (isPremium) {
    const { data: events } = await admin
      .from("events")
      .select("id, event_type, created_at, metadata")
      .eq("request_id", id)
      .in("event_type", ["guide_opened", "pdf_printed"])
      .order("created_at", { ascending: false });

    openEvents = (events ?? []).filter((e) => e.event_type === "guide_opened");
    printCount = (events ?? []).filter((e) => e.event_type === "pdf_printed").length;
  }

  const currentStep = STATUS_STEPS.indexOf(r.status);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back */}
      <a href="/club/athletes" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        All athletes
      </a>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{r.athlete_name || "Unnamed athlete"}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={r.status} />
            {r.sport && <span className="text-sm text-muted">{r.sport}</span>}
            <span className="text-sm text-muted">
              Submitted {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            {isPremium && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700">
                Premium
              </span>
            )}
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

      {/* Premium: Guide Activity */}
      {isPremium && r.status === "delivered" && (
        <div className="mb-6 bg-gradient-to-br from-brand-50 to-white border border-brand-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-brand-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h2 className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Guide Activity</h2>
            </div>
            <span className="text-xs text-brand-600 font-medium bg-white border border-brand-200 px-2 py-0.5 rounded-full">Premium</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-brand-100 border-b border-brand-100">
            <div className="px-5 py-4 text-center">
              <p className="text-2xl font-bold text-brand-700">{openEvents.length}</p>
              <p className="text-xs text-muted mt-0.5">Total opens</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-2xl font-bold text-brand-700">{printCount}</p>
              <p className="text-xs text-muted mt-0.5">PDF downloads</p>
            </div>
            <div className="px-5 py-4 text-center">
              {openEvents.length > 0 ? (
                <>
                  <p className="text-sm font-semibold text-brand-700">
                    {new Date(openEvents[0].created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted mt-0.5">Last opened</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-muted">—</p>
                  <p className="text-xs text-muted mt-0.5">Last opened</p>
                </>
              )}
            </div>
          </div>

          {/* Open timeline */}
          {openEvents.length === 0 ? (
            <div className="px-5 py-6 text-center text-sm text-muted">
              Guide hasn't been opened yet.
            </div>
          ) : (
            <ul className="divide-y divide-brand-100">
              {openEvents.map((e, i) => {
                const isFirst = i === openEvents.length - 1;
                const referrer = e.metadata?.referrer;
                return (
                  <li key={e.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isFirst ? "bg-brand-100" : "bg-surface"}`}>
                        <svg className={`w-3 h-3 ${isFirst ? "text-brand-600" : "text-muted"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Guide opened {isFirst && <span className="text-brand-600 ml-1">· First open</span>}
                        </p>
                        {referrer && (
                          <p className="text-xs text-muted mt-0.5 truncate max-w-xs">via {referrer}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted shrink-0">
                      {new Date(e.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Premium upsell for Essentials clubs with delivered guide */}
      {!isPremium && r.status === "delivered" && (
        <div className="mb-6 bg-surface border border-border rounded-xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm text-muted">
              <span className="font-medium text-foreground">Guide activity tracking</span> — see when the athlete opens their guide and how many times.
            </p>
          </div>
          <a
            href="mailto:hello@settlyou.com?subject=Upgrade to Premium"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap ml-4 shrink-0"
          >
            Upgrade →
          </a>
        </div>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Card title="Athlete">
          <Row label="Name" value={r.athlete_name} />
          <Row label="Email" value={r.athlete_email} />
          <Row label="Age" value={r.athlete_age} />
          <Row label="Nationality" value={r.athlete_nationality ? formatCountry(r.athlete_nationality) : null} />
          <Row label="Languages" value={r.athlete_languages?.join(", ")} />
          <Row label="From" value={[r.current_city, r.current_country ? formatCountry(r.current_country) : null].filter(Boolean).join(", ")} />
          <Row label="Club joining" value={r.club_joining} />
          <Row label="Contract" value={r.contract_duration} />
        </Card>

        <Card title="Destination & Housing">
          <Row label="City" value={r.destination_city} />
          <Row label="Country" value={r.destination_country ? formatCountry(r.destination_country) : null} />
          <Row label="Move date" value={r.move_date ? new Date(r.move_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null} />
          <Row label="Budget" value={r.budget_usd ? `$${Number(r.budget_usd).toLocaleString()} / mo` : null} />
          <Row label="Housing type" value={r.housing_type} />
          <Row label="Bedrooms" value={r.min_bedrooms} />
          <Row label="Neighborhood" value={r.neighborhood_type} />
          <Row label="Max commute" value={r.max_commute_minutes ? `${r.max_commute_minutes} min` : null} />
          <Row label="Must-haves" value={r.housing_must_haves?.join(", ")} />
        </Card>

        <Card title="Family">
          <Row label="Family size" value={r.family_size} />
          <Row label="Children ages" value={r.children_ages?.join(", ")} />
          <Row label="Partner" value={r.partner_name} />
          <Row label="Partner languages" value={r.partner_languages?.join(", ")} />
          <Row label="Partner profession" value={r.partner_profession} />
          <Row label="Pets" value={r.has_pets ? (r.pet_details || "Yes") : "No"} />
          <Row label="Medical needs" value={r.medical_needs} />
        </Card>

        <Card title="Lifestyle">
          <Row label="Diet" value={r.diet?.join(", ")} />
          <Row label="Fitness" value={r.fitness?.join(", ")} />
          <Row label="Hobbies" value={r.hobbies?.join(", ")} />
          <Row label="Social" value={r.social_preference} />
          <Row label="Nightlife" value={r.nightlife_interest} />
          <Row label="Religious needs" value={r.religious_needs} />
          <Row label="Language classes" value={r.interested_in_language_classes ? "Yes" : "No"} />
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

function StatusBadge({ status }) {
  const map = {
    submitted: "bg-blue-50 text-blue-700",
    generating: "bg-yellow-50 text-yellow-700",
    under_review: "bg-orange-50 text-orange-700",
    approved: "bg-green-50 text-green-700",
    delivered: "bg-brand-50 text-brand-700",
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${map[status] || "bg-surface text-muted"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
