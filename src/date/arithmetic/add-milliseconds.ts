import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 增加毫秒数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param milliseconds - 要增加的毫秒数
 *
 * @returns 增加毫秒数后的 Date 对象
 */
export function addMilliseconds(input: MaybeDateInput, milliseconds: number): Date {
  const date = toDate(input);
  date.setMilliseconds(date.getMilliseconds() + milliseconds);

  return date;
}

/**
 * 减少毫秒数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param milliseconds - 要减少的毫秒数
 *
 * @returns 减少毫秒数后的 Date 对象
 */
export function subMilliseconds(input: MaybeDateInput, milliseconds: number): Date {
  return addMilliseconds(input, -milliseconds);
}
