import type { MaybeDateInput } from "./types";
import { deviceLocale, deviceTimezone } from "../../device";
import { computeOffset } from "./compute-offset";
import { formatDayPeriod } from "./format-day-period";
import { removeOffset } from "./remove-offset";
import { toDate } from "./to-date";
import {
  buildFormatOptions,
  type Format,
  formatPart,
  getTimezoneToken,
  isFormatStyle,
  normalizePart,
  secondsToOffset,
  tokenizeFormat,
  two,
} from "./utils";

export type FormatOptions = {
  locale?: string;
  timezone?: string;
  genitive?: boolean;
};

/**
 * 将日期格式化为指定格式的字符串。
 *
 * @param input - 要格式化的日期，`null` 时默认当前
 * @param format - 格式化设置，如果使用格式化字符串则支持以下 token：
 *
 * | Token | 示例 | 说明 |
 * |-------|------|------|
 * | `YYYY` | 2026 | 4 位年份 |
 * | `YY` | 26 | 2 位年份 |
 * |-------|------|------|
 * | `MMMM` | 三月/March | 完整月份名（本地化） |
 * | `MMM` | 3月/Mar | 缩写月份名（本地化） |
 * | `MM` | 03 | 2 位月份数字 |
 * | `M` | 3 | 月份数字 |
 * |-------|------|------|
 * | `DD` | 06 | 2 位日期数字 |
 * | `D` | 6 | 日期数字 |
 * |-------|------|------|
 * | `dddd` | 星期五/Friday | 完整星期名（本地化） |
 * | `ddd` | 周五/Fri | 缩写星期名（本地化） |
 * | `d` | 五/F | 单字符星期名（本地化） |
 * |-------|------|------|
 * | `HH` | 01, 13 | 24 小时制（2 位） |
 * | `H` | 1, 13 | 24 小时制 |
 * | `hh` | 01, 12 | 12 小时制（2 位） |
 * | `h` | 1, 12 | 12 小时制 |
 * |-------|------|------|
 * | `mm` | 02, 33 | 分钟（2 位） |
 * | `m` | 2, 33 | 分钟 |
 * | `ss` | 07, 17 | 秒（2 位） |
 * | `s` | 7, 17 | 秒 |
 * | `SSS` | 007, 123 | 毫秒（3 位） |
 * |-------|------|------|
 * | `A` | 下午/PM | AM/PM（本地化） |
 * | `a` | 下午/pm | am/pm（本地化） |
 * |-------|------|------|
 * | `Z` | +08:00 | 时区偏移（带冒号） |
 * | `ZZ` | +0800 | 时区偏移（不带冒号） |
 *
 * @param options - 可选配置
 * @param options.locale - 语言区域，影响月份名、星期名、AM/PM 等本地化输出，默认使用设备语言
 * @param options.timeZone - 时区，默认使用设备时区
 * @param options.genitive - 是否使用所有格形式（默认：`false`）
 *
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  input: MaybeDateInput,
  format: Format | "ISO8601" | "ISO9075",
  options: FormatOptions = {},
): string {
  const date = toDate(input);

  if (format === "ISO8601") {
    return date.toISOString();
  }

  if (format === "ISO9075") {
    return date.toISOString().replace("T", " ");
  }

  const { locale = deviceLocale(), timezone, genitive = false } = options;

  if (isFormatStyle(format)) {
    const formatOptions = buildFormatOptions(format, timezone);

    return new Intl.DateTimeFormat(locale, formatOptions)
      .formatToParts(date)
      .map(normalizePart)
      .map((part) =>
        part.type === "timeZoneName"
          ? computeOffset(date, "UTC", timezone, getTimezoneToken(formatOptions.timeStyle))
          : part.value,
      )
      .join("");
  }

  const resolvedTimezone = timezone ?? deviceTimezone();

  const resolvedDate =
    resolvedTimezone?.toUpperCase() === "UTC"
      ? date
      : removeOffset(date, computeOffset(date, resolvedTimezone, "UTC"));

  const tokens = tokenizeFormat(format);

  const parts: string[] = [];

  for (const token of tokens) {
    if (token.type == "literal") {
      parts.push(normalizePart(token).value);
      continue;
    }

    switch (token.value) {
      case "YYYY": {
        parts.push(String(resolvedDate.getUTCFullYear()));
        break;
      }
      case "YY": {
        parts.push(two(resolvedDate.getUTCFullYear() % 100));
        break;
      }
      case "MMMM": {
        parts.push(formatPart(resolvedDate, "long", "month", locale, genitive));
        break;
      }
      case "MMM": {
        parts.push(formatPart(resolvedDate, "short", "month", locale, genitive));
        break;
      }
      case "MM": {
        parts.push(two(resolvedDate.getUTCMonth() + 1));
        break;
      }
      case "M": {
        parts.push(String(resolvedDate.getUTCMonth() + 1));
        break;
      }
      case "DD": {
        parts.push(two(resolvedDate.getUTCDate()));
        break;
      }
      case "D": {
        parts.push(String(resolvedDate.getUTCDate()));
        break;
      }
      case "dddd": {
        parts.push(formatPart(resolvedDate, "long", "weekday", locale, genitive));
        break;
      }
      case "ddd": {
        parts.push(formatPart(resolvedDate, "short", "weekday", locale, genitive));
        break;
      }
      case "d": {
        parts.push(formatPart(resolvedDate, "narrow", "weekday", locale, genitive));
        break;
      }
      case "HH": {
        parts.push(two(resolvedDate.getUTCHours()));
        break;
      }
      case "H": {
        parts.push(String(resolvedDate.getUTCHours()));
        break;
      }
      case "hh": {
        parts.push(two(resolvedDate.getUTCHours() % 12 || 12));
        break;
      }
      case "h": {
        parts.push(String(resolvedDate.getUTCHours() % 12 || 12));
        break;
      }
      case "mm": {
        parts.push(two(resolvedDate.getUTCMinutes()));
        break;
      }
      case "m": {
        parts.push(String(resolvedDate.getUTCMinutes()));
        break;
      }
      case "ss": {
        parts.push(two(resolvedDate.getUTCSeconds()));
        break;
      }
      case "s": {
        parts.push(String(resolvedDate.getUTCSeconds()));
        break;
      }
      case "SSS": {
        parts.push(String(resolvedDate.getUTCMilliseconds()).padStart(3, "0"));
        break;
      }
      case "A": {
        parts.push(
          formatDayPeriod(resolvedDate.getUTCHours() < 12 ? "am" : "pm", locale).toUpperCase(),
        );
        break;
      }
      case "a": {
        parts.push(
          formatDayPeriod(resolvedDate.getUTCHours() < 12 ? "am" : "pm", locale).toLowerCase(),
        );
        break;
      }
      case "Z":
      case "ZZ": {
        parts.push(
          timezone
            ? computeOffset(date, "UTC", timezone, token.value)
            : secondsToOffset(-1 * resolvedDate.getTimezoneOffset() * 60, token.value),
        );
        break;
      }
    }
  }

  return parts.join("");
}
