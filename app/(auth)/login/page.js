import { login } from "./actions";

export const metadata = { title: "Sign in — Settlyou" };

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-brand-600 p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <a href="/" className="relative z-10">
          <img src="/settlyou-logo-white.png" alt="Settlyou" className="h-7" />
        </a>

        <div className="relative z-10">
          <p className="text-white text-2xl font-bold leading-snug mb-2">
            Welcome them better.
          </p>
          <p className="text-white/50 text-sm mb-10">
            AI-powered relocation guides for every incoming athlete — delivered in minutes.
          </p>

          <div className="flex flex-col gap-4">
            {[
              "Personalized relocation guide for every athlete",
              "Coach portal — track intake, guides & documents",
              "Document collection with per-sport requirements",
              "Guide delivery via WhatsApp & email",
              "NCAA, NAIA & NJCAA eligibility guidance",
              "Your institution's notes in every guide",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-white/80 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs relative z-10">© {new Date().getFullYear()} Settlyou</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <a href="/" className="block mb-8 lg:hidden">
            <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7" />
          </a>

          <div className="bg-white rounded-2xl border border-border shadow-sm">

            {/* Card header */}
            <div className="px-8 pt-8 pb-6 border-b border-border">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted mt-1">Sign in to your institution account</p>
            </div>

            {/* Card body */}
            <div className="px-8 py-7">

              {error && (
                <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error === "invalid_credentials" ? "Invalid email or password." : "Something went wrong. Please try again."}
                </div>
              )}

              <form action={login} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors"
                    placeholder="you@university.edu"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Password
                    </label>
                    <a href="/forgot-password" className="text-xs text-brand-600 font-medium hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="border border-border rounded-lg px-4 py-2.5 text-sm bg-white text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg border border-brand-600 bg-brand-600 text-white py-2.5 text-sm font-semibold hover:bg-brand-700 hover:border-brand-700 transition-colors"
                >
                  Sign in
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted">
                Need access?{" "}
                <a href="mailto:hello@settlyou.com" className="text-brand-600 font-medium hover:underline">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
