import { describe, expect, it } from "vitest";
import { countBy, keyBy, maxBy, minBy } from "./index";

describe("array aggregate", () => {
  describe("countBy", () => {
    it("counts elements by the mapped key", () => {
      expect(countBy(["a", "b", "a"], (value) => value)).toEqual({ a: 2, b: 1 });
    });

    it("supports numeric keys", () => {
      expect(countBy([1, 2, 3, 4], (value) => value % 2)).toEqual({ 0: 2, 1: 2 });
    });

    it("passes the index to the mapper", () => {
      expect(countBy(["a", "b", "c"], (_, index) => index % 2)).toEqual({ 0: 2, 1: 1 });
    });

    it("returns an empty object for an empty input", () => {
      expect(countBy([], (value) => value)).toEqual({});
    });

    it("returns a null-prototype object", () => {
      expect(Object.getPrototypeOf(countBy([], (value) => value))).toBeNull();
    });

    it("does not modify the original array", () => {
      const arr = [1, 2, 3];

      countBy(arr, (value) => value);

      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("keyBy", () => {
    it("indexes elements by the mapped key", () => {
      expect(keyBy([{ id: "a" }, { id: "b" }], (value) => value.id)).toEqual({
        a: { id: "a" },
        b: { id: "b" },
      });
    });

    it("keeps the last element for duplicate keys", () => {
      expect(
        keyBy(
          [
            { id: "a", value: 1 },
            { id: "a", value: 2 },
          ],
          (value) => value.id,
        ),
      ).toEqual({
        a: { id: "a", value: 2 },
      });
    });

    it("passes the index to the mapper", () => {
      expect(keyBy(["a", "b"], (_, index) => index)).toEqual({ 0: "a", 1: "b" });
    });

    it("returns an empty object for an empty input", () => {
      expect(keyBy([], (value) => value)).toEqual({});
    });

    it("returns a null-prototype object", () => {
      expect(Object.getPrototypeOf(keyBy([], (value) => value))).toBeNull();
    });
  });

  describe("maxBy", () => {
    it("returns the element with the largest mapped value", () => {
      expect(maxBy([{ n: 1 }, { n: 5 }, { n: 3 }], (value) => value.n)).toEqual({ n: 5 });
    });

    it("returns the first element when values are tied", () => {
      const first = { n: 5, id: 1 };

      expect(maxBy([first, { n: 5, id: 2 }], (value) => value.n)).toBe(first);
    });

    it("supports negative values", () => {
      expect(maxBy([{ n: -5 }, { n: -1 }], (value) => value.n)).toEqual({ n: -1 });
    });

    it("returns undefined for an empty input", () => {
      expect(maxBy([], (value) => value)).toBeUndefined();
    });

    it("returns the element immediately when the mapper returns NaN", () => {
      const first = { n: Number.NaN, id: 1 };

      expect(maxBy([first, { n: 10, id: 2 }], (value) => value.n)).toBe(first);
    });

    it("passes the index to the mapper", () => {
      expect(maxBy([10, 30, 20], (_, index) => index)).toBe(20);
    });
  });

  describe("minBy", () => {
    it("returns the element with the smallest mapped value", () => {
      expect(minBy([{ n: 1 }, { n: 5 }, { n: 3 }], (value) => value.n)).toEqual({ n: 1 });
    });

    it("returns the first element when values are tied", () => {
      const first = { n: 1, id: 1 };

      expect(minBy([first, { n: 1, id: 2 }], (value) => value.n)).toBe(first);
    });

    it("supports negative values", () => {
      expect(minBy([{ n: -5 }, { n: -1 }], (value) => value.n)).toEqual({ n: -5 });
    });

    it("returns undefined for an empty input", () => {
      expect(minBy([], (value) => value)).toBeUndefined();
    });

    it("returns the element immediately when the mapper returns NaN", () => {
      const first = { n: Number.NaN, id: 1 };

      expect(minBy([first, { n: 10, id: 2 }], (value) => value.n)).toBe(first);
    });

    it("passes the index to the mapper", () => {
      expect(minBy([30, 10, 20], (_, index) => index)).toBe(30);
    });
  });
});
