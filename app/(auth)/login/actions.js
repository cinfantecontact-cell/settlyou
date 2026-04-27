"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role === "settl_admin") redirect("/admin");
  if (profile?.role === "club_admin") redirect("/club");
  if (profile?.role === "coach") redirect("/club");
  redirect("/dashboard");
}
