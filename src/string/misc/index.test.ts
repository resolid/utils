import { describe, expect, it } from "vitest";
import { padCenter, randomString, reverseString } from "./index";

describe("string misc", () => {
  describe("padCenter", () => {
    it("pads both sides with spaces by default", () => {
      expect(padCenter("ab", 6)).toBe("  ab  ");
      expect(padCenter("", 4)).toBe("    ");
    });

    it("puts the extra character on the right for odd padding", () => {
      expect(padCenter("ab", 5)).toBe(" ab  ");
    });

    it("returns the original string when length is not greater", () => {
      expect(padCenter("ab", 2)).toBe("ab");
      expect(padCenter("ab", 1)).toBe("ab");
      expect(padCenter("", 0)).toBe("");
    });

    it("supports a custom padding character", () => {
      expect(padCenter("ab", 6, "*")).toBe("**ab**");
    });

    it("supports multi-character padding patterns", () => {
      expect(padCenter("ab", 7, "-=")).toBe("-=ab-=-");
    });
  });

  describe("reverseString", () => {
    it("reverses ASCII strings", () => {
      expect(reverseString("abc")).toBe("cba");
      expect(reverseString("hello")).toBe("olleh");
    });

    it("reverses empty and single-character strings", () => {
      expect(reverseString("")).toBe("");
      expect(reverseString("a")).toBe("a");
    });

    it("keeps surrogate pairs intact", () => {
      expect(reverseString("a👍b")).toBe("b👍a");
    });

    it("reverses by code point, not by grapheme cluster", () => {
      expect(reverseString("e\u0301")).toBe("\u0301e");
    });
  });

  describe("randomString", () => {
    it("generates a string with the default length of 16", () => {
      expect(randomString()).toHaveLength(16);
    });

    it("generates a string with a custom length", () => {
      expect(randomString(8)).toHaveLength(8);
      expect(randomString(0)).toBe("");
    });

    it("only uses alphanumeric characters", () => {
      expect(randomString(64)).toMatch(/^[A-Za-z0-9]+$/);
    });

    it("generates different values on each call", () => {
      expect(randomString(32)).not.toBe(randomString(32));
    });
  });
});
