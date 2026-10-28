import { describe, expect, it } from "vitest";
import { isLeapYear } from "./is-leap-year";

describe("isLeapYear", () => {
  describe("leap years", () => {
    it("returns true for a year divisible by 4", () => {
      expect(isLeapYear("2024-01-01")).toBe(true);
    });

    it("returns true for a year divisible by 400", () => {
      expect(isLeapYear("2000-01-01")).toBe(true);
    });

    it("returns true for another year divisible by 400", () => {
      expect(isLeapYear("1600-01-01")).toBe(true);
    });
  });

  describe("non-leap years", () => {
    it("returns false for a year not divisible by 4", () => {
      expect(isLeapYear("2023-01-01")).toBe(false);
    });

    it("returns false for a year divisible by 100 but not 400", () => {
      expect(isLeapYear("1900-01-01")).toBe(false);
    });

    it("returns false for another year divisible by 100 but not 400", () => {
      expect(isLeapYear("2100-01-01")).toBe(false);
    });
  });
});
