import { describe, expect, it } from "vitest";
import { endOfYear } from "../arithmetic/end-of-year";
import { startOfYear } from "../arithmetic/start-of-year";
import { diffInDays } from "../compare/diff-in-days";
import { daysInYear } from "./days-in-year";

describe("daysInYear", () => {
  it("can find the number of days in a year", () => {
    expect(daysInYear("2023-01-01")).toBe(365);
  });
  it("can find the number of days in a year", () => {
    expect(daysInYear("2020-01-01")).toBe(366);
  });

  it("can find the number of days of the current day", () => {
    const start = startOfYear(null);
    const end = endOfYear(null);
    expect(daysInYear(null)).toBe(diffInDays(end, start) + 1);
  });
});
