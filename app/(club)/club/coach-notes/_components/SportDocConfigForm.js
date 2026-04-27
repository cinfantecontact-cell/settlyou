"use client";

import { useState } from "react";

const BASE_DOCUMENT_TYPES = [
  { key: "passport", label: "Passport Copy" },
  { key: "visa", label: "Medical Form" },
  { key: "transcript", label: "Official Transcript" },
  { key: "transcript_translation", label: "Transcript Translation (if not in English)" },
  { key: "english_test", label: "English Proficiency Test (TOEFL / IELTS / Duolingo)" },
  { key: "eligibility_form", label: "NAIA / NCAA Eligibility Form" },
  { key: "insurance", label: "Health Insurance Card" },
  { key: "photo", label: "Headshot Photo" },
];

export default function SportDocConfigForm({ sport, initialConfig }) {
  const [disabled, setDisabled] = useState(new Set(initialConfig?.disabled_base_docs || []));
  const [customDocs, setCustomDocs] = useState(initialConfig?.custom_docs || []);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  function toggleBase(key) {
    setDisabled(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function addCustom() {
    if (!newLabel.trim()) return;
    setCustomDocs(prev => [...prev, { id: crypto.randomUUID(), label: newLabel.trim(), required: true }]);
    setNewLabel("");
  }

  function removeCustom(id) {
    setCustomDocs(prev => prev.filter(d => d.id !== id));
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/club/sport-doc-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sport,
        disabled_base_docs: Array.from(disabled),
        custom_docs: customDocs,
      }),
    });
    setLoading(false);
    if (res.ok) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Failed to save.");
    }
  }

  const enabledCount = BASE_DOCUMENT_TYPES.length - disabled.size + customDocs.length;

  return (
    <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-1">Required uploads for {sport} athletes</h2>
        <p className="text-xs text-muted">Choose which documents your athletes must submit. Toggle off anything you don&apos;t need — athletes will only see what&apos;s enabled.</p>
      </div>

      {/* Base doc toggles */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">Standard documents</p>
        {BASE_DOCUMENT_TYPES.map(doc => {
          const enabled = !disabled.has(doc.key);
          return (
            <button
              key={doc.key}
              type="button"
              onClick={() => toggleBase(doc.key)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-left transition-colors ${
                enabled
                  ? "border-brand-200 bg-brand-50 text-foreground"
                  : "border-border bg-surface text-muted line-through"
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                enabled ? "border-brand-500 bg-brand-500" : "border-border bg-white"
              }`}>
                {enabled && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm">{doc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Custom docs */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">Custom documents</p>
        {customDocs.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {customDocs.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-brand-200 bg-brand-50">
                <div className="w-4 h-4 rounded border-2 border-brand-500 bg-brand-500 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm flex-1 text-foreground">{doc.label}</span>
                <button type="button" onClick={() => removeCustom(doc.id)} className="text-xs text-muted hover:text-red-600 transition-colors shrink-0">Remove</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-1">
          <input
            type="text"
            placeholder="e.g. Athletic clearance form"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustom())}
            className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!newLabel.trim()}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-border">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 px-6"
        >
          {loading ? "Saving..." : "Save document list"}
        </button>
        <span className="text-xs text-muted">{enabledCount} document{enabledCount !== 1 ? "s" : ""} required</span>
        {success && <span className="text-sm text-brand-600 font-medium">Saved!</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </div>
  );
}
