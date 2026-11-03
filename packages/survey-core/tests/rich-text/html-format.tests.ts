import { RichText } from "../../src/plugins/rich-text/index";
import { createDetachedElement } from "../../src/plugins/rich-text/runs";
import { DomDocumentHelper } from "../../src/global_variables_utils";

import { describe, expect, test } from "vitest";

const block = { inline: false };

describe("html allow-list", () => {
  test("keeps canonical tags, unwraps unknown elements and drops dangerous ones", () => {
    const html = RichText.getFormat("html");
    expect(html.toHtml("<b>a</b><em>b</em>", block)).toBe("<strong>a</strong><em>b</em>");
    expect(html.toHtml("<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>", block)).toBe("<p>Red</p><p>cell</p>");
    expect(html.toHtml("<span style=\"color:red\">x</span>", block)).toBe("x");
    expect(html.toHtml("<script>alert(1)</script>kept", block)).toBe("kept");
    expect(html.toHtml("<a href=\"javascript:alert(1)\">x</a>", block)).toBe("x");
    expect(html.toHtml("<a href=\"https://surveyjs.io\" onclick=\"alert(1)\">x</a>", block)).toBe(
      "<a href=\"https://surveyjs.io\" target=\"_blank\" rel=\"noopener noreferrer\">x</a>"
    );
    const host = document.createElement("div");
    host.innerHTML = html.toHtml("<a href=\"https://x.com&quot; onclick=alert(1)\">x</a>", block);
    const anchor = host.querySelector("a");
    expect(anchor.getAttribute("onclick")).toBeNull();
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(html.getUnsupported("<span style=\"color:red\">x</span>")).toEqual(["style", "span"]);
    expect(html.checkLossless("<b>a</b>", block)).toBe(true);
    expect(html.checkLossless("<span style=\"color:red\">x</span>", block)).toBe(false);
  });

  test("toSource writes canonical html without link target", () => {
    const html = RichText.getFormat("html");
    expect(html.toSource(createDetachedElement("<b>a</b><br>b"), block)).toBe("<strong>a</strong><br>b");
  });

  test("without a DOM, toHtml returns an empty string", () => {
    const original = DomDocumentHelper.isAvailable;
    DomDocumentHelper.isAvailable = () => false;
    try {
      expect(RichText.getFormat("html").toHtml("<b>a</b>", block)).toBe("");
      expect(RichText.isLossless("<span style=\"color:red\">x</span>", "html", block)).toBe(true);
    } finally {
      DomDocumentHelper.isAvailable = original;
    }
  });
});
