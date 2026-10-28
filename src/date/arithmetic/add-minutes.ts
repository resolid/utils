import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 增加分钟数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param minutes - 要增加的分钟数
 *
 * @returns 增加分钟数后的 Date 对象
 */
export function addMinutes(input: MaybeDateInput, minutes: number): Date {
  const date = toDate(input);
  date.setMinutes(date.getMinutes() + minutes);

  return date;
}

/**
 * 减少分钟数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param minutes - 要减少的分钟数
 *
 * @returns 减少分钟数后的 Date 对象
 */
export function subMinutes(input: MaybeDateInput, minutes: number): Date {
  return addMinutes(input, -minutes);
}
