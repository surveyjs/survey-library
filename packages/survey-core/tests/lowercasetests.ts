import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { QuestionTextModel } from "../src/question_text";
import { MultipleTextItemModel } from "../src/question_multipletext";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { QuestionSelectBase } from "../src/question_baseselect";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";

export default QUnit.module("SurveyLowercase");

QUnit.test("inputType value is always lower-case", function (assert) {
  var question = new QuestionTextModel("text");
  question.inputType = "TEXT";
  assert.strictEqual(question.inputType, "text");
});

QUnit.test("inputType value is always lower-case", function (assert) {
  var question = new QuestionTextModel("text");
  question.inputType = "DATETIME_LOCAL";
  assert.strictEqual(question.inputType, "datetime-local");
});

QUnit.test("choicesOrder value is always lower-case", function (assert) {
  var question = new QuestionSelectBase("base");
  question.choicesOrder = "RANDOM";
  assert.strictEqual(question.choicesOrder, "random");
});

QUnit.test("navigationButtonsVisibility value is always lower-case", function (
  assert
) {
  var question = new PageModel("base");
  assert.strictEqual(question.navigationButtonsVisibility, "inherit");
  assert.strictEqual(question.showNavigationButtons, undefined);
  question.navigationButtonsVisibility = "HIDE";
  assert.strictEqual(question.navigationButtonsVisibility, "hide");
  assert.strictEqual(question.showNavigationButtons, false);
  question.navigationButtonsVisibility = "Inherit";
  assert.strictEqual(question.navigationButtonsVisibility, "inherit");
  assert.strictEqual(question.showNavigationButtons, undefined);
});

QUnit.test(
  "MatrixDropdownColumn inputType value is always lower-case",
  function (assert) {
    var question = new MatrixDropdownColumn("text");
    question.cellType = "text";
    question["inputType"] = "TEXT";
    assert.strictEqual(question["inputType"], "text");
  }
);

QUnit.test("MatrixDropdownColumn cellType value is always lower-case", function (
  assert
) {
  var question = new MatrixDropdownColumn("base");
  question.cellType = "CHECKBOX";
  assert.strictEqual(question.cellType, "checkbox");
});

QUnit.test(
  "MatrixDropdownColumn choicesOrder value is always lower-case",
  function (assert) {
    var question = new MatrixDropdownColumn("base");
    question["choicesOrder"] = "RANDOM";
    assert.strictEqual(question["choicesOrder"], "random");
  }
);

QUnit.test(
  "QuestionMatrixDropdownModelBase cellType value is always lower-case",
  function (assert) {
    var question = new QuestionMatrixDropdownModelBase("base");
    question.cellType = "RADIOGROUP";
    assert.strictEqual(question.cellType, "radiogroup");
  }
);

QUnit.test(
  "MultipleTextItemModel inputType value is always lower-case",
  function (assert) {
    var question = new MultipleTextItemModel("text");
    question.inputType = "COLOR";
    assert.strictEqual(question.inputType, "color");
  }
);

QUnit.test(
  "SurveyModel showQuestionNumbers value is always lower-case",
  function (assert) {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "OFF";
    assert.strictEqual(survey.showQuestionNumbers, "off");
  }
);

QUnit.test(
  "SurveyModel showQuestionNumbers value handles onPage special case",
  function (assert) {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "ONPAGE";
    assert.strictEqual(survey.showQuestionNumbers, "onPage");
  }
);

QUnit.test(
  "SurveyModel questionTitleLocation value is always lower-case",
  function (assert) {
    var survey = new SurveyModel();
    survey.questionTitleLocation = "BOTTOM";
    assert.strictEqual(survey.questionTitleLocation, "bottom");
  }
);

QUnit.test("SurveyModel showProgressBar value is always lower-case", function (assert) {
  var survey = new SurveyModel();
  assert.equal(survey.showProgressBar, false);
  assert.strictEqual(survey.progressBarLocation, "auto");
  assert.equal(survey.isShowProgressBarOnTop, false);
  survey.showProgressBar = "TOP";
  assert.strictEqual(survey.progressBarLocation, "top");
  assert.equal(survey.isShowProgressBarOnTop, true);
});

QUnit.test("SurveyModel mode value is always lower-case", function (assert) {
  var survey = new SurveyModel();
  survey.mode = "DISPLAY";
  assert.strictEqual(survey.mode, "display");
});
