import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  const admin = createAdminClient();
  const { slug } = await params;
  const { pin } = await request.json();

  const { data: club } = await admin
    .from("clubs")
    .select("id, pin, active")
    .eq("slug", slug)
    .single();

  if (!club || !club.active) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (club.pin && club.pin !== pin) {
    await admin.from("events").insert({
      event_type: "pin_attempt_failed",
      club_id: club.id,
      metadata: { slug },
    });
    return NextResponse.json({ error: "Incorrect PIN" }, { status: 403 });
  }

  await admin.from("events").insert({
    event_type: "pin_attempt_success",
    club_id: club.id,
    metadata: { slug },
  });

  return NextResponse.json({ ok: true });
}
