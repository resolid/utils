import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 增加小时数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param hours - 要增加的小时数
 *
 * @returns 增加小时后的 Date 对象
 */
export function addHours(input: MaybeDateInput, hours: number): Date {
  const date = toDate(input);
  date.setHours(date.getHours() + hours);

  return date;
}

/**
 * 减少小时数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param hours - 要减少的小时数
 *
 * @returns 减少小时数后的 Date 对象
 */
export function subHours(input: MaybeDateInput, hours: number): Date {
  return addHours(input, -hours);
}
