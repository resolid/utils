import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 增加天数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param days - 要增加的天数
 *
 * @returns 增加天数后的 Date 对象
 */
export function addDays(input: MaybeDateInput, days: number): Date {
  const date = toDate(input);
  date.setDate(date.getDate() + days);

  return date;
}

/**
 * 减少天数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param days - 要减少的天数
 *
 * @returns 减少天数后的 Date 对象
 */
export function subDays(input: MaybeDateInput, days: number): Date {
  return addDays(input, -days);
}
