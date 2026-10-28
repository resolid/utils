import { describe, expect, it } from "vitest";
import { isSameYear } from "./is-same-year";

describe("isSameYear", () => {
  it("can determine two dates are the exact same", () => {
    expect(isSameYear(new Date(), new Date())).toBe(true);
  });

  it("can determine string dates", () => {
    expect(isSameYear("2024-02-02 13:20:30", "2024-01-01 12:21:32")).toBe(true);
  });

  it("can determine different dates and time except year", () => {
    expect(isSameYear("2024-01-01 10:20", "2023-02-02 20:10:01")).toBe(false);
  });

  it("can determine different dates and time with same year", () => {
    expect(isSameYear("2024-01-01 12:10:30", "2024-02-02 10:12:00")).toBe(true);
  });

  it("evaluates true with 1 date given", () => {
    const input = new Date();
    input.setMinutes(15);

    expect(isSameYear(input, null)).toBe(true);
  });
});
