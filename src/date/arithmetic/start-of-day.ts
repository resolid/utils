import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 获取指定日期开始时间
 *
 * @param input - 日期输入，`null` 时默认当前
 *
 * @returns 所在日期的 00:00:00
 */
export function startOfDay(input: MaybeDateInput): Date {
  const date = toDate(input);
  date.setHours(0, 0, 0, 0);

  return date;
}
