import { QuestionMatrixBaseModel } from "../src/martixBase";
import { MatrixRowModel } from "../src/question_matrix";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_MatrixBase");

QUnit.test("check getCellAriaLabel method", (assert) => {
  const matrixBase = new QuestionMatrixBaseModel("q1");
  const rowTitle = "RowTitle";
  const columnTitle = "ColumnTitle";

  assert.equal(matrixBase.getCellAriaLabel(rowTitle, columnTitle), "row RowTitle, column ColumnTitle");
});