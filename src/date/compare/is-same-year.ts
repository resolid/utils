import type { DateInput, MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 判断两个日期是否在同一年
 *
 * @param input - 日期输入
 * @param compare - 用于比较的日期，`null` 时默认当前
 *
 * @returns 同一年返回 `true`，否则返回 `false`
 */
export function isSameYear(input: DateInput, compare: MaybeDateInput): boolean {
  const a = toDate(input);
  const b = toDate(compare);

  return a.getFullYear() === b.getFullYear();
}
