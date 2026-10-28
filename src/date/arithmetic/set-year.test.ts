import { describe, expect, it } from "vitest";
import { setYear } from "./set-year";

describe("setYear", () => {
  describe("basic usage", () => {
    it("sets the year to the given value", () => {
      expect(setYear("2024-03-15T00:00:00Z", 2025).toISOString()).toBe("2025-03-15T00:00:00.000Z");
    });

    it("sets the year to a past year", () => {
      expect(setYear("2024-03-15T00:00:00Z", 2000).toISOString()).toBe("2000-03-15T00:00:00.000Z");
    });

    it("sets the year to the same year returns the same date", () => {
      expect(setYear("2024-03-15T00:00:00Z", 2024).toISOString()).toBe("2024-03-15T00:00:00.000Z");
    });
  });

  describe("allowOverflow = false (clamp to end of month)", () => {
    it("clamps Feb 29 to Feb 28 when target year is not a leap year", () => {
      expect(setYear("2024-02-29T00:00:00Z", 2023).toISOString()).toBe("2023-02-28T00:00:00.000Z");
    });

    it("keeps Feb 29 when target year is a leap year", () => {
      expect(setYear("2024-02-29T00:00:00Z", 2028).toISOString()).toBe("2028-02-29T00:00:00.000Z");
    });
  });

  describe("allowOverflow = true (allow date overflow)", () => {
    it("overflows Feb 29 to Mar 1 when target year is not a leap year", () => {
      expect(setYear("2024-02-29T00:00:00Z", 2023, true).toISOString()).toBe(
        "2023-03-01T00:00:00.000Z",
      );
    });
  });

  describe("edge cases", () => {
    it("accepts a Date object", () => {
      expect(setYear(new Date("2024-03-15T00:00:00Z"), 2025).toISOString()).toBe(
        "2025-03-15T00:00:00.000Z",
      );
    });
  });
});
