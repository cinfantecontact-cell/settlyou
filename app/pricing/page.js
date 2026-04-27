"use client";

import { useState } from "react";
import ScrollReveal from "../_components/ScrollReveal";

function QuoteModal({ onClose }) {
  const [form, setForm] = useState({ institution: "", name: "", email: "", role: "", volume: "", message: "" });
  const [status, setStatus] = useState("idle");

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-brand-600 px-8 py-6">
          <button onClick={onClose} className="absolute top-4 right-5 text-white/60 hover:text-white text-xl font-light">✕</button>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-200 mb-1">Get a quote</p>
          <h2 className="text-xl font-bold text-white">Tell us about your program</h2>
          <p className="text-sm text-brand-100 mt-1">We'll send custom pricing within one business day.</p>
        </div>

        <div className="px-8 py-6">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-bold text-foreground mb-2">We got your request!</p>
              <p className="text-sm text-muted">We'll reach out to {form.email} within one business day with a custom quote.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Institution name *</label>
                  <input required value={form.institution} onChange={set("institution")} placeholder="Florida Atlantic University"
                    className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Your name *</label>
                  <input required value={form.name} onChange={set("name")} placeholder="Alex Johnson"
                    className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Work email *</label>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="alex@university.edu"
                    className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Your role</label>
                  <input value={form.role} onChange={set("role")} placeholder="Athletics Director, Registrar…"
                    className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Estimated students per year</label>
                <select value={form.volume} onChange={set("volume")}
                  className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  <option value="">— Select a range —</option>
                  <option value="Under 40">Under 40 (Micro)</option>
                  <option value="40–100">40 – 100 (Starter)</option>
                  <option value="100–200">100 – 200 (Pro)</option>
                  <option value="200+">200+ (Institution)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Anything else?</label>
                <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Student types, sports programs, specific questions…"
                  className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
              {status === "error" && (
                <p className="text-xs text-red-600">Something went wrong — please try again or email us at hello@settlyou.com.</p>
              )}
              <button type="submit" disabled={status === "sending"}
                className="bg-brand-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 mt-1">
                {status === "sending" ? "Sending…" : "Send request →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const TIERS = [
  {
    label: "Micro",
    price: "$2,400",
    unit: "/ yr",
    range: "Up to 40 students / yr",
    note: "Small programs or single-sport pilots.",
    annual: "~$60 / student",
  },
  {
    label: "Starter",
    price: "$4,900",
    unit: "/ yr",
    range: "Up to 100 students / yr",
    note: "Mid-size programs across multiple sports.",
    annual: "~$49 / student",
  },
  {
    label: "Pro",
    price: "$9,900",
    unit: "/ yr",
    range: "Up to 200 students / yr",
    note: "NCAA D1/D2 and larger universities.",
    annual: "~$50 / student",
  },
  {
    label: "Institution",
    price: "Custom",
    unit: "",
    range: "200+ students / yr",
    note: "Large state universities and multi-department programs.",
    annual: "From $14,000 / yr",
  },
];

const FEATURES = [
  "AI-generated relocation guide for each student",
  "Delivered within 24 hours",
  "Available in 18 languages",
  "Student upload portal & document collection",
  "Coach portal with per-sport access",
  "Custom branding — logo & colors on every guide",
  "Custom coach notes woven into every guide",
  "Email, WhatsApp & SMS delivery",
  "Guide open & download tracking",
  "Engagement analytics dashboard",
  "Weekly intake digest email",
  "Bulk resend & CSV export",
  "NCAA, NAIA & NJCAA eligibility guidance",
  "F-1 visa, SEVIS & international student support",
  "Onboarding call + email support",
];

const STATS = [
  {
    number: "From $49",
    label: "per student",
    comparison: "vs. $1,500–$3,000 per student at relocation firms",
  },
  {
    number: "10–15 hrs",
    label: "of staff time saved per student",
    comparison: "At $50/hr, that's $500–$750 in labor costs eliminated per student",
  },
  {
    number: "~3 min",
    label: "to generate a complete guide",
    comparison: "vs. 2–4 weeks with a traditional relocation firm",
  },
];

const COMPARISON_ROWS = [
  { label: "Cost per student",           firm: "$1,500–$3,000", staff: "$500–$750",    settl: "From $49" },
  { label: "Time to deliver",            firm: "2–4 weeks",     staff: "10–15 hrs",    settl: "~3 min" },
  { label: "Personalized guide",         firm: "Sometimes",     staff: "Rarely",       settl: "Always" },
  { label: "Coach portal",               firm: "No",            staff: "No",           settl: "Included" },
  { label: "Document upload portal",     firm: "Extra cost",    staff: "Manual",       settl: "Included" },
  { label: "Multi-language",             firm: "Extra cost",    staff: "Not included", settl: "18 languages" },
  { label: "Eligibility guidance",       firm: "Extra cost",    staff: "Limited",      settl: "Included" },
  { label: "Custom institution notes",   firm: "Manual",        staff: "Manual",       settl: "Automatic" },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {showModal && <QuoteModal onClose={() => setShowModal(false)} />}

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <a href="/"><img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-8" /></a>
        <div className="flex items-center gap-3">
          <a href="/pricing" className="text-sm font-medium text-brand-600 px-4 py-2 rounded-lg border border-brand-400">Pricing</a>
          <a href="/login" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Header */}
      <section className="text-center px-6 pt-20 pb-14 max-w-3xl mx-auto w-full">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-4 block">Pricing</span>
        <h1 className="text-5xl font-bold text-foreground leading-tight mb-5 tracking-tight">
          Simple pricing.<br />Everything included.
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto">
          Every tier includes the full platform — guides, coach portal, document uploads, analytics, branding. The only difference is how many students you serve.
        </p>
      </section>

      {/* Tiers */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {TIERS.map((tier) => (
            <div key={tier.label} className={`rounded-xl border p-6 flex flex-col gap-2 items-center text-center ${tier.label === "Starter" ? "border-brand-300 bg-brand-50" : "border-border bg-white"}`}>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{tier.label}</p>
              <div className="flex items-baseline gap-1 mt-1 justify-center">
                <p className="text-2xl font-bold text-foreground leading-none">{tier.price}</p>
                {tier.unit && <p className="text-sm text-muted">{tier.unit}</p>}
              </div>
              <p className="text-xs text-muted">{tier.range}</p>
              <p className="text-xs text-muted leading-relaxed mt-1 flex-1">{tier.note}</p>
              <div className="pt-3 border-t border-border mt-2 w-full">
                <p className="text-xs font-semibold text-brand-700">{tier.annual}</p>
                <p className="text-[10px] text-muted mt-0.5">Annual · use-it-or-lose-it</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-border rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center gap-4 mb-10">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Ready to see what it looks like for your program?</p>
            <p className="text-xs text-muted mt-1">We'll put together a custom quote and walk you through a live demo.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors">
              Request a quote →
            </button>
            <a href="/report/sample-college" target="_blank" rel="noopener noreferrer"
              className="px-5 py-3 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
              See sample guide
            </a>
          </div>
        </div>

        {/* What's included */}
        <div className="bg-white border border-border rounded-2xl p-8">
          <p className="text-sm font-bold text-foreground mb-1">Everything included — on every plan</p>
          <p className="text-xs text-muted mb-6">No locked features. No upgrade prompts. Every tier gets the full platform.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-sm text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI stats */}
      <section className="bg-surface border-t border-b border-border py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">The math</span>
              <h2 className="text-3xl font-bold text-foreground">This isn't a PDF service. It's a platform.</h2>
              <p className="text-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                Every student gets a personalized guide, a document upload portal, and ongoing support — all managed by your coaches without any manual work.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {STATS.map((s, i) => (
              <ScrollReveal key={s.number} delay={i * 120}>
                <div className="bg-white border border-border rounded-2xl p-8 flex flex-col gap-3 hover:border-brand-200 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-8 h-1 rounded-full bg-brand-500 mb-2" />
                  <p className="text-5xl font-bold text-brand-600 leading-none tracking-tight">{s.number}</p>
                  <p className="text-base font-semibold text-foreground leading-snug">{s.label}</p>
                  <p className="text-xs text-muted leading-relaxed mt-auto pt-3 border-t border-border">{s.comparison}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={100}>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted bg-surface w-1/4">Per student</th>
                    <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted bg-surface">Relocation firm</th>
                    <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted bg-surface">In-house staff</th>
                    <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 border-l border-brand-100">Settlyou</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={row.label} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-surface/50"}`}>
                      <td className="px-6 py-4 font-medium text-foreground">{row.label}</td>
                      <td className="px-6 py-4 text-center text-muted">{row.firm}</td>
                      <td className="px-6 py-4 text-center text-muted">{row.staff}</td>
                      <td className="px-5 py-4 text-center font-semibold text-brand-700 bg-brand-50 border-l border-brand-100">{row.settl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Common questions</h2>
          <div className="flex flex-col gap-8">
            {[
              {
                q: "How does annual pricing work?",
                a: "You pay once per year for your student tier — for example, $4,900/yr for up to 100 students. Students are allocated for the year: use them or lose them. No rollovers, no surprise invoices.",
              },
              {
                q: "Is every feature included on all plans?",
                a: "Yes. Every plan — from Micro to Institution — includes the full platform: AI guides, coach portal, document upload portal, custom branding, analytics, notifications, and multi-language support. The only difference between tiers is the number of students.",
              },
              {
                q: "What does one student include?",
                a: "A fully personalized relocation guide (web + PDF), a secure document upload portal, WhatsApp/SMS and email delivery, and access to the coach portal for ongoing tracking. Student-athletes get eligibility guidance. International students get visa and SEVIS support. All in their preferred language.",
              },
              {
                q: "Does Settlyou support NCAA, NAIA, and NJCAA?",
                a: "Yes. When you set up your institution, you select your athletic division. The AI uses that to generate division-specific eligibility guidance — GPA minimums, enrollment requirements, transfer rules, amateurism compliance, and English test requirements (TOEFL/IELTS).",
              },
              {
                q: "What languages are supported?",
                a: "18 languages — including Spanish, Portuguese, French, German, Italian, Dutch, Arabic, Korean, Japanese, Chinese (Simplified), and more. The guide is written in the student's language from the start — not translated after the fact.",
              },
              {
                q: "How do we get started?",
                a: "Send us an email at hello@settlyou.com or book a 30-minute call. We'll set up your account, walk you through the portal, and get your first intake ready — usually within one business day.",
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get a quote?</h2>
          <p className="text-brand-100 mb-8 leading-relaxed">
            Tell us your program size and we'll send custom pricing within one business day. No commitment required.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={() => setShowModal(true)}
              className="bg-white text-brand-600 px-7 py-4 rounded-lg text-base font-bold hover:bg-brand-50 transition-colors">
              Request a quote →
            </button>
            <a href="/report/sample-college" target="_blank" rel="noopener noreferrer"
              className="bg-brand-700 text-white border border-brand-400 px-7 py-4 rounded-lg text-base font-bold hover:bg-brand-800 transition-colors">
              See sample guide →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-8 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Settlyou. All rights reserved.
      </footer>
    </main>
  );
}
