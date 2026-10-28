import { describe, expect, it } from "vitest";
import { addMonths, subMonths } from "./add-months";

describe("addMonths", () => {
  describe("basic addition", () => {
    it("adds 1 month by default", () => {
      expect(addMonths("2024-01-15T00:00:00Z", 1).toISOString()).toBe("2024-02-15T00:00:00.000Z");
    });

    it("adds multiple months", () => {
      expect(addMonths("2024-01-15T00:00:00Z", 3).toISOString()).toBe("2024-04-15T00:00:00.000Z");
    });

    it("rolls over to the next year", () => {
      expect(addMonths("2024-11-15T00:00:00Z", 2).toISOString()).toBe("2025-01-15T00:00:00.000Z");
    });

    it("adds 12 months to get the same date next year", () => {
      expect(addMonths("2024-06-15T00:00:00Z", 12).toISOString()).toBe("2025-06-15T00:00:00.000Z");
    });
  });

  describe("overflow = false (clamp to end of month)", () => {
    it("clamps Jan 31 to Feb 29 in a leap year", () => {
      expect(addMonths("2024-01-31T00:00:00Z", 1).toISOString()).toBe("2024-02-29T00:00:00.000Z");
    });

    it("clamps Jan 31 to Feb 28 in a non-leap year", () => {
      expect(addMonths("2023-01-31T00:00:00Z", 1).toISOString()).toBe("2023-02-28T00:00:00.000Z");
    });

    it("clamps Jan 31 to Apr 30", () => {
      expect(addMonths("2024-01-31T00:00:00Z", 3).toISOString()).toBe("2024-04-30T00:00:00.000Z");
    });
  });

  describe("overflow = true (allow date overflow)", () => {
    it("overflows Jan 31 + 1 month to Mar 2 in a leap year", () => {
      expect(addMonths("2024-01-31T00:00:00Z", 1, true).toISOString()).toBe(
        "2024-03-02T00:00:00.000Z",
      );
    });

    it("overflows Jan 31 + 1 month to Mar 3 in a non-leap year", () => {
      expect(addMonths("2023-01-31T00:00:00Z", 1, true).toISOString()).toBe(
        "2023-03-03T00:00:00.000Z",
      );
    });
  });

  describe("negative count", () => {
    it("subtracts months when count is negative", () => {
      expect(subMonths("2024-03-15T00:00:00Z", 1).toISOString()).toBe("2024-02-15T00:00:00.000Z");
    });

    it("rolls back to the previous year", () => {
      expect(subMonths("2024-01-15T00:00:00Z", 1).toISOString()).toBe("2023-12-15T00:00:00.000Z");
    });

    it("clamps Mar 31 to Feb 28 when subtracting 1 month", () => {
      expect(subMonths("2024-03-31T00:00:00Z", 1).toISOString()).toBe("2024-02-29T00:00:00.000Z");
    });
  });
});
