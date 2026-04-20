export const metadata = { title: "Terms of Service — Settlyou" };

export default function TermsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <a href="/"><img src="/settlyou-logo.png" alt="Settlyou" className="h-9 rounded-md" /></a>
        <div className="flex items-center gap-6">
          <a href="/pricing" className="text-sm text-muted hover:text-foreground transition-colors">Pricing</a>
          <a href="/login" className="text-sm text-muted hover:text-foreground transition-colors">Sign in</a>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-20 w-full">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Legal</span>
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-sm text-muted">Last updated: April 17, 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-lg font-bold mb-3">1. Acceptance of terms</h2>
            <p className="text-sm text-muted leading-relaxed">
              By accessing or using Settlyou ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organization — such as a sports club or university — you represent that you have the authority to bind that organization to these Terms. If you do not agree to these Terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">2. Description of service</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Settlyou is a B2B platform that generates AI-powered relocation guides for professional and college athletes. The Service includes:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Essentials</strong> — an AI-generated relocation guide covering 12 sections, delivered as a web page with PDF download.</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Premium</strong> — an expanded guide covering 15 sections plus concierge relocation support managed by the Settlyou team.</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mt-3">
              Guides are generated using AI and reviewed by the Settlyou team before delivery. Settlyou reserves the right to modify, suspend, or discontinue any part of the Service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">3. Eligibility and accounts</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              The Service is intended for sports clubs, universities, and athletic agencies. Access is granted by invitation only — accounts are created by Settlyou after an initial consultation. You are responsible for:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Maintaining the confidentiality of your account credentials</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>All activity that occurs under your account</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Notifying us immediately at <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a> of any unauthorized use</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">4. Client responsibilities</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              As a club or university using the Service, you agree to:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Obtain appropriate consent from athletes before submitting their personal data through our intake forms</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Provide accurate and complete information in athlete intake forms</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Use generated guides solely for the purpose of supporting the athlete's relocation</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Not share guide access links publicly or with unauthorized third parties</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Not reproduce or resell guide content without written permission from Settlyou</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">5. AI-generated content</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Relocation guides are generated by AI and reviewed by Settlyou before delivery. You acknowledge that:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>AI-generated content may contain errors, inaccuracies, or outdated information</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Guides are informational in nature and do not constitute legal, financial, medical, or real estate advice</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Settlyou does not guarantee the accuracy of third-party information (e.g., neighborhood listings, school details, rental prices) included in guides</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Athletes should independently verify all information before making relocation decisions</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">6. Payment and billing</h2>
            <p className="text-sm text-muted leading-relaxed">
              Pricing is agreed upon between Settlyou and the client prior to service activation. Payment terms, invoicing schedules, and accepted payment methods are specified in each client's service agreement. Settlyou reserves the right to suspend access to the Service for accounts with overdue payments. All fees are non-refundable unless otherwise agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">7. Intellectual property</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              All platform code, design, branding, and underlying technology are the exclusive property of Settlyou. Generated relocation guides are licensed to the requesting club or university for internal use only. You may not:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Reproduce, resell, or publicly distribute guide content without written permission</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Reverse-engineer or copy any part of the Settlyou platform</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Use Settlyou's name, logo, or branding without prior written consent</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">8. Acceptable use</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">You agree not to use the Service to:</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Submit false, misleading, or fabricated athlete information</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Attempt to access other clients' accounts or data</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Interfere with or disrupt the Service or its infrastructure</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Violate any applicable law, including data protection laws</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mt-3">
              Settlyou reserves the right to suspend or terminate accounts that violate these terms without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">9. Service availability</h2>
            <p className="text-sm text-muted leading-relaxed">
              We aim to maintain high availability but do not guarantee uninterrupted access to the Service. Guide generation typically completes within 24 hours of submission. Settlyou is not liable for delays caused by third-party services (including AI providers or email delivery services), force majeure events, or scheduled maintenance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">10. Limitation of liability</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              To the maximum extent permitted by applicable law, Settlyou and its team members shall not be liable for:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Any indirect, incidental, special, or consequential damages</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Relocation decisions made based on guide content</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Loss of data, revenue, or business opportunities</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Errors or inaccuracies in AI-generated content</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mt-3">
              Our total liability to you shall not exceed the amount paid by you to Settlyou in the three months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">11. Termination</h2>
            <p className="text-sm text-muted leading-relaxed">
              Either party may terminate the service relationship with written notice. Upon termination, your access to the platform will be revoked and athlete data associated with your account will be deleted within 30 days, unless retention is required by applicable law. Sections 7, 10, and 12 survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">12. Governing law and disputes</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              These Terms are governed by the laws of Chile. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Santiago, Chile, unless applicable local law requires otherwise.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              For clients based in the United States, nothing in these Terms limits any rights you may have under applicable U.S. state law. We are committed to resolving disputes amicably — please contact us at <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a> before initiating any formal proceeding.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">13. Changes to these terms</h2>
            <p className="text-sm text-muted leading-relaxed">
              We may update these Terms from time to time. We will notify active accounts of material changes by email at least 14 days before they take effect. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">14. Contact</h2>
            <p className="text-sm text-muted leading-relaxed">
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline font-medium">hello@settlyou.com</a>
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted mt-auto">
        <span>© {new Date().getFullYear()} Settlyou. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@settlyou.com" className="hover:text-foreground transition-colors">hello@settlyou.com</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy policy</a>
          <a href="/terms" className="text-foreground font-medium">Terms of service</a>
        </div>
      </footer>

    </main>
  );
}
