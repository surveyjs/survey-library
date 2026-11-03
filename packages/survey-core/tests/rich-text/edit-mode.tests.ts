import { settings } from "../../src/settings";
import { RichText } from "../../src/plugins/rich-text/index";
import { isRichTextBoldHidden } from "../../src/plugins/rich-text/edit-mode";
import { SurveyModel } from "../../src/survey";
import { QuestionHtmlModel } from "../../src/question_html";
import { LocalizableString } from "../../src/localizablestring";
import { QuestionTextModel } from "../../src/question_text";

import { describe, expect, test } from "vitest";

describe("edit mode", () => {
  test("description is block, title is inline, and plain or html or a detached owner is none", () => {
    const survey = new SurveyModel({
      stringFormat: "markdown",
      elements: [
        { type: "text", name: "q", title: "Hello", description: "Body" },
        { type: "html", name: "h", html: "<b>x</b>" }
      ]
    });
    const provider = settings.richText;
    const question = survey.getQuestionByName("q");
    expect(provider.getEditMode(question, "description", question.locDescription)).toBe("block");
    expect(provider.getEditMode(question, "title", question.locTitle)).toBe("inline");
    const plain = new SurveyModel({ elements: [{ type: "text", name: "q", title: "Hello" }] });
    const plainQuestion = plain.getQuestionByName("q");
    expect(provider.getEditMode(plainQuestion, "title", plainQuestion.locTitle)).toBe("none");
    const htmlQuestion = survey.getQuestionByName("h") as QuestionHtmlModel;
    const markdownLoc = new LocalizableString(htmlQuestion, true);
    expect(provider.getEditMode(htmlQuestion, "html", markdownLoc)).toBe("none");
    const detached = new QuestionTextModel("free");
    detached.title = "Hello";
    expect(provider.getEditMode(detached, "title", detached.locTitle)).toBe("none");
    expect(provider.getEditMode(question, "title", null)).toBe("none");
  });

  test("RichText.getEditMode can override the default and bold hides at font-weight 600", () => {
    const survey = new SurveyModel({ stringFormat: "markdown", elements: [{ type: "text", name: "q", title: "Hello" }] });
    const question = survey.getQuestionByName("q");
    const previous = RichText.getEditMode;
    RichText.getEditMode = () => "none";
    expect(settings.richText.getEditMode(question, "title", question.locTitle)).toBe("none");
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
