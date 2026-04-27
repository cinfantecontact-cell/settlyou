"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function AccountForm({ email, clubName, isCoach = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const currentPassword = e.target.current_password.value;
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

    // Verify current password before changing
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
    if (signInError) {
      setError("Current password is incorrect.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      e.target.reset();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Account info */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Account info</h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Institution</p>
            <p className="text-sm font-medium text-foreground">{clubName || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Login email</p>
            <p className="text-sm font-medium text-foreground">{email || "—"}</p>
          </div>
        </div>
        <p className="text-xs text-muted mt-4">
          Need to update your email?{" "}
          {isCoach
            ? "Contact your Athletics Director — they can update it from the Coaches tab."
            : <a href="mailto:hello@settlyou.com" className="text-brand-600 hover:underline">Contact us</a>
          }
        </p>
      </div>

      {/* Change password */}
      <div id="tour-change-password" className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Change password</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            Password updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="current_password" className="text-sm font-medium text-foreground">Current password</label>
            <input
              id="current_password"
              name="current_password"
              type="password"
              required
              className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-foreground">New password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
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
              className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 text-white rounded-md py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 w-fit px-6"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
