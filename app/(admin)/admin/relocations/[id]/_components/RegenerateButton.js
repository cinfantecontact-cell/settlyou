"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegenerateButton({ requestId }) {
  const [status, setStatus] = useState("idle");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  async function handleRegenerate() {
    setShowModal(false);
    setStatus("generating");
    const res = await fetch(`/api/requests/${requestId}/generate`, { method: "POST" });
    if (!res.ok) { setStatus("idle"); return; }
    setStatus("polling");
    const interval = setInterval(async () => {
      const check = await fetch(`/api/requests/${requestId}/status`);
      if (!check.ok) return;
      const { status: reqStatus } = await check.json();
      if (reqStatus !== "generating") { clearInterval(interval); setStatus("idle"); router.refresh(); }
    }, 3000);
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-foreground mb-2">Regenerate guide?</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">This will replace the current guide with a new one generated from scratch.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-surface transition-colors">Cancel</button>
              <button onClick={handleRegenerate} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors">Regenerate</button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowModal(true)}
        disabled={status !== "idle"}
        className="text-sm font-medium px-4 py-2 rounded-lg border border-border text-foreground hover:bg-surface transition-colors disabled:opacity-50"
      >
        {status === "idle" ? "Regenerate guide" : "Generating..."}
      </button>
    </>
  );
}
