import { hexToBytes } from "@noble/hashes/utils.js";
import { type NumberTypedArray, toUint8Array, type TypedArray } from "../bytes";

export function hexEncode(data: string | ArrayBuffer | NumberTypedArray): string {
  const buffer = toUint8Array(data);

  if (buffer.byteLength === 0) {
    return "";
  }

  let result = "";

  for (const byte of buffer) {
    result += byte.toString(16).padStart(2, "0");
  }

  return result;
}

export function hexDecode(data: string | ArrayBuffer | TypedArray): string {
  if (!data) {
    return "";
  }
  if (typeof data === "string") {
    return new TextDecoder().decode(hexToBytes(data));
  }
  return new TextDecoder().decode(data);
}
