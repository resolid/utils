import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 将日期设置为当年第几天
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param day - 目标天
 *
 * @returns 设置后的 Date 对象
 */
export function setDayOfYear(input: MaybeDateInput, day: number): Date {
  const date = toDate(input);
  date.setMonth(0, day);

  return date;
}
