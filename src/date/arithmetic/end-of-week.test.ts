import { describe, expect, it } from "vitest";
import { endOfWeek } from "./end-of-week";

describe("endOfWeek", () => {
  describe("weekStartsOn = 0 (Sunday, default)", () => {
    it("returns Saturday 23:59:59.999 for a Wednesday", () => {
      expect(endOfWeek("2024-01-17T00:00:00Z").toISOString()).toBe("2024-01-20T23:59:59.999Z");
    });

    it("returns Saturday 23:59:59.999 for a Sunday", () => {
      expect(endOfWeek("2024-01-14T00:00:00Z").toISOString()).toBe("2024-01-20T23:59:59.999Z");
    });

    it("returns the end of the same day for a Saturday", () => {
      expect(endOfWeek("2024-01-20T08:30:00Z").toISOString()).toBe("2024-01-20T23:59:59.999Z");
    });
  });

  describe("weekStartsOn = 1 (Monday)", () => {
    it("returns Sunday 23:59:59.999 for a Wednesday", () => {
      expect(endOfWeek("2024-01-17T00:00:00Z", 1).toISOString()).toBe("2024-01-21T23:59:59.999Z");
    });

    it("returns Sunday 23:59:59.999 for a Monday", () => {
      expect(endOfWeek("2024-01-15T00:00:00Z", 1).toISOString()).toBe("2024-01-21T23:59:59.999Z");
    });
  });

  describe("weekStartsOn = 6 (Saturday)", () => {
    it("returns Friday 23:59:59.999 for a Wednesday", () => {
      expect(endOfWeek("2024-01-17T00:00:00Z", 6).toISOString()).toBe("2024-01-19T23:59:59.999Z");
    });
  });

  it("does not mutate the input date", () => {
    const input = new Date("2024-01-17T12:34:56.789Z");
    const before = input.getTime();

    endOfWeek(input);

    expect(input.getTime()).toBe(before);
  });

  it("returns the end of the current week when input is null", () => {
    const compare = new Date();
    compare.setDate(compare.getDate() - compare.getDay() + 6);
    compare.setHours(23, 59, 59, 999);

    expect(endOfWeek(null)).toEqual(compare);
  });
});
