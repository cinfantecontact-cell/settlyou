const BIRD_API_KEY = process.env.BIRD_API_KEY;
const BIRD_WORKSPACE_ID = "2d4a6485-280e-4a4e-b9b9-7558e7e2ede3";
const BIRD_CHANNEL_ID = "d33fa55e-07f4-48a3-bf66-2ba3f3453f4d";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://settlyou.com";

/**
 * Send the upload link to an athlete via WhatsApp using Bird.
 * Silently does nothing if BIRD_API_KEY is not configured.
 */
export async function sendAthleteUploadLink({ athleteName, athletePhone, uploadToken, institutionName, sport }) {
  if (!BIRD_API_KEY) {
    console.warn("[whatsapp] BIRD_API_KEY not set — skipping WhatsApp message");
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
  const institutionLine = sport ? `${sport} at ${institutionName}` : institutionName;

  const res = await fetch(
    `https://api.bird.com/workspaces/${BIRD_WORKSPACE_ID}/channels/whatsapp:1/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `AccessKey ${BIRD_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiver: {
          contacts: [{ identifierValue: phone }],
        },
        template: {
          projectName: "settlyou_upload_link",
          version: "latest",
          locale: "en",
          variables: {
            first_name: firstName,
            institution_name: institutionLine,
            upload_url: uploadUrl,
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bird WhatsApp error ${res.status}: ${text}`);
  }
}
