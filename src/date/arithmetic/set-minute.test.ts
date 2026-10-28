import { describe, expect, it } from "vitest";
import { setMinute } from "./set-minute";

describe("setMinute", () => {
  it("sets the minute to the given value", () => {
    expect(setMinute("2024-01-15T12:00:00Z", 30).toISOString()).toBe("2024-01-15T12:30:00.000Z");
  });

  it("sets the minute to 0", () => {
    expect(setMinute("2024-01-15T12:30:00Z", 0).toISOString()).toBe("2024-01-15T12:00:00.000Z");
  });

  it("sets the minute to 59", () => {
    expect(setMinute("2024-01-15T12:00:00Z", 59).toISOString()).toBe("2024-01-15T12:59:00.000Z");
  });

  it("sets the minute to the same value returns the same date", () => {
    expect(setMinute("2024-01-15T12:30:00Z", 30).toISOString()).toBe("2024-01-15T12:30:00.000Z");
  });

  it("preserves hours and seconds", () => {
    expect(setMinute("2024-01-15T08:00:45Z", 30).toISOString()).toBe("2024-01-15T08:30:45.000Z");
  });
});
