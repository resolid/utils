import { writeFile } from "node:fs/promises";

const locales = [
  "ar",
  "az",
  "zh",
  "hr",
  "cs",
  "da",
  "nl",
  "fi",
  "fr",
  "de",
  "he",
  "hu",
  "id",
  "it",
  "kk",
  "ko",
  "nb",
  "pl",
  "ro",
  "ru",
  "sk",
  "sl",
  "sr",
  "es",
  "sv",
  "tg",
  "th",
  "uk",
  "uz",
  "tr",
  "vi",
];

const result = {};

await Promise.all(
  locales.map(async (locale) => {
    console.log(`fetching ${locale}...`);

    const res = await fetch(`https://unpkg.com/cldr-dates-full/main/${locale}/ca-gregorian.json`);
    const data = await res.json();
    const cal = data.main[locale].dates.calendars.gregorian;

    result[locale] = {
      month: {
        long: {
          standalone: Object.values(cal.months["stand-alone"].wide),
          format: Object.values(cal.months.format.wide),
        },
        short: {
          standalone: Object.values(cal.months["stand-alone"].abbreviated),
          format: Object.values(cal.months.format.abbreviated),
        },
      },
      weekday: {
        long: Object.values(cal.days["stand-alone"].wide),
        short: Object.values(cal.days["stand-alone"].abbreviated),
        narrow: Object.values(cal.days["stand-alone"].narrow),
      },
    };
  }),
);

await writeFile("data/locale-data.json", JSON.stringify(result, null, 2), "utf-8");

console.log("done");
