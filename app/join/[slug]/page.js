export const dynamic = 'force-dynamic';
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import JoinForm from "./_components/JoinForm";

export default async function JoinPage({ params }) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: club } = await admin
    .from("clubs")
    .select("id, name, slug, type, logo_url, primary_color, secondary_color, active, seat_limit, seats_used, pin, plan")
    .eq("slug", slug)
    .single();

  if (!club || !club.active) notFound();

  // Track join link visit (fire-and-forget)
  admin.from("events").insert({
    event_type: "join_link_visited",
    club_id: club.id,
    metadata: { slug },
  });

  const full = club.seat_limit && club.seats_used >= club.seat_limit;

  if (full) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-3">Link unavailable</p>
          <p className="text-white/40">This club has reached its guide limit. Please contact your club directly.</p>
        </div>
      </div>
    );
  }

  const isPremium = club.plan === "premium";

  return <JoinForm club={{
    ...club,
    pin: undefined,
    hasPin: !!club.pin,
    logo_url: isPremium ? club.logo_url : null,
    primary_color: isPremium ? club.primary_color : "#16a34a",
    secondary_color: isPremium ? club.secondary_color : "#ffffff",
  }} />;
}
