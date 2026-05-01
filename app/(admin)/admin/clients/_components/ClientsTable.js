"use client";

import { useState, useMemo } from "react";
import DeleteClubButton from "./DeleteClubButton";

function QuotaBar({ used, limit }) {
  if (!limit) return <span className="text-xs text-muted">{used} / ∞</span>;
  const pct = Math.round((used / limit) * 100);
  const barColor = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-yellow-400" : "bg-brand-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-xs text-muted">{used}/{limit}</span>
    </div>
  );
}

const PLAN_LABELS = {
  "0": "Trial",    trial: "Trial",
  "49": "Starter", starter: "Starter",
  "35": "Growth",  growth: "Growth",
  "25": "Scale",   scale: "Scale",
  enterprise: "Enterprise", custom: "Enterprise",
};

function CopyLinkButton({ slug, baseUrl }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e) {
    e.stopPropagation();
    await navigator.clipboard.writeText(`${baseUrl}/join/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
          copied
            ? "border-brand-200 bg-brand-50 text-brand-600"
            : "border-border text-muted hover:text-brand-600 hover:border-brand-200"
        }`}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
      <a
        href={`${baseUrl}/join/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
      >
        Open
      </a>
    </div>
  );
}

function BaseDataDot({ status }) {
  if (status === "ready") return (
    <span title="Base data ready" className="w-2 h-2 rounded-full bg-green-500 shrink-0 inline-block" />
  );
  if (status === "generating") return (
    <span title="Base data generating..." className="w-2 h-2 rounded-full bg-yellow-400 shrink-0 inline-block animate-pulse" />
  );
  return (
    <span title={status === "failed" ? "Base data failed" : "No base data yet"} className="w-2 h-2 rounded-full bg-red-400 shrink-0 inline-block" />
  );
}

export default function ClientsTable({ clubs, organizations, baseUrl, coachCountByClub = {}, baseStatusByClub = {} }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    return (clubs ?? []).filter((c) => {
      if (search && !c.name?.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter === "active" && !c.active) return false;
      if (statusFilter === "inactive" && c.active) return false;
      return true;
    });
  }, [clubs, search, statusFilter]);

  const hasFilters = search || statusFilter;
  const total = (clubs?.length ?? 0) + (organizations?.length ?? 0);

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:border-brand-400 transition-colors w-48"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:border-brand-400 transition-colors"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted">{filtered.length} of {total}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {total === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-muted mb-4">No colleges yet. Create your first one to get a join link.</p>
            <a href="/admin/clubs/new" className="text-sm text-brand-600 font-semibold hover:underline">
              Add a college
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">College</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Guides used</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Coaches</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Join link</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((college) => {
                const nearLimit = college.seat_limit && college.seats_used >= college.seat_limit * 0.9;
                const plan = PLAN_LABELS[String(college.plan)] ?? (college.plan ? String(college.plan) : "—");
                return (
                  <tr key={`club-${college.id}`} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {college.logo_url ? (
                          <img src={college.logo_url} alt="" className="w-7 h-7 object-contain rounded shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded bg-surface border border-border shrink-0 flex items-center justify-center text-xs font-bold text-muted">
                            {college.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <BaseDataDot status={baseStatusByClub[college.id]} />
                            <a href={`/admin/clients/${college.id}`} className="font-medium text-foreground hover:text-brand-600 hover:underline">{college.name}</a>
                            {nearLimit && (
                              <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                                Near limit
                              </span>
                            )}
                          </div>
                          <span className="block text-xs text-muted">{college.city}{college.country ? `, ${college.country}` : ""}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{plan}</td>
                    <td className="px-4 py-3">
                      <QuotaBar used={college.seats_used ?? 0} limit={college.seat_limit} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        college.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                      }`}>
                        {college.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/admin/clients/${college.id}`} className="text-xs font-medium text-foreground hover:text-brand-600">
                        {coachCountByClub[college.id] ?? 0} coach{(coachCountByClub[college.id] ?? 0) !== 1 ? "es" : ""}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <CopyLinkButton slug={college.slug} baseUrl={baseUrl} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/clubs/${college.id}/edit`}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          Edit
                        </a>
                        <DeleteClubButton clubId={college.id} clubName={college.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Legacy orgs */}
              {(organizations ?? []).map((org) => (
                <tr key={`org-${org.id}`} className="hover:bg-surface transition-colors opacity-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{org.name}</span>
                    {org.country && <span className="block text-xs text-muted">{org.country}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">—</td>
                  <td className="px-4 py-3 text-xs text-muted">{org.seat_limit ? `— / ${org.seat_limit}` : "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Legacy</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">—</td>
                  <td className="px-4 py-3" />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
