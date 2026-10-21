import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { subDays } from "../lib/add-days";
import { diffInDays } from "../lib/diff-in-days";

describe("diffInDays", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2024-04-07T09:10:00.000Z") });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("difference is 3 days", () => {
    expect(diffInDays("2024-04-10", "2024-04-07")).toBe(3);
  });

  it("difference is 2 days", () => {
    expect(diffInDays("2024-04-10T09:50:00.000Z", "2024-04-07T15:28:00.000Z")).toBe(2);
  });

  it("difference is 3 days by using round", () => {
    expect(diffInDays("2024-04-10T09:50:00.000Z", "2024-04-07T15:28:00.000Z", "round")).toBe(3);
  });

  it("different should be -64 hours compared to the current time", () => {
    const compare = subDays(null, 28);

    expect(diffInDays(compare, null)).toBe(-28);
  });
});
