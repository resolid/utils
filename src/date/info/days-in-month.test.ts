import { describe, expect, it } from "vitest";
import { daysInMonth } from "./days-in-month";

describe("daysInMonth", () => {
  it("returns 31 for January", () => {
    expect(daysInMonth("2024-01-15")).toBe(31);
  });

  it("returns 30 for June", () => {
    expect(daysInMonth("2024-06-15")).toBe(30);
  });

  it("returns 29 in a leap year", () => {
    expect(daysInMonth("2024-02-15")).toBe(29);
  });

  it("returns 28 in a non-leap year", () => {
    expect(daysInMonth("2023-02-15")).toBe(28);
  });

  it("returns days in current month when called with no arguments", () => {
    const compare = new Date();
    compare.setMonth(compare.getMonth() + 1, 0);
    expect(daysInMonth(null)).toBe(compare.getDate());
  });
});
