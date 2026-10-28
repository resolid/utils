import { describe, expect, it } from "vitest";
import { setDayOfYear } from "./set-day-of-year";

describe("setDayOfYear", () => {
  it("sets to the first day of the year", () => {
    expect(setDayOfYear("2024-06-15T00:00:00Z", 1).toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("sets to day 100", () => {
    expect(setDayOfYear("2024-01-01", 100).toISOString()).toBe("2024-04-09T00:00:00.000Z");
  });

  it("sets to the last day of a leap year", () => {
    expect(setDayOfYear("2024-01-01T00:00:00Z", 366).toISOString()).toBe(
      "2024-12-31T00:00:00.000Z",
    );
  });

  it("sets to the last day of a non-leap year", () => {
    expect(setDayOfYear("2023-01-01T00:00:00Z", 365).toISOString()).toBe(
      "2023-12-31T00:00:00.000Z",
    );
  });

  it("preserves time", () => {
    expect(setDayOfYear("2024-06-15T08:30:45Z", 1).toISOString()).toBe("2024-01-01T08:30:45.000Z");
  });

  it("overflows day 366 to Jan 1 of next year in a non-leap year", () => {
    expect(setDayOfYear("2023-01-01T00:00:00Z", 366).toISOString()).toBe(
      "2024-01-01T00:00:00.000Z",
    );
  });

  it("overflows day 367 to Jan 1 of next year in a leap year", () => {
    expect(setDayOfYear("2024-01-01T00:00:00Z", 367).toISOString()).toBe(
      "2025-01-01T00:00:00.000Z",
    );
  });
});
