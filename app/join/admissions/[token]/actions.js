"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function activateAdmissionsAccount(formData) {
  const token = formData.get("token");
  const fullName = formData.get("full_name");
  const password = formData.get("password");

  if (!token || !fullName || !password) {
    redirect(`/join/admissions/${token}?error=missing_fields`);
  }

  const admin = createAdminClient();

  const { data: invite, error: inviteError } = await admin
    .from("staff_invites")
    .select("*")
    .eq("token", token)
    .eq("accepted", false)
    .single();

  if (inviteError || !invite) {
    redirect(`/join/admissions/${token}?error=invalid_token`);
  }

  const { data: authUser, error: createError } = await admin.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError) {
    redirect(`/join/admissions/${token}?error=account_exists`);
  }

  await admin.from("profiles").insert({
    id: authUser.user.id,
    full_name: fullName,
    role: "admissions",
    club_id: invite.club_id,
  });

  await admin.from("staff_invites").update({ accepted: true }).eq("id", invite.id);

  redirect("/login?message=account_created");
}
