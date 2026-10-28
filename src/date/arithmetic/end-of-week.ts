import type { MaybeDateInput, WeekStartsOn } from "../core/types";
import { startOfWeek } from "./start-of-week";

/**
 * 获取指定日期所在周的最后一天
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param weekStartsOn - 一周的起始日，0 为周日，1 为周一，默认为 0
 *
 * @returns 所在周最后一天的 Date 对象
 */
export function endOfWeek(input: MaybeDateInput, weekStartsOn: WeekStartsOn = 0): Date {
  const date = startOfWeek(input, weekStartsOn);
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);

  return date;
}
