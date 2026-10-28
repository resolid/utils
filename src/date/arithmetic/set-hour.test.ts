import { describe, expect, it } from "vitest";
import { setHour } from "./set-hour";

describe("setHour", () => {
  it("sets the hour to the given value", () => {
    expect(setHour("2024-01-15T00:00:00Z", 12).toISOString()).toBe("2024-01-15T12:00:00.000Z");
  });

  it("sets the hour to midnight", () => {
    expect(setHour("2024-01-15T12:00:00Z", 0).toISOString()).toBe("2024-01-15T00:00:00.000Z");
  });

  it("sets the hour to 23", () => {
    expect(setHour("2024-01-15", 23).toISOString()).toBe("2024-01-15T23:00:00.000Z");
  });

  it("sets the hour to the same value returns the same date", () => {
    expect(setHour("2024-01-15T12:00:00Z", 12).toISOString()).toBe("2024-01-15T12:00:00.000Z");
  });

  it("preserves minutes and seconds", () => {
    expect(setHour("2024-01-15T08:30:45Z", 12).toISOString()).toBe("2024-01-15T12:30:45.000Z");
  });
});
