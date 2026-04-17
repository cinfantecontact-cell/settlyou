import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCountry } from "@/lib/format-country";

export const metadata = { title: "Requests — Settl" };

const STATUS_COLORS = {
  submitted: "bg-yellow-100 text-yellow-800",
  generating: "bg-blue-100 text-blue-800",
  under_review: "bg-purple-100 text-purple-800",
  approved: "bg-brand-100 text-brand-800",
  delivered: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS = {
  submitted: "Submitted",
  generating: "Generating",
  under_review: "Under review",
  approved: "Approved",
  delivered: "Delivered",
};

export default async function RequestsPage({ searchParams }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .eq("organization_id", profile?.organization_id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relocation Requests</h1>
          <p className="text-sm text-muted mt-1">{requests?.length ?? 0} total requests</p>
        </div>
        <a
          href="/requests/new"
          className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-brand-700 transition-colors"
        >
          + New request
        </a>
      </div>

      {searchParams?.submitted && (
        <div className="mb-6 text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-md px-4 py-3">
          Request submitted. Our team will review and deliver your document within 24 hours.
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {!requests?.length ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-muted mb-4">No requests yet.</p>
            <a
              href="/requests/new"
              className="text-sm bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition-colors"
            >
              Submit your first request
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">Athlete</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Destination</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Service</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{req.athlete_name}</td>
                  <td className="px-4 py-3 text-muted">{req.destination_city}, {formatCountry(req.destination_country)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      req.service_tier === "premium" ? "bg-brand-100 text-brand-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {req.service_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[req.status]}`}>
                      {STATUS_LABELS[req.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(req.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
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
