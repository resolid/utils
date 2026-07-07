import { formatDate } from "./format-date";
import { formatDayPeriod } from "./format-day-period";
import { type FormatToken, two } from "./utils";

/**
 * 生成指定 token 所有可能值的列表
 *
 * 例如：
 * - `range("MM")` → `["01", "02", ..., "12"]`
 * - `range("MMMM", "zh")` → `["一月", "二月", ..., "十二月"]`
 *
 * @param token - 格式 Token
 * @param locale - 语言（默认英语）
 * @param genitive - 是否使用所有格形式（默认：`false`）
 *
 * @returns token 所有可能值的字符串数组
 */
export function tokenValues(token: FormatToken, locale = "en", genitive = false): string[] {
  if (token === "M") {
    return generateTokens(12, (i) => i + 1);
  }

  if (token === "MM") {
    return generateTokens(12, (i) => two(i + 1));
  }

  if (token.startsWith("M")) {
    return tokenValues("MM").map((m) => formatDate(`2000-${m}-05`, token, { locale, genitive }));
  }

  if (token.startsWith("d")) {
    return Array.from({ length: 7 }, (_, i) =>
      formatDate(`2022-10-${two(i + 2)}`, token, { locale, genitive }),
    );
  }

  if (token === "A") {
    return [
      formatDayPeriod("am", locale).toUpperCase(),
      formatDayPeriod("pm", locale).toUpperCase(),
    ];
  }

  if (token === "a") {
    return [
      formatDayPeriod("am", locale).toLowerCase(),
      formatDayPeriod("pm", locale).toLowerCase(),
    ];
  }

  if (token.startsWith("Y")) {
    const year = new Date().getFullYear();

    return Array.from({ length: 240 }, (_, i) =>
      formatDate(`${year - 120 + i}-06-06`, token, { locale }),
    );
  }

  if (token === "D") {
    return generateTokens(31, (i) => i + 1);
  }

  if (token === "DD") {
    return generateTokens(31, (i) => two(i + 1));
  }

  if (token === "H") {
    return generateTokens(24, (i) => i);
  }

  if (token === "HH") {
    return generateTokens(24, (i) => two(i));
  }

  if (token === "h") {
    return generateTokens(12, (i) => i + 1);
  }

  if (token === "hh") {
    return generateTokens(12, (i) => two(i + 1));
  }

  if (token === "m" || token === "s") {
    return generateTokens(60, (i) => i);
  }

  /* istanbul ignore next -- @preserve */
  if (token === "mm" || token === "ss") {
    return generateTokens(60, (i) => two(i));
  }

  /* istanbul ignore next -- @preserve */
  return [];
}

function generateTokens(count: number, getValue: (index: number) => string | number) {
  return Array.from({ length: count }, (_, i) => String(getValue(i)));
}
