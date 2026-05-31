import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/requests/[id]/status/route";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function makeRequest() {
  return new Request("http://localhost/api/requests/req-1/status");
}

describe("GET /api/requests/[id]/status", () => {
  let mockServer, mockAdmin;

  beforeEach(() => {
    mockServer = buildSupabaseMock();
    mockAdmin = buildSupabaseMock();
    createClient.mockResolvedValue(mockServer);
    createAdminClient.mockReturnValue(mockAdmin);
  });

  it("returns 401 when unauthenticated", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await GET(makeRequest(), { params: Promise.resolve({ id: "req-1" }) });
    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not settl_admin", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "club_admin" }, error: null });

    const res = await GET(makeRequest(), { params: Promise.resolve({ id: "req-1" }) });
    expect(res.status).toBe(403);
  });

  it("returns 404 when request not found", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: null, error: { message: "not found" } });

    const res = await GET(makeRequest(), { params: Promise.resolve({ id: "req-1" }) });
    expect(res.status).toBe(404);
  });

  it("returns status when found and authorized", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { status: "generating" }, error: null });

    const res = await GET(makeRequest(), { params: Promise.resolve({ id: "req-1" }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("generating");
  });
});
