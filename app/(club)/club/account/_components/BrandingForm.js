"use client";

import { useState } from "react";

function LockBadge() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      Premium
    </span>
  );
}

export default function BrandingForm({ club }) {
  const isPremium = club?.plan === "premium";

  const [primaryColor, setPrimaryColor] = useState(club?.primary_color || "#16a34a");
  const [secondaryColor, setSecondaryColor] = useState(club?.secondary_color || "#ffffff");
  const [notes, setNotes] = useState(club?.custom_notes || "");
  const [logoPreview, setLogoPreview] = useState(club?.logo_url || null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isPremium) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const fd = new FormData();
    fd.append("primary_color", primaryColor);
    fd.append("secondary_color", secondaryColor);
    fd.append("custom_notes", notes);
    if (logoFile) fd.append("logo", logoFile);

    const res = await fetch(`/api/club/branding`, { method: "POST", body: fd });
    setLoading(false);
    if (res.ok) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    else { const d = await res.json(); setError(d.error || "Failed to save."); }
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center mb-5">
        <h2 className="text-sm font-semibold text-foreground">Branding</h2>
        {!isPremium && <LockBadge />}
      </div>

      {!isPremium && (
        <p className="text-xs text-muted mb-5 leading-relaxed">
          Upgrade to Premium to add your logo, brand colors, and custom coach notes to every guide.{" "}
          <a href="/club/billing" className="text-brand-600 hover:underline">Learn more →</a>
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Logo */}
        <div className={!isPremium ? "opacity-50 pointer-events-none" : ""}>
          <p className="text-xs text-muted uppercase tracking-wider mb-2">Logo</p>
          <div className="flex items-center gap-4">
            {logoPreview
              ? <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain rounded-md border border-border" />
              : <div className="w-12 h-12 rounded-md border border-border bg-surface flex items-center justify-center text-xs text-muted">No logo</div>
            }
            <label className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
              {logoPreview ? "Change logo" : "Upload logo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} disabled={!isPremium} />
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className={`grid grid-cols-2 gap-4 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Primary color</p>
            <div className="flex items-center gap-3">
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                className="w-9 h-9 rounded-md border border-border cursor-pointer p-0.5 bg-white" disabled={!isPremium} />
              <span className="text-sm font-mono text-foreground">{primaryColor}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Secondary color</p>
            <div className="flex items-center gap-3">
              <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
                className="w-9 h-9 rounded-md border border-border cursor-pointer p-0.5 bg-white" disabled={!isPremium} />
              <span className="text-sm font-mono text-foreground">{secondaryColor}</span>
            </div>
          </div>
        </div>

        {/* Coach notes */}
        <div className={!isPremium ? "opacity-50 pointer-events-none" : ""}>
          <p className="text-xs text-muted uppercase tracking-wider mb-2">Custom coach notes</p>
          <textarea
            rows={4}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            disabled={!isPremium}
            className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            placeholder="Add a personal note that will appear in every athlete's guide — welcome message, team expectations, local tips..."
          />
        </div>

        {isPremium && (
          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading}
              className="bg-brand-600 text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 px-6">
              {loading ? "Saving..." : "Save branding"}
            </button>
            {success && <span className="text-sm text-brand-600 font-medium">Saved!</span>}
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        )}
      </form>
    </div>
  );
}
