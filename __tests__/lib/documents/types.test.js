import { describe, it, expect } from "vitest";
import {
  BASE_DOCUMENT_TYPES,
  BASE_DOC_SHORT_LABELS,
  getSportDocTypes,
} from "@/lib/documents/types";

describe("BASE_DOCUMENT_TYPES", () => {
  it("contains 8 document types", () => {
    expect(BASE_DOCUMENT_TYPES).toHaveLength(8);
  });

  it("every type has key, label, required, description", () => {
    for (const doc of BASE_DOCUMENT_TYPES) {
      expect(doc).toHaveProperty("key");
      expect(doc).toHaveProperty("label");
      expect(doc).toHaveProperty("required");
      expect(doc).toHaveProperty("description");
    }
  });

  it("all base types are required", () => {
    expect(BASE_DOCUMENT_TYPES.every((d) => d.required === true)).toBe(true);
  });

  it("keys are unique", () => {
    const keys = BASE_DOCUMENT_TYPES.map((d) => d.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("BASE_DOC_SHORT_LABELS", () => {
  it("has a short label for every base document key", () => {
    for (const doc of BASE_DOCUMENT_TYPES) {
      expect(BASE_DOC_SHORT_LABELS).toHaveProperty(doc.key);
    }
  });

  it("labels are non-empty strings", () => {
    for (const label of Object.values(BASE_DOC_SHORT_LABELS)) {
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

describe("getSportDocTypes", () => {
  it("returns all base types when sportConfig is null", () => {
    const result = getSportDocTypes(null);
    expect(result).toEqual(BASE_DOCUMENT_TYPES);
  });

  it("returns all base types when sportConfig has no disabled or custom docs", () => {
    const config = { disabled_base_docs: [], custom_docs: [], doc_settings: {} };
    const result = getSportDocTypes(config);
    expect(result).toHaveLength(BASE_DOCUMENT_TYPES.length);
  });

  it("excludes disabled base docs", () => {
    const config = {
      disabled_base_docs: ["passport", "photo"],
      custom_docs: [],
      doc_settings: {},
    };
    const result = getSportDocTypes(config);
    const keys = result.map((d) => d.key);
    expect(keys).not.toContain("passport");
    expect(keys).not.toContain("photo");
    expect(result).toHaveLength(BASE_DOCUMENT_TYPES.length - 2);
  });

  it("appends sport-specific custom docs", () => {
    const config = {
      disabled_base_docs: [],
      custom_docs: [{ id: "abc", label: "Visa Clearance", visibility: "all", order: 99 }],
      doc_settings: {},
    };
    const result = getSportDocTypes(config);
    const custom = result.find((d) => d.key === "sport_custom_abc");
    expect(custom).toBeDefined();
    expect(custom.label).toBe("Visa Clearance");
    expect(custom.required).toBe(true);
  });

  it("sorts by order when doc_settings includes order values", () => {
    const config = {
      disabled_base_docs: [],
      custom_docs: [],
      doc_settings: {
        passport: { order: 1 },
        photo: { order: 0 },
      },
    };
    const result = getSportDocTypes(config);
    const photoIdx = result.findIndex((d) => d.key === "photo");
    const passportIdx = result.findIndex((d) => d.key === "passport");
    expect(photoIdx).toBeLessThan(passportIdx);
  });

  it("hides international-only docs for US athletes", () => {
    const config = {
      disabled_base_docs: [],
      custom_docs: [{ id: "x1", label: "Visa", visibility: "international", order: 1 }],
      doc_settings: {},
    };
    const result = getSportDocTypes(config, "US");
    expect(result.find((d) => d.key === "sport_custom_x1")).toBeUndefined();
  });

  it("shows international-only docs for non-US athletes", () => {
    const config = {
      disabled_base_docs: [],
      custom_docs: [{ id: "x1", label: "Visa", visibility: "international", order: 1 }],
      doc_settings: {},
    };
    const result = getSportDocTypes(config, "Colombia");
    expect(result.find((d) => d.key === "sport_custom_x1")).toBeDefined();
  });

  it("shows domestic-only docs for US athletes", () => {
    const config = {
      disabled_base_docs: [],
      custom_docs: [{ id: "d1", label: "State ID", visibility: "domestic", order: 1 }],
      doc_settings: {},
    };
    const result = getSportDocTypes(config, "United States");
    expect(result.find((d) => d.key === "sport_custom_d1")).toBeDefined();
  });

  it("hides domestic-only docs for international athletes", () => {
    const config = {
      disabled_base_docs: [],
      custom_docs: [{ id: "d1", label: "State ID", visibility: "domestic", order: 1 }],
      doc_settings: {},
    };
    const result = getSportDocTypes(config, "Brazil");
    expect(result.find((d) => d.key === "sport_custom_d1")).toBeUndefined();
  });

  it("returns all docs when nationality is null (no filtering)", () => {
    const config = {
      disabled_base_docs: [],
      custom_docs: [
        { id: "i1", label: "Visa", visibility: "international", order: 1 },
        { id: "d1", label: "State ID", visibility: "domestic", order: 2 },
      ],
      doc_settings: {},
    };
    const result = getSportDocTypes(config, null);
    expect(result.find((d) => d.key === "sport_custom_i1")).toBeDefined();
    expect(result.find((d) => d.key === "sport_custom_d1")).toBeDefined();
  });
});
