import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addMonths } from "../lib/add-months";
import { diffInMonths } from "../lib/diff-in-months";

describe("differenceInMonths", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2024-04-07T09:10:00.000Z") });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should give 11 months", () => {
    expect(diffInMonths("2025-04-13", "2024-04-14")).toBe(11);
  });

  it("should give 12 months", () => {
    expect(diffInMonths("2025-04-14", "2024-04-14")).toBe(12);
  });

  it("should give a negative amount when the right side is in the future", () => {
    expect(diffInMonths("2024-04-14", "2025-04-15")).toBe(-12);
  });

  it("should give 8 months" /* till it's xmas */, () => {
    expect(diffInMonths("2024-12-25", "2024-04-13")).toBe(8);
  });

  it("should give 3 full months", () => {
    expect(diffInMonths("2024-04-13", "2023-12-25")).toBe(3); // not yet full 4 months
  });

  it("should still be a full month even if the left one is shorter", () => {
    expect(diffInMonths("2024-02-29", "2024-01-31")).toBe(1);
  });

  it("should also be a negative full month when swapped", () => {
    expect(diffInMonths("2024-01-31", "2024-02-29")).toBe(-1);
  });

  it("different should be 3 month compared to the current time", () => {
    const compare = addMonths(null, 3);

    expect(diffInMonths(compare, null)).toBe(3);
  });
});
