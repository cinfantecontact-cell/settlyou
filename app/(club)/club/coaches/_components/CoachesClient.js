"use client";

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        className="text-xs px-2 py-1.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-500 w-40"
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
      {/* Invite form */}
      <div className="bg-white border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Invite a coach</h2>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="coach@university.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            required
            value={sport}
            onChange={e => setSport(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="">Select sport</option>
            {sports.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            type="submit"
            disabled={sending}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {sending ? "Sending..." : "Send invite"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-3 text-sm text-brand-600">Invite sent successfully.</p>}
      </div>

      {/* Active coaches */}
      {coaches.length > 0 && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Active coaches</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sport</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {coaches.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 font-medium text-foreground">{c.full_name || "—"}</td>
                  <td className="px-6 py-4 text-muted">{c.sport}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditEmailButton coachId={c.id} onSaved={() => router.refresh()} />
                      <ResetCoachPasswordButton coachId={c.id} />
                      <button
                        onClick={() => handleRemove(c.id, "active")}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pending invites */}
      {pending.length > 0 && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Pending invites</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sport</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sent</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {pending.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-foreground">{p.email}</td>
                  <td className="px-6 py-4 text-muted">{p.sport}</td>
                  <td className="px-6 py-4 text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(p.id, "pending")}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {coaches.length === 0 && pending.length === 0 && (
        <div className="bg-white border border-border rounded-xl px-6 py-12 text-center">
          <p className="text-sm text-muted">No coaches yet. Send an invite above to get started.</p>
        </div>
      )}
    </div>
  );
}
