import { describe, expect, it } from "vitest";
import { applyOffset } from "./apply-offset";

describe("applyOffset", () => {
  it("can apply a negative offset to a date", () => {
    expect(applyOffset("2023-02-22T00:00:00Z", "-05:00").toISOString()).toBe(
      "2023-02-21T19:00:00.000Z",
    );

    expect(applyOffset("2023-02-22T00:00:00Z", "-0500").toISOString()).toBe(
      "2023-02-21T19:00:00.000Z",
    );
  });

  it("can apply a positive offset to a date", () => {
    expect(applyOffset("2023-04-13T10:15:00", "+02:00").toISOString()).toBe(
      "2023-04-13T12:15:00.000Z",
    );

    expect(applyOffset("2023-04-13T10:15:00", "+0200").toISOString()).toBe(
      "2023-04-13T12:15:00.000Z",
    );
  });
});
