export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import PostList from "./_components/PostList";
import GenerateButton from "./_components/GenerateButton";
import ConnectLinkedIn from "./_components/ConnectLinkedIn";
import ConnectFeedback from "./_components/ConnectFeedback";

export const metadata = { title: "LinkedIn — Settl Admin" };

function KpiCard({ label, value, icon, accent, bg, border }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg ${bg} border ${border} flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-bold ${accent}`}>{value}</p>
        <p className="text-xs font-medium text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default async function AdminLinkedInPage({ searchParams }) {
  const { connected: connectedParam, error } = await searchParams;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const [{ data: posts }, { data: tokens }] = await Promise.all([
    admin.from("linkedin_posts").select("*").order("created_at", { ascending: false }),
    admin.from("linkedin_tokens").select("id").limit(1),
  ]);

  const connected = tokens?.length > 0;
  const total     = posts?.length ?? 0;
  const drafts    = posts?.filter((p) => p.status === "draft").length ?? 0;
  const published = posts?.filter((p) => p.status === "published").length ?? 0;
  const scheduled = posts?.filter((p) => p.status === "scheduled").length ?? 0;

  const kpis = [
    {
      label: "Total posts", value: total,
      accent: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    },
    {
      label: "Drafts", value: drafts,
      accent: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    },
    {
      label: "Published", value: published,
      accent: "text-green-700", bg: "bg-green-50", border: "border-green-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Scheduled", value: scheduled,
      accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">LinkedIn</h1>
          <p className="text-sm text-muted mt-1">Generate, edit, and track posts for the Settlyou page.</p>
        </div>
        <GenerateButton />
      </div>

      <ConnectFeedback connected={connectedParam === "1"} error={error} />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* LinkedIn connection */}
      <div className="mb-6">
        <ConnectLinkedIn connected={connected} />
      </div>

      {/* Posts table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
