import { isConverterLossless } from "../../src/plugins/rich-text/lossless";
import { RichText } from "../../src/plugins/rich-text/index";
import { SurveyModel } from "../../src/survey";

import { describe, expect, test } from "vitest";

const block = { inline: false };

describe("lossless and findUnsupported", () => {
  test("built-in markdown is lossless for a table and still reports it", () => {
    const table = "| a | b |\n|---|---|\n| 1 | 2 |";
    expect(RichText.getFormat("markdown").getUnsupported(table)).toEqual(["table"]);
    expect(RichText.isLossless(table, "markdown", block)).toBe(true);
    expect(RichText.isLossless("__a__", "markdown", block)).toBe(true);
  });

  test("a lossless converter skips the check and checkLossless wins over the round trip", () => {
    expect(isConverterLossless({ toHtml: () => "<b>x</b>", toSource: () => "y", lossless: true }, "anything", block)).toBe(true);
    expect(isConverterLossless({ toHtml: () => "<b>x</b>", toSource: () => "y", checkLossless: () => false }, "anything", block)).toBe(false);
  });

  test("findUnsupported lists raw html, tables and html answers of the scanned format", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "s3", title: "Raw <b>html</b> and <script>alert(1)</script>" },
        { type: "text", name: "s5", title: "Table", description: "| a | b |\n|---|---|\n| 1 | 2 |" },
        { type: "text", name: "s7", title: "HTML string", description: "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>" },
        { type: "text", name: "s1", title: "Title with *italic* and **bold**" },
        { type: "comment", name: "c_unsupported", allowRichText: true, defaultValue: "<p style=\"color:red\">Red</p>" },
        { type: "comment", name: "c_md", allowRichText: true, defaultValue: "**bold**" }
      ]
    });
    survey.onTextMarkdown.add((_sender, options) => {
      if (options.element && (options.element as any).name === "c_unsupported") options.html = options.text;
      else RichText.textMarkdownHandler(_sender, options);
    });
    survey.onHtmlToMarkdown.add((_sender, options) => {
      if (options.element && (options.element as any).name === "c_unsupported") options.text = options.html;
      else RichText.htmlToMarkdownHandler(_sender, options);
    });
    const names = RichText.findUnsupported(survey).map(hit => (hit.element as any).name || hit.name);
    expect(names).toContain("s3");
    expect(names).toContain("s5");
    expect(names).toContain("s7");
    expect(names).toContain("c_unsupported");
    expect(names).not.toContain("s1");
    expect(names).not.toContain("c_md");
  });
});
