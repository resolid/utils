import { describe, expect, it } from "vitest";
import { getDatesInRange } from "../lib/get-dates-in-range";

const d = (s: string) => new Date(s);

describe("getDatesInRange", () => {
  it("returns all days between two dates (inclusive)", () => {
    expect(getDatesInRange(d("2024-01-01"), d("2024-01-05"))).toEqual([
      d("2024-01-01"),
      d("2024-01-02"),
      d("2024-01-03"),
      d("2024-01-04"),
      d("2024-01-05"),
    ]);
  });

  it("returns a single date when start equals end", () => {
    expect(getDatesInRange(d("2024-06-15"), d("2024-06-15"))).toEqual([d("2024-06-15")]);
  });

  it("returns every 2 days when step is 2", () => {
    expect(getDatesInRange(d("2024-01-01"), d("2024-01-07"), { step: 2 })).toEqual([
      d("2024-01-01"),
      d("2024-01-03"),
      d("2024-01-05"),
      d("2024-01-07"),
    ]);
  });

  it("excludes end date when it does not align with step", () => {
    expect(getDatesInRange(d("2024-01-01"), d("2024-01-06"), { step: 2 })).toEqual([
      d("2024-01-01"),
      d("2024-01-03"),
      d("2024-01-05"),
    ]);
  });

  it("returns every month between two dates", () => {
    expect(getDatesInRange(d("2024-01-01"), d("2024-04-01"), { unit: "month" })).toEqual([
      d("2024-01-01"),
      d("2024-02-01"),
      d("2024-03-01"),
      d("2024-04-01"),
    ]);
  });

  it("returns every 3 months when step is 3", () => {
    expect(getDatesInRange(d("2024-01-01"), d("2024-12-01"), { unit: "month", step: 3 })).toEqual([
      d("2024-01-01"),
      d("2024-04-01"),
      d("2024-07-01"),
      d("2024-10-01"),
    ]);
  });

  it("returns every year between two dates", () => {
    expect(getDatesInRange(d("2021-01-01"), d("2024-01-01"), { unit: "year" })).toEqual([
      d("2021-01-01"),
      d("2022-01-01"),
      d("2023-01-01"),
      d("2024-01-01"),
    ]);
  });

  it("returns every 2 years when step is 2", () => {
    expect(getDatesInRange(d("2020-01-01"), d("2026-01-01"), { unit: "year", step: 2 })).toEqual([
      d("2020-01-01"),
      d("2022-01-01"),
      d("2024-01-01"),
      d("2026-01-01"),
    ]);
  });

  it("throws when step is 0", () => {
    expect(() => getDatesInRange(d("2024-01-01"), d("2024-12-31"), { step: 0 })).toThrow(
      "step must be greater than 0",
    );
  });

  it("throws when step is negative", () => {
    expect(() => getDatesInRange(d("2024-01-01"), d("2024-12-31"), { step: -1 })).toThrow(
      "step must be greater than 0",
    );
  });
});
