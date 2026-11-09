import { describe, expect, test } from "vitest";
import { QuestionCommentModel } from "../../src/question_comment";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { RichText } from "../../src/plugins/rich-text/index";
import { getCommentEditMode } from "../../src/plugins/rich-text/edit-mode";
import { LocalizableString } from "../../src/localizablestring";

describe("getStringEditMode", () => {
  test("text properties are block and string properties are inline", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "radiogroup", name: "s2", title: "Plain",
        choices: ["One"]
      }]
    });
    const question = survey.getQuestionByName("s2");
    expect(RichText.getStringEditMode(question, "title", question.locTitle)).toBe("block");
    expect(RichText.getStringEditMode(question, "description", question.locDescription)).toBe("block");
    const choice = (question as any).choices[0];
    expect(RichText.getStringEditMode(choice, "text", choice.locText)).toBe("inline");
    expect(RichText.getStringEditMode(survey, "title", survey.locTitle)).toBe("inline");
  });

  test("useMarkdown false and html properties are none", () => {
    const question = new QuestionTextModel("q");
    expect(question.locRequiredErrorText.useMarkdown).toBeFalsy();
    expect(RichText.getStringEditMode(question, "requiredErrorText", question.locRequiredErrorText)).toBe("none");

    const survey = new SurveyModel();
    const html = new LocalizableString(survey, true, "completedHtml");
    expect(RichText.getStringEditMode(survey, "completedHtml", html)).toBe("none");
  });

  test("a question that is not on a survey still resolves by property type", () => {
    const question = new QuestionTextModel("q");
    expect(question.survey).toBeFalsy();
    expect(RichText.getStringEditMode(question, "title", question.locTitle)).toBe("block");
    expect(RichText.getStringEditMode(question, "missing", question.locTitle)).toBe("inline");
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
