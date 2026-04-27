const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://settlyou.com";

/**
 * Send the upload link to an athlete via WhatsApp.
 * Silently does nothing if Twilio env vars are not configured.
 */
export async function sendAthleteUploadLink({ athleteName, athletePhone, uploadToken, institutionName, sport }) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.warn("[whatsapp] Twilio env vars not set — skipping WhatsApp message");
    return;
  }
  if (!athletePhone || !uploadToken) return;

  // Normalize phone: strip spaces, ensure it starts with +
  const phone = athletePhone.replace(/\s+/g, "");
  if (!phone.startsWith("+")) {
    console.warn("[whatsapp] Invalid phone number format:", phone);
    return;
  }

  const uploadUrl = `${APP_URL}/upload/${uploadToken}`;
  const firstName = (athleteName || "").split(" ")[0] || "there";
  const sportLine = sport ? ` for ${sport}` : "";

  const body = [
    `Hi ${firstName},`,
    ``,
    `Your personalized relocation guide${sportLine} at ${institutionName} is ready — check your email to view it.`,
    ``,
    `Here is your personal document upload link:`,
    uploadUrl,
    ``,
    `Save this link in your notes — you can use it anytime to upload your documents.`,
    ``,
    `The Settlyou Team`,
  ].join("\n");

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        From: TWILIO_WHATSAPP_FROM,
        To: `whatsapp:${phone}`,
        Body: body,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio error ${res.status}: ${text}`);
  }
}
