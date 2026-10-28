import { describe, expect, it } from "vitest";
import { addYears, subYears } from "./add-years";

describe("addYears", () => {
  describe("basic addition", () => {
    it("adds 1 year by default", () => {
      expect(addYears("2024-03-15", 1).toISOString()).toBe("2025-03-15T00:00:00.000Z");
    });

    it("adds multiple years", () => {
      expect(addYears("2024-03-15T00:00:00Z", 3).toISOString()).toBe("2027-03-15T00:00:00.000Z");
    });
  });

  describe("overflow = false (clamp to end of month)", () => {
    it("clamps Feb 29 to Feb 28 in a non-leap year", () => {
      expect(addYears("2024-02-29T00:00:00Z", 1).toISOString()).toBe("2025-02-28T00:00:00.000Z");
    });

    it("keeps Feb 29 when target year is also a leap year", () => {
      expect(addYears("2024-02-29T00:00:00Z", 4).toISOString()).toBe("2028-02-29T00:00:00.000Z");
    });
  });

  describe("overflow = true (allow date overflow)", () => {
    it("overflows Feb 29 + 1 year to Mar 1 in a non-leap year", () => {
      expect(addYears("2024-02-29T00:00:00Z", 1, true).toISOString()).toBe(
        "2025-03-01T00:00:00.000Z",
      );
    });
  });

  describe("negative years", () => {
    it("subtracts years when years is negative", () => {
      expect(subYears("2024-03-15T00:00:00Z", 1).toISOString()).toBe("2023-03-15T00:00:00.000Z");
    });

    it("clamps Feb 29 to Feb 28 when subtracting to a non-leap year", () => {
      expect(subYears("2024-02-29", 1).toISOString()).toBe("2023-02-28T00:00:00.000Z");
    });
  });

  describe("edge cases", () => {
    it("adds 0 years returns the same date", () => {
      expect(addYears("2024-03-15T00:00:00Z", 0).toISOString()).toBe("2024-03-15T00:00:00.000Z");
    });
  });
});
