import ScrollReveal from "./_components/ScrollReveal";


const PLATFORM_FEATURES = [
  { title: "Coach portals", desc: "Each coach manages their sport independently — notes, links, and required documents. No AD bottleneck." },
  { title: "Document collection", desc: "Athletes upload documents through a personal link. Coaches see real-time submission status." },
  { title: "WhatsApp delivery", desc: "Upload link sent by WhatsApp on delivery. Athletes always have it on hand." },
  { title: "Sport-specific guides", desc: "A soccer player's guide is different from a swimmer's. Coach notes make the difference." },
  { title: "Email delivery", desc: "Full personalized guide delivered to the athlete's inbox the moment you approve it." },
  { title: "Multilingual", desc: "Guides written in the athlete's native language from the start — 18 languages supported." },
];

const STEPS = [
  {
    number: "01",
    title: "Coaches set up their sport",
    desc: "Each coach adds their welcome message, sport-specific notes, helpful links, and the documents they need athletes to submit. Takes under 10 minutes, once.",
  },
  {
    number: "02",
    title: "Athlete fills out a quick form",
    desc: "A guided 5-minute form — name, origin, sport, housing needs, lifestyle. Athletes access it through a PIN-protected link shared by their coach.",
  },
  {
    number: "03",
    title: "AI builds the guide with the coach's voice inside",
    desc: "Settlyou generates a full personalized city guide. The coach's notes, links, and document requests are woven in automatically — tailored to that athlete's sport and background.",
  },
  {
    number: "04",
    title: "Guide delivered. Documents collected.",
    desc: "The guide lands in the athlete's email. Their personal upload link arrives by WhatsApp. Coaches track document submissions in real time from their portal.",
  },
];

const AD_FEATURES = [
  "Manage all coaches and sports in one place",
  "Invite coaches with sport-specific access",
  "Track athlete document submissions across all sports",
  "Review and approve guides before delivery",
  "Usage analytics and guide history",
  "Custom branding — logo and colors in every guide",
];

const COACH_FEATURES = [
  "Write welcome notes that appear in every athlete's guide",
  "Add sport-specific links — eligibility forms, team handbook, campus health",
  "Set the documents you need athletes to upload",
  "See which athletes have submitted each document",
  "Download uploaded documents individually",
  "Notes woven into the guide by AI — not just appended",
];

function CheckIcon({ color = "brand" }) {
  const cls = color === "brand"
    ? "w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0"
    : "w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0";
  return (
    <div className={cls}>
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 border-b border-border bg-white/90 backdrop-blur-sm">
        <a href="/"><img src="/settlyou-logo-dark.png" alt="Settl" className="h-8" /></a>
        <div className="flex items-center gap-3">
          <a href="https://www.linkedin.com/company/settlyou" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brand-600 transition-colors" aria-label="Settlyou on LinkedIn">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="/pricing" className="text-sm font-medium text-foreground px-4 py-2 rounded-lg border border-border hover:border-brand-400 hover:text-brand-600 transition-colors">Pricing</a>
          <a href="/login" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-blob absolute -top-40 -right-24 w-[580px] h-[580px] rounded-full bg-brand-200 opacity-25 blur-[100px]" />
          <div className="hero-blob-alt absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-brand-100 opacity-35 blur-[80px]" />
        </div>
        <div className="relative flex flex-col items-center text-center px-6 py-32 max-w-4xl mx-auto w-full">
          <span className="hero-animate hero-d1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-5 bg-brand-50 border border-brand-100 px-4 py-2 rounded-full">
            The complete relocation platform for college athletics
          </span>
          <h1 className="hero-animate hero-d2 text-6xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
            Every athlete arrives<br />
            <span className="text-brand-600">ready.</span>
          </h1>
          <p className="hero-animate hero-d3 text-xl text-muted max-w-2xl mb-10 leading-relaxed">
            Settlyou gives every coach a portal to set up their sport, every athlete a personalized guide and document upload link, and every AD a dashboard to oversee it all.
          </p>
          <div className="hero-animate hero-d4 flex items-center gap-4 flex-wrap justify-center">
            <a href="/report/sample-college"
              className="bg-brand-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-brand-700 transition-colors shadow-sm hover:shadow-md">
              See a sample guide →
            </a>
            <a href="/contact"
              className="bg-white text-brand-600 border border-brand-200 px-8 py-4 rounded-lg text-base font-semibold hover:bg-brand-50 hover:border-brand-300 transition-colors">
              Request a demo →
            </a>
          </div>
        </div>
      </section>

      {/* Platform features strip */}
      <section className="border-b border-border py-14 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {PLATFORM_FEATURES.map((f) => (
                <div key={f.title} className="flex flex-col gap-2">
                  <p className="text-xs font-bold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-b border-border overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">How it works</span>
              <h2 className="text-4xl font-bold text-foreground">Set up once.<br className="hidden sm:block" /> Works for every athlete.</h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-0">
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.number} delay={i * 100}>
                <div className={`flex flex-col sm:flex-row items-start gap-8 py-10 ${i < STEPS.length - 1 ? "border-b border-border" : ""}`}>
                  <div className="shrink-0 flex flex-col items-center sm:items-start gap-3 sm:w-24">
                    <span className="text-5xl font-black text-brand-600 leading-none">{s.number}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted leading-relaxed max-w-lg">{s.desc}</p>
                  </div>
                  <div className="hidden sm:flex shrink-0 items-center justify-center w-28 h-28 rounded-2xl border border-border bg-surface self-center">
                    {i === 0 && (
                      <div className="flex flex-col gap-1.5 px-3 w-full">
                        {["Notes", "Links", "Docs"].map(l => (
                          <div key={l} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />
                            <div className="flex-1 h-1.5 bg-brand-100 rounded-full" />
                            <span className="text-[9px] text-muted font-medium">{l}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {i === 1 && (
                      <div className="flex flex-col gap-1.5 px-3 w-full">
                        {["Name", "Sport", "Origin"].map(l => (
                          <div key={l} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-300 shrink-0" />
                            <div className="flex-1 h-1.5 bg-brand-100 rounded-full" />
                            <span className="text-[9px] text-muted font-medium">{l}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {i === 2 && (
                      <div className="flex flex-col gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        </div>
                        <div className="flex flex-col gap-1 w-16">
                          <div className="h-1.5 bg-brand-200 rounded-full w-full" />
                          <div className="h-1.5 bg-brand-100 rounded-full w-4/5" />
                          <div className="h-1.5 bg-brand-100 rounded-full w-3/5" />
                        </div>
                      </div>
                    )}
                    {i === 3 && (
                      <div className="flex flex-col gap-1.5 items-center">
                        <div className="w-8 h-10 rounded-md bg-brand-600 flex items-center justify-center shadow-sm">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <span className="text-[9px] text-brand-600 font-bold uppercase tracking-wide">Delivered</span>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Two portals */}
      <section className="py-24 px-6 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Built for your whole staff</span>
              <h2 className="text-3xl font-bold text-foreground">One platform. Two portals.</h2>
              <p className="text-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                The AD oversees the institution. Each coach runs their own sport. No one gets in each other's way.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal delay={60}>
              <div className="border border-border rounded-2xl overflow-hidden h-full">
                <div className="bg-foreground px-6 py-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Athletics Director</p>
                  <p className="text-white font-bold text-lg">Full institution overview</p>
                </div>
                <div className="p-6 flex flex-col gap-2.5">
                  {AD_FEATURES.map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="border border-border rounded-2xl overflow-hidden h-full">
                <div className="bg-brand-600 px-6 py-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-100 mb-1">Coach</p>
                  <p className="text-white font-bold text-lg">Own your sport, end to end</p>
                </div>
                <div className="p-6 flex flex-col gap-2.5">
                  {COACH_FEATURES.map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Document collection */}
      <section className="bg-brand-600 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100 mb-3 block">Document collection</span>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight max-w-xl">
                No email chains.<br />No Google Drive folders.
              </h2>
              <p className="text-brand-100 max-w-lg text-sm leading-relaxed">
                Every athlete gets a personal upload link. Coaches see exactly what has been submitted, what is still missing, and can download files directly from their portal.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <ScrollReveal delay={0} className="sm:col-span-3">
              <div className="h-full bg-white/15 border border-white/25 rounded-2xl p-7 flex flex-col gap-4 hover:bg-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[2.5rem] font-black text-white/20 leading-none">01</span>
                  <span className="text-xs font-bold text-brand-200 uppercase tracking-widest">Personal link</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-white mb-2">One link per athlete</p>
                  <p className="text-sm text-brand-100 leading-relaxed">Each athlete receives a unique, private upload link — delivered by WhatsApp and included in their guide. They can return to it anytime. Progress is saved automatically.</p>
                </div>
                <div className="flex gap-2 flex-wrap mt-auto pt-2">
                  {["WhatsApp", "Email", "Anytime access", "Auto-saved"].map(t => (
                    <span key={t} className="text-xs bg-white/10 border border-white/20 text-white/80 px-2.5 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={60} className="sm:col-span-3">
              <div className="h-full bg-white/10 border border-white/20 rounded-2xl p-7 flex flex-col gap-4 hover:bg-white/15 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[2.5rem] font-black text-white/20 leading-none">02</span>
                  <span className="text-xs font-bold text-brand-200 uppercase tracking-widest">Coach dashboard</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-white mb-2">Real-time submission tracking</p>
                  <p className="text-sm text-brand-100 leading-relaxed">Coaches see which athletes have submitted each document, which are still pending, and can download files one by one — without involving the AD or IT.</p>
                </div>
                <div className="flex gap-3 mt-auto pt-2">
                  <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-brand-200 font-medium">Submitted</p>
                    <p className="text-sm font-bold text-white">Live</p>
                  </div>
                  <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-brand-200 font-medium">Missing</p>
                    <p className="text-sm font-bold text-white">Flagged</p>
                  </div>
                  <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-brand-200 font-medium">Download</p>
                    <p className="text-sm font-bold text-white">1-click</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120} className="sm:col-span-2">
              <div className="h-full bg-white/8 border border-white/15 rounded-2xl p-6 flex flex-col gap-3 hover:bg-white/12 transition-colors">
                <span className="text-[2rem] font-black text-white/20 leading-none">03</span>
                <p className="font-bold text-white">Coach-defined requirements</p>
                <p className="text-sm text-brand-100 leading-relaxed">Each coach sets the documents they need from their athletes. Passport, eligibility form, medical clearance — sport-specific, not generic.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={160} className="sm:col-span-2">
              <div className="h-full bg-white/8 border border-white/15 rounded-2xl p-6 flex flex-col gap-3 hover:bg-white/12 transition-colors">
                <span className="text-[2rem] font-black text-white/20 leading-none">04</span>
                <p className="font-bold text-white">Private by design</p>
                <p className="text-sm text-brand-100 leading-relaxed">Athlete files are stored securely. The document list is not shown in the guide — only accessible through the athlete's private link.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} className="sm:col-span-2">
              <div className="h-full bg-white/15 border border-white/25 rounded-2xl p-6 flex flex-col gap-3 hover:bg-white/20 transition-colors">
                <span className="text-[2rem] font-black text-white/20 leading-none">05</span>
                <p className="font-bold text-white">No account needed</p>
                <p className="text-sm text-brand-100 leading-relaxed">Athletes upload through their personal link — no login, no app download. Works on any phone, in any country, on any connection.</p>
                <p className="text-xs text-white/50 mt-auto pt-2">Mobile-first — link saved in WhatsApp</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* Coach notes feature */}
      <section className="py-24 px-6 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Coach notes</span>
              <h2 className="text-3xl font-bold text-foreground">Your voice, in every guide.</h2>
              <p className="text-muted mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                Coaches write their notes once. The AI weaves them into every athlete's guide — naturally, in context, not just appended at the end.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div className="flex flex-col gap-5">
                <p className="text-sm font-semibold text-foreground">What the coach adds once:</p>
                <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3">
                  <div className="bg-white border border-border rounded-lg px-4 py-3">
                    <p className="text-xs text-muted mb-1 uppercase tracking-wider font-medium">Coach notes</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      "Practice is every afternoon 3–6pm — schedule your morning classes only. NCAA eligibility clearance must be completed before your first official practice. Film sessions every Sunday at 10am."
                    </p>
                  </div>
                  <div className="bg-white border border-border rounded-lg px-4 py-3">
                    <p className="text-xs text-muted mb-1 uppercase tracking-wider font-medium">Coach links</p>
                    <div className="flex flex-col gap-1.5">
                      {["NCAA Eligibility Center", "Team Handbook", "Athletic Trainer Contacts"].map((l) => (
                        <div key={l} className="flex items-center gap-2 text-sm">
                          <span className="text-brand-500">→</span>
                          <span className="text-brand-600 font-medium">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <p className="text-sm font-semibold text-foreground">How it shows up in the guide:</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Message from your Men's Soccer coach", note: "Warm intro written in the athlete's native language with the coach's notes woven in." },
                    { label: "Practice schedule in the paperwork section", note: "Referenced naturally when discussing housing proximity and commute." },
                    { label: "NCAA eligibility link in the paperwork section", note: "Included with step-by-step context specific to that athlete's division." },
                    { label: "Athletic trainer contacts in the healthcare section", note: "Appears alongside local sports medicine recommendations." },
                  ].map((ex) => (
                    <div key={ex.label} className="flex items-start gap-3 bg-surface border border-border rounded-xl px-4 py-3">
                      <CheckIcon />
                      <div>
                        <p className="text-sm font-medium text-foreground">{ex.label}</p>
                        <p className="text-xs text-muted mt-0.5">{ex.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">See it for yourself</h2>
            <p className="text-muted mb-10 text-lg leading-relaxed">
              Browse a real sample guide — every section, every recommendation, exactly what your athletes receive.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a href="/report/sample-college"
                className="bg-brand-600 text-white px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-700 transition-colors shadow-sm hover:shadow-md">
                See a sample guide →
              </a>
              <a href="/contact"
                className="bg-white text-brand-600 border border-brand-200 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-50 hover:border-brand-300 transition-colors">
                Request a demo →
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
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
