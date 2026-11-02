import { describe, expect, it, vi } from "vitest";
import { always, callAll, noop, once, resolveValue } from "./index";

describe("noop", () => {
  it("should be a function", () => {
    expect(typeof noop).toBe("function");
  });

  it("should return undefined", () => {
    expect(noop()).toBeUndefined();
  });
});

describe("once", () => {
  it("should call the function only once", () => {
    const func = vi.fn(() => 42);
    const onceFunc = once(func);

    expect(onceFunc()).toBe(42);
    expect(onceFunc()).toBe(42);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should work with functions returning undefined", () => {
    const func = vi.fn(() => undefined);
    const onceFunc = once(func);

    expect(onceFunc()).toBeUndefined();
    expect(onceFunc()).toBeUndefined();
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should handle functions with no return value", () => {
    const func = vi.fn(() => {
      console.log("Side effect");
    });
    const onceFunc = once(func);

    expect(onceFunc()).toBeUndefined();
    expect(onceFunc()).toBeUndefined();
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("should preserve this context", () => {
    const object = {
      value: 42,
      getValue: once(function (this: { value: number }) {
        return this.value;
      }),
    };

    expect(object.getValue()).toBe(42);
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

describe("resolveValue", () => {
  it("should return the value directly if not a function", () => {
    expect(resolveValue(5)).toBe(5);
    expect(resolveValue("test")).toBe("test");
  });

  it("should call the function with arguments if value is a function", () => {
    const fn = vi.fn((x: number, y: number) => x + y);
    expect(resolveValue(fn, 2, 3)).toBe(5);
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
