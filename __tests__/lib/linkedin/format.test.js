import { describe, it, expect } from "vitest";
import { convertMarkdownBold } from "@/lib/linkedin/format";

describe("convertMarkdownBold", () => {
  it("converts a single bold word to Unicode bold", () => {
    const result = convertMarkdownBold("**hello**");
    // Unicode bold letters are above U+FFFF (2 UTF-16 code units each), so
    // check code-point count rather than .length.
    expect(result).not.toBe("**hello**");
    expect(result).not.toContain("*");
    expect([...result].length).toBe(5);
  });

  it("converts bold text mid-sentence", () => {
    const result = convertMarkdownBold("This is **important** today.");
    expect(result).not.toContain("**");
    expect(result.startsWith("This is ")).toBe(true);
    expect(result.endsWith(" today.")).toBe(true);
  });

  it("converts multiple bold spans in one string", () => {
    const result = convertMarkdownBold("**Hello** world **again**");
    expect(result).not.toContain("**");
    // Plain words between bold spans should remain ASCII
    expect(result).toContain(" world ");
  });

  it("leaves text without markdown bold unchanged", () => {
    const input = "No bold here at all.";
    expect(convertMarkdownBold(input)).toBe(input);
  });

  it("converts bold digits to Unicode bold digits", () => {
    const result = convertMarkdownBold("**123**");
    expect(result).not.toContain("*");
    expect([...result].length).toBe(3);
  });

  it("leaves non-alphanumeric characters inside bold spans unchanged", () => {
    const result = convertMarkdownBold("**hello, world!**");
    expect(result).not.toContain("*");
    expect(result).toContain(",");
    expect(result).toContain("!");
  });

  it("handles empty string", () => {
    expect(convertMarkdownBold("")).toBe("");
  });

  it("handles unclosed bold markers as plain text", () => {
    const input = "This is **not closed";
    expect(convertMarkdownBold(input)).toBe(input);
  });
});
