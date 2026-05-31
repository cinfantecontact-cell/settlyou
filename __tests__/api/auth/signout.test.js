import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/auth/signout/route";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

describe("GET /api/auth/signout", () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = buildSupabaseMock();
    createClient.mockResolvedValue(mockSupabase);
    vi.mocked(redirect).mockClear();
  });

  it("calls supabase.auth.signOut", async () => {
    try { await GET(); } catch {}
    expect(mockSupabase.auth.signOut).toHaveBeenCalledOnce();
  });

  it("redirects to /login after sign out", async () => {
    let redirectUrl;
    vi.mocked(redirect).mockImplementation((url) => {
      redirectUrl = url;
      throw new Error("NEXT_REDIRECT");
    });
    try { await GET(); } catch {}
    expect(redirectUrl).toBe("/login");
  });
});
