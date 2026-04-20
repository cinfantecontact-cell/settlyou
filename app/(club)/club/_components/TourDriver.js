"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_KEY = "settl_tour_v1";

function getState() {
  try {
    const raw = localStorage.getItem(TOUR_KEY);
    if (!raw) return { trigger: null, step: 0 };
    const parsed = JSON.parse(raw);
    // handle legacy string format
    if (typeof parsed === "string") return { trigger: parsed, step: 0 };
    return parsed;
  } catch {
    return { trigger: null, step: 0 };
  }
}

function saveState(trigger, step = 0) {
  localStorage.setItem(TOUR_KEY, JSON.stringify({ trigger, step }));
}

const PAGES = {
  dashboard: {
    trigger: null, // null = run if key is absent
    steps: [
      {
        element: "#tour-join-link",
        popover: {
          title: "Share with your athlete",
          description:
            "Copy this link and PIN and send them to each incoming player. They fill a 5-minute form — you get a full relocation guide within 24 hours.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#tour-stats",
        popover: {
          title: "At-a-glance numbers",
          description:
            "Track total reports, delivered guides, requests in progress, and seats remaining on your plan.",
          side: "bottom",
          align: "start",
        },
      },
    ],
    next: "notifications",
    nextPath: "/club/notifications",
  },
  notifications: {
    trigger: "notifications",
    steps: [
      {
        element: "#tour-notifications-list",
        popover: {
          title: "Guide delivery notifications",
          description: "Every time a guide is delivered to one of your athletes, you'll see it here — with a direct link to view their guide.",
          side: "bottom",
          align: "start",
        },
      },
    ],
    next: "athletes",
    nextPath: "/club/athletes",
  },
  athletes: {
    trigger: "athletes",
    steps: [
      {
        element: "#tour-athletes-table",
        popover: {
          title: "All your athletes",
          description:
            "Every submission lives here — check status, open delivered guides, and resend reports to athletes.",
          side: "top",
          align: "start",
        },
      },
    ],
    next: "billing",
    nextPath: "/club/billing",
  },
  billing: {
    trigger: "billing",
    steps: [
      {
        element: "#tour-billing-card",
        popover: {
          title: "Your plan & usage",
          description:
            "See reports used, what's included in your plan, and how to unlock Premium features like custom branding and engagement tracking.",
          side: "bottom",
          align: "start",
        },
      },
    ],
    next: "account",
    nextPath: "/club/account",
  },
  account: {
    trigger: "account",
    steps: [
      {
        element: "#tour-account-form",
        popover: {
          title: "Club settings",
          description:
            "Update your club name and email. On Premium, upload your logo and set brand colors — they'll appear on every athlete's guide.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#tour-change-password",
        popover: {
          title: "Change password",
          description: "Update your password anytime from here.",
          side: "bottom",
          align: "start",
        },
      },
    ],
    next: "done",
    nextPath: null,
  },
};

export default function TourDriver({ page }) {
  useEffect(() => {
    const { trigger: storedTrigger, step: storedStep } = getState();
    const config = PAGES[page];
    if (!config) return;

    const shouldRun = page === "dashboard" ? storedTrigger === null : storedTrigger === config.trigger;
    if (!shouldRun) return;

    // Save step index as the tour advances so we can resume mid-page
    const stepsWithTracking = config.steps.map((s, i) => ({
      ...s,
      onHighlightStarted: () => saveState(config.trigger, i),
    }));

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayOpacity: 0.4,
      stagePadding: 8,
      popoverClass: "settl-tour-popover",
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: config.nextPath ? "Continue →" : "Done",
      steps: stepsWithTracking,
      onDestroyStarted: () => {
        const completed = !driverObj.hasNextStep();
        driverObj.destroy();
        if (completed) {
          saveState(config.next, 0);
          if (config.nextPath) window.location.href = config.nextPath;
        } else {
          // User dismissed early — mark done
          saveState("done", 0);
        }
      },
    });

    // Resume from saved step if returning mid-page, otherwise start from 0
    const startStep = storedTrigger === config.trigger ? (storedStep ?? 0) : 0;
    const t = setTimeout(() => driverObj.drive(startStep), 600);
    return () => clearTimeout(t);
  }, [page]);

  return null;
}
