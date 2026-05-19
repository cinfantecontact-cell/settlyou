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

const BASE_KEYS = new Set(BASE_DOCUMENT_TYPES.map(d => d.key));

function buildInitialState(initialConfig) {
  const disabled = new Set(initialConfig?.disabled_base_docs || []);
  const docSettings = initialConfig?.doc_settings || {};
  const customDocs = initialConfig?.custom_docs || [];

  // Build active list: enabled base docs + custom docs, sorted by order
  const baseDocs = BASE_DOCUMENT_TYPES
    .filter(d => !disabled.has(d.key))
    .map(d => {
      const s = docSettings[d.key] || {};
      return { key: d.key, label: d.label, isBase: true, visibility: s.visibility || "all", order: s.order != null ? s.order : 9999 };
    });

  const customActive = customDocs.map(d => ({
    key: d.id,
    label: d.label,
    isBase: false,
    visibility: d.visibility || "all",
    order: d.order != null ? d.order : 9999,
  }));

  const active = [...baseDocs, ...customActive].sort((a, b) => a.order - b.order);

  return { active, disabledBaseKeys: disabled };
}

export default function SportDocConfigForm({ sport, initialConfig }) {
  const init = buildInitialState(initialConfig);
  const [activeDocs, setActiveDocs] = useState(init.active);
  const [disabledBaseKeys, setDisabledBaseKeys] = useState(init.disabledBaseKeys);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  function disableBase(key) {
    setActiveDocs(prev => prev.filter(d => d.key !== key));
    setDisabledBaseKeys(prev => new Set([...prev, key]));
  }

  function enableBase(key) {
    const docDef = BASE_DOCUMENT_TYPES.find(d => d.key === key);
    if (!docDef) return;
    setDisabledBaseKeys(prev => { const next = new Set(prev); next.delete(key); return next; });
    setActiveDocs(prev => [...prev, { key, label: docDef.label, isBase: true, visibility: "all", order: 9999 }]);
  }

  function removeCustom(key) {
    setActiveDocs(prev => prev.filter(d => d.key !== key));
  }

  function setVisibility(key, visibility) {
    setActiveDocs(prev => prev.map(d => d.key === key ? { ...d, visibility } : d));
  }

  function addCustom() {
    if (!newLabel.trim()) return;
    setActiveDocs(prev => [...prev, {
      key: crypto.randomUUID(),
      label: newLabel.trim(),
      isBase: false,
      visibility: "all",
      order: 9999,
    }]);
    setNewLabel("");
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const doc_settings = Object.fromEntries(
      activeDocs
        .filter(d => d.isBase)
        .map((d, i) => [d.key, { visibility: d.visibility, order: i }])
    );

    const custom_docs = activeDocs
      .filter(d => !d.isBase)
      .map((d, i) => ({ id: d.key, label: d.label, required: true, visibility: d.visibility, order: i }));

    const res = await fetch("/api/club/sport-doc-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sport,
        disabled_base_docs: Array.from(disabledBaseKeys),
        custom_docs,
        doc_settings,
      }),
    });

    setLoading(false);
    if (res.ok) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Failed to save.");
    }
  }

  const disabledBaseList = BASE_DOCUMENT_TYPES.filter(d => disabledBaseKeys.has(d.key));

  return (
    <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-1">Required uploads for {sport} athletes</h2>
        <p className="text-xs text-muted">Set visibility to show a document only to international or domestic athletes.</p>
      </div>

      {/* Active docs */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">Active documents</p>
        {activeDocs.length === 0 && (
          <p className="text-xs text-muted italic px-1">No documents enabled. Add custom docs or re-enable standard ones below.</p>
        )}
        {activeDocs.map((doc) => (
          <div
            key={doc.key}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-brand-200 bg-brand-50 text-left"
          >
            {doc.isBase ? (
              <button
                type="button"
                onClick={() => disableBase(doc.key)}
                title="Disable this document"
                className="w-4 h-4 rounded border-2 border-brand-500 bg-brand-500 flex items-center justify-center shrink-0 hover:border-red-400 hover:bg-red-400 transition-colors"
              >
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <div className="w-4 h-4 rounded border-2 border-brand-500 bg-brand-500 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <span className="text-sm flex-1 text-foreground truncate">{doc.label}</span>

            {/* Visibility select */}
            <select
              value={doc.visibility}
              onChange={e => setVisibility(doc.key, e.target.value)}
              onClick={e => e.stopPropagation()}
              className="text-xs border border-border rounded-md px-2 py-1 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 shrink-0"
            >
              <option value="all">All athletes</option>
              <option value="international">Internationals only</option>
              <option value="domestic">US residents only</option>
            </select>

            {/* Remove button for custom docs */}
            {!doc.isBase && (
              <button
                type="button"
                onClick={() => removeCustom(doc.key)}
                className="text-xs text-muted hover:text-red-600 transition-colors shrink-0 ml-1"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Disabled base docs */}
      {disabledBaseList.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Disabled documents</p>
          <div className="flex flex-wrap gap-2">
            {disabledBaseList.map(doc => (
              <button
                key={doc.key}
                type="button"
                onClick={() => enableBase(doc.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface text-xs text-muted hover:border-brand-300 hover:text-foreground transition-colors"
                title="Click to re-enable"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {doc.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add custom document */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">Add custom document</p>
        <div className="flex gap-2">
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
        <span className="text-xs text-muted">{activeDocs.length} document{activeDocs.length !== 1 ? "s" : ""} required</span>
        {success && <span className="text-sm text-brand-600 font-medium">Saved!</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </div>
  );
}
