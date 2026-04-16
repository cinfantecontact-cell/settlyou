"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteClubButton({ clubId, clubName }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clubs/${clubId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to delete club: ${data.error || "Unknown error"}`);
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Delete {clubName}?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-muted hover:text-red-500 transition-colors text-sm"
      title="Delete"
    >
      🗑️
    </button>
  );
}
