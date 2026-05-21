import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimeoutError } from "../types";
import { abortable, retry, sleep, to, withTimeout } from "./index";

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

    await expect(() => abortable(new Promise<never>(() => {}), controller.signal)).rejects.toThrow(
      "aborted",
    );
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

    await expect(result).rejects.toThrow("aborted");
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

  it("should aborts via signal", async () => {
    const ac = new AbortController();
    setTimeout(() => ac.abort(new Error("stop")), 5);
    await expect(sleep(100, ac.signal)).rejects.toThrow("stop");
  });

  it("should rejects immediately if already aborted", async () => {
    const ac = new AbortController();
    ac.abort();
    await expect(sleep(100, ac.signal)).rejects.toThrow();
  });
});

describe("withTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should resolve with the original value before timeout", async () => {
    expect(await withTimeout(Promise.resolve(42), 1000)).toBe(42);
  });

  it("should resolve even when ms is very small if promise is already settled", async () => {
    expect(await withTimeout(Promise.resolve("done"), 1)).toBe("done");
  });

  it("should reject with the original error if promise rejects before timeout", async () => {
    await expect(withTimeout(Promise.reject(new Error("original")), 1000)).rejects.toThrow(
      "original",
    );
  });

  it("should reject with TimeoutError when timeout fires first", async () => {
    const result = withTimeout(new Promise(() => {}), 500);

    vi.advanceTimersByTime(500);

    await expect(result).rejects.toBeInstanceOf(TimeoutError);
  });

  it("should not reject with TimeoutError if promise resolves before timeout", async () => {
    let resolve!: (v: number) => void;
    const promise: Promise<number> = new Promise((res) => (resolve = res));
    const result = withTimeout(promise, 1000);

    resolve(99);
    await Promise.resolve();
    vi.advanceTimersByTime(1000);

    await expect(result).resolves.toBe(99);
  });

  it("should reject immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(withTimeout(new Promise(() => {}), 1000, controller.signal)).rejects.toThrow(
      "aborted",
    );
  });

  it("should reject with AbortError when signal is aborted during wait", async () => {
    const controller = new AbortController();
    const result = withTimeout(new Promise(() => {}), 1000, controller.signal);

    controller.abort();

    await expect(result).rejects.toThrow("aborted");
  });

  it("should reject with signal.reason if reason is provided", async () => {
    const controller = new AbortController();
    const reason = new Error("custom abort reason");
    const promise: Promise<never> = new Promise(() => {});
    const result = withTimeout(promise, 1000, controller.signal);

    controller.abort(reason);

    await expect(result).rejects.toThrow("custom abort reason");
  });

  it("should not reject with TimeoutError if aborted before timeout fires", async () => {
    const controller = new AbortController();
    const result = withTimeout(new Promise(() => {}), 1000, controller.signal);

    controller.abort();

    vi.advanceTimersByTime(1000);

    await expect(result).rejects.toThrow("aborted");
    await expect(result).rejects.not.toBeInstanceOf(TimeoutError);
  });

  it("should clear the timer after promise resolves", async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    await withTimeout(Promise.resolve(1), 1000);

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("should remove abort listener after promise resolves", async () => {
    const controller = new AbortController();
    const removeListenerSpy = vi.spyOn(controller.signal, "removeEventListener");

    await withTimeout(Promise.resolve(1), 1000, controller.signal);

    expect(removeListenerSpy).toHaveBeenCalledWith("abort", expect.any(Function));
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
