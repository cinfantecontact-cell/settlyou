"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveRelocationButton({ requestId }) {
  const [loading, setLoading] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const router = useRouter();

  async function handleApprove(e) {
    e.stopPropagation();
    setLoading(true);
    const res = await fetch(`/api/requests/${requestId}/approve`, { method: "POST" });
    if (res.ok) {
      setDelivered(true);
      setLoading(false);
      setTimeout(() => router.refresh(), 1500);
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading || delivered}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-80 ${
        delivered
          ? "border-brand-200 bg-brand-50 text-brand-600"
          : "border-brand-200 text-brand-600 hover:bg-brand-50"
      }`}
    >
      {loading ? "Approving..." : delivered ? "Delivered" : "Approve & deliver"}
    </button>
  );
}
