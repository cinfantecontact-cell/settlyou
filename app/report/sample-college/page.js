"use client";

import DocumentView from "@/app/(admin)/admin/relocations/[id]/_components/DocumentView";
import { collegeDemoDocumentV2 } from "../sample/collegeDemoData";
import QuoteButton from "@/app/_components/QuoteButton";
import UploadDemoClient from "@/app/upload/demo/_components/UploadDemoClient";
import ScrollReveal from "@/app/_components/ScrollReveal";

export default function CollegeSampleReportPage() {
  return (
    <div className="min-h-screen bg-surface">

      {/* Nav */}
      <nav className="bg-white border-b border-border px-6 py-4 flex items-center justify-between no-print sticky top-0 z-50">
        <a href="/">
          <img src="/settlyou-logo-dark.png" alt="Settl" className="h-7" />
        </a>
        <div className="flex items-center gap-3">
          <a href="/pricing" className="text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors">
            Pricing
          </a>
          <QuoteButton className="text-xs font-semibold px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors">
            Request a quote
          </QuoteButton>
        </div>
      </nav>

      {/* Hero */}
      <div className="no-print relative overflow-hidden bg-brand-600">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none bg-white" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10 blur-2xl pointer-events-none bg-brand-300" />

        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-12">
          {/* University × Settlyou lockup */}
          <div className="flex items-center gap-3 mb-10">
            <img
              src="/Florida_Atlantic_Owls_logo.svg.png"
              alt="Florida Atlantic University"
              className="w-11 h-11 object-contain bg-white rounded-xl p-1.5 shrink-0 shadow-lg"
            />
            <div className="text-white/30 text-xl font-light">×</div>
            <img src="/settlyou-logo-white.png" alt="Settlyou" className="h-5 object-contain" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-200 border border-white/20 bg-white/10 px-3.5 py-1.5 rounded-full mb-5">
                Sample Student Guide
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-[1.06]">
                See exactly what<br />your athletes receive.
              </h1>
              <p className="text-white/65 text-sm max-w-md leading-relaxed mb-8">
                This is Alejandro's guide — a Venezuelan soccer player moving to Boca Raton. Every athlete gets one like this, built in under 5 minutes, in their native language.
              </p>

              {/* Athlete context pill */}
              <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Alejandro Rivera</p>
                  <p className="text-white/55 text-xs">Men's Soccer · From Caracas, Venezuela</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 flex-wrap">
                {[
                  { v: "18", l: "languages" },
                  { v: "< 5 min", l: "to generate" },
                  { v: "100%", l: "personalized" },
                ].map(s => (
                  <div key={s.l} className="flex flex-col gap-0.5">
                    <span className="text-2xl font-black text-white leading-none">{s.v}</span>
                    <span className="text-[10px] text-white/45 font-bold uppercase tracking-widest">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA card */}
            <div className="lg:flex lg:justify-end hidden">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-xs backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-100 mb-2">Ready to build guides for your athletes?</p>
                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  Get a custom quote for your athletics program. Setup in under a day.
                </p>
                <QuoteButton className="w-full bg-white text-brand-700 text-sm font-bold py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-md text-center">
                  Get this for your program
                </QuoteButton>
                <p className="text-[10px] text-white/35 text-center mt-3">No commitment · Response within 24h</p>
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="lg:hidden mt-6">
            <QuoteButton className="inline-block bg-white text-brand-700 text-sm font-bold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-md">
              Get this for your program
            </QuoteButton>
          </div>

          {/* Scroll hint */}
          <div className="flex items-center gap-2 mt-10 text-white/30">
            <div className="flex-1 h-px bg-white/10" />
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to read the guide</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      </div>

      {/* Guide header label */}
      <div className="no-print bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              The guide
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <img src="/Florida_Atlantic_Owls_logo.svg.png" alt="FAU" className="w-4 h-4 object-contain" />
              <span className="text-xs text-muted">Alejandro Rivera · FAU Men's Soccer · Caracas, Venezuela</span>
            </div>
          </div>
          <span className="text-[10px] text-muted/60 font-medium">This is exactly what he receives in his inbox</span>
        </div>
      </div>

      {/* Guide */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-0">
        <DocumentView content={{
          ...collegeDemoDocumentV2,
          meta: {
            ...collegeDemoDocumentV2.meta,
            club_logo_url: "/Florida_Atlantic_Owls_logo.svg.png",
            club_primary_color: "#003366",
          },
          university_notes: "Welcome to the FAU Owls family! Before you arrive, make sure you've completed your SEVIS check-in with the International Student Office (Building 96, Room 129). Your compliance forms and pre-participation physical must be on file with Sports Medicine before your first team practice. Housing applications for on-campus residents close July 15th — submit yours as soon as possible. If you have any questions, reach out to your academic advisor — they're expecting you.",
          university_links: [
            { label: "FAU Athlete Portal", url: "https://fausports.com" },
            { label: "International Student Services", url: "https://www.fau.edu/international" },
            { label: "NCAA Eligibility Center", url: "https://web3.ncaa.org/ecwr3/" },
          ],
          upload_url: "#upload-demo",
        }} />
      </div>


      {/* Upload experience — live demo */}
      <div id="upload-demo" className="no-print relative overflow-hidden border-t border-brand-100" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #eff6ff 40%, #f5f3ff 100%)" }}>
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-200 opacity-20 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-indigo-200 opacity-20 blur-[60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-100 opacity-10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 border border-brand-200 bg-white/80 px-4 py-1.5 rounded-full mb-5 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Live Demo — Document Collection
              </div>
              <h2 className="text-3xl font-black text-foreground mb-3 leading-tight">
                What Alejandro sees when<br /><span className="text-brand-600">submitting his documents</span>
              </h2>
              <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed">
                Watch how Alejandro downloads his coach's templates and submits his documents — exactly what every athlete sees.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white p-6">
              <UploadDemoClient />
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* CTA footer */}
      <div className="no-print bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">Powered by Settlyou</p>
          <h2 className="text-3xl font-bold text-white mb-3">
            Want guides like this for every incoming athlete?
          </h2>
          <p className="text-white/65 max-w-lg mx-auto mb-10 leading-relaxed text-sm">
            Every athlete gets their own guide — personalized to their background, destination, visa status, and sport. NCAA eligibility, banking, housing, community, and everything in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <QuoteButton className="inline-block px-8 py-3 rounded-lg text-sm font-semibold bg-white text-brand-700 hover:bg-brand-50 transition-colors shadow-md">
              Request a quote
            </QuoteButton>
            <a
              href="/"
              className="inline-block px-8 py-3 rounded-lg text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Learn how it works
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted no-print">
        This is a sample document generated by Settlyou · Not a real relocation package
      </footer>
    </div>
  );
}
