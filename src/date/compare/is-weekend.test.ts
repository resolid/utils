import { describe, expect, it } from "vitest";
import { isWeekend } from "./is-weekend";

describe("isWeekend", () => {
  it("returns true if the given date is in a weekend", () => {
    const result = isWeekend(new Date(2014, 9 /* Oct */, 5));
    expect(result).toBe(true);
  });

  it("returns false if the given date is not in a weekend", () => {
    const result = isWeekend(new Date(2014, 9 /* Oct */, 6));
    expect(result).toBe(false);
  });
});
