import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 将日期的毫秒设置为目标毫秒
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param millisecond - 目标毫秒，0-999，默认为 0
 *
 * @returns 设置毫秒后的 Date 对象
 */
export function setMillisecond(input: MaybeDateInput, millisecond: number): Date {
  const date = toDate(input);
  date.setMilliseconds(millisecond);

  return date;
}
