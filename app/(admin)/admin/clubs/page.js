export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DeleteClubButton from "../clients/_components/DeleteClubButton";

export const metadata = { title: "Clients — Settl Admin" };

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
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted mt-1">{clubs?.length ?? 0} total · university programs</p>
        </div>
        <a
          href="/admin/clubs/new"
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          + New client
        </a>
      </div>

      {!clubs?.length ? (
        <div className="bg-white rounded-xl border border-border px-6 py-16 text-center">
          <p className="text-sm text-muted mb-4">No clients yet. Add your first university to get a join link.</p>
          <a href="/admin/clubs/new" className="text-sm text-brand-600 font-semibold hover:underline">
            Add a university →
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clubs.map((club) => (
            <div key={club.id} className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
              {/* Logo */}
              <div className="w-10 h-10 rounded-lg border border-border bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                {club.logo_url
                  ? <img src={club.logo_url} alt="" className="w-full h-full object-contain p-1" />
                  : <span className="text-xs font-bold text-muted">{club.name?.slice(0, 2).toUpperCase()}</span>
                }
              </div>

              {/* Name + slug */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{club.name}</p>
                <p className="text-xs text-muted">{club.slug}</p>
              </div>

              {/* Tier */}
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 bg-brand-100 text-brand-700">
                {(club.seat_limit ?? 0) >= 400 ? "$25/guide" : (club.seat_limit ?? 0) >= 150 ? "$35/guide" : "$49/guide"}
              </span>

              {/* Guides */}
              <span className="text-sm text-muted shrink-0 w-16 text-center">
                {club.seats_used} / {club.seat_limit ?? "∞"}
              </span>

              {/* Status */}
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                club.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {club.active ? "Active" : "Inactive"}
              </span>

              {/* Join link */}
              <a
                href={`${baseUrl}/join/${club.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-600 hover:underline shrink-0"
              >
                Open link ↗
              </a>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <a href={`/admin/clubs/${club.id}/edit`}
                  className="text-xs font-medium text-brand-600 hover:underline">
                  Edit
                </a>
                <DeleteClubButton clubId={club.id} clubName={club.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
