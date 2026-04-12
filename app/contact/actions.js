"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitContactRequest(formData) {
  const supabase = await createClient();

  const { error } = await supabase.from("contact_requests").insert({
    full_name: formData.get("full_name"),
    organization_name: formData.get("organization_name"),
    organization_type: formData.get("organization_type"),
    country: formData.get("country"),
    email: formData.get("email"),
    phone: formData.get("phone") || null,
    message: formData.get("message") || null,
  });

  if (error) {
    redirect("/contact?error=submit_failed");
  }

  redirect("/contact?success=true");
}
