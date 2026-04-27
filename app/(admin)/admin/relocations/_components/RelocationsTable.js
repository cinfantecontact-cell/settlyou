"use client";

import { useState, useMemo } from "react";
import GenerateButton from "./GenerateButton";
import GeneratingBadge from "./GeneratingBadge";
import DeleteRelocationButton from "./DeleteRelocationButton";
import ApproveRelocationButton from "./ApproveRelocationButton";

const STATUS_COLORS = {
  submitted: "bg-yellow-100 text-yellow-800",
  generating: "bg-blue-100 text-blue-800",
  under_review: "bg-purple-100 text-purple-800",
  approved: "bg-brand-100 text-brand-800",
  delivered: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS = {
  submitted: "Submitted",
  generating: "Generating...",
  under_review: "Under review",
  approved: "Approved",
  delivered: "Delivered",
};

function formatCountry(c) {
  return c || "";
}

export default function RelocationsTable({ requests }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [club, setClub] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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
      if (dateFrom && new Date(r.created_at) < new Date(dateFrom)) return false;
      if (dateTo && new Date(r.created_at) > new Date(dateTo + "T23:59:59")) return false;
      return true;
    });
  }, [requests, search, status, club, dateFrom, dateTo]);

  const hasFilters = search || status || club || dateFrom || dateTo;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:border-brand-400 transition-colors w-44"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:border-brand-400 transition-colors"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select
          value={club}
          onChange={(e) => setClub(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:border-brand-400 transition-colors max-w-[180px]"
        >
          <option value="">All institutions</option>
          {clubs.map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:border-brand-400 transition-colors"
        />
        <span className="text-xs text-muted">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:border-brand-400 transition-colors"
        />
        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatus(""); setClub(""); setDateFrom(""); setDateTo(""); }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted">{filtered.length} of {requests.length}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            {requests.length === 0 ? "No relocation requests yet." : "No requests match your filters."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">Student</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Institution</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Destination</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Timer</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => window.location.href = `/admin/relocations/${req.id}`}
                  className="hover:bg-surface transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{req.athlete_name}</td>
                  <td className="px-4 py-3 text-muted">
                    {req.organizations?.name ?? req.clubs?.name ?? "—"}
                    {req.submitted_by_athlete && (
                      <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">self-submitted</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{req.destination_city}, {formatCountry(req.destination_country)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-600">
                      {req.athlete_type === "college" ? (req.is_part_of_team ? "Athlete" : "Student") : "Pro"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "generating" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Generating…
                      </span>
                    ) : (
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[req.status]}`}>
                        {STATUS_LABELS[req.status]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "generating" ? (
                      <GeneratingBadge startedAt={req.created_at} />
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {req.status === "submitted" && <GenerateButton requestId={req.id} />}
                      {req.status === "under_review" && <ApproveRelocationButton requestId={req.id} />}
                      <DeleteRelocationButton requestId={req.id} athleteName={req.athlete_name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
