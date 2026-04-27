import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  const expectedState = request.cookies.get("linkedin_oauth_state")?.value;
  const clearStateCookie = (res) => {
    res.cookies.set("linkedin_oauth_state", "", { maxAge: 0, path: "/" });
    return res;
  };

  if (error || !code) {
    return clearStateCookie(
      NextResponse.redirect(
        new URL(`/admin/linkedin?error=${error || "no_code"}`, baseUrl)
      )
    );
  }

  if (!expectedState || state !== expectedState) {
    return clearStateCookie(
      NextResponse.redirect(
        new URL("/admin/linkedin?error=state_mismatch", baseUrl)
      )
    );
  }

  // Exchange code for tokens
  const tokenRes = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${baseUrl}/api/admin/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    }
  );

  if (!tokenRes.ok) {
    console.error("[linkedin] token exchange failed:", tokenRes.status);
    return NextResponse.redirect(
      new URL("/admin/linkedin?error=token_exchange", baseUrl)
    );
  }

  const tokenData = await tokenRes.json();
  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toISOString();

  const admin = createAdminClient();

  // Store token — use LINKEDIN_ORGANIZATION_ID from env or default empty
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID || "";

  const { error: dbError } = await admin.from("linkedin_tokens").insert({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token || null,
    expires_at: expiresAt,
    organization_id: orgId,
  });

  if (dbError) {
    console.error("[linkedin] failed to store token:", dbError);
    return NextResponse.redirect(
      new URL("/admin/linkedin?error=db_save", baseUrl)
    );
  }

  return clearStateCookie(
    NextResponse.redirect(new URL("/admin/linkedin?connected=1", baseUrl))
  );
}
