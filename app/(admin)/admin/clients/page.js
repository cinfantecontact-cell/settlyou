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

  const total = (clubs?.length ?? 0) + (organizations?.length ?? 0);

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted mt-1">{total} colleges</p>
        </div>
        <a
          href="/admin/clubs/new"
          className="text-sm font-medium px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
        >
          + Add college
        </a>
      </div>

      <ClientsTable clubs={clubs ?? []} organizations={organizations ?? []} baseUrl={baseUrl} coachCountByClub={coachCountByClub} baseStatusByClub={baseStatusByClub} />
    </div>
  );
}
