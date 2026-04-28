"use client";

import { useState } from "react";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    await requestPasswordReset(formData);
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-border p-8 shadow-sm">
        <a href="/" className="block mb-8">
          <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7" />
        </a>

        {sent ? (
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">Check your email</h1>
            <p className="text-sm text-muted mb-6">
              If that email has an account, you'll receive a password reset link shortly.
            </p>
            <a href="/login" className="text-sm text-brand-600 font-medium hover:underline">
              Back to sign in
            </a>
          </div>
        ) : (
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-1">Reset your password</h1>
            <p className="text-sm text-muted mb-6">Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="you@club.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <p className="mt-4 text-sm text-muted">
              <a href="/login" className="text-brand-600 font-medium hover:underline">Back to sign in</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
