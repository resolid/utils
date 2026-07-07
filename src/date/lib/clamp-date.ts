import type { DateInput, MaybeDateInput } from "./types";
import { toDate } from "./to-date";

/**
 * 将一个日期限制在指定范围内
 *
 * @param input 输入日期
 * @param min 最小值（可选）
 * @param max 最大值（可选）
 *
 * @returns 被 clamp 后的日期（新对象）
 */
export function clampDate(input: DateInput, min?: MaybeDateInput, max?: MaybeDateInput): Date {
  const date = toDate(input);
  const minDate = min == null ? null : toDate(min);
  const maxDate = max == null ? null : toDate(max);
  const minTime = minDate ? minDate.getTime() : -Infinity;
  const maxTime = maxDate ? maxDate.getTime() : Infinity;

  if (minTime > maxTime) {
    throw new Error("clampDate: invalid clamp range");
  }

  if (date.getTime() <= minTime) {
    return minDate!;
  }

  if (date.getTime() >= maxTime) {
    return maxDate!;
  }

  return date;
}
