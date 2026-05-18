import { isFunction } from "../is";
import { TimeoutError, type ValueOrFunction } from "../types";

/**
 * 空函数（no operation）。
 *
 * 什么也不做，通常用于占位、默认回调或避免 undefined 调用。
 */
export function noop(): void {}

/**
 * 将一个 Promise 包装为可中止的 Promise。
 *
 * @template T
 * @param promise - 要包装的原始 Promise
 * @param signal - 用于取消的 AbortSignal，不传则直接返回原始 Promise
 * @returns 可中止的 Promise
 */
export function abortable<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) {
    return promise;
  }

  signal.throwIfAborted();

  return new Promise<T>((resolve, reject) => {
    const handleAbort = () => reject(signal.reason);

    signal.addEventListener("abort", handleAbort, {
      once: true,
    });

    promise.then(resolve, reject).finally(() => {
      signal.removeEventListener("abort", handleAbort);
    });
  });
}

/**
 * 异步等待指定毫秒数。
 *
 * @param ms - 要等待的毫秒数
 * @returns 一个在指定时间后 resolve 的 Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 为 Promise 添加超时限制。
 *
 * @template T
 * @param ms - 超时时间（毫秒）
 * @param error - 超时时抛出的错误
 * @returns 永远不会 resolve 的 Promise
 */
export function timeout<T extends Error>(ms: number, error?: string | (() => T)): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(isFunction(error) ? error() : new TimeoutError(error)), ms),
  );
}

export type RetryOptions = {
  /**
   * 重试之间的延迟, 固定数值（毫秒）或者根据当前尝试次数动态计算延迟的函数
   * @default 0
   */
  delay?: number | ((attempts: number) => number);

  /**
   * 重试的次数
   * @default Infinity
   */
  retries?: number;

  /**
   * 用于取消的 AbortSignal
   */
  signal?: AbortSignal;

  /**
   * 该函数根据错误类型和尝试次数来判断是否重试。如果未提供此函数，则所有错误都会触发重试。
   *
   * @param {unknown} error - 发生的错误
   * @param {number} attempt - 当前尝试次数（从 0 开始计数）
   * @returns {boolean | Promise<boolean>} 是否重试
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean | Promise<boolean>;
};

/**
 * 重试异步操作，直到成功或超时。
 *
 * @template T
 * @param fn - 要重试的异步函数
 * @param options - 重试次数或选项对象
 * @returns 运行成功的结果
 */
export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  options?: number | RetryOptions,
): Promise<T> {
  const opts: RetryOptions = typeof options === "number" ? { retries: options } : (options ?? {});

  const { delay = 0, retries = Infinity, signal, shouldRetry = () => true } = opts;

  const getDelay = typeof delay === "function" ? delay : () => delay;

  for (let attempt = 0; attempt <= retries; attempt++) {
    signal?.throwIfAborted();

    try {
      // oxlint-disable-next-line no-await-in-loop
      return await fn(attempt);
    } catch (e) {
      // oxlint-disable-next-line no-await-in-loop
      if (attempt >= retries || !(await shouldRetry(e, attempt))) {
        throw e;
      }

      // oxlint-disable-next-line no-await-in-loop
      await abortable(sleep(getDelay(attempt)), signal);
    }
  }

  throw new Error("Unreachable");
}

/**
 * 创建一个始终返回固定值的函数。
 *
 * @param value - 要固定返回的值
 * @returns 一个无参数函数，每次调用都会返回该值
 */
export function always<T>(value: T): () => T {
  return () => value;
}

/**
 * 将一个 Promise 转换为 [error, data] 的形式，便于 async/await 异常处理。
 *
 * 作用类似 try/catch，但可以用解构直接获取结果和错误：
 *
 * @param promise - 要处理的 Promise 对象
 * @returns 一个 Promise，resolve 为一个长度为 2 的元组：
 *          - 成功时：[null, data]
 *          - 失败时：[error, undefined]
 */
export async function to<T, E = Error>(promise: Promise<T>): Promise<[E, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data) => [null, data])
    .catch<[E, undefined]>((error: E) => [error, undefined]);
}

/**
 * 如果传入的是函数，则执行它并返回结果；否则直接返回该值。
 *
 * 常用于允许参数既可以是静态值，也可以是动态函数的场景。
 *
 * @template T - 返回值类型
 * @template A - 函数参数类型
 * @param value - 值或函数
 * @param args - 如果 value 是函数，传递给它的参数
 * @returns 如果 value 是函数，则返回函数执行结果，否则直接返回 value
 */
export function runIf<T, A extends unknown[]>(value: ValueOrFunction<T, A>, ...args: A): T {
  if (isFunction(value)) {
    return value(...args);
  }

  return value;
}

/**
 * 将多个函数组合成一个函数，同时调用所有非空函数。
 *
 * 常用于事件处理器、回调组合，避免手动逐个调用。
 *
 * @template T - 函数类型
 * @param fns - 要组合的函数数组，允许 null 或 undefined
 * @returns 一个新函数，调用时会依次调用 fns 中所有非空函数
 */
export function callAll<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => void,
>(...fns: (T | null | undefined)[]) {
  return (...args: Parameters<T>): void => {
    for (const fn of fns) {
      fn?.(...args);
    }
  };
}
