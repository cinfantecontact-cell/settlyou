"use client";

import { useState } from "react";

export default function PinForm({ currentPin }) {
  const [pin, setPin] = useState(currentPin || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSave() {
    if (pin && !/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/club/pin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: pin || null }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Failed to save.");
    }
  }

  async function handleClear() {
    setPin("");
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/club/pin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: null }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Failed to clear PIN.");
    }
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-1">Join link PIN</h2>
        <p className="text-xs text-muted">Require athletes to enter a 4-digit PIN before filling out the form. Leave blank to disable PIN protection.</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 4821"
          className="w-28 px-3 py-2 rounded-lg border border-border text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-foreground/20 text-sm font-medium text-foreground hover:border-foreground/40 transition-colors disabled:opacity-40"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {pin && (
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-40"
          >
            Remove PIN
          </button>
        )}
      </div>
      {success && <p className="text-sm text-brand-600 font-medium">Saved!</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
