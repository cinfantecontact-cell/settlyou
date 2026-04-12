export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export default async function ClubAthletes() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") redirect("/login");

  const { data: requests } = await admin
    .from("requests")
    .select("id, status, athlete_name, athlete_email, destination_city, destination_country, created_at, athlete_link_token")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Athletes</h1>
        <p className="text-sm text-muted mt-1">{requests?.length || 0} total submissions</p>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {requests?.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-muted">No athletes yet. Share your join link to get started.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Athlete</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Destination</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{r.athlete_name || "—"}</p>
                    <p className="text-xs text-muted">{r.athlete_email || ""}</p>
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {r.destination_city}{r.destination_country ? `, ${r.destination_country}` : ""}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <a href={`/club/athletes/${r.id}`} className="text-xs text-brand-600 hover:underline font-medium">
                      View →
                    </a>
                  </td>
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
