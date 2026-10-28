import { describe, expect, it } from "vitest";
import { clamp, randomFloat, randomInt, range } from "./index";

describe("math", () => {
  describe("clamp", () => {
    it("returns value when within range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(5n, 0n, 10n)).toBe(5n);
    });

    it("clamps to max when value exceeds max", () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(15n, 0n, 10n)).toBe(10n);
    });

    it("clamps to min when value is below min", () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-5n, 0n, 10n)).toBe(0n);
    });

    it("works with only max defined", () => {
      expect(clamp(15, null, 10)).toBe(10);
      expect(clamp(15n, null, 10n)).toBe(10n);
    });

    it("works with only min defined", () => {
      expect(clamp(-5, 0, null)).toBe(0);
      expect(clamp(-5n, 0n, null)).toBe(0n);
    });

    it("returns value when no bounds are provided", () => {
      expect(clamp(5, null, null)).toBe(5);
      expect(clamp(5n, null, null)).toBe(5n);
    });

    it("throws when min > max", () => {
      expect(() => clamp(5, 10, 0)).toThrow("invalid clamp range");
      expect(() => clamp(5n, 10n, 0n)).toThrow("invalid clamp range");
    });
  });

  describe("range", () => {
    it("should generate a range from start to end inclusive", () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(range(0, 0)).toEqual([0]);
    });

    it("should return an empty array if start > end", () => {
      expect(range(5, 1)).toEqual([]);
      expect(range(10, 0)).toEqual([]);
    });

    it("should work with negative numbers", () => {
      expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    });
  });

  describe("randomFloat", () => {
    it("returns a value within [min, max)", () => {
      for (let i = 0; i < 100; i++) {
        const value = randomFloat(1, 5);

        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThan(5);
      }
    });

    it("uses 0 as the lower bound when only max is given", () => {
      for (let i = 0; i < 100; i++) {
        const value = randomFloat(5);

        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(5);
      }
    });

    it("supports decimal ranges", () => {
      for (let i = 0; i < 100; i++) {
        const value = randomFloat(0.5, 1.5);

        expect(value).toBeGreaterThanOrEqual(0.5);
        expect(value).toBeLessThan(1.5);
      }
    });

    it("throws when max is not greater than min", () => {
      expect(() => randomFloat(5, 5)).toThrow(RangeError);
      expect(() => randomFloat(5, 1)).toThrow(RangeError);
    });

    it("throws for non-finite bounds", () => {
      expect(() => randomFloat(Number.NaN)).toThrow(RangeError);
      expect(() => randomFloat(0, Number.POSITIVE_INFINITY)).toThrow(RangeError);
      expect(() => randomFloat(Number.NEGATIVE_INFINITY, 0)).toThrow(RangeError);
    });
  });

  describe("randomInt", () => {
    it("returns an integer within [min, max)", () => {
      for (let i = 0; i < 100; i++) {
        const value = randomInt(1, 5);

        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThan(5);
      }
    });

    it("uses 0 as the lower bound when only max is given", () => {
      for (let i = 0; i < 100; i++) {
        const value = randomInt(5);

        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(5);
      }
    });

    it("handles negative ranges", () => {
      for (let i = 0; i < 100; i++) {
        const value = randomInt(-5, -2);

        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(-5);
        expect(value).toBeLessThan(-2);
      }
    });

    it("throws when the range contains no integer", () => {
      expect(() => randomInt(0.1, 0.9)).toThrow(RangeError);
      expect(() => randomInt(5, 5)).toThrow(RangeError);
      expect(() => randomInt(5, 1)).toThrow(RangeError);
    });

    it("throws for non-finite bounds", () => {
      expect(() => randomInt(Number.NaN, 5)).toThrow(RangeError);
      expect(() => randomInt(0, Number.POSITIVE_INFINITY)).toThrow(RangeError);
    });
  });
});
