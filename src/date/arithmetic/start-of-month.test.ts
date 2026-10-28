import { describe, expect, it } from "vitest";
import { startOfMonth } from "./start-of-month";

describe("startOfMonth", () => {
  it("returns Jan 1 00:00:00.000 for a date in January", () => {
    expect(startOfMonth("2024-01-15T00:00:00Z").toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("returns Dec 1 00:00:00.000 for a date in December", () => {
    expect(startOfMonth("2024-12-31T00:00:00Z").toISOString()).toBe("2024-12-01T00:00:00.000Z");
  });

  it("resets time to 00:00:00.000 regardless of input time", () => {
    expect(startOfMonth("2024-06-15T23:59:59Z").toISOString()).toBe("2024-06-01T00:00:00.000Z");
  });

  it("returns Feb 1 in a leap year", () => {
    expect(startOfMonth("2024-02-29T00:00:00Z").toISOString()).toBe("2024-02-01T00:00:00.000Z");
  });

  it("returns Feb 1 in a non-leap year", () => {
    expect(startOfMonth("2023-02-28T00:00:00Z").toISOString()).toBe("2023-02-01T00:00:00.000Z");
  });

  it("returns the same day when input is already the first day of the month", () => {
    expect(startOfMonth("2024-06-01T00:00:00Z").toISOString()).toBe("2024-06-01T00:00:00.000Z");
  });

  it("returns start of current month when called with no arguments", () => {
    const compare = new Date();
    compare.setDate(1);
    compare.setHours(0, 0, 0, 0);

    expect(startOfMonth(null)).toEqual(compare);
  });
});
