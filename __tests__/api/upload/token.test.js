import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/upload/[token]/route";
import { createAdminClient } from "@/lib/supabase/admin";

function makeRequest() {
  return new Request("http://localhost/api/upload/tok-abc");
}

describe("GET /api/upload/[token]", () => {
  let mockAdmin;

  beforeEach(() => {
    mockAdmin = buildSupabaseMock();
    createAdminClient.mockReturnValue(mockAdmin);
  });

  it("returns 404 for an unknown token", async () => {
    mockAdmin._chain.single.mockResolvedValue({ data: null, error: { message: "not found" } });
    const res = await GET(makeRequest(), { params: Promise.resolve({ token: "bad-token" }) });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toContain("Invalid upload link");
  });

  it("returns athlete name and club name for a valid token", async () => {
    mockAdmin._chain.single
      // First call: requests table
      .mockResolvedValueOnce({
        data: { id: "req-1", athlete_name: "Marcus R.", club_id: "club-1", sport: null, clubs: { name: "State U" } },
        error: null,
      });

    // Promise.all sub-queries: submitted docs, sportConfig, custom docs
    mockAdmin._chain.select.mockReturnThis();
    mockAdmin._chain.eq.mockReturnThis();
    mockAdmin._chain.order.mockResolvedValue({ data: [] });
    mockAdmin._chain.single.mockResolvedValue({ data: null, error: null });

    const res = await GET(makeRequest(), { params: Promise.resolve({ token: "tok-abc" }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.athleteName).toBe("Marcus R.");
    expect(json.clubName).toBe("State U");
    expect(Array.isArray(json.documentTypes)).toBe(true);
    expect(Array.isArray(json.submitted)).toBe(true);
  });
});
