"use client";

import { useState } from "react";

export default function ResetPasswordButton({ email, userId }) {
  const [state, setState] = useState("idle"); // idle | sending | done | error

  async function handleReset() {
    setState("sending");
    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userId ? { userId } : { email }),
    });
    setState(res.ok ? "done" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 3000);
  }

  return (
    <button
      onClick={handleReset}
      disabled={state === "sending" || state === "done"}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
        state === "done"
          ? "border-brand-200 bg-brand-50 text-brand-600"
          : state === "error"
          ? "border-red-200 text-red-600"
          : "border-border text-muted hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {state === "sending" ? "Sending..." : state === "done" ? "Sent" : state === "error" ? "Failed" : "Reset password"}
    </button>
  );
}
