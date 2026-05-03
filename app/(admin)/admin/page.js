export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import LeadsTable from "./_components/LeadsTable";

export const metadata = { title: "Admin — Settlyou" };

const PIPELINE_STAGES = [
  { key: "pending",     label: "Pending",     color: "bg-yellow-100 text-yellow-800 border-yellow-200",  bar: "bg-yellow-400",  dot: "bg-yellow-400" },
  { key: "contacted",   label: "Contacted",   color: "bg-blue-100 text-blue-800 border-blue-200",        bar: "bg-blue-500",    dot: "bg-blue-500" },
  { key: "deal_closed", label: "Deal closed", color: "bg-brand-100 text-brand-800 border-brand-200",     bar: "bg-brand-500",   dot: "bg-brand-500" },
  { key: "rejected",    label: "Rejected",    color: "bg-red-100 text-red-800 border-red-200",           bar: "bg-red-400",     dot: "bg-red-400" },
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
  const guidesThisMonth = (requests ?? []).filter((r) => r.created_at >= startOfMonth).length;
  const paidRevenue = (billing ?? [])
    .filter((b) => b.status === "paid")
    .reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const leadsInPipeline = (contactRequests ?? []).filter(
    (r) => r.status === "pending" || r.status === "contacted"
  ).length;
  const closedLeads = (contactRequests ?? []).filter((r) => r.status === "deal_closed").length;
  const total = contactRequests?.length ?? 0;
  const conversionRate = total > 0 ? Math.round((closedLeads / total) * 100) : 0;

  const stageCounts = {};
  for (const stage of PIPELINE_STAGES) {
    stageCounts[stage.key] = (contactRequests ?? []).filter((r) => r.status === stage.key).length;
  }

  const kpis = [
    {
      label: "Active clients",
      value: activeClients,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      accent: "text-brand-600",
      bg: "bg-brand-50",
      border: "border-brand-100",
    },
    {
      label: "Guides this month",
      value: guidesThisMonth,
      sub: "relocation requests",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      accent: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Paid revenue",
      value: `$${paidRevenue.toLocaleString()}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      label: "Leads in pipeline",
      value: leadsInPipeline,
      sub: "pending + contacted",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
      ),
      accent: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
    },
    {
      label: "Conversion rate",
      value: `${conversionRate}%`,
      sub: "closed / total leads",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      accent: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
  ];

  return (
    <div className="p-8 max-w-6xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Lead Pipeline</h1>
        <p className="text-sm text-muted mt-1">{total} total leads · {closedLeads} converted to clients</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg ${k.bg} border ${k.border} flex items-center justify-center ${k.accent}`}>
              {k.icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${k.accent}`}>{k.value}</p>
              <p className="text-xs font-medium text-muted mt-0.5">{k.label}</p>
              {k.sub && <p className="text-[11px] text-muted/70 mt-0.5">{k.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Visual */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-foreground">Pipeline stages</h2>
          <span className="text-xs text-muted">{total} total</span>
        </div>
        <div className="flex flex-col gap-3">
          {PIPELINE_STAGES.map((stage) => {
            const count = stageCounts[stage.key] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={stage.key} className="flex items-center gap-4">
                <div className="w-24 shrink-0 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${stage.dot}`} />
                  <span className="text-xs font-medium text-foreground">{stage.label}</span>
                </div>
                <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${stage.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-16 shrink-0 flex items-center justify-end gap-1.5">
                  <span className="text-sm font-bold text-foreground">{count}</span>
                  <span className="text-xs text-muted">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini funnel dots */}
        <div className="flex items-center gap-1 mt-5 pt-5 border-t border-border">
          {PIPELINE_STAGES.map((stage, i) => {
            const count = stageCounts[stage.key] ?? 0;
            return (
              <div key={stage.key} className="flex items-center gap-1 flex-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${stage.color}`}>
                  <span className="font-bold">{count}</span> {stage.label}
                </span>
                {i < PIPELINE_STAGES.length - 1 && (
                  <svg className="w-3 h-3 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leads table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-foreground">All leads</h2>
      </div>
      <LeadsTable contactRequests={contactRequests ?? []} />
    </div>
  );
}
