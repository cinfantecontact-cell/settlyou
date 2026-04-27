export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AthletesTable from "./_components/AthletesTable";
import { getSportDocTypes, BASE_DOC_SHORT_LABELS } from "@/lib/documents/types";

export default async function ClubAthletes() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (!["club_admin", "coach"].includes(profile?.role)) redirect("/login");

  const isCoach = profile.role === "coach";

  let requestsQuery = admin
    .from("requests")
    .select("id, status, athlete_name, athlete_email, sport, created_at, athlete_link_token")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  if (isCoach && profile.sport) {
    requestsQuery = requestsQuery.eq("sport", profile.sport);
  }

  const { data: requests } = await requestsQuery;

  // For coaches: fetch documents + sport doc config in parallel
  let docsByRequest = {};
  let coachDocCols = null;

  if (isCoach) {
    const [docsResult, configResult] = await Promise.all([
      requests?.length
        ? admin.from("athlete_documents")
            .select("request_id, document_type, file_name, file_url")
            .in("request_id", requests.map(r => r.id))
        : Promise.resolve({ data: [] }),
      profile.sport
        ? admin.from("sport_document_config")
            .select("disabled_base_docs, custom_docs")
            .eq("club_id", profile.club_id)
            .eq("sport", profile.sport)
            .single()
        : Promise.resolve({ data: null }),
    ]);

    if (docsResult.data) {
      for (const doc of docsResult.data) {
        if (!docsByRequest[doc.request_id]) docsByRequest[doc.request_id] = {};
        docsByRequest[doc.request_id][doc.document_type] = doc;
      }
    }

    const docTypes = getSportDocTypes(configResult.data ?? null);
    coachDocCols = docTypes.map(d => ({
      key: d.key,
      label: BASE_DOC_SHORT_LABELS[d.key] || d.label.split(" ").slice(0, 2).join(" "),
    }));
  }

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Students</h1>
          <p className="text-sm text-muted max-w-lg">All students who have submitted a relocation request through your join link. Track their guide status and resend emails from here.</p>
        </div>
        <p className="text-sm text-muted shrink-0 mt-1">{requests?.length || 0} total</p>
      </div>
      <div id="tour-athletes-table">
        <AthletesTable requests={requests ?? []} isCoach={isCoach} docsByRequest={docsByRequest} coachDocCols={coachDocCols} />
      </div>
    </div>
  );
}
