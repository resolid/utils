import { describe, expect, it } from "vitest";
import { addMilliseconds, subMilliseconds } from "./add-milliseconds";

describe("addMilliseconds", () => {
  it("can increment by 1 millisecond", () => {
    expect(addMilliseconds("2022-01-01T00:00:00.000Z", 1).toISOString()).toBe(
      "2022-01-01T00:00:00.001Z",
    );
  });

  it("can increment by multiple milliseconds", () => {
    expect(addMilliseconds("2022-01-01T00:00:00.000Z", 500).toISOString()).toBe(
      "2022-01-01T00:00:00.500Z",
    );
  });

  it("can increment milliseconds that roll over to next second", () => {
    expect(addMilliseconds("2022-01-01T00:00:00.999Z", 1).toISOString()).toBe(
      "2022-01-01T00:00:01.000Z",
    );
  });

  it("decrements milliseconds within the same second", () => {
    expect(subMilliseconds("2022-01-01T00:00:01.000Z", 1).toISOString()).toBe(
      "2022-01-01T00:00:00.999Z",
    );
  });

  it("can handle large millisecond counts crossing multiple seconds", () => {
    expect(addMilliseconds("2022-01-01T00:00:00.000Z", 2500).toISOString()).toBe(
      "2022-01-01T00:00:02.500Z",
    );
  });
});
