import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "@/app/api/club/pin/route";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function makeRequest(body) {
  return new Request("http://localhost/api/club/pin", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("PATCH /api/club/pin", () => {
  let mockServer, mockAdmin;

  beforeEach(() => {
    mockServer = buildSupabaseMock();
    mockAdmin = buildSupabaseMock();
    createClient.mockResolvedValue(mockServer);
    createAdminClient.mockReturnValue(mockAdmin);
    mockAdmin._chain.update.mockReturnThis();
    mockAdmin._chain.eq.mockResolvedValue({ error: null });
  });

  it("returns 401 when unauthenticated", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await PATCH(makeRequest({ pin: "1234" }));
    expect(res.status).toBe(401);
  });

  it("returns 403 when not a club_admin", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "coach", club_id: "c1" }, error: null });
    const res = await PATCH(makeRequest({ pin: "1234" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when PIN is not exactly 4 digits", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null });
    const res = await PATCH(makeRequest({ pin: "123" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("4 digits");
  });

  it("returns 400 when PIN contains letters", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null });
    const res = await PATCH(makeRequest({ pin: "12ab" }));
    expect(res.status).toBe(400);
  });

  it("returns 200 ok for valid 4-digit PIN", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null });
    const res = await PATCH(makeRequest({ pin: "4567" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it("clears the PIN when null is passed", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null });
    const res = await PATCH(makeRequest({ pin: null }));
    expect(res.status).toBe(200);
  });
});
