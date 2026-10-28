import { describe, expect, it } from "vitest";
import { toDate } from "../core/to-date";
import { endOfMonth } from "./end-of-month";

describe("endOfMonth", () => {
  it("returns Feb 29 in a leap year", () => {
    expect(endOfMonth("2024-02-01").toISOString()).toBe("2024-02-29T23:59:59.999Z");
  });

  it("returns Feb 28 in a non-leap year", () => {
    expect(endOfMonth("2023-02-01").toISOString()).toBe("2023-02-28T23:59:59.999Z");
  });

  it("returns Jan 31 for a date in January", () => {
    expect(endOfMonth("2024-01-04").toISOString()).toBe("2024-01-31T23:59:59.999Z");
  });

  it("returns Apr 30 for a date in April", () => {
    expect(endOfMonth("2024-04-10").toISOString()).toBe("2024-04-30T23:59:59.999Z");
  });

  it("returns the same day when input is already the last day of the month", () => {
    expect(endOfMonth("2024-01-31T05:00:00Z").toISOString()).toBe("2024-01-31T23:59:59.999Z");
  });

  it("returns the last day when input is the first day of the month", () => {
    expect(endOfMonth("2024-06-01").toISOString()).toBe("2024-06-30T23:59:59.999Z");
  });

  it("returns end of current month when called with no arguments", () => {
    const compare = toDate();
    compare.setMonth(compare.getMonth() + 1, 0);
    compare.setHours(23, 59, 59, 999);

    expect(endOfMonth(null)).toEqual(compare);
  });
});
