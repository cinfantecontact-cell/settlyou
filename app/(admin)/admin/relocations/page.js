export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import GenerateButton from "./_components/GenerateButton";
import { formatCountry } from "@/lib/format-country";
import GeneratingBadge from "./_components/GeneratingBadge";
import DeleteRelocationButton from "./_components/DeleteRelocationButton";

export const metadata = { title: "Relocations — Settl Admin" };

const STATUS_COLORS = {
  submitted: "bg-yellow-100 text-yellow-800",
  generating: "bg-blue-100 text-blue-800",
  under_review: "bg-purple-100 text-purple-800",
  approved: "bg-brand-100 text-brand-800",
  delivered: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS = {
  submitted: "Submitted",
  generating: "Generating...",
  under_review: "Under review",
  approved: "Approved",
  delivered: "Delivered",
};

export default async function AdminRelocationsPage() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const { data: requests } = await admin
    .from("requests")
    .select("*, organizations(name), clubs(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Relocations</h1>
        <p className="text-sm text-muted mt-1">{requests?.length ?? 0} total requests</p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {!requests?.length ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            No relocation requests yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">Student</th>
                <th className="px-4 py-3 text-left font-medium text-muted">University</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Destination</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{req.athlete_name}</td>
                  <td className="px-4 py-3 text-muted">
                    {req.organizations?.name ?? req.clubs?.name ?? "—"}
                    {req.submitted_by_athlete && (
                      <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">self-submitted</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{req.destination_city}, {formatCountry(req.destination_country)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-600">
                      {req.athlete_type === "college" ? (req.is_part_of_team ? "Athlete" : "Student") : "Pro"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "generating" ? (
                      <GeneratingBadge />
                    ) : (
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[req.status]}`}>
                        {STATUS_LABELS[req.status]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(req.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {req.status === "submitted" && (
                        <GenerateButton requestId={req.id} />
                      )}
                      {["under_review", "approved", "delivered"].includes(req.status) && (
                        <a
                          href={`/admin/relocations/${req.id}`}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap"
                        >
                          View
                        </a>
                      )}
                      <DeleteRelocationButton requestId={req.id} athleteName={req.athlete_name} />
                    </div>
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
