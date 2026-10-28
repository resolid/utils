import { customAlphabet } from "nanoid";

/**
 * 将字符串居中填充到指定长度，两侧使用相同的填充字符。
 * 总填充数为奇数时，右侧比左侧多一个字符。
 *
 * @param str - 要填充的字符串
 * @param length - 目标总长度，小于等于 str.length 时返回原字符串
 * @param chars - 填充字符，默认为空格；可以是多字符串，会循环截取
 * @returns 居中填充后的字符串
 */
export function padCenter(str: string, length: number, chars = " "): string {
  const left = Math.floor((length - str.length) / 2);

  return str.padStart(str.length + left, chars).padEnd(length, chars);
}

/**
 * 反转字符串。
 *
 * 按 Unicode 码点反转，因此代理对（如 emoji）不会被拆坏；
 * 但组合字符和 ZWJ 序列（如 `"👨‍👩‍👧‍👦"`、带变音符号的字母）不保证保持完整字形。
 *
 * @param value - 要反转的字符串
 * @returns 反转后的字符串
 */
export function reverseString(value: string): string {
  // oxlint-disable-next-line typescript/no-misused-spread
  return [...value].reverse().join("");
}

/**
 * 生成指定长度的随机字符串
 * 使用数字、大小写字母作为字符集
 *
 * @param size - 生成字符串的长度，默认为 16
 * @returns 随机生成的字符串
 */
export function randomString(size = 16): string {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    size,
  );

  return nanoid();
}
