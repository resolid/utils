import type { MaybeDateInput, WeekStartsOn } from "../core/types";
import { startOfWeek } from "./start-of-week";

/**
 * 将日期设置为当周第几天
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param day - 目标星期几，与 weekStartsOn 对齐，0-6
 * @param weekStartsOn - 一周的起始日，0 为周日，1 为周一，以此类推，默认为 0
 *
 * @returns 设置后的 Date 对象
 */
export function setDayOfWeek(
  input: MaybeDateInput,
  day: number,
  weekStartsOn: WeekStartsOn = 0,
): Date {
  const date = startOfWeek(input, weekStartsOn);
  const diff = (day - weekStartsOn + 7) % 7;
  date.setDate(date.getDate() + diff);

  return date;
}
