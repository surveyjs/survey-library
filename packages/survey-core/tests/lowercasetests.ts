import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { QuestionTextModel } from "../src/question_text";
import { MultipleTextItemModel } from "../src/question_multipletext";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { QuestionSelectBase } from "../src/question_baseselect";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";

import { describe, test, expect } from "vitest";
describe("SurveyLowercase", () => {
  test("inputType value is always lower-case", () => {
    var question = new QuestionTextModel("text");
    question.inputType = "TEXT";
    expect(question.inputType).toBe("text");
  });

  test("inputType value is always lower-case", () => {
    var question = new QuestionTextModel("text");
    question.inputType = "DATETIME_LOCAL";
    expect(question.inputType).toBe("datetime-local");
  });

  test("choicesOrder value is always lower-case", () => {
    var question = new QuestionSelectBase("base");
    question.choicesOrder = "RANDOM";
    expect(question.choicesOrder).toBe("random");
  });

  test("navigationButtonsVisibility value is always lower-case", () => {
    var question = new PageModel("base");
    expect(question.navigationButtonsVisibility).toBe("inherit");
    expect(question.showNavigationButtons).toBe(undefined);
    question.navigationButtonsVisibility = "HIDE";
    expect(question.navigationButtonsVisibility).toBe("hide");
    expect(question.showNavigationButtons).toBe(false);
    question.navigationButtonsVisibility = "Inherit";
    expect(question.navigationButtonsVisibility).toBe("inherit");
    expect(question.showNavigationButtons).toBe(undefined);
  });

  test("MatrixDropdownColumn inputType value is always lower-case", () => {
    var question = new MatrixDropdownColumn("text");
    question.cellType = "text";
    question["inputType"] = "TEXT";
    expect(question["inputType"]).toBe("text");
  });

  test("MatrixDropdownColumn cellType value is always lower-case", () => {
    var question = new MatrixDropdownColumn("base");
    question.cellType = "CHECKBOX";
    expect(question.cellType).toBe("checkbox");
  });

  test("MatrixDropdownColumn choicesOrder value is always lower-case", () => {
    var question = new MatrixDropdownColumn("base");
    question["choicesOrder"] = "RANDOM";
    expect(question["choicesOrder"]).toBe("random");
  });

  test("QuestionMatrixDropdownModelBase cellType value is always lower-case", () => {
    var question = new QuestionMatrixDropdownModelBase("base");
    question.cellType = "RADIOGROUP";
    expect(question.cellType).toBe("radiogroup");
  });

  test("MultipleTextItemModel inputType value is always lower-case", () => {
    var question = new MultipleTextItemModel("text");
    question.inputType = "COLOR";
    expect(question.inputType).toBe("color");
  });

  test("SurveyModel showQuestionNumbers value is always lower-case", () => {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "OFF";
    expect(survey.showQuestionNumbers).toBe("off");
  });

  test("SurveyModel showQuestionNumbers value handles onPage special case", () => {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "ONPAGE";
    expect(survey.showQuestionNumbers).toBe("onPage");
  });

  test("SurveyModel questionTitleLocation value is always lower-case", () => {
    var survey = new SurveyModel();
    survey.questionTitleLocation = "BOTTOM";
    expect(survey.questionTitleLocation).toBe("bottom");
  });

  test("SurveyModel showProgressBar value is always lower-case", () => {
    var survey = new SurveyModel();
    expect(survey.showProgressBar).toBe(false);
    expect(survey.progressBarLocation).toBe("auto");
    expect(survey.isShowProgressBarOnTop).toBe(false);
    survey.showProgressBar = "TOP";
    expect(survey.progressBarLocation).toBe("top");
    expect(survey.isShowProgressBarOnTop).toBe(true);
  });

  test("SurveyModel mode value is always lower-case", () => {
    var survey = new SurveyModel();
    survey.mode = "DISPLAY";
    expect(survey.mode).toBe("display");
  });
});
