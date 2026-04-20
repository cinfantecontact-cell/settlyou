export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import TourDriver from "../_components/TourDriver";
import AthletesTable from "./_components/AthletesTable";

export default async function ClubAthletes() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") redirect("/login");

  const { data: club } = await admin
    .from("clubs").select("plan").eq("id", profile.club_id).single();

  const isPremium = club?.plan === "premium";

  const { data: requests } = await admin
    .from("requests")
    .select("id, status, athlete_name, athlete_email, destination_city, destination_country, sport, created_at, athlete_link_token")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  // Fetch guide open events for premium clubs
  let openMap = {};
  if (isPremium && requests?.length) {
    const requestIds = requests.map((r) => r.id);
    const { data: events } = await admin
      .from("events")
      .select("request_id, created_at")
      .eq("event_type", "guide_opened")
      .in("request_id", requestIds);

    for (const e of events ?? []) {
      if (!openMap[e.request_id]) {
        openMap[e.request_id] = { count: 0, last_opened: null };
      }
      openMap[e.request_id].count++;
      const t = new Date(e.created_at);
      if (!openMap[e.request_id].last_opened || t > new Date(openMap[e.request_id].last_opened)) {
        openMap[e.request_id].last_opened = e.created_at;
      }
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <TourDriver page="athletes" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Athletes</h1>
        <p className="text-sm text-muted mt-1">{requests?.length || 0} total submissions</p>
      </div>
      <AthletesTable requests={requests ?? []} isPremium={isPremium} openMap={openMap} />
    </div>
  );
}
