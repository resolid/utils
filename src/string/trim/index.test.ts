import { describe, expect, it } from "vitest";
import { trim, trimEnd, trimStart } from "./index";

describe("string trim", () => {
  describe("trimStart", () => {
    it("trims whitespace when chars is omitted", () => {
      expect(trimStart("  abc  ")).toBe("abc  ");
      expect(trimStart("\t\nabc")).toBe("abc");
    });

    it("removes a single leading character", () => {
      expect(trimStart("--foo--", "-")).toBe("foo--");
    });

    it("removes any of the given characters", () => {
      expect(trimStart("_-_foo", ["-", "_"])).toBe("foo");
    });

    it("returns the original string when nothing matches", () => {
      expect(trimStart("foo", "-")).toBe("foo");
      expect(trimStart("foo", [])).toBe("foo");
    });

    it("removes all characters when the string is entirely trimmable", () => {
      expect(trimStart("---", "-")).toBe("");
    });

    it("throws when chars is a multi-character string", () => {
      expect(() => trimStart("foo", "--")).toThrow(
        "The 'chars' parameter should be a single character string.",
      );
    });

    it("throws when chars is an empty string", () => {
      expect(() => trimStart("foo", "")).toThrow(
        "The 'chars' parameter should be a single character string.",
      );
    });
  });

  describe("trimEnd", () => {
    it("trims whitespace when chars is omitted", () => {
      expect(trimEnd("  abc  ")).toBe("  abc");
      expect(trimEnd("abc\t\n")).toBe("abc");
    });

    it("removes a single trailing character", () => {
      expect(trimEnd("--foo--", "-")).toBe("--foo");
    });

    it("removes any of the given characters", () => {
      expect(trimEnd("foo-_-", ["-", "_"])).toBe("foo");
    });

    it("returns the original string when nothing matches", () => {
      expect(trimEnd("foo", "-")).toBe("foo");
      expect(trimEnd("foo", [])).toBe("foo");
    });

    it("removes all characters when the string is entirely trimmable", () => {
      expect(trimEnd("---", "-")).toBe("");
    });

    it("throws when chars is a multi-character string", () => {
      expect(() => trimEnd("foo", "--")).toThrow(
        "The 'chars' parameter should be a single character string.",
      );
    });
  });

  describe("trim", () => {
    it("trims whitespace when chars is omitted", () => {
      expect(trim("  abc  ")).toBe("abc");
    });

    it("removes the given character from both ends", () => {
      expect(trim("--foo--", "-")).toBe("foo");
      expect(trim("xxfooxx", "x")).toBe("foo");
    });

    it("removes any of the given characters", () => {
      expect(trim("_-foo-_", ["-", "_"])).toBe("foo");
    });

    it("returns the original string when nothing matches", () => {
      expect(trim("foo", "-")).toBe("foo");
      expect(trim("foo", [])).toBe("foo");
    });

    it("removes all characters when the string is entirely trimmable", () => {
      expect(trim("---", "-")).toBe("");
    });

    it("throws when chars is a multi-character string", () => {
      expect(() => trim("foo", "--")).toThrow(
        "The 'chars' parameter should be a single character string.",
      );
    });
  });
});
