export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import ClientsTable from "./_components/ClientsTable";

export const metadata = { title: "Clients — Settlyou Admin" };

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const [{ data: clubs }, { data: organizations }, { data: coaches }, { data: baseDataRows }] = await Promise.all([
    admin.from("clubs").select("*").order("created_at", { ascending: false }),
    admin.from("organizations").select("*").order("created_at", { ascending: false }),
    admin.from("profiles").select("club_id").eq("role", "coach"),
    admin.from("city_base_data").select("club_id, status").eq("language", "en"),
  ]);

  const coachCountByClub = (coaches ?? []).reduce((acc, c) => {
    if (c.club_id) acc[c.club_id] = (acc[c.club_id] ?? 0) + 1;
    return acc;
  }, {});

  const baseStatusByClub = (baseDataRows ?? []).reduce((acc, r) => {
    acc[r.club_id] = r.status;
    return acc;
  }, {});

  const clubList = clubs ?? [];
  const total = clubList.length + (organizations?.length ?? 0);
  const active = clubList.filter((c) => c.active).length;
  const inactive = clubList.filter((c) => !c.active).length;
  const nearLimit = clubList.filter((c) => c.seat_limit && (c.seats_used ?? 0) >= c.seat_limit * 0.9).length;
  const totalCoaches = Object.values(coachCountByClub).reduce((a, b) => a + b, 0);

  const kpis = [
    {
      label: "Total", value: total,
      accent: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    },
    {
      label: "Active", value: active,
      accent: "text-green-700", bg: "bg-green-50", border: "border-green-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Inactive", value: inactive,
      accent: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Near limit", value: nearLimit,
      accent: "text-red-600", bg: "bg-red-50", border: "border-red-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    },
    {
      label: "Coaches", value: totalCoaches,
      accent: "text-purple-700", bg: "bg-purple-50", border: "border-purple-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Clients</h1>
          <p className="text-sm text-muted mt-1">{total} colleges</p>
        </div>
        <a
          href="/admin/clubs/new"
          className="text-sm font-medium px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
        >
          + Add college
        </a>
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

      <ClientsTable clubs={clubList} organizations={organizations ?? []} baseUrl={baseUrl} coachCountByClub={coachCountByClub} baseStatusByClub={baseStatusByClub} />
    </div>
  );
}
