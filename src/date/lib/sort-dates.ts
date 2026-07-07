import type { DateInput, MaybeDateInput } from "./types";
import { isBefore } from "./is-before";

/**
 * 日期列表排序
 *
 * @param dates 日期列表
 * @param order 排序方向，'asc' 升序（默认），'desc' 降序
 *
 * @returns 排序后的日期
 */
export function sortDates(
  dates: (MaybeDateInput | undefined)[],
  order: "asc" | "desc" = "asc",
): DateInput[] {
  return [...dates]
    .filter((date): date is DateInput => date != null)
    .sort((a, b) => {
      if (isBefore(a, b)) {
        return order === "asc" ? -1 : 1;
      }

      if (isBefore(b, a)) {
        return order === "asc" ? 1 : -1;
      }

      return 0;
    });
}
