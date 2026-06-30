import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { describe, test, expect } from "vitest";
export * from "../src/localization/german";
import { SurveyModel } from "../src/survey";

describe("Survey_MatrixBase", () => {
  test("check getCellAriaLabel method", () => {
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
    expect(matrix.getCellAriaLabel(row, column), "en").toBe("row RowTitle, column ColumnTitle");
    survey.locale = "de";
    expect(matrix.getCellAriaLabel(row, column), "de").toBe("zeile RowTitle, spalte ColumnTitle");
    expect(matrix.getCellAriaLabel({ locText: null }, {}), "check if locText is null").toBe("zeile , spalte ");
  });

  test("check getTableWrapper css for different title locations", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdropdown", name: "q1", titleLocation: "top" },
        { type: "matrixdropdown", name: "q2", titleLocation: "bottom" },
        { type: "matrixdropdown", name: "q3", titleLocation: "left" },
      ],
    });
    const matrix1 = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
    const matrix2 = <QuestionMatrixDropdownModel>survey.getQuestionByName("q2");
    const matrix3 = <QuestionMatrixDropdownModel>survey.getQuestionByName("q3");
    expect(matrix1.getTableWrapperCss(), "titleLocation top").toBe("sd-table-wrapper");
    expect(matrix2.getTableWrapperCss(), "titleLocation bottom").toBe("sd-table-wrapper");
    expect(matrix3.getTableWrapperCss(), "titleLocation left").toBe("sd-table-wrapper sd-table-wrapper--left");
  });
});
