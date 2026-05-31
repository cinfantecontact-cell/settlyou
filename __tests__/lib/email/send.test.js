import { describe, it, expect, vi, beforeEach } from "vitest";
import { Resend } from "resend";
import {
  sendAthleteReportReady,
  sendClubGuideDelivered,
  sendGenerationFailureAlert,
  sendClubWeeklyRecap,
  sendCoachInvite,
  sendDocumentReminder,
  sendAdminNewSubmission,
} from "@/lib/email/send";

// Fresh spy on resend.emails.send for each test
let sendSpy;
beforeEach(() => {
  sendSpy = vi.fn().mockResolvedValue({ data: { id: "email-123" }, error: null });
  Resend.mockImplementation(function () { return { emails: { send: sendSpy } }; });
});

// ── sendAthleteReportReady ────────────────────────────────────────────────────
describe("sendAthleteReportReady", () => {
  const base = {
    athleteName: "Marcus Rodriguez",
    athleteEmail: "marcus@example.com",
    clubName: "State University",
    reportToken: "tok-abc",
    uploadToken: "upl-xyz",
  };

  it("sends email to the athlete's address", async () => {
    await sendAthleteReportReady(base);
    expect(sendSpy).toHaveBeenCalledOnce();
    expect(sendSpy.mock.calls[0][0].to).toBe("marcus@example.com");
  });

  it("subject includes the athlete's first name", async () => {
    await sendAthleteReportReady(base);
    expect(sendSpy.mock.calls[0][0].subject).toContain("Marcus");
  });

  it("HTML body contains the report URL", async () => {
    await sendAthleteReportReady(base);
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).toContain("https://staging.settlyou.com/report/tok-abc");
  });

  it("HTML body contains the upload URL when uploadToken is provided", async () => {
    await sendAthleteReportReady(base);
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).toContain("https://staging.settlyou.com/upload/upl-xyz");
  });

  it("HTML body omits the upload button when uploadToken is null", async () => {
    await sendAthleteReportReady({ ...base, uploadToken: null });
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).not.toContain("/upload/");
  });

  it("sends from noreply@settlyou.com", async () => {
    await sendAthleteReportReady(base);
    expect(sendSpy.mock.calls[0][0].from).toContain("noreply@settlyou.com");
  });
});

// ── sendClubGuideDelivered ────────────────────────────────────────────────────
describe("sendClubGuideDelivered", () => {
  const base = {
    athleteName: "Jaime Lopez",
    athleteEmail: "jaime@example.com",
    clubAdminEmail: "admin@university.edu",
    clubName: "City College",
    reportToken: "rep-123",
  };

  it("sends to the club admin email", async () => {
    await sendClubGuideDelivered(base);
    expect(sendSpy.mock.calls[0][0].to).toBe("admin@university.edu");
  });

  it("subject includes the athlete name", async () => {
    await sendClubGuideDelivered(base);
    expect(sendSpy.mock.calls[0][0].subject).toContain("Jaime Lopez");
  });

  it("HTML body contains the report URL", async () => {
    await sendClubGuideDelivered(base);
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).toContain("https://staging.settlyou.com/report/rep-123");
  });

  it("HTML body includes athlete email when provided", async () => {
    await sendClubGuideDelivered(base);
    expect(sendSpy.mock.calls[0][0].html).toContain("jaime@example.com");
  });

  it("HTML body omits athlete email when not provided", async () => {
    await sendClubGuideDelivered({ ...base, athleteEmail: undefined });
    expect(sendSpy.mock.calls[0][0].html).not.toContain("jaime@example.com");
  });
});

// ── sendGenerationFailureAlert ────────────────────────────────────────────────
describe("sendGenerationFailureAlert", () => {
  const base = {
    athleteName: "Paulo Silva",
    clubName: "Lakeside University",
    requestId: "req-999",
    errorMessage: "Timeout after 30s",
  };

  it("sends to the internal alert address", async () => {
    await sendGenerationFailureAlert(base);
    expect(sendSpy.mock.calls[0][0].to).toBe("cinfante.contact@gmail.com");
  });

  it("subject contains athlete name and club", async () => {
    await sendGenerationFailureAlert(base);
    const subject = sendSpy.mock.calls[0][0].subject;
    expect(subject).toContain("Paulo Silva");
    expect(subject).toContain("Lakeside University");
  });

  it("HTML body includes the error message", async () => {
    await sendGenerationFailureAlert(base);
    expect(sendSpy.mock.calls[0][0].html).toContain("Timeout after 30s");
  });

  it("falls back to 'Unknown error' when errorMessage is undefined", async () => {
    await sendGenerationFailureAlert({ ...base, errorMessage: undefined });
    expect(sendSpy.mock.calls[0][0].html).toContain("Unknown error");
  });

  it("HTML body links to the admin panel for the request", async () => {
    await sendGenerationFailureAlert(base);
    expect(sendSpy.mock.calls[0][0].html).toContain("/admin/relocations/req-999");
  });
});

// ── sendClubWeeklyRecap ───────────────────────────────────────────────────────
describe("sendClubWeeklyRecap", () => {
  const base = {
    clubName: "Riverside Athletics",
    adminEmail: "ad@riverside.edu",
    dashboardUrl: "https://staging.settlyou.com/dashboard",
    stats: { delivered: 5, opened: 3, pending: 2, total: 12 },
  };

  it("sends to the admin email", async () => {
    await sendClubWeeklyRecap(base);
    expect(sendSpy.mock.calls[0][0].to).toBe("ad@riverside.edu");
  });

  it("subject includes club name", async () => {
    await sendClubWeeklyRecap(base);
    expect(sendSpy.mock.calls[0][0].subject).toContain("Riverside Athletics");
  });

  it("HTML body shows all four stats", async () => {
    await sendClubWeeklyRecap(base);
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).toContain("5");
    expect(html).toContain("3");
    expect(html).toContain("2");
    expect(html).toContain("12");
  });

  it("HTML body contains the dashboard link", async () => {
    await sendClubWeeklyRecap(base);
    expect(sendSpy.mock.calls[0][0].html).toContain(
      "https://staging.settlyou.com/dashboard"
    );
  });
});

// ── sendCoachInvite ───────────────────────────────────────────────────────────
describe("sendCoachInvite", () => {
  const base = {
    coachEmail: "coach.rivera@example.com",
    clubName: "North Valley University",
    sport: "Men's Soccer",
    inviteUrl: "https://staging.settlyou.com/join/coach/tok-coach",
  };

  it("sends to the coach email", async () => {
    await sendCoachInvite(base);
    expect(sendSpy.mock.calls[0][0].to).toBe("coach.rivera@example.com");
  });

  it("subject mentions the club name", async () => {
    await sendCoachInvite(base);
    expect(sendSpy.mock.calls[0][0].subject).toContain("North Valley University");
  });

  it("HTML body contains the invite URL", async () => {
    await sendCoachInvite(base);
    expect(sendSpy.mock.calls[0][0].html).toContain(
      "https://staging.settlyou.com/join/coach/tok-coach"
    );
  });

  it("HTML body mentions the sport", async () => {
    await sendCoachInvite(base);
    expect(sendSpy.mock.calls[0][0].html).toContain("Men's Soccer");
  });
});

// ── sendDocumentReminder ──────────────────────────────────────────────────────
describe("sendDocumentReminder", () => {
  const base = {
    athleteName: "Marcus Rodriguez",
    athleteEmail: "marcus@example.com",
    clubName: "State University",
    uploadToken: "upl-xyz",
    missingDocs: ["Passport", "Medical Form"],
    reminderCount: 1,
  };

  it("sends to the athlete email", async () => {
    await sendDocumentReminder(base);
    expect(sendSpy.mock.calls[0][0].to).toBe("marcus@example.com");
  });

  it("first reminder uses 'Action needed' subject", async () => {
    await sendDocumentReminder(base);
    expect(sendSpy.mock.calls[0][0].subject).toContain("Action needed");
  });

  it("second reminder uses 'Reminder' subject", async () => {
    await sendDocumentReminder({ ...base, reminderCount: 2 });
    expect(sendSpy.mock.calls[0][0].subject).toContain("Reminder");
  });

  it("HTML body lists each missing document", async () => {
    await sendDocumentReminder(base);
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).toContain("Passport");
    expect(html).toContain("Medical Form");
  });

  it("HTML body contains the upload URL", async () => {
    await sendDocumentReminder(base);
    expect(sendSpy.mock.calls[0][0].html).toContain(
      "https://staging.settlyou.com/upload/upl-xyz"
    );
  });

  it("addresses the athlete by first name only", async () => {
    await sendDocumentReminder(base);
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).toContain("Marcus");
    expect(html).not.toContain("Marcus Rodriguez");
  });
});

// ── sendAdminNewSubmission ────────────────────────────────────────────────────
describe("sendAdminNewSubmission", () => {
  const base = {
    athleteName: "Jaime Lopez",
    clubName: "City College",
    destinationCity: "Austin",
    destinationCountry: "USA",
  };

  it("sends to the internal admin address", async () => {
    await sendAdminNewSubmission(base);
    expect(sendSpy.mock.calls[0][0].to).toBe("cinfante.contact@gmail.com");
  });

  it("subject includes athlete name and club", async () => {
    await sendAdminNewSubmission(base);
    const subject = sendSpy.mock.calls[0][0].subject;
    expect(subject).toContain("Jaime Lopez");
    expect(subject).toContain("City College");
  });

  it("HTML body shows destination city and country", async () => {
    await sendAdminNewSubmission(base);
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).toContain("Austin");
    expect(html).toContain("USA");
  });

  it("HTML body omits country separator when destinationCountry is empty", async () => {
    await sendAdminNewSubmission({ ...base, destinationCountry: "" });
    const html = sendSpy.mock.calls[0][0].html;
    expect(html).not.toContain("Austin,");
  });
});
