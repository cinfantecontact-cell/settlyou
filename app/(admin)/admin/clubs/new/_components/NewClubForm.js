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
  { label: "Gray", value: "#6b7280" },
];

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-4">{children}</h2>
  );
}

export default function NewClubForm() {
  const [color, setColor] = useState("#111111");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [logoPreview, setLogoPreview] = useState(null);
  const [tier, setTier] = useState("squad");
  const [seatLimit, setSeatLimit] = useState(10);

  const TIER_LIMITS = { trial: 8, squad: 10, roster: 25, program: 50, department: 9999 };

  function handleTierChange(e) {
    const val = e.target.value;
    setTier(val);
    setSeatLimit(TIER_LIMITS[val] ?? 100);
  }
  const [submitting, setSubmitting] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const fileRef = useRef(null);
  const lookupTimerRef = useRef(null);

  function handleNameChange(e) {
    const name = e.target.value;
    clearTimeout(lookupTimerRef.current);
    if (name.trim().length < 4) return;
    lookupTimerRef.current = setTimeout(async () => {
      setLookingUp(true);
      try {
        const res = await fetch("/api/admin/lookup-club", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, type: "college" }),
        });
        const data = await res.json();
        setAddress(data.address || "");
        setCity(data.city || "");
        setState(data.state || "");
        setCountry(data.country || "");
      } catch {}
      setLookingUp(false);
    }, 800);
  }

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
    formData.set("secondary_color", secondaryColor);
    formData.set("type", "college");

    const res = await fetch("/api/admin/clubs", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      window.location.href = "/admin/clients?created=1";
    } else {
      const data = await res.json();
      const msg = data.error?.includes("unique") ? "slug_taken" : "create_failed";
      window.location.href = `/admin/clubs/new?error=${msg}`;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <input type="hidden" name="type" value="college" />

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-5">
        <SectionTitle>University info</SectionTitle>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">University name</label>
          <div className="relative">
            <input name="name" required
              className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white w-full"
              placeholder="Florida Atlantic University"
              onChange={handleNameChange} />
            {lookingUp && <span className="absolute right-3 top-2.5 text-xs text-muted animate-pulse">Looking up...</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Athletic division <span className="text-muted font-normal">(optional)</span></label>
          <select name="division"
            className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white">
            <option value="">— Select division —</option>
            <option value="NCAA Division I">NCAA Division I</option>
            <option value="NCAA Division II">NCAA Division II</option>
            <option value="NCAA Division III">NCAA Division III</option>
            <option value="NAIA">NAIA</option>
            <option value="NJCAA">NJCAA</option>
            <option value="Canadian U Sport">Canadian U Sport</option>
            <option value="Community College">Community College</option>
            <option value="High School">High School</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Join link slug</label>
          <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
            <span className="text-sm text-muted bg-surface px-3 py-2.5 border-r border-border shrink-0">settl.com/join/</span>
            <input name="slug" required pattern="[a-z0-9\-]+"
              className="px-3 py-2.5 text-sm outline-none bg-white flex-1"
              placeholder="florida-atlantic" />
          </div>
          <p className="text-xs text-muted">Lowercase letters, numbers, and hyphens only.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">City <span className="text-muted font-normal">(auto-filled)</span></label>
            <input name="city" value={city} onChange={(e) => setCity(e.target.value)}
              className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              placeholder="Boca Raton" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">State <span className="text-muted font-normal">(optional)</span></label>
            <input name="state" value={state} onChange={(e) => setState(e.target.value)}
              className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              placeholder="FL" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Country <span className="text-muted font-normal">(auto-filled)</span></label>
            <input name="country" value={country} onChange={(e) => setCountry(e.target.value)}
              className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              placeholder="United States" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Campus address <span className="text-muted font-normal">(optional — auto-filled)</span></label>
          <input name="address" value={address} onChange={(e) => setAddress(e.target.value)}
            className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            placeholder="777 Glades Rd, Boca Raton, FL" />
        </div>

        {city && (
          <p className="text-xs text-brand-600 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2">
            City base data will be auto-generated for <strong>{city}</strong> once you save.
          </p>
        )}
      </div>

      {/* Access */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-5">
        <SectionTitle>Access & limits</SectionTitle>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Pricing tier</label>
          <select name="plan" required value={tier} onChange={handleTierChange}
            className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white">
            <option value="trial">Trial — up to 8 athletes</option>
            <option value="squad">Squad — up to 10 athletes ($2,950/yr)</option>
            <option value="roster">Roster — up to 25 athletes ($6,500/yr)</option>
            <option value="program">Program — up to 50 athletes ($11,500/yr)</option>
            <option value="department">Department — unlimited athletes ($19,500/yr)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Guide limit <span className="text-muted font-normal">(max)</span></label>
            <input name="seat_limit" type="number" min={1} value={seatLimit} onChange={(e) => setSeatLimit(Number(e.target.value))}
              className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Access PIN <span className="text-muted font-normal">(4 digits)</span></label>
            <input name="pin" type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required
              className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white tracking-widest font-mono"
              placeholder="4821" />
          </div>
        </div>
        <p className="text-xs text-muted -mt-2">Share the PIN with the university separately — if the link leaks, the form stays protected.</p>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Admin email <span className="text-muted font-normal">(optional — sends welcome email + creates login)</span></label>
          <input name="admin_email" type="email"
            className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            placeholder="coach@university.edu" />
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-5">
        <SectionTitle>Branding</SectionTitle>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">University logo <span className="text-muted font-normal">(optional)</span></label>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl border border-dashed border-border bg-surface flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {logoPreview
                ? <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-1" />
                : <span className="text-xs text-muted">Logo</span>
              }
            </div>
            <div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-sm text-brand-600 font-medium hover:underline block">
                {logoPreview ? "Change logo" : "Upload logo"}
              </button>
              <p className="text-xs text-muted mt-0.5">PNG, JPG, or SVG</p>
            </div>
            <input ref={fileRef} name="logo" type="file" accept="image/*" className="hidden" onChange={handleLogo} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Primary color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button key={c.value} type="button" title={c.label} onClick={() => setColor(c.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${color === c.value ? "border-brand-600 scale-110" : "border-transparent hover:scale-105"} ${c.value === "#ffffff" ? "border-border" : ""}`}
                style={{ backgroundColor: c.value }} />
            ))}
          </div>
          <p className="text-xs text-muted">Selected: <span className="font-medium">{COLORS.find(c => c.value === color)?.label ?? color}</span></p>
          <input type="hidden" name="primary_color" value={color} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Secondary color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button key={c.value} type="button" title={c.label} onClick={() => setSecondaryColor(c.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${secondaryColor === c.value ? "border-brand-600 scale-110" : "border-transparent hover:scale-105"} ${c.value === "#ffffff" ? "border-border" : ""}`}
                style={{ backgroundColor: c.value }} />
            ))}
          </div>
          <p className="text-xs text-muted">Selected: <span className="font-medium">{COLORS.find(c => c.value === secondaryColor)?.label ?? secondaryColor}</span></p>
          <input type="hidden" name="secondary_color" value={secondaryColor} />
        </div>
      </div>


      <button type="submit" disabled={submitting}
        className="bg-brand-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50">
        {submitting ? "Creating..." : "Create university"}
      </button>
    </form>
  );
}
