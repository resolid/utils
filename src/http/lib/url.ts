import { isArray, isNull, isString, isUndefined } from "../../is";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryObject = Record<string, QueryValue | QueryValue[]>;
export type ParsedQuery = Record<string, string | string[]>;

/**
 * 解析 query string 为对象
 *
 * @param input - query string，支持带或不带前缀 `?`
 * @returns 解析后的对象，同名参数合并为数组
 */
export function parseQuery(input = ""): ParsedQuery {
  const qs = input[0] === "?" ? input.slice(1) : input;
  const query: ParsedQuery = Object.create(null);

  const params = new URLSearchParams(qs);

  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    query[key] = values.length === 1 ? (values[0] as string) : values;
  }

  return query;
}

function normalizeQueryValue(value: QueryValue): string {
  if (isNull(value)) {
    return "";
  }

  return String(value);
}

/**
 * 序列化对象为 query string
 *
 * @param query - 待序列化的对象
 * @returns 序列化后的 query string，不含前缀 `?`
 */
export function stringifyQuery(query: QueryObject): string {
  const normalizedQuery = Object.entries(query)
    .filter(([, value]) => !isUndefined(value))
    .flatMap(([key, value]) => {
      if (isArray(value)) {
        return value
          .filter((item) => !isUndefined(item))
          .map((item) => [key, normalizeQueryValue(item)]);
      }

      return [[key, normalizeQueryValue(value)]];
    });

  return new URLSearchParams(normalizedQuery).toString();
}

export type ParsedUrl = {
  scheme: string;
  host: string;
  auth: string;
  pathname: string;
  query: string;
  fragment: string;
};

/**
 * 解析 URL，兼容绝对路径和相对路径
 *
 * @param url - 要解析的 URL
 * @returns 解析后的对象
 */
export function parseUrl(url: string): ParsedUrl {
  const dummy = "http://localhost";
  const parsed = new URL(url, dummy);
  const isRelative = parsed.origin === dummy && !url.startsWith(dummy);

  return {
    scheme: isRelative || url.startsWith("//") ? "" : parsed.protocol.slice(0, -1),
    host: isRelative ? "" : parsed.host,
    auth: parsed.username
      ? parsed.password
        ? `${parsed.username}:${parsed.password}`
        : parsed.username
      : "",
    pathname: parsed.pathname,
    query: parsed.search.slice(1),
    fragment: parsed.hash.slice(1),
  };
}

/**
 * 将 ParsedUrl 还原为 URL 字符串
 *
 * @param parsed - 解析后的 URL 对象
 * @returns URL 字符串
 */
export const stringifyUrl = (parsed: ParsedUrl): string => {
  const query = parsed.query ? `?${parsed.query}` : "";
  const fragment = parsed.fragment ? `#${parsed.fragment}` : "";

  if (parsed.scheme !== "") {
    return `${parsed.scheme}://${parsed.auth ? `${parsed.auth}@` : ""}${parsed.host}${parsed.pathname}${query}${fragment}`;
  }

  if (parsed.host !== "") {
    return `//${parsed.auth ? `${parsed.auth}@` : ""}${parsed.host}${parsed.pathname}${query}${fragment}`;
  }

  return `${parsed.pathname}${query}${fragment}`;
};

/**
 * 为路径添加基础前缀
 *
 * @param url - 目标 URL，支持 string 或 ParsedUrl
 * @param base - 基础前缀
 * @returns 添加基础前缀后的路径
 */
export function withBase(url: string | ParsedUrl, base = ""): string {
  const isStr = isString(url);
  const parsed = isStr ? parseUrl(url) : url;

  if (parsed.scheme !== "") {
    return stringifyUrl(parsed);
  }

  const dummy = "http://localhost";
  const result = new URL(isStr ? url : stringifyUrl(url), new URL(base, dummy));

  return result.origin === dummy ? result.pathname + result.search + result.hash : result.href;
}

/**
 * 为 URL 添加查询参数
 *
 * @param url - 目标 URL，支持 string 或 ParsedUrl
 * @param query - 查询参数
 * @returns 添加查询参数后的 URL 字符串
 */
export function withQuery(url: string | ParsedUrl, query: QueryObject): string {
  const parsed = isString(url) ? parseUrl(url) : url;

  const mergedQuery: QueryObject = {
    ...parseQuery(parsed.query),
    ...query,
  };

  return stringifyUrl({ ...parsed, query: stringifyQuery(mergedQuery) });
}
