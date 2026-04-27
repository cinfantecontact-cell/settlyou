"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomDocTypesForm({ clubId, initialTypes }) {
  const router = useRouter();
  const [types, setTypes] = useState(initialTypes);
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    if (!label.trim()) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/club/document-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: label.trim(), required }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to add document type.");
      return;
    }

    const { type } = await res.json();
    setTypes(prev => [...prev, type]);
    setLabel("");
    setRequired(false);
    router.refresh();
  }

  async function handleDelete(id) {
    await fetch("/api/club/document-types", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTypes(prev => prev.filter(t => t.id !== id));
    router.refresh();
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Required Documents</h2>
        <p className="text-xs text-muted mt-0.5">Add custom documents your athletes must submit. These appear on their upload page alongside the standard ones.</p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Medical clearance form"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={saving || !label.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {saving ? "Adding..." : "Add"}
            </button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={required}
              onChange={e => setRequired(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-600"
            />
            <span className="text-xs text-muted">Mark as required</span>
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </form>

        {types.length > 0 && (
          <ul className="flex flex-col gap-1 mt-1">
            {types.map(t => (
              <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-foreground truncate">{t.label}</span>
                  {t.required && (
                    <span className="text-xs font-medium text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full shrink-0">Required</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-xs text-muted hover:text-red-600 transition-colors shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
