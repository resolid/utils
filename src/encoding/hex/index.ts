import { hexToBytes } from "@noble/hashes/utils.js";
import { type NumberTypedArray, toUint8Array, type TypedArray } from "../bytes";

/**
 * 将字符串、`ArrayBuffer` 或 TypedArray 编码为小写十六进制字符串。
 *
 * 每个字节固定输出两位十六进制字符，不足两位时补前导零。
 *
 * @param data - 待编码的字符串、`ArrayBuffer` 或元素为 number 的 TypedArray
 * @returns 小写十六进制字符串；空输入返回空字符串
 *
 * @see {@link hexDecode} 将十六进制数据解码为文本
 */
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

/**
 * 将十六进制字符串或字节数据解码为 UTF-8 字符串。
 *
 * - 字符串按十六进制解析，大小写均可。
 * - `ArrayBuffer` 和 TypedArray 直接按其字节内容解码。
 * - 无法解码的字节序列会被替换为 U+FFFD。
 *
 * @param data - 十六进制字符串、`ArrayBuffer` 或 TypedArray
 * @returns 解码后的字符串；空输入返回空字符串
 * @throws {Error} 字符串长度为奇数或包含非十六进制字符时抛出
 *
 * @see {@link hexEncode} 将文本编码为十六进制字符串
 */
export function hexDecode(data: string | ArrayBuffer | TypedArray): string {
  if (!data) {
    return "";
  }
  if (typeof data === "string") {
    return new TextDecoder().decode(hexToBytes(data));
  }
  return new TextDecoder().decode(data);
}
