import { describe, expect, it } from "vitest";
import { setSecond } from "./set-second";

describe("setSecond", () => {
  it("sets the second to the given value", () => {
    expect(setSecond("2024-01-15T12:30:00Z", 45).toISOString()).toBe("2024-01-15T12:30:45.000Z");
  });

  it("sets the second to 0", () => {
    expect(setSecond("2024-01-15T12:30:45Z", 0).toISOString()).toBe("2024-01-15T12:30:00.000Z");
  });

  it("sets the second to 59", () => {
    expect(setSecond("2024-01-15T12:30:00Z", 59).toISOString()).toBe("2024-01-15T12:30:59.000Z");
  });

  it("sets the second to the same value returns the same date", () => {
    expect(setSecond("2024-01-15T12:30:45Z", 45).toISOString()).toBe("2024-01-15T12:30:45.000Z");
  });

  it("preserves hours and minutes", () => {
    expect(setSecond("2024-01-15T08:30:00Z", 45).toISOString()).toBe("2024-01-15T08:30:45.000Z");
  });
});
