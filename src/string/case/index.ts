/**
 * 将字符串的首字母转换为小写，其余保持不变。
 *
 * @param str - 要处理的字符串
 * @returns 首字母小写后的字符串；传入空字符串时返回空字符串
 */
export function lowerFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * 将字符串的首字母转换为大写，其余保持不变。
 *
 * @param str - 要处理的字符串
 * @returns 首字母大写后的字符串；传入空字符串时返回空字符串
 */
export function upperFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 将字符串的首字母转换为大写，其余字符转换为小写。
 *
 * 只处理第一个字符，不会识别单词边界；需要按单词转换请使用 `startCase` 或 `pascalCase`。
 *
 * @param str - 要处理的字符串
 * @returns 首字母大写后的字符串；传入空字符串时返回空字符串
 */
export function capitalize(str: string): string {
  return upperFirst(str.toLowerCase());
}

const CASE_SPLIT_PATTERN: RegExp =
  /\p{Lu}?\p{Ll}+|[0-9]+|\p{Lu}+(?!\p{Ll})|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{L}+/gu;

/**
 * 将字符串拆分为单词数组，可处理驼峰、帕斯卡、蛇形、短横线等各种命名风格。
 *
 * @param str - 要拆分的字符串
 * @returns 拆分后的单词数组；没有任何匹配时返回空数组
 */
export function words(str: string): string[] {
  return [...(str.match(CASE_SPLIT_PATTERN) ?? [])];
}

/**
 * 将字符串转换为小写、空格分隔的格式（lower case）。
 *
 * @param str - 要转换的字符串
 * @returns 小写、空格分隔的字符串；没有任何可拆分的单词时返回空字符串
 */
export function lowerCase(str: string): string {
  return words(str)
    .map((word) => word.toLowerCase())
    .join(" ");
}

/**
 * 将字符串转换为大写命名格式(UPPER CASE)：每个单词全部大写，以空格连接。
 *
 * @param str - 需要转换的字符串
 * @returns 大写、空格分隔的字符串；没有任何可拆分的单词时返回空字符串
 */
export function upperCase(str: string): string {
  return words(str).join(" ").toUpperCase();
}

/**
 * 将字符串转换为首字母大写格式(Start Case)：每个单词首字母大写，其余小写，以空格连接。
 *
 * 连续大写会被拆成独立单词并统一小写，例如 `"XMLHttpRequest"` 转为 `"Xml Http Request"`。
 *
 * @param str - 需要转换的字符串
 * @returns 每个单词首字母大写、空格分隔的字符串；没有任何可拆分的单词时返回空字符串
 */
export function startCase(str: string): string {
  return words(str)
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * 将字符串转换为驼峰命名(camelCase)格式
 *
 * @param str - 要转换的字符串
 * @returns 驼峰命名格式的字符串
 */
export function camelCase(str: string): string {
  const [first, ...rest] = words(str);

  if (first == undefined) {
    return "";
  }

  return `${first.toLowerCase()}${rest.map((word) => capitalize(word)).join("")}`;
}

/**
 * 将字符串转换为帕斯卡命名(PascalCase)格式
 *
 * @param str - 要转换的字符串
 * @returns 帕斯卡命名格式的字符串
 */
export function pascalCase(str: string): string {
  return words(str)
    .map((word) => capitalize(word))
    .join("");
}

/**
 * 将字符串转换为短横线(kebab-case)格式
 *
 * @param str - 需要转换的字符串
 * @returns 短横线格式的字符串
 */
export function kebabCase(str: string): string {
  return words(str)
    .map((word) => word.toLowerCase())
    .join("-");
}

/**
 * 将字符串转换为蛇形命名(snake_case)格式
 *
 * @param str - 需要转换的字符串
 * @returns 蛇形命名格式的字符串
 */
export function snakeCase(str: string): string {
  return words(str)
    .map((word) => word.toLowerCase())
    .join("_");
}

/**
 * 将字符串转换为句子格式(Sentence case)：首个单词首字母大写，其余单词全部小写，以空格连接。
 *
 * @param str - 需要转换的字符串
 * @returns 句子格式的字符串
 */
export function sentenceCase(str: string): string {
  const [first, ...rest] = words(str);

  if (first == undefined) {
    return "";
  }

  return [capitalize(first), ...rest.map((word) => word.toLowerCase())].join(" ");
}
