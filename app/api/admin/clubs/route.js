import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { generateBaseData } from "@/lib/ai/generate-document";
import { buildWelcomeEmail } from "@/lib/email/welcome";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://settlyou.com";

function generateTempPassword() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `Settlyou${digits}!`;
}

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = await createClient();
  const admin = createAdminClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const name = formData.get("name");
  const slug = formData.get("slug")?.toLowerCase().trim();
  const type = formData.get("type");
  const seat_limit = parseInt(formData.get("seat_limit")) || 10;
  const primary_color = formData.get("primary_color") || "#111111";
  const secondary_color = formData.get("secondary_color") || "#ffffff";
  const pin = formData.get("pin");
  const logoFile = formData.get("logo");
  const custom_notes = formData.get("custom_notes") || null;
  const address = formData.get("address") || null;
  const city = formData.get("city") || null;
  const country = formData.get("country") || null;
  const plan = formData.get("plan") || "essentials";
  const admin_email = formData.get("admin_email") || null;
  const division = formData.get("division") || null;
  const state = formData.get("state") || null;

  // Upload logo if provided
  let logo_url = null;
  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop();
    const path = `${slug}.${ext}`;
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await admin.storage
      .from("club-logos")
      .upload(path, buffer, {
        contentType: logoFile.type,
        upsert: true,
      });

    if (!uploadError) {
      const { data: { publicUrl } } = admin.storage
        .from("club-logos")
        .getPublicUrl(path);
      logo_url = publicUrl;
    }
  }

  const { error } = await admin.from("clubs").insert({
    name,
    slug,
    type,
    seat_limit,
    primary_color,
    secondary_color,
    pin,
    logo_url,
    custom_notes,
    address,
    city,
    state,
    country,
    plan,
    division,
    active: true,
    seats_used: 0,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If admin_email provided: create login + send welcome email
  if (admin_email) {
    const { data: newClub } = await admin.from("clubs").select("id").eq("slug", slug).single();

    // Check if user already exists in auth
    const { data: existingUsers } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existingUser = existingUsers?.users?.find(u => u.email === admin_email);

    let userId = existingUser?.id;
    let tempPassword = null;

    if (!existingUser) {
      // Create new auth user
      tempPassword = generateTempPassword();
      const { data: newUser, error: userError } = await admin.auth.admin.createUser({
        email: admin_email,
        password: tempPassword,
        email_confirm: true,
      });
      if (userError) {
        console.error("[clubs/create] createUser failed:", userError.message);
      } else {
        userId = newUser?.user?.id;
      }
    }

    if (userId) {
      // Link user to club as club_admin
      await admin.from("profiles").upsert({
        id: userId,
        role: "club_admin",
        club_id: newClub?.id,
      });

      // Send welcome email
      const joinLink = `${baseUrl}/join/${slug}`;
      const loginLink = `${baseUrl}/login`;
      const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

      await resend.emails.send({
        from: "Settlyou Team <hello@settlyou.com>",
        to: admin_email,
        subject: `Welcome to Settlyou — here's everything you need, ${name}`,
        html: buildWelcomeEmail({ clubName: name, planLabel, joinLink, loginLink, pin, email: admin_email, tempPassword }),
      });
    }
  }

  // Auto-generate base city data if city is set
  if (city) {
    const { data: newClubForBase } = await admin
      .from("clubs")
      .select("id, name, slug, type, city, country, address, division, custom_notes")
      .eq("slug", slug)
      .single();

    if (newClubForBase) {
      await admin.from("city_base_data").insert({
        club_id: newClubForBase.id,
        club_type: type,
        status: "generating",
        content: {},
        language: "en",
      });

      after(async () => {
        console.log(`[generate-base] auto-generating for new club ${name}...`);
        try {
          const content = await generateBaseData(newClubForBase);
          await admin
            .from("city_base_data")
            .update({
              content,
              status: "ready",
              generated_at: new Date().toISOString(),
            })
            .eq("club_id", newClubForBase.id)
            .eq("language", "en");
          console.log(`[generate-base] done for ${name}`);
        } catch (err) {
          console.error(`[generate-base] failed for ${name}:`, err.message);
          await admin
            .from("city_base_data")
            .update({ status: "failed" })
            .eq("club_id", newClubForBase.id)
            .eq("language", "en");
        }
      });
    }
  }

  return NextResponse.json({ ok: true });
}

