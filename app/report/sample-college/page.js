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
        <a href="/pricing" className="text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors">
          Pricing
        </a>
      </nav>

      {/* Hero header */}
      <div className="no-print relative overflow-hidden bg-brand-600">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none bg-white" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full opacity-10 blur-2xl pointer-events-none bg-brand-300" />
        <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-10">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/Florida_Atlantic_Owls_logo.svg.png"
              alt="Florida Atlantic University"
              className="w-12 h-12 object-contain bg-white rounded-xl p-1.5 shrink-0 shadow-md"
            />
            <div className="text-white/40 text-2xl font-light">×</div>
            <img src="/settlyou-logo-white.png" alt="Settlyou" className="h-6 object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-200 border border-white/20 bg-white/10 px-4 py-1.5 rounded-full mb-5">
            Sample Student Guide
          </div>
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            Florida Atlantic University
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed mb-8">
            Every incoming athlete gets a guide like this — personalized to who they are, where they're from, and what they need to land confidently in Boca Raton.
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { v: "18", l: "languages" },
              { v: "< 5 min", l: "to generate" },
              { v: "100%", l: "personalized" },
            ].map(s => (
              <div key={s.l} className="flex flex-col gap-0.5">
                <span className="text-2xl font-black text-white leading-none">{s.v}</span>
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">{s.l}</span>
              </div>
            ))}
            <QuoteButton className="ml-auto bg-white text-brand-700 text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-brand-50 transition-colors shadow-md">
              Get this for your program
            </QuoteButton>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="max-w-4xl mx-auto px-4 py-8">
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
        }} />
      </div>

      {/* Connector bridge */}
      <div className="no-print flex flex-col items-center gap-2 py-6 bg-white">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-600">
          <div className="h-px w-16 bg-brand-200" />
          Section 3 of the guide links here
          <div className="h-px w-16 bg-brand-200" />
        </div>
        <svg className="w-6 h-6 text-brand-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <p className="text-xs text-muted max-w-xs text-center leading-relaxed">
          Athletes tap their personal upload link from the guide and land on this page — pre-loaded with their coach's required documents.
        </p>
        <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Upload experience */}
      <div className="no-print relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #eff6ff 40%, #f5f3ff 100%)" }}>
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-200 opacity-20 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-indigo-200 opacity-20 blur-[60px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-100 opacity-10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600 border border-brand-200 bg-white/80 px-4 py-1.5 rounded-full mb-5 shadow-sm">
                Document Collection
              </div>
              <h2 className="text-3xl font-black text-foreground mb-3 leading-tight">
                What athletes see when<br /><span className="text-brand-600">submitting their documents</span>
              </h2>
              <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed">
                After receiving their guide, athletes get a personalized upload page — coach templates, required docs, and a progress tracker. Try it below.
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
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Powered by Settlyou</p>
          <h2 className="text-3xl font-bold text-white mb-3">
            Want guides like this for every incoming student?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-10 leading-relaxed text-sm">
            Every student gets their own guide — personalized to their background, destination, visa status, and goals. NCAA eligibility, banking, housing, community, and everything in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <QuoteButton className="inline-block px-8 py-3 rounded-lg text-sm font-semibold bg-white text-brand-700 hover:bg-brand-50 transition-colors">
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
