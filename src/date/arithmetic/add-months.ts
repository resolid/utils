import type { MaybeDateInput } from "../core/types";
import { handleOverflow } from "../core/utils";

/**
 * 增加月数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param months - 要增加的月数
 * @param overflow - 是否允许日期溢出到下一个月份
 *
 * @returns 增加月数后的 Date 对象
 *
 * @example
 * // 普通加月
 * addMonths('2024-01-15T00:00:00Z', 1) // → 2024-02-15
 *
 * // 月末钳制（overflow = false）
 * addMonths('2024-01-31T00:00:00Z', 1) // → 2024-02-29
 *
 * // 月末溢出进位（overflow = true）
 * addMonths('2024-01-31T00:00:00Z', 1, true) // → 2024-03-02
 */
export function addMonths(input: MaybeDateInput, months: number, overflow = false): Date {
  return handleOverflow(input, (d) => d.setMonth(d.getMonth() + months), overflow);
}

/**
 * 减少月数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param months - 要减少的月数
 * @param overflow - 是否允许日期溢出到下一个月份
 *
 * @returns 减少月数后的 Date 对象
 */
export function subMonths(input: MaybeDateInput, months: number, overflow = false): Date {
  return addMonths(input, -months, overflow);
}
