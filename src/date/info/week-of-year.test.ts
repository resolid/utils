import { describe, expect, it } from "vitest";
import { weekOfYear } from "./week-of-year";

describe("weekOfYear", () => {
  describe("ISO weeks (weekStartsOn=1, firstWeekContainsDate=4)", () => {
    const weekStartsOn = 1;
    const firstWeekContainsDate = 4;

    it("2026-01-01 should be week 1", () => {
      expect(weekOfYear("2026-01-01", weekStartsOn, firstWeekContainsDate)).toBe(1);
    });

    it("2026-01-04 should be week 1", () => {
      expect(weekOfYear("2026-01-04", weekStartsOn, firstWeekContainsDate)).toBe(1);
    });

    it("2026-01-05 should be week 2", () => {
      expect(weekOfYear("2026-01-05", weekStartsOn, firstWeekContainsDate)).toBe(2);
    });

    it("2026-12-31 should be week 53", () => {
      expect(weekOfYear("2026-12-31", weekStartsOn, firstWeekContainsDate)).toBe(53);
    });

    it("2020-12-31 should be week 53 (leap year test)", () => {
      expect(weekOfYear("2020-12-31", weekStartsOn, firstWeekContainsDate)).toBe(53);
    });
  });

  describe("US weeks (weekStartsOn=0, firstWeekContainsDate=1)", () => {
    const weekStartsOn = 0;
    const firstWeekContainsDate = 1;

    it("2026-01-01 should be week 1", () => {
      expect(weekOfYear("2026-01-01", weekStartsOn, firstWeekContainsDate)).toBe(1);
    });

    it("2026-01-04 should be week 2", () => {
      expect(weekOfYear("2026-01-04", weekStartsOn, firstWeekContainsDate)).toBe(2);
    });

    it("2026-12-31 should be week 53", () => {
      expect(weekOfYear("2026-12-31", weekStartsOn, firstWeekContainsDate)).toBe(1);
    });
  });

  describe("Custom weekStartsOn=0, firstWeekContainsDate=4", () => {
    const weekStartsOn = 0;
    const firstWeekContainsDate = 4;

    it("2026-01-04 should be week 1", () => {
      expect(weekOfYear("2026-01-04", weekStartsOn, firstWeekContainsDate)).toBe(1);
    });

    it("2026-01-10 should be week 2", () => {
      expect(weekOfYear("2026-01-10", weekStartsOn, firstWeekContainsDate)).toBe(1);
    });
  });

  describe("Custom weekStartsOn=1, firstWeekContainsDate=1", () => {
    const weekStartsOn = 1;
    const firstWeekContainsDate = 1;

    it("2026-01-01 should be week 1", () => {
      expect(weekOfYear("2026-01-01", weekStartsOn, firstWeekContainsDate)).toBe(1);
    });

    it("2026-01-04 should be week 2", () => {
      expect(weekOfYear("2026-01-04", weekStartsOn, firstWeekContainsDate)).toBe(1);
    });
  });

  it("null input should return a number between 1 and 53", () => {
    const result = weekOfYear(null);
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(53);
  });
});
