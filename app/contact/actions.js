"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function submitContactRequest(formData) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = await createClient();

  const full_name = formData.get("full_name");
  const role = formData.get("role") || null;
  const organization_name = formData.get("organization_name");
  const organization_type = formData.get("organization_type") || "club";
  const country = formData.get("country");
  const email = formData.get("email");
  const phone = formData.get("phone") || null;
  const message = formData.get("message") || null;

  const { error } = await supabase.from("contact_requests").insert({
    full_name,
    role,
    organization_name,
    organization_type,
    country,
    email,
    phone,
    message,
  });

  if (error) {
    console.error("contact_requests insert failed:", error.message, error.details);
    redirect("/contact?error=submit_failed");
  }

  // Notify hello@settlyou.com
  try {
    await resend.emails.send({
      from: "Settlyou <hello@settlyou.com>",
      to: "hello@settlyou.com",
      subject: `New access request — ${organization_name}`,
      html: `
        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Role:</strong> ${role || "—"}</p>
        <p><strong>Organization:</strong> ${organization_name} (${organization_type || "—"})</p>
        <p><strong>Country:</strong> ${country || "—"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>Message:</strong> ${message || "—"}</p>
      `,
    });
  } catch (e) {
    console.error("Failed to send contact notification:", e.message);
  }

  redirect("/contact?success=true");
}
