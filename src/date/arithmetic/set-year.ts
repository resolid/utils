import type { MaybeDateInput } from "../core/types";
import { handleOverflow } from "../core/utils";

/**
 * 将日期的年份设置为目标年份
 *
 * @param value - 日期输入，`null` 时默认当前
 * @param year - 目标年份
 * @param overflow - 是否允许日期溢出到下一个月份
 *
 * @returns 设置年份后的 Date 对象
 *
 * @example
 * // 普通设置年份
 * setYear('2024-03-15T00:00:00Z', 2025) // → 2025-03-15
 *
 * // 闰年钳制（allowOverflow = false）
 * setYear('2024-02-29T00:00:00Z', 2023) // → 2023-02-28
 *
 * // 闰年溢出进位（allowOverflow = true）
 * setYear('2024-02-29T00:00:00Z', 2023, true) // → 2023-03-01
 */
export function setYear(value: MaybeDateInput, year: number, overflow = false): Date {
  return handleOverflow(value, (d) => d.setFullYear(year), overflow);
}
