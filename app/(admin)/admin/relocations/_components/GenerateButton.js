"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GenerateButton({ requestId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        router.refresh();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [loading, router]);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/requests/${requestId}/generate`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to start generation");
        setLoading(false);
      }
      // Generation runs in background — polling loop handles the rest
    } catch {
      setError("Could not reach server.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700 transition-colors disabled:opacity-60 font-medium whitespace-nowrap"
      >
        {loading ? "Generating..." : "Generate document"}
      </button>
      {loading && (
        <span className="text-xs text-muted">Usually takes 60–90 seconds</span>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
