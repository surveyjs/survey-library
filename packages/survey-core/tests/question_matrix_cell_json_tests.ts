import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import "../src/question_matrixdropdown";
import "../src/question_text";
import "../src/question_comment";
import "../src/question_dropdown";
import "../src/question_checkbox";
import "../src/question_radiogroup";
import "../src/question_tagbox";
import "../src/question_boolean";
import "../src/question_expression";
import "../src/question_rating";
import "../src/question_slider";

function createMatrix(columns: Array<any>, rowCount: number = 1): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: rowCount, columns: columns }] });
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
}

describe("Matrix column: a rating column loaded from JSON", () => {
  test("rateMin and rateCount without rateMax give the template and the cells rateMax", () => {
    const matrix = createMatrix([{ name: "c1", cellType: "rating", rateMin: 2, rateCount: 3 }]);
    const column = matrix.columns[0];
    expect(column.templateQuestion.rateMax, "#1: template").toBe(4);
    expect(column.templateQuestion.visibleRateValues.map(item => item.value), "#2: template").toEqual([2, 3, 4]);
    const cell = matrix.visibleRows[0].cells[0].question;
    expect(cell.rateMax, "#3: cell").toBe(4);
    expect(cell.visibleRateValues.map(item => item.value), "#4: cell").toEqual([2, 3, 4]);
    matrix.addRow();
    expect(matrix.visibleRows[1].cells[0].question.rateMax, "#5: a new row's cell").toBe(4);
  });
  test("rateMax and rateCount without rateMin give the template and the cells rateMin", () => {
    const matrix = createMatrix([{ name: "c1", cellType: "rating", rateMax: 8, rateCount: 3 }]);
    expect(matrix.columns[0].templateQuestion.rateMin, "#1: template").toBe(6);
    expect(matrix.visibleRows[0].cells[0].question.rateMin, "#2: cell").toBe(6);
  });
  test("rateValues without autoGenerate switch autoGenerate off in the template and the cells", () => {
    const matrix = createMatrix([{ name: "c1", cellType: "rating", rateValues: [1, 5, 9] }]);
    expect(matrix.columns[0].templateQuestion.autoGenerate, "#1: template").toBe(false);
    const cell = matrix.visibleRows[0].cells[0].question;
    expect(cell.autoGenerate, "#2: cell").toBe(false);
    expect(cell.visibleRateValues.map(item => item.value), "#3: cell").toEqual([1, 5, 9]);
  });
  test("a rating column created in code reads no column JSON", () => {
    const matrix = createMatrix([{ name: "c1", cellType: "text" }]);
    const column = matrix.addColumn("c2");
    column.cellType = "rating";
    column.templateQuestion.rateCount = 3;
    expect(column.templateQuestion.rateMax, "#1: template").toBe(3);
    expect(matrix.visibleRows[0].getQuestionByColumnName("c2").rateCount, "#2: cell").toBe(3);
  });
});
