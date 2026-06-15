import type { MaybeDateInput } from "./types";
import { isObject, isString } from "../../is";
import { daysInMonth } from "./days-in-month";
import { toDate } from "./to-date";

/**
 * 在更改月份或年份时处理日期溢出
 *
 * @param input - 日期输入，`null` 时默认当前
 * @param mutate - 对 Date 对象执行的操作
 * @param overflow - 是否允许日期溢出到下一个月份
 *
 * @returns 操作后的 Date 对象
 *
 * @example
 * // 1月31日减一个月，修正为 12月31日（overflow = false）
 * handleOverflow('2024-01-31', d => d.setMonth(d.getMonth() - 1))
 * // → 2023-12-31
 *
 * // 1月31日减一个月，溢出进位为 12月1日（overflow = true）
 * handleOverflow('2024-01-31', d => d.setMonth(d.getMonth() - 1), true)
 * // → 2023-12-01
 */
export function handleOverflow(
  input: MaybeDateInput,
  mutate: (d: Date) => void,
  overflow = false,
): Date {
  const date = toDate(input);
  const day = date.getDate();

  if (!overflow) {
    date.setDate(1);
  }

  mutate(date);

  if (!overflow) {
    const days = daysInMonth(date);
    date.setDate(days < day ? days : day);
  }

  return date;
}

/**
 * 时间差值的舍入方式。
 *
 * - `'trunc'` 去除小数（默认）
 * - `'round'` 四舍五入
 * - `'floor'` 向下取整
 * - `'ceil'`  向上取整
 */
export type DiffRoundingMethod = "trunc" | "round" | "floor" | "ceil";

export function diffInRound(value: number, method: DiffRoundingMethod = "trunc"): number {
  const r = Math[method](value);

  /* istanbul ignore next -- @preserve */
  return r == 0 ? 0 : r;
}

export const dayPeriodCache: Map<string, { am?: string; pm?: string }> = new Map();

export const specDate = "1999-02-03T05:06:07.008Z";

export function normalizePart(part: Intl.DateTimeFormatPart): Intl.DateTimeFormatPart {
  if (part.type === "literal") {
    part.value = part.value.normalize("NFKC");
  }

  return part;
}

export type FormatPart = "month" | "weekday";
export type FormatStyle = "full" | "long" | "medium" | "short";

export const formatStyles: readonly FormatStyle[] = ["full", "long", "medium", "short"];

export type FormatStyleObj =
  | { date: FormatStyle; time: FormatStyle }
  | { date: FormatStyle }
  | { time: FormatStyle };

export type Format = FormatStyle | FormatStyleObj | (string & {});

export type FormatToken =
  | "YYYY"
  | "YY"
  | "MMMM"
  | "MMM"
  | "MM"
  | "M"
  | "DD"
  | "D"
  | "dddd"
  | "ddd"
  | "d"
  | "HH"
  | "H"
  | "hh"
  | "h"
  | "mm"
  | "m"
  | "ss"
  | "s"
  | "SSS"
  | "A"
  | "a"
  | "Z"
  | "ZZ";

export type PartToken =
  | { type: "literal"; value: string }
  | {
      type: "field";
      value: FormatToken;
    };

export function tokenizeFormat(format: string): PartToken[] {
  const tokens: PartToken[] = [];
  const len = format.length;

  let i = 0;
  let literalBuf = "";

  const flush = () => {
    if (literalBuf) {
      tokens.push({ type: "literal", value: literalBuf });
      literalBuf = "";
    }
  };

  while (i < len) {
    const ch = format[i];

    if (ch === "[") {
      flush();

      const end = format.indexOf("]", i + 1);

      if (end === -1) {
        literalBuf += ch;
        i++;
        continue;
      }

      tokens.push({
        type: "literal",
        value: format.slice(i + 1, end),
      });

      i = end + 1;
      continue;
    }

    switch (ch) {
      case "Y":
        flush();

        if (format[i + 1] === "Y" && format[i + 2] === "Y" && format[i + 3] === "Y") {
          tokens.push({ type: "field", value: "YYYY" });
          i += 4;
          continue;
        }

        if (format[i + 1] === "Y") {
          tokens.push({ type: "field", value: "YY" });
          i += 2;
          continue;
        }

        break;
      case "M":
        flush();

        if (format[i + 1] === "M" && format[i + 2] === "M" && format[i + 3] === "M") {
          tokens.push({ type: "field", value: "MMMM" });
          i += 4;
          continue;
        }

        if (format[i + 1] === "M" && format[i + 2] === "M") {
          tokens.push({ type: "field", value: "MMM" });
          i += 3;
          continue;
        }

        if (format[i + 1] === "M") {
          tokens.push({ type: "field", value: "MM" });
          i += 2;
          continue;
        }

        tokens.push({ type: "field", value: "M" });
        i += 1;

        continue;
      case "D":
        flush();

        if (format[i + 1] === "D") {
          tokens.push({ type: "field", value: "DD" });
          i += 2;
          continue;
        }

        tokens.push({ type: "field", value: "D" });
        i += 1;
        continue;

      case "d":
        flush();

        if (format[i + 1] === "d" && format[i + 2] === "d" && format[i + 3] === "d") {
          tokens.push({ type: "field", value: "dddd" });
          i += 4;
          continue;
        }

        if (format[i + 1] === "d" && format[i + 2] === "d") {
          tokens.push({ type: "field", value: "ddd" });
          i += 3;
          continue;
        }

        tokens.push({ type: "field", value: "d" });
        i += 1;
        continue;

      case "H":
        flush();

        if (format[i + 1] === "H") {
          tokens.push({ type: "field", value: "HH" });
          i += 2;
          continue;
        }

        tokens.push({ type: "field", value: "H" });
        i += 1;
        continue;

      case "h":
        flush();

        if (format[i + 1] === "h") {
          tokens.push({ type: "field", value: "hh" });
          i += 2;
          continue;
        }

        tokens.push({ type: "field", value: "h" });
        i += 1;
        continue;

      case "m":
        flush();

        if (format[i + 1] === "m") {
          tokens.push({ type: "field", value: "mm" });
          i += 2;
          continue;
        }

        tokens.push({ type: "field", value: "m" });
        i += 1;
        continue;

      case "s":
        flush();

        if (format[i + 1] === "s") {
          tokens.push({ type: "field", value: "ss" });
          i += 2;
          continue;
        }

        tokens.push({ type: "field", value: "s" });
        i += 1;
        continue;

      case "S":
        flush();
        if (format[i + 1] === "S" && format[i + 2] === "S") {
          tokens.push({ type: "field", value: "SSS" });
          i += 3;
          continue;
        }
        break;

      case "A":
      case "a":
        flush();

        tokens.push({ type: "field", value: ch });
        i++;
        continue;

      case "Z":
        flush();

        if (format[i + 1] === "Z") {
          tokens.push({ type: "field", value: "ZZ" });
          i += 2;
          continue;
        }

        tokens.push({ type: "field", value: "Z" });
        i++;
        continue;
    }

    literalBuf += ch;
    i++;
  }

  flush();

  return tokens;
}

const formatterCache: Map<string, Intl.DateTimeFormat> = new Map();

function getFormatter(cacheKey: string, initFormatter: Intl.DateTimeFormat) {
  const formatter = formatterCache.get(cacheKey);

  if (!formatter) {
    formatterCache.set(cacheKey, initFormatter);

    return initFormatter;
  }

  return formatter;
}

function formatPartByOption(
  date: Date,
  part: FormatPart,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  return (
    getFormatter(`${locale}${JSON.stringify(options)}`, new Intl.DateTimeFormat(locale, options))
      .formatToParts(date)
      .find((p) => p.type === part)?.value ?? ""
  );
}

export function formatPart(
  date: Date,
  style: "long" | "short" | "narrow",
  part: FormatPart,
  locale: string,
  genitive: boolean,
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "UTC",
  };

  if (part == "weekday") {
    options.weekday = style;

    return formatPartByOption(date, part, locale, options);
  }

  if (genitive) {
    options.dateStyle = style === "long" ? "long" : "medium";

    const probe = formatPartByOption(date, part, locale, options);

    if (!/^\d+$/.test(probe)) {
      return probe;
    }

    options.dateStyle = undefined;
  }

  options.month = style;
  return formatPartByOption(date, part, locale, options);
}

export const two = (n: number): string => String(n).padStart(2, "0");

export type TimezoneToken = "Z" | "ZZ";

export function secondsToOffset(ts: number, token: TimezoneToken = "Z"): string {
  const sign = ts < 0 ? "-" : "+";
  const abs = Math.abs(ts);
  const seconds = Math.round(abs % 60);
  const minutes = two(Math.floor((abs % 3600) / 60));
  const hours = two(Math.floor(abs / 3600));

  const sep = token === "ZZ" ? "" : ":";
  const base = `${sign}${hours}${sep}${minutes}`;

  /* istanbul ignore next -- @preserve */
  return seconds === 0 ? base : `${base}${sep}${two(seconds)}`;
}

export function offsetToSeconds(offset: string, token: TimezoneToken): number {
  validateOffset(offset, token);
  const [, sign, hours, minutes, seconds = "0"] = offset.match(
    // oxlint-disable-next-line prefer-named-capture-group
    /([+-])([0-3][0-9]):?([0-5][0-9])(?::?([0-5][0-9]))?/,
  )!;
  const total = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);

  return sign === "+" ? total : -total;
}

const OFFSET_RE: Record<TimezoneToken, RegExp> = {
  Z: /^[+-][0-3][0-9]:[0-5][0-9](?::[0-5][0-9])?$/,
  ZZ: /^[+-][0-3][0-9][0-5][0-9](?:[0-5][0-9])?$/,
};

export function validateOffset(offset: string, token: TimezoneToken = "Z"): string {
  /* istanbul ignore if -- @preserve */
  if (!OFFSET_RE[token].test(offset)) {
    throw new Error(`Invalid offset: ${offset}`);
  }

  return offset;
}

/* istanbul ignore next -- @preserve */
export function inferOffsetLength(offset: string): 9 | 8 | 6 | 5 {
  if (/^[+-]\d{2}:\d{2}:\d{2}/.test(offset)) {
    return 9;
  }

  if (/^[+-]\d{6}/.test(offset)) {
    return 8;
  }

  if (/^[+-]\d{2}:\d{2}/.test(offset)) {
    return 6;
  }

  if (/^[+-]\d{4}/.test(offset)) {
    return 5;
  }

  throw new Error("Invalid offset format");
}

export function buildFormatOptions(
  format: FormatStyle | FormatStyleObj,
  timezone?: string,
): Intl.DateTimeFormatOptions {
  const options: Intl.DateTimeFormatOptions = { timeZone: timezone };

  if (isString(format)) {
    options.dateStyle = format;
  } else {
    if ("date" in format) {
      options.dateStyle = format.date;
    }

    if ("time" in format) {
      options.timeStyle = format.time;
    }
  }

  return options;
}

export function getTimezoneToken(timeStyle?: FormatStyle): "Z" | "ZZ" | undefined {
  return timeStyle ? (timeStyle === "long" ? "ZZ" : "Z") : undefined;
}

export function isFormatStyle(format: Format): format is FormatStyle | FormatStyleObj {
  return formatStyles.includes(format as FormatStyle) || isObject(format);
}

export function resolveFormat(format: Format, locale: string): PartToken[] {
  if (!isFormatStyle(format)) {
    return tokenizeFormat(format);
  }

  const options = buildFormatOptions(format, "UTC");

  const formatterKey = `${locale}${JSON.stringify(options)}`;
  const formatter = getFormatter(formatterKey, new Intl.DateTimeFormat(locale, options));
  const resolved = formatter.resolvedOptions();

  const tokens = formatter.formatToParts(toDate(specDate)).map((part) => {
    if (part.type === "year") {
      return {
        type: "field",
        value: part.value.length === 2 ? "YY" : "YYYY",
      };
    }

    if (part.type === "month") {
      return {
        type: "field",
        value:
          resolved.month === "long" ||
          resolved.dateStyle === "long" ||
          resolved.dateStyle === "full"
            ? "MMMM"
            : resolved.month === "short" || resolved.dateStyle === "medium"
              ? "MMM"
              : resolved.month === "2-digit"
                ? "MM"
                : "M",
      };
    }

    if (part.type === "day") {
      return {
        type: "field",
        value: resolved.day === "2-digit" ? "DD" : "D",
      };
    }

    if (part.type === "weekday") {
      return {
        type: "field",
        value: resolved.weekday === "long" ? "dddd" : resolved.weekday === "short" ? "ddd" : "d",
      };
    }

    if (part.type === "hour") {
      return {
        type: "field",
        value:
          resolved.hourCycle === "h11" || resolved.hourCycle === "h12"
            ? resolved.hour === "2-digit"
              ? "hh"
              : "h"
            : resolved.hour === "2-digit"
              ? "HH"
              : "H",
      };
    }

    if (part.type === "minute") {
      return {
        type: "field",
        value: part.value.length == 2 ? "mm" : "m",
      };
    }

    if (part.type === "second") {
      return {
        type: "field",
        value: part.value.length == 2 ? "ss" : "s",
      };
    }

    if (part.type === "fractionalSecond") {
      return {
        type: "field",
        value: "SSS",
      };
    }

    if (part.type === "dayPeriod") {
      return {
        type: "field",
        value: /^[A-Z]+$/u.test(part.value) ? "A" : "a",
      };
    }

    if (part.type === "timeZoneName") {
      return {
        type: "field",
        value: getTimezoneToken(options.timeStyle),
      };
    }

    return normalizePart(part);
  });

  return tokens as PartToken[];
}

export const FIXED_LENGTH: Partial<Record<FormatToken, number>> = {
  YYYY: 4,
  YY: 2,
  MM: 2,
  DD: 2,
  HH: 2,
  hh: 2,
  mm: 2,
  ss: 2,
};

export function isNumeric(part: PartToken): boolean {
  return [
    "YYYY",
    "YY",
    "MM",
    "M",
    "DD",
    "D",
    "HH",
    "H",
    "hh",
    "h",
    "mm",
    "m",
    "ss",
    "s",
    "SSS",
  ].includes(part.value);
}

export function validateTokens(parts: PartToken[]): PartToken[] {
  let prev: PartToken | undefined;

  for (const part of parts) {
    if (part.type === "literal" && !isNaN(parseFloat(part.value))) {
      throw new Error(`Numeric literal in format: "${part.value}"`);
    }

    if (
      prev &&
      prev.type !== "literal" &&
      part.type !== "literal" &&
      !(prev.value in FIXED_LENGTH) &&
      !(part.value in FIXED_LENGTH) &&
      !(isNumeric(prev) && part.value.toLowerCase() === "a") &&
      prev.value !== "SSS"
    ) {
      throw new Error(`Illegal adjacent tokens (${prev.value}, ${part.value})`);
    }

    prev = part;
  }

  return parts;
}
