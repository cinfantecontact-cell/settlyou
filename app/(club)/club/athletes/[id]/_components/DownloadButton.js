"use client";

import { useState } from "react";

export default function DownloadButton({ fileUrl, fileName }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/club/download-athlete-doc?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName || "document.pdf")}`
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "document.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
    >
      {loading ? "Downloading..." : "Download"}
    </button>
  );
}
