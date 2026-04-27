import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, userId } = await request.json();

  let resolvedEmail = email;
  if (!resolvedEmail && userId) {
    const { data: u } = await admin.auth.admin.getUserById(userId);
    resolvedEmail = u?.user?.email;
  }
  if (!resolvedEmail) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const { error } = await supabase.auth.resetPasswordForEmail(resolvedEmail, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
