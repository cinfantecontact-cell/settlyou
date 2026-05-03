"use client";

import { useState, useMemo } from "react";
import ResendButton from "./ResendButton";
import StatusBadge from "../../_components/StatusBadge";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "submitted", label: "Received" },
  { value: "generating", label: "Generating" },
  { value: "under_review", label: "Quality Check" },
  { value: "approved", label: "Ready to Send" },
  { value: "delivered", label: "Sent to Student" },
];

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

const DEMO_ATHLETE = {
  id: "demo",
  athlete_name: "Carlos Mendez",
  athlete_email: "carlos.m@example.com",
  status: "delivered",
  created_at: "2026-04-22T10:00:00Z",
};
const DEMO_DOCS = { passport: true, transcript: true };

const DEFAULT_COACH_DOC_COLS = [
  { key: "passport", label: "Passport" },
  { key: "visa", label: "Medical Form" },
  { key: "transcript", label: "Transcript" },
  { key: "english_test", label: "English Test" },
  { key: "eligibility_form", label: "Eligibility" },
];

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-brand-100 text-brand-700",
  "bg-pink-100 text-pink-700",
];

function Avatar({ name }) {
  const initials = (name ?? "?").split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const idx = (name ?? "").charCodeAt(0) % AVATAR_COLORS.length;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[idx]}`}>
      {initials}
    </div>
  );
}

function DocDot({ uploaded, label }) {
  return (
    <div className="relative group flex items-center justify-center">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-default ${uploaded ? "bg-brand-500 border-brand-500" : "bg-white border-border"}`}>
        {uploaded && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
        <span className={uploaded ? "text-brand-300" : "text-gray-400"}>{uploaded ? "✓ " : "○ "}</span>
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

export default function AthletesTable({ requests, isCoach = false, docsByRequest = {}, coachDocCols = null }) {
  const COACH_DOC_COLS = (coachDocCols ?? DEFAULT_COACH_DOC_COLS).slice(0, 10);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [bulkState, setBulkState] = useState("idle");

  const sports = useMemo(() => {
    const s = new Set(requests.map((r) => r.sport).filter(Boolean));
    return Array.from(s).sort();
  }, [requests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (name && !r.athlete_name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (sport && r.sport !== sport) return false;
      if (status && r.status !== status) return false;
      if (dateFrom && new Date(r.created_at) < new Date(dateFrom)) return false;
      if (dateTo && new Date(r.created_at) > new Date(dateTo + "T23:59:59")) return false;
      return true;
    });
  }, [requests, name, sport, status, dateFrom, dateTo]);

  const hasFilters = name || sport || status || dateFrom || dateTo;

  function clearFilters() {
    setName(""); setSport(""); setStatus(""); setDateFrom(""); setDateTo("");
  }

  const selectableIds = useMemo(() => filtered.filter(r => r.status === "delivered" && r.athlete_email).map(r => r.id), [filtered]);
  const allSelected = selectableIds.length > 0 && selectableIds.every(id => selected.has(id));

  function toggleAll() {
    if (allSelected) {
      setSelected(prev => { const n = new Set(prev); selectableIds.forEach(id => n.delete(id)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); selectableIds.forEach(id => n.add(id)); return n; });
    }
  }

  function toggleRow(id) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function bulkResend() {
    if (selected.size === 0) return;
    setBulkState("sending");
    const ids = Array.from(selected);
    await Promise.all(ids.map(id => fetch(`/api/requests/${id}/resend`, { method: "POST" })));
    setBulkState("done");
    setSelected(new Set());
    setTimeout(() => setBulkState("idle"), 3000);
  }

  function exportCsv() {
    const statusLabel = { submitted: "Received", generating: "Generating", under_review: "Quality Check", approved: "Ready to Send", delivered: "Sent to Student" };
    const headers = ["Name", "Email", "Status", "Date"];
    const rows = filtered.map(r => [
      r.athlete_name || "",
      r.athlete_email || "",
      statusLabel[r.status] || r.status,
      new Date(r.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "students.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-sm pl-8 pr-3 py-1.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors w-48"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {sports.length > 0 && (
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors"
            >
              <option value="">All sports</option>
              {sports.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors w-32"
            />
            <span className="text-xs text-muted">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors w-32"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selected.size > 0 && (
            <button
              onClick={bulkResend}
              disabled={bulkState === "sending"}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50"
            >
              {bulkState === "sending" ? `Sending ${selected.size} emails...` : bulkState === "done" ? "Sent!" : `Resend to selected (${selected.size})`}
            </button>
          )}
          <button
            onClick={exportCsv}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
          >
            Export CSV
          </button>
          <span className="text-xs text-muted">{filtered.length} of {requests.length}</span>
        </div>
      </div>

      {/* Demo banner for empty coach view */}
      {isCoach && requests.length === 0 && (
        <div className="mb-3 flex items-start gap-3 px-4 py-3 rounded-xl border border-brand-200 bg-brand-50 text-sm text-brand-700">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          </svg>
          <span>This is a sample student so you can explore the platform. Your real athletes will appear here once they complete the form.</span>
        </div>
      )}

      {/* Table */}
      <div id="tour-athletes-table" className="bg-white border border-border rounded-xl overflow-x-auto">
        {filtered.length === 0 && requests.length > 0 ? (
          <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No students match your filters</p>
            <button onClick={clearFilters} className="text-xs text-brand-600 hover:underline">Clear filters</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {!isCoach && (
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded border-border"
                      title="Select all delivered students"
                    />
                  </th>
                )}
                <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    Student
                    <svg className="w-3 h-3 opacity-40" title="Visible only to authorized staff" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </th>
                {!isCoach && sports.length > 0 && <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sport</th>}
                <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Guide Status</th>
                {isCoach && <th className="px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider text-center">Documents</th>}
                <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Demo row shown only when coach has no real athletes */}
              {isCoach && requests.length === 0 && (
                <tr className="border-b border-border last:border-0 bg-brand-50/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={DEMO_ATHLETE.athlete_name} />
                      <div>
                        <a href="/club/athletes/demo" className="font-medium text-foreground hover:underline">{DEMO_ATHLETE.athlete_name}</a>
                        <p className="text-xs text-muted">{DEMO_ATHLETE.athlete_email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-100 text-brand-600 uppercase tracking-wide">Example</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status="delivered" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 justify-center">
                      {COACH_DOC_COLS.map(doc => (
                        <DocDot key={doc.key} label={doc.label} uploaded={!!DEMO_DOCS[doc.key]} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted text-xs">{new Date(DEMO_ATHLETE.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-4 py-4">
                    <a href="/club/athletes/demo" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
                      View details
                    </a>
                  </td>
                </tr>
              )}
              {filtered.map((r) => {
                const isSelectable = r.status === "delivered" && !!r.athlete_email;
                const isStuck = (r.status === "submitted" || r.status === "generating") && Date.now() - new Date(r.created_at).getTime() > TWELVE_HOURS;
                const requestDocs = docsByRequest[r.id] || {};
                return (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    {!isCoach && (
                      <td className="px-4 py-4">
                        {isSelectable && (
                          <input
                            type="checkbox"
                            checked={selected.has(r.id)}
                            onChange={() => toggleRow(r.id)}
                            className="rounded border-border"
                          />
                        )}
                      </td>
                    )}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.athlete_name} />
                        <div>
                          <a href={`/club/athletes/${r.id}`} className="font-medium text-foreground hover:underline">{r.athlete_name || "—"}</a>
                          <p className="text-xs text-muted">{r.athlete_email || ""}</p>
                        </div>
                      </div>
                    </td>
                    {!isCoach && sports.length > 0 && <td className="px-4 py-4 text-muted text-sm whitespace-nowrap">{r.sport || "—"}</td>}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                      {isStuck && (
                        <p className="text-xs text-orange-600 mt-1">Taking longer than usual</p>
                      )}
                    </td>
                    {isCoach && (
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-center">
                          {COACH_DOC_COLS.map(doc => (
                            <DocDot
                              key={doc.key}
                              label={doc.label}
                              uploaded={!!requestDocs[doc.key]}
                            />
                          ))}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-4 text-muted text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <a href={`/club/athletes/${r.id}`} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
                          View details
                        </a>
                        {r.status === "delivered" && r.athlete_link_token && (
                          <>
                            <a
                              href={`/report/${r.athlete_link_token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap"
                            >
                              View guide
                            </a>
                            {!isCoach && r.athlete_email && <ResendButton requestId={r.id} />}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
