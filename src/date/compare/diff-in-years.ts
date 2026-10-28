import type { MaybeDateInput } from "../core/types";
import { diffInMonths } from "./diff-in-months";

/**
 * 计算两个日期之间的年差值（`dateLeft - dateRight`）。
 *
 * @param inputLeft - 被减数日期，`null` 时默认当前
 * @param inputRight - 减数日期，`null` 时默认当前
 *
 * @returns 年差值，`inputLeft` 晚于 `inputRight` 时为正数，早于 `inputRight` 时为负数
 */
export function diffInYears(inputLeft: MaybeDateInput, inputRight: MaybeDateInput): number {
  const r = Math.trunc(diffInMonths(inputLeft, inputRight) / 12);

  return r == 0 ? 0 : r;
}
