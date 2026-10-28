import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";
import { applyOffset } from "./apply-offset";
import { computeOffset } from "./compute-offset";

/**
 * 返回指定时区下的本地时间 Date 对象。
 *
 * @param input - 要转换的日期，`null` 时默认当前
 * @param timezone - 时区标识，例如 "Europe/Amsterdam"
 *
 * @returns 转换到指定时区后的新的 Date 对象
 */
export function tzDate(input: MaybeDateInput, timezone: string): Date {
  const date = toDate(input);

  return applyOffset(date, computeOffset(date, timezone));
}
