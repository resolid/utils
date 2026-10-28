import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 获取指定日期所在年份的第一天
 *
 * @param input - 日期输入，`null` 时默认当前
 *
 * @returns 所在年份第一天的 Date 对象
 */
export function startOfYear(input: MaybeDateInput): Date {
  const date = toDate(input);
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);

  return date;
}
