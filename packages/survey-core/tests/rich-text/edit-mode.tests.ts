import { RichText } from "../../src/plugins/rich-text/index";
import { isRichTextBoldHidden } from "../../src/plugins/rich-text/edit-mode";
import { SurveyModel } from "../../src/survey";
import { QuestionHtmlModel } from "../../src/question_html";
import { LocalizableString } from "../../src/localizablestring";
import { QuestionTextModel } from "../../src/question_text";

import { describe, expect, test } from "vitest";

describe("edit mode", () => {
  test("description is block, title is inline, and an html property is none", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q", title: "Hello", description: "Body" },
        { type: "html", name: "h", html: "<b>x</b>" }
      ]
    });
    const question = survey.getQuestionByName("q");
    expect(RichText.getStringEditMode(question, "description", question.locDescription)).toBe("block");
    expect(RichText.getStringEditMode(question, "title", question.locTitle)).toBe("inline");
    const htmlQuestion = survey.getQuestionByName("h") as QuestionHtmlModel;
    const markdownLoc = new LocalizableString(htmlQuestion, true);
    expect(RichText.getStringEditMode(htmlQuestion, "html", markdownLoc)).toBe("none");
    const detached = new QuestionTextModel("free");
    detached.title = "Hello";
    expect(RichText.getStringEditMode(detached, "title", detached.locTitle)).toBe("inline");
    expect(RichText.getStringEditMode(question, "title", null)).toBe("none");
  });

  test("RichText.getEditMode can override the default and bold hides at font-weight 600", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", title: "Hello" }] });
    const question = survey.getQuestionByName("q");
    const previous = RichText.getEditMode;
    RichText.getEditMode = () => "none";
    expect(RichText.getStringEditMode(question, "title", question.locTitle)).toBe("none");
    RichText.getEditMode = previous;
    const element = document.createElement("div");
    document.body.appendChild(element);
    element.style.fontWeight = "400";
    expect(isRichTextBoldHidden(element)).toBe(false);
    element.style.fontWeight = "700";
    expect(isRichTextBoldHidden(element)).toBe(true);
    element.remove();
  });
});
