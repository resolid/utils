import type { MaybeDateInput } from "../core/types";
import { applyOffset } from "./apply-offset";

/**
 * 指定时间中移除时区偏移，返回调整后的新时间
 *
 * @param input - 需要调整的时间，`null` 时默认当前
 * @param offset - 偏移量字符串，支持 `±HHmm`、`±HH:mm`、`±HHmmss`、`±HH:mm:ss` 格式
 *
 * @returns 调整后的新时间
 */
export function removeOffset(input: MaybeDateInput, offset: string = "+00:00"): Date {
  const positive = offset.slice(0, 1) === "+";

  return applyOffset(input, offset.replace(positive ? "+" : "-", positive ? "-" : "+"));
}
