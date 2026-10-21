import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addHours } from "../lib/add-hours";
import { diffInHours } from "../lib/diff-in-hours";

describe("differenceInHours", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2024-04-07T09:10:00.000Z") });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("difference is 5 hours", () => {
    expect(diffInHours("2024-04-07T15:28:00.000Z", "2024-04-07T09:50:00.000Z")).toBe(5);
  });

  it("different should be -64 hours compared to the current time", () => {
    const compare = addHours(null, 64);

    expect(diffInHours(null, compare)).toBe(-64);
  });
});
