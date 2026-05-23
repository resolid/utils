import { describe, expect, it } from "vitest";
import { parseQuery, parseUrl, stringifyQuery, stringifyUrl, withBase } from "../lib/url";

describe("parseQuery", () => {
  it("should return empty object for empty string", () => {
    expect(parseQuery("")).toEqual({});
  });

  it("should parse simple key-value", () => {
    expect(parseQuery("a=1&b=2")).toEqual({ a: "1", b: "2" });
  });

  it("should handle leading question mark", () => {
    expect(parseQuery("?a=1&b=2")).toEqual({ a: "1", b: "2" });
  });

  it("should merge duplicate keys into array", () => {
    expect(parseQuery("a=1&a=2&a=3")).toEqual({ a: ["1", "2", "3"] });
  });

  it("should handle empty value", () => {
    expect(parseQuery("a=&b=2")).toEqual({ a: "", b: "2" });
  });

  it("should handle encoded characters", () => {
    expect(parseQuery("a=hello%20world")).toEqual({ a: "hello world" });
  });

  it("should handle mixed single and array values", () => {
    expect(parseQuery("a=1&b=2&b=3")).toEqual({ a: "1", b: ["2", "3"] });
  });
});

describe("stringifyQuery", () => {
  it("should return empty string for empty object", () => {
    expect(stringifyQuery({})).toBe("");
  });

  it("should stringify simple key-value", () => {
    expect(stringifyQuery({ a: "1", b: "2" })).toBe("a=1&b=2");
  });

  it("should stringify number value", () => {
    expect(stringifyQuery({ a: 1 })).toBe("a=1");
  });

  it("should stringify boolean value", () => {
    expect(stringifyQuery({ a: true })).toBe("a=true");
  });

  it("should skip undefined value", () => {
    expect(stringifyQuery({ a: "1", b: undefined })).toBe("a=1");
  });

  it("should stringify null value as empty string", () => {
    expect(stringifyQuery({ a: null })).toBe("a=");
  });

  it("should stringify array value", () => {
    expect(stringifyQuery({ a: ["1", "2", "3"] })).toBe("a=1&a=2&a=3");
  });

  it("should skip undefined items in array", () => {
    expect(stringifyQuery({ a: ["1", undefined, "3"] })).toBe("a=1&a=3");
  });

  it("should encode special characters", () => {
    expect(stringifyQuery({ a: "hello world" })).toBe("a=hello+world");
  });
});

describe("parseUrl", () => {
  it("parses a full absolute URL", () => {
    expect(parseUrl("https://api.example.com/v1?foo=1#bar")).toEqual({
      scheme: "https",
      host: "api.example.com",
      auth: "",
      pathname: "/v1",
      query: "foo=1",
      fragment: "bar",
    });
  });

  it("parses a URL with port", () => {
    expect(parseUrl("https://api.example.com:8080/v1")).toEqual({
      scheme: "https",
      host: "api.example.com:8080",
      auth: "",
      pathname: "/v1",
      query: "",
      fragment: "",
    });
  });

  it("parses a URL with username and password", () => {
    expect(parseUrl("https://user:pass@api.example.com/v1")).toEqual({
      scheme: "https",
      host: "api.example.com",
      auth: "user:pass",
      pathname: "/v1",
      query: "",
      fragment: "",
    });
  });

  it("parses a URL with username only", () => {
    expect(parseUrl("https://user@api.example.com/v1")).toEqual({
      scheme: "https",
      host: "api.example.com",
      auth: "user",
      pathname: "/v1",
      query: "",
      fragment: "",
    });
  });

  it("parses an absolute path", () => {
    expect(parseUrl("/v1?foo=1#bar")).toEqual({
      scheme: "",
      host: "",
      auth: "",
      pathname: "/v1",
      query: "foo=1",
      fragment: "bar",
    });
  });

  it("parses a relative path", () => {
    expect(parseUrl("v1/test?foo=1")).toEqual({
      scheme: "",
      host: "",
      auth: "",
      pathname: "/v1/test",
      query: "foo=1",
      fragment: "",
    });
  });

  it("parses an empty string", () => {
    expect(parseUrl("")).toEqual({
      scheme: "",
      host: "",
      auth: "",
      pathname: "/",
      query: "",
      fragment: "",
    });
  });

  it("parses a hash-only string", () => {
    expect(parseUrl("#bar")).toEqual({
      scheme: "",
      host: "",
      auth: "",
      pathname: "/",
      query: "",
      fragment: "bar",
    });
  });

  it("parses a query-only string", () => {
    expect(parseUrl("?foo=1&bar=2")).toEqual({
      scheme: "",
      host: "",
      auth: "",
      pathname: "/",
      query: "foo=1&bar=2",
      fragment: "",
    });
  });

  it("parses an http URL", () => {
    expect(parseUrl("http://api.example.com/v1")).toEqual({
      scheme: "http",
      host: "api.example.com",
      auth: "",
      pathname: "/v1",
      query: "",
      fragment: "",
    });
  });

  it("parses a protocol-relative URL", () => {
    expect(parseUrl("//api.example.com/v1?foo=1")).toEqual({
      scheme: "",
      host: "api.example.com",
      auth: "",
      pathname: "/v1",
      query: "foo=1",
      fragment: "",
    });
  });
});

describe("stringifyUrl", () => {
  it("stringifies an absolute URL", () => {
    expect(
      stringifyUrl({
        scheme: "https",
        host: "api.example.com",
        auth: "",
        pathname: "/v1",
        query: "foo=1",
        fragment: "bar",
      }),
    ).toBe("https://api.example.com/v1?foo=1#bar");
  });

  it("stringifies an absolute URL with auth", () => {
    expect(
      stringifyUrl({
        scheme: "https",
        host: "api.example.com",
        auth: "user:pass",
        pathname: "/v1",
        query: "",
        fragment: "",
      }),
    ).toBe("https://user:pass@api.example.com/v1");
  });

  it("stringifies a relative URL", () => {
    expect(
      stringifyUrl({
        scheme: "",
        host: "",
        auth: "",
        pathname: "/v1",
        query: "foo=1",
        fragment: "bar",
      }),
    ).toBe("/v1?foo=1#bar");
  });

  it("stringifies a pathname only", () => {
    expect(
      stringifyUrl({ scheme: "", host: "", auth: "", pathname: "/v1", query: "", fragment: "" }),
    ).toBe("/v1");
  });

  it("stringifies a protocol-relative URL", () => {
    expect(
      stringifyUrl({
        scheme: "",
        host: "api.example.com",
        auth: "",
        pathname: "/v1",
        query: "foo=1",
        fragment: "bar",
      }),
    ).toBe("//api.example.com/v1?foo=1#bar");
  });

  it("stringifies a protocol-relative URL with auth", () => {
    expect(
      stringifyUrl({
        scheme: "",
        host: "api.example.com",
        auth: "user:pass",
        pathname: "/v1",
        query: "",
        fragment: "",
      }),
    ).toBe("//user:pass@api.example.com/v1");
  });
});

describe("withBase", () => {
  it("returns stringified url when url has scheme", () => {
    expect(withBase("https://example.com/foo", "/base")).toBe("https://example.com/foo");
  });

  it("returns stringified url when parsed url has scheme", () => {
    expect(
      withBase(
        {
          scheme: "https",
          host: "example.com",
          auth: "",
          pathname: "/foo",
          query: "",
          fragment: "",
        },
        "/base",
      ),
    ).toBe("https://example.com/foo");
  });

  it("returns input unchanged when base is empty", () => {
    expect(withBase("/foo", "")).toBe("/foo");
  });

  it("resolves absolute path against absolute base", () => {
    expect(withBase("/foo", "https://example.com/base/")).toBe("https://example.com/foo");
  });

  it("resolves relative path against absolute base", () => {
    expect(withBase("foo", "https://example.com/base/")).toBe("https://example.com/base/foo");
  });

  it("resolves absolute path against relative base", () => {
    expect(withBase("/foo", "/base/")).toBe("/foo");
  });

  it("resolves relative path against relative base", () => {
    expect(withBase("foo", "/base/")).toBe("/base/foo");
  });

  it("resolves .. path against base", () => {
    expect(withBase("../foo", "https://example.com/a/b/")).toBe("https://example.com/a/foo");
  });

  it("resolves ./ path against base", () => {
    expect(withBase("./foo", "https://example.com/a/b/")).toBe("https://example.com/a/b/foo");
  });

  it("preserves query and fragment", () => {
    expect(withBase("foo?a=1#bar", "https://example.com/base/")).toBe(
      "https://example.com/base/foo?a=1#bar",
    );
  });

  it("resolves protocol-relative url with base scheme", () => {
    expect(withBase("//other.com/foo", "https://example.com")).toBe("https://other.com/foo");
  });

  it("handles ParsedUrl input", () => {
    expect(
      withBase(
        { scheme: "", host: "", auth: "", pathname: "/foo", query: "a=1", fragment: "bar" },
        "https://example.com",
      ),
    ).toBe("https://example.com/foo?a=1#bar");
  });
});
