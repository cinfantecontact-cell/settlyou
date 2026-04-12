"use client";

import { useEffect, useRef } from "react";

export default function ReportTracker({ requestId }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // Log guide_opened
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "guide_opened",
        request_id: requestId,
        metadata: {
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        },
      }),
    });

    // Log pdf_printed when user triggers print
    function handlePrint() {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "pdf_printed",
          request_id: requestId,
        }),
      });
    }

    window.addEventListener("beforeprint", handlePrint);
    return () => window.removeEventListener("beforeprint", handlePrint);
  }, [requestId]);

  return null;
}
