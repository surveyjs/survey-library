import { SurveyModel } from "../src/survey";
import { Base, Event, ArrayChanges } from "../src/base";
import { QuestionTextModel } from "../src/question_text";
import { MatrixDropdownColumn } from "../src/question_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { ExpressionValidator } from "../src/validator";
import {
  QuestionCompositeModel,
  ComponentCollection,
} from "../src/question_custom";
import { QuestionDropdownModel } from "../src/question_dropdown";

export default QUnit.module("Survey.editingObj Tests");

QUnit.test("Edit object property using the survey", function (assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel();
  survey.editingObj = question;
  assert.equal(
    survey.getValue("name"),
    "q1",
    "Get survey value from the object directly"
  );
  survey.setValue("name", "q2");
  assert.equal(question.name, "q2", "The question name was changed via survey");
  question.isRequired = true;
  survey.clearValue("isRequired");
  assert.equal(
    question.isRequired,
    false,
    "isRequired property is default again"
  );
});
QUnit.test("Expression based on object properties", function (assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "text", name: "inputType" },
      { type: "text", name: "min", visibleIf: "{inputType} = 'text'" },
    ],
  });
  survey.editingObj = question;
  assert.equal(survey.getValue("inputType"), "text", "Get the default value");
  var minQuestion = survey.getQuestionByName("min");
  assert.equal(
    minQuestion.isVisible,
    true,
    "min property should be visible by default"
  );
});
QUnit.test("React on property change", function (assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "text", name: "inputType" },
      { type: "text", name: "min", visibleIf: "{inputType} = 'text'" },
    ],
  });
  survey.editingObj = question;
  var minQuestion = survey.getQuestionByName("min");
  assert.equal(
    minQuestion.isVisible,
    true,
    "min property should be visible by default"
  );
  question.inputType = "color";
  assert.equal(minQuestion.isVisible, false, "min property is invisible now");
  question.inputType = "text";
  assert.equal(minQuestion.isVisible, true, "min property is visible again");
});
QUnit.test("Edit question title property", function (assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "comment", name: "title" },
    ],
  });
  survey.editingObj = question;
  assert.equal(question.title, "q1", "the default title value");
  assert.equal(survey.getValue("title"), undefined, "The value is empty");
  survey.setValue("title", "q1 title");
  assert.equal(question.title, "q1 title", "set title property correctly");
  survey.setValue("title", "");
  assert.equal(question.title, "q1", "get title property from name");
});
QUnit.test("Edit columns in matrix", function (assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        columns: [
          { cellType: "text", name: "name" },
          { cellType: "text", name: "title" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new MatrixDropdownColumn("col3");
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  assert.equal(matrix.visibleRows.length, 2, "Two columns");
  assert.equal(
    matrix.visibleRows[0].cells[0].value,
    "col1",
    "Name set correctly"
  );
  matrix.visibleRows[0].cells[1].value = "title1";
  assert.equal(question.columns[0].title, "title1", "Edit title correctly");
  matrix.addRow();
  assert.equal(question.columns.length, 3, "We have 3 columns");
  assert.equal(question.columns[2].name, "col3", "column has correct name");
  assert.equal(
    question.columns[2].getType(),
    "matrixdropdowncolumn",
    "column added with correct type"
  );
});
QUnit.test("Edit validators in matrix", function (assert) {
  var question = new QuestionTextModel("q1");
  //question.validators.push(new ExpressionValidator());
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "validators",
        rowCount: 0,
        columns: [
          {
            cellType: "dropdown",
            name: "validatorType",
            choices: [{ value: "expressionvalidator", text: "expression" }],
          },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("validators")
  );
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ExpressionValidator();
    item["validatorType"] = item.getType();
    sender.value.push(item);
    //question.validators.push(item);
    return item;
  };
  survey.editingObj = question;
  assert.strictEqual(
    matrix.value,
    question.validators,
    "matrix value and validators array is the same object"
  );
  assert.equal(matrix.visibleRows.length, 0, "visibleRows is empty");
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "visibleRows has a row");
  assert.equal(question.validators.length, 1, "Validator is here");
  assert.equal(
    question.validators[0]["validatorType"],
    "expressionvalidator",
    "validator is correct"
  );
  matrix.getDisplayValue(true);
  assert.equal(
    question.validators[0]["validatorType"],
    "expressionvalidator",
    "validator is correct after calling getDisplayValue"
  );
});

QUnit.test("Composite: create from code", function (assert) {
  var json = {
    name: "propertygrid_restfull",
    createElements: function (panel, question) {
      panel.fromJSON({
        elements: [
          { type: "text", name: "url", title: question.title + "_url" },
        ],
      });
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "propertygrid_restfull", name: "choicesByUrl" }],
  });
  var question = new QuestionDropdownModel("q1");
  question.choicesByUrl.url = "myUrl";
  survey.editingObj = question;
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var urlQ = q.contentPanel.questions[0];
  assert.equal(urlQ.value, "myUrl", "Url set correctly from question");
  assert.equal(urlQ.title, "choicesByUrl_url");
  urlQ.value = "myUrl2";
  assert.equal(
    question.choicesByUrl.url,
    "myUrl2",
    "Url set correctly into question"
  );
  ComponentCollection.Instance.clear();
});
