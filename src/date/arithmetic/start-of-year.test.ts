import { describe, expect, it } from "vitest";
import { startOfYear } from "./start-of-year";

describe("startOfYear", () => {
  it("returns Jan 1 00:00:00.000 for a date in January", () => {
    expect(startOfYear("2024-01-15T00:00:00Z").toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("returns Jan 1 00:00:00.000 for a date in December", () => {
    expect(startOfYear("2024-12-31").toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("resets time to 00:00:00.000 regardless of input time", () => {
    expect(startOfYear("2024-06-15T23:59:59Z").toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("returns the same day when input is already Jan 1", () => {
    expect(startOfYear("2024-01-01T00:00:00Z").toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("returns start of current year when called with no arguments", () => {
    const compare = new Date();
    compare.setMonth(0, 1);
    compare.setHours(0, 0, 0, 0);

    expect(startOfYear(null)).toEqual(compare);
  });
});
