import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/admin/reset-password/route";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function makeRequest(body) {
  return new Request("http://localhost/api/admin/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/admin/reset-password", () => {
  let mockServer, mockAdmin;

  beforeEach(() => {
    mockServer = buildSupabaseMock();
    mockAdmin = buildSupabaseMock();
    createClient.mockResolvedValue(mockServer);
    createAdminClient.mockReturnValue(mockAdmin);
    mockServer.auth.resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });
  });

  it("returns 401 when unauthenticated", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await POST(makeRequest({ email: "test@test.com" }));
    expect(res.status).toBe(401);
  });

  it("returns 403 when user is not settl_admin", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "club_admin" }, error: null });
    const res = await POST(makeRequest({ email: "test@test.com" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when neither email nor userId is provided", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Email is required");
  });

  it("returns 200 ok when email is provided and reset succeeds", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    const res = await POST(makeRequest({ email: "club@example.com" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it("calls resetPasswordForEmail with correct email", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    await POST(makeRequest({ email: "club@example.com" }));
    expect(mockServer.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      "club@example.com",
      expect.objectContaining({ redirectTo: expect.stringContaining("/reset-password") })
    );
  });

  it("resolves email from userId when email not provided", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    mockAdmin.auth.admin = {
      getUserById: vi.fn().mockResolvedValue({ data: { user: { email: "resolved@example.com" } } }),
    };
    const res = await POST(makeRequest({ userId: "target-user-id" }));
    expect(res.status).toBe(200);
    expect(mockServer.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      "resolved@example.com",
      expect.any(Object)
    );
  });

  it("returns 500 when Supabase reset fails", async () => {
    mockServer.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    mockAdmin._chain.single.mockResolvedValue({ data: { role: "settl_admin" }, error: null });
    mockServer.auth.resetPasswordForEmail = vi.fn().mockResolvedValue({ error: { message: "Rate limited" } });
    const res = await POST(makeRequest({ email: "club@example.com" }));
    expect(res.status).toBe(500);
  });
});
