import { describe, expect, it } from "vitest";
import { toDate } from "./to-date";

describe("toDate", () => {
  describe("ISO 8601 string input", () => {
    it("converts a date-only string", () => {
      expect(toDate("2024-01-15").toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });

    it("converts a datetime string without timezone", () => {
      expect(toDate("2024-01-15T12:30:00").toISOString()).toBe("2024-01-15T12:30:00.000Z");
    });

    it("converts a datetime string with UTC", () => {
      expect(toDate("2024-01-15T12:30:00Z").toISOString()).toBe("2024-01-15T12:30:00.000Z");
    });

    it("converts a datetime string with positive offset", () => {
      expect(toDate("2024-01-15T12:30:00+08:00").toISOString()).toBe("2024-01-15T04:30:00.000Z");
    });

    it("converts a datetime string with negative offset", () => {
      expect(toDate("2024-01-15T12:30:00-05:00").toISOString()).toBe("2024-01-15T17:30:00.000Z");
    });

    it("converts a datetime string with milliseconds", () => {
      expect(toDate("2024-01-15T12:30:00.123Z").toISOString()).toBe("2024-01-15T12:30:00.123Z");
    });

    it("trims whitespace before parsing", () => {
      expect(toDate("  2024-01-15T12:30:00Z  ").toISOString()).toBe("2024-01-15T12:30:00.000Z");
    });
  });

  describe("ISO 9075 string input", () => {
    it("converts a datetime string with space separator", () => {
      expect(toDate("2024-01-15 12:30:00").toISOString()).toBe("2024-01-15T12:30:00.000Z");
    });

    it("converts a datetime string with space separator and UTC", () => {
      expect(toDate("2024-01-15 12:30:00Z").toISOString()).toBe("2024-01-15T12:30:00.000Z");
    });
  });

  describe("invalid input", () => {
    it("throws for an invalid format", () => {
      expect(() => toDate("not-a-date")).toThrow();
    });

    it("throws for US date format", () => {
      expect(() => toDate("01/15/2024")).toThrow();
    });

    it("throws for out-of-range month", () => {
      expect(() => toDate("2024-13-01")).toThrow();
    });

    it("throws for out-of-range day", () => {
      expect(() => toDate("2024-01-32")).toThrow();
    });

    it("throws for out-of-range hour", () => {
      expect(() => toDate("2024-01-15T24:00:00")).toThrow();
    });
  });
});
