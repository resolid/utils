const HTML_ESCAPES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * 转义字符串中的 HTML 特殊字符。
 *
 * @param str - 要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  return str.replaceAll(/[&<>"']/g, (match) => HTML_ESCAPES[match]!);
}

const HTML_UNESCAPES: Readonly<Record<string, string>> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

/**
 * 将 HTML 实体 `&amp;`、`&lt;`、`&gt;`、`&quot;`、`&#39;` 还原为对应字符。
 *
 * 同时兼容带前导零的 `&#039;`、`&#0039;` 等写法。
 *
 * @param str - 要反转义的字符串
 * @returns 反转义后的字符串
 */
export function unescapeHtml(str: string): string {
  return str.replaceAll(/&(?:amp|lt|gt|quot|#0*39);/g, (match) => HTML_UNESCAPES[match] ?? "'");
}

/**
 * 转义字符串中的正则特殊字符，使其可以安全地作为字面量嵌入 `RegExp`。
 *
 * @param str - 要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeRegExp(str: string): string {
  return str.replaceAll(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}
