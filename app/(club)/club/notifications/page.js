export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export default async function ClubNotificationsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (!["club_admin", "coach"].includes(profile?.role)) redirect("/login");

  const isCoach = profile.role === "coach";

  let eventsQuery = admin
    .from("events")
    .select("id, request_id, created_at, event_type, metadata")
    .eq("club_id", profile.club_id)
    .in("event_type", ["guide_delivered", "guide_opened", "document_uploaded"])
    .order("created_at", { ascending: false });

  const { data: rawEvents } = await eventsQuery;

  let sportRequestIds = null;
  if (isCoach && profile.sport) {
    const { data: sportReqs } = await admin
      .from("requests")
      .select("id")
      .eq("club_id", profile.club_id)
      .eq("sport", profile.sport);
    sportRequestIds = new Set((sportReqs ?? []).map(r => r.id));
  }

  const filtered = (rawEvents ?? []).filter(e => {
    if (!isCoach) return true;
    if (e.metadata?.sport) return e.metadata.sport === profile.sport;
    if (e.request_id && sportRequestIds) return sportRequestIds.has(e.request_id);
    return false;
  });

  const firstOpenMap = {};
  const nonOpenEvents = [];
  for (const e of filtered) {
    if (e.event_type === "guide_opened") {
      if (!firstOpenMap[e.request_id]) firstOpenMap[e.request_id] = e;
    } else {
      nonOpenEvents.push(e);
    }
  }

  const openRequestIds = Object.keys(firstOpenMap);
  let reqMap = {};
  if (openRequestIds.length) {
    const { data: reqs } = await admin
      .from("requests").select("id, athlete_name, athlete_link_token").in("id", openRequestIds);
    reqMap = Object.fromEntries((reqs ?? []).map(r => [r.id, r]));
  }

  const allNotifications = [
    ...nonOpenEvents.map(e => ({
      ...e,
      athlete_name: e.metadata?.athlete_name || null,
      athlete_email: e.metadata?.athlete_email || null,
      report_token: e.metadata?.report_token || null,
      document_type: e.metadata?.document_type || null,
      file_name: e.metadata?.file_name || null,
    })),
    ...Object.values(firstOpenMap).map(e => ({
      ...e,
      athlete_name: reqMap[e.request_id]?.athlete_name || null,
      report_token: reqMap[e.request_id]?.athlete_link_token || null,
    })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const deliveredCount = allNotifications.filter(e => e.event_type === "guide_delivered").length;
  const openedCount = allNotifications.filter(e => e.event_type === "guide_opened").length;
  const uploadedCount = allNotifications.filter(e => e.event_type === "document_uploaded").length;

  const EVENT_META = {
    guide_delivered: {
      label: "Guide delivered",
      bar: "bg-brand-500",
      iconBg: "bg-brand-50 border-brand-100",
      iconColor: "text-brand-600",
      nameColor: "text-brand-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    document_uploaded: {
      label: "Document uploaded",
      bar: "bg-orange-400",
      iconBg: "bg-orange-50 border-orange-100",
      iconColor: "text-orange-500",
      nameColor: "text-orange-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    guide_opened: {
      label: "Guide opened",
      bar: "bg-blue-500",
      iconBg: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-600",
      nameColor: "text-blue-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Notifications</h1>
        <p className="text-sm text-muted max-w-lg">A log of every guide delivered and every student who has opened their guide. You also receive a weekly email summary every Monday.</p>
      </div>

      {/* Summary pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border">
          <div className="w-2 h-2 rounded-full bg-brand-500" />
          <span className="text-sm font-semibold text-foreground">{deliveredCount}</span>
          <span className="text-xs text-muted">guides delivered</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm font-semibold text-foreground">{openedCount}</span>
          <span className="text-xs text-muted">guides opened</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-sm font-semibold text-foreground">{uploadedCount}</span>
          <span className="text-xs text-muted">documents uploaded</span>
        </div>
        <span className="ml-auto text-xs text-muted">{allNotifications.length} total</span>
      </div>

      {/* Notification cards */}
      <div id="tour-notifications-list" className="bg-white border border-border rounded-xl overflow-hidden">
        {!allNotifications.length ? (
          <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No notifications yet</p>
            <p className="text-xs text-muted">You'll see an update here each time a guide is delivered.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {allNotifications.map((e) => {
              const meta = EVENT_META[e.event_type] ?? EVENT_META.guide_delivered;
              return (
                <li key={e.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface transition-colors relative">
                  {/* Colored left stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${meta.bar}`} />

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${meta.iconBg} ${meta.iconColor}`}>
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {meta.label} —{" "}
                      <span className={meta.nameColor}>{e.athlete_name || "Student"}</span>
                      {e.event_type === "document_uploaded" && e.document_type && (
                        <span className="text-muted font-normal"> · {e.document_type.replace(/_/g, " ")}</span>
                      )}
                    </p>
                    {e.athlete_email && (
                      <p className="text-xs text-muted mt-0.5">{e.athlete_email}</p>
                    )}
                    {e.event_type === "document_uploaded" && e.file_name && (
                      <p className="text-xs text-muted mt-0.5">{e.file_name}</p>
                    )}
                  </div>

                  {/* Right side */}
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
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
