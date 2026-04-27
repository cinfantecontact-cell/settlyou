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

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Fetch request + club + club admin email
  const { data: req } = await admin
    .from("requests")
    .select("athlete_name, athlete_email, athlete_link_token, athlete_phone, upload_token, club_id, sport, clubs(name)")
    .eq("id", id)
    .single();

  // Get club admin email via auth
  let clubAdminEmail = null;
  if (req?.club_id) {
    const { data: adminProfiles } = await admin
      .from("profiles")
      .select("id")
      .eq("club_id", req.club_id)
      .eq("role", "club_admin")
      .limit(1);
    if (adminProfiles?.[0]) {
      const { data: authUser } = await admin.auth.admin.getUserById(adminProfiles[0].id);
      clubAdminEmail = authUser?.user?.email || null;
    }
  }

  await admin.from("requests").update({ status: "delivered" }).eq("id", id);
  await admin.from("documents")
    .update({ approved_at: new Date().toISOString(), approved_by: user.id })
    .eq("request_id", id);

  // Send athlete email
  if (req?.athlete_email && req?.athlete_link_token) {
    try {
      await sendAthleteReportReady({
        athleteName: req.athlete_name || "Athlete",
        athleteEmail: req.athlete_email,
        clubName: req.clubs?.name || "",
        reportToken: req.athlete_link_token,
      });
    } catch (e) {
      console.error("Failed to send athlete email:", e.message);
    }
  }

  // Send WhatsApp with upload link
  if (req?.athlete_phone && req?.upload_token) {
    try {
      await sendAthleteUploadLink({
        athleteName: req.athlete_name || "",
        athletePhone: req.athlete_phone,
        uploadToken: req.upload_token,
        institutionName: req.clubs?.name || "",
        sport: req.sport || "",
      });
    } catch (e) {
      console.error("Failed to send WhatsApp:", e.message);
    }
  }

  // Log in-app notification for club
  if (req?.club_id) {
    await admin.from("events").insert({
      event_type: "guide_delivered",
      request_id: id,
      club_id: req.club_id,
      metadata: {
        athlete_name: req.athlete_name || "Athlete",
        athlete_email: req.athlete_email || null,
        report_token: req.athlete_link_token,
        sport: req.sport || null,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
