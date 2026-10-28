import { describe, expect, it } from "vitest";
import {
  camelCase,
  capitalize,
  kebabCase,
  lowerCase,
  lowerFirst,
  pascalCase,
  sentenceCase,
  snakeCase,
  startCase,
  upperCase,
  upperFirst,
  words,
} from "./index";

describe("string case", () => {
  describe("lowerFirst", () => {
    it("lowercases the first letter", () => {
      expect(lowerFirst("Hello")).toBe("hello");
      expect(lowerFirst("WORLD")).toBe("wORLD");
    });

    it("keeps the rest of the string unchanged", () => {
      expect(lowerFirst("hello")).toBe("hello");
      expect(lowerFirst("hELLO")).toBe("hELLO");
    });

    it("handles empty and single-character strings", () => {
      expect(lowerFirst("")).toBe("");
      expect(lowerFirst("A")).toBe("a");
    });

    it("handles non-ASCII letters", () => {
      expect(lowerFirst("ÄBC")).toBe("äBC");
    });
  });

  describe("upperFirst", () => {
    it("uppercases the first letter", () => {
      expect(upperFirst("hello")).toBe("Hello");
      expect(upperFirst("world")).toBe("World");
    });

    it("keeps the rest of the string unchanged", () => {
      expect(upperFirst("hELLO")).toBe("HELLO");
      expect(upperFirst("Hello")).toBe("Hello");
    });

    it("handles empty and single-character strings", () => {
      expect(upperFirst("")).toBe("");
      expect(upperFirst("a")).toBe("A");
    });

    it("handles letters whose uppercase form expands", () => {
      expect(upperFirst("ßeta")).toBe("SSeta");
    });
  });

  describe("capitalize", () => {
    it("uppercases the first letter and lowercases the rest", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("hELLO")).toBe("Hello");
      expect(capitalize("HELLO WORLD")).toBe("Hello world");
    });

    it("only touches the first character, not word boundaries", () => {
      expect(capitalize("hello world")).toBe("Hello world");
      expect(capitalize("foo-bar")).toBe("Foo-bar");
    });

    it("handles empty strings", () => {
      expect(capitalize("")).toBe("");
    });

    it("keeps leading whitespace untouched", () => {
      expect(capitalize("  hello")).toBe("  hello");
    });

    it("handles non-ASCII letters", () => {
      expect(capitalize("café")).toBe("Café");
      expect(capitalize("ßeta")).toBe("SSeta");
    });
  });

  describe("words", () => {
    it("splits camelCase and PascalCase", () => {
      expect(words("fooBar")).toEqual(["foo", "Bar"]);
      expect(words("FooBar")).toEqual(["Foo", "Bar"]);
    });

    it("splits snake_case, kebab-case and spaces", () => {
      expect(words("foo_bar-baz qux")).toEqual(["foo", "bar", "baz", "qux"]);
    });

    it("splits consecutive uppercase words", () => {
      expect(words("XMLHttpRequest")).toEqual(["XML", "Http", "Request"]);
      expect(words("HELLO-WORLD")).toEqual(["HELLO", "WORLD"]);
    });

    it("splits numbers into separate words", () => {
      expect(words("userID2FA")).toEqual(["user", "ID", "2", "FA"]);
      expect(words("foo2bar")).toEqual(["foo", "2", "bar"]);
    });

    it("ignores punctuation and separators", () => {
      expect(words("hello@world")).toEqual(["hello", "world"]);
      expect(words("test.case.name")).toEqual(["test", "case", "name"]);
      expect(words("__FOO_BAR__")).toEqual(["FOO", "BAR"]);
    });

    it("keeps non-ASCII letters intact", () => {
      expect(words("café au lait")).toEqual(["café", "au", "lait"]);
      expect(words("你好世界")).toEqual(["你好世界"]);
    });

    it("splits emoji into separate words", () => {
      expect(words("👍🏽 emoji")).toEqual(["👍", "🏽", "emoji"]);
    });

    it("returns an empty array for empty or whitespace-only input", () => {
      expect(words("")).toEqual([]);
      expect(words("   ")).toEqual([]);
    });
  });

  describe("lowerCase", () => {
    it("converts to lowercase words separated by spaces", () => {
      expect(lowerCase("fooBar")).toBe("foo bar");
      expect(lowerCase("hello-world_again")).toBe("hello world again");
    });

    it("lowercases consecutive uppercase words", () => {
      expect(lowerCase("XMLHttpRequest")).toBe("xml http request");
    });

    it("trims separators and whitespace", () => {
      expect(lowerCase("  hello-world  ")).toBe("hello world");
    });

    it("keeps non-ASCII letters intact", () => {
      expect(lowerCase("你好世界")).toBe("你好世界");
      expect(lowerCase("caféAuLait")).toBe("café au lait");
    });

    it("returns an empty string for empty input", () => {
      expect(lowerCase("")).toBe("");
      expect(lowerCase("   ")).toBe("");
    });
  });

  describe("upperCase", () => {
    it("converts to uppercase words separated by spaces", () => {
      expect(upperCase("fooBar")).toBe("FOO BAR");
      expect(upperCase("hello world")).toBe("HELLO WORLD");
    });

    it("handles acronyms and numbers", () => {
      expect(upperCase("XMLHttpRequest")).toBe("XML HTTP REQUEST");
      expect(upperCase("foo2bar")).toBe("FOO 2 BAR");
    });

    it("returns an empty string for empty input", () => {
      expect(upperCase("")).toBe("");
    });
  });

  describe("startCase", () => {
    it("capitalizes each word and joins with spaces", () => {
      expect(startCase("fooBar")).toBe("Foo Bar");
      expect(startCase("hello-world")).toBe("Hello World");
    });

    it("lowercases the rest of each word", () => {
      expect(startCase("XMLHttpRequest")).toBe("Xml Http Request");
      expect(startCase("HELLO-WORLD")).toBe("Hello World");
    });

    it("handles numbers", () => {
      expect(startCase("foo2bar")).toBe("Foo 2 Bar");
    });

    it("returns an empty string for empty input", () => {
      expect(startCase("")).toBe("");
    });
  });

  describe("camelCase", () => {
    it("converts hyphen-separated string to camelCase", () => {
      expect(camelCase("hello-world")).toBe("helloWorld");
      expect(camelCase("foo-bar-baz")).toBe("fooBarBaz");
    });

    it("converts underscore-separated string to camelCase", () => {
      expect(camelCase("hello_world")).toBe("helloWorld");
      expect(camelCase("foo_bar_baz")).toBe("fooBarBaz");
    });

    it("converts space-separated string to camelCase", () => {
      expect(camelCase("hello world")).toBe("helloWorld");
      expect(camelCase("foo bar baz")).toBe("fooBarBaz");
    });

    it("handles mixed separators", () => {
      expect(camelCase("hello-world_foo bar")).toBe("helloWorldFooBar");
      expect(camelCase("foo_bar-baz qux")).toBe("fooBarBazQux");
    });

    it("handles multiple consecutive separators", () => {
      expect(camelCase("hello---world")).toBe("helloWorld");
      expect(camelCase("foo___bar")).toBe("fooBar");
      expect(camelCase("hello   world")).toBe("helloWorld");
    });

    it("trims leading and trailing whitespace", () => {
      expect(camelCase("  hello-world  ")).toBe("helloWorld");
      expect(camelCase("\thello-world\n")).toBe("helloWorld");
    });

    it("returns an empty string for empty or whitespace-only input", () => {
      expect(camelCase("")).toBe("");
      expect(camelCase("   ")).toBe("");
    });

    it("lowercases a single word", () => {
      expect(camelCase("hello")).toBe("hello");
      expect(camelCase("HELLO")).toBe("hello");
    });

    it("handles strings ending with a separator", () => {
      expect(camelCase("hello-world-")).toBe("helloWorld");
      expect(camelCase("foo_bar_")).toBe("fooBar");
    });

    it("handles already camelCased strings", () => {
      expect(camelCase("helloWorld")).toBe("helloWorld");
      expect(camelCase("fooBarBaz")).toBe("fooBarBaz");
    });

    it("handles acronyms", () => {
      expect(camelCase("XMLHttpRequest")).toBe("xmlHttpRequest");
      expect(camelCase("NASAProject")).toBe("nasaProject");
    });

    it("handles numbers", () => {
      expect(camelCase("foo2bar")).toBe("foo2Bar");
      expect(camelCase("userID2FA")).toBe("userId2Fa");
    });

    it("handles special characters and wrappers", () => {
      expect(camelCase("hello-")).toBe("hello");
      expect(camelCase("hello@world")).toBe("helloWorld");
      expect(camelCase("__FOO_BAR__")).toBe("fooBar");
    });
  });

  describe("pascalCase", () => {
    it("converts kebab-case to PascalCase", () => {
      expect(pascalCase("hello-world")).toBe("HelloWorld");
      expect(pascalCase("foo-bar-baz")).toBe("FooBarBaz");
    });

    it("converts snake_case to PascalCase", () => {
      expect(pascalCase("hello_world")).toBe("HelloWorld");
      expect(pascalCase("foo_bar_baz")).toBe("FooBarBaz");
    });

    it("converts space-separated words to PascalCase", () => {
      expect(pascalCase("hello world")).toBe("HelloWorld");
      expect(pascalCase("foo bar baz")).toBe("FooBarBaz");
    });

    it("handles mixed separators", () => {
      expect(pascalCase("hello-world_foo bar")).toBe("HelloWorldFooBar");
      expect(pascalCase("foo_bar-baz qux")).toBe("FooBarBazQux");
    });

    it("lowercases consecutive uppercase letters", () => {
      expect(pascalCase("HELLO-WORLD")).toBe("HelloWorld");
      expect(pascalCase("FOO_BAR")).toBe("FooBar");
      expect(pascalCase("XMLHttpRequest")).toBe("XmlHttpRequest");
    });

    it("handles strings with numbers", () => {
      expect(pascalCase("hello-world-123")).toBe("HelloWorld123");
      expect(pascalCase("foo2bar")).toBe("Foo2Bar");
      expect(pascalCase("test-123-abc")).toBe("Test123Abc");
    });

    it("trims leading and trailing whitespace", () => {
      expect(pascalCase("  hello-world  ")).toBe("HelloWorld");
      expect(pascalCase("\thello-world\n")).toBe("HelloWorld");
    });

    it("handles empty input", () => {
      expect(pascalCase("")).toBe("");
      expect(pascalCase("   ")).toBe("");
    });

    it("handles single words", () => {
      expect(pascalCase("hello")).toBe("Hello");
      expect(pascalCase("HELLO")).toBe("Hello");
    });

    it("handles already PascalCase strings", () => {
      expect(pascalCase("HelloWorld")).toBe("HelloWorld");
      expect(pascalCase("FooBarBaz")).toBe("FooBarBaz");
    });

    it("handles special characters", () => {
      expect(pascalCase("hello@world")).toBe("HelloWorld");
      expect(pascalCase("foo#bar$baz")).toBe("FooBarBaz");
      expect(pascalCase("test.case.name")).toBe("TestCaseName");
    });

    it("handles consecutive separators", () => {
      expect(pascalCase("hello---world")).toBe("HelloWorld");
      expect(pascalCase("foo___bar")).toBe("FooBar");
      expect(pascalCase("test   case")).toBe("TestCase");
    });

    it("handles camelCase to PascalCase", () => {
      expect(pascalCase("helloWorld")).toBe("HelloWorld");
      expect(pascalCase("fooBarBaz")).toBe("FooBarBaz");
    });
  });

  describe("kebabCase", () => {
    it("handles camelCase", () => {
      expect(kebabCase("fooBar")).toBe("foo-bar");
      expect(kebabCase("helloWorldAgain")).toBe("hello-world-again");
    });

    it("handles PascalCase", () => {
      expect(kebabCase("FooBar")).toBe("foo-bar");
      expect(kebabCase("HelloWorld")).toBe("hello-world");
    });

    it("handles consecutive uppercase words", () => {
      expect(kebabCase("XMLHttpRequest")).toBe("xml-http-request");
      expect(kebabCase("NASAProject")).toBe("nasa-project");
    });

    it("handles numbers correctly", () => {
      expect(kebabCase("userID2FA")).toBe("user-id-2-fa");
      expect(kebabCase("version10Beta")).toBe("version-10-beta");
    });

    it("handles separators", () => {
      expect(kebabCase("user_name.id")).toBe("user-name-id");
      expect(kebabCase("user-name test")).toBe("user-name-test");
    });

    it("keeps non-ASCII letters", () => {
      expect(kebabCase("caféAuLait")).toBe("café-au-lait");
    });

    it("handles single words", () => {
      expect(kebabCase("foo")).toBe("foo");
      expect(kebabCase("FOO")).toBe("foo");
    });

    it("returns an empty string for empty input", () => {
      expect(kebabCase("")).toBe("");
    });
  });

  describe("snakeCase", () => {
    it("handles camelCase", () => {
      expect(snakeCase("fooBar")).toBe("foo_bar");
      expect(snakeCase("helloWorldAgain")).toBe("hello_world_again");
    });

    it("handles PascalCase", () => {
      expect(snakeCase("FooBar")).toBe("foo_bar");
      expect(snakeCase("HelloWorld")).toBe("hello_world");
    });

    it("handles consecutive uppercase words", () => {
      expect(snakeCase("XMLHttpRequest")).toBe("xml_http_request");
      expect(snakeCase("NASAProject")).toBe("nasa_project");
    });

    it("handles numbers correctly", () => {
      expect(snakeCase("userID2FA")).toBe("user_id_2_fa");
      expect(snakeCase("version10Beta")).toBe("version_10_beta");
    });

    it("handles separators", () => {
      expect(snakeCase("user_name.id")).toBe("user_name_id");
      expect(snakeCase("user_name test")).toBe("user_name_test");
    });

    it("handles single words", () => {
      expect(snakeCase("foo")).toBe("foo");
      expect(snakeCase("FOO")).toBe("foo");
    });

    it("returns an empty string for empty input", () => {
      expect(snakeCase("")).toBe("");
    });
  });

  describe("sentenceCase", () => {
    it("capitalizes the first word and lowercases the rest", () => {
      expect(sentenceCase("helloWorld")).toBe("Hello world");
      expect(sentenceCase("HELLO WORLD")).toBe("Hello world");
    });

    it("keeps numbers as separate words", () => {
      expect(sentenceCase("foo2bar")).toBe("Foo 2 bar");
    });

    it("trims separators and whitespace", () => {
      expect(sentenceCase("  hello-world  ")).toBe("Hello world");
    });

    it("returns an empty string for empty input", () => {
      expect(sentenceCase("")).toBe("");
      expect(sentenceCase("   ")).toBe("");
    });
  });
});
