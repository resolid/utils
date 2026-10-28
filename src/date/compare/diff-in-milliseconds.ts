import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 计算两个日期之间的毫秒差值（`inputLeft - inputRight`）
 *
 * @param inputLeft - 被减日期，`null` 时默认当前
 * @param inputRight - 减数日期，`null` 时默认当前
 *
 * @returns 毫秒差值，`inputLeft` 晚于 `inputRight` 时为正数，早于 `inputRight` 时为负数
 */
export function diffInMilliseconds(inputLeft: MaybeDateInput, inputRight: MaybeDateInput): number {
  const left = toDate(inputLeft);
  const right = toDate(inputRight);

  return +left - +right;
}
