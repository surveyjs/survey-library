import { describe, expect, test } from "vitest";
import { getDisallowedHtml, sanitizeHtml } from "../../src/plugins/rich-text/sanitizer";

describe("canonical HTML examples", () => {
  test.each([
    ["<b>a</b>", "<strong>a</strong>"],
    ["<p>one</p>", "one"],
    ["<div>one</div><div>two</div>", "<p>one</p><p>two</p>"],
    ["<ul><li>a</li></ul>tail", "<ul><li>a</li></ul><p>tail</p>"],
    ["a\nb", "a<br>b"],
    ["<p>\n  one\n</p>", "one"],
    ["Tom & Jerry", "Tom & Jerry"],
    ["Tom &amp; Jerry", "Tom & Jerry"],
    ["R&amp;D", "R&amp;D"],
    ["a &lt;b&gt; c", "a &lt;b> c"],
    ["<span style=\"color:red\">x</span>", "x"],
    ["<a href=\"https://x\">x</a>", "<a href=\"https://x\" target=\"_blank\" rel=\"noopener noreferrer\">x</a>"],
    ["<a href=\"javascript:alert(1)\">x</a>", "x"],
    ["<p><br></p>", ""]
  ])("%s", (input, output) => {
    expect(sanitizeHtml(input)).toBe(output);
  });
});

describe("allow-list", () => {
  test("renames aliases and does not report them", () => {
    expect(sanitizeHtml("<i>a</i>")).toBe("<em>a</em>");
    expect(sanitizeHtml("<strike>a</strike>")).toBe("<s>a</s>");
    expect(sanitizeHtml("<del>a</del>")).toBe("<s>a</s>");
    expect(getDisallowedHtml("<b>a</b>")).toEqual([]);
    expect(getDisallowedHtml("<div>one</div>")).toEqual([]);
  });

  test("unwraps unknown elements and keeps their text", () => {
    expect(sanitizeHtml("<span style=\"color:red\">x</span>")).toBe("x");
    expect(getDisallowedHtml("<span style=\"color:red\">x</span>")).toEqual(expect.arrayContaining(["span", "style"]));
  });

  test("block elements become separate lines", () => {
    expect(sanitizeHtml("<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td>2</td></tr></table>"))
      .toBe("<p>a</p><p>b</p><p>1</p><p>2</p>");
    expect(sanitizeHtml("<h1>A</h1><h2>B</h2>")).toBe("<p>A</p><p>B</p>");
  });

  test("inline context joins blocks and list items", () => {
    expect(sanitizeHtml("<div>one</div><div>two</div>", { inline: true })).toBe("one<br>two");
    expect(sanitizeHtml("<ul><li>a</li><li>b</li></ul>", { inline: true })).toBe("a<br>b");
    expect(sanitizeHtml("<p>one</p>", { inline: true })).toBe("one");
  });

  test("drops elements together with their content", () => {
    expect(sanitizeHtml("<script>alert(1)</script>ok")).toBe("ok");
    expect(sanitizeHtml("<style>.x{}</style>ok")).toBe("ok");
    expect(getDisallowedHtml("<script>alert(1)</script>")).toEqual(["script"]);
  });

  test("strips attributes and rewrites link target and rel without reporting them", () => {
    const link = "<a href=\"https://x\" target=\"_blank\" rel=\"noopener noreferrer\">x</a>";
    expect(sanitizeHtml(link)).toBe(link);
    expect(getDisallowedHtml(link)).toEqual([]);
    expect(sanitizeHtml("<a href=\"https://x\" onclick=\"alert(1)\">x</a>"))
      .toBe("<a href=\"https://x\" target=\"_blank\" rel=\"noopener noreferrer\">x</a>");
    expect(getDisallowedHtml("<a href=\"https://x\" onclick=\"alert(1)\">x</a>")).toContain("onclick");
  });

  test("rejects disallowed href schemes, including schemes split by control characters", () => {
    expect(sanitizeHtml("<a href=\"javascript:alert(1)\">x</a>")).toBe("x");
    expect(sanitizeHtml("<a href=\"data:text/html,x\">x</a>")).toBe("x");
    expect(sanitizeHtml("<a href=\"vbscript:msg\">x</a>")).toBe("x");
    expect(sanitizeHtml("<a href=\"java\nscript:alert(1)\">x</a>")).toBe("x");
    expect(getDisallowedHtml("<a href=\"javascript:alert(1)\">x</a>")).toContain("javascript");
    expect(getDisallowedHtml("<a href=\"JAVASCRIPT:alert(1)\">x</a>")).toContain("javascript");
  });

  test("flattens a nested list and reports it", () => {
    expect(sanitizeHtml("<ul><li>a<ul><li>b</li></ul></li><li>c</li></ul>"))
      .toBe("<ul><li>a</li><li>b</li><li>c</li></ul>");
    expect(getDisallowedHtml("<ul><li>a<ul><li>b</li></ul></li></ul>")).toContain("nested-list");
  });

  test("escapes only what the parser would consume, and escapes quotes in href", () => {
    expect(sanitizeHtml("x > y")).toBe("x > y");
    expect(sanitizeHtml("say \"hi\"")).toBe("say \"hi\"");
    expect(sanitizeHtml("a < b")).toBe("a < b");
    expect(sanitizeHtml("&amp;#1")).toBe("&amp;#1");
    expect(sanitizeHtml("a&lt;b")).toBe("a&lt;b");
    expect(sanitizeHtml("&lt;/")).toBe("&lt;/");
    expect(sanitizeHtml("&lt;!")).toBe("&lt;!");
    expect(sanitizeHtml("&lt;?")).toBe("&lt;?");
    expect(sanitizeHtml("<a href=\"https://x.com?a=1&amp;b=2\">x</a>"))
      .toBe("<a href=\"https://x.com?a=1&amp;b=2\" target=\"_blank\" rel=\"noopener noreferrer\">x</a>");
  });

  test("line feeds become breaks and edge whitespace is removed", () => {
    expect(sanitizeHtml("a\r\nb")).toBe("a<br>b");
    expect(sanitizeHtml("a\rb")).toBe("a<br>b");
    expect(sanitizeHtml("<p>one</p>\n  <p>two</p>")).toBe("<p>one</p><p>two</p>");
    expect(sanitizeHtml("   ")).toBe("");
    expect(sanitizeHtml("<br>")).toBe("");
  });

  test("paste collapses whitespace, including line feeds, into one space", () => {
    expect(sanitizeHtml("a\n\nb  c", { paste: true })).toBe("a b c");
    expect(sanitizeHtml("<p>one\n\ntwo</p>", { paste: true })).toBe("one two");
  });
});

describe("xss", () => {
  test("script, event handlers, svg and math do not survive", () => {
    expect(sanitizeHtml("<img src=x onerror=alert(1)>")).toBe("");
    expect(sanitizeHtml("<svg onload=alert(1)><script>alert(1)</script></svg>")).not.toContain("script");
    expect(sanitizeHtml("<svg onload=alert(1)><script>alert(1)</script></svg>")).not.toContain("onload");
    expect(sanitizeHtml("<math><mi onclick=alert(1)>x</mi></math>")).toBe("x");
    expect(getDisallowedHtml("<img src=x onerror=alert(1)>")).toEqual(expect.arrayContaining(["img", "onerror"]));
  });
});

describe("without a DOM", () => {
  test("sanitizeHtml returns an empty string and getDisallowedHtml returns nothing", () => {
    const win = window as any;
    const parser = win.DOMParser;
    win.DOMParser = undefined;
    try {
      expect(sanitizeHtml("<b>a</b>")).toBe("");
      expect(getDisallowedHtml("<span style=\"color:red\">x</span>")).toEqual([]);
    } finally {
      win.DOMParser = parser;
    }
  });
});
