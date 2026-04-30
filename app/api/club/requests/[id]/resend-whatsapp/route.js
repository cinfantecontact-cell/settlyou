import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
    .select("athlete_name, athlete_phone, upload_token, sport, clubs(name)")
    .eq("id", id)
    .eq("club_id", profile.club_id)
    .single();

  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!req.athlete_phone) return NextResponse.json({ error: "No phone number on file" }, { status: 400 });
  if (!req.upload_token) return NextResponse.json({ error: "No upload token" }, { status: 400 });

  await sendAthleteUploadLink({
    athleteName: req.athlete_name || "",
    athletePhone: req.athlete_phone,
    uploadToken: req.upload_token,
    institutionName: req.clubs?.name || "",
    sport: req.sport || "",
  });

  return NextResponse.json({ ok: true });
}
