import { SurveyModel } from "../src/survey";
import { QuestionCommentModel } from "../src/question_comment";
import { SurveyElement } from "../src/survey-element";

import { describe, test, expect } from "vitest";
describe("Comment question", () => {
  test("A Comment displays undefined when resetting the value", () => {
    let json = {
      "elements": [
        {
          "type": "comment",
          "name": "billing-address",
          "title": "Billing address",
          "rows": 2
        },
        {
          "type": "boolean",
          "name": "shipping-same-as-billing",
          "title": "Shipping address same as billing",
          "defaultValue": "true"
        },
        {
          "type": "comment",
          "name": "shipping-address",
          "title": "Shipping address",
          "enableIf": "{shipping-same-as-billing} = false",
          "resetValueIf": "{shipping-same-as-billing} = false",
          "setValueIf": "{shipping-same-as-billing} = true",
          "setValueExpression": "{billing-address}",
          "rows": 2
        }
      ],
      "showQuestionNumbers": "off",
      "textUpdateMode": "onTyping"
    };
    let survey = new SurveyModel(json);
    let comment1 = survey.getQuestionByName("billing-address") as QuestionCommentModel;
    let comment2 = survey.getQuestionByName("shipping-address") as QuestionCommentModel;
    let boolQuestion = survey.getQuestionByName("shipping-same-as-billing");
    const textArea1 = document.createElement("textarea");
    const textArea2 = document.createElement("textarea");
    comment1.textAreaModel.setElement(textArea1);
    comment2.textAreaModel.setElement(textArea2);

    expect(comment1.value, "commnet 1 value #1").toBe(undefined);
    expect(comment2.value, "commnet 2 value #1").toBe(undefined);
    expect(boolQuestion.value, "boolQuestion value #1").toBe(true);
    expect(textArea1.value, "textArea 1 value #1").toBe("");
    expect(textArea2.value, "textArea 2 value #1").toBe("");

    comment1.value = "test";
    expect(comment1.value, "commnet 1 value #2").toBe("test");
    expect(comment2.value, "commnet 2 value #2").toBe("test");
    expect(boolQuestion.value, "boolQuestion value #2").toBe(true);
    expect(textArea1.value, "textArea 1 value #2").toBe("test");
    expect(textArea2.value, "textArea 2 value #2").toBe("test");

    boolQuestion.value = false;
    expect(comment1.value, "commnet 1 value #3").toBe("test");
    expect(comment2.value, "commnet 2 value #3").toBe(undefined);
    expect(boolQuestion.value, "boolQuestion value #3").toBe(false);
    expect(textArea1.value, "textArea 1 value #3").toBe("test");
    expect(textArea2.value, "textArea 2 value #3").toBe("");

    textArea1.remove();
    textArea2.remove();
  });
  test("The text length validation error occurs when the minLength validator is enabled and 'allowDigits' is false Bug#8988", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "q1",
          validators: [
            { type: "text", minLength: 5,
              allowDigits: false
            }
          ]
        }
      ]
    });
    const q1 = <QuestionCommentModel>survey.getQuestionByName("q1");
    q1.value = "abcdedf";
    survey.validate(true);
    expect(q1.errors.length, "No errors").toBe(0);
    q1.value = "123456";
    survey.validate(true);
    expect(q1.errors.length, "There are errors").toBe(1);
    expect(q1.errors[0].text, "No digits allowing").toBe("Numbers are not allowed.");
  });
  test("Collapse/expand/read-only & focus Bug#10434", () => {
    const focusFunc = SurveyElement.FocusElement;
    let focusedQuestionId = "";
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "q1", state: "expanded", readOnly: true, defaultValue: "test" }
      ]
    });
    const q1 = <QuestionCommentModel>survey.getQuestionByName("q1");
    expect(q1.isReadOnly, "The question is read-only").toBe(true);
    expect(q1.isExpanded, "The question is expanded").toBe(true);
    q1.collapse();
    expect(q1.isCollapsed, "The question is collapsed").toBe(true);
    q1.expand();
    q1.focus();
    expect(q1.isExpanded, "The question is expanded again").toBe(true);
    expect(focusedQuestionId, "The question is not focused").toBe("");
    SurveyElement.FocusElement = focusFunc;
  });

  test("Textarea read-only ignores forceIsInputReadOnly Bug#7372", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "q1" }
      ]
    });
    const q1 = <QuestionCommentModel>survey.getQuestionByName("q1");
    q1.forceIsInputReadOnly = true;
    const textArea = q1.textAreaModel;
    expect(textArea.isReadOnlyAttr, "The textarea is read-only").toBe(true);
    expect(textArea.isDisabledAttr, "The textarea is not disabled").toBe(false);
    expect(q1.isReadOnly, "The question is not read-only").toBe(false);
  });
});
