import { describe, expect, it } from "vitest";
import { addDays, subDays } from "./add-days";

describe("addDays", () => {
  describe("basic addition", () => {
    it("adds 1 day by default", () => {
      expect(addDays("2024-01-15T00:00:00Z", 1).toISOString()).toBe("2024-01-16T00:00:00.000Z");
    });

    it("adds multiple days", () => {
      expect(addDays("2024-01-15T00:00:00Z", 5).toISOString()).toBe("2024-01-20T00:00:00.000Z");
    });

    it("rolls over to the next month", () => {
      expect(addDays("2024-01-31T00:00:00Z", 1).toISOString()).toBe("2024-02-01T00:00:00.000Z");
    });

    it("rolls over to the next year", () => {
      expect(addDays("2024-12-31T00:00:00Z", 1).toISOString()).toBe("2025-01-01T00:00:00.000Z");
    });
  });

  describe("negative days", () => {
    it("subtracts days when days is negative", () => {
      expect(subDays("2024-01-15T00:00:00Z", 1).toISOString()).toBe("2024-01-14T00:00:00.000Z");
    });

    it("rolls back to the previous month", () => {
      expect(subDays("2024-02-01T00:00:00Z", 1).toISOString()).toBe("2024-01-31T00:00:00.000Z");
    });

    it("rolls back to the previous year", () => {
      expect(subDays("2024-01-01T00:00:00Z", 1).toISOString()).toBe("2023-12-31T00:00:00.000Z");
    });
  });

  describe("edge cases", () => {
    it("adds 0 days returns the same date", () => {
      expect(addDays("2024-01-15T00:00:00Z", 0).toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });

    it("handles leap year correctly", () => {
      expect(addDays("2024-02-28T00:00:00Z", 1).toISOString()).toBe("2024-02-29T00:00:00.000Z");
    });

    it("handles non-leap year correctly", () => {
      expect(addDays("2023-02-28T00:00:00Z", 1).toISOString()).toBe("2023-03-01T00:00:00.000Z");
    });
  });
});
