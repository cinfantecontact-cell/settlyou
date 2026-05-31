import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/requests/route";
import { createClient } from "@/lib/supabase/server";

function makeRequest(body = {}) {
  return new Request("http://localhost/api/requests", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/requests", () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = buildSupabaseMock();
    createClient.mockResolvedValue(mockSupabase);
  });

  it("returns 401 when no user is authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await POST(makeRequest({ athlete_name: "Marcus" }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/unauthorized/i);
  });

  it("returns 403 when user has no organization", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } }, error: null,
    });
    mockSupabase._chain.single.mockResolvedValue({ data: { id: "user-1", organization_id: null }, error: null });

    const res = await POST(makeRequest({ athlete_name: "Marcus" }));
    expect(res.status).toBe(403);
  });

  it("returns 500 when the insert fails", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } }, error: null,
    });
    // Profile fetch (profiles table) returns ok; requests insert returns error.
    mockSupabase.from.mockImplementation((table) => {
      if (table === "profiles") return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: "user-1", organization_id: "org-1" }, error: null }),
      };
      // requests table: insert immediately resolves with an error
      return {
        insert: vi.fn().mockResolvedValue({ error: { message: "DB error" } }),
      };
    });

    const res = await POST(makeRequest({ athlete_name: "Marcus", destination_city: "Austin" }));
    expect(res.status).toBe(500);
  });

  it("returns 200 ok on successful insert", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } }, error: null,
    });
    const singleResponses = [
      { data: { id: "user-1", organization_id: "org-1" }, error: null },
      { data: null, error: null },
    ];
    let callCount = 0;
    mockSupabase._chain.single.mockImplementation(() =>
      Promise.resolve(singleResponses[callCount++] ?? { data: null, error: null })
    );

    const res = await POST(makeRequest({ athlete_name: "Marcus", destination_city: "Austin" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it("parses integer fields from strings", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } }, error: null,
    });
    const responses = [
      { data: { id: "user-1", organization_id: "org-1" }, error: null },
      { data: null, error: null },
    ];
    let c = 0;
    mockSupabase._chain.single.mockImplementation(() => Promise.resolve(responses[c++]));

    await POST(makeRequest({ athlete_age: "22", min_bedrooms: "3" }));
    const insertCall = mockSupabase._chain.insert.mock.calls[0][0];
    expect(insertCall.athlete_age).toBe(22);
    expect(insertCall.min_bedrooms).toBe(3);
  });
});
