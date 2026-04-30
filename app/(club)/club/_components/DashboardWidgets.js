"use client";

import { useState } from "react";
import {
  LineChart, Line, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
} from "recharts";

// ─── Widget registry ────────────────────────────────────────────────────────

const WIDGETS = [
  {
    id: "total_athletes",
    label: "Total Athletes",
    description: "Total athletes registered, with a 7-day trend.",
    size: "sm",
    adminOnly: false,
  },
  {
    id: "guides_sent",
    label: "Guides Sent",
    description: "Count of guides successfully delivered.",
    size: "sm",
    adminOnly: false,
  },
  {
    id: "in_progress",
    label: "In Progress",
    description: "Guides currently being processed.",
    size: "sm",
    adminOnly: false,
  },
  {
    id: "seat_usage",
    label: "Seat Usage",
    description: "Seats used vs. your plan limit.",
    size: "sm",
    adminOnly: false,
  },
  {
    id: "status_breakdown",
    label: "Status Breakdown",
    description: "Distribution of all guide statuses.",
    size: "md",
    adminOnly: false,
  },
  {
    id: "documents_uploaded",
    label: "Documents Uploaded",
    description: "Upload count and completion rate across athletes.",
    size: "md",
    adminOnly: false,
  },
  {
    id: "athletes_by_sport",
    label: "Athletes by Sport",
    description: "Number of athletes per sport.",
    size: "md",
    adminOnly: true,
  },
  {
    id: "coaches",
    label: "Coaches",
    description: "Coach roster with athlete and guide counts.",
    size: "md",
    adminOnly: true,
  },
];

const DEFAULT_VISIBLE = WIDGETS.map((w) => w.id);

// ─── Individual widgets ──────────────────────────────────────────────────────

function TotalAthletesWidget({ total, sparkline }) {
  return (
    <>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Total Athletes</p>
      <p className="text-4xl font-bold leading-none text-foreground">{total}</p>
      <ResponsiveContainer width="100%" height={36}>
        <LineChart data={sparkline}>
          <Line type="monotone" dataKey="count" stroke="#3e9b3e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted -mt-1">Last 7 days</p>
    </>
  );
}

function GuidesSentWidget({ delivered }) {
  return (
    <>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Guides Sent</p>
      <p className="text-4xl font-bold leading-none text-brand-600">{delivered}</p>
    </>
  );
}

function InProgressWidget({ inProgress, statusCounts }) {
  const pills = [
    { key: "submitted", label: "Received", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { key: "generating", label: "Generating", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
    { key: "under_review", label: "Quality Check", color: "bg-orange-50 text-orange-700 border-orange-100" },
    { key: "approved", label: "Ready", color: "bg-green-50 text-green-700 border-green-100" },
  ].filter((p) => statusCounts[p.key] > 0);

  return (
    <>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">In Progress</p>
      <p className="text-4xl font-bold leading-none text-foreground">{inProgress}</p>
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {pills.map((p) => (
            <span key={p.key} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${p.color}`}>
              {statusCounts[p.key]} {p.label}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function SeatUsageWidget({ seatsUsed, seatLimit }) {
  const pct = seatLimit > 0 ? Math.round((seatsUsed / seatLimit) * 100) : 0;
  const nearLimit = pct >= 80;
  return (
    <>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Seat Usage</p>
      <p className="text-4xl font-bold leading-none text-foreground">
        {seatsUsed}
        <span className="text-lg text-muted font-normal"> / {seatLimit}</span>
      </p>
      <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${nearLimit ? "bg-orange-400" : "bg-brand-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted -mt-1">{pct}% used</p>
    </>
  );
}

const STATUS_COLORS = {
  submitted: "#93c5fd",
  generating: "#fde68a",
  under_review: "#fdba74",
  approved: "#86efac",
  delivered: "#4ade80",
};

const STATUS_LABELS = {
  submitted: "Received",
  generating: "Generating",
  under_review: "Quality Check",
  approved: "Ready to Send",
  delivered: "Delivered",
};

function StatusBreakdownWidget({ statusCounts, delivered }) {
  const entries = [
    ...Object.entries(statusCounts),
    ["delivered", delivered],
  ].filter(([, v]) => v > 0);

  if (entries.length === 0) {
    return (
      <>
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Status Breakdown</p>
        <p className="text-sm text-muted mt-2">No data yet.</p>
      </>
    );
  }

  const pieData = entries.map(([key, value]) => ({ name: STATUS_LABELS[key] || key, value, key }));

  return (
    <>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Status Breakdown</p>
      <div className="flex items-center gap-4">
        <PieChart width={80} height={80}>
          <Pie
            data={pieData}
            cx={35}
            cy={35}
            innerRadius={22}
            outerRadius={35}
            dataKey="value"
            strokeWidth={0}
          >
            {pieData.map((entry) => (
              <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || "#d1d5db"} />
            ))}
          </Pie>
        </PieChart>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {pieData.map((entry) => (
            <div key={entry.key} className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLORS[entry.key] || "#d1d5db" }} />
              <span className="text-xs text-muted truncate">{entry.name}</span>
              <span className="text-xs font-semibold text-foreground ml-auto">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function DocumentsWidget({ docStats }) {
  if (!docStats) {
    return (
      <>
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Documents Uploaded</p>
        <p className="text-sm text-muted mt-2">No delivered guides yet.</p>
      </>
    );
  }
  return (
    <>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Documents Uploaded</p>
      <div className="flex items-end gap-6">
        <div>
          <p className="text-3xl font-bold text-foreground">{docStats.totalUploaded}</p>
          <p className="text-xs text-muted">uploaded</p>
        </div>
        <div>
          <p className={`text-3xl font-bold ${docStats.totalMissing > 0 ? "text-orange-500" : "text-foreground"}`}>{docStats.totalMissing}</p>
          <p className="text-xs text-muted">missing</p>
        </div>
        <div className="ml-auto text-right">
          <p className={`text-3xl font-bold ${docStats.completionPct === 100 ? "text-brand-600" : "text-foreground"}`}>{docStats.completionPct}%</p>
          <p className="text-xs text-muted">complete</p>
        </div>
      </div>
      {docStats.mostMissedLabel && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Most missed:</span>
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{docStats.mostMissedLabel}</span>
        </div>
      )}
    </>
  );
}

function AthletesBySportWidget({ sportCounts }) {
  if (!sportCounts || sportCounts.length === 0) {
    return (
      <>
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Athletes by Sport</p>
        <p className="text-sm text-muted mt-2">No data yet.</p>
      </>
    );
  }
  const data = sportCounts.map(([sport, count]) => ({ sport, count }));
  return (
    <>
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Athletes by Sport</p>
      <ResponsiveContainer width="100%" height={Math.max(80, data.length * 24)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="sport" width={90} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "none" }}
            formatter={(v) => [v, "Athletes"]}
          />
          <Bar dataKey="count" fill="#3e9b3e" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

function CoachesWidget({ coaches }) {
  if (!coaches || coaches.length === 0) {
    return (
      <>
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Coaches</p>
        <p className="text-sm text-muted mt-2">No coaches yet.</p>
        <a href="/club/coaches" className="text-xs font-semibold text-brand-600 hover:underline mt-auto">Invite a coach</a>
      </>
    );
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Coaches</p>
        <a href="/club/coaches" className="text-xs text-brand-600 hover:underline font-medium">Manage</a>
      </div>
      <p className="text-4xl font-bold leading-none text-foreground">{coaches.length}</p>
      <div className="flex flex-col gap-2 mt-1">
        {coaches.slice(0, 3).map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{c.full_name || "—"}</p>
              <p className="text-[10px] text-muted">{c.sport || "No sport"}</p>
            </div>
            <div className="flex gap-3 shrink-0 text-right">
              <div>
                <p className="text-xs font-semibold text-foreground">{c.athleteCount}</p>
                <p className="text-[10px] text-muted">athletes</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-600">{c.deliveredCount}</p>
                <p className="text-[10px] text-muted">guides</p>
              </div>
            </div>
          </div>
        ))}
        {coaches.length > 3 && (
          <p className="text-xs text-muted">+{coaches.length - 3} more</p>
        )}
      </div>
    </>
  );
}

// ─── Widget dispatch ─────────────────────────────────────────────────────────

function renderWidget(id, data) {
  switch (id) {
    case "total_athletes":
      return <TotalAthletesWidget total={data.total} sparkline={data.sparkline} />;
    case "guides_sent":
      return <GuidesSentWidget delivered={data.delivered} />;
    case "in_progress":
      return <InProgressWidget inProgress={data.inProgress} statusCounts={data.statusCounts} />;
    case "seat_usage":
      return <SeatUsageWidget seatsUsed={data.seatsUsed} seatLimit={data.seatLimit} />;
    case "status_breakdown":
      return <StatusBreakdownWidget statusCounts={data.statusCounts} delivered={data.delivered} />;
    case "documents_uploaded":
      return <DocumentsWidget docStats={data.docStats} />;
    case "athletes_by_sport":
      return <AthletesBySportWidget sportCounts={data.sportCounts} />;
    case "coaches":
      return <CoachesWidget coaches={data.coaches} />;
    default:
      return null;
  }
}

// ─── Widget card shell ────────────────────────────────────────────────────────

function WidgetCard({ id, label, size, onRemove, children }) {
  const colClass = size === "sm" ? "col-span-1" : size === "md" ? "col-span-2" : "col-span-4";
  return (
    <div className={`${colClass} bg-white border border-border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-brand-100 transition-all duration-200 relative group`}>
      <button
        onClick={() => onRemove(id)}
        aria-label={`Remove ${label}`}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full bg-white border border-border text-muted hover:text-foreground hover:bg-surface flex items-center justify-center text-sm leading-none"
      >
        ×
      </button>
      {children}
    </div>
  );
}

// ─── Add widgets modal ────────────────────────────────────────────────────────

function AddWidgetsModal({ open, onClose, widgets, visibleIds, onToggle }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Customize dashboard</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl leading-none w-6 h-6 flex items-center justify-center">×</button>
        </div>
        <div className="px-6 py-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {widgets.map((w) => (
            <label key={w.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleIds.includes(w.id)}
                onChange={() => onToggle(w.id)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-brand-600"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{w.label}</p>
                <p className="text-xs text-muted mt-0.5">{w.description}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="border rounded-full px-4 py-1.5 text-sm font-medium border-border text-foreground hover:bg-surface transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function DashboardWidgets(props) {
  const { isAdmin } = props;

  const [visibleIds, setVisibleIds] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_VISIBLE;
    const stored = localStorage.getItem("settl_dashboard_widgets_v1");
    return stored ? JSON.parse(stored) : DEFAULT_VISIBLE;
  });

  const [modalOpen, setModalOpen] = useState(false);

  const eligibleWidgets = WIDGETS.filter((w) => {
    if (w.adminOnly && !isAdmin) return false;
    return true;
  });

  const visibleWidgets = eligibleWidgets.filter((w) => visibleIds.includes(w.id));
  const hasHidden = eligibleWidgets.some((w) => !visibleIds.includes(w.id));

  function removeWidget(id) {
    setVisibleIds((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem("settl_dashboard_widgets_v1", JSON.stringify(next));
      return next;
    });
  }

  function toggleWidget(id) {
    setVisibleIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("settl_dashboard_widgets_v1", JSON.stringify(next));
      return next;
    });
  }

  return (
    <div id="tour-stats">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted font-medium uppercase tracking-wider">Overview</p>
        {hasHidden && (
          <button
            onClick={() => setModalOpen(true)}
            className="border rounded-full px-4 py-1.5 text-sm font-medium border-border text-foreground hover:bg-surface transition-colors flex items-center gap-1.5"
          >
            <span className="text-base leading-none">+</span> Add
          </button>
        )}
      </div>

      {/* Widget grid */}
      {visibleWidgets.length === 0 ? (
        <div className="col-span-4 border border-dashed border-border rounded-xl p-10 text-center">
          <p className="text-sm text-muted mb-3">Your dashboard is empty.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="border rounded-full px-4 py-1.5 text-sm font-medium border-border text-foreground hover:bg-surface transition-colors"
          >
            + Add widgets
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {visibleWidgets.map((w) => (
            <WidgetCard key={w.id} id={w.id} label={w.label} size={w.size} onRemove={removeWidget}>
              {renderWidget(w.id, props)}
            </WidgetCard>
          ))}
        </div>
      )}

      {/* Always-visible "customize" button when all widgets are shown */}
      {!hasHidden && visibleWidgets.length > 0 && (
        <div className="flex justify-end mt-2">
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Customize
          </button>
        </div>
      )}

      <AddWidgetsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        widgets={eligibleWidgets}
        visibleIds={visibleIds}
        onToggle={toggleWidget}
      />
    </div>
  );
}
