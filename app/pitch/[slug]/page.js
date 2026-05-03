import { notFound } from "next/navigation";
import { getClientBySlug } from "@/lib/pitch-clients";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) return {};
  return {
    title: `${client.name} × Settlyou`,
    description: `See how Settlyou gives every incoming student-athlete at ${client.name} a personalized relocation guide — from day one.`,
    robots: { index: false, follow: false },
  };
}

export default async function PitchPage({ params }) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) notFound();

  return (
    <main className="flex flex-col min-h-screen bg-white font-sans">
      <PitchNav client={client} />
      <HeroSection client={client} />
      <ProblemSection />
      <HowItWorksSection client={client} />
      <DocumentSection />
      <PortalsSection client={client} />
      <GuideInsideSection client={client} />
      <GuideNotesSection />
      <ROISection client={client} />
      <ComplianceSection />
      <PricingSection />
      <FinalCTA client={client} />
      <PitchFooter />
    </main>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function PitchNav({ client }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-3">
        {client.logoUrl ? (
          <img src={client.logoUrl} alt={client.name} className="h-8 w-8 object-contain rounded-lg bg-white p-1 border border-border" />
        ) : (
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ background: client.primaryColor }}>
            {client.shortName.slice(0, 2)}
          </div>
        )}
        <span className="text-muted text-sm">×</span>
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

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ client }) {
  const isAthletics = client.type === "athletics";
  const headline = isAthletics
    ? "Every incoming athlete arrives ready."
    : "Every incoming student arrives ready.";

  const subline = isAthletics
    ? `${client.shortName} coaches write a short note. Settlyou builds a complete, personalized relocation guide for every recruit — in under 5 minutes.`
    : `${client.shortName} sends a link. Settlyou builds a complete, personalized relocation guide for every student — in under 5 minutes.`;

  return (
    <section className="relative overflow-hidden border-b border-border" style={{ background: client.primaryColor }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10 blur-[80px] pointer-events-none bg-white" />
      <div className="absolute -bottom-24 -left-20 w-[350px] h-[350px] rounded-full opacity-10 blur-[60px] pointer-events-none bg-white" />

      <div className="relative max-w-5xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" }}>
            {client.shortName} × Settlyou
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.08] mb-5 tracking-tight">
            {headline}
          </h1>
          <p className="text-base lg:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
            {subline}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <a href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8" target="_blank" rel="noopener noreferrer"
              className="bg-white font-bold px-7 py-3.5 rounded-lg text-sm hover:opacity-90 transition-opacity shadow-lg"
              style={{ color: client.primaryColor }}>
              Book a 30-min call
            </a>
            <a href={client.slug !== "sample" ? `/report/demo/${client.slug}` : "/report/sample-college"}
              target="_blank" rel="noopener noreferrer"
              className="font-semibold px-7 py-3.5 rounded-lg text-sm text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)" }}>
              See a sample guide
            </a>
          </div>
          <div className="flex items-center gap-8 flex-wrap">
            {[
              { v: "24 hrs", l: "guide delivery" },
              { v: "18", l: "languages" },
              { v: "5 min", l: "athlete form" },
            ].map(s => (
              <div key={s.l} className="flex flex-col gap-0.5">
                <span className="text-2xl font-black text-white leading-none">{s.v}</span>
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Pipeline mockup */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Athlete Pipeline</span>
              <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">Live</span>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              {[
                { name: "Carlos Mendez",      sport: "Soccer",      status: "Delivered",     color: "bg-green-100 text-green-700" },
                { name: "Aisha Johnson",      sport: "Basketball",  status: "Approved",      color: "bg-blue-100 text-blue-700" },
                { name: "Marco Rossi",        sport: "Soccer",      status: "Quality Check", color: "bg-orange-100 text-orange-700" },
                { name: "Priya Patel",        sport: "Tennis",      status: "Generating",    color: "bg-yellow-100 text-yellow-700" },
                { name: "Lucas Fernandez",    sport: "Baseball",    status: "Submitted",     color: "bg-gray-100 text-gray-600" },
              ].map((a) => (
                <div key={a.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[10px] font-bold shrink-0">
                      {a.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-none">{a.name}</p>
                      <p className="text-[10px] text-muted mt-0.5">{a.sport}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${a.color}`}>{a.status}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-brand-50 flex items-center justify-between">
              <span className="text-[10px] text-brand-600 font-medium">3 guides ready to send</span>
              <span className="text-[10px] text-muted">Updated just now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

function ProblemSection() {
  const pains = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Same questions. Every intake.",
      body: "\"Where should I live?\" \"How do I open a bank account?\" \"What's the nearest hospital?\" Your staff answers these for every single student. Every year.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Generic guides that help no one.",
      body: "A PDF with links to Google Maps and a list of apartments. International students, domestic athletes, families with kids — everyone gets the same thing.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "Relocation firms cost a fortune.",
      body: "$1,500 to $3,000 per student. Most programs can't scale that. And you still end up answering half the questions yourself anyway.",
    },
  ];

  return (
    <section className="py-20 px-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">The problem</span>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Your staff shouldn't be a relocation agency.</h2>
          <p className="text-sm text-muted mt-4 max-w-lg mx-auto leading-relaxed">
            Between answering emails, building resource packets, and chasing down missing documents — intake season drains 10–15 hours of staff time per athlete.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pains.map((p) => (
            <div key={p.title} className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4">
              <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
                {p.icon}
              </div>
              <p className="font-semibold text-foreground text-sm leading-snug">{p.title}</p>
              <p className="text-xs text-muted leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorksSection({ client }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">How it works</span>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            From form submission to guide delivered<br className="hidden lg:block" /> — in 24 hours.
          </h2>
        </div>

        {/* Step 1 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-9 h-9 rounded-lg bg-brand-600 text-white text-sm font-black flex items-center justify-center shrink-0">1</div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Share your join link</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">Your athletes get a link. They fill a 5-minute form.</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Every institution gets a unique join link — you can protect it with a PIN. Share it in an email, your team chat, or your orientation packet. Athletes open it on their phone, fill it out in their language, and submit.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Works on any device — phone, tablet, laptop",
                "Available in 18 languages — Spanish, Portuguese, Arabic, French, and more",
                "Auto-saves every step — athletes can pause and resume",
                "Optional PIN so only your recruits can access it",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Mockup: Mobile form */}
          <div className="bg-surface rounded-2xl border border-border p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Your Athlete Intake Form</p>
                <p className="text-[10px] text-muted">Step 2 of 6 — Destination & Housing</p>
              </div>
            </div>
            <div className="w-full bg-brand-100 rounded-full h-1.5">
              <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: "33%" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-foreground">Destination city *</label>
                <div className="border border-border rounded-lg px-3 py-2 text-xs text-foreground bg-white">Boca Raton, FL</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-foreground">Move date *</label>
                <div className="border border-border rounded-lg px-3 py-2 text-xs text-foreground bg-white">Aug 15, 2025</div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-foreground">Monthly housing budget (USD) *</label>
              <div className="border border-border rounded-lg px-3 py-2 text-xs text-foreground bg-white">$1,200 / month</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-foreground">Housing type preference</label>
              <div className="flex flex-wrap gap-2">
                {["Apartment", "House", "Studio"].map((t, i) => (
                  <span key={t} className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border ${i === 0 ? "bg-brand-600 text-white border-brand-600" : "bg-white text-muted border-border"}`}>{t}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-foreground">Must-haves</label>
              <div className="flex flex-wrap gap-2">
                {["Gym", "Parking", "Pool", "Pet-friendly"].map((t, i) => (
                  <span key={t} className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border ${i < 2 ? "bg-brand-600 text-white border-brand-600" : "bg-white text-muted border-border"}`}>{t}</span>
                ))}
              </div>
            </div>
            <button className="w-full bg-brand-600 text-white text-xs font-bold py-2.5 rounded-lg mt-1 hover:bg-brand-700 transition-colors">Continue</button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Mockup: Guide generation status */}
          <div className="order-2 lg:order-1">
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs font-bold text-foreground">Guide Generation</span>
              </div>
              <div className="px-5 py-5 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">CM</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Carlos Mendez</p>
                    <p className="text-xs text-muted">Soccer · Caracas, Venezuela → Boca Raton, FL</p>
                  </div>
                </div>

                {/* Status steps */}
                <div className="flex items-center gap-0 mt-2">
                  {[
                    { label: "Submitted", done: true },
                    { label: "Generating", done: true, active: true },
                    { label: "Review", done: false },
                    { label: "Approved", done: false },
                    { label: "Delivered", done: false },
                  ].map((s, i, arr) => (
                    <div key={s.label} className="flex items-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${s.done ? "bg-brand-600 text-white" : "bg-surface border-2 border-border text-muted"} ${s.active ? "ring-2 ring-brand-200" : ""}`}>
                          {s.done ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : i + 1}
                        </div>
                        <span className={`text-[9px] font-semibold leading-none ${s.done ? "text-brand-600" : "text-muted"}`}>{s.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`h-0.5 w-8 mb-3.5 ${s.done && !s.active ? "bg-brand-600" : "bg-border"}`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mt-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                    <span className="text-xs font-bold text-brand-700">Building guide...</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Neighborhoods near FAU campus", done: true },
                      { label: "Banking & financial setup", done: true },
                      { label: "Healthcare & sports medicine", done: false },
                      { label: "Halal dining & grocery stores", done: false },
                      { label: "NCAA eligibility paperwork", done: false },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-brand-600" : "bg-brand-100"}`}>
                          {item.done && (
                            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-[10px] ${item.done ? "text-brand-700 font-medium" : "text-muted"}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-muted text-center">~3 minutes to complete · Carlos will receive an email when it's ready</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-9 h-9 rounded-lg bg-brand-600 text-white text-sm font-black flex items-center justify-center shrink-0">2</div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Settlyou generates the guide</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">AI builds a complete, personalized guide in under 3 minutes.</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Our AI reads the athlete's background, destination, sport, diet, family situation, and housing preferences — then builds a guide that's specific to them. Not a template. Not a generic packet. Their guide.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Neighborhoods matched to their budget and commute time",
                "Halal, vegan, or kosher dining if they need it",
                "Sports medicine and recovery centers near campus",
                "NCAA eligibility paperwork with exact steps and links",
                "In Spanish, Portuguese, Arabic — whatever language they chose",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-9 h-9 rounded-lg bg-brand-600 text-white text-sm font-black flex items-center justify-center shrink-0">3</div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Athlete receives the guide</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">Delivered to their inbox and WhatsApp within 24 hours.</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Each athlete gets a personal link to their guide — accessible on any device, any time. A PDF version is always available to download. Your coach gets notified the moment it's opened.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Delivered by email — with a one-click PDF download",
                "WhatsApp delivery so the link is always on their phone",
                "Coach gets an open notification the first time they view it",
                "Guide stays live — athletes can return to it anytime",
                "Branded with your institution's logo and colors",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <a href={client.slug !== "sample" ? `/report/demo/${client.slug}` : "/report/sample-college"}
                target="_blank" rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-lg border border-brand-200 bg-brand-50 text-brand-700 text-sm font-semibold hover:bg-brand-100 transition-colors">
                See a sample guide
              </a>
            </div>
          </div>
          {/* Mockup: Delivery email */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="bg-white border-b border-border px-5 py-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-muted ml-3">Your Relocation Guide is ready</span>
            </div>
            <div className="p-5">
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="bg-brand-600 px-5 py-5">
                  <img src="/settlyou-logo-white.png" alt="Settlyou" className="h-5 mb-4" />
                  <p className="text-white font-bold text-base">Your relocation guide is ready, Carlos.</p>
                  <p className="text-white/70 text-xs mt-1">Everything you need to land confidently in Boca Raton.</p>
                </div>
                <div className="px-5 py-4 flex flex-col gap-4">
                  <p className="text-xs text-muted leading-relaxed">
                    We've built a personalized guide just for you — neighborhoods near FAU, banking setup, halal food spots, sports medicine, NCAA paperwork, and more.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a className="block w-full text-center bg-brand-600 text-white text-xs font-bold py-3 rounded-lg">
                      View my guide
                    </a>
                    <a className="block w-full text-center border border-border text-xs font-semibold py-2.5 rounded-lg text-foreground">
                      Download PDF
                    </a>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-[10px] text-muted text-center">Sent by Florida Atlantic University via Settlyou</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Portals Section ─────────────────────────────────────────────────────────

function PortalsSection({ client }) {
  return (
    <section className="bg-surface border-t border-b border-border py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Your portals</span>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            A portal for every role. No overlap.
          </h2>
          <p className="text-sm text-muted mt-4 max-w-xl mx-auto leading-relaxed">
            The Athletic Director sees every sport. Each coach sees only their athletes. No one gets information they shouldn't have.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coach Portal */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Coach Portal</p>
                  <p className="text-[10px] text-muted">Soccer — Coach Rivera</p>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
              {[{ v: "12", l: "Athletes" }, { v: "9", l: "Guides Sent" }, { v: "3", l: "In Progress" }].map(s => (
                <div key={s.l} className="px-4 py-3 text-center">
                  <p className="text-lg font-black text-foreground leading-none">{s.v}</p>
                  <p className="text-[10px] text-muted mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Athletes list */}
            <div className="px-5 py-4 flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Your Athletes</p>
              {[
                { name: "Carlos Mendez",   from: "Venezuela",   status: "Delivered",  color: "bg-green-100 text-green-700" },
                { name: "Marco Rossi",     from: "Italy",       status: "Review",     color: "bg-orange-100 text-orange-700" },
                { name: "Luis Gonzalez",   from: "Colombia",    status: "Generating", color: "bg-yellow-100 text-yellow-700" },
                { name: "Ahmad Hassan",    from: "Egypt",       status: "Submitted",  color: "bg-gray-100 text-gray-600" },
              ].map(a => (
                <div key={a.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[10px] font-bold shrink-0">
                      {a.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{a.name}</p>
                      <p className="text-[10px] text-muted">From {a.from}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${a.color}`}>{a.status}</span>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5">
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-brand-700">Ahmad Hassan's guide is ready to send</p>
                  <p className="text-[10px] text-brand-600 mt-0.5">Approved · click to deliver</p>
                </div>
              </div>
            </div>
          </div>

          {/* AD Dashboard */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">AD Dashboard</p>
                  <p className="text-[10px] text-muted">{client.shortName} · All Sports</p>
                </div>
              </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
              {[
                { v: "47", l: "Total" },
                { v: "38", l: "Delivered" },
                { v: "6", l: "In Progress" },
                { v: "3", l: "Coaches" },
              ].map(s => (
                <div key={s.l} className="px-3 py-3 text-center">
                  <p className="text-lg font-black text-foreground leading-none">{s.v}</p>
                  <p className="text-[10px] text-muted mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            {/* By sport */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">By Sport</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { sport: "Soccer",     coach: "Coach Rivera",   sent: 12, total: 12, pct: 100 },
                  { sport: "Basketball", coach: "Coach Thompson",  sent: 8,  total: 10, pct: 80 },
                  { sport: "Tennis",     coach: "Coach Morales",   sent: 5,  total: 8,  pct: 62 },
                  { sport: "Baseball",   coach: "Coach Williams",  sent: 13, total: 17, pct: 76 },
                ].map(s => (
                  <div key={s.sport} className="flex items-center gap-3">
                    <div className="w-16 shrink-0">
                      <p className="text-xs font-semibold text-foreground leading-none">{s.sport}</p>
                      <p className="text-[9px] text-muted mt-0.5">{s.coach}</p>
                    </div>
                    <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-muted shrink-0 w-10 text-right">{s.sent}/{s.total}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-brand-50 border border-brand-100 rounded-lg px-3 py-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors text-left">
                  Export CSV
                </button>
                <button className="bg-brand-50 border border-brand-100 rounded-lg px-3 py-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors text-left">
                  Bulk resend
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role labels */}
        <div className="grid lg:grid-cols-2 gap-8 mt-4">
          <div className="text-center">
            <p className="text-xs text-muted font-medium">Coaches see only their sport's athletes</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted font-medium">Athletic Directors see everything — all sports, all coaches</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Guide Inside ─────────────────────────────────────────────────────────────

function GuideInsideSection({ client }) {
  const sections = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
      title: "Housing & Neighborhoods",
      items: ["3–5 neighborhoods ranked by fit score", "Average rent by bedroom count", "Commute time to campus", "Pros/cons for their lifestyle"],
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      title: "Paperwork & Compliance",
      items: ["F-1 visa & SEVIS check-in steps", "NCAA / NAIA eligibility checklist", "FAFSA & financial aid guide", "Driver's license & state ID"],
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      title: "Banking & Finance",
      items: ["Best banks for international students", "How to build a US credit score", "ITIN application if needed", "Wire transfer & remittance tips"],
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      title: "Healthcare",
      items: ["Health insurance options explained", "Sports medicine centers nearby", "Specialist clinics (their needs)", "Urgent care & emergency contacts"],
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
      title: "Food & Dining",
      items: ["Grocery stores with their diet items", "Diet-specific restaurants (halal, vegan…)", "Performance nutrition spots", "Food delivery platforms"],
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      title: "Fitness & Recovery",
      items: ["Gyms near campus", "Recovery & physio centers", "Sport-specific training facilities", "Mental performance resources"],
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      title: "Community & Culture",
      items: ["Expat and international communities", "Religious centers (if needed)", "Cultural events calendar", "Language exchange resources"],
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
      title: "First 7 Days Checklist",
      items: ["Ordered task list for arrival week", "Day-by-day priority actions", "Campus orientation quick hits", "Emergency contacts and resources"],
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">What's inside</span>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            Every section. Specific to them.
          </h2>
          <p className="text-sm text-muted mt-4 max-w-xl mx-auto leading-relaxed">
            Each guide is generated from scratch — not a template. The athlete's sport, nationality, diet, budget, and family situation all shape the content.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((s) => (
            <div key={s.title} className="bg-white border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-brand-200 hover:shadow-sm transition-all group">
              <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-100 transition-colors">
                {s.icon}
              </div>
              <p className="font-bold text-foreground text-sm leading-snug">{s.title}</p>
              <div className="flex flex-col gap-1.5 mt-auto">
                {s.items.map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <svg className="w-3 h-3 text-brand-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[11px] text-muted leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href={client.slug !== "sample" ? `/report/demo/${client.slug}` : "/report/sample-college"}
            target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-surface hover:border-brand-200 transition-colors">
            See a full sample guide for {client.shortName}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Document Upload Section ──────────────────────────────────────────────────

function DocumentSection() {
  return (
    <section className="bg-surface border-t border-b border-border py-24 px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Copy */}
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-5 block">Document collection</span>
          <h2 className="text-3xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            Athletes upload their documents. You see it in real time.
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Every athlete receives a personal upload link the moment their guide is delivered. They upload their passport, eligibility forms, transcripts, and anything your coaches require — on their own time, from anywhere.
          </p>
          <div className="flex flex-col gap-3 mb-8">
            {[
              "Coaches set which documents are required per sport",
              "Coaches upload fillable templates — athletes download, complete, and return them",
              "Athletes see a clear checklist — no confusion about what's needed",
              "Coaches get notified when each document is uploaded",
              "Download all documents from the athlete's profile page",
              "Document status shown in real time across the dashboard",
            ].map(item => (
              <div key={item} className="flex items-start gap-3">
                <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <a
            href="/upload/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            See what athletes see
          </a>
        </div>

        {/* Right — Upload portal mockup */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Document Upload</p>
                <p className="text-[10px] text-muted">Carlos Mendez · Soccer</p>
              </div>
            </div>
          </div>

          {/* From your coach */}
          <div className="px-5 py-3 border-b border-border bg-surface">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">From your coach</p>
            {[
              { label: "Medical Clearance Form", file: "Medical_Clearance_Soccer.pdf" },
              { label: "NCAA Eligibility Checklist", file: "NCAA_Checklist.pdf" },
            ].map(a => (
              <div key={a.label} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-3 h-3 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-[10px] text-foreground truncate">{a.label}</span>
                </div>
                <span className="text-[10px] font-semibold text-brand-600 shrink-0 ml-2">Download</span>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="px-5 pt-4 pb-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-foreground">Progress</span>
              <span className="text-[10px] font-bold text-brand-600">3 / 5 uploaded</span>
            </div>
            <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
              <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: "60%" }} />
            </div>
          </div>

          {/* Document list */}
          <div className="px-5 py-4 flex flex-col gap-3">
            {[
              { name: "Passport Copy",          required: true,  status: "uploaded", file: "passport_mendez.pdf" },
              { name: "NCAA Eligibility Form",  required: true,  status: "uploaded", file: "ncaa_eligibility.pdf" },
              { name: "Medical Form",           required: true,  status: "uploaded", file: "medical_form.pdf" },
              { name: "Official Transcript",    required: true,  status: "pending",  file: null },
              { name: "English Test (TOEFL)",   required: false, status: "pending",  file: null },
            ].map(doc => (
              <div key={doc.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${doc.status === "uploaded" ? "bg-brand-100" : "bg-surface border border-border"}`}>
                    {doc.status === "uploaded" ? (
                      <svg className="w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{doc.name}</p>
                    {doc.file
                      ? <p className="text-[10px] text-brand-600 mt-0.5">{doc.file}</p>
                      : <p className="text-[10px] text-muted mt-0.5">{doc.required ? "Required" : "Optional"}</p>
                    }
                  </div>
                </div>
                {doc.status === "uploaded" ? (
                  <button className="text-[10px] font-semibold text-brand-600 hover:underline">Download</button>
                ) : (
                  <button className="text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors">Upload</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Guide Notes Section ──────────────────────────────────────────────────────

function GuideNotesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — mockup */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Coach Guide Notes</p>
              <p className="text-[10px] text-muted">Soccer · Coach Rivera</p>
            </div>
          </div>

          <div className="px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Your message to athletes (woven into every guide)</p>
            <div className="bg-surface border border-border rounded-xl p-4 text-xs text-foreground leading-relaxed mb-4">
              Welcome to the FAU Soccer program! Before your first practice, make sure you've completed your pre-participation physical with our Sports Medicine team (Bldg 96). Your eligibility paperwork must be submitted by July 31st. If you have any questions, reach out to me directly at coach.rivera@fau.edu.
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Key links for your athletes</p>
            <div className="flex flex-col gap-2 mb-4">
              {[
                { label: "FAU Soccer Team Portal", url: "fausports.com/soccer" },
                { label: "Sports Medicine Scheduling", url: "fau.edu/sportsmedicine" },
                { label: "NCAA Eligibility Center", url: "ncaa.org/eligibility" },
              ].map(link => (
                <div key={link.label} className="flex items-center gap-3 bg-white border border-border rounded-lg px-3 py-2">
                  <svg className="w-3 h-3 text-brand-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-semibold text-foreground">{link.label}</p>
                    <p className="text-[9px] text-brand-600">{link.url}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-brand-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-brand-700 transition-colors">
              Save notes — updates all future guides
            </button>
          </div>
        </div>

        {/* Right — copy */}
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-5 block">Guide Notes</span>
          <h2 className="text-3xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            Your voice. In every guide.
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Coaches write a short welcome note, add compliance deadlines, and link their key resources. Settlyou weaves those words naturally into every athlete's guide — so each student feels personally welcomed, with the right information from their coach.
          </p>
          <div className="flex flex-col gap-4">
            {[
              {
                title: "Write it once. It's in every guide.",
                body: "Set your notes once and every athlete in your sport gets them — automatically. Update anytime.",
              },
              {
                title: "Per-sport, per-coach.",
                body: "Soccer gets soccer notes. Basketball gets basketball notes. Each coach customizes their sport independently.",
              },
              {
                title: "Documents, too.",
                body: "Coaches upload PDFs — handbooks, eligibility forms, training schedules — and every guide auto-includes a download link.",
              },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-surface hover:border-brand-200 transition-colors">
                <div className="w-1 h-full min-h-8 rounded-full bg-brand-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ROI Section ──────────────────────────────────────────────────────────────

function ROISection({ client }) {
  const stats = [
    {
      value: "25.5 hrs",
      label: "staff time per international athlete",
      sub: "I-20 processing, housing coordination, SEVIS check-ins, pre-arrival Q&A, cultural orientation — all manual today.",
    },
    {
      value: "70%",
      label: "reduction in staff workload",
      sub: "Settlyou handles guides, documents, and pre-arrival communication. Your staff focuses on what only they can do.",
    },
    {
      value: "~3 min",
      label: "to generate a complete guide",
      sub: "vs. weeks of back-and-forth emails, WhatsApp threads, and repeated questions from incoming athletes.",
    },
  ];

  return (
    <section className="bg-surface border-t border-b border-border py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">The math</span>
          <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            Every international athlete takes 25.5 hours to onboard manually.
          </h2>
          <p className="text-sm text-muted mt-4 max-w-xl mx-auto leading-relaxed">
            DSO, compliance, coaches, and advisors — all spending hours on tasks that can be automated.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {stats.map((s) => (
            <div key={s.value} className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-brand-500" />
              <div className="p-7 flex flex-col gap-3">
                <p className="text-4xl font-black text-brand-600 leading-none tracking-tight">{s.value}</p>
                <p className="text-base font-bold text-foreground leading-snug">{s.label}</p>
                <p className="text-xs text-muted leading-relaxed pt-3 border-t border-border">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {client.estimatedStudents && (
          <div className="bg-white border border-brand-200 rounded-2xl overflow-hidden">
            <div className="px-7 py-4 border-b border-border bg-brand-50">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
                {client.shortName} — estimated annual savings
              </p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-border">
              {[
                {
                  label: "Hours saved annually",
                  value: `${Math.round(client.estimatedStudents * 25.5 * 0.7).toLocaleString()} hrs`,
                  sub: `${client.estimatedStudents} athletes × 25.5 hrs × 70% reduction`,
                },
                {
                  label: "Staff hours freed up",
                  value: `${Math.round(client.estimatedStudents * 25.5 * 0.7 / 40)} weeks`,
                  sub: "equivalent full-time staff weeks reclaimed per year",
                  green: true,
                },
              ].map(col => (
                <div key={col.label} className="px-6 py-5">
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">{col.label}</p>
                  <p className={`text-2xl font-black leading-none ${col.green ? "text-brand-600" : "text-foreground"}`}>{col.value}</p>
                  <p className="text-[10px] text-muted mt-1">{col.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const TIERS = [
  {
    label: "Squad",
    price: "$2,950",
    unit: "/ yr",
    range: "Up to 10 athletes",
    note: "For smaller programs onboarding a focused recruiting class.",
    popular: false,
  },
  {
    label: "Roster",
    price: "$6,500",
    unit: "/ yr",
    range: "Up to 25 athletes",
    note: "For typical college programs managing a full incoming class of international and out-of-state athletes.",
    popular: true,
  },
  {
    label: "Program",
    price: "$11,500",
    unit: "/ yr",
    range: "Up to 50 athletes",
    note: "For large rosters or programs combining multiple teams.",
    popular: false,
  },
  {
    label: "Department",
    price: "$19,500",
    unit: "/ yr",
    range: "Unlimited athletes",
    note: "For athletic departments covering every sport, every athlete, every year.",
    popular: false,
  },
];

const ALL_FEATURES = [
  "AI-generated relocation guide per athlete",
  "Delivery within 24 hours",
  "18 language options",
  "Athlete document upload portal",
  "Coach portal (per-sport access)",
  "AD dashboard — full program visibility",
  "Guide Notes & custom links per sport",
  "Email + WhatsApp delivery",
  "Custom branding (logo + colors)",
  "Open & delivery notifications",
  "Weekly intake digest email",
  "Bulk resend & CSV export",
];

// ─── Compliance Section ───────────────────────────────────────────────────────

function ComplianceSection() {
  return (
    <section className="bg-surface border-t border-b border-border py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Trust & Security</span>
          <h2 className="text-2xl font-bold text-foreground">Built for institutional compliance</h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">Student data handled in accordance with FERPA and GDPR requirements.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "FERPA Compliant",
              desc: "Settlyou acts as a School Official with legitimate educational interest. Student data is never sold or shared without institutional consent.",
              icon: (
                <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              ),
            },
            {
              title: "GDPR Ready",
              desc: "EU/EEA institutions receive a Data Processing Agreement on request. 72-hour breach notification, Standard Contractual Clauses for data transfers.",
              icon: (
                <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              title: "No data sold. Ever.",
              desc: "Student records are used exclusively to generate guides and collect documents. Deleted within 30 days of account termination or written request.",
              icon: (
                <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
            },
          ].map(item => (
            <div key={item.title} className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-6 text-xs text-muted">
          <a href="/compliance" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-medium">View full compliance documentation</a>
          {" "}· DPA available on request · <a href="mailto:hello@settlyou.com" className="hover:underline">hello@settlyou.com</a>
        </p>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Pricing</span>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Simple. Everything included.</h2>
          <p className="text-sm text-muted mt-3 max-w-lg mx-auto leading-relaxed">
            Every tier includes the full platform — guides, portals, document uploads, branding, analytics. The only difference is volume.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {TIERS.map((tier) => (
            <div key={tier.label} className={`relative flex flex-col rounded-2xl overflow-hidden border ${tier.popular ? "border-brand-500 shadow-xl" : "border-border shadow-sm"}`}>
              {tier.popular && (
                <div className="bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest text-center py-2">
                  Most popular
                </div>
              )}
              <div className={`flex-1 flex flex-col p-7 ${tier.popular ? "bg-brand-50" : "bg-white"}`}>
                <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-3">{tier.label}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black text-foreground leading-none">{tier.price}</span>
                  <span className="text-sm text-muted font-medium mb-0.5">{tier.unit}</span>
                </div>
                <p className="text-sm font-semibold text-foreground mt-2">{tier.range}</p>
                <p className="text-sm text-muted leading-relaxed mt-1 flex-1">{tier.note}</p>
                <div className="mt-8 pt-6 border-t border-border">
                  <a href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8" target="_blank" rel="noopener noreferrer" className={`block text-center text-sm font-bold px-5 py-3 rounded-xl transition-colors ${tier.popular ? "bg-brand-600 text-white hover:bg-brand-700" : "border border-brand-200 text-brand-700 hover:bg-brand-50"}`}>
                    Book a call
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-surface border border-border rounded-2xl p-6 lg:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-5">Everything included on every plan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_FEATURES.map(f => (
              <div key={f} className="flex items-start gap-3">
                <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted text-center mt-6 leading-relaxed max-w-xl mx-auto italic">
          "Our pricing is structured around the value we deliver — every program is different. Book a 15-minute call and we'll show you exactly what your ROI looks like."
        </p>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ client }) {
  return (
    <section className="relative overflow-hidden py-24 px-6" style={{ background: client.primaryColor }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none bg-white" />
      <div className="relative max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.6)" }}>
          Ready to get started
        </p>
        <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
          Start with 15 free guides.<br />No commitment.
        </h2>
        <p className="leading-relaxed text-sm max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
          We'll set up your account, configure your join link, and walk you through everything. If it works for your program, we'll talk about the right plan. No pressure.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <a
            href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white font-bold px-7 py-3.5 rounded-lg text-sm hover:opacity-90 transition-opacity shadow-lg"
            style={{ color: client.primaryColor }}
          >
            Book a 30-min call
          </a>
          <a
            href={client.slug !== "sample" ? `/report/demo/${client.slug}` : "/report/sample-college"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold px-7 py-3.5 rounded-lg text-sm text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)" }}
          >
            See a sample guide
          </a>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          Or email us directly at{" "}
          <a href="mailto:hello@settlyou.com" className="underline hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.7)" }}>
            hello@settlyou.com
          </a>
        </p>
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
        <a href="mailto:hello@settlyou.com" className="hover:text-foreground transition-colors">hello@settlyou.com</a>
        <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
        <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
      </div>
    </footer>
  );
}
