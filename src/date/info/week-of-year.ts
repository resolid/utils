import type { FirstWeekContains, MaybeDateInput, WeekStartsOn } from "../core/types";
import { addDays } from "../arithmetic/add-days";
import { startOfWeek } from "../arithmetic/start-of-week";
import { diffInDays } from "../compare/diff-in-days";
import { toDate } from "../core/to-date";
import { dayOfWeek } from "./day-of-week";

/**
 * 日期在当年的第几周
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param weekStartsOn - 一周的起始日，0 为周日，1 为周一，默认为 0
 * @param firstWeekContains - 第一周必须包含的日期，用于确定一年中的第一周
 *
 * @returns 当年的第几周
 */
export function weekOfYear(
  input: MaybeDateInput,
  weekStartsOn: WeekStartsOn = 0,
  firstWeekContains: FirstWeekContains = 4,
): number {
  const date = toDate(input);

  const decidingDay = addDays(date, 7 - firstWeekContains - dayOfWeek(date, weekStartsOn));
  const firstWeekStart = startOfWeek(
    new Date(decidingDay.getFullYear(), 0, firstWeekContains),
    weekStartsOn,
  );

  const weekStart = startOfWeek(date, weekStartsOn);

  return Math.floor(diffInDays(weekStart, firstWeekStart) / 7) + 1;
}
