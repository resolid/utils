import type { DateInput, DateRange } from "../core/types";
import { isAfter } from "./is-after";
import { isBefore } from "./is-before";

/**
 * 判断指定日期是否在日期区间
 *
 * @param input 指定日期
 * @param range 日期区间
 * @param range.start 开始
 * @param range.end 结束
 *
 * @returns 是否在区间
 */
export function isDateInRange(input: DateInput, range: DateRange): boolean {
  if (!range.start || !range.end) {
    return false;
  }

  return !isBefore(input, range.start) && !isAfter(input, range.end);
}
