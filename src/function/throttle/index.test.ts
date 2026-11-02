import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce, throttle } from "./index";

const sleep = (ms: number) => vi.advanceTimersByTimeAsync(ms);

describe("Throttle & Debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("debounce", () => {
    it("should debounce function calls", async () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait);

      debounced();
      debounced();
      debounced();

      await sleep(wait * 2);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it("should delay the function call by the specified wait time", async () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait);

      debounced();
      await sleep(wait / 2);
      expect(func).not.toHaveBeenCalled();

      await sleep(wait / 2 + 1);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it("should reset the wait time if called again before wait time ends", async () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait);

      debounced();
      await sleep(wait / 2);
      debounced();
      await sleep(wait / 2);
      debounced();
      await sleep(wait / 2);
      debounced();

      expect(func).not.toHaveBeenCalled();

      await sleep(wait + 1);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it("should cancel the debounced function call", async () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait);

      debounced();
      debounced.cancel();
      await sleep(wait);

      expect(func).not.toHaveBeenCalled();
    });

    it("should work correctly if the debounced function is called after the wait time", async () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait);

      debounced();
      await sleep(wait + 1);
      debounced();
      await sleep(wait + 1);

      expect(func).toHaveBeenCalledTimes(2);
    });

    it("should have no effect if we call cancel when the function is not executed", () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait);

      expect(() => debounced.cancel()).not.toThrow();
    });

    it("should call the function with correct arguments", async () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait);

      debounced("test", 123);

      await sleep(wait * 2);

      expect(func).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenCalledWith("test", 123);
    });

    it("should immediately invoke the pending function when flush is called", () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait);

      debounced();
      debounced.flush();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should invoke the function on the leading edge when edges includes "leading"', async () => {
      const func = vi.fn();
      const wait = 50;
      const debounced = debounce(func, wait, { edges: ["leading"] });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      await sleep(wait);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it("should cancel the debounced function call if aborted via AbortSignal", async () => {
      const func = vi.fn();
      const wait = 50;
      const controller = new AbortController();
      const { signal } = controller;
      const debounced = debounce(func, wait, { signal });

      debounced();
      controller.abort();

      await sleep(wait);

      expect(func).not.toHaveBeenCalled();
    });

    it("should not call the debounced function if it is already aborted by AbortSignal", async () => {
      const controller = new AbortController();
      const { signal } = controller;

      controller.abort();

      const func = vi.fn();

      const wait = 50;
      const debounced = debounce(func, wait, { signal });

      debounced();

      await sleep(wait);

      expect(func).not.toHaveBeenCalled();
    });

    it("should not add multiple abort event listeners", async () => {
      const func = vi.fn();
      const wait = 100;
      const controller = new AbortController();
      const { signal } = controller;
      const eventSpy = vi.spyOn(signal, "addEventListener");

      const debounced = debounce(func, wait, { signal });

      debounced();
      debounced();

      await sleep(150);

      expect(func).toHaveBeenCalledTimes(1);

      const listenerCount = eventSpy.mock.calls.filter(([event]) => event === "abort").length;
      expect(listenerCount).toBe(1);

      eventSpy.mockRestore();
    });
  });

  describe("throttle", () => {
    it("should throttle function calls", () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      throttled();
      throttled();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it("should execute the function immediately if not called within the wait time", async () => {
      const func = vi.fn();
      const wait = 500;
      const throttled = throttle(func, wait);

      throttled(); // should be executed
      expect(func).toHaveBeenCalledTimes(1);

      await sleep(wait / 2);
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      await sleep(wait / 2 + 1);
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      expect(func).toHaveBeenCalledTimes(2);

      await sleep(wait / 2 - 1);
      expect(func).toHaveBeenCalledTimes(2);

      throttled();
      expect(func).toHaveBeenCalledTimes(2);

      await sleep(wait / 2 + 1);
      expect(func).toHaveBeenCalledTimes(2);

      throttled();
      expect(func).toHaveBeenCalledTimes(3);
    });

    it("should call the function with correct arguments", () => {
      const func = vi.fn();
      const wait = 50;
      const throttled = throttle(func, wait);

      throttled("test", 123);

      expect(func).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenCalledWith("test", 123);
    });

    it("should not trigger a trailing call when invoked once", async () => {
      const func = vi.fn();
      const wait = 50;
      const throttled = throttle(func, wait);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      await sleep(wait + 1);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it("should trigger a trailing call as soon as possible", async () => {
      const func = vi.fn();
      const wait = 50;
      const throttled = throttle(func, wait);

      throttled();
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      await sleep(wait + 1);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it("should be able to abort initial invocation", async () => {
      const wait = 50;
      const func = vi.fn();
      const controller = new AbortController();
      controller.abort();

      const throttled = throttle(func, wait, { signal: controller.signal });

      throttled();
      throttled();
      expect(func).toHaveBeenCalledTimes(0);

      await sleep(wait + 1);
      expect(func).toHaveBeenCalledTimes(0);
    });

    it("should be able to abort trailing edge invocation", async () => {
      const wait = 50;
      const func = vi.fn();
      const controller = new AbortController();

      const throttled = throttle(func, wait, { signal: controller.signal });

      throttled();
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      controller.abort();

      await sleep(wait + 1);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it("should execute on leading and trailing when called multiple times with leading and trailing", async () => {
      const func = vi.fn();
      const wait = 50;
      const throttled = throttle(func, wait, { edges: ["leading", "trailing"] });

      throttled();

      await sleep(wait + 1);

      expect(func).toHaveBeenCalledTimes(1);

      throttled();

      await sleep(wait + 1);

      expect(func).toHaveBeenCalledTimes(2);

      throttled();
      throttled();

      expect(func).toHaveBeenCalledTimes(3);

      await sleep(wait + 1);

      expect(func).toHaveBeenCalledTimes(4);
    });

    it("should preserve this context when called as a method", async () => {
      const wait = 50;
      let capturedMsg: string | undefined;

      const obj = {
        msg: "hello world",
        // oxlint-disable-next-line typescript/no-explicit-any
        logWithThrottle: throttle(function (this: any) {
          capturedMsg = this?.msg;
        }, wait),
      };

      obj.logWithThrottle();
      expect(capturedMsg).toBe("hello world");

      capturedMsg = undefined;
      obj.logWithThrottle();
      obj.logWithThrottle();

      await sleep(wait + 1);
      expect(capturedMsg).toBe("hello world");
    });

    it("should invoke function periodically with trailing edge only", async () => {
      const func = vi.fn();
      const wait = 50;
      const throttled = throttle(func, wait, { edges: ["trailing"] });

      throttled();
      expect(func).toHaveBeenCalledTimes(0);

      await sleep(wait + 1);
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      await sleep(wait + 1);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it("should invoke function periodically during continuous calls with trailing edge only", async () => {
      const func = vi.fn();
      const wait = 50;
      const throttled = throttle(func, wait, { edges: ["trailing"] });

      const intervalId = setInterval(() => {
        throttled();
      }, 10);

      await sleep(wait * 3 + 10);
      clearInterval(intervalId);

      expect(func.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it("should invoke function periodically with leading edge only", async () => {
      const func = vi.fn();
      const wait = 50;
      const throttled = throttle(func, wait, { edges: ["leading"] });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      await sleep(wait / 2);
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      await sleep(wait / 2 + 1);
      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });
  });
});
