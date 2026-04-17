import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAthleteReportReady({ athleteName, athleteEmail, clubName, reportToken }) {
  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/report/${reportToken}`;

  await resend.emails.send({
    from: "Settlyou <hello@settlyou.com>",
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
            <p style="margin:24px 0 0;font-size:14px;color:#888;line-height:1.6;">
              This is your private link — keep it safe. If you have questions, reply to this email.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:13px;color:#aaa;">
              Settl · <a href="https://settlyou.com" style="color:#aaa;text-decoration:none;">settlyou.com</a>
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
              Settl · <a href="https://settlyou.com" style="color:#aaa;text-decoration:none;">settlyou.com</a>
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
            <p style="margin:0;font-size:13px;color:#aaa;">Settl · settlyou.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
