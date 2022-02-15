import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
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