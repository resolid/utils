import { describe, expect, it } from "vitest";
import { startOfDay } from "./start-of-day";

describe("startOfDay", () => {
  it("can become the start of the day", () => {
    expect(startOfDay("2023-02-22T12:00:00Z").toISOString()).toBe("2023-02-22T00:00:00.000Z");
  });

  it("gets the start of the day", () => {
    const compare = new Date();
    compare.setHours(0, 0, 0, 0);

    expect(startOfDay(null)).toEqual(compare);
  });
});
