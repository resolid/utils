import type { DateInput, WeekStartsOn } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 日期是当周的第几天
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param weekStartsOn - 一周的起始日，0 为周日，1 为周一，默认为 0
 *
 * @returns 当周的第几天
 */
export function dayOfWeek(input: DateInput, weekStartsOn: WeekStartsOn = 0): number {
  return (toDate(input).getDay() - weekStartsOn + 7) % 7;
}
