import { describe, expect, it } from "vitest";
import { diffInMilliseconds } from "./diff-in-milliseconds";

describe("diffInMilliseconds", () => {
  it("difference is 257 milliseconds", () => {
    expect(diffInMilliseconds("2024-04-07T09:10:48.257Z", "2024-04-07T09:10:48.000Z")).toBe(257);
  });

  it("should be 5000 milliseconds difference compared to a specific time", () => {
    const base = new Date("2024-01-01T00:00:00.000Z");
    const later = new Date("2024-01-01T00:00:05.000Z");
    expect(diffInMilliseconds(later, base)).toBe(5000);
  });

  it("should be -5000 milliseconds difference compared to a specific time", () => {
    const base = new Date("2024-01-01T00:00:00.000Z");
    const later = new Date("2024-01-01T00:00:05.000Z");
    expect(diffInMilliseconds(base, later)).toBe(-5000);
  });
});
