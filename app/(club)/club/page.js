export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import JoinLinkCard from "./_components/JoinLinkCard";
import OnboardingTutorial from "./_components/OnboardingTutorial";
import StatusBadge from "./_components/StatusBadge";
import DashboardWidgets from "./_components/DashboardWidgets";
import { BASE_DOCUMENT_TYPES, BASE_DOC_SHORT_LABELS } from "@/lib/documents/types";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-brand-100 text-brand-700",
  "bg-pink-100 text-pink-700",
];

function AthleteAvatar({ name }) {
  const initials = (name ?? "?").split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const idx = (name ?? "").charCodeAt(0) % AVATAR_COLORS.length;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[idx]}`}>
      {initials}
    </div>
  );
}

export default async function ClubDashboard() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles")
    .select("role, club_id, sport")
    .eq("id", user.id)
    .single();

  if (!["club_admin", "coach", "admissions"].includes(profile?.role)) redirect("/login");

  const { data: club } = await admin
    .from("clubs")
    .select("*")
    .eq("id", profile.club_id)
    .single();

  let requestsQuery = admin
    .from("requests")
    .select("id, status, athlete_name, created_at, athlete_link_token, sport, deleted_at")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  if (profile.role === "coach" && profile.sport) {
    requestsQuery = requestsQuery.eq("sport", profile.sport);
  }

  const { data: requests } = await requestsQuery;

  const active = requests?.filter(r => !r.deleted_at) ?? [];
  const deletedCount = requests?.filter(r => r.deleted_at).length ?? 0;

  const total = active.length;
  const delivered = active.filter(r => r.status === "delivered").length;
  const inProgress = active.filter(r => ["submitted", "generating", "under_review", "approved"].includes(r.status)).length;
  const effectiveLimit = club?.seat_limit ?? 40;
  const creditsLeft = effectiveLimit - (club?.seats_used || 0);

  const statusCounts = {
    submitted: active.filter(r => r.status === "submitted").length,
    generating: active.filter(r => r.status === "generating").length,
    under_review: active.filter(r => r.status === "under_review").length,
    approved: active.filter(r => r.status === "approved").length,
  };

  const stuckGuides = active.filter(r =>
    (r.status === "submitted" || r.status === "generating") &&
    Date.now() - new Date(r.created_at).getTime() > TWELVE_HOURS
  );

  const attentionItems = [
    stuckGuides.length > 0 && `${stuckGuides.length} guide${stuckGuides.length > 1 ? "s" : ""} stuck in processing for over 12 hours`,
    profile.role !== "coach" && creditsLeft <= 5 && `${creditsLeft} guide${creditsLeft === 1 ? "" : "s"} remaining — consider requesting more before your next intake`,
  ].filter(Boolean);

  let coaches = [];
  if (profile.role === "club_admin") {
    const { data: coachProfiles } = await admin
      .from("profiles")
      .select("id, full_name, sport")
      .eq("club_id", profile.club_id)
      .eq("role", "coach")
      .order("sport");
    coaches = coachProfiles ?? [];
  }

  const isAdmin = profile.role === "club_admin";

  const today = new Date();
  const sparkline = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const day = d.toISOString().slice(0, 10);
    return { date: day, count: active.filter(r => r.created_at.slice(0, 10) === day).length };
  });

  const sportCounts = Object.entries(
    active.reduce((acc, r) => { if (r.sport) acc[r.sport] = (acc[r.sport] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const coachesWithStats = coaches.map(coach => ({
    ...coach,
    athleteCount: active.filter(r => r.sport === coach.sport).length,
    deliveredCount: active.filter(r => r.sport === coach.sport && r.status === "delivered").length,
  }));

  let docStats = null;
  if (delivered > 0) {
    const deliveredReqs = active.filter(r => r.status === "delivered");
    const deliveredIds = deliveredReqs.map(r => r.id);

    const { data: allDocs } = await admin
      .from("athlete_documents")
      .select("request_id, document_type")
      .in("request_id", deliveredIds);

    const docs = allDocs || [];
    const expectedPerAthlete = BASE_DOCUMENT_TYPES.length;
    const totalExpected = deliveredIds.length * expectedPerAthlete;
    const totalUploaded = docs.length;
    const completionPct = totalExpected > 0 ? Math.round((totalUploaded / totalExpected) * 100) : 0;

    const docTypeCounts = {};
    BASE_DOCUMENT_TYPES.forEach(d => { docTypeCounts[d.key] = 0; });
    docs.forEach(d => {
      if (docTypeCounts[d.document_type] !== undefined) docTypeCounts[d.document_type]++;
    });
    const mostMissedKey = Object.entries(docTypeCounts).sort(([, a], [, b]) => a - b)[0]?.[0];
    const mostMissedLabel = BASE_DOC_SHORT_LABELS[mostMissedKey] || mostMissedKey;

    const perAthlete = deliveredReqs.map(r => ({
      id: r.id,
      name: r.athlete_name,
      uploaded: docs.filter(d => d.request_id === r.id).length,
      expected: expectedPerAthlete,
    })).sort((a, b) => b.uploaded - a.uploaded);

    docStats = { totalUploaded, totalMissing: totalExpected - totalUploaded, completionPct, mostMissedLabel, perAthlete, expectedPerAthlete };
  }

  const kpis = [
    {
      label: "Total athletes", value: total,
      accent: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: "Guides sent", value: delivered,
      accent: "text-green-700", bg: "bg-green-50", border: "border-green-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "In progress", value: inProgress,
      accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    },
    {
      label: "Deleted", value: deletedCount,
      accent: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    },
    {
      label: "Guides left", value: creditsLeft,
      accent: creditsLeft <= 5 ? "text-red-600" : "text-yellow-700",
      bg: creditsLeft <= 5 ? "bg-red-50" : "bg-yellow-50",
      border: creditsLeft <= 5 ? "border-red-100" : "border-yellow-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
      <OnboardingTutorial page="dashboard" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
          {club?.name}{profile.role === "coach" && profile.sport ? ` / ${profile.sport}` : ""}
        </h1>
        <p className="text-sm text-muted">
          {isAdmin ? "Overview of your coaches and student activity." : "Here's an overview of your student guides and activity."}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg ${k.bg} border ${k.border} flex items-center justify-center ${k.accent}`}>
              {k.icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${k.accent}`}>{k.value}</p>
              <p className="text-xs font-medium text-muted mt-0.5">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Needs Attention */}
      {attentionItems.length > 0 && (
        <div className="bg-white border border-yellow-200 border-l-4 border-l-yellow-400 rounded-xl px-5 py-4">
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-widest mb-2">Needs attention</p>
          <ul className="flex flex-col gap-1">
            {attentionItems.map((item, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Coach: join link */}
      {profile.role === "coach" && club?.slug && (
        <div id="tour-join-link">
          <JoinLinkCard slug={club.slug} pin={club.pin} clubName={club.name} sport={profile.sport} />
        </div>
      )}

      {/* Coach: guide notes prompt */}
      {profile.role === "coach" && profile.sport && (
        <div className="bg-surface border border-border rounded-xl px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Add notes and links for your {profile.sport} athletes — compliance deadlines, team contacts, or anything every {profile.sport} student should know.
          </p>
          <a href="/club/coach-notes" className="text-xs font-semibold text-brand-600 hover:underline whitespace-nowrap">
            Set up
          </a>
        </div>
      )}


      {/* Recent students */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Athletes</h2>
          <a href="/club/athletes" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors">
            View all
          </a>
        </div>
        {active.length === 0 ? (
          <div className="px-6 py-12 text-center flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <p className="text-sm text-muted">No athletes yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Athlete</th>
                {isAdmin && <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sport</th>}
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {active.slice(0, 5).map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <AthleteAvatar name={r.athlete_name} />
                      <a href={`/club/athletes/${r.id}`} className="font-medium text-foreground hover:text-brand-600 hover:underline">{r.athlete_name || "—"}</a>
                    </div>
                  </td>
                  {isAdmin && <td className="px-6 py-3.5 text-muted text-xs">{r.sport || "—"}</td>}
                  <td className="px-6 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-3.5 text-muted text-xs">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-6 py-3.5 text-right">
                    <a href={`/club/athletes/${r.id}`} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
