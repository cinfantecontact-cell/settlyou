import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

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
    primary_color: plan === "premium" ? primary_color : null,
    secondary_color: plan === "premium" ? secondary_color : null,
    pin,
    logo_url: plan === "premium" ? logo_url : null,
    custom_notes: plan === "premium" ? custom_notes : null,
    address,
    city,
    country,
    plan,
    active: true,
    seats_used: 0,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If admin_email provided: create login + send welcome email
  if (admin_email) {
    const tempPassword = generateTempPassword();

    // Create Supabase auth user
    const { data: newUser, error: userError } = await admin.auth.admin.createUser({
      email: admin_email,
      password: tempPassword,
      email_confirm: true,
    });

    if (!userError && newUser?.user) {
      // Get the newly created club id
      const { data: newClub } = await admin.from("clubs").select("id").eq("slug", slug).single();

      // Set profile role + club link
      await admin.from("profiles").upsert({
        id: newUser.user.id,
        role: "club_admin",
        club_id: newClub?.id,
      });

      // Send welcome email with password
      const joinLink = `${baseUrl}/join/${slug}`;
      const loginLink = `${baseUrl}/login`;
      const planLabel = plan === "premium" ? "Premium" : "Essentials";

      await resend.emails.send({
        from: "Settlyou Team <hello@settlyou.com>",
        to: admin_email,
        subject: `Welcome to Settlyou — here's everything you need, ${name}`,
        html: buildWelcomeEmail({ clubName: name, planLabel, joinLink, loginLink, pin, email: admin_email, tempPassword }),
      });
    }
  }

  return NextResponse.json({ ok: true });
}

function buildWelcomeEmail({ clubName, planLabel, joinLink, loginLink, pin, email, tempPassword }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#ffffff;padding:32px 40px;text-align:center;border-bottom:1px solid #f0f0f0;">
            <img src="${baseUrl}/settlyou-logo.png" alt="Settlyou" height="32" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em;">Welcome to Settlyou</p>
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;">${clubName} is ready to go</p>
            <p style="margin:0 0 32px;font-size:16px;color:#555;line-height:1.6;">Your Settlyou account has been set up. Here is everything you need to get started.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;margin-bottom:32px;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td style="padding-bottom:16px;border-bottom:1px solid #e4e4e7;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Plan</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#09090b;">${planLabel}</p>
                  </td></tr>
                  <tr><td style="padding-top:16px;padding-bottom:16px;border-bottom:1px solid #e4e4e7;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Athlete Join Link</p>
                    <p style="margin:0;font-size:14px;color:#16a34a;word-break:break-all;">${joinLink}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#71717a;">Share this link with incoming athletes</p>
                  </td></tr>
                  <tr><td style="padding-top:16px;padding-bottom:16px;border-bottom:1px solid #e4e4e7;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Athlete PIN</p>
                    <p style="margin:0;font-size:22px;font-weight:700;color:#09090b;letter-spacing:0.15em;">${pin}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#71717a;">Athletes enter this code to access the form</p>
                  </td></tr>
                  <tr><td style="padding-top:16px;padding-bottom:16px;border-bottom:1px solid #e4e4e7;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Your Login</p>
                    <p style="margin:0;font-size:14px;color:#09090b;">${loginLink}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#71717a;">Email: ${email}</p>
                  </td></tr>
                  <tr><td style="padding-top:16px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Temporary Password</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#09090b;font-family:monospace;letter-spacing:0.1em;">${tempPassword}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#71717a;">You can change this after logging in</p>
                  </td></tr>
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#09090b;">How it works</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="32" valign="top" style="padding-bottom:12px;"><div style="width:24px;height:24px;border-radius:50%;background:#16a34a;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">1</div></td>
                <td style="padding-bottom:12px;padding-left:12px;font-size:14px;color:#52525b;line-height:1.5;">Share the join link and PIN with your incoming athletes.</td>
              </tr>
              <tr>
                <td width="32" valign="top" style="padding-bottom:12px;"><div style="width:24px;height:24px;border-radius:50%;background:#16a34a;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">2</div></td>
                <td style="padding-bottom:12px;padding-left:12px;font-size:14px;color:#52525b;line-height:1.5;">Each athlete fills out a short relocation form — takes about 3 minutes.</td>
              </tr>
              <tr>
                <td width="32" valign="top"><div style="width:24px;height:24px;border-radius:50%;background:#16a34a;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">3</div></td>
                <td style="padding-left:12px;font-size:14px;color:#52525b;line-height:1.5;">Settlyou reviews and delivers the guide directly to your athlete's inbox.</td>
              </tr>
            </table>

            <a href="${loginLink}" style="display:inline-block;background:#16a34a;color:#fff;font-size:16px;font-weight:600;padding:16px 36px;border-radius:8px;text-decoration:none;">
              Go to your dashboard →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#aaa;">Questions? Reply to this email or reach us at <a href="mailto:hello@settlyou.com" style="color:#aaa;">hello@settlyou.com</a></p>
            <p style="margin:0;font-size:13px;color:#aaa;">Settlyou · <a href="https://settlyou.com" style="color:#aaa;text-decoration:none;">settlyou.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
