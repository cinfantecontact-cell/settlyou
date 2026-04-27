import { notFound } from "next/navigation";
import { getClientBySlug } from "@/lib/pitch-clients";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) return {};
  return {
    title: `${client.name} × Settlyou`,
    description: `A personalized relocation guide for every incoming ${client.type === "athletics" ? "student-athlete" : "student"} at ${client.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function PitchPage({ params }) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) notFound();

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <PitchNav client={client} />
      <HeroSection client={client} />
      <FreePilotCallout client={client} />
      <HowItWorks />
      <AdminDashboard client={client} />
      <WhatStudentsReceive client={client} />
      <ROISection client={client} />
      <PricingSection />
      <FinalCTA client={client} />
      <PitchFooter />
    </main>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────

function PitchNav({ client }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-3">
        {client.logoUrl ? (
          <img src={client.logoUrl} alt={client.name} className="h-9 w-9 object-contain rounded-lg bg-white p-1 border border-border" />
        ) : (
          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: client.primaryColor }}>
            <span className="text-white text-xs font-bold">{client.shortName.slice(0, 2)}</span>
          </div>
        )}
        <span className="text-muted text-sm font-medium">×</span>
        <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-6" />
      </div>
      <a
        href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
      >
        Book a call
      </a>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection({ client }) {
  const subline =
    client.type === "athletics"
      ? `Built for ${client.shortName}'s coaching staff — help every incoming ${client.sport ? `${client.sport} recruit` : "recruit"} land, settle, and stay focused${client.city ? ` in ${client.city}` : ""}.`
      : client.type === "admissions"
      ? `Give ${client.shortName}'s admissions office a scalable way to support every student from acceptance to arrival${client.city ? ` in ${client.city}` : ""}.`
      : `Settlyou generates a personalized guide for each incoming student — built around who they are and where they're going${client.city ? ` in ${client.city}` : ""}.`;

  return (
    <section className="relative overflow-hidden py-24 px-6" style={{ background: client.primaryColor }}>
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center gap-7">
        <span className="text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "white" }}>
          {client.shortName} × Settlyou
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
          A personalized relocation guide for every incoming student
        </h1>
        <p className="text-base md:text-lg leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.8)" }}>
          {subline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <a
            href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8"
        target="_blank"
        rel="noopener noreferrer"
            className="bg-white font-semibold px-7 py-3.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
            style={{ color: client.primaryColor }}
          >
            Book a 30-min call
          </a>
          <a
            href={client.slug !== "sample" ? `/report/demo/${client.slug}` : "/report/sample-college"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold px-7 py-3.5 rounded-lg text-sm text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)" }}
          >
            See a sample guide
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Free pilot callout ──────────────────────────────────────────────────────

function FreePilotCallout({ client }) {
  return (
    <section className="bg-surface border-y border-border py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-base font-bold text-foreground">Start with 15 free guides. No contract, no credit card.</p>
          <p className="text-sm text-muted mt-0.5">Try Settlyou with your next intake — we'll set everything up for you.</p>
        </div>
        <a
          href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8"
        target="_blank"
        rel="noopener noreferrer"
          className="shrink-0 text-white font-semibold px-6 py-3 rounded-lg text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ background: client.primaryColor }}
        >
          Book a 30-min call
        </a>
      </div>
    </section>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Share your join link with students",
      body: "Each institution gets a unique link and optional PIN. Share it however you like — email, team chat, orientation packet.",
    },
    {
      n: "02",
      title: "Students fill a 5-minute form",
      body: "On any device, in their language. They tell us about their background, housing needs, family, and lifestyle. Athletes add sport and training schedule.",
    },
    {
      n: "03",
      title: "Guide delivered to their inbox within 24 hours",
      body: "A web link and downloadable PDF — neighborhoods, banking, eligibility, paperwork, and everything they need before they land.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">How it works</span>
          <h2 className="text-3xl font-bold text-foreground">Three steps. Zero staff time.</h2>
        </div>
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div key={s.n} className={`flex items-start gap-8 py-10 ${i < steps.length - 1 ? "border-b border-border" : ""}`}>
              <p className="text-5xl font-bold text-brand-600 leading-none shrink-0 w-16">{s.n}</p>
              <div>
                <p className="text-lg font-bold text-foreground mb-2">{s.title}</p>
                <p className="text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Admin dashboard ─────────────────────────────────────────────────────────

function AdminDashboard({ client }) {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Real-time student tracker",
      body: "See every student's guide status at a glance — Received, Generating, Quality Check, or Sent. Filter by name, status, sport, or date. Know exactly where each intake stands.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: "Guide Notes — your voice in every guide",
      body: "Write a welcome message, add compliance deadlines, health center contacts, or anything your students need to know. The AI weaves your notes naturally into every guide — your words, automatically.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      ),
      title: "Document uploads",
      body: "Attach any PDF — housing forms, eligibility waivers, student handbooks, insurance info. Every guide automatically includes your institution's documents, ready to download.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: "Delivery & open notifications",
      body: "Get notified when each guide is delivered and when the student opens it for the first time. A weekly email digest summarizes your full intake — delivered every Monday.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "Bulk resend & CSV export",
      body: "Need to resend a guide? One click. Managing a large intake? Select multiple students and resend in bulk. Export your full roster as a CSV anytime.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "Your branding, on every guide",
      body: "Upload your logo and set your institution's colors. Every guide — web and PDF — carries your brand from the header down. Students see your name, not ours.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Your dashboard</span>
          <h2 className="text-3xl font-bold text-foreground">Everything managed in one place</h2>
          <p className="text-sm text-muted mt-4 max-w-xl mx-auto leading-relaxed">
            Your admin portal gives {client.shortName} full visibility and control — without any of the manual work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-border rounded-xl p-6 flex flex-col gap-3 hover:border-brand-200 hover:shadow-sm transition-all">
              <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                {f.icon}
              </div>
              <p className="font-semibold text-foreground text-sm leading-snug">{f.title}</p>
              <p className="text-xs text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What students receive ────────────────────────────────────────────────────

function Check() {
  return (
    <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function WhatStudentsReceive({ client }) {
  const left = [
    "Housing search — neighborhoods, budget, commute",
    "Banking & financial setup",
    "Health insurance options",
    "F-1 visa & SEVIS check-ins (international students)",
    "NIL compliance & eligibility (student-athletes)",
    "FAFSA & financial aid guidance",
    "Driver's license & state ID",
    "18 language options — guide written in their language",
  ];
  const right = [
    "Neighborhoods near campus",
    "Getting around — transit, rideshare, cars",
    "Restaurants & food scene",
    "Health & wellness spots",
    "Student organizations & social life",
    "Key campus resources & contacts",
    "First 7 days checklist",
    "Downloadable PDF + web guide",
  ];

  return (
    <section className="bg-surface border-t border-b border-border py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">What's inside</span>
          <h2 className="text-3xl font-bold text-foreground">Everything a student needs to land and settle in</h2>
          <p className="text-sm text-muted mt-4 max-w-xl mx-auto leading-relaxed">Each guide is built from scratch for that specific student — their city, their background, their sport, their family situation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-border rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-5">Paperwork & Admin</p>
            <div className="flex flex-col gap-3">
              {left.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-5">City & Local Life</p>
            <div className="flex flex-col gap-3">
              {right.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {client?.slug && client.slug !== "sample" && (
          <div className="mt-10 text-center">
            <p className="text-sm text-muted mb-4">
              See what a guide looks like for {client.name} students.
            </p>
            <a
              href={`/report/demo/${client.slug}`}
              className="inline-block px-8 py-3 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-surface transition-colors"
            >
              Preview a sample guide →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ROI section ─────────────────────────────────────────────────────────────

function ROISection({ client }) {
  const stats = [
    { number: "From $49", label: "per student", sub: "vs. $1,500–$3,000 per student at relocation firms" },
    { number: "10–15 hrs", label: "of staff time saved per student", sub: "At $50/hr, that's $500–$750 in labor costs eliminated per student" },
    { number: "~3 min", label: "to generate a complete guide", sub: "vs. 2–4 weeks with a traditional relocation firm" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">The math</span>
          <h2 className="text-3xl font-bold text-foreground">A fraction of the cost. A fraction of the time.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.number} className="bg-white border border-border rounded-2xl p-8 flex flex-col gap-3">
              <div className="w-8 h-1 rounded-full bg-brand-500 mb-2" />
              <p className="text-4xl font-bold text-brand-600 leading-none tracking-tight">{s.number}</p>
              <p className="text-base font-semibold text-foreground leading-snug">{s.label}</p>
              <p className="text-xs text-muted leading-relaxed mt-auto pt-3 border-t border-border">{s.sub}</p>
            </div>
          ))}
        </div>
        {client.estimatedStudents && (
          <p className="text-sm text-muted text-center mt-8 max-w-xl mx-auto">
            For a program serving{" "}
            <strong className="text-foreground">{client.estimatedStudents} students/yr</strong>, that's up to{" "}
            <strong className="text-foreground">{(client.estimatedStudents * 15).toLocaleString()} hours</strong> of staff time saved annually — before a single guide is billed.
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

const TIERS = [
  { label: "Micro",       price: "$2,400", unit: "/ yr", range: "Up to 40 students / yr",  note: "Small programs or single-sport pilots.",        per: "~$60 / student" },
  { label: "Starter",     price: "$4,900", unit: "/ yr", range: "Up to 100 students / yr", note: "Mid-size programs across multiple sports.",      per: "~$49 / student" },
  { label: "Pro",         price: "$9,900", unit: "/ yr", range: "Up to 200 students / yr", note: "NCAA D1/D2 and larger universities.",             per: "~$50 / student" },
  { label: "Institution", price: "Custom", unit: "",     range: "200+ students / yr",       note: "Large state universities — contact us.",         per: "From $14,000 / yr" },
];

function PricingSection() {
  return (
    <section className="bg-surface border-t border-b border-border py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Pricing</span>
          <h2 className="text-3xl font-bold text-foreground">Simple pricing. Everything included.</h2>
          <p className="text-sm text-muted mt-3 max-w-lg mx-auto leading-relaxed">
            Every tier includes the full platform — guides, coach portal, document uploads, analytics, branding. The only difference is how many students you serve.
          </p>
          <div className="inline-block mt-5 px-5 py-2 rounded-full bg-brand-50 border border-brand-100">
            <p className="text-sm font-bold text-brand-700">Start free — 1 sport, 1 term, up to 15 students. No contract, no credit card.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-200 bg-brand-50 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-brand-100">
            {TIERS.map((tier) => (
              <div key={tier.label} className="px-6 py-7 flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-500">{tier.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-3xl font-bold text-foreground leading-none">{tier.price}</p>
                  {tier.unit && <p className="text-sm text-muted">{tier.unit}</p>}
                </div>
                <p className="text-xs text-muted">{tier.range}</p>
                <p className="text-xs text-muted leading-relaxed mt-1">{tier.note}</p>
                <div className="mt-auto pt-3 border-t border-brand-100">
                  <p className="text-xs font-semibold text-brand-700">{tier.per}</p>
                  <p className="text-[10px] text-muted mt-0.5">Annual · use-it-or-lose-it</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted text-center mt-5 leading-relaxed">
          Pay once per year. Students are allocated for your intake — no rollovers, no surprise invoices.
        </p>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ client }) {
  return (
    <section className="py-24 px-6 text-center" style={{ background: client.primaryColor }}>
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-white">Ready to try it?</h2>
        <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
          Start with 15 free guides — no contract, no credit card. We'll set up your account and walk you through it.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8"
        target="_blank"
        rel="noopener noreferrer"
            className="bg-white font-semibold px-7 py-3.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
            style={{ color: client.primaryColor }}
          >
            Book a 30-min call
          </a>
          <a
            href={client.slug !== "sample" ? `/report/demo/${client.slug}` : "/report/sample-college"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold px-7 py-3.5 rounded-lg text-sm text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)" }}
          >
            See a sample guide
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function PitchFooter() {
  return (
    <footer className="border-t border-border px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
      <p>© {new Date().getFullYear()} Settlyou. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <a href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8"
        target="_blank"
        rel="noopener noreferrer" className="hover:text-foreground transition-colors">hello@settlyou.com</a>
        <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
        <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
      </div>
    </footer>
  );
}
