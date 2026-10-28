import { describe, expect, it } from "vitest";
import { formatDate } from "../format/format-date";
import { parseDate } from "./parse-date";

describe("parseDate", () => {
  it("can parse a simple MM/DD/YYYY format", () => {
    expect(parseDate("10/05/2022", "MM/DD/YYYY", "en").toISOString()).toBe(
      "2022-10-05T00:00:00.000Z",
    );
  });

  it("can parse a format with some escapes and characters", () => {
    expect(parseDate("Checkin: Dec 17, 2040", "C\\heckin: MMM D, YYYY", "en").toISOString()).toBe(
      "2040-12-17T00:00:00.000Z",
    );
  });

  it("throws when two variable length string tokens are next to each other", () => {
    expect(() => parseDate("MonJan15,2000", "dddMMM,DD,YYYY")).toThrow();
  });

  it("throws when two variable length numbers are next to each other", () => {
    expect(() => parseDate("11122", "MDYY")).toThrow();
  });

  it("throws when the delimiters are numbers", () => {
    expect(() => parseDate("1101122", "M0D1YY")).toThrow();
  });

  it("can parse MM/DD/YYYY", () => {
    expect(parseDate("12/17/1903", "MM/DD/YYYY").toISOString()).toBe("1903-12-17T00:00:00.000Z");
  });

  it("can parse space delimiters", () => {
    expect(parseDate("5 1 77", "M D YY").toISOString()).toBe("1977-05-01T00:00:00.000Z");
  });

  it("can parse the time of day", () => {
    const tz = new Date().getTimezoneOffset() / 60;

    expect(parseDate("5:22pm", "h:mma").toISOString()).toBe(
      `${formatDate(new Date(), "YYYY-MM-DDT")}${tz + 17}:22:00.000Z`,
    );

    const am = tz + 5;

    expect(parseDate("5:22am", "h:mma").toISOString()).toBe(
      `${formatDate(new Date(), "YYYY-MM-DDT")}${am < 10 ? `0${am}` : am}:22:00.000Z`,
    );
  });

  it("can parse the time of day", () => {
    const tz = new Date().getTimezoneOffset() / 60;

    expect(parseDate("5:22下午", "h:mma", "zh").toISOString()).toBe(
      `${formatDate(new Date(), "YYYY-MM-DDT")}${tz + 17}:22:00.000Z`,
    );

    const am = tz + 5;
    expect(parseDate("5:22上午", "h:mma", "zh").toISOString()).toBe(
      `${formatDate(new Date(), "YYYY-MM-DDT")}${am < 10 ? `0${am}` : am}:22:00.000Z`,
    );
  });

  it("can parse [+-]HH:mm", () => {
    expect(parseDate("1994-06-22T04:22:32+09:00", "YYYY-MM-DDTHH:mm:ssZ").toISOString()).toBe(
      "1994-06-21T19:22:32.000Z",
    );
    expect(parseDate("1994-06-22T04:22:32+09:00", "ISO8601").toISOString()).toBe(
      "1994-06-21T19:22:32.000Z",
    );
  });

  it("can parse the string month in en", () => {
    let h: number | string = new Date("2019-01-01").getTimezoneOffset() / 60;
    h = h < 10 ? `0${h}` : h;
    expect(parseDate("January 31, 2019", "MMMM D, YYYY").toISOString()).toBe(
      `2019-01-31T${h}:00:00.000Z`,
    );
  });

  it("can parse the string month in chinese", () => {
    let h: number | string = new Date("2019-01-01").getTimezoneOffset() / 60;
    h = h < 10 ? `0${h}` : h;
    expect(parseDate("一月 13, 2020", "MMMM D, YYYY", "zh").toISOString()).toBe(
      `2020-01-13T${h}:00:00.000Z`,
    );
  });

  it("can parse 4pm August 15, 99", () => {
    expect(parseDate("4pm on August 15, 99", "ha on MMMM D, YY").toISOString()).toBe(
      "1999-08-15T16:00:00.000Z",
    );
  });

  it("can parse midnight on december 31", () => {
    expect(parseDate("December 31 1999, 12am", "MMMM D YYYY, ha").toISOString()).toBe(
      "1999-12-31T00:00:00.000Z",
    );
  });

  it("can parse the 17:31 on the current day", () => {
    const d = new Date();
    const h: number = new Date().getTimezoneOffset() / 60;
    expect(parseDate("17:35:45", "H:mm:ss").toISOString()).toBe(
      `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${
        d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
      }T${17 + h}:35:45.000Z`,
    );
  });

  it("can parse a long date format", () => {
    expect(parseDate("December 31, 1999", { date: "long" }).toISOString()).toBe(
      "1999-12-31T00:00:00.000Z",
    );
  });

  it("throws an error when the format does not include the time", () => {
    expect(() => parseDate("December 31, 1999", { date: "long", time: "short" })).toThrow(
      `Date (December 31, 1999) does not match format (MMMM D, YYYY at h:mm A)`,
    );
  });

  it("throws an error when an incomplete iso time does not match a locale time", () => {
    expect(() => parseDate("2021-12-31", { date: "long", time: "short" })).toThrow(
      `Date (2021-12-31) does not match format (MMMM D, YYYY at h:mm A)`,
    );
  });

  it("can parse am and pm accurately", () => {
    expect(
      parseDate("Thursday, March 12, 1999 at 5:55 PM", {
        date: "full",
        time: "short",
      }).toISOString(),
    ).toBe("1999-03-12T17:55:00.000Z");
    expect(
      parseDate("Thursday, March 12, 1999 at 5:55 AM", {
        date: "full",
        time: "short",
      }).toISOString(),
    ).toBe("1999-03-12T05:55:00.000Z");
  });

  it("can parse am and pm accurately on a 12 hour clock at 12pm", () => {
    expect(
      parseDate("Saturday, October 1, 2022 at 12:00 PM", {
        date: "full",
        time: "short",
      }).toISOString(),
    ).toBe("2022-10-01T12:00:00.000Z");
  });

  it("can parse a cyrillic date", () => {
    expect(parseDate("14 мар. 2023 г.", { date: "medium" }, "ru").toISOString()).toBe(
      "2023-03-14T00:00:00.000Z",
    );
  });

  it("throws when parsing an empty string", () => {
    expect(() => parseDate("", { date: "long" })).toThrow();
    expect(() => parseDate("", "ISO8601")).toThrow();
  });

  it("throws when parsing an date with a placeholder month", () => {
    expect(() => parseDate("MMMM 17, 1987", { date: "long" }, "en")).toThrow();
  });

  it("can parse a full date with a timezone offset", () => {
    expect(
      parseDate("Friday, May 5, 2023 at 1:30:10 AM -06:00", {
        date: "full",
        time: "full",
      }).toISOString(),
    ).toBe("2023-05-05T07:30:10.000Z");
  });

  it("can parse a custom format with a timezone offset", () => {
    expect(parseDate("2023-02-24T13:44-05:00", "YYYY-MM-DDTHH:mmZ", "en").toISOString()).toBe(
      "2023-02-24T18:44:00.000Z",
    );
    expect(parseDate("2023--05:00-02-24T13:44", "YYYY-Z-MM-DDTHH:mm", "en").toISOString()).toBe(
      "2023-02-24T18:44:00.000Z",
    );
    expect(parseDate("2023-02-24T13:44-0500", "YYYY-MM-DDTHH:mmZZ", "en").toISOString()).toBe(
      "2023-02-24T18:44:00.000Z",
    );
    expect(parseDate("2023--0500-02-24T13:44", "YYYY-ZZ-MM-DDTHH:mm", "en").toISOString()).toBe(
      "2023-02-24T18:44:00.000Z",
    );
  });

  it("can parse an out of range date and get the last date in that month", () => {
    expect(parseDate("2023-02-31", "YYYY-MM-DD").toISOString()).toBe("2023-02-28T00:00:00.000Z");
  });

  it("can parse an out of range date and get the date in the next month", () => {
    expect(parseDate("2023-02-31", "YYYY-MM-DD", "en", "forward").toISOString()).toBe(
      "2023-03-03T00:00:00.000Z",
    );
  });

  it("can throw an error for dates out of range in a month", () => {
    expect(() => parseDate("2023-02-31", "YYYY-MM-DD", "en", "throw").toISOString()).toThrow();
  });

  it("should throws an error if the Z token is specified and [+-]HHmm", () => {
    expect(() => parseDate("1994-06-22T04:22:32-0900", "YYYY-MM-DDTHH:mm:ssZ")).toThrow(
      "Invalid offset: -0900",
    );
  });

  it("should throws an error when a FormatStyle is specified for [+-]HHmm", () => {
    expect(() =>
      parseDate("Friday, May 5, 2023 at 1:30:10 AM -0600", {
        date: "full",
        time: "full",
      }),
    ).toThrow("Invalid offset: -0600");
  });

  it("parses a long time format by using the ZZ token", () => {
    expect(
      parseDate("12/19/89, 1:30:10 AM -0600", { date: "short", time: "long" }, "en").toISOString(),
    ).toBe("1989-12-19T07:30:10.000Z");
  });
});
