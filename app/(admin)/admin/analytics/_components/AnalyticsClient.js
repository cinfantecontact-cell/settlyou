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
  guide_opened:        "Guide opened",
  pdf_printed:         "PDF printed",
  join_link_visited:   "Link visited",
  form_started:        "Form started",
  form_submitted:      "Form submitted",
  pin_attempt_success: "PIN correct",
  pin_attempt_failed:  "PIN failed",
};

function trendPct(current, previous) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function StatCard({ label, value, sub, trend, icon, accent, bg, border }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg ${bg} border ${border} flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <div className="flex items-end gap-2">
          <p className={`text-2xl font-bold ${accent}`}>{value}</p>
          {trend !== null && trend !== undefined && (
            <span className={`text-xs font-semibold mb-0.5 ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-muted mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-muted/70 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const FUNNEL_COLORS = [
  { bar: "bg-blue-500",   dot: "bg-blue-500" },
  { bar: "bg-brand-500",  dot: "bg-brand-500" },
  { bar: "bg-green-500",  dot: "bg-green-500" },
  { bar: "bg-purple-500", dot: "bg-purple-500" },
  { bar: "bg-orange-500", dot: "bg-orange-500" },
];

function FunnelBar({ label, value, max, pctOfFirst, colorIdx }) {
  const widthPct = max > 0 ? Math.round((value / max) * 100) : 0;
  const c = FUNNEL_COLORS[colorIdx % FUNNEL_COLORS.length];
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 shrink-0 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>
      <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-500 ${c.bar}`} style={{ width: `${widthPct}%` }} />
      </div>
      <div className="w-20 shrink-0 flex items-center justify-end gap-1.5">
        <span className="text-sm font-bold text-foreground">{value.toLocaleString()}</span>
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
    if (range === "30d")   return events.filter((e) => new Date(e.created_at) >= thirtyDaysAgo);
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

  const linkVisits      = count(filteredEvents, "join_link_visited");
  const formsStarted    = count(filteredEvents, "form_started");
  const formsSubmitted  = count(filteredEvents, "form_submitted");
  const guideOpens      = count(filteredEvents, "guide_opened");
  const pdfPrints       = count(filteredEvents, "pdf_printed");
  const guidesDelivered = (requests ?? []).filter((r) => r.status === "delivered").length;
  const conversionRate  = formsStarted > 0 ? Math.round((formsSubmitted / formsStarted) * 100) : 0;

  const trends = range !== "all" ? {
    linkVisits:     trendPct(linkVisits,     count(prevPeriodEvents, "join_link_visited")),
    formsSubmitted: trendPct(formsSubmitted, count(prevPeriodEvents, "form_submitted")),
    guideOpens:     trendPct(guideOpens,     count(prevPeriodEvents, "guide_opened")),
    pdfPrints:      trendPct(pdfPrints,      count(prevPeriodEvents, "pdf_printed")),
  } : {};

  const clubRows = useMemo(() => {
    const stats = {};
    for (const e of filteredEvents) {
      const id = e.club_id;
      if (!id) continue;
      if (!stats[id]) stats[id] = {
        name: clubMap[id]?.name ?? "Unknown",
        slug: clubMap[id]?.slug ?? "",
        plan: clubMap[id]?.plan ?? "",
        link_visits: 0, forms_started: 0, forms_submitted: 0,
        guide_opens: 0, pdf_prints: 0, pin_success: 0, pin_failed: 0,
      };
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
    { label: "Forms started",    value: formsStarted,    pctOfFirst: linkVisits > 0 ? Math.round((formsStarted    / linkVisits) * 100) : 0 },
    { label: "Forms submitted",  value: formsSubmitted,  pctOfFirst: linkVisits > 0 ? Math.round((formsSubmitted  / linkVisits) * 100) : 0 },
    { label: "Guide opens",      value: guideOpens,      pctOfFirst: linkVisits > 0 ? Math.round((guideOpens      / linkVisits) * 100) : 0 },
    { label: "Guides delivered", value: guidesDelivered, pctOfFirst: linkVisits > 0 ? Math.round((guidesDelivered / linkVisits) * 100) : 0 },
  ];

  const kpis = [
    {
      label: "Link visits", value: linkVisits, trend: trends.linkVisits,
      accent: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    },
    {
      label: "Forms started", value: formsStarted,
      accent: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    },
    {
      label: "Forms submitted", value: formsSubmitted, trend: trends.formsSubmitted, sub: `${conversionRate}% conversion`,
      accent: "text-green-700", bg: "bg-green-50", border: "border-green-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Guide opens", value: guideOpens, trend: trends.guideOpens,
      accent: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    },
    {
      label: "PDF prints", value: pdfPrints, trend: trends.pdfPrints,
      accent: "text-purple-700", bg: "bg-purple-50", border: "border-purple-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
    },
    {
      label: "Guides delivered", value: guidesDelivered, sub: "status = delivered",
      accent: "text-orange-700", bg: "bg-orange-50", border: "border-orange-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
  ];

  return (
    <div className="p-8 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-sm text-muted mt-1">Event data across institutions and guides.</p>
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-xl border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-foreground">Conversion funnel</h2>
          <span className="text-xs text-muted">{linkVisits} link visits total</span>
        </div>
        <div className="flex flex-col gap-3">
          {funnelSteps.map((step, i) => (
            <FunnelBar key={step.label} {...step} colorIdx={i} max={funnelMax} />
          ))}
        </div>
      </div>

      {/* Per-institution table */}
      {clubRows.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-foreground mb-4">By institution</h2>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">Institution</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">Visits</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">Started</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">Submitted</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">Opens</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">PDFs</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">PIN ok/fail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clubRows.map((c) => (
                  <tr key={c.slug || c.name} className="hover:bg-surface/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{c.name}</span>
                        {c.plan && (
                          <span className="text-[10px] font-bold bg-brand-50 text-brand-600 border border-brand-100 px-1.5 py-0.5 rounded-full capitalize">{c.plan}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-muted">{c.link_visits}</td>
                    <td className="px-4 py-3 text-right text-muted">{c.forms_started}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{c.forms_submitted}</td>
                    <td className="px-4 py-3 text-right text-muted">{c.guide_opens}</td>
                    <td className="px-4 py-3 text-right text-muted">{c.pdf_prints}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-green-600 font-medium">{c.pin_success}</span>
                      <span className="text-muted mx-1">/</span>
                      <span className="text-red-500 font-medium">{c.pin_failed}</span>
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
          <h2 className="text-sm font-bold text-foreground">Recent events</h2>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white text-foreground outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">Institution</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentEvents.map((e, i) => (
                  <tr key={i} className="hover:bg-surface/60 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        e.event_type === "form_submitted"      ? "bg-green-50 text-green-700 border-green-100" :
                        e.event_type === "guide_opened"        ? "bg-brand-50 text-brand-700 border-brand-100" :
                        e.event_type === "pdf_printed"         ? "bg-purple-50 text-purple-700 border-purple-100" :
                        e.event_type === "pin_attempt_failed"  ? "bg-red-50 text-red-600 border-red-100" :
                        e.event_type === "pin_attempt_success" ? "bg-green-50 text-green-700 border-green-100" :
                        "bg-gray-50 text-gray-600 border-gray-100"
                      }`}>
                        {EVENT_LABELS[e.event_type] ?? e.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted text-sm">
                      {e.club_id ? (clubMap[e.club_id]?.name ?? "—") : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-muted text-xs whitespace-nowrap">
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
