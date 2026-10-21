import { describe, expect, it } from "vitest";
import { toUint8Array } from "./index";

describe("bytes", () => {
  describe("toUint8Array", () => {
    it("accepts clamped typed arrays", () => {
      const input = new Uint8ClampedArray([0, 255]);

      expect([...toUint8Array(input)]).toEqual([0, 255]);
    });

    it("preserves element conversion for multi-byte typed arrays", () => {
      const input = new Uint16Array([256, 1]);

      expect([...toUint8Array(input)]).toEqual([0, 1]);
    });

    it("rejects BigInt typed arrays", () => {
      // @ts-expect-error BigInt typed arrays do not contain number elements.
      expect(() => toUint8Array(new BigUint64Array([1n]))).toThrow(TypeError);
    });
  });
});
