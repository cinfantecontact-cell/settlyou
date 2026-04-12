"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GeneratingBadge() {
  const router = useRouter();

  useEffect(() => {
    const poll = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(poll);
  }, [router]);

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      Generating
    </span>
  );
}
