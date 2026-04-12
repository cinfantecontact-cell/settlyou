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

export default function NewClubForm() {
  const [color, setColor] = useState("#111111");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("pro");
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
          body: JSON.stringify({ name, type }),
        });
        const data = await res.json();
        if (data.address && !address) setAddress(data.address);
        if (data.city && !city) setCity(data.city);
        if (data.country && !country) setCountry(data.country);
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

    const res = await fetch("/api/admin/clubs", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      window.location.href = "/admin/clubs?created=1";
    } else {
      const data = await res.json();
      const msg = data.error?.includes("unique") ? "slug_taken" : "create_failed";
      window.location.href = `/admin/clubs/new?error=${msg}`;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 flex flex-col gap-6">

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Club / Institution name</label>
        <div className="relative">
          <input name="name" required
            className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white w-full"
            placeholder="Real Madrid CF"
            onChange={handleNameChange} />
          {lookingUp && <span className="absolute right-3 top-2.5 text-xs text-muted">Looking up...</span>}
        </div>
      </div>

      {/* Slug */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Join link slug
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted shrink-0">settl.com/join/</span>
          <input name="slug" required pattern="[a-z0-9\-]+"
            className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white flex-1"
            placeholder="real-madrid" />
        </div>
        <p className="text-xs text-muted">Lowercase letters, numbers, and hyphens only.</p>
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Type</label>
        <select name="type" required value={type} onChange={(e) => setType(e.target.value)}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white">
          <option value="pro">Professional club</option>
          <option value="college">College / University</option>
        </select>
      </div>

      {/* Address / City / Country */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          {type === "college" ? "Campus address" : "Training ground address"} <span className="text-muted font-normal">(optional — auto-filled)</span>
        </label>
        <input name="address" value={address} onChange={(e) => setAddress(e.target.value)}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          placeholder={type === "college" ? "123 Campus Drive, Building A" : "Training Complex, North District"} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">City <span className="text-muted font-normal">(auto-filled)</span></label>
          <input name="city" value={city} onChange={(e) => setCity(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            placeholder="Madrid" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Country <span className="text-muted font-normal">(auto-filled)</span></label>
          <input name="country" value={country} onChange={(e) => setCountry(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            placeholder="Spain" />
        </div>
      </div>

      {/* Seat limit */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Seat limit <span className="text-muted font-normal">(max reports)</span>
        </label>
        <input name="seat_limit" type="number" min={1} defaultValue={10}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
      </div>

      {/* PIN */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Access PIN <span className="text-muted font-normal">(4 digits — athletes need this to open the form)</span>
        </label>
        <input name="pin" type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white w-32 tracking-widest font-mono"
          placeholder="e.g. 4821" />
        <p className="text-xs text-muted">Share this PIN with the club separately from the link — if the link leaks, the form stays protected.</p>
      </div>

      {/* Logo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Club logo <span className="text-muted font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <img src={logoPreview} alt="Logo preview"
              className="w-14 h-14 rounded-xl object-contain border border-border bg-surface p-1" />
          ) : (
            <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-surface flex items-center justify-center text-muted text-xs">
              Logo
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
        <label className="text-sm font-medium text-foreground">
          Primary color <span className="text-muted font-normal">(main brand color)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c.value} type="button" title={c.label} onClick={() => setColor(c.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${color === c.value ? "border-brand-600 scale-110" : "border-transparent hover:scale-105"} ${c.value === "#ffffff" ? "border-border" : ""}`}
              style={{ backgroundColor: c.value }} />
          ))}
        </div>
        <p className="text-xs text-muted">Selected: <span className="font-medium">{COLORS.find(c => c.value === color)?.label ?? color}</span></p>
        <input type="hidden" name="primary_color" value={color} />
      </div>

      {/* Secondary Color */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Secondary color <span className="text-muted font-normal">(text and accents)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c.value} type="button" title={c.label} onClick={() => setSecondaryColor(c.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${secondaryColor === c.value ? "border-brand-600 scale-110" : "border-transparent hover:scale-105"} ${c.value === "#ffffff" ? "border-border" : ""}`}
              style={{ backgroundColor: c.value }} />
          ))}
        </div>
        <p className="text-xs text-muted">Selected: <span className="font-medium">{COLORS.find(c => c.value === secondaryColor)?.label ?? secondaryColor}</span></p>
        <input type="hidden" name="secondary_color" value={secondaryColor} />
      </div>

      {/* Custom notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Club notes for every guide <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          name="custom_notes"
          rows={5}
          placeholder="Add anything you want included in every guide for this club — local spots, important contacts, specific advice, anything. The AI will weave it in naturally."
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white resize-y"
        />
        <p className="text-xs text-muted">These notes will be included in every relocation guide generated for this club.</p>
      </div>

      <button type="submit" disabled={submitting}
        className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 mt-2">
        {submitting ? "Creating..." : "Create club & get link →"}
      </button>
    </form>
  );
}
