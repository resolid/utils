import { dayPeriodCache, normalizePart, specDate } from "../core/utils";

/**
 * 获取指定 locale 下本地化的 AM/PM 字符串
 *
 * @param period - 需要获取的时段，`'am'` 或 `'pm'`
 * @param locale - 目标 locale，如 `'zh-CN'`、`'en-US'`
 *
 * @returns 本地化的时段字符串
 */
export function formatDayPeriod(period: "am" | "pm", locale: string): string {
  const cached = dayPeriodCache.get(locale);

  /* istanbul ignore if -- @preserve */
  if (cached?.[period]) {
    return cached[period];
  }

  const specimen = new Date(specDate);
  specimen.setUTCHours(period === "am" ? 5 : 20);

  const periodPart = new Intl.DateTimeFormat(locale, {
    timeStyle: "full",
    timeZone: "UTC",
    hour12: true,
  })
    .formatToParts(specimen)
    .map(normalizePart)
    .find((part) => part.type === "dayPeriod");

  /* istanbul ignore else -- @preserve */
  if (periodPart) {
    dayPeriodCache.set(locale, { ...cached, [period]: periodPart.value });

    return periodPart.value;
  }

  /* istanbul ignore next -- @preserve */
  return period;
}
