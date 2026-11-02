import { isFunction, isNumber } from "../../is";
import { noop } from "../basic";

/**
 * 将一个 Promise 转换为 [error, data] 的形式，便于 async/await 异常处理。
 *
 * 作用类似 try/catch，但可以用解构直接获取结果和错误：
 *
 * @template T - 返回值
 * @template E - 错误
 * @param promise - 要处理的 Promise 对象
 * @returns 一个 Promise，resolve 为一个长度为 2 的元组：
 *          - 成功时：[null, data]
 *          - 失败时：[error, undefined]
 */
export function to<T, E = Error>(promise: Promise<T>): Promise<[E, undefined] | [null, T]> {
  return promise.then(
    (data): [null, T] => [null, data],
    (error: E): [E, undefined] => [error, undefined],
  );
}

/**
 * 异步等待指定毫秒数。
 *
 * @param ms - 要等待的毫秒数
 * @param signal - 可选的 AbortSignal，用于提前取消
 * @returns 一个在指定时间后 resolve 的 Promise
 */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(signal!.reason);
    };

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export type RetryOptions = {
  /**
   * 重试之间的延迟, 固定数值（毫秒）或者根据当前尝试的序号动态计算延迟的函数
   * @default 0
   */
  delay?: number | ((attempt: number) => number);

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
   * @param {number} attempt - 当前尝试的序号（从 0 开始）
   * @returns {boolean | Promise<boolean>} 是否重试
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean | Promise<boolean>;
};

/**
 * 重试异步操作，直到成功或超时。
 *
 * @template T
 * @param func - 要重试的异步函数
 * @param options - 重试次数或选项对象
 * @returns 运行成功的结果
 */
export async function retry<T>(
  func: (attempt: number) => Promise<T>,
  options?: number | RetryOptions,
): Promise<T> {
  const opts: RetryOptions = isNumber(options) ? { retries: options } : (options ?? {});

  const { delay = 0, retries = Infinity, signal, shouldRetry = () => true } = opts;

  const getDelay = isFunction(delay) ? delay : () => delay;

  for (let attempt = 0; attempt <= retries; attempt++) {
    signal?.throwIfAborted();

    try {
      // oxlint-disable-next-line no-await-in-loop
      return await func(attempt);
    } catch (e) {
      // oxlint-disable-next-line no-await-in-loop
      if (attempt >= retries || !(await shouldRetry(e, attempt))) {
        throw e;
      }

      // oxlint-disable-next-line no-await-in-loop
      await sleep(getDelay(attempt), signal);
    }
  }

  /* istanbul ignore next -- @preserve */
  throw new Error("Unreachable");
}

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

  if (signal.aborted) {
    promise.catch(noop);
    return Promise.reject(signal.reason);
  }

  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(signal.reason);

    signal.addEventListener("abort", onAbort, {
      once: true,
    });

    promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (err) => {
        signal.removeEventListener("abort", onAbort);
        reject(err);
      },
    );
  });
}

/**
 * 操作超时错误。
 *
 * `withTimeout` 在超时后 reject 该错误，便于调用方通过 `instanceof` 区分超时与主动取消。
 */
export class TimeoutError extends Error {
  override name = "TimeoutError";

  constructor(message?: string) {
    super(message ?? "Operation timed out");
  }
}

/**
 * 为 Promise 添加超时和取消支持
 *
 * @param run - 启动任务的函数，接收一个用于中断任务的 AbortSignal
 * @param ms - 超时时间（毫秒），超时后将 reject TimeoutError
 * @param signal - 可选的 AbortSignal，用于提前取消
 * @returns 包装后的 Promise
 */
export async function withTimeout<T>(
  run: (signal: AbortSignal) => Promise<T>,
  ms: number,
  signal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  const onAbort = () => controller.abort(signal!.reason);

  if (signal?.aborted) {
    throw signal.reason;
  }

  signal?.addEventListener("abort", onAbort, { once: true });

  const timeoutId = setTimeout(() => controller.abort(new TimeoutError()), ms);

  try {
    return await abortable(run(controller.signal), controller.signal);
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", onAbort);
  }
}
