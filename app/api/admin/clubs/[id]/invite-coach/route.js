import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCoachInvite } from "@/lib/email/send";

export async function POST(request, { params }) {
  const { id: clubId } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, sport } = await request.json();
  if (!email || !sport) return NextResponse.json({ error: "Email and sport are required" }, { status: 400 });

  const { data: club } = await admin.from("clubs").select("name").eq("id", clubId).single();
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  // Check for duplicate pending invite
  const { data: existing } = await admin
    .from("coach_invites")
    .select("id")
    .eq("club_id", clubId)
    .eq("email", email)
    .eq("accepted", false)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "An invite has already been sent to this email." }, { status: 409 });

  // Check if this email already accepted an invite (has an account)
  const { data: accepted } = await admin
    .from("coach_invites")
    .select("id")
    .eq("club_id", clubId)
    .eq("email", email)
    .eq("accepted", true)
    .maybeSingle();
  if (accepted) return NextResponse.json({ error: "A coach with this email already has an account." }, { status: 409 });

  const { data: invite, error } = await admin
    .from("coach_invites")
    .insert({ club_id: clubId, email, sport })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join/coach/${invite.token}`;
  await sendCoachInvite({ coachEmail: email, clubName: club.name, sport, inviteUrl });

  return NextResponse.json({ ok: true });
}
