export const metadata = { title: "Terms of Service — Settlyou" };

export default function TermsPage() {
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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-20 w-full">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 block">Legal</span>
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-sm text-muted">Last updated: April 24, 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-lg font-bold mb-3">1. Acceptance of terms</h2>
            <p className="text-sm text-muted leading-relaxed">
              By accessing or using Settlyou ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organization — such as a sports club, university, or athletic agency — you represent that you have the authority to bind that organization to these Terms. If you do not agree to these Terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">2. Description of service</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Settlyou is a B2B platform that generates AI-powered relocation guides for college and professional athletes, international students, and incoming students. The Service allows institutions to collect student information through a custom join link and receive personalized relocation guides within 24 hours of submission.
            </p>
            <p className="text-sm text-muted leading-relaxed mb-3">Each guide covers:</p>
            <ul className="space-y-2 text-sm text-muted mb-3">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Paperwork and administrative setup (enrollment, banking, health insurance, FAFSA, visa documents, driver's license)</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Housing recommendations, neighborhood guidance, and commute planning</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>City and local life (transportation, dining, social life, campus resources)</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Eligibility and compliance guidance specific to NCAA, NAIA, and NJCAA divisions (for athlete guides)</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>International student support (F-1 visa, SEVIS, transcript evaluation) where applicable</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Institution-specific notes, links, and required documents added by the institution</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed">
              Guides are generated using AI and reviewed by the Settlyou team before delivery. They are delivered as a private web link with PDF download, available in up to 18 languages. Settlyou reserves the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">3. Free pilot program</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Settlyou offers a free pilot to qualifying institutions. The pilot includes up to 15 guides at no cost, with no contract required. The pilot is intended for evaluation purposes only.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Pilot guides are subject to all the same terms as paid guides, including the AI content disclaimer in Section 6</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Settlyou reserves the right to limit, modify, or discontinue the pilot offer at any time</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Continued use beyond the pilot requires a paid plan agreement</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Pilot data and guides remain accessible for 60 days after the pilot ends, after which they may be deleted</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">4. Plans, pricing, and guide limits</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Paid access to Settlyou is structured as an annual plan with a fixed guide allocation. The following tiers are available:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted border border-border rounded-lg overflow-hidden">
                <thead className="bg-surface text-xs font-semibold text-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-left">Price per guide</th>
                    <th className="px-4 py-3 text-left">Guide allocation</th>
                    <th className="px-4 py-3 text-left">Annual minimum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-4 py-3 font-medium text-foreground">Starter</td><td className="px-4 py-3">$49</td><td className="px-4 py-3">Up to 150 guides / yr</td><td className="px-4 py-3">$2,450</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-foreground">Growth</td><td className="px-4 py-3">$35</td><td className="px-4 py-3">151 – 400 guides / yr</td><td className="px-4 py-3">$5,250</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-foreground">Scale</td><td className="px-4 py-3">$25</td><td className="px-4 py-3">401 – 1,000 guides / yr</td><td className="px-4 py-3">$10,000</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-foreground">Enterprise</td><td className="px-4 py-3">Custom</td><td className="px-4 py-3">1,000+ guides / yr</td><td className="px-4 py-3">Negotiated</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted leading-relaxed mt-4">
              All plans are annual commitments billed in advance. <strong className="text-foreground">Unused guides do not roll over</strong> — any guide allocation not used within the subscription year is forfeited without refund. Settlyou does not offer partial-year subscriptions unless otherwise agreed in writing.
            </p>
            <p className="text-sm text-muted leading-relaxed mt-3">
              Institutions that exceed their allocated guide count mid-year will be contacted to upgrade to the next tier before additional guides can be generated. Settlyou reserves the right to pause guide generation for accounts that have exhausted their allocation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">5. What's included in every plan</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">All paid plans include:</p>
            <ul className="space-y-2 text-sm text-muted mb-4">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>AI-generated relocation guides tailored to each student's profile</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Guide delivered within 24 hours of student form submission</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Web guide with private link and downloadable PDF</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Up to 18 language options</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>NCAA, NAIA, and NJCAA division-specific eligibility guidance</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Institution notes, links, and required documents embedded in every guide</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Admin dashboard with student status tracking</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Custom join link with optional PIN protection</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Email guide delivery to students</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Onboarding support and email assistance</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mb-3">Premium plan additionally includes:</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Custom institution branding (logo and brand colors on every guide)</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Custom coach or advisor notes embedded in every guide</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Guide open tracking and PDF download tracking</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Engagement analytics dashboard</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">6. AI-generated content</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Relocation guides are generated using the Anthropic Claude AI model and reviewed by the Settlyou team before delivery. You acknowledge that:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>AI-generated content may contain errors, inaccuracies, or outdated information</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Guides are informational in nature and do not constitute legal, financial, medical, immigration, or real estate advice</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Eligibility and compliance information (NCAA, NAIA, NJCAA rules) is provided as general guidance — athletes must verify requirements with their institution's compliance officer</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Settlyou does not guarantee the accuracy of third-party information (neighborhood listings, rental prices, school details) included in guides</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Students should independently verify all information before making relocation decisions</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Settlyou is not liable for relocation outcomes, decisions, or actions taken based on guide content</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">7. Eligibility and accounts</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              The Service is intended for sports clubs, universities, and athletic agencies. Access is granted by invitation only — accounts are created by Settlyou after agreement on a plan. You are responsible for:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Maintaining the confidentiality of your account credentials</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>All activity that occurs under your account</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Notifying us immediately at <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a> of any unauthorized use</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">8. Institution responsibilities</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              As an institution using the Service, you agree to:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Obtain appropriate consent from students before their personal data is submitted through Settlyou intake forms</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Provide accurate and complete information in student intake forms</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Use generated guides solely for the purpose of supporting the student's relocation</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Not share guide access links publicly or with unauthorized third parties</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Not reproduce, resell, or publicly distribute guide content without written permission from Settlyou</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Comply with applicable student data privacy laws, including FERPA where applicable</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">9. Payment and billing</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              All plans are billed annually in advance based on the agreed guide allocation tier. The following terms apply:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">No refunds.</strong> All fees paid are non-refundable unless otherwise agreed in writing prior to payment</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">No rollovers.</strong> Unused guides expire at the end of the subscription year and are not carried forward</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Overages.</strong> Exceeding your guide allocation requires upgrading to the next tier. Settlyou will contact you before any overage charges are applied</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Late payments.</strong> Settlyou reserves the right to suspend access for accounts with overdue invoices after a 7-day grace period</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Renewal.</strong> Plans renew annually unless either party provides written notice of cancellation at least 30 days before the renewal date</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">10. Intellectual property</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              All platform code, design, branding, and underlying technology are the exclusive property of Settlyou. Generated relocation guides are licensed to the requesting institution for internal use only — to support the individual student's relocation. You may not:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Reproduce, resell, or publicly distribute guide content without written permission</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Reverse-engineer or copy any part of the Settlyou platform</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Use Settlyou's name, logo, or branding without prior written consent</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">11. Acceptable use</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">You agree not to use the Service to:</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Submit false, misleading, or fabricated student information</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Attempt to access other institutions' accounts or student data</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Interfere with or disrupt the Service or its infrastructure</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Violate any applicable law, including data protection and student privacy laws</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mt-3">
              Settlyou reserves the right to suspend or terminate accounts that violate these terms without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">12. Service availability</h2>
            <p className="text-sm text-muted leading-relaxed">
              We aim to maintain high availability but do not guarantee uninterrupted access to the Service. Guide generation typically completes within 24 hours of student form submission. Settlyou is not liable for delays caused by third-party services (including AI providers or email delivery services), force majeure events, or scheduled maintenance. In the event of an extended outage, Settlyou will communicate with affected institutions and, where appropriate, extend subscription periods accordingly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">13. Limitation of liability</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              To the maximum extent permitted by applicable law, Settlyou and its team members shall not be liable for:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Any indirect, incidental, special, or consequential damages</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Relocation decisions made based on guide content</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Errors or inaccuracies in AI-generated content, including eligibility or compliance information</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Loss of data, revenue, or business opportunities</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Forfeited unused guides resulting from low intake volumes</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mt-3">
              Our total liability to you shall not exceed the amount paid by you to Settlyou in the three months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">14. Termination</h2>
            <p className="text-sm text-muted leading-relaxed">
              Either party may terminate the service relationship with 30 days' written notice prior to renewal. Mid-year termination by the institution does not entitle the institution to a refund of any prepaid fees. Upon termination, access to the platform will be revoked and student data associated with the account will be deleted within 30 days, unless retention is required by applicable law. Sections 10, 13, and 15 survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">15. Governing law and disputes</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Settlyou operates internationally and serves customers primarily in the United States. These Terms are interpreted in accordance with applicable U.S. law. Nothing in these Terms limits any rights you may have under applicable U.S. federal or state law.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              We are committed to resolving disputes amicably — please contact us at <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a> before initiating any formal proceeding. Unresolved disputes will be settled through binding arbitration under the rules of the American Arbitration Association (AAA), except where prohibited by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">16. Changes to these terms</h2>
            <p className="text-sm text-muted leading-relaxed">
              We may update these Terms from time to time. We will notify active accounts of material changes by email at least 14 days before they take effect. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms. The current version of these Terms is always available at settlyou.com/terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">17. Contact</h2>
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
