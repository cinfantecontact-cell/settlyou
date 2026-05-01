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
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setConfirming(false)} />

          {/* Popover */}
          <div className="absolute right-0 top-9 z-50 w-64 bg-white border border-border rounded-xl shadow-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-1">Remove Athletic Director?</p>
            <p className="text-xs text-muted mb-4 leading-relaxed">
              This will unlink the account from this university. The user can be re-invited at any time.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemove}
                disabled={loading}
                className="flex-1 text-xs font-semibold py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Removing..." : "Yes, remove"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 text-xs font-medium py-2 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
