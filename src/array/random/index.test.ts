import { describe, expect, it } from "vitest";
import { sample, sampleSize, shuffle } from "./index";

describe("array random", () => {
  describe("shuffle", () => {
    it("returns a permutation of the input", () => {
      const result = shuffle([1, 2, 3, 4]);

      expect([...result].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
    });

    it("returns a new array without modifying the input", () => {
      const arr = [1, 2, 3];
      const result = shuffle(arr);

      expect(result).not.toBe(arr);
      expect(arr).toEqual([1, 2, 3]);
    });

    it("returns an empty array for an empty input", () => {
      expect(shuffle([])).toEqual([]);
    });

    it("handles a single-element array", () => {
      expect(shuffle([1])).toEqual([1]);
    });
  });

  describe("sample", () => {
    it("returns an element from the array", () => {
      const arr = [1, 2, 3];

      for (let i = 0; i < 50; i++) {
        expect(arr).toContain(sample(arr));
      }
    });

    it("returns the only element of a single-element array", () => {
      expect(sample([1])).toBe(1);
    });

    it("returns undefined for an empty array", () => {
      expect(sample([])).toBeUndefined();
    });
  });

  describe("sampleSize", () => {
    it("returns the requested number of unique elements", () => {
      const arr = [1, 2, 3, 4];

      for (let i = 0; i < 50; i++) {
        const result = sampleSize(arr, 2);

        expect(result).toHaveLength(2);
        expect(new Set(result).size).toBe(2);
        expect(result.every((value) => arr.includes(value))).toBe(true);
      }
    });

    it("returns an empty array when count is 0", () => {
      expect(sampleSize([1, 2, 3], 0)).toEqual([]);
    });

    it("returns a permutation when count equals the length", () => {
      const result = sampleSize([1, 2, 3], 3);

      expect([...result].sort((a, b) => a - b)).toEqual([1, 2, 3]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      sampleSize(arr, 2);

      expect(arr).toEqual([1, 2, 3]);
    });

    it("throws when count is greater than the length", () => {
      expect(() => sampleSize([1, 2], 3)).toThrow(RangeError);
    });

    it("throws when count is negative or not an integer", () => {
      expect(() => sampleSize([1, 2], -1)).toThrow(RangeError);
      expect(() => sampleSize([1, 2], 1.5)).toThrow(RangeError);
    });
  });
});
