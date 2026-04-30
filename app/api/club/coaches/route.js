import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCoachInvite } from "@/lib/email/send";

export async function GET() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: coaches } = await admin
    .from("profiles")
    .select("id, full_name, sport")
    .eq("club_id", profile.club_id)
    .eq("role", "coach")
    .order("full_name");

  const { data: pending } = await admin
    .from("coach_invites")
    .select("id, email, sport, created_at")
    .eq("club_id", profile.club_id)
    .eq("accepted", false)
    .order("created_at", { ascending: false });

  return NextResponse.json({ coaches: coaches ?? [], pending: pending ?? [] });
}

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, sport } = await request.json();
  if (!email || !sport) return NextResponse.json({ error: "Email and sport are required" }, { status: 400 });

  const { data: club } = await admin.from("clubs").select("name").eq("id", profile.club_id).single();

  // Check for duplicate pending invite
  const { data: existing } = await admin
    .from("coach_invites")
    .select("id")
    .eq("club_id", profile.club_id)
    .eq("email", email)
    .eq("accepted", false)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "An invite has already been sent to this email." }, { status: 409 });

  // Check if this email already accepted an invite (has an account)
  const { data: accepted } = await admin
    .from("coach_invites")
    .select("id")
    .eq("club_id", profile.club_id)
    .eq("email", email)
    .eq("accepted", true)
    .maybeSingle();
  if (accepted) return NextResponse.json({ error: "A coach with this email already has an account." }, { status: 409 });

  const { data: invite, error } = await admin
    .from("coach_invites")
    .insert({ club_id: profile.club_id, email, sport })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join/coach/${invite.token}`;

  await sendCoachInvite({ coachEmail: email, clubName: club.name, sport, inviteUrl });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { coachId, email } = await request.json();
  if (!coachId || !email) return NextResponse.json({ error: "coachId and email are required" }, { status: 400 });

  // Verify coach belongs to this club
  const { data: coach } = await admin.from("profiles").select("id").eq("id", coachId).eq("club_id", profile.club_id).eq("role", "coach").single();
  if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

  const { error } = await admin.auth.admin.updateUserById(coachId, { email });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, type } = await request.json();

  if (type === "pending") {
    await admin.from("coach_invites").delete().eq("id", id).eq("club_id", profile.club_id);
  } else {
    await admin.from("profiles").delete().eq("id", id).eq("club_id", profile.club_id).eq("role", "coach");
  }

  return NextResponse.json({ ok: true });
}
