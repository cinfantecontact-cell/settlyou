import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://settlyou.com";

export async function POST(request, { params }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const { data: club, error: clubError } = await admin.from("clubs").select("*").eq("id", id).single();
  if (clubError || !club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  const joinLink = `${baseUrl}/join/${club.slug}`;
  const loginLink = `${baseUrl}/login`;
  const planLabel = club.plan === "premium" ? "Premium" : "Essentials";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Settlyou</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="${baseUrl}/settlyou-logo-dark.png" alt="Settl" height="32" style="display:block;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;padding:40px 40px 32px;">

              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em;">Welcome to Settlyou</p>
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#09090b;line-height:1.2;">
                ${club.name} is ready to go
              </h1>
              <p style="margin:0 0 32px;font-size:15px;color:#52525b;line-height:1.6;">
                Your Settlyou account has been set up. Here is everything you need to get started.
              </p>

              <!-- Credentials block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:16px;border-bottom:1px solid #e4e4e7;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Plan</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#09090b;">${planLabel}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:16px;padding-bottom:16px;border-bottom:1px solid #e4e4e7;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Athlete Join Link</p>
                          <p style="margin:0;font-size:14px;color:#16a34a;word-break:break-all;">${joinLink}</p>
                          <p style="margin:4px 0 0;font-size:12px;color:#71717a;">Share this link with incoming athletes</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:16px;padding-bottom:16px;border-bottom:1px solid #e4e4e7;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Athlete PIN</p>
                          <p style="margin:0;font-size:22px;font-weight:700;color:#09090b;letter-spacing:0.15em;">${club.pin}</p>
                          <p style="margin:4px 0 0;font-size:12px;color:#71717a;">Athletes enter this code to access the form</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:16px;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Your Admin Login</p>
                          <p style="margin:0;font-size:14px;color:#09090b;">${loginLink}</p>
                          <p style="margin:4px 0 0;font-size:12px;color:#71717a;">Log in with this email address: ${email}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#09090b;">How it works</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  ["1", "Share the join link and PIN with your incoming athletes."],
                  ["2", "Each athlete fills out a short relocation form — takes about 3 minutes."],
                  ["3", "Settlyou reviews and delivers the guide directly to your athlete's inbox."],
                ].map(([num, text]) => `
                <tr>
                  <td width="32" valign="top" style="padding-bottom:12px;">
                    <div style="width:24px;height:24px;border-radius:50%;background:#16a34a;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">${num}</div>
                  </td>
                  <td style="padding-bottom:12px;padding-left:12px;font-size:14px;color:#52525b;line-height:1.5;">${text}</td>
                </tr>`).join("")}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="${loginLink}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;">
                      Go to your dashboard →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                Questions? Reply to this email or reach us at
                <a href="mailto:hello@settlyou.com" style="color:#a1a1aa;">hello@settlyou.com</a>
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;">© ${new Date().getFullYear()} Settlyou. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const { error: sendError } = await resend.emails.send({
    from: "Settlyou Team <hello@settlyou.com>",
    to: email,
    subject: `Welcome to Settlyou — here's everything you need, ${club.name}`,
    html,
  });

  if (sendError) return NextResponse.json({ error: sendError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
