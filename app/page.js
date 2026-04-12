const INCLUDED_SECTIONS = [
  "Performance & Recovery",
  "Sports Medicine & Healthcare",
  "Training & Fitness Facilities",
  "Sports Nutrition & Dining",
  "Recommended Neighborhoods",
  "Housing Options",
  "Schools & Education",
  "Transportation & Cars",
  "Family Life & Weekends",
  "For Visiting Family & Guests",
  "Integration & Community",
  "Day Trips & Weekend Getaways",
  "Local Life & Daily Tips",
  "Practical Information",
  "Emergency Contacts",
];

const STEPS = [
  {
    number: "01",
    title: "Submit the athlete's profile",
    desc: "Fill in their details — sport, family, diet, housing budget, school needs, and more. The athlete can do it themselves in under 5 minutes.",
  },
  {
    number: "02",
    title: "AI builds a performance-first guide",
    desc: "Settl generates a complete relocation guide filtered through an athletic lens — recovery centers, sports medicine, performance nutrition, training facilities, and more.",
  },
  {
    number: "03",
    title: "Athlete arrives ready to perform",
    desc: "A private link and printable PDF covering everything from finding a sports medicine clinic to the best neighborhood near the training ground. Ready on day one.",
  },
];

const FOR_WHO = [
  {
    emoji: "⚽",
    label: "Professional clubs",
    desc: "Signing a new player? Give them a guide built for elite performance — recovery centers, sports nutrition, sports medicine, housing near the training ground, and everything in between.",
    sample: "/report/sample",
    sampleLabel: "See pro athlete sample →",
  },
  {
    emoji: "🎓",
    label: "University athletic departments",
    desc: "Recruiting a student-athlete? Help them hit the ground running — campus athletics, sports medicine, performance nutrition, visa requirements, and settling into a new city with confidence.",
    sample: "/report/sample-college",
    sampleLabel: "See college athlete sample →",
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <img src="/settlyou-logo.png" alt="Settl" className="h-9 rounded-md" />
        <div className="flex items-center gap-6">
          <a href="/pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
          <a href="/login" className="text-sm text-muted hover:text-foreground transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-28 max-w-4xl mx-auto w-full">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-5">
          Performance Relocation for Athletes
        </span>
        <h1 className="text-6xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
          Relocate to perform,<br />
          <span className="text-brand-600">not just to settle.</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mb-10 leading-relaxed">
          Settl gives clubs and universities a relocation guide built for elite athletes — covering recovery, sports medicine, performance nutrition, and every detail of life in their new city.
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a
            href="/report/sample"
            className="bg-brand-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-brand-700 transition-colors"
          >
            Pro athlete sample →
          </a>
          <a
            href="/report/sample-college"
            className="bg-white text-brand-600 border border-brand-200 px-8 py-4 rounded-lg text-base font-semibold hover:bg-brand-50 transition-colors"
          >
            College athlete sample →
          </a>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-border py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Who it's for</span>
            <h2 className="text-3xl font-bold text-foreground">Built for every level of the game</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FOR_WHO.map((item) => (
              <div key={item.label} className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-4">
                <span className="text-3xl">{item.emoji}</span>
                <h3 className="text-lg font-bold text-foreground">{item.label}</h3>
                <p className="text-sm text-muted leading-relaxed flex-1">{item.desc}</p>
                <a href={item.sample} className="text-sm font-semibold text-brand-600 hover:underline">
                  {item.sampleLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface border-t border-b border-border py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">How it works</span>
            <h2 className="text-3xl font-bold text-foreground">From profile to guide in minutes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {STEPS.map((s) => (
              <div key={s.number} className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {s.number}
                </div>
                <h3 className="font-bold text-foreground text-lg">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">What's included</span>
            <h2 className="text-3xl font-bold text-foreground">Built for performance, not just relocation</h2>
            <p className="text-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Every guide covers 15 sections — starting with recovery, sports medicine, and nutrition, then everything else an athlete needs to feel at home.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INCLUDED_SECTIONS.map((s) => (
              <div key={s} className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3">
                <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">See it for yourself</h2>
          <p className="text-brand-100 mb-10 text-lg leading-relaxed">
            Browse a real sample guide — every section, every recommendation, exactly what your athlete receives.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="/report/sample"
              className="bg-white text-brand-600 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-50 transition-colors inline-block"
            >
              Pro athlete sample →
            </a>
            <a
              href="/report/sample-college"
              className="bg-brand-700 text-white border border-brand-400 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-800 transition-colors inline-block"
            >
              College athlete sample →
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Get in touch</span>
          <h2 className="text-2xl font-bold text-foreground mb-3">Questions? Let's talk.</h2>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Whether you're a club, university, or just curious — reach out and we'll get back to you quickly.
          </p>
          <a
            href="mailto:hello@settlyou.com"
            className="inline-block bg-brand-600 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            hello@settlyou.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
        <span>© {new Date().getFullYear()} Settl. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@settlyou.com" className="hover:text-foreground transition-colors">hello@settlyou.com</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy policy</a>
        </div>
      </footer>

    </main>
  );
}
