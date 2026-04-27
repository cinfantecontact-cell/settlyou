import { createAdminClient } from "@/lib/supabase/admin";

export async function getValidToken() {
  const admin = createAdminClient();
  const { data: token } = await admin
    .from("linkedin_tokens")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!token) return null;

  // Refresh if expiring within 1 hour
  if (new Date(token.expires_at) < new Date(Date.now() + 3600000)) {
    return await refreshToken(admin, token);
  }

  return token;
}

async function refreshToken(admin, token) {
  if (!token.refresh_token) return null;

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    console.error("[linkedin] token refresh failed:", res.status);
    return null;
  }

  const data = await res.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

  const { error } = await admin
    .from("linkedin_tokens")
    .update({
      access_token: data.access_token,
      refresh_token: data.refresh_token || token.refresh_token,
      expires_at: expiresAt,
    })
    .eq("id", token.id);

  if (error) console.error("[linkedin] failed to save refreshed token:", error);

  return { ...token, access_token: data.access_token, expires_at: expiresAt };
}

export async function publishPost(content) {
  const token = await getValidToken();
  if (!token) throw new Error("No LinkedIn token configured");

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: `urn:li:organization:${token.organization_id}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn API error ${res.status}: ${body}`);
  }

  return await res.json();
}

export async function publishScheduledPosts() {
  const token = await getValidToken();
  if (!token) {
    console.log("[linkedin] no token configured — skipping publish");
    return [];
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data: posts } = await admin
    .from("linkedin_posts")
    .select("*")
    .eq("status", "scheduled")
    .lte("scheduled_for", now);

  if (!posts?.length) return [];

  const results = [];

  for (const post of posts) {
    try {
      const response = await publishPost(post.content);
      await admin
        .from("linkedin_posts")
        .update({
          status: "published",
          published_at: now,
          linkedin_post_id: response.id || null,
        })
        .eq("id", post.id);
      results.push({ id: post.id, ok: true });
    } catch (err) {
      await admin
        .from("linkedin_posts")
        .update({ status: "failed", error_message: err.message })
        .eq("id", post.id);
      results.push({ id: post.id, ok: false, error: err.message });
    }
  }

  return results;
}
