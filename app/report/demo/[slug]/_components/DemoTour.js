"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_KEY = "settl_demo_tour_v1";

const STEPS = [
  {
    element: "#demo-guide-hero",
    popover: {
      title: "Your brand, front and center",
      description:
        "Your logo and colors appear throughout the entire guide — every student who opens it sees your institution's identity immediately.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#demo-guide-notes",
    popover: {
      title: "Add your own welcome message",
      description:
        "Write a custom welcome note, attach key links (student portal, health center, compliance office), and upload PDFs — all shown in your brand colors.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#demo-guide-documents",
    popover: {
      title: "Attach your own documents",
      description:
        "Upload any PDF — compliance forms, housing packets, orientation materials — and they appear as downloadable cards directly in the student's guide.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#demo-guide-firstweek",
    popover: {
      title: "A day-by-day action plan",
      description:
        "Every student gets a First 7 Days checklist tailored to their background, visa status, and sport — so nothing falls through the cracks in that critical first week.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#demo-guide-city",
    popover: {
      title: "Curated local knowledge",
      description:
        "Restaurants, housing options, transit, and places to explore — all researched and written specifically for this city and this student's situation.",
      side: "top",
      align: "start",
    },
  },
];

function buildDriver() {
  return driver({
    showProgress: true,
    animate: true,
    overlayOpacity: 0.45,
    stagePadding: 10,
    popoverClass: "settl-tour-popover",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Got it",
    steps: STEPS,
  });
}

export default function DemoTour() {
  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY) === "done") return;

    const driverObj = buildDriver();
    driverObj.setConfig({
      onDestroyStarted: () => {
        driverObj.destroy();
        localStorage.setItem(TOUR_KEY, "done");
      },
    });

    const t = setTimeout(() => driverObj.drive(0), 900);
    return () => clearTimeout(t);
  }, []);

  function replayTour() {
    const driverObj = buildDriver();
    driverObj.drive(0);
  }

  return (
    <button
      onClick={replayTour}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-border shadow-md text-sm font-semibold text-foreground hover:bg-surface transition-colors no-print"
    >
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Replay tour
    </button>
  );
}
