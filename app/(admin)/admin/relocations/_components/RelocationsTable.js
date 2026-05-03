"use client";

import { useState, useMemo } from "react";
import GenerateButton from "./GenerateButton";
import GeneratingBadge from "./GeneratingBadge";
import DeleteRelocationButton from "./DeleteRelocationButton";
import ApproveRelocationButton from "./ApproveRelocationButton";

const STATUS_META = {
  submitted:    { label: "Submitted",    color: "bg-yellow-50 text-yellow-700 border-yellow-100",  dot: "bg-yellow-400" },
  generating:   { label: "Generating…",  color: "bg-blue-50 text-blue-700 border-blue-100",        dot: "bg-blue-500" },
  under_review: { label: "Under review", color: "bg-purple-50 text-purple-700 border-purple-100",  dot: "bg-purple-500" },
  approved:     { label: "Approved",     color: "bg-brand-50 text-brand-700 border-brand-100",     dot: "bg-brand-500" },
  delivered:    { label: "Delivered",    color: "bg-green-50 text-green-700 border-green-100",     dot: "bg-green-500" },
};

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

function RelocationRow({ req }) {
  const meta = STATUS_META[req.status] ?? STATUS_META.submitted;
  const institution = req.organizations?.name ?? req.clubs?.name ?? "—";
  const type = req.athlete_type === "college" ? (req.is_part_of_team ? "Athlete" : "Student") : "Pro";
  const date = new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const destination = [req.destination_city, req.destination_country].filter(Boolean).join(", ");
  const origin = [req.current_city, req.current_country].filter(Boolean).join(", ");

  return (
    <div
      onClick={() => window.location.href = `/admin/relocations/${req.id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-surface transition-colors cursor-pointer group border-b border-border last:border-b-0"
    >
      {/* Athlete */}
      <div className="flex items-center gap-3 min-w-0 w-52 shrink-0">
        <Avatar name={req.athlete_name} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate leading-snug">{req.athlete_name}</p>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs text-muted truncate">{institution}</span>
            {req.submitted_by_athlete && (
              <span className="shrink-0 bg-purple-100 text-purple-700 px-1 py-0.5 rounded-full text-[10px] font-semibold">self</span>
            )}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Status */}
      <div className="shrink-0 w-32 flex justify-end">
        {req.deleted_at ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-500 border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Deleted by {req.deleted_by === "club_admin" ? "club admin" : "coach"}
          </span>
        ) : req.status === "generating" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Generating…
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        )}
      </div>

      {/* Date */}
      <p className="shrink-0 text-xs text-muted w-24 text-right">{date}</p>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {req.status === "generating" && <GeneratingBadge startedAt={req.created_at} />}
        {req.status === "submitted" && <GenerateButton requestId={req.id} />}
        {req.status === "under_review" && <ApproveRelocationButton requestId={req.id} />}
        <DeleteRelocationButton requestId={req.id} athleteName={req.athlete_name} />
      </div>
    </div>
  );
}

export default function RelocationsTable({ requests }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [club, setClub] = useState("");

  const clubs = useMemo(() => {
    const seen = new Map();
    for (const r of requests) {
      const name = r.organizations?.name ?? r.clubs?.name;
      const key = r.club_id ?? r.organization_id;
      if (name && key && !seen.has(key)) seen.set(key, name);
    }
    return Array.from(seen.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [requests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (search && !r.athlete_name?.toLowerCase().includes(search.toLowerCase())) return false;
      if (status && r.status !== status) return false;
      if (club) {
        const rClub = r.club_id ?? r.organization_id;
        if (rClub !== club) return false;
      }
      return true;
    });
  }, [requests, search, status, club]);

  const hasFilters = search || status || club;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm pl-8 pr-3 py-1.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors w-48"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_META).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select
          value={club}
          onChange={(e) => setClub(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors max-w-[200px]"
        >
          <option value="">All institutions</option>
          {clubs.map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatus(""); setClub(""); }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted">{filtered.length} of {requests.length}</span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-border px-6 py-16 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">{requests.length === 0 ? "No relocation requests yet" : "No requests match your filters"}</p>
          <p className="text-xs text-muted">Requests appear here when athletes submit their intake form.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border bg-surface">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider w-52 shrink-0">Athlete</p>
            <div className="flex-1" />
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider w-32 text-right shrink-0">Status</p>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider w-24 text-right shrink-0">Date</p>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider shrink-0">Actions</p>
          </div>
          {filtered.map((req) => (
            <RelocationRow key={req.id} req={req} />
          ))}
        </div>
      )}
    </>
  );
}
