/**
 * 去除字符串开头的指定字符，未指定 chars 时等同于原生 `trimStart`。
 *
 * @param str - 要处理的字符串
 * @param chars - 要去除的字符，可以是单个字符的字符串，或由单个字符组成的数组
 * @returns 去除开头指定字符后的字符串
 * @throws 当 chars 为字符串且长度不为 1 时抛出错误
 */
export function trimStart(str: string, chars?: string | string[]): string {
  if (chars === undefined) {
    return str.trimStart();
  }

  if (typeof chars === "string" && chars.length !== 1) {
    throw new Error("The 'chars' parameter should be a single character string.");
  }

  const list = typeof chars === "string" ? [chars] : chars;

  let start = 0;

  while (start < str.length && list.includes(str[start]!)) {
    start++;
  }

  return str.slice(start);
}

/**
 * 去除字符串末尾的指定字符，未指定 chars 时等同于原生 `trimEnd`。
 *
 * @param str - 要处理的字符串
 * @param chars - 要去除的字符，可以是单个字符的字符串，或由单个字符组成的数组
 * @returns 去除末尾指定字符后的字符串
 * @throws 当 chars 为字符串且长度不为 1 时抛出错误
 */
export function trimEnd(str: string, chars?: string | string[]): string {
  if (chars === undefined) {
    return str.trimEnd();
  }

  if (typeof chars === "string" && chars.length !== 1) {
    throw new Error("The 'chars' parameter should be a single character string.");
  }

  const list = typeof chars === "string" ? [chars] : chars;

  let end = str.length;

  while (end > 0 && list.includes(str[end - 1]!)) {
    end--;
  }

  return str.slice(0, end);
}

/**
 * 去除字符串两端的指定字符，未指定 chars 时等同于原生 `trim`。
 *
 * @param str - 要处理的字符串
 * @param chars - 要去除的字符，可以是单个字符的字符串，或由单个字符组成的数组
 * @returns 去除两端指定字符后的字符串
 * @throws 当 chars 为字符串且长度不为 1 时抛出错误
 */
export function trim(str: string, chars?: string | string[]): string {
  if (chars === undefined) {
    return str.trim();
  }

  return trimStart(trimEnd(str, chars), chars);
}
