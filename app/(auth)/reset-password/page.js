"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-border p-8 shadow-sm">
        <a href="/" className="block mb-8">
          <img src="/settlyou-logo.png" alt="Settlyou" className="h-8 rounded-md" />
        </a>

        {done ? (
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">Password updated</h1>
            <p className="text-sm text-muted mb-6">You can now sign in with your new password.</p>
            <a
              href="/login"
              className="block w-full text-center bg-brand-600 text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Sign in
            </a>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-1">Set new password</h1>
            <p className="text-sm text-muted mb-6">Choose a new password for your account.</p>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-foreground">New password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="confirm" className="text-sm font-medium text-foreground">Confirm password</label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  minLength={8}
                  className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-brand-600 text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
