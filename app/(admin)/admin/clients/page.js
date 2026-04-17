export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DeleteClubButton from "./_components/DeleteClubButton";
import SendWelcomeEmailButton from "./_components/SendWelcomeEmailButton";

export const metadata = { title: "Clients — Settl Admin" };

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function AdminClientsPage() {
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

  const [{ data: clubs }, { data: organizations }] = await Promise.all([
    admin.from("clubs").select("*").order("created_at", { ascending: false }),
    admin.from("organizations").select("*").order("created_at", { ascending: false }),
  ]);

  const total = (clubs?.length ?? 0) + (organizations?.length ?? 0);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted mt-1">{total} total · clubs and university programs</p>
        </div>
        <a
          href="/admin/clubs/new"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          + New client
        </a>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {total === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-muted mb-4">No clients yet. Create your first one to get a join link.</p>
            <a href="/admin/clubs/new" className="text-sm text-brand-600 font-semibold hover:underline">
              Create a client →
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Guides</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-widest">Join link</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Clubs (new system) */}
              {(clubs ?? []).map((club) => (
                <tr key={`club-${club.id}`} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {club.logo_url && (
                        <img src={club.logo_url} alt="" className="w-6 h-6 object-contain rounded shrink-0" />
                      )}
                      <div>
                        <span className="font-medium text-foreground">{club.name}</span>
                        <span className="block text-xs text-muted">{club.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      club.plan === "premium"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-sky-100 text-sky-700"
                    }`}>
                      {club.plan === "premium" ? "Premium" : "Essentials"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {club.seats_used} / {club.seat_limit ?? "∞"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      club.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                    }`}>
                      {club.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted font-mono truncate max-w-[160px]">
                        {baseUrl}/join/{club.slug}
                      </span>
                      <a
                        href={`${baseUrl}/join/${club.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 hover:underline shrink-0"
                      >
                        Open ↗
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <SendWelcomeEmailButton clubId={club.id} clubName={club.name} />
                      <a
                        href={`/admin/clubs/${club.id}/edit`}
                        title="Edit"
                        className="p-1.5 rounded-md text-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </a>
                      <DeleteClubButton clubId={club.id} clubName={club.name} />
                    </div>
                  </td>
                </tr>
              ))}

              {/* Organizations (legacy) */}
              {(organizations ?? []).map((org) => (
                <tr key={`org-${org.id}`} className="hover:bg-surface transition-colors opacity-70">
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{org.name}</span>
                    {org.country && <span className="block text-xs text-muted">{org.country}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                      {org.type ?? "Club"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {org.seat_limit ? `— / ${org.seat_limit}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      Legacy
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">—</td>
                  <td className="px-4 py-3" />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
