"use client";

import { useState, useEffect, useRef } from "react";

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

const SPORT_NOTE_EXAMPLES = {
  soccer: ["Morning practices run 8–10am — schedule classes for 11am or later", "Game days are typically Saturdays — let professors know in advance", "NCAA eligibility clearance must be submitted before your first practice", "Team travel requires academic absence notices — email professors 1 week ahead", "Pre-season fitness testing starts the first week of August"],
  basketball: ["Practice is every afternoon 3–6pm — schedule morning classes only", "Away games can mean 2–3 day trips — coordinate with professors early", "NCAA eligibility clearance required before your first official practice", "Film sessions every Sunday 10am — plan your weekend accordingly", "No missed practices during exam week — academic support will help you plan"],
  swimming: ["Morning practices are 5:30–7:30am — afternoon sessions 3–5pm", "Schedule all classes between 8am and 2pm to avoid conflicts", "NCAA eligibility clearance required before first official practice", "Annual physical and swim test required before pre-season"],
  tennis: ["Practices run Mon–Fri 3–6pm — morning classes are ideal", "NCAA eligibility clearance must be complete before your first match", "Pre-season conditioning starts 2 weeks before classes begin"],
  football: ["Fall camp starts in early August — arrive at least 3 weeks before classes", "Morning walkthroughs at 8am, afternoon practice 3–6pm", "NCAA eligibility and physical clearance must be complete before fall camp"],
  volleyball: ["Practice runs Mon–Fri 2–5pm — schedule all classes before 1:30pm", "NCAA eligibility clearance must be submitted before your first official practice", "Pre-season conditioning begins 2 weeks before the first day of classes"],
  baseball: ["Practice is every afternoon 2–5pm — morning-only classes work best", "NCAA eligibility clearance required before first official practice"],
  softball: ["Practice runs Mon–Fri 3–6pm — morning-only classes are recommended", "NCAA eligibility clearance required before first official practice"],
  track: ["Morning practices: 6:30–8:30am, afternoon optional lifts 3–5pm", "NCAA eligibility clearance required before your first official practice"],
  golf: ["Practice rounds are typically in the afternoon 1–5pm", "NCAA eligibility clearance required before your first official round"],
  rowing: ["Morning practices start at 5:45am — afternoon ergs at 4pm", "NCAA eligibility clearance required before first on-water practice"],
  lacrosse: ["Practice runs Mon–Fri 3–6pm — schedule morning classes only", "NCAA eligibility clearance required before your first official practice"],
};

function getSportExamples(sport) {
  if (!sport) return [];
  const key = sport.toLowerCase().replace(/men's |women's /g, "").trim();
  return SPORT_NOTE_EXAMPLES[key] || [];
}

function SectionIcon({ children, bg, border, color }) {
  return (
    <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center ${color} shrink-0`}>
      {children}
    </div>
  );
}

function buildDocState(initialDocConfig) {
  const disabledSet = new Set(initialDocConfig?.disabled_base_docs || []);
  const docSettings = initialDocConfig?.doc_settings || {};
  const customDocs = initialDocConfig?.custom_docs || [];

  const baseDocs = BASE_DOCUMENT_TYPES
    .filter(d => !disabledSet.has(d.key))
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
  return { active, disabledBaseKeys: disabledSet };
}

const FORM_TEMPLATES = [
  {
    name: "Uniform & Gear",
    description: "Sizes and jersey preferences",
    questions: [
      { label: "Shirt Size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL", "2XL"], required: true },
      { label: "Shorts Size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL", "2XL"], required: true },
      { label: "Shoe Size (US)", type: "text", required: true },
      { label: "Jersey Number Preference", type: "text", required: false },
    ],
  },
  {
    name: "Emergency Contact",
    description: "Name, relationship, and phone",
    questions: [
      { label: "Emergency Contact Name", type: "text", required: true },
      { label: "Relationship", type: "text", required: true },
      { label: "Emergency Contact Phone", type: "text", required: true },
    ],
  },
  {
    name: "Housing Preferences",
    description: "Roommate and dietary needs",
    questions: [
      { label: "Roommate Preference", type: "text", required: false },
      { label: "Dietary Restrictions or Allergies", type: "text", required: false },
    ],
  },
  {
    name: "Travel & Arrival",
    description: "Arrival date and airport logistics",
    questions: [
      { label: "Planned Arrival Date", type: "text", required: true },
      { label: "Need airport pickup?", type: "select", options: ["Yes", "No", "Not sure yet"], required: true },
    ],
  },
];

export default function CoachNotesClient({ sport, initialNotes, initialLinks, initialAttachments, initialDocConfig }) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [links, setLinks] = useState(initialLinks || []);
  const [addingLink, setAddingLink] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkVisibility, setLinkVisibility] = useState("all");

  // Form questions state
  const [formQuestions, setFormQuestions] = useState(initialDocConfig?.form_questions || []);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [newQLabel, setNewQLabel] = useState("");
  const [newQType, setNewQType] = useState("text");
  const [newQRequired, setNewQRequired] = useState(true);
  const [newQOptions, setNewQOptions] = useState("");

  const initDoc = buildDocState(initialDocConfig);
  const [activeDocs, setActiveDocs] = useState(initDoc.active);
  const [disabledBaseKeys, setDisabledBaseKeys] = useState(initDoc.disabledBaseKeys);
  const [newDocLabel, setNewDocLabel] = useState("");

  const [attachments, setAttachments] = useState(initialAttachments || []);
  const [attachLabel, setAttachLabel] = useState("");
  const [attachUploading, setAttachUploading] = useState(false);
  const [attachError, setAttachError] = useState(null);

  async function handleAttachUpload(file) {
    if (!file) return;
    setAttachUploading(true); setAttachError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("label", attachLabel.trim() || file.name);
    const res = await fetch("/api/club/coach-attachments", { method: "POST", body: fd });
    setAttachUploading(false);
    if (!res.ok) { setAttachError("Upload failed. Try again."); return; }
    const { attachment } = await res.json();
    setAttachments(prev => [...prev, attachment]);
    setAttachLabel("");
  }

  async function removeAttachment(id) {
    await fetch("/api/club/coach-attachments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attachmentId: id }) });
    setAttachments(prev => prev.filter(a => a.id !== id));
  }

  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const examples = getSportExamples(sport);

  function disableBase(key) {
    setActiveDocs(prev => prev.filter(d => d.key !== key));
    setDisabledBaseKeys(prev => new Set([...prev, key]));
    setIsDirty(true);
  }

  function enableBase(key) {
    const docDef = BASE_DOCUMENT_TYPES.find(d => d.key === key);
    if (!docDef) return;
    setDisabledBaseKeys(prev => { const n = new Set(prev); n.delete(key); return n; });
    setActiveDocs(prev => [...prev, { key, label: docDef.label, isBase: true, visibility: "all", order: 9999 }]);
    setIsDirty(true);
  }

  function removeCustomDoc(key) { setActiveDocs(prev => prev.filter(d => d.key !== key)); setIsDirty(true); }

  function setDocVisibility(key, visibility) {
    setActiveDocs(prev => prev.map(d => d.key === key ? { ...d, visibility } : d));
    setIsDirty(true);
  }

  function addCustomDoc() {
    if (!newDocLabel.trim()) return;
    setActiveDocs(prev => [...prev, { key: crypto.randomUUID(), label: newDocLabel.trim(), isBase: false, visibility: "all", order: 9999 }]);
    setNewDocLabel("");
    setIsDirty(true);
  }

  function addLink() {
    if (!linkLabel.trim() || !linkUrl.trim()) return;
    let url = linkUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
    setLinks(prev => [...prev, { label: linkLabel.trim(), url, visibility: linkVisibility }]);
    setLinkLabel(""); setLinkUrl(""); setLinkVisibility("all"); setAddingLink(false);
    setIsDirty(true);
  }

  function removeLink(i) { setLinks(prev => prev.filter((_, idx) => idx !== i)); setIsDirty(true); }

  function setLinkVis(i, v) { setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, visibility: v } : l)); setIsDirty(true); }

  function setAttachVis(id, v) { setAttachments(prev => prev.map(a => a.id === id ? { ...a, visibility: v } : a)); setIsDirty(true); }

  function appendExample(text) { setNotes(prev => prev ? prev + "\n" + text : text); setIsDirty(true); }

  function applyTemplate(template) {
    setFormQuestions(prev => {
      const existingLabels = new Set(prev.map(q => q.label));
      const toAdd = template.questions
        .filter(q => !existingLabels.has(q.label))
        .map(q => ({ ...q, id: crypto.randomUUID(), templateName: template.name }));
      return [...prev, ...toAdd];
    });
    setIsDirty(true);
  }

  function removeTemplateGroup(templateName) {
    setFormQuestions(prev => prev.filter(q => q.templateName !== templateName));
    setIsDirty(true);
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
    setIsDirty(true);
  }

  function removeQuestion(id) {
    setFormQuestions(prev => prev.filter(q => q.id !== id));
    setIsDirty(true);
  }

  async function handleSave() {
    setLoading(true); setError(null); setSuccess(false);

    const fd = new FormData();
    fd.append("custom_notes", notes);
    fd.append("custom_links", JSON.stringify(links));
    fd.append("coach_attachments", JSON.stringify(attachments));

    const doc_settings = Object.fromEntries(
      activeDocs.filter(d => d.isBase).map((d, i) => [d.key, { visibility: d.visibility, order: i }])
    );
    const custom_docs = activeDocs
      .filter(d => !d.isBase)
      .map((d, i) => ({ id: d.key, label: d.label, required: true, visibility: d.visibility, order: i }));

    const [notesRes, docRes] = await Promise.all([
      fetch("/api/club/coach-notes", { method: "POST", body: fd }),
      fetch("/api/club/sport-doc-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sport, disabled_base_docs: Array.from(disabledBaseKeys), custom_docs, doc_settings, form_questions: formQuestions }),
      }),
    ]);

    setLoading(false);
    if (notesRes.ok && docRes.ok) {
      setSuccess(true); setIsDirty(false); setTimeout(() => setSuccess(false), 3000);
    } else {
      setError("Failed to save. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Required Uploads */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <SectionIcon bg="bg-brand-50" border="border-brand-100" color="text-brand-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Required uploads</h2>
            <p className="text-xs text-muted mt-0.5">Set visibility to show a doc only to international or domestic athletes. {activeDocs.length} document{activeDocs.length !== 1 ? "s" : ""} active.</p>
          </div>
        </div>

        {/* Active docs — pointer drag */}
        <div className="flex flex-col">
          {activeDocs.length === 0 && (
            <p className="text-xs text-muted italic">No documents enabled.</p>
          )}
          {activeDocs.map((doc) => (
            <div key={doc.key}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border mb-1.5 border-brand-200 bg-brand-50">
              {doc.isBase ? (
                <button
                  type="button"
                  onClick={() => disableBase(doc.key)}
                  title="Click to disable"
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
              <span className="text-xs font-medium flex-1 text-foreground truncate">{doc.label}</span>
              <select
                value={doc.visibility}
                onChange={e => setDocVisibility(doc.key, e.target.value)}
                onClick={e => e.stopPropagation()}
                className="text-xs border border-border rounded-md px-1.5 py-1 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 shrink-0"
              >
                <option value="all">Everyone</option>
                <option value="international">Internationals only</option>
                <option value="domestic">US only</option>
              </select>
              {!doc.isBase && (
                <button type="button" onClick={() => removeCustomDoc(doc.key)} className="text-xs text-muted hover:text-red-600 transition-colors shrink-0 ml-1">Remove</button>
              )}
              </div>
            </div>
          ))}
        </div>

        {/* Disabled base docs */}
        {Array.from(disabledBaseKeys).length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted">Disabled — click to re-enable:</p>
            <div className="flex flex-wrap gap-2">
              {BASE_DOCUMENT_TYPES.filter(d => disabledBaseKeys.has(d.key)).map(doc => (
                <button
                  key={doc.key}
                  type="button"
                  onClick={() => enableBase(doc.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface text-xs text-muted hover:border-brand-300 hover:text-foreground transition-colors"
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

        {/* Add custom doc */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a custom document..."
            value={newDocLabel}
            onChange={e => setNewDocLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomDoc())}
            className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button type="button" onClick={addCustomDoc} disabled={!newDocLabel.trim()}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-40">
            Add
          </button>
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

        {/* Active questions — grouped by template */}
        {formQuestions.length > 0 && (() => {
          // Group questions by templateName (undefined = custom)
          const groups = [];
          const seen = new Map(); // templateName → group index
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

      {/* Notes */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <SectionIcon bg="bg-purple-50" border="border-purple-100" color="text-purple-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Notes for every guide</h2>
            <p className="text-xs text-muted mt-0.5">The AI weaves this into each athlete&apos;s guide. Great for schedule reminders, deadlines, or anything every incoming athlete should know.</p>
          </div>
        </div>
        <textarea
          rows={6}
          value={notes}
          onChange={e => { setNotes(e.target.value); setIsDirty(true); }}
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-y"
          placeholder="e.g. Morning practice runs 8–10am — schedule classes for 11am or later..."
        />
        {examples.length > 0 && (
          <div>
            <p className="text-xs text-muted mb-2">Examples — click to add:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map(ex => (
                <button key={ex} type="button" onClick={() => appendExample(ex)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
                  + {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Links */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <SectionIcon bg="bg-blue-50" border="border-blue-100" color="text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Helpful links</h2>
            <p className="text-xs text-muted mt-0.5">These appear in every guide with their titles so athletes can access them directly.</p>
          </div>
        </div>

        {links.length > 0 && (
          <div className="flex flex-col gap-2">
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-surface rounded-lg border border-border">
                <div className="w-6 h-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{link.label}</p>
                  <p className="text-xs text-muted truncate">{link.url}</p>
                </div>
                <select
                  value={link.visibility || "all"}
                  onChange={e => setLinkVis(i, e.target.value)}
                  className="text-xs border border-border rounded-md px-1.5 py-1 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 shrink-0"
                >
                  <option value="all">Everyone</option>
                  <option value="international">Internationals only</option>
                  <option value="domestic">US only</option>
                </select>
                <button type="button" onClick={() => removeLink(i)} className="text-xs text-red-400 hover:text-red-600 font-medium shrink-0">Remove</button>
              </div>
            ))}
          </div>
        )}

        {addingLink ? (
          <div className="flex flex-col gap-2 p-4 bg-surface rounded-lg border border-border">
            <input type="text" placeholder="Label (e.g. Campus Health Center)" value={linkLabel}
              onChange={e => setLinkLabel(e.target.value)}
              className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
            <input type="text" placeholder="URL" value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addLink())}
              className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
            <select
              value={linkVisibility}
              onChange={e => setLinkVisibility(e.target.value)}
              className="text-xs border border-border rounded-md px-2 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">Everyone</option>
              <option value="international">Internationals only</option>
              <option value="domestic">US only</option>
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={addLink} disabled={!linkLabel.trim() || !linkUrl.trim()}
                className="text-sm font-medium px-4 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-40">
                Add link
              </button>
              <button type="button" onClick={() => { setAddingLink(false); setLinkLabel(""); setLinkUrl(""); }}
                className="text-sm text-muted hover:text-foreground px-3 py-1.5">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setAddingLink(true)}
            className="self-start text-sm font-medium px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
            + Add a link
          </button>
        )}
      </div>

      {/* Attachments */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <SectionIcon bg="bg-orange-50" border="border-orange-100" color="text-orange-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Files for athletes</h2>
            <p className="text-xs text-muted mt-0.5">Upload templates athletes need to fill out (e.g. medical form, eligibility form). They&apos;ll see a Download button on their upload page.</p>
          </div>
        </div>
        {attachments.length > 0 && (
          <div className="flex flex-col gap-2">
            {attachments.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-3 py-2.5 bg-surface rounded-lg border border-border">
                <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.label}</p>
                  <p className="text-xs text-muted truncate">{a.file_name}</p>
                </div>
                <select
                  value={a.visibility || "all"}
                  onChange={e => setAttachVis(a.id, e.target.value)}
                  className="text-xs border border-border rounded-md px-1.5 py-1 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 shrink-0"
                >
                  <option value="all">Everyone</option>
                  <option value="international">Internationals only</option>
                  <option value="domestic">US only</option>
                </select>
                <button type="button" onClick={() => removeAttachment(a.id)} className="text-xs text-red-400 hover:text-red-600 font-medium shrink-0">Remove</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Label (e.g. Medical Form Template)"
            value={attachLabel}
            onChange={e => setAttachLabel(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <label className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${attachUploading ? "border-border text-muted opacity-50 cursor-not-allowed" : "border-border text-muted hover:text-foreground hover:border-foreground/30"}`}>
            {attachUploading ? "Uploading..." : "Upload file"}
            <input type="file" className="sr-only" disabled={attachUploading} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => e.target.files?.[0] && handleAttachUpload(e.target.files[0])} />
          </label>
        </div>
        {attachError && <p className="text-xs text-red-500">{attachError}</p>}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={handleSave} disabled={loading}
          className="bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 px-8">
          {loading ? "Saving..." : "Save"}
        </button>
        {success && <span className="text-sm text-brand-600 font-medium">Saved!</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>

    </div>
  );
}
