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
        setTimeout(() => setSent(false), 3000);
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
          sent
            ? "border-brand-200 text-brand-600 bg-brand-50"
            : "border-border text-muted hover:text-brand-600 hover:border-brand-200"
        }`}
      >
        {sent ? "Email sent" : "Send email"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-foreground mb-1">Send welcome email</h3>
            <p className="text-sm text-muted mb-5">{clubName}</p>
            <label className="block text-xs font-semibold text-foreground uppercase tracking-widest mb-2">
              Recipient email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="admin@university.edu"
              autoFocus
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 mb-5"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setOpen(false); setEmail(""); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={loading || !email}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
