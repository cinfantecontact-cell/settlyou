import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { generateLinkedInPost } from "@/lib/linkedin/generate";
import { publishScheduledPosts } from "@/lib/linkedin/client";

const DIGEST_TO = "hello@settlyou.com";

export async function GET(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const yesterday = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const thirtyMinsAgo = new Date(now - 30 * 60 * 1000).toISOString();
  const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString();

  // Gather stats for last 24 hours
  const [
    { data: newSubmissions },
    { data: generated },
    { data: delivered },
    { data: allClubs },
    { data: recentEvents },
    { data: stuckGenerating },
    { data: failedSubmissions },
  ] = await Promise.all([
    admin.from("requests").select("id, athlete_name, clubs(name)").eq("status", "submitted").gte("created_at", yesterday),
    admin.from("requests").select("id").in("status", ["under_review", "approved", "generating"]).gte("updated_at", yesterday),
    admin.from("requests").select("id, athlete_name, clubs(name)").eq("status", "delivered").gte("updated_at", yesterday),
    admin.from("clubs").select("name, seats_used, seat_limit, plan, active"),
    admin.from("events").select("event_type").gte("created_at", yesterday),
    // Stuck in "generating" for more than 30 minutes = crashed
    admin.from("requests").select("id, athlete_name, clubs(name), updated_at").eq("status", "generating").lte("updated_at", thirtyMinsAgo),
    // Still "submitted" for more than 1 hour = generation likely failed silently
    admin.from("requests").select("id, athlete_name, clubs(name), created_at").eq("status", "submitted").lte("created_at", oneHourAgo),
  ]);

  // Clubs near limit (>= 80% used)
  const nearLimit = (allClubs || []).filter(c => c.seat_limit && (c.seats_used / c.seat_limit) >= 0.8);
  const totalClubs = (allClubs || []).filter(c => c.active).length;
  const totalRequests = await admin.from("requests").select("id", { count: "exact", head: true });

  const eventCounts = (recentEvents || []).reduce((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1;
    return acc;
  }, {});

  // Build data summary for Claude
  const dataSummary = {
    period: "last 24 hours",
    new_submissions: newSubmissions?.length || 0,
    guides_in_progress: generated?.length || 0,
    guides_delivered: delivered?.length || 0,
    total_active_clubs: totalClubs,
    total_guides_all_time: totalRequests.count || 0,
    clubs_near_limit: nearLimit.map(c => ({ name: c.name, used: c.seats_used, limit: c.seat_limit })),
    form_visits: eventCounts["join_link_visited"] || 0,
    pin_attempts: eventCounts["pin_attempt_success"] || 0,
    guide_opens: eventCounts["guide_opened"] || 0,
  };

  // Ask Claude for a brief insight
  let aiInsight = "";
  try {
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: `You are the business intelligence assistant for Settlyou, a SaaS that creates AI relocation guides for college athletes. Here is today's activity data:\n\n${JSON.stringify(dataSummary, null, 2)}\n\nWrite a 2-3 sentence plain-English business summary. Highlight anything unusual, flag risks (clubs near limit, zero activity), and suggest one action if relevant. Be direct and specific. No greetings, no sign-off.`,
      }],
    });
    aiInsight = msg.content[0].text;
  } catch (e) {
    aiInsight = "AI summary unavailable.";
  }

  const hasIssues = (stuckGenerating?.length || 0) + (failedSubmissions?.length || 0) > 0;

  const stuckRows = stuckGenerating?.length
    ? stuckGenerating.map(r => `<tr><td style="padding:8px 12px;font-size:13px;color:#111;">${r.athlete_name || "—"}</td><td style="padding:8px 12px;font-size:13px;color:#555;">${r.clubs?.name || "—"}</td><td style="padding:8px 12px;font-size:12px;color:#dc2626;">Stuck generating</td></tr>`).join("")
    : null;

  const failedRows = failedSubmissions?.length
    ? failedSubmissions.map(r => `<tr><td style="padding:8px 12px;font-size:13px;color:#111;">${r.athlete_name || "—"}</td><td style="padding:8px 12px;font-size:13px;color:#555;">${r.clubs?.name || "—"}</td><td style="padding:8px 12px;font-size:12px;color:#f59e0b;">Submitted 1h+ ago</td></tr>`).join("")
    : null;

  const nearLimitRows = nearLimit.length
    ? nearLimit.map(c => `<tr><td style="padding:8px 12px;font-size:13px;color:#111;">${c.name}</td><td style="padding:8px 12px;font-size:13px;color:#dc2626;font-weight:600;">${c.used}/${c.limit}</td></tr>`).join("")
    : `<tr><td colspan="2" style="padding:8px 12px;font-size:13px;color:#aaa;">No clubs near limit</td></tr>`;

  await resend.emails.send({
    from: "Settlyou Monitor <hello@settlyou.com>",
    to: DIGEST_TO,
    subject: `Settlyou Daily Digest — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#ffffff;padding:28px 40px;text-align:center;border-bottom:1px solid #f0f0f0;">
            <img src="https://settlyou.com/settlyou-logo-dark.png" alt="Settlyou" height="28" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em;">Daily Digest</p>
            <p style="margin:0 0 24px;font-size:20px;font-weight:700;color:#111;">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>

            <!-- AI Summary -->
            <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">AI Summary</p>
              <p style="margin:0;font-size:14px;color:#111;line-height:1.6;">${aiInsight}</p>
            </div>

            <!-- Stats grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td width="50%" style="padding-right:8px;">
                  <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">New Submissions</p>
                    <p style="margin:0;font-size:28px;font-weight:700;color:#111;">${dataSummary.new_submissions}</p>
                  </div>
                </td>
                <td width="50%" style="padding-left:8px;">
                  <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Guides Delivered</p>
                    <p style="margin:0;font-size:28px;font-weight:700;color:#16a34a;">${dataSummary.guides_delivered}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding-right:8px;padding-top:12px;">
                  <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Active Clubs</p>
                    <p style="margin:0;font-size:28px;font-weight:700;color:#111;">${dataSummary.total_active_clubs}</p>
                  </div>
                </td>
                <td width="50%" style="padding-left:8px;padding-top:12px;">
                  <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Total Guides</p>
                    <p style="margin:0;font-size:28px;font-weight:700;color:#111;">${dataSummary.total_guides_all_time}</p>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Guide opens -->
            <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#111;">Athlete Activity (last 24h)</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px;color:#555;padding:4px 0;">Join link visits</td>
                  <td style="font-size:13px;font-weight:600;color:#111;text-align:right;">${dataSummary.form_visits}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#555;padding:4px 0;">PIN verifications</td>
                  <td style="font-size:13px;font-weight:600;color:#111;text-align:right;">${dataSummary.pin_attempts}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#555;padding:4px 0;">Guide opens</td>
                  <td style="font-size:13px;font-weight:600;color:#111;text-align:right;">${dataSummary.guide_opens}</td>
                </tr>
              </table>
            </div>

            ${hasIssues ? `
            <!-- Stuck / failed guides alert -->
            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#dc2626;">⚠️ Guides needing attention</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr style="background:#fee2e2;">
                  <th style="padding:6px 12px;font-size:11px;color:#991b1b;text-align:left;text-transform:uppercase;">Student</th>
                  <th style="padding:6px 12px;font-size:11px;color:#991b1b;text-align:left;text-transform:uppercase;">Institution</th>
                  <th style="padding:6px 12px;font-size:11px;color:#991b1b;text-align:left;text-transform:uppercase;">Issue</th>
                </tr>
                ${[stuckRows, failedRows].filter(Boolean).join("")}
              </table>
              <p style="margin:10px 0 0;font-size:12px;color:#991b1b;">Open the admin panel to manually regenerate these guides.</p>
            </div>
            ` : ""}

            <!-- Clubs near limit -->
            <div style="margin-bottom:28px;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#111;">Institutions Near Guide Limit</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
                <tr style="background:#f0f0f0;">
                  <th style="padding:8px 12px;font-size:11px;color:#a1a1aa;text-align:left;text-transform:uppercase;letter-spacing:0.05em;">Institution</th>
                  <th style="padding:8px 12px;font-size:11px;color:#a1a1aa;text-align:left;text-transform:uppercase;letter-spacing:0.05em;">Used / Limit</th>
                </tr>
                ${nearLimitRows}
              </table>
            </div>

            <a href="https://settlyou.com/admin" style="display:inline-block;background:#16a34a;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
              Open Admin Dashboard →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">Settlyou Daily Digest · Sent every morning at 8am</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });

  // LinkedIn: generate tomorrow's draft + publish any scheduled posts
  let linkedinResult = {};
  try {
    const newPost = await generateLinkedInPost();
    linkedinResult.generated = newPost?.id ?? null;
  } catch (e) {
    console.error("[cron/digest] LinkedIn generate error:", e.message);
    linkedinResult.generateError = e.message;
  }
  try {
    const published = await publishScheduledPosts();
    linkedinResult.published = published.length;
  } catch (e) {
    console.error("[cron/digest] LinkedIn publish error:", e.message);
    linkedinResult.publishError = e.message;
  }

  return NextResponse.json({ ok: true, digest_sent: true, stats: dataSummary, linkedin: linkedinResult });
}
