export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-60 bg-white border-r border-border flex flex-col py-6 px-3 shrink-0">
        {/* Logo */}
        <a href="/" className="px-3 mb-6 block">
          <img src="/settlyou-logo.png" alt="Settl" className="h-8 rounded-md" />
        </a>

        {/* Section label */}
        <span className="text-[10px] font-semibold text-muted px-3 mb-2 uppercase tracking-widest">
          Admin
        </span>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5">
          <a
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Leads
          </a>
          <a
            href="/admin/clients"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Clients
          </a>
          <a
            href="/admin/relocations"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Relocations
          </a>
          <a
            href="/admin/analytics"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </a>
          <a
            href="/admin/billing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Billing
          </a>
        </nav>

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
