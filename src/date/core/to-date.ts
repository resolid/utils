import type { MaybeDateInput } from "./types";

const ISO_DATE_RE: RegExp =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:[T ](?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-][01]\d:[0-5]\d)?)?$/;

/**
 * 将日期值转换为 Date 对象
 * - 不传参数时返回当前时间。
 * - 传入 Date 对象时返回其副本。
 * - 传入字符串时校验是否符合 ISO 8601 / ISO 9075 格式，合法则转换，否则抛出异常。
 *
 * @param input - 可选的日期输入，支持 Date 对象或 ISO 8601 / ISO 9075 字符串
 * @throws 当字符串不符合 ISO 8601 / ISO 9075 格式时抛出错误
 *
 * @return Date 对象
 */
export function toDate(input?: MaybeDateInput): Date {
  input ??= new Date();

  if (input instanceof Date) {
    return new Date(input);
  }

  input = input.trim();

  if (ISO_DATE_RE.test(input)) {
    return new Date(input.replace(" ", "T"));
  }

  throw new Error(`Non ISO 8601/9075 compliant date (${input}).`);
}
