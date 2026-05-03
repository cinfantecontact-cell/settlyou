"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-brand-100 text-brand-700",
  "bg-pink-100 text-pink-700",
];

function getAvatar(name) {
  const initials = (name || "?").split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  const color = AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
  return { initials, color };
}

function ResetCoachPasswordButton({ coachId }) {
  const [state, setState] = useState("idle");

  async function handleReset() {
    setState("sending");
    const res = await fetch("/api/club/reset-coach-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coachId }),
    });
    setState(res.ok ? "done" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 3000);
  }

  return (
    <button
      onClick={handleReset}
      disabled={state === "sending" || state === "done"}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
        state === "done" ? "border-brand-200 bg-brand-50 text-brand-600"
        : state === "error" ? "border-red-200 text-red-600"
        : "border-border text-muted hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {state === "sending" ? "Sending..." : state === "done" ? "Sent" : state === "error" ? "Failed" : "Reset password"}
    </button>
  );
}

function EditEmailButton({ coachId, onSaved }) {
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [state, setState] = useState("idle");

  async function handleSave() {
    if (!newEmail.trim()) return;
    setState("saving");
    const res = await fetch("/api/club/coaches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coachId, email: newEmail.trim() }),
    });
    if (res.ok) {
      setState("done");
      setOpen(false);
      setNewEmail("");
      onSaved();
      setTimeout(() => setState("idle"), 3000);
    } else {
      setState("error");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        {state === "done" ? "Email updated" : "Edit email"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="email"
        value={newEmail}
        onChange={e => setNewEmail(e.target.value)}
        placeholder="new@email.com"
        className="text-xs px-2 py-1.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 w-40"
        onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setOpen(false); }}
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={state === "saving"}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50"
      >
        {state === "saving" ? "Saving..." : state === "error" ? "Failed" : "Save"}
      </button>
      <button onClick={() => setOpen(false)} className="text-xs text-muted hover:text-foreground">Cancel</button>
    </div>
  );
}

export default function CoachesClient({ coaches, pending, sports }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sport, setSport] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleInvite(e) {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/club/coaches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, sport }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to send invite.");
      return;
    }

    setEmail("");
    setSport("");
    setSuccess(true);
    router.refresh();
  }

  async function handleRemove(id, type) {
    await fetch("/api/club/coaches", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Stats row */}
      {(coaches.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-600">{coaches.length}</p>
              <p className="text-xs font-medium text-muted mt-0.5">Active coaches</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-700">{pending.length}</p>
              <p className="text-xs font-medium text-muted mt-0.5">Pending invites</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">{[...new Set(coaches.map(c => c.sport).filter(Boolean))].length}</p>
              <p className="text-xs font-medium text-muted mt-0.5">Sports covered</p>
            </div>
          </div>
        </div>
      )}

      {/* Invite form */}
      <div className="bg-white border border-border rounded-xl p-6">
        <p className="text-sm font-semibold text-foreground mb-4">Invite a coach</p>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="coach@university.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors"
          />
          <select
            required
            value={sport}
            onChange={e => setSport(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors"
          >
            <option value="">Select sport</option>
            {sports.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            type="submit"
            disabled={sending}
            className="px-5 py-2.5 rounded-lg border border-brand-600 bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 hover:border-brand-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {sending ? "Sending..." : "Send invite"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-3 text-sm text-brand-600">Invite sent successfully.</p>}
      </div>

      {/* Active coaches — card grid */}
      {coaches.length > 0 && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Active coaches</p>
          </div>
          <div className="divide-y divide-border">
            {coaches.map(c => {
              const { initials, color } = getAvatar(c.full_name || c.email);
              return (
                <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.full_name || "—"}</p>
                    <p className="text-xs text-muted">{c.sport}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <EditEmailButton coachId={c.id} onSaved={() => router.refresh()} />
                    <ResetCoachPasswordButton coachId={c.id} />
                    <button
                      onClick={() => handleRemove(c.id, "active")}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending invites */}
      {pending.length > 0 && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Pending invites</p>
          </div>
          <div className="divide-y divide-border">
            {pending.map(p => (
              <div key={p.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.email}</p>
                  <p className="text-xs text-muted">{p.sport} · Invited {new Date(p.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 shrink-0">Pending</span>
                <button
                  onClick={() => handleRemove(p.id, "pending")}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors shrink-0"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {coaches.length === 0 && pending.length === 0 && (
        <div className="bg-white border border-border rounded-xl px-6 py-12 text-center">
          <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-3">
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <p className="text-sm text-muted">No coaches yet. Send an invite above to get started.</p>
        </div>
      )}
    </div>
  );
}
