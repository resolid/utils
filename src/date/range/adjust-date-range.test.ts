import { describe, expect, it } from "vitest";
import { adjustDateRange } from "./adjust-date-range";

describe("adjustDateRange", () => {
  const earlier = new Date("2024-01-01");
  const later = new Date("2024-12-31");

  it("should return the range as-is when start is before end", () => {
    const range = { start: earlier, end: later };
    expect(adjustDateRange(range)).toEqual({ start: earlier, end: later });
  });

  it("should swap start and end when start is after end", () => {
    const range = { start: later, end: earlier };
    expect(adjustDateRange(range)).toEqual({ start: earlier, end: later });
  });

  it("should return the range as-is when start equals end", () => {
    const range = { start: earlier, end: earlier };
    expect(adjustDateRange(range)).toEqual({ start: earlier, end: earlier });
  });

  it("should return the range as-is when start is null", () => {
    const range = { start: null, end: later };
    expect(adjustDateRange(range)).toBe(range);
  });

  it("should return the range as-is when end is null", () => {
    const range = { start: earlier, end: null };
    expect(adjustDateRange(range)).toBe(range);
  });

  it("should return the range as-is when both are null", () => {
    const range = { start: null, end: null };
    expect(adjustDateRange(range)).toBe(range);
  });
});
