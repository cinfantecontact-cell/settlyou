"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AthleteActions({ requestId, athleteEmail, athleteName, reportToken, status }) {
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleResend() {
    if (!athleteEmail || !reportToken) return;
    setResending(true);
    await fetch(`/api/club/requests/${requestId}/resend`, { method: "POST" });
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  }

  async function handleDelete() {
    if (!confirm(`Delete ${athleteName || "this athlete"}? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/club/requests/${requestId}`, { method: "DELETE" });
    router.push("/club/athletes");
  }

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4">Actions</h2>
      <div className="flex flex-col gap-3">
        {status === "delivered" && athleteEmail && reportToken && (
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-surface transition-colors disabled:opacity-50"
          >
            {resent ? "Email sent!" : resending ? "Sending..." : "Resend report email"}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full py-2.5 rounded-lg text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete athlete"}
        </button>
      </div>
    </div>
  );
}
