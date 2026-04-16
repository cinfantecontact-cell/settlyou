export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import JoinLinkCard from "./_components/JoinLinkCard";

export default async function ClubDashboard() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles")
    .select("role, club_id")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "club_admin") redirect("/login");

  const { data: club } = await admin
    .from("clubs")
    .select("*")
    .eq("id", profile.club_id)
    .single();

  const { data: requests } = await admin
    .from("requests")
    .select("id, status, athlete_name, created_at")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  const total = requests?.length || 0;
  const delivered = requests?.filter(r => r.status === "delivered").length || 0;
  const pending = requests?.filter(r => ["submitted", "generating", "under_review", "approved"].includes(r.status)).length || 0;
  const seatsLeft = club?.seat_limit ? club.seat_limit - (club.seats_used || 0) : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{club?.name}</h1>
        <p className="text-sm text-muted mt-1">Welcome to your Settlyou portal</p>
      </div>

      {/* Join link */}
      {club?.slug && (
        <JoinLinkCard slug={club.slug} pin={club.pin} clubName={club.name} />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-1">Total Reports</p>
          <p className="text-3xl font-bold text-foreground">{total}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-1">Delivered</p>
          <p className="text-3xl font-bold text-brand-600">{delivered}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-1">In Progress</p>
          <p className="text-3xl font-bold text-foreground">{pending}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-1">Seats Left</p>
          <p className="text-3xl font-bold text-foreground">{seatsLeft ?? "∞"}</p>
        </div>
      </div>

      {/* Recent athletes */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Athletes</h2>
          <a href="/club/athletes" className="text-xs text-brand-600 hover:underline font-medium">View all →</a>
        </div>
        {requests?.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">No athletes yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Athlete</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests?.slice(0, 5).map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{r.athlete_name || "—"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    submitted: { label: "Submitted", class: "bg-blue-50 text-blue-700" },
    generating: { label: "Generating", class: "bg-yellow-50 text-yellow-700" },
    under_review: { label: "Under Review", class: "bg-orange-50 text-orange-700" },
    approved: { label: "Approved", class: "bg-green-50 text-green-700" },
    delivered: { label: "Delivered", class: "bg-brand-50 text-brand-700" },
  };
  const s = map[status] || { label: status, class: "bg-surface text-muted" };
  return <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.class}`}>{s.label}</span>;
}
