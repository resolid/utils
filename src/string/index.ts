import { customAlphabet } from "nanoid";

/**
 * 将字符串的首字母转换为大写，其余保持不变。
 *
 * @param str - 要处理的字符串
 * @returns 首字母大写后的字符串，如果传入空字符串或 falsy 值，返回空字符串
 */
export function capitalize(str: string): string {
  if (!str || str.length === 0) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

// oxlint-disable-next-line prefer-named-capture-group
const CAMEL_CASE_REGEX = /[-_\s]+(.)?/g;

/**
 * 将字符串转换为驼峰命名(camelCase)格式
 *
 * @param str - 需要转换的字符串
 * @returns 驼峰命名格式的字符串
 */
export function camelCase(str: string): string {
  return str.trim().replace(CAMEL_CASE_REGEX, (_, c) => (c ? c.toUpperCase() : ""));
}

const PASCAL_CASE_REGEX = /[A-Z]?[a-z]+|[A-Z]+(?![a-z])|[0-9]+/g;

/**
 * 将字符串转换为帕斯卡命名(PascalCase)格式
 *
 * @param str - 需要转换的字符串
 * @returns 帕斯卡命名格式的字符串
 */
export function pascalCase(str: string): string {
  return (str.match(PASCAL_CASE_REGEX) ?? [])
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}`)
    .join("");
}

const KEBAB_CASE_REGEX = /[A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g;

/**
 * 将字符串转换为短横线(kebab-case)格式
 *
 * @param str - 需要转换的字符串
 * @returns 短横线格式的字符串
 */
export function kebabCase(str: string): string {
  return (str.match(KEBAB_CASE_REGEX) ?? []).join("-").toLowerCase();
}

/**
 * 将字符串转换为蛇形命名(snake_case)格式
 *
 * @param str - 需要转换的字符串
 * @returns 蛇形命名格式的字符串
 */
export function snakeCase(str: string): string {
  return (str.match(KEBAB_CASE_REGEX) ?? []).join("_").toLowerCase();
}

/**
 * 判断字符串是否以指定前缀开头，可选择忽略大小写。
 *
 * @param text - 要检查的字符串
 * @param prefix - 前缀字符串
 * @param ignoreCase - 是否忽略大小写，默认 true
 * @returns 如果 text 以 prefix 开头，则返回 true，否则返回 false
 */
export function startsWith(text: string, prefix: string, ignoreCase = true): boolean {
  if (text.length < prefix.length) {
    return false;
  }

  if (ignoreCase) {
    return text.toLowerCase().startsWith(prefix.toLowerCase());
  }

  return text.startsWith(prefix);
}

/**
 * 判断字符串是否以指定后缀结尾，可选择忽略大小写。
 *
 * @param text - 要检查的字符串
 * @param suffix - 后缀字符串
 * @param ignoreCase - 是否忽略大小写，默认 true
 * @returns 如果 text 以 suffix 结尾，则返回 true，否则返回 false
 */
export function endsWith(text: string, suffix: string, ignoreCase = true): boolean {
  if (text.length < suffix.length) {
    return false;
  }

  if (ignoreCase) {
    return text.toLowerCase().endsWith(suffix.toLowerCase());
  }

  return text.endsWith(suffix);
}

/**
 * 如果字符串以指定前缀开头，则去掉该前缀。
 *
 * @param text - 要处理的字符串
 * @param prefix - 要移除的前缀
 * @param ignoreCase - 是否忽略大小写，默认 true
 * @returns 去掉前缀后的字符串，如果 text 不以 prefix 开头，则返回原字符串
 */
export function trimStart(text: string, prefix: string, ignoreCase = true): string {
  if (startsWith(text, prefix, ignoreCase)) {
    return text.slice(prefix.length, text.length);
  }

  return text;
}

/**
 * 如果字符串以指定后缀结尾，则去掉该后缀。
 *
 * @param text - 要处理的字符串
 * @param suffix - 要移除的后缀
 * @param ignoreCase - 是否忽略大小写，默认 true
 * @returns 去掉后缀后的字符串，如果 text 不以 suffix 结尾，则返回原字符串
 */
export function trimEnd(text: string, suffix: string, ignoreCase = true): string {
  if (endsWith(text, suffix, ignoreCase)) {
    return text.slice(0, text.length - suffix.length);
  }

  return text;
}

/**
 * 生成指定长度的随机字符串
 * 使用数字、大小写字母作为字符集
 *
 * @param size - 生成字符串的长度，默认为 16
 * @returns 随机生成的字符串
 */
export function random(size = 16): string {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    size,
  );

  return nanoid();
}
