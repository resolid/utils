import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 获取指定日期所在月份的最后一天
 * @param input - 日期输入，`null` 时默认当前
 *
 * @returns 所在月份最后一天的 Date 对象
 */
export function endOfMonth(input: MaybeDateInput): Date {
  const date = toDate(input);
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  date.setHours(23, 59, 59, 999);

  return date;
}
