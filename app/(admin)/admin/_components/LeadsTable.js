"use client";

import { useState, useMemo } from "react";
import LeadStatusSelect from "./LeadStatusSelect";

const STATUS_LABELS = {
  pending: "Pending",
  contacted: "Contacted",
  deal_closed: "Deal closed",
  rejected: "Rejected",
};

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  deal_closed: "bg-brand-100 text-brand-800",
  rejected: "bg-red-100 text-red-800",
};

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
        <input
          type="text"
          placeholder="Search name, org, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:border-brand-400 transition-colors w-56"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:border-brand-400 transition-colors"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
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
          <div className="px-6 py-12 text-center text-sm text-muted">
            No leads yet.
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            No leads match your filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Organization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Country</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedId(req.id === selectedId ? null : req.id)}
                  className="hover:bg-surface transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{req.full_name}</td>
                  <td className="px-4 py-3 text-foreground">{req.organization_name}</td>
                  <td className="px-4 py-3 capitalize text-muted">{req.organization_type}</td>
                  <td className="px-4 py-3 text-muted">{req.country}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`mailto:${req.email}`}
                      className="text-brand-600 hover:underline text-xs"
                    >
                      {req.email}
                    </a>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <LeadStatusSelect leadId={req.id} currentStatus={req.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(req.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-over panel */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end" onClick={() => setSelectedId(null)}>
          <div
            className="w-full max-w-md bg-white shadow-2xl border-l border-border h-full overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-foreground">{selected.full_name}</h2>
                <p className="text-sm text-muted mt-0.5">{selected.organization_name}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-muted hover:text-foreground transition-colors p-1 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-5 space-y-5">
              {/* Status */}
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Status</p>
                <div onClick={(e) => e.stopPropagation()}>
                  <LeadStatusSelect leadId={selected.id} currentStatus={selected.status} />
                </div>
              </div>

              {/* Contact info */}
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Contact</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted w-12 shrink-0">Email</span>
                    <a href={`mailto:${selected.email}`} className="text-brand-600 hover:underline">{selected.email}</a>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted w-12 shrink-0">Phone</span>
                      <span className="text-foreground">{selected.phone}</span>
                    </div>
                  )}
                  {selected.role && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted w-12 shrink-0">Role</span>
                      <span className="text-foreground">{selected.role}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Organization */}
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Organization</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted w-12 shrink-0">Name</span>
                    <span className="text-foreground">{selected.organization_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted w-12 shrink-0">Type</span>
                    <span className="text-foreground capitalize">{selected.organization_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted w-12 shrink-0">Country</span>
                    <span className="text-foreground">{selected.country}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selected.message && (
                <div>
                  <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Message</p>
                  <p className="text-sm text-foreground leading-relaxed bg-surface rounded-lg px-4 py-3 border border-border whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              )}

              {/* Date */}
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">Submitted</p>
                <p className="text-sm text-muted">
                  {new Date(selected.created_at).toLocaleDateString("en-US", {
                    weekday: "long", month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border">
              <a
                href={`mailto:${selected.email}`}
                className="block w-full text-center bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
              >
                Send email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
