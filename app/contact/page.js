import { submitContactRequest } from "./actions";

export const metadata = { title: "Request Access — Settlyou" };

const COUNTRIES = [
  "United States", "Chile", "Mexico", "Argentina", "Brazil", "Colombia",
  "Spain", "England", "Germany", "France", "Italy", "Portugal", "Netherlands",
  "Other",
];

export default function ContactPage({ searchParams }) {
  const success = searchParams?.success;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="flex items-center px-8 py-5 border-b border-border bg-white">
        <a href="/">
          <img src="/settlyou-logo.png" alt="Settlyou" className="h-8 rounded-md" />
        </a>
      </nav>

      <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
        <div className="w-full max-w-lg">

          {success ? (
            <div className="bg-white rounded-2xl border border-border p-10 shadow-sm text-center">
              <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">We'll be in touch</h2>
              <p className="text-sm text-muted leading-relaxed">
                Thanks for reaching out. We'll contact you within 24 hours to schedule a quick call and get your program set up.
              </p>
              <a href="/" className="inline-block mt-6 text-sm text-brand-600 font-medium hover:underline">
                ← Back to home
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <div className="mb-7">
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Get started</p>
                <h1 className="text-2xl font-bold text-foreground mb-1">Request access</h1>
                <p className="text-sm text-muted leading-relaxed">
                  Tell us about your program. We'll reach out within 24 hours to schedule a quick call.
                </p>
              </div>

              <form action={submitContactRequest} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="full_name" className="text-sm font-medium text-foreground">Your name</label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder="Juan García"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Work email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder="you@university.edu"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="organization_name" className="text-sm font-medium text-foreground">University name</label>
                  <input
                    id="organization_name"
                    name="organization_name"
                    type="text"
                    required
                    className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder="Florida Atlantic University"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="country" className="text-sm font-medium text-foreground">Country</label>
                    <select
                      id="country"
                      name="country"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select...</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone <span className="text-muted font-normal">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Anything you'd like us to know? <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
                    placeholder="We recruit 10–15 international student-athletes per year..."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 bg-brand-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-brand-700 transition-colors"
                >
                  Submit request →
                </button>

                <p className="text-xs text-muted text-center -mt-1">
                  We'll get back to you within 24 hours.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
