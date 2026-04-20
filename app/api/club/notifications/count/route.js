import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ count: 0 });

  const { data: profile } = await admin
    .from("profiles").select("club_id").eq("id", user.id).single();
  if (!profile?.club_id) return NextResponse.json({ count: 0 });

  const { data: club } = await admin
    .from("clubs").select("plan").eq("id", profile.club_id).single();
  const isPremium = club?.plan === "premium";

  // Count guide_delivered events
  const { count: deliveredCount } = await admin
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("club_id", profile.club_id)
    .eq("event_type", "guide_delivered");

  // For premium: count distinct requests with at least one guide_opened event
  let openCount = 0;
  if (isPremium) {
    const { data: openEvents } = await admin
      .from("events")
      .select("request_id")
      .eq("club_id", profile.club_id)
      .eq("event_type", "guide_opened");

    const unique = new Set((openEvents ?? []).map((e) => e.request_id).filter(Boolean));
    openCount = unique.size;
  }

  return NextResponse.json({ count: (deliveredCount ?? 0) + openCount });
}
