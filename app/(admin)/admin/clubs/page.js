import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Clubs — Settl Admin" };

export default async function AdminClubsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const { data: clubs } = await supabase
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clubs & Institutions</h1>
          <p className="text-sm text-muted mt-1">{clubs?.length ?? 0} clubs · Each gets a unique join link</p>
        </div>
        <a
          href="/admin/clubs/new"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          + New club
        </a>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {!clubs?.length ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-muted mb-4">No clubs yet. Create your first one to get a join link.</p>
            <a href="/admin/clubs/new"
              className="text-sm text-brand-600 font-semibold hover:underline">
              Create a club →
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">Club</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Seats</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Join link</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{club.name}</span>
                    <span className="block text-xs text-muted">{club.slug}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      club.type === "college"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {club.type === "college" ? "College" : "Pro"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {club.seats_used} / {club.seat_limit ?? "∞"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      club.active ? "bg-brand-100 text-brand-800" : "bg-gray-100 text-gray-500"
                    }`}>
                      {club.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <CopyLink url={`${baseUrl}/join/${club.slug}`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a href={`/admin/clubs/${club.id}/edit`}
                      className="text-xs text-brand-600 hover:underline font-medium">
                      Edit
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

function CopyLink({ url }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted font-mono truncate max-w-[180px]">{url}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-brand-600 hover:underline shrink-0"
      >
        Open ↗
      </a>
    </div>
  );
}
