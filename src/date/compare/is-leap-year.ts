import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 判断日期是否为闰年
 *
 * @param input - 日期输入，`null` 时默认当前
 *
 * @return 是否闰年
 */
export function isLeapYear(input: MaybeDateInput): boolean {
  const year = toDate(input).getFullYear();

  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}
