import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

export async function POST(request, { params }) {
  const { id: clubId } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const { data: club } = await admin.from("clubs").select("name").eq("id", clubId).single();
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  // Check for duplicate pending invite
  const { data: existing } = await admin
    .from("staff_invites")
    .select("id")
    .eq("club_id", clubId)
    .eq("email", email)
    .eq("accepted", false)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "An invite has already been sent to this email." }, { status: 409 });

  // Check if already accepted
  const { data: accepted } = await admin
    .from("staff_invites")
    .select("id")
    .eq("club_id", clubId)
    .eq("email", email)
    .eq("accepted", true)
    .maybeSingle();
  if (accepted) return NextResponse.json({ error: "An admissions user with this email already has an account." }, { status: 409 });

  const { data: invite, error } = await admin
    .from("staff_invites")
    .insert({ club_id: clubId, email })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join/admissions/${invite.token}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Settlyou <hello@settlyou.com>",
    to: email,
    subject: `You've been invited to join ${club.name} on Settlyou`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#ffffff;padding:32px 40px;text-align:center;border-bottom:1px solid #f0f0f0;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/settlyou-logo.png" alt="Settlyou" height="32" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;">You've been invited</p>
            <p style="margin:0 0 24px;font-size:16px;color:#555;line-height:1.6;">
              <strong>${club.name}</strong> has invited you to join Settlyou as an admissions staff member. Create your account to manage document requirements and track athlete submissions.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${inviteUrl}" style="display:inline-block;background:#16a34a;color:#fff;font-size:16px;font-weight:600;padding:16px 36px;border-radius:8px;text-decoration:none;">
                Set Up My Account
              </a>
            </div>
            <p style="margin:24px 0 0;font-size:14px;color:#888;line-height:1.6;">
              This invite link expires after use. If you didn't expect this email, you can safely ignore it.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:13px;color:#aaa;">
              Settlyou · <a href="https://settlyou.com" style="color:#aaa;text-decoration:none;">settlyou.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });

  return NextResponse.json({ ok: true });
}
