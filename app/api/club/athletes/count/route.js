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

  const { count } = await admin
    .from("requests")
    .select("*", { count: "exact", head: true })
    .eq("club_id", profile.club_id);

  return NextResponse.json({ count: count ?? 0 });
}
