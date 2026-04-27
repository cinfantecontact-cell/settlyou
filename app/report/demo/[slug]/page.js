import { notFound } from "next/navigation";
import { getClientBySlug } from "@/lib/pitch-clients";
import { getDemoGuide } from "@/lib/demo-guide-data";
import DocumentView from "@/app/(admin)/admin/relocations/[id]/_components/DocumentView";
import DemoTour from "./_components/DemoTour";
import QuoteButton from "./_components/QuoteButton";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) return {};
  return {
    title: `${client.name} — Sample Student Guide · Settlyou`,
    description: `See what a personalized relocation guide looks like for ${client.name} students.`,
    robots: { index: false, follow: false },
  };
}

export default async function DemoGuidePage({ params }) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  const demoDoc = getDemoGuide(slug);

  if (!client || !demoDoc) notFound();

  const headerColor = client.primaryColor;

  return (
    <div className="min-h-screen bg-surface">

      {/* Nav */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between no-print sticky top-0 z-50">
        <a href="/">
          <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7" />
        </a>
        <QuoteButton className="text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors">
          Request a quote
        </QuoteButton>
      </nav>

      {/* Hero header */}
      <div className="no-print relative overflow-hidden bg-brand-600">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none bg-white" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full opacity-10 blur-2xl pointer-events-none bg-brand-300" />
        <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-10">
          <div className="flex items-center gap-3 mb-8">
            {client.logoUrl ? (
              <img src={client.logoUrl} alt={client.name} className="w-12 h-12 object-contain bg-white rounded-xl p-1.5 shrink-0 shadow-md" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/20 shadow-md">
                <span className="text-white text-sm font-bold">{client.shortName.slice(0, 2)}</span>
              </div>
            )}
            <div className="text-white/40 text-2xl font-light">×</div>
            <img src="/settlyou-logo-white.png" alt="Settlyou" className="h-6 object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-200 border border-white/20 bg-white/10 px-4 py-1.5 rounded-full mb-5">
            Sample Student Guide
          </div>
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            {client.name}
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed mb-8">
            Every incoming athlete gets a guide like this — personalized to who they are, where they're from, and what they need to land confidently in {client.city || "their new city"}.
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
        <DocumentView content={demoDoc} />
      </div>

      {/* CTA footer */}
      <div className="no-print" style={{ background: headerColor }}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Powered by Settlyou</p>
          <h2 className="text-3xl font-bold text-white mb-3">
            Want guides like this for every incoming student?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-10 leading-relaxed text-sm">
            Every student gets their own guide — personalized to their background, destination, visa status, and goals. NCAA eligibility, banking, housing, community, and everything in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://calendar.app.google/6fVjZ9wJ9r8LUXDv8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg text-sm font-semibold bg-white transition-colors hover:bg-white/90"
              style={{ color: headerColor }}
            >
              Book a call
            </a>
            <a
              href={`/pitch/${slug}`}
              className="inline-block px-8 py-3 rounded-lg text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              See the full overview
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted no-print">
        This is a sample document generated by Settlyou · Not a real student relocation package
      </footer>

      <DemoTour />
    </div>
  );
}
