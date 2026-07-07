export type ThrottleOptions = {
  start?: boolean;
  middle?: boolean;
  once?: boolean;
};

export type Throttler<T extends unknown[]> = {
  (...args: T): void;
  cancel: () => void;
};

/**
 * 创建一个节流函数，限制回调在指定时间间隔内执行次数。
 *
 * @template T - 回调函数参数类型
 * @param callback - 要节流执行的函数
 * @param wait - 节流时间间隔（毫秒），默认 0
 * @param options - 配置选项
 *                  - start: 是否立即执行第一次，默认 true
 *                  - middle: 是否在间隔时间内允许再次执行，默认 true
 *                  - once: 是否执行一次后自动取消，默认 false
 * @returns 一个节流后的函数，并附带 cancel 方法可取消
 */
export function throttle<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait = 0,
  { start = true, middle = true, once = false }: ThrottleOptions = {},
): Throttler<T> {
  let innerStart = start;
  let last = 0;
  let timer: ReturnType<typeof setTimeout>;
  let cancelled = false;

  function fn(this: unknown, ...args: T) {
    if (cancelled) {
      return;
    }

    const delta = Date.now() - last;
    last = Date.now();

    if (start && middle && delta >= wait) {
      innerStart = true;
    }

    if (innerStart) {
      innerStart = false;
      callback.apply(this, args);

      if (once) {
        fn.cancel();
      }
    } else if ((middle && delta < wait) || !middle) {
      clearTimeout(timer);

      timer = setTimeout(
        () => {
          last = Date.now();
          callback.apply(this, args);
          if (once) {
            fn.cancel();
          }
        },
        middle ? wait - delta : wait,
      );
    }
  }

  fn.cancel = () => {
    clearTimeout(timer);
    cancelled = true;
  };

  return fn;
}

/**
 * 创建一个防抖函数，在连续调用时只在停止调用后执行回调。
 *
 * @template T - 回调函数参数类型
 * @param callback - 要防抖执行的函数
 * @param wait - 防抖时间间隔（毫秒），默认 0
 * @param options - 配置选项（同 throttle）
 *                  - start: 是否立即执行第一次，默认 false
 *                  - middle: 是否允许间隔内触发，默认 false
 *                  - once: 是否执行一次后自动取消，默认 false
 * @returns 一个防抖后的函数，并附带 cancel 方法可取消
 */
export function debounce<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait = 0,
  { start = false, middle = false, once = false }: ThrottleOptions = {},
): Throttler<T> {
  return throttle(callback, wait, { start, middle, once });
}
