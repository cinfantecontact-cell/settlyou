import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { formatCountry } from "@/lib/format-country";

export const metadata = { title: "Dashboard — Settl" };

const STATUS_COLORS = {
  submitted: "bg-yellow-100 text-yellow-800",
  generating: "bg-blue-100 text-blue-800",
  under_review: "bg-purple-100 text-purple-800",
  approved: "bg-brand-100 text-brand-800",
  delivered: "bg-green-100 text-green-800",
};

const STATUS_LABELS = {
  submitted: "Submitted",
  generating: "Generating...",
  under_review: "In review",
  approved: "Approved",
  delivered: "Ready",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) redirect("/login");

  const { data: org } = await admin
    .from("organizations")
    .select("*")
    .eq("id", profile.organization_id)
    .single();

  const { data: requests } = await admin
    .from("requests")
    .select("id, athlete_name, athlete_type, destination_city, destination_country, status, created_at, athlete_link_token")
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false });

  const total = requests?.length ?? 0;
  const delivered = requests?.filter(r => ["approved", "delivered"].includes(r.status)).length ?? 0;
  const inProgress = requests?.filter(r => ["submitted", "generating", "under_review"].includes(r.status)).length ?? 0;
  const seatLimit = org?.seat_limit ?? null;

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        {org?.logo_url ? (
          <img src={org.logo_url} alt={org.name}
            className="w-14 h-14 rounded-xl object-contain border border-border bg-white p-1 shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
            <span className="text-white text-lg font-bold">
              {org?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{org?.name}</h1>
          <p className="text-sm text-muted mt-0.5">Welcome back — here's your relocation overview.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-border rounded-xl px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Guides requested</p>
          <p className="text-3xl font-bold text-foreground">{total}</p>
          {seatLimit && (
            <>
              <div className="mt-3 h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${Math.min((total / seatLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-1.5">{total} of {seatLimit} used this year</p>
            </>
          )}
        </div>
        <div className="bg-white border border-border rounded-xl px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Ready to view</p>
          <p className="text-3xl font-bold text-brand-600">{delivered}</p>
          <p className="text-xs text-muted mt-2">Guides delivered to athletes</p>
        </div>
        <div className="bg-white border border-border rounded-xl px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">In progress</p>
          <p className="text-3xl font-bold text-foreground">{inProgress}</p>
          <p className="text-xs text-muted mt-2">Being generated or reviewed</p>
        </div>
      </div>

      {/* Guide list */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground">Your guides</h2>
        <a href="/requests/new"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
          + New guide
        </a>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {!requests?.length ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-muted mb-4">No guides yet. Create your first one.</p>
            <a href="/requests/new"
              className="text-sm text-brand-600 font-semibold hover:underline">
              Create a guide →
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">Athlete</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Destination</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{req.athlete_name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      req.athlete_type === "college"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {req.athlete_type === "college" ? "College" : "Pro"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{req.destination_city}, {formatCountry(req.destination_country)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[req.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[req.status] ?? req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {["approved", "delivered"].includes(req.status) && req.athlete_link_token && (
                      <a href={`/report/${req.athlete_link_token}`} target="_blank"
                        className="text-xs text-brand-600 hover:underline font-medium">
                        View guide →
                      </a>
                    )}
                    {["submitted", "generating", "under_review"].includes(req.status) && (
                      <span className="text-xs text-muted">In progress</span>
                    )}
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
