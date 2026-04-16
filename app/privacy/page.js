export const metadata = { title: "Privacy Policy — Settlyou" };

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted">Last updated: April 2025</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-lg font-bold mb-3">1. Who we are</h2>
            <p className="text-sm text-muted leading-relaxed">
              Settlyou ("we", "us", "our") is a relocation guide platform for professional and college athletes. We operate at{" "}
              <a href="https://settlyou.com" className="text-brand-600 hover:underline">settlyou.com</a> and provide AI-generated relocation guides to sports clubs, universities, and athletes. Our contact email is{" "}
              <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">2. What information we collect</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">We collect information in the following ways:</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-brand-500 mt-1 shrink-0">·</span>
                <span><strong className="text-foreground">Athlete profile data</strong> — name, nationality, age, sport, destination city, family details, housing preferences, dietary needs, and other relocation-related information submitted through our onboarding form. This data is used solely to generate a personalized relocation guide.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 mt-1 shrink-0">·</span>
                <span><strong className="text-foreground">Contact information</strong> — email address provided by athletes and club administrators during onboarding and account creation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 mt-1 shrink-0">·</span>
                <span><strong className="text-foreground">Account information</strong> — email address and role for club portal and admin accounts created by Settlyou.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 mt-1 shrink-0">·</span>
                <span><strong className="text-foreground">Usage data</strong> — anonymized events such as guide views, form submissions, and PDF prints, used to improve our service. No personally identifiable information is attached to these events.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 mt-1 shrink-0">·</span>
                <span><strong className="text-foreground">Contact form submissions</strong> — name, organization, and email submitted via our website contact form.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">3. How we use your information</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">We use collected information exclusively to:</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Generate personalized AI relocation guides for athletes</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Deliver relocation guides to athletes via private link and email</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Communicate with clubs and universities about their athletes' relocation status</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Improve and maintain the Settlyou platform</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>Respond to inquiries and support requests</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mt-3">
              We do not sell, rent, or share your personal data with third parties for marketing purposes. We do not use athlete profile data for any purpose other than generating the relocation guide for which it was submitted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">4. AI processing</h2>
            <p className="text-sm text-muted leading-relaxed">
              Relocation guides are generated using the Anthropic Claude API. Athlete profile data submitted through our forms is sent to Anthropic's API to generate the guide content. Anthropic's data handling is governed by their{" "}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Privacy Policy</a>. We do not permit Anthropic to use submitted data for model training. Data sent to the API is used solely for the purpose of generating your relocation guide.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">5. Data storage and security</h2>
            <p className="text-sm text-muted leading-relaxed">
              All data is stored in Supabase (a PostgreSQL-based database platform) with row-level security policies. Relocation guides are accessible only via unique private links. Club portal and admin accounts are protected by email and password authentication. We use industry-standard encryption (TLS) for all data in transit. While we implement reasonable security measures, no system is completely secure and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">6. Data retention</h2>
            <p className="text-sm text-muted leading-relaxed">
              Athlete profile data and generated relocation guides are retained for the duration of the club or university's active subscription. Upon account termination or written request, we will delete all associated athlete data within 30 days. Contact form submissions are retained for up to 12 months. Usage event data (anonymized) may be retained indefinitely to support platform improvements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">7. Your rights</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Depending on your location, you may have rights including:
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>The right to access the personal data we hold about you</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>The right to correct inaccurate personal data</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>The right to request deletion of your personal data</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>The right to object to or restrict certain processing</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span>The right to data portability</span></li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">hello@settlyou.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">8. Cookies</h2>
            <p className="text-sm text-muted leading-relaxed">
              Settlyou uses only essential cookies necessary for authentication and session management (via Supabase Auth). We do not use advertising cookies, tracking pixels, or third-party analytics that set persistent cookies. You can disable cookies in your browser settings, though this may affect your ability to log in to the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">9. Third-party services</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">We use the following third-party services to operate Settlyou:</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Supabase</strong> — database and authentication. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Privacy Policy</a></span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Anthropic</strong> — AI guide generation. <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Privacy Policy</a></span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Vercel</strong> — hosting and deployment. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Privacy Policy</a></span></li>
              <li className="flex items-start gap-2"><span className="text-brand-500 mt-1 shrink-0">·</span><span><strong className="text-foreground">Resend</strong> — transactional email. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Privacy Policy</a></span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">10. Children's privacy</h2>
            <p className="text-sm text-muted leading-relaxed">
              Settlyou is not directed at children under the age of 13. We do not knowingly collect personal data from children. Athlete profile forms may include information about an athlete's children (such as ages for school matching) — this information is used solely for generating the relocation guide and is not stored separately or used for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">11. Changes to this policy</h2>
            <p className="text-sm text-muted leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify active club and university accounts of material changes by email. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of Settlyou after changes take effect constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">12. Contact us</h2>
            <p className="text-sm text-muted leading-relaxed">
              For any privacy-related questions, data requests, or concerns, contact us at:{" "}
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
          <a href="/privacy" className="text-foreground font-medium">Privacy policy</a>
        </div>
      </footer>

    </main>
  );
}
