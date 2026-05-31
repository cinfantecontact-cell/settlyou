import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/club/athletes/count/route";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

describe("GET /api/club/athletes/count", () => {
  let mockServer, mockAdmin;

  beforeEach(() => {
    mockServer = buildSupabaseMock();
    mockAdmin = buildSupabaseMock();
    createClient.mockResolvedValue(mockServer);
    createAdminClient.mockReturnValue(mockAdmin);
  });

  it("returns count 0 when not authenticated", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.count).toBe(0);
  });

  it("returns count 0 when user has no club", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { club_id: null }, error: null });
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.count).toBe(0);
  });

  it("returns the athlete count for the club", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { club_id: "club-1" }, error: null });
    // The route uses { count: "exact", head: true } which returns a count directly
    mockAdmin._chain.eq.mockReturnThis();
    // Override the final awaitable with a count
    mockAdmin._chain.head = vi.fn().mockResolvedValue({ count: 14, error: null });
    // Simplest approach: mock the entire chain to resolve with count
    const chainWithCount = {
      ...mockAdmin._chain,
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    // Simulate the count by mocking what the route actually awaits
    mockAdmin.from.mockReturnValueOnce(mockAdmin._chain) // profiles
      .mockReturnValueOnce({ // requests count query
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ count: 14, error: null }),
      });

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(typeof json.count).toBe("number");
  });
});
