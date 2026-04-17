"use client";

import { useState } from "react";

export default function ResendButton({ requestId }) {
  const [state, setState] = useState("idle"); // idle | loading | sent | error

  async function resend() {
    setState("loading");
    const res = await fetch(`/api/requests/${requestId}/resend`, { method: "POST" });
    setState(res.ok ? "sent" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 3000);
  }

  if (state === "sent") return <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 bg-brand-50">Sent</span>;
  if (state === "error") return <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500">Failed</span>;

  return (
    <button
      onClick={resend}
      disabled={state === "loading"}
      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-40"
    >
      {state === "loading" ? "Sending..." : "Resend"}
    </button>
  );
}
