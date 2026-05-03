export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

const ALL_FEATURES = [
  "AI-generated relocation guide for each athlete",
  "Delivered within 24 hours",
  "Available in 18 languages",
  "Athlete upload portal & document collection",
  "Coach portal with per-sport access",
  "Custom branding — logo & colors on every guide",
  "Custom coach notes woven into every guide",
  "Email, WhatsApp & SMS delivery",
  "Guide open & download tracking",
  "Engagement analytics dashboard",
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
  { label: "Squad",      range: "Up to 10 athletes",  price: "Contact us" },
  { label: "Roster",     range: "Up to 25 athletes",  price: "Contact us" },
  { label: "Program",    range: "Up to 50 athletes",  price: "Contact us" },
  { label: "Department", range: "Unlimited athletes", price: "Custom"     },
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
  const usagePct = seatLimit ? Math.min(100, Math.round((seatsUsed / seatLimit) * 100)) : 0;
  const renewalDate = billing?.billing_date
    ? new Date(new Date(billing.billing_date).setFullYear(
        new Date(billing.billing_date).getFullYear() + 1
      )).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const kpis = [
    {
      label: "Athletes used",
      value: seatsUsed,
      accent: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: "Athletes remaining",
      value: seatLimit ? Math.max(0, seatLimit - seatsUsed) : "∞",
      accent: "text-green-700", bg: "bg-green-50", border: "border-green-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Annual amount",
      value: billing?.amount_usd ? `$${billing.amount_usd.toLocaleString()}` : "—",
      accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Renews",
      value: renewalDate ?? "—",
      small: true,
      accent: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Plan & Usage</h1>
          <p className="text-sm text-muted mt-1">{club?.name} · Annual subscription</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${billing?.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
          {billing?.status === "paid" ? "Active" : billing?.status || "Active"}
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg ${k.bg} border ${k.border} flex items-center justify-center ${k.accent}`}>
              {k.icon}
            </div>
            <div>
              <p className={`${k.small ? "text-base leading-tight" : "text-2xl"} font-bold ${k.accent}`}>{k.value}</p>
              <p className="text-xs font-medium text-muted mt-0.5">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Usage bar */}
      {seatLimit && (
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Athlete usage</p>
            <p className="text-sm font-bold text-foreground">{seatsUsed} / {seatLimit}</p>
          </div>
          <div className="h-2.5 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usagePct >= 90 ? "bg-red-500" : usagePct >= 70 ? "bg-yellow-500" : "bg-brand-600"}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-2">{usagePct}% of your annual athlete limit used</p>
        </div>
      )}

      {/* What's included */}
      <div className="bg-white rounded-xl border border-border p-6">
        <p className="text-sm font-semibold text-foreground mb-4">Everything included in your plan</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ALL_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-foreground">
              <CheckIcon />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="mb-5">
          <p className="text-sm font-semibold text-foreground mb-1">Need more athletes?</p>
          <p className="text-sm text-muted leading-relaxed">
            Running out of capacity or bringing in a larger intake? We'll move you to the right tier with no disruption to your current setup.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {TIERS.map((t) => (
            <div key={t.label} className="bg-surface border border-border rounded-lg px-4 py-3">
              <p className="text-xs font-bold text-brand-600 mb-1">{t.label}</p>
              <p className="text-xs text-muted">{t.range}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{t.price}</p>
            </div>
          ))}
        </div>
        <a
          href={`mailto:hello@settlyou.com?subject=${encodeURIComponent(`Plan upgrade — ${club?.name || "our program"}`)}&body=${encodeURIComponent(`Hi Settlyou team,\n\nWe'd like to discuss upgrading our plan.\n\nProgram: ${club?.name || ""}\n\nPlease get in touch to discuss next steps.\n\nThanks!`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-brand-600 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 hover:border-brand-700 transition-colors"
        >
          Contact us to upgrade
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>

      <p className="text-xs text-muted text-center">
        Questions about your plan?{" "}
        <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a>
      </p>
    </div>
  );
}
