export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AccountForm from "./_components/AccountForm";
import BrandingForm from "./_components/BrandingForm";
import PinForm from "./_components/PinForm";

export default async function AccountPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport, full_name").eq("id", user.id).single();
  if (profile?.role !== "club_admin" && profile?.role !== "coach") redirect("/login");

  const { data: club } = await admin
    .from("clubs").select("id, name, slug, plan, logo_url, primary_color, secondary_color, custom_notes, custom_links, pin").eq("id", profile.club_id).single();

  if (profile?.role === "coach") {
    return (
      <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Account</h1>
          <p className="text-sm text-muted">Manage your account settings.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Account info</h2>
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
          </div>
          <AccountForm email={user.email} clubName={club?.name} isCoach={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Account</h1>
        <p className="text-sm text-muted">Manage your account and branding settings.</p>
      </div>
      <div id="tour-account-form" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <AccountForm email={user.email} clubName={club?.name} />
        <BrandingForm club={club} slug={club?.slug} />
      </div>
      <PinForm currentPin={club?.pin || ""} />
      <p className="text-xs text-muted">
        <a href="/privacy" className="hover:underline">How student data is handled →</a>
      </p>
    </div>
  );
}
