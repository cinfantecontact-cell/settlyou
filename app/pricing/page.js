"use client";

import { useState } from "react";

const CLUB_PLANS = [
  {
    name: "Starter",
    description: "For clubs with occasional signings throughout the season.",
    highlight: false,
    features: [
      "Performance & recovery section",
      "Sports medicine & nutrition guidance",
      "15-section personalized guide",
      "Private athlete link",
      "Printable PDF",
      "8 language options",
      "Email support",
    ],
  },
  {
    name: "Club",
    description: "For clubs with an active transfer window and regular incoming players.",
    highlight: true,
    features: [
      "Performance & recovery section",
      "Sports medicine & nutrition guidance",
      "15-section personalized guide",
      "Private athlete link",
      "Printable PDF",
      "8 language options",
      "Custom join link with PIN protection",
      "Club logo on guides",
      "Priority support",
    ],
  },
  {
    name: "Elite",
    description: "For top-flight clubs signing year-round across the full squad.",
    highlight: false,
    features: [
      "Performance & recovery section",
      "Sports medicine & nutrition guidance",
      "15-section personalized guide",
      "Private athlete link",
      "Printable PDF",
      "8 language options",
      "Custom join link with PIN protection",
      "Club logo on guides",
      "Dedicated account manager",
      "Priority support",
    ],
  },
];

const COLLEGE_PLANS = [
  {
    name: "Program",
    description: "For one or two sports programs with international recruits each season.",
    highlight: false,
    features: [
      "Performance & recovery section",
      "Sports medicine & nutrition guidance",
      "College athlete flow",
      "F-1 visa & campus life guidance",
      "Private athlete link",
      "Printable PDF",
      "8 language options",
      "Email support",
    ],
  },
  {
    name: "Department",
    description: "For athletic departments running multiple sports with consistent international recruiting.",
    highlight: true,
    features: [
      "Performance & recovery section",
      "Sports medicine & nutrition guidance",
      "College athlete flow",
      "F-1 visa & campus life guidance",
      "Private athlete link",
      "Printable PDF",
      "8 language options",
      "Custom join link with PIN protection",
      "University logo on guides",
      "Priority support",
    ],
  },
  {
    name: "University",
    description: "For universities onboarding international athletes across all programs, every year.",
    highlight: false,
    features: [
      "Performance & recovery section",
      "Sports medicine & nutrition guidance",
      "College athlete flow",
      "F-1 visa & campus life guidance",
      "Private athlete link",
      "Printable PDF",
      "8 language options",
      "Custom join link with PIN protection",
      "University logo on guides",
      "Dedicated account manager",
      "Priority support",
    ],
  },
];

function Check() {
  return (
    <svg className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PlanGrid({ plans }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.name} className={`rounded-2xl border flex flex-col ${
          plan.highlight
            ? "border-brand-500 shadow-lg shadow-brand-100 relative"
            : "border-border"
        }`}>
          {plan.highlight && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide">
                Most popular
              </span>
            </div>
          )}
          <div className={`p-7 rounded-t-2xl ${plan.highlight ? "bg-brand-50" : "bg-surface"}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">{plan.name}</p>
            <p className="text-sm text-muted leading-relaxed">{plan.description}</p>
          </div>
          <div className="p-7 flex flex-col flex-1">
            <ul className="flex flex-col gap-3 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@settl.com"
              className={`mt-8 block text-center px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${
                plan.highlight
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "bg-white text-foreground border border-border hover:border-brand-400 hover:text-brand-600"
              }`}
            >
              Get in touch →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PricingPage() {
  const [tab, setTab] = useState("clubs");

  return (
    <main className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <a href="/"><img src="/settlyou-logo.png" alt="Settl" className="h-9" /></a>
        <div className="flex items-center gap-6">
          <a href="/pricing" className="text-sm font-medium text-foreground">Pricing</a>
          <a href="/login" className="text-sm text-muted hover:text-foreground transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Header */}
      <section className="text-center px-6 pt-20 pb-12 max-w-3xl mx-auto w-full">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-4 block">Pricing</span>
        <h1 className="text-5xl font-bold text-foreground leading-tight mb-5 tracking-tight">
          Simple, annual pricing
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto">
          One flat fee per year. No per-guide fees, no hidden costs. Cancel anytime.
        </p>
      </section>

      {/* Tab switcher */}
      <div className="flex justify-center mb-10 px-6">
        <div className="inline-flex bg-surface border border-border rounded-xl p-1 gap-1">
          <button
            onClick={() => setTab("clubs")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === "clubs" ? "bg-white text-foreground shadow-sm border border-border" : "text-muted hover:text-foreground"
            }`}
          >
            ⚽ For sports clubs
          </button>
          <button
            onClick={() => setTab("college")}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === "college" ? "bg-white text-foreground shadow-sm border border-border" : "text-muted hover:text-foreground"
            }`}
          >
            🎓 For universities
          </button>
        </div>
      </div>

      {/* Plans */}
      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <PlanGrid plans={tab === "clubs" ? CLUB_PLANS : COLLEGE_PLANS} />

        {/* Value prop */}
        <div className="mt-14 bg-surface border border-border rounded-2xl px-8 py-8 text-center max-w-2xl mx-auto">
          {tab === "clubs" ? (
            <>
              <p className="text-sm font-semibold text-foreground mb-2">Why Settl pays for itself</p>
              <p className="text-sm text-muted leading-relaxed">
                A traditional relocation consultant charges <span className="font-semibold text-foreground">$3,000–$15,000 per athlete</span>. Settl's full annual plan costs the same as a single traditional relocation — and covers your entire squad.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground mb-2">Built for international student-athletes</p>
              <p className="text-sm text-muted leading-relaxed">
                Every guide includes F-1 visa steps, campus life orientation, student health insurance, safety tips, and local recommendations — everything your incoming athletes need to hit the ground running.
              </p>
            </>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Common questions</h2>
          <div className="flex flex-col gap-8">
            {[
              {
                q: "What exactly does Settl produce?",
                a: "A fully personalized relocation guide — a structured document covering neighborhoods, housing, schools, dining, fitness, healthcare, local tips, emergency contacts, and more. Delivered as a private web link and printable PDF. We provide the information — not the physical relocation service.",
              },
              {
                q: "How long does it take to generate a guide?",
                a: "2–4 minutes from the moment you submit the athlete's profile.",
              },
              {
                q: "Can athletes fill in their own profile?",
                a: "Yes. Each plan includes a unique join link with PIN protection. Your club or department shares the link and PIN with the athlete, and they fill in their own details directly.",
              },
              {
                q: "Does it work for college athletes?",
                a: "Yes — Settl has a dedicated college athlete flow with F-1 visa guidance, campus housing, student health, safety, and integration sections tailored to student life.",
              },
              {
                q: "What languages are supported?",
                a: "Guides can be generated in English, Spanish, Portuguese, French, German, Italian, Dutch, and Arabic.",
              },
              {
                q: "What happens if I run out of guides?",
                a: "You can purchase additional guides or upgrade your plan at any time. Unused guides do not roll over.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-8 last:border-0 last:pb-0">
                <p className="font-semibold text-foreground mb-2">{q}</p>
                <p className="text-sm text-muted leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-600 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">See it before you commit</h2>
          <p className="text-brand-100 mb-8 leading-relaxed">
            Browse a real sample guide — every section, every recommendation, exactly what your athlete receives.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="/report/sample"
              className="bg-white text-brand-600 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-50 transition-colors">
              Pro athlete sample →
            </a>
            <a href="/report/sample-college"
              className="bg-brand-700 text-white border border-brand-400 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-800 transition-colors">
              College athlete sample →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-8 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Settl. All rights reserved.
      </footer>
    </main>
  );
}
