import { describe, expect, it } from "vitest";
import { setDayOfWeek } from "./set-day-of-week";

describe("setDayOfWeek", () => {
  describe("weekStartsOn = 0 (Sunday, default)", () => {
    it("sets to Sunday", () => {
      expect(setDayOfWeek("2024-01-17T00:00:00Z", 0).toISOString()).toBe(
        "2024-01-14T00:00:00.000Z",
      );
    });

    it("sets to Wednesday", () => {
      expect(setDayOfWeek("2024-01-14T00:00:00Z", 3).toISOString()).toBe(
        "2024-01-17T00:00:00.000Z",
      );
    });

    it("sets to Saturday", () => {
      expect(setDayOfWeek("2024-01-14T00:00:00Z", 6).toISOString()).toBe(
        "2024-01-20T00:00:00.000Z",
      );
    });

    it("returns the same day when already on target day", () => {
      expect(setDayOfWeek("2024-01-14T00:00:00Z", 0).toISOString()).toBe(
        "2024-01-14T00:00:00.000Z",
      );
    });

    it("rolls over to the next month", () => {
      expect(setDayOfWeek("2024-01-28T00:00:00Z", 6).toISOString()).toBe(
        "2024-02-03T00:00:00.000Z",
      );
    });

    it("rolls back to the previous month", () => {
      expect(setDayOfWeek("2024-02-03T00:00:00Z", 0).toISOString()).toBe(
        "2024-01-28T00:00:00.000Z",
      );
    });
  });

  describe("weekStartsOn = 1 (Monday)", () => {
    it("sets to Monday", () => {
      expect(setDayOfWeek("2024-01-17T00:00:00Z", 1, 1).toISOString()).toBe(
        "2024-01-15T00:00:00.000Z",
      );
    });

    it("sets to Sunday", () => {
      expect(setDayOfWeek("2024-01-15T00:00:00Z", 0, 1).toISOString()).toBe(
        "2024-01-21T00:00:00.000Z",
      );
    });

    it("returns the same day when already on Monday", () => {
      expect(setDayOfWeek("2024-01-15T00:00:00Z", 1, 1).toISOString()).toBe(
        "2024-01-15T00:00:00.000Z",
      );
    });
  });
});
