import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 增加秒数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param seconds - 要增加的秒数
 *
 * @returns 增加秒数后的 Date 对象
 */
export function addSeconds(input: MaybeDateInput, seconds: number): Date {
  const date = toDate(input);
  date.setSeconds(date.getSeconds() + seconds);

  return date;
}

/**
 * 减少秒数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param seconds - 要减少的秒数
 *
 * @returns 减少秒数后的 Date 对象
 */
export function subSeconds(input: MaybeDateInput, seconds: number): Date {
  return addSeconds(input, -seconds);
}
