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

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Sure?</span>
        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {loading ? "Removing..." : "Yes, remove"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
    >
      Remove
    </button>
  );
}
