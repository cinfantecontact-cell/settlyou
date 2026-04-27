import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAthleteReportReady } from "@/lib/email/send";
import { sendAthleteUploadLink } from "@/lib/whatsapp/send";

export async function POST(request, { params }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: req } = await admin
    .from("requests")
    .select("athlete_name, athlete_email, athlete_link_token, athlete_phone, upload_token, sport, clubs(name)")
    .eq("id", id)
    .eq("club_id", profile.club_id)
    .single();

  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!req.athlete_email || !req.athlete_link_token) return NextResponse.json({ error: "Missing email or token" }, { status: 400 });

  await sendAthleteReportReady({
    athleteName: req.athlete_name || "Athlete",
    athleteEmail: req.athlete_email,
    clubName: req.clubs?.name || "",
    reportToken: req.athlete_link_token,
  });

  if (req.athlete_phone && req.upload_token) {
    try {
      await sendAthleteUploadLink({
        athleteName: req.athlete_name || "",
        athletePhone: req.athlete_phone,
        uploadToken: req.upload_token,
        institutionName: req.clubs?.name || "",
        sport: req.sport || "",
      });
    } catch (e) {
      console.error("Failed to resend WhatsApp:", e.message);
    }
  }

  return NextResponse.json({ ok: true });
}
