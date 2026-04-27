"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function GeneratingBadge({ startedAt }) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const poll = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(poll);
  }, [router]);

  useEffect(() => {
    if (!startedAt) return;
    const getElapsed = () => Math.floor((Date.now() - new Date(startedAt)) / 1000);
    setElapsed(getElapsed());
    const tick = setInterval(() => setElapsed(getElapsed()), 1000);
    return () => clearInterval(tick);
  }, [startedAt]);

  return (
    <span className="text-xs text-blue-700 font-mono tabular-nums">
      {startedAt ? formatDuration(elapsed) : "—"}
    </span>
  );
}
