export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AdmissionsDocConfig from "./_components/AdmissionsDocConfig";

export default async function AdmissionsDocsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!["club_admin", "admissions"].includes(profile?.role)) redirect("/login");

  const { data: config } = await admin
    .from("admissions_doc_config")
    .select("active_base_docs, custom_docs, doc_settings, form_questions, attachments")
    .eq("club_id", profile.club_id)
    .single();

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Admissions Docs</h1>
        <p className="text-sm text-muted max-w-lg">Configure which documents are required for all incoming athletes across your institution.</p>
      </div>
      <AdmissionsDocConfig initialConfig={config ?? null} />
    </div>
  );
}
