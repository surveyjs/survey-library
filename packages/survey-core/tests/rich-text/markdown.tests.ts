import { RichText } from "../../src/plugins/rich-text/index";
import { markdownToHtml, parseMarkdown } from "../../src/plugins/rich-text/markdown";
import { SurveyModel } from "../../src/survey";

import { describe, expect, test } from "vitest";

describe("markdown subset", () => {
  test("renders inline marks, links and leaves plain text empty through the handler", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", title: "Plain title" }] });
    survey.onTextMarkdown.add(RichText.textMarkdownHandler);
    expect(survey.getQuestionByName("q").locTitle.renderedHtml).toBe("Plain title");
    expect(survey.getQuestionByName("q").locTitle.hasHtml).toBe(false);
    survey.getQuestionByName("q").title = "Title with *italic*, **bold**, ~~strike~~ and [a link](https://surveyjs.io)";
    expect(survey.getQuestionByName("q").locTitle.renderedHtml).toBe(
      "Title with <em>italic</em>, <strong>bold</strong>, <s>strike</s> and <a href=\"https://surveyjs.io\" target=\"_blank\" rel=\"noopener noreferrer\">a link</a>"
    );
  });

  test("single newline is a break and a blank line is a paragraph", () => {
    expect(markdownToHtml("Line one\nLine two", false)).toBe("Line one<br>Line two");
    expect(markdownToHtml("Survey description with *italic* text.\n\nSecond paragraph.", false)).toBe(
      "<p>Survey description with <em>italic</em> text.</p><p>Second paragraph.</p>"
    );
  });

  test("a single paragraph is not wrapped and a list stays a list", () => {
    expect(markdownToHtml("Line one\nLine two\n\n- item one\n- item two", false)).toBe(
      "Line one<br>Line two<ul><li>item one</li><li>item two</li></ul>"
    );
    expect(markdownToHtml("1. one\n2. two", false)).toBe("<ol><li>one</li><li>two</li></ol>");
  });

  test("inline context does not parse lists", () => {
    expect(markdownToHtml("- not a list in a title", true)).toBe("- not a list in a title");
    expect(markdownToHtml("- not a list in a title", false)).toBe("<ul><li>not a list in a title</li></ul>");
  });

  test("unsupported syntax is literal text and reported", () => {
    expect(markdownToHtml("# Heading", false)).toBe("# Heading");
    expect(parseMarkdown("# Heading", false).unsupported).toEqual(["heading"]);
    const table = "| a | b |\n|---|---|\n| 1 | 2 |";
    expect(markdownToHtml(table, false)).toBe("| a | b |<br>|---|---|<br>| 1 | 2 |");
    expect(parseMarkdown(table, false).unsupported).toEqual(["table"]);
    expect(parseMarkdown("![alt](http://x)", false).unsupported).toEqual(["image"]);
    expect(parseMarkdown("> quote", false).unsupported).toEqual(["blockquote"]);
    expect(parseMarkdown("`code`", false).unsupported).toEqual(["code"]);
    expect(parseMarkdown("  - nested", false).unsupported).toEqual(["nested-list"]);
    const raw = "Raw <b>html</b> and <script>alert(1)</script>";
    expect(markdownToHtml(raw, false)).toBe("Raw &lt;b&gt;html&lt;/b&gt; and &lt;script&gt;alert(1)&lt;/script&gt;");
    expect(parseMarkdown(raw, false).unsupported).toEqual(["raw-html"]);
  });

  test("disallowed link schemes are text and allowed links carry target and rel", () => {
    expect(markdownToHtml("[js link](javascript:alert(1))", false)).toBe("[js link](javascript:alert(1))");
    expect(markdownToHtml("[js](data:text/html,x)", false).indexOf("<a") < 0).toBe(true);
    const html = markdownToHtml("[ok](https://surveyjs.io)", false);
    expect(html).toBe("<a href=\"https://surveyjs.io\" target=\"_blank\" rel=\"noopener noreferrer\">ok</a>");
  });

  test("underscore emphasis is not intraword and star emphasis is", () => {
    expect(markdownToHtml("a_b_c", false)).toBe("a_b_c");
    expect(markdownToHtml("a*b*c", false)).toBe("a<em>b</em>c");
    expect(markdownToHtml("__a__", false)).toBe("<strong>a</strong>");
    expect(markdownToHtml("_a_", false)).toBe("<em>a</em>");
  });

  test("pathological star runs close from the top of the stack", () => {
    expect(markdownToHtml("***ter**ms*", false)).toBe("<em><strong>ter</strong>ms</em>");
  });
});

