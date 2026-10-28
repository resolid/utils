import { describe, expect, it } from "vitest";
import { addSeconds, subSeconds } from "./add-seconds";

describe("addSeconds", () => {
  it("can increment a normal hour", () => {
    expect(addSeconds("2022-01-01T00:00:00Z", 1).toISOString()).toBe("2022-01-01T00:00:01.000Z");
  });

  it("can increment the last hours of the day into a new day", () => {
    expect(addSeconds("2022-01-01T23:11:00Z", 3600 * 3 + 1).toISOString()).toBe(
      "2022-01-02T02:11:01.000Z",
    );
  });

  it("decrements across year boundary when subtracting seconds from the start of a year", () => {
    expect(subSeconds("2022-01-01T00:00:30Z", 60).toISOString()).toBe("2021-12-31T23:59:30.000Z");
  });
});
