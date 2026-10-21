import { afterEach, beforeEach, describe, expect, it, suite, vi } from "vitest";
import { addYears } from "../lib/add-years";
import { diffInYears } from "../lib/diff-in-years";

describe("diffInYears", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2024-04-07T09:10:00.000Z") });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the amount of full years between dates", () => {
    expect(diffInYears("2025-04-20", "2024-03-31")).toBe(1);
  });

  it("returns a negative number when swapped around as the first is now smaller", () => {
    expect(diffInYears("2024-03-31", "2025-04-20")).toBe(-1);
  });

  suite("leap days", () => {
    it("supports right side dates that are after a leap day", () => {
      expect(diffInYears("2024-02-29", "2022-03-01")).toBe(1);
    });

    it("And also supports if right side date is before the leap date", () => {
      expect(diffInYears("2024-02-29", "2022-02-28")).toBe(2);
    });

    it("supports future dates", () => {
      expect(diffInYears("2024-02-29", "2026-03-10")).toBe(-2);
    });

    it("equal (leap) day give 0", () => {
      expect(diffInYears("2024-02-28", "2024-02-28")).toBe(0);
    });

    it("Future (leap) dates supported", () => {
      expect(diffInYears("2028-02-29", "2024-02-29")).toBe(4);
    });
  });

  suite("edge cases", () => {
    it("difference is less than a year because of 1 day difference", () => {
      expect(diffInYears("2025-04-26", "2024-04-27")).toBe(0);
    });

    it("same but swapped", () => {
      expect(diffInYears("2024-04-27", "2025-04-26")).toBe(0);
    });
  });

  it("different should be 3 month compared to the current time", () => {
    const compare = addYears(null, -6);

    expect(diffInYears(null, compare)).toBe(6);
  });
});
