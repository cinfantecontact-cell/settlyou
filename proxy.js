import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // Skip auth entirely for auth pages — prevents loops on stale cookies
  const authPaths = ["/login", "/signup", "/forgot-password", "/reset-password", "/auth/callback"];
  if (authPaths.some((p) => pathname.startsWith(p))) {
    return supabaseResponse;
  }

  // Always call getUser — this refreshes the session token and sets updated
  // cookies on supabaseResponse. Skipping this causes sessions to expire
  // when the user switches tabs or goes idle.
  const { data: { user } } = await supabase.auth.getUser();

  const protectedPaths = ["/dashboard", "/requests", "/admin", "/club"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    request.cookies.getAll().forEach(({ name }) => {
      if (name.startsWith("sb-")) {
        response.cookies.delete(name);
      }
    });
    return response;
  }

  // Always return supabaseResponse — it carries the refreshed auth cookies.
  // Without this, token refresh cookies get lost and the session expires.
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
