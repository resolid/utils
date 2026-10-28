import { describe, expect, it } from "vitest";
import { deviceLocale, deviceTimezone } from "./index";

describe("deviceLocale", () => {
  it("returns a non-empty string", () => {
    const locale = deviceLocale();

    expect(typeof locale).toBe("string");
    expect(locale.length).toBeGreaterThan(0);
  });

  it("returns a stable value across calls", () => {
    expect(deviceLocale()).toBe(deviceLocale());
  });
});

describe("deviceTimezone", () => {
  it("returns the timezone configured for the test run", () => {
    // vitest.config.ts sets TZ=UTC
    expect(deviceTimezone()).toBe("UTC");
  });

  it("returns a non-empty string", () => {
    const timezone = deviceTimezone();

    expect(typeof timezone).toBe("string");
    expect(timezone?.length).toBeGreaterThan(0);
  });
});
