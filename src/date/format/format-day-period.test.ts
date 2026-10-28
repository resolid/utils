import { describe, it, expect, beforeEach } from "vitest";
import { dayPeriodCache } from "../core/utils";
import { formatDayPeriod } from "./format-day-period";

describe("formatDayPeriod", () => {
  beforeEach(() => {
    dayPeriodCache.clear();
  });

  describe("en-US locale", () => {
    it("returns AM for am", () => {
      expect(formatDayPeriod("am", "en-US")).toBe("AM");
    });

    it("returns PM for pm", () => {
      expect(formatDayPeriod("pm", "en-US")).toBe("PM");
    });
  });

  describe("zh-CN locale", () => {
    it("returns 上午 for am", () => {
      expect(formatDayPeriod("am", "zh-CN")).toBe("上午");
    });

    it("returns 下午 for pm", () => {
      expect(formatDayPeriod("pm", "zh-CN")).toBe("下午");
    });
  });

  describe("caching", () => {
    it("caches result after first call", () => {
      formatDayPeriod("am", "en-US");
      expect(dayPeriodCache.get("en-US")?.am).toBe("AM");
    });

    it("caches am and pm independently", () => {
      formatDayPeriod("am", "en-US");
      formatDayPeriod("pm", "en-US");
      expect(dayPeriodCache.get("en-US")).toEqual({ am: "AM", pm: "PM" });
    });

    it("caches different locales separately", () => {
      formatDayPeriod("am", "en-US");
      formatDayPeriod("am", "zh-CN");
      expect(dayPeriodCache.get("en-US")?.am).toBe("AM");
      expect(dayPeriodCache.get("zh-CN")?.am).toBe("上午");
    });
  });
});
