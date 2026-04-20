import ScrollReveal from "./_components/ScrollReveal";

const INCLUDED_SECTIONS = [
  "Performance & Recovery",
  "Sports Medicine & Healthcare",
  "Training & Fitness Facilities",
  "Sports Nutrition & Dining",
  "Recommended Neighborhoods",
  "Housing Options",
  "Schools & Education",
  "Transportation & Cars",
  "Integration & Community",
  "Practical Information",
  "Safety & Campus Security",
  "Emergency Contacts",
];

const PREMIUM_SECTIONS = [
  "For Visiting Family & Guests",
  "Day Trips & Weekend Getaways",
  "Local Life & Daily Tips",
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
    desc: "Settlyou generates a complete relocation guide filtered through an athletic lens — recovery centers, sports medicine, performance nutrition, training facilities, and more.",
  },
  {
    number: "03",
    title: "Athlete arrives ready to perform",
    desc: "A private link and printable PDF covering everything from finding a sports medicine clinic to the best neighborhood near the training ground. Ready on day one.",
  },
];

const HERO_STATS = [
  "15 sections covered",
  "8 languages supported",
  "AI-generated in minutes",
];

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 border-b border-border bg-white/90 backdrop-blur-sm">
        <a href="/"><img src="/settlyou-logo.png" alt="Settl" className="h-9 rounded-md" /></a>
        <div className="flex items-center gap-3">
          <a href="/pricing" className="text-sm font-medium text-foreground px-4 py-2 rounded-lg border border-border hover:border-brand-400 hover:text-brand-600 transition-colors">Pricing</a>
          <a href="/login" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-blob absolute -top-40 -right-24 w-[580px] h-[580px] rounded-full bg-brand-200 opacity-25 blur-[100px]" />
          <div className="hero-blob-alt absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-brand-100 opacity-35 blur-[80px]" />
        </div>

        <div className="relative flex flex-col items-center text-center px-6 py-32 max-w-4xl mx-auto w-full">
          <span className="hero-animate hero-d1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-5 bg-brand-50 border border-brand-100 px-4 py-2 rounded-full">
            Performance Relocation for Athletes
          </span>
          <h1 className="hero-animate hero-d2 text-6xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
            Relocate to perform,<br />
            <span className="text-brand-600">not just to Settl.</span>
          </h1>
          <p className="hero-animate hero-d3 text-xl text-muted max-w-2xl mb-10 leading-relaxed">
            Settlyou gives university athletic departments a relocation guide built for student-athletes — covering campus life, sports medicine, performance nutrition, F-1 visa guidance, and every detail of life in their new city.
          </p>
          <div className="hero-animate hero-d4 flex items-center gap-4 flex-wrap justify-center">
            <a
              href="/report/sample-college"
              className="bg-brand-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-brand-700 transition-colors shadow-sm hover:shadow-md transition-shadow"
            >
              See a sample guide →
            </a>
            <a
              href="/contact"
              className="bg-white text-brand-600 border border-brand-200 px-8 py-4 rounded-lg text-base font-semibold hover:bg-brand-50 hover:border-brand-300 transition-colors"
            >
              Request access →
            </a>
          </div>
          <div className="hero-animate hero-d5 flex items-center gap-3 mt-10 flex-wrap justify-center">
            {HERO_STATS.map((stat) => (
              <span key={stat} className="text-xs text-muted bg-surface border border-border px-3 py-1.5 rounded-full">
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Who it's for</span>
              <h2 className="text-3xl font-bold text-foreground">Built for university athletic departments</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-surface border border-border rounded-2xl p-10 flex flex-col sm:flex-row items-start gap-10 hover:border-brand-200 hover:shadow-lg transition-all duration-300">
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-xl font-bold text-foreground">Help your recruits arrive ready</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Recruiting a student-athlete from abroad? Give them a personalized guide covering campus athletics, sports medicine, performance nutrition, F-1 visa steps, and everything they need to settle into a new city with confidence.
                </p>
                <a href="/report/sample-college" className="text-sm font-semibold text-brand-600 hover:underline">
                  See a college athlete sample →
                </a>
              </div>
              <div className="flex flex-col gap-3 sm:w-56 shrink-0">
                {[
                  "F-1 visa & campus life",
                  "Sports medicine & recovery",
                  "Performance nutrition",
                  "Housing near campus",
                  "Safety & integration",
                  "8 languages supported",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface border-t border-b border-border py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">How it works</span>
              <h2 className="text-3xl font-bold text-foreground">From profile to guide in minutes</h2>
            </div>
          </ScrollReveal>
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Connector line — desktop only */}
            <div
              className="hidden sm:block absolute bg-border"
              style={{ height: "1px", top: "20px", left: "calc(100% / 6 + 20px)", right: "calc(100% / 6 + 20px)" }}
            />
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.number} delay={i * 120}>
                <div className="flex flex-col gap-4">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md ring-4 ring-brand-50">
                    {s.number}
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">What's included</span>
              <h2 className="text-3xl font-bold text-foreground">Built for performance, not just relocation</h2>
              <p className="text-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                Essentials includes 12 sections. Premium adds 3 more — starting with recovery, sports medicine, and nutrition, then everything an athlete needs to feel at home.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {INCLUDED_SECTIONS.map((s) => (
                <div key={s} className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 hover:border-brand-200 hover:bg-brand-50 transition-colors duration-200 cursor-default">
                  <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">{s}</span>
                </div>
              ))}
              {PREMIUM_SECTIONS.map((s) => (
                <div key={s} className="flex items-center gap-3 bg-white border border-amber-200 rounded-xl px-4 py-3 hover:bg-amber-50 transition-colors duration-200 cursor-default">
                  <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">{s}</span>
                  <span className="ml-auto text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Premium</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-600 py-24 px-6">
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <ScrollReveal>
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">See it for yourself</h2>
            <p className="text-brand-100 mb-10 text-lg leading-relaxed">
              Browse a real sample guide — every section, every recommendation, exactly what your athlete receives.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                href="/report/sample-college"
                className="bg-white text-brand-600 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-50 transition-colors inline-block shadow-sm hover:shadow-md"
              >
                See a sample guide →
              </a>
              <a
                href="/contact"
                className="bg-brand-700 text-white border border-brand-400 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-800 transition-colors inline-block"
              >
                Request access →
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 border-t border-border">
        <ScrollReveal>
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
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
        <span>© {new Date().getFullYear()} Settlyou. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@settlyou.com" className="hover:text-foreground transition-colors">hello@settlyou.com</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy policy</a>
          <a href="/terms" className="hover:text-foreground transition-colors">Terms of service</a>
        </div>
      </footer>

    </main>
  );
}
