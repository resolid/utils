import { describe, expect, it } from "vitest";
import { hexDecode, hexEncode } from "./index";

describe("encoding hex", () => {
  describe("hexEncode", () => {
    it("encodes an ASCII string", () => {
      expect(hexEncode("Hello, World!")).toBe("48656c6c6f2c20576f726c6421");
    });

    it("encodes multi-byte UTF-8 strings", () => {
      expect(hexEncode("你好")).toBe("e4bda0e5a5bd");
      expect(hexEncode("😀")).toBe("f09f9880");
    });

    it("encodes an ArrayBuffer", () => {
      const input = new TextEncoder().encode("Hello").buffer;

      expect(hexEncode(input)).toBe("48656c6c6f");
    });

    it("encodes a Uint8Array", () => {
      expect(hexEncode(new Uint8Array([72, 101, 108, 108, 111]))).toBe("48656c6c6f");
    });

    it("only encodes the visible part of a Uint8Array view", () => {
      expect(hexEncode(new Uint8Array([1, 72, 105, 2]).subarray(1, 3))).toBe("4869");
    });

    it("returns an empty string for empty input", () => {
      expect(hexEncode("")).toBe("");
      expect(hexEncode(new Uint8Array())).toBe("");
      expect(hexEncode(new ArrayBuffer(0))).toBe("");
    });

    it("pads single-digit bytes with a leading zero", () => {
      expect(hexEncode(new Uint8Array([0, 1, 15, 16, 255]))).toBe("00010f10ff");
    });

    it("encodes multi-byte typed arrays as their underlying bytes", () => {
      const input = new Uint16Array([0x0102, 0x0304]);

      expect(hexEncode(input)).toBe("02010403");
      expect(hexDecode(hexEncode(input))).toBe(hexDecode(input));
    });

    it("keeps every byte of a float array", () => {
      expect(hexEncode(new Float64Array([1.5]))).toBe("000000000000f83f");
    });

    it("uses lowercase hexadecimal", () => {
      expect(hexEncode(new Uint8Array([0xab, 0xcd, 0xef]))).toBe("abcdef");
    });
  });

  describe("hexDecode", () => {
    it("decodes a lowercase hexadecimal string", () => {
      expect(hexDecode("48656c6c6f2c20576f726c6421")).toBe("Hello, World!");
    });

    it("decodes uppercase and mixed-case hexadecimal", () => {
      expect(hexDecode("48656C6C6F")).toBe("Hello");
      expect(hexDecode("48656c6C6F")).toBe("Hello");
    });

    it("decodes multi-byte UTF-8 strings", () => {
      expect(hexDecode("e4bda0e5a5bd")).toBe("你好");
      expect(hexDecode("f09f9880")).toBe("😀");
    });

    it("returns an empty string for empty input", () => {
      expect(hexDecode("")).toBe("");
      expect(hexDecode(new Uint8Array())).toBe("");
      expect(hexDecode(new ArrayBuffer(0))).toBe("");
    });

    it("decodes NUL and control bytes", () => {
      expect(hexDecode("00")).toBe("\u0000");
      expect(hexDecode("0a")).toBe("\n");
    });

    it("decodes an ArrayBuffer", () => {
      expect(hexDecode(new TextEncoder().encode("Hi").buffer)).toBe("Hi");
    });

    it("decodes a Uint8Array", () => {
      expect(hexDecode(new Uint8Array([72, 105]))).toBe("Hi");
    });

    it("only decodes the visible part of a Uint8Array view", () => {
      expect(hexDecode(new Uint8Array([1, 72, 105, 2]).subarray(1, 3))).toBe("Hi");
    });

    it("throws for odd-length hexadecimal strings", () => {
      expect(() => hexDecode("123")).toThrow(Error);
    });

    it("throws for non-hexadecimal strings", () => {
      expect(() => hexDecode("zzzz")).toThrow(Error);
      expect(() => hexDecode("0x12")).toThrow(Error);
    });
  });

  describe("round-trip", () => {
    it("returns the original string after encoding and decoding", () => {
      expect(hexDecode(hexEncode("Hello, Hex!"))).toBe("Hello, Hex!");
    });

    it("round-trips multi-byte strings", () => {
      const input = "你好，世界 😀";

      expect(hexDecode(hexEncode(input))).toBe(input);
    });

    it("round-trips an empty string", () => {
      expect(hexDecode(hexEncode(""))).toBe("");
    });

    it("round-trips encoded bytes", () => {
      const bytes = new TextEncoder().encode("Hi");

      expect(hexDecode(hexEncode(bytes))).toBe("Hi");
    });
  });
});
