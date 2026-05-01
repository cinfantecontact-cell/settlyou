"use client";

import { useState } from "react";

export default function InviteAdForm({ clubId }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch(`/api/admin/clubs/${clubId}/invite-ad`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("success");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-3 items-end">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-muted">Athletic Director email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ad@university.edu"
            className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50 shrink-0"
        >
          {status === "loading" ? "Sending..." : status === "success" ? "Sent!" : "Send invite"}
        </button>
      </div>
      {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}
      {status === "success" && <p className="text-xs text-brand-600">Welcome email sent. Reloading...</p>}
    </form>
  );
}
