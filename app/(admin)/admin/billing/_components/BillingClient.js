"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = ["Starter", "Club", "Elite", "Program", "Department", "University", "Custom"];
const COST_CATEGORIES = ["Claude API", "Vercel", "Supabase", "Domain", "Design", "Marketing", "Other"];

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-700",
};

const emptyRevenue = () => ({
  club_id: "", club_name: "", plan: "", amount_usd: "", status: "paid",
  billing_date: new Date().toISOString().slice(0, 10), notes: "", record_type: "revenue",
});

const emptyCost = () => ({
  club_name: "", category: "", amount_usd: "", status: "paid",
  billing_date: new Date().toISOString().slice(0, 10), notes: "", record_type: "cost",
});

export default function BillingClient({ billing, clubs }) {
  const router = useRouter();
  const [tab, setTab] = useState("revenue");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyRevenue());

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

  async function handleDelete(id) {
    if (!confirm("Delete this record?")) return;
    await fetch("/api/admin/billing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  const revenue = billing.filter((b) => (b.record_type ?? "revenue") === "revenue");
  const costs = billing.filter((b) => b.record_type === "cost");

  const totalRevenue = revenue.reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const paidRevenue = revenue.filter((b) => b.status === "paid").reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const pendingRevenue = revenue.filter((b) => b.status === "pending").reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const overdueRevenue = revenue.filter((b) => b.status === "overdue").reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const totalCosts = costs.reduce((s, b) => s + (b.amount_usd ?? 0), 0);
  const netProfit = paidRevenue - totalCosts;

  const inputClass = "border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white w-full";

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted mt-1">Revenue, costs, and net profit</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openForm("cost")}
            className="border border-border text-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface transition-colors"
          >
            + Log cost
          </button>
          <button
            onClick={() => openForm("revenue")}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            + Log payment
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">Paid revenue</p>
          <p className="text-2xl font-bold text-green-700">${paidRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">Total invested</p>
          <p className="text-2xl font-bold text-red-500">${totalCosts.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">Net profit</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
            {netProfit >= 0 ? "+" : ""}${netProfit.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">Total revenue</p>
          <p className="text-xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">Pending</p>
          <p className="text-xl font-bold text-yellow-700">${pendingRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-1">Overdue</p>
          <p className="text-xl font-bold text-red-600">${overdueRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-5">
            {form.record_type === "cost" ? "Log a cost" : "Log a payment"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {form.record_type === "revenue" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Club (optional)</label>
                  <select className={inputClass} value={form.club_id} onChange={(e) => handleClubSelect(e.target.value)}>
                    <option value="">Select a club…</option>
                    {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Client name <span className="text-muted font-normal">(required)</span></label>
                  <input className={inputClass} placeholder="e.g. Real Madrid CF" value={form.club_name} onChange={(e) => set("club_name", e.target.value)} required />
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
                  <label className="text-sm font-medium text-foreground">Description <span className="text-muted font-normal">(required)</span></label>
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
              <label className="text-sm font-medium text-foreground">Amount (USD) <span className="text-muted font-normal">(required)</span></label>
              <input type="number" min="0" step="0.01" className={inputClass} placeholder="e.g. 20" value={form.amount_usd} onChange={(e) => set("amount_usd", e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Date <span className="text-muted font-normal">(required)</span></label>
              <input type="date" className={inputClass} value={form.billing_date} onChange={(e) => set("billing_date", e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm font-medium text-foreground">Notes <span className="text-muted font-normal">(optional)</span></label>
            <input className={inputClass} placeholder="Any extra detail…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-colors">
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
            <div className="px-6 py-16 text-center text-sm text-muted">No payments logged yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Notes</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {revenue.map((b) => (
                  <tr key={b.id} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{b.club_name}</td>
                    <td className="px-4 py-3 text-muted">{b.plan ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">${b.amount_usd?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(b.billing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs max-w-[180px] truncate">{b.notes ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(b.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors">Delete</button>
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
            <div className="px-6 py-16 text-center text-sm text-muted">No costs logged yet. Click "+ Log cost" to add one.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Notes</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {costs.map((b) => (
                  <tr key={b.id} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{b.club_name}</td>
                    <td className="px-4 py-3">
                      {b.category ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{b.category}</span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-600">-${b.amount_usd?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(b.billing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs max-w-[180px] truncate">{b.notes ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(b.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors">Delete</button>
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
