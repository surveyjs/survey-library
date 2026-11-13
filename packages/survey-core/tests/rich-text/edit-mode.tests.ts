import { describe, expect, test } from "vitest";
import { QuestionCommentModel } from "../../src/question_comment";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { PageModel } from "../../src/page";
import { Serializer } from "../../src/jsonobject";
import { RichText } from "../../src/plugins/rich-text/index";
import { getCommentEditMode } from "../../src/plugins/rich-text/edit-mode";
import { LocalizableString } from "../../src/localizablestring";

describe("getStringEditMode", () => {
  test("html is block and inlinehtml is inline", () => {
    const survey = new SurveyModel();
    const completed = new LocalizableString(survey, false, "completedHtml");
    expect(RichText.getStringEditMode(survey, "completedHtml", completed)).toBe("block");

    const pageDescription = Serializer.findProperty("page", "description");
    const previous = pageDescription.type;
    pageDescription.type = "html";
    Serializer.addProperty("survey", { name: "promo:inlinehtml" });
    try {
      const page = new PageModel("page");
      expect(RichText.getStringEditMode(page, "description", page.locDescription)).toBe("block");
      const promo = new LocalizableString(survey, false, "promo");
      expect(RichText.getStringEditMode(survey, "promo", promo)).toBe("inline");
    } finally {
      pageDescription.type = previous;
      Serializer.removeProperty("survey", "promo");
    }
  });

  test("text, string and a missing property are none", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "radiogroup", name: "s2", title: "Plain",
        choices: ["One"]
      }]
    });
    const question = survey.getQuestionByName("s2");
    expect(RichText.getStringEditMode(question, "title", question.locTitle)).toBe("none");
    expect(RichText.getStringEditMode(question, "description", question.locDescription)).toBe("none");
    expect(RichText.getStringEditMode(survey, "title", survey.locTitle)).toBe("none");
    const choice = (question as any).choices[0];
    expect(RichText.getStringEditMode(choice, "text", choice.locText)).toBe("none");

    const text = new QuestionTextModel("q");
    expect(RichText.getStringEditMode(text, "requiredErrorText", text.locRequiredErrorText)).toBe("none");
    expect(RichText.getStringEditMode(text, "missing", text.locTitle)).toBe("none");
  });

  test("getEditMode replaces the default", () => {
    const question = new QuestionTextModel("q");
    const original = RichText.getEditMode;
    RichText.getEditMode = () => "inline";
    try {
      expect(RichText.getStringEditMode(question, "title", question.locTitle)).toBe("inline");
    } finally {
      RichText.getEditMode = original;
    }
  });

  test("a comment answer is inline only when carriage return is off", () => {
    const question = new QuestionCommentModel("c");
    expect(getCommentEditMode(question)).toBe("block");
    question.acceptCarriageReturn = false;
    expect(getCommentEditMode(question)).toBe("inline");
  });
});
