export const metadata = {
  title: "Data Compliance — Settlyou",
  description: "How Settlyou handles student data in compliance with FERPA and GDPR.",
};

export default function CompliancePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <a href="/"><img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-8" /></a>
        <div className="flex items-center gap-6">
          <a href="/pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
          <a href="/login" className="text-sm text-muted hover:text-foreground transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-10 w-full">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Trust & Compliance</span>
        <h1 className="text-4xl font-bold text-foreground mb-4">Data Compliance</h1>
        <p className="text-sm text-muted leading-relaxed max-w-xl">
          Settlyou is designed to handle student and athlete data responsibly. This page explains how we comply with FERPA and GDPR, and what that means for your institution.
        </p>
        <p className="text-xs text-muted mt-4">Last updated: April 30, 2026</p>
      </div>

      {/* Compliance badges */}
      <div className="max-w-3xl mx-auto px-6 pb-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">FERPA Compliant</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">Family Educational Rights and Privacy Act — U.S. federal student data protection law.</p>
            </div>
          </div>
          <div className="border border-border rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">GDPR Ready</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">General Data Protection Regulation — EU/EEA data protection framework. DPA available on request.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-20 w-full">
        <div className="prose prose-sm max-w-none space-y-12 text-foreground">

          {/* FERPA */}
          <section>
            <h2 className="text-xl font-bold mb-1">FERPA</h2>
            <p className="text-xs font-medium text-muted mb-5 uppercase tracking-wider">Family Educational Rights and Privacy Act</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Our role under FERPA</h3>
                <p className="text-sm text-muted leading-relaxed">
                  When Settlyou is contracted by a U.S. educational institution, we operate as a <strong className="text-foreground">"School Official"</strong> with a <strong className="text-foreground">legitimate educational interest</strong> as defined under FERPA (34 CFR §99.31(a)(1)). This means we may access student education records solely to provide the services agreed upon — generating personalized relocation guides and collecting required documents on behalf of the institution.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">What this means in practice</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {[
                    "Student data submitted through Settlyou is used exclusively to generate relocation guides and collect required documents.",
                    "We do not disclose student education records to any third party without the written consent of the institution or the student, except as required by law.",
                    "Student data is never sold, shared for marketing, or used to train AI models.",
                    "Institutions remain the data controller — they decide what data is submitted and who has access.",
                    "Student records are available to the institution upon request at any time.",
                    "Data is deleted within 30 days of account termination or written request.",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Institution responsibilities</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Institutions using Settlyou are responsible for ensuring their use of the platform complies with FERPA, including obtaining any necessary student consents and maintaining appropriate data governance policies. Our Terms of Service include specific institution obligations regarding FERPA compliance.
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl px-5 py-4">
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-foreground">Questions about FERPA compliance?</strong> Contact us at{" "}
                  <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a>. We can provide additional documentation or participate in your institution's vendor review process.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-border" />

          {/* GDPR */}
          <section>
            <h2 className="text-xl font-bold mb-1">GDPR</h2>
            <p className="text-xs font-medium text-muted mb-5 uppercase tracking-wider">General Data Protection Regulation (EU/EEA)</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Our role under GDPR</h3>
                <p className="text-sm text-muted leading-relaxed">
                  For institutions and athletes based in the EU or EEA, Settlyou acts as a <strong className="text-foreground">Data Processor</strong> on behalf of the institution (the <strong className="text-foreground">Data Controller</strong>). We process personal data only on the documented instructions of the institution, for the purpose of delivering our relocation guide and document collection services.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Legal basis for processing</h3>
                <ul className="space-y-2 text-sm text-muted">
                  {[
                    { basis: "Contractual necessity", desc: "Processing is necessary to deliver the services agreed with the institution (Art. 6(1)(b))." },
                    { basis: "Legitimate interest", desc: "Improving platform reliability and security, where this does not override individual rights (Art. 6(1)(f))." },
                    { basis: "Consent", desc: "Athletes provide explicit consent when submitting their onboarding form, with a clear statement of how their data will be used." },
                  ].map(item => (
                    <li key={item.basis} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong className="text-foreground">{item.basis}</strong> — {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Your rights under GDPR</h3>
                <p className="text-sm text-muted leading-relaxed mb-3">EU/EEA residents have the following rights, which we honor within the timeframes required by law:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { right: "Right of access", desc: "Request a copy of all personal data we hold about you." },
                    { right: "Right to rectification", desc: "Correct inaccurate or incomplete personal data." },
                    { right: "Right to erasure", desc: "Request deletion of your data. We action within 30 days." },
                    { right: "Right to restriction", desc: "Restrict processing while a dispute is under review." },
                    { right: "Right to portability", desc: "Receive your data in a machine-readable format." },
                    { right: "Right to object", desc: "Object to processing based on legitimate interest." },
                  ].map(item => (
                    <div key={item.right} className="bg-surface border border-border rounded-xl p-4">
                      <p className="text-xs font-bold text-foreground mb-1">{item.right}</p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Data transfers</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Settlyou's infrastructure is hosted in the United States (Vercel, Supabase). For EU/EEA institutions, data transfers to the U.S. are covered by Standard Contractual Clauses (SCCs). We can provide our Data Processing Agreement (DPA) upon request for institutions that require it as part of their vendor approval process.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Data breach notification</h3>
                <p className="text-sm text-muted leading-relaxed">
                  In the event of a personal data breach, we will notify affected institutions within 72 hours of becoming aware, as required by GDPR Article 33. Notifications will include the nature of the breach, categories and approximate number of individuals affected, likely consequences, and measures taken to address it.
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl px-5 py-4">
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-foreground">Need a DPA or have a GDPR question?</strong> Contact us at{" "}
                  <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a>. We'll provide our Data Processing Agreement and any additional documentation within 2 business days.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Sub-processors */}
          <section>
            <h2 className="text-xl font-bold mb-4">Sub-processors</h2>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Settlyou uses the following third-party sub-processors that may handle personal data as part of delivering our service. Each is bound by appropriate data protection agreements.
            </p>
            <div className="overflow-hidden border border-border rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Sub-processor</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Purpose</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: "Supabase", purpose: "Database & file storage", location: "United States" },
                    { name: "Anthropic", purpose: "AI guide generation", location: "United States" },
                    { name: "Vercel", purpose: "Hosting & deployment", location: "United States" },
                    { name: "Resend", purpose: "Transactional email", location: "United States" },
                    { name: "Bird (MessageBird)", purpose: "WhatsApp delivery", location: "Netherlands / United States" },
                  ].map(sp => (
                    <tr key={sp.name}>
                      <td className="px-5 py-3 text-sm font-medium text-foreground">{sp.name}</td>
                      <td className="px-5 py-3 text-sm text-muted">{sp.purpose}</td>
                      <td className="px-5 py-3 text-sm text-muted">{sp.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-3">
              Note: Anthropic has confirmed they do not use data submitted via API for model training. See{" "}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Anthropic's privacy policy</a>.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold mb-4">Contact & requests</h2>
            <p className="text-sm text-muted leading-relaxed mb-4">
              For any compliance-related questions, data subject requests, DPA requests, or security concerns:
            </p>
            <div className="bg-surface border border-border rounded-xl px-5 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Settlyou Data & Compliance</p>
                <p className="text-sm text-muted mt-0.5">We respond to compliance inquiries within 2 business days.</p>
              </div>
              <a href="mailto:hello@settlyou.com" className="shrink-0 border rounded-full px-4 py-2 text-sm font-medium border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors">
                hello@settlyou.com
              </a>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted mt-auto">
        <span>© {new Date().getFullYear()} Settlyou. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@settlyou.com" className="hover:text-foreground transition-colors">hello@settlyou.com</a>
          <a href="/compliance" className="text-foreground font-medium">Compliance</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy policy</a>
          <a href="/terms" className="hover:text-foreground transition-colors">Terms of service</a>
        </div>
      </footer>

    </main>
  );
}
