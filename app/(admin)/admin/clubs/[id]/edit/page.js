import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import EditClubForm from "./_components/EditClubForm";
import InviteAdForm from "@/app/(admin)/admin/clients/_components/InviteAdForm";
import InviteCoachForm from "@/app/(admin)/admin/clients/_components/InviteCoachForm";
import ResetPasswordButton from "@/app/(admin)/admin/clients/_components/ResetPasswordButton";
import RemoveAdButton from "@/app/(admin)/admin/clients/_components/RemoveAdButton";

export const metadata = { title: "Edit Club — Settl Admin" };

export default async function EditClubPage({ params, searchParams }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const { data: club } = await admin.from("clubs").select("*").eq("id", id).single();
  if (!club) redirect("/admin/clubs");

  const [{ data: baseData }, { data: adProfile }, { data: coaches }, { data: pending }] = await Promise.all([
    admin.from("city_base_data").select("status, generated_at").eq("club_id", id).eq("language", "en").single(),
    admin.from("profiles").select("id, full_name").eq("club_id", id).eq("role", "club_admin").single(),
    admin.from("profiles").select("id, full_name, sport").eq("club_id", id).eq("role", "coach").order("full_name"),
    admin.from("coach_invites").select("id, email, sport, created_at").eq("club_id", id).eq("accepted", false).order("created_at", { ascending: false }),
  ]);

  const adUser = adProfile ? await admin.auth.admin.getUserById(adProfile.id) : null;
  const adEmail = adUser?.data?.user?.email ?? "—";

  const coachEmails = {};
  if (coaches?.length) {
    await Promise.all(coaches.map(async (c) => {
      const { data } = await admin.auth.admin.getUserById(c.id);
      coachEmails[c.id] = data?.user?.email ?? "—";
    }));
  }

  const sp = await searchParams;

  return (
    <div className="p-8 max-w-4xl flex flex-col gap-6">
      <div className="mb-2">
        <a href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </a>
        <h1 className="text-2xl font-bold text-foreground mt-4">{club.name}</h1>
        <p className="text-sm text-muted mt-1">Edit university details, manage accounts, and invite coaches.</p>
      </div>

      {sp?.success && (
        <div className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-4 py-3">
          Changes saved successfully.
        </div>
      )}
      {sp?.error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Something went wrong. Please try again.
        </div>
      )}

      {/* University details */}
      <EditClubForm club={club} baseDataStatus={baseData?.status || null} baseDataGeneratedAt={baseData?.generated_at || null} />

      {/* AD Account */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Athletic Director Account</h2>
        </div>
        {adProfile ? (
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{adProfile.full_name || "—"}</p>
              <p className="text-xs text-muted mt-0.5">{adEmail}</p>
            </div>
            <div className="flex items-center gap-2">
              <ResetPasswordButton email={adEmail} />
              <RemoveAdButton clubId={id} userId={adProfile.id} />
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 flex flex-col gap-3">
            <p className="text-sm text-muted">No athletic director account yet.</p>
            <InviteAdForm clubId={id} />
          </div>
        )}
      </div>

      {/* Coaches */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Coaches</h2>
          <span className="text-xs text-muted">{coaches?.length ?? 0} active</span>
        </div>
        {coaches?.length ? (
          <div className="divide-y divide-border">
            {coaches.map(c => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.full_name || "—"}</p>
                  <p className="text-xs text-muted mt-0.5">{coachEmails[c.id]} · {c.sport}</p>
                </div>
                <ResetPasswordButton userId={c.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-muted">No coaches yet.</p>
          </div>
        )}
      </div>

      {/* Invite a coach */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Invite a Coach</h2>
        </div>
        <div className="px-6 py-4">
          <InviteCoachForm clubId={id} />
        </div>
      </div>

      {/* Pending invites */}
      {pending?.length > 0 && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Coach Invites</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sport</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sent</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 text-foreground">{p.email}</td>
                  <td className="px-6 py-3 text-muted">{p.sport}</td>
                  <td className="px-6 py-3 text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
