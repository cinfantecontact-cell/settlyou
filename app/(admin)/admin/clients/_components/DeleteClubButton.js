"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function DeleteClubButton({ clubId, clubName }) {
  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);
  const router = useRouter();

  function handleOpen() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clubs/${clubId}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else alert("Failed to delete club.");
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
      setPos(null);
    }
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors"
      >
        Delete
      </button>

      {pos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPos(null)} />
          <div
            className="fixed z-50 bg-white border border-border rounded-xl shadow-xl p-4 w-56"
            style={{ top: pos.top, right: pos.right }}
          >
            <p className="text-sm font-semibold text-foreground mb-1">Delete club?</p>
            <p className="text-xs text-muted mb-4 leading-relaxed">"{clubName}" and all its data will be permanently removed.</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setPos(null)}
                className="flex-1 text-xs font-medium bg-surface hover:bg-border text-foreground py-2 rounded-lg border border-border transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
