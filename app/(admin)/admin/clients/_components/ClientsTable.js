"use client";

import { useState, useMemo } from "react";
import DeleteClubButton from "./DeleteClubButton";

const STATUS_META = {
  active:     { label: "Active",     color: "bg-green-50 text-green-700 border-green-100",  bar: "bg-green-500" },
  inactive:   { label: "Inactive",   color: "bg-gray-100 text-gray-500 border-gray-200",    bar: "bg-gray-300" },
  near_limit: { label: "Near limit", color: "bg-red-50 text-red-600 border-red-100",        bar: "bg-red-400" },
  legacy:     { label: "Legacy",     color: "bg-gray-100 text-gray-400 border-gray-200",    bar: "bg-gray-200" },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-brand-100 text-brand-700",
  "bg-pink-100 text-pink-700",
];

const PLAN_LABELS = {
  "0": "Trial",    trial: "Trial",
  "49": "Starter", starter: "Starter",
  "35": "Growth",  growth: "Growth",
  "25": "Scale",   scale: "Scale",
  enterprise: "Enterprise", custom: "Enterprise",
};

function Avatar({ name }) {
  const initials = (name ?? "?").split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const idx = (name ?? "").charCodeAt(0) % AVATAR_COLORS.length;
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${AVATAR_COLORS[idx]}`}>
      {initials}
    </div>
  );
}

function QuotaBar({ used, limit }) {
  if (!limit) return <span className="text-xs text-muted">{used} / ∞</span>;
  const pct = Math.round((used / limit) * 100);
  const barColor = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-yellow-400" : "bg-brand-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-xs text-muted shrink-0">{used}/{limit}</span>
    </div>
  );
}

function CopyLinkButton({ slug, baseUrl }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e) {
    e.stopPropagation();
    await navigator.clipboard.writeText(`${baseUrl}/join/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
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

function ClientCard({ college, baseUrl, coachCount, baseStatus, isLegacy = false }) {
  const nearLimit = !isLegacy && college.seat_limit && (college.seats_used ?? 0) >= college.seat_limit * 0.9;
  const statusKey = isLegacy ? "legacy" : nearLimit ? "near_limit" : college.active ? "active" : "inactive";
  const meta = STATUS_META[statusKey];
  const plan = PLAN_LABELS[String(college.plan)] ?? (college.plan ? String(college.plan) : "—");
  const location = [college.city, college.country].filter(Boolean).join(", ");

  function handleClick() {
    if (!isLegacy) window.location.href = `/admin/clients/${college.id}`;
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl border border-border hover:border-brand-200 hover:shadow-md transition-all overflow-hidden flex flex-col group ${isLegacy ? "opacity-60" : "cursor-pointer"}`}
    >
      {/* Status bar */}
      <div className={`h-1 w-full ${meta.bar}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={college.name} />
            <div className="min-w-0">
              <p className="font-bold text-foreground text-sm leading-tight truncate">{college.name}</p>
              {location && <p className="text-xs text-muted mt-0.5 truncate">{location}</p>}
            </div>
          </div>
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        {/* Info row */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isLegacy && (
            <span className="text-[10px] font-semibold bg-surface border border-border px-1.5 py-0.5 rounded-full text-muted">{plan}</span>
          )}
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
            <BaseDataDot status={baseStatus} />
            Base data
          </span>
          {!isLegacy && (
            <span className="text-[10px] font-semibold text-muted">
              {coachCount ?? 0} coach{(coachCount ?? 0) !== 1 ? "es" : ""}
            </span>
          )}
        </div>

        {/* Quota bar */}
        {!isLegacy && (
          <div className="bg-surface rounded-lg px-3 py-2">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">Guides used</p>
            <QuotaBar used={college.seats_used ?? 0} limit={college.seat_limit} />
          </div>
        )}

        {/* Actions */}
        {!isLegacy && (
          <div className="flex items-center gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
            <CopyLinkButton slug={college.slug} baseUrl={baseUrl} />
            <a
              href={`/admin/clubs/${college.id}/edit`}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Edit
            </a>
            <DeleteClubButton clubId={college.id} clubName={college.name} />
          </div>
        )}
      </div>
    </div>
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
      if (statusFilter === "near_limit") {
        if (!c.seat_limit || (c.seats_used ?? 0) < c.seat_limit * 0.9) return false;
      }
      return true;
    });
  }, [clubs, search, statusFilter]);

  const hasFilters = search || statusFilter;
  const total = (clubs?.length ?? 0) + (organizations?.length ?? 0);

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
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm pl-8 pr-3 py-1.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors w-48"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="near_limit">Near limit</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted">{filtered.length} of {total}</span>
      </div>

      {/* Cards */}
      {total === 0 ? (
        <div className="bg-white rounded-xl border border-border px-6 py-16 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
            <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">No colleges yet</p>
          <p className="text-xs text-muted">Create your first college to get a join link.</p>
          <a href="/admin/clubs/new" className="text-sm text-brand-600 font-semibold hover:underline">Add a college</a>
        </div>
      ) : filtered.length === 0 && !statusFilter ? (
        <div className="bg-white rounded-xl border border-border px-6 py-16 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-foreground">No colleges match your search</p>
          <button onClick={() => { setSearch(""); setStatusFilter(""); }} className="text-xs text-brand-600 hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((college) => (
            <ClientCard
              key={`club-${college.id}`}
              college={college}
              baseUrl={baseUrl}
              coachCount={coachCountByClub[college.id] ?? 0}
              baseStatus={baseStatusByClub[college.id]}
            />
          ))}
          {!statusFilter && (organizations ?? []).map((org) => (
            <ClientCard
              key={`org-${org.id}`}
              college={org}
              baseUrl={baseUrl}
              isLegacy
            />
          ))}
        </div>
      )}
    </>
  );
}
