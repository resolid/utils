import type { DateRange } from "../core/types";
import { isAfter } from "../compare/is-after";

/**
 * 调整日期区间的开始和结束日期
 *
 * 若 start 晚于 end，则自动交换，确保 start <= end
 *
 * @param range 日期区间
 * @param range.start 开始
 * @param range.end 结束
 *
 * @returns 调整后的日期区间
 */
export function adjustDateRange(range: DateRange): DateRange {
  if (!range.start || !range.end) {
    return range;
  }

  return isAfter(range.start, range.end) ? { start: range.end, end: range.start } : range;
}
