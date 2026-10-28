import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 获取指定日期所在年的总天数
 *
 * @param input - 日期输入，`null` 时默认当前
 *
 * @returns 所在年的总天数
 */
export function daysInYear(input: MaybeDateInput): number {
  const d = toDate(input);

  return (
    (new Date(d.getFullYear() + 1, 0, 0).getTime() - new Date(d.getFullYear(), 0, 0).getTime()) /
    86400000
  );
}
