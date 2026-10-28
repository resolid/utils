import { describe, expect, it } from "vitest";
import { sortDates } from "./sort-dates";

describe("sortDates", () => {
  const d1 = new Date("2024-01-01");
  const d2 = new Date("2024-06-15");
  const d3 = new Date("2024-12-31");

  it("should sort dates in ascending order by default", () => {
    expect(sortDates([d3, d1, d2])).toEqual([d1, d2, d3]);
  });

  it('should sort dates in ascending order when order is "asc"', () => {
    expect(sortDates([d3, d1, d2], "asc")).toEqual([d1, d2, d3]);
  });

  it('should sort dates in descending order when order is "desc"', () => {
    expect(sortDates([d1, d3, d2], "desc")).toEqual([d3, d2, d1]);
  });

  it("should filter out null and undefined values", () => {
    expect(sortDates([null, d3, undefined, d1])).toEqual([d1, d3]);
  });

  it("should return an empty array when all values are null or undefined", () => {
    expect(sortDates([null, undefined])).toEqual([]);
  });

  it("should return an empty array for an empty input", () => {
    expect(sortDates([])).toEqual([]);
  });

  it("should return a single date as-is", () => {
    expect(sortDates([d2])).toEqual([d2]);
  });

  it("should not mutate the original array", () => {
    const input = [d3, d1, d2];
    sortDates(input);
    expect(input).toEqual([d3, d1, d2]);
  });

  it("should handle duplicate dates", () => {
    expect(sortDates([d2, d1, d2])).toEqual([d1, d2, d2]);
  });
});
