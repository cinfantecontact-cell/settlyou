"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteRelocationButton({ requestId, athleteName }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/admin/requests/${requestId}`, { method: "DELETE" });
    if (res.ok) {
      setShowModal(false);
      router.refresh();
    } else {
      setLoading(false);
      setShowModal(false);
      alert("Failed to delete. Please try again.");
    }
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-foreground mb-2">Delete relocation?</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              This will permanently remove{" "}
              <span className="font-semibold text-foreground">{athleteName || "this request"}</span> and all their data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:border-red-200 transition-colors"
      >
        Delete
      </button>
    </>
  );
}
