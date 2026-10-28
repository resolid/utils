import { describe, expect, it } from "vitest";
import { isSameDay } from "./is-same-day";

describe("isSameDay", () => {
  it("can determine two dates are the exact same", () => {
    expect(isSameDay(new Date(), new Date())).toBe(true);
  });

  it("can compare a string against a date object", () => {
    expect(isSameDay("1999-12-17", new Date("1999-12-17T10:00:00Z"))).toBe(true);
  });

  it("evaluates false for the same dates in different years", () => {
    expect(isSameDay("1999-12-17", new Date("2020-12-17T00:10:00Z"))).toBe(false);
  });

  it("evaluates false for the same dates in different months", () => {
    expect(isSameDay("2020-11-17", new Date("2020-12-17T10:00:00Z"))).toBe(false);
  });

  it("evaluates false for two adjacent days", () => {
    expect(isSameDay("2020-11-17", new Date("2020-11-18T10:00:00Z"))).toBe(false);
  });

  it("evaluates true with 1 date given", () => {
    const input = new Date();
    input.setHours(3);

    expect(isSameDay(input, null)).toBe(true);
  });
});
