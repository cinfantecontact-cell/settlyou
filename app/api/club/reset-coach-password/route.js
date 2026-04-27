import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { coachId } = await request.json();

  // Verify the coach belongs to this club
  const { data: coachProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", coachId)
    .eq("club_id", profile.club_id)
    .eq("role", "coach")
    .single();

  if (!coachProfile) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

  const { data: coachUser } = await admin.auth.admin.getUserById(coachId);
  const email = coachUser?.user?.email;
  if (!email) return NextResponse.json({ error: "Could not find coach email" }, { status: 404 });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
