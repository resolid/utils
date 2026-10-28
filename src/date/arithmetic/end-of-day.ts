import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 获取指定日期结束时间
 *
 * @param input - 日期输入，`null` 时默认当前
 *
 * @returns 所在日期的 23:59:59
 */
export function endOfDay(input: MaybeDateInput): Date {
  const date = toDate(input);
  date.setHours(23, 59, 59, 999);

  return date;
}
