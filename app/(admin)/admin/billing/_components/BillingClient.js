"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = ["Squad", "Roster", "Program", "Department", "Custom"];
const COST_CATEGORIES = ["Claude API", "Vercel", "Supabase", "Domain", "Design", "Marketing", "Other"];

const STATUS_STYLES = {
  paid:    "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
};

const emptyRevenue = () => ({
  club_id: "", club_name: "", plan: "", amount_usd: "", status: "paid",
  billing_date: new Date().toISOString().slice(0, 10), notes: "", record_type: "revenue",
});

const emptyCost = () => ({
  club_name: "", category: "", amount_usd: "", status: "paid",
  billing_date: new Date().toISOString().slice(0, 10), notes: "", record_type: "cost",
});

function InlineStatusSelect({ recordId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(e) {
    const next = e.target.value;
    setSaving(true);
    await fetch(`/api/admin/billing/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setStatus(next);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="relative inline-flex">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className={`appearance-none text-xs font-semibold px-2.5 py-1 rounded-full pr-6 cursor-pointer border outline-none focus:ring-2 focus:ring-brand-200 disabled:opacity-50 ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
      >
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
      </select>
      <svg className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export default function BillingClient({ billing, clubs }) {
  const router = useRouter();
  const [tab, setTab] = useState("revenue");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyRevenue());
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function openForm(type) {
    setForm(type === "cost" ? emptyCost() : emptyRevenue());
    setError(null);
    setShowForm(true);
    setTab(type);
  }

  function handleClubSelect(clubId) {
    const club = clubs.find((c) => c.id === clubId);
    setForm((f) => ({ ...f, club_id: clubId, club_name: club?.name ?? f.club_name }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
    }
    setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch("/api/admin/billing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    setDeleting(false);
    setDeleteId(null);
    router.refresh();
  }

  const revenue = billing.filter((b) => (b.record_type ?? "revenue") === "revenue");
  const costs   = billing.filter((b) => b.record_type === "cost");

  const totalRevenue   = revenue.reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const paidRevenue    = revenue.filter((b) => b.status === "paid").reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const pendingRevenue = revenue.filter((b) => b.status === "pending").reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const overdueRevenue = revenue.filter((b) => b.status === "overdue").reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const totalCosts     = costs.reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const netProfit      = paidRevenue - totalCosts;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const mrr = revenue
    .filter((b) => b.status === "paid" && b.billing_date >= thirtyDaysAgo)
    .reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const arr = mrr * 12;

  const inputClass = "border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 bg-white w-full";

  const kpis = [
    {
      label: "Paid revenue", value: `$${paidRevenue.toLocaleString()}`,
      accent: "text-green-700", bg: "bg-green-50", border: "border-green-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Total invested", value: `$${totalCosts.toLocaleString()}`,
      accent: "text-red-600", bg: "bg-red-50", border: "border-red-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
    },
    {
      label: "Net profit", value: `${netProfit >= 0 ? "+" : ""}$${netProfit.toLocaleString()}`,
      accent: netProfit >= 0 ? "text-green-700" : "text-red-600",
      bg: netProfit >= 0 ? "bg-green-50" : "bg-red-50",
      border: netProfit >= 0 ? "border-green-100" : "border-red-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    },
    {
      label: "MRR", value: `$${mrr.toLocaleString()}`, sub: `ARR $${arr.toLocaleString()}`,
      accent: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    },
    {
      label: "Pending", value: `$${pendingRevenue.toLocaleString()}`,
      accent: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: "Overdue", value: `$${overdueRevenue.toLocaleString()}`,
      accent: "text-red-600", bg: "bg-red-50", border: "border-red-100",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    },
  ];

  return (
    <div className="p-8 max-w-5xl">

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-foreground mb-2">Delete record?</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">This will permanently remove this record. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-surface transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Billing</h1>
          <p className="text-sm text-muted mt-1">Revenue, costs, and net profit</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openForm("cost")} className="border border-border text-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface transition-colors">
            + Log cost
          </button>
          <button onClick={() => openForm("revenue")} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
            + Log payment
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg ${k.bg} border ${k.border} flex items-center justify-center ${k.accent}`}>
              {k.icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${k.accent}`}>{k.value}</p>
              <p className="text-xs font-medium text-muted mt-0.5">{k.label}</p>
              {k.sub && <p className="text-[11px] text-muted/70 mt-0.5">{k.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Log form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-sm font-bold text-foreground mb-5">
            {form.record_type === "cost" ? "Log a cost" : "Log a payment"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {form.record_type === "revenue" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Institution <span className="text-muted font-normal">(optional)</span></label>
                  <select className={inputClass} value={form.club_id} onChange={(e) => handleClubSelect(e.target.value)}>
                    <option value="">Select an institution…</option>
                    {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Client name *</label>
                  <input className={inputClass} placeholder="e.g. Stanford Athletics" value={form.club_name} onChange={(e) => set("club_name", e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Plan</label>
                  <select className={inputClass} value={form.plan} onChange={(e) => set("plan", e.target.value)}>
                    <option value="">Select plan…</option>
                    {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <select className={inputClass} value={form.status} onChange={(e) => set("status", e.target.value)}>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Description *</label>
                  <input className={inputClass} placeholder="e.g. Claude API — March" value={form.club_name} onChange={(e) => set("club_name", e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
                    <option value="">Select category…</option>
                    {COST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Amount (USD) *</label>
              <input type="number" min="0" step="0.01" className={inputClass} placeholder="e.g. 20" value={form.amount_usd} onChange={(e) => set("amount_usd", e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Date *</label>
              <input type="date" className={inputClass} value={form.billing_date} onChange={(e) => set("billing_date", e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm font-medium text-foreground">Notes <span className="text-muted font-normal">(optional)</span></label>
            <input className={inputClass} placeholder="Any extra detail…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-border">
        {["revenue", "costs"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? "border-brand-600 text-brand-600" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {t === "revenue" ? `Revenue (${revenue.length})` : `Costs (${costs.length})`}
          </button>
        ))}
      </div>

      {/* Revenue table */}
      {tab === "revenue" && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {revenue.length === 0 ? (
            <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">No payments logged yet</p>
              <p className="text-xs text-muted">Click "+ Log payment" to add your first revenue entry.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Notes</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {revenue.map((b) => (
                  <tr key={b.id} className={`hover:bg-surface/60 transition-colors ${b.status === "overdue" ? "bg-red-50/40" : ""}`}>
                    <td className="px-4 py-3 font-semibold text-foreground">{b.club_name}</td>
                    <td className="px-4 py-3">
                      {b.plan ? (
                        <span className="text-[10px] font-bold bg-brand-50 text-brand-600 border border-brand-100 px-1.5 py-0.5 rounded-full capitalize">{b.plan}</span>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 font-bold text-green-700">${b.amount_usd?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <InlineStatusSelect recordId={b.id} currentStatus={b.status} />
                    </td>
                    <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                      {new Date(b.billing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs max-w-[180px] truncate">{b.notes ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDeleteId(b.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Costs table */}
      {tab === "costs" && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {costs.length === 0 ? (
            <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">No costs logged yet</p>
              <p className="text-xs text-muted">Click "+ Log cost" to track your expenses.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-widest">Notes</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {costs.map((b) => (
                  <tr key={b.id} className="hover:bg-surface/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">{b.club_name}</td>
                    <td className="px-4 py-3">
                      {b.category ? (
                        <span className="text-[10px] font-bold bg-surface border border-border px-1.5 py-0.5 rounded-full text-muted">{b.category}</span>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 font-bold text-red-600">-${b.amount_usd?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                      {new Date(b.billing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs max-w-[180px] truncate">{b.notes ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDeleteId(b.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
