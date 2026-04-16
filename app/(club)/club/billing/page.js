export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

const ESSENTIALS_FEATURES = [
  "AI-generated relocation guides",
  "Delivered within 24 hours",
  "Available in 8 languages",
  "Custom branding (logo & colors)",
  "Athlete dashboard access",
  "Email guide delivery",
];

const PREMIUM_FEATURES = [
  "Custom coach notes in every guide",
  "Guide open tracking",
  "PDF download tracking",
  "Engagement analytics",
];

function CheckIcon({ locked }) {
  if (locked) {
    return (
      <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-brand-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default async function ClubBilling() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
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

  const isPremium = club?.plan === "premium";
  const seatsUsed = club?.seats_used || 0;
  const seatLimit = club?.seat_limit;
  const renewalDate = billing?.billing_date
    ? new Date(new Date(billing.billing_date).setFullYear(
        new Date(billing.billing_date).getFullYear() + 1
      )).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Plan & Billing</h1>
        <p className="text-sm text-muted mt-1">Your current plan details</p>
      </div>

      {/* Plan card */}
      <div className="bg-white border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">{isPremium ? "Premium" : "Essentials"}</h2>
            <p className="text-sm text-muted mt-0.5">{club?.name}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${billing?.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
            {billing?.status === "paid" ? "Active" : billing?.status || "Active"}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Reports Used</p>
            <p className="text-2xl font-bold text-foreground">{seatsUsed}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Reports Remaining</p>
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

        {/* Plan features */}
        <div className="border-t border-border pt-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">What's included</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ESSENTIALS_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <CheckIcon locked={false} />
                {f}
              </div>
            ))}
            {PREMIUM_FEATURES.map((f) => (
              <div key={f} className={`flex items-center gap-2 text-sm ${isPremium ? "text-foreground" : "text-muted"}`}>
                <CheckIcon locked={!isPremium} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade CTA — Essentials only */}
      {!isPremium && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">Upgrade to Premium</h3>
              <p className="text-sm text-muted leading-relaxed">
                Add custom coach notes to every guide, and see exactly when athletes open or download their guide — useful for tracking engagement after signing.
              </p>
            </div>
            <span className="text-sm font-bold text-brand-600 shrink-0 mt-0.5">+$1,000/yr</span>
          </div>
          <a
            href={`mailto:hello@settlyou.com?subject=Upgrade to Premium — ${club?.name || "our program"}`}
            className="inline-flex items-center gap-1.5 mt-4 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Contact us to upgrade
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      )}

      <p className="text-sm text-muted text-center">
        Questions about your plan?{" "}
        <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a>
      </p>
    </div>
  );
}
