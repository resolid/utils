import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";

/**
 * 将日期的秒设置为目标秒
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param second - 目标秒，0-59
 *
 * @returns 设置秒后的 Date 对象
 */
export function setSecond(input: MaybeDateInput, second: number): Date {
  const date = toDate(input);
  date.setSeconds(second);

  return date;
}
