export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

const ALL_FEATURES = [
  "AI-generated relocation guide for each student",
  "Delivered within 24 hours",
  "Available in 18 languages",
  "Student upload portal & document collection",
  "Coach portal with per-sport access",
  "Custom branding — logo & colors on every guide",
  "Custom coach notes woven into every guide",
  "Email, WhatsApp & SMS delivery",
  "Guide open & download tracking",
  "Engagement analytics",
  "Weekly intake digest email",
  "Bulk resend & CSV export",
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const TIERS = [
  { label: "Micro",       range: "Up to 40 students / yr",  price: "$2,400 / yr" },
  { label: "Starter",     range: "Up to 100 students / yr", price: "$4,900 / yr" },
  { label: "Pro",         range: "Up to 200 students / yr", price: "$9,900 / yr" },
  { label: "Institution", range: "200+ students / yr",      price: "Custom" },
];

export default async function ClubBilling() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role === "coach") redirect("/club");
  if (profile?.role !== "club_admin") redirect("/login");

  const { data: club } = await admin
    .from("clubs").select("*").eq("id", profile.club_id).single();

  const { data: billing } = await admin
    .from("billing")
    .select("*")
    .eq("club_id", profile.club_id)
    .eq("record_type", "revenue")
    .order("billing_date", { ascending: false })
    .limit(1)
    .single();

  const seatsUsed = club?.seats_used || 0;
  const seatLimit = club?.seat_limit ?? 40;
  const renewalDate = billing?.billing_date
    ? new Date(new Date(billing.billing_date).setFullYear(
        new Date(billing.billing_date).getFullYear() + 1
      )).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Plan & Usage</h1>
        <p className="text-sm text-muted mt-1">Your current plan details</p>
      </div>

      {/* Plan card */}
      <div id="tour-billing-card" className="bg-white border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">{club?.name}</h2>
            <p className="text-sm text-muted mt-0.5">Annual plan · use-it-or-lose-it</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${billing?.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
            {billing?.status === "paid" ? "Active" : billing?.status || "Active"}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Students Used</p>
            <p className="text-2xl font-bold text-foreground">{seatsUsed}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Students Remaining</p>
            <p className="text-2xl font-bold text-foreground">
              {seatLimit ? Math.max(0, seatLimit - seatsUsed) : "Unlimited"}
            </p>
          </div>
          {billing?.amount_usd && (
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Annual Amount</p>
              <p className="text-2xl font-bold text-foreground">${billing.amount_usd.toLocaleString()}</p>
            </div>
          )}
          {renewalDate && (
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Renews</p>
              <p className="text-base font-bold text-foreground leading-tight">{renewalDate}</p>
            </div>
          )}
        </div>

        {/* Usage bar */}
        {seatLimit && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Usage</span>
              <span>{seatsUsed} / {seatLimit}</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all"
                style={{ width: `${Math.min(100, (seatsUsed / seatLimit) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* What's included */}
        <div className="border-t border-border pt-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Everything included</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ALL_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <CheckIcon />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-bold text-foreground mb-1">Need more students?</h3>
        <p className="text-sm text-muted leading-relaxed mb-5">
          Running out of capacity or bringing in a larger intake? We'll add seats or move you to the right tier — no disruption to your current setup.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {TIERS.map((t) => (
            <div key={t.label} className="bg-white border border-brand-100 rounded-lg px-4 py-3">
              <p className="text-xs font-bold text-brand-600 mb-1">{t.label}</p>
              <p className="text-xs text-muted">{t.range}</p>
              <p className="text-sm font-bold text-foreground mt-1">{t.price}</p>
            </div>
          ))}
        </div>
        <a
          href={`mailto:hello@settlyou.com?subject=${encodeURIComponent(`Plan upgrade — ${club?.name || "our program"}`)}&body=${encodeURIComponent(`Hi Settlyou team,\n\nWe'd like to discuss upgrading our plan.\n\nProgram: ${club?.name || ""}\n\nPlease get in touch to discuss next steps.\n\nThanks!`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
        >
          Contact us to upgrade
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>

      <p className="text-sm text-muted text-center">
        Questions about your plan?{" "}
        <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a>
      </p>
    </div>
  );
}
