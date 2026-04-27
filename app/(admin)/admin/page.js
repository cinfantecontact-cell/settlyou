export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import LeadsTable from "./_components/LeadsTable";

export const metadata = { title: "Admin — Settlyou" };

function KpiCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ?? "text-foreground"}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

const PIPELINE_STAGES = [
  { key: "pending",     label: "Pending",     color: "text-yellow-800 bg-yellow-100" },
  { key: "contacted",   label: "Contacted",   color: "text-blue-800 bg-blue-100" },
  { key: "deal_closed", label: "Deal closed", color: "text-brand-800 bg-brand-100" },
  { key: "rejected",    label: "Rejected",    color: "text-red-800 bg-red-100" },
];

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const admin = createAdminClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { data: contactRequests },
    { data: clubs },
    { data: requests },
    { data: billing },
  ] = await Promise.all([
    admin.from("contact_requests").select("*").order("created_at", { ascending: false }),
    admin.from("clubs").select("id, active, seats_used, seat_limit"),
    admin.from("requests").select("id, created_at, status"),
    admin.from("billing").select("amount_usd, status"),
  ]);

  const activeClients = (clubs ?? []).filter((c) => c.active).length;
  const guidesThisMonth = (requests ?? []).filter(
    (r) => r.created_at >= startOfMonth
  ).length;
  const paidRevenue = (billing ?? [])
    .filter((b) => b.status === "paid")
    .reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const leadsInPipeline = (contactRequests ?? []).filter(
    (r) => r.status === "pending" || r.status === "contacted"
  ).length;
  const closedLeads = (contactRequests ?? []).filter((r) => r.status === "deal_closed").length;
  const conversionRate =
    contactRequests?.length > 0
      ? Math.round((closedLeads / contactRequests.length) * 100)
      : 0;

  const stageCounts = {};
  for (const stage of PIPELINE_STAGES) {
    stageCounts[stage.key] = (contactRequests ?? []).filter(
      (r) => r.status === stage.key
    ).length;
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <KpiCard label="Active clients" value={activeClients} />
        <KpiCard
          label="Guides this month"
          value={guidesThisMonth}
          sub="relocation requests"
        />
        <KpiCard
          label="Paid revenue"
          value={`$${paidRevenue.toLocaleString()}`}
          accent="text-green-700"
        />
        <KpiCard
          label="Leads in pipeline"
          value={leadsInPipeline}
          sub="pending + contacted"
        />
        <KpiCard
          label="Lead → client"
          value={`${conversionRate}%`}
          sub="deal closed / total leads"
        />
      </div>

      {/* Pipeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted">{contactRequests?.length ?? 0} total leads</p>
        </div>

        {/* Stage counts */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {PIPELINE_STAGES.map((stage, i) => (
            <span key={stage.key} className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                <span className="font-bold">{stageCounts[stage.key]}</span>
                {stage.label}
              </span>
              {i < PIPELINE_STAGES.length - 2 && (
                <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {i === PIPELINE_STAGES.length - 2 && (
                <span className="text-muted text-xs mx-1">·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <LeadsTable contactRequests={contactRequests ?? []} />
    </div>
  );
}
