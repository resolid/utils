import type { MaybeDateInput, WeekStartsOn } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 获取指定日期所在周的第一天
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param weekStartsOn - 一周的起始日，0 为周日，1 为周一，以此类推，默认为 0
 *
 * @returns 所在周第一天的 Date 对象
 */
export function startOfWeek(input: MaybeDateInput, weekStartsOn: WeekStartsOn = 0): Date {
  const date = toDate(input);
  const day = date.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);

  return date;
}
