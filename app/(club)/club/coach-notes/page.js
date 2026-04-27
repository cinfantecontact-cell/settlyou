export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import CoachNotesClient from "./_components/CoachNotesClient";

export default async function CoachNotesPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport, full_name").eq("id", user.id).single();
  if (profile?.role !== "coach") redirect("/club");

  const [{ data: existing }, { data: docConfig }] = await Promise.all([
    admin.from("coach_sport_notes")
      .select("id, custom_notes, custom_links")
      .eq("club_id", profile.club_id)
      .eq("sport", profile.sport)
      .single(),
    admin.from("sport_document_config")
      .select("disabled_base_docs, custom_docs")
      .eq("club_id", profile.club_id)
      .eq("sport", profile.sport)
      .single(),
  ]);

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Guide Notes — {profile.sport}</h1>
        <p className="text-sm text-muted max-w-lg">
          Customize what every {profile.sport} athlete sees in their guide and which documents they need to upload.
        </p>
      </div>
      <CoachNotesClient
        sport={profile.sport}
        initialNotes={existing?.custom_notes ?? ""}
        initialLinks={existing?.custom_links ?? []}
        initialDocConfig={docConfig ?? null}
      />
    </div>
  );
}
