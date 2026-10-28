import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";
import { inferOffsetLength, offsetToSeconds } from "../core/utils";

/**
 * 指定时间上应用时区偏移，返回调整后的新时间
 *
 * @param input - 需要调整的时间，`null` 时默认当前
 * @param offset - 偏移量字符串，支持 `±HHmm`、`±HH:mm`、`±HHmmss`、`±HH:mm:ss` 格式
 *
 * @returns 加减偏移后的新时间
 */
export function applyOffset(input: MaybeDateInput, offset: string = "+00:00"): Date {
  const date = toDate(input);
  const length = inferOffsetLength(offset);

  const seconds = offsetToSeconds(offset, length === 5 || length === 8 ? "ZZ" : "Z");

  return new Date(date.getTime() + seconds * 1000);
}
