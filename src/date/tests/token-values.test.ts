import { describe, expect, it } from "vitest";
import _localeData from "../../../data/locale-data.json" with { type: "json" };
import { tokenValues } from "../lib/token-values";
import { two } from "../lib/utils";

function r<T>(length: number, fill: (index: number) => T): T[] {
  return Array.from({ length })
    .fill("")
    .map((_x, i) => fill(i));
}

const localeData = _localeData as Record<
  string,
  { month: { short: { standalone: string[] }; long: { format: string[] } } }
>;

const locales = Object.keys(localeData);

describe("monthTokenValues", () => {
  it('generates "short" months in each locale that matches dates date dateStyle "short" months.', () => {
    const monthRanges = locales.map((locale) => tokenValues("MMM", locale, false));

    const renderedMonthRanges: string[][] = [];

    locales.forEach((locale) => {
      renderedMonthRanges.push(localeData[locale]!.month.short.standalone);
    });

    expect(monthRanges).toEqual(renderedMonthRanges);
  });

  it('generates "long" months in each locale that matches dates date dateStyle "long" months.', () => {
    const monthRanges = locales.map((locale) => tokenValues("MMMM", locale, true));

    const renderedMonthRanges: string[][] = [];

    locales.forEach((locale) => {
      renderedMonthRanges.push(localeData[locale]!.month.long.format);
    });

    expect(monthRanges).toEqual(renderedMonthRanges);
  });
});

describe("tokenValues", () => {
  it("can return single digit month ranges", () => {
    expect(tokenValues("M")).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ]);
  });

  it("can return double digit month ranges", () => {
    expect(tokenValues("MM")).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ]);
  });

  it("can return short month ranges", () => {
    expect(tokenValues("MMM")).toEqual([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]);
  });

  it("can return long month ranges", () => {
    expect(tokenValues("MMMM")).toEqual([
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]);
  });

  it("can return long month ranges in italian", () => {
    expect(tokenValues("MMMM", "it")).toEqual([
      "gennaio",
      "febbraio",
      "marzo",
      "aprile",
      "maggio",
      "giugno",
      "luglio",
      "agosto",
      "settembre",
      "ottobre",
      "novembre",
      "dicembre",
    ]);
  });

  it("can return long month ranges in russian", () => {
    expect(tokenValues("MMMM", "ru")).toEqual([
      "январь",
      "февраль",
      "март",
      "апрель",
      "май",
      "июнь",
      "июль",
      "август",
      "сентябрь",
      "октябрь",
      "ноябрь",
      "декабрь",
    ]);
  });

  it("can return short month ranges in russian", () => {
    expect(tokenValues("MMM", "ru")).toEqual([
      "янв.",
      "февр.",
      "март",
      "апр.",
      "май",
      "июнь",
      "июль",
      "авг.",
      "сент.",
      "окт.",
      "нояб.",
      "дек.",
    ]);
  });

  it("can return all the short days in english", () => {
    expect(tokenValues("ddd", "en")).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  });

  it("can return all the short days in french", () => {
    expect(tokenValues("ddd", "fr")).toEqual([
      "dim.",
      "lun.",
      "mar.",
      "mer.",
      "jeu.",
      "ven.",
      "sam.",
    ]);
  });

  it("can return all the long days in english", () => {
    expect(tokenValues("dddd", "en")).toEqual([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]);
  });

  it("can return all the short days in english", () => {
    expect(tokenValues("d", "en")).toEqual(["S", "M", "T", "W", "T", "F", "S"]);
  });

  it("can return a 100 year range starting from the current year in 2 digits", () => {
    const year = new Date().getFullYear();
    const years = [];

    for (let i = -120; i < 120; i++) {
      years.push(`${year + i}`.substring(2));
    }
    expect(tokenValues("YY")).toEqual(years);
  });

  it("can return a 100 year range starting from the current year in 4 digits", () => {
    const year = new Date().getFullYear();
    const years = [];
    for (let i = -120; i < 120; i++) {
      years.push(`${year + i}`);
    }
    expect(tokenValues("YYYY")).toEqual(years);
  });

  it("can be return the am/pm range", () => {
    expect(tokenValues("a")).toEqual(["am", "pm"]);
  });

  it("can be return the am/pm range", () => {
    expect(tokenValues("A")).toEqual(["AM", "PM"]);
  });

  it("can be return the am/pm range in japan", () => {
    expect(tokenValues("A", "ja")).toEqual(["午前", "午後"]);
  });

  it("can return the single digit day of the month range", () => {
    expect(tokenValues("DD")).toEqual(r(31, (i) => two(i + 1)));
  });

  it("can return the single digit day of the month range", () => {
    expect(tokenValues("D")).toEqual(r(31, (i) => `${i + 1}`));
  });

  it("can return the single digit 24 hours of a day", () => {
    expect(tokenValues("H")).toEqual(r(24, (i) => `${i}`));
  });

  it("can return the double digit 24 hours of a day", () => {
    expect(tokenValues("HH")).toEqual(r(24, (i) => two(i)));
  });

  it("can return the single digit 12 hours of a day", () => {
    expect(tokenValues("h")).toEqual(r(12, (i) => `${i + 1}`));
  });

  it("can return the double digit 12 hours of a day", () => {
    expect(tokenValues("hh")).toEqual(r(12, (i) => two(i + 1)));
  });

  it("can return the double digit 59 minutes", () => {
    expect(tokenValues("m")).toEqual(r(60, (i) => `${i}`));
  });

  it("can return the single digit 59 minutes", () => {
    expect(tokenValues("mm")).toEqual(r(60, (i) => two(i)));
  });

  it("can return the single digit 59 seconds", () => {
    expect(tokenValues("s")).toEqual(r(60, (i) => `${i}`));
  });

  it("can return the double digit 59 minutes", () => {
    expect(tokenValues("ss")).toEqual(r(60, (i) => two(i)));
  });
});
