import { Resend } from "resend";

export async function sendAthleteReportReady({ athleteName, athleteEmail, clubName, reportToken }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/report/${reportToken}`;
  const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/upload/${reportToken}`;

  await resend.emails.send({
    from: "Settlyou <noreply@settlyou.com>",
    to: athleteEmail,
    subject: `Your relocation guide is ready, ${athleteName.split(" ")[0]}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#ffffff;padding:32px 40px;text-align:center;border-bottom:1px solid #f0f0f0;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/settlyou-logo.png" alt="Settlyou" height="32" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;">Hi ${athleteName.split(" ")[0]},</p>
            <p style="margin:0 0 24px;font-size:16px;color:#555;line-height:1.6;">
              Your personalized relocation guide for <strong>${clubName}</strong> is ready. We've curated everything you need to settle in quickly — housing, training, nutrition, schools, and more.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${reportUrl}" style="display:inline-block;background:#16a34a;color:#fff;font-size:16px;font-weight:600;padding:16px 36px;border-radius:8px;text-decoration:none;">
                View My Relocation Guide
              </a>
            </div>

            <!-- Upload section -->
            <div style="background:#f9fafb;border:1px solid #e4e7ec;border-radius:10px;padding:28px 32px;margin:8px 0 0;">
              <p style="margin:0 0 6px;font-size:17px;font-weight:700;color:#111;">Upload your documents</p>
              <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.6;">
                To complete your onboarding, please upload the following documents as soon as possible:
              </p>
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
                <tr><td style="padding:6px 0;font-size:14px;color:#444;">&#10003;&nbsp; Passport</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#444;">&#10003;&nbsp; Medical form</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#444;">&#10003;&nbsp; Academic transcript</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#444;">&#10003;&nbsp; English test results (TOEFL / IELTS)</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#444;">&#10003;&nbsp; Eligibility documents</td></tr>
              </table>
              <div style="text-align:center;">
                <a href="${uploadUrl}" style="display:inline-block;background:#111;color:#fff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
                  Upload My Documents
                </a>
              </div>
            </div>

            <p style="margin:28px 0 0;font-size:14px;color:#888;line-height:1.6;">
              Both links above are private — keep them safe. If you have any questions, reach out to your coach directly.
            </p>
          </td>
        </tr>
        <!-- Footer -->
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
}

export async function sendClubGuideDelivered({ athleteName, athleteEmail, clubAdminEmail, clubName, reportToken }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/report/${reportToken}`;

  await resend.emails.send({
    from: "Settlyou <hello@settlyou.com>",
    to: clubAdminEmail,
    subject: `Guide delivered — ${athleteName}`,
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
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;">Guide delivered</p>
            <p style="margin:0 0 24px;font-size:16px;color:#555;line-height:1.6;">
              The relocation guide for <strong>${athleteName}</strong> has been delivered${athleteEmail ? ` to <strong>${athleteEmail}</strong>` : ""}. You can also access it directly using the link below.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${reportUrl}" style="display:inline-block;background:#16a34a;color:#fff;font-size:16px;font-weight:600;padding:16px 36px;border-radius:8px;text-decoration:none;">
                View Guide
              </a>
            </div>
            <p style="margin:24px 0 0;font-size:14px;color:#888;line-height:1.6;">
              You can also share this link directly with the athlete: <a href="${reportUrl}" style="color:#16a34a;">${reportUrl}</a>
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
}

export async function sendGenerationFailureAlert({ athleteName, clubName, requestId, errorMessage }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/relocations/${requestId}`;
  await resend.emails.send({
    from: "Settlyou Alerts <hello@settlyou.com>",
    to: "cinfante.contact@gmail.com",
    subject: `⚠️ Guide generation failed — ${athleteName} (${clubName})`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#dc2626;padding:20px 40px;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.05em;">Action Required</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#fff;">Guide generation failed</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:12px;color:#888;display:block;margin-bottom:2px;">STUDENT</span>
                  <span style="font-size:15px;color:#111;font-weight:600;">${athleteName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:12px;color:#888;display:block;margin-bottom:2px;">INSTITUTION</span>
                  <span style="font-size:15px;color:#111;font-weight:600;">${clubName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;">
                  <span style="font-size:12px;color:#888;display:block;margin-bottom:2px;">ERROR</span>
                  <span style="font-size:13px;color:#dc2626;font-family:monospace;">${errorMessage || "Unknown error"}</span>
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;font-size:13px;color:#555;">The request has been reset to <strong>submitted</strong>. You can manually trigger regeneration from the admin panel.</p>
            <div style="text-align:center;margin:24px 0 0;">
              <a href="${adminUrl}" style="display:inline-block;background:#dc2626;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
                View in Admin →
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">Settlyou Alerts · settlyou.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendClubWeeklyRecap({ clubName, adminEmail, dashboardUrl, stats }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { delivered, opened, pending, total } = stats;
  const weekOf = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  await resend.emails.send({
    from: "Settlyou <hello@settlyou.com>",
    to: adminEmail,
    subject: `Your weekly guide summary — ${clubName}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#ffffff;padding:28px 40px;text-align:center;border-bottom:1px solid #f0f0f0;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/settlyou-logo.png" alt="Settlyou" height="28" style="display:block;margin:0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em;">Weekly Summary</p>
            <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111;">${clubName}</p>
            <p style="margin:0 0 32px;font-size:14px;color:#888;">Week of ${weekOf}</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="50%" style="padding-right:8px;">
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.06em;">Guides delivered</p>
                    <p style="margin:0;font-size:36px;font-weight:700;color:#15803d;">${delivered}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#86efac;">this week</p>
                  </div>
                </td>
                <td width="50%" style="padding-left:8px;">
                  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#2563eb;text-transform:uppercase;letter-spacing:0.06em;">Guides opened</p>
                    <p style="margin:0;font-size:36px;font-weight:700;color:#1d4ed8;">${opened}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#93c5fd;">by students this week</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding-right:8px;padding-top:12px;">
                  <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:10px;padding:20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Pending guides</p>
                    <p style="margin:0;font-size:36px;font-weight:700;color:#111;">${pending}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#a1a1aa;">in progress</p>
                  </div>
                </td>
                <td width="50%" style="padding-left:8px;padding-top:12px;">
                  <div style="background:#f9fafb;border:1px solid #e4e4e7;border-radius:10px;padding:20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.06em;">Total students</p>
                    <p style="margin:0;font-size:36px;font-weight:700;color:#111;">${total}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#a1a1aa;">all time</p>
                  </div>
                </td>
              </tr>
            </table>

            <div style="text-align:center;">
              <a href="${dashboardUrl}" style="display:inline-block;background:#16a34a;color:#fff;font-size:14px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
                View Dashboard →
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">Settlyou · Sent every Monday · <a href="https://settlyou.com" style="color:#aaa;text-decoration:none;">settlyou.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendCoachInvite({ coachEmail, clubName, sport, inviteUrl }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Settlyou <hello@settlyou.com>",
    to: coachEmail,
    subject: `You've been invited to join ${clubName} on Settlyou`,
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
              <strong>${clubName}</strong> has invited you to join Settlyou as a coach for <strong>${sport}</strong>. Create your account to access your athletes' profiles and track their document submissions.
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
}

export async function sendDocumentReminder({ athleteName, athleteEmail, clubName, uploadToken, missingDocs, reminderCount }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/upload/${uploadToken}`;
  const firstName = athleteName.split(" ")[0];
  const docListHtml = missingDocs.map(d =>
    `<tr><td style="padding:6px 0;font-size:14px;color:#444;">&#9679;&nbsp; ${d}</td></tr>`
  ).join("");

  await resend.emails.send({
    from: "Settlyou <noreply@settlyou.com>",
    to: athleteEmail,
    subject: reminderCount === 1
      ? `Action needed — upload your documents, ${firstName}`
      : `Reminder: documents still missing, ${firstName}`,
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
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111;">Hi ${firstName},</p>
            <p style="margin:0 0 24px;font-size:16px;color:#555;line-height:1.6;">
              Your onboarding with <strong>${clubName}</strong> is almost complete — we're still waiting on a few documents from you.
            </p>

            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:24px 28px;margin-bottom:28px;">
              <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.05em;">Still missing</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                ${docListHtml}
              </table>
            </div>

            <div style="text-align:center;margin:0 0 28px;">
              <a href="${uploadUrl}" style="display:inline-block;background:#16a34a;color:#fff;font-size:16px;font-weight:600;padding:16px 36px;border-radius:8px;text-decoration:none;">
                Upload My Documents
              </a>
            </div>

            <p style="margin:0;font-size:14px;color:#888;line-height:1.6;">
              This link is private — only you can access it. If you have any questions, reach out to your coach directly.
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
}

export async function sendAdminNewSubmission({ athleteName, clubName, destinationCity, destinationCountry }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Settlyou <hello@settlyou.com>",
    to: "cinfante.contact@gmail.com",
    subject: `New submission — ${athleteName} (${clubName})`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#ffffff;padding:24px 40px;border-bottom:1px solid #f0f0f0;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/settlyou-logo.png" alt="Settlyou" height="28" style="display:block;">
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#111;">New athlete submission</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:13px;color:#888;display:block;margin-bottom:2px;">ATHLETE</span>
                  <span style="font-size:15px;color:#111;font-weight:600;">${athleteName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:13px;color:#888;display:block;margin-bottom:2px;">CLUB / UNIVERSITY</span>
                  <span style="font-size:15px;color:#111;font-weight:600;">${clubName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;">
                  <span style="font-size:13px;color:#888;display:block;margin-bottom:2px;">DESTINATION</span>
                  <span style="font-size:15px;color:#111;font-weight:600;">${destinationCity}${destinationCountry ? `, ${destinationCountry}` : ""}</span>
                </td>
              </tr>
            </table>
            <div style="text-align:center;margin:28px 0 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/relocations" style="display:inline-block;background:#111;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
                View in Admin
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:13px;color:#aaa;">Settlyou · settlyou.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
