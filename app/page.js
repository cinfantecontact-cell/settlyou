import ScrollReveal from "./_components/ScrollReveal";
import QuoteButton from "./_components/QuoteButton";


const PLATFORM_FEATURES = [
  {
    title: "Coach portals",
    desc: "Each coach manages their sport independently — notes, links, and required documents. No AD bottleneck.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "WhatsApp delivery",
    desc: "Upload link sent by WhatsApp on delivery. Athletes always have it on hand.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Sport-specific guides",
    desc: "A soccer player's guide is different from a swimmer's. Coach notes make the difference.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: "Email delivery",
    desc: "Full personalized guide delivered to the athlete's inbox the moment you approve it.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Multilingual",
    desc: "Guides written in the athlete's native language from the start — 18 languages supported.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  {
    title: "Coach file templates",
    desc: "Coaches upload fillable templates. Athletes download, fill them out, and return the completed version — all through their personal link.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
    ),
  },
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
          <a href="/pricing" className="text-sm font-medium text-foreground px-4 py-2 rounded-lg border border-border hover:border-brand-400 hover:text-brand-600 transition-colors">Plans</a>
          <a href="/login" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-blob absolute -top-40 -right-24 w-[600px] h-[600px] rounded-full bg-brand-200 opacity-30 blur-[100px]" />
          <div className="hero-blob-alt absolute -bottom-32 -left-24 w-[400px] h-[400px] rounded-full bg-brand-100 opacity-40 blur-[80px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="flex flex-col items-start">
            <span className="hero-animate hero-d1 badge-shimmer inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-6 border border-brand-200 px-4 py-2 rounded-full">
              Built for college athletics
            </span>
            <h1 className="hero-animate hero-d2 text-5xl lg:text-6xl font-black text-foreground leading-[1.08] mb-5 tracking-tight">
              Every athlete<br />arrives <span className="gradient-text">ready.</span>
            </h1>
            <p className="hero-animate hero-d3 text-lg text-muted mb-8 leading-relaxed max-w-lg">
              AI-powered relocation guides, coach portals, and document collection — one platform for your entire athletics department.
            </p>
            <div className="hero-animate hero-d4 flex items-center gap-3 flex-wrap mb-10">
              <a href="/report/sample-college"
                className="cta-primary bg-brand-600 text-white px-7 py-3.5 rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors shadow-md">
                See a sample guide
              </a>
              <QuoteButton className="bg-white text-foreground border border-border px-7 py-3.5 rounded-lg text-sm font-bold hover:border-brand-300 hover:text-brand-600 transition-colors">
                Request a quote
              </QuoteButton>
            </div>
            <div className="hero-animate hero-d5 flex items-center gap-7 flex-wrap">
              {[
                { value: "18", label: "languages" },
                { value: "< 5 min", label: "generation" },
                { value: "30+", label: "countries" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-black text-brand-600 leading-none">{s.value}</span>
                  <span className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product mockup */}
          <div className="hero-animate hero-d4 hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-4 bg-brand-400 opacity-15 blur-3xl rounded-3xl pointer-events-none" />
              <div className="relative bg-white rounded-2xl border border-border shadow-2xl overflow-hidden">
                {/* Window chrome */}
                <div className="bg-foreground px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                    </div>
                    <span className="text-white/40 text-xs ml-2 font-mono">settlyou.com/coach</span>
                  </div>
                </div>
                {/* Portal header */}
                <div className="bg-brand-600 px-5 py-4">
                  <p className="text-brand-200 text-xs font-bold uppercase tracking-widest mb-0.5">Coach Portal</p>
                  <p className="text-white font-bold text-base">Men's Soccer</p>
                </div>
                {/* Athlete rows */}
                <div className="px-5 pt-4 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wider">Athletes</p>
                    <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">4 active</span>
                  </div>
                  {[
                    { name: "Marcus Rodriguez", country: "Colombia", guide: true, docs: "3/4", dot: "bg-brand-500" },
                    { name: "Jaime López",       country: "Mexico",   guide: true, docs: "4/4", dot: "bg-brand-500" },
                    { name: "Paulo Silva",        country: "Brazil",   guide: true, docs: "1/4", dot: "bg-yellow-400" },
                    { name: "Alex Müller",        country: "Germany",  guide: false, docs: "—",  dot: "bg-gray-300" },
                  ].map((a) => (
                    <div key={a.name} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${a.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{a.name}</p>
                        <p className="text-xs text-muted">{a.country}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {a.guide
                          ? <span className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-2 py-0.5 rounded-full font-medium">Guide ✓</span>
                          : <span className="text-xs bg-gray-50 text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full font-medium">Pending</span>
                        }
                        <span className="text-xs text-muted font-mono w-6 text-right">{a.docs}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Footer */}
                <div className="px-5 py-3 bg-surface border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted">Docs pending</p>
                  <span className="text-xs font-bold text-brand-600">2 athletes</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* Platform features strip */}
      <section className="border-b border-border py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Everything included</span>
              <h2 className="text-2xl font-bold text-foreground">Built for athletic programs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORM_FEATURES.map((f) => (
                <div key={f.title} className="feature-card bg-white rounded-xl border border-border p-6 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-400 to-brand-600" />
                  <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground mb-1">{f.title}</p>
                    <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                  </div>
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

          <div className="flex flex-col gap-16">

            {/* Step 01 */}
            <ScrollReveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-7xl font-black text-brand-100 leading-none block mb-4">01</span>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Coaches set up their sport</h3>
                  <p className="text-muted leading-relaxed">Each coach adds their welcome message, sport-specific notes, helpful links, and the documents they need athletes to submit. Takes under 10 minutes, once.</p>
                </div>
                <div className="relative">
                  <div className="absolute -inset-3 bg-brand-100 opacity-40 blur-2xl rounded-3xl pointer-events-none" />
                  <div className="relative bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
                    <div className="bg-brand-600 px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-brand-200 text-xs font-bold uppercase tracking-widest">Coach Setup</p>
                        <p className="text-white font-bold text-sm">Men's Soccer</p>
                      </div>
                      <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">Step 1 of 1</span>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Welcome note</p>
                        <div className="bg-surface border border-border rounded-lg px-3 py-2.5 text-xs text-muted italic leading-relaxed">"Practice is 3–6pm daily. NCAA eligibility clearance must be done before your first session..."</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Links added</p>
                        {["NCAA Eligibility Center", "Team Handbook", "Athletic Trainer"].map(l => (
                          <div key={l} className="flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                            <span className="text-xs font-medium text-brand-700">{l}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Docs required</p>
                        <div className="flex gap-2 flex-wrap">
                          {["Passport", "NCAA Form", "Medical Clearance"].map(d => (
                            <span key={d} className="text-xs bg-surface border border-border px-2.5 py-1 rounded-full text-foreground font-medium">{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 02 */}
            <ScrollReveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="relative lg:order-1 order-2">
                  <div className="absolute -inset-3 bg-brand-100 opacity-40 blur-2xl rounded-3xl pointer-events-none" />
                  <div className="relative bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
                    <div className="bg-foreground px-5 py-3">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-0.5">Athlete Intake</p>
                      <p className="text-white font-bold text-sm">Your relocation form</p>
                    </div>
                    <div className="p-5 flex flex-col gap-3.5">
                      {[
                        { label: "Full name", value: "Marcus Rodriguez" },
                        { label: "Where are you from?", value: "Bogotá, Colombia" },
                        { label: "Your sport", value: "Men's Soccer" },
                        { label: "Housing preference", value: "On-campus dorm" },
                      ].map(f => (
                        <div key={f.label} className="flex flex-col gap-1">
                          <p className="text-xs font-semibold text-foreground">{f.label}</p>
                          <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-foreground">{f.value}</div>
                        </div>
                      ))}
                      <button className="w-full mt-1 bg-brand-600 text-white text-xs font-bold py-2.5 rounded-lg">Generate my guide</button>
                    </div>
                  </div>
                </div>
                <div className="lg:order-2 order-1">
                  <span className="text-7xl font-black text-brand-100 leading-none block mb-4">02</span>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Athlete fills out a quick form</h3>
                  <p className="text-muted leading-relaxed">A guided 5-minute form — name, origin, sport, housing needs, lifestyle. Athletes access it through a PIN-protected link shared by their coach.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 03 */}
            <ScrollReveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-7xl font-black text-brand-100 leading-none block mb-4">03</span>
                  <h3 className="text-2xl font-bold text-foreground mb-3">AI builds the guide with the coach's voice inside</h3>
                  <p className="text-muted leading-relaxed">Settlyou generates a full personalized city guide. The coach's notes, links, and document requests are woven in automatically — tailored to that athlete's sport and background.</p>
                </div>
                <div className="relative">
                  <div className="absolute -inset-3 bg-brand-100 opacity-40 blur-2xl rounded-3xl pointer-events-none" />
                  <div className="relative bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
                    <div className="bg-foreground px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-0.5">Settlyou AI</p>
                        <p className="text-white font-bold text-sm">Building Marcus's guide</p>
                      </div>
                      <span className="text-xs text-brand-400 font-bold animate-pulse">Generating...</span>
                    </div>
                    <div className="p-5 flex flex-col gap-2.5">
                      {[
                        { label: "Message from your coach", done: true },
                        { label: "Housing in Kansas City", done: true },
                        { label: "Healthcare & insurance", done: true },
                        { label: "Banking & money transfers", done: true },
                        { label: "Transportation", done: false },
                        { label: "NCAA eligibility steps", done: false },
                        { label: "Cultural tips for the US", done: false },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${s.done ? "bg-brand-500" : "bg-border"}`}>
                            {s.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className={`text-xs ${s.done ? "text-foreground font-medium" : "text-muted"}`}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 04 */}
            <ScrollReveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="relative lg:order-1 order-2">
                  <div className="absolute -inset-3 bg-brand-100 opacity-40 blur-2xl rounded-3xl pointer-events-none" />
                  <div className="relative bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
                    <div className="bg-brand-600 px-5 py-3">
                      <p className="text-brand-200 text-xs font-bold uppercase tracking-widest mb-0.5">Delivery Status</p>
                      <p className="text-white font-bold text-sm">Marcus Rodriguez</p>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-700">Guide sent via email</p>
                          <p className="text-xs text-brand-600">marcus@gmail.com · just now</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-700">Upload link sent via WhatsApp</p>
                          <p className="text-xs text-green-600">+57 310 000 0000 · just now</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-foreground">Document submissions</p>
                          <span className="text-xs text-muted">0 / 3</span>
                        </div>
                        {["Passport", "NCAA Form", "Medical Clearance"].map(d => (
                          <div key={d} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                            <div className="w-3 h-3 rounded-full border-2 border-border shrink-0" />
                            <span className="text-xs text-muted">{d}</span>
                            <span className="ml-auto text-xs text-muted">Pending</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:order-2 order-1">
                  <span className="text-7xl font-black text-brand-100 leading-none block mb-4">04</span>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Guide delivered. Documents collected.</h3>
                  <p className="text-muted leading-relaxed">The guide lands in the athlete's email. Their personal upload link arrives by WhatsApp. Coaches track document submissions in real time from their portal.</p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Two portals */}
      <section className="py-24 px-6 border-b border-border bg-surface">
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

            {/* AD portal */}
            <ScrollReveal delay={60}>
              <div className="relative">
                <div className="absolute -inset-2 bg-gray-900 opacity-5 blur-2xl rounded-3xl pointer-events-none" />
                <div className="relative border border-border rounded-2xl overflow-hidden bg-white shadow-lg h-full flex flex-col">
                  <div className="bg-foreground px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Athletics Director</p>
                    <p className="text-white font-bold text-lg">Full institution overview</p>
                  </div>
                  {/* Mini AD dashboard */}
                  <div className="px-6 pt-5 pb-2 border-b border-border">
                    <div className="grid grid-cols-3 gap-3 mb-1">
                      {[{ v: "8", l: "Sports" }, { v: "47", l: "Athletes" }, { v: "12", l: "Docs pending" }].map(s => (
                        <div key={s.l} className="bg-surface rounded-xl border border-border px-3 py-2.5 text-center">
                          <p className="text-lg font-black text-foreground">{s.v}</p>
                          <p className="text-xs text-muted">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 flex flex-col gap-2 border-b border-border">
                    {[
                      { sport: "Men's Soccer", coach: "Coach Rivera", athletes: 12, color: "bg-brand-500" },
                      { sport: "Swimming", coach: "Coach Park", athletes: 8, color: "bg-blue-400" },
                      { sport: "Track & Field", coach: "Coach James", athletes: 15, color: "bg-yellow-400" },
                    ].map(r => (
                      <div key={r.sport} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${r.color}`} />
                        <span className="text-xs font-semibold text-foreground flex-1">{r.sport}</span>
                        <span className="text-xs text-muted">{r.coach}</span>
                        <span className="text-xs font-bold text-foreground ml-2">{r.athletes}</span>
                      </div>
                    ))}
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
              </div>
            </ScrollReveal>

            {/* Coach portal */}
            <ScrollReveal delay={120}>
              <div className="relative">
                <div className="absolute -inset-2 bg-brand-500 opacity-10 blur-2xl rounded-3xl pointer-events-none" />
                <div className="relative border border-brand-200 rounded-2xl overflow-hidden bg-white shadow-lg h-full flex flex-col">
                  <div className="bg-brand-600 px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-100 mb-1">Coach</p>
                    <p className="text-white font-bold text-lg">Own your sport, end to end</p>
                  </div>
                  {/* Mini coach view */}
                  <div className="px-6 pt-5 pb-2 border-b border-border">
                    <div className="grid grid-cols-3 gap-3">
                      {[{ v: "12", l: "Athletes" }, { v: "11", l: "Guides sent" }, { v: "3/4", l: "Docs avg" }].map(s => (
                        <div key={s.l} className="bg-brand-50 rounded-xl border border-brand-100 px-3 py-2.5 text-center">
                          <p className="text-lg font-black text-brand-700">{s.v}</p>
                          <p className="text-xs text-brand-500">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 flex flex-col gap-2 border-b border-border">
                    {[
                      { name: "Marcus R.", country: "Colombia", docs: "3/3", status: "bg-brand-500" },
                      { name: "Jaime L.",  country: "Mexico",   docs: "2/3", status: "bg-yellow-400" },
                      { name: "Paulo S.",  country: "Brazil",   docs: "1/3", status: "bg-yellow-400" },
                    ].map(a => (
                      <div key={a.name} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${a.status}`} />
                        <span className="text-xs font-semibold text-foreground flex-1">{a.name}</span>
                        <span className="text-xs text-muted">{a.country}</span>
                        <span className="text-xs font-bold text-foreground ml-2">{a.docs}</span>
                      </div>
                    ))}
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
              <div className="h-full bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-colors">
                <div className="p-7 pb-4">
                  <span className="text-xs font-bold text-brand-200 uppercase tracking-widest">Personal link</span>
                  <p className="text-lg font-bold text-white mt-2 mb-1">One link per athlete</p>
                  <p className="text-sm text-brand-100 leading-relaxed">Each athlete gets a unique upload link via WhatsApp — no login, no app. They return anytime, progress auto-saves.</p>
                </div>
                <div className="mx-5 mb-5 bg-white/10 border border-white/20 rounded-xl overflow-hidden">
                  <div className="bg-white/10 px-4 py-2.5 flex items-center gap-2 border-b border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-white/60 font-mono">settlyou.com/upload/marcus-r</span>
                  </div>
                  {/* From your coach */}
                  <div className="px-4 pt-3 pb-2 border-b border-white/10">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">From your coach</p>
                    {[
                      { label: "Medical Clearance Template", file: "Medical_Clearance_Soccer.pdf" },
                      { label: "NCAA Eligibility Checklist", file: "NCAA_Checklist.pdf" },
                    ].map(a => (
                      <div key={a.label} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg className="w-3 h-3 text-white/40 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                          <span className="text-[10px] text-white/70 truncate">{a.label}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-brand-200 shrink-0 ml-2">Download</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Your documents — Men's Soccer</p>
                    {[
                      { doc: "Passport", done: true },
                      { doc: "NCAA Eligibility Form", done: true },
                      { doc: "Medical Clearance", done: false },
                    ].map(d => (
                      <div key={d.doc} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${d.done ? "bg-green-400" : "border-2 border-white/30"}`}>
                          {d.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-xs ${d.done ? "text-white/80 line-through" : "text-white font-medium"}`}>{d.doc}</span>
                        {!d.done && <span className="ml-auto text-xs bg-white/15 text-white/70 px-2 py-0.5 rounded-full">Upload</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={60} className="sm:col-span-3">
              <div className="h-full bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-colors">
                <div className="p-7 pb-4">
                  <span className="text-xs font-bold text-brand-200 uppercase tracking-widest">Coach dashboard</span>
                  <p className="text-lg font-bold text-white mt-2 mb-1">Real-time submission tracking</p>
                  <p className="text-sm text-brand-100 leading-relaxed">See exactly who submitted what. Download files 1-click. No AD, no IT, no email chains.</p>
                </div>
                <div className="mx-5 mb-5 bg-white/10 border border-white/20 rounded-xl overflow-hidden">
                  <div className="bg-white/10 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Men's Soccer — Documents</span>
                    <span className="text-xs text-brand-200">8/12 complete</span>
                  </div>
                  <div className="divide-y divide-white/10">
                    {[
                      { name: "Marcus R.", passport: true,  ncaa: true,  medical: false },
                      { name: "Jaime L.",  passport: true,  ncaa: true,  medical: true  },
                      { name: "Paulo S.",  passport: true,  ncaa: false, medical: false },
                    ].map(a => (
                      <div key={a.name} className="px-4 py-2.5 flex items-center gap-3">
                        <span className="text-xs font-semibold text-white w-16 shrink-0">{a.name}</span>
                        {[a.passport, a.ncaa, a.medical].map((v, i) => (
                          <div key={i} className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${v ? "bg-green-400" : "bg-white/15"}`}>
                            {v ? <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                               : <svg className="w-2.5 h-2.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                          </div>
                        ))}
                        <span className="ml-auto text-xs text-white/40 cursor-pointer hover:text-white transition-colors">↓</span>
                      </div>
                    ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

              {/* Left — coach input UI */}
              <div className="relative">
                <div className="absolute -inset-2 bg-brand-100 opacity-50 blur-2xl rounded-3xl pointer-events-none" />
                <div className="relative bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
                  <div className="bg-foreground px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Coach Setup</p>
                      <p className="text-white font-bold text-sm">Men's Soccer · Notes & Links</p>
                    </div>
                    <span className="text-xs bg-brand-600 text-white px-2.5 py-1 rounded-full font-bold">Saved</span>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider">Your welcome note</p>
                      <div className="bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground leading-relaxed italic">
                        "Practice is 3–6pm daily — schedule morning classes only. NCAA clearance must be done before your first session. Film Sundays at 10am."
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider">Links you added</p>
                      {["NCAA Eligibility Center", "Team Handbook", "Athletic Trainer"].map(l => (
                        <div key={l} className="flex items-center gap-2.5 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                          <span className="text-xs font-semibold text-brand-700">{l}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-brand-600 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">Used in every guide</p>
                        <p className="text-xs text-brand-200">12 athletes · Men's Soccer</p>
                      </div>
                      <div className="flex -space-x-1.5">
                        {["M","J","P","A"].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full bg-brand-400 border-2 border-brand-600 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-white">{i}</span>
                          </div>
                        ))}
                        <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-brand-600 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">+8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — guide output */}
              <div className="relative">
                <div className="absolute -inset-2 bg-gray-100 opacity-60 blur-2xl rounded-3xl pointer-events-none" />
                <div className="relative bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
                  <div className="bg-surface border-b border-border px-5 py-3.5 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Marcus's Relocation Guide</p>
                      <p className="text-xs text-muted">Kansas City · Men's Soccer</p>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="border border-brand-100 bg-brand-50 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1.5">Message from your coach</p>
                      <p className="text-sm text-foreground leading-relaxed">"Welcome to the team, Marcus. Practice runs 3–6pm — your mornings are yours for class. Make sure you complete your <span className="font-semibold text-brand-600">NCAA clearance</span> before arriving..."</p>
                    </div>
                    {[
                      { section: "Paperwork", highlight: "NCAA Eligibility steps included", color: "bg-blue-50 border-blue-100 text-blue-700" },
                      { section: "Healthcare", highlight: "Athletic trainer contacts added", color: "bg-purple-50 border-purple-100 text-purple-700" },
                      { section: "Housing", highlight: "Practice schedule referenced", color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
                    ].map(s => (
                      <div key={s.section} className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted font-medium shrink-0">{s.section}</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    ))}
                    {[
                      { section: "Paperwork", highlight: "NCAA Eligibility steps included", color: "bg-blue-50 border-blue-100 text-blue-700" },
                      { section: "Healthcare", highlight: "Athletic trainer contacts added", color: "bg-purple-50 border-purple-100 text-purple-700" },
                      { section: "Housing", highlight: "Practice schedule referenced", color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
                    ].map(s => (
                      <div key={s.highlight} className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${s.color}`}>
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-xs font-semibold">{s.highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-28 px-6 bg-brand-600">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="hero-blob absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-400 opacity-30 blur-[100px] pointer-events-none" />
        <div className="hero-blob-alt absolute -bottom-24 -left-24 w-[350px] h-[350px] rounded-full bg-brand-800 opacity-40 blur-[80px] pointer-events-none" />
        <ScrollReveal>
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100 mb-4 block">Ready to get started?</span>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">See it for yourself</h2>
            <p className="text-brand-100 mb-10 text-lg leading-relaxed">
              Browse a real sample guide — every section, every recommendation, exactly what your athletes receive.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a href="/report/sample-college"
                className="bg-white text-brand-700 px-8 py-4 rounded-lg text-base font-bold hover:bg-brand-50 transition-colors shadow-lg">
                See a sample guide
              </a>
              <a href="/upload/demo"
                className="bg-white/15 text-white border border-white/30 px-8 py-4 rounded-lg text-base font-bold hover:bg-white/25 transition-colors">
                Try the upload experience
              </a>
              <QuoteButton className="bg-white/15 text-white border border-white/30 px-8 py-4 rounded-lg text-base font-bold hover:bg-white/25 transition-colors">
                Request a quote
              </QuoteButton>
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
          <a href="/compliance" className="hover:text-foreground transition-colors">Compliance</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy policy</a>
          <a href="/terms" className="hover:text-foreground transition-colors">Terms of service</a>
        </div>
      </footer>

    </main>
  );
}
