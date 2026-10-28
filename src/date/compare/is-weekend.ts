import type { DateInput } from "../core/types";
import { toDate } from "../core/to-date";

export function isWeekend(input: DateInput): boolean {
  const day = toDate(input).getDay();

  return day == 0 || day == 6;
}
