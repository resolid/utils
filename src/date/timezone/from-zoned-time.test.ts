import { env } from "node:process";
import { afterEach, describe, expect, it } from "vitest";
import { fromZonedTime } from "./from-zoned-time";

describe("fromZonedTime", () => {
  it("returns the same instant for UTC", () => {
    expect(fromZonedTime("2023-02-22T00:00:00Z", "UTC").toISOString()).toBe(
      "2023-02-22T00:00:00.000Z",
    );
  });

  it("converts a Shanghai wall clock time to UTC", () => {
    expect(fromZonedTime("2023-02-22T00:00:00Z", "Asia/Shanghai").toISOString()).toBe(
      "2023-02-21T16:00:00.000Z",
    );
  });

  it("converts a New York wall clock time in winter", () => {
    expect(fromZonedTime("2023-02-22T00:00:00Z", "America/New_York").toISOString()).toBe(
      "2023-02-22T05:00:00.000Z",
    );
  });

  it("converts a New York wall clock time in summer", () => {
    expect(fromZonedTime("2023-07-01T00:00:00Z", "America/New_York").toISOString()).toBe(
      "2023-07-01T04:00:00.000Z",
    );
  });

  it("handles timezones with non full-hour offsets", () => {
    expect(fromZonedTime("2023-02-22T00:00:00Z", "Pacific/Chatham").toISOString()).toBe(
      "2023-02-21T10:15:00.000Z",
    );
  });

  describe("daylight saving transitions", () => {
    it("uses the post-transition offset for a wall time after the spring gap", () => {
      expect(fromZonedTime("2023-03-12T03:30:00Z", "America/New_York").toISOString()).toBe(
        "2023-03-12T07:30:00.000Z",
      );
    });

    it("shifts a nonexistent wall time forward across the spring gap", () => {
      expect(fromZonedTime("2023-03-12T02:30:00Z", "America/New_York").toISOString()).toBe(
        "2023-03-12T07:30:00.000Z",
      );
    });

    it("returns the earlier instant for an ambiguous New York wall time", () => {
      expect(fromZonedTime("2023-11-05T01:30:00Z", "America/New_York").toISOString()).toBe(
        "2023-11-05T05:30:00.000Z",
      );
    });

    it("returns the earlier instant for an ambiguous Amsterdam wall time", () => {
      expect(fromZonedTime("2023-10-29T02:30:00Z", "Europe/Amsterdam").toISOString()).toBe(
        "2023-10-29T00:30:00.000Z",
      );
    });
  });

  it("returns a new Date and does not mutate the input", () => {
    const input = new Date("2023-02-22T00:00:00Z");
    const result = fromZonedTime(input, "Asia/Shanghai");

    expect(result).not.toBe(input);
    expect(input.toISOString()).toBe("2023-02-22T00:00:00.000Z");
  });

  it("defaults to the current time when input is null", () => {
    const before = Date.now();
    const result = fromZonedTime(null, "UTC");

    expect(result).toBeInstanceOf(Date);
    expect(Math.abs(result.getTime() - before)).toBeLessThan(1000);
  });

  describe("device timezone independence", () => {
    const originalTZ = env.TZ;

    afterEach(() => {
      env.TZ = originalTZ;
    });

    it("does not depend on the device timezone", () => {
      env.TZ = "Asia/Tokyo";

      expect(fromZonedTime("2023-02-22T00:00:00Z", "Asia/Shanghai").toISOString()).toBe(
        "2023-02-21T16:00:00.000Z",
      );
      expect(fromZonedTime("2023-03-12T02:30:00Z", "America/New_York").toISOString()).toBe(
        "2023-03-12T07:30:00.000Z",
      );
    });
  });
});
