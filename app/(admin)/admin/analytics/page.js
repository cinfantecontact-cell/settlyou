export const dynamic = 'force-dynamic';
import { createAdminClient } from "@/lib/supabase/admin";
import AnalyticsClient from "./_components/AnalyticsClient";

export const metadata = { title: "Analytics — Settl Admin" };

export default async function AnalyticsPage() {
  const admin = createAdminClient();

  const [{ data: events }, { data: clubs }, { data: requests }] = await Promise.all([
    admin.from("events").select("event_type, club_id, request_id, metadata, created_at").order("created_at", { ascending: false }),
    admin.from("clubs").select("id, name, slug, plan"),
    admin.from("requests").select("id, status"),
  ]);

  if (!events) {
    return <div className="p-10 text-muted text-sm">No data yet.</div>;
  }

  return <AnalyticsClient events={events} clubs={clubs ?? []} requests={requests ?? []} />;
}
