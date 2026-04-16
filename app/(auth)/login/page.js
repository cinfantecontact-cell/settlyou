import { login } from "./actions";

export const metadata = { title: "Sign in — Settl" };

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-border p-8 shadow-sm">
        <a href="/" className="block mb-8">
          <img src="/settlyou-logo.png" alt="Settl" className="h-8 rounded-md" />
        </a>

        <h1 className="text-xl font-semibold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted mb-6">Sign in to your organization account</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error === "invalid_credentials" ? "Invalid email or password." : "Something went wrong. Please try again."}
          </div>
        )}

        <form action={login} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="you@club.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-brand-600 text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
