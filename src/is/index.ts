// oxlint-disable-next-line node/no-process-env
export const __DEV__: boolean = process.env.NODE_ENV !== "production";

export const isBrowser: boolean = typeof window !== "undefined";

type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T;

/**
 * 判断一个值是否为“真值”（truthy）。
 *
 * 在 JavaScript 中，以下值会被认为是“假值”（falsy）：
 * - false
 * - 0
 * - -0
 * - 0n
 * - ""
 * - null
 * - undefined
 * - NaN
 *
 * 除此之外的值都被认为是“真值”（truthy）。
 *
 * @param value - 要判断的值
 * @returns 如果值为真值则返回 true，否则返回 false
 */
export function isTruthy<T>(value: T): value is Truthy<T> {
  return !!value;
}

/**
 * 判断一个值是否为 `undefined`。
 *
 * @param value - 要判断的值
 * @returns 如果值为 `undefined`，返回 true，否则返回 false
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * 判断一个值是否已定义（即不为 `undefined` 或 `null`）。
 *
 * @param value - 要判断的值
 * @returns 如果值既不是 `undefined` 也不是 `null`，则返回 true
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * 判断一个值是否为布尔类型（boolean）。
 *
 * @param value - 要判断的值
 * @returns 如果值是布尔类型，返回 true，否则返回 false
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * 判断一个值是否为数字类型（number）。
 *
 * @param value - 要判断的值
 * @returns 如果值是数字则返回 true，否则返回 false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

/**
 * 判断一个值是否为字符串类型。
 *
 * @param value - 要判断的值
 * @returns 如果值是字符串则返回 true，否则返回 false
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * 判断一个值是否为对象类型（排除 null）。
 *
 * @param value - 要判断的值
 * @returns 如果值是对象（且不为 null）则返回 true，否则返回 false
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

/**
 * 判断一个值是否为 `undefined` 或 `null`（即“nullish”）。
 *
 * @param value - 要判断的值
 * @returns 如果值是 `undefined` 或 `null`，则返回 true，否则返回 false
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}

/**
 * 判断一个值是否为函数类型。
 *
 * @param value - 要判断的值
 * @returns 如果值是函数则返回 true，否则返回 false
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

/**
 * 判断一个值是否为 Date 对象。
 *
 * @param value - 要判断的值
 * @returns 如果值是 Date 对象则返回 true，否则返回 false
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

/**
 * 判断一个值是否为 BigInt 对象。
 *
 * @param value - 要判断的值
 * @returns 如果值是 BigInt 对象则返回 true，否则返回 false
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === "bigint";
}

/**
 * 判断一个值是否“为空”。
 *
 * 规则：
 * - null 或 undefined → 为空
 * - 数字 0 → 为空
 * - 字符串只包含空白字符 → 为空
 * - 空数组 → 为空
 * - 空对象 → 为空
 * - 其他类型 → 不为空
 *
 * @param value - 要判断的值
 * @returns 如果值为空则返回 true，否则返回 false
 */
export function isEmpty(value: unknown): boolean {
  if (isNullish(value)) {
    return true;
  }

  if (isNumber(value)) {
    return value === 0;
  }

  if (isString(value)) {
    return value.trim() == "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  /* istanbul ignore next -- @preserve */
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  /* istanbul ignore next -- @preserve */
  return false;
}

/**
 * 判断一个值是否为 Promise 对象。
 *
 * @param value - 要判断的值
 * @returns 如果值是 Promise 对象则返回 true，否则返回 false
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise;
}

/**
 * 判断一个值是否为 ArrayBuffer 对象。
 *
 * @param value - 要判断的值
 * @returns 如果值是 ArrayBuffer 对象则返回 true，否则返回 false
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}
