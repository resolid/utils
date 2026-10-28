import { describe, expect, it } from "vitest";
import { toUint8Array } from "./index";

describe("encoding bytes", () => {
  describe("toUint8Array", () => {
    it("encodes ASCII strings as UTF-8", () => {
      expect([...toUint8Array("Hello")]).toEqual([72, 101, 108, 108, 111]);
    });

    it("encodes multi-byte characters as UTF-8", () => {
      expect([...toUint8Array("你好")]).toEqual([0xe4, 0xbd, 0xa0, 0xe5, 0xa5, 0xbd]);
      expect([...toUint8Array("😀")]).toEqual([0xf0, 0x9f, 0x98, 0x80]);
    });

    it("returns an empty array for an empty string", () => {
      expect(toUint8Array("")).toHaveLength(0);
    });

    it("returns a view over the given ArrayBuffer", () => {
      const { buffer } = new Uint8Array([1, 2, 3]);
      const result = toUint8Array(buffer);

      expect([...result]).toEqual([1, 2, 3]);
      expect(result.buffer).toBe(buffer);
    });

    it("copies Uint8Array input instead of sharing its buffer", () => {
      const input = new Uint8Array([1, 2, 3]);
      const result = toUint8Array(input);

      expect(result).not.toBe(input);
      expect(result.buffer).not.toBe(input.buffer);

      result[0] = 9;

      expect([...input]).toEqual([1, 2, 3]);
    });

    it("only copies the visible part of a Uint8Array view", () => {
      const input = new Uint8Array([1, 2, 3, 4]).subarray(1, 3);

      expect([...toUint8Array(input)]).toEqual([2, 3]);
    });

    it("accepts clamped typed arrays", () => {
      const input = new Uint8ClampedArray([0, 255]);

      expect([...toUint8Array(input)]).toEqual([0, 255]);
    });

    it("reinterprets multi-byte typed arrays as their underlying bytes", () => {
      const input = new Uint16Array([256, 1]);

      expect([...toUint8Array(input)]).toEqual([0, 1, 1, 0]);
      expect([...toUint8Array(new Int16Array([-1]))]).toEqual([255, 255]);
      expect(toUint8Array(input)).toHaveLength(input.byteLength);
    });

    it("expands each float element into eight bytes", () => {
      const input = new Float64Array([1.5]);
      const result = toUint8Array(input);

      expect(result).toHaveLength(8);
      expect([...result]).toEqual([0, 0, 0, 0, 0, 0, 0xf8, 0x3f]);
    });

    it("only converts the visible part of a multi-byte view", () => {
      const input = new Uint16Array([1, 2, 3, 4]).subarray(1, 3);

      expect([...toUint8Array(input)]).toEqual([2, 0, 3, 0]);
    });

    it("copies multi-byte typed arrays instead of sharing their buffer", () => {
      const input = new Uint16Array([1, 2]);
      const result = toUint8Array(input);

      expect(result.buffer).not.toBe(input.buffer);

      result[0] = 9;

      expect(input[0]).toBe(1);
    });

    it("rejects BigInt typed arrays", () => {
      // @ts-expect-error BigInt typed arrays do not contain number elements.
      expect(() => toUint8Array(new BigUint64Array([1n]))).toThrow(TypeError);
    });
  });
});
