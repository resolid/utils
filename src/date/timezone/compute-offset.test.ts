import { describe, expect, it } from "vitest";
import { computeOffset } from "./compute-offset";

describe("computeOffset", () => {
  it("can determine the offset of a winter month to UTC", () => {
    expect(computeOffset("2023-02-22", "UTC", "America/New_York")).toBe("-05:00");
  });

  it("changes the offset after daylight savings", () => {
    expect(computeOffset("2023-03-12T06:59:00Z", "UTC", "America/New_York")).toBe("-05:00");
    expect(computeOffset("2023-03-12T07:00:00Z", "UTC", "America/New_York")).toBe("-04:00");
  });

  it("can determine the offset to another base timezone", () => {
    expect(computeOffset("2023-02-22", "Europe/Amsterdam")).toBe("-01:00");
  });

  it("can determine the offset to another base timezone with daylight savings", () => {
    expect(computeOffset("2023-03-26T00:59Z", "Europe/Amsterdam")).toBe("-01:00");
    expect(computeOffset("2023-03-26T01:00Z", "Europe/Amsterdam")).toBe("-02:00");
  });

  it("can determine the offset between two arbitrary timezones", () => {
    expect(computeOffset("2023-02-22", "Europe/Moscow", "America/Los_Angeles")).toBe("-11:00");
    expect(computeOffset("2023-02-22", "America/Los_Angeles", "Europe/Moscow")).toBe("+11:00");
    expect(computeOffset("2023-02-22", "Europe/Moscow", "America/Los_Angeles", "ZZ")).toBe("-1100");
    expect(computeOffset("2023-02-22", "America/Los_Angeles", "Europe/Moscow", "ZZ")).toBe("+1100");
  });

  it("can determine the offset to a non full-hour offset timezone", () => {
    expect(computeOffset("2023-02-22", "Europe/London", "Pacific/Chatham")).toBe("+13:45");
    expect(computeOffset("2023-02-22", "Europe/London", "Pacific/Chatham", "ZZ")).toBe("+1345");
  });
});
