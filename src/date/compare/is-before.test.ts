import { describe, expect, it } from "vitest";
import { isBefore } from "./is-before";

describe("isBefore", () => {
  describe("basic comparison", () => {
    it("returns true when a is before b", () => {
      expect(isBefore("2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z")).toBe(true);
    });

    it("returns false when a is after b", () => {
      expect(isBefore("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z")).toBe(false);
    });

    it("returns false when a equals b", () => {
      expect(isBefore("2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z")).toBe(false);
    });
  });

  describe("same day different time", () => {
    it("returns true when a is earlier in the same day", () => {
      expect(isBefore("2024-01-01T08:00:00Z", "2024-01-01T12:00:00Z")).toBe(true);
    });

    it("returns false when a is later in the same day", () => {
      expect(isBefore("2024-01-01T12:00:00Z", "2024-01-01T08:00:00Z")).toBe(false);
    });
  });

  describe("cross year/month", () => {
    it("returns true when a is in a previous year", () => {
      expect(isBefore("2023-12-31T00:00:00Z", "2024-01-01T00:00:00Z")).toBe(true);
    });

    it("returns true when a is in a previous month", () => {
      expect(isBefore("2024-01-31T00:00:00Z", "2024-02-01T00:00:00Z")).toBe(true);
    });
  });

  describe("default b to current time", () => {
    it("returns true when a is in the past", () => {
      expect(isBefore("2000-01-01T00:00:00Z", null)).toBe(true);
    });

    it("returns false when a is in the future", () => {
      expect(isBefore("2999-01-01T00:00:00Z", null)).toBe(false);
    });
  });

  describe("mixed input types", () => {
    it("accepts two Date objects", () => {
      expect(isBefore(new Date("2024-01-01T00:00:00Z"), new Date("2024-01-02T00:00:00Z"))).toBe(
        true,
      );
    });

    it("accepts mixed Date and string", () => {
      expect(isBefore(new Date("2024-01-01T00:00:00Z"), "2024-01-02T00:00:00Z")).toBe(true);
    });
  });
});
