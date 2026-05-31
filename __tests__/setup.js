import { vi } from "vitest";

// ── next/navigation ───────────────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url) => { throw Object.assign(new Error("NEXT_REDIRECT"), { url }); }),
  notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }),
}));

// ── next/headers ──────────────────────────────────────────────────────────────
// cookies() is async in Next.js 15+; return a minimal store by default.
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: () => [],
    set: vi.fn(),
  })),
}));

// ── next/server ───────────────────────────────────────────────────────────────
// Re-export the real NextResponse so API handlers work as-is.
// (Vitest node env has global fetch/Response via undici.)

// ── @supabase/ssr ─────────────────────────────────────────────────────────────
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => buildSupabaseMock()),
}));

// ── Supabase clients ──────────────────────────────────────────────────────────
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => buildSupabaseMock()),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => buildSupabaseMock()),
}));

// ── Resend ────────────────────────────────────────────────────────────────────
// Must use a regular function (not arrow) so `new Resend()` works.
vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return {
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: "mock-email-id" }, error: null }),
      },
    };
  }),
}));

// ── WhatsApp ──────────────────────────────────────────────────────────────────
vi.mock("@/lib/whatsapp/send", () => ({
  sendAthleteUploadLink: vi.fn().mockResolvedValue({ ok: true }),
}));

// ── AI generation ─────────────────────────────────────────────────────────────
vi.mock("@/lib/ai/generate-document", () => ({
  generateRelocationDocument: vi.fn().mockResolvedValue({
    meta: { title: "Mock Guide" },
    sections: [],
  }),
}));

// ── Anthropic ─────────────────────────────────────────────────────────────────
vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ text: "Mocked AI response" }],
      }),
    },
  })),
}));

// ── env defaults ──────────────────────────────────────────────────────────────
process.env.NEXT_PUBLIC_APP_URL = "https://staging.settlyou.com";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "mock-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "mock-service-role-key";
process.env.RESEND_API_KEY = "mock-resend-key";
process.env.ANTHROPIC_API_KEY = "mock-anthropic-key";
process.env.CRON_SECRET = "test-cron-secret";

// ── Supabase mock builder ─────────────────────────────────────────────────────
// Returns a chainable mock that each test can override via vi.mocked().
export function buildSupabaseMock(overrides = {}) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  };

  const fromFn = vi.fn().mockReturnValue(chain);

  return {
    from: fromFn,
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    _chain: chain,
  };
}

// Expose builder globally so individual tests can call it
global.buildSupabaseMock = buildSupabaseMock;
