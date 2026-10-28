import { describe, expect, it } from "vitest";
import { startOfWeek } from "./start-of-week";

describe("startOfWeek", () => {
  describe("weekStartsOn = 0 (Sunday, default)", () => {
    it("returns Sunday 00:00:00.000 for a date on Wednesday", () => {
      expect(startOfWeek("2024-01-17T00:00:00Z").toISOString()).toBe("2024-01-14T00:00:00.000Z");
    });

    it("returns Sunday 00:00:00.000 for a date on Saturday", () => {
      expect(startOfWeek("2024-01-20").toISOString()).toBe("2024-01-14T00:00:00.000Z");
    });

    it("returns the same day when input is already Sunday", () => {
      expect(startOfWeek("2024-01-14T00:00:00Z").toISOString()).toBe("2024-01-14T00:00:00.000Z");
    });

    it("rolls back to the previous month", () => {
      expect(startOfWeek("2024-02-01T00:00:00Z").toISOString()).toBe("2024-01-28T00:00:00.000Z");
    });

    it("rolls back to the previous year", () => {
      expect(startOfWeek("2024-01-01T00:00:00Z").toISOString()).toBe("2023-12-31T00:00:00.000Z");
    });
  });

  describe("weekStartsOn = 1 (Monday)", () => {
    it("returns Monday 00:00:00.000 for a date on Wednesday", () => {
      expect(startOfWeek("2024-01-17T00:00:00Z", 1).toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });

    it("returns Monday 00:00:00.000 for a date on Sunday", () => {
      expect(startOfWeek("2024-01-21", 1).toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });

    it("returns the same day when input is already Monday", () => {
      expect(startOfWeek("2024-01-15T00:00:00Z", 1).toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });

    it("resets time to 00:00:00.000 regardless of input time", () => {
      expect(startOfWeek("2024-01-17T23:59:59Z", 1).toISOString()).toBe("2024-01-15T00:00:00.000Z");
    });
  });

  describe("weekStartsOn = 6 (Saturday)", () => {
    it("returns Saturday 00:00:00.000 for a date on Wednesday", () => {
      expect(startOfWeek("2024-01-17T00:00:00Z", 6).toISOString()).toBe("2024-01-13T00:00:00.000Z");
    });

    it("returns the same day when input is already Saturday", () => {
      expect(startOfWeek("2024-01-13T00:00:00Z", 6).toISOString()).toBe("2024-01-13T00:00:00.000Z");
    });
  });

  describe("edge cases", () => {
    it("returns start of current week when called with no arguments", () => {
      const compare = new Date();
      compare.setDate(compare.getDate() - compare.getDay());
      compare.setHours(0, 0, 0, 0);

      expect(startOfWeek(null)).toEqual(compare);
    });
  });
});
