import { describe, expect, it } from "vitest";
import { setMonth } from "./set-month";

describe("setMonth", () => {
  describe("basic usage", () => {
    it("sets the month to the given value", () => {
      expect(setMonth("2024-01-15", 6).toISOString()).toBe("2024-06-15T00:00:00.000Z");
    });

    it("sets the month to January", () => {
      expect(setMonth("2024-06-15T00:00:00Z", 1).toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });

    it("sets the month to December", () => {
      expect(setMonth("2024-06-15T00:00:00Z", 12).toISOString()).toBe("2024-12-15T00:00:00.000Z");
    });

    it("sets the month to the same month returns the same date", () => {
      expect(setMonth("2024-06-15T00:00:00Z", 6).toISOString()).toBe("2024-06-15T00:00:00.000Z");
    });
  });

  describe("allowOverflow = false (clamp to end of month)", () => {
    it("clamps Jan 31 to Feb 29 in a leap year", () => {
      expect(setMonth("2024-01-31T00:00:00Z", 2).toISOString()).toBe("2024-02-29T00:00:00.000Z");
    });

    it("clamps Jan 31 to Feb 28 in a non-leap year", () => {
      expect(setMonth("2023-01-31T00:00:00Z", 2).toISOString()).toBe("2023-02-28T00:00:00.000Z");
    });

    it("clamps Jan 31 to Apr 30", () => {
      expect(setMonth("2024-01-31T00:00:00Z", 4).toISOString()).toBe("2024-04-30T00:00:00.000Z");
    });
  });

  describe("allowOverflow = true (allow date overflow)", () => {
    it("overflows Jan 31 to Mar 2 when setting to February in a leap year", () => {
      expect(setMonth("2024-01-31T00:00:00Z", 2, true).toISOString()).toBe(
        "2024-03-02T00:00:00.000Z",
      );
    });

    it("overflows Jan 31 to Mar 3 when setting to February in a non-leap year", () => {
      expect(setMonth("2023-01-31T00:00:00Z", 2, true).toISOString()).toBe(
        "2023-03-03T00:00:00.000Z",
      );
    });
  });
});
