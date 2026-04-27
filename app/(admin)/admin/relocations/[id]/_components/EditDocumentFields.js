"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditDocumentFields({ documentId, welcomeLetter, generatedSummary }) {
  const [open, setOpen] = useState(false);
  const [welcome, setWelcome] = useState(welcomeLetter || "");
  const [summary, setSummary] = useState(generatedSummary || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ welcome_letter: welcome, generated_summary: summary }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => { setOpen(false); setSaved(false); }, 1200);
    } catch {
      setError("Could not reach server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium px-4 py-2 rounded-lg border border-border text-foreground hover:bg-surface transition-colors"
      >
        Edit guide
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Edit guide</h2>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-widest mb-2">
                  Summary <span className="text-muted normal-case font-normal tracking-normal">(appears in guide header)</span>
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-widest mb-2">
                  Welcome letter <span className="text-muted normal-case font-normal tracking-normal">(personalised message to student)</span>
                </label>
                <textarea
                  value={welcome}
                  onChange={(e) => setWelcome(e.target.value)}
                  rows={6}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60 ${saved ? "bg-green-600 text-white" : "bg-brand-600 text-white hover:bg-brand-700"}`}
              >
                {saving ? "Saving..." : saved ? "Saved!" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
