import { describe, expect, it } from "vitest";
import { clampDate } from "../lib/clamp-date";

const d = (s: string) => new Date(s);

describe("clampDate", () => {
  it("returns min when date is before min", () => {
    expect(clampDate(d("2023-06-01"), d("2024-01-01"), d("2024-12-31"))).toEqual(d("2024-01-01"));
  });

  it("returns max when date is after max", () => {
    expect(clampDate(d("2025-06-01"), d("2024-01-01"), d("2024-12-31"))).toEqual(d("2024-12-31"));
  });

  it("returns the original reference when date is within range", () => {
    const input = d("2024-07-04");
    expect(clampDate(input, d("2024-01-01"), d("2024-12-31"))).toEqual(input);
  });

  it("returns the original reference when date equals min", () => {
    const input = d("2024-01-01");
    expect(clampDate(input, d("2024-01-01"), d("2024-12-31"))).toEqual(input);
  });

  it("returns the original reference when date equals max", () => {
    const input = d("2024-12-31");
    expect(clampDate(input, d("2024-01-01"), d("2024-12-31"))).toEqual(input);
  });

  it("returns the original reference when min equals max and date matches", () => {
    const input = d("2024-06-15");
    expect(clampDate(input, d("2024-06-15"), d("2024-06-15"))).toEqual(input);
  });

  it("clamps to min when only min is provided and date is before it", () => {
    expect(clampDate(d("2023-01-01"), d("2024-01-01"))).toEqual(d("2024-01-01"));
  });

  it("returns the original reference when only min is provided and date is after it", () => {
    const input = d("2025-01-01");
    expect(clampDate(input, d("2024-01-01"))).toEqual(input);
  });

  it("clamps to max when only max is provided and date is after it", () => {
    expect(clampDate(d("2025-01-01"), null, d("2024-12-31"))).toEqual(d("2024-12-31"));
  });

  it("returns the original reference when only max is provided and date is before it", () => {
    const input = d("2023-01-01");
    expect(clampDate(input, null, d("2024-12-31"))).toEqual(input);
  });

  it("returns the original reference when neither min nor max is provided", () => {
    const input = d("2024-07-04");
    expect(clampDate(input)).toEqual(input);
  });

  it("throws when max is before min", () => {
    expect(() => clampDate(d("2024-07-04"), d("2024-12-31"), d("2024-01-01"))).toThrow(
      "invalid clamp range",
    );
  });
});
