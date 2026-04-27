"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleGenerate(type = "regular") {
    setLoading(type);
    setError(null);
    try {
      const res = await fetch("/api/admin/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to generate");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleGenerate("regular")}
        disabled={!!loading}
        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Generating..." : "+ Generate post"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
