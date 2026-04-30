"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const GENERIC_NOTE_EXAMPLES = [
  "Welcome from the Office of International Student Services",
  "All international students must report to the DSO within 3 days of arrival",
  "Health insurance enrollment deadline: August 20",
  "ID card pickup: Enrollment Services, Mon–Fri 9am–5pm",
  "Emergency contact: Office of Student Affairs (555) 000-0000",
  "NCAA eligibility checklist required before first practice",
  "Campus health center is free for all enrolled students",
  "Campus shuttle runs Mon–Fri, 7am–10pm",
];

const SPORT_NOTE_EXAMPLES = {
  default: GENERIC_NOTE_EXAMPLES,
  soccer: [
    "Morning practices run 8–10am — schedule classes for 11am or later",
    "Game days are typically Saturdays — let professors know in advance",
    "Pre-season fitness testing starts the first week of August",
    "NCAA eligibility clearance must be submitted before your first practice",
    "Team travel requires academic absence notices — email professors at least 1 week ahead",
    "Strength & conditioning sessions: Mon/Wed/Fri 6:30am (optional but recommended)",
    "Health insurance waiver deadline is August 20 — don't miss it",
    "Cleats and shin guards required at all training sessions",
  ],
  basketball: [
    "Practice is every afternoon 3–6pm — schedule morning classes only",
    "Away games can mean 2–3 day trips — coordinate with professors early",
    "NCAA eligibility clearance required before your first official practice",
    "Weight room access for athletes: 6–8am or after 7pm only",
    "Pre-season physicals are mandatory before any team activity",
    "Film sessions every Sunday 10am — plan your weekend schedule around this",
    "Health insurance waiver deadline is August 20",
    "No missed practices during exam week — academic support will help you plan",
  ],
  swimming: [
    "Morning practices are 5:30–7:30am — afternoon sessions 3–5pm",
    "Schedule all classes between 8am and 2pm to avoid practice conflicts",
    "Away meets are often Friday–Sunday — submit absence notices early",
    "NCAA eligibility clearance required before first official practice",
    "Annual physical and swim test required before pre-season",
    "Bring your own practice suit and goggles — team cap is provided",
    "Health insurance waiver must be completed by August 20",
    "Pool access for extra training: open lanes Tue/Thu 7–8pm",
  ],
  tennis: [
    "Practices run Mon–Fri 3–6pm — morning classes are ideal",
    "Weekend matches may require Friday travel — notify professors in advance",
    "Bring your own rackets — strings and grips are not provided by the program",
    "NCAA eligibility clearance must be complete before your first match",
    "Indoor courts are reserved for the team 3–6pm daily during season",
    "Pre-season conditioning starts 2 weeks before classes begin",
    "Health insurance waiver deadline is August 20",
    "Video analysis sessions every Wednesday evening — check the team calendar",
  ],
  football: [
    "Fall camp starts in early August — arrive at least 3 weeks before classes",
    "Morning walkthroughs at 8am, afternoon practice 3–6pm — plan classes accordingly",
    "Game days are Saturdays — travel sometimes begins Friday",
    "NCAA eligibility and physical clearance must be complete before fall camp",
    "Mandatory team meetings every Sunday at noon during the season",
    "Position-specific film review Mon/Tue evenings — check with your position coach",
    "Health insurance waiver deadline is August 20",
    "Academic support tutoring is mandatory if GPA drops below 2.5",
  ],
  volleyball: [
    "Practice runs Mon–Fri 2–5pm — schedule all classes before 1:30pm",
    "Away matches can span Fri–Sun — submit absence requests at least 1 week ahead",
    "Pre-season conditioning begins 2 weeks before the first day of classes",
    "NCAA eligibility clearance must be submitted before your first official practice",
    "Mandatory film review every Monday morning 9am",
    "Health insurance waiver deadline is August 20",
    "Knee pads and athletic shoes are required at all practices",
    "Academic progress checks happen at midterm — stay ahead of your coursework",
  ],
  baseball: [
    "Practice is every afternoon 2–5pm — morning-only classes work best",
    "Spring season road trips can last 3–4 days — notify professors at semester start",
    "Fall practice is informal but expected — coordinate your class schedule early",
    "NCAA eligibility clearance required before first official practice",
    "Pre-season physicals are mandatory before any team activity",
    "Health insurance waiver deadline is August 20",
    "Batting cage open for extra work 7–8am on non-practice days",
    "Academic tutoring available at the athletic center Mon–Thu 4–7pm",
  ],
  softball: [
    "Practice runs Mon–Fri 3–6pm — morning-only classes are recommended",
    "Spring tournament weekends often involve Fri travel — plan ahead",
    "Fall practice schedule is lighter but mandatory",
    "NCAA eligibility clearance required before first official practice",
    "Annual physical required before pre-season begins",
    "Health insurance waiver deadline is August 20",
    "Extra hitting sessions available Tue/Thu 7–8am",
    "Academic check-ins happen every 3 weeks — stay in touch with the academic advisor",
  ],
  track: [
    "Morning practices: 6:30–8:30am, afternoon optional lifts 3–5pm",
    "Schedule classes 9am–2pm to avoid both practice windows",
    "Travel meets happen most weekends in season — submit absence notices early",
    "NCAA eligibility clearance required before your first official practice",
    "Pre-season physicals are mandatory before any team workout",
    "Health insurance waiver deadline is August 20",
    "Indoor season starts in November — training intensity increases significantly",
    "Spikes and training shoes are your responsibility — team warm-up suit provided",
  ],
  golf: [
    "Practice rounds are typically in the afternoon 1–5pm — schedule morning classes",
    "Tournament weeks often require 3–5 day trips — inform professors at semester start",
    "Range access for extra practice: open to athletes 7–9am daily",
    "NCAA eligibility clearance required before your first official round",
    "Club fitting and annual physical must be completed before pre-season",
    "Health insurance waiver deadline is August 20",
    "Team van departs early on tournament days — be ready 1 hour before tee time",
    "Academic progress is monitored every 4 weeks — maintain a 2.5+ GPA",
  ],
  rowing: [
    "Morning practices start at 5:45am on the water — afternoon ergs at 4pm",
    "Schedule all classes between 8am–3pm — early practices are non-negotiable",
    "Regattas are typically on Sundays — Saturday travel is common",
    "NCAA eligibility clearance required before first on-water practice",
    "Annual physical and swim test required before pre-season",
    "Health insurance waiver deadline is August 20",
    "Ergometer testing every 4 weeks — results affect seat placement",
    "Boathouse dress code: no street clothes on the dock or in the boats",
  ],
  lacrosse: [
    "Practice runs Mon–Fri 3–6pm — schedule morning classes only",
    "Weekend games often require Friday afternoon departure",
    "Pre-season conditioning starts 2 weeks before classes — arrive early",
    "NCAA eligibility clearance required before your first official practice",
    "Mandatory film sessions every Tuesday at 7pm",
    "Health insurance waiver deadline is August 20",
    "Helmets, pads, and sticks must meet NCAA specifications — check with equipment staff",
    "Academic tutoring available at the athletic center Mon–Thu 4–7pm",
  ],
  "cross country": [
    "Morning runs at 6:30am, afternoon optional workout 4pm",
    "Schedule all classes between 8am–3pm",
    "Meets are Saturday mornings — sometimes require Friday travel",
    "NCAA eligibility clearance required before first official practice",
    "Annual physical required before pre-season begins",
    "Health insurance waiver deadline is August 20",
    "GPS watches are provided — return them to the equipment room after each use",
    "Weekly mileage logs are submitted to the coach every Sunday",
  ],
  gymnastics: [
    "Practice is 1–5pm daily — schedule only morning classes",
    "Meets are typically Friday evenings or Saturday mornings",
    "Pre-season conditioning starts 3 weeks before the semester",
    "NCAA eligibility clearance required before first official practice",
    "Physical and flexibility assessment required before pre-season",
    "Health insurance waiver deadline is August 20",
    "Grip care and tape are provided — bring your own chalk bag",
    "Academic progress checks every 3 weeks — academic advisor meets with all athletes",
  ],
};

function getSportExamples(sport) {
  if (!sport) return GENERIC_NOTE_EXAMPLES;
  const key = sport.toLowerCase().replace(/men's |women's /g, "").trim();
  return SPORT_NOTE_EXAMPLES[key] || GENERIC_NOTE_EXAMPLES;
}

const LINK_EXAMPLES = [
  "Campus Map",
  "Health Center",
  "International Student Office",
  "Financial Aid",
  "Athletics Portal",
  "Campus Housing",
];

export default function GuideNotesForm({ club, saveEndpoint = "/api/club/branding" }) {
  const noteExamples = getSportExamples(club?._coachSport);
  const [notes, setNotes] = useState(club?.custom_notes || "");
  const [links, setLinks] = useState(Array.isArray(club?.custom_links) ? club.custom_links : []);
  const [addingLink, setAddingLink] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [documents, setDocuments] = useState(Array.isArray(club?.club_documents) ? club.club_documents : []);
  const [addingDoc, setAddingDoc] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  async function uploadDocument() {
    if (!docFile || !docName.trim()) return;
    setUploading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ name: docFile.name, type: docFile.type });
      const res = await fetch(`/api/club/upload-document?${params}`, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: docFile,
      });
      const json = await res.json();
      if (res.ok && json?.url) {
        setDocuments((prev) => [...prev, { id: Date.now().toString(), name: docName.trim(), description: docDescription.trim(), url: json.url }]);
        setDocFile(null);
        setDocName("");
        setDocDescription("");
        setAddingDoc(false);
      } else {
        setError(json?.error || `Upload failed (${res.status}).`);
      }
    } catch (e) {
      console.error("Upload exception", e);
      setError("Upload failed. Please try again.");
    }
    setUploading(false);
  }

  function removeDoc(id) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  async function openDocument(docUrl) {
    const win = window.open("", "_blank");
    try {
      const res = await fetch(`/api/club/view-document?url=${encodeURIComponent(docUrl)}`);
      if (!res.ok) {
        win.close();
        alert(`Failed to load document: ${await res.text()}`);
        return;
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      win.location.href = blobUrl;
    } catch (e) {
      win?.close();
      alert("Failed to load document. Please try again.");
    }
  }

  function appendExample(text) {
    setNotes((prev) => prev ? prev + "\n" + text : text);
    setIsDirty(true);
  }

  function addLink() {
    if (!linkLabel.trim() || !linkUrl.trim()) return;
    let url = linkUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
    setLinks((prev) => [...prev, { label: linkLabel.trim(), url }]);
    setLinkLabel("");
    setLinkUrl("");
    setAddingLink(false);
    setIsDirty(true);
  }

  function removeLink(i) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
    setIsDirty(true);
  }

  function startLinkWithExample(label) {
    setLinkLabel(label);
    setAddingLink(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const fd = new FormData();
    fd.append("custom_notes", notes);
    fd.append("custom_links", JSON.stringify(links));
    fd.append("club_documents", JSON.stringify(documents));

    const res = await fetch(saveEndpoint, { method: "POST", body: fd });
    setLoading(false);
    if (res.ok) { setSuccess(true); setIsDirty(false); setTimeout(() => setSuccess(false), 3000); }
    else {
      try {
        const d = await res.json();
        setError(d.error || "Failed to save.");
      } catch {
        setError(`Save failed (${res.status}). Check the server terminal for details.`);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Notes section — full width */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Custom notes for every guide</h2>
          <p className="text-xs text-muted">The AI will weave this into every student's guide naturally. Great for welcome messages, campus tips, important deadlines, or any info every incoming student should know.</p>
        </div>

        <textarea
          rows={8}
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setIsDirty(true); }}
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-y"
          placeholder="Add anything you want included in every guide — welcome messages, important contacts, campus tips, training schedules, deadlines..."
        />

        <div>
          <p className="text-xs text-muted mb-2">Examples — click to add:</p>
          <div className="flex flex-wrap gap-2">
            {noteExamples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => appendExample(ex)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                + {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Links + Documents — two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Links section */}
        <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-1">Helpful links</h2>
            <p className="text-xs text-muted">These links appear in the guide with their titles so students can access them directly.</p>
          </div>

          {links.length > 0 && (
            <div className="flex flex-col gap-2">
              {links.map((link, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-surface rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{link.label}</p>
                    <p className="text-xs text-muted truncate">{link.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="text-xs text-red-400 hover:text-red-600 font-medium shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {addingLink ? (
            <div className="flex flex-col gap-2 p-4 bg-surface rounded-lg border border-border">
              <input
                type="text"
                placeholder="Label (e.g. Campus Health Center)"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <input
                type="text"
                placeholder="URL (e.g. https://health.university.edu)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addLink}
                  disabled={!linkLabel.trim() || !linkUrl.trim()}
                  className="text-sm font-medium px-4 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-40"
                >
                  Add link
                </button>
                <button
                  type="button"
                  onClick={() => { setAddingLink(false); setLinkLabel(""); setLinkUrl(""); }}
                  className="text-sm text-muted hover:text-foreground px-3 py-1.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingLink(true)}
              className="self-start text-sm font-medium px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              + Add a link
            </button>
          )}

          <div>
            <p className="text-xs text-muted mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {LINK_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => startLinkWithExample(ex)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  + {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents section */}
        <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-1">Required documents</h2>
            <p className="text-xs text-muted">Upload PDFs (waivers, medical forms, etc.) that appear in every student guide with a download link.</p>
          </div>

          {documents.length > 0 && (
            <div className="flex flex-col gap-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-3 py-2.5 bg-surface rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                    {doc.description && <p className="text-xs text-muted truncate">{doc.description}</p>}
                  </div>
                  <button type="button" onClick={() => openDocument(doc.url)} className="text-xs font-medium px-2.5 py-1 rounded-md border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors shrink-0">View</button>
                  <button type="button" onClick={() => removeDoc(doc.id)} className="text-xs font-medium px-2.5 py-1 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors shrink-0">Remove</button>
                </div>
              ))}
            </div>
          )}

          {addingDoc ? (
            <div className="flex flex-col gap-2 p-4 bg-surface rounded-lg border border-border">
              <input
                type="text"
                placeholder="Document title (e.g. Medical Clearance Form)"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <input
                type="text"
                placeholder="Short description (optional)"
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
              <label className="cursor-pointer inline-flex items-center gap-2 self-start text-sm font-medium px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span className={docFile ? "text-foreground" : ""}>{docFile ? docFile.name : "Choose PDF to upload"}</span>
                <input type="file" accept=".pdf" className="sr-only" onChange={(e) => setDocFile(e.target.files[0])} />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={uploadDocument}
                  disabled={uploading || !docFile || !docName.trim()}
                  className="text-sm font-medium px-4 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-40"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => { setAddingDoc(false); setDocFile(null); setDocName(""); setDocDescription(""); }}
                  className="text-sm text-muted hover:text-foreground px-3 py-1.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingDoc(true)}
              className="self-start text-sm font-medium px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              + Add a document
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 px-6"
        >
          {loading ? "Saving..." : "Save notes"}
        </button>
        {success && (
          <span className="text-sm text-brand-600 font-medium">Saved!</span>
        )}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </form>
  );
}
