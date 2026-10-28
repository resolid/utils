import { describe, expect, it } from "vitest";
import { isAfter } from "./is-after";

describe("isAfter", () => {
  describe("basic comparison", () => {
    it("returns true when a is after b", () => {
      expect(isAfter("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z")).toBe(true);
    });

    it("returns false when a is before b", () => {
      expect(isAfter("2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z")).toBe(false);
    });

    it("returns false when a equals b", () => {
      expect(isAfter("2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z")).toBe(false);
    });
  });

  describe("same day different time", () => {
    it("returns true when a is later in the same day", () => {
      expect(isAfter("2024-01-01T12:00:00Z", "2024-01-01T08:00:00Z")).toBe(true);
    });

    it("returns false when a is earlier in the same day", () => {
      expect(isAfter("2024-01-01T08:00:00Z", "2024-01-01T12:00:00Z")).toBe(false);
    });
  });

  describe("cross year/month", () => {
    it("returns true when a is in a later year", () => {
      expect(isAfter("2024-01-01T00:00:00Z", "2023-12-31T00:00:00Z")).toBe(true);
    });

    it("returns true when a is in a later month", () => {
      expect(isAfter("2024-02-01T00:00:00Z", "2024-01-31T00:00:00Z")).toBe(true);
    });
  });

  describe("default b to current time", () => {
    it("returns false when a is in the past", () => {
      expect(isAfter("2000-01-01T00:00:00Z", null)).toBe(false);
    });

    it("returns true when a is in the future", () => {
      expect(isAfter("2999-01-01T00:00:00Z", null)).toBe(true);
    });
  });

  describe("mixed input types", () => {
    it("accepts two Date objects", () => {
      expect(isAfter(new Date("2024-01-02T00:00:00Z"), new Date("2024-01-01T00:00:00Z"))).toBe(
        true,
      );
    });

    it("accepts mixed Date and string", () => {
      expect(isAfter(new Date("2024-01-02T00:00:00Z"), "2024-01-01T00:00:00Z")).toBe(true);
    });

    it("returns false for equal instants in different formats", () => {
      expect(isAfter(new Date("2024-01-01T00:00:00Z"), "2024-01-01T00:00:00Z")).toBe(false);
    });
  });
});
