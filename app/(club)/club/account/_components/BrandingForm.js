"use client";

import { useState } from "react";

export default function BrandingForm({ club, slug }) {
  const [primaryColor, setPrimaryColor] = useState(club?.primary_color || "#16a34a");
  const [secondaryColor, setSecondaryColor] = useState(club?.secondary_color || "#ffffff");
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
    setLoading(true);
    setError(null);
    setSuccess(false);

    const fd = new FormData();
    fd.append("primary_color", primaryColor);
    fd.append("secondary_color", secondaryColor);
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
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Logo */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Logo</p>
          <p className="text-xs text-muted mb-2">Appears on the student join form and in the header of every guide</p>
          <div className="flex items-center gap-4">
            {logoPreview
              ? <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain rounded-md border border-border" />
              : <div className="w-12 h-12 rounded-md border border-border bg-surface flex items-center justify-center text-xs text-muted">No logo</div>
            }
            <label className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
              {logoPreview ? "Change logo" : "Upload logo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Primary color</p>
            <p className="text-xs text-muted mb-2">Used in the guide header and call-to-action buttons</p>
            <div className="flex items-center gap-3">
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                className="w-9 h-9 rounded-md border border-border cursor-pointer p-0.5 bg-white" />
              <span className="text-sm font-mono text-foreground">{primaryColor}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Secondary color</p>
            <p className="text-xs text-muted mb-2">Used for text and accent elements throughout the guide</p>
            <div className="flex items-center gap-3">
              <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
                className="w-9 h-9 rounded-md border border-border cursor-pointer p-0.5 bg-white" />
              <span className="text-sm font-mono text-foreground">{secondaryColor}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading}
            className="bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 px-6">
            {loading ? "Saving..." : "Save branding"}
          </button>
          {success && <span className="text-sm text-brand-600 font-medium">Saved!</span>}
          {slug && (
            <a
              href={`/join/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-muted hover:text-foreground underline transition-colors"
            >
              Preview join form ↗
            </a>
          )}
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </form>
    </div>
  );
}
