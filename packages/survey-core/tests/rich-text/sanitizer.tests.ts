import { RichText } from "../../src/plugins/rich-text/index";
import { DomDocumentHelper } from "../../src/global_variables_utils";

import { describe, expect, test } from "vitest";

describe("html sanitizer", () => {
  test("keeps canonical tags, unwraps unknown elements and drops dangerous ones", () => {
    expect(RichText.sanitizeHtml("<b>a</b><em>b</em>")).toBe("<strong>a</strong><em>b</em>");
    expect(RichText.sanitizeHtml("<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>")).toBe("<p>Red</p><p>cell</p>");
    expect(RichText.sanitizeHtml("<span style=\"color:red\">x</span>")).toBe("x");
    expect(RichText.sanitizeHtml("<script>alert(1)</script>kept")).toBe("kept");
    expect(RichText.sanitizeHtml("<a href=\"javascript:alert(1)\">x</a>")).toBe("x");
    expect(RichText.sanitizeHtml("<a href=\"https://surveyjs.io\" onclick=\"alert(1)\">x</a>")).toBe(
      "<a href=\"https://surveyjs.io\" target=\"_blank\" rel=\"noopener noreferrer\">x</a>"
    );
    const host = document.createElement("div");
    host.innerHTML = RichText.sanitizeHtml("<a href=\"https://x.com&quot; onclick=alert(1)\">x</a>");
    const anchor = host.querySelector("a");
    expect(anchor.getAttribute("onclick")).toBeNull();
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(RichText.sanitizeHtml("<a href=\"https://x\" target=\"_blank\" rel=\"noopener\">x</a>")).toBe(
      "<a href=\"https://x\" target=\"_blank\" rel=\"noopener noreferrer\">x</a>"
    );
  });

  test("getDisallowedHtml reports what the sanitizer removes or unwraps", () => {
    expect(RichText.getDisallowedHtml("<b>a</b>")).toEqual([]);
    expect(RichText.getDisallowedHtml("<span style=\"color:red\">x</span>")).toEqual(["style", "span"]);
    expect(RichText.getDisallowedHtml("<a href=\"https://x\" target=\"_blank\" rel=\"noopener\">x</a>")).toEqual([]);
  });

  test("inline context joins blocks with line breaks", () => {
    expect(RichText.sanitizeHtml("<p>a</p><ul><li>b</li><li>c</li></ul>", { inline: true })).toBe("a<br>b<br>c");
    expect(RichText.sanitizeHtml("<p>a</p><p>b</p>")).toBe("<p>a</p><p>b</p>");
  });

  test("without a DOM, sanitizeHtml returns an empty string and reports nothing", () => {
    const original = DomDocumentHelper.isAvailable;
    DomDocumentHelper.isAvailable = () => false;
    try {
      expect(RichText.sanitizeHtml("<b>a</b>")).toBe("");
      expect(RichText.getDisallowedHtml("<span style=\"color:red\">x</span>")).toEqual([]);
    } finally {
      DomDocumentHelper.isAvailable = original;
    }
  });

  test("RichText has no format registry", () => {
    expect((RichText as any).getFormat).toBeUndefined();
    expect((RichText as any).registerFormat).toBeUndefined();
  });
});
