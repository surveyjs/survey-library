import { QuestionMatrixBaseModel } from "../src/martixBase";
export * from "../src/localization/german";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_MatrixBase");

QUnit.test("check getCellAriaLabel method", (assert) => {
  const matrix = new QuestionMatrixBaseModel("q1");
  const rowTitle = "RowTitle";
  const columnTitle = "ColumnTitle";
  matrix.rows = [{ value: "row1", text: rowTitle }];
  matrix.columns = [{ value: "col1", text: columnTitle }];
  const survey = new SurveyModel();
  survey.addNewPage("page");
  survey.pages[0].addElement(matrix);
  const row = matrix.visibleRows[0];
  const column = matrix.visibleColumns[0];

  assert.equal(matrix.getCellAriaLabel(row, column), "row RowTitle, column ColumnTitle", "en");

  survey.locale = "de";
  assert.equal(matrix.getCellAriaLabel(row, column), "zeile RowTitle, spalte ColumnTitle", "de");

  assert.equal(matrix.getCellAriaLabel({ locText: {} }, {}), "zeile RowTitle, spalte ColumnTitle", "de");
});