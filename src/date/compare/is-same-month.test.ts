import { describe, expect, it } from "vitest";
import { isSameMonth } from "./is-same-month";

describe("isSameMonth", () => {
  it("can determine two dates are the exact same", () => {
    expect(isSameMonth(new Date(), new Date())).toBe(true);
  });

  it("can determine string dates", () => {
    expect(isSameMonth("2024-02-02 13:20:30", "2024-02-01 12:21:32")).toBe(true);
  });

  it("can determine different dates and time except months", () => {
    expect(isSameMonth("2024-02-02 13:20:30", "2024-01-01 12:21:32")).toBe(false);
  });

  it("can determine different dates and time with same months", () => {
    expect(isSameMonth("2024-01-01 10:10:30", "2024-01-02 11:12:00")).toBe(true);
  });

  it("evaluates true with 1 date given", () => {
    const input = new Date();
    input.setMilliseconds(45);

    expect(isSameMonth(input, null)).toBe(true);
  });
});
