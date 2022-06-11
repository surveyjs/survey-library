import { Serializer } from "../src/jsonobject";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_QuestionMatrixDropdownBase");

QUnit.test(" 213 123sad d213 sadsd", function (assert) {
  const matrix = new QuestionMatrixDropdownModelBase("q1");

  assert.equal(matrix["generatedVisibleRows"], null, "generatedVisibleRows is null");
  assert.deepEqual(matrix.getAllErrors(), [], "getAllErrors method doesn't fall");
});
QUnit.test("allowAdaptiveActions", function (assert) {
  const matrix = new QuestionMatrixDropdownModelBase("q1");
  assert.equal(matrix.allowAdaptiveActions, false, "matrix.allowAdaptiveActions");
  assert.equal(matrix.getPanel()["allowAdaptiveActions"], true, "matrix.panel.allowAdaptiveActions");

  matrix.allowAdaptiveActions = false;
  assert.equal(matrix.allowAdaptiveActions, false, "matrix.allowAdaptiveActions");
  assert.equal(matrix.getPanel()["allowAdaptiveActions"], false, "matrix.panel.allowAdaptiveActions");

});

QUnit.test("verticalLayout when isMobile set 'true'", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        rowCount: 2,
        columnLayout: "vertical",
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  matrix.renderedTable;
  assert.ok(!!matrix["renderedTableValue"]);
  assert.notOk(matrix.isColumnLayoutHorizontal);
  matrix.isMobile = true;
  assert.ok(matrix.isColumnLayoutHorizontal);
  assert.notOk(!!matrix["renderedTableValue"]);
});
QUnit.test("Change templateQuestion on changing cellType faster reacting onPropertyChanged", function (assert) {
  const column = new MatrixDropdownColumn("col1");
  assert.equal(column.cellType, "default");
  assert.equal(column.templateQuestion.getType(), "dropdown");
  column.registerFunctionOnPropertyValueChanged("cellType", () => {
    assert.equal(column.cellType, "text");
    assert.equal(column.templateQuestion.getType(), "text");
  });
  column.cellType = "text";
});
QUnit.test("visible attribute for min property  should return true for text question with inputType number/month", function (assert) {
  const column = new MatrixDropdownColumn("col1");
  assert.equal(column.cellType, "default");
  const property = Serializer.findProperty("text", "min");
  assert.equal(property.visibleIf(column), false, "cell type is default");
  column.cellType = "text";
  assert.equal(property.visibleIf(column), false, "inputType is text");
  (<any>column).inputType = "number";
  assert.equal(property.visibleIf(column), true, "inputType is number");
  (<any>column).inputType = "month";
  assert.equal(property.visibleIf(column), true, "inputType is month");
  (<any>column).inputType = "text";
  assert.equal(property.visibleIf(column), false, "inputType is text");
});
QUnit.test("table vertical align and alternate rows", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
      },
    ],
  });

  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");

  matrix.cssClasses.root = "rootClass";
  matrix.cssClasses.rootAlternateRows = "rootAlternateRowsClass";
  matrix.cssClasses.rootVerticalAlignTop = "rootVerticalAlignTopClass";
  matrix.cssClasses.rootVerticalAlignMiddle = "rootVerticalAlignMiddleClass";

  assert.equal(matrix.getTableCss(), "rootClass rootVerticalAlignMiddleClass", "table css is rootVerticalAlignMiddleClass");
  matrix.verticalAlign = "top";
  assert.equal(matrix.getTableCss(), "rootClass rootVerticalAlignTopClass", "default table css is rootVerticalAlignTopClass");
  matrix.alternateRows = true;
  assert.equal(matrix.getTableCss(), "rootClass rootAlternateRowsClass rootVerticalAlignTopClass", "table css is rootAlternateRowsClass rootVerticalAlignMiddleClass");
});