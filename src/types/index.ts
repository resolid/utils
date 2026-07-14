export type Booleanish = boolean | "true" | "false";

export type MaybeArray<T> = T | T[];

export type MaybePromise<T> = T | Promise<T>;

export type AnyObject = Record<string, unknown>;

export type EmptyObject = Record<never, never>;

export type Dict<V> = Record<string, V>;

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type ValueOrFunction<T, A extends unknown[] = []> = T | ((...args: A) => T);

export type AtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

export class TimeoutError extends Error {
  override name = "TimeoutError";
  constructor(message?: string) {
    super(message ?? "Operation timed out");
  }
}
