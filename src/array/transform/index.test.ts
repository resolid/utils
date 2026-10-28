import { describe, expect, it } from "vitest";
import { asArray, chunk, chunkBy, compact, partition, windowed } from "./index";

describe("array transform", () => {
  describe("asArray", () => {
    it("wraps a single value into an array", () => {
      expect(asArray(5)).toEqual([5]);
      expect(asArray("hello")).toEqual(["hello"]);
    });

    it("returns the original array when the input is already an array", () => {
      const arr = [1, 2, 3];

      expect(asArray(arr)).toBe(arr);
    });

    it("returns the same empty array reference", () => {
      const arr: number[] = [];

      expect(asArray(arr)).toBe(arr);
    });
  });

  describe("chunk", () => {
    it("splits an array into chunks of the given size", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("returns a single chunk when size is greater than or equal to the length", () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
      expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    });

    it("returns an empty array for an empty input", () => {
      expect(chunk([], 3)).toEqual([]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      chunk(arr, 2);

      expect(arr).toEqual([1, 2, 3]);
    });

    it("returns shallow copies of the original array", () => {
      const arr = [1, 2, 3];
      const result = chunk(arr, 2);

      result[0]!.push(99);

      expect(arr).toEqual([1, 2, 3]);
    });

    it("throws for invalid sizes", () => {
      expect(() => chunk([1], 0)).toThrow(RangeError);
      expect(() => chunk([1], -1)).toThrow(RangeError);
      expect(() => chunk([1], 1.5)).toThrow(RangeError);
      expect(() => chunk([1], Number.NaN)).toThrow(RangeError);
      expect(() => chunk([1], Number.POSITIVE_INFINITY)).toThrow(RangeError);
    });
  });

  describe("chunkBy", () => {
    it("groups consecutive elements with the same key", () => {
      expect(chunkBy([1, 1, 2, 2, 3], (value) => value)).toEqual([[1, 1], [2, 2], [3]]);
    });

    it("keeps non-consecutive keys in separate groups", () => {
      expect(chunkBy([1, 2, 1], (value) => value)).toEqual([[1], [2], [1]]);
    });

    it("supports object keys through the mapper", () => {
      const input = [{ type: "a" }, { type: "a" }, { type: "b" }];

      expect(chunkBy(input, (value) => value.type)).toEqual([
        [{ type: "a" }, { type: "a" }],
        [{ type: "b" }],
      ]);
    });

    it("calls the mapper once per element", () => {
      let calls = 0;

      chunkBy([1, 2, 3], (value) => {
        calls++;
        return value;
      });

      expect(calls).toBe(3);
    });

    it("returns an empty array for an empty input", () => {
      expect(chunkBy([], (value) => value)).toEqual([]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 1, 2];

      chunkBy(arr, (value) => value);

      expect(arr).toEqual([1, 1, 2]);
    });
  });

  describe("compact", () => {
    it("removes all falsey values", () => {
      expect(compact([0, 1, false, 2, "", "a", null, undefined, Number.NaN, 3])).toEqual([
        1,
        2,
        "a",
        3,
      ]);
    });

    it("keeps empty arrays and objects", () => {
      expect(compact([[], {}, 0, ""])).toEqual([[], {}]);
    });

    it("removes zero bigints", () => {
      expect(compact([0n, 1n])).toEqual([1n]);
    });

    it("returns an empty array for an empty input", () => {
      expect(compact([])).toEqual([]);
    });

    it("does not modify the original array", () => {
      const arr = [0, 1, 2];

      compact(arr);

      expect(arr).toEqual([0, 1, 2]);
    });
  });

  describe("partition", () => {
    it("splits the array by the predicate", () => {
      const [even, odd] = partition([1, 2, 3, 4, 5], (value) => value % 2 === 0);

      expect(even).toEqual([2, 4]);
      expect(odd).toEqual([1, 3, 5]);
    });

    it("returns empty arrays when no elements match", () => {
      const [matches, rest] = partition([1, 3, 5], (value) => value % 2 === 0);

      expect(matches).toEqual([]);
      expect(rest).toEqual([1, 3, 5]);
    });

    it("returns empty arrays when all elements match", () => {
      const [matches, rest] = partition([2, 4, 6], (value) => value % 2 === 0);

      expect(matches).toEqual([2, 4, 6]);
      expect(rest).toEqual([]);
    });

    it("passes the index to the predicate", () => {
      expect(partition(["a", "b"], (_, index) => index === 0)).toEqual([["a"], ["b"]]);
    });

    it("returns two empty arrays for an empty input", () => {
      expect(partition([], () => true)).toEqual([[], []]);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      partition(arr, (value) => value > 1);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("windowed", () => {
    it("returns overlapping windows with the default step", () => {
      expect(windowed([1, 2, 3, 4], 2)).toEqual([
        [1, 2],
        [2, 3],
        [3, 4],
      ]);
    });

    it("supports a custom step", () => {
      expect(windowed([1, 2, 3, 4, 5], 2, 2)).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it("keeps partial trailing windows when enabled", () => {
      expect(windowed([1, 2, 3, 4, 5], 2, 2, { partialWindows: true })).toEqual([
        [1, 2],
        [3, 4],
        [5],
      ]);
    });

    it("supports size 1", () => {
      expect(windowed([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it("returns no windows when size is greater than the length", () => {
      expect(windowed([1, 2, 3], 5)).toEqual([]);
    });

    it("returns partial windows for every start position when partialWindows is enabled and size is too large", () => {
      expect(windowed([1, 2, 3], 5, 1, { partialWindows: true })).toEqual([[1, 2, 3], [2, 3], [3]]);
    });

    it("returns an empty array for an empty input", () => {
      expect(windowed([], 2)).toEqual([]);
    });

    it("throws for invalid sizes and steps", () => {
      expect(() => windowed([1], 0)).toThrow(RangeError);
      expect(() => windowed([1], 1.5)).toThrow(RangeError);
      expect(() => windowed([1], 1, 0)).toThrow(RangeError);
      expect(() => windowed([1], 1, -1)).toThrow(RangeError);
      expect(() => windowed([1], 1, 1.5)).toThrow(RangeError);
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      windowed(arr, 2);

      expect(arr).toEqual([1, 2, 3]);
    });
  });
});
