import { deviceLocale } from "../../device";
import { isUndefined } from "../../is";
import { daysInMonth } from "./days-in-month";
import { formatDayPeriod } from "./format-day-period";
import { toDate } from "./to-date";
import { tokenValues } from "./token-values";
import {
  FIXED_LENGTH,
  type Format,
  inferOffsetLength,
  isFormatStyle,
  offsetToSeconds,
  resolveFormat,
  two,
  validateTokens,
  validateOffset,
} from "./utils";

type ParsedValues = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  offset?: string;
};

export function parseDate(
  input: string,
  format: Format | "ISO8601",
  locale: string = "device",
  overflow: "forward" | "backward" | "throw" = "backward",
): Date | never {
  if (!input) {
    throw new Error("parseDate() requires a date input string.");
  }

  if (format === "ISO8601") {
    return toDate(input);
  }

  const invalid = (fmt: string): never => {
    throw new Error(`Date (${input}) does not match format (${fmt})`);
  };

  const resolvedLocale = locale === "device" ? deviceLocale() : locale;

  const genitive = isFormatStyle(format);
  const values: ParsedValues = {};
  const tokens = validateTokens(resolveFormat(format, resolvedLocale));

  if (!tokens.length) {
    throw new Error("parseDate() requires a pattern.");
  }

  let pos = 0;
  let a: null | boolean = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;

    if (token.type === "literal") {
      pos += token.value.length;
      continue;
    }

    const fixed = FIXED_LENGTH[token.value];
    const next = tokens[i + 1];

    // oxlint-disable-next-line no-useless-assignment
    let len = 1;

    if (token.value === "Z" || token.value == "ZZ") {
      len = inferOffsetLength(input.slice(pos));
    } else if (token.value === "SSS") {
      let end = pos;
      while (end < input.length && input.charCodeAt(end) >= 48 && input.charCodeAt(end) <= 57) {
        end++;
      }
      len = end - pos;
    } else if (!isUndefined(fixed)) {
      len = fixed;
    } else if (next) {
      if (next.type === "literal") {
        len = input.indexOf(next.value, pos) - pos;
        if (len < 0) {
          invalid(tokens.map((t) => t.value).join(""));
        }
      } else if (next.value === "A" || next.value === "a") {
        let j = 1;
        while (j <= 4 && input.charCodeAt(pos + j) >= 48 && input.charCodeAt(pos + j) <= 57) {
          j++;
        }
        len = j;
      } else {
        let end = pos;
        while (end < input.length && input.charCodeAt(end) >= 48 && input.charCodeAt(end) <= 57) {
          end++;
        }
        len = end - pos;
      }
    } else {
      len = input.length - pos;
    }

    const raw = input.slice(pos, pos + len);
    pos += len;

    if (!raw) {
      continue;
    }

    if (raw === token.value) {
      throw new Error(`Invalid input: "${raw}" looks like a format token, not a value`);
    }

    switch (token.value) {
      case "YYYY":
        values.year = Number(raw);
        break;
      case "YY": {
        const n = Number(raw);
        values.year = n >= 70 ? 1900 + n : 2000 + n;
        break;
      }
      case "MMMM":
      case "MMM": {
        const index = tokenValues(token.value, resolvedLocale, genitive).indexOf(raw);

        if (index !== -1) {
          values.month = index + 1;
        }
        break;
      }
      case "MM":
      case "M":
        values.month = Number(raw);
        break;
      case "DD":
      case "D":
        values.day = Number(raw);
        break;
      case "HH":
      case "H":
      case "hh":
      case "h":
        values.hour = Number(raw);
        break;
      case "mm":
      case "m":
        values.minute = Number(raw);
        break;
      case "ss":
      case "s":
        values.second = Number(raw);
        break;
      case "SSS":
        values.millisecond = Number(raw);
        break;
      case "A":
      case "a":
        a = raw.toLowerCase() === formatDayPeriod("am", resolvedLocale).toLowerCase();
        break;
      case "Z":
      case "ZZ":
        values.offset = validateOffset(raw, token.value);
        break;
    }
  }

  let hours = values.hour ?? 0;

  if (a === false) {
    hours += hours === 12 ? 0 : 12;
    values.hour = hours === 24 ? 0 : hours;
  } else if (a === true && hours === 12) {
    values.hour = 0;
  }

  const now = new Date();

  values.year ??= now.getFullYear();
  values.month ??= now.getMonth() + 1;
  values.day ??= now.getDate();
  values.hour ??= 0;
  values.minute ??= 0;
  values.second ??= 0;
  values.millisecond ??= 0;

  const year = String(values.year).padStart(4, "0");
  const month = two(values.month ?? 1);

  const monthDays = daysInMonth(new Date(`${year}-${month}-10`));

  if (monthDays < values.day && overflow === "throw") {
    throw new Error(`Invalid date ${year}-${month}-${two(values.day)}`);
  }

  values.day = overflow === "backward" ? Math.min(values.day, monthDays) : values.day;

  const day = two(values.day);
  const hour = two(values.hour);
  const minute = two(values.minute);
  const second = two(values.second);
  const millisecond = String(values.millisecond).padStart(3, "0");

  if (values.offset) {
    const d = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`);

    if (!isFinite(+d)) {
      return invalid(tokens.map((t) => t.value).join(""));
    }

    const length = inferOffsetLength(values.offset);

    return new Date(
      d.getTime() -
        offsetToSeconds(values.offset, length === 5 || length === 8 ? "ZZ" : "Z") * 1000,
    );
  }

  const d = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`);

  if (isFinite(+d)) {
    return d;
  }

  return invalid(tokens.map((t) => t.value).join(""));
}
