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

const FORM_TEMPLATES = [
  {
    name: "Emergency Contact",
    description: "Name, relationship, and phone number",
    questions: [
      { label: "Emergency Contact Name", type: "text", required: true },
      { label: "Relationship to Student", type: "text", required: true },
      { label: "Emergency Contact Phone", type: "text", required: true },
      { label: "Emergency Contact Email", type: "text", required: false },
    ],
  },
  {
    name: "Arrival & Orientation",
    description: "Arrival date, orientation, and airport logistics",
    questions: [
      { label: "Planned Arrival Date", type: "text", required: true },
      { label: "Will you attend orientation?", type: "select", options: ["Yes", "No", "Not sure yet"], required: true },
      { label: "Need airport pickup?", type: "select", options: ["Yes", "No", "Not sure yet"], required: false },
      { label: "Flight details (if known)", type: "text", required: false },
    ],
  },
  {
    name: "Housing",
    description: "On-campus or off-campus, roommate preferences",
    questions: [
      { label: "Housing preference", type: "select", options: ["On-campus (dorms)", "Off-campus apartment", "With family or host family", "No preference"], required: true },
      { label: "Roommate preference", type: "text", required: false },
      { label: "Any housing accommodations needed?", type: "text", required: false },
    ],
  },
  {
    name: "Health & Wellness",
    description: "Medical, dietary, and accessibility needs",
    questions: [
      { label: "Dietary restrictions or allergies", type: "text", required: false },
      { label: "Any medical conditions we should be aware of?", type: "text", required: false },
      { label: "Accessibility or accommodation needs?", type: "text", required: false },
      { label: "Do you have health insurance?", type: "select", options: ["Yes — through my family", "Yes — purchasing through the university", "No", "Not sure yet"], required: true },
    ],
  },
  {
    name: "Academic Background",
    description: "Intended major, transfer credits, prior institution",
    questions: [
      { label: "Intended major or program", type: "text", required: true },
      { label: "Are you a transfer student?", type: "select", options: ["Yes", "No"], required: true },
      { label: "Previous institution (if transfer)", type: "text", required: false },
      { label: "Expected credits to transfer", type: "text", required: false },
    ],
  },
  {
    name: "Financial Aid",
    description: "Scholarship, FAFSA, and payment plan",
    questions: [
      { label: "Have you completed the FAFSA?", type: "select", options: ["Yes", "No", "Not applicable (international student)"], required: true },
      { label: "Are you receiving an athletic scholarship?", type: "select", options: ["Yes — full scholarship", "Yes — partial scholarship", "No"], required: true },
      { label: "Preferred payment plan", type: "select", options: ["Full semester payment", "Monthly installment plan", "Not sure yet"], required: false },
    ],
  },
];

function buildInitialState(initialConfig) {
  const activeKeys = new Set(initialConfig?.active_base_docs ?? BASE_DOCUMENT_TYPES.map(d => d.key));
  const docSettings = initialConfig?.doc_settings || {};
  const customDocs = initialConfig?.custom_docs || [];

  const baseDocs = BASE_DOCUMENT_TYPES
    .filter(d => activeKeys.has(d.key))
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
  const disabledBaseKeys = new Set(BASE_DOCUMENT_TYPES.filter(d => !activeKeys.has(d.key)).map(d => d.key));

  return { active, disabledBaseKeys };
}

function SectionIcon({ children, bg, border, color }) {
  return (
    <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center ${color} shrink-0`}>
      {children}
    </div>
  );
}

export default function AdmissionsDocConfig({ initialConfig }) {
  const init = buildInitialState(initialConfig);
  const [activeDocs, setActiveDocs] = useState(init.active);
  const [disabledBaseKeys, setDisabledBaseKeys] = useState(init.disabledBaseKeys);
  const [newLabel, setNewLabel] = useState("");

  // Form questions state
  const [formQuestions, setFormQuestions] = useState(initialConfig?.form_questions || []);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [newQLabel, setNewQLabel] = useState("");
  const [newQType, setNewQType] = useState("text");
  const [newQRequired, setNewQRequired] = useState(true);
  const [newQOptions, setNewQOptions] = useState("");

  // Attachments state
  const [attachments, setAttachments] = useState(initialConfig?.attachments || []);
  const [attachLabel, setAttachLabel] = useState("");
  const [attachUploading, setAttachUploading] = useState(false);
  const [attachError, setAttachError] = useState(null);

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

  function applyTemplate(template) {
    setFormQuestions(prev => {
      const existingLabels = new Set(prev.map(q => q.label));
      const toAdd = template.questions
        .filter(q => !existingLabels.has(q.label))
        .map(q => ({ ...q, id: crypto.randomUUID(), templateName: template.name }));
      return [...prev, ...toAdd];
    });
  }

  function removeTemplateGroup(templateName) {
    setFormQuestions(prev => prev.filter(q => q.templateName !== templateName));
  }

  function addCustomQuestion() {
    if (!newQLabel.trim()) return;
    const q = {
      id: crypto.randomUUID(),
      label: newQLabel.trim(),
      type: newQType,
      required: newQRequired,
    };
    if (newQType === "select") {
      q.options = newQOptions.split(",").map(o => o.trim()).filter(Boolean);
    }
    setFormQuestions(prev => [...prev, q]);
    setNewQLabel(""); setNewQType("text"); setNewQRequired(true); setNewQOptions("");
    setAddingQuestion(false);
  }

  function removeQuestion(id) {
    setFormQuestions(prev => prev.filter(q => q.id !== id));
  }

  async function handleAttachUpload(file) {
    if (!file) return;
    setAttachUploading(true); setAttachError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("label", attachLabel.trim() || file.name);
    const res = await fetch("/api/club/admissions-attachments", { method: "POST", body: fd });
    setAttachUploading(false);
    if (!res.ok) { setAttachError("Upload failed. Try again."); return; }
    const { attachment } = await res.json();
    setAttachments(prev => [...prev, attachment]);
    setAttachLabel("");
  }

  async function removeAttachment(id) {
    await fetch("/api/club/admissions-attachments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attachmentId: id }),
    });
    setAttachments(prev => prev.filter(a => a.id !== id));
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

    const active_base_docs = activeDocs.filter(d => d.isBase).map(d => d.key);

    const res = await fetch("/api/club/admissions-doc-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active_base_docs, doc_settings, custom_docs, form_questions: formQuestions, attachments }),
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
    <div className="flex flex-col gap-6">

      {/* Required uploads */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <SectionIcon bg="bg-brand-50" border="border-brand-100" color="text-brand-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Required uploads for all athletes</h2>
            <p className="text-xs text-muted mt-0.5">Set visibility to show a document only to international or domestic athletes.</p>
          </div>
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
              placeholder="e.g. I-20 form, immunization records..."
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
      </div>

      {/* Form Questions */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <SectionIcon bg="bg-brand-50" border="border-brand-100" color="text-brand-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Form Questions</h2>
            <p className="text-xs text-muted mt-0.5">Collect structured information from athletes alongside their document uploads.</p>
          </div>
        </div>

        {/* Active questions grouped by template */}
        {formQuestions.length > 0 && (() => {
          const groups = [];
          const seen = new Map();
          for (const q of formQuestions) {
            const key = q.templateName ?? "__custom__";
            if (!seen.has(key)) {
              seen.set(key, groups.length);
              groups.push({ name: q.templateName ?? null, questions: [] });
            }
            groups[seen.get(key)].questions.push(q);
          }
          return (
            <div className="flex flex-col gap-3">
              {groups.map(group => (
                <div key={group.name ?? "__custom__"} className="rounded-lg border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
                    <span className="text-xs font-semibold text-foreground">
                      {group.name ?? "Custom questions"}
                    </span>
                    {group.name ? (
                      <button
                        type="button"
                        onClick={() => removeTemplateGroup(group.name)}
                        className="text-xs text-muted hover:text-red-600 transition-colors"
                      >
                        Remove group
                      </button>
                    ) : null}
                  </div>
                  <div className="divide-y divide-border">
                    {group.questions.map(q => (
                      <div key={q.id} className="flex items-center gap-3 px-4 py-2.5">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground">{q.label}</span>
                          {!q.required && (
                            <span className="ml-2 text-xs text-muted">(optional)</span>
                          )}
                        </div>
                        <span className="text-xs text-muted shrink-0">
                          {q.type === "select" ? "dropdown" : "text"}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuestion(q.id)}
                          className="text-xs text-muted hover:text-red-500 transition-colors shrink-0"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Template picker */}
        {(() => {
          const activeTemplateNames = new Set(formQuestions.map(q => q.templateName).filter(Boolean));
          const available = FORM_TEMPLATES.filter(t => !activeTemplateNames.has(t.name));
          if (!available.length) return null;
          return (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted">Add a template</p>
              <div className="grid grid-cols-2 gap-2">
                {available.map(t => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className="text-left px-4 py-3 rounded-lg border border-border bg-surface hover:border-brand-300 hover:bg-brand-50 transition-colors group"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-brand-700">{t.name}</p>
                    <p className="text-xs text-muted mt-0.5">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Add custom question */}
        {addingQuestion ? (
          <div className="flex flex-col gap-2.5 p-4 bg-surface rounded-lg border border-border">
            <p className="text-xs font-semibold text-foreground">New question</p>
            <input
              type="text"
              placeholder="Question (e.g. Preferred contact method)"
              value={newQLabel}
              onChange={e => setNewQLabel(e.target.value)}
              className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
            <div className="flex gap-2">
              <select
                value={newQType}
                onChange={e => setNewQType(e.target.value)}
                className="flex-1 text-sm border border-border rounded-md px-2 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="text">Text answer</option>
                <option value="select">Multiple choice</option>
              </select>
              <label className="flex items-center gap-1.5 text-sm text-muted cursor-pointer shrink-0 px-1">
                <input
                  type="checkbox"
                  checked={newQRequired}
                  onChange={e => setNewQRequired(e.target.checked)}
                  className="rounded border-border"
                />
                Required
              </label>
            </div>
            {newQType === "select" && (
              <input
                type="text"
                placeholder="Options, comma-separated (e.g. Yes, No, Not sure)"
                value={newQOptions}
                onChange={e => setNewQOptions(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addCustomQuestion}
                disabled={!newQLabel.trim()}
                className="text-sm font-medium px-4 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-40"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setAddingQuestion(false); setNewQLabel(""); setNewQType("text"); setNewQRequired(true); setNewQOptions(""); }}
                className="text-sm text-muted hover:text-foreground px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingQuestion(true)}
            className="self-start text-sm font-medium px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            + Add custom question
          </button>
        )}
      </div>

      {/* File attachments */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <SectionIcon bg="bg-orange-50" border="border-orange-100" color="text-orange-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Files for athletes</h2>
            <p className="text-xs text-muted mt-0.5">Upload templates athletes need to fill out. They&apos;ll see a Download button on their upload page.</p>
          </div>
        </div>
        {attachments.length > 0 && (
          <div className="flex flex-col gap-2">
            {attachments.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-3 py-2.5 bg-surface rounded-lg border border-border">
                <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.label}</p>
                  <p className="text-xs text-muted truncate">{a.file_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Label (e.g. Enrollment Form Template)"
            value={attachLabel}
            onChange={e => setAttachLabel(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <label className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${attachUploading ? "border-border text-muted opacity-50 cursor-not-allowed" : "border-border text-muted hover:text-foreground hover:border-foreground/30"}`}>
            {attachUploading ? "Uploading..." : "Upload file"}
            <input
              type="file"
              className="sr-only"
              disabled={attachUploading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={e => e.target.files?.[0] && handleAttachUpload(e.target.files[0])}
            />
          </label>
        </div>
        {attachError && <p className="text-xs text-red-500">{attachError}</p>}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-1 border-t border-border">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 px-6"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <span className="text-xs text-muted">{activeDocs.length} document{activeDocs.length !== 1 ? "s" : ""} required</span>
        {success && <span className="text-sm text-brand-600 font-medium">Saved!</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </div>
  );
}
