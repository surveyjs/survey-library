import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
export * from "../src/localization/german";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_MatrixBase");

QUnit.test("check getCellAriaLabel method", (assert) => {
  const rowTitle = "RowTitle";
  const columnTitle = "ColumnTitle";
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [{ name: columnTitle }],
        rows: [rowTitle]
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");

  let row = matrix.visibleRows[0];
  let column = matrix.visibleColumns[0];
  assert.equal(matrix.getCellAriaLabel(row, column), "row RowTitle, column ColumnTitle", "en");
  survey.locale = "de";
  assert.equal(matrix.getCellAriaLabel(row, column), "zeile RowTitle, spalte ColumnTitle", "de");
  assert.equal(matrix.getCellAriaLabel({ locText: null }, {}), "zeile , spalte ", "check if locText is null");
});