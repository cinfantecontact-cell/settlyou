"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function activateCoachAccount(formData) {
  const token = formData.get("token");
  const fullName = formData.get("full_name");
  const password = formData.get("password");

  if (!token || !fullName || !password) {
    redirect(`/join/coach/${token}?error=missing_fields`);
  }

  const admin = createAdminClient();

  const { data: invite, error: inviteError } = await admin
    .from("coach_invites")
    .select("*")
    .eq("token", token)
    .eq("accepted", false)
    .single();

  if (inviteError || !invite) {
    redirect(`/join/coach/${token}?error=invalid_token`);
  }

  const { data: authUser, error: createError } = await admin.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError) {
    redirect(`/join/coach/${token}?error=account_exists`);
  }

  await admin.from("profiles").insert({
    id: authUser.user.id,
    full_name: fullName,
    role: "coach",
    club_id: invite.club_id,
    sport: invite.sport,
  });

  await admin.from("coach_invites").update({ accepted: true }).eq("id", invite.id);

  redirect("/login?message=account_created");
}
