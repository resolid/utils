import { describe, expect, it } from "vitest";
import { isEqual } from "./is-equal";

describe("isEqual", () => {
  it("returns false if the given dates are not equal", () => {
    expect(isEqual("2022-01-01", "2022-01-02")).toBe(false);
  });

  it("returns true if the given dates are equal", () => {
    expect(isEqual("2022-01-01", "2022-01-01")).toBe(true);
  });

  it("returns error if date is not valid", () => {
    expect(() => isEqual("invalid", "2022-01-01")).toThrow();
  });

  it("returns true because the create dated is the current time", () => {
    expect(isEqual(new Date(), null)).toBe(true);
  });
});
