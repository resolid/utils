export type DebounceOptions = {
  /** 用于取消的 AbortSignal，abort 后会清除待执行的调用，且不再触发 */
  signal?: AbortSignal;

  /**
   * 指定在延迟的开始（leading）、结束（trailing）或两端触发
   * 传空数组则函数永远不会执行
   * @default ["trailing"]
   */
  edges?: ("leading" | "trailing")[];
};

export type DebouncedFn<T extends unknown[]> = {
  (...args: T): void;

  /**
   * 安排在指定的防抖延迟后执行防抖函数。
   * 此方法会重置任何现有的计时器，确保该函数仅在上次调用防抖函数后经过延迟时间后才会被调用。
   * 通常情况下，每次调用防抖函数时，都会在内部调用此方法。
   */
  schedule: () => void;

  /**
   * 取消所有待执行的防抖函数。
   * 该方法会清除活动计时器并重置任何已存储的上下文或参数。
   */
  cancel: () => void;

  /**
   * 如果存在待执行的调用，立即执行并清除定时器
   */
  flush: () => void;
};

/**
 * 创建一个防抖函数，在最后一次调用后等待 `wait` 毫秒再执行。
 *
 * @template T - 回调函数参数类型
 * @param func - 要防抖执行的函数
 * @param wait - 防抖时间间隔（毫秒）
 * @param options - 配置选项
 * @returns 防抖后的函数，附带 schedule、cancel、flush 方法
 */
export function debounce<T extends unknown[]>(
  func: (...args: T) => unknown,
  wait: number,
  { signal, edges }: DebounceOptions = {},
): DebouncedFn<T> {
  let pendingThis: unknown;
  let pendingArgs: T | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const leading = edges?.includes("leading");
  const trailing = edges == null || edges.includes("trailing");

  const clearTimer = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const invoke = () => {
    if (pendingArgs !== null) {
      const args = pendingArgs;
      const self = pendingThis;

      pendingThis = undefined;
      pendingArgs = null;

      func.apply(self, args);
    }
  };

  const cancel = () => {
    clearTimer();
    pendingThis = undefined;
    pendingArgs = null;
  };

  const schedule = () => {
    clearTimer();

    timeoutId = setTimeout(() => {
      timeoutId = null;

      if (trailing) {
        invoke();
      }

      cancel();
    }, wait);
  };

  const flush = () => {
    clearTimer();
    invoke();
  };

  const debounced = function (this: unknown, ...args: T) {
    if (signal?.aborted) {
      return;
    }

    // oxlint-disable-next-line typescript/no-this-alias unicorn/no-this-assignment
    pendingThis = this;
    pendingArgs = args;

    const firstCall = timeoutId === null;

    schedule();

    if (leading && firstCall) {
      invoke();
    }
  };

  debounced.schedule = schedule;
  debounced.cancel = cancel;
  debounced.flush = flush;

  signal?.addEventListener("abort", cancel, { once: true });

  return debounced;
}

export type ThrottleOptions = {
  /** 用于取消的 AbortSignal */
  signal?: AbortSignal;

  /**
   * 指定在间隔的开始（leading）、结束（trailing）或两端触发
   * @default ["leading", "trailing"]
   */
  edges?: ("leading" | "trailing")[];
};

export type ThrottledFn<T extends unknown[]> = {
  (...args: T): void;

  /** 取消待执行的调用，节流函数之后仍可继续使用 */
  cancel: () => void;

  /** 如果存在待执行的调用，立即执行 */
  flush: () => void;
};

/**
 * 创建一个节流函数，在 `wait` 毫秒内最多执行一次。
 *
 * @template T - 回调函数参数类型
 * @param func - 要节流执行的函数
 * @param wait - 节流时间间隔（毫秒）
 * @param options - 配置选项
 * @returns 节流后的函数，附带 cancel、flush 方法
 */
export function throttle<T extends unknown[]>(
  func: (...args: T) => unknown,
  wait: number,
  { signal, edges = ["leading", "trailing"] }: ThrottleOptions = {},
): ThrottledFn<T> {
  let pendingAt: number | null = null;

  const debounced = debounce(
    function (this: unknown, ...args: T) {
      pendingAt = Date.now();
      func.apply(this, args);
    },
    wait,
    { signal, edges },
  );

  const throttled = function (this: unknown, ...args: T) {
    if (signal?.aborted) {
      return;
    }

    pendingAt ??= Date.now();

    if (Date.now() - pendingAt >= wait) {
      pendingAt = Date.now();
      func.apply(this, args);

      debounced.cancel();
      debounced.schedule();
      return;
    }

    debounced.apply(this, args);
  };

  throttled.cancel = () => {
    pendingAt = null;
    debounced.cancel();
  };

  throttled.flush = debounced.flush;

  return throttled;
}
