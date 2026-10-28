import { describe, expect, it } from "vitest";
import { dayOfWeek } from "./day-of-week";

describe("dayOfWeek", () => {
  describe("weekStartsOn = 0 (Sunday, default)", () => {
    it("returns 0 for Sunday", () => {
      expect(dayOfWeek("2024-01-14T00:00:00Z")).toBe(0);
    });

    it("returns 1 for Monday", () => {
      expect(dayOfWeek("2024-01-15T00:00:00Z")).toBe(1);
    });

    it("returns 3 for Wednesday", () => {
      expect(dayOfWeek("2024-01-17T00:00:00Z")).toBe(3);
    });

    it("returns 6 for Saturday", () => {
      expect(dayOfWeek("2024-01-20T00:00:00Z")).toBe(6);
    });
  });

  describe("weekStartsOn = 1 (Monday)", () => {
    it("returns 0 for Monday", () => {
      expect(dayOfWeek("2024-01-15T00:00:00Z", 1)).toBe(0);
    });

    it("returns 2 for Wednesday", () => {
      expect(dayOfWeek("2024-01-17T00:00:00Z", 1)).toBe(2);
    });

    it("returns 6 for Sunday", () => {
      expect(dayOfWeek("2024-01-14T00:00:00Z", 1)).toBe(6);
    });
  });

  describe("weekStartsOn = 6 (Saturday)", () => {
    it("returns 0 for Saturday", () => {
      expect(dayOfWeek("2024-01-20T00:00:00Z", 6)).toBe(0);
    });

    it("returns 1 for Sunday", () => {
      expect(dayOfWeek("2024-01-14T00:00:00Z", 6)).toBe(1);
    });

    it("returns 4 for Wednesday", () => {
      expect(dayOfWeek("2024-01-17T00:00:00Z", 6)).toBe(4);
    });
  });

  it("accepts Date input", () => {
    expect(dayOfWeek(new Date("2024-01-17T00:00:00Z"))).toBe(3);
  });

  it("defaults to the current day when input is null", () => {
    expect(dayOfWeek(null)).toBe(new Date().getDay());
  });
});
