import type { DateInput } from "../core/types";
import { addDays } from "../arithmetic/add-days";
import { addMonths } from "../arithmetic/add-months";
import { addYears } from "../arithmetic/add-years";
import { isAfter } from "../compare/is-after";

type GetDatesInRangeOptions = {
  /**
   * 时间单位
   * @default "day"
   */
  unit?: "day" | "month" | "year";

  /**
   * 偏移步长
   * @default 1
   */
  step?: number;
};

/**
 * 枚举两个日期之间的所有日期
 *
 * @param start 起始日期
 * @param end 结束日期
 * @param options 选项
 * @param options.unit - 单位: `"day"` | `"month"` | `"year"`. 默认 `"day"`
 * @param options.step - 步长: 必须大于 0. 默认 `1`
 *
 * @returns 介于 start 和 end 之间的日期数组
 */
export function getDatesInRange(
  start: DateInput,
  end: DateInput,
  options?: GetDatesInRangeOptions,
): DateInput[] {
  const unit = options?.unit ?? "day";
  const step = options?.step ?? 1;

  if (step <= 0) {
    throw new Error("getDatesInRange: step must be greater than 0");
  }

  const add = {
    day: addDays,
    month: addMonths,
    year: addYears,
  }[unit];

  const dates: DateInput[] = [];

  let current = start;

  while (!isAfter(current, end)) {
    dates.push(current);

    current = add(current, step);
  }

  return dates;
}
