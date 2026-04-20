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
      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-brand-600 hover:border-brand-200 transition-colors whitespace-nowrap"
    >
      Send email
    </button>
  );
}
