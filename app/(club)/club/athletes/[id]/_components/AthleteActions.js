"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AthleteActions({ requestId, athleteName }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/club/requests/${requestId}`, { method: "DELETE" });
    if (!res.ok) {
      setDeleting(false);
      setShowConfirm(false);
      alert("Failed to delete. Please try again.");
      return;
    }
    window.location.href = "/club/athletes";
  }

  return (
    <>
      {/* Confirm delete modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-foreground mb-2">Delete athlete?</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              This will permanently remove{" "}
              <span className="font-semibold text-foreground">{athleteName || "this athlete"}</span> and all their relocation data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Actions</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="w-full py-2.5 rounded-lg text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Delete athlete
          </button>
        </div>
      </div>
    </>
  );
}
