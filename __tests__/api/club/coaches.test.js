import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST, DELETE } from "@/app/api/club/coaches/route";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function makePost(body) {
  return new Request("http://localhost/api/club/coaches", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function makeDelete(body) {
  return new Request("http://localhost/api/club/coaches", {
    method: "DELETE",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/club/coaches", () => {
  let mockServer, mockAdmin;

  beforeEach(() => {
    mockServer = buildSupabaseMock();
    mockAdmin = buildSupabaseMock();
    createClient.mockResolvedValue(mockServer);
    createAdminClient.mockReturnValue(mockAdmin);
  });

  it("returns 401 when unauthenticated", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-club_admin", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "coach", club_id: "c1" }, error: null });
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it("returns coaches and pending invites for club_admin", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null });
    // Two separate query chains: coaches, pending invites
    mockAdmin.from
      .mockReturnValueOnce({ // profiles (admin check)
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null }),
      })
      .mockReturnValueOnce({ // coaches list
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [{ id: "coach-1", full_name: "Coach Rivera", sport: "Soccer" }], error: null }),
      })
      .mockReturnValueOnce({ // pending invites
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      });

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.coaches)).toBe(true);
    expect(Array.isArray(json.pending)).toBe(true);
  });
});

describe("POST /api/club/coaches", () => {
  let mockServer, mockAdmin;

  beforeEach(() => {
    mockServer = buildSupabaseMock();
    mockAdmin = buildSupabaseMock();
    createClient.mockResolvedValue(mockServer);
    createAdminClient.mockReturnValue(mockAdmin);
  });

  it("returns 401 when unauthenticated", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await POST(makePost({ email: "a@b.com", sport: "Soccer" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when email is missing", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null });
    const res = await POST(makePost({ sport: "Soccer" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when sport is missing", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null });
    const res = await POST(makePost({ email: "coach@test.com" }));
    expect(res.status).toBe(400);
  });

  it("returns 409 when invite already exists", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    // profile, club name, existing pending invite
    const responses = [
      { data: { role: "club_admin", club_id: "c1" }, error: null },
      { data: { name: "State U" }, error: null },
      { data: { id: "existing-invite" }, error: null },
    ];
    let c = 0;
    mockAdmin._chain.single.mockImplementation(() => Promise.resolve(responses[c++]));
    mockAdmin._chain.maybeSingle = vi.fn().mockResolvedValue({ data: { id: "existing-invite" }, error: null });

    const res = await POST(makePost({ email: "coach@test.com", sport: "Soccer" }));
    expect(res.status).toBe(409);
  });
});

describe("DELETE /api/club/coaches", () => {
  let mockServer, mockAdmin;

  beforeEach(() => {
    mockServer = buildSupabaseMock();
    mockAdmin = buildSupabaseMock();
    createClient.mockResolvedValue(mockServer);
    createAdminClient.mockReturnValue(mockAdmin);
    mockAdmin._chain.delete.mockReturnThis();
    mockAdmin._chain.eq.mockResolvedValue({ error: null });
  });

  it("returns 401 when unauthenticated", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await DELETE(makeDelete({ id: "c1", type: "pending" }));
    expect(res.status).toBe(401);
  });

  it("returns 200 ok when deleting a pending invite", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    // The DELETE handler calls admin.from("profiles").select().eq().eq().eq().single()
    // Each from() call on mockAdmin returns the same chain, so we need from() to
    // always resolve single() with a club_admin profile.
    mockAdmin.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null }),
    });
    const res = await DELETE(makeDelete({ id: "invite-1", type: "pending" }));
    expect(res.status).toBe(200);
  });

  it("returns 200 ok when removing an active coach", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: "club_admin", club_id: "c1" }, error: null }),
    });
    const res = await DELETE(makeDelete({ id: "coach-1", type: "active" }));
    expect(res.status).toBe(200);
  });
});
