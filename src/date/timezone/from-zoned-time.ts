import type { MaybeDateInput } from "../core/types";
import { toDate } from "../core/to-date";
import { offsetToSeconds } from "../core/utils";
import { computeOffset } from "./compute-offset";

const PROBE_RANGE = 48 * 60 * 60 * 1000;

/**
 * 将指定时区的墙上时间转换为对应的 Date 时刻。
 *
 * 输入被视为 `timezone` 时区下的墙上时间，返回该时间对应的绝对时刻（UTC）。
 * 例如上海时间 `2023-02-22 00:00` 会转换为 `2023-02-21T16:00:00.000Z`。
 *
 * 夏令时边界遵循 Temporal 的 `compatible` 策略：
 * - 重复的时间（秋季回拨）取较早的时刻；
 * - 不存在的时间（春季跳表）向后顺延。
 *
 * 注意：字符串输入如果没有时区偏移（例如 `"2023-02-22T00:00:00"`），会按设备时区解析，
 * 建议传入 `Date` 或带 `Z` 后缀的字符串（例如 `"2023-02-22T00:00:00Z"`）来表示墙上时间。
 *
 * @param input - 要转换的墙上时间
 * @param timezone - 时区标识，例如 "Europe/Amsterdam"
 *
 * @returns 墙上时间对应的新的 Date 对象
 */
export function fromZonedTime(input: MaybeDateInput, timezone: string): Date {
  const wallMs = toDate(input).getTime();

  const offsetAt = (instant: number): number =>
    offsetToSeconds(computeOffset(new Date(instant), "UTC", timezone), "Z");

  const offsets = [...new Set([offsetAt(wallMs - PROBE_RANGE), offsetAt(wallMs + PROBE_RANGE)])];
  const candidates = offsets.map((offset) => wallMs - offset * 1000);

  const valid = candidates.filter((candidate) => candidate + offsetAt(candidate) * 1000 === wallMs);

  return new Date(valid.length > 0 ? Math.min(...valid) : Math.max(...candidates));
}
