import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH, DELETE } from "@/app/api/admin/clubs/[id]/route";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function makeFormDataRequest(method, fields = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, String(v));
  return new Request("http://localhost/api/admin/clubs/club-1", { method, body: fd });
}

function makeDeleteRequest() {
  return new Request("http://localhost/api/admin/clubs/club-1", { method: "DELETE" });
}

describe("PATCH /api/admin/clubs/[id]", () => {
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
    const res = await PATCH(makeFormDataRequest("PATCH", { name: "Test" }), {
      params: Promise.resolve({ id: "club-1" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-settl_admin", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "club_admin" }, error: null });
    const res = await PATCH(makeFormDataRequest("PATCH", { name: "Test" }), {
      params: Promise.resolve({ id: "club-1" }),
    });
    expect(res.status).toBe(403);
  });

  it("returns 200 ok on valid update", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    const res = await PATCH(
      makeFormDataRequest("PATCH", { name: "Updated Club", type: "university", seat_limit: "50", active: "true", plan: "premium" }),
      { params: Promise.resolve({ id: "club-1" }) }
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it("returns 500 when Supabase update fails", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    mockAdmin._chain.eq.mockResolvedValueOnce({ error: { message: "constraint violation" } });
    const res = await PATCH(
      makeFormDataRequest("PATCH", { name: "Bad Club", type: "university", seat_limit: "10", active: "true" }),
      { params: Promise.resolve({ id: "club-1" }) }
    );
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/admin/clubs/[id]", () => {
  let mockServer, mockAdmin;

  beforeEach(() => {
    mockServer = buildSupabaseMock();
    mockAdmin = buildSupabaseMock();
    createClient.mockResolvedValue(mockServer);
    createAdminClient.mockReturnValue(mockAdmin);
    mockAdmin._chain.select.mockReturnThis();
    mockAdmin._chain.eq.mockResolvedValue({ data: [], error: null });
    mockAdmin._chain.delete.mockReturnThis();
    mockAdmin._chain.in.mockResolvedValue({ error: null });
    mockAdmin._chain.update.mockReturnThis();
  });

  it("returns 401 when unauthenticated", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await DELETE(makeDeleteRequest(), { params: Promise.resolve({ id: "club-1" }) });
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-settl_admin", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "club_admin" }, error: null });
    const res = await DELETE(makeDeleteRequest(), { params: Promise.resolve({ id: "club-1" }) });
    expect(res.status).toBe(403);
  });

  it("returns 200 ok when deletion succeeds", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockServer._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    // requests lookup returns empty (no cascading needed)
    mockAdmin.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ error: null }),
    });
    const res = await DELETE(makeDeleteRequest(), { params: Promise.resolve({ id: "club-1" }) });
    expect(res.status).toBe(200);
  });
});
