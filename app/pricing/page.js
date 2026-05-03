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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-brand-600 px-8 py-6">
          <button onClick={onClose} className="absolute top-4 right-5 text-white/60 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
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
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors">Close</button>
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
                  <option value="Up to 10">Up to 10 (Squad)</option>
                  <option value="Up to 25">Up to 25 (Roster)</option>
                  <option value="Up to 50">Up to 50 (Program)</option>
                  <option value="Unlimited">Unlimited (Department)</option>
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
                {status === "sending" ? "Sending…" : "Send request"}
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
    label: "Squad",
    range: "Up to 10 athletes",
    note: "For smaller programs onboarding a focused recruiting class.",
    popular: false,
  },
  {
    label: "Roster",
    range: "Up to 25 athletes",
    note: "For typical college programs managing a full incoming class of international and out-of-state athletes.",
    popular: true,
  },
  {
    label: "Program",
    range: "Up to 50 athletes",
    note: "For large rosters or programs combining multiple teams.",
    popular: false,
  },
  {
    label: "Department",
    range: "Unlimited athletes",
    note: "For athletic departments covering every sport, every athlete, every year.",
    popular: false,
  },
];

const FEATURES = [
  "AI-generated relocation guide for each athlete",
  "Delivered within 24 hours",
  "Available in 18 languages",
  "Athlete upload portal & document collection",
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
    number: "10–15 hrs",
    label: "of staff time saved per athlete",
    comparison: "That's 500–750 hours freed per year for a 50-athlete program — time that goes back to coaches and staff.",
  },
  {
    number: "~3 min",
    label: "to generate a complete, personalized guide",
    comparison: "vs. 2–4 weeks with a traditional relocation firm — and it's ready the moment the athlete submits their intake.",
  },
  {
    number: "Zero",
    label: "manual steps to deliver",
    comparison: "Guides are automatically sent by email, WhatsApp, and SMS — no staff follow-up needed. Coach portal tracks opens and downloads.",
  },
];

const COMPARISON_ROWS = [
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
    <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0 mt-0.5">
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

export default function PricingPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {showModal && <QuoteModal onClose={() => setShowModal(false)} />}

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 border-b border-border bg-white/90 backdrop-blur-sm">
        <a href="/"><img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-8" /></a>
        <div className="flex items-center gap-3">
          <a href="https://www.linkedin.com/company/settlyou" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brand-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="/login" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-blob absolute -top-40 -right-24 w-[500px] h-[500px] rounded-full bg-brand-200 opacity-25 blur-[100px]" />
          <div className="hero-blob-alt absolute -bottom-32 -left-24 w-[380px] h-[380px] rounded-full bg-brand-100 opacity-35 blur-[80px]" />
        </div>
        <div className="relative flex flex-col items-center text-center px-6 py-24 max-w-3xl mx-auto w-full">
          <h1 className="hero-animate hero-d2 text-5xl font-black text-foreground leading-tight mb-5 tracking-tight">
            Simple pricing.<br /><span className="gradient-text">Everything included.</span>
          </h1>
          <p className="hero-animate hero-d3 text-lg text-muted leading-relaxed max-w-xl mb-10">
            Every tier includes the full platform — guides, coach portal, document uploads, analytics, branding. The only difference is how many athletes you serve.
          </p>
          <div className="hero-animate hero-d4 flex items-center gap-8 flex-wrap justify-center">
            {[
              { value: "10–15 hrs", label: "saved per athlete" },
              { value: "~3 min", label: "to generate" },
              { value: "15+", label: "features included" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-black text-brand-600 leading-none">{s.value}</span>
                <span className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {TIERS.map((tier) => (
            <div key={tier.label} className={`relative flex flex-col rounded-2xl overflow-hidden border ${tier.popular ? "border-brand-500 shadow-xl" : "border-border shadow-sm"}`}>
              {tier.popular && (
                <div className="bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest text-center py-2">
                  Most popular
                </div>
              )}
              <div className={`flex-1 flex flex-col p-7 ${tier.popular ? "bg-brand-50" : "bg-white"}`}>
                <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-3">{tier.label}</p>
                <p className="text-2xl font-black text-foreground leading-none mb-1">{tier.range}</p>
                <p className="text-sm text-muted leading-relaxed mt-2 flex-1">{tier.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote CTA banner */}
        <div className="relative overflow-hidden bg-brand-600 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center gap-5 mb-12">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="flex-1 relative">
            <p className="text-base font-bold text-white">Ready to see what it looks like for your program?</p>
            <p className="text-xs text-brand-200 mt-1">We'll put together a custom quote and walk you through a live demo.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 relative">
            <button onClick={() => setShowModal(true)}
              className="px-6 py-3 rounded-lg bg-white text-brand-700 text-sm font-bold hover:bg-brand-50 transition-colors shadow-md">
              Request a quote
            </button>
            <a href="/report/sample-college" target="_blank" rel="noopener noreferrer"
              className="px-5 py-3 rounded-lg border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors">
              See sample guide
            </a>
          </div>
        </div>

        {/* What's included */}
        <ScrollReveal>
          <div className="rounded-2xl border border-brand-200 overflow-hidden">
            <div className="bg-brand-600 px-8 py-5">
              <p className="text-base font-bold text-white">Everything included — on every plan</p>
              <p className="text-xs text-brand-200 mt-1">No locked features. No upgrade prompts. Every tier gets the full platform.</p>
            </div>
            <div className="p-8 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ROI stats */}
      <section className="bg-surface border-t border-b border-border py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">The math</span>
              <h2 className="text-3xl font-bold text-foreground">This isn't a PDF service. It's a platform.</h2>
              <p className="text-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                Every hour your staff spends chasing documents, answering the same questions, or drafting welcome emails is an hour Settlyou eliminates — automatically.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
            {STATS.map((s, i) => (
              <ScrollReveal key={s.number} delay={i * 120}>
                <div className="feature-card relative bg-white border border-border rounded-2xl p-8 flex flex-col gap-3 h-full overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-400 to-brand-600" />
                  <p className="text-5xl font-black text-brand-600 leading-none tracking-tight">{s.number}</p>
                  <p className="text-base font-bold text-foreground leading-snug">{s.label}</p>
                  <p className="text-xs text-muted leading-relaxed mt-auto pt-3 border-t border-border">{s.comparison}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={100}>
            <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted bg-surface w-1/4">Per athlete</th>
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
                      <td className="px-5 py-4 text-center font-bold text-brand-700 bg-brand-50 border-l border-brand-100">{row.settl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">FAQ</span>
              <h2 className="text-3xl font-bold text-foreground">Common questions</h2>
            </div>
          </ScrollReveal>
          <div className="flex flex-col gap-0">
            {[
              {
                q: "How does annual pricing work?",
                a: "You pay once per year based on your program size. Athletes are allocated for the year: use them or lose them. No rollovers, no surprise invoices. Reach out for a custom quote.",
              },
              {
                q: "Is every feature included on all plans?",
                a: "Yes. Every plan — from Micro to Institution — includes the full platform: AI guides, coach portal, document upload portal, custom branding, analytics, notifications, and multi-language support. The only difference between tiers is the number of athletes.",
              },
              {
                q: "What does one athlete include?",
                a: "A fully personalized relocation guide (web + PDF), a secure document upload portal, WhatsApp/SMS and email delivery, and access to the coach portal for ongoing tracking. Athletes get eligibility guidance. International students get visa and SEVIS support. All in their preferred language.",
              },
              {
                q: "Does Settlyou support NCAA, NAIA, and NJCAA?",
                a: "Yes. When you set up your institution, you select your athletic division. The AI uses that to generate division-specific eligibility guidance — GPA minimums, enrollment requirements, transfer rules, amateurism compliance, and English test requirements.",
              },
              {
                q: "What languages are supported?",
                a: "18 languages — including Spanish, Portuguese, French, German, Italian, Dutch, Arabic, Korean, Japanese, Chinese (Simplified), and more. The guide is written in the athlete's language from the start — not translated after the fact.",
              },
              {
                q: "How do we get started?",
                a: "Send us an email at hello@settlyou.com or book a 30-minute call. We'll set up your account, walk you through the portal, and get your first intake ready — usually within one business day.",
              },
            ].map(({ q, a }, i) => (
              <ScrollReveal key={q} delay={i * 60}>
                <div className="border-b border-border py-7 last:border-0">
                  <p className="font-bold text-foreground mb-2.5">{q}</p>
                  <p className="text-sm text-muted leading-relaxed">{a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-28 px-6 bg-brand-600">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="hero-blob absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-400 opacity-30 blur-[100px] pointer-events-none" />
        <div className="hero-blob-alt absolute -bottom-24 -left-24 w-[350px] h-[350px] rounded-full bg-brand-800 opacity-40 blur-[80px] pointer-events-none" />
        <ScrollReveal>
          <div className="relative max-w-2xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100 mb-4 block">Ready to get started?</span>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Ready to get a quote?</h2>
            <p className="text-brand-100 mb-10 text-lg leading-relaxed">
              Tell us your program size and we'll send custom pricing within one business day. No commitment required.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button onClick={() => setShowModal(true)}
                className="bg-white text-brand-700 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-50 transition-colors shadow-lg">
                Request a quote
              </button>
              <a href="/report/sample-college" target="_blank" rel="noopener noreferrer"
                className="bg-white/15 text-white border border-white/30 px-8 py-4 rounded-lg text-base font-bold hover:bg-white/25 transition-colors">
                See sample guide
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-border px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
        <span>© {new Date().getFullYear()} Settlyou. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@settlyou.com" className="hover:text-foreground transition-colors">hello@settlyou.com</a>
          <a href="https://www.linkedin.com/company/settlyou" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy policy</a>
          <a href="/terms" className="hover:text-foreground transition-colors">Terms of service</a>
        </div>
      </footer>
    </main>
  );
}
