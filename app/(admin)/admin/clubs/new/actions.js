"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function createClub(formData) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const name = formData.get("name");
  const slug = formData.get("slug")?.toLowerCase().trim();
  const type = formData.get("type");
  const seat_limit = parseInt(formData.get("seat_limit")) || 10;
  const primary_color = formData.get("primary_color") || "#16a34a";

  const { error } = await admin.from("clubs").insert({
    name,
    slug,
    type,
    seat_limit,
    primary_color,
    active: true,
    seats_used: 0,
  });

  if (error) {
    if (error.message?.includes("unique")) {
      redirect("/admin/clubs/new?error=slug_taken");
    }
    redirect("/admin/clubs/new?error=create_failed");
  }

  redirect("/admin/clubs?created=1");
}
