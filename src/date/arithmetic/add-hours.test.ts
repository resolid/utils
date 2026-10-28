import { describe, expect, it } from "vitest";
import { addHours, subHours } from "./add-hours";

describe("addHours", () => {
  it("can increment a normal hour", () => {
    expect(addHours("2022-01-01T00:00:00Z", 1).toISOString()).toBe("2022-01-01T01:00:00.000Z");
  });

  it("can increment the last hours of the day into a new day", () => {
    expect(addHours("2022-01-01T23:11:00Z", 3).toISOString()).toBe("2022-01-02T02:11:00.000Z");
  });

  it("decrements across year boundary when subtracting hours from the start of a year", () => {
    expect(subHours("2022-01-01T01:11:00Z", 6).toISOString()).toBe("2021-12-31T19:11:00.000Z");
  });
});
