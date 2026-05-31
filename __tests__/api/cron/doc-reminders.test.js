import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/cron/doc-reminders/route";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDocumentReminder } from "@/lib/email/send";

function makeRequest(secret = "test-cron-secret") {
  return new Request("http://localhost/api/cron/doc-reminders", {
    headers: { authorization: `Bearer ${secret}` },
  });
}

vi.mock("@/lib/email/send", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, sendDocumentReminder: vi.fn().mockResolvedValue(undefined) };
});

describe("GET /api/cron/doc-reminders", () => {
  let mockAdmin;

  beforeEach(() => {
    mockAdmin = buildSupabaseMock();
    createAdminClient.mockReturnValue(mockAdmin);
    vi.mocked(sendDocumentReminder).mockClear();
    mockAdmin._chain.insert.mockResolvedValue({ error: null });
  });

  it("returns 401 with wrong cron secret", async () => {
    const res = await GET(makeRequest("bad-secret"));
    expect(res.status).toBe(401);
  });

  it("returns ok with sent=0 when there are no delivered requests", async () => {
    // Route: .eq("status","delivered").not("athlete_email",...).not("upload_token",...)
    // The second .not() is the final awaitable — returns empty data.
    mockAdmin.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      then: (resolve) => resolve({ data: [], error: null }),
    });

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.sent).toBe(0);
  });

  it("does not email athletes who have uploaded all docs", async () => {
    const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
    const req = {
      id: "req-1", club_id: "c1", athlete_name: "Marcus R.", athlete_email: "m@test.com",
      sport: "Soccer", upload_token: "upl-1", updated_at: fourDaysAgo,
    };

    const allDocsUploaded = ["passport","visa","transcript","transcript_translation",
      "english_test","eligibility_form","insurance","photo"]
      .map(key => ({ request_id: "req-1", document_type: key }));

    mockAdmin.from.mockImplementation((table) => {
      if (table === "requests") {
        const chain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          not: vi.fn().mockReturnThis(),
          then: (resolve) => resolve({ data: [req], error: null }),
        };
        return chain;
      }
      if (table === "athlete_documents") return {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: allDocsUploaded, error: null }),
        eq: vi.fn().mockReturnThis(),
      };
      // Default table handler — supports all chain methods
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
        insert: vi.fn().mockResolvedValue({ error: null }),
        then: (resolve) => resolve({ data: [], error: null }),
      };
    });

    const res = await GET(makeRequest());
    expect(vi.mocked(sendDocumentReminder)).not.toHaveBeenCalled();
    const json = await res.json();
    expect(json.sent).toBe(0);
  });
});
