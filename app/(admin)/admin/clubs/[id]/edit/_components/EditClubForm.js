"use client";

import { useState, useRef } from "react";

const COLORS = [
  { label: "Black", value: "#111111" },
  { label: "White", value: "#ffffff" },
  { label: "Navy", value: "#1a1a5e" },
  { label: "Royal Blue", value: "#2563eb" },
  { label: "Sky Blue", value: "#38bdf8" },
  { label: "Green", value: "#16a34a" },
  { label: "Emerald", value: "#059669" },
  { label: "Red", value: "#dc2626" },
  { label: "Maroon", value: "#7f1d1d" },
  { label: "Orange", value: "#ea580c" },
  { label: "Yellow", value: "#eab308" },
  { label: "Gold", value: "#d97706" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Pink", value: "#ec4899" },
  { label: "Light Pink", value: "#f9a8d4" },
  { label: "Gray", value: "#6b7280" },
];

export default function EditClubForm({ club }) {
  const [color, setColor] = useState(club.primary_color || "#111111");
  const [secondaryColor, setSecondaryColor] = useState(club.secondary_color || "#ffffff");
  const [logoPreview, setLogoPreview] = useState(club.logo_url || null);
  const [active, setActive] = useState(club.active);
  const [plan, setPlan] = useState(club.plan || "essentials");
  const [submitting, setSubmitting] = useState(false);
  const [pinVisible, setPinVisible] = useState(false);
  const fileRef = useRef(null);

  function handleLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    formData.set("primary_color", color);
    formData.set("active", active ? "true" : "false");
    formData.set("plan", plan);

    const res = await fetch(`/api/admin/clubs/${club.id}`, {
      method: "PATCH",
      body: formData,
    });

    if (res.ok) {
      window.location.href = `/admin/clubs/${club.id}/edit?success=1`;
    } else {
      window.location.href = `/admin/clubs/${club.id}/edit?error=1`;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 flex flex-col gap-6">

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Club / Institution name</label>
        <input name="name" required defaultValue={club.name}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
      </div>

      {/* Slug (read-only — changing it would break existing links) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Join link</label>
        <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-md">
          <span className="text-sm text-muted">settl.com/join/</span>
          <span className="text-sm font-mono text-foreground">{club.slug}</span>
        </div>
        <p className="text-xs text-muted">Slug can't be changed — it would break the existing link.</p>
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Type</label>
        <select name="type" defaultValue={club.type}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white">
          <option value="pro">Professional club</option>
          <option value="college">College / University</option>
        </select>
      </div>

      {/* Plan */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Plan</label>
        <select value={plan} onChange={(e) => setPlan(e.target.value)}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white">
          <option value="essentials">Essentials — $1,499/yr</option>
          <option value="premium">Premium — $2,499/yr</option>
        </select>
      </div>

      {/* Seat limit */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Seat limit <span className="text-muted font-normal">({club.seats_used} used so far)</span>
        </label>
        <input name="seat_limit" type="number" min={club.seats_used || 1} defaultValue={club.seat_limit}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
      </div>

      {/* PIN */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Access PIN</label>
        {club.pin && (
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-2 bg-surface border border-border rounded-md px-3 py-2 w-32">
              <span className="text-sm font-mono tracking-widest text-foreground">
                {pinVisible ? club.pin : "····"}
              </span>
            </div>
            <button type="button" onClick={() => setPinVisible((v) => !v)}
              className="text-xs text-brand-600 hover:underline font-medium">
              {pinVisible ? "Hide" : "Reveal"}
            </button>
          </div>
        )}
        <input name="pin" type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white w-32 tracking-widest font-mono"
          placeholder="New PIN" />
        <p className="text-xs text-muted">Enter a new 4-digit PIN to replace the current one, or leave blank to keep it.</p>
      </div>

      {/* Logo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Club logo</label>
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <img src={logoPreview} alt="Logo"
              className="w-14 h-14 rounded-xl object-contain border border-border bg-surface p-1" />
          ) : (
            <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-surface flex items-center justify-center text-muted text-xs">
              No logo
            </div>
          )}
          <button type="button" onClick={() => fileRef.current?.click()}
            className="text-sm text-brand-600 font-medium hover:underline">
            {logoPreview ? "Change logo" : "Upload logo"}
          </button>
          <input ref={fileRef} name="logo" type="file" accept="image/*"
            className="hidden" onChange={handleLogo} />
        </div>
      </div>

      {/* Primary Color */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Primary color <span className="text-muted font-normal">(main brand color)</span></label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c.value} type="button" title={c.label} onClick={() => setColor(c.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${color === c.value ? "border-brand-600 scale-110" : "border-transparent hover:scale-105"} ${c.value === "#ffffff" ? "border-border" : ""}`}
              style={{ backgroundColor: c.value }} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            className="w-8 h-8 rounded-md border border-border cursor-pointer p-0.5 bg-white shrink-0" />
          <input type="text" value={color} onChange={e => setColor(e.target.value)}
            className="w-28 border border-border rounded-md px-2 py-1 text-sm font-mono outline-none focus:ring-2 focus:ring-brand-500" />
          <span className="text-xs text-muted">{COLORS.find(c => c.value === color)?.label ?? "Custom"}</span>
        </div>
        <input type="hidden" name="primary_color" value={color} />
      </div>

      {/* Secondary Color */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Secondary color <span className="text-muted font-normal">(text and accents)</span></label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c.value} type="button" title={c.label} onClick={() => setSecondaryColor(c.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${secondaryColor === c.value ? "border-brand-600 scale-110" : "border-transparent hover:scale-105"} ${c.value === "#ffffff" ? "border-border" : ""}`}
              style={{ backgroundColor: c.value }} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
            className="w-8 h-8 rounded-md border border-border cursor-pointer p-0.5 bg-white shrink-0" />
          <input type="text" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
            className="w-28 border border-border rounded-md px-2 py-1 text-sm font-mono outline-none focus:ring-2 focus:ring-brand-500" />
          <span className="text-xs text-muted">{COLORS.find(c => c.value === secondaryColor)?.label ?? "Custom"}</span>
        </div>
        <input type="hidden" name="secondary_color" value={secondaryColor} />
      </div>

      {/* Custom notes — Premium only */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Club notes for every guide</label>
          {plan !== "premium" && (
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Premium</span>
          )}
        </div>
        <textarea
          name="custom_notes"
          defaultValue={club.custom_notes || ""}
          rows={5}
          disabled={plan !== "premium"}
          placeholder={plan === "premium"
            ? "Add anything you want included in every guide for this club — local spots, important contacts, specific advice, anything. The AI will weave it in naturally."
            : "Upgrade to Premium to add custom coach notes to every guide."}
          className={`border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-y ${plan !== "premium" ? "bg-surface text-muted cursor-not-allowed" : "bg-white"}`}
        />
        {plan !== "premium" ? (
          <p className="text-xs text-amber-600">Custom coach notes are included in every guide on the Premium plan.</p>
        ) : (
          <p className="text-xs text-muted">These notes will be included in every relocation guide generated for this club.</p>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Status</label>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setActive((a) => !a)}
            className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${active ? "bg-brand-600" : "bg-gray-200"}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${active ? "translate-x-4" : "translate-x-0"}`} />
          </div>
          <span className="text-sm text-foreground">{active ? "Active — athletes can submit" : "Inactive — link is disabled"}</span>
        </label>
      </div>

      <button type="submit" disabled={submitting}
        className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 mt-2">
        {submitting ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
