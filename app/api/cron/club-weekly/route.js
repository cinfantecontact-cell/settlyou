import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendClubWeeklyRecap } from "@/lib/email/send";

export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Get all active clubs
  const { data: clubs } = await admin
    .from("clubs")
    .select("id, name, seats_used")
    .eq("active", true);

  if (!clubs?.length) return NextResponse.json({ ok: true, sent: 0 });

  const clubIds = clubs.map((c) => c.id);

  // Batch fetch all the data we need across all clubs
  const [
    { data: deliveredEvents },
    { data: openedEvents },
    { data: pendingRequests },
    { data: adminProfiles },
  ] = await Promise.all([
    admin.from("events")
      .select("club_id")
      .in("club_id", clubIds)
      .eq("event_type", "guide_delivered")
      .gte("created_at", sevenDaysAgo),
    admin.from("events")
      .select("club_id, request_id")
      .in("club_id", clubIds)
      .eq("event_type", "guide_opened")
      .gte("created_at", sevenDaysAgo),
    admin.from("requests")
      .select("club_id")
      .in("club_id", clubIds)
      .in("status", ["submitted", "generating", "under_review", "approved"]),
    admin.from("profiles")
      .select("club_id, email")
      .in("club_id", clubIds)
      .eq("role", "club_admin"),
  ]);

  // Deduplicate opened events by request_id per club (count unique guides opened)
  const openedByClub = {};
  const seenOpenRequests = {};
  for (const e of openedEvents ?? []) {
    const key = `${e.club_id}:${e.request_id}`;
    if (!seenOpenRequests[key]) {
      seenOpenRequests[key] = true;
      openedByClub[e.club_id] = (openedByClub[e.club_id] || 0) + 1;
    }
  }

  // Count by club
  const deliveredByClub = {};
  for (const e of deliveredEvents ?? []) {
    deliveredByClub[e.club_id] = (deliveredByClub[e.club_id] || 0) + 1;
  }

  const pendingByClub = {};
  for (const r of pendingRequests ?? []) {
    pendingByClub[r.club_id] = (pendingByClub[r.club_id] || 0) + 1;
  }

  // Map admin email by club
  const adminEmailByClub = {};
  for (const p of adminProfiles ?? []) {
    if (!adminEmailByClub[p.club_id]) adminEmailByClub[p.club_id] = p.email;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://settlyou.com";
  let sent = 0;
  const errors = [];

  for (const club of clubs) {
    const adminEmail = adminEmailByClub[club.id];
    if (!adminEmail) continue;

    const stats = {
      delivered: deliveredByClub[club.id] || 0,
      opened: openedByClub[club.id] || 0,
      pending: pendingByClub[club.id] || 0,
      total: club.seats_used || 0,
    };

    // Skip clubs with zero activity this week
    if (stats.delivered === 0 && stats.opened === 0 && stats.pending === 0) continue;

    try {
      await sendClubWeeklyRecap({
        clubName: club.name,
        adminEmail,
        dashboardUrl: `${appUrl}/club`,
        stats,
      });
      sent++;
    } catch (e) {
      errors.push({ club: club.name, error: e.message });
    }
  }

  return NextResponse.json({ ok: true, sent, errors });
}
