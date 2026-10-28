/**
 * Date 对象或 ISO 8601 / ISO 9075 字符串
 */
export type DateInput = Date | string;

export type MaybeDateInput = DateInput | null;

export type DateRange = {
  start: MaybeDateInput;
  end: MaybeDateInput;
};

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeekDayFormat = Intl.DateTimeFormatOptions["weekday"];

export type FirstWeekContains = 1 | 4;
