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
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const [{ data: requests }, { data: docs }] = await Promise.all([
    admin.from("requests").select("*, organizations(name), clubs(name)").order("created_at", { ascending: false }),
    admin.from("documents").select("request_id, generated_at").order("generated_at", { ascending: false }),
  ]);

  // Map latest generated_at per request
  const docMap = {};
  for (const d of (docs ?? [])) {
    if (!docMap[d.request_id]) docMap[d.request_id] = d.generated_at;
  }
  const enriched = (requests ?? []).map((r) => ({ ...r, doc_generated_at: docMap[r.id] ?? null }));

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Relocations</h1>
        <p className="text-sm text-muted mt-1">{requests?.length ?? 0} total requests</p>
      </div>

      <RelocationsTable requests={enriched} />
    </div>
  );
}
