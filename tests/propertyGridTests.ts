import { SurveyModel } from "../src/survey";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionTextModel } from "../src/question_text";
import { PropertyGridModel } from "../src/propertyGrid";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

export default QUnit.module("Property Grid");

QUnit.test("Create survey with editingObj", function (assert) {
  var question = new QuestionTextModel("q1");
  var propertyGrid = new PropertyGridModel(question);
  assert.equal(
    propertyGrid.survey.getValue("name"),
    "q1",
    "name property value is set"
  );
  var nameQuestion = propertyGrid.survey.getQuestionByName("name");
  assert.ok(nameQuestion, "property for name is created");
  nameQuestion.value = "q2";
  assert.equal(question.name, "q2", "Value has been changed correctly");
});
QUnit.test("boolean property editor (boolean/switch)", function (assert) {
  var question = new QuestionTextModel("q1");
  var propertyGrid = new PropertyGridModel(question);
  var startWithNewLineQuestion = propertyGrid.survey.getQuestionByName(
    "startWithNewLine"
  );
  var isRequiredQuestion = propertyGrid.survey.getQuestionByName("isRequired");
  assert.ok(
    startWithNewLineQuestion,
    "property for startWithNewLine is created"
  );
  assert.ok(isRequiredQuestion, "property for isRequired is created");
  assert.equal(
    startWithNewLineQuestion.getType(),
    "boolean",
    "property for startWithNewLine is created"
  );
  assert.equal(
    isRequiredQuestion.getType(),
    "boolean",
    "property for isRequired is created"
  );
  assert.equal(
    startWithNewLineQuestion.value,
    true,
    "startWithNewLine default value is true"
  );
  assert.equal(
    isRequiredQuestion.value,
    false,
    "isRequired default value is false"
  );
  question.isRequired = true;
  assert.equal(isRequiredQuestion.value, true, "isRequired is true now");
  isRequiredQuestion.value = false;
  assert.equal(
    question.isRequired,
    false,
    "isRequired is false again - two way bindings"
  );
});
QUnit.test("dropdown property editor", function (assert) {
  var question = new QuestionTextModel("q1");
  var propertyGrid = new PropertyGridModel(question);
  var titleLocationQuestion = propertyGrid.survey.getQuestionByName(
    "titleLocation"
  );
  assert.equal(
    titleLocationQuestion.getType(),
    "dropdown",
    "correct property editor is created"
  );
  assert.equal(
    titleLocationQuestion.choices.length,
    5,
    "There are five choices"
  );
  assert.equal(titleLocationQuestion.value, "default", "the value is correct");
  question.titleLocation = "top";
  assert.equal(
    titleLocationQuestion.value,
    "top",
    "property editor react on value chage"
  );
  titleLocationQuestion.value = "bottom";
  assert.equal(
    question.titleLocation,
    "bottom",
    "property editor change the question property"
  );
});
QUnit.test("itemvalue[] property editor", function (assert) {
  var question = new QuestionDropdownModel("q1");
  question.choices = [1, 2, 3];
  var propertyGrid = new PropertyGridModel(question);
  var choicesQuestion = <QuestionMatrixDynamicModel>(
    propertyGrid.survey.getQuestionByName("choices")
  );
  assert.ok(choicesQuestion, "choices property editor created");
  assert.equal(choicesQuestion.getType(), "matrixdynamic", "It is a matrix");
  assert.equal(choicesQuestion.columns.length, 2, "There are two columns");
  assert.equal(
    choicesQuestion.visibleRows.length,
    3,
    "There are three elements"
  );
  assert.equal(
    choicesQuestion.visibleRows[0].cells[0].value,
    1,
    "the first cell value is 3"
  );
  choicesQuestion.addRow();
  choicesQuestion.visibleRows[3].cells[0].value = 4;
  assert.equal(question.choices.length, 4, "There are 4 items now");
  assert.equal(question.choices[3].value, 4, "The last item value is 4");
  question.choices[1].text = "Item 2";
  assert.equal(
    choicesQuestion.visibleRows[1].cells[1].value,
    "Item 2",
    "the second cell in second row is correct"
  );
  question.choices[2].value = 333;
  assert.equal(
    choicesQuestion.visibleRows[2].cells[0].value,
    333,
    "the first cell in third row is correct"
  );
});
QUnit.test("itemvalue[] property editor + detail panel", function (assert) {
  var question = new QuestionDropdownModel("q1");
  question.choices = [1, 2, 3];
  var propertyGrid = new PropertyGridModel(question);
  var choicesQuestion = <QuestionMatrixDynamicModel>(
    propertyGrid.survey.getQuestionByName("choices")
  );
  var row = choicesQuestion.visibleRows[0];
  assert.equal(row.hasPanel, true, "There is a detail panel here");
  row.showDetailPanel();
  assert.ok(row.detailPanel, "Detail panel is showing");
  assert.ok(
    row.detailPanel.getQuestionByName("value"),
    "value property is here"
  );
});

QUnit.test("column[] property editor", function (assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  question.addColumn("col3");
  var propertyGrid = new PropertyGridModel(question);
  var columnsQuestion = <QuestionMatrixDynamicModel>(
    propertyGrid.survey.getQuestionByName("columns")
  );
  assert.ok(columnsQuestion, "choices property editor created");
  assert.equal(columnsQuestion.getType(), "matrixdynamic", "It is a matrix");
  assert.equal(columnsQuestion.columns.length, 3, "There are three columns");
  assert.equal(
    columnsQuestion.columns[0].cellType,
    "dropdown",
    "Correct cell type created for cellType property"
  );
  assert.equal(
    columnsQuestion.visibleRows.length,
    3,
    "There are three elements"
  );
  assert.equal(
    columnsQuestion.visibleRows[0].cells[0].value,
    "default",
    "the first cell value is 'default'"
  );
  assert.equal(
    columnsQuestion.visibleRows[0].cells[1].value,
    "col1",
    "the second cell value is 'col1'"
  );
  columnsQuestion.visibleRows[0].cells[1].value = "col11";
  assert.equal(
    question.columns[0].name,
    "col11",
    "column name has been changed"
  );

  columnsQuestion.addRow();
  assert.equal(question.columns.length, 4, "There are 4 items now");
  assert.equal(
    question.columns[3].getType(),
    "matrixdropdowncolumn",
    "Object created correctly"
  );

  question.columns[1].title = "Column 2";
  assert.equal(
    columnsQuestion.visibleRows[1].cells[2].value,
    "Column 2",
    "the third cell in second row is correct"
  );

  question.columns[2].cellType = "text";
  assert.equal(
    columnsQuestion.visibleRows[2].cells[0].value,
    "text",
    "react on changing column cell type"
  );
  columnsQuestion.visibleRows[2].cells[0].value = "checkbox";
  assert.equal(
    question.columns[2].cellType,
    "checkbox",
    "change column cell type in matrix"
  );
});

QUnit.test("Change editingObj of the property grid", function (assert) {
  var question = new QuestionTextModel("q1");
  var question2 = new QuestionTextModel("q2");
  var propertyGrid = new PropertyGridModel(question);
  assert.equal(
    propertyGrid.survey.getValue("name"),
    "q1",
    "name property value is set for the first editingObj"
  );
  propertyGrid.obj = question2;
  assert.equal(
    propertyGrid.survey.getValue("name"),
    "q2",
    "name property value is set for the second editingObj"
  );
});
QUnit.test("Check objValueChangedCallback", function (assert) {
  var count = 0;
  var objValueChangedCallback = () => {
    count++;
  };
  var question = new QuestionTextModel("q1");
  var question2 = new QuestionTextModel("q2");
  var propertyGrid = new PropertyGridModel(question);
  propertyGrid.objValueChangedCallback = objValueChangedCallback;
  assert.equal(count, 0, "objValueChangedCallback isn't called");
  propertyGrid.obj = question2;
  assert.equal(
    count,
    1,
    "objValueChangedCallback is called after changing obj value"
  );
  propertyGrid.obj = question2;
  assert.equal(
    count,
    1,
    "objValueChangedCallback isn't called after setting same obj value"
  );
  propertyGrid.obj = question;
  assert.equal(
    count,
    2,
    "objValueChangedCallback is called after changing obj value"
  );
});
