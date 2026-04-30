import { Question } from "../src/question";
import { ComponentCollection } from "../src/question_custom";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
describe("a11y", () => {
  test("a11y: aria-required", () => {
    var question = new Question("q1");
    question.isRequired = true;
    expect(question.ariaRequired, "aria-required is true").toBe("true");

    question.isRequired = false;
    expect(question.ariaRequired, "aria-required is false").toBe("false");
  });

  test("a11y: aria-label", () => {
    var json = {
      elements: [
        {
          type: "text",
          title: "Title",
          name: "q1",
          titleLocation: "hidden"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    expect(question.a11y_input_ariaLabel, "aria-label is correct").toBe("Title");
  });

  test.skip("a11y: aria-labelledby", () => {
    var json = {
      elements: [
        {
          type: "text",
          title: "Title",
          name: "q1"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    expect(question.a11y_input_ariaLabel, "aria-label does not exist").toBe(null);
    expect(question.a11y_input_ariaLabelledBy.indexOf("_ariaTitle") !== -1, "aria-labelledby is correct").toBe(true);
  });

  test("a11y: aria-describedbby", () => {
    var json = {
      elements: [
        {
          type: "text",
          title: "Title",
          description: "Description",
          name: "q1"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    expect(question.a11y_input_ariaDescribedBy.indexOf("_ariaDescription") !== -1, "aria-describedbby is correct").toBe(true);
  });

  test("a11y: aria-describedbby: empty and hidden description", () => {
    var json = {
      elements: [
        {
          type: "text",
          title: "Title",
          name: "q1"
        },
        {
          type: "text",
          title: "Title",
          description: "Description",
          name: "q2"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question1 = survey.getQuestionByName("q1");
    expect(question1.a11y_input_ariaDescribedBy, "aria-describedby is null").toBe(null);
    var question2 = survey.getQuestionByName("q2");
    expect(question2.a11y_input_ariaDescribedBy, "aria-describedby is not empty").toBe(question2.id + "_ariaDescription");
    question2.descriptionLocation = "hidden";
    expect(question2.a11y_input_ariaDescribedBy, "aria-describedby is null").toBe(null);
  });

  test("a11y: aria-invalid", () => {
    var question = new Question("q1");
    question.isRequired = true;

    question.validate();
    expect(question.ariaInvalid, "aria-invalid is TRUE because we have errors").toBe("true");

    question.value = "test";
    question.validate();
    expect(question.ariaInvalid, "aria-invalid is FALSE because we don't have any errors").toBe("false");
  });

  test("a11y: aria-errormessage", () => {
    var question = new Question("q1");
    question.isRequired = true;

    question.validate();
    expect(question.ariaErrormessage, "aria-errormessage is NOT NULL because we have errors").toBe(question.id + "_errors");

    question.value = "test";
    question.validate();
    expect(question.ariaErrormessage, "aria-errormessage is NULL because we don't have any errors").toBe(null);
  });

  test("a11y: aria-labelledby", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          choices: [1, 2, 3],
          title: "Title",
          name: "q1",
          isRequired: true
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");

    expect(question.isNewA11yStructure, "new a11y structure").toBe(true);

    expect(question.ariaLabel, "old aria-label is null").toBe(null);
    expect(question.ariaRole, "old aria-role is null").toBe(null);
    expect(question.ariaRequired, "old aria-required is null").toBe(null);
    expect(question.ariaInvalid, "old aria-invalid is null").toBe(null);
    expect(question.ariaLabelledBy, "old aria-labelledby is null").toBe(null);
    expect(question.ariaExpanded, "old aria-expanded is null").toBe(null);
    expect(question.ariaErrormessage, "old aria-errormessage is null").toBe(null);

    expect(question.a11y_input_ariaLabel, "aria-label does not exist because we have a title").toBe(null);
    expect(question.a11y_input_ariaLabelledBy.indexOf("_ariaTitle") !== -1, "aria-labelledby is correct").toBe(true);
    expect(question.a11y_input_ariaRole, "aria-role is radiogroup").toBe("radiogroup");
    expect(question.a11y_input_ariaRequired, "aria-required is true").toBe("true");
    expect(question.a11y_input_ariaInvalid, "aria-invalid is false").toBe("false");
    expect(question.a11y_input_ariaExpanded, "aria-expanded is null").toLooseEqual(null);
    expect(question.a11y_input_ariaErrormessage, "aria-errormessage is null").toBe(null);
  });

  test("a11y: aria-labelledby customquestion Bug#11049", () => {

    ComponentCollection.Instance.add({
      name: "text2",
      defaultQuestionTitle: "Currency",
      questionJSON: {
        "type": "text",
      }
    });

    const config = {
      elements: [
        {
          type: "text2",
          name: "q1",
          title: "Currency (specialized)",
        }
      ]
    };

    var survey = new SurveyModel(config);
    var q1 = survey.getQuestionByName("q1");

    expect(q1.ariaTitleId).toBe(q1.contentQuestion.ariaTitleId);
    expect(q1.ariaDescriptionId).toBe(q1.contentQuestion.ariaDescriptionId);
    expect(q1.commentId).toBe(q1.contentQuestion.commentId);
  });
});
