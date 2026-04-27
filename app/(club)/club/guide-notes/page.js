export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import GuideNotesForm from "../account/_components/GuideNotesForm";

export default async function GuideNotesPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role === "coach") redirect("/club");
  if (profile?.role !== "club_admin") redirect("/login");

  const { data: club } = await admin
    .from("clubs").select("id, custom_notes, custom_links, club_documents").eq("id", profile.club_id).single();

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Guide Notes</h1>
          <p className="text-sm text-muted max-w-lg">Customize every student guide with your institution&apos;s message, helpful links, and required documents. The AI includes each item only when it&apos;s relevant to that specific student.</p>
        </div>
      </div>
      <div id="tour-guide-notes-form">
        <GuideNotesForm club={club} />
      </div>
    </div>
  );
}
