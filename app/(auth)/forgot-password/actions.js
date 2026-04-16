"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData) {
  const email = formData.get("email");
  const supabase = await createClient();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://settlyou.com";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
  });

  // Always redirect to confirmation — don't reveal if email exists
  return { ok: true };
}
