"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function inviteClient(formData) {
  const supabase = await createClient();
  const admin = createAdminClient();

  // Verify caller is a settl_admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const orgName = formData.get("org_name");
  const orgType = formData.get("org_type");
  const orgCountry = formData.get("org_country");
  const orgTier = formData.get("org_tier");
  const contactName = formData.get("contact_name");
  const contactEmail = formData.get("contact_email");

  // Create organization
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: orgName,
      type: orgType,
      country: orgCountry,
      tier: orgTier,
      contact_name: contactName,
      contact_email: contactEmail,
    })
    .select()
    .single();

  if (orgError) redirect("/admin/clients/new?error=create_failed");

  // Invite user — org_id stored in metadata, profile created on first login
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(contactEmail, {
    data: {
      full_name: contactName,
      organization_id: org.id,
      role: "owner",
    },
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`,
  });

  if (inviteError) {
    // Roll back org creation
    await admin.from("organizations").delete().eq("id", org.id);
    if (inviteError.message?.includes("already been registered")) {
      redirect("/admin/clients/new?error=already_exists");
    }
    redirect("/admin/clients/new?error=invite_failed");
  }

  redirect("/admin/clients?invited=1");
}
