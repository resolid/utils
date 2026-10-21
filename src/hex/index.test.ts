import { describe, it, expect } from "vitest";
import { hexEncode, hexDecode } from "./index";

describe("hex", () => {
  describe("encode", () => {
    it("should encode a string to hexadecimal", () => {
      const input = "Hello, World!";
      expect(hexEncode(input)).toBe(Buffer.from(input).toString("hex"));
    });

    it("should encode an ArrayBuffer to hexadecimal", () => {
      const input = new TextEncoder().encode("Hello").buffer;
      expect(hexEncode(input)).toBe(Buffer.from(input).toString("hex"));
    });

    it("should encode a TypedArray to hexadecimal", () => {
      const input = new Uint8Array([72, 101, 108, 108, 111]);
      expect(hexEncode(input)).toBe(Buffer.from(input).toString("hex"));
    });
  });

  describe("decode", () => {
    it("should decode a hexadecimal string to its original value", () => {
      const expected = "Hello, World!";
      expect(hexDecode(Buffer.from(expected).toString("hex"))).toBe(expected);
    });

    it("should handle decoding of a hexadecimal string to binary data", () => {
      const expected = "Hello";
      expect(hexDecode(Buffer.from(expected).toString("hex"))).toBe(expected);
    });

    it("should decode uppercase hexadecimal", () => {
      expect(hexDecode("48656C6C6F")).toBe("Hello");
    });

    it("should throw an error for an odd-length string", () => {
      const input = "123";
      expect(() => hexDecode(input)).toThrow(Error);
    });

    it("should throw an error for a non-hexadecimal string", () => {
      const input = "zzzz";
      expect(() => hexDecode(input)).toThrow(Error);
    });
  });

  describe("round-trip tests", () => {
    it("should return the original string after encoding and decoding", () => {
      const input = "Hello, Hex!";
      const encoded = hexEncode(input);
      const decoded = hexDecode(encoded);
      expect(decoded).toBe(input);
    });

    it("should handle empty strings", () => {
      const input = "";
      const encoded = hexEncode(input);
      const decoded = hexDecode(encoded);
      expect(decoded).toBe(input);
    });
  });
});
