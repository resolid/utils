import { describe, expect, it } from "vitest";
import { diffInMinutes } from "./diff-in-minutes";

describe("diffInMinutes", () => {
  it("difference is 18 minutes", () => {
    expect(diffInMinutes("2024-04-07T09:28:30.050Z", "2024-04-07T09:10:00.000Z")).toBe(18);
  });

  it("difference is 19 minutes by using ceil", () => {
    expect(diffInMinutes("2024-04-07T09:28:01.050Z", "2024-04-07T09:10:00.000Z", "ceil")).toBe(19);
  });

  it("difference should be 23 minutes", () => {
    expect(diffInMinutes("2024-04-07T09:33:00.000Z", "2024-04-07T09:10:00.000Z")).toBe(23);
  });
});
