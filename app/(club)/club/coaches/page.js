export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import CoachesClient from "./_components/CoachesClient";

const SPORTS = [
  "Men's Soccer", "Women's Soccer",
  "Men's Basketball", "Women's Basketball",
  "Baseball", "Softball",
  "American Football",
  "Men's Tennis", "Women's Tennis",
  "Men's Swimming", "Women's Swimming",
  "Men's Track & Field", "Women's Track & Field",
  "Men's Volleyball", "Women's Volleyball",
  "Men's Golf", "Women's Golf",
  "Wrestling",
  "Men's Gymnastics", "Women's Gymnastics",
  "Men's Rowing", "Women's Rowing",
  "Men's Cross Country", "Women's Cross Country",
  "Men's Lacrosse", "Women's Lacrosse",
  "Other",
];

export default async function CoachesPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") redirect("/club");

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

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Coaches</h1>
          <p className="text-sm text-muted max-w-lg">Invite coaches to give them access to their sport's athletes. Each coach only sees students from their assigned sport.</p>
        </div>
      </div>

      <CoachesClient coaches={coaches ?? []} pending={pending ?? []} sports={SPORTS} />
    </div>
  );
}
