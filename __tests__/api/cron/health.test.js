import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/cron/health/route";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

function makeRequest(secret = "test-cron-secret") {
  return new Request("http://localhost/api/cron/health", {
    headers: { authorization: `Bearer ${secret}` },
  });
}

describe("GET /api/cron/health", () => {
  let mockAdmin, sendSpy;

  beforeEach(() => {
    mockAdmin = buildSupabaseMock();
    createAdminClient.mockReturnValue(mockAdmin);
    sendSpy = vi.fn().mockResolvedValue({ data: { id: "email-1" }, error: null });
    Resend.mockImplementation(function () { return { emails: { send: sendSpy } }; });
    // Default: no stuck requests
    mockAdmin._chain.lt.mockResolvedValue({ data: [], error: null });
    mockAdmin._chain.update.mockReturnThis();
    mockAdmin._chain.in.mockResolvedValue({ error: null });
  });

  it("returns 401 with wrong cron secret", async () => {
    const res = await GET(makeRequest("wrong-secret"));
    expect(res.status).toBe(401);
  });

  it("returns 200 ok with correct cron secret", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it("reports zero issues when all requests are healthy", async () => {
    const res = await GET(makeRequest());
    const json = await res.json();
    expect(json.issues_found).toBe(0);
    expect(json.issues).toHaveLength(0);
  });

  it("does not send an alert email when there are no issues", async () => {
    await GET(makeRequest());
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it("resets stuck-generating requests back to submitted", async () => {
    const stuckReqs = [
      { id: "req-1", athlete_name: "Marcus R.", clubs: { name: "State U" } },
    ];
    // First lt call = stuck generating, second = stuck submitted (none)
    mockAdmin._chain.lt
      .mockResolvedValueOnce({ data: stuckReqs, error: null })
      .mockResolvedValueOnce({ data: [], error: null });

    await GET(makeRequest());
    expect(mockAdmin._chain.update).toHaveBeenCalledWith({ status: "submitted" });
  });

  it("sends an alert email when stuck requests are found", async () => {
    const stuckReqs = [
      { id: "req-1", athlete_name: "Marcus R.", clubs: { name: "State U" } },
    ];
    mockAdmin._chain.lt
      .mockResolvedValueOnce({ data: stuckReqs, error: null })
      .mockResolvedValueOnce({ data: [], error: null });

    await GET(makeRequest());
    expect(sendSpy).toHaveBeenCalledOnce();
    const emailCall = sendSpy.mock.calls[0][0];
    expect(emailCall.subject).toContain("Alert");
  });

  it("includes the issue count in the response when issues found", async () => {
    const stuckReqs = [
      { id: "req-1", athlete_name: "Marcus R.", clubs: { name: "State U" } },
      { id: "req-2", athlete_name: "Paulo S.", clubs: { name: "City U" } },
    ];
    mockAdmin._chain.lt
      .mockResolvedValueOnce({ data: stuckReqs, error: null })
      .mockResolvedValueOnce({ data: [], error: null });

    const res = await GET(makeRequest());
    const json = await res.json();
    expect(json.issues_found).toBe(2);
  });

  it("includes a timestamp in the response", async () => {
    const res = await GET(makeRequest());
    const json = await res.json();
    expect(json.checked_at).toBeDefined();
    expect(() => new Date(json.checked_at)).not.toThrow();
  });
});
