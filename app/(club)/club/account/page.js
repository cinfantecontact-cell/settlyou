export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AccountForm from "./_components/AccountForm";
import BrandingForm from "./_components/BrandingForm";

export default async function AccountPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") redirect("/login");

  const { data: club } = await admin
    .from("clubs").select("id, name, plan, logo_url, primary_color, secondary_color, custom_notes").eq("id", profile.club_id).single();

  return (
    <div className="p-8 max-w-lg flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Account</h1>
        <p className="text-sm text-muted">Manage your account and branding settings.</p>
      </div>
      <AccountForm email={user.email} clubName={club?.name} />
      <BrandingForm club={club} />
    </div>
  );
}
