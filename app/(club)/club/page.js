export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import JoinLinkCard from "./_components/JoinLinkCard";
import OnboardingTutorial from "./_components/OnboardingTutorial";
import StatusBadge from "./_components/StatusBadge";
import { BASE_DOCUMENT_TYPES, BASE_DOC_SHORT_LABELS } from "@/lib/documents/types";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

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

  if (!["club_admin", "coach"].includes(profile?.role)) redirect("/login");

  const { data: club } = await admin
    .from("clubs")
    .select("*")
    .eq("id", profile.club_id)
    .single();

  let requestsQuery = admin
    .from("requests")
    .select("id, status, athlete_name, created_at, athlete_link_token, sport")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  if (profile.role === "coach" && profile.sport) {
    requestsQuery = requestsQuery.eq("sport", profile.sport);
  }

  const { data: requests } = await requestsQuery;

  const total = requests?.length || 0;
  const delivered = requests?.filter(r => r.status === "delivered").length || 0;
  const inProgress = requests?.filter(r => ["submitted", "generating", "under_review", "approved"].includes(r.status)).length || 0;
  const effectiveLimit = club?.seat_limit ?? 40;
  const creditsLeft = effectiveLimit - (club?.seats_used || 0);

  const statusCounts = {
    submitted: requests?.filter(r => r.status === "submitted").length || 0,
    generating: requests?.filter(r => r.status === "generating").length || 0,
    under_review: requests?.filter(r => r.status === "under_review").length || 0,
    approved: requests?.filter(r => r.status === "approved").length || 0,
  };

  const stuckGuides = requests?.filter(r =>
    (r.status === "submitted" || r.status === "generating") &&
    Date.now() - new Date(r.created_at).getTime() > TWELVE_HOURS
  ) || [];

  const attentionItems = [
    stuckGuides.length > 0 && `${stuckGuides.length} guide${stuckGuides.length > 1 ? "s" : ""} stuck in processing for over 12 hours`,
    profile.role !== "coach" && creditsLeft <= 5 && `${creditsLeft} guide${creditsLeft === 1 ? "" : "s"} remaining — consider requesting more before your next intake`,
  ].filter(Boolean);

  // AD: fetch coaches + their athlete counts
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

  // Document stats for coach view
  let docStats = null;
  if (!isAdmin && delivered > 0) {
    const deliveredReqs = requests.filter(r => r.status === "delivered");
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

    // Most missed = doc type with fewest uploads
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

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
      <OnboardingTutorial page="dashboard" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {club?.name}{profile.role === "coach" && profile.sport ? ` / ${profile.sport}` : ""}
        </h1>
        <p className="text-sm text-muted">
          {isAdmin ? "Overview of your coaches and student activity." : "Here's an overview of your student guides and activity."}
        </p>
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
      {!isAdmin && club?.slug && (
        <div id="tour-join-link">
          <JoinLinkCard slug={club.slug} pin={club.pin} clubName={club.name} sport={profile.sport} />
        </div>
      )}

      {/* Coach: guide notes prompt */}
      {!isAdmin && profile.sport && (
        <div className="bg-surface border border-border rounded-xl px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Add notes and links for your {profile.sport} athletes — compliance deadlines, team contacts, or anything every {profile.sport} student should know.
          </p>
          <a href="/club/coach-notes" className="text-xs font-semibold text-brand-600 hover:underline whitespace-nowrap">
            Set up
          </a>
        </div>
      )}

      {/* Stat cards */}
      <div id="tour-stats" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Athletes", value: total, accent: false },
          { label: "Guides Sent", value: delivered, accent: true },
          { label: "In Progress", value: inProgress, accent: false },
          !isAdmin && { label: "Guides Left", value: creditsLeft, accent: false },
          isAdmin && { label: "Coaches", value: coaches.length, accent: false },
        ].filter(Boolean).map((s) => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-brand-100 transition-all duration-200">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">{s.label}</p>
            <p className={`text-4xl font-bold leading-none ${s.accent ? "text-brand-600" : "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* AD: Coaches overview */}
      {isAdmin && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Coaches</h2>
            <a href="/club/coaches" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors">
              Manage coaches
            </a>
          </div>
          {coaches.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted mb-3">No coaches invited yet.</p>
              <a href="/club/coaches" className="text-sm font-semibold text-brand-600 hover:underline">Invite your first coach</a>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {coaches.map((coach) => {
                const sportAthletes = requests?.filter(r => r.sport === coach.sport) ?? [];
                const sportDelivered = sportAthletes.filter(r => r.status === "delivered").length;
                return (
                  <div key={coach.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{coach.full_name || "—"}</p>
                      <p className="text-xs text-muted mt-0.5">{coach.sport || "No sport assigned"}</p>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-xs text-muted">Athletes</p>
                        <p className="text-sm font-semibold text-foreground">{sportAthletes.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Guides sent</p>
                        <p className="text-sm font-semibold text-brand-600">{sportDelivered}</p>
                      </div>
                      <a href="/club/athletes" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors whitespace-nowrap">
                        View athletes
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Status breakdown */}
      {inProgress > 0 && (
        <div className="flex flex-wrap items-center gap-2 -mt-2">
          {[
            { key: "submitted", label: "Received", color: "bg-blue-50 text-blue-700 border-blue-100" },
            { key: "generating", label: "Generating", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
            { key: "under_review", label: "Quality Check", color: "bg-orange-50 text-orange-700 border-orange-100" },
            { key: "approved", label: "Ready to Send", color: "bg-green-50 text-green-700 border-green-100" },
          ].filter(s => statusCounts[s.key] > 0).map(s => (
            <span key={s.key} className={`text-xs font-medium px-3 py-1 rounded-full border ${s.color}`}>
              {statusCounts[s.key]} {s.label}
            </span>
          ))}
        </div>
      )}

      {/* Document stats */}
      {!isAdmin && docStats && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Document Uploads</h2>
            <p className="text-xs text-muted mt-0.5">Across all athletes with a delivered guide</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            <div className="px-6 py-4">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Uploaded</p>
              <p className="text-3xl font-bold text-foreground">{docStats.totalUploaded}</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Missing</p>
              <p className={`text-3xl font-bold ${docStats.totalMissing > 0 ? "text-orange-500" : "text-foreground"}`}>{docStats.totalMissing}</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">Completion</p>
              <p className={`text-3xl font-bold ${docStats.completionPct === 100 ? "text-brand-600" : "text-foreground"}`}>{docStats.completionPct}%</p>
            </div>
          </div>
          <div className="px-6 py-3 border-b border-border flex items-center gap-2">
            <span className="text-xs text-muted">Most missed:</span>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{docStats.mostMissedLabel}</span>
          </div>
          <div>
            {docStats.perAthlete.map((a, i) => (
              <div key={a.id} className="px-6 py-3 flex items-center gap-4 border-b border-border last:border-0">
                <span className="text-xs text-muted w-4">{i + 1}</span>
                <a href={`/club/athletes/${a.id}`} className="text-sm font-medium text-foreground hover:underline flex-1">{a.name}</a>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${a.uploaded === a.expected ? "bg-brand-500" : "bg-orange-400"}`}
                      style={{ width: `${Math.round((a.uploaded / a.expected) * 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold tabular-nums w-8 text-right ${a.uploaded === a.expected ? "text-brand-600" : "text-orange-500"}`}>
                    {a.uploaded}/{a.expected}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
        {requests?.length === 0 ? (
          <div className="px-6 py-12 text-center">
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
              {requests?.slice(0, 5).map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <a href={`/club/athletes/${r.id}`} className="hover:underline">{r.athlete_name || "—"}</a>
                  </td>
                  {isAdmin && <td className="px-6 py-4 text-muted text-xs">{r.sport || "—"}</td>}
                  <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-4 text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
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

