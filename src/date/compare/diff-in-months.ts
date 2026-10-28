import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";
import { daysInMonth } from "../info/days-in-month";

/**
 * 计算两个日期之间的月差值（`dateLeft - dateRight`）。
 *
 * @param inputLeft - 被减数日期，`null` 时默认当前
 * @param inputRight - 减数日期，`null` 时默认当前
 *
 * @returns 月差值，`inputLeft` 晚于 `inputRight` 时为正数，早于 `inputRight` 时为负数
 */
export function diffInMonths(inputLeft: MaybeDateInput, inputRight: MaybeDateInput): number {
  const left = toDate(inputLeft);
  const right = toDate(inputRight);

  if (left < right) {
    const rs = diffInMonths(right, left);

    /* istanbul ignore next -- @preserve */
    return rs == 0 ? 0 : -rs;
  }

  let months =
    (left.getFullYear() - right.getFullYear()) * 12 + (left.getMonth() - right.getMonth());

  const leftDay = left.getDate();
  const rightDay = right.getDate();

  if (leftDay < rightDay) {
    const days = daysInMonth(left);

    if (!(days == leftDay && days < rightDay)) {
      months--;
    }
  }

  return months == 0 ? 0 : months;
}
