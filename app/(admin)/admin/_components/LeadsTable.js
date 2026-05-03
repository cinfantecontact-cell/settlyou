"use client";

import { useState, useMemo } from "react";
import LeadStatusSelect from "./LeadStatusSelect";

const STATUS_META = {
  pending:     { label: "Pending",     color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  contacted:   { label: "Contacted",   color: "bg-blue-100 text-blue-800 border-blue-200" },
  deal_closed: { label: "Deal closed", color: "bg-brand-100 text-brand-800 border-brand-200" },
  rejected:    { label: "Rejected",    color: "bg-red-100 text-red-800 border-red-200" },
};

function Avatar({ name }) {
  const initials = (name ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700",
    "bg-brand-100 text-brand-700",
    "bg-pink-100 text-pink-700",
  ];
  const idx = (name ?? "").charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${colors[idx]}`}>
      {initials}
    </div>
  );
}

export default function LeadsTable({ contactRequests }) {
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    return contactRequests.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.full_name?.toLowerCase().includes(q) &&
          !r.organization_name?.toLowerCase().includes(q) &&
          !r.email?.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [contactRequests, search, statusFilter]);

  const selected = contactRequests.find((r) => r.id === selectedId) ?? null;
  const hasFilters = search || statusFilter;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search name, org, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm pl-8 pr-3 py-1.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors w-60"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_META).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted">{filtered.length} of {contactRequests.length}</span>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {!contactRequests?.length ? (
          <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No leads yet</p>
            <p className="text-xs text-muted">Quote requests from the pricing page will appear here.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">No leads match your filters.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Volume</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((req) => {
                const meta = STATUS_META[req.status] ?? STATUS_META.pending;
                return (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedId(req.id === selectedId ? null : req.id)}
                    className={`hover:bg-surface/60 transition-colors cursor-pointer group ${selectedId === req.id ? "bg-brand-50/40" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={req.full_name} />
                        <div>
                          <p className="font-semibold text-foreground leading-none">{req.full_name}</p>
                          <a
                            href={`mailto:${req.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] text-brand-600 hover:underline mt-0.5 block"
                          >
                            {req.email}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground font-medium">{req.organization_name}</p>
                      {req.organization_type && (
                        <p className="text-[11px] text-muted capitalize mt-0.5">{req.organization_type}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{req.volume ?? "—"}</td>
                    <td className="px-4 py-3 text-muted text-sm">{req.country ?? "—"}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <LeadStatusSelect leadId={req.id} currentStatus={req.status} />
                    </td>
                    <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-over panel */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end" onClick={() => setSelectedId(null)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div
            className="relative w-full max-w-md bg-white shadow-2xl border-l border-border h-full overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar name={selected.full_name} />
                <div>
                  <h2 className="text-base font-bold text-foreground leading-tight">{selected.full_name}</h2>
                  <p className="text-xs text-muted mt-0.5">{selected.organization_name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-muted hover:text-foreground transition-colors p-1 rounded-lg hover:bg-surface"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-5 flex flex-col gap-6">

              {/* Status */}
              <div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Status</p>
                <div onClick={(e) => e.stopPropagation()}>
                  <LeadStatusSelect leadId={selected.id} currentStatus={selected.status} />
                </div>
              </div>

              {/* Contact */}
              <div className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-3">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Contact</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted">Email</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-brand-600 hover:underline font-medium">{selected.email}</a>
                  </div>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted">Phone</p>
                      <p className="text-sm text-foreground font-medium">{selected.phone}</p>
                    </div>
                  </div>
                )}
                {selected.role && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted">Role</p>
                      <p className="text-sm text-foreground font-medium">{selected.role}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Organization */}
              <div className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-3">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Organization</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Name", value: selected.organization_name },
                    { label: "Type", value: selected.organization_type, capitalize: true },
                    { label: "Country", value: selected.country },
                    { label: "Volume", value: selected.volume },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label}>
                      <p className="text-[10px] text-muted mb-0.5">{f.label}</p>
                      <p className={`text-sm text-foreground font-medium ${f.capitalize ? "capitalize" : ""}`}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              {selected.message && (
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Message</p>
                  <p className="text-sm text-foreground leading-relaxed bg-surface rounded-xl px-4 py-3 border border-border whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-muted">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Submitted {new Date(selected.created_at).toLocaleDateString("en-US", {
                  weekday: "long", month: "long", day: "numeric", year: "numeric",
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex gap-2">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 text-center bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
              >
                Send email
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-surface transition-colors"
                >
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
