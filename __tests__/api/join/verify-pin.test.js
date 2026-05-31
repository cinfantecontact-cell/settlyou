import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/join/[slug]/verify-pin/route";
import { createAdminClient } from "@/lib/supabase/admin";

function makeRequest(pin) {
  return new Request("http://localhost/api/join/test-club/verify-pin", {
    method: "POST",
    body: JSON.stringify({ pin }),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/join/[slug]/verify-pin", () => {
  let mockAdmin;

  beforeEach(() => {
    mockAdmin = buildSupabaseMock();
    createAdminClient.mockReturnValue(mockAdmin);
    // Default: insert events always succeeds
    mockAdmin._chain.insert.mockResolvedValue({ error: null });
  });

  it("returns 404 when club not found", async () => {
    mockAdmin._chain.single.mockResolvedValue({ data: null, error: { message: "not found" } });
    const res = await POST(makeRequest("1234"), { params: Promise.resolve({ slug: "unknown" }) });
    expect(res.status).toBe(404);
  });

  it("returns 404 when club is inactive", async () => {
    mockAdmin._chain.single.mockResolvedValue({
      data: { id: "club-1", pin: "1234", active: false }, error: null,
    });
    const res = await POST(makeRequest("1234"), { params: Promise.resolve({ slug: "test-club" }) });
    expect(res.status).toBe(404);
  });

  it("returns 403 for wrong PIN", async () => {
    mockAdmin._chain.single.mockResolvedValue({
      data: { id: "club-1", pin: "1234", active: true }, error: null,
    });
    const res = await POST(makeRequest("9999"), { params: Promise.resolve({ slug: "test-club" }) });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toContain("Incorrect PIN");
  });

  it("logs a failed pin attempt event on wrong PIN", async () => {
    mockAdmin._chain.single.mockResolvedValue({
      data: { id: "club-1", pin: "1234", active: true }, error: null,
    });
    await POST(makeRequest("9999"), { params: Promise.resolve({ slug: "test-club" }) });
    expect(mockAdmin._chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ event_type: "pin_attempt_failed" })
    );
  });

  it("returns 200 ok for correct PIN", async () => {
    mockAdmin._chain.single.mockResolvedValue({
      data: { id: "club-1", pin: "1234", active: true }, error: null,
    });
    const res = await POST(makeRequest("1234"), { params: Promise.resolve({ slug: "test-club" }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it("returns 200 ok when club has no PIN set", async () => {
    mockAdmin._chain.single.mockResolvedValue({
      data: { id: "club-1", pin: null, active: true }, error: null,
    });
    const res = await POST(makeRequest(null), { params: Promise.resolve({ slug: "test-club" }) });
    expect(res.status).toBe(200);
  });

  it("logs a success event on correct PIN", async () => {
    mockAdmin._chain.single.mockResolvedValue({
      data: { id: "club-1", pin: "1234", active: true }, error: null,
    });
    await POST(makeRequest("1234"), { params: Promise.resolve({ slug: "test-club" }) });
    expect(mockAdmin._chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ event_type: "pin_attempt_success" })
    );
  });
});
