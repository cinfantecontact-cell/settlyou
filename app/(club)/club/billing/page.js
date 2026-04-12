export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

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

  const seatsUsed = club?.seats_used || 0;
  const seatLimit = club?.seat_limit;

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
            <h2 className="text-lg font-bold text-foreground">{billing?.plan || "Active Plan"}</h2>
            <p className="text-sm text-muted mt-0.5">{club?.name}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${billing?.status === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
            {billing?.status || "Active"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Reports Used</p>
            <p className="text-2xl font-bold text-foreground">{seatsUsed}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Reports Remaining</p>
            <p className="text-2xl font-bold text-foreground">
              {seatLimit ? Math.max(0, seatLimit - seatsUsed) : "∞"}
            </p>
          </div>
          {billing?.amount_usd && (
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Annual Amount</p>
              <p className="text-2xl font-bold text-foreground">${billing.amount_usd.toLocaleString()}</p>
            </div>
          )}
          {billing?.billing_date && (
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Renewal Date</p>
              <p className="text-2xl font-bold text-foreground">
                {new Date(new Date(billing.billing_date).setFullYear(new Date(billing.billing_date).getFullYear() + 1)).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {seatLimit && (
          <div className="mt-6">
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
      </div>

      <p className="text-sm text-muted text-center">
        Questions about your plan? <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a>
      </p>
    </div>
  );
}
