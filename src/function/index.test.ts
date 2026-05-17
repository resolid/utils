import { describe, expect, it, vi } from "vitest";
import { always, callAll, noop, retry, runIf, sleep, to } from "./index";

describe("noop", () => {
  it("should do nothing and not throw", () => {
    expect(() => noop()).not.toThrow();
  });
});

describe("sleep", () => {
  it("should return a promise that resolves after given ms", async () => {
    const start = Date.now();
    await sleep(50);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(50);
  });
});

describe("retry", () => {
  it("should not retry when predicate succeeds", async () => {
    const fnMock = vi.fn().mockResolvedValue(true);

    const result = await retry<boolean, Error>(
      () => fnMock(),
      (result) => result,
      1,
      () => new Error(),
      10,
    );

    expect(result).toEqual(true);
    expect(fnMock).toHaveBeenCalledTimes(1);
  });

  it("should retry when predicate fails", async () => {
    const fnMock = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    const result = await retry<boolean, Error>(
      () => fnMock(),
      (result) => result,
      1,
      () => new Error(),
      10,
    );

    expect(result).toEqual(true);
    expect(fnMock).toHaveBeenCalledTimes(2);
  });

  it("should invoke timeout handler on timeout", async () => {
    const fnMock = vi.fn().mockResolvedValue(false);
    const timeoutMock = vi.fn().mockReturnValue(new Error());

    const result = await retry<boolean, Error>(
      () => fnMock(),
      (result) => result,
      1,
      () => timeoutMock(),
      10,
    );

    expect(result).toEqual(new Error());
    expect(timeoutMock).toHaveBeenCalledTimes(1);
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

describe("to", () => {
  it("should resolve with [null, data] when promise resolves", async () => {
    const promise = Promise.resolve(100);
    const result = await to(promise);
    expect(result).toEqual([null, 100]);
  });

  it("should resolve with [error, undefined] when promise rejects", async () => {
    const error = new Error("fail");
    const promise = Promise.reject(error);
    const result = await to(promise);
    expect(result).toEqual([error, undefined]);
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
