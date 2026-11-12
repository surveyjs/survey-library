import { describe, expect, test } from "vitest";
import { Question } from "../../src/question";
import { SurveyModel } from "../../src/survey";
import { RichText } from "../../src/plugins/rich-text/index";

const stored = "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>";

function names(survey: SurveyModel): string[] {
  const found = RichText.findUnsupported(survey);
  const result: string[] = [];
  for (let i = 0; i < found.length; i++) {
    const element = found[i].element as Question;
    const name = element.name || (element as any).getType();
    if (result.indexOf(name) < 0) result.push(name);
  }
  return result;
}

describe("findUnsupported", () => {
  test("reports disallowed strings in every locale and rich comment answers", () => {
    const survey = new SurveyModel({
      title: "Rich text <strong>demo</strong>",
      description: "<p>Survey description with <em>italic</em> text.</p><p>Second paragraph.</p>",
      elements: [
        { type: "text", name: "s1", title: "Title with <strong>bold</strong>", description: "<p>Line one<br>Line two</p><ul><li>item</li></ul>" },
        { type: "radiogroup", name: "s2", choices: ["<strong>Bold</strong> choice", "Tom & Jerry", "Markdown **is not** rendered"] },
        { type: "text", name: "s3", title: "Raw <b>html</b> and <script>alert(1)</script>" },
        { type: "text", name: "s4", title: "<a href=\"javascript:alert(1)\">js link</a>" },
        { type: "text", name: "s5", title: "Table", description: "<table><tr><td>a</td><td>b</td></tr></table>" },
        { type: "text", name: "s7", title: "Styled string", description: stored },
        { type: "text", name: "s8", description: "Plain line one\nPlain line two", requiredErrorText: "<table><tr><td>no</td></tr></table>" },
        { type: "richtext", name: "plain", defaultValue: "Typed: a < b & c\nSecond line" },
        { type: "richtext", name: "c_unsupported", defaultValue: stored }
      ]
    });
    const s3 = survey.getQuestionByName("s3");
    s3.locTitle.setLocaleText("de", "<table><tr><td>zeile</td></tr></table>");

    const found = names(survey);
    expect(found).toEqual(expect.arrayContaining(["s3", "s4", "s5", "s7", "c_unsupported"]));
    expect(found).not.toContain("s1");
    expect(found).not.toContain("s2");
    expect(found).not.toContain("s8");
    expect(found).not.toContain("plain");

    const german = RichText.findUnsupported(survey).filter(item => item.element === s3 && item.locale === "de");
    expect(german.length).toBe(1);
    expect(german[0].name).toBe("title");
  });
});
