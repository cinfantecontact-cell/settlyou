import { submitContactRequest } from "./actions";

export const metadata = { title: "Request Access — Settlyou" };

const COUNTRIES = [
  "United States", "Chile", "Mexico", "Argentina", "Brazil", "Colombia",
  "Spain", "England", "Germany", "France", "Italy", "Portugal", "Netherlands",
  "Other",
];

export default async function ContactPage({ searchParams }) {
  const { success, error } = await searchParams;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="flex items-center px-8 py-5 border-b border-border bg-white">
        <a href="/">
          <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7" />
        </a>
      </nav>

      <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
        <div className="w-full max-w-lg">

          {success ? (
            <div className="text-center">
              <meta httpEquiv="refresh" content="2;url=/" />
              <h2 className="text-2xl font-bold text-foreground mb-3">Thank you!</h2>
              <p className="text-muted">We will be in touch.</p>
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
                    <label htmlFor="role" className="text-sm font-medium text-foreground">Role / position</label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder="Head Coach, Athletic Director..."
                    />
                  </div>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="organization_type" className="text-sm font-medium text-foreground">Organization type</label>
                    <select
                      id="organization_type"
                      name="organization_type"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="club">Sports Club / University</option>
                      <option value="agency">Agency</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="organization_name" className="text-sm font-medium text-foreground">Organization name</label>
                    <input
                      id="organization_name"
                      name="organization_name"
                      type="text"
                      required
                      className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                      placeholder="Florida Atlantic University"
                    />
                  </div>
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
