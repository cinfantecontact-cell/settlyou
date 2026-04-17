"use client";

import { useState } from "react";

export default function SendWelcomeEmailButton({ clubId, clubName }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clubs/${clubId}/send-welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
        setOpen(false);
        setEmail("");
        setTimeout(() => setSent(false), 4000);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to send email: ${data.error || "Unknown error"}`);
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return <span className="text-xs text-green-600 font-medium">Email sent ✓</span>;
  }

  if (open) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="admin@university.edu"
          autoFocus
          className="text-xs border border-border rounded px-2 py-1 w-44 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          onClick={handleSend}
          disabled={loading || !email}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-40"
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <button
          onClick={() => { setOpen(false); setEmail(""); }}
          className="text-xs text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      title="Send welcome email"
      className="p-1.5 rounded-md text-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </button>
  );
}
