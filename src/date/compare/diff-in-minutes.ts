import type { MaybeDateInput } from "../core/types";
import { diffInRound, type DiffRoundingMethod } from "../core/utils";
import { diffInMilliseconds } from "./diff-in-milliseconds";

/**
 * 计算两个日期之间的分钟差值（`dateLeft - dateRight`）
 *
 * @param inputLeft - 被减数日期，`null` 时默认当前
 * @param inputRight - 减数日期，`null` 时默认当前
 * @param roundingMethod - {@link DiffRoundingMethod 舍入方式}
 *
 * @returns 分钟差值，`inputLeft` 晚于 `inputRight` 时为正数，早于 `inputRight` 时为负数
 */
export function diffInMinutes(
  inputLeft: MaybeDateInput,
  inputRight: MaybeDateInput,
  roundingMethod?: DiffRoundingMethod,
): number {
  return diffInRound(diffInMilliseconds(inputLeft, inputRight) / 60_000, roundingMethod);
}
