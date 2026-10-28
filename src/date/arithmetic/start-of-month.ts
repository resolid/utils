import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 获取指定日期所在月份的第一天
 *
 * @param input - 日期输入，`null` 时默认当前
 *
 * @returns 所在月份第一天的 Date 对象
 */
export function startOfMonth(input: MaybeDateInput): Date {
  const date = toDate(input);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);

  return date;
}
