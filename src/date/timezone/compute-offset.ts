import type { MaybeDateInput } from "../core/types";
import { deviceTimezone } from "../../device";
import { toDate } from "../core/to-date";
import { secondsToOffset, type TimezoneToken } from "../core/utils";

/**
 * 计算两个时区在指定时间的偏移差
 *
 * 该函数会根据给定时间，分别计算 `fromTimezone` 和 `toTimezone` 在该时间点对应的本地时间，然后返回两者之间的偏移量
 * 返回值为符合 ISO8601 规范的偏移字符串，例如 `-0800` 或 `+0530`
 *
 * 注意：由于夏令时（DST）的存在，不同日期计算出的偏移可能不同
 *
 * @param input - 用于计算偏移的基准时间，`null` 时默认当前
 * @param fromTimezone - 目标时区，默认为 `"UTC"`
 * @param toTimezone - 目标时区。传入 `"device"` 时表示当前设备时区，默认为 `"device"`
 * @param timezoneToken - 偏移量格式，"Z" 为 ±HH:mm，"ZZ" 为 ±HHmm（默认："Z"）
 *
 * @returns 返回值为 ISO 8601 格式的偏移量，如 "+08:00" 或 "+0800"
 *
 * @example
 * - `computeOffset(date, "UTC", "Asia/Shanghai")` 返回 `+08:00`，表示上海比 UTC 快 8 小时
 * - `computeOffset(date, "Asia/Shanghai", "UTC")` 返回 `-08:00`，表示 UTC 比上海慢 8 小时
 */
export function computeOffset(
  input: MaybeDateInput,
  fromTimezone: string = "UTC",
  toTimezone: string = "device",
  timezoneToken: TimezoneToken = "Z",
): string {
  const date = toDate(input);
  const fromTime = relativeTime(date, fromTimezone);
  const toTime = relativeTime(
    date,
    /* istanbul ignore next -- @preserve */
    toTimezone === "device" ? (deviceTimezone() ?? "UTC") : toTimezone,
  );

  return secondsToOffset(Math.round((toTime.getTime() - fromTime.getTime()) / 1000), timezoneToken);
}

function relativeTime(d: Date, timezone: string): Date {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(d)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`,
  );
}
