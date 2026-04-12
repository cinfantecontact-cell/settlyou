import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const admin = createAdminClient();

  try {
    const body = await request.json();
    const { event_type, request_id, club_id, metadata } = body;

    if (!event_type) {
      return NextResponse.json({ error: "event_type required" }, { status: 400 });
    }

    await admin.from("events").insert({
      event_type,
      request_id: request_id || null,
      club_id: club_id || null,
      metadata: metadata || {},
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
