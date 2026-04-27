export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DeleteClubButton from "../clients/_components/DeleteClubButton";

export const metadata = { title: "Universities — Settl Admin" };

function getPlan(plan, seatLimit) {
  if (plan === "institution") return { label: "Institution", color: "bg-purple-100 text-purple-700" };
  if (plan === "pro") return { label: "Pro", color: "bg-blue-100 text-blue-700" };
  if (plan === "starter") return { label: "Starter", color: "bg-brand-100 text-brand-700" };
  if (plan === "micro") return { label: "Micro", color: "bg-green-100 text-green-700" };
  if (plan === "trial" || !seatLimit) return { label: "Trial", color: "bg-gray-100 text-gray-600" };
  // legacy fallback
  if (seatLimit >= 200) return { label: "Institution", color: "bg-purple-100 text-purple-700" };
  if (seatLimit >= 100) return { label: "Pro", color: "bg-blue-100 text-blue-700" };
  if (seatLimit >= 40) return { label: "Starter", color: "bg-brand-100 text-brand-700" };
  return { label: "Micro", color: "bg-green-100 text-green-700" };
}

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
  const active = clubs?.filter(c => c.active).length ?? 0;

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Universities</h1>
          <p className="text-sm text-muted mt-1">
            {clubs?.length ?? 0} total · {active} active
          </p>
        </div>
        <a
          href="/admin/clubs/new"
          className="bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          + Add university
        </a>
      </div>

      {!clubs?.length ? (
        <div className="bg-white rounded-xl border border-border px-6 py-16 text-center">
          <p className="text-sm text-muted mb-4">No universities yet.</p>
          <a href="/admin/clubs/new" className="text-sm text-brand-600 font-semibold hover:underline">
            Add your first university →
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clubs.map((club) => {
            const plan = getPlan(club.plan, club.seat_limit);
            const usedPct = club.seat_limit ? Math.min(100, Math.round((club.seats_used / club.seat_limit) * 100)) : 0;
            const accent = club.primary_color || "#16a34a";

            return (
              <div key={club.id} className="bg-white rounded-xl border border-border overflow-hidden hover:border-brand-200 transition-colors">
                <div className="p-5 flex items-center gap-4">

                  {/* Logo */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-border"
                    style={{ backgroundColor: club.logo_url ? "white" : `${accent}18` }}
                  >
                    {club.logo_url
                      ? <img src={club.logo_url} alt="" className="w-full h-full object-contain p-1.5" />
                      : <span className="text-sm font-bold" style={{ color: accent }}>{club.name?.slice(0, 2).toUpperCase()}</span>
                    }
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-tight">{club.name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {[club.city, club.country].filter(Boolean).join(", ")}
                      {club.division ? ` · ${club.division}` : ""}
                    </p>
                  </div>

                  {/* Plan */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${plan.color}`}>
                    {plan.label}
                  </span>

                  {/* Guides used */}
                  <div className="shrink-0 w-28 hidden sm:block">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted">Guides</span>
                      <span className="text-xs font-semibold text-foreground">{club.seats_used ?? 0} / {club.seat_limit ?? "∞"}</span>
                    </div>
                    {club.seat_limit ? (
                      <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${usedPct}%`, backgroundColor: usedPct > 80 ? "#dc2626" : accent }}
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Status */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    club.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${club.active ? "bg-green-500" : "bg-gray-400"}`} />
                    {club.active ? "Active" : "Inactive"}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={`${baseUrl}/join/${club.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-muted hover:text-foreground transition-colors"
                    >
                      Join link ↗
                    </a>
                    <a
                      href={`/admin/clubs/${club.id}/edit`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-surface transition-colors text-foreground"
                    >
                      Edit
                    </a>
                    <DeleteClubButton clubId={club.id} clubName={club.name} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
