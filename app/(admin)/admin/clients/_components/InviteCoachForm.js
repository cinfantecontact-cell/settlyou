"use client";

import { useState } from "react";

const SPORTS = [
  "Men's Soccer", "Women's Soccer",
  "Men's Basketball", "Women's Basketball",
  "Baseball", "Softball",
  "American Football",
  "Men's Tennis", "Women's Tennis",
  "Men's Swimming", "Women's Swimming",
  "Men's Track & Field", "Women's Track & Field",
  "Men's Volleyball", "Women's Volleyball",
  "Men's Golf", "Women's Golf",
  "Wrestling",
  "Men's Gymnastics", "Women's Gymnastics",
  "Men's Rowing", "Women's Rowing",
  "Men's Cross Country", "Women's Cross Country",
  "Men's Lacrosse", "Women's Lacrosse",
  "Other",
];

export default function InviteCoachForm({ clubId }) {
  const [email, setEmail] = useState("");
  const [sport, setSport] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch(`/api/admin/clubs/${clubId}/invite-coach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, sport }),
    });

    if (res.ok) {
      setStatus("success");
      setEmail("");
      setSport("");
      setTimeout(() => {
        setStatus(null);
        window.location.reload();
      }, 1500);
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">Coach email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="coach@university.edu"
            className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">Sport</label>
          <select
            required
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="">— Select sport —</option>
            {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-600">{errorMsg}</p>
      )}
      <div>
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : status === "success" ? "Invite sent!" : "Send invite"}
        </button>
      </div>
    </form>
  );
}
