import { describe, expect, it } from "vitest";
import { escapeHtml, escapeRegExp, unescapeHtml } from "./index";

describe("string escape", () => {
  describe("escapeHtml", () => {
    it("escapes all supported characters", () => {
      expect(escapeHtml(`<a href="x">&'</a>`)).toBe(
        "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;",
      );
    });

    it("leaves plain text unchanged", () => {
      expect(escapeHtml("hello world")).toBe("hello world");
      expect(escapeHtml("")).toBe("");
    });

    it("escapes existing entities again", () => {
      expect(escapeHtml("&amp;")).toBe("&amp;amp;");
    });
  });

  describe("unescapeHtml", () => {
    it("restores all supported entities", () => {
      expect(unescapeHtml("&lt;a&gt; &amp; &quot;x&quot; &#39;")).toBe(`<a> & "x" '`);
    });

    it("accepts zero-padded numeric entities", () => {
      expect(unescapeHtml("&#039; &#0039; &#00039;")).toBe("' ' '");
    });

    it("leaves unknown entities unchanged", () => {
      expect(unescapeHtml("&#x27; &apos; &nbsp;")).toBe("&#x27; &apos; &nbsp;");
    });

    it("only unescapes a single pass", () => {
      expect(unescapeHtml("&amp;lt;")).toBe("&lt;");
    });

    it("returns an empty string for empty input", () => {
      expect(unescapeHtml("")).toBe("");
    });
  });

  describe("escapeRegExp", () => {
    it("escapes all regex metacharacters", () => {
      expect(escapeRegExp(String.raw`a.b*c+d?e(f)[g]{h}|i\j^k$`)).toBe(
        String.raw`a\.b\*c\+d\?e\(f\)\[g\]\{h\}\|i\\j\^k\$`,
      );
    });

    it("leaves plain text unchanged", () => {
      expect(escapeRegExp("hello world")).toBe("hello world");
      expect(escapeRegExp("")).toBe("");
    });

    it("produces a pattern that matches the input literally", () => {
      const input = "a.b*c+d?e(f)[g]{h}|i\\j^k$";
      const pattern = new RegExp(`^${escapeRegExp(input)}$`);

      expect(pattern.test(input)).toBe(true);
      expect(pattern.test("axbxc")).toBe(false);
    });
  });
});
