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
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Fetch request + club for email
  const { data: req } = await admin
    .from("requests")
    .select("athlete_name, athlete_email, athlete_link_token, clubs(name)")
    .eq("id", id)
    .single();

  await admin.from("requests").update({ status: "delivered" }).eq("id", id);
  await admin.from("documents")
    .update({ approved_at: new Date().toISOString(), approved_by: user.id })
    .eq("request_id", id);

  // Send athlete email if we have their email
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

  return NextResponse.json({ ok: true });
}
