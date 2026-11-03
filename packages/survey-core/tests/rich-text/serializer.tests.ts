import { RichText } from "../../src/plugins/rich-text/index";
import { createDetachedElement } from "../../src/plugins/rich-text/runs";

import { describe, expect, test } from "vitest";

function sourceOf(html: string): string {
  return RichText.getFormat("markdown").toSource(createDetachedElement(html), { inline: false });
}

describe("markdown serializer", () => {
  test("normalizes tags, moves whitespace and keeps the worked example", () => {
    expect(sourceOf("<b>a</b>")).toBe("**a**");
    expect(sourceOf("<strong>word </strong>")).toBe("**word** ");
    expect(sourceOf("Please <strong>read the</strong> <em><strong>ter</strong>ms</em> carefully")).toBe(
      "Please **read the** ***ter**ms* carefully"
    );
    expect(sourceOf("Please <strong>r</strong>ead the <em>terms</em> carefully")).toBe(
      "Please **r**ead the *terms* carefully"
    );
  });

  test("link is outermost, lists are marked and special characters are escaped", () => {
    expect(sourceOf("<a href=\"https://surveyjs.io\"><strong>a</strong></a>")).toBe("[**a**](https://surveyjs.io)");
    expect(sourceOf("<ul><li>one</li><li>two</li></ul>")).toBe("- one\n- two");
    expect(sourceOf("<ol><li>one</li><li>two</li></ol>")).toBe("1. one\n2. two");
    expect(sourceOf("- item")).toBe("\\- item");
    expect(sourceOf("a*b")).toBe("a\\*b");
    expect(sourceOf("")).toBe("");
    expect(sourceOf("<span style=\"color:red\">x</span>")).toBe("x");
    expect(sourceOf("<div>one</div><div>two</div>")).toBe("one\n\ntwo");
  });
});
