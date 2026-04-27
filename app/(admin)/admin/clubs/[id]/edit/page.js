import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import EditClubForm from "./_components/EditClubForm";

export const metadata = { title: "Edit Club — Settl Admin" };

export default async function EditClubPage({ params, searchParams }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const { data: club } = await admin.from("clubs").select("*").eq("id", id).single();
  if (!club) redirect("/admin/clubs");

  // Fetch base data status
  const { data: baseData } = await admin
    .from("city_base_data")
    .select("status, generated_at")
    .eq("club_id", id)
    .eq("language", "en")
    .single();

  const sp = await searchParams;

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <a href="/admin/clubs" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          All Universities
        </a>
        <h1 className="text-2xl font-bold text-foreground mt-4">{club.name}</h1>
        <p className="text-sm text-muted mt-1">Edit university details, PIN, logo, and status.</p>
      </div>

      {sp?.success && (
        <div className="mb-6 text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-4 py-3">
          Changes saved successfully.
        </div>
      )}
      {sp?.error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Something went wrong. Please try again.
        </div>
      )}

      <EditClubForm club={club} baseDataStatus={baseData?.status || null} baseDataGeneratedAt={baseData?.generated_at || null} />
    </div>
  );
}
