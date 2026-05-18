import { describe, expect, it, vi } from "vitest";
import { TimeoutError } from "../types";
import { abortable, retry, sleep, timeout, to } from "./index";

describe("abortable", () => {
  it("should return original promise when signal is not provided", () => {
    const promise = Promise.resolve(1);

    expect(abortable(promise)).toBe(promise);
  });

  it("should resolve when promise resolves before abort", async () => {
    const controller = new AbortController();

    await expect(abortable(Promise.resolve(42), controller.signal)).resolves.toBe(42);
  });

  it("should reject when promise rejects before abort", async () => {
    const controller = new AbortController();

    await expect(abortable(Promise.reject(new Error("failed")), controller.signal)).rejects.toThrow(
      "failed",
    );
  });

  it("should reject immediately when signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    expect(() => abortable(new Promise<never>(() => {}), controller.signal)).toThrow(DOMException);
  });

  it("should reject with custom reason when signal aborts", async () => {
    const controller = new AbortController();

    const result = abortable(new Promise<never>(() => {}), controller.signal);
    controller.abort(new Error("cancelled"));

    await expect(result).rejects.toThrow("cancelled");
  });

  it("should reject when signal aborts during async operation", async () => {
    const controller = new AbortController();

    const promise: Promise<never> = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("too late")), 1000);
    });

    const result = abortable(promise, controller.signal);
    controller.abort();

    await expect(result).rejects.toThrow(DOMException);
  });

  it("should remove abort listener after promise rejects", async () => {
    const controller = new AbortController();
    const removeEventListener = vi.spyOn(controller.signal, "removeEventListener");

    await abortable(Promise.reject(new Error("failed")), controller.signal).catch(() => {});

    expect(removeEventListener).toHaveBeenCalledWith("abort", expect.any(Function));
  });
});

describe("sleep", () => {
  it("should resolve after given milliseconds", async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(50);
  });
});

describe("timeout", () => {
  it("should rejects after a specified number of milliseconds", async () => {
    await expect(timeout(50)).rejects.toThrow(TimeoutError);
  });

  it("should rejects with a custom error message", async () => {
    await expect(timeout(50, "too slow")).rejects.toThrow(new TimeoutError("too slow"));
  });

  it("should rejects with a custom error function", async () => {
    class CustomError extends Error {}
    await expect(timeout(10, () => new CustomError())).rejects.toThrow(CustomError);
  });

  it("should resolves correctly when sleep finishes before timeout", async () => {
    await expect(Promise.race([sleep(10), timeout(100)])).resolves.toBeUndefined();
  });

  it("should rejects with timeout when it finishes before sleep", async () => {
    await expect(Promise.race([sleep(100), timeout(10)])).rejects.toThrow();
  });
});

describe("retry", () => {
  it("should resolve immediately when fn succeeds on first attempt", async () => {
    const fn = vi.fn().mockResolvedValue(42);

    await expect(retry(fn)).resolves.toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should resolve after retries when fn eventually succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue(42);

    await expect(retry(fn)).resolves.toBe(42);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should pass attempt number to fn", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);

    await retry(fn, 3);

    expect(fn).toHaveBeenCalledWith(0);
  });

  it("should reject after exceeding retries", async () => {
    const error = new Error("always fails");
    const fn = vi.fn().mockRejectedValue(error);

    await expect(retry(fn, 3)).rejects.toThrow("always fails");
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("should reject immediately when retries is 0", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(retry(fn, 0)).rejects.toThrow("fail");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should respect numeric shorthand for retries", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(retry(fn, 2)).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should call delay function with current attempt number", async () => {
    const delay = vi.fn().mockReturnValue(0);
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue(undefined);

    await retry(fn, { delay, retries: 3 });

    expect(delay).toHaveBeenCalledWith(0);
    expect(delay).toHaveBeenCalledWith(1);
  });

  it("should stop retrying when shouldRetry returns false", async () => {
    const error = new Error("fatal");
    const fn = vi.fn().mockRejectedValue(error);
    const shouldRetry = vi.fn().mockResolvedValue(false);

    await expect(retry(fn, { retries: 5, shouldRetry })).rejects.toThrow("fatal");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledWith(error, 0);
  });

  it("should pass error and attempt to shouldRetry", async () => {
    const errors = [new Error("first"), new Error("second")];
    const fn = vi
      .fn()
      .mockRejectedValueOnce(errors[0])
      .mockRejectedValueOnce(errors[1])
      .mockResolvedValue(undefined);
    const shouldRetry = vi.fn().mockResolvedValue(true);

    await retry(fn, { retries: 3, shouldRetry });

    expect(shouldRetry).toHaveBeenCalledWith(errors[0], 0);
    expect(shouldRetry).toHaveBeenCalledWith(errors[1], 1);
  });

  it("should throw immediately when signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(retry(() => Promise.resolve(1), { signal: controller.signal })).rejects.toThrow(
      DOMException,
    );
  });

  it("should reject when signal aborts during sleep", async () => {
    const controller = new AbortController();
    const reason = new Error("cancelled");
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    const result = retry(fn, { retries: 10, delay: 1000, signal: controller.signal });
    controller.abort(reason);

    await expect(result).rejects.toThrow("cancelled");
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
