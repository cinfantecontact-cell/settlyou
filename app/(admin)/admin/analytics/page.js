export const dynamic = 'force-dynamic';
import { createAdminClient } from "@/lib/supabase/admin";

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default async function AnalyticsPage() {
  const admin = createAdminClient();

  // Fetch all events
  const { data: events } = await admin
    .from("events")
    .select("event_type, club_id, request_id, metadata, created_at")
    .order("created_at", { ascending: false });

  if (!events) {
    return <div className="p-10 text-muted text-sm">No data yet.</div>;
  }

  // Fetch clubs for name lookup
  const { data: clubs } = await admin.from("clubs").select("id, name, slug, plan");
  const clubMap = Object.fromEntries((clubs ?? []).map((c) => [c.id, c]));

  // Aggregate counts
  const count = (type) => events.filter((e) => e.event_type === type).length;

  const guideOpens = count("guide_opened");
  const pdfPrints = count("pdf_printed");
  const linkVisits = count("join_link_visited");
  const formsStarted = count("form_started");
  const formsSubmitted = count("form_submitted");
  const pinSuccess = count("pin_attempt_success");
  const pinFailed = count("pin_attempt_failed");

  const conversionRate =
    formsStarted > 0 ? Math.round((formsSubmitted / formsStarted) * 100) : 0;

  // Per-club breakdown
  const clubStats = {};
  for (const e of events) {
    const id = e.club_id;
    if (!id) continue;
    if (!clubStats[id]) {
      clubStats[id] = {
        name: clubMap[id]?.name ?? "Unknown",
        slug: clubMap[id]?.slug ?? "",
        plan: clubMap[id]?.plan ?? "essentials",
        link_visits: 0,
        forms_started: 0,
        forms_submitted: 0,
        guide_opens: 0,
        pdf_prints: 0,
        pin_success: 0,
        pin_failed: 0,
      };
    }
    const s = clubStats[id];
    if (e.event_type === "join_link_visited") s.link_visits++;
    if (e.event_type === "form_started") s.forms_started++;
    if (e.event_type === "form_submitted") s.forms_submitted++;
    if (e.event_type === "guide_opened") s.guide_opens++;
    if (e.event_type === "pdf_printed") s.pdf_prints++;
    if (e.event_type === "pin_attempt_success") s.pin_success++;
    if (e.event_type === "pin_attempt_failed") s.pin_failed++;
  }

  const clubRows = Object.values(clubStats).sort(
    (a, b) => b.forms_submitted - a.forms_submitted
  );

  // Recent events (last 50)
  const recent = events.slice(0, 50);

  const eventLabels = {
    guide_opened: "Guide opened",
    pdf_printed: "PDF printed",
    join_link_visited: "Link visited",
    form_started: "Form started",
    form_submitted: "Form submitted",
    pin_attempt_success: "PIN correct",
    pin_attempt_failed: "PIN failed",
  };

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">Analytics</h1>
      <p className="text-sm text-muted mb-8">All-time event data across clubs and guides.</p>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Link visits" value={linkVisits} />
        <StatCard label="Forms started" value={formsStarted} />
        <StatCard
          label="Forms submitted"
          value={formsSubmitted}
          sub={`${conversionRate}% conversion`}
        />
        <StatCard label="Guide opens" value={guideOpens} />
        <StatCard label="PDF prints" value={pdfPrints} />
        <StatCard label="PIN correct" value={pinSuccess} />
        <StatCard label="PIN failed" value={pinFailed} />
        <StatCard label="Total events" value={events.length} />
      </div>

      {/* Per-club table */}
      {clubRows.length > 0 && (
        <div className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">By club</h2>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Club</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Visits</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Started</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Submitted</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Opens</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">PDFs</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">PIN ok/fail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clubRows.map((c) => (
                  <tr key={c.slug} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <span className="mr-2">{c.name}</span>
                      {c.plan === "premium" ? (
                        <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-full">Premium</span>
                      ) : (
                        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Essentials</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">{c.link_visits}</td>
                    <td className="px-4 py-3 text-right text-muted">{c.forms_started}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{c.forms_submitted}</td>
                    <td className="px-4 py-3 text-right text-muted">
                      {c.plan === "premium" ? c.guide_opens : <span className="text-xs text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">
                      {c.plan === "premium" ? c.pdf_prints : <span className="text-xs text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">
                      <span className="text-green-600">{c.pin_success}</span>
                      {" / "}
                      <span className="text-red-500">{c.pin_failed}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent events feed */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Recent events</h2>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Event</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Club</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((e, i) => (
                <tr key={i} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      e.event_type === "form_submitted" ? "bg-green-50 text-green-700" :
                      e.event_type === "guide_opened" ? "bg-brand-50 text-brand-700" :
                      e.event_type === "pdf_printed" ? "bg-purple-50 text-purple-700" :
                      e.event_type === "pin_attempt_failed" ? "bg-red-50 text-red-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {eventLabels[e.event_type] ?? e.event_type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted">
                    {e.club_id ? (clubMap[e.club_id]?.name ?? "—") : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-muted text-xs">
                    {new Date(e.created_at).toLocaleString("en-US", {
                      month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
