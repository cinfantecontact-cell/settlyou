"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export default function ResendWhatsAppButton({ requestId }) {
  const [state, setState] = useState("idle"); // idle | confirming | loading | sent | error

  async function confirm() {
    setState("loading");
    const res = await fetch(`/api/club/requests/${requestId}/resend-whatsapp`, { method: "POST" });
    setState(res.ok ? "sent" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 3000);
  }

  if (state === "sent") return <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 bg-brand-50">Sent</span>;
  if (state === "error") return <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500">Failed</span>;
  if (state === "loading") return <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted opacity-50">Sending...</span>;

  return (
    <>
      <button
        onClick={() => setState("confirming")}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        Resend to WhatsApp
      </button>

      {state === "confirming" && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
          onClick={() => setState("idle")}
        >
          <div
            className="bg-white rounded-xl border border-border shadow-lg p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-foreground mb-1">Resend WhatsApp message?</h3>
            <p className="text-xs text-muted mb-5 leading-relaxed">The student will receive their document upload link again on WhatsApp.</p>
            <div className="flex gap-2">
              <button
                onClick={confirm}
                className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                Send
              </button>
              <button
                onClick={() => setState("idle")}
                className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
