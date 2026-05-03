import SidebarNav from "./club/_components/SidebarNav";
import NavigationProgress from "@/app/_components/NavigationProgress";
import PortalAssistant from "./club/_components/PortalAssistant";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ClubLayout({ children }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  let role = null;
  if (user) {
    const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
    role = profile?.role ?? null;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <NavigationProgress />
      <aside className="w-56 bg-white border-r border-border flex flex-col py-5 px-3 shrink-0 shadow-sm">
        {/* Logo */}
        <a href="/" className="px-2 mb-8 block">
          <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-6" />
        </a>

        {/* Nav items */}
        <SidebarNav role={role} />

        {/* Sign out */}
        <div className="mt-auto pt-4 border-t border-border">
          <a
            href="/api/auth/signout"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold border border-border text-muted hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <svg className="w-3.5 h-3.5 shrink-0 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </a>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
      <PortalAssistant role={role} />
    </div>
  );
}
