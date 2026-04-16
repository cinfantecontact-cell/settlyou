import { submitContactRequest } from "./actions";

export const metadata = { title: "Request Access — Settl" };

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
        <a href="/" className="text-2xl font-bold text-brand-600 tracking-tight">
          Settl
        </a>
      </nav>

      <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
        <div className="w-full max-w-lg bg-white rounded-xl border border-border p-8 shadow-sm">
          {success ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Request received</h2>
              <p className="text-sm text-muted">
                Thanks for reaching out. Our team will contact you within 24 hours to schedule a call.
              </p>
              <a href="/" className="inline-block mt-6 text-sm text-brand-600 hover:underline">
                Back to home
              </a>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground mb-1">Request access</h1>
              <p className="text-sm text-muted mb-6">
                Tell us about your organization. We'll reach out to schedule a quick call before setting up your account.
              </p>

              <form action={submitContactRequest} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="full_name" className="text-sm font-medium text-foreground">
                      Your name
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder="Juan García"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder="you@university.edu"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="organization_name" className="text-sm font-medium text-foreground">
                    University or department name
                  </label>
                  <input
                    id="organization_name"
                    name="organization_name"
                    type="text"
                    required
                    className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder="Florida Atlantic University"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="organization_type" className="text-sm font-medium text-foreground">
                      Type
                    </label>
                    <select
                      id="organization_type"
                      name="organization_type"
                      required
                      className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="university">University / College</option>
                      <option value="athletic_department">Athletic department</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="country" className="text-sm font-medium text-foreground">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select...</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Anything you'd like us to know? <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
                    placeholder="We recruit 10–15 international student-athletes per year..."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 bg-brand-600 text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors"
                >
                  Submit request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
