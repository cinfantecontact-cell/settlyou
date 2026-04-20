import ScrollReveal from "../_components/ScrollReveal";

const COLLEGE_PLANS = [
  {
    name: "Essentials",
    price: "$2,399",
    description: "Everything your athletic department needs to onboard international athletes across all sports.",
    highlight: false,
    demo: "/report/sample-college-essentials",
    features: [
      "40 guides per year — all sports",
      "College athlete flow",
      "F-1 visa & campus life guidance",
      "12-section personalized guide",
      "Custom join link with PIN protection",
      "8 language options",
      "Web guide + downloadable PDF",
      "1 admin login",
      "Standard generation speed",
      "Email support",
    ],
  },
  {
    name: "Premium",
    price: "$3,599",
    description: "Everything in Essentials, plus branding, tracking, and deeper personalization.",
    highlight: true,
    demo: "/report/sample-college",
    features: [
      "100 guides per year — all sports",
      "15-section personalized guide",
      "University logo & colors on every guide",
      "Athlete tracking — see who opened their guide",
      "Custom coach notes inside guides",
      "5 staff login accounts",
      "Priority generation",
      "Analytics dashboard",
      "Onboarding call + priority support",
    ],
  },
];

const STATS = [
  {
    number: "~$60",
    label: "per guide with Settlyou Essentials",
    comparison: "vs. $1,500–$3,000 per athlete at relocation firms",
    accent: "brand",
  },
  {
    number: "10–15 hrs",
    label: "of staff time saved per athlete",
    comparison: "$300–$750 in labor costs eliminated",
    accent: "brand",
  },
  {
    number: "3–6 mo",
    label: "faster path to peak performance",
    comparison: "Athletes with proper relocation support adapt significantly faster (Journal of Sports Sciences)",
    accent: "brand",
  },
];

const COMPARISON_ROWS = [
  { label: "Cost per athlete",       firm: "$1,500–$3,000",  staff: "$300–$750",    settl: "~$60" },
  { label: "Time to deliver",        firm: "2–4 weeks",      staff: "10–15 hrs",    settl: "~3 min" },
  { label: "Athlete-specific guide", firm: "Sometimes",      staff: "Rarely",       settl: "Always" },
  { label: "Multi-language",         firm: "Extra cost",     staff: "Not included", settl: "Included" },
  { label: "Available instantly",    firm: "No",             staff: "No",           settl: "Yes" },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">{plan.name}</p>
            <p className="text-3xl font-bold text-foreground mb-1">{plan.price}<span className="text-base font-normal text-muted"> / year</span></p>
            <p className="text-sm text-muted leading-relaxed mt-2">{plan.description}</p>
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
              href="mailto:hello@settlyou.com"
              className={`mt-8 block text-center px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${
                plan.highlight
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "bg-white text-foreground border border-border hover:border-brand-400 hover:text-brand-600"
              }`}
            >
              Get in touch →
            </a>
            <a
              href={plan.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center text-sm text-muted hover:text-brand-600 transition-colors"
            >
              See sample guide →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <a href="/"><img src="/settlyou-logo.png" alt="Settl" className="h-9" /></a>
        <div className="flex items-center gap-3">
          <a href="/pricing" className="text-sm font-medium text-foreground px-4 py-2 rounded-lg border border-brand-400 text-brand-600">Pricing</a>
          <a href="/login" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Sign in</a>
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

      {/* Plans */}
      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <PlanGrid plans={COLLEGE_PLANS} />

        {/* Value prop */}
        <div className="mt-14 bg-surface border border-border rounded-2xl px-8 py-8 text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-foreground mb-2">Built for international student-athletes</p>
          <p className="text-sm text-muted leading-relaxed">
            Every guide includes F-1 visa steps, campus life orientation, student health insurance, safety tips, and local recommendations — everything your incoming athletes need to hit the ground running.
          </p>
        </div>
      </section>

      {/* ROI / Stats section */}
      <section className="bg-surface border-t border-b border-border py-24 px-6">
        <div className="max-w-5xl mx-auto">

          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">The math</span>
              <h2 className="text-3xl font-bold text-foreground">Why $60/guide is a no-brainer</h2>
              <p className="text-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                Relocation is expensive and slow — whether you outsource it or do it in-house. Settlyou delivers more, faster, at a fraction of the cost.
              </p>
            </div>
          </ScrollReveal>

          {/* 3 stat cards */}
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

          {/* Comparison table */}
          <ScrollReveal delay={100}>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted bg-surface w-1/4">Per athlete</th>
                    <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted bg-surface">Relocation firm</th>
                    <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted bg-surface">In-house staff</th>
                    <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 border-l border-brand-100">
                      Settlyou
                    </th>
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
                q: "What exactly does Settlyou produce?",
                a: "A fully personalized relocation guide covering neighborhoods, housing, schools, dining, fitness, healthcare, emergency contacts, and more. Essentials includes 12 sections. Premium extends to 15 — adding local life tips, day trips, and a guest accommodation guide for visiting family. Delivered as a private web link and downloadable PDF.",
              },
              {
                q: "How long does it take to generate a guide?",
                a: "2–4 minutes from the moment you submit the athlete's profile.",
              },
              {
                q: "Can athletes fill in their own profile?",
                a: "Yes. Each plan includes a unique join link with PIN protection. Your department shares the link and PIN with the athlete, and they fill in their own details directly in under 5 minutes.",
              },
              {
                q: "How many guides can we generate?",
                a: "Essentials includes 40 guides per year. Premium includes 100. Both cover all sports — no per-sport or per-athlete restrictions. One flat annual fee, no surprises. If you reach your limit, contact us and we'll work something out.",
              },
              {
                q: "What languages are supported?",
                a: "Guides can be generated in English, Spanish, Portuguese, French, German, Italian, Dutch, and Arabic.",
              },
              {
                q: "What's included in Premium that isn't in Essentials?",
                a: "Premium adds 3 extra guide sections (local life tips, day trips & weekend getaways, and guest accommodation for visiting family), university logo & colors on every guide, athlete tracking (see who opened their guide and when), and custom coach notes — so coaches can add personal messages or team-specific resources directly inside the guide.",
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
            <a href="/report/sample-college-essentials" target="_blank" rel="noopener noreferrer"
              className="bg-brand-700 text-white border border-brand-400 px-7 py-4 rounded-lg text-base font-bold hover:bg-brand-800 transition-colors">
              Essentials sample →
            </a>
            <a href="/report/sample-college" target="_blank" rel="noopener noreferrer"
              className="bg-white text-brand-600 px-7 py-4 rounded-lg text-base font-bold hover:bg-brand-50 transition-colors">
              Premium sample →
            </a>
            <a href="/contact"
              className="bg-brand-700 text-white border border-brand-400 px-7 py-4 rounded-lg text-base font-bold hover:bg-brand-800 transition-colors">
              Request access →
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
