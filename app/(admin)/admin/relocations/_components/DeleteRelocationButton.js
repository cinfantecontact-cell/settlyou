"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteRelocationButton({ requestId, athleteName }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/admin/requests/${requestId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete. Please try again.");
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-600 hover:underline font-medium disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Confirm"}
        </button>
        <span className="text-muted text-xs">/</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors"
    >
      Delete
    </button>
  );
}
