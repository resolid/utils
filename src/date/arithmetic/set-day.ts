import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 将日期的天设置为目标天
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param day - 目标天，1-31
 *
 * @returns 设置天后的 Date 对象
 */
export function setDay(input: MaybeDateInput, day: number): Date {
  const date = toDate(input);
  date.setDate(day);

  return date;
}
