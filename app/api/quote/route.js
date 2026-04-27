import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { institution, name, email, role, volume, message } = await request.json();

  if (!institution || !name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await resend.emails.send({
    from: "Settlyou <hello@settlyou.com>",
    to: "hello@settlyou.com",
    replyTo: email,
    subject: `Quote request — ${institution}`,
    html: `
      <div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.08em;">New quote request</p>
        <h2 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#111;">${institution}</h2>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#888;width:140px;">Contact name</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#888;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;"><a href="mailto:${email}" style="color:#16a34a;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#888;">Role</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;">${role || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#888;">Guides / year</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;font-weight:600;">${volume || "—"}</td></tr>
          ${message ? `<tr><td style="padding:10px 0;font-size:12px;color:#888;vertical-align:top;">Message</td><td style="padding:10px 0;font-size:14px;color:#111;line-height:1.6;">${message}</td></tr>` : ""}
        </table>

        <a href="mailto:${email}" style="display:inline-block;background:#16a34a;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">Reply to ${name} →</a>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
