import { QuestionMatrixBaseModel } from "../src/martixBase";
export * from "../src/localization/german";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_MatrixBase");

QUnit.test("check getCellAriaLabel method", (assert) => {
  const matrixBase = new QuestionMatrixBaseModel("q1");
  const rowTitle = "RowTitle";
  const columnTitle = "ColumnTitle";
  assert.equal(matrixBase.getCellAriaLabel(rowTitle, columnTitle), "row RowTitle, column ColumnTitle", "en");
  const survey = new SurveyModel();
  survey.addNewPage("page");
  survey.pages[0].addElement(matrixBase);
  survey.locale = "de";
  assert.equal(matrixBase.getCellAriaLabel(rowTitle, columnTitle), "zeile RowTitle, spalte ColumnTitle", "de");
});