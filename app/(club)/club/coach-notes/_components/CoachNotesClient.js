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

export default function CoachNotesClient({ sport, initialNotes, initialLinks, initialDocConfig }) {
  // Notes & links
  const [notes, setNotes] = useState(initialNotes || "");
  const [links, setLinks] = useState(initialLinks || []);
  const [addingLink, setAddingLink] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Doc config
  const [disabled, setDisabled] = useState(new Set(initialDocConfig?.disabled_base_docs || []));
  const [customDocs, setCustomDocs] = useState(initialDocConfig?.custom_docs || []);
  const [newDocLabel, setNewDocLabel] = useState("");

  // Save state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const examples = getSportExamples(sport);
  const enabledCount = BASE_DOCUMENT_TYPES.length - disabled.size + customDocs.length;

  function toggleBase(key) {
    setDisabled(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }

  function addCustomDoc() {
    if (!newDocLabel.trim()) return;
    setCustomDocs(prev => [...prev, { id: crypto.randomUUID(), label: newDocLabel.trim(), required: true }]);
    setNewDocLabel("");
  }

  function removeCustomDoc(id) { setCustomDocs(prev => prev.filter(d => d.id !== id)); }

  function addLink() {
    if (!linkLabel.trim() || !linkUrl.trim()) return;
    let url = linkUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
    setLinks(prev => [...prev, { label: linkLabel.trim(), url }]);
    setLinkLabel(""); setLinkUrl(""); setAddingLink(false);
  }

  function removeLink(i) { setLinks(prev => prev.filter((_, idx) => idx !== i)); }

  function appendExample(text) { setNotes(prev => prev ? prev + "\n" + text : text); }

  async function handleSave() {
    setLoading(true); setError(null); setSuccess(false);

    const fd = new FormData();
    fd.append("custom_notes", notes);
    fd.append("custom_links", JSON.stringify(links));

    const [notesRes, docRes] = await Promise.all([
      fetch("/api/club/coach-notes", { method: "POST", body: fd }),
      fetch("/api/club/sport-doc-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sport, disabled_base_docs: Array.from(disabled), custom_docs: customDocs }),
      }),
    ]);

    setLoading(false);
    if (notesRes.ok && docRes.ok) {
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } else {
      setError("Failed to save. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Required Uploads */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Required uploads</h2>
          <p className="text-xs text-muted">Toggle off anything you don&apos;t need — athletes only see what&apos;s enabled. {enabledCount} document{enabledCount !== 1 ? "s" : ""} required.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {BASE_DOCUMENT_TYPES.map(doc => {
            const enabled = !disabled.has(doc.key);
            return (
              <button
                key={doc.key}
                type="button"
                onClick={() => toggleBase(doc.key)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-colors ${
                  enabled ? "border-brand-200 bg-brand-50" : "border-border bg-surface"
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
                <span className={`text-xs font-medium ${enabled ? "text-foreground" : "text-muted line-through"}`}>{doc.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom docs */}
        {customDocs.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {customDocs.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-brand-200 bg-brand-50">
                <div className="w-4 h-4 rounded border-2 border-brand-500 bg-brand-500 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-medium flex-1 text-foreground">{doc.label}</span>
                <button type="button" onClick={() => removeCustomDoc(doc.id)} className="text-xs text-muted hover:text-red-600 transition-colors">Remove</button>
              </div>
            ))}
          </div>
        )}

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

      {/* Notes */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Notes for every guide</h2>
          <p className="text-xs text-muted">The AI weaves this into each athlete&apos;s guide. Great for schedule reminders, deadlines, or anything every incoming athlete should know.</p>
        </div>
        <textarea
          rows={6}
          value={notes}
          onChange={e => setNotes(e.target.value)}
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
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Helpful links</h2>
          <p className="text-xs text-muted">These appear in every guide with their titles so athletes can access them directly.</p>
        </div>

        {links.length > 0 && (
          <div className="flex flex-col gap-2">
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-surface rounded-lg border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{link.label}</p>
                  <p className="text-xs text-muted truncate">{link.url}</p>
                </div>
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

      {/* Single save button */}
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
