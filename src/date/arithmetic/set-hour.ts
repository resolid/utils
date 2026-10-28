import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 将指定日期的小时设置为目标小时
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param hour - 目标小时，0-23
 *
 * @returns 设置小时后的 Date 对象
 */
export function setHour(input: MaybeDateInput, hour: number): Date {
  const date = toDate(input);
  date.setHours(hour);

  return date;
}
