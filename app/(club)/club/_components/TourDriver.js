"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { createClient } from "@/lib/supabase/client";

const TOUR_KEY = "settl_tour_v2";

async function markTourComplete() {
  try {
    await fetch("/api/club/complete-tour", { method: "POST" });
  } catch {
    // non-critical
  }
}

const STEPS = [
  {
    element: "#tour-join-link",
    popover: {
      title: "Start here — share this link",
      description: "Send this link to each incoming student. They fill in a 5-minute form and receive their personalized relocation guide within 24 hours.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-stats",
    popover: {
      title: "Track your guides",
      description: "See how many guides have been delivered, which are in progress, and how many credits you have left.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-assistant-btn",
    popover: {
      title: "Need help? Just ask",
      description: "Click this button anytime to ask a question about the portal — how to do something, where to find something, anything.",
      side: "top",
      align: "end",
    },
  },
];

export default function TourDriver({ page }) {
  useEffect(() => {
    if (page !== "dashboard") return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.tour_completed) return;
      if (localStorage.getItem(TOUR_KEY) === "done") return;

      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayOpacity: 0.4,
        stagePadding: 8,
        popoverClass: "settl-tour-popover",
        nextBtnText: "Next →",
        prevBtnText: "← Back",
        doneBtnText: "Done",
        steps: STEPS,
        onDestroyStarted: () => {
          driverObj.destroy();
          localStorage.setItem(TOUR_KEY, "done");
          markTourComplete();
        },
      });

      const t = setTimeout(() => driverObj.drive(0), 600);
      return () => clearTimeout(t);
    });
  }, [page]);

  return null;
}
