"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveButton({ requestId, documentId, athleteToken }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleApprove() {
    setLoading(true);
    const res = await fetch(`/api/requests/${requestId}/approve`, { method: "POST" });
    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60"
    >
      {loading ? "Approving..." : "Approve & deliver"}
    </button>
  );
}
