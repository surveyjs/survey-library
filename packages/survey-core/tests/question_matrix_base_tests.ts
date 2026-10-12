import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { QuestionMatrixModel } from "../src/question_matrix";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { describe, test, expect } from "vitest";
export * from "../src/localization/german";
import { SurveyModel } from "../src/survey";

function setTableCssClasses(matrix: any): void {
  matrix.cssClasses.root = "rootClass";
  matrix.cssClasses.noHeader = "noHeaderClass";
  matrix.cssClasses.columnsAutoWidth = "";
  matrix.cssClasses.rootVerticalAlignTop = "rootVerticalAlignTopClass";
  matrix.cssClasses.rootVerticalAlignMiddle = "rootVerticalAlignMiddleClass";
  matrix.cssClasses.hasFooter = "hasFooterClass";
  matrix.cssClasses.body = "bodyClass";
  matrix.cssClasses.bodyAlternativeRows = "bodyAlternativeRowsClass";
}

describe("Matrix table CSS and cell aria labels", () => {
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
  test("check getCellAriaLabel method for a single-select matrix", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrix", name: "q1", columns: ["ColumnTitle"], rows: ["RowTitle"] },
      ],
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const row = matrix.visibleRows[0];
    const column = matrix.visibleColumns[0];
    expect(matrix.getCellAriaLabel(row, column), "en").toBe("row RowTitle, column ColumnTitle");
    expect(matrix.getCellAriaLabel(row, column, "Direct"), "en, direct row title").toBe("row Direct, column ColumnTitle");
    survey.locale = "de";
    expect(matrix.getCellAriaLabel(row, column), "de").toBe("zeile RowTitle, spalte ColumnTitle");
    expect(matrix.getCellAriaLabel({ locText: null }, {}), "check if locText is null").toBe("zeile , spalte ");
  });
  test("check getTableWrapper css for different title locations in a single-select matrix", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrix", name: "q1", titleLocation: "top" },
        { type: "matrix", name: "q2", titleLocation: "bottom" },
        { type: "matrix", name: "q3", titleLocation: "left" },
      ],
    });
    const matrix1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const matrix2 = <QuestionMatrixModel>survey.getQuestionByName("q2");
    const matrix3 = <QuestionMatrixModel>survey.getQuestionByName("q3");
    expect(matrix1.getTableWrapperCss(), "titleLocation top").toBe("sd-matrix sd-table-wrapper");
    expect(matrix2.getTableWrapperCss(), "titleLocation bottom").toBe("sd-matrix sd-table-wrapper");
    expect(matrix3.getTableWrapperCss(), "titleLocation left").toBe("sd-matrix sd-table-wrapper sd-table-wrapper--left");
  });
  test("table css reflects showHeader, verticalAlign and alternateRows in a single-select matrix", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrix", name: "q1", columns: ["col1"], rows: ["row1"] }],
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("q1");
    setTableCssClasses(matrix);
    expect(matrix.getTableCss(), "default").toBe("rootClass rootVerticalAlignMiddleClass");
    expect(matrix.getTableBodyCss(), "default body").toBe("bodyClass");
    matrix.showHeader = false;
    expect(matrix.getTableCss(), "no header").toBe("rootClass noHeaderClass rootVerticalAlignMiddleClass");
    matrix.verticalAlign = "top";
    expect(matrix.getTableCss(), "no header, align top").toBe("rootClass noHeaderClass rootVerticalAlignTopClass");
    matrix.alternateRows = true;
    expect(matrix.getTableBodyCss(), "alternate rows").toBe("bodyClass bodyAlternativeRowsClass");
    survey.setIsMobile(true);
    expect(matrix.getTableBodyCss(), "alternate rows are not applied on mobile").toBe("bodyClass");
  });
  test("table css reflects showHeader, verticalAlign, alternateRows and the footer in a dynamic matrix", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q1", columns: [{ name: "col1" }], rowCount: 1 }],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    setTableCssClasses(matrix);
    expect(matrix.getTableCss(), "default, the add row button is in the footer").toBe("rootClass rootVerticalAlignMiddleClass hasFooterClass");
    matrix.showHeader = false;
    expect(matrix.getTableCss(), "no header").toBe("rootClass noHeaderClass rootVerticalAlignMiddleClass hasFooterClass");
    matrix.verticalAlign = "top";
    expect(matrix.getTableCss(), "no header, align top").toBe("rootClass noHeaderClass rootVerticalAlignTopClass hasFooterClass");
    matrix.allowAddRows = false;
    expect(matrix.getTableCss(), "no footer").toBe("rootClass noHeaderClass rootVerticalAlignTopClass");
    expect(matrix.getTableBodyCss(), "default body").toBe("bodyClass");
    matrix.alternateRows = true;
    expect(matrix.getTableBodyCss(), "alternate rows").toBe("bodyClass bodyAlternativeRowsClass");
  });
});
