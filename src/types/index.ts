export type Booleanish = boolean | "true" | "false";

export type MaybeArray<T> = T | T[];

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type ValueOrFunction<T, A extends unknown[] = []> = T | ((...args: A) => T);

export class TimeoutError extends Error {
  override name = "TimeoutError";
  constructor(message?: string) {
    super(message ?? "Operation timed out");
  }
}
