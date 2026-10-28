import { describe, expect, it } from "vitest";
import { endOfYear } from "./end-of-year";

describe("endOfYear", () => {
  it("returns Dec 31 23:59:59.999 for a date in January", () => {
    expect(endOfYear("2024-01-15T00:00:00Z").toISOString()).toBe("2024-12-31T23:59:59.999Z");
  });

  it("returns Dec 31 23:59:59.999 for a date in June", () => {
    expect(endOfYear("2024-06-15").toISOString()).toBe("2024-12-31T23:59:59.999Z");
  });

  it("returns the same day when input is already Dec 31", () => {
    expect(endOfYear("2024-12-31T00:00:00Z").toISOString()).toBe("2024-12-31T23:59:59.999Z");
  });

  it("returns end of current year when called with no arguments", () => {
    const compare = new Date();
    compare.setMonth(11, 31);
    compare.setHours(23, 59, 59, 999);

    expect(endOfYear(null)).toEqual(compare);
  });
});
