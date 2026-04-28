import { login } from "./actions";

export const metadata = { title: "Sign in — Settlyou" };

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-brand-600 p-12">
        <a href="/">
          <img src="/settlyou-logo-white.png" alt="Settlyou" className="h-7" />
        </a>
        <div>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">What you get</p>
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
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-white/80 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} Settlyou</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <a href="/" className="block mb-10 lg:hidden">
            <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7" />
          </a>

          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-sm text-muted mb-8">Sign in to your institution account</p>

          {error && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error === "invalid_credentials" ? "Invalid email or password." : "Something went wrong. Please try again."}
            </div>
          )}

          <form action={login} className="flex flex-col gap-5">
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
                className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
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
                className="border border-border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="mt-1 bg-brand-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted">
            Need access?{" "}
            <a href="mailto:hello@settlyou.com" className="text-brand-600 font-medium hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
