import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { activateAdmissionsAccount } from "./actions";

export default async function AdmissionsInvitePage({ params, searchParams }) {
  const { token } = await params;
  const { error } = await searchParams;
  const admin = createAdminClient();

  const { data: invite } = await admin
    .from("staff_invites")
    .select("email, accepted, clubs(name)")
    .eq("token", token)
    .single();

  if (!invite) notFound();

  if (invite.accepted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="bg-white border border-border rounded-2xl p-10 max-w-md w-full text-center">
          <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7 mx-auto mb-8" />
          <p className="text-lg font-semibold text-foreground mb-2">This invite has already been used</p>
          <p className="text-sm text-muted mb-6">Your account is already active. Sign in to access the portal.</p>
          <a href="/login" className="inline-block text-sm font-semibold px-5 py-2.5 rounded-xl border border-brand-200 text-brand-700 hover:bg-brand-50 transition-colors">
            Go to login
          </a>
        </div>
      </div>
    );
  }

  const errorMessages = {
    missing_fields: "Please fill in all fields.",
    invalid_token: "This invite link is invalid or has expired.",
    account_exists: "An account with this email already exists. Try logging in.",
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="bg-white border border-border rounded-2xl p-10 max-w-md w-full">
        <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7 mb-8" />

        <h1 className="text-2xl font-bold text-foreground mb-1">Set up your admissions account</h1>
        <p className="text-sm text-muted mb-8">
          You've been invited by <strong>{invite.clubs?.name}</strong> as an admissions staff member.
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {errorMessages[error] ?? "Something went wrong. Please try again."}
          </div>
        )}

        <form action={activateAdmissionsAccount} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={invite.email}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-muted"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="full_name" className="text-xs font-semibold text-muted uppercase tracking-wider">Full name</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              placeholder="Your full name"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-muted uppercase tracking-wider">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
