"use client";

import { useState, useMemo } from "react";

const RANGES = [
  { label: "This month", key: "month" },
  { label: "Last 30 days", key: "30d" },
  { label: "All time", key: "all" },
];

const EVENT_TYPE_OPTIONS = [
  { value: "", label: "All events" },
  { value: "join_link_visited", label: "Link visited" },
  { value: "form_started", label: "Form started" },
  { value: "form_submitted", label: "Form submitted" },
  { value: "guide_opened", label: "Guide opened" },
  { value: "pdf_printed", label: "PDF printed" },
  { value: "pin_attempt_success", label: "PIN correct" },
  { value: "pin_attempt_failed", label: "PIN failed" },
];

const EVENT_LABELS = {
  guide_opened: "Guide opened",
  pdf_printed: "PDF printed",
  join_link_visited: "Link visited",
  form_started: "Form started",
  form_submitted: "Form submitted",
  pin_attempt_success: "PIN correct",
  pin_attempt_failed: "PIN failed",
};

function trendPct(current, previous) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function StatCard({ label, value, trend, sub }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {trend !== null && trend !== undefined && (
          <span className={`text-xs font-semibold mb-1 ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

function FunnelBar({ label, value, max, pctOfFirst }) {
  const widthPct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <div className="w-36 shrink-0 text-sm text-muted text-right">{label}</div>
      <div className="flex-1 h-6 bg-surface rounded overflow-hidden">
        <div className="h-full bg-brand-500 rounded transition-all" style={{ width: `${widthPct}%` }} />
      </div>
      <div className="w-24 shrink-0 flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{value.toLocaleString()}</span>
        {pctOfFirst !== null && <span className="text-xs text-muted">({pctOfFirst}%)</span>}
      </div>
    </div>
  );
}

export default function AnalyticsClient({ events, clubs, requests }) {
  const [range, setRange] = useState("month");
  const [eventTypeFilter, setEventTypeFilter] = useState("");

  const clubMap = useMemo(
    () => Object.fromEntries((clubs ?? []).map((c) => [c.id, c])),
    [clubs]
  );

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const filteredEvents = useMemo(() => {
    if (range === "month") return events.filter((e) => new Date(e.created_at) >= startOfThisMonth);
    if (range === "30d") return events.filter((e) => new Date(e.created_at) >= thirtyDaysAgo);
    return events;
  }, [events, range]);

  const lastMonthEvents = events.filter(
    (e) => new Date(e.created_at) >= startOfLastMonth && new Date(e.created_at) < startOfThisMonth
  );
  const prevPeriodEvents = useMemo(() => {
    if (range === "month") return lastMonthEvents;
    if (range === "30d") {
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      return events.filter((e) => new Date(e.created_at) >= sixtyDaysAgo && new Date(e.created_at) < thirtyDaysAgo);
    }
    return [];
  }, [events, range]);

  const count = (arr, type) => arr.filter((e) => e.event_type === type).length;

  const linkVisits     = count(filteredEvents, "join_link_visited");
  const formsStarted   = count(filteredEvents, "form_started");
  const formsSubmitted = count(filteredEvents, "form_submitted");
  const guideOpens     = count(filteredEvents, "guide_opened");
  const pdfPrints      = count(filteredEvents, "pdf_printed");
  const guidesDelivered = (requests ?? []).filter((r) => r.status === "delivered").length;
  const conversionRate = formsStarted > 0 ? Math.round((formsSubmitted / formsStarted) * 100) : 0;

  const trends = range !== "all" ? {
    linkVisits:     trendPct(linkVisits,     count(prevPeriodEvents, "join_link_visited")),
    formsSubmitted: trendPct(formsSubmitted, count(prevPeriodEvents, "form_submitted")),
    guideOpens:     trendPct(guideOpens,     count(prevPeriodEvents, "guide_opened")),
    pdfPrints:      trendPct(pdfPrints,      count(prevPeriodEvents, "pdf_printed")),
  } : {};

  // Per-club breakdown
  const clubRows = useMemo(() => {
    const stats = {};
    for (const e of filteredEvents) {
      const id = e.club_id;
      if (!id) continue;
      if (!stats[id]) {
        stats[id] = {
          name: clubMap[id]?.name ?? "Unknown",
          slug: clubMap[id]?.slug ?? "",
          plan: clubMap[id]?.plan ?? "",
          link_visits: 0, forms_started: 0, forms_submitted: 0,
          guide_opens: 0, pdf_prints: 0, pin_success: 0, pin_failed: 0,
        };
      }
      const s = stats[id];
      if (e.event_type === "join_link_visited")   s.link_visits++;
      if (e.event_type === "form_started")        s.forms_started++;
      if (e.event_type === "form_submitted")      s.forms_submitted++;
      if (e.event_type === "guide_opened")        s.guide_opens++;
      if (e.event_type === "pdf_printed")         s.pdf_prints++;
      if (e.event_type === "pin_attempt_success") s.pin_success++;
      if (e.event_type === "pin_attempt_failed")  s.pin_failed++;
    }
    return Object.values(stats).sort((a, b) => b.forms_submitted - a.forms_submitted);
  }, [filteredEvents, clubMap]);

  const recentEvents = useMemo(() => {
    const base = [...events].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return (eventTypeFilter ? base.filter((e) => e.event_type === eventTypeFilter) : base).slice(0, 50);
  }, [events, eventTypeFilter]);

  const funnelMax = Math.max(linkVisits, 1);
  const funnelSteps = [
    { label: "Link visits",      value: linkVisits,      pctOfFirst: null },
    { label: "Forms started",    value: formsStarted,    pctOfFirst: linkVisits > 0 ? Math.round((formsStarted / linkVisits) * 100) : 0 },
    { label: "Forms submitted",  value: formsSubmitted,  pctOfFirst: linkVisits > 0 ? Math.round((formsSubmitted / linkVisits) * 100) : 0 },
    { label: "Guide opens",      value: guideOpens,      pctOfFirst: linkVisits > 0 ? Math.round((guideOpens / linkVisits) * 100) : 0 },
    { label: "Guides delivered", value: guidesDelivered, pctOfFirst: linkVisits > 0 ? Math.round((guidesDelivered / linkVisits) * 100) : 0 },
  ];

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted mt-1">Event data across clubs and guides.</p>
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1 border border-border">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                range === r.key ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Link visits"      value={linkVisits}     trend={trends.linkVisits} />
        <StatCard label="Forms started"    value={formsStarted} />
        <StatCard label="Forms submitted"  value={formsSubmitted} trend={trends.formsSubmitted} sub={`${conversionRate}% conversion`} />
        <StatCard label="Guide opens"      value={guideOpens}     trend={trends.guideOpens} />
        <StatCard label="PDF prints"       value={pdfPrints}      trend={trends.pdfPrints} />
        <StatCard label="Guides delivered" value={guidesDelivered} sub="status = delivered" />
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-xl border border-border p-6 mb-10">
        <h2 className="text-base font-semibold text-foreground mb-5">Conversion funnel</h2>
        <div className="space-y-3">
          {funnelSteps.map((step) => (
            <FunnelBar key={step.label} label={step.label} value={step.value} max={funnelMax} pctOfFirst={step.pctOfFirst} />
          ))}
        </div>
      </div>

      {/* Per-club table */}
      {clubRows.length > 0 && (
        <div className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">By institution</h2>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Institution</th>
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
                  <tr key={c.slug || c.name} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <span className="mr-2">{c.name}</span>
                      {c.plan && (
                        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full capitalize">{c.plan}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">{c.link_visits}</td>
                    <td className="px-4 py-3 text-right text-muted">{c.forms_started}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{c.forms_submitted}</td>
                    <td className="px-4 py-3 text-right text-muted">{c.guide_opens}</td>
                    <td className="px-4 py-3 text-right text-muted">{c.pdf_prints}</td>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent events</h2>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white text-foreground outline-none focus:ring-2 focus:ring-brand-500"
          >
            {EVENT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {recentEvents.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted">No events match this filter.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Institution</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentEvents.map((e, i) => (
                  <tr key={i} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        e.event_type === "form_submitted"     ? "bg-green-50 text-green-700" :
                        e.event_type === "guide_opened"       ? "bg-brand-50 text-brand-700" :
                        e.event_type === "pdf_printed"        ? "bg-purple-50 text-purple-700" :
                        e.event_type === "pin_attempt_failed" ? "bg-red-50 text-red-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {EVENT_LABELS[e.event_type] ?? e.event_type}
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
          )}
        </div>
      </div>
    </div>
  );
}
