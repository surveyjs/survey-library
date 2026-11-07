import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

// The toBe guard of tests/vitest.setup.ts: a failed assertion on a model object reports the class name
// instead of a deep comparison and a print of the whole survey.
describe("toBe on model objects", () => {
  const createMatrix = (): QuestionMatrixDynamicModel => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 2,
      columns: [{ name: "col1", cellType: "text" }] }] });
    return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  };
  test("a failed toBe of two rows reports the class names", () => {
    const rows = createMatrix().visibleRows;
    expect(() => expect(rows[0]).toBe(rows[1]), "#1").toThrow("expected the same object");
  });
  test("a failed toBe of two rendered tables reports the class names", () => {
    const first = createMatrix();
    const second = createMatrix();
    expect(() => expect(first.renderedTable).toBe(second.renderedTable), "#1").toThrow("expected the same object");
  });
  const getError = (func: () => void): any => {
    try {
      func();
    } catch(e) {
      return e;
    }
    return undefined;
  };
  test("a failed assertion keeps the class name as actual and expected", () => {
    const rows = createMatrix().visibleRows;
    const error = getError(() => expect(rows[0]).toBe(rows[1]));
    expect(error.actual, "#1").toBe("MatrixDynamicRowModel");
    expect(error.expected, "#2").toBe("MatrixDynamicRowModel");
  });
  test("a failed assertion on an array of rows keeps its length as actual", () => {
    const matrix = createMatrix();
    const error = getError(() => expect(matrix.visibleRows).toBeFalsy());
    expect(error.actual, "#1").toBe("array of 2 items");
  });
  test("a failed negated assertion on a row keeps the class name as actual", () => {
    const rows = createMatrix().visibleRows;
    const error = getError(() => expect(rows[0]).not.toBeTruthy());
    expect(error.actual, "#1").toBe("MatrixDynamicRowModel");
  });
  test("a failed not.toBe of one row reports the class name", () => {
    const rows = createMatrix().visibleRows;
    expect(() => expect(rows[0]).not.toBe(rows[0]), "#1").toThrow("expected another object");
  });
  test("a passing toBe and not.toBe of rows still pass", () => {
    const matrix = createMatrix();
    const rows = matrix.visibleRows;
    expect(rows[0], "#1").toBe(rows[0]);
    expect(rows[0], "#2").not.toBe(rows[1]);
    expect(matrix.renderedTable, "#3").toBe(matrix.renderedTable);
    expect(matrix.visibleRows, "#4").toBeTruthy();
  });
  test("toBe of plain values keeps its message", () => {
    expect(() => expect(1).toBe(2), "#1").toThrow("expected 1 to be 2");
  });
});
