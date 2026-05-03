import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAthleteReportReady } from "@/lib/email/send";

export async function POST(request, { params }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!["club_admin", "settl_admin"].includes(profile?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: req } = await admin
    .from("requests")
    .select("athlete_name, athlete_email, athlete_link_token, upload_token, club_id, status, clubs(name)")
    .eq("id", id)
    .single();

  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (req.status !== "delivered") return NextResponse.json({ error: "Guide not delivered yet" }, { status: 400 });

  // Club admins can only resend for their own club
  if (profile.role === "club_admin" && req.club_id !== profile.club_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!req.athlete_email || !req.athlete_link_token) {
    return NextResponse.json({ error: "No email or guide link on file" }, { status: 400 });
  }

  await sendAthleteReportReady({
    athleteName: req.athlete_name || "Athlete",
    athleteEmail: req.athlete_email,
    clubName: req.clubs?.name || "",
    reportToken: req.athlete_link_token,
    uploadToken: req.upload_token,
  });

  return NextResponse.json({ ok: true });
}
