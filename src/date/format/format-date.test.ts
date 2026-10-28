import { describe, expect, it } from "vitest";
import { fromZonedTime } from "../timezone/from-zoned-time";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it('renders "ISO8601"', () => {
    expect(formatDate("2017-05-06", "ISO8601")).toEqual("2017-05-06T00:00:00.000Z");
  });

  it('renders "ISO9075"', () => {
    expect(formatDate("2017-05-06", "ISO9075")).toEqual("2017-05-06 00:00:00.000Z");
  });

  it('renders "short" dates', () => {
    expect(formatDate("2017-05-06", "short")).toEqual("5/6/17");
  });

  it('renders "medium" dates', () => {
    expect(formatDate("2017-07-06", "medium")).toEqual("Jul 6, 2017");
  });

  it('renders "long" dates', () => {
    expect(formatDate("2017-07-06", "long")).toEqual("July 6, 2017");
  });

  it('renders "full" dates', () => {
    expect(formatDate("2017-07-06", "full")).toEqual("Thursday, July 6, 2017");
  });

  it("can render a single full year", () => {
    expect(formatDate(new Date("2020-01-05"), "YYYY")).toEqual("2020");
  });

  it("can render a single 2 digit year", () => {
    expect(formatDate("1999-05-06", "YY")).toEqual("99");
  });

  it("can render a single digit month", () => {
    expect(formatDate("1999-05-06", "M")).toEqual("5");
  });

  it("can render a double digit month", () => {
    expect(formatDate("1999-05-06", "MM")).toEqual("05");
  });

  it("can render a short month name", () => {
    expect(formatDate("1999-12-06", "MMM")).toEqual("Dec");
  });

  it("can render a long month name", () => {
    expect(formatDate("1999-01-06", "MMMM")).toEqual("January");
  });

  it("can render a one digit date", () => {
    expect(formatDate("1999-01-06", "D")).toEqual("6");
  });

  it("can render a 2 digit date", () => {
    expect(formatDate("1999-01-06", "DD")).toEqual("06");
  });

  it("can render the day of the week as a single character", () => {
    expect(formatDate("2022-10-12", "d")).toEqual("W");
  });

  it("can render the day of the week as 3 characters", () => {
    expect(formatDate("2022-10-13", "ddd")).toEqual("Thu");
  });

  it("can render the full day of the week", () => {
    expect(formatDate("2022-10-10", "dddd")).toEqual("Monday");
  });

  it("can render the single digit 24 hour", () => {
    expect(formatDate("2022-10-10 05:15:00", "H")).toEqual("5");
  });

  it("can render the double digit 24 hour", () => {
    expect(formatDate("2022-10-10 15:15:00", "HH")).toEqual("15");
  });

  it("can render the single digit 12 hour", () => {
    expect(formatDate("2022-10-10 13:15:00", "h")).toEqual("1");
    expect(formatDate("2022-10-10 12:15:00", "h")).toEqual("12");
  });

  it("can render the 2 digit 12 hour", () => {
    expect(formatDate("2022-10-10 05:15:00", "hh")).toEqual("05");
    expect(formatDate("2022-10-10 12:15:00", "hh")).toEqual("12");
  });

  it("can render the single digit minutes", () => {
    expect(formatDate("2022-10-10 05:05:00", "m")).toEqual("5");
  });

  it("can render the two digit minutes", () => {
    expect(formatDate("2022-10-10 07:07:00", "mm")).toEqual("07");
  });

  it("can render the single digit seconds", () => {
    expect(formatDate("2022-10-10 07:07:01", "s")).toEqual("1");
  });

  it("can render the double digit seconds", () => {
    expect(formatDate("2022-10-10 07:07:10", "ss")).toEqual("10");
  });

  it("can render the double digit seconds", () => {
    expect(formatDate("2022-10-10 07:07:05", "ss")).toEqual("05");
  });

  it("can render am", () => {
    expect(formatDate("2022-10-10 07:07:05", "a")).toEqual("am");
  });

  it("can render pm", () => {
    expect(formatDate("2022-10-10 17:07:05", "a")).toEqual("pm");
  });

  it("can render milliseconds", () => {
    expect(formatDate("2022-10-10 17:07:05.567", "SSS")).toEqual("567");
  });

  it("can format a standard US style date", () => {
    expect(formatDate("1986-03-17T06:44:15", "MM/DD/YYYY")).toBe("03/17/1986");
  });

  it("can render us time with am/pm", () => {
    expect(formatDate("2020-03-15T05:30:10", "h:mm:ss a")).toBe("5:30:10 am");
  });

  it("can render us time with AM/PM", () => {
    expect(formatDate("2020-03-15T05:30:10", "h:mm:ss A")).toBe("5:30:10 AM");
  });

  it("can render us time with am/pm in chinese", () => {
    expect(formatDate("2020-03-15T05:30:10", "h:mm:ss A", { locale: "zh" })).toBe("5:30:10 上午");
    expect(formatDate("2020-03-15T15:30:10", "h:mm:ss A", { locale: "zh" })).toBe("3:30:10 下午");
  });

  it("can render a long date and short time", () => {
    expect(formatDate("2100-05-03T04:04:01", { date: "full", time: "short" })).toBe(
      "Monday, May 3, 2100 at 4:04 AM",
    );
  });

  it("can render a long date and short time in Japanese", () => {
    expect(
      formatDate("2100-05-03T04:04:01", { date: "full", time: "short" }, { locale: "ja" }),
    ).toBe("2100年5月3日月曜日 4:04");
  });

  it("can render a long time in Japanese", () => {
    expect(
      formatDate(
        "2010-06-09T04:32:00Z",
        { time: "full" },
        { locale: "ja", timezone: "America/New_York" },
      ),
    ).toBe("0時32分00秒 -04:00");
  });

  it("can format the russian month of february", () => {
    expect(formatDate("2023-03-14", { date: "medium" }, { locale: "ru" })).toBe("14 мар. 2023 г.");
  });

  it("can include the timezone of a date", () => {
    expect(formatDate("2023-05-05T05:30:10Z", "HH:mm:ss Z", { locale: "en" })).toBe(
      "05:30:10 +00:00",
    );
    expect(formatDate("2023-05-05T05:30:10Z", "HH:mm:ss ZZ", { locale: "en" })).toBe(
      "05:30:10 +0000",
    );
  });

  it("uses offsets in full date formatting", () => {
    expect(
      formatDate(
        "2023-05-05T05:30:10Z",
        { date: "full", time: "full" },
        { locale: "en", timezone: "America/New_York" },
      ),
    ).toBe("Friday, May 5, 2023 at 1:30:10 AM -04:00");
  });

  it("can format with some escapes and characters", () => {
    expect(
      formatDate("2040-12-17T05:00:00.000Z", "YeSS, C[h]eckin[: MMM D, YYYY", { locale: "en" }),
    ).toBe("YeSS, Checkin[: Dec 17, 2040");
  });
});

describe("format with a timezone", () => {
  it("can format a date with a timezone", () => {
    expect(formatDate("2023-05-07T05:30:10", "D HH:mm:ss", { timezone: "Europe/Amsterdam" })).toBe(
      "7 07:30:10",
    );
  });

  it("can format a date with a timezone", () => {
    expect(
      formatDate(fromZonedTime("2022-10-29T11:30:50Z", "America/Los_Angeles"), "D HH:mm:ss", {
        timezone: "Asia/Tokyo",
      }),
    ).toBe("30 03:30:50");
  });

  it("uses the proper offset when using tz with the Z token (#14)", () => {
    expect(formatDate("2022-10-29T11:30:50Z", "Z", { timezone: "Asia/Kolkata" })).toBe("+05:30");

    expect(formatDate("2022-10-29T11:30:50Z", "ZZ", { timezone: "Asia/Kolkata" })).toBe("+0530");

    expect(formatDate("2023-02-20T10:15:00", "D hh:mm a Z", { timezone: "America/New_York" })).toBe(
      "20 05:15 am -05:00",
    );

    expect(
      formatDate("2023-02-20T10:15:00", "D hh:mm a ZZ", { timezone: "America/New_York" }),
    ).toBe("20 05:15 am -0500");

    expect(
      formatDate(new Date("2024-02-16T11:00:00Z"), "YYYY-MM-DDTHH:mm:ssZ", {
        timezone: "Europe/Stockholm",
      }),
    ).toBe("2024-02-16T12:00:00+01:00");

    expect(
      formatDate(new Date("2024-02-16T11:00:00Z"), "YYYY-MM-DDTHH:mm:ssZZ", {
        timezone: "Europe/Stockholm",
      }),
    ).toBe("2024-02-16T12:00:00+0100");
  });

  it("can format times during device DST gaps", () => {
    expect(formatDate(new Date("2024-03-10T02:30:00Z"), "HH:mm:ssZ", { timezone: "UTC" })).toBe(
      "02:30:00+00:00",
    );

    expect(formatDate(new Date("2024-03-10T02:30:00Z"), "HH:mm:ssZZ", { timezone: "UTC" })).toBe(
      "02:30:00+0000",
    );
  });

  it("can render a double character zero with leading zeros in zh (#41)", () => {
    expect(formatDate("2022-04-10", "YYYY-MM", { locale: "zh" })).toBe("2022-04");
  });

  it('can render "long" time format as the ZZ token', () => {
    expect(
      formatDate(
        "1989-12-19T07:30:10.000Z",
        { date: "short", time: "long" },
        {
          locale: "en",
          timezone: "America/Chicago",
        },
      ),
    ).toBe("12/19/89, 1:30:10 AM -0600");
  });
});
