import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const ALERT_TO = "hello@settlyou.com";
const STUCK_GENERATING_MINUTES = 15;
const STUCK_SUBMITTED_HOURS = 1;

export async function GET(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  // Verify cron secret
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const issues = [];

  // 1. Find requests stuck in "generating" for > 15 min
  const stuckGeneratingCutoff = new Date(now - STUCK_GENERATING_MINUTES * 60 * 1000).toISOString();
  const { data: stuckGenerating } = await admin
    .from("requests")
    .select("id, athlete_name, destination_city, clubs(name), updated_at")
    .eq("status", "generating")
    .lt("updated_at", stuckGeneratingCutoff);

  if (stuckGenerating?.length) {
    // Auto-reset to submitted so they retry
    const ids = stuckGenerating.map(r => r.id);
    await admin.from("requests").update({ status: "submitted" }).in("id", ids);

    for (const r of stuckGenerating) {
      issues.push(`Guide generation stuck and auto-reset: ${r.athlete_name} (${r.clubs?.name}) — was generating for >${STUCK_GENERATING_MINUTES}min`);
    }
  }

  // 2. Find requests stuck in "submitted" for > 1 hour (auto-generate silently failed)
  const stuckSubmittedCutoff = new Date(now - STUCK_SUBMITTED_HOURS * 60 * 60 * 1000).toISOString();
  const { data: stuckSubmitted } = await admin
    .from("requests")
    .select("id, athlete_name, destination_city, clubs(name), created_at")
    .eq("status", "submitted")
    .lt("created_at", stuckSubmittedCutoff);

  if (stuckSubmitted?.length) {
    for (const r of stuckSubmitted) {
      const ageHours = Math.round((now - new Date(r.created_at)) / 3600000);
      issues.push(`Guide stuck in "submitted" for ${ageHours}h: ${r.athlete_name} (${r.clubs?.name}) — auto-generate may have failed`);
    }
  }

  // 3. Send immediate alert if there are issues
  if (issues.length > 0) {
    const issueList = issues.map(i => `<li style="margin-bottom:8px;">${i}</li>`).join("");
    await resend.emails.send({
      from: "Settlyou Monitor <hello@settlyou.com>",
      to: ALERT_TO,
      subject: `⚠️ Settlyou Alert — ${issues.length} issue${issues.length > 1 ? "s" : ""} detected`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#dc2626;padding:24px 40px;">
            <p style="margin:0;font-size:16px;font-weight:700;color:#fff;">⚠️ Settlyou Health Alert</p>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">${new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })} (Santiago time)</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 16px;font-size:15px;color:#111;font-weight:600;">${issues.length} issue${issues.length > 1 ? "s" : ""} detected and auto-fixed where possible:</p>
            <ul style="margin:0;padding-left:20px;font-size:14px;color:#555;line-height:1.6;">
              ${issueList}
            </ul>
            <div style="margin-top:24px;">
              <a href="https://settlyou.com/admin/relocations" style="display:inline-block;background:#111;color:#fff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">
                View Relocations →
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">Settlyou Health Monitor · Runs every 30 minutes</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
  }

  return NextResponse.json({
    ok: true,
    checked_at: now.toISOString(),
    issues_found: issues.length,
    issues,
  });
}
