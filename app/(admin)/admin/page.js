export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import LeadStatusSelect from "./_components/LeadStatusSelect";

export const metadata = { title: "Admin — Settl" };

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  approved: "bg-brand-100 text-brand-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const admin = createAdminClient();
  const { data: contactRequests } = await admin
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Access Requests</h1>
        <p className="text-sm text-muted mt-1">
          {contactRequests?.length ?? 0} total requests
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {!contactRequests?.length ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            No access requests yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Organization</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Country</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contactRequests.map((req) => (
                <tr key={req.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{req.full_name}</td>
                  <td className="px-4 py-3 text-foreground">{req.organization_name}</td>
                  <td className="px-4 py-3 capitalize text-muted">{req.organization_type}</td>
                  <td className="px-4 py-3 text-muted">{req.country}</td>
                  <td className="px-4 py-3 text-muted">{req.email}</td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect leadId={req.id} currentStatus={req.status} />
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
