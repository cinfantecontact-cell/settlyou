import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildWelcomeEmail } from "@/lib/email/welcome";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://settlyou.com";

function generateTempPassword() {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `Settlyou${digits}!`;
}

export async function POST(request, { params }) {
  const { id: clubId } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const { data: club } = await admin.from("clubs").select("*").eq("id", clubId).single();
  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  // Check if another club_admin already exists for this club
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("club_id", clubId)
    .eq("role", "club_admin")
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "This university already has an Athletic Director account." }, { status: 409 });

  // Find or create the user
  const { data: allUsers } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existingUser = allUsers?.users?.find(u => u.email === email);

  let userId = existingUser?.id;
  let tempPassword = null;

  if (!existingUser) {
    tempPassword = generateTempPassword();
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });
    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
    userId = newUser?.user?.id;
  }

  if (!userId) return NextResponse.json({ error: "Could not resolve user." }, { status: 500 });

  // Link user to club as club_admin
  await admin.from("profiles").upsert({
    id: userId,
    role: "club_admin",
    club_id: clubId,
  });

  // Send welcome email
  const joinLink = `${baseUrl}/join/${club.slug}`;
  const loginLink = `${baseUrl}/login`;
  const planLabel = (club.plan ?? "starter").charAt(0).toUpperCase() + (club.plan ?? "starter").slice(1);

  await resend.emails.send({
    from: "Settlyou Team <hello@settlyou.com>",
    to: email,
    subject: `Welcome to Settlyou — here's everything you need, ${club.name}`,
    html: buildWelcomeEmail({ clubName: club.name, planLabel, joinLink, loginLink, pin: club.pin, email, tempPassword }),
  });

  return NextResponse.json({ ok: true });
}

