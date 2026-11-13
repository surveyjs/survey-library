import { describe, expect, test } from "vitest";
import { sanitizeHtml } from "../../src/plugins/rich-text/sanitizer";

describe("run normalization", () => {
  test("renames duplicated and nested tags and unwraps a styled span", () => {
    expect(sanitizeHtml("<strong><strong>a</strong></strong>")).toBe("<strong>a</strong>");
    expect(sanitizeHtml("<b><i>a</i></b>")).toBe("<strong><em>a</em></strong>");
    expect(sanitizeHtml("<div><div>one</div></div>")).toBe("one");
    expect(sanitizeHtml("<span style=\"color:red\"><b>x</b></span>")).toBe("<strong>x</strong>");
  });

  test("merges adjacent runs and moves edge whitespace out of a mark", () => {
    expect(sanitizeHtml("<strong>wo</strong><strong>rd</strong>")).toBe("<strong>word</strong>");
    expect(sanitizeHtml("<strong>word </strong>")).toBe("<strong>word</strong> ");
    expect(sanitizeHtml("<em> word</em>")).toBe(" <em>word</em>");
  });

  test("a link stays outside other marks", () => {
    expect(sanitizeHtml("<strong><a href=\"https://x\">a</a>b</strong>"))
      .toBe("<a href=\"https://x\" target=\"_blank\" rel=\"noopener noreferrer\"><strong>a</strong></a><strong>b</strong>");
  });

  test("overlapping marks follow the worked example", () => {
    const applied = "Please <strong>r</strong><strong>ead the <em>ter</em></strong><em>ms</em> carefully";
    expect(sanitizeHtml(applied)).toBe("Please <strong>read the </strong><em><strong>ter</strong>ms</em> carefully");
    expect(sanitizeHtml("Please <strong>read the </strong><em><strong>ter</strong>ms</em> carefully"))
      .toBe("Please <strong>read the </strong><em><strong>ter</strong>ms</em> carefully");
    expect(sanitizeHtml("Please <strong>r</strong>ead the <em>terms</em> carefully"))
      .toBe("Please <strong>r</strong>ead the <em>terms</em> carefully");
  });
});
