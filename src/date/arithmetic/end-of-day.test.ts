import { describe, expect, it } from "vitest";
import { endOfDay } from "./end-of-day";

describe("endOfDay", () => {
  it("can become the end of the day", () => {
    expect(endOfDay("2023-02-22T12:00:00Z").toISOString()).toBe("2023-02-22T23:59:59.999Z");
  });

  it("can become the end of the current day", () => {
    const compare = new Date();
    compare.setHours(23, 59, 59, 999);

    expect(endOfDay(null)).toEqual(compare);
  });
});
