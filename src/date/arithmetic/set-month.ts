import type { MaybeDateInput } from "../core/types";
import { handleOverflow } from "../core/utils";

/**
 * 将日期的月份设置为目标月份
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param month - 目标月份，1-12
 * @param overflow - 是否允许日期溢出到下一个月份
 *
 * @returns 设置月份后的 Date 对象
 *
 * @example
 * // 普通设置月份
 * setMonth('2024-01-31T00:00:00Z', 4) // → 2024-04-30
 *
 * // 月末钳制（allowOverflow = false）
 * setMonth('2024-01-31T00:00:00Z', 2) // → 2024-02-29
 *
 * // 月末溢出进位（allowOverflow = true）
 * setMonth('2024-01-31T00:00:00Z', 2, true) // → 2024-03-02
 */
export function setMonth(input: MaybeDateInput, month: number, overflow = false): Date {
  return handleOverflow(input, (d) => d.setMonth(month - 1), overflow);
}
