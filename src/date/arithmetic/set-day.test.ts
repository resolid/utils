import { describe, expect, it } from "vitest";
import { setDay } from "./set-day";

describe("setDay", () => {
  describe("basic usage", () => {
    it("sets the day to the given value", () => {
      expect(setDay("2024-01-15T00:00:00Z", 20).toISOString()).toBe("2024-01-20T00:00:00.000Z");
    });

    it("sets the day to 1", () => {
      expect(setDay("2024-01-15T00:00:00Z", 1).toISOString()).toBe("2024-01-01T00:00:00.000Z");
    });

    it("sets the day to the last day of the month", () => {
      expect(setDay("2024-01-15T00:00:00Z", 31).toISOString()).toBe("2024-01-31T00:00:00.000Z");
    });

    it("sets the day to the same value returns the same date", () => {
      expect(setDay("2024-01-15T00:00:00Z", 15).toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });

    it("preserves hours, minutes and seconds", () => {
      expect(setDay("2024-01-15T08:30:45Z", 20).toISOString()).toBe("2024-01-20T08:30:45.000Z");
    });
  });

  describe("overflow", () => {
    it("overflows to the next month when day exceeds month length", () => {
      expect(setDay("2024-04-15T00:00:00Z", 31).toISOString()).toBe("2024-05-01T00:00:00.000Z");
    });

    it("overflows Feb 30 to Mar 1 in a leap year", () => {
      expect(setDay("2024-02-15T00:00:00Z", 30).toISOString()).toBe("2024-03-01T00:00:00.000Z");
    });

    it("overflows Feb 29 to Mar 1 in a non-leap year", () => {
      expect(setDay("2023-02-15T00:00:00Z", 29).toISOString()).toBe("2023-03-01T00:00:00.000Z");
    });
  });
});
