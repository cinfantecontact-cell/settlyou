"use client";

import { useState, useMemo } from "react";
import ResendButton from "./ResendButton";
import { formatCountry } from "@/lib/format-country";

export default function AthletesTable({ requests, isPremium, openMap }) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const sports = useMemo(() => {
    const s = new Set(requests.map((r) => r.sport).filter(Boolean));
    return Array.from(s).sort();
  }, [requests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (name && !r.athlete_name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (sport && r.sport !== sport) return false;
      if (dateFrom && new Date(r.created_at) < new Date(dateFrom)) return false;
      if (dateTo && new Date(r.created_at) > new Date(dateTo + "T23:59:59")) return false;
      return true;
    });
  }, [requests, name, sport, dateFrom, dateTo]);

  const hasFilters = name || sport || dateFrom || dateTo;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:border-brand-400 transition-colors w-48"
        />
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:border-brand-400 transition-colors"
        >
          <option value="">All sports</option>
          {sports.map((s) => (
            <option key={s} value={s}>{s}</option>
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
            onClick={() => { setName(""); setSport(""); setDateFrom(""); setDateTo(""); }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted">
          {filtered.length} of {requests.length}
        </span>
      </div>

      {/* Table */}
      <div id="tour-athletes-table" className="bg-white border border-border rounded-xl overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-muted">
            {requests.length === 0 ? "No athletes yet. Share your join link to get started." : "No athletes match your filters."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Athlete</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sport</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Destination</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Date</th>
                {isPremium && <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Guide opens</th>}
                {isPremium && <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Last opened</th>}
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{r.athlete_name || "—"}</p>
                    <p className="text-xs text-muted">{r.athlete_email || ""}</p>
                  </td>
                  <td className="px-6 py-4 text-muted text-sm whitespace-nowrap">{r.sport || "—"}</td>
                  <td className="px-6 py-4 text-muted whitespace-nowrap">
                    {r.destination_city}{r.destination_country ? `, ${formatCountry(r.destination_country)}` : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                  {isPremium && (
                    <td className="px-6 py-4">
                      {openMap[r.id]?.count > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">
                          {openMap[r.id].count}×
                        </span>
                      ) : (
                        <span className="text-xs text-muted">Not opened</span>
                      )}
                    </td>
                  )}
                  {isPremium && (
                    <td className="px-6 py-4 text-xs text-muted">
                      {openMap[r.id]?.last_opened
                        ? new Date(openMap[r.id].last_opened).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <a href={`/club/athletes/${r.id}`} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
                        Info
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
                          {r.athlete_email && <ResendButton requestId={r.id} />}
                        </>
                      )}
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

function StatusBadge({ status }) {
  const map = {
    submitted: { label: "Submitted", class: "bg-blue-50 text-blue-700", title: "Received — guide usually ready within 24 hours" },
    generating: { label: "Generating", class: "bg-yellow-50 text-yellow-700", title: "Generating your guide — usually ready within 24 hours" },
    under_review: { label: "Under Review", class: "bg-orange-50 text-orange-700", title: "Under review — almost ready" },
    approved: { label: "Approved", class: "bg-green-50 text-green-700", title: "Approved — being sent to the athlete" },
    delivered: { label: "Delivered", class: "bg-brand-50 text-brand-700", title: null },
  };
  const s = map[status] || { label: status, class: "bg-surface text-muted", title: null };
  return <span title={s.title || undefined} className={`text-xs font-medium px-2 py-1 rounded-full ${s.class}`}>{s.label}</span>;
}
