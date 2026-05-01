import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://settlyou.com";

function generateTempPassword() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `Settlyou${digits}!`;
}

export async function POST(request, { params }) {
  const { id: clubId } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const { data: club } = await admin.from("clubs").select("*").eq("id", clubId).single();
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  // Check if another club_admin already exists for this club
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("club_id", clubId)
    .eq("role", "club_admin")
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "This university already has an Athletic Director account." }, { status: 409 });

  // Find or create the user
  const { data: allUsers } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existingUser = allUsers?.users?.find(u => u.email === email);

  let userId = existingUser?.id;
  let tempPassword = null;

  if (!existingUser) {
    tempPassword = generateTempPassword();
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });
    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
    userId = newUser?.user?.id;
  }

  if (!userId) return NextResponse.json({ error: "Could not resolve user." }, { status: 500 });

  // Link user to club as club_admin
  await admin.from("profiles").upsert({
    id: userId,
    role: "club_admin",
    club_id: clubId,
  });

  // Send welcome email
  const joinLink = `${baseUrl}/join/${club.slug}`;
  const loginLink = `${baseUrl}/login`;
  const planLabel = (club.plan ?? "starter").charAt(0).toUpperCase() + (club.plan ?? "starter").slice(1);

  await resend.emails.send({
    from: "Settlyou Team <hello@settlyou.com>",
    to: email,
    subject: `Welcome to Settlyou — here's everything you need, ${club.name}`,
    html: buildWelcomeEmail({ clubName: club.name, planLabel, joinLink, loginLink, pin: club.pin, email, tempPassword }),
  });

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
            <img src="${baseUrl}/settlyou-logo-dark.png" alt="Settlyou" height="32" style="display:block;margin:0 auto;">
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
                    <p style="margin:4px 0 0;font-size:12px;color:#71717a;">Share this link with incoming students</p>
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
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Password</p>
                    ${tempPassword
                      ? `<p style="margin:0;font-size:18px;font-weight:700;color:#09090b;font-family:monospace;letter-spacing:0.1em;">${tempPassword}</p>
                         <p style="margin:4px 0 0;font-size:12px;color:#71717a;">You can change this after logging in</p>`
                      : `<p style="margin:0;font-size:14px;color:#52525b;">Use your existing Settlyou password to log in.</p>`
                    }
                  </td></tr>
                </table>
              </td></tr>
            </table>

            <a href="${loginLink}" style="display:inline-block;background:#16a34a;color:#fff;font-size:16px;font-weight:600;padding:16px 36px;border-radius:8px;text-decoration:none;">
              Go to your dashboard
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:13px;color:#aaa;">Questions? <a href="mailto:hello@settlyou.com" style="color:#aaa;">hello@settlyou.com</a> · <a href="https://settlyou.com" style="color:#aaa;text-decoration:none;">settlyou.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
