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
        <nav className="flex flex-col gap-0.5">
          <a
            href="/club"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
          <a
            href="/club/athletes"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Athletes
          </a>
          <a
            href="/club/billing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Plan & Billing
          </a>
          <a
            href="/club/account"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account
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
