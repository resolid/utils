import type { MaybeDateInput } from "../core/types";
import { handleOverflow } from "../core/utils";

/**
 * 增加年数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param years - 要增加的年数
 * @param overflow - 是否允许日期溢出到下一个月份
 *
 * @returns 增加年数后的 Date 对象
 *
 * @example
 * // 普通加年
 * addYears('2024-03-15T00:00:00Z', 1) // → 2025-03-15
 *
 * // 闰年钳制（overflow = false）
 * addYears('2024-02-29T00:00:00Z', 1) // → 2025-02-28
 *
 * // 闰年溢出进位（overflow = true）
 * addYears('2024-02-29T00:00:00Z', 1, true) // → 2025-03-01
 */
export function addYears(input: MaybeDateInput, years: number, overflow = false): Date {
  return handleOverflow(input, (d) => d.setFullYear(d.getFullYear() + years), overflow);
}

/**
 * 减少年数
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param years - 要减少的年数
 * @param overflow - 是否允许日期溢出到下一个月份
 *
 * @returns 减少年数后的 Date 对象
 */
export function subYears(input: MaybeDateInput, years: number, overflow = false): Date {
  return addYears(input, -years, overflow);
}
