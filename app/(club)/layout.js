import SidebarNav from "./club/_components/SidebarNav";

export default function ClubLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-60 bg-white border-r border-border flex flex-col py-6 px-3 shrink-0">
        {/* Logo */}
        <a href="/" className="px-3 mb-6 block">
          <img src="/settlyou-logo.png" alt="Settl" className="h-8 rounded-md" />
        </a>

        {/* Section label */}
        <span className="text-[10px] font-semibold text-muted px-3 mb-2 uppercase tracking-widest">
          Portal
        </span>

        {/* Nav items */}
        <SidebarNav />

        {/* Sign out */}
        <div className="mt-auto pt-4 border-t border-border">
          <a
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </a>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
