import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 将日期的分钟设置为目标分钟
 *
 * @param value - 日期输入，`null` 时默认当前
 * @param minute - 目标分钟，0-59
 *
 * @returns 设置分钟后的 Date 对象
 */
export function setMinute(value: MaybeDateInput, minute: number): Date {
  const date = toDate(value);
  date.setMinutes(minute);

  return date;
}
