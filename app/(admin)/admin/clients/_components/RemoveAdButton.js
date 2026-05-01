"use client";

import { useState } from "react";

export default function RemoveAdButton({ clubId, userId }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);
    const res = await fetch(`/api/admin/clubs/${clubId}/remove-ad`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to remove AD");
      setLoading(false);
      setConfirming(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setConfirming(true)}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
      >
        Remove
      </button>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirming(false)} />

          {/* Modal */}
          <div className="relative z-10 w-80 bg-white rounded-2xl shadow-2xl p-6">
            <p className="text-base font-bold text-foreground mb-2">Remove Athletic Director?</p>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              This will unlink the account from this university. The user can be re-invited at any time.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRemove}
                disabled={loading}
                className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Removing..." : "Yes, remove"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
