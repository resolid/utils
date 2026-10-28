import { describe, expect, it } from "vitest";
import {
  difference,
  differenceBy,
  differenceWith,
  removeAll,
  removeAt,
  removeWhere,
} from "./index";

describe("array filter", () => {
  describe("difference", () => {
    it("returns elements that are not in the excluded array", () => {
      expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
    });

    it("keeps duplicates from the source array", () => {
      expect(difference([1, 1, 2], [2])).toEqual([1, 1]);
    });

    it("returns a copy when there is no overlap", () => {
      const arr = [1, 2, 3];
      const result = difference(arr, [4, 5]);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("returns a copy when the excluded array is empty", () => {
      expect(difference([1, 2, 3], [])).toEqual([1, 2, 3]);
    });

    it("returns an empty array when the source array is empty", () => {
      expect(difference([], [1, 2])).toEqual([]);
    });

    it("compares NaN with SameValueZero", () => {
      expect(difference([Number.NaN, 1], [Number.NaN])).toEqual([1]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      difference(arr, [2]);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("differenceBy", () => {
    it("compares elements by the mapped key", () => {
      const input = [{ id: 1 }, { id: 2 }];
      const excluded = [{ id: 2 }];

      expect(differenceBy(input, excluded, (value) => value.id)).toEqual([{ id: 1 }]);
    });

    it("supports mapping different types to the same key", () => {
      expect(differenceBy([1, 2, 3], ["2"], String)).toEqual([1, 3]);
    });

    it("returns a copy when the excluded array is empty", () => {
      const arr = [1, 2, 3];
      const result = differenceBy(arr, [], (value) => value);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("calls the mapper for both arrays", () => {
      let calls = 0;
      const mapper = (value: number | string) => {
        calls++;
        return value;
      };

      differenceBy([1, 2], ["1"], mapper);

      expect(calls).toBe(3);
    });

    it("returns an empty array when the source array is empty", () => {
      expect(differenceBy([], [1], (value) => value)).toEqual([]);
    });
  });

  describe("differenceWith", () => {
    it("uses a custom equality function", () => {
      const input = [{ x: 1 }, { x: 2 }];
      const excluded = [{ x: 2 }];

      expect(differenceWith(input, excluded, (a, b) => a.x === b.x)).toEqual([{ x: 1 }]);
    });

    it("returns a copy when there is no match", () => {
      const arr = [1, 2, 3];
      const result = differenceWith(arr, [4], (a, b) => a === b);

      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr);
    });

    it("returns a copy when the excluded array is empty", () => {
      expect(differenceWith([1, 2, 3], [], (a, b) => a === b)).toEqual([1, 2, 3]);
    });

    it("returns an empty array when the source array is empty", () => {
      expect(differenceWith([], [1], (a, b) => a === b)).toEqual([]);
    });
  });

  describe("removeWhere", () => {
    it("removes matching elements in place and returns them", () => {
      const arr = [1, 2, 3, 4];

      const removed = removeWhere(arr, (value) => value % 2 === 0);

      expect(removed).toEqual([2, 4]);
      expect(arr).toEqual([1, 3]);
    });

    it("returns an empty array and keeps the source unchanged when nothing matches", () => {
      const arr = [1, 3, 5];

      const removed = removeWhere(arr, (value) => value % 2 === 0);

      expect(removed).toEqual([]);
      expect(arr).toEqual([1, 3, 5]);
    });

    it("empties the source array when everything matches", () => {
      const arr = [2, 4, 6];

      const removed = removeWhere(arr, (value) => value % 2 === 0);

      expect(removed).toEqual([2, 4, 6]);
      expect(arr).toEqual([]);
    });

    it("passes the index to the predicate", () => {
      const arr = [10, 20, 30];

      const removed = removeWhere(arr, (_, index) => index === 1);

      expect(removed).toEqual([20]);
      expect(arr).toEqual([10, 30]);
    });

    it("returns an empty array for an empty source", () => {
      const arr: number[] = [];

      expect(removeWhere(arr, () => true)).toEqual([]);
      expect(arr).toEqual([]);
    });
  });

  describe("removeAll", () => {
    it("removes all given values in place and returns them", () => {
      const arr = [1, 2, 3, 2];

      const removed = removeAll(arr, [2, 4]);

      expect(removed).toEqual([2, 2]);
      expect(arr).toEqual([1, 3]);
    });

    it("returns an empty array and keeps the source unchanged when nothing matches", () => {
      const arr = [1, 2, 3];

      expect(removeAll(arr, [4, 5])).toEqual([]);
      expect(arr).toEqual([1, 2, 3]);
    });

    it("returns an empty array when the value list is empty", () => {
      const arr = [1, 2, 3];

      expect(removeAll(arr, [])).toEqual([]);
      expect(arr).toEqual([1, 2, 3]);
    });

    it("removes NaN values", () => {
      const arr = [Number.NaN, 1];

      expect(removeAll(arr, [Number.NaN])).toEqual([Number.NaN]);
      expect(arr).toEqual([1]);
    });

    it("returns an empty array for an empty source", () => {
      const arr: number[] = [];

      expect(removeAll(arr, [1])).toEqual([]);
    });
  });

  describe("removeAt", () => {
    it("removes elements at the given indices", () => {
      const arr = [1, 2, 3, 4];

      const removed = removeAt(arr, [1, 3]);

      expect(removed).toEqual([2, 4]);
      expect(arr).toEqual([1, 3]);
    });

    it("returns removed elements in source order regardless of index order", () => {
      const arr = [1, 2, 3];

      expect(removeAt(arr, [2, 0])).toEqual([1, 3]);
      expect(arr).toEqual([2]);
    });

    it("supports negative indices", () => {
      const arr = [1, 2, 3, 4];

      const removed = removeAt(arr, [-1]);

      expect(removed).toEqual([4]);
      expect(arr).toEqual([1, 2, 3]);
    });

    it("ignores out-of-range indices", () => {
      const arr = [1, 2, 3];

      expect(removeAt(arr, [10, -10])).toEqual([]);
      expect(arr).toEqual([1, 2, 3]);
    });

    it("removes a duplicated index only once", () => {
      const arr = [1, 2, 3];

      const removed = removeAt(arr, [0, 0]);

      expect(removed).toEqual([1]);
      expect(arr).toEqual([2, 3]);
    });

    it("truncates fractional indices", () => {
      const arr = [1, 2, 3];

      expect(removeAt(arr, [1.9])).toEqual([2]);
      expect(arr).toEqual([1, 3]);
    });

    it("returns an empty array when the index list is empty", () => {
      const arr = [1, 2, 3];

      expect(removeAt(arr, [])).toEqual([]);
      expect(arr).toEqual([1, 2, 3]);
    });

    it("returns an empty array for an empty source", () => {
      const arr: number[] = [];

      expect(removeAt(arr, [0])).toEqual([]);
    });
  });
});
