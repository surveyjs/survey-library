import "../../src/plugins/rich-text/index";
import { markdownConverter } from "../../src/plugins/rich-text/markdown";
import { createDetachedElement } from "../../src/plugins/rich-text/runs";

import { describe, expect, test } from "vitest";

const block = { inline: false };

function roundTrip(source: string): string {
  const html = markdownConverter.toHtml(source, block);
  return markdownConverter.toSource(createDetachedElement(html), block);
}

describe("markdown round trip", () => {
  const corpus = [
    "Please **read** the *terms* carefully",
    "Please **read the** ***ter**ms* carefully",
    "__a__",
    "Line one\nLine two\n\n- item one\n- item two",
    "1. one\n2. two",
    "[a](https://surveyjs.io)",
    "~~strike~~",
    "a*b*c",
    "a\\*b"
  ];

  test("toSource(toHtml(x)) is stable", () => {
    corpus.forEach(sample => {
      const once = roundTrip(sample);
      expect(roundTrip(once)).toBe(once);
    });
    expect(roundTrip("__a__")).toBe("**a**");
  });

  test("serializing generated mark sequences parses back to the same marks", () => {
    const sequences = ["**a**", "*b*", "~~c~~", "[**d**](https://surveyjs.io)", "**read the** ***ter**ms*"];
    sequences.forEach(sample => {
      const canonical = roundTrip(sample);
      expect(roundTrip(canonical)).toBe(canonical);
      expect(markdownConverter.toHtml(canonical, block)).toBe(markdownConverter.toHtml(sample, block));
    });
  });
});
