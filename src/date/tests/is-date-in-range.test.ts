import { describe, expect, it } from "vitest";
import { isDateInRange } from "../lib/is-date-in-range";

const d = (s: string) => new Date(s);

describe("isDateInRange", () => {
  const range = {
    start: d("2024-01-01"),
    end: d("2024-12-31"),
  };

  it("returns false when range.start is missing", () => {
    expect(isDateInRange(d("2024-06-15"), { start: null, end: range.end })).toBe(false);
  });

  it("returns false when range.end is missing", () => {
    expect(isDateInRange(d("2024-06-15"), { start: range.start, end: null })).toBe(false);
  });

  it("returns false when both range bounds are missing", () => {
    expect(isDateInRange(d("2024-06-15"), { start: null, end: null })).toBe(false);
  });

  it("returns true when date is within range", () => {
    expect(isDateInRange(d("2024-06-15"), range)).toBe(true);
  });

  it("returns true when date equals start", () => {
    expect(isDateInRange(d("2024-01-01"), range)).toBe(true);
  });

  it("returns true when date equals end", () => {
    expect(isDateInRange(d("2024-12-31"), range)).toBe(true);
  });

  it("returns true when start equals end and date matches", () => {
    const point = { start: d("2024-06-15"), end: d("2024-06-15") };
    expect(isDateInRange(d("2024-06-15"), point)).toBe(true);
  });

  it("returns false when date is before start", () => {
    expect(isDateInRange(d("2023-12-31"), range)).toBe(false);
  });

  it("returns false when date is after end", () => {
    expect(isDateInRange(d("2025-01-01"), range)).toBe(false);
  });
});
