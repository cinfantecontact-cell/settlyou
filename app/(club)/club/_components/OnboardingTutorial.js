"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "settl_onboarding_v2";

const STEPS = [
  {
    n: "1",
    title: "Share your join link",
    desc: "Copy the link and PIN below and send it to your incoming athlete. Takes 10 seconds.",
  },
  {
    n: "2",
    title: "Athlete fills the form",
    desc: "A 5-minute form covering their preferences, housing needs, and lifestyle.",
  },
  {
    n: "3",
    title: "Guide delivered in 24h",
    desc: "We generate a personalized relocation guide and email it directly to the athlete.",
  },
];

export default function OnboardingTutorial() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 mb-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-bold text-foreground">Get started in 3 steps</h2>
          <p className="text-xs text-muted mt-0.5">Here's how Settlyou works for your program.</p>
        </div>
        <button
          onClick={dismiss}
          className="text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-white"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {STEPS.map(({ n, title, desc }) => (
          <div key={n} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {n}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-brand-100 flex items-center justify-between">
        <p className="text-xs text-muted">
          Questions?{" "}
          <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline font-medium">
            hello@settlyou.com
          </a>
        </p>
        <button
          onClick={dismiss}
          className="text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          Got it, dismiss
        </button>
      </div>
    </div>
  );
}
