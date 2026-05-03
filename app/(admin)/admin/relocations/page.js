export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import RelocationsTable from "./_components/RelocationsTable";

export const metadata = { title: "Relocations — Settl Admin" };

export default async function AdminRelocationsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const [{ data: requests }, { data: docs }] = await Promise.all([
    admin.from("requests").select("*, organizations(name), clubs(name)").order("created_at", { ascending: false }),
    admin.from("documents").select("request_id, generated_at").order("generated_at", { ascending: false }),
  ]);

  const docMap = {};
  for (const d of (docs ?? [])) {
    if (!docMap[d.request_id]) docMap[d.request_id] = d.generated_at;
  }
  const enriched = (requests ?? []).map((r) => ({ ...r, doc_generated_at: docMap[r.id] ?? null }));

  const total      = enriched.length;
  const submitted  = enriched.filter((r) => r.status === "submitted").length;
  const generating = enriched.filter((r) => r.status === "generating").length;
  const review     = enriched.filter((r) => r.status === "under_review").length;
  const delivered  = enriched.filter((r) => r.status === "delivered").length;

  const kpis = [
    {
      label: "Total", value: total,
      accent: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: "Submitted", value: submitted,
      accent: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    },
    {
      label: "Generating", value: generating,
      accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    },
    {
      label: "Under review", value: review,
      accent: "text-purple-700", bg: "bg-purple-50", border: "border-purple-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    },
    {
      label: "Delivered", value: delivered,
      accent: "text-green-700", bg: "bg-green-50", border: "border-green-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Relocations</h1>
        <p className="text-sm text-muted mt-1">{total} total requests</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg ${k.bg} border ${k.border} flex items-center justify-center ${k.accent}`}>
              {k.icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${k.accent}`}>{k.value}</p>
              <p className="text-xs font-medium text-muted mt-0.5">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <RelocationsTable requests={enriched} />
    </div>
  );
}
