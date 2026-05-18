import { describe, expect, it, vi } from "vitest";
import { always, callAll, noop, runIf } from "./index";

describe("noop", () => {
  it("should do nothing and not throw", () => {
    expect(() => noop()).not.toThrow();
  });
});

describe("always", () => {
  it("should return a function that always returns the value", () => {
    const fn = always(42);
    expect(fn()).toBe(42);
    expect(fn()).toBe(42);
  });

  it("should work with any type", () => {
    const obj = { a: 1 };
    const fn = always(obj);
    expect(fn()).toBe(obj);
  });
});

describe("runIf", () => {
  it("should return the value directly if not a function", () => {
    expect(runIf(5)).toBe(5);
    expect(runIf("test")).toBe("test");
  });

  it("should call the function with arguments if value is a function", () => {
    const fn = vi.fn((x: number, y: number) => x + y);
    expect(runIf(fn, 2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledWith(2, 3);
  });
});

describe("callAll", () => {
  it("should call all provided functions with arguments", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = null;

    const combined = callAll(fn1, fn2, fn3);
    combined(1, 2);

    expect(fn1).toHaveBeenCalledWith(1, 2);
    expect(fn2).toHaveBeenCalledWith(1, 2);
  });

  it("should handle empty array without errors", () => {
    const combined = callAll();
    expect(() => combined()).not.toThrow();
  });
});
