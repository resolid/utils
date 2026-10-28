import type { DateInput, MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 判断日期 input 是否晚于日期 compare
 *
 * @param input - 日期输入
 * @param compare - 日期输入，`null` 时默认当前
 *
 * @returns 若 input 晚于 compare 则返回 true，否则返回 false
 */
export function isAfter(input: DateInput, compare: MaybeDateInput): boolean {
  return +toDate(input) > +toDate(compare);
}
