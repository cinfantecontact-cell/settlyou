import { describe, it, expect } from "vitest";
import { formatCountry } from "@/lib/format-country";

describe("formatCountry", () => {
  it("abbreviates United States to USA", () => {
    expect(formatCountry("United States")).toBe("USA");
  });

  it("abbreviates United Kingdom to UK", () => {
    expect(formatCountry("United Kingdom")).toBe("UK");
  });

  it("abbreviates United Arab Emirates to UAE", () => {
    expect(formatCountry("United Arab Emirates")).toBe("UAE");
  });

  it("returns the country name unchanged when no abbreviation exists", () => {
    expect(formatCountry("Colombia")).toBe("Colombia");
    expect(formatCountry("Brazil")).toBe("Brazil");
    expect(formatCountry("Germany")).toBe("Germany");
  });

  it("returns empty string for null", () => {
    expect(formatCountry(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatCountry(undefined)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(formatCountry("")).toBe("");
  });

  it("is case-sensitive — partial match does not abbreviate", () => {
    expect(formatCountry("united states")).toBe("united states");
    expect(formatCountry("UNITED STATES")).toBe("UNITED STATES");
  });
});
