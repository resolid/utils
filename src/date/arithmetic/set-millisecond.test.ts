import { describe, expect, it } from "vitest";
import { setMillisecond } from "./set-millisecond";

describe("setMillisecond", () => {
  it("sets the millisecond to the given value", () => {
    expect(setMillisecond("2024-01-15T12:30:00Z", 500).toISOString()).toBe(
      "2024-01-15T12:30:00.500Z",
    );
  });

  it("sets the millisecond to 0", () => {
    expect(setMillisecond("2024-01-15T12:30:00.999Z", 0).toISOString()).toBe(
      "2024-01-15T12:30:00.000Z",
    );
  });

  it("sets the millisecond to 999", () => {
    expect(setMillisecond("2024-01-15T12:30:00Z", 999).toISOString()).toBe(
      "2024-01-15T12:30:00.999Z",
    );
  });

  it("sets the millisecond to the same value returns the same date", () => {
    expect(setMillisecond("2024-01-15T12:30:00.500Z", 500).toISOString()).toBe(
      "2024-01-15T12:30:00.500Z",
    );
  });

  it("preserves hours, minutes and seconds", () => {
    expect(setMillisecond("2024-01-15T08:30:45Z", 123).toISOString()).toBe(
      "2024-01-15T08:30:45.123Z",
    );
  });
});
