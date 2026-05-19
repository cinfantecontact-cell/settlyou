export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AccountForm from "./_components/AccountForm";
import BrandingForm from "./_components/BrandingForm";
import PinForm from "./_components/PinForm";

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-brand-100 text-brand-700",
  "bg-pink-100 text-pink-700",
];

export default async function AccountPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport, full_name").eq("id", user.id).single();
  if (!["club_admin", "coach", "admissions"].includes(profile?.role)) redirect("/login");

  const { data: club } = await admin
    .from("clubs").select("id, name, slug, plan, logo_url, primary_color, secondary_color, custom_notes, custom_links, pin").eq("id", profile.club_id).single();

  if (profile?.role === "admissions") {
    const displayName = profile.full_name || user.email?.split("@")[0] || "Staff";
    const initials = displayName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
    const idx = displayName.charCodeAt(0) % AVATAR_COLORS.length;
    const avatarColor = AVATAR_COLORS[idx];

    return (
      <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-border p-6 flex items-center gap-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${avatarColor}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground tracking-tight">{displayName}</h1>
            <p className="text-sm text-muted mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface text-muted border border-border">
                {club?.name || "—"}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">Account info</h2>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Institution</p>
                <p className="text-sm font-medium text-foreground">{club?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Login email</p>
                <p className="text-sm font-medium text-foreground">{user.email || "—"}</p>
              </div>
            </div>
          </div>
          <AccountForm email={user.email} clubName={club?.name} isCoach={true} />
        </div>
      </div>
    );
  }

  if (profile?.role === "coach") {
    const displayName = profile.full_name || user.email?.split("@")[0] || "Coach";
    const initials = displayName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
    const idx = displayName.charCodeAt(0) % AVATAR_COLORS.length;
    const avatarColor = AVATAR_COLORS[idx];

    return (
      <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
        {/* Profile header */}
        <div className="bg-white rounded-xl border border-border p-6 flex items-center gap-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${avatarColor}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground tracking-tight">{displayName}</h1>
            <p className="text-sm text-muted mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {profile.sport && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
                  {profile.sport}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface text-muted border border-border">
                {club?.name || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Info + Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Account info card */}
          <div className="bg-white rounded-xl border border-border p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">Account info</h2>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Institution</p>
                <p className="text-sm font-medium text-foreground">{club?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Sport</p>
                <p className="text-sm font-medium text-foreground">{profile.sport || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Login email</p>
                <p className="text-sm font-medium text-foreground">{user.email || "—"}</p>
              </div>
            </div>
            <p className="text-xs text-muted mt-auto pt-2 border-t border-border">
              Need to update your email? Contact your Athletics Director — they can update it from the Coaches tab.
            </p>
          </div>

          {/* Change password */}
          <AccountForm email={user.email} clubName={club?.name} isCoach={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Account</h1>
        <p className="text-sm text-muted">Manage your account and branding settings.</p>
      </div>
      <div id="tour-account-form" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <AccountForm email={user.email} clubName={club?.name} />
        <BrandingForm club={club} slug={club?.slug} />
      </div>
      <PinForm currentPin={club?.pin || ""} />
      <p className="text-xs text-muted">
        <a href="/privacy" className="hover:underline">How student data is handled</a>
      </p>
    </div>
  );
}
