export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import TourDriver from "../_components/TourDriver";

export default async function ClubNotificationsPage() {
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

  // Guide delivered events
  const { data: deliveredEvents } = await admin
    .from("events")
    .select("id, created_at, metadata")
    .eq("club_id", profile.club_id)
    .eq("event_type", "guide_delivered")
    .order("created_at", { ascending: false });

  // Guide opened events — Premium only, deduplicated to first open per request
  let openNotifications = [];
  if (isPremium) {
    const { data: openEvents } = await admin
      .from("events")
      .select("id, request_id, created_at")
      .eq("club_id", profile.club_id)
      .eq("event_type", "guide_opened")
      .order("created_at", { ascending: true }); // oldest first to get first open

    // Keep only the first open per request
    const firstOpenMap = {};
    for (const e of openEvents ?? []) {
      if (e.request_id && !firstOpenMap[e.request_id]) {
        firstOpenMap[e.request_id] = e;
      }
    }

    // Fetch athlete names for those requests
    const requestIds = Object.keys(firstOpenMap);
    if (requestIds.length) {
      const { data: requests } = await admin
        .from("requests")
        .select("id, athlete_name, athlete_link_token")
        .in("id", requestIds);

      const reqMap = Object.fromEntries((requests ?? []).map((r) => [r.id, r]));
      openNotifications = Object.values(firstOpenMap).map((e) => ({
        ...e,
        event_type: "guide_opened",
        athlete_name: reqMap[e.request_id]?.athlete_name || null,
        report_token: reqMap[e.request_id]?.athlete_link_token || null,
      }));
    }
  }

  // Merge and sort all notifications newest first
  const allNotifications = [
    ...(deliveredEvents ?? []).map((e) => ({
      ...e,
      event_type: "guide_delivered",
      athlete_name: e.metadata?.athlete_name || null,
      athlete_email: e.metadata?.athlete_email || null,
      report_token: e.metadata?.report_token || null,
    })),
    ...openNotifications,
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <TourDriver page="notifications" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted mt-1">Guide delivery and athlete activity updates</p>
      </div>

      <div id="tour-notifications-list" className="bg-white border border-border rounded-xl overflow-hidden">
        {!allNotifications.length ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-muted">No notifications yet. You'll see an update here each time a guide is delivered.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {allNotifications.map((e) => (
              <li key={e.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    e.event_type === "guide_delivered"
                      ? "bg-brand-50 border border-brand-100"
                      : "bg-blue-50 border border-blue-100"
                  }`}>
                    {e.event_type === "guide_delivered" ? (
                      <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {e.event_type === "guide_delivered" ? (
                        <>Guide delivered — <span className="text-brand-600">{e.athlete_name || "Athlete"}</span></>
                      ) : (
                        <>Guide opened — <span className="text-blue-600">{e.athlete_name || "Athlete"}</span></>
                      )}
                    </p>
                    {e.athlete_email && (
                      <p className="text-xs text-muted mt-0.5">{e.athlete_email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-muted">
                    {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {e.report_token && (
                    <a
                      href={`/report/${e.report_token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap"
                    >
                      View guide
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
