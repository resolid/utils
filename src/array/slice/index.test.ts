import { describe, expect, it } from "vitest";
import {
  drop,
  dropLast,
  dropLastWhile,
  dropWhile,
  take,
  takeLast,
  takeLastWhile,
  takeWhile,
} from "./index";

describe("array slice", () => {
  describe("drop", () => {
    it("drops elements from the start", () => {
      expect(drop([1, 2, 3, 4], 2)).toEqual([3, 4]);
    });

    it("returns a copy when count is 0", () => {
      const arr = [1, 2, 3];
      const result = drop(arr, 0);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("returns an empty array when count is greater than the length", () => {
      expect(drop([1, 2, 3], 10)).toEqual([]);
    });

    it("returns a copy when count is negative", () => {
      expect(drop([1, 2, 3], -1)).toEqual([1, 2, 3]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      drop(arr, 1);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("dropWhile", () => {
    it("drops elements while the predicate is truthy", () => {
      expect(dropWhile([1, 2, 3, 4, 1], (value) => value < 3)).toEqual([3, 4, 1]);
    });

    it("returns an empty array when every element matches", () => {
      expect(dropWhile([1, 2, 3], (value) => value < 10)).toEqual([]);
    });

    it("returns a copy when no element matches", () => {
      const arr = [1, 2, 3];
      const result = dropWhile(arr, () => false);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("passes the index to the predicate", () => {
      expect(dropWhile([1, 2, 3], (_, index) => index < 2)).toEqual([3]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      dropWhile(arr, (value) => value < 3);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("dropLast", () => {
    it("drops elements from the end", () => {
      expect(dropLast([1, 2, 3, 4], 2)).toEqual([1, 2]);
    });

    it("returns a copy when count is 0", () => {
      const arr = [1, 2, 3];
      const result = dropLast(arr, 0);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("returns an empty array when count is greater than the length", () => {
      expect(dropLast([1, 2, 3], 10)).toEqual([]);
    });

    it("returns a copy when count is negative", () => {
      expect(dropLast([1, 2, 3], -1)).toEqual([1, 2, 3]);
    });

    it("truncates fractional counts", () => {
      expect(dropLast([1, 2, 3], 1.9)).toEqual([1, 2]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      dropLast(arr, 1);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("dropLastWhile", () => {
    it("drops elements from the end while the predicate is truthy", () => {
      expect(dropLastWhile([1, 2, 3, 4, 1], (value) => value < 3)).toEqual([1, 2, 3, 4]);
    });

    it("returns an empty array when every element matches", () => {
      expect(dropLastWhile([1, 2, 3], (value) => value < 10)).toEqual([]);
    });

    it("returns a copy when no element matches", () => {
      const arr = [1, 2, 3];
      const result = dropLastWhile(arr, () => false);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      dropLastWhile(arr, (value) => value > 2);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("take", () => {
    it("takes elements from the start", () => {
      expect(take([1, 2, 3, 4], 2)).toEqual([1, 2]);
    });

    it("returns an empty array when count is 0", () => {
      expect(take([1, 2, 3], 0)).toEqual([]);
    });

    it("returns a copy when count is greater than the length", () => {
      const arr = [1, 2, 3];
      const result = take(arr, 10);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("returns an empty array when count is negative", () => {
      expect(take([1, 2, 3], -1)).toEqual([]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      take(arr, 2);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("takeLast", () => {
    it("takes elements from the end", () => {
      expect(takeLast([1, 2, 3, 4], 2)).toEqual([3, 4]);
    });

    it("returns an empty array when count is 0", () => {
      expect(takeLast([1, 2, 3], 0)).toEqual([]);
    });

    it("returns an empty array when count is negative", () => {
      expect(takeLast([1, 2, 3], -1)).toEqual([]);
    });

    it("returns a copy when count is greater than the length", () => {
      const arr = [1, 2, 3];
      const result = takeLast(arr, 10);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("truncates fractional counts", () => {
      expect(takeLast([1, 2, 3], 1.9)).toEqual([3]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      takeLast(arr, 2);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("takeWhile", () => {
    it("takes elements while the predicate is truthy", () => {
      expect(takeWhile([1, 2, 3, 4, 1], (value) => value < 3)).toEqual([1, 2]);
    });

    it("returns a copy when every element matches", () => {
      const arr = [1, 2, 3];
      const result = takeWhile(arr, () => true);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("returns an empty array when no element matches", () => {
      expect(takeWhile([1, 2, 3], () => false)).toEqual([]);
    });

    it("passes the index to the predicate", () => {
      expect(takeWhile([1, 2, 3], (_, index) => index < 2)).toEqual([1, 2]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      takeWhile(arr, (value) => value < 3);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("takeLastWhile", () => {
    it("takes elements from the end while the predicate is truthy", () => {
      expect(takeLastWhile([1, 2, 3, 4, 1], (value) => value < 3)).toEqual([1]);
    });

    it("returns a copy when every element matches", () => {
      const arr = [1, 2, 3];
      const result = takeLastWhile(arr, () => true);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("returns an empty array when no element matches", () => {
      expect(takeLastWhile([1, 2, 3], () => false)).toEqual([]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      takeLastWhile(arr, (value) => value > 2);

      expect(arr).toEqual([1, 2, 3]);
    });
  });
});
