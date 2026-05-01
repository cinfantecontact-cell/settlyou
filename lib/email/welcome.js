const PROD_URL = "https://settlyou.com";

export function buildWelcomeEmail({ clubName, planLabel, joinLink, loginLink, pin, email, tempPassword }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to Settlyou</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Logo header -->
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <img src="${PROD_URL}/settlyou-logo-dark.png" alt="Settlyou" height="28" style="display:block;height:28px;">
          </td>
        </tr>

        <!-- Hero card -->
        <tr>
          <td style="background:#16a34a;border-radius:16px 16px 0 0;padding:40px 48px 36px;text-align:center;">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);">Your account is ready</p>
            <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.25;">${clubName}</h1>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">Here's everything you need to start sending guides to your incoming athletes.</p>
          </td>
        </tr>

        <!-- Credentials card -->
        <tr>
          <td style="background:#ffffff;padding:0 48px 8px;">

            <!-- Athlete join link -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f1f5f9;padding:28px 0;">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Athlete Join Link</p>
                  <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#16a34a;word-break:break-all;">${joinLink}</p>
                  <p style="margin:0;font-size:12px;color:#94a3b8;">Share this with your incoming athletes</p>
                </td>
              </tr>
            </table>

            <!-- PIN -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f1f5f9;padding:24px 0;">
              <tr>
                <td>
                  <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Athlete PIN</p>
                  <p style="margin:0 0 4px;font-size:36px;font-weight:800;color:#0f172a;letter-spacing:0.25em;font-family:monospace;">${pin}</p>
                  <p style="margin:0;font-size:12px;color:#94a3b8;">Athletes enter this code when submitting their intake form</p>
                </td>
              </tr>
            </table>

            <!-- Login -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f1f5f9;padding:24px 0;">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Your Dashboard Login</p>
                  <p style="margin:0 0 2px;font-size:14px;color:#0f172a;">${email}</p>
                  ${tempPassword
                    ? `<p style="margin:6px 0 2px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Temporary Password</p>
                       <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0f172a;font-family:monospace;letter-spacing:0.1em;">${tempPassword}</p>
                       <p style="margin:0;font-size:12px;color:#94a3b8;">Change this after your first login</p>`
                    : `<p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Use your existing Settlyou password</p>`
                  }
                </td>
              </tr>
            </table>

            <!-- Plan -->
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0 20px;">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Plan</p>
                  <span style="display:inline-block;background:#f0fdf4;color:#16a34a;font-size:13px;font-weight:700;padding:4px 12px;border-radius:99px;border:1px solid #bbf7d0;">${planLabel}</span>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- How it works -->
        <tr>
          <td style="background:#ffffff;padding:0 48px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:32px;">
              <tr><td>
                <p style="margin:0 0 20px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.05em;">How it works</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="32" valign="top" style="padding-bottom:16px;">
                      <div style="width:26px;height:26px;border-radius:50%;background:#16a34a;color:#fff;font-size:12px;font-weight:800;text-align:center;line-height:26px;">1</div>
                    </td>
                    <td style="padding-left:14px;padding-bottom:16px;font-size:14px;color:#475569;line-height:1.6;">Share the join link and PIN with your incoming athletes.</td>
                  </tr>
                  <tr>
                    <td width="32" valign="top" style="padding-bottom:16px;">
                      <div style="width:26px;height:26px;border-radius:50%;background:#16a34a;color:#fff;font-size:12px;font-weight:800;text-align:center;line-height:26px;">2</div>
                    </td>
                    <td style="padding-left:14px;padding-bottom:16px;font-size:14px;color:#475569;line-height:1.6;">Each athlete fills out a 3-minute relocation form.</td>
                  </tr>
                  <tr>
                    <td width="32" valign="top">
                      <div style="width:26px;height:26px;border-radius:50%;background:#16a34a;color:#fff;font-size:12px;font-weight:800;text-align:center;line-height:26px;">3</div>
                    </td>
                    <td style="padding-left:14px;font-size:14px;color:#475569;line-height:1.6;">Settlyou generates and delivers a personalized relocation guide — automatically.</td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:0 48px 48px;text-align:center;">
            <a href="${loginLink}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:10px;text-decoration:none;letter-spacing:0.01em;">
              Go to your dashboard
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:32px 0 0;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Questions? Reply to this email or reach us at <a href="mailto:hello@settlyou.com" style="color:#16a34a;text-decoration:none;">hello@settlyou.com</a></p>
            <p style="margin:0;font-size:12px;color:#cbd5e1;"><a href="https://settlyou.com" style="color:#cbd5e1;text-decoration:none;">settlyou.com</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}
