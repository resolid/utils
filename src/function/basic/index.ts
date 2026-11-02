import type { ValueOrFunction } from "../../types";
import { isFunction } from "../../is";

/**
 * 空函数（no operation）。
 *
 * 什么也不做，通常用于占位、默认回调或避免 undefined 调用。
 */
export function noop(): void {}

/**
 * 创建一个只会执行一次的函数，后续调用直接返回第一次执行的结果。
 *
 * @template A - 函数参数类型
 * @template R - 返回值类型
 * @param func - 需要限制只执行一次的函数
 * @returns 只会调用 `func` 一次的新函数，并缓存其返回值
 */
export function once<A extends unknown[], R>(func: (...args: A) => R): (...args: A) => R {
  let fn: ((...args: A) => R) | undefined = func;
  let result: R;

  return function (this: unknown, ...args: A): R {
    if (fn) {
      result = fn.apply(this, args);
      fn = undefined;
    }

    return result;
  };
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
 * 如果传入的是函数，则执行它并返回结果；否则直接返回该值。
 *
 * 常用于允许参数既可以是静态值，也可以是动态函数的场景。
 *
 * @template R - 返回值类型
 * @template A - 函数参数类型
 * @param value - 值或函数
 * @param args - 如果 value 是函数，传递给它的参数
 * @returns 如果 value 是函数，则返回函数执行结果，否则直接返回 value
 */
export function resolveValue<R, A extends unknown[] = []>(
  value: ValueOrFunction<A, R>,
  ...args: A
): R {
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
 * @template A - 函数参数类型
 * @param fns - 要组合的函数数组，允许 null 或 undefined
 * @returns 一个新函数，调用时会依次调用 fns 中所有非空函数
 */
export function callAll<A extends unknown[]>(
  ...fns: (((...args: A) => void) | null | undefined)[]
): (...args: A) => void {
  return (...args) => {
    for (const fn of fns) {
      fn?.(...args);
    }
  };
}
