import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 日期是当年的第几天
 *
 * @param input - 日期输入，`null` 时默认当前
 *
 * @returns 当年的第几天
 */
export function dayOfYear(input: MaybeDateInput): number {
  const d = toDate(input);

  return Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0).getTime() -
      new Date(d.getFullYear(), 0, 0).getTime()) /
      86400000,
  );
}
