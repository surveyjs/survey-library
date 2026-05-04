import { SurveyModel } from "../src/survey";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { EmailValidator } from "../src/validator";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { MatrixDropdownRowModelBase } from "../src/question_matrixdropdownbase";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { JsonObject, Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { FunctionFactory } from "../src/functionsfactory";
import { Question } from "../src/question";
import { ExpressionValidator } from "../src/validator";
import { QuestionExpressionModel } from "../src/question_expression";
import { settings } from "../src/settings";
import { PanelModel } from "../src/panel";
import { QuestionTextModel } from "../src/question_text";
import { SurveyElement } from "../src/survey-element";
import { Action } from "../src/actions/action";
import { MatrixDropdownColumn, matrixDropdownColumnTypes } from "../src/question_matrixdropdowncolumn";
import { QuestionMatrixDropdownRenderedErrorRow, QuestionMatrixDropdownRenderedRow } from "../src/question_matrixdropdownrendered";
import { AnimationGroup } from "../src/utils/animation";
import { setOldTheme } from "./oldTheme";
import { ProcessValue, ValueGetter } from "../src/conditions/conditionProcessValue";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { describe, test, expect } from "vitest";
describe("Survey_QuestionMatrixDynamic", () => {
  test("Matrixdropdown cells tests", () => {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");
    question.rows = ["row1", "row2", "row3"];
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.choices = [1, 2, 3];
    question.columns[1].cellType = "dropdown";
    question.columns[1]["choices"] = [4, 5];
    question.value = { row2: { column1: 2 } };
    var visibleRows = question.visibleRows;
    expect(visibleRows.length, "There are three rows").toBe(3);
    expect(visibleRows[0].cells.length, "There are two cells in each row").toBe(2);
    expect(visibleRows[2].cells.length, "There are two cells in each row").toBe(2);
    var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
    expect(ItemValue.getData(q1.choices), "get choices from matrix").toEqualValues(ItemValue.getData(question.choices));
    expect(ItemValue.getData(q2.choices), "get choices from column").toEqualValues(ItemValue.getData(question.columns[1]["choices"]));
    expect(visibleRows[0].cells[1].value, "value is not set").toBeUndefined();
    expect(visibleRows[1].cells[0].value, "value was set").toBe(2);

    question.value = null;
    visibleRows[0].cells[1].value = 4;
    expect(question.value, "set the cell value correctly").toEqualValues({ row1: { column2: 4 } });
    visibleRows[0].cells[1].value = null;
    expect(question.value, "set to null if all cells are null").toEqualValues(null);
  });
  test("Matrixdynamic cells tests", () => {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.choices = [1, 2, 3];
    question.columns[1].cellType = "dropdown";
    question.columns[1]["choices"] = [4, 5];
    question.value = [{}, { column1: 2 }, {}];
    var visibleRows = question.visibleRows;
    expect(visibleRows.length, "There are three rows").toBe(3);
    expect(visibleRows[0].cells.length, "There are two cells in each row").toBe(2);
    expect(visibleRows[2].cells.length, "There are two cells in each row").toBe(2);
    var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
    expect(ItemValue.getData(q1.choices), "get choices from matrix").toEqualValues(ItemValue.getData(question.choices));
    expect(ItemValue.getData(q2.choices), "get choices from column").toEqualValues(ItemValue.getData(question.columns[1]["choices"]));
    expect(visibleRows[0].cells[1].value, "value is not set").toBeUndefined();
    expect(visibleRows[1].cells[0].value, "value was set").toBe(2);

    question.value = null;
    visibleRows[1].cells[1].value = 4;
    expect(question.value, "set the cell value correctly").toEqualValues([{}, { column2: 4 }, {}]);
    visibleRows[1].cells[1].value = null;
    expect(question.value, "set to null if all cells are null - array is empty").toEqualValues([]);
  });
  test("Matrixdynamic make the question empty on null cell value, Bug #608", () => {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    var visibleRows = question.visibleRows;
    visibleRows[1].cells[0].question.value = 2;
    expect(question.value, "The value set correctly").toEqualValues([{}, { column1: 2 }, {}]);
    visibleRows[1].cells[0].question.value = null;
    expect(question.value, "Clear the question value if all cells are empty - empty array").toEqualValues([]);
  });

  test("Matrixdynamic set null value, Bug Editor #156", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage();
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    survey.pages[0].addQuestion(question);
    /*
      question.value = null;
      expect(question.value, "Set null value correctly").toEqualValues([{}, {}, {}]);
      */
    var visibleRows = question.visibleRows;
    expect(visibleRows.length, "There shoud be 3 rows").toBe(3);
  });

  test("Matrixdropdown value tests after cells generation", () => {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");
    question.rows = ["row1", "row2", "row3"];
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.choices = [1, 2, 3];
    question.columns[1]["choices"] = [4, 5];
    var visibleRows = question.visibleRows;
    question.value = { row2: { column1: 2 } };
    expect(visibleRows[1].cells[0].value, "value was set").toBe(2);
  });
  test("Matrixdynamic value tests after cells generation", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.choices = [1, 2, 3];
    question.columns[1]["choices"] = [4, 5];
    var visibleRows = question.visibleRows;
    question.value = [{}, { column1: 2 }, {}];
    expect(visibleRows[1].cells[0].value, "value was set").toBe(2);
  });
  test("Matrixdynamic set text to rowCount property, bug #439", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    new JsonObject().toObject({ type: "matrixdynamic", rowCount: "1" }, question);
    expect(question.rowCount, "Row count should be 1").toBe(1);
    question.addRow();
    expect(question.rowCount, "Row count should b 2 now").toBe(2);
  });
  test("Matrixdynamic add/remove rows", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.name = "q1";
    page.addQuestion(question);
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.value = [{}, { column1: 2 }, {}];
    question.removeRow(1);
    expect(question.rowCount, "one row is removed").toBe(2);
    expect(question.value, "value is null now - array is empty").toEqualValues([]);
    expect(survey.getValue("q1"), "survey value is undefined or null").toBeUndefined();
    question.addRow();
    expect(question.rowCount, "one row is added").toBe(3);
  });
  test("Matrixdynamic isRequireConfirmOnRowDelete", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.name = "q1";
    page.addQuestion(question);
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.value = [{}, { column1: 2 }, {}];
    expect(question.isRequireConfirmOnRowDelete(0), "empty row, confirmDelete = false").toBe(false);
    expect(question.isRequireConfirmOnRowDelete(1), "non empty row, confirmDelete = false").toBe(false);
    question.confirmDelete = true;
    expect(question.isRequireConfirmOnRowDelete(0), "empty row, confirmDelete = true").toBe(false);
    expect(question.isRequireConfirmOnRowDelete(1), "non empty row, confirmDelete = true").toBe(true);
  });
  test("Matrixdynamic required column", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.cellType = "text";
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    var rows = question.visibleRows;
    expect(question.validate(), "No errors").toBe(true);
    question.columns[0].isRequired = true;
    expect(rows.length, "There are two rows").toBe(2);
    expect(question.validate(), "column1 should not be empty. All rows are empty").toBe(false);
    expect(question.getAllErrors().length, "There are totally two errors").toBe(2);
    question.value = [{ column1: 2 }, {}];
    expect(rows[0].cells[0].question.value, "The first cell has value 2").toBe(2);
    expect(question.validate(), "column1 should not be empty. the second row is empty").toBe(false);
    expect(question.getAllErrors().length, "There are totally one errors").toBe(1);
    question.value = [{ column1: 2 }, { column1: 3 }];
    expect(question.validate(), "column1 should not be empty. all values are set").toBe(true);
    expect(question.getAllErrors().length, "There are totally no errors").toBe(0);
  });
  test("Matrixdynamic column.validators", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.cellType = "text";
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    expect(question.validate(), "No errors").toBe(true);
    question.columns[0].validators.push(new EmailValidator());
    question.rowCount = 0;
    question.rowCount = 2;
    question.value = [{ column1: "aaa" }, {}];
    expect(question.validate(), "column1 should has valid e-mail").toBe(false);
    question.value = [{ column1: "aaa@aaa.com" }, {}];
    expect(question.validate(), "column1 has valid e-mail").toBe(true);
  });
  test("Matrixdynamic duplicationError", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.cellType = "text";
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.keyName = "column1";
    expect(question.validate(), "No errors").toBe(true);
    question.value = [{ column1: "val1" }, {}];
    expect(question.validate(), "There is no errors, row[0].column1=val1").toBe(true);
    question.value = [{ column1: "val1" }, { column1: "val1" }];
    expect(question.validate(), "There is the error, row[0].column1=val1 and row[1].column2=val1").toBe(false);
    expect(question.visibleRows[0].getQuestionByColumnName("column1").errors.length, "There is an error in the first row: errors.length").toBe(1);
    expect(question.visibleRows[0].getQuestionByColumnName("column1").hasVisibleErrors, "There is an error in the first row: hasVisibleErrors").toBe(true);
    expect(question.visibleRows[1].getQuestionByColumnName("column1").errors.length, "There is one error in the second row: errors.length").toBe(1);
    expect(question.visibleRows[1].getQuestionByColumnName("column1").errors[0].visible, "There is one error in the second row: error is visible").toBe(true);
    expect(question.visibleRows[1].getQuestionByColumnName("column1").hasVisibleErrors, "There is one error in the second row: hasVisibleErrors").toBe(true);
    question.value = [{ column1: "val1" }, { column1: "val2" }];
    expect(question.validate(), "There is no errors, row[0].column1=val1 and row[1].column2=val2").toBe(true);
  });
  test("Matrixdynamic column.isUnique, matrixdynamic", () => {
    var question = new QuestionMatrixDynamicModel("q1");
    question.cellType = "text";
    question.rowCount = 2;
    question.addColumn("column1").isUnique = true;
    question.addColumn("column2");
    question.addColumn("column3").isUnique = true;
    expect(question.validate(), "No errors").toBe(true);
    question.value = [{ column1: "val1" }, {}];
    expect(question.validate(), "There is no errors, row[0].column1=val1").toBe(true);
    question.value = [{ column1: "val1" }, { column1: "val1" }];
    expect(question.validate(), "There is the error, row[0].column1=val1 and row[1].column2=val1").toBe(false);
    expect(question.visibleRows[0].getQuestionByColumnName("column1").errors.length, "There is error in the first row").toBe(1);
    expect(question.visibleRows[1].getQuestionByColumnName("column1").errors.length, "There is one error in the second row").toBe(1);
    question.value = [{ column1: "val1" }, { column1: "val2" }];
    expect(question.validate(), "There is no errors, row[0].column1=val1 and row[1].column2=val2").toBe(true);

    question.value = [
      { column1: "val1", column2: "val1", column3: "val1" },
      { column1: "val2", column2: "val1", column3: "val1" },
    ];
    expect(question.validate(), "There is the error, row[0].column3=val1 and row[1].column3=val1").toBe(false);
    expect(question.visibleRows[0].getQuestionByColumnName("column3").errors.length, "There is an error in the first row").toBe(1);
    expect(question.visibleRows[1].getQuestionByColumnName("column3").errors.length, "There is one error in the second row").toBe(1);
    question.value = [
      { column1: "val1", column2: "val1", column3: "val1" },
      { column1: "val2", column2: "val1", column3: "val3" },
    ];
    expect(question.validate(), "There is no errors").toBe(true);
  });
  test("Matrixdynamic column.isUnique, matrixdropdown", () => {
    var question = new QuestionMatrixDropdownModel("q1");
    question.cellType = "text";
    question.rows = ["row1", "row2"];
    question.addColumn("column1").isUnique = true;
    question.addColumn("column2");
    expect(question.validate(), "No errors").toBe(true);
    question.value = { row1: { column1: "val1" } };
    expect(question.validate(), "There is no errors, row[0].column1=val1").toBe(true);
    question.value = { row1: { column1: "val1" }, row2: { column1: "val1" } };
    expect(question.validate(), "There is the error, row[0].column1=val1 and row[1].column2=val1").toBe(false);
    expect(question.visibleRows[0].getQuestionByColumnName("column1").errors.length, "There is an error in the first row").toBe(1);
    expect(question.visibleRows[1].getQuestionByColumnName("column1").errors.length, "There is one error in the second row").toBe(1);
    question.value = { row1: { column1: "val1" }, row2: { column1: "val2" } };
    expect(question.validate(), "There is no errors, row[0].column1=val1 and row[1].column2=val2").toBe(true);
  });
  test("column.isUnique, support settings.comparator.caseSensitive", () => {
    var question = new QuestionMatrixDropdownModel("q1");
    question.cellType = "text";
    question.rows = ["row1", "row2"];
    question.addColumn("column1").isUnique = true;
    expect(question.validate(), "No errors").toBe(true);
    question.value = { row1: { column1: "abc" }, row2: { column1: "Abc" } };
    expect(question.validate(), "There is an error, abc=Abc case-in-sensitive").toBe(false);
    settings.comparator.caseSensitive = true;
    expect(question.validate(), "There is ann error, abc!=Abc case-sensitive").toBe(true);
    settings.comparator.caseSensitive = false;
    question.useCaseSensitiveComparison = false;
    expect(question.validate(), "There is an error, abc=Abc case-in-sensitive, useCaseSensitiveComparison = false").toBe(false);
    question.useCaseSensitiveComparison = true;
    expect(question.validate(), "There is ann error, abc!=Abc case-sensitive, useCaseSensitiveComparison = false").toBe(true);
  });
  test("Matrixdynamic duplicationError in detailPanel", () => {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.rowCount = 2;
    matrix.columns.push(new MatrixDropdownColumn("column1"));
    matrix.columns.push(new MatrixDropdownColumn("column2"));
    matrix.detailPanelMode = "underRow";
    matrix.detailPanel.addNewQuestion("text", "col_q1");
    matrix.keyName = "col_q1";
    expect(matrix.validate(), "No errors").toBe(true);
    matrix.value = [{ col_q1: "val1" }, {}];
    expect(matrix.validate(), "There is no errors, row[0].column1=val1").toBe(true);
    matrix.value = [{ col_q1: "val1" }, { col_q1: "val1" }];
    expect(matrix.validate(), "There is the error, row[0].column1=val1 and row[1].column2=val1").toBe(false);
    const rows = matrix.visibleRows;
    expect(rows[0].isDetailPanelShowing, "detail panel row0 is showing").toBe(true);
    expect(rows[1].isDetailPanelShowing, "detail panel row1 is showing").toBe(true);
    const row1Q = rows[1].detailPanel.getQuestionByName("col_q1");
    expect(row1Q.errors.length, "There is one error in the second row: errors.length").toBe(1);
    expect(row1Q.errors[0].visible, "There is one error in the second row: error is visible").toBe(true);
    expect(row1Q.hasVisibleErrors, "There is one error in the second row: hasVisibleErrors").toBe(true);
    matrix.value = [{ column1: "val1" }, { column1: "val2" }];
    expect(matrix.validate(), "There is no errors, row[0].column1=val1 and row[1].column2=val2").toBe(true);
  });
  test("Matrixdynamic duplicationError and no errors in detailPanel, do not expand panels", () => {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.cellType = "text";
    matrix.rowCount = 2;
    matrix.columns.push(new MatrixDropdownColumn("column1"));
    matrix.columns.push(new MatrixDropdownColumn("column2"));
    matrix.detailPanelMode = "underRow";
    matrix.detailPanel.addNewQuestion("text", "col_q1");
    matrix.columns[0].isUnique = true;
    expect(matrix.validate(), "No errors").toBe(true);
    matrix.value = [{ column1: "val1" }, {}];
    expect(matrix.validate(), "There is no errors, row[0].column1=val1").toBe(true);
    const rows = matrix.visibleRows;
    expect(rows[0].isDetailPanelShowing, "detail panel row0 is showing, #1").toBe(false);
    expect(rows[1].isDetailPanelShowing, "detail panel row1 is showing, #2").toBe(false);
    rows[1].getQuestionByName("column1").value = "val1";
    expect(matrix.validate(), "There is the error, row[0].column1=val1 and row[1].column2=val1").toBe(false);
    expect(rows[0].isDetailPanelShowing, "detail panel row0 is showing, #3").toBe(false);
    expect(rows[1].isDetailPanelShowing, "detail panel row1 is showing, #4").toBe(false);
  });

  test("Matrixdynamic: remove duplicationError in cells and in detailPanels", () => {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.cellType = "text";
    const col = new MatrixDropdownColumn("col1");
    matrix.columns.push(col);
    col.isUnique = true;
    matrix.columns.push(new MatrixDropdownColumn("col2"));
    matrix.detailPanelMode = "underRow";
    matrix.detailPanel.addNewQuestion("text", "col_q1");
    matrix.keyName = "col_q1";
    matrix.value = [{ col1: 3, col_q1: 3 }, { col1: 3, col_q1: 3 }, { col1: 3, col_q1: 3 }];
    expect(matrix.validate(), "There are errors").toBe(false);
    const rows = matrix.visibleRows;
    expect(rows[0].isDetailPanelShowing, "detail panel row0 is showing").toBe(true);
    expect(rows[1].isDetailPanelShowing, "detail panel row1 is showing").toBe(true);
    expect(rows[2].isDetailPanelShowing, "detail panel row2 is showing").toBe(true);
    const row0Cell = rows[0].cells[0].question;
    const row1Cell = rows[1].cells[0].question;
    const row2Cell = rows[2].cells[0].question;
    rows[0].showDetailPanel();
    const row0Q = rows[0].detailPanel.getQuestionByName("col_q1");
    const row1Q = rows[1].detailPanel.getQuestionByName("col_q1");
    const row2Q = rows[2].detailPanel.getQuestionByName("col_q1");
    expect(row0Cell.errors.length, "row0 cell has error, #1").toBe(1);
    expect(row1Cell.errors.length, "row1 cell has error, #1").toBe(1);
    expect(row2Cell.errors.length, "row2 cell has error, #1").toBe(1);
    expect(row0Q.errors.length, "row0 detail panel question has error, #1").toBe(1);
    expect(row1Q.errors.length, "row1 detail panel question has error, #1").toBe(1);
    expect(row2Q.errors.length, "row2 detail panel question has error, #1").toBe(1);

    row0Cell.value = 1;
    row0Q.value = 1;
    expect(row0Cell.errors.length, "row0 cell has no errors, #2").toBe(0);
    expect(row1Cell.errors.length, "row1 cell has error, #2").toBe(1);
    expect(row2Cell.errors.length, "row2 cell has error, #2").toBe(1);
    expect(row0Q.errors.length, "row0 detail panel question no errors, #2").toBe(0);
    expect(row1Q.errors.length, "row1 detail panel question has error, #2").toBe(1);
    expect(row2Q.errors.length, "row2 detail panel question has error, #2").toBe(1);

    row1Cell.value = 2;
    row1Q.value = 2;
    expect(row0Cell.errors.length, "row0 cell has no errors, #3").toBe(0);
    expect(row1Cell.errors.length, "row1 cell has  no errors, #3").toBe(0);
    expect(row2Cell.errors.length, "row2 cell has  no errors, #3").toBe(0);
    expect(row0Q.errors.length, "row0 detail panel question has  no errors, #3").toBe(0);
    expect(row1Q.errors.length, "row1 detail panel question has  no errors, #3").toBe(0);
    expect(row2Q.errors.length, "row2 detail panel question has  no errors, #3").toBe(0);

    expect(matrix.validate(), "There are no errors").toBe(true);
  });

  test("Matrixdynamic showOtherItem column", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.choices = [1, 2, 3];
    question.rowCount = 1;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns[0].showOtherItem = true;
    var rows = question.visibleRows;
    expect(question.validate(), "Everything is fine so far").toBe(true);
    rows[0].cells[0].question.value = "other";
    expect(question.validate(), "Should set other value").toBe(false);
  });
  test("validate for matrix on another page", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [{ type: "text", name: "q1" }]
        },
        {
          elements: [
            {
              type: "matrixdynamic", name: "q2",
              rowCount: 1,
              columns: [{ name: "col1", cellType: "text", isRequired: true }]
            }]
        }
      ]
    });
    expect(survey.pages[1].validate(), "There is required error").toBe(false);
  });
  test("Matrixdynamic adjust rowCount on setting the value", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.rowCount = 0;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.value = [{}, { column1: 2 }, {}];
    expect(question.rowCount, "It should be 3 rowCount").toBe(3);
    question.value = [{}, { column1: 2 }, {}, {}];
    expect(question.rowCount, "It should be 4 rowCount").toBe(4);
    question.value = [{ column1: 2 }];
    expect(question.rowCount, "RowCount is 1").toBe(1);
  });
  test("Matrixdynamic minRowCount/maxRowCount", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.minRowCount = 3;
    question.maxRowCount = 5;
    expect(question.rowCount, "row count is min row count").toBe(3);
    question.rowCount = 5;
    expect(question.rowCount, "row count is 5").toBe(5);
    question.maxRowCount = 4;
    expect(question.rowCount, "row count is max row count").toBe(4);
    question.addRow();
    expect(question.rowCount, "row count is still max row count").toBe(4);
    question.minRowCount = 5;
    expect(question.maxRowCount, "maxRowCount = minRowCount").toBe(5);
    expect(question.rowCount, "row count is still max row count = 5").toBe(5);
  });
  test("Matrixdynamic do not re-create the rows", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    var firstRowId = question.visibleRows[0].id;
    expect(firstRowId.indexOf("unde") > -1, "there should not be undefined in the row index").toBeFalsy();
    var rowCount = question.visibleRows.length;
    question.addRow();
    expect(question.visibleRows.length, "Add one row").toBe(rowCount + 1);
    expect(question.visibleRows[0].id, "The first row is the same after row adding").toBe(firstRowId);
    question.removeRow(question.rowCount - 1);
    expect(question.visibleRows[0].id, "The first row is the same after row removing").toBe(firstRowId);
    question.rowCount = 10;
    expect(question.visibleRows[0].id, "The first row is the same after row count increasing").toBe(firstRowId);
    question.rowCount = 1;
    expect(question.visibleRows[0].id, "The first row is the same after row count decreasing").toBe(firstRowId);
    question.value = [{ col1: 2 }];
    expect(question.visibleRows[0].id, "The first row is the same after setting value").toBe(firstRowId);
  });

  test("Matrixdynamic change column properties on the fly", () => {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.addColumn("col1");
    var rows = question.visibleRows;
    expect(rows[0].cells[0].question.getType(), "the default cell type is 'dropdown'").toBe("dropdown");
    expect((<QuestionDropdownModel>rows[0].cells[0].question).choices.length, "By use question.choices by default").toBe(question.choices.length);
    question.columns[0]["choices"] = [1, 2, 3, 4, 5, 6, 7];
    expect((<QuestionDropdownModel>rows[0].cells[0].question).choices.length, "Use column choices if set").toBe(question.columns[0]["choices"].length);
  });

  test("Matrixdynamic customize cell editors", () => {
  /*
          col2 - invisible if col1 is empty, [item1, item2] - if col1 = 1 and [item3, item4] if col1 = 2
      */
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    matrix.columns[0]["choices"] = [1, 2];
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    survey.onMatrixCellCreated.add(function (survey, options) {
      if (options.columnName == "col2") {
        options.cellQuestion.visible = options.rowValue["col1"] ? true : false;
      }
    });
    let columnName;
    let cellQuestionName;
    survey.onMatrixCellValueChanged.add(function (survey, options) {
      columnName = options.column.name;
      cellQuestionName = options.cellQuestion.name;
      if (options.columnName != "col1") return;
      var question = options.getCellQuestion("col2");
      question.visible = options.value ? true : false;
      if (options.value == 1) question.choices = ["item1", "item2"];
      if (options.value == 2) question.choices = ["item3", "item4"];
    });
    matrix.rowCount = 1;
    var rows = matrix.visibleRows;
    var q1 = <QuestionDropdownModel>rows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>rows[0].cells[1].question;
    expect(q2.visible, "col2 is invisible if col1 is empty").toBe(false);
    q1.value = 1;
    expect(columnName, "options.column, #1").toBe("col1");
    expect(cellQuestionName, "options.cellQuestion, #1").toBe("col1");
    expect(q2.choices[0].value, "col1 = 1, col2.choices = ['item1', 'item2']").toBe("item1");
    q1.value = 2;
    expect(q2.choices[0].value, "col1 = 2, col2.choices = ['item3', 'item4']").toBe("item3");
    q1.value = null;
    expect(q2.visible, "col2 is invisible if col1 = null").toBe(false);
    matrix.addRow();
    expect((<QuestionDropdownModel>rows[1].cells[1].question).visible, "row2. col2 is invisible if col1 = null").toBe(false);
  });

  test("MatrixCellCreated set cell value https://github.com/surveyjs/surveyjs/issues/1259#issuecomment-413947851", () => {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    survey.onMatrixCellCreated.add(function (survey, options) {
      if (options.columnName === "col2") {
        options.cellQuestion.value = "A";
      }
      // if (options.columnName === "col1") {
      //   options.rowValue[options.columnName] = "B";
      //   //options.row.setValue(options.columnName, options.columnName);
      // }
    });
    matrix.rowCount = 1;
    expect(matrix.visibleRows.length, "one row").toBe(1);
    expect(matrix.value, "matrix.value, one row").toEqualValues([{ col2: "A" }]);
  });

  //QUnit.test("Matrixdynamic validate cell values - do not allow to have the same value", function (assert) {
  test("Matrixdynamic validate cell values - onMatrixCellValueChanged", () => {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.cellType = "text";
    matrix.addColumn("col1");
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    var cellQuestions = [];
    survey.onMatrixCellCreated.add(function (survey, options) {
      cellQuestions.push(options.cellQuestion);
    });
    var col1Question = undefined;
    survey.onMatrixCellValidate.add(function (survey, options) {
      if (options.value == "notallow") {
        options.error = "This cell is not allow";
      }
      col1Question = options.getCellQuestion("col1");
    });
    var rows = matrix.visibleRows;
    expect(cellQuestions.length, "There are 2 cell questions in the array").toBe(2);
    cellQuestions[0].value = "notallow";
    matrix.validate(true);
    expect(cellQuestions[0].errors.length, "There is an error").toBe(1);
    cellQuestions[0].value = "allow";
    matrix.validate(true);
    expect(cellQuestions[0].errors.length, "There is no errors").toBe(0);
    expect(col1Question.name, "options.getQuestion works correctly").toBe("col1");
  });

  test("Matrixdynamic validate cell values - do not allow to have the same value", () => {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.choices = [1, 2, 3];
    matrix.addColumn("col1");
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    var cellQuestions = [];
    survey.onMatrixCellCreated.add(function (survey, options) {
      cellQuestions.push(options.cellQuestion);
    });
    survey.onMatrixCellValueChanged.add(function (survey, options) {
      //validate value on change
      options.getCellQuestion("col1").validate(true);
    });
    survey.onMatrixCellValidate.add(function (survey, options) {
      var rows = options.question.visibleRows;
      for (var i = 0; i < rows.length; i++) {
        //we have the same row
        if (rows[i] === options.row) continue;
        if (rows[i].value && rows[i].value["col1"] == options.value) {
          options.error = "You have already select the same value";
        }
      }
    });
    var rows = matrix.visibleRows;
    expect(cellQuestions.length, "There are 2 cell questions in the array").toBe(2);
    cellQuestions[0].value = 1;
    expect(cellQuestions[1].errors.length, "There is now errors").toBe(0);
    cellQuestions[1].value = 1;
    expect(cellQuestions[1].errors.length, "There is an error").toBe(1);
    cellQuestions[1].value = 2;
    expect(cellQuestions[1].errors.length, "There no errors again").toBe(0);
  });
  test("Matrixdynamic create different question types in one column", () => {
    var matrix = new QuestionMatrixDropdownModel("matrixDymanic");
    matrix.addColumn("col1");
    matrix.rows = ["text", "dropdown", "checkbox"];
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    survey.onMatrixCellCreating.add((sender, options) => {
      if (options.column.name !== "col1") return;
      options.cellType = options.row.rowName;
    });
    var rows = matrix.visibleRows;
    expect(rows[0].cells[0].question.getType()).toBe("text");
    expect(rows[1].cells[0].question.getType()).toBe("dropdown");
    expect(rows[2].cells[0].question.getType()).toBe("checkbox");
  });

  test("Matrixdynamic onMatrixValueChanging - control the value in the cell", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "using",
              choices: ["Yes", "No"],
              cellType: "radiogroup",
            },
            {
              name: "experience",
              cellType: "text",
              visibleIf: "{row.using} = 'Yes'",
            },
          ],
        },
      ],
      clearInvisibleValues: "onHidden",
    };
    var survey = new SurveyModel(json);
    survey.onMatrixCellValueChanging.add(function (sender, options) {
      if (options.columnName == "experience" && !options.value) {
        options.value = options.oldValue;
      }
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    matrix.value = [{ using: "Yes", experience: "3" }];
    expect(matrix.visibleRows[0].cells[1].question.value, "Value is 3").toBe("3");
    matrix.visibleRows[0].cells[0].question.value = "No";
    expect(matrix.visibleRows[0].cells[1].question.value, "Value is still 3").toBe("3");
  });
  test("Matrixdropdown onMatrixValueChanging, bug#5396", () => {
    const json = {
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [{ name: "col1", cellType: "text" }],
          rows: ["row1"]
        },
      ]
    };
    const survey = new SurveyModel(json);
    survey.onMatrixCellValueChanging.add(function (sender, options) {
      options.value += "!";
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
    const cellQuestion = matrix.visibleRows[0].cells[0].question;
    cellQuestion.value = "test";
    expect(cellQuestion.value, "Value has been changed").toBe("test!");
    expect(survey.data, "Correct survey data").toEqualValues({ q1: { row1: { col1: "test!" } } });
  });

  test("Matrixdropdown different cell types", () => {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");

    question.columns.push(new MatrixDropdownColumn("dropdown"));
    question.columns.push(new MatrixDropdownColumn("checkbox"));
    question.columns.push(new MatrixDropdownColumn("radiogroup"));
    question.columns.push(new MatrixDropdownColumn("text"));
    question.columns.push(new MatrixDropdownColumn("comment"));
    question.columns.push(new MatrixDropdownColumn("boolean"));

    for (var i = 0; i < question.columns.length; i++) {
      question.columns[i].cellType = question.columns[i].name;
    }
    question.rows = ["row1", "row2", "row3"];

    for (var i = 0; i < question.columns.length; i++) {
      var col = question.columns[i];
      var row = question.visibleRows[0];
      expect(row.cells[i].question.getType(), "Expected " + col.name + ", but was" + row.cells[i].question.getType()).toBe(col.name);
    }
  });
  test("Matrixdropdown boolean cellType", () => {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");

    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));
    question.cellType = "boolean";

    question.rows = ["row1"];
    var visibleRows = question.visibleRows;
    visibleRows[0].cells[0].question.value = true;
    visibleRows[0].cells[1].question.value = false;
    expect(question.value, "Boolean field set value correctly").toEqualValues({ row1: { col1: true, col2: false } });
  });
  test("Matrixdropdown booleanDefaultValue", () => {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");

    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));
    question.cellType = "boolean";
    question.columns[0]["defaultValue"] = "true";
    question.columns[1]["defaultValue"] = "false";

    question.rows = ["row1"];
    var visibleRows = question.visibleRows;
    expect(question.value, "Boolean field set value correctly").toEqualValues({ row1: { col1: true, col2: false } });
  });

  test("Matrixdropdown defaultValue", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          defaultValue: { row1: { col1: 1 } },
          columns: [
            {
              name: "col1",
              choices: [1, 2, 3],
            },
          ],
          rows: [
            {
              value: "row1",
            },
          ],
        },
      ],
    });
    var question = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
    expect(question.value, "default value has been assign").toEqualValues({ row1: { col1: 1 } });
  });

  test("matrixdynamic.defaultValue - check the complex property", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }, { name: "col2" }],
          defaultValue: [
            { col1: 1, col2: 2 },
            { col1: 3, col2: 4 },
          ],
        },
      ],
    });
    expect(survey.getValue("matrix"), "set complex defaultValue correctly").toEqualValues([
      { col1: 1, col2: 2 },
      { col1: 3, col2: 4 },
    ]);
  });

  test("Matrixdropdown minRowCount", () => {
    var question = new QuestionMatrixDynamicModel("matrix");
    question.cellType = "text";
    question.rowCount = 2;
    question.addColumn("column1");
    var rows = question.visibleRows;
    expect(question.validate(), "There is no errors in the matrix. Null is possible").toBe(true);
    expect(rows[0].isEmpty, "There is no error in the first row").toBe(true);
    expect(rows[1].isEmpty, "There is no error in the second row").toBe(true);
    question.minRowCount = 2;
    expect(question.validate(), "There is no errors in the matrix. question is not required").toBe(true);
    question.minRowCount = 0;
    question.isRequired = true;
    expect(question.validate(), "Question is requried now").toBe(false);
    rows[0].cells[0].question.value = "val1";
    expect(question.validate(), "Question has value").toBe(true);
    question.minRowCount = 2;
    expect(question.validate(), "Error, value in two rows are required").toBe(false);
    rows[1].cells[0].question.value = "val2";
    expect(question.validate(), "No errors, all rows have values").toBe(true);
  });
  test("Matrixdropdown supportAutoAdvance property", () => {
    var question = new QuestionMatrixDropdownModel("matrix");
    question.rows = ["row1", "row2"];
    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));
    var rows = question.visibleRows;
    expect(question.supportAutoAdvance(), "There is no value in rows").toBe(false);
    question.value = { row1: { col1: 1, col2: 11 } };
    expect(question.supportAutoAdvance(), "There is no value in the second row").toBe(false);
    question.value = {
      row1: { col1: 1, col2: 11 },
      row2: { col1: 2, col2: 22 },
    };
    expect(question.supportAutoAdvance(), "All row values are set").toBe(true);
    question.value = { row1: { col1: 1 }, row2: { col1: 2, col2: 22 } };
    expect(question.supportAutoAdvance(), "The first row is not set completely").toBe(false);
  });

  test("Matrixdropdown supportAutoAdvance always false for checkbox", () => {
    var question = new QuestionMatrixDropdownModel("matrix");
    question.rows = ["row1", "row2"];
    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));
    question.columns[1].cellType = "checkbox";
    var json = new JsonObject().toJsonObject(question);
    json.type = question.getType();
    question.columns.push(new MatrixDropdownColumn("col3"));
    question.columns.push(new MatrixDropdownColumn("col4"));
    new JsonObject().toObject(json, question);

    expect(question.columns.length, "There were two columns").toBe(2);
  });

  test("Text date supportAutoAdvance false", () => {
    var question = new QuestionTextModel("text");
    expect(question.supportAutoAdvance(), "Suppored").toBe(true);
    question.inputType = "date";
    expect(question.supportAutoAdvance(), "Not suppored for date").toBe(false);
  });

  test("Matrixdropdown set columns", () => {
    var question = new QuestionMatrixDropdownModel("matrix");
    question.rows = ["row1", "row2"];
    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));

    expect(question.supportAutoAdvance(), "There is no value in rows").toBe(false);
    question.value = { row1: { col1: 1, col2: 11 } };
    expect(question.supportAutoAdvance(), "Checkbox doesn't support gotNextPageAutomatic").toBe(false);
  });

  test("Matrixdynamic column.visibleIf", () => {
    const survey = new SurveyModel();
    survey.addNewPage("p1");
    const question = new QuestionMatrixDynamicModel("matrixDynamic");
    survey.pages[0].addQuestion(question);
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.columns.push(new MatrixDropdownColumn("column3"));
    const columns = question.columns;
    columns[0]["choices"] = [1, 2, 3];
    columns[1]["choices"] = [4, 5];
    columns[2]["choices"] = [7, 8, 9, 10];
    columns[2].isRequired = true;
    expect(columns[0].visible, "columns[0].visible").toBe(true);
    expect(columns[1].visible, "columns[1].visible").toBe(true);
    expect(columns[2].visible, "columns[2].visible").toBe(true);
    question.columns[1].visibleIf = "{row.column1} = 2";
    question.columns[2].visibleIf = "{a} = 5";

    var visibleRows = question.visibleRows;
    var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
    var q3 = <QuestionDropdownModel>visibleRows[0].cells[2].question;

    survey.setValue("a", 3);
    expect(q1.visible, "1. q1 visibleIf is empty").toBe(true);
    expect(q2.visible, "1. q2 visibleIf depends on column1 - false").toBe(false);
    expect(q3.visible, "1. q3 visibleIf depends on external data - false").toBe(false);
    expect(question.validate(), "1. q3 required column is invisible.").toBe(true);
    survey.setValue("a", 5);
    expect(q3.visible, "2. q3 visibleIf depends on external data - true").toBe(true);
    q1.value = 2;
    expect(q2.visible, "3. q2 visibleIf depends on column1 - true").toBe(true);
  });
  test("Matrixdynamic column.enableIf", () => {
    const survey = new SurveyModel();
    survey.addNewPage("p1");
    const question = new QuestionMatrixDynamicModel("matrixDynamic");
    survey.pages[0].addQuestion(question);
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.columns.push(new MatrixDropdownColumn("column3"));
    question.columns[0]["choices"] = [1, 2, 3];
    question.columns[1]["choices"] = [4, 5];
    question.columns[2]["choices"] = [7, 8, 9, 10];
    question.columns[2].isRequired = true;

    question.columns[1].enableIf = "{row.column1} = 2";
    question.columns[2].enableIf = "{a} = 5";

    var visibleRows = question.visibleRows;
    var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
    var q3 = <QuestionDropdownModel>visibleRows[0].cells[2].question;

    survey.setValue("a", 3);
    expect(q1.isReadOnly, "1. q1 enableIf is empty").toBe(false);
    expect(q2.isReadOnly, "1. q2 enableIf depends on column1 - false").toBe(true);
    expect(q3.isReadOnly, "1. q3 enableIf depends on external data - false").toBe(true);
    survey.setValue("a", 5);
    expect(q3.isReadOnly, "2. q3 enableIf depends on external data - true").toBe(false);
    q1.value = 2;
    expect(q2.isReadOnly, "3. q2 enableIf depends on column1 - true").toBe(false);
  });
  test("Matrixdynamic column.requiredIf", () => {
    const survey = new SurveyModel();
    survey.addNewPage("p1");
    const question = new QuestionMatrixDynamicModel("matrixDynamic");
    survey.pages[0].addQuestion(question);
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.columns.push(new MatrixDropdownColumn("column3"));
    question.columns[0]["choices"] = [1, 2, 3];
    question.columns[1]["choices"] = [4, 5];
    question.columns[2]["choices"] = [7, 8, 9, 10];

    question.columns[1].requiredIf = "{row.column1} = 2";
    question.columns[2].requiredIf = "{a} = 5";

    var visibleRows = question.visibleRows;
    var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
    var q3 = <QuestionDropdownModel>visibleRows[0].cells[2].question;

    survey.setValue("a", 3);
    expect(q1.isRequired, "1. q1 requiredIf is empty").toBe(false);
    expect(q2.isRequired, "1. q2 requireIf depends on column1 - false").toBe(false);
    expect(q3.isRequired, "1. q3 requiredIf depends on external data - false").toBe(false);
    survey.setValue("a", 5);
    expect(q3.isRequired, "2. q3 requiredIf depends on external data - true").toBe(true);

    q1.value = 2;
    expect(q2.isRequired, "3. q2 requiredIf depends on column1 - true").toBe(true);
  });
  test("Matrixdynamic column.isRenderedRequired", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          columns: [
            { name: "column1", isRequired: true },
            { name: "column2", requiredIf: "{a} = 5" },
            { name: "column3", requiredIf: "{row.column1} = 2" }
          ]
        }
      ]
    });
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.rowCount = 2;
    const col1 = question.columns[0];
    const col2 = question.columns[1];
    const col3 = question.columns[2];

    expect(col1.isRenderedRequired, "isRequired is true").toBe(true);
    expect(col2.isRenderedRequired, "col2").toBe(false);
    expect(col3.isRenderedRequired, "col3").toBe(false);
    const rows = question.visibleRows;
    survey.data = { a: 5 };
    expect(col2.isRenderedRequired, "col2, condition is true, #2").toBe(true);
    expect(col3.isRenderedRequired, "col3, #2").toBe(false);
    survey.data = { a: 3 };
    expect(col2.isRenderedRequired, "col2, condition is false, #3").toBe(false);
    expect(col3.isRenderedRequired, "col3, #3").toBe(false);
    rows[0].cells[0].value = 2;
    expect(col3.isRenderedRequired, "col3, #4").toBe(false);
    rows[1].cells[0].value = 2;
    expect(col3.isRenderedRequired, "col3, #5").toBe(true);
    rows[0].cells[0].value = 1;
    expect(col3.isRenderedRequired, "col3, #6").toBe(false);
  });
  test("Matrixdynamic column.visibleIf, load from json and add item", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          rowCount: 1,
          columns: [
            { name: "col1", choices: [1, 2] },
            { name: "col2", visibleIf: "{row.col1} = 1" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var rows = matrix.visibleRows;
    var q_0_1 = <QuestionDropdownModel>rows[0].cells[1].question;
    expect(q_0_1.visible, "Initial the question is invisible").toBe(false);
    matrix.addRow();
    var q_1_1 = <QuestionDropdownModel>rows[1].cells[1].question;
    expect(q_1_1.visible, "Initial the question in the added row is invisible").toBe(false);
  });
  test("Matrixdynamic column.visibleIf, hide column if all cells are invisible", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            { name: "col1", choices: [1, 2], visibleIf: "{q2}=1" },
            { name: "col2", visibleIf: "{row.col1} = 1" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var rows = matrix.visibleRows;
    expect(matrix.columns[0].hasVisibleCell, "The first column is invisible").toBe(false);
    expect(matrix.columns[1].hasVisibleCell, "The second column is invisible").toBe(false);
    survey.setValue("q2", 1);
    let table = matrix.renderedTable;
    expect(matrix.columns[0].hasVisibleCell, "The first column is visible").toBe(true);
    expect(matrix.columns[1].hasVisibleCell, "The second column is still invisible").toBe(false);
    matrix.visibleRows[0].cells[0].question.value = 1;
    expect(matrix.columns[1].hasVisibleCell, "The second column is visible now").toBe(true);
    matrix.visibleRows[1].cells[0].question.value = 1;
    expect(matrix.columns[1].hasVisibleCell, "The second column is visible now, #2").toBe(true);
    matrix.visibleRows[0].cells[0].question.value = 2;
    expect(matrix.columns[1].hasVisibleCell, "The second column is visible now, #3").toBe(true);
    matrix.visibleRows[1].cells[0].question.value = 2;
    expect(matrix.columns[1].hasVisibleCell, "The second column is invisible now").toBe(false);
    survey.setValue("q2", 2);
    table = matrix.renderedTable;
    expect(matrix.columns[0].hasVisibleCell, "The first column is invisible now").toBe(false);
    //expect(matrix.renderedTable.headerRow.cells.length, "There is no cells headers").toBe(0);
    //expect(matrix.renderedTable.rows[0].cells.length, "There is no cells in rows").toBe(0);
  });

  test("MatrixDropdownColumn cell question", () => {
    var question = new QuestionMatrixDynamicModel("matrix");
    var column = question.addColumn("col1");
    expect(column.templateQuestion.getType(), "The default type is dropdown").toBe("dropdown");
    question.cellType = "radiogroup";
    expect(column.templateQuestion.getType(), "The default type is radiogroup").toBe("radiogroup");
    column.cellType = "checkbox";
    expect(column.templateQuestion.getType(), "The question type is checkbox").toBe("checkbox");
  });

  test("MatrixDropdownColumn cell question isEditableTemplateElement", () => {
    var question = new QuestionMatrixDynamicModel("matrix");
    var column = question.addColumn("col1");
    expect(column.templateQuestion.isEditableTemplateElement, "The question isEditableTemplateElement").toBe(true);
  });

  test("MatrixDropdownColumn properties are in questions", () => {
    var column = new MatrixDropdownColumn("col1");
    column.title = "some text";
    expect(column.templateQuestion.name, "name set into question").toBe("col1");
    expect(column.templateQuestion.title, "title into question").toBe("some text");
    column.cellType = "checkbox";
    expect(column.templateQuestion.getType(), "cell type is changed").toBe("checkbox");
    expect(column.templateQuestion.name, "name is still in question").toBe("col1");
    expect(column.templateQuestion.title, "title is still in question").toBe("some text");
  });
  test("MatrixDropdownColumn add/remove serialization properties", () => {
    var column = new MatrixDropdownColumn("col1");
    expect(column["placeholder"], "placeholder property has been created").toBeTruthy();
    expect(column["locPlaceholder"], "Serialization property has been created for placeholder").toBeTruthy();
    column.cellType = "radiogroup";
    expect(column["placeholder"], "placeholder property has been removed").toBeFalsy();
    expect(column["locPlaceholder"], "Serialization property has been removed for placeholder").toBeFalsy();
  });
  test("MatrixDropdownColumn changing cellType from dropdown to radiogroup should not serialize allowClear, Bug#11146", () => {
    var column = new MatrixDropdownColumn("col1");
    expect(column.cellType, "default cellType").toBe("default");
    expect(column.templateQuestion.getType(), "template is dropdown by default").toBe("dropdown");
    column["choices"] = [1, 2, 3];
    column["choicesOrder"] = "asc";
    column["showOtherItem"] = true;
    column["isRequired"] = true;
    column.cellType = "radiogroup";
    expect(column.templateQuestion.getType(), "template is radiogroup now").toBe("radiogroup");
    const json = column.toJSON();
    expect(json.allowClear, "allowClear should not be serialized for radiogroup column").toBeFalsy();
    expect(column.templateQuestion["allowClear"], "allowClear should be false on radiogroup template").toBe(false);
    expect(json.choices, "choices should be preserved after cellType change").toEqualValues([1, 2, 3]);
    expect(json.choicesOrder, "choicesOrder should be preserved after cellType change").toBe("asc");
    expect(json.showOtherItem, "showOtherItem should be preserved after cellType change").toBe(true);
    expect(json.isRequired, "isRequired should be preserved after cellType change").toBe(true);
  });
  test("MatrixDropdownColumn cellType property, choices", () => {
    var prop = Serializer.findProperty("matrixdropdowncolumn", "cellType");
    expect(prop, "Property is here").toBeTruthy();
    let counter = 1; //default
    for (let key in matrixDropdownColumnTypes) counter++;
    expect(prop.choices.length, "get cell types from matrixDropdownColumnTypes").toBe(counter);
    expect(prop.choices[0], "The first value is default").toBe("default");
    expect(prop.choices[1], "The second value is default").toBe("dropdown");
  });

  test("MatrixDropdownColumn copy local choices into cell question", () => {
    var question = new QuestionMatrixDynamicModel("matrix");
    question.choices = [1, 2, 3];
    var column = question.addColumn("col1");
    column.cellType = "dropdown";
    column["choices"] = [4, 5];
    question.rowCount = 1;
    var rows = question.visibleRows;
    expect(rows[0].cells[0].question["choices"].length, "There are 2 choices").toBe(2);
    expect(rows[0].cells[0].question["choices"][0].value, "The first value is 4").toBe(4);
  });

  test("MatrixDropdownColumn load choices from json", () => {
    var question = new QuestionMatrixDropdownModel("matrix");
    var json = {
      type: "matrixdropdown",
      name: "frameworksRate",
      choices: ["Excelent", "Good", "Average", "Fair", "Poor"],
      columns: [
        {
          name: "using",
          title: "Do you use it?",
          choices: ["Yes", "No"],
          cellType: "radiogroup",
        },
        {
          name: "experience",
          title: "How long do you use it?",
          cellType: "dropdown",
          choices: [
            { value: 5, text: "3-5 years" },
            { value: 2, text: "1-2 years" },
            {
              value: 1,
              text: "less than a year",
            },
          ],
        },
      ],
      rows: [{ value: "reactjs" }],
    };
    new JsonObject().toObject(json, question);
    var rows = question.visibleRows;
    expect(rows[0].cells[1].question["choices"].length, "There are 3 choices").toBe(3);
    expect(rows[0].cells[1].question["choices"][0].value, "The first value is 5").toBe(5);
  });

  test("MatrixDynamic do not generate an error on setting a non-array value", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var question = new QuestionMatrixDynamicModel("matrix");
    page.addElement(question);
    question.addColumn("col1");
    question.rowCount = 1;
    survey.setValue("matrix", "sometext");
    expect(question.isEmpty(), "It does not generate the error").toBe(true);
  });

  function updateObjsQuestions(objs: Array<any>, removeQuestion: boolean = false): void {
    for (var i = 0; i < objs.length; i++) {
      if (removeQuestion) {
        delete objs[i].question;
      } else {
        objs[i].question = objs[i].question.name;
      }
      if (!!objs[i].context) {
        objs[i].context = objs[i].context.name;
      }
    }
  }

  test("matrixDynamic.addConditionObjectsByContext", () => {
    var objs = [];
    var question = new QuestionMatrixDynamicModel("matrix");
    question.title = "Matrix";
    question.addColumn("col1", "Column 1");
    question.addColumn("col2");
    question.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic").toEqualValues([
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
        question: "matrix",
      },
      { name: "matrix[0].col2", text: "Matrix[0].col2", question: "matrix" },
    ]);
    objs = [];
    question.addConditionObjectsByContext(objs, question.columns[0]);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic with context").toEqualValues([
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
        question: "matrix",
      },
      { name: "matrix[0].col2", text: "Matrix[0].col2", question: "matrix" },
      { name: "row.col2", text: "row.col2", question: "matrix", context: "col1" },
    ]);
    objs = [];
    question.addConditionObjectsByContext(objs, true);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic with context equals true").toEqualValues([
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
        question: "matrix",
      },
      { name: "matrix[0].col2", text: "Matrix[0].col2", question: "matrix" },
      { name: "matrix.row.col1", text: "Matrix.row.Column 1", question: "matrix", context: "matrix" },
      { name: "matrix.row.col2", text: "Matrix.row.col2", question: "matrix", context: "matrix" },
    ]);
  });
  test("matrixDynamic.getNestedQuestions", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix", rowCount: 2,
          columns: [{ name: "col1", cellType: "text", visibleIf: "{row.col2} = 'a'" }, { cellType: "text", name: "col2" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    let questions = q.getNestedQuestions();
    expect(questions.length, "4 cells").toBe(4);
    expect(questions[0].name, "cells[0, 0]").toBe("col1");
    expect(questions[0].getType(), "cells[0, 0]").toBe("text");
    expect(questions[1].name, "cells[0, 1]").toBe("col2");
    expect(questions[0].name, "cells[1, 0]").toBe("col1");
    expect(questions[1].name, "cells[1, 1]").toBe("col2");

    const rows = q.visibleRows;
    rows[1].getQuestionByColumnName("col2").value = "a";
    expect(rows[0].cells[0].question.isVisible, "cell[0,0] is invisible").toBe(false);
    expect(rows[1].cells[0].question.isVisible, "cell[1,0] is visible").toBe(true);
    questions = q.getNestedQuestions(true);
    expect(questions.length, "3 cells").toBe(3);
    expect(questions[0].name, "cells[0, 0], visible").toBe("col2");
    expect(questions[1].name, "cells[1, 1], visible").toBe("col1");
    expect(questions[2].name, "cells[1, 1], visible").toBe("col2");
    expect(survey.getAllQuestions().length, "No nested - one question").toBe(1);
    expect(survey.getAllQuestions(true, true).length, "Include design-time + 2 columns").toBe(1 + 2);
    expect(survey.getAllQuestions(false, false, true).length, "Include nested + 4 cells").toBe(1 + 4);
    expect(survey.getAllQuestions(false, true, true).length, "Include nested + 4 cells, ignore design-time").toBe(1 + 4);
    expect(survey.getAllQuestions(true, false, true).length, "Include nested + 3 visible cells").toBe(1 + 3);
    expect(survey.getAllQuestions(true, true, true).length, "Include nested + 3 visible cells, ignore design-time").toBe(1 + 3);
  });
  test("survey.getAllQuestions(true, false, true) for dynamic panel vs nested matrix dynamic, Bug#10080", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel", templateElements: [
            {
              type: "matrixdynamic", name: "matrix",
              columns: [{ name: "col1", cellType: "text" }, { cellType: "text", name: "col2" }]
            }]
        }
      ]
    });
    survey.data = {
      panel: [{ matrix: [{ col1: "a", col2: "b" }] }]
    };
    const names = new Array<string>();
    survey.getAllQuestions(true, false, true).forEach((q) => {
      names.push(q.name);
    });
    expect(names, "panel + matrix + 2 columns").toEqualValues(["panel", "matrix", "col1", "col2"]);
  });
  test("matrixDynamic.addConditionObjectsByContext + settings.matrixMaxRowCountInCondition=0", () => {
    settings.matrixMaxRowCountInCondition = 0;
    var objs = [];
    var question = new QuestionMatrixDynamicModel("matrix");
    question.title = "Matrix";
    question.addColumn("col1", "Column 1");
    question.addColumn("col2");
    question.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic").toEqualValues([]);
    objs = [];
    question.addConditionObjectsByContext(objs, question.columns[0]);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic with context").toEqualValues([{ name: "row.col2", text: "row.col2", question: "matrix", context: "col1" }]);
    objs = [];
    question.addConditionObjectsByContext(objs, true);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic with context equals true").toEqualValues([
      { name: "matrix.row.col1", text: "Matrix.row.Column 1", question: "matrix", context: "matrix" },
      { name: "matrix.row.col2", text: "Matrix.row.col2", question: "matrix", context: "matrix" },
    ]);
    settings.matrixMaxRowCountInCondition = 1;
  });
  test("matrixDynamic.addConditionObjectsByContext + settings.matrixMaxRowCountInCondition", () => {
    var objs = [];
    var question = new QuestionMatrixDynamicModel("matrix");
    question.title = "Matrix";
    question.addColumn("col1", "Column 1");
    question.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs, true);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic").toEqualValues([
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
      },
    ]);
    question.rowCount = 0;
    settings.matrixMaxRowCountInCondition = 3;

    objs = [];
    question.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs, true);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic, rowCount is 0").toEqualValues([
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
      },
    ]);
    question.rowCount = 4;
    objs = [];
    question.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs, true);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic, rowCount is 4, but settings.matrixMaxRowCountInCondition is 3").toEqualValues([
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
      },
      {
        name: "matrix[1].col1",
        text: "Matrix[1].Column 1",
      },
      {
        name: "matrix[2].col1",
        text: "Matrix[2].Column 1",
      },
    ]);
    settings.matrixMaxRowCountInCondition = 1;
  });
  test("matrixDropdown.addConditionObjectsByContext", () => {
    var objs = [];
    var question = new QuestionMatrixDropdownModel("matrix");
    question.addColumn("col1", "Column 1");
    question.addColumn("col2");
    question.rows = ["row1", "row2"];
    question.title = "Matrix";
    question.rows[0].text = "Row 1";
    question.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dropdown").toEqualValues([
      {
        name: "matrix.row1.col1",
        text: "Matrix.Row 1.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row1.col2",
        text: "Matrix.Row 1.col2",
        question: "matrix",
      },
      {
        name: "matrix.row2.col1",
        text: "Matrix.row2.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row2.col2",
        text: "Matrix.row2.col2",
        question: "matrix",
      },
    ]);
    objs = [];
    question.addConditionObjectsByContext(objs, question.columns[0]);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dropdown with context").toEqualValues([
      {
        name: "matrix.row1.col1",
        text: "Matrix.Row 1.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row1.col2",
        text: "Matrix.Row 1.col2",
        question: "matrix",
      },
      {
        name: "matrix.row2.col1",
        text: "Matrix.row2.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row2.col2",
        text: "Matrix.row2.col2",
        question: "matrix",
      },
      { name: "row.col2", text: "row.col2", question: "matrix", context: "col1" },
    ]);
    objs = [];
    question.addConditionObjectsByContext(objs, true);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dropdown with context equals true").toEqualValues([
      {
        name: "matrix.row1.col1",
        text: "Matrix.Row 1.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row1.col2",
        text: "Matrix.Row 1.col2",
        question: "matrix",
      },
      {
        name: "matrix.row2.col1",
        text: "Matrix.row2.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row2.col2",
        text: "Matrix.row2.col2",
        question: "matrix",
      },
      { name: "matrix.row.col1", text: "Matrix.row.Column 1", question: "matrix", context: "matrix" },
      { name: "matrix.row.col2", text: "Matrix.row.col2", question: "matrix", context: "matrix" },
    ]);
  });

  test("matrixDynamic.getConditionJson", () => {
    var names = [];
    var question = new QuestionMatrixDynamicModel("matrix");
    question.addColumn("col1").cellType = "dropdown";
    question.addColumn("col2").cellType = "dropdown";
    question.columns[0]["choices"] = [1, 2];
    question.columns[1].cellType = "checkbox";
    question.columns[1]["choices"] = [1, 2, 3];
    question.rowCount = 2;
    var json = question.getConditionJson("equals", "[0].col1");
    expect(json.choices, "column 1 get choices").toEqualValues([1, 2]);
    expect(json.type, "column 1 get type").toBe("dropdown");
    json = question.getConditionJson("equals", "row.col2");
    expect(json.choices, "column 2 get choices").toEqualValues([1, 2, 3]);
    expect(json.type, "column 2 get type").toBe("checkbox");
    json = question.getConditionJson("contains", "[0].col2");
    expect(json.type, "column 2 get type for contains").toBe("radiogroup");
  });
  test("matrixDropdown.addConditionObjectsByContext, detail panel", () => {
    var objs = [];
    var question = new QuestionMatrixDynamicModel("matrix");
    question.title = "Matrix";
    question.addColumn("col1", "Column 1");
    question.detailPanel.addNewQuestion("text", "q1").title = "Question 1";
    question.detailPanelMode = "underRow";
    question.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs, true);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic, #1").toEqualValues([
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
      },
      {
        name: "matrix[0].q1",
        text: "Matrix[0].Question 1",
      },
    ]);
    objs = [];
    question.addConditionObjectsByContext(objs, question.columns[0]);
    updateObjsQuestions(objs, true);
    expect(objs, "addConditionObjectsByContext work correctly for matrix dynamic, #2").toEqualValues([
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
      },
      {
        name: "matrix[0].q1",
        text: "Matrix[0].Question 1",
      },
      {
        context: "col1",
        name: "row.q1",
        text: "row.Question 1",
      },
    ]);
  });

  test("matrixDynamic.getConditionJson, detail panel", () => {
    var names = [];
    var question = new QuestionMatrixDynamicModel("matrix");
    question.addColumn("col1").cellType = "dropdown";
    question.addColumn("col2").cellType = "dropdown";
    question.detailPanel.addNewQuestion("dropdown", "q1").choices = [1, 2];
    question.detailPanelMode = "underRow";
    question.rowCount = 2;
    var json = question.getConditionJson("equals", "[0].q1");
    expect(json.choices, "column 1 get choices").toEqualValues([1, 2]);
    expect(json.type, "column 1 get type").toBe("dropdown");
  });

  test("matrixDynamic.clearInvisibleValues", () => {
    var names = [];
    var question = new QuestionMatrixDynamicModel("matrix");
    question.addColumn("col1").cellType = "dropdown";
    question.addColumn("col2").cellType = "dropdown";
    question.columns[0]["choices"] = [1, 2];
    question.columns[1]["choices"] = [1, 2, 3];
    question.rowCount = 2;
    question.value = [
      { col1: 1, col2: 4 },
      { col4: 1, col2: 2 },
    ];
    question.clearIncorrectValues();
    expect(question.value, "clear unexisting columns and values").toEqualValues([{ col1: 1 }, { col2: 2 }]);
  });

  test("matrixDropdown.clearInvisibleValues", () => {
    var names = [];
    var question = new QuestionMatrixDropdownModel("matrix");
    question.addColumn("col1").cellType = "dropdown";
    question.addColumn("col2").cellType = "dropdown";
    question.columns[0]["choices"] = [1, 2];
    question.columns[1]["choices"] = [1, 2, 3];
    question.rows = ["row1", "row2"];
    question.value = {
      row1: { col1: 1, col2: 4 },
      row0: { col1: 1 },
      row2: { col4: 1, col2: 2 },
    };
    question.clearIncorrectValues();
    expect(question.value, "clear unexisting columns and values").toEqualValues({ row1: { col1: 1 }, row2: { col2: 2 } });
  });

  test("matrixDropdown.clearInvisibleValues, do not clear totals, Bug#2553", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 1,
          columns: [
            {
              name: "Column1",
            },
            {
              name: "Column2",
            },
            {
              name: "Column3",
              cellType: "expression",
              totalType: "sum",
              expression: "{row.Column1}+{row.Column2}",
            },
          ],
          cellType: "text",
        },
      ],
    };

    var survey = new SurveyModel(json);
    var data = {
      "question1-total": { Column3: 3 },
      question1: [{ Column1: "1", Column2: "2", Column3: 3 }],
    };
    survey.data = data;
    survey.clearIncorrectValues(true);
    expect(survey.data, "values should be the same").toEqualValues(data);
  });

  test("Set totals correctly for read-only question", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 1,
          columns: [
            {
              name: "Column1",
            },
            {
              name: "Column2",
            },
            {
              name: "Column3",
              cellType: "expression",
              totalType: "sum",
              expression: "{row.Column1}+{row.Column2}",
            },
          ],
          cellType: "text",
        },
      ],
    };

    var survey = new SurveyModel(json);
    survey.readOnly = true;
    var data = {
      "question1-total": { Column3: 3 },
      question1: [{ Column1: "1", Column2: "2", Column3: 3 }],
    };
    survey.data = data;
    var question = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("question1")
  );
    var renderedTable = question.renderedTable;
    expect(renderedTable.rows[0].cells[2].question.value, "Value for cell expression set correctly").toBe(3);
    expect(renderedTable.footerRow.cells[2].question.value, "Value for total row expression set correctly, #rendered table").toBe(3);
    expect(question.visibleTotalRow.cells[2].question.value, "Value for total row expression set correctly, #visibleTotalRow").toBe(3);
    expect(survey.data, "values should be the same").toEqualValues(data);
  });

  test("matrixdropdown.clearInvisibleValues do not call it on changing condition", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "color",
              cellType: "text",
            },
          ],
          rows: [
            "1",
            {
              value: "2",
              visibleIf: "{var1}=1",
            },
            "3",
          ],
        },
      ],
    });
    var question = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
    expect(question.isEmpty(), "It is empty").toBe(true);
    survey.setValue("var1", 1);
    question.value = { "2": "abc" };
    survey.setValue("var1", 2);
    expect(question.value, "Change nothing").toEqualValues({ "2": "abc" });
    survey.setValue("var1", 1);
  });

  test("Matrixdropdown column.index", () => {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");
    question.rows = ["row1"];
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.columns.push(new MatrixDropdownColumn("column3"));
    for (var i = 0; i < question.columns.length; i++) {
      expect(question.columns[i].index, "column.index is correct after push").toBe(i);
    }
    question.columns.splice(1, 1);
    expect(question.columns.length, "now 2 columns").toBe(2);
    for (var i = 0; i < question.columns.length; i++) {
      expect(question.columns[i].index, "column.index is correct after removing").toBe(i);
    }
  });
  test("Matrixdynamic allowAddRows property", () => {
    var question = new QuestionMatrixDynamicModel("matrix");
    expect(question.allowAddRows, "allowAddRows is true by default").toBe(true);
    expect(question.canAddRow, "canAddRow is true").toBe(true);
    question.allowAddRows = false;
    expect(question.canAddRow, "canAddRow is false").toBe(false);
  });
  test("Matrixdynamic allowRemoveRows property", () => {
    var question = new QuestionMatrixDynamicModel("matrix");
    question.rowCount = 2;
    expect(question.allowRemoveRows, "allowRemoveRows is true by default").toBe(true);
    expect(question.canRemoveRows, "canRemoveRows is true").toBe(true);
    question.allowRemoveRows = false;
    expect(question.canRemoveRows, "canRemoveRows is false").toBe(false);
    question.canRemoveRowsCallback = (allow: boolean): boolean => {
      return question.rowCount > 1;
    };
    expect(question.canRemoveRows, "question.rowCount > 1").toBe(true);
    question.rowCount = 1;
    expect(question.canRemoveRows, "not question.rowCount > 1").toBe(false);
  });
  test("Matrixdynamic addRowButtonLocation", () => {
    var question = new QuestionMatrixDynamicModel("matrix");
    expect(question.renderedTable.showAddRowOnTop, "transposeData=false, addRowButtonLocation='default', #1").toBe(false);
    expect(question.renderedTable.showAddRowOnBottom, "transposeData=false, addRowButtonLocation='default', #2").toBe(true);
    question.addRowButtonLocation = "top";
    expect(question.renderedTable.showAddRowOnTop, "transposeData=false, addRowButtonLocation='top', #1").toBe(true);
    expect(question.renderedTable.showAddRowOnBottom, "transposeData=false, addRowButtonLocation='top', #2").toBe(false);
    question.addRowButtonLocation = "bottom";
    expect(question.renderedTable.showAddRowOnTop, "transposeData=false, addRowButtonLocation='bottom', #1").toBe(false);
    expect(question.renderedTable.showAddRowOnBottom, "transposeData=false, addRowButtonLocation='bottom', #2").toBe(true);
    question.addRowButtonLocation = "topBottom";
    expect(question.renderedTable.showAddRowOnTop, "transposeData=false, addRowButtonLocation='topBottom', #1").toBe(true);
    expect(question.renderedTable.showAddRowOnBottom, "transposeData=false, addRowButtonLocation='topBottom', #2").toBe(true);
    question.transposeData = true;
    question.addRowButtonLocation = "default";
    expect(question.renderedTable.showAddRowOnTop, "transposeData=true, addRowButtonLocation='default', #1").toBe(true);
    expect(question.renderedTable.showAddRowOnBottom, "transposeData=true, addRowButtonLocation='default', #2").toBe(false);
    question.addRowButtonLocation = "top";
    expect(question.renderedTable.showAddRowOnTop, "transposeData=true, addRowButtonLocation='top', #1").toBe(true);
    expect(question.renderedTable.showAddRowOnBottom, "transposeData=true, addRowButtonLocation='top', #2").toBe(false);
    question.addRowButtonLocation = "bottom";
    expect(question.renderedTable.showAddRowOnTop, "transposeData=true, addRowButtonLocation='bottom', #1").toBe(false);
    expect(question.renderedTable.showAddRowOnBottom, "transposeData=true, addRowButtonLocation='bottom', #2").toBe(true);
    question.addRowButtonLocation = "topBottom";
    expect(question.renderedTable.showAddRowOnTop, "transposeData=true, addRowButtonLocation='topBottom', #1").toBe(true);
    expect(question.renderedTable.showAddRowOnBottom, "transposeData=true, addRowButtonLocation='topBottom', #2").toBe(true);
  });

  test("Matrixdynamic showAddRow", () => {
    var question = new QuestionMatrixDynamicModel("matrix");
    expect(question.renderedTable.showAddRow, "#1").toBe(true);
    question.readOnly = true;
    expect(question.renderedTable.showAddRow, "#2").toBe(false);
    question.readOnly = false;
    expect(question.renderedTable.showAddRow, "#3").toBe(true);
    question.rowCount = 0;
    question.allowAddRows = false;
    expect(question.canAddRow, "question.canAddRow").toBe(false);
    expect(question.renderedTable.showAddRowOnTop, "showAddRowOnTop").toBe(false);
    expect(question.renderedTable.showAddRowOnBottom, "showAddRowOnBottom").toBe(false);
    expect(question.renderedTable.showAddRow, "#4").toBe(false);
    question.hideColumnsIfEmpty = true;
    expect(question.canAddRow, "question.canAddRow, #5").toBe(false);
    expect(question.renderedTable.showAddRowOnTop, "showAddRowOnTop, #5").toBe(false);
    expect(question.renderedTable.showAddRowOnBottom, "showAddRowOnBottom, #5").toBe(false);
    expect(question.renderedTable.showAddRow, "#5").toBe(false);
    expect(question.renderedTable.showTable, "#5").toBe(false);
    question.allowAddRows = true;
    expect(question.canAddRow, "question.canAddRow, #6").toBe(true);
    expect(question.renderedTable.showAddRow, "showAddRow #6").toBe(true);
    expect(question.renderedTable.showTable, "showTable #6").toBe(false);
  });

  test("matrix.rowsVisibleIf", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    var qBestCar = new QuestionMatrixDropdownModel("bestCar");
    qBestCar.addColumn("col1");
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    expect(qBestCar.visibleRows.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.visibleRows.length, "BMW is selected").toBe(1);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(qBestCar.visibleRows.length, "3 cars are selected").toBe(3);
    qBestCar.rowsVisibleIf = "";
    expect(qBestCar.visibleRows.length, "there is no filter").toBe(4);
  });
  test("matrix.rowsVisibleIf, use 'row.' context", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown", name: "matrix", rows: ["row1", "row2", "row3"],
          rowsVisibleIf: "{row.col1} != 'a'", cellType: "text", columns: [{ name: "col1" }, { name: "col2" }]
        }
      ]
    });
    var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "all rows are shown").toBe(3);
    matrix.value = { row1: { col1: "a" } };
    expect(matrix.visibleRows.length, "row1 is hidden").toBe(2);
    expect(matrix.value, "matrix.value #1").toEqualValues({ row1: { col1: "a" } });
    matrix.value = { row1: { col1: "a" }, row3: { col1: "a" } };
    expect(matrix.visibleRows.length, "row1, row3 are hidden").toBe(1);
    matrix.clearValue();
    expect(matrix.visibleRows.length, "all rows are shown again").toBe(3);
  });
  test("matrix dropdown rowsVisibleIf, use 'row.' context && total", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown", name: "matrix", rows: ["row1", "row2", "row3"],
          rowsVisibleIf: "{row.col1} != 'a'", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2", totalType: "sum" }]
        }
      ]
    });
    var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    matrix.value = { row1: { col2: 5 }, row2: { col2: 10 }, row3: { col2: 15 } };
    expect(matrix.visibleRows.length, "all rows are shown").toBe(3);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #1").toBe(30);
    matrix.value = { row1: { col1: "a", col2: 5 }, row2: { col2: 10 }, row3: { col2: 15 } };
    expect(matrix.visibleRows.length, "row1 is hidden").toBe(2);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #2").toBe(25);
    matrix.value = { row1: { col1: "a", col2: 5 }, row2: { col2: 10 }, row3: { col1: "a", col2: 15 } };
    expect(matrix.visibleRows.length, "row1, row3 are hidden").toBe(1);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #3").toBe(10);
  });
  test("matrix dropdown rowsVisibleIf, use 'row.' context && total", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "matrixdynamic", name: "matrix",
          rowsVisibleIf: "{row.col1} != {q1}", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2", totalType: "sum" }]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = [{ col1: "a", col2: 5 }, { col1: "b", col2: 10 }, { col1: "a", col2: 15 }];
    expect(matrix.visibleRows.length, "all rows are shown").toBe(3);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #1").toBe(30);
    survey.setValue("q1", "b");
    expect(matrix.visibleRows.length, "row1 is hidden").toBe(2);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #2").toBe(20);
    survey.setValue("q1", "a");
    expect(matrix.visibleRows.length, "row1, row3 are hidden").toBe(1);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #3").toBe(10);
    survey.setValue("q1", "c");
    expect(matrix.visibleRows.length, "all rows are shown").toBe(3);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #4").toBe(30);
  });
  test("matrix dropdown rowsVisibleIf, use 'row.' context && no rows, Bug#8909", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "matrixdynamic", name: "matrix", rowCount: 3,
          rowsVisibleIf: "{row.col1} != {q1}", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2", totalType: "sum" }]
        },
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "all rows are hidden").toBe(0);
    matrix.addRow();
    expect(matrix.visibleRows.length, "all rows are hidden #2").toBe(0);
    survey.setValue("q1", "a");
    expect(matrix.visibleRows.length, "all rows are show").toBe(4);
  });
  test("matrix dropdown rowsVisibleIf, use 'row.' context && total && add new row, Bug#8909", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "matrixdynamic", name: "matrix",
          rowsVisibleIf: "{row.col1} != {q1}", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2", totalType: "sum" }]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = [{ col1: "a", col2: 5 }, { col1: "b", col2: 10 }, { col1: "a", col2: 15 }];
    expect(matrix.visibleRows.length, "all rows are shown").toBe(3);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #1").toBe(30);
    survey.setValue("q1", "a");
    expect(matrix.visibleRows.length, "row1, row3 are hidden").toBe(1);
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #2").toBe(10);
    matrix.addRow();
    expect(matrix.visibleRows.length, "add new row").toBe(2);
    matrix.visibleRows[1].cells[1].value = 40;
    expect(matrix.visibleTotalRow.cells[1].value, "total sum #3").toBe(50);
  });
  test("matrix dropdown rowsVisibleIf, defaultValue & designMode, Bug#9279", () => {
    const json = {
      elements: [
        {
          type: "matrixdropdown", name: "matrix",
          rowsVisibleIf: "{row.col1} != 'a'", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2" }],
          defaultValue: { row1: { col1: "a", col2: 5 }, row2: { col1: "b", col2: 10 }, row3: { col1: "a", col2: 15 } },
          rows: ["row1", "row2", "row3"]
        }
      ]
    };
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    let matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "show all rows").toBe(3);
    survey.setDesignMode(false);
    survey.fromJSON(json);
    matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "row1, row3 are hidden").toBe(1);
  });
  test("matrix dropdown rowsVisibleIf, use 'row.' context & set data correctly", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "matrixdynamic", name: "matrix",
          rowsVisibleIf: "{row.col1} != {q1}", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2" }]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = [{ col1: "a", col2: 5 }, { col1: "b", col2: 10 }, { col1: "a", col2: 15 }];
    expect(matrix.visibleRows.length, "all rows are shown").toBe(3);
    survey.setValue("q1", "a");
    expect(matrix.visibleRows.length, "row1, row3 are hidden").toBe(1);
    matrix.visibleRows[0].cells[1].value = 100;
    expect(matrix.value, "Value set correctly").toEqualValues([{ col1: "a", col2: 5 }, { col1: "b", col2: 100 }, { col1: "a", col2: 15 }]);
    survey.doComplete();
    expect(matrix.value, "Remove items correctly").toEqualValues([{ col1: "b", col2: 100 }]);
  });
  test("Invisible rows & validation, Bug#8853", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: ["row1", "row2", "row3"] },
        {
          type: "matrixdropdown", name: "matrix",
          rowsVisibleIf: "{q1} contains {item}", cellType: "text",
          columns: [{ name: "col1", isRequired: true }, { name: "col2", isRequired: true }],
          rows: ["row1", "row2", "row3"]
        },
      ]
    });
    const data = {
      q1: ["row2"],
      matrix: { row2: { col1: 1, col2: 2 } }
    };
    survey.data = data;
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "one row is visible").toBe(1);
    expect(matrix.validate(), "matrix validate").toBe(true);
    survey.doComplete();
    expect(survey.state, "survey state").toBe("completed");
    expect(survey.data, "survey.data").toEqualValues(data);
  });
  test("Do not clear data for shared values & rowsVisibleIf", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "matrixdynamic", name: "matrix", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2" }]
        },
        {
          type: "matrixdynamic", name: "matrix1", valueName: "matrix",
          rowsVisibleIf: "{row.col1} = {q1}", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2" }]
        },
        {
          type: "matrixdynamic", name: "matrix2", valueName: "matrix",
          rowsVisibleIf: "{row.col1} != {q1}", cellType: "text",
          columns: [{ name: "col1" }, { name: "col2" }]
        }
      ]
    });
    survey.setValue("q1", "a");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    const matrix2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix2");
    matrix.value = [{ col1: "a", col2: 5 }, { col1: "b", col2: 10 }, { col1: "a", col2: 15 }];
    expect(matrix.visibleRows.length, "all rows are shown in matrix").toBe(3);
    expect(matrix1.visibleRows.length, "2 rows are shown in matrix1").toBe(2);
    expect(matrix2.visibleRows.length, "1 row is shown in matrix2").toBe(1);
    expect(matrix.value, "Value set correctly").toEqualValues([{ col1: "a", col2: 5 }, { col1: "b", col2: 10 }, { col1: "a", col2: 15 }]);
    survey.doComplete();
    expect(matrix.value, "Values are shared we don't remove anything").toEqualValues([{ col1: "a", col2: 5 }, { col1: "b", col2: 10 }, { col1: "a", col2: 15 }]);
  });
  test("matrixdropdown.rowsVisibleIf, clear value on making the value invisible", () => {
    const survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        { type: "checkbox", name: "cars", choices: ["Audi", "BMW", "Mercedes", "Volkswagen"] },
        {
          type: "matrixdropdown", name: "bestCar", rows: ["Audi", "BMW", "Mercedes", "Volkswagen"],
          columns: [{ name: "col1" }, { name: "col2" }], cellType: "text", rowsVisibleIf: "{cars} contains {item}"
        }
      ]
    });
    const qBestCar = <QuestionMatrixDropdownModel>survey.getQuestionByName("bestCar");
    const cars = <QuestionCheckboxModel>survey.getQuestionByName("cars");
    cars.value = ["BMW", "Audi", "Mercedes"];
    expect(qBestCar.visibleRows.length, "visible rows #1").toBe(3);
    qBestCar.value = { BMW: { col1: 1 }, Audi: { col2: 2 } };
    expect(qBestCar.value, "Audi is selected").toEqualValues({ BMW: { col1: 1 }, Audi: { col2: 2 } });
    cars.value = ["BMW"];
    expect(qBestCar.visibleRows.length, "visible rows #2").toBe(1);
    survey.doComplete();
    expect(qBestCar.value, "Audi is removed").toEqualValues({ BMW: { col1: 1 } });
    survey.clear(false);
    cars.value = ["Mercedes"];
    expect(qBestCar.visibleRows.length, "visible rows #3").toBe(1);
    survey.doComplete();
    expect(qBestCar.isEmpty(), "All checks are removed").toEqualValues(true);
  });

  test("matrix.defaultRowValue, apply from json and then from UI", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          cellType: "text",
          name: "q1",
          columns: [
            { name: "column1" },
            { name: "column2" },
            { name: "column3" },
          ],
          rowCount: 2,
          defaultRowValue: { column1: "val1", column3: "val3" },
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    expect(question.value, "defaultRowValue set correctly on json loading").toEqualValues([
      { column1: "val1", column3: "val3" },
      { column1: "val1", column3: "val3" },
    ]);
    question.addRow();
    expect(question.value, "defaultRowValue set correclty on adding row").toEqualValues([
      { column1: "val1", column3: "val3" },
      { column1: "val1", column3: "val3" },
      { column1: "val1", column3: "val3" },
    ]);
  });

  test("matrix.defaultRowValue, defaultValue has higher priority than defaultRowValue", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          cellType: "text",
          name: "q1",
          columns: [
            { name: "column1" },
            { name: "column2" },
            { name: "column3" },
          ],
          rowCount: 2,
          defaultRowValue: { column1: "val1", column3: "val3" },
          defaultValue: [
            { column1: "val2", column3: "val5" },
            { column2: "val2", column3: "val4" },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    expect(question.value, "defaultValue is used").toEqualValues([
      { column1: "val2", column3: "val5" },
      { column2: "val2", column3: "val4" },
    ]);
  });

  test("rowIndex variable, in text processing", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            { name: "column1", cellType: "expression", expression: "{rowIndex}" },
          ],
          rowCount: 2,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var rows = question.visibleRows;
    expect(rows[0].cells[0].question.value, "The first row has index 1").toBe(1);
    expect(rows[1].cells[0].question.value, "The first row has index 2").toBe(2);
  });
  test("rowValue variable, in text processing", () => {
    var json = {
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "column1",
              cellType: "expression",
              expression: "{rowValue} * 2",
            },
          ],
          rows: [1, 2, 3],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var rows = question.visibleRows;
    expect(rows[0].cells[0].question.value, "The first row has row name 1").toBe(2);
    expect(rows[1].cells[0].question.value, "The first row has row name 2").toBe(4);
  });
  test("rowValue variable in expression", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            { name: "column1", cellType: "expression", expression: "{rowValue}" },
          ],
          rows: ["Row 1", "Row 2"],
        },
      ],
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const rows = question.visibleRows;
    expect(rows[0].cells[0].question.value, "The first row has rowValue 'Row 1'").toBe("Row 1");
    expect(rows[1].cells[0].question.value, "The first row has rowValue 'Row 2'").toBe("Row 2");
  });
  test("rowName variable in expression", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            { name: "column1", cellType: "expression", expression: "{rowName}" },
          ],
          rows: ["Row 1", "Row 2"],
        },
      ],
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const rows = question.visibleRows;
    expect(rows[0].cells[0].question.value, "The first row has rowName 'Row 1'").toBe("Row 1");
    expect(rows[1].cells[0].question.value, "The first row has rowName 'Row 2'").toBe("Row 2");
  });
  test("row property in custom function", () => {
    var rowCustomFunc = function (params: any) {
      var val = this.row.getValue(params[0]);
      return !!val ? val + val : "";
    };
    FunctionFactory.Instance.register("rowCustomFunc", rowCustomFunc);
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            { name: "col1", cellType: "text" },
            {
              name: "col2",
              cellType: "expression",
              expression: "rowCustomFunc('col1')",
            },
          ],
          rowCount: 2,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var rows = question.visibleRows;
    rows[0].cells[0].question.value = "abc";
    expect(rows[0].cells[1].question.value, "Custom function with row property works correctly").toBe("abcabc");
    FunctionFactory.Instance.unregister("rowCustomFunc");
  });

  test("Complete example with totals and expressions: invoice example", () => {
    Serializer.addProperty("itemvalue", "price:number");

    var getItemPrice = function (params) {
      var question = !!this.row
        ? this.row.getQuestionByColumnName(params[0])
        : null;
      if (!question) return 0;
      var selItem = question.selectedItem;
      return !!selItem ? selItem.price : 0;
    };
    FunctionFactory.Instance.register("getItemPrice", getItemPrice);
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "id",
              cellType: "expression",
              expression: "{rowIndex}",
            },
            {
              name: "phone_model",
              cellType: "dropdown",
              totalType: "count",
              totalFormat: "Items count: {0}",
              choices: [
                { value: "item1", price: 10 },
                { value: "item2", price: 20 },
              ],
            },
            {
              name: "price",
              cellType: "expression",
              expression: "getItemPrice('phone_model')",
              displayStyle: "currency",
            },
            {
              name: "quantity",
              cellType: "text",
              inputType: "number",
              totalType: "sum",
              totalFormat: "Total phones: {0}",
            },
            {
              name: "total",
              cellType: "expression",
              expression: "{row.quantity} * {row.price}",
              displayStyle: "currency",
              totalType: "sum",
              totalDisplayStyle: "currency",
              totalFormat: "Total: {0}",
            },
          ],
          rowCount: 1,
        },
        {
          name: "vatProcents",
          type: "text",
          defaultValue: 20,
        },
        {
          name: "vatTotal",
          type: "expression",
          expression: "{q1-total.total} * {vatProcents} / 100",
        },
        {
          name: "total",
          type: "expression",
          expression: "{q1-total.total} + {vatTotal}",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");

    var rows = question.visibleRows;
    expect(rows[0].cells[2].question.value, "By default price is 0").toBe(0);
    rows[0].cells[1].question.value = "item1";
    expect(rows[0].cells[2].question.value, "Price is ten now").toBe(10);
    rows[0].cells[3].question.value = 5;
    expect(rows[0].cells[4].question.value, "row totals calculated correctly").toBe(10 * 5);

    question.addRow();
    expect(question.visibleRows.length, "There are two rows now").toBe(2);
    rows[1].cells[3].question.value = 3;
    rows[1].cells[1].question.value = "item2";
    expect(rows[1].cells[2].question.value, "Price is 20 for second row").toBe(20);
    expect(rows[1].cells[4].question.value, "row totals calculated correctly for the second row").toBe(20 * 3);

    var totalRow = question.renderedTable.footerRow;
    expect(totalRow.cells[1].question.value, "Two rows").toBe(2);
    expect(totalRow.cells[3].question.value, "5 + 3 items").toBe(8);
    expect(totalRow.cells[4].question.value, "total for items").toBe(10 * 5 + 20 * 3);
    var totalWihtVatQuestion = survey.getQuestionByName("total");
    expect(totalWihtVatQuestion.value, "total for items + VAT").toBe((10 * 5 + 20 * 3) * 1.2);

    FunctionFactory.Instance.unregister("getItemPrice");
    Serializer.removeProperty("itemvalue", "price");
  });

  test("Expression with two columns doesn't work, bug#1199", () => {
    var json = {
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "bldg",
              title: "Building",
              cellType: "text",
            },
            {
              name: "cont",
              title: "Contents",
              cellType: "text",
            },
            {
              name: "tot",
              title: "Total",
              cellType: "expression",
              expression: "{row.bldg} + {row.cont}",
            },
          ],
          cellType: "text",
          rows: [
            {
              value: "B",
              text: "Budgeted",
            },
            {
              value: "A",
              text: "Actual",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
    question.value = { B: { bldg: 4, cont: 6 } };
    var rows = question.visibleRows;
    var val = question.value;
    expect(val.B.tot, "Expression equals 10").toBe(10);
  });

  test("defaultValue: false doesn't work for boolean column after removing row, bug#1266", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            {
              name: "col1",
              cellType: "boolean",
              defaultValue: "false",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var rows = question.visibleRows;
    expect(rows.length, "There are two rows").toBe(2);
    expect(question.value, "defaultValue set correctly").toEqualValues([{ col1: false }, { col1: false }]);
    question.removeRow(1);
    rows = question.visibleRows;
    expect(rows.length, "There is one row").toBe(1);
    expect(question.value, "defaultValue is still there for the first row").toEqualValues([{ col1: false }]);
  });

  test("Test copyDefaultValueFromLastEntry property", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var question = <QuestionMatrixDynamicModel>(
    page.addNewQuestion("matrixdynamic", "question")
  );
    question.rowCount = 0;
    question.cellType = "text";
    question.addColumn("col1");
    question.addColumn("col2");
    question.addColumn("col3");
    question.copyDefaultValueFromLastEntry = true;
    question.addRow();
    question.visibleRows;
    expect(question.isEmpty(), "It is empty").toBe(true);
    question.value = [{ col1: 1, col2: 2 }];
    question.addRow();
    expect(question.value, "copyDefaultValueFromLastEntry is working").toEqualValues([
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2 },
    ]);
    question.defaultRowValue = { col1: 11, col3: 3 };
    question.addRow();
    expect(question.value, "copyDefaultValueFromLastEntry is merging with defaultRowValue").toEqualValues([
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2, col3: 3 },
    ]);
  });

  test("Text preprocessing with capital questions", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "Q11",
          columns: [
            {
              name: "C11",
            },
          ],
          cellType: "text",
          rows: [
            {
              value: "R11",
              text: "{Q11.R11.C11} -- r11",
            },
          ],
        },
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "c1",
            },
          ],
          cellType: "text",
          rows: [
            {
              value: "r1",
              text: "{Q1.R1.C1} -- r1",
            },
          ],
        },
      ],
    });
    survey.data = { Q11: { R11: { C11: "val11" } }, q1: { r1: { c1: "val1" } } };
    const q11 = <QuestionMatrixDropdownModel>survey.getQuestionByName("Q11");
    const q1 = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
    expect(q1.rows[0].locText.renderedHtml, "lowcase name is fine").toBe("val1 -- r1");
    expect(q11.rows[0].locText.renderedHtml, "uppercase name is fine").toBe("val11 -- r11");
  });

  test("Text preprocessing with dot in question, column and row names", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q.1",
          columns: [
            {
              name: "c.1",
            },
          ],
          cellType: "text",
          rows: [
            {
              value: "r.1",
            },
          ],
        },
        {
          type: "text",
          name: "q1",
          title: "{q.1.r.1.c.1}",
        },
      ],
    });
    survey.data = { "q.1": { "r.1": { "c.1": "val1" } } };
    const q1 = <Question>survey.getQuestionByName("q1");
    expect(q1.locTitle.renderedHtml, "work with dots fine").toBe("val1");
  });
  test("Text preprocessing with display names, column and row names", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "c1",
              choices: [{ value: 1, text: "item1" }, { value: 2, text: "item2" }],
            },
          ],
          rows: [
            {
              value: "a",
            },
          ],
        },
        {
          type: "text",
          name: "q2",
          title: "item: {q1.a.c1}",
        },
      ],
    });
    survey.data = { "q1": { "a": { "c1": 2 } } };
    const q2 = <Question>survey.getQuestionByName("q2");
    expect(q2.locTitle.renderedHtml, "work with display values").toBe("item: item2");
  });
  test("Text preprocessing with display names & array", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "c1",
              choices: [{ value: 1, text: "item1" }, { value: 2, text: "item2" }],
            },
          ]
        },
        {
          type: "text",
          name: "q2",
          title: "item: {q1[0].c1}",
        },
      ],
    });
    survey.data = { "q1": [{ "c1": 2 }] };
    const q2 = <Question>survey.getQuestionByName("q2");
    expect(q2.locTitle.renderedHtml, "work with display values").toBe("item: item2");
  });

  test("Shared matrix value name, Bug: Bug# https://surveyjs.answerdesk.io/ticket/details/T1322", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          valueName: "shared",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
          ],
        },
        {
          type: "matrixdynamic",
          name: "q2",
          valueName: "shared",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var q2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    expect(q1.visibleRows.length, "q1 - two rows are by default").toBe(2);
    expect(q2.visibleRows.length, "q2 - two rows are by default").toBe(2);

    var newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    q1.value = newValue;
    expect(q1.value, "set correctly to the first question").toEqualValues(newValue);
    expect(q2.value, "shared correctly to the second question").toEqualValues(newValue);
    expect(3 * 2, "q2 renderedTable rows are correct, #1").toBe(q2.renderedTable.rows.length);
    q1.addRow();
    q1.visibleRows[3].cells[0].value = 4;
    newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }, { col1: 4 }];
    expect(q2.visibleRows.length, "There are  4 rows in the second question").toEqualValues(4);
    expect(4 * 2, "q2 renderedTable rows are correct, #2").toBe(q2.renderedTable.rows.length);
    expect(q1.value, "2. set correctly to the first question").toEqualValues(newValue);
    expect(q2.value, "2. shared correctly to the second question").toEqualValues(newValue);
  });

  test("Copy matrix value on trigger, Bug# https://surveyjs.answerdesk.io/ticket/details/T1322", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
          ],
        },
        {
          type: "matrixdynamic",
          name: "q2",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
          ],
        },
      ],
      triggers: [
        {
          type: "copyvalue",
          expression: "{copyValue} = true",
          setToName: "q2",
          fromName: "q1",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var q2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    expect(q1.visibleRows.length, "q1 - two rows are by default").toBe(2);
    expect(q2.visibleRows.length, "q2 - two rows are by default").toBe(2);
    var newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    q1.value = newValue;
    expect(q1.value, "set correctly to the first question").toEqualValues(newValue);
    var rowsChangedCounter = 0;
    q2.visibleRowsChangedCallback = function () {
      rowsChangedCounter++;
    };
    expect(2 * 2, "q2 renderedTable rows are correct, #1").toBe(q2.renderedTable.rows.length);
    survey.setValue("copyValue", true);
    expect(3 * 2, "q2 renderedTable rows are correct, #2").toBe(q2.renderedTable.rows.length);
    expect(q2.value, "set correctly to the second question on trigger").toEqualValues(newValue);
  });
  test("columnsVisibleIf produce the bug, Bug#1540", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 1,
          columns: [{ name: "col1" }, { name: "col2", visibleIf: "{row.col1} empty" }],
          cellType: "text"
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    let table = matrix.renderedTable;
    expect(table.rows.length, "There are 4 rows in the table").toBe(2);
    expect(table.rows[0].cells.length, "There are 3 cells in the first row").toBe(3);
    matrix.visibleRows[0].cells[0].value = "a";
    table = matrix.renderedTable;
    expect(table.rows[0].cells.length, "There are 2 cells in the second row").toBe(2);
    matrix.addRow();
    table = matrix.renderedTable;
    expect(table.rows.length, "There are 4 rows in the table after adding a row").toBe(4);
    expect(table.rows[0].cells.length, "There are 3 cells in the first row after adding a row").toBe(3);
    expect(table.rows[3].cells.length, "There are 3 cells in the last row after adding a row").toBe(3);
  });
  test("columnsVisibleIf produce the bug, Bug#1540", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "matrixdynamic",
              name: "group_clinician_user_attributes",
              title: "Clinician members",
              columnsVisibleIf: "{item} != 'id'",
              columns: [
                {
                  name: "id",
                  cellType: "text",
                },
                {
                  name: "user_id",
                  title: "user",
                  cellType: "dropdown",
                  choices: [
                    {
                      value: "2",
                      text: "Test User 1",
                    },
                    {
                      value: "4",
                      text: "Test User 2",
                    },
                    {
                      value: "6",
                      text: "Test User 3",
                    },
                    {
                      value: "8",
                      text: "Test User 4",
                    },
                    {
                      value: "10",
                      text: "Test User 5",
                    },
                  ],
                },
                {
                  name: "role",
                  cellType: "dropdown",
                  visibleIf: "{row.user_id} notempty and {roles} notempty",
                  choices: [
                    "PI",
                    "Collaborator",
                    "Co-Investigator",
                    "Technician",
                    "PhD-Student",
                    "Student",
                    "Post-Doc",
                    "Researcher",
                    "MD",
                  ],
                  placeholder: "not specified",
                  choicesVisibleIf: "{roles} contains {item}",
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.data = {
      name: "excepturidd",
      roles: ["Co-Investigator", "Collaborator"],
      acl: [
        {
          group_id: "4",
          actions: ["read"],
        },
      ],
      owner_id: 1,
      group_clinician_user_attributes: [
        {
          id: 61,
          role: "Collaborator",
          user_id: 4,
        },
        {
          id: 63,
          role: null,
          user_id: 8,
        },
      ],
    };
    expect(survey.getQuestionByName("group_clinician_user_attributes").name, "There is no exception").toBe("group_clinician_user_attributes");
  });

  test("column.choicesEnableIf", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              choices: [1, 2, 3, 4],
            },
            {
              name: "col2",
              cellType: "dropdown",
              choices: [1, 2, 3, 4],
              choicesEnableIf: "{row.col1} contains {item}",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var row = matrix.visibleRows[0];
    var col1Q = row.getQuestionByColumnName("col1");
    var col2Q = <QuestionDropdownModel>row.getQuestionByColumnName("col2");
    var col2TemplateQ = matrix.columns[1].templateQuestion;
    expect(col2Q.choicesEnableIf, "The choicesEnableIf property is set").toBe("{row.col1} contains {item}");
    expect(col2TemplateQ.loadingOwner, "loading owner is set to template question").toBeTruthy();
    expect(col2Q.loadingOwner, "loading owner is set to question").toBeTruthy();
    expect(col2TemplateQ.isLoadingFromJson, "We are not loading from JSON template question").toBe(false);
    expect(col2Q.isLoadingFromJson, "We are not loading from JSON cell question").toBe(false);
    matrix.columns[1].startLoadingFromJson();
    expect(col2TemplateQ.isLoadingFromJson, "We are loading from JSON the template question").toBe(true);
    expect(col2Q.isLoadingFromJson, "We are loading from JSON the cell question").toBe(true);
    matrix.columns[1].endLoadingFromJson();

    expect(col2Q.choices.length, "There are 4 choices").toBe(4);
    expect(col2Q.choices[0].isEnabled, "First choice is disabled").toBe(false);
    expect(col2Q.choices[1].isEnabled, "Second choice is disabled").toBe(false);
    col1Q.value = [1, 2];
    expect(col2Q.choices[0].isEnabled, "First choice is enabled now").toBe(true);
    expect(col2Q.choices[1].isEnabled, "The second choice is enabled now").toBe(true);
    expect(col2Q.choices[2].isEnabled, "The third choice is still disabled").toBe(false);
  });

  test("register function on visibleChoices change calls many times, Bug#1622", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "q1",
              choices: ["1", "2"],
            },
          ],
          rowCount: 2,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var question = matrix.visibleRows[0].cells[0].question;
    var counter = 0;
    question.registerPropertyChangedHandlers(
      ["visibleChoices"],
      function () {
        counter++;
      }
    );
    matrix.columns[0].choices = ["1", "2", "3"];
    expect(question.choices.length, "Choices set correctly").toEqualValues(3);
    expect(counter, "There was only one change").toBe(1);
  });
  test("customwidget.readOnlyChangedCallback doesn't work correctly, https://surveyjs.answerdesk.io/ticket/details/T1869", () => {
    var isReadOnly = false;
    var isFitValue = false;
    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.addCustomWidget({
      name: "customWidget",
      isFit: (question) => {
        var res = question.getType() == "text";
        if (res) {
          isFitValue = true;
          const onReadOnlyChangedCallback = function () {
            isReadOnly = question.isReadOnly;
          };
          question.readOnlyChangedCallback = onReadOnlyChangedCallback;
          onReadOnlyChangedCallback();
        }
        return res;
      },
    });
    var json = {
      elements: [
        {
          type: "dropdown",
          name: "renVer",
          choices: [1, 2],
          defaultValue: 1,
        },
        {
          type: "matrixdynamic",
          name: "m",
          columns: [
            {
              name: "DESC",
              cellType: "text",
              enableIf: "{renVer} = 2",
            },
          ],
          rowCount: 1,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    var rows = matrix.visibleRows;
    expect(rows.length, "rows are created").toBe(1);
    expect(isFitValue, "cell text question is a custom widget").toBe(true);
    expect(isReadOnly, "cell text question is readonly").toBe(true);
    CustomWidgetCollection.Instance.clear();
  });

  test("Values from invisible rows should be removed, #1644", () => {
    var json = {
      elements: [
        { type: "text", name: "q1" },
        {
          type: "matrixdropdown",
          name: "q2",
          columns: [{ name: "col1" }, { name: "col2" }],
          rows: [{ value: "row1", visibleIf: "{q1} = 1" }, "row2"],
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.data = { q1: 2, q2: { row1: { col1: "a" }, row2: { col2: "b" } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("q2");
    expect(matrix.visibleRows.length, "One row is visible").toBe(1);
    survey.doComplete();
    expect(survey.data, "Remove value for invisible row").toEqualValues({ q1: 2, q2: { row2: { col2: "b" } } });
  });

  test("matrix.hasTotal property", () => {
    var matrix = new QuestionMatrixDropdownModel("q1");
    matrix.addColumn("col1");
    expect(matrix.hasTotal, "There is no total").toBe(false);
    matrix.columns[0].totalType = "sum";
    expect(matrix.hasTotal, "There is total now, totalType").toBe(true);
    matrix.columns[0].totalType = "none";
    expect(matrix.hasTotal, "There is no total again").toBe(false);
    matrix.columns[0].totalExpression = "sumInArray({q1}, 'col1')";
    expect(matrix.hasTotal, "There is total, total expression").toBe(true);
  });

  test("Test matrix.totalValue, expression question", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p1");
    const matrix = new QuestionMatrixDynamicModel("q1");
    page.addElement(matrix);
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    matrix.addColumn("col3");
    matrix.columns[0].totalType = "sum";
    matrix.columns[1].totalType = "sum";
    matrix.columns[2].totalExpression = "{row.col1} + {row.col2}";
    matrix.value = [
      { col1: 1, col2: 10 },
      { col1: 2, col2: 20 },
      {},
      { col1: 4, col2: 40 },
    ];
    var row = matrix.visibleTotalRow;
    expect(row, "Total row is not empty").toBeTruthy();
    expect(row.cells.length, "There are three cells here").toBe(3);
    var question = row.cells[0].question;
    expect(question.getType(), "We can have only expression type cells in total").toBe("expression");
    expect(question.expression, "Set expression correctly").toBe("sumInArray({matrix}, 'col1')");
    expect(question.value, "Calculated correctly").toBe(1 + 2 + 4);
    expect(row.cells[1].value, "Calculated correctly, the second cell").toBe(10 + 20 + 40);
    expect(row.cells[2].value, "Calculated correctly, {row.col1} + {row.col2}").toBe(1 + 2 + 4 + 10 + 20 + 40);
    expect(matrix.totalValue, "Total value calculated correctly").toEqualValues({ col1: 7, col2: 70, col3: 77 });
    expect(survey.getValue("q1-total"), "Total value set into survey correctly").toEqualValues({ col1: 7, col2: 70, col3: 77 });
  });
  test("sumInArray vs conditional logic, #10305", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultValue: 0 },
        { type: "matrixdynamic", name: "q2",
          columns: [{ cellType: "text", name: "col1", totalExpression: "sumInArray({matrix}, 'col1', '{col2} > {q1}')" },
            { cellType: "text", name: "col2" }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    matrix.value = [
      { col1: 1, col2: 10 },
      { col1: 2, col2: 20 },
      { col1: 3, col2: 30 },
      { col1: 4, col2: 40 },
    ];
    expect(matrix.totalValue, "Total value #1").toEqualValues({ col1: 10 });
    survey.setValue("q1", 15);
    expect(matrix.totalValue, "Total value #2").toEqualValues({ col1: 9 });
    survey.setValue("q1", 35);
    expect(matrix.totalValue, "Total value #3").toEqualValues({ col1: 4 });
    survey.setValue("q1", 1);
    expect(matrix.totalValue, "Total value #4").toEqualValues({ col1: 10 });
  });

  test("Test totals, different value types", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var matrix = new QuestionMatrixDynamicModel("q1");
    page.addElement(matrix);
    matrix.addColumn("col1");
    matrix.columns[0].totalType = "count";
    var value = [
      { col1: 1, col2: 10 },
      { col1: 2, col2: 20 },
      {},
      { col1: 3, col2: 40 },
    ];
    matrix.value = value;
    var rows = matrix.visibleRows;
    var row = matrix.visibleTotalRow;
    var question = row.cells[0].question;
    expect(question.value, "There are 3 values").toBe(3);
    matrix.columns[0].totalType = "min";
    survey.setValue("q2", 1);
    expect(question.value, "Min is 1").toBe(1);
    matrix.columns[0].totalType = "max";
    survey.setValue("q2", 2);
    expect(question.value, "Max is 3").toBe(3);
    matrix.columns[0].totalType = "avg";
    survey.setValue("q2", 3);
    expect(question.value, "Average is 2").toBe(2);
    matrix.columns[0].totalType = "sum";
    matrix.columns[0].totalFormat = "Sum: {0}";
    matrix.columns[0].totalDisplayStyle = "currency";
    survey.setValue("q2", 4);
    expect(question.displayValue, "Use total column properties").toBe("Sum: $6.00");
  });

  test("Test totals, load from JSON", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            {
              name: "Column 1",
              totalType: "count",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var row = matrix.visibleTotalRow;
    var question = row.cells[0].question;
    expect(question.value, "The initial value is zero").toBe(0);
  });

  test("enableIf for new rows, Bug# https://surveyjs.answerdesk.io/ticket/details/T2065", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            {
              name: "col1",
              cellType: "text",
            },
          ],
          enableIf: "{q} = 'a'",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    expect(matrix.visibleRows[0].cells[0].question.isReadOnly, "It is readOnly by default").toBe(true);
    expect(matrix.visibleRows[0].cells[0].question.readOnly, "Property is not read-only").toBe(false);
    survey.setValue("q", "a");
    expect(matrix.visibleRows[0].cells[0].question.isReadOnly, "It is not readOnly now").toBe(false);
    matrix.addRow();
    expect(matrix.visibleRows[2].cells[0].question.isReadOnly, "New added row is not readonly").toBe(false);
    survey.clearValue("q");
    expect(matrix.visibleRows[0].cells[0].question.isReadOnly, "The first row is readOnly again").toBe(true);
    expect(matrix.visibleRows[2].cells[0].question.isReadOnly, "The last row is readOnly").toBe(true);
  });

  test("matrix dropdown + renderedTable.headerRow", () => {
    var matrix = new QuestionMatrixDropdownModel("q1");
    matrix.addColumn("col1");
    matrix.columns[0].cellType = "text";
    matrix.addColumn("col2");
    matrix.columns[1].minWidth = "100px";
    matrix.rows = ["row1", "row2", "row3"];
    expect(matrix.renderedTable.showHeader, "Header is shown").toBe(true);
    var cells = matrix.renderedTable.headerRow.cells;
    expect(cells.length, "rows + 2 column").toBe(3);
    expect(cells[0].hasTitle, "header rows, nothing to render").toBe(false);
    expect(cells[0].minWidth, "minWidth is empty for row header").toBe("");
    expect(cells[0].width, "width is empty for row header").toBe("");
    expect(cells[1].hasTitle, "col1").toBe(true);
    expect(cells[1].hasQuestion, "no question").toBe(false);
    expect(cells[1].minWidth, "col1.minWidth").toBe("");
    expect(cells[1].isRemoveRow, "do not have remove row").toBeFalsy();
    expect(cells[1].locTitle.renderedHtml, "col1").toBe("col1");
    expect(cells[2].locTitle.renderedHtml, "col2").toBe("col2");
    expect(cells[2].minWidth, "col2.minWidth").toBe("100px");

    matrix.rowTitleWidth = "400px";
    cells = matrix.renderedTable.headerRow.cells;
    expect(cells[0].width, "col1 width get from rowTitleWidth").toBe("400px");
    expect(cells[0].minWidth, "col1 min-width get from rowTitleWidth").toBe("400px");

    matrix.showHeader = false;
    expect(matrix.renderedTable.showHeader, "Header is not shown").toBe(false);
    expect(!!matrix.renderedTable.headerRow, "Header row is null").toBeFalsy();

    //Test case for #2346 - set width to <td> in first row if header is hidden
    var firstRow = matrix.renderedTable.rows[1];
    expect(firstRow.cells[2].minWidth, "Header is hidden: col2.minWidth").toBe("100px");
    expect(firstRow.cells[0].width, "Header is hidden: col1 width get from rowTitleWidth").toBe("400px");

    matrix.transposeData = true;
    cells = matrix.renderedTable.headerRow.cells;
    expect(cells.length, "3 rows").toBe(3);
    expect(cells[0].locTitle.renderedHtml, "row1").toBe("row1");
    expect(cells[2].locTitle.renderedHtml, "row1").toBe("row3");

    matrix.showHeader = true;
    cells = matrix.renderedTable.headerRow.cells;
    expect(cells.length, "3 rows + columns").toBe(4);
    expect(cells[0].hasTitle, "empty for header").toBe(false);
    expect(cells[1].locTitle.renderedHtml, "row1").toBe("row1");
    expect(cells[1].row.rowName, "row is set in vertical column").toBe("row1");
    expect(cells[3].locTitle.renderedHtml, "row3").toBe("row3");
  });

  test("matrix dynamic + renderedTable.headerRow", () => {
    var matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.columns[0].cellType = "text";
    matrix.addColumn("col2");
    matrix.columns[1].minWidth = "100px";
    matrix.rowCount = 3;
    expect(matrix.renderedTable.showHeader, "Header is shown").toBe(true);
    var cells = matrix.renderedTable.headerRow.cells;
    expect(cells.length, "2 column + remove row").toBe(3);
    expect(cells[0].hasTitle, "col1").toBe(true);
    expect(cells[0].hasQuestion, "no question").toBe(false);
    expect(cells[0].locTitle.renderedHtml, "col1").toBe("col1");
    expect(cells[0].isRemoveRow, "do not have remove row").toBeFalsy();
    expect(cells[1].locTitle.renderedHtml, "col2").toBe("col2");
    expect(cells[2].hasTitle, "remove row").toBe(false);
    matrix.minRowCount = 3;
    cells = matrix.renderedTable.headerRow.cells;
    expect(cells.length, "2 column").toBe(2);
    expect(cells[0].hasTitle, "col1").toBe(true);
    expect(cells[0].locTitle.renderedHtml, "col1").toBe("col1");
    expect(cells[1].locTitle.renderedHtml, "col2").toBe("col2");
    matrix.addRow();
    cells = matrix.renderedTable.headerRow.cells;
    expect(cells.length, "2 column + removeRow").toBe(3);
    matrix.showHeader = false;
    expect(matrix.renderedTable.showHeader, "Header is not shown").toBe(false);
    expect(!!matrix.renderedTable.headerRow, "Header row is null").toBeFalsy();

    matrix.transposeData = true;
    expect(matrix.renderedTable.showHeader, "Header is not shown, columnLayout is vertical").toBe(false);
    matrix.showHeader = true;
    expect(matrix.renderedTable.showHeader, "Header is not shown, columnLayout is still vertical").toBe(false);
  });

  test("matrix dropdown + renderedTable.rows", () => {
    var matrix = new QuestionMatrixDropdownModel("q1");
    matrix.addColumn("col1");
    matrix.columns[0].cellType = "text";
    matrix.addColumn("col2");
    matrix.columns[1].minWidth = "100px";
    matrix.rows = ["row1", "row2", "row3"];
    var rows = matrix.renderedTable.rows;
    expect(rows.length, "There are 3 rows").toBe(3 * 2);
    var cells = rows[1].cells;
    expect(cells.length, "rows + 2 column").toBe(3);
    expect(cells[0].hasTitle, "header rows").toBe(true);
    expect(cells[0].locTitle.renderedHtml, "row1").toBe("row1");
    expect(cells[1].hasTitle, "col1").toBe(false);
    expect(cells[1].hasQuestion, "col1 question").toBe(true);
    expect(cells[1].question.getType(), "col1.cellType").toBe("text");
    expect(cells[1].isRemoveRow, "col1 do not have remove row").toBeFalsy();

    expect(cells[2].hasTitle, "col2").toBe(false);
    expect(cells[2].hasQuestion, "col2 question").toBe(true);
    expect(cells[2].question.getType(), "col2.cellType").toBe("dropdown");
    expect(cells[2].isRemoveRow, "col1 do not have remove row").toBeFalsy();

    cells = rows[5].cells;
    expect(cells[0].locTitle.renderedHtml, "row3").toBe("row3");
    expect(cells[1].question.getType(), "col1.cellType").toBe("text");
    expect(cells[2].question.getType(), "col2.cellType").toBe("dropdown");

    matrix.transposeData = true;
    var rows = matrix.renderedTable.rows;
    expect(rows.length, "2 columns").toBe(4);
    cells = rows[1].cells;
    expect(cells.length, "column + 3 rows").toBe(4);
    expect(cells[0].locTitle.renderedHtml, "col1 title").toBe("col1");
    expect(cells[0].hasQuestion, "col1 title, no question").toBe(false);
    expect(cells[1].question.getType(), "row1.col1 cellType-text").toBe("text");
    expect(cells[1].cell.column.name, "row1.col1 correct column").toBe("col1");
    expect(cells[3].question.getType(), "row3.col1 cellType-text").toBe("text");
    expect(cells[3].cell.column.name, "row3.col1 correct column").toBe("col1");
    cells = rows[3].cells;
    expect(cells[0].locTitle.renderedHtml, "col2 title").toBe("col2");
    expect(cells[1].question.getType(), "row1.col2 cellType-text").toBe("dropdown");
    expect(cells[1].cell.column.name, "row1.col2 correct column").toBe("col2");
    expect(cells[3].question.getType(), "row3.col2 cellType-text").toBe("dropdown");
    expect(cells[3].cell.column.name, "row3.col2 correct column").toBe("col2");
  });

  test("matrix dropdown + renderedTable.rows - title width", () => {
    var matrix = new QuestionMatrixDropdownModel("q1");
    matrix.addColumn("col1");
    matrix.columns[0].cellType = "text";
    matrix.addColumn("col2");
    matrix.rows = ["row1", "row2"];

    var rows;
    var cells;
    rows = matrix.renderedTable.rows.filter(r => !(r instanceof QuestionMatrixDropdownRenderedErrorRow));

    cells = matrix.renderedTable.headerRow.cells;
    expect(cells[0].width, "header row col1 width get from rowTitleWidth").toBe("");
    expect(cells[0].minWidth, "header row col1 min-width get from rowTitleWidth").toBe("");

    cells = rows[0].cells;
    expect(cells[0].width, "row 1 col1 width get from rowTitleWidth").toBe("");
    expect(cells[0].minWidth, "row 1 col1 min-width get from rowTitleWidth").toBe("");

    cells = rows[1].cells;
    expect(cells[0].width, "row 2 col1 width get from rowTitleWidth").toBe("");
    expect(cells[0].minWidth, "row 2 col1 min-width get from rowTitleWidth").toBe("");

    matrix.rowTitleWidth = "400px";
    rows = matrix.renderedTable.rows.filter(r => !(r instanceof QuestionMatrixDropdownRenderedErrorRow));

    cells = matrix.renderedTable.headerRow.cells;
    expect(cells[0].width, "header row col1 width get from rowTitleWidth").toBe("400px");
    expect(cells[0].minWidth, "header row col1 min-width get from rowTitleWidth").toBe("400px");

    cells = rows[0].cells;
    expect(cells[0].width, "row 1 col1 width get from rowTitleWidth").toBe("400px");
    expect(cells[0].minWidth, "row 1 col1 min-width get from rowTitleWidth").toBe("400px");

    cells = rows[1].cells;
    expect(cells[0].width, "row 2 col1 width get from rowTitleWidth").toBe("400px");
    expect(cells[0].minWidth, "row 2 col1 min-width get from rowTitleWidth").toBe("400px");

  });

  test("matrix dynamic + renderedTable.rows", () => {
    var matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.columns[0].cellType = "text";
    matrix.addColumn("col2");
    matrix.columns[1].minWidth = "100px";
    matrix.rowCount = 3;
    var rows = matrix.renderedTable.rows;
    expect(rows.length, "There are 3 rows").toBe(3 * 2);
    var cells = rows[1].cells;
    expect(cells.length, "2 column + remove").toBe(3);
    expect(cells[0].hasTitle, "col1").toBe(false);
    expect(cells[0].hasQuestion, "col1 question").toBe(true);
    expect(cells[0].question.getType(), "col1.cellType").toBe("text");
    expect(cells[0].isActionsCell, "col1 do not have remove row (in actions cell)").toBeFalsy();
    expect(cells[0].row, "col1 has row property set").toBeTruthy();

    expect(cells[1].hasTitle, "col2").toBe(false);
    expect(cells[1].hasQuestion, "col2 question").toBe(true);
    expect(cells[1].question.getType(), "col2.cellType").toBe("dropdown");
    expect(cells[1].isActionsCell, "col2 do not have remove row (in actions cell)").toBeFalsy();

    expect(cells[2].hasTitle, "remove row").toBe(false);
    expect(cells[2].hasQuestion, "col2 question").toBe(false);
    expect(cells[2].isActionsCell, "is Remove row (in actions cell)").toBe(true);
    expect(!!cells[2].row, "is Remove has row property").toBeTruthy();

    cells = rows[5].cells;
    expect(cells[0].question.getType(), "col1.cellType").toBe("text");
    expect(cells[1].question.getType(), "col2.cellType").toBe("dropdown");
    expect(cells[2].isActionsCell, "is Remove row (in actions cell)").toBe(true);

    matrix.minRowCount = 3;
    cells = matrix.renderedTable.rows[1].cells;
    expect(cells.length, "2 columns only").toBe(2);
    matrix.minRowCount = 2;
    cells = matrix.renderedTable.rows[1].cells;
    expect(cells.length, "2 columns + remove again").toBe(3);

    matrix.transposeData = true;
    rows = matrix.renderedTable.rows;
    expect(rows.length, "2 columns + remove + errors").toBe(5);
    cells = rows[1].cells;
    expect(cells.length, "column + 3 rows").toBe(4);
    expect(cells[0].locTitle.renderedHtml, "col1 title").toBe("col1");
    expect(cells[0].hasQuestion, "col1 title, no question").toBe(false);
    expect(cells[1].question.getType(), "row1.col1 cellType-text").toBe("text");
    expect(cells[1].cell.column.name, "row1.col1 correct column").toBe("col1");
    expect(cells[1].row, "col1 has row property set").toBeTruthy();
    expect(cells[3].question.getType(), "row3.col1 cellType-text").toBe("text");
    expect(cells[3].cell.column.name, "row3.col1 correct column").toBe("col1");
    cells = rows[3].cells;
    expect(cells[0].locTitle.renderedHtml, "col2 title").toBe("col2");
    expect(cells[1].question.getType(), "row1.col2 cellType-text").toBe("dropdown");
    expect(cells[1].cell.column.name, "row1.col2 correct column").toBe("col2");
    expect(cells[3].question.getType(), "row3.col2 cellType-text").toBe("dropdown");
    expect(cells[3].cell.column.name, "row3.col2 correct column").toBe("col2");

    cells = rows[4].cells;
    expect(cells.length, "column + 3 rows").toBe(4);
    expect(cells[0].hasTitle, "for column header").toBe(false);
    expect(cells[0].isActionsCell, "not a remove button (in actions cell)").toBeFalsy();
    expect(cells[1].isActionsCell, "row1: it is a remove row (in actions cell)").toBe(true);
    expect(cells[1].row, "row1: it has a row").toBeTruthy();
    expect(cells[3].isActionsCell, "row3: it is a remove row (in actions cell)").toBe(true);
    expect(cells[3].row, "row3: it has a row").toBeTruthy();

    matrix.minRowCount = 3;
    rows = matrix.renderedTable.rows;
    expect(rows.length, "2 columns + errors").toBe(2 * 2);

    matrix.showHeader = false;
    cells = matrix.renderedTable.rows[1].cells;
    expect(cells.length, "3 rows").toBe(3);
    expect(cells[0].question.getType(), "row1.col1 cellType-text").toBe("text");
    expect(cells[2].question.getType(), "row3.col1 cellType-text").toBe("text");
  });

  test("matrix dropdown + renderedTable + totals", () => {
    var matrix = new QuestionMatrixDropdownModel("q1");
    matrix.totalText = "ABC:";
    matrix.addColumn("col1");
    matrix.columns[0].cellType = "text";
    matrix.columns[0].totalType = "count";
    matrix.addColumn("col2");
    matrix.columns[1].minWidth = "100px";
    matrix.rows = ["row1", "row2", "row3"];

    expect(matrix.renderedTable.showFooter, "Footer is shown").toBe(true);
    expect(matrix.renderedTable.footerRow, "Footer row exists").toBeTruthy();
    matrix.columns[0].totalType = "none";

    expect(matrix.renderedTable.showFooter, "Footer is not shown").toBe(false);
    expect(matrix.renderedTable.footerRow, "Footer row not exists").toBeFalsy();

    matrix.columns[0].totalType = "count";
    matrix.transposeData = true;
    expect(matrix.renderedTable.showFooter, "Footer is not shown, columnLayout is vertical").toBe(false);
    expect(matrix.renderedTable.footerRow, "Footer row not exists, columnLayout is vertical").toBeFalsy();
    expect(matrix.renderedTable.headerRow.cells[4].locTitle.renderedHtml, "total text").toBe("ABC:");
    matrix.transposeData = false;
    expect(matrix.renderedTable.showFooter, "Footer is not shown again").toBe(true);
    expect(matrix.renderedTable.footerRow, "Footer row exists").toBeTruthy();

    var cells = matrix.renderedTable.footerRow.cells;
    expect(cells.length, "rowHeader + 2 columns").toBe(3);
    expect(cells[0].hasTitle, "header rows").toBe(true);
    expect(cells[0].locTitle.renderedHtml, "footer rows").toBe("ABC:");
    expect(cells[0].hasQuestion, "footer rows, no question").toBe(false);
    expect(cells[1].hasTitle, "total, not title").toBe(false);
    expect(cells[1].question.getType(), "total, it is expression").toBe("expression");
    expect(cells[2].hasTitle, "total, not title").toBe(false);
    expect(cells[2].question.getType(), "total, it is expression").toBe("expression");
    expect(cells[2].minWidth, "total, set minWidth").toBe("100px");

    matrix.transposeData = true;
    var rows = matrix.renderedTable.rows;
    expect(rows.length, "2 columns").toBe(4);
    cells = rows[1].cells;
    expect(cells.length, "column + 3 rows + total").toBe(5);
    expect(cells[0].locTitle.renderedHtml, "col1 title").toBe("col1");
    expect(cells[0].hasQuestion, "col1 title, no question").toBe(false);
    expect(cells[1].question.getType(), "row1.col1 cellType-text").toBe("text");
    expect(cells[1].cell.column.name, "row1.col1 correct column").toBe("col1");
    expect(cells[3].question.getType(), "row3.col1 cellType-text").toBe("text");
    expect(cells[3].cell.column.name, "row3.col1 correct column").toBe("col1");
    expect(cells[4].question.getType(), "total, question").toBe("expression");
    expect(cells[4].hasTitle, "total, no title").toBe(false);
  });

  test("matrix dynamic + renderedTable + totals", () => {
    var matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.columns[0].cellType = "text";
    matrix.columns[0].totalType = "count";
    matrix.addColumn("col2");
    matrix.columns[1].minWidth = "100px";
    matrix.rowCount = 3;

    var cells = matrix.renderedTable.headerRow.cells;
    expect(cells.length, "2 columns + total").toBe(3);
    expect(cells[0].hasTitle, "header, col1").toBe(true);
    expect(cells[0].locTitle.renderedHtml, "header, col1").toBe("col1");
    expect(cells[1].locTitle.renderedHtml, "header, col2").toBe("col2");
    expect(cells[2].hasTitle, "header total, there is no title").toBe(false);

    matrix.transposeData = true;
    var rows = matrix.renderedTable.rows;
    expect(rows.length, "2 columns + remove + errors").toBe(5);
    cells = rows[4].cells;
    expect(cells.length, "column + 3 rows + total").toBe(5);
    expect(cells[0].hasTitle, "for column header").toBe(false);
    expect(cells[0].isActionsCell, "not a remove button (in actions cell)").toBeFalsy();
    expect(cells[1].isActionsCell, "row1: it is a remove row (in actions cell)").toBe(true);
    expect(cells[1].row, "row1: it has a row").toBeTruthy();
    expect(cells[3].isActionsCell, "row3: it is a remove row (in actions cell)").toBe(true);
    expect(cells[3].row, "row3: it has a row").toBeTruthy();
    expect(cells[4].hasTitle, "for total").toBe(false);
  });

  test("matrix dynamic + renderedTable + add/remove rows", () => {
    var matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.columns[0].cellType = "text";
    matrix.columns[0].totalType = "count";
    matrix.addColumn("col2");
    matrix.columns[1].minWidth = "100px";
    matrix.rowCount = 3;

    expect(matrix.renderedTable.rows.length, "There are 3 rows").toBe(3 * 2);
    var firstRowId = matrix.renderedTable.rows[1].id;
    var thirdRowId = matrix.renderedTable.rows[5].id;
    matrix.addRow();
    expect(matrix.renderedTable.rows.length, "There are 4 rows").toBe(4 * 2);
    expect(matrix.renderedTable.rows[1].id, "Do not recreate row1 Id").toBe(firstRowId);
    expect(matrix.renderedTable.rows[5].id, "Do not recreate row3 Id").toBe(thirdRowId);
    matrix.removeRow(1);
    expect(matrix.renderedTable.rows.length, "There are 3 rows after remove").toBe(3 * 2);
    expect(matrix.renderedTable.rows[1].id, "Do not recreate row1 Id on remove").toBe(firstRowId);
    expect(matrix.renderedTable.rows[3].id, "Do not recreate row3 Id on remove").toBe(thirdRowId);
  });
  test("matrix dynamic + renderedTable + remove buttons", () => {
    const matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.rowCount = 0;

    expect(matrix.renderedTable.rows.length, "There are no rows").toBe(0);
    matrix.addRow();
    matrix.addRow();
    matrix.addRow();
    var rows = matrix.renderedTable.rows;
    expect(rows.length, "There are 3 rows").toBe(3 * 2);
    expect(rows[0].cells.length, "column + delete button").toBe(2);
    expect(rows[1].cells[1].isActionsCell, "it is an action cell, row0").toBe(true);
    expect(rows[3].cells[1].isActionsCell, "it is an action cell, row1").toBe(true);
    expect(rows[5].cells[1].isActionsCell, "it is an action cell, row2").toBe(true);
    //Bug #3449
    matrix.transposeData = true;
    rows = matrix.renderedTable.rows;
    expect(rows.length, "one column and remove buttons rows + errors rows").toBe(3);
    expect(rows[1].cells[0].locTitle.renderedHtml, "column header").toBe("col1");
    expect(rows[2].cells.length, "One empty cell and 3 delete buttons").toBe(4);
    expect(rows[2].cells[0].isActionsCell, "there is no actions in first cell delete row").toBe(false);
    expect(rows[2].cells[0].isEmpty, "cell is empty").toBe(true);
    expect(rows[2].cells[1].isActionsCell, "there are actions in the second cell delete row").toBe(true);
    expect(rows[2].cells[3].isActionsCell, "there are actions in the last cell delete row").toBe(true);
  });

  test("matrix dynamic + renderedTable + placeholder and columnColCount", () => {
    const matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    matrix.addColumn("col3");
    matrix.addColumn("col4");
    matrix.columns[1].cellType = "radiogroup";
    matrix.columns[2].placeholder = "col2 options";
    matrix.columns[3].cellType = "radiogroup";
    matrix.columns[3].colCount = 2;
    matrix.rowCount = 3;

    expect(matrix.renderedTable.rows.length, "There are 3 rows").toBe(3 * 2);
    matrix.placeholder = "My Caption";
    expect(matrix.renderedTable.rows[1].cells[0].question["placeholder"], "options caption get from matrix").toBe("My Caption");
    expect(matrix.renderedTable.rows[1].cells[2].question["placeholder"], "options caption get from column").toBe("col2 options");
    matrix.columnColCount = 3;
    expect(matrix.renderedTable.rows[1].cells[1].question["colCount"], "question col count get from matrix").toBe(3);
    expect(matrix.renderedTable.rows[1].cells[3].question["colCount"], "question col count get from column").toBe(2);
  });

  test("matrix.rowsVisibleIf + renderedTable", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    var qBestCar = new QuestionMatrixDropdownModel("bestCar");
    qBestCar.addColumn("col1");
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    expect(qBestCar.renderedTable.rows.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.renderedTable.rows.length, "BMW is selected").toBe(1 * 2);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(qBestCar.renderedTable.rows.length, "3 cars are selected").toBe(3 * 2);
    qBestCar.rowsVisibleIf = "";
    expect(qBestCar.renderedTable.rows.length, "there is no filter").toBe(4 * 2);
  });
  test("matrix.rowsVisibleIf + visibleRowIndex variable, #10279", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    var qBestCar = new QuestionMatrixDropdownModel("bestCar");
    const col = qBestCar.addColumn("col1");
    col.cellType = "expression";
    (<any>col).expression = "{visibleRowIndex}";
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    expect(qBestCar.renderedTable.rows.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.visibleRows.length, "BMW is selected").toBe(1);
    expect(qBestCar.visibleRows[0].cells[0].question.value, "rows[0] #1").toBe(1);
    qCars.value = ["BMW", "Volkswagen"];
    let rows = qBestCar.visibleRows;
    expect(rows.length, "2 cars are selected").toBe(2);
    expect(rows[0].cells[0].question.value, "rows[0] #2").toBe(1);
    expect(rows[1].cells[0].question.value, "rows[1] #2").toBe(2);
    qBestCar.rowsVisibleIf = "";
    expect(qBestCar.visibleRows.length, "there is no filter").toBe(4);
    rows = qBestCar.visibleRows;
    for (let i = 0; i < 4; i++) {
      expect(rows[i].cells[0].question.value, "rows[" + i + "] #2").toBe(i + 1);
    }
  });
  test("matrix.rowsVisibleIf + visibleRowIndex variable & defaultValueExpression, #10279.2", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p1");
    const qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    const qBestCar = new QuestionMatrixDropdownModel("bestCar");
    const col = qBestCar.addColumn("col1");
    col.cellType = "text";
    (<any>col).defaultValueExpression = "{visibleRowIndex}";
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    expect(qBestCar.renderedTable.rows.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.visibleRows.length, "BMW is selected").toBe(1);
    expect(qBestCar.visibleRows[0].cells[0].question.value, "rows[0] #1").toBe(1);
    qCars.value = ["BMW", "Volkswagen"];
    let rows = qBestCar.visibleRows;
    expect(rows.length, "2 cars are selected").toBe(2);
    expect(rows[0].cells[0].question.value, "rows[0] #2").toBe(1);
    expect(rows[1].cells[0].question.value, "rows[1] #2").toBe(2);
    qBestCar.rowsVisibleIf = "";
    expect(qBestCar.visibleRows.length, "there is no filter").toBe(4);
    rows = qBestCar.visibleRows;
    for (let i = 0; i < 4; i++) {
      expect(rows[i].cells[0].question.value, "rows[" + i + "] #2").toBe(i + 1);
    }
  });
  test("matrix.rowsVisibleIf + visibleRowIndex variable & setValueExpression, #10313", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "matrix",
          rowsVisibleIf: "{row.col2} empty",
          rowCount: 3,
          columns: [{ cellType: "text", name: "col1", setValueExpression: "{visibleRowIndex}" },
            { cellType: "text", name: "col2" }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const checkRows = (count: number, num: number) => {
      expect(matrix.visibleRows.length, "visible rows #" + num).toBe(count);
      for (let i = 0; i < count; i ++) {
        expect(matrix.visibleRows[i].cells[0].question.value, "row " + i + " col1, #" + num).toBe(i + 1);
      }
    };
    checkRows(3, 1);
    matrix.addRow();
    matrix.addRow();
    checkRows(5, 2);
    matrix.visibleRows[0].cells[1].question.value = "a";
    checkRows(4, 3);
    matrix.removeRow(1);
    checkRows(3, 4);
    matrix.removeRow(0);
    checkRows(2, 5);
  });
  test("Matrixdynamic column.visibleIf, hide column if all cells are invisible + rendered table", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            { name: "col1", totalType: "count" },
            { name: "col2", choices: [1, 2], visibleIf: "{q2}=1" },
            { name: "col3", visibleIf: "{row.col1} = 1" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: There is one visible column + Remove button").toBe(2);
    expect(table.rows[1].cells.length, "Rows: There is one visible column + Remove button").toBe(2);
    expect(table.footerRow.cells.length, "Footer: There is one visible column + Remove button").toBe(2);
    matrix.transposeData = true;
    var rows = matrix.renderedTable.rows;
    expect(rows.length, "Only one column is shown + remove button + errrors row").toBe(3);
  });
  test("Matrixdynamic column.visibleIf, toggle column visibility on and off via external value, Bug#11127", () => {
    const survey = new SurveyModel({
      "checkErrorsMode": "onValueChanged",
      "elements": [{
        "name": "q1",
        "type": "text",
        "inputType": "number",
        "min": 10
      }, {
        "type": "matrixdynamic",
        "name": "matrix",
        "columns": [
          { "name": "col1", "cellType": "text", "visibleIf": "{q1} notempty && !{$q1.containsErrors}" },
          { "name": "col2", "cellType": "text" }
        ]
      }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    const column = matrix.columns[0];
    let table = matrix.renderedTable;
    expect(column.hasVisibleCell, "Initial: col1 is invisible").toBe(false);
    expect(column.isColumnVisible, "Initial: col1 is invisible").toBe(false);
    expect(table.headerRow.cells.length, "Initial: header has col2 + remove button").toBe(2);

    survey.setValue("q1", 20);
    table = matrix.renderedTable;
    expect(column.hasVisibleCell, "q1=20: col1 is visible").toBe(true);
    expect(column.isColumnVisible, "q1=20: col1 is visible").toBe(true);
    expect(table.headerRow.cells.length, "q1=20: header has col1 + col2 + remove button").toBe(3);

    survey.setValue("q1", 5);
    table = matrix.renderedTable;
    expect(column.hasVisibleCell, "q1=5: col1 is invisible").toBe(false);
    expect(column.isColumnVisible, "q1=5: col1 is invisible").toBe(false);
    expect(table.headerRow.cells.length, "q1=5: header has col2 + remove button").toBe(2);

    survey.setValue("q1", 20);
    table = matrix.renderedTable;
    expect(column.hasVisibleCell, "q1=20 again: col1 is visible").toBe(true);
    expect(column.isColumnVisible, "q1=20 again: col1 is visible").toBe(true);
    expect(table.headerRow.cells.length, "q1=20 again: header has col1 + col2 + remove button").toBe(3);
  });

  test("Matrix validation in cells and async functions in expression", () => {
    var returnResults = new Array<any>();
    function asyncFunc(params: any): any {
      returnResults.push(this.returnResult);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

    const question = new QuestionMatrixDynamicModel("q1");
    question.rowCount = 1;
    const column = question.addColumn("col1");
    column.validators.push(new ExpressionValidator("asyncFunc() = 1"));
    const cellQuestion = question.visibleRows[0].cells[0].question;
    expect(cellQuestion.errors.length, "There is no errors by default").toBe(0);
    expect(question.validate()).toBe(true);
    expect(returnResults.length, "Has called asyncFunc").toBe(1);
    returnResults[0](2);
    expect(cellQuestion.errors.length, "There is one error by default").toBe(1);
    expect(question.validate()).toBe(true);
    expect(returnResults.length, "Has called asyncFunc one more time").toBe(2);
    returnResults[0](1);
    expect(cellQuestion.errors.length, "Error is gone").toBe(0);

    FunctionFactory.Instance.unregister("asyncFunc");
  });

  test("onValueChanged doesn't called on adding new row with calculated column, #1845", () => {
    var rowCount = 0;
    function newIndexFor(params) {
      if (!params[0]) {
        rowCount++;
      }
      return params[0] || rowCount;
    }
    FunctionFactory.Instance.register("newIndexFor", newIndexFor);
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "foo",
          columns: [
            {
              name: "bar",
              cellType: "text",
            },
            {
              name: "id",
              cellType: "expression",
              expression: "newIndexFor({row.id})",
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("foo");
    var visibleRows = question.visibleRows;
    var counter = 0;
    survey.onValueChanged.add(function (sender, options) {
      counter++;
    });
    question.addRow();
    expect(counter, "onValueChanged has been called").toBe(1);
  });
  test("survey.onMatrixRenderRemoveButton", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 3,
          columns: ["1", "2"],
        },
        {
          type: "matrixdynamic",
          name: "q2",
          rowCount: 3,
          columns: ["1", "2"],
        },
      ],
    });
    survey.onMatrixRenderRemoveButton.add(function (sender, options) {
      options.allow = options.rowIndex % 2 == 0;
    });
    const firstMatrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[1];
    expect(firstMatrix.visibleRows.length, "Three rows").toBe(3);
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[1];
    expect(matrix.canRemoveRows, "The row can be removed").toBe(true);
    const table = matrix.renderedTable;
    expect(table.rows[1].cells[2].isActionsCell, "The first row can be removed (in actions cell)").toBe(true);
    expect(table.rows[3].cells[2].isActionsCell, "The second row can't be removed (in actions cell)").toBe(false);
    expect(table.rows[5].cells[2].isActionsCell, "The third row can be removed (in actions cell)").toBe(true);
  });

  test("The Remove row button is misaligned when a column is hidden, Bug#10004", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 0,
          columns: [{ name: "col1", cellType: "text" }],
        },
      ],
    });
    survey.onMatrixRenderRemoveButton.add(function (sender, options) {
      options.allow = options.row.isEmpty;
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    matrix.value = [{ col1: 1 }, { col1: 2 }];
    expect(matrix.canRemoveRows, "The row can be removed").toBe(true);
    const table = matrix.renderedTable;
    matrix.addRow();
    expect(3, "3 rows").toBe(matrix.visibleRows.length);
    expect(table.hasRemoveRows, "table.hasRemoveRows").toBe(true);
    expect(table.rows[1].cells[1].isActionsCell, "First cell").toBe(false);
    expect(table.rows[3].cells[1].isActionsCell, "Second cell").toBe(false);
    expect(table.rows[5].cells[1].isActionsCell, "Third cell").toBe(true);
  });

  test("remove action as icon or button, settings.matrixRenderRemoveAsIcon", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [{ name: "1" }, { name: "2" }],
        },
      ],
    });
    survey.css.root = "sd-root-modern";
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var table = matrix.renderedTable;
    expect(table.rows[1].cells[2].isActionsCell, "The first row can be removed (in actions cell)").toBe(true);
    expect(survey.css.root, "Survey css root set correctly").toBe("sd-root-modern");
    expect(table.rows[1].cells[2].item.value.actions[0].component, "Render as icon").toBe("sv-action-bar-item");
    settings.matrixRenderRemoveAsIcon = false;
    //Reset table
    matrix.showHeader = false;
    table = matrix.renderedTable;
    expect(table.rows[1].cells[2].item.value.actions[0].component, "Render as button").toBe("sv-matrix-remove-button");
    settings.matrixRenderRemoveAsIcon = true;
    survey.css.root = undefined;
  });

  test("column is requriedText, Bug #2297", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [{ name: "1", isRequired: true }, { name: "2" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var table = matrix.renderedTable;
    expect(table.headerRow.cells[0].requiredMark, "required Text is here").toBe("*");
    expect(table.headerRow.cells[1].requiredMark, "required Text is empty").toBeFalsy();
    matrix.transposeData = true;
    table = matrix.renderedTable;
    expect(table.rows[1].cells[0].requiredMark, "The first cell in the row is a column header now").toBe("*");
  });

  test("two shared matrixdynamic - should be no errors, Bug #T3121 (https://surveyjs.answerdesk.io/ticket/details/T3121)", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "employer_names",
          valueName: "qualita",
          isRequired: true,
          columns: [
            {
              name: "name",
              cellType: "text",
              isRequired: true,
            },
          ],
          rowCount: 4,
          minRowCount: 4,
          maxRowCount: 4,
        },
        {
          type: "radiogroup",
          name: "qualitypriority",
          choices: [
            {
              value: "0",
              text: "{qualita[0].name}",
            },
            {
              value: "1",
              text: "{qualita[1].name}",
            },
            {
              value: "2",
              text: "{qualita[2].name}",
            },
            {
              value: "3",
              text: "{qualita[3].name}",
            },
          ],
        },
        {
          type: "paneldynamic",
          name: "arrray_qualita",
          valueName: "qualita",
          templateElements: [
            {
              type: "radiogroup",
              name: "competenza",
              choices: [
                {
                  value: "0",
                },
                {
                  value: "1",
                },
                {
                  value: "2",
                },
                {
                  value: "3",
                },
              ],
            },
          ],
        },
      ],
    });
    var test_qualita = [
      { name: "Leadership", competenza: "3" },
      { name: "Team working", competenza: "2" },
      { name: "Iniziativa", competenza: "1" },
      { name: "Autonomia", competenza: "2" },
    ];
    survey.setValue("qualita", test_qualita);
    var matrixDynamic = survey.getQuestionByName("employer_names");
    expect(matrixDynamic.value, "Value set correctly").toEqualValues(test_qualita);
  });

  test("Totals in row using total in matrix, Bug #T3162 (https://surveyjs.answerdesk.io/ticket/details/T3162)", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              totalType: "sum",
              name: "paid",
            },
            {
              name: "free",
            },
            {
              name: "total",
              totalType: "sum",
              cellType: "expression",
              expression: "{row.free} + {row.paid}",
            },
            {
              name: "percentage",
              cellType: "expression",
              expression: "({row.free} + {row.paid}) / {totalRow.total}",
            },
          ],
          cellType: "text",
          rows: [
            {
              value: "international",
            },
          ],
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModel>(survey.getQuestionByName("matrix"));
    const rows = matrix.visibleRows;
    rows[0].cells[0].value = 100;
    rows[0].cells[1].value = 100;
    const totalRow = matrix.visibleTotalRow;
    expect(totalRow.cells[0].value, "total row column paid").toBe(100);
    expect(totalRow.cells[2].value, "total row column total").toBe(200);
    expect(rows[0].cells[2].value, "cell1 + cell2").toBe(200);
    expect(rows[0].cells[3].value, "(cell1 + cell2)/total").toBe(1);
  });

  test("The row numbers is incorrect after setting the value: survey.data, Bug #1958", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "teachersRate",
          cellType: "radiogroup",
          rowCount: 0,
          choices: [
            {
              value: 1,
            },
            {
              value: 0,
            },
            {
              value: -1,
            },
          ],
          columns: [
            {
              name: "subject",
              cellType: "dropdown",
              choices: [1, 2, 3],
            },
            {
              name: "explains",
            },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("teachersRate")
    );
    survey.data = {
      teachersRate: [
        { subject: 1, explains: 0 },
        { subject: 2, explains: 1 },
      ],
    };

    survey.data = { teachersRate: [{ subject: 1, explains: 0 }] };
    var rows = matrix.visibleRows;
    expect(rows.length, "we reset the number of rows to 1.").toBe(1);

    matrix.addRow();
    matrix.addRow();
    survey.data = { teachersRate: [{ subject: 1, explains: 0 }] };
    rows = matrix.visibleRows;
    expect(rows.length, "we reset the number of rows to 1 again.").toBe(1);
  });

  test("Change question in rendered cell on changing column type, Bug https://github.com/surveyjs/survey-creator/issues/690", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "teachersRate",
          rowCount: 1,
          choices: [1, 2],
          columns: [
            {
              name: "subject",
            },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("teachersRate")
    );

    expect(matrix.renderedTable.rows[0].cells[0].question.getType(), "Default cell type").toBe("dropdown");

    matrix.columns[0].cellType = "radiogroup";
    expect(matrix.renderedTable.rows[0].cells[0].question.getType(), "Cell type should be changed").toBe("radiogroup");
  });

  test("Column.totalformat property doesn't changed on changing survey locale", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          isRequired: true,
          columns: [
            {
              name: "col1",
              cellType: "text",
              totalType: "sum",
              totalFormat: {
                default: "Total column 1: {0}",
                de: "Total Spalt 1: {0}",
                fr: "Total colonne 1: {0}",
              },
              inputType: "number",
            },
          ],
          rows: [
            {
              value: "one",
              text: {
                default: "One",
                fr: " Un",
                de: " Ein",
              },
            },
          ],
        },
      ],
    });
    survey.setValue("matrix", { one: { col1: 10 } });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.footerRow.cells.length, "There are two cells in the footer row").toBe(2);
    expect(<QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ), "total for en locale is correct").toBe("Total column 1: 10");
    survey.locale = "de";
    expect(<QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ), "total for de locale is correct").toBe("Total Spalt 1: 10");
    survey.locale = "fr";
    expect(<QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ), "total for fr locale is correct").toBe("Total colonne 1: 10");
    survey.locale = "";
    expect(<QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ), "total for en locale again is correct").toBe("Total column 1: 10");
  });

  test("Changing rows in matrix dropdown doesn't update the table", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.rows.length, "There are two rows").toBe(4);
    matrix.rows.push(new ItemValue("row2"));
    expect(matrix.renderedTable.rows.length, "There are three rows now").toBe(6);
    matrix.rows.splice(0, 1);
    expect(matrix.renderedTable.rows.length, "There are two rows again").toBe(4);
  });
  test("showInMultipleColumns property", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
              totalType: "sum",
            },
            {
              name: "col2",
              cellType: "checkbox",
              choices: ["1", "2", "3"],
            },
            {
              name: "col3",
              cellType: "comment",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 3 columns").toBe(1 + 3);
    expect(matrix.renderedTable.rows[1].cells.length, "first row: row value + 3 columns").toBe(1 + 3);
    expect(matrix.renderedTable.footerRow.cells.length, "footer: row value + 3 columns").toBe(1 + 3);
    expect(matrix.renderedTable.headerRow.cells[2].locTitle.renderedHtml, "Column header").toBe("col2");
    expect(matrix.columns[1].templateQuestion.autoOtherMode, "It is turn off by default").not.toBe(true);
    matrix.columns[1].showInMultipleColumns = true;
    expect(matrix.columns[1].templateQuestion.autoOtherMode, "It is turn on on setting showInMultipleColumns").toBe(true);
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 2 columns + showInMultipleColumns column").toBe(1 + 2 + 3);
    expect(matrix.renderedTable.rows[1].cells.length, "first row: row value + 2 columns + showInMultipleColumns column").toBe(1 + 2 + 3);
    expect(matrix.renderedTable.footerRow.cells.length, "footer:  row value + 2 columns + showInMultipleColumns column").toBe(1 + 2 + 3);
    expect(matrix.renderedTable.headerRow.cells[2].locTitle.renderedHtml, "Column header, first choice").toBe("1");
    expect(matrix.renderedTable.rows[1].cells[2].isCheckbox, "first row, first choice: it is checkbox").toBe(true);
    expect(matrix.renderedTable.rows[1].cells[2].isChoice, "first row, first choice: isChoice").toBe(true);
    expect(matrix.renderedTable.rows[1].cells[2].choiceValue, "first row, first choice: choiceValue = 1").toBe("1");
    expect(matrix.renderedTable.rows[0].cells[1].isErrorsCell, "first row, text question: showErrorOnTop").toBe(true);
    expect(matrix.renderedTable.rows[0].cells[2].isErrorsCell, "first row, first choice: showErrorOnTop").toBe(true);
    expect(matrix.renderedTable.rows[0].cells[3].isErrorsCell, "first row, second choice: showErrorOnTop").toBe(false);
    expect(matrix.renderedTable.footerRow.cells[2].isChoice, "footer cell:  isChoice should be false").toBe(false);
  });
  test("showInMultipleColumns property, change column choices in running", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
              totalType: "sum",
            },
            {
              name: "col2",
              cellType: "checkbox",
              showInMultipleColumns: true
            },
            {
              name: "col3",
              cellType: "comment",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 0 choices").toBe(1 + 2 + 0);
    expect(matrix.renderedTable.rows[0].cells.length, "first row: row value + 0 choices").toBe(1 + 2 + 0);
    expect(matrix.renderedTable.footerRow.cells.length, "footer: row value + 0 choices").toBe(1 + 2 + 0);
    matrix.renderedTable["testId"] = 1;
    const column = matrix.columns[1];
    column.choices = ["1", "2", "3", "4", "5"];
    expect(matrix.renderedTable["testId"], "table re-created").not.toBe(1);
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 5 choices").toBe(1 + 2 + 5);
    expect(matrix.renderedTable.rows[0].cells.length, "first row: row value + 5 choices").toBe(1 + 2 + 5);
    expect(matrix.renderedTable.footerRow.cells.length, "footer: row value + 5 choices").toBe(1 + 2 + 5);
    matrix.renderedTable["testId"] = 1;
    expect(column.templateQuestion.loadedChoicesFromServerCallback, "Calback is set").toBeTruthy();
    column.templateQuestion.loadedChoicesFromServerCallback();
    expect(matrix.renderedTable["testId"], "table re-created").not.toBe(1);
  });
  test("showInMultipleColumns and showOtherItem properties", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              showInMultipleColumns: true,
              showOtherItem: true,
              choices: [1, 2, 3]
            },
            { name: "col2", cellType: "comment" }
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.columns[0].templateQuestion.autoOtherMode, "Other mode is set for column template question").toBe(true);
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 3 choices + showOtherItem").toBe(1 + 3 + 2);
    expect(matrix.renderedTable.rows[1].cells.length, "first row: row value + 3 choices + showOtherItem").toBe(1 + 3 + 2);
    expect(matrix.renderedTable.headerRow.cells[4].locTitle.text, "Column text is correct").toBe("Other (describe)");
    const cell = matrix.renderedTable.rows[1].cells[4];
    expect(cell.question.getType(), "question is checkbox").toBe("checkbox");
    expect(cell.question.autoOtherMode, "autoOtherMode is set").toBe(true);
    expect(cell.isOtherChoice, "it is other choice index").toBe(true);
    expect(cell.isCheckbox, "it is not check").toBe(false);
    expect(cell.isRadio, "it is not radio").toBe(false);
    const commentCell = matrix.renderedTable.rows[1].cells[5];
    expect(commentCell.isOtherChoice, "it is not other choice index").toBe(false);
    cell.question.otherValue = "comment1";
    expect(matrix.value, "Matrix value col1-comment is set").toEqualValues({ row1: { col1: ["other"], "col1-Comment": "comment1" } });
    cell.question.otherValue = "comment2";
    expect(matrix.value, "Matrix value col1-comment is set, #2").toEqualValues({ row1: { col1: ["other"], "col1-Comment": "comment2" } });
    cell.question.otherValue = "";
    expect(matrix.value, "Reset comment value").toBeFalsy();
  });
  test("showInMultipleColumns and showNoneItem property", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              showInMultipleColumns: true,
              showNoneItem: true,
              noneText: "None abc",
              choices: [1, 2, 3]
            },
            { name: "col2", cellType: "comment" }
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 3 choices + none item + one column").toBe(1 + 3 + 1 + 1);
    expect(matrix.renderedTable.rows[1].cells.length, "first row: row value + 3 choices + none item + one column").toBe(1 + 3 + 1 + 1);
    expect(matrix.renderedTable.headerRow.cells[4].locTitle.text, "Column text is correct").toBe("None abc");
    const cell = matrix.renderedTable.rows[1].cells[4];
    expect(cell.question.getType(), "question is checkbox").toBe("checkbox");
    expect(cell.question.showNoneItem, "showNoneItem is set").toBe(true);
  });
  test("showInMultipleColumns  and showNoneItem property properties & choices from question Bug#8279", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              showInMultipleColumns: true,
              showNoneItem: true,
              noneText: "None abc"
            },
            { name: "col2", cellType: "comment" }
          ],
          choices: [1, 2, 3],
          rows: ["row1", "row2"]
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 3 choices + none item + one column").toBe(1 + 3 + 1 + 1);
    expect(matrix.renderedTable.rows[1].cells.length, "first row: row value + 3 choices + none item  + one column").toBe(1 + 3 + 1 + 1);
    expect(matrix.renderedTable.headerRow.cells[4].locTitle.text, "Column text is correct").toBe("None abc");
    const cell = matrix.renderedTable.rows[1].cells[4];
    expect(cell.question.getType(), "question is checkbox").toBe("checkbox");
    expect(cell.question.showNoneItem, "showNoneItem is set").toBe(true);
  });
  test("showInMultipleColumns and showOtherItem properties, change in run-time", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              showInMultipleColumns: true,
              choices: [1, 2, 3]
            }
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 3 choices").toBe(1 + 3);
    matrix.renderedTable["test_id"] = "#1";
    matrix.columns[0].showOtherItem = true;
    expect(matrix.renderedTable["test_id"], "Re-create renderedTable").not.toBe("#1");
    expect(matrix.columns[0].templateQuestion.autoOtherMode, "Other mode is set for column template question").toBe(true);
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 3 choices + showOtherItem").toBe(1 + 3 + 1);
    expect(matrix.renderedTable.rows[0].cells.length, "first row: row value + 3 choices + showOtherItem").toBe(1 + 3 + 1);
    expect(matrix.renderedTable.headerRow.cells[4].locTitle.text, "Column text is correct").toBe("Other (describe)");
  });
  test("showInMultipleColumns and showOtherItem properties, change in run-time in matrix dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          allowRemoveRows: false,
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              showInMultipleColumns: true,
              choices: [1, 2]
            }
          ]
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: 2 choices").toBe(2);
    matrix.renderedTable["test_id"] = "#1";
    matrix.columns[0].showOtherItem = true;
    expect(matrix.renderedTable["test_id"], "Re-create renderedTable").not.toBe("#1");
    expect(matrix.columns[0].templateQuestion.autoOtherMode, "Other mode is set for column template question").toBe(true);
    expect(matrix.renderedTable.headerRow.cells.length, "header: 2 choices + showOtherItem").toBe(2 + 1);
    expect(matrix.renderedTable.rows[0].cells.length, "first row: 2 choices + showOtherItem").toBe(2 + 1);
    expect(matrix.renderedTable.headerRow.cells[2].locTitle.text, "Column text is correct").toBe("Other (describe)");
  });
  test("showInMultipleColumns property, and visibleIf in choices", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "q1", choices: [1, 2, 3, 4] },
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
              totalType: "sum",
            },
            {
              name: "col2",
              cellType: "checkbox",
              showInMultipleColumns: true,
              showNoneItem: true,
              choices: [
                { value: "A", visibleIf: "{q1} = 1" },
                { value: "B", visibleIf: "{q1} = 2" },
                { value: "C", visibleIf: "{q1} = 3" }
              ]
            }
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    const column = matrix.getColumnByName("col2");
    const choices = column.templateQuestion.visibleChoices;
    expect(choices.length, "There are 4 choices").toBe(4);
    expect(column.isFilteredMultipleColumns, "multiple column has visibleIf in choices").toBe(true);

    let table = matrix.renderedTable;
    let multipleChoices = column.getVisibleMultipleChoices();
    expect(multipleChoices.length, "One visible choice").toBe(1);
    expect(multipleChoices[0].value, "none is only visible").toBe("none");
    expect(table.headerRow.cells.length, "header: row value + 1 choices").toBe(1 + 1 + 1);
    expect(table.rows[1].cells.length, "first row: row value + 1 choices").toBe(1 + 1 + 1);
    expect(table.headerRow.cells[2].locTitle.textOrHtml, "Header None").toBe("None");
    expect(table.rows[1].cells[2].choiceValue, "none index in the first row").toBe("none");

    survey.setValue("q1", 1);
    table = matrix.renderedTable;
    multipleChoices = column.getVisibleMultipleChoices();
    expect(multipleChoices.length, "Two visible choice").toBe(2);
    expect(multipleChoices[0].value, "A is visible").toBe("A");
    expect(multipleChoices[1].value, "none is visible").toBe("none");
    expect(table.headerRow.cells.length, "header: row value + 1 choices, #2").toBe(1 + 1 + 2);
    expect(table.rows[1].cells.length, "first row: row value + 1 choices, #2").toBe(1 + 1 + 2);
    expect(table.headerRow.cells[2].locTitle.textOrHtml, "Header A, #2").toBe("A");
    expect(table.headerRow.cells[3].locTitle.textOrHtml, "Header None, #2").toBe("None");
    expect(table.rows[1].cells[2].choiceValue, "none in the first row, #2").toBe("A");
    expect(table.rows[1].cells[3].choiceValue, "none in the first row, #2").toBe("none");

    survey.setValue("q1", 3);
    table = matrix.renderedTable;
    multipleChoices = column.getVisibleMultipleChoices();
    expect(multipleChoices.length, "Two visible choice").toBe(2);
    expect(multipleChoices[0].value, "C is visible").toBe("C");
    expect(multipleChoices[1].value, "none is visible").toBe("none");
    expect(table.headerRow.cells.length, "header: row value + 1 choices, #3").toBe(1 + 1 + 2);
    expect(table.rows[1].cells.length, "first row: row value + 1 choices, #3").toBe(1 + 1 + 2);
    expect(table.headerRow.cells[2].locTitle.textOrHtml, "Header C, #3").toBe("C");
    expect(table.headerRow.cells[3].locTitle.textOrHtml, "Header None, #3").toBe("None");
    expect(table.rows[1].cells[2].choiceValue, "none in the first row, #3").toBe("C");
    expect(table.rows[1].cells[3].choiceValue, "none in the first row, #3").toBe("none");

    survey.setValue("q1", 4);
    table = matrix.renderedTable;
    multipleChoices = column.getVisibleMultipleChoices();
    expect(multipleChoices.length, "Two visible choice").toBe(1);
    expect(multipleChoices[0].value, "none is visible").toBe("none");
    expect(table.headerRow.cells.length, "header: row value + 1 choices, #4").toBe(1 + 1 + 1);
    expect(table.rows[1].cells.length, "first row: row value + 1 choices, #4").toBe(1 + 1 + 1);
    expect(table.headerRow.cells[2].locTitle.textOrHtml, "Header None, #4").toBe("None");
    expect(table.rows[1].cells[2].choiceValue, "none in the first row, #4").toBe("none");
  });
  test("showInMultipleColumns property + transposeData: true", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          transposeData: true,
          columns: [
            {
              name: "col1",
              cellType: "text",
              totalType: "sum",
            },
            {
              name: "col2",
              cellType: "radiogroup",
              showInMultipleColumns: true,
              choices: ["1", "2", "3"],
            },
            {
              name: "col3",
              cellType: "comment",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: column header + 2 rows + total").toBe(1 + 2 + 1);
    expect(matrix.renderedTable.rows.length, "rows.length = 2 columns + showInMultipleColumns column").toBe((2 + 3) * 2);
    expect(matrix.renderedTable.rows[3].cells[0].locTitle.renderedHtml, "header for showInMultipleColumns column").toBe("1");
    expect(matrix.renderedTable.rows[3].cells[1].isChoice, "showInMultipleColumns, first choice: isChoice").toBe(true);
    expect(matrix.renderedTable.rows[3].cells[1].choiceValue, "showInMultipleColumns, first choice: choiceValue").toBe("1");
    expect(matrix.renderedTable.rows[3 + 2 * 2].cells[0].locTitle.renderedHtml, "header for showInMultipleColumns column, third choice").toBe("3");
    expect(matrix.renderedTable.rows[3 + 2 * 2].cells[1].isChoice, "showInMultipleColumns, third choice: isChoice").toBe(true);
    expect(matrix.renderedTable.rows[3 + 2 * 2].cells[1].choiceValue, "showInMultipleColumns, third choice: choiceValue").toBe("3");
  });
  test("showInMultipleColumns property, update on visibleChoices change", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
            },
            {
              name: "col2",
              cellType: "checkbox",
              showInMultipleColumns: true,
              choices: ["1", "2", "3"],
            },
            {
              name: "col3",
              cellType: "comment",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 3 columns").toBe(1 + 2 + 3);
    matrix.columns[1].choices.push(new ItemValue(4));
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 4 columns").toBe(1 + 2 + 4);
  });
  test("showInMultipleColumns property, using default choices and cellType", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
            },
            {
              name: "col2",
              cellType: "radiogroup",
              showInMultipleColumns: true,
            },
            {
              name: "col3",
              cellType: "comment",
            },
          ],
          rows: ["row1", "row2"],
          choices: ["1", "2", "3"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "header: row value + 3 columns").toBe(1 + 2 + 3);
  });
  test("showInMultipleColumns property, using default choices and cellType", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
            {
              name: "col2",
            },
            {
              name: "col3",
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

    var rows = matrix.visibleRows;
    matrix.addRow();
    matrix.setRowValue(1, { col1: "1", col2: 2, col3: "3" });
    rows = matrix.visibleRows;
    expect(rows.length, "There are two rows").toBe(2);
    expect(rows[1].getQuestionByColumnName("col1").value, "Set the value correctly").toBe("1");
  });

  test("showInMultipleColumns property, using default choices and cellType, Bug #2151", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "Column 1",
            },
            {
              name: "Column 2",
            },
            {
              name: "Column 3",
              totalType: "sum",
            },
            {
              name: "Column 4",
              cellType: "boolean",
            },
          ],
          choices: [1, 2, 3, 4, 5],
          cellType: "text",
          rows: ["Row 1", "Row 2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

    expect(matrix.renderedTable.rows.length, "There are two rows").toBe(4);
    expect(matrix.renderedTable.footerRow.cells[3].question.value, "Summary is 0").toBe(0);
    var totalBoolQuestion = matrix.renderedTable.footerRow.cells[4].question;
    expect(totalBoolQuestion.value, "There is no question value for boolean column").toBeUndefined();
    expect(totalBoolQuestion.getType(), "Total question for boolean column is expression").toBe("expression");
  });
  test("showInMultipleColumns property, transposeData: true and other is empty value, Bug #2200", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          transposeData: true,
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              showOtherItem: true,
              showInMultipleColumns: true,
              choices: [1, 2],
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.columns[0].choices.length, "There are two choices").toBe(2);
    expect(matrix.columns[0].templateQuestion.choices.length, "There are two choices in question").toBe(2);
    expect(matrix.columns[0].templateQuestion.visibleChoices.length, "There are two visible choices in question + showOtherItem").toBe(3);
    expect(matrix.renderedTable.rows.length, "There are two choices + other").toBe(6);
    matrix.value = { row1: { col1: "other" } };
    expect(matrix.validate(), "There is error").toBe(false);
    expect(matrix.renderedTable.rows[1].cells[1].isChoice, "The first cell is checkbox").toBe(true);
    expect(matrix.renderedTable.rows[5].cells[1].isChoice, "The third cell is checkbox").toBe(true);
    expect(matrix.renderedTable.rows[1].cells[1].isFirstChoice, "The first cell is firstchoice").toBe(true);
    expect(matrix.renderedTable.rows[5].cells[1].isFirstChoice, "The third cell is not firstchoice").toBe(false);
    expect(matrix.renderedTable.rows[5].cells[1].choiceIndex, "The third cell choiceIndex is not 0").toBe(2);
    expect(matrix.renderedTable.rows[0].cells[1].isErrorsCell, "Show errors for the first cell").toBe(true);
    expect(matrix.renderedTable.rows[2].cells[1].isErrorsCell, "Do not show errors for the second cell").toBe(false);
    expect(matrix.renderedTable.rows[2].cells[1].isEmpty, "Do not show errors for the second cell").toBe(true);
    expect(matrix.renderedTable.rows[4].cells[1].isEmpty, "Do not show errors for the third cell").toBe(true);
    expect(matrix.renderedTable.rows[4].cells[1].isErrorsCell, "Do not show errors for the third cell").toBe(false);
  });
  test("showInMultipleColumns property, and enabledIf in item, Bug #2926", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              showInMultipleColumns: true,
            },
          ],
          choices: [
            { value: 1, enableIf: "{row.col1}<>1" },
            { value: 2, enableIf: "{row.col1}=1" },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = { row1: { col1: 1 }, row2: { col1: 2 } };
    expect(matrix.renderedTable.rows.length, "There are two rows").toBe(4);
    expect(matrix.renderedTable.rows[1].cells.length, "There are two cells and one row name").toBe(3);
    expect(matrix.renderedTable.rows[1].cells[1].item.isEnabled, "cell[0, 0] is disabled").toBe(false);
    expect(matrix.renderedTable.rows[1].cells[2].item.isEnabled, "cell[0, 1] is enabled").toBe(true);
    expect(matrix.renderedTable.rows[3].cells[1].item.isEnabled, "cell[1, 0] is enabled").toBe(true);
    expect(matrix.renderedTable.rows[3].cells[2].item.isEnabled, "cell[1, 1] is disabled").toBe(false);
    matrix.value = { row1: { col1: 2 }, row2: { col1: 2 } };
    expect(matrix.renderedTable.rows[1].cells[1].item.isEnabled, "cell[0, 0] is disabled, #2").toBe(true);
    expect(matrix.renderedTable.rows[1].cells[2].item.isEnabled, "cell[0, 1] is enabled, #2").toBe(false);
  });
  test("showInMultipleColumns property, transposeData: true  and enabledIf in item, Bug #2926", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          transposeData: true,
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              showInMultipleColumns: true,
            },
          ],
          choices: [
            { value: 1, enableIf: "{row.col1}<>1" },
            { value: 2, enableIf: "{row.col1}=1" },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = { row1: { col1: 1 }, row2: { col1: 2 } };
    expect(matrix.renderedTable.rows.length, "There are two rows").toBe(4);
    expect(matrix.renderedTable.rows[1].cells.length, "There are two cells and one row name").toBe(3);
    expect(matrix.renderedTable.rows[1].cells[1].item.isEnabled, "cell[0, 0] is disabled").toBe(false);
    expect(matrix.renderedTable.rows[3].cells[1].item.isEnabled, "cell[1, 0] is enabled").toBe(true);
    expect(matrix.renderedTable.rows[1].cells[2].item.isEnabled, "cell[0, 1] is enabled").toBe(true);
    expect(matrix.renderedTable.rows[3].cells[2].item.isEnabled, "cell[1, 1] is disabled").toBe(false);
    matrix.value = { row1: { col1: 2 }, row2: { col1: 2 } };
    expect(matrix.renderedTable.rows[1].cells[1].item.isEnabled, "cell[0, 0] is disabled, #2").toBe(true);
    expect(matrix.renderedTable.rows[3].cells[1].item.isEnabled, "cell[1, 0] is enabled, #2").toBe(false);
  });

  test("Filter choices on value change in the next column, Bug #2182", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "column1",
              cellType: "text",
            },
            {
              name: "column2",
              cellType: "dropdown",
              choices: [
                { value: "A", visibleIf: "{row.column1} = 1" },
                { value: "B", visibleIf: "{row.column1} = 2" },
                { value: "C", visibleIf: "{row.column1} = 2" },
              ],
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.visibleRows;
    var q1 = rows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>rows[0].cells[1].question;
    expect(q2.visibleChoices.length, "There is no visible choices").toBe(0);
    q1.value = 1;
    expect(q2.visibleChoices.length, "There is 'A' item").toBe(1);
    q1.value = 2;
    expect(q2.visibleChoices.length, "There is 'B' and 'C' items").toBe(2);
  });
  test("Survey.checkErrorsMode=onValueChanged, some errors should be shown onNextPage only, multipletext", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          columns: [
            {
              name: "Column 1",
              isRequired: true,
            },
            {
              name: "Column 2",
              isRequired: true,
            },
          ],
        },
      ],
      checkErrorsMode: "onValueChanged",
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("question1")
    );
    var rows = matrix.visibleRows;
    rows[0].cells[0].value = 1;
    expect(rows[0].cells[1].question.errors.length, "There is no errors yet in the cell, first row, second column").toBe(0);
    expect(rows[1].cells[0].question.errors.length, "There is no errors yet in the cell, second row, first column").toBe(0);
    survey.tryComplete();
    expect(rows[0].cells[1].question.errors.length, "There is error in the cell, first row, second column").toBe(1);
    expect(rows[1].cells[0].question.errors.length, "There is error in the cell, second row, first column").toBe(1);
    rows[0].cells[0].value = 2;
    expect(rows[0].cells[1].question.errors.length, "The error in the cell is not fixed, first row, second column").toBe(1);
    expect(rows[1].cells[0].question.errors.length, "The error in the cell is not fixed, first column").toBe(1);
    rows[0].cells[1].value = 1;
    expect(rows[0].cells[1].question.errors.length, "The error in the cell is gone, first row, second column").toBe(0);
    expect(rows[1].cells[0].question.errors.length, "The error in the cell is not fixed, first column, #2").toBe(1);
    rows[1].cells[0].value = 1;
    expect(rows[1].cells[0].question.errors.length, "The error in the cell is gone, first column, #2").toBe(0);
  });
  test("Survey.checkErrorsMode=onValueChanging", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 2,
          columns: [
            {
              name: "col1",
              cellType: "text",
              validators: [{ type: "emailvalidator" }],
            },
            {
              name: "col2",
              cellType: "text",
            },
          ],
        },
      ],
      checkErrorsMode: "onValueChanging",
    });
    var matrix = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("question1")
  );
    var rows = matrix.visibleRows;
    rows[0].cells[0].value = "val";
    expect(rows[0].cells[0].question.errors.length, "There is error, e-mail is incorrect").toBe(1);
    expect(rows[0].cells[1].question.errors.length, "There is no errors yet in the cell, first row, second column").toBe(0);
    expect(rows[1].cells[0].question.errors.length, "There is no errors yet in the cell, second row, first column").toBe(0);
    expect(matrix.value, "do not set value to matrix").toBeFalsy();
    expect(survey.data, "do not set value into survey").toEqualValues({});
    rows[0].cells[0].value = "a@a.com";
    expect(matrix.value, "set value to matrix").toEqualValues([{ col1: "a@a.com" }, {}]);
    expect(survey.data, "set value into survey").toEqualValues({ question1: [{ col1: "a@a.com" }, {}] });
  });

  test("Survey.checkErrorsMode=onValueChanging and column.isUnique", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 2,
          columns: [
            {
              name: "col1",
              cellType: "text",
              isUnique: true,
            },
            {
              name: "col2",
              cellType: "text",
            },
          ],
        },
      ],
      checkErrorsMode: "onValueChanging",
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("question1")
    );
    var rows = matrix.visibleRows;
    rows[0].cells[0].value = "val1";
    expect(rows[0].cells[0].question.errors.length, "There is no error").toBe(0);
    expect(matrix.value).toEqualValues([{ col1: "val1" }, {}]);
    rows[1].cells[0].value = "val1";
    expect(rows[1].cells[0].question.errors.length, "There is a duplication error, second row, first column").toBe(1);
    expect(matrix.value).toEqualValues([{ col1: "val1" }, {}]);
    rows[1].cells[0].value = "val2";
    expect(rows[1].cells[0].question.errors.length, "There is no errors yet in the cell, second row, first column").toBe(0);
  });

  test("column should call property changed on custom property", () => {
    Serializer.addProperty("text", "prop1");
    var matrix = new QuestionMatrixDynamicModel("q1");
    var column = matrix.addColumn("col1");
    column.cellType = "text";
    var counter = 0;
    column.registerPropertyChangedHandlers(["prop1"], () => {
      counter++;
    });
    column["prop1"] = 3;
    expect(column.templateQuestion["prop1"], "Property is set").toBe(3);
    expect(counter, "Notification is called").toBe(1);
    Serializer.removeProperty("text", "prop1");
  });
  test("getProgressInfo", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "col1",
              isRequired: true,
            },
            {
              name: "col2",
            },
            {
              name: "col3",
              visibleIf: "{row.col2} notempty",
            },
          ],
        },
      ],
    });
    survey.data = { matrix: [{ col1: "1" }, { col2: "2" }, []] };
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(question.renderedTable).toBeTruthy();
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 9 - 2,
      answeredQuestionCount: 2,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 1,
    });
  });
  test("getProgressInfo with non input questions in matrix dropdown Bug#5255", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              isRequired: true,
            },
            {
              name: "col2",
              cellType: "expression"
            },
            {
              name: "col3",
              cellType: "html"
            },
          ],
          rows: ["row1", "row2", "row3"]
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 3,
      answeredQuestionCount: 0,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 0,
    });
    survey.data = { matrix: { row1: { col1: "1" }, row2: { col1: "2" }, row3: {} } };
    expect(question.renderedTable).toBeTruthy();
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 3,
      answeredQuestionCount: 2,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 2,
    });
  });
  test("getProgressInfo with non input questions in matrix dynamic Bug#5255", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "col1",
              isRequired: true,
            },
            {
              name: "col2",
              cellType: "expression"
            },
            {
              name: "col3",
              cellType: "html"
            },
          ]
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    question.rowCount = 3;
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 3,
      answeredQuestionCount: 0,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 0,
    });
    survey.data = { matrix: [{ col1: "1" }, { col1: "2" }, {}] };
    expect(question.renderedTable).toBeTruthy();
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 3,
      answeredQuestionCount: 2,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 2,
    });
  });

  test("getProgressInfo, matrix dynamic without creating table", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "col1",
              isRequired: true,
            },
            {
              name: "col2",
            },
            {
              name: "col3",
            },
          ],
        },
      ],
    });
    survey.data = { matrix: [{ col1: "1" }, { col2: "2" }, []] };
    var question = survey.getQuestionByName("matrix");
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 9,
      answeredQuestionCount: 2,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 1,
    });
    expect(question["generatedVisibleRows"]).toBeFalsy();
  });

  test("getProgressInfo, matrix dropdown without creating table", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              isRequired: true,
            },
            {
              name: "col2",
            },
            {
              name: "col3",
            },
          ],
          rows: ["row1", "row2", "row3"]
        },
      ],
    });
    survey.data = { matrix: { row1: { col1: "1" }, row2: { col2: "2" } } };
    var question = survey.getQuestionByName("matrix");
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 9,
      answeredQuestionCount: 2,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 1,
    });
    expect(question["generatedVisibleRows"]).toBeFalsy();
  });
  test("getProgressInfo, create rows if there is visibleIf in the row, Bug9539", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              isRequired: true,
            },
            {
              name: "col2",
            },
            {
              name: "col3",
            },
          ],
          rows: [
            { value: "row1", visibleIf: "{q1} = 1" },
            { value: "row2", visibleIf: "{q1} = 2" }, "row3"]
        },
      ],
    });
    survey.data = { matrix: { row1: { col1: "1" }, row2: { col2: "2" } } };
    const question = survey.getQuestionByName("matrix");
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 3,
      answeredQuestionCount: 0,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 0,
    });
    survey.setValue("q1", 1);
    expect(question.getProgressInfo()).toEqualValues({
      questionCount: 6,
      answeredQuestionCount: 1,
      requiredQuestionCount: 2,
      requiredAnsweredQuestionCount: 1,
    });
  });

  test("Change item value in column/templateQuestion and change it in row questions", () => {
    var matrix = new QuestionMatrixDynamicModel("q1");
    var column = matrix.addColumn("col1");
    column.cellType = "checkbox";
    column.templateQuestion.choices.push(new ItemValue("item1"));
    column.templateQuestion.choices.push(new ItemValue("item2"));
    var cellQuestion = matrix.visibleRows[0].cells[0].question;
    expect(cellQuestion.choices.length, "There are two choices").toBe(2);
    expect(cellQuestion.choices[0].value, "Value is correct, choice1").toBe("item1");
    expect(cellQuestion.choices[1].value, "Value is correct, choice2").toBe("item2");
    column.templateQuestion.choices.push(new ItemValue("item3"));
    expect(cellQuestion.choices.length, "There are three choices").toBe(3);
    expect(cellQuestion.choices[2].value, "Value is correct, choice3").toBe("item3");
    column.templateQuestion.choices[0].value = "newItem1";
    expect(cellQuestion.choices[0].value, "Value is correct, updated, choice1").toBe("newItem1");
    column.templateQuestion.choices[2].text = "Item3 text";
    expect(cellQuestion.choices[2].text, "Text is correct, updated, choice3").toBe("Item3 text");
  });

  test("isAnswered on setitting from survey.setValue(), Bug#2399", () => {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "matrixdynamic",
              name: "HospitalAdmissions_Table",
              columns: [
                {
                  name: "TreatmentProcedure",
                  cellType: "text",
                  width: "20",
                },
                {
                  name: "Hospital",
                  cellType: "text",
                  width: "20",
                },
                {
                  name: "Year",
                  cellType: "dropdown",
                },
              ],
              choices: ["2020", "2019"],
              rowCount: 1,
            },
          ],
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    survey.setValue("HospitalAdmissions_Table", [
      {
        TreatmentProcedure: "A",
        Hospital: "B",
        Year: "2020",
      },
    ]);
    expect(question.visibleRows.length, "There is one row").toBe(1);
    expect(question.isAnswered, "matrix is answered").toBe(true);
  });
  test("Use survey.storeOthersAsComment in matrix, cellType = dropdown", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [1, 2, 3],
              showOtherItem: true,
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var cellQuestion = <QuestionDropdownModel>(
      question.visibleRows[0].cells[0].question
    );
    expect(cellQuestion.getType(), "Cell question was created correctly").toBe("dropdown");
    cellQuestion.value = cellQuestion.otherItem.value;
    cellQuestion.otherValue = "My Comment";
    expect(question.value, "Has comment").toEqualValues([{ col1: "other", "col1-Comment": "My Comment" }]);
    question.value = [{ col1: 1 }];
    expect(cellQuestion.value, "value sets correctly into cell").toBe(1);
    expect(cellQuestion.comment, "comment clears correctly in cell question").toBe("");
    question.value = [{ col1: "other", "col1-Comment": "New Comment" }];
    expect(cellQuestion.value, "value other sets correctly into cell").toBe("other");
    expect(cellQuestion.comment, "comment sets correctly into cell question").toBe("New Comment");
    question.value = [{ col1: 1 }];
    question.value = [{ col1: "NotInList" }];
    expect(cellQuestion.value, "value other sets correctly into cell using NotInList").toBe("other");
    expect(cellQuestion.comment, "comment sets correctly into cell question using NotInList").toBe("NotInList");
  });
  test("Use survey.storeOthersAsComment in matrix, cellType = checkbox", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              choices: [1, 2, 3],
              showOtherItem: true,
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var cellQuestion = <QuestionCheckboxModel>(
      question.visibleRows[0].cells[0].question
    );
    expect(cellQuestion.getType(), "Cell question was created correctly").toBe("checkbox");
    cellQuestion.value = [1, cellQuestion.otherItem.value];
    cellQuestion.otherValue = "My Comment";
    expect(cellQuestion.value, "question.value #1").toEqualValues([1, "other"]);
    expect(question.value, "Has comment").toEqualValues([{ col1: [1, "other"], "col1-Comment": "My Comment" }]);
    expect(survey.data, "survey.data is correct, set").toEqualValues({ q1: [{ col1: [1, "other"], "col1-Comment": "My Comment" }] });
    question.value = [{ col1: [1] }];
    expect(cellQuestion.value, "value sets correctly into cell").toEqualValues([1]);
    expect(survey.data, "survey.data is correct, clear").toEqualValues({ q1: [{ col1: [1] }] });
    expect(cellQuestion.comment, "comment clears correctly in cell question").toBe("");
    question.value = [{ col1: [1, "other"], "col1-Comment": "New Comment" }];
    expect(cellQuestion.value, "value other sets correctly into cell").toEqualValues([1, "other"]);
    expect(cellQuestion.comment, "comment sets correctly into cell question").toBe("New Comment");
    question.value = [{ col1: [1] }];
    question.value = [{ col1: [1, "NotInList"] }];
    expect(cellQuestion.value, "value other sets correctly into cell using NotInList").toEqualValues([1, "other"]);
    expect(cellQuestion.comment, "comment sets correctly into cell question using NotInList").toBe("NotInList");
  });
  test("Use survey.storeOthersAsComment = false in matrix, cellType = checkbox", () => {
    var survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              choices: [1, 2, 3],
              showOtherItem: true,
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var cellQuestion = <QuestionCheckboxModel>(
      question.visibleRows[0].cells[0].question
    );
    expect(cellQuestion.getType(), "Cell question was created correctly").toBe("checkbox");
    cellQuestion.value = [1, cellQuestion.otherItem.value];
    cellQuestion.otherValue = "My Comment";
    expect(question.value, "Has comment in value").toEqualValues([{ col1: [1, "My Comment"] }]);
    expect(survey.data, "survey.data is correct, set").toEqualValues({ q1: [{ col1: [1, "My Comment"] }] });
    question.value = [{ col1: [1] }];
    expect(cellQuestion.value, "value sets correctly into cell").toEqualValues([1]);
    expect(survey.data, "survey.data is correct, clear").toEqualValues({ q1: [{ col1: [1] }] });
    expect(cellQuestion.comment, "comment clears correctly in cell question").toBe("");
    question.value = [{ col1: [1, "New Comment"] }];
    expect(cellQuestion.value, "value other sets correctly into cell").toEqualValues([1, "New Comment"]);
    expect(cellQuestion.comment, "comment sets correctly into cell question").toBe("New Comment");
    question.value = [{ col1: [1] }];
    question.value = [{ col1: [1, "NotInList"] }];
    expect(cellQuestion.value, "value other sets correctly into cell using NotInList").toEqualValues([1, "NotInList"]);
    expect(cellQuestion.comment, "comment sets correctly into cell question using NotInList").toBe("NotInList");
  });
  test("Use survey.storeOthersAsComment in matrix, cellType = dropdown, set comment from survey", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [1, 2, 3],
              showOtherItem: true,
            },
          ],
        },
      ],
    });
    survey.data = {
      q1: [{ col1: 1 }, { col1: "other", "col1-Comment": "a comment" }],
    };
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    expect(matrix.visibleRows[1].cells[0].question.comment, "The comment set correctly").toBe("a comment");
  });

  test("Detail panel, get/set values", () => {
    var survey = new SurveyModel({});
    survey.css = {
      matrixdynamic: { detailIcon: "icon1", detailIconExpanded: "icon2", detailIconId: "#icon1", detailIconExpandedId: "#icon2" },
    };
    survey.addNewPage("p1");
    var matrix = new QuestionMatrixDynamicModel("q1");
    survey.pages[0].addQuestion(matrix);
    var column = matrix.addColumn("col1");
    column.cellType = "text";
    matrix.detailPanel.addNewQuestion("text", "q2");
    matrix.value = [
      { col1: "r1v1", q2: "r1v2" },
      { col1: "r2v1", q2: "r2v2" },
    ];
    expect(matrix.detailPanelMode, "Default value").toBe("none");
    expect(matrix.visibleRows[0].hasPanel, "There is no panel here").toBe(false);
    expect(matrix.visibleRows[0].detailPanel, "Panel is not created").toBeNull();
    matrix.detailPanelMode = "underRow";
    expect(matrix.visibleRows[0].hasPanel, "The panel has been created").toBe(true);
    expect(matrix.visibleRows[0].isDetailPanelShowing, "detail panel is not showing").toBe(false);
    expect(matrix.visibleRows[0].detailPanel, "Panel is not created, it is hidden").toBeNull();
    expect(matrix.getDetailPanelIconCss(matrix.visibleRows[0]), "detail button is closed").toBe("icon1");
    expect(matrix.getDetailPanelIconId(matrix.visibleRows[0]), "detail button has collapsed icon").toBe("#icon1");
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].isDetailPanelShowing, "detail panel is showing").toBe(true);
    expect(matrix.visibleRows[0].detailPanel, "Detail Panel is created").toBeTruthy();
    expect(matrix.getDetailPanelIconCss(matrix.visibleRows[0]), "detail button is opened").toBe("icon1 icon2");
    expect(matrix.getDetailPanelIconId(matrix.visibleRows[0]), "detail button has expanded icon").toBe("#icon2");
    expect(matrix.visibleRows[0].detailPanel.questions.length, "There is one question here").toBe(1);
    expect(matrix.visibleRows[0].detailPanel.questions[0].value, "The value is set correctly").toBe("r1v2");
    matrix.visibleRows[0].detailPanel.questions[0].value = "r1v2_changed";
    expect(matrix.value, "matrix value changed from detail panel").toEqualValues([
      { col1: "r1v1", q2: "r1v2_changed" },
      { col1: "r2v1", q2: "r2v2" },
    ]);
    matrix.value = [
      { col1: "r1v1", q2: "r1v2_changed_2" },
      { col1: "r2v1", q2: "r2v2_changed" },
    ];
    expect(matrix.visibleRows[0].detailPanel.questions[0].value, "The value in detail panel changed correctly from outside").toBe("r1v2_changed_2");
    matrix.visibleRows[0].hideDetailPanel();
    expect(matrix.visibleRows[0].isDetailPanelShowing, "detail panel is closed").toBe(false);
    expect(matrix.getDetailPanelIconCss(matrix.visibleRows[0]), "detail button is closed again").toBe("icon1");
    expect(matrix.getDetailPanelIconId(matrix.visibleRows[0]), "detail button has collapsed icon again").toBe("#icon1");
  });
  test("Detail panel in matrix dropdown, get/set values", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "q1" }],
          rows: ["row1", "row2"],
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "text", name: "col2" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows[0].hasPanel, "Panel is here").toBe(true);
    expect(matrix.visibleRows[0].detailPanel, "Panel is not created").toBeNull();
    expect(matrix.visibleRows[0].isDetailPanelShowing, "detail panel is not showing").toBe(false);
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].isDetailPanelShowing, "detail panel is showing").toBe(true);
    expect(matrix.visibleRows[0].detailPanel, "Detail Panel is created").toBeTruthy();
    matrix.visibleRows[0].detailPanel.getQuestionByName("q1").value = 1;
    expect(survey.data, "Survey data set correctly").toEqualValues({ matrix: { row1: { q1: 1 } } });
    survey.data = { matrix: { row1: { q1: 2 }, row2: { col1: 1, q1: 3 } } };
    expect(matrix.visibleRows[0].detailPanel.getQuestionByName("q1").value, "The value set from the survey correctly into opened detail panel question").toBe(2);
    matrix.visibleRows[1].showDetailPanel();
    expect(matrix.visibleRows[1].detailPanel.getQuestionByName("q1").value, "The value set from the survey correctly into closed detail panel question").toBe(3);
  });
  test("Detail panel and matrix read-only", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "q1" }],
          rows: ["row1", "row2"],
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "text", name: "col2" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    matrix.readOnly = true;
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].detailPanel.readOnly, "Panel is read-only").toBe(true);
    matrix.readOnly = false;
    expect(matrix.visibleRows[0].detailPanel.readOnly, "Panel is not read-only").toBe(false);
    matrix.readOnly = true;
    expect(matrix.visibleRows[0].detailPanel.readOnly, "Panel is read-only again").toBe(true);
  });
  test("Detail panel column and detail Panel have the same names, get/set values", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "q1" }],
          rows: ["row1", "row2"],
          columns: [{ cellType: "text", name: "q1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>(
      survey.getQuestionByName("matrix")
    );
    var row = matrix.visibleRows[0];
    row.showDetailPanel();
    row.getQuestionByColumnName("q1").value = "val1";
    expect(row.getQuestionByColumnName("q1").value, "Value is changed in row, #1").toBe("val1");
    expect(row.detailPanel.getQuestionByName("q1").value, "Value is changed in detail, #1").toBe("val1");
    row.detailPanel.getQuestionByName("q1").value = "val2";
    expect(row.getQuestionByColumnName("q1").value, "Value is changed in row, #2").toBe("val2");
    expect(row.detailPanel.getQuestionByName("q1").value, "Value is changed in detail, #2").toBe("val2");
    row.getQuestionByColumnName("q1").value = "val3";
    expect(row.getQuestionByColumnName("q1").value, "Value is changed in row, #3").toBe("val3");
    expect(row.detailPanel.getQuestionByName("q1").value, "Value is changed in detail, #3").toBe("val3");
  });

  test("Detail panel, run conditions", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }],
          detailElements: [
            { type: "text", name: "q1", visibleIf: "{question1} = 'val1'" },
            { type: "text", name: "q2", visibleIf: "{row.col1} = 'val2'" },
            { type: "text", name: "q3", visibleIf: "{row.q2} = 'val3'" },
            { type: "text", name: "q4", visibleIf: "{question1} != 'val1'" },
          ],
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.detailPanelMode, "detail panel mode load correctly").toBe("underRow");
    expect(matrix.detailElements.length, "detail elements loads correctly").toBe(4);
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].detailPanel, "Detail Panel is created").toBeTruthy();
    const panel = matrix.visibleRows[0].detailPanel;
    expect(panel.questions[0].isVisible, "first question is invisible").toBe(false);
    expect(panel.questions[1].isVisible, "second question is invisible").toBe(false);
    expect(panel.questions[2].isVisible, "third question is invisible").toBe(false);
    expect(panel.questions[3].isVisible, "fourth question is invisible").toBe(true);
    survey.setValue("question1", "val1");
    expect(panel.questions[0].isVisible, "first question is visible now").toBe(true);
    expect(panel.questions[3].isVisible, "fourth question is invisible now").toBe(false);
    matrix.visibleRows[0].cells[0].question.value = "val2";
    expect(panel.questions[1].isVisible, "second question is visible now").toBe(true);
    panel.getQuestionByName("q2").value = "val3";
    expect(panel.questions[2].isVisible, "third question is visible now").toBe(true);
  });
  test("Detail panel, run conditions & matrix before elements, bug#9137", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }],
          cellType: "text",
          detailElements: [
            { type: "matrixdynamic", name: "m1", columns: [{ name: "col1", defaultValue: "v1" }, { name: "col2", visibleIf: "{row.col1} notempty" }] },
            { type: "text", name: "q1", visibleIf: "{row.col1} = 'val2'" },
            { type: "text", name: "q2", visibleIf: "{row.q1} = 'val3'" }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].detailPanel, "Detail Panel is created").toBeTruthy();
    const panel = matrix.visibleRows[0].detailPanel;
    expect(panel.getQuestionByName("m1").visibleRows.length, "nested matrix rows are created").toBe(2);
    expect(panel.getQuestionByName("q1").isVisible, "first question is invisible, #1").toBe(false);
    expect(panel.getQuestionByName("q2").isVisible, "second question is invisible, #1").toBe(false);
    matrix.visibleRows[0].cells[0].question.value = "val2";
    expect(panel.getQuestionByName("q1").isVisible, "first question is visible, #2").toBe(true);
    expect(panel.getQuestionByName("q2").isVisible, "second question is invisible, #2").toBe(false);
    panel.getQuestionByName("q1").value = "val3";
    expect(panel.getQuestionByName("q1").isVisible, "first question is visible, #3").toBe(true);
    expect(panel.getQuestionByName("q2").isVisible, "second question is visible, #3").toBe(true);
  });
  test("Detail panel and copyDefaultValueFromLastEntry", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          detailPanelMode: "underRow",
          copyDefaultValueFromLastEntry: true,
          detailElements: [{ type: "text", name: "q1" }],
          rowCount: 1,
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "text", name: "col2" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = [{ col1: "col1Value", q1: "q1Value" }];
    matrix.addRow();
    expect(matrix.value).toEqualValues([{ col1: "col1Value", q1: "q1Value" }, { col1: "col1Value", q1: "q1Value" }]);
  });
  test("Detail panel, rendered table", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.renderedTable.rows;
    expect(rows.length, "There are two rows in rendering table").toBe(4);
    expect(rows[1].cells.length, "detail cell + 3 columns + delete button").toBe(5);
    expect(matrix.renderedTable.headerRow.cells.length, "Header has for detail button space two").toBe(5);
    expect(rows[1].cells[0].isActionsCell, "it is a detail cell (in actions cell)").toBe(true);
    var lastrowId = rows[3].id;
    matrix.visibleRows[0].showDetailPanel();
    expect(rows.length, "detail row is added").toBe(5);
    expect(matrix.renderedTable.rows[4].id, "We use the same rows").toBe(lastrowId);
    expect(rows[2].cells.length, "There are only 3 cells in detail panel row").toBe(3);
    expect(rows[2].cells[0].colSpans, "the first cell in detail panel has one colspan").toBe(1);
    expect(rows[2].cells[0].isEmpty, "the first cell in detail panel is empty").toBe(true);
    expect(rows[2].cells[1].colSpans, "colSpans set correctly for detail panel cell").toBe(3);
    expect(rows[2].cells[2].colSpans, "the last cell in detail panel has one colspan").toBe(1);
    expect(rows[2].cells[2].isEmpty, "the last cell in detail panel is empty").toBe(true);
    matrix.addRow();
    expect(rows.length, "We added a new row").toBe(7);
    matrix.removeRow(1);
    expect(rows.length, "We removed one row").toBe(5);
    expect(rows[2].isDetailRow, "We removed correct row").toBe(true);
    matrix.removeRow(0);
    expect(rows.length, "We removed data and detail panel row").toBe(2);
    expect(rows[1].isDetailRow, "We removed correct row").toBe(false);
  });

  test("Detail panel, rendered table design mode", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    survey.setDesignMode(true);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.renderedTable.rows;

    matrix.visibleRows[0].showDetailPanel();

    expect(rows[2].cells[0].colSpans, "colSpans set correctly for detail panel cell design mode").toBe(4);
  });

  test("Detail panel, rendered table mobile", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    survey.setIsMobile(true);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.renderedTable.rows;

    matrix.visibleRows[0].showDetailPanel();

    expect(rows[2].cells[rows[2].cells.length - 1].isActionsCell, "the last cell in detail panel is actions cell").toBe(true);

    expect(rows[2].cells[6].item.value.actions.map(a => a.id)).toEqualValues(["show-detail-mobile", "remove-row"]);
  });

  test("Detail panel, rendered table mobile - expand collapse", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    survey.setIsMobile(true);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.renderedTable.rows;

    var action1 = rows[1].cells[rows[1].cells.length - 1].item.value.actions[0];
    expect(matrix.visibleRows[1].isDetailPanelShowing).toBeFalsy();
    expect(action1.title).toBe("Show Details");
    action1.action(action1);
    expect(matrix.visibleRows[1].isDetailPanelShowing).toBeTruthy();
    expect(action1.title).toBe("Hide Details");

    action1.action(action1);
    expect(matrix.visibleRows[1].isDetailPanelShowing).toBeFalsy();
    expect(action1.title).toBe("Show Details");

  });

  test("Detail panel, create elements in code", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.onHasDetailPanelCallback = (
      row: MatrixDropdownRowModelBase
    ): boolean => {
      return true;
    };
    var createThirdQuestion = false;
    matrix.onCreateDetailPanelCallback = (
      row: MatrixDropdownRowModelBase,
      panel: PanelModel
    ) => {
      panel.addNewQuestion("text", "q1");
      panel.addNewQuestion("text", "q2");
      if (createThirdQuestion) {
        panel.addNewQuestion("text", "q3");
      }
    };
    expect(matrix.visibleRows[0].hasPanel, "There is a panel").toBe(true);
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].detailPanel.questions.length, "There are two questions").toBe(2);
    matrix.visibleRows[0].hideDetailPanel();
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].detailPanel.questions.length, "There are still two questions").toBe(2);
    createThirdQuestion = true;
    matrix.visibleRows[0].hideDetailPanel(true);
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].detailPanel.questions.length, "We have 3 questions now").toBe(3);
  });
  test("Detail panel created in code + custom actions, create elements in code", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 1,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.onHasDetailPanelCallback = (
      row: MatrixDropdownRowModelBase
    ): boolean => {
      return true;
    };
    matrix.onCreateDetailPanelCallback = (
      row: MatrixDropdownRowModelBase,
      panel: PanelModel
    ) => {
      panel.addNewQuestion("text", "q1");
      panel.getQuestionByName("q1").value = row.getValue("col1");
      panel.footerActions.push({
        id: "saveDetailPanel",
        action: () => {
          row.getQuestionByName("col1").value = panel.getQuestionByName("q1").value;
          row.hideDetailPanel(true);
        }
      });
    };
    matrix.value = [{ col1: "value1" }];
    expect(matrix.visibleRows[0].hasPanel, "There is a panel").toBe(true);
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].isDetailPanelShowing).toBe(true);
    expect(matrix.visibleRows[0].detailPanel.questions[0].value, "Value is set").toBe("value1");
    matrix.visibleRows[0].detailPanel.questions[0].value = "value2";
    matrix.visibleRows[0].detailPanel.footerActions[0].action();
    expect(matrix.visibleRows[0].isDetailPanelShowing, "We close detail panel").toBe(false);
    expect(matrix.value).toEqualValues([{ col1: "value2", q1: "value2" }]);
  });
  test("Detail panel, detailPanelShowOnAdding property", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          detailPanelShowOnAdding: true,
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.detailPanelShowOnAdding, "load property correctly").toBe(true);
    expect(matrix.visibleRows[1].isDetailPanelShowing, "We show detail panels collapsed").toBe(false);
    matrix.addRow();
    expect(matrix.visibleRows[2].isDetailPanelShowing, "Show detail panel on adding row").toBe(true);
    matrix.detailPanelShowOnAdding = false;
    matrix.addRow();
    expect(matrix.visibleRows[3].isDetailPanelShowing, "Do not show detail panel on adding row").toBe(false);
  });
  test("Do not clear all rows if minRowCount is set", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [1, 2, 3],
            },
          ],
          rowCount: 1,
          minRowCount: 1,
        },
      ],
    });
    survey.data = {
      q1: [{ col1: 1 }, { col1: 2 }],
    };
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    expect(matrix.rowCount, "There are two rows").toBe(2);
    survey.clear();
    expect(matrix.rowCount, "We should have one row").toBe(1);
  });
  test("Detail panel in designer", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        },
      ],
    });
    survey.setDesignMode(true);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "There are two visible rows by default").toBe(2);
    expect(matrix.visibleRows[0].isDetailPanelShowing, "We do not have detail row").toBe(false);
    matrix.detailPanelMode = "underRow";
    expect(matrix.visibleRows[0].isDetailPanelShowing, "We show the first detail panel now").toBe(true);
    expect(matrix.visibleRows[1].isDetailPanelShowing, "We do not show detail panel for the second row").toBe(false);
    expect(matrix.visibleRows[1].hasPanel, "Second row still has panel").toBe(true);
    expect(matrix.visibleRows[0].detailPanel.id, "We use matrix detail panel in designer").toBe(matrix.detailPanel.id);
    expect(matrix.detailPanel.isDesignMode, "detail panel in design mode").toBe(true);
  });
  test("Detail panel, show errors in panels", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1", isRequired: true }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.visibleRows;
    rows[0].showDetailPanel();
    expect(matrix.validate(true), "There is an error in the first row").toBe(false);
    rows[0].detailPanel.getQuestionByName("q1").value = "val1";
    expect(matrix.validate(true), "There is an error in the second row").toBe(false);
    expect(rows[1].isDetailPanelShowing, "We show the detail panel in the second row").toBe(true);
    rows[1].detailPanel.getQuestionByName("q1").value = "val2";
    expect(matrix.validate(true), "There is no errors anymore").toBe(true);
  });
  test("Detail panel, underRowSingle", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 3,
          detailPanelMode: "underRowSingle",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1", isRequired: true }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.visibleRows;
    rows[0].showDetailPanel();
    rows[1].showDetailPanel();
    expect(rows[1].isDetailPanelShowing, "Second row shows detail panel").toBe(true);
    expect(rows[0].isDetailPanelShowing, "We automatically hide detail panel in the first row").toBe(false);
  });
  test("Detail panel, show errors in panels and underRowSingle mode, Bug#2530", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRowSingle",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1", isRequired: true }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.visibleRows;
    expect(rows[0].isDetailPanelShowing || rows[1].isDetailPanelShowing, "The the first and second rows are hidden by default").toBe(false);
    expect(matrix.validate(true), "There is an error in the first row").toBe(false);
    expect(rows[0].isDetailPanelShowing, "We show the detail panel in the first row").toBe(true);
    expect(rows[1].isDetailPanelShowing, "We do not show the detail panel in the second row yet").toBe(false);
    rows[0].detailPanel.getQuestionByName("q1").value = "val1";
    expect(matrix.validate(true), "There is an error in the second row").toBe(false);
    expect(rows[1].isDetailPanelShowing, "We show the detail panel in the second row").toBe(true);
    rows[1].detailPanel.getQuestionByName("q1").value = "val2";
    expect(matrix.validate(true), "There is no errors anymore").toBe(true);
  });
  test("Detail panel, rendered table and className", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }],
          rows: ["row1", "row2"],
        },
      ],
    });
    setOldTheme(survey);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.renderedTable.headerRow.cells[1].className, "Set header cell").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
    var rows = matrix.renderedTable.rows;
    expect(rows[1].cells[0].className, "Detail button css (in actions cell)").toBe("sv_matrix_cell sv_matrix_cell_actions");

    expect(rows[1].cells[1].className, "row text css").toBe("sv_matrix_cell sv-table__cell--row-text sv_matrix_cell_detail_rowtext");
    expect(rows[1].cells[2].className, "row question cell css").toBe("sv_matrix_cell");
    expect(rows[1].className).toBe("sv_matrix_row");
    expect(rows[2].className).toBe("sv_matrix_row sv_matrix_detail_row");
    expect(rows[2].cells[1].className, "panel cell css").toBe("sv_matrix_cell_detail_panel");
  });

  test("Detail panel, Process text in titles", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "rootQ" },
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [
            {
              type: "text",
              name: "q1",
              title:
              "rowIndex:{rowIndex},rootQ:{rootQ},row.col1:{row.col1},row.q2:{row.q2}",
            },
            { type: "text", name: "q2" },
          ],
        },
      ],
    });
    survey.data = {
      rootQ: "rootVal",
      matrix: [{}, { col1: "val1", q2: "valQ2" }],
    };
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

    matrix.visibleRows[1].showDetailPanel();
    var q1 = matrix.visibleRows[1].detailPanel.getQuestionByName("q1");
    expect(q1.locTitle.renderedHtml, "Text preprocessed correctly").toBe("rowIndex:2,rootQ:rootVal,row.col1:val1,row.q2:valQ2");
  });
  test("Detail panel & survey.onValueChanged & empty value, Bug#9169", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }, { name: "col2" }],
          detailElements: [
            { type: "text", name: "q1" }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

    matrix.visibleRows[0].showDetailPanel();
    const q1 = matrix.visibleRows[0].detailPanel.getQuestionByName("q1");
    const logs: any = [];
    survey.onValueChanged.add((sender, options) => {
      logs.push({ name: options.name, value: options.value });
    });
    q1.value = "abc";
    expect(logs, "#1").toEqualValues([{ name: "matrix", value: [{ q1: "abc" }, {}] }]);
    q1.clearValue();
    expect(logs, "#2").toEqualValues([
      { name: "matrix", value: [{ q1: "abc" }, {}] },
      { name: "matrix", value: [] }
    ]);
  });

  test("copyvalue trigger for dropdown matrix cell", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          rows: ["item1", "Item2"],
          columns: [{ name: "c1", cellType: "text" }],
        },
        {
          type: "matrixdropdown",
          name: "q2",
          rows: ["item1", "Item2"],
          columns: [{ name: "c1", cellType: "text" }],
        },
      ],
      triggers: [
        {
          type: "copyvalue",
          expression: "{q1.item1.c1} notempty",
          setToName: "q2.item1.c1",
          fromName: "q1.item1.c1",
        },
        {
          type: "copyvalue",
          expression: "{q1.Item2.c1} notempty",
          setToName: "q2.Item2.c1",
          fromName: "q1.Item2.c1",
        },
      ],
    });
    var q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var q2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    q1.visibleRows[0].cells[0].value = "val1";
    q1.visibleRows[1].cells[0].value = "val2";
    expect(q2.visibleRows[0].cells[0].value, "copy value for item1").toBe("val1");
    expect(survey.runCondition("{q1.Item2.c1} notempty"), "The expression returns true").toBe(true);
    expect(survey.runExpression("{q1.Item2.c1}"), "The expression returns val2").toBe("val2");
    expect(q2.visibleRows[1].cells[0].value, "copy value for Item2").toBe("val2");
  });
  test("copyvalue trigger for two dynamic matrices, Bug#10107", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [{ name: "a1", cellType: "text" }],
        },
        { type: "boolean", name: "a" },
        {
          type: "matrixdynamic",
          name: "q2",
          columns: [{ name: "a1", cellType: "text" }],
        },
      ],
      triggers: [
        {
          type: "copyvalue",
          expression: "{a} = true",
          setToName: "q2",
          fromName: "q1",
        }
      ]
    });
    const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    q1.value = [{ a1: "val1" }, { a1: "val2" }];
    survey.setValue("a", true);
    expect(q2.value, "copy value to q2, #1").toEqualValues([{ a1: "val1" }, { a1: "val2" }]);
    survey.setValue("a", false);
    q2.addRow();
    q2.visibleRows[2].cells[0].value = "val3";
    expect(q2.value, "added row").toEqualValues([{ a1: "val1" }, { a1: "val2" }, { a1: "val3" }]);
    survey.setValue("a", true);
    expect(q2.value, "copy value to q2, #2").toEqualValues([{ a1: "val1" }, { a1: "val2" }]);
  });
  test("MatrixDynamic, test renderedTable.showTable&showAddRowOnBottom", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 0,
          hideColumnsIfEmpty: true,
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.showTable, "There is no rows").toBe(false);
    expect(matrix.renderedTable.showAddRowOnBottom, "Do not show add button").toBe(false);
    matrix.addRow();
    expect(matrix.renderedTable.showTable, "There is a row").toBe(true);
    expect(matrix.renderedTable.showAddRowOnBottom, "Show add button").toBe(true);
    matrix.removeRow(0);
    expect(matrix.renderedTable.showTable, "Matrix is empty again").toBe(false);
    expect(matrix.renderedTable.showAddRowOnBottom, "Do not show add button again").toBe(false);
    matrix.hideColumnsIfEmpty = false;
    expect(matrix.renderedTable.showTable, "hideColumnsIfEmpty is false").toBe(true);
    survey.setDesignMode(true);
    matrix.hideColumnsIfEmpty = true;
    expect(matrix.renderedTable.showTable, "survey in design mode").toBe(true);
  });
  test("MatrixDynamic, Hide/show add row button on changing allowAddRows", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          maxRowCount: 3,
          hideColumnsIfEmpty: true,
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.showAddRowOnBottom, "We have a row here").toBe(true);
    matrix.allowAddRows = false;
    expect(matrix.renderedTable.showAddRowOnBottom, "We do not allow add rows").toBe(false);
    matrix.allowAddRows = true;
    expect(matrix.renderedTable.showAddRowOnBottom, "We have a row here again").toBe(true);
    matrix.addRow();
    expect(matrix.renderedTable.showAddRowOnBottom, "max row count is 3").toBe(false);
    matrix.rowCount = 1;
    expect(matrix.renderedTable.showAddRowOnBottom, "row count is 1").toBe(true);
  });

  test("Matrixdynamic change column.readOnly property", () => {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns[0].readOnly = true;
    expect(question.columns[0].templateQuestion.isReadOnly, "set correctly").toBe(true);
  });

  test("Row actions, check onGetMatrixRowActions Event", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1" }],
          rows: ["row1"],
        },
      ],
    });
    var options;
    var surveyFromEvent;
    survey.onGetMatrixRowActions.add((s, opt) => {
      options = opt;
      surveyFromEvent = s;
    });
    const matrix = survey.getQuestionByName("matrix");
    (<QuestionMatrixDynamicModel>matrix).renderedTable.rows;
    expect(surveyFromEvent == survey).toBeTruthy();
    expect(options.question == matrix).toBeTruthy();
    expect(options.row == matrix.visibleRows[0]).toBeTruthy();
    expect(options.actions).toEqualValues([]);
  });

  test("Row actions, check getUpdatedMatrixRowActions", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1" }],
          rows: ["row1"],
        },
      ],
    });
    var expectedActions = [{ title: "Action 1" }, { title: "Action 2" }];
    survey.onGetMatrixRowActions.add((survey, opt) => {
      opt.actions = expectedActions;
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var actions = [];
    expect(survey.getUpdatedMatrixRowActions(matrix, matrix.visibleRows[0], actions)).toEqualValues(expectedActions);
  });

  test("moveRowByIndex test", () => {
    var matrixD = new QuestionMatrixDynamicModel("q1");
    matrixD.value = [{ v1: "v1" }, { v2: "v2" }];
    matrixD.moveRowByIndex(1, 0);
    expect(matrixD.value).toEqualValues([{ v2: "v2" }, { v1: "v1" }]);
  });

  test("moveRowByIndex - detail panels, Bug#10472", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          detailPanelShowOnAdding: true,
          columns: [{ name: "v1" }],
          detailElements: [{ type: "text", name: "v2" }],
        },
      ],
    });
    const matrixD = survey.getQuestionByName("matrix");
    matrixD.value = [{ v1: "v1" }, { v2: "v2" }];
    matrixD.visibleRows[0].showDetailPanel();
    expect(matrixD.visibleRows[0].isDetailPanelShowing, "row[0] expanded before move").toBeTruthy();
    expect(matrixD.visibleRows[1].isDetailPanelShowing, "row[1] collapsed before move").toBeFalsy();
    matrixD.moveRowByIndex(1, 0);
    expect(matrixD.visibleRows[0].isDetailPanelShowing, "row[0] collapsed after move").toBeFalsy();
    expect(matrixD.visibleRows[1].isDetailPanelShowing, "row[1] expanded after move").toBeTruthy();
  });

  test("Row actions, rendered table and className", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1" }],
          rows: ["row1"],
        },
      ],
    });
    setOldTheme(survey);
    survey.onGetMatrixRowActions.add((_, opt) => {
      opt.actions = [
        { title: "Action 1" },
        { title: "Action 2", location: "end" },
      ];
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "Actions headers should appear").toBe(4);
    var rows = matrix.renderedTable.rows;
    expect(rows[1].cells[0].className, "Actions cell css").toBe("sv_matrix_cell sv_matrix_cell_actions");
    const leftActions = rows[1].cells[0].item.getData().actions;
    expect(leftActions.length === 1, "left actions count: 1").toBeTruthy();
    expect(leftActions[0].title === "Action 1", "action 1 in left actions cell").toBeTruthy();
    expect(leftActions[0] instanceof Action, "actions in cell are instances of Action").toBeTruthy();
    expect(rows[1].cells[1].className, "text cell").toBe("sv_matrix_cell sv-table__cell--row-text");
    expect(rows[1].cells[2].className, "ordinary cell").toBe("sv_matrix_cell");
    expect(rows[1].cells[3].className, "Actions cell css").toBe("sv_matrix_cell sv_matrix_cell_actions");
    const rightActions = rows[1].cells[3].item.getData().actions;
    expect(rightActions.length === 1, "right actions count: 1").toBeTruthy();
    expect(rightActions[0].title === "Action 2", "action 2 in right actions cell").toBeTruthy();
    expect(rightActions[0] instanceof Action, "actions in cell are instances of Action").toBeTruthy();
  });
  test("onGetMatrixRowActions should be called 1 time", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1" }],
          rows: ["row1"],
        },
      ],
    });
    var count = 0;
    survey.onGetMatrixRowActions.add((_, opt) => {
      count++;
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.renderedTable;
    expect(count).toBe(1);
  });

  test("Matrixdynamic change column.question.choices on changing choices in matrix", () => {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 2;
    question.choices = ["item1", "item2", "item3"];
    question.addColumn("col1");
    question.addColumn("col2").cellType = "checkbox";
    expect(question.choices.length, "There are 5 choices in matrix").toBe(3);
    var rows = question.visibleRows;
    expect(rows[0].cells[0].question.choices.length, "There are 3 items in col1 question ").toBe(3);
    expect(rows[0].cells[1].question.choices.length, "There are 3 items in col2 question ").toBe(3);
    question.choices.push(new ItemValue("item4"));
    rows = question.visibleRows;
    expect(rows[0].cells[0].question.choices.length, "There are 4 items in col1 question ").toBe(4);
    expect(rows[0].cells[1].question.choices.length, "There are 4 items in col2 question ").toBe(4);
    question.choices[0].value = "item11";
    question.choices[3].text = "text4";
    rows = question.visibleRows;
    expect(rows[0].cells[0].question.choices[0].value, "value item in col1 question changed").toBe("item11");
    expect(rows[0].cells[1].question.choices[0].value, "value item in col2 question changed").toBe("item11");
    expect(rows[0].cells[0].question.choices[3].text, "text item in col1 question changed").toBe("text4");
    expect(rows[0].cells[1].question.choices[3].text, "text item in col2 question changed").toBe("text4");
  });
  test("survey.onMatrixRowRemoving. Clear the row if it is the last one", () => {
    var survey = new SurveyModel();
    var removedRowIndex = -1;
    var visibleRowsCount = -1;
    survey.onMatrixRowRemoving.add(function (survey, options) {
      removedRowIndex = options.rowIndex;
      visibleRowsCount = options.question.visibleRows.length;
      options.allow = options.question.rowCount > 1;
      if (!options.allow) {
        options.row.clearValue();
      }
    });
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
    page.addElement(q1);
    q1.addColumn("col1");
    q1.rowCount = 3;
    q1.value = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    expect(q1.rowCount, "there are three rows").toBe(3);
    q1.removeRow(1);
    expect(q1.rowCount, "there are two rows").toBe(2);
    expect(removedRowIndex, "onMatrixRowRemoved event has been fired correctly").toBe(1);
    expect(visibleRowsCount, "There should be three visible rows in event").toBe(3);
    q1.removeRow(1);
    expect(q1.rowCount, "there is one row now").toBe(1);
    expect(q1.value, "We have value in the cell").toEqualValues([{ col1: 1 }]);
    q1.removeRow(0);
    expect(q1.rowCount, "We do not allow to remove the row").toBe(1);
    expect(q1.value, "We clear value in the row").toEqualValues([]);
  });
  test("Text processing in rows and columns, rendered table", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          defaultValue: "value1",
        },
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1", title: "Col:{q1}" }],
          rows: [{ value: "row1", text: "Row:{q1}" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "Row column + column").toBe(2);
    expect(matrix.renderedTable.headerRow.cells.length, "Row column + column").toBe(2);

    expect(matrix.renderedTable.headerRow.cells[1].locTitle.textOrHtml, "column text").toBe("Col:value1");
    expect(matrix.renderedTable.rows[1].cells[0].locTitle.textOrHtml, "row text").toBe("Row:value1");
    survey.setValue("q1", "val2");
    expect(matrix.renderedTable.headerRow.cells[1].locTitle.textOrHtml, "column text, #2").toBe("Col:val2");
    expect(matrix.renderedTable.rows[1].cells[0].locTitle.textOrHtml, "row text, #2").toBe("Row:val2");
  });
  test("getDisplayValue() function in matrix dynamic, Bug#", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          columns: [
            {
              name: "col1",
              title: "Column 1",
              cellType: "dropdown",
              choices: [
                { value: 1, text: "A" },
                { value: 2, text: "B" },
                { value: 3, text: "C" },
              ],
            },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = [{ col1: 1 }, { col1: 3 }];
    var counter = 0;
    survey.onValueChanged.add((sender, options) => {
      counter++;
    });
    var displayValue = matrix.getDisplayValue(true, [{ col1: 2 }]);
    expect(displayValue, "Do not use value").toEqualValues([{ "Column 1": "B" }]);
    expect(matrix.value, "Value is still the same").toEqualValues([{ col1: 1 }, { col1: 3 }]);
    expect(counter, "We do not change the value during processing").toBe(0);
  });

  test("getDisplayValue() function in matrix Dropdown, Bug#", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              title: "Column 1",
              cellType: "dropdown",
              choices: [
                { value: 1, text: "A" },
                { value: 2, text: "B" },
                { value: 3, text: "C" },
              ],
            },
          ],
          rows: [{ value: "row1", text: "Row 1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    matrix.value = { row1: { col1: 1 } };
    var counter = 0;
    survey.onValueChanged.add((sender, options) => {
      counter++;
    });
    var displayValue = matrix.getDisplayValue(true, { row1: { col1: 2 } });
    expect(displayValue, "Do not use value").toEqualValues({ "Row 1": { "Column 1": "B" } });
    expect(matrix.value, "Value is still the same").toEqualValues({ row1: { col1: 1 } });
    expect(counter, "We do not change the value during processing").toBe(0);
  });
  test("getDisplayValue() function in matrix Dropdown with rowsVisibleIf, Bug#3430", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          rowsVisibleIf: "{val} contains {item}",
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [
                { value: 1, text: "A" },
                { value: 2, text: "B" },
                { value: 3, text: "C" },
                { value: 4, text: "C" },
                { value: 5, text: "C" },
              ],
            },
          ],
          rows: ["row1", "row2", "row3", "row4", "row5"],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    survey.setValue("val", ["row2", "row3"]);
    expect(matrix.visibleRows.length, "There are two rows visible").toBe(2);

    matrix.value = { row2: { col1: 1 }, row3: { col1: 2 } };
    const displayValue = matrix.getDisplayValue(true);
    expect(displayValue, "Rows are filtered").toEqualValues({ "row2": { "col1": "A" }, "row3": { "col1": "B" } });
  });

  test("Error on setting properties into column cellType:'text', Bug#2897", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
            },
          ],
          rows: [{ value: "row1", text: "Row 1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>(
      survey.getQuestionByName("matrix")
    );
    var rows = matrix.visibleRows;
    matrix.columns[0].inputType = "date";
    expect(rows[0].cells[0].question.inputType, "Set the property correctly").toBe("date");
  });
  test("MatrixDynamic, test renderedTable column locString on adding new column", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "We have one column and delete row").toBe(1 + 1);
    expect(matrix.renderedTable.headerRow.cells[0].locTitle.renderedHtml, "Title rendered from JSON").toBe("col1");
    matrix.addColumn("col2");
    expect(matrix.renderedTable.headerRow.cells[1].locTitle.renderedHtml, "Title rendered from addColumn").toBe("col2");
    matrix.columns.push(new MatrixDropdownColumn("col3"));
    expect(matrix.renderedTable.headerRow.cells[2].locTitle.renderedHtml, "Title rendered from columns.push").toBe("col3");
  });
  test("MatrixDynamic, test renderedTable, do not render empty locTitle in header", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "We have one column and delete row").toBe(1 + 1);
    expect(matrix.renderedTable.headerRow.cells[0].hasTitle, "column header").toBe(true);
    expect(matrix.renderedTable.headerRow.cells[1].hasTitle, "nothing").toBe(false);
    matrix.transposeData = true;
    expect(matrix.renderedTable.rows[1].cells[0].hasTitle, "column header, vertical").toBe(true);
    expect(matrix.renderedTable.rows[2].cells[0].hasTitle, "nothing, vertical").toBe(false);
  });
  test("Focus first visible enabled cell on adding a new row from UI", () => {
    var focusedQuestionId = "";
    var oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };

    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          cellType: "text",
          minRowCount: 1,
          maxRowCount: 2,
          rowCount: 1,
          columns: [
            { name: "col1", visible: false },
            { name: "col2", readOnly: true },
            { name: "col3" },
            { name: "col4" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.addRowUI();
    expect(focusedQuestionId, "focus correct value").toBe(matrix.visibleRows[1].cells[2].question.inputId);
    focusedQuestionId = "";
    matrix.addRowUI();
    expect(focusedQuestionId, "new row can't be added").toBe("");
    SurveyElement.FocusElement = oldFunc;
  });
  test("Focus first visible enabled cell on focusing matrix, Bug#10657", () => {
    let focusedQuestionId = "";
    const oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };

    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          cellType: "text",
          rowCount: 1,
          columns: [
            { name: "col1", visible: false },
            { name: "col2", readOnly: true },
            { name: "col3" },
            { name: "col4" },
          ],
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    matrix.focus();
    expect(focusedQuestionId, "focus correct value").toBe(rows[0].cells[2].question.inputId);
    SurveyElement.FocusElement = oldFunc;
  });
  test("Matrixdynamic onMatrixValueChanging - do not call event on clear empty cell", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [1, 2, 3, 4, 5],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var counter = 0;
    survey.onMatrixCellValueChanging.add(function (sender, options) {
      counter++;
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var cellQuestion = matrix.visibleRows[0].cells[0].question;
    cellQuestion.clearIncorrectValues();
    expect(counter, "There is not value to clear").toBe(0);
    cellQuestion.value = 1;
    expect(counter, "value is set").toBe(1);
    cellQuestion.clearIncorrectValues();
    expect(counter, "value is correct").toBe(1);
  });
  test("Matrixdynamic onMatrixValueChanging - do not call event on set the same renderedValue", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              choices: [1, 2, 3, 4, 5],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var counter = 0;
    survey.onMatrixCellValueChanging.add(function (sender, options) {
      counter++;
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var cellQuestion = <QuestionDropdownModel>(
      matrix.visibleRows[0].cells[0].question
    );
    cellQuestion.renderedValue = undefined;
    expect(counter, "There is not value to clear").toBe(0);
    cellQuestion.renderedValue = 1;
    expect(counter, "Call one time").toBe(1);
    cellQuestion.renderedValue = 1;
    expect(counter, "Do not call on the same value").toBe(1);
    cellQuestion.renderedValue = undefined;
    expect(counter, "Value is undefined").toBe(2);
    cellQuestion.renderedValue = undefined;
    expect(counter, "Value is still undefined").toBe(2);
  });

  test("Drag handler cell in rendered table", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          allowRowReorder: true,
          columns: ["col1"]
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.headerRow.cells.length, "Drag handler cell + one column + actions cell").toBe(3);
    var rows = matrix.renderedTable.rows;
    expect(rows[1].cells[0].isDragHandlerCell, "isDragHandlerCell").toBe(true);
    expect(rows[3].cells[0].isDragHandlerCell, "isDragHandlerCell").toBe(true);
    expect(rows[1].cells[2].isActionsCell, "isActionsCell").toBe(true);
    expect(rows[3].cells[2].isActionsCell, "isActionsCell").toBe(true);
  });

  test("allowRowReorder with readOnly", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          allowRowReorder: true,
          "readOnly": true,
          columns: ["col1"]
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.isRowsDragAndDrop, "#1").toBe(false);
    matrix.readOnly = false;
    expect(matrix.renderedTable.isRowsDragAndDrop, "#2").toBe(true);
  });

  test("allowRowReorder & readOnly = true", () => {
    const survey = new SurveyModel({
      readOnly: true,
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          allowRowReorder: true,
          columns: ["col1"]
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.isRowsDragAndDrop, "#1").toBe(false);
    survey.readOnly = false;
    expect(matrix.renderedTable.isRowsDragAndDrop, "#2").toBe(true);
  });
  test("Drag&drop and column visibleIf", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          allowRowReorder: true,
          columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text", visibleIf: "{row.col1}='a'" }]
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = [{ col1: "a", col2: "b" }, { col1: "c" }];
    let rows = matrix.visibleRows;
    expect(rows[0].cells[0].question.value, "cell[0,0].value #1").toBe("a");
    expect(rows[0].cells[1].question.value, "cell[0,1].value #1").toBe("b");
    expect(rows[0].cells[1].question.isVisible, "cell[0,1].isVisible #1").toBe(true);
    expect(rows[1].cells[0].question.value, "cell[1,0].value #1").toBe("c");
    expect(rows[1].cells[1].question.isVisible, "cell[1,1].isVisible #1").toBe(false);

    matrix.moveRowByIndex(1, 0);
    rows = matrix.visibleRows;
    expect(rows[0].cells[0].question.value, "cell[1,0].value #2").toBe("c");
    expect(rows[0].cells[1].question.isVisible, "cell[1,1].isVisible #2").toBe(false);
    expect(rows[1].cells[0].question.value, "cell[0,0].value #2").toBe("a");
    expect(rows[1].cells[1].question.value, "cell[0,1].value #2").toBe("b");
    expect(rows[1].cells[1].question.isVisible, "cell[0,1].isVisible #2").toBe(true);
    expect(matrix.value, "matrix.value #2").toEqualValues([{ col1: "c" }, { col1: "a", col2: "b" }]);
    const renderedRows = matrix.renderedTable.rows;
    expect(renderedRows.length, "There are 4 rendered rows").toBe(4);
    expect(renderedRows[0].cells.length, "There are 4 cells in row").toBe(4);
    expect(renderedRows[0].cells[1].question.value, "rendred.cell[1,0].value #2").toBe("c");
  });

  test("Drag&drop row with dropdown and column visibleIf", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          allowRowReorder: true,
          columns: [{ name: "col1", cellType: "dropdown", "choices": ["a", "b", "c"] }, { name: "col2", cellType: "text", visibleIf: "{row.col1}='a'" }]
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    let rows = matrix.visibleRows;
    let row1Col1ListModel = rows[0].cells[0].question.dropdownListModel.listModel;
    let row2Col1ListModel = rows[1].cells[0].question.dropdownListModel.listModel;
    row1Col1ListModel.onItemClick(row1Col1ListModel.actions[0]);
    row2Col1ListModel.onItemClick(row2Col1ListModel.actions[2]);
    rows[0].cells[1].question.value = "b";
    matrix.renderedTable.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.hasQuestion) cell.question?.afterRenderCore({} as any);
      });
    });

    expect(rows[0].cells[0].question.value, "cell[0,0].value #1").toBe("a");
    expect(rows[1].cells[0].question.showSelectedItemLocText, "cell[0,0].showSelectedItemLocText #1").toBe(true);
    expect(rows[0].cells[0].question.dropdownListModel.inputString, "cell[0,0].dropdownListModel.inputString #1").toBe("");
    expect(rows[0].cells[0].question.dropdownListModel.showHintString, "cell[0,0].dropdownListModel.showHintString #1").toBe(false);
    expect(rows[0].cells[1].question.value, "cell[0,1].value #1").toBe("b");
    expect(rows[0].cells[1].question.isVisible, "cell[0,1].isVisible #1").toBe(true);
    expect(rows[1].cells[0].question.value, "cell[1,0].value #1").toBe("c");
    expect(rows[1].cells[1].question.isVisible, "cell[1,1].isVisible #1").toBe(false);

    matrix.moveRowByIndex(1, 0);
    rows = matrix.visibleRows;
    expect(rows[0].cells[0].question.value, "cell[1,0].value #2").toBe("c");
    expect(rows[0].cells[1].question.isVisible, "cell[1,1].isVisible #2").toBe(false);
    expect(rows[1].cells[0].question.value, "cell[0,0].value #2").toBe("a");
    expect(rows[1].cells[0].question.showSelectedItemLocText, "cell[0,0].showSelectedItemLocText #2").toBe(true);
    expect(rows[1].cells[0].question.dropdownListModel.inputString, "cell[0,0].dropdownListModel.inputString #2").toBe("");
    expect(rows[0].cells[0].question.dropdownListModel.showHintString, "cell[0,0].dropdownListModel.showHintString #2").toBe(false);
    expect(rows[1].cells[1].question.value, "cell[0,1].value #2").toBe("b");
    expect(rows[1].cells[1].question.isVisible, "cell[0,1].isVisible #2").toBe(true);
    expect(matrix.value, "matrix.value #2").toEqualValues([{ col1: "c" }, { col1: "a", col2: "b" }]);
    const renderedRows = matrix.renderedTable.rows;
    expect(renderedRows.length, "There are 4 rendered rows").toBe(4);
    expect(renderedRows[0].cells.length, "There are 4 cells in row").toBe(4);
    expect(renderedRows[0].cells[1].question.value, "rendred.cell[1,0].value #2").toBe("c");
  });

  test("QuestionMatrixDropdownRenderedRow isAdditionalClasses", () => {
    const rowClass = "rowClass";
    const detailRowClass = "detailRowClass";
    const rowAdditionalClass = "rowAdditionalClass";

    const renderedRow = new QuestionMatrixDropdownRenderedRow({
      row: rowClass,
      detailRow: detailRowClass,
      rowAdditional: rowAdditionalClass
    });

    let className = renderedRow.className;
    expect(className.indexOf(rowClass)).not.toBe(-1);
    expect(className.indexOf(detailRowClass)).toBe(-1);
    expect(className.indexOf(rowAdditionalClass)).toBe(-1);

    renderedRow.isDetailRow = true;
    renderedRow.isAdditionalClasses = true;
    className = renderedRow.className;
    expect(className.indexOf(rowClass)).not.toBe(-1);
    expect(className.indexOf(detailRowClass)).not.toBe(-1);
    expect(className.indexOf(rowAdditionalClass)).not.toBe(-1);
  });
  test("Column title equals to name", () => {
    const column = new MatrixDropdownColumn("col1");
    expect(column.locTitle.getLocaleText(""), "Column title is empty # 1").toBeFalsy();
    expect(column.locTitle.renderedHtml).toBe("col1");
    column.title = "col1";
    expect(column.locTitle.getLocaleText(""), "Column title is empty # 2").toBe("col1");
    expect(column.locTitle.renderedHtml).toBe("col1");
  });

  test("matrix beginUpdate/endUpdate", () => {
    var matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    matrix.allowRemoveRows = false;
    matrix.rowCount = 2;
    expect(matrix.renderedTable.headerRow.cells.length, "renderedTable: 2 columns, #1").toBe(2);
    expect(matrix.visibleRows.length, "visibleRows.length, #1").toBe(2);
    expect(matrix.visibleRows[0].cells.length, "visibleRows[0]: 2 columns, #1").toBe(2);

    matrix.beginUpdate();
    matrix.rowCount = 3;
    matrix.addColumn("col3");
    expect(matrix.renderedTable.headerRow.cells.length, "renderedTable: 2 columns, #2 - locUpdate").toBe(2);
    expect(matrix.visibleRows, "visibleRows.length, #2 - locUpdate").toBeFalsy();
    matrix.endUpdate();

    expect(matrix.renderedTable.headerRow.cells.length, "renderedTable: 3 columns, #2 - unlock Update").toBe(3);
    expect(matrix.visibleRows.length, "visibleRows.length, #3 - unlock Update").toBe(3);
    expect(matrix.visibleRows[0].cells.length, "visibleRows[0]: 3 columns, #3 - unloc Update").toBe(3);
  });
  test("TextProcessing matrix in panel dynamic, Bug#3491", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "root_q1", defaultValue: "root_val1" },
        {
          type: "paneldynamic",
          name: "root",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1", defaultValue: "panel_val1" },
            {
              type: "matrixdynamic",
              name: "matrix",
              rowCount: 1,
              cellType: "text",
              columns: [{ name: "col1", defaultValue: "col_val1" }]
            }
          ],
        },
      ],
    });
    const matrix: QuestionMatrixDynamicModel = survey.getQuestionByName("root").panels[0].questions[1];
    const row = matrix.visibleRows[0];
    const textProc = row.getTextProcessor();
    expect(textProc.processText("{root_q1}", false), "root_q1").toBe("root_val1");
    expect(textProc.processText("{row.col1}", false), "row.col1").toBe("col_val1");
    expect(textProc.processText("{panel.q1}", false), "panel.q1").toBe("panel_val1");
  });
  test("Question defaultValueExpression in matrix dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 1,
          columns: [
            { cellType: "text", name: "q1", defaultValue: 1 },
            { cellType: "text", name: "q2", defaultValueExpression: "{row.q1} + 2" },
          ],
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const row = matrix.visibleRows[0];
    const q1 = row.getQuestionByName("q1");
    const q2 = row.getQuestionByName("q2");
    expect(q2.value, "initial value").toBe(3);
    q1.value = 5;
    expect(q2.value, "q1 is changed").toBe(7);
    q2.value = 4;
    expect(q2.value, "changed dirrectly").toBe(4);
    q1.value = 10;
    expect(q2.value, "stop react on defaultValueExpression").toBe(4);
  });
  test("Question defaultValueExpression in matrix dynamic delete/add rows, Bug#5193", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [{ cellType: "text", name: "col1" }]
        },
        {
          type: "matrixdynamic",
          name: "q2",
          defaultValueExpression: "{q1}",
          columns: [{ cellType: "text", name: "col1" }]
        }
      ]
    });
    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const matrix2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    const rows1 = matrix1.visibleRows;
    rows1[0].cells[0].value = "val1";
    rows1[1].cells[0].value = "val2";
    expect(matrix2.value).toEqualValues([{ col1: "val1" }, { col1: "val2" }]);
    matrix2.removeRow(1);
    expect(matrix2.value).toEqualValues([{ col1: "val1" }]);
    matrix2.addRow();
    const rows2 = matrix2.visibleRows;
    rows2[1].cells[0].value = "val2_2";
    expect(matrix2.value).toEqualValues([{ col1: "val1" }, { col1: "val2_2" }]);
  });
  test("call locationChangedCallback for cell question", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          columns: [
            { name: "q1" }
          ],
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const row = matrix.visibleRows[1];
    let counter = 0;
    row.cells[0].question.localeChangedCallback = () => { counter++; };
    survey.locale = "de";
    survey.locale = "";
    expect(counter, "locationChangedCallback called").toBe(2);
  });
  test("Restore read-only on setting mode display/edit", () => {
    const json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 1,
          columns: [
            {
              name: "Column1",
            },
            {
              name: "Column2",
              readOnly: true
            },
          ],
          cellType: "text",
        },
      ],
    };

    const survey = new SurveyModel(json);
    const question = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("question1")
  );
    const row = question.visibleRows[0];
    expect(row.cells[0].question.readOnly, "It is not read-only cell1 #1").toBe(false);
    expect(row.cells[0].question.isReadOnly, "isReadOnly-false cell1 #1").toBe(false);
    expect(row.cells[1].question.readOnly, "It is read-only cell2 #1").toBe(true);
    expect(row.cells[1].question.isReadOnly, "isReadOnly-true cell2 #1").toBe(true);
    survey.readOnly = true;
    expect(row.cells[0].question.readOnly, "It is not read-only cell1 #2").toBe(false);
    expect(row.cells[0].question.isReadOnly, "isReadOnly-true cell1 #2").toBe(true);
    expect(row.cells[1].question.readOnly, "It is read-only cell2 #2").toBe(true);
    expect(row.cells[1].question.isReadOnly, "isReadOnly-true cell2 #2").toBe(true);
    survey.readOnly = false;
    expect(row.cells[0].question.readOnly, "It is not read-only cell1 #3").toBe(false);
    expect(row.cells[0].question.isReadOnly, "isReadOnly-false cell1 #3").toBe(false);
    expect(row.cells[1].question.readOnly, "It is read-only cell2 #3").toBe(true);
    expect(row.cells[1].question.isReadOnly, "isReadOnly-true cell2 #3").toBe(true);
  });
  test("getTitle", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "matrixdynamic", name: "q1",
              rowCount: 1,
              columns: [
                { name: "col1", cellType: "text", cellHint: "true hint" },
                { name: "col2", cellType: "text" },
                { name: "col3", cellType: "text", cellHint: " " }
              ]
            }]
        }
      ]
    });
    const question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var renderedTable = question.renderedTable;
    const rendredRow = renderedTable.rows[1];
    expect(rendredRow.cells[0].getTitle(), "cell0, #1").toBe("true hint");
    expect(rendredRow.cells[1].getTitle(), "cell1, #1").toBe("col2");
    expect(rendredRow.cells[2].getTitle(), "cell2, #1").toBe("");
    const row = question.visibleRows[0];
    row.cells[0].question.title = "Custom title 1";
    row.cells[1].question.title = "Custom title 2";
    row.cells[2].question.title = "Custom title 3";
    expect(rendredRow.cells[0].getTitle(), "cell0, #2").toBe("true hint");
    expect(rendredRow.cells[1].getTitle(), "cell1, #2").toBe("Custom title 2");
    expect(rendredRow.cells[2].getTitle(), "cell2, #2").toBe("");
  });
  test("matrixdropdowncolumn renderAs property", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "matrixdynamic", name: "q1",
              columns: [
                { name: "col1", cellType: "dropdown" },
              ]
            }]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    matrix.columns[0].renderAs = "myRender";
    expect(matrix.columns[0].templateQuestion.renderAs, "Apply render as to template question").toBe("myRender");
  });
  test("Summary doesn't work correctly if there is invisible column and clearInvisibleValues: 'onHiddenContainer'", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
              inputType: "number",
            },
            {
              name: "col2",
              cellType: "text",
              totalType: "sum",
              inputType: "number",
            },
            {
              name: "col_sum",
              cellType: "expression",
              totalType: "sum",
              expression: "{row.col1}+{row.col2}",
            },
            {
              name: "col3",
              cellType: "boolean",
              visibleIf: "false",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
      clearInvisibleValues: "onHiddenContainer"
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    const rows = matrix.visibleRows;
    expect(rows.length, "two rows").toBe(2);
    expect(rows[0].cells.length, "row[0].cells.length = 4").toBe(4);
    expect(rows[1].cells.length, "row[1].cells.length = 4").toBe(4);
    matrix.visibleRows[0].cells[0].question.value = 1;
    matrix.visibleRows[0].cells[1].question.value = 2;
    matrix.visibleRows[1].cells[0].question.value = 3;
    matrix.visibleRows[1].cells[1].question.value = 4;
    expect(matrix.visibleTotalRow.cells.length, "There are 4 cells").toBe(4);
    expect(matrix.visibleTotalRow.cells[2].value, "summary calculated correctly").toBe(1 + 2 + 3 + 4);
  });
  test("Set empty string to expression with empty total type", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "col1",
        },
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              cellType: "text"
            },
            {
              name: "col2",
              cellType: "text",
              totalType: "sum"
            },
          ]
        },
      ]
    });
    const q = survey.getQuestionByName("col1");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    q.value = "1";
    expect(matrix.visibleTotalRow.cells[0].value, "summary for first column is empty").toBeFalsy();
    expect(survey.data, "matrix is empty").toEqualValues({ col1: "1", "matrix-total": { col2: 0 } });
  });
  test("Get choices from matrix for default column type", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix1",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              choices: [1, 2]
            }
          ],
          choices: ["item1", "item2", "item3"]
        },
        {
          type: "matrixdynamic",
          name: "matrix2",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [1, 2]
            }
          ]
        }
      ]
    });
    const matrix1 = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    const cellQuestion1 = <QuestionDropdownModel>matrix1.visibleRows[0].cells[0].question;
    expect(matrix1.columns[0].cellType, "Set correct celltype").toBe("dropdown");
    expect(cellQuestion1.getType(), "Set correct question type").toBe("dropdown");
    expect(cellQuestion1.choices.length, "Take choices from column choices").toBe(2);
    expect(cellQuestion1.choices[0].value, "First choice is correct").toBe(1);
    const matrix2 = <QuestionMatrixDynamicModel>survey.getAllQuestions()[1];
    const cellQuestion2 = <QuestionDropdownModel>matrix2.visibleRows[0].cells[0].question;
    expect(cellQuestion2.choices.length, "Take choices from matrix choices, #2").toBe(2);
    expect(cellQuestion2.choices[0].value, "First choice is correct, #2").toBe(1);
  });
  test("Serialize default column type correctly", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix1",
          cellType: "rating",
          columns: [
            {
              name: "col1",
              cellType: "rating",
              rateMax: 10
            }
          ],
        },
        {
          type: "matrixdynamic",
          name: "matrix2",
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [1, 2]
            }
          ]
        }
      ]
    });

    const matrix1 = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    expect(matrix1.columns[0].rateMax, "rateMax loaded correctly").toBe(10);
    matrix1.columns[0].cellType = "default";
    expect(matrix1.toJSON(), "There is no rateMax").toEqualValues({
      name: "matrix1",
      cellType: "rating",
      columns: [{ name: "col1" }]
    });
    const matrix2 = <QuestionMatrixDynamicModel>survey.getAllQuestions()[1];
    expect(matrix2.columns[0].choices.length, "choices loaded correctly").toBe(2);
    matrix2.columns[0].cellType = "default";
    expect(matrix2.toJSON(), "There is no choices").toEqualValues({
      name: "matrix2",
      columns: [{ name: "col1" }]
    });
  });
  test("Change column cellType to 'rating', Bug#9853", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix1",
          columns: [
            {
              name: "col1",
            }
          ],
        }
      ]
    });

    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    const column = matrix.columns[0];
    expect(column.name, "column.name #1").toBe("col1");
    column.name = "col2";
    column.cellType = "rating";
    expect(column.name, "column.name #2").toBe("col2");
  });
  test("Test property hideIfRowsEmpty for matrix dropdown", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var question = new QuestionMatrixDropdownModel("q1");
    page.addQuestion(question);
    expect(question.isVisible, "By default it is visible").toBe(true);
    question.hideIfRowsEmpty = true;
    expect(question.isVisible, "Rows are empty").toBe(false);
    question.rows = [1, 2, 3];
    expect(question.isVisible, "Rows are not empty").toBe(true);
    question.rowsVisibleIf = "{item} = {val1}";
    expect(question.isVisible, "Filtered rows are empty").toBe(false);
    survey.setValue("val1", 2);
    expect(question.isVisible, "There is one visible item").toBe(true);
  });
  test("Test property hideIfRowsEmpty for matrix dropdown on loading, Bug#8824", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "matrixdropdown", name: "matrix", rowsVisibleIf: "{q1} != 'a'",
          columns: [{ name: "col1", cellType: "text" }],
          rows: ["row1", "row2"], hideIfRowsEmpty: true
        }
      ]
    });
    const matrix = survey.getQuestionByName("matrix");
    expect(matrix.getPropertyValue("isVisible"), "#1").toBe(true);
    survey.setValue("q1", "a");
    expect(matrix.getPropertyValue("isVisible"), "#2").toBe(false);
    survey.setValue("q1", "aa");
    expect(matrix.getPropertyValue("isVisible"), "#3").toBe(true);
  });

  test("Load old JSON where columns without cellType set correctly", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              choices: ["a", "b", "c", "d"]
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const colQuestion = matrix.columns[0].templateQuestion;
    expect(colQuestion.getType(), "template is dropdown").toBe("dropdown");
    expect(colQuestion.choices.length, "template has 4 choices").toEqualValues(4);
    expect(colQuestion.choices[2].value, "template has correct choices").toBe("c");
    const rows = matrix.visibleRows;
    const cellQuestion = rows[0].cells[0].question;
    expect(cellQuestion.getType(), "update the cell type").toBe("dropdown");
    expect(cellQuestion.choices.length, "load 4 choices").toEqualValues(4);
    expect(cellQuestion.choices[2].value, "load choices correctly").toBe("c");
  });
  test("Vertical column layout & allowRowReorder, rendered table", () => {
    var survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "allowRowReorder": true,
          transposeData: true,
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "text", name: "col2" },
          ],
          "rowCount": 2
        }
      ]
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.isRowsDragAndDrop, "vertical column layout").toBe(false);
    matrix.transposeData = false;
    expect(matrix.renderedTable.isRowsDragAndDrop, "horizontal column layout").toBe(true);
    matrix.onPointerDown(<any>undefined, <any>undefined);
  });

  test("Update expressions on setting matrixdropdown rows, Bug#5526", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "matrix",
          columns: [
            { cellType: "text", name: "col1", totalType: "sum" },
            { cellType: "text", name: "col2" },
            { cellType: "expression", name: "col3", expression: "{row.col1} + {row.col2}", totalType: "sum" },
          ],
          rows: ["row1", "row2"]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    expect(2, "2 rows").toBe(rows.length);
    rows[0].cells[0].value = 1;
    rows[0].cells[1].value = 2;
    rows[1].cells[0].value = 3;
    rows[1].cells[1].value = 4;
    expect(survey.data, "#1").toEqualValues({
      matrix: {
        row1: { col1: 1, col2: 2, col3: 3, },
        row2: { col1: 3, col2: 4, col3: 7 }
      },
      "matrix-total": { col1: 4, col3: 10 }
    });
    matrix.rows = ["row1"];
    expect(survey.data, "#2").toEqualValues({
      matrix: { row1: { col1: 1, col2: 2, col3: 3, } },
      "matrix-total": { col1: 1, col3: 3 }
    });
  });

  test("Carry forward in matrix cells", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          columns: [
            { cellType: "checkbox", name: "col1", choices: [1, 2, 3, 4, 5] },
            { cellType: "dropdown", name: "col2", choicesFromQuestion: "row.col1", choicesFromQuestionMode: "selected" }
          ],
          rowCount: 1
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    const cellQ1 = rows[0].cells[0].question;
    const cellQ2 = <QuestionDropdownModel>rows[0].cells[1].question;
    expect("col1", "col1 question is correct").toBe(cellQ1.name);
    expect("col2", "col2 question is correct").toBe(cellQ2.name);
    expect(cellQ2.choicesFromQuestion, "choicesFromQuestion is loaded").toBe("row.col1");
    expect(cellQ2.choicesFromQuestionMode, "choicesFromQuestionMode is loaded").toBe("selected");
    expect(cellQ2.visibleChoices.length, "There is no visible choices").toBe(0);
    cellQ1.value = [1, 3, 5];
    expect(cellQ2.visibleChoices.length, "Choices are here").toBe(3);
    expect(cellQ2.visibleChoices[1].value, "A choice value is correct").toBe(3);
  });
  test("Doesn't update value correctly for nested matrix with expressions, bug#5549", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
              isRequired: true,
              inputType: "number",
            },
            {
              name: "col2",
              cellType: "expression",
              expression: "{row.col1} + 10"
            }
          ],
          rowCount: 1,
        }
      ]
    });
    let questionValue;
    survey.onValueChanged.add((sender, options) => {
      questionValue = options.value;
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const cell = matrix.visibleRows[0].cells[0].question;
    cell.value = 10;
    expect(matrix.value, "matrix question value").toEqualValues([{ col1: 10, col2: 20 }]);
    expect(matrix.value, "event options.value").toEqualValues([{ col1: 10, col2: 20 }]);
    expect(survey.data, "survey.data").toEqualValues({ matrix: [{ col1: 10, col2: 20 }] });
  });
  test("Matrix calls survey.onValueChanged before making expression calculation, Bug#10094", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "a",
            },
            {
              name: "b",
            },
            {
              name: "c",
              cellType: "expression",
              expression: "{row.a} + {row.b}",
            },
          ],
          cellType: "text",
          rowCount: 1,
        }
      ]
    });
    let questionValue;
    survey.onValueChanged.add((sender, options) => {
      questionValue = options.value;
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const row = matrix.visibleRows[0];
    row.getQuestionByName("a").value = 10;
    expect(questionValue, "onValueChanged options.value after setting a").toEqualValues([{ a: 10, c: 10 }]);
    row.getQuestionByName("b").value = 20;
    expect(questionValue, "onValueChanged options.value after setting b").toEqualValues([{ a: 10, b: 20, c: 30 }]);
  });
  test("Do not run total expressions if matrix is read-only, bug#5644", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          defaultValue: 1
        },
        {
          type: "text",
          name: "q2",
          defaultValue: 2
        },
        {
          type: "matrixdynamic",
          name: "matrix",
          readOnly: true,
          columns: [
            {
              name: "col1",
              cellType: "text",
              inputType: "number",
              defaultValue: 1,
              totalExpression: "{q1} + {q2}"
            },
            {
              name: "col2",
              cellType: "expression",
              expression: "{row.col1} + 10"
            }
          ],
          rowCount: 1,
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const expQuestion = matrix.visibleRows[0].cells[1].question;
    const totalQuestion = matrix.visibleTotalRow.cells[0].question;
    expect(expQuestion.isReadOnly, "Expression question is readOnly").toBe(true);
    expect(expQuestion.isEmpty(), "Expression question is empty").toBe(true);
    expect(totalQuestion.isReadOnly, "Total Expression question is readOnly").toBe(false);
    expect(totalQuestion.isEmpty(), "Total Expression question is empty").toBe(false);
    expect(survey.data, "Data set in survey correctly.").toEqualValues({
      q1: 1, q2: 2, "matrix-total": { col1: 3 },
      "matrix": [{ "col1": 1 }]
    });
  });
  test("Check rightIndents set correctly for detailElements with defaultV2 theme - 5988", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          detailPanelShowOnAdding: true,
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", startWithNewLine: false, visibleIf: "{row.q1} notempty" }],
        },
      ],
    });
    survey.css = { root: "sd-root-modern" };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.visibleRows[0].showHideDetailPanelClick();
    expect(matrix.renderedTable.rows[2].cells[1].panel.elements[0].rightIndent).toBe(0);
    survey.css.root = undefined;
  });

  test("matrixDragHandleArea = 'icon'", () => {
    const survey = new SurveyModel({
      matrixDragHandleArea: "icon",
      elements: [
        {
          type: "matrixdynamic",
          allowRowReorder: "true",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRow",
          detailPanelShowOnAdding: true,
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", startWithNewLine: false, visibleIf: "{row.q1} notempty" }],
        },
      ],
    });
    survey.css = { root: "sd-root-modern" };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    let nodeMock = document.createElement("div");
    expect(matrix.isDragHandleAreaValid(nodeMock)).toBe(false);

    nodeMock.classList.add("some-class");
    expect(matrix.isDragHandleAreaValid(nodeMock)).toBe(false);

    nodeMock.classList.add(matrix.cssClasses.dragElementDecorator);
    expect(matrix.isDragHandleAreaValid(nodeMock)).toBe(true);

    survey.matrixDragHandleArea = "entireItem";

    nodeMock.classList.remove(matrix.cssClasses.dragElementDecorator);
    expect(matrix.isDragHandleAreaValid(nodeMock)).toBe(true);

    nodeMock.remove();
    survey.css.root = undefined;
  });
  test("column validation, bug#6449", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "age"
        },
        {
          "type": "matrixdropdown",
          "name": "matrix",
          "columns": [
            {
              "name": "col1",
              "cellType": "text",
              "validators": [
                {
                  "type": "expression",
                  "expression": "{row.col1} < {age}"
                }
              ]
            }
          ],
          "rows": ["Row1"]
        }]
    });
    survey.setValue("age", 50);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    const cellQuestion = matrix.visibleRows[0].cells[0].question;
    expect(cellQuestion.name, "question is correct").toBe("col1");
    cellQuestion.value = 51;
    expect(survey.validate(), "51<50").toBe(false);
    cellQuestion.value = 41;
    expect(survey.validate(), "41<50").toBe(true);
  });
  test("matrixDynamic & defaultValueExpression", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix", rowCount: 1,
          columns: [{ name: "col1", cellType: "text", defaultValueExpression: "1 + 1" }, { name: "col2" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "one row").toBe(1);
    expect(q.value, "matrix.data").toEqualValues([{ col1: 2 }]);
    expect(survey.data, "survey.data").toEqualValues({ matrix: [{ col1: 2 }] });
  });

  test("Errors: matrixdropdown", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown", name: "matrix",
          rows: ["Row1", "Row2"],
          choices: ["Item1"],
          columns: [{ name: "col1", isRequired: true }, { name: "col2", isRequired: true }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "two rows").toBe(2);
    const table = q.renderedTable;
    expect(table.rows.length, "2 rows + 2 error rows").toBe(4);

    expect(table.rows[0].isErrorsRow).toBe(true);
    expect(table.rows[1].isErrorsRow).toBe(false);
    expect(table.rows[2].isErrorsRow).toBe(true);
    expect(table.rows[3].isErrorsRow).toBe(false);

    expect(table.rows[0].visible).toBe(false);
    expect(table.rows[0].cells.length).toBe(3);
    expect(table.rows[0].cells[0].isEmpty).toBe(true);
    expect(table.rows[0].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[1].question).toBe(table.rows[1].cells[1].question);
    expect(table.rows[0].cells[2].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[2].question).toBe(table.rows[1].cells[2].question);

    survey.tryComplete();
    expect(table.rows[0].visible).toBe(true);
    expect(table.rows[2].visible).toBe(true);
    table.rows[1].cells[1].question.value = "Item1";
    expect(table.rows[0].visible).toBe(true);
    expect(table.rows[2].visible).toBe(true);
    table.rows[1].cells[2].question.value = "Item1";
    expect(table.rows[0].visible).toBe(false);
    expect(table.rows[2].visible).toBe(true);
    table.rows[3].cells[1].question.value = "Item1";
    expect(table.rows[0].visible).toBe(false);
    expect(table.rows[2].visible).toBe(true);
    table.rows[3].cells[2].question.value = "Item1";
    expect(table.rows[0].visible).toBe(false);
    expect(table.rows[2].visible).toBe(false);
  });

  test("Errors: matrixdynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          rowCount: 3,
          columns: [{ name: "col1" }, { name: "col2" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "3 rows").toBe(3);
    const table = q.renderedTable;
    expect(table.rows.length, "3 rows + 3 error rows").toBe(6);

    expect(table.rows[0].isErrorsRow).toBe(true);
    expect(table.rows[1].isErrorsRow).toBe(false);
    expect(table.rows[2].isErrorsRow).toBe(true);
    expect(table.rows[3].isErrorsRow).toBe(false);
    expect(table.rows[4].isErrorsRow).toBe(true);
    expect(table.rows[5].isErrorsRow).toBe(false);

    expect(table.rows[0].cells.length).toBe(3);
    expect(table.rows[0].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[2].isEmpty).toBe(true);

    const rowId0 = table.rows[1].id;
    const rowId2 = table.rows[5].id;

    q.removeRow(1);
    expect(table.rows.length, "2 rows + 2 error rows").toBe(4);

    expect(table.rows[1].id).toBe(rowId0);
    expect(table.rows[3].id).toBe(rowId2);

    expect(table.rows[0].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[0].question).toBe(table.rows[1].cells[0].question);
    expect(table.rows[2].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[2].cells[0].question).toBe(table.rows[3].cells[0].question);

    q.addRow();
    expect(table.rows.length, "3 rows + 3 error rows").toBe(6);

    expect(table.rows[1].id).toBe(rowId0);
    expect(table.rows[3].id).toBe(rowId2);

    expect(table.rows[0].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[0].question).toBe(table.rows[1].cells[0].question);
    expect(table.rows[2].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[2].cells[0].question).toBe(table.rows[3].cells[0].question);

    expect(table.rows[5].row).toBe(q.visibleRows[2]);
    expect(table.rows[4].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[4].cells[0].question).toBe(table.rows[5].cells[0].question);
  });

  test("Errors: matrixdynamic + errors location bottom", () => {
    const survey = new SurveyModel({
      questionErrorLocation: "bottom",
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          rowCount: 3,
          columns: [{ name: "col1" }, { name: "col2" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "3 rows").toBe(3);
    const table = q.renderedTable;
    expect(table.rows.length, "3 rows + 3 error rows").toBe(6);

    expect(table.rows[0].isErrorsRow).toBe(false);
    expect(table.rows[1].isErrorsRow).toBe(true);
    expect(table.rows[2].isErrorsRow).toBe(false);
    expect(table.rows[3].isErrorsRow).toBe(true);
    expect(table.rows[4].isErrorsRow).toBe(false);
    expect(table.rows[5].isErrorsRow).toBe(true);

    expect(table.rows[1].cells.length).toBe(3);
    expect(table.rows[1].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[1].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[1].cells[2].isEmpty).toBe(true);

    const rowId0 = table.rows[0].id;
    const rowId2 = table.rows[4].id;

    q.removeRow(1);
    expect(table.rows.length, "2 rows + 2 error rows").toBe(4);

    expect(table.rows[0].id).toBe(rowId0);
    expect(table.rows[2].id).toBe(rowId2);

    expect(table.rows[1].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[1].cells[0].question).toBe(table.rows[0].cells[0].question);
    expect(table.rows[3].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[3].cells[0].question).toBe(table.rows[2].cells[0].question);

    q.addRow();
    expect(table.rows.length, "3 rows + 3 error rows").toBe(6);

    expect(table.rows[0].id).toBe(rowId0);
    expect(table.rows[2].id).toBe(rowId2);

    expect(table.rows[1].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[1].cells[0].question).toBe(table.rows[0].cells[0].question);
    expect(table.rows[3].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[3].cells[0].question).toBe(table.rows[2].cells[0].question);

    expect(table.rows[4].row).toBe(q.visibleRows[2]);
    expect(table.rows[5].cells[0].isErrorsCell).toBe(true);
    expect(table.rows[5].cells[0].question).toBe(table.rows[4].cells[0].question);
  });

  test("Errors: matrixdynamic + showDetailPanel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          rowCount: 3,
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "q1" }],
          columns: [{ name: "col1" }, { name: "col2" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "3 rows").toBe(3);
    const table = q.renderedTable;
    q.visibleRows[1].showDetailPanel();
    expect(table.rows.length, "3 rows + 3 error rows + detail panel").toBe(7);

    expect(table.rows[0].isErrorsRow).toBe(true);
    expect(table.rows[1].isErrorsRow || table.rows[1].isDetailRow).toBe(false);
    expect(table.rows[2].isErrorsRow).toBe(true);
    expect(table.rows[3].isErrorsRow || table.rows[3].isDetailRow).toBe(false);
    expect(table.rows[4].isDetailRow).toBe(true);
    expect(table.rows[5].isErrorsRow).toBe(true);
    expect(table.rows[6].isErrorsRow || table.rows[6].isDetailRow).toBe(false);

    q.visibleRows[1].hideDetailPanel();

    expect(table.rows.length, "3 rows + 3 error rows").toBe(6);

    expect(table.rows[0].isErrorsRow).toBe(true);
    expect(table.rows[1].isErrorsRow || table.rows[1].isDetailRow).toBe(false);
    expect(table.rows[2].isErrorsRow).toBe(true);
    expect(table.rows[3].isErrorsRow || table.rows[3].isDetailRow).toBe(false);
    expect(table.rows[4].isErrorsRow).toBe(true);
    expect(table.rows[1].isErrorsRow || table.rows[1].isDetailRow).toBe(false);

    q.visibleRows[1].showDetailPanel();

    const rowId0 = table.rows[1].id;
    const rowId2 = table.rows[5].id;

    q.removeRow(1);
    expect(table.rows.length, "2 rows + 2 error rows").toBe(4);

    expect(table.rows[1].id).toBe(rowId0);
    expect(table.rows[2].id).toBe(rowId2);

    expect(table.rows[0].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[1].question).toBe(table.rows[1].cells[1].question);
    expect(table.rows[2].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[2].cells[1].question).toBe(table.rows[3].cells[1].question);
  });

  test("Errors: matrixdynamic + showDetailPanel + errors bottom", () => {
    const survey = new SurveyModel({
      questionErrorLocation: "bottom",
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          rowCount: 3,
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "q1" }],
          columns: [{ name: "col1" }, { name: "col2" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "3 rows").toBe(3);
    const table = q.renderedTable;
    q.visibleRows[1].showDetailPanel();
    expect(table.rows.length, "3 rows + 3 error rows + detail panel").toBe(7);

    expect(table.rows[0].isErrorsRow || table.rows[0].isDetailRow).toBe(false);
    expect(table.rows[1].isErrorsRow).toBe(true);
    expect(table.rows[2].isErrorsRow || table.rows[2].isDetailRow).toBe(false);
    expect(table.rows[3].isErrorsRow).toBe(true);
    expect(table.rows[4].isDetailRow).toBe(true);
    expect(table.rows[5].isErrorsRow || table.rows[5].isDetailRow).toBe(false);
    expect(table.rows[6].isErrorsRow).toBe(true);

    q.visibleRows[1].hideDetailPanel();

    expect(table.rows.length, "3 rows + 3 error rows").toBe(6);

    expect(table.rows[0].isErrorsRow || table.rows[0].isDetailRow).toBe(false);
    expect(table.rows[1].isErrorsRow).toBe(true);
    expect(table.rows[2].isErrorsRow || table.rows[2].isDetailRow).toBe(false);
    expect(table.rows[3].isErrorsRow).toBe(true);
    expect(table.rows[4].isErrorsRow || table.rows[4].isDetailRow).toBe(false);
    expect(table.rows[5].isErrorsRow).toBe(true);

    q.visibleRows[1].showDetailPanel();

    const rowId0 = table.rows[0].id;
    const rowId2 = table.rows[5].id;

    q.removeRow(1);
    expect(table.rows.length, "2 rows + 2 error rows").toBe(4);

    expect(table.rows[0].id).toBe(rowId0);
    expect(table.rows[2].id).toBe(rowId2);

    expect(table.rows[1].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[1].cells[1].question).toBe(table.rows[0].cells[1].question);
    expect(table.rows[3].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[3].cells[1].question).toBe(table.rows[2].cells[1].question);
  });

  test("Errors: matrixdynamic + vertical columns", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 3,
          transposeData: true,
          columns: [{ name: "col1" }, { name: "col2" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "3 rows").toBe(3);
    const table = q.renderedTable;
    expect(table.rows.length, "2 rows + 2 error rows + actions").toBe(5);

    expect(table.rows[0].isErrorsRow).toBe(true);
    expect(table.rows[1].isErrorsRow).toBe(false);
    expect(table.rows[2].isErrorsRow).toBe(true);
    expect(table.rows[3].isErrorsRow).toBe(false);

    expect(table.rows[0].cells.length).toBe(4);
    expect(table.rows[0].cells[0].isEmpty).toBe(true);
    expect(table.rows[0].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[1].question).toBe(table.rows[1].cells[1].question);
    expect(table.rows[0].cells[2].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[2].question).toBe(table.rows[1].cells[2].question);
    expect(table.rows[0].cells[3].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[3].question).toBe(table.rows[1].cells[3].question);
  });

  test("Errors: matrixdropdown + show in multiple columns", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          rows: ["row1"],
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              showInMultipleColumns: true,
              choices: ["Item1", "Item2"]
            },
            {
              name: "col2"
            }
          ]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "3 rows").toBe(1);
    const table = q.renderedTable;
    expect(table.rows.length, "1 row + error row").toBe(2);

    expect(table.rows[0].isErrorsRow).toBe(true);
    expect(table.rows[1].isErrorsRow).toBe(false);

    expect(table.rows[0].cells.length).toBe(4);
    expect(table.rows[0].cells[0].isEmpty).toBe(true);
    expect(table.rows[0].cells[1].isErrorsCell, "error only for first choice").toBe(true);
    expect(table.rows[0].cells[1].question).toBe(table.rows[1].cells[1].question);
    expect(table.rows[0].cells[2].isEmpty, "there is no error for second choice").toBe(true);
    expect(table.rows[0].cells[3].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[3].question).toBe(table.rows[1].cells[3].question);
  });

  test("Errors: matrixdynamic + show in multiple columns + vertical layout", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          rows: ["row1"],
          transposeData: true,
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              showInMultipleColumns: true,
              choices: ["Item1", "Item2"]
            },
            {
              name: "col2"
            }
          ]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.visibleRows.length, "3 rows").toBe(1);
    const table = q.renderedTable;
    expect(table.rows.length, "1 row + error row").toBe(6);

    expect(table.rows[0].isErrorsRow).toBe(true);
    expect(table.rows[1].isErrorsRow).toBe(false);
    expect(table.rows[2].isErrorsRow).toBe(true);
    expect(table.rows[3].isErrorsRow).toBe(false);
    expect(table.rows[4].isErrorsRow).toBe(true);
    expect(table.rows[5].isErrorsRow).toBe(false);

    expect(table.rows[0].cells.length).toBe(2);
    expect(table.rows[0].cells[0].isEmpty).toBe(true);
    expect(table.rows[0].cells[1].isErrorsCell, "error only for first choice").toBe(true);
    expect(table.rows[0].cells[1].question).toBe(table.rows[1].cells[1].question);

    expect(table.rows[2].cells.length).toBe(2);
    expect(table.rows[2].cells[0].isEmpty).toBe(true);
    expect(table.rows[2].cells[1].isEmpty, "there is not error for second choice").toBe(true);

    expect(table.rows[4].cells.length).toBe(2);
    expect(table.rows[4].cells[0].isEmpty).toBe(true);
    expect(table.rows[4].cells[1].isErrorsCell, "error for col2").toBe(true);
    expect(table.rows[4].cells[1].question).toBe(table.rows[5].cells[1].question);
  });

  test("transposeData property", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          rows: ["row1"],
          transposeData: true,
          columns: [
            {
              name: "col1",
            }
          ]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.transposeData, "transposeData #1").toBe(true);
    q.columnLayout = "horizontal";
    expect(q.transposeData, "transposeData #2").toBe(false);
    q.transposeData = true;
    expect(q.columnLayout, "columnsLayout #1").toBe("vertical");
    expect(q.isColumnLayoutHorizontal, "isColumnLayoutHorizontal #1").toBe(false);
    q.transposeData = false;
    expect(q.columnLayout, "columnsLayout #2").toBe("horizontal");
    expect(q.isColumnLayoutHorizontal, "isColumnLayoutHorizontal #2").toBe(true);
    q.transposeData = true;
    const json1 = q.toJSON();
    const json2 = q.toJSON({ version: "1.9.129" });
    expect(json1.transposeData, "json #1").toBe(true);
    expect(json1.columnLayout, "json #2").toBeFalsy();
    expect(json2.transposeData, "json #3").toBeFalsy();
    expect(json2.columnLayout, "json #4").toBe("vertical");
  });

  test("transposeData property load from json", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          rows: ["row1"],
          transposeData: true,
          columns: [
            {
              name: "col1",
            }
          ]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(q.transposeData, "transposeData #1").toBe(true);
    expect(q.columnLayout, "columnsLayout #1").toBe("vertical");
  });

  test("Errors: matrixdropdown + mobile mode", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown", name: "matrix",
          rows: ["Row1", "Row2"],
          choices: ["Item1"],
          columns: [{ name: "col1", isRequired: true }, { name: "col2", isRequired: true }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    q.isMobile = true;
    expect(q.visibleRows.length, "two rows").toBe(2);
    const table = q.renderedTable;
    expect(table.rows.length, "2 rows").toBe(2);

    expect(table.rows[0].isErrorsRow).toBe(false);
    expect(table.rows[1].isErrorsRow).toBe(false);

    expect(table.rows[0].visible).toBe(true);
    expect(table.rows[0].cells.length, "header + 2 columns + 2 errors").toBe(5);
    expect(table.rows[0].cells[0].hasTitle).toBe(true);
    expect(table.rows[0].cells[1].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[2].hasQuestion).toBe(true);
    expect(table.rows[0].cells[3].isErrorsCell).toBe(true);
    expect(table.rows[0].cells[4].hasQuestion).toBe(true);
  });
  test("matrixdynamic.removeRow & confirmActionAsync, #6736", () => {
    const prevAsync = settings.confirmActionAsync;

    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          columns: [{ name: "col1" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    q.value = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    let f_resFunc = (res: boolean): void => { };
    settings.confirmActionAsync = (message: string, resFunc: (res: boolean) => void): boolean => {
      f_resFunc = resFunc;
      return true;
    };
    q.removeRow(1, true);
    expect(q.visibleRows.length, "We are waiting for async function").toBe(3);
    f_resFunc(false);
    expect(q.visibleRows.length, "confirm action return false").toBe(3);
    q.removeRow(1, true);
    expect(q.visibleRows.length, "We are waiting for async function, #2").toBe(3);
    f_resFunc(true);
    expect(q.visibleRows.length, "confirm action return true").toBe(2);
    expect(q.value, "Row is deleted correctly").toEqualValues([{ col1: 1 }, { col1: 3 }]);

    settings.confirmActionAsync = prevAsync;
  });
  test("matrixdynamic.removeRow & settings.confirmActionFunc, #10145", () => {
    let funcRes = false;
    settings.confirmActionFunc = (message: string): boolean => {
      return funcRes;
    };

    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          columns: [{ name: "col1" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    q.value = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    q.removeRow(1, true);
    expect(q.visibleRows.length, "confirm action return false").toBe(3);
    funcRes = true;
    q.removeRow(1, true);
    expect(q.visibleRows.length, "confirm action return true").toBe(2);
    expect(q.value, "Row is deleted correctly").toEqualValues([{ col1: 1 }, { col1: 3 }]);

    (<any>settings).confirmActionFunc = undefined;
  });
  test("matrix dynamic getPlainData", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          columns: [{ cellType: "text", name: "col1" }, { cellType: "text", name: "col2" }]
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    q.value = [{ col1: 1, col2: 2 }, { col1: 3, col2: 4 }];
    const data: any = survey.getPlainData();//["matrix"];
    const row1Name = data[0].data[0].name;
    const row1Title = data[0].data[0].title;
    const row2Name = data[0].data[1].name;
    const row2Title = data[0].data[1].title;
    expect(row1Name, "row1 name").toBe("row1");
    expect(row1Title, "row1 title").toBe("row 1");
    expect(row2Name, "row2 name").toBe("row2");
    expect(row2Title, "row2 title").toBe("row 2");
  });
  test("matrix dynamic getPlainData & comment", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          columns: [{ cellType: "text", name: "col1" }, { cellType: "text", name: "col2" }],
          showCommentArea: true
        }
      ]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    q.value = [{ col1: 1, col2: 2 }, { col1: 3, col2: 4 }];
    q.comment = "Some comments";
    const data: any = survey.getPlainData();//["matrix"];
    const qData = data[0].data;
    expect(qData.length, "There are 3 records").toBe(3);
    const row1Name = qData[0].name;
    const row1Title = qData[0].title;
    const row2Name = qData[1].name;
    const row2Title = qData[1].title;
    expect(row1Name, "row1 name").toBe("row1");
    expect(row1Title, "row1 title").toBe("row 1");
    expect(row2Name, "row2 name").toBe("row2");
    expect(row2Title, "row2 title").toBe("row 2");
    expect(qData[2].title, "comment title").toBe("Comment");
    expect(qData[2].isComment, "comment isComment").toBe(true);
  });
  test("matrix dynamic expression & checkbox ValuePropertyName", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [
            "Item 1",
            "Item 2"
          ],
          "valuePropertyName": "testItem"
        },
        {
          "type": "matrixdynamic",
          "name": "q2",
          "valueName": "q1",
          "columns": [
            {
              "name": "col1",
              "cellType": "expression",
              "expression": "{row.testItem} + ' - matrix'"
            }
          ],
          "rowCount": 0
        }
      ]
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    expect(matrix.visibleRows.length, "matrix rows #0").toBe(0);
    expect(matrix.value, "matrix is empty").toBeFalsy();
    checkbox.renderedValue = ["Item 1"];
    expect(matrix.visibleRows.length, "matrix rows #1").toBe(1);
    expect(matrix.value, "matrix value #1").toEqualValues([{ testItem: "Item 1", col1: "Item 1 - matrix" }]);
    checkbox.renderedValue = ["Item 1", "Item 2"];
    expect(matrix.visibleRows.length, "matrix rows #2").toBe(2);
    expect(matrix.value, "matrix value #2").toEqualValues([{ testItem: "Item 1", col1: "Item 1 - matrix" }, { testItem: "Item 2", col1: "Item 2 - matrix" }]);
  });
  test("matrix dynamic expression & checkbox valuePropertyName & sumInArray function", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [
            "Item 1",
            "Item 2"
          ],
          "valuePropertyName": "testItem"
        },
        {
          "type": "matrixdynamic",
          "name": "q2",
          "valueName": "q1",
          "columns": [
            {
              "name": "col1",
              "cellType": "text",
              "inputType": "text"
            }
          ],
          "rowCount": 0
        },
        {
          "type": "expression",
          "name": "q3",
          "expression": "sumInArray({q1}, 'col1')"
        }
      ]
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    const expression = survey.getQuestionByName("q3");
    checkbox.renderedValue = ["Item 1", "Item 2"];
    const rows = matrix.visibleRows;
    rows[0].getQuestionByColumnName("col1").value = 5;
    rows[1].getQuestionByColumnName("col1").value = 7;
    expect(expression.value, "Calculate values correctly").toBe(12);
  });
  test("matrix dynamic expression & checkbox valuePropertyName & displayValue function, Bug#9699", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [
            { value: 1, text: "Item 1" },
            { value: 2, text: "Item 2" },
            { value: 3, text: "Item 3" }
          ],
          "valuePropertyName": "testItem"
        },
        {
          "type": "matrixdynamic",
          "name": "q2",
          "valueName": "q1",
          "columns": [
            {
              "name": "col1",
              "cellType": "text",
              "defaultValueExpression": "displayValue('q1', {row.testItem})"
            }
          ],
          "rowCount": 0
        }
      ]
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    // const expression = survey.getQuestionByName("q3");
    checkbox.renderedValue = [1, 3];
    const rows = matrix.visibleRows;
    expect(rows.length, "There are two rows").toBe(2);
    expect(rows[0].getQuestionByColumnName("col1").value, "Row 1 value is correct").toBe("Item 1");
    expect(rows[1].getQuestionByColumnName("col1").value, "Row 2 value is correct").toBe("Item 3");
  });
  test("matrix dynamic & share data in cells & detail panel, Bug8697", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "text"
            }
          ],
          detailPanelMode: "underRow",
          detailElements: [
            {
              name: "q2",
              type: "text",
              valueName: "col1"
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const rows = matrix.visibleRows;
    rows[0].showDetailPanel();
    const col1 = rows[0].getQuestionByName("col1");
    const q2Cell = rows[0].getQuestionByName("q2");
    col1.value = "abc";
    expect(q2Cell.value, "#1").toBe("abc");
    q2Cell.value = "edf";
    expect(col1.value, "#2").toBe("edf");
    rows[1].getQuestionByName("col1").value = "123";
    rows[1].showDetailPanel();
    expect(rows[1].getQuestionByName("q2").value, "#3").toBe("123");
  });
  test("matrix dynamic detail panel & shared matrix dynamics, Bug8697", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "text"
            }
          ],
          detailPanelMode: "underRow",
          detailElements: [
            {
              name: "matrix1",
              type: "matrixdynamic",
              valueName: "data",
              columns: [{ cellType: "text", name: "col1" }]
            },
            {
              name: "matrix2",
              type: "matrixdynamic",
              valueName: "data",
              columns: [{ cellType: "text", name: "col1" }],
              rowCount: 0
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const rows = matrix.visibleRows;
    rows[0].showDetailPanel();
    const matrix1 = <QuestionMatrixDynamicModel>rows[0].getQuestionByName("matrix1");
    const matrix2 = <QuestionMatrixDynamicModel>rows[0].getQuestionByName("matrix2");
    matrix1.visibleRows[0].getQuestionByName("col1").value = "a1";
    matrix1.visibleRows[1].getQuestionByName("col1").value = "a2";
    expect(matrix2.value, "#1").toEqualValues([{ col1: "a1" }, { col1: "a2" }]);
  });
  test("matrix dynamic detail panel & checkbox valuePropertyName, Bug8697", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              choices: [1, 2, 3, 4, 5],
              valuePropertyName: "prop1"
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const rows = matrix.visibleRows;
    const checkbox = rows[0].getQuestionByName("col1");
    checkbox.renderedValue = [1, 4];
    expect(checkbox.renderedValue, "renderedValue #1").toEqualValues([1, 4]);
    expect(checkbox.value, "value #1").toEqualValues([{ prop1: 1 }, { prop1: 4 }]);
  });
  test("matrix dynamic detail panel & checkbox valuePropertyName & matrix dynamic in detail panel, Bug8697", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              choices: [1, 2, 3, 4, 5],
              valuePropertyName: "prop1"
            }
          ],
          detailPanelMode: "underRow",
          detailElements: [
            {
              name: "matrix1",
              type: "matrixdynamic",
              valueName: "col1",
              columns: [{ cellType: "text", name: "prop1" }],
              rowCount: 0
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const rows = matrix.visibleRows;
    rows[0].showDetailPanel();
    rows[0].getQuestionByName("col1").renderedValue = [1, 3, 4, 5];
    let matrix1 = <QuestionMatrixDynamicModel>rows[0].getQuestionByName("matrix1");
    expect(matrix1.value, "#1").toEqualValues([{ prop1: 1 }, { prop1: 3 }, { prop1: 4 }, { prop1: 5 }]);
    rows[1].getQuestionByName("col1").renderedValue = [3];
    rows[1].showDetailPanel();
    matrix1 = <QuestionMatrixDynamicModel>rows[1].getQuestionByName("matrix1");
    expect(matrix1.value, "#2").toEqualValues([{ prop1: 3 }]);
  });
  test("matrix dynamic & detail panel, add a new row when the last row is expanded, errorLocation: 'bottom', Bug9147", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          errorLocation: "bottom",
          columns: [
            {
              name: "col1",
              cellType: "text"
            }
          ],
          detailPanelMode: "underRow",
          detailElements: [
            {
              name: "q2",
              type: "text"
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rendredTable = matrix.renderedTable;
    const rows = matrix.visibleRows;
    rows[1].showDetailPanel();
    expect(rendredTable.rows.length, "There are 5 rows").toBe(2 * 2 + 1);
    expect(rendredTable.rows[4].isDetailRow, "The last row is a detail row").toBe(true);
    matrix.addRow();
    expect(rendredTable.rows.length, "There are 7 rows").toBe(3 * 2 + 1);
    expect(rendredTable.rows[4].isDetailRow, "The 5th row is a detail row").toBe(true);
    expect(rendredTable.rows[5].cells[1].question.name, "The 6th row is a data row").toBe("col1");
    expect(rendredTable.rows[5].isDetailRow, "The 6th row is not a detail row").toBe(false);
    expect(rendredTable.rows[6].isErrorsRow, "The 7th row is an error row").toBe(true);
    expect(rendredTable.rows[6].isDetailRow, "The 7th row is not a detail row").toBe(false);
  });
  test("Do not create rendredTable for dispose matrix", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          errorLocation: "bottom",
          columns: [
            {
              name: "col1",
              cellType: "text"
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    survey.dispose();
    expect(matrix.renderedTable, "There is no rendered table").toBeUndefined();
  });
  test("matrix dynamic & detail panel, add a new row when the last row is expanded, errorLocation: 'top' (default), Bug9147", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text"
            }
          ],
          detailPanelMode: "underRow",
          detailElements: [
            {
              name: "q2",
              type: "text"
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rendredTable = matrix.renderedTable;
    const rows = matrix.visibleRows;
    rows[1].showDetailPanel();
    expect(rendredTable.rows.length, "There are 5 rows").toBe(2 * 2 + 1);
    expect(rendredTable.rows[4].isDetailRow, "The last row is a detail row").toBe(true);
    matrix.addRow();
    expect(rendredTable.rows.length, "There are 7 rows").toBe(3 * 2 + 1);
    expect(rendredTable.rows[4].isDetailRow, "The 5th row is a detail row").toBe(true);
    expect(rendredTable.rows[5].isErrorsRow, "The 6th row is an error row").toBe(true);
    expect(rendredTable.rows[6].isDetailRow, "The 7th row is not a detail row").toBe(false);
    expect(rendredTable.rows[6].cells[1].question.name, "The 7th row is a data row").toBe("col1");
  });
  test("Totals alingment", () => {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "matrixdynamic",
              name: "question1",
              title: "Select Your Coffee",
              columns: [
                {
                  name: "coffee",
                  title: "Coffee",
                  cellType: "dropdown",
                  isRequired: true,
                  isUnique: true,
                  choices: [
                    {
                      value: "espresso",
                      text: "Espresso",
                    },
                    {
                      value: "ristretto",
                      text: "Ristretto",
                    },
                    {
                      value: "macchiato",
                      text: "Macchiato",
                    },
                  ],
                  storeOthersAsComment: true,
                },
                {
                  name: "price",
                  title: "Price",
                  cellType: "expression",
                  expression:
                  "iif({row.coffee} = 'ristretto' or {row.coffee} = 'macchiato' or {row.coffee} = 'cappuchino', '2.5', iif({row.coffee} = 'flatWhite' or {row.coffee} = 'latte', 3, 2))\n",
                },
                {
                  name: "amount",
                  title: "Num of Items",
                  cellType: "dropdown",
                  totalType: "sum",
                  choicesMin: 1,
                  choicesMax: 10,
                },
                {
                  name: "totalPerRow",
                  title: "Total",
                  cellType: "expression",
                  totalType: "sum",
                  totalDisplayStyle: "currency",
                  totalAlignment: "center",
                  expression: "{row.price} * {row.amount}",
                },
              ],
              rowCount: 1,
              maxRowCount: 6,
              defaultRowValue: {
                coffeeItem: "2",
                coffee: "espresso",
                price: 2,
                amount: 1,
                totalPerRow: 2,
              },
              addRowButtonLocation: "topBottom",
              addRowText: "Add Coffee",
            },
          ],
        },
      ],
    };

    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("question1")
  );
    question.cssClassesValue.cellQuestionWrapper = "sd-table__question-wrapper";
    var renderedTable = question.renderedTable;
    expect(renderedTable.footerRow.cells[1].cellQuestionWrapperClassName).toBe("sd-table__question-wrapper sd-table__question-wrapper--auto");
    expect(renderedTable.footerRow.cells[2].cellQuestionWrapperClassName).toBe("sd-table__question-wrapper sd-table__question-wrapper--expression sd-table__question-wrapper--left");
    expect(renderedTable.footerRow.cells[3].cellQuestionWrapperClassName).toBe("sd-table__question-wrapper sd-table__question-wrapper--expression sd-table__question-wrapper--center");
  });
  test("lockedRowCount property", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          allowRowReorder: true,
          rowCount: 4,
          columns: ["col1"]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.lockedRowCount = 2;
    const rows = matrix.visibleRows;
    expect(matrix.canRemoveRow(rows[0]), "canRemoveRow, row#0").toBe(false);
    expect(matrix.canRemoveRow(rows[1]), "canRemoveRow, row#1").toBe(false);
    expect(matrix.canRemoveRow(rows[2]), "canRemoveRow, row#2").toBe(true);
    expect(matrix.canRemoveRow(rows[3]), "canRemoveRow, row#3").toBe(true);

    const table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Drag handler cell + one column + actions cell").toBe(3);
    expect(table.rows[1].cells[0].isDragHandlerCell, "isDragHandlerCell, row#1").toBe(false);
    expect(table.rows[3].cells[0].isDragHandlerCell, "isDragHandlerCell, row#2").toBe(false);
    expect(table.rows[5].cells[0].isDragHandlerCell, "isDragHandlerCell, row#3").toBe(true);
    expect(table.rows[7].cells[0].isDragHandlerCell, "isDragHandlerCell, row#4").toBe(true);
    expect(table.rows[1].cells[0].isEmpty, "isEmpty, row#1").toBe(true);
    expect(table.rows[3].cells[0].isEmpty, "isEmpty, row#2").toBe(true);
    expect(table.rows[5].cells[0].isEmpty, "isEmpty, row#3").toBe(false);
    expect(table.rows[7].cells[0].isEmpty, "isEmpty, row#4").toBe(false);
  });
  test("Do not re-create rows on changing allowRowReorder property", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          defaultValue: [{ col1: 1 }, { col1: 2 }],
          columns: ["col1"]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const visibleRows = matrix.visibleRows;
    matrix.allowRowReorder = true;
    expect(visibleRows[0].id, "#1").toBe(matrix.visibleRows[0].id);
    matrix.allowRowReorder = false;
    expect(visibleRows[0].id, "#2").toBe(matrix.visibleRows[0].id);
  });

  test("table: check renderedRows", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          columns: ["col1"]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const renderedTable = matrix.renderedTable;
    expect(renderedTable.renderedRows.length).toBe(4);
    expect(renderedTable.renderedRows).toEqualValues(renderedTable.rows);
    matrix.addRow();
    expect(renderedTable.rows.length).toBe(6);
    expect(renderedTable.renderedRows.length).toBe(6);
    matrix.removeRow(2);
    expect(renderedTable.rows.length).toBe(4);
    expect(renderedTable.renderedRows.length).toBe(4);
  });

  test("table: check animation options", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          columns: ["col1"]
        }
      ]
    });
    survey.css = {
      "matrixdynamic": {
        rowEnter: "enter",
        rowLeave: "leave",
      }
    };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const renderedTable = matrix.renderedTable;
    expect(renderedTable["renderedRowsAnimation"] instanceof AnimationGroup).toBeTruthy();
    const options = renderedTable["getRenderedRowsAnimationOptions"]();
    const tableHtmlElement = document.createElement("table");
    const rowHtmlElement = document.createElement("tr");
    const cellHtmlElement = document.createElement("td");
    const questionHtmlElement = document.createElement("div");
    cellHtmlElement.appendChild(questionHtmlElement);
    rowHtmlElement.appendChild(cellHtmlElement);
    tableHtmlElement.appendChild(rowHtmlElement);
    document.body.appendChild(tableHtmlElement);
    // jsdom returns 0 for offsetHeight; stub it so vertical-animation hooks
    // (prepareElementForVerticalAnimation -> el.offsetHeight) get the height
    // we set via style.height.
    let stubbedHeight = 20;
    Object.defineProperty(questionHtmlElement, "offsetHeight", { configurable: true, get: () => stubbedHeight });
    questionHtmlElement.style.height = "20px";

    expect(renderedTable.rows[0].id).toBe(options.getKey(renderedTable.rows[0]));
    expect(renderedTable.rows[1].id).toBe(options.getKey(renderedTable.rows[1]));
    expect(renderedTable.rows[2].id).toBe(options.getKey(renderedTable.rows[2]));
    expect(renderedTable.rows[3].id).toBe(options.getKey(renderedTable.rows[3]));

    const enterOptions = options.getEnterOptions(renderedTable.rows[1]);
    enterOptions.onBeforeRunAnimation && enterOptions.onBeforeRunAnimation(rowHtmlElement);
    expect(enterOptions.cssClass).toBe("enter");
    expect(questionHtmlElement.style.getPropertyValue("--animation-height-to")).toBe("20px");
    enterOptions.onAfterRunAnimation && enterOptions.onAfterRunAnimation(rowHtmlElement);
    expect(questionHtmlElement.style.getPropertyValue("--animation-height-to")).toBeFalsy();

    stubbedHeight = 40;
    questionHtmlElement.style.height = "40px";
    const leaveOptions = options.getLeaveOptions(renderedTable.rows[1]);
    leaveOptions.onBeforeRunAnimation && leaveOptions.onBeforeRunAnimation(rowHtmlElement);
    expect(leaveOptions.cssClass).toBe("leave");
    expect(questionHtmlElement.style.getPropertyValue("--animation-height-to")).toBe("40px");
    enterOptions.onAfterRunAnimation && enterOptions.onAfterRunAnimation(rowHtmlElement);
    expect(questionHtmlElement.style.getPropertyValue("--animation-height-to")).toBeFalsy();
    tableHtmlElement.remove();
  });
  test("set data from the survey", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }]
        }
      ]
    });
    survey.data = { matrix: [{ col1: 1 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "There one row").toBe(1);
  });
  test("set data from the survey and default row count is 0", () => {
    const prop = Serializer.findProperty("matrixdynamic", "rowCount");
    const prevValue = prop.defaultValue;
    expect(prevValue, "The default rowCount value is 2").toBe(2);
    prop.defaultValue = 0;
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }]
        }
      ]
    });
    survey.data = { matrix: [{ col1: 1 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "There one row").toBe(1);
    Serializer.findProperty("matrixdynamic", "rowCount").defaultValue = 2;
    prop.defaultValue = prevValue;
  });
  test("set data from the defaultValue and ignore rowCount", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 3,
          defaultValue: [{ col1: 1 }],
          columns: [{ name: "col1" }]
        }
      ]
    });
    survey.data = { matrix: [{ col1: 1 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "There one row").toBe(1);
  });

  test("check cell.isVisible property", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "matrix",
          "columns": [
            {
              "name": "col1"
            },
            {
              "name": "col1",
              "visibleIf": "{row.col1} = 1"
            },
          ],
          "choices": [
            1,
          ],
          "rows": [
            "row1",
            "row2"
          ]
        }
      ]
    });
    survey.data = { matrix: { row1: { col1: 1 } } };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    let renderedTable = matrix.renderedTable;
    expect(renderedTable.rows[0].cells[0].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[1].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[2].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[0].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[1].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[2].isVisible).toBeTruthy();
    expect(renderedTable.rows[2].cells[0].isVisible).toBeTruthy();
    expect(renderedTable.rows[2].cells[1].isVisible).toBeTruthy();
    expect(renderedTable.rows[2].cells[2].isVisible).toBeTruthy();
    expect(renderedTable.rows[3].cells[0].isVisible).toBeTruthy();
    expect(renderedTable.rows[3].cells[1].isVisible).toBeTruthy();
    expect(renderedTable.rows[3].cells[2].isVisible).toBeTruthy();
    matrix.isMobile = true;
    renderedTable = matrix.renderedTable;
    expect(renderedTable.rows[0].cells[0].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[1].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[2].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[3].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[4].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[0].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[1].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[2].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[3].isVisible).toBeFalsy();
    expect(renderedTable.rows[1].cells[4].isVisible).toBeFalsy();
    survey.data = { matrix: { row1: { col1: 1 }, row2: { col1: 1 } } };
    expect(renderedTable.rows[0].cells[0].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[1].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[2].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[3].isVisible).toBeTruthy();
    expect(renderedTable.rows[0].cells[4].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[0].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[1].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[2].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[3].isVisible).toBeTruthy();
    expect(renderedTable.rows[1].cells[4].isVisible).toBeTruthy();
  });

  test("check displayMode property", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "matrix",
          "columns": [
            {
              "name": "col1"
            },
            {
              "name": "col1",
            },
          ],
          "choices": [
            1,
          ],
          "rows": [
            "row1",
            "row2"
          ]
        }
      ]
    });
    const question = <QuestionMatrixDropdownModel>survey.getAllQuestions()[0];
    survey.css = { question: { mobile: "test_mobile" } };
    question.isMobile = true;
    expect(question.displayMode).toBe("auto");
    expect(question.isMobile).toBeTruthy();
    expect(question.getRootCss().includes("test_mobile")).toBeTruthy();
    question.isMobile = false;
    expect(question.isMobile).toBeFalsy();
    expect(question.getRootCss().includes("test_mobile")).toBeFalsy();

    question.isMobile = true;
    question.displayMode = "table";
    expect(question.isMobile).toBeFalsy();
    expect(question.getRootCss().includes("test_mobile")).toBeFalsy();
    question.isMobile = false;
    expect(question.isMobile).toBeFalsy();
    expect(question.getRootCss().includes("test_mobile")).toBeFalsy();

    question.isMobile = true;
    question.displayMode = "list";
    expect(question.isMobile).toBeTruthy();
    expect(question.getRootCss().includes("test_mobile")).toBeTruthy();
    question.isMobile = false;
    expect(question.isMobile).toBeTruthy();
    expect(question.getRootCss().includes("test_mobile")).toBeTruthy();
  });
  test("minRowCount vs rowCount, Bug#8899", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "matrix", minRowCount: 1, columns: [{ name: "col1" }] },
        { type: "matrixdynamic", name: "matrix1", minRowCount: 1, rowCount: 1, columns: [{ name: "col1" }] },
        { type: "matrixdynamic", name: "matrix2", minRowCount: 1, rowCount: 2, columns: [{ name: "col1" }] },
        { type: "matrixdynamic", name: "matrix3", minRowCount: 1, rowCount: 3, columns: [{ name: "col1" }] },
        { type: "matrixdynamic", name: "matrix4", minRowCount: 1, rowCount: 4, defaultRowValue: { col1: 1 }, columns: [{ name: "col1", cellType: "text" }] },
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    const matrix2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix2");
    const matrix3 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix3");
    const matrix4 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix4");
    expect(matrix.visibleRows.length, "matrix rowCount: 2").toBe(2);
    expect(matrix1.visibleRows.length, "matrix1 rowCount: 1").toBe(1);
    expect(matrix2.visibleRows.length, "matrix2 rowCount: 2").toBe(2);
    expect(matrix3.visibleRows.length, "matrix3 rowCount: 3").toBe(3);
    expect(matrix4.visibleRows.length, "matrix4 rowCount: 4").toBe(4);
    expect(matrix4.value, "matrix4 value").toEqualValues([{ col1: 1 }, { col1: 1 }, { col1: 1 }, { col1: 1 }]);
  });
  test("Validation doesn't work if a user doesn't visit the page, Bug#8937", () => {
    const survey = new SurveyModel({
      logoPosition: "right",
      pages: [
        {
          elements: [{ type: "text", name: "question1" }]
        },
        {
          elements: [
            {
              type: "matrixdynamic",
              name: "matrix",
              columns: [{ cellType: "text", name: "col1", isRequired: true }],
              rowCount: 1
            }
          ]
        },
        {
          elements: [{ type: "text", name: "question3" }]
        }
      ],
      checkErrorsMode: "onComplete"
    });
    survey.currentPageNo = 2;
    survey.tryComplete();
    expect(survey.state, "Still running").toBe("running");
    expect(survey.currentPageNo, "move to page with panel").toBe(1);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows[0].getQuestionByName("col1").errors.length, "has an error").toBe(1);
  });

  test("column width settings passed to all rows", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [{ name: "1", width: "15%", minWidth: "10%" }, { name: "2" }],
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var table = matrix.renderedTable;
    expect(table.rows.length).toBe(4);
    expect(table.rows[1].cells[0].width, "The first row cell width 15%").toBe("15%");
    expect(table.rows[1].cells[0].minWidth, "The first row cell min width 10%").toBe("10%");
    expect(table.rows[3].cells[0].width, "The second row cell width 15%").toBe("15%");
    expect(table.rows[3].cells[0].minWidth, "The second row cell min width 10%").toBe("10%");
  });
  test("cell title renderedHtml is incorrect on adding/removing rows ", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [{ name: "col1" }],
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    const rows = matrix.visibleRows;
    expect(rows[0].cells[0].question.locTitle.renderedHtml, "#1").toBe("row 1, column col1");
    expect(rows[1].cells[0].question.locTitle.renderedHtml, "#2").toBe("row 2, column col1");
    matrix.removeRow(0);
    matrix.addRow();
    expect(rows[0].cells[0].question.locTitle.renderedHtml, "#3").toBe("row 1, column col1");
    expect(rows[1].cells[0].question.locTitle.renderedHtml, "#4").toBe("row 2, column col1");
  });
  test("Use matrix rows id & cells questions id in rendered table, Bug#9233", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              visibleIf: "{row.col2} notempty",
              cellType: "text"
            },
            {
              name: "col2",
              cellType: "text"
            },
            {
              name: "col3",
              visibleIf: "{row.col2} notempty",
              cellType: "text"
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    const rowId = matrix.visibleRows[0].id;
    const cellQuestion = matrix.visibleRows[0].cells[1].question;
    const colId = cellQuestion.id;
    let table = matrix.renderedTable;
    expect(table.rows[0].isErrorsRow, "It is an error row, #1").toBe(true);
    expect(table.rows[0].id.endsWith("-error"), "There is -error postfix, #1").toBe(true);
    expect(table.rows[1].id, "Use row id, #1").toBe(rowId);
    expect(table.rows[0].cells[0].id, "There is -error postfix in error cell, #1").toBe(colId + "-error");
    expect(table.rows[1].cells[0].id, "Use question id, #1.2").toBe(colId);
    cellQuestion.value = "abc";
    table = matrix.renderedTable;
    expect(table.rows[1].id, "Use row id, #2").toBe(rowId);
    expect(table.rows[1].cells[1].id, "Use question id, #2").toBe(colId);
  });
  test("Use matrix rows id & cells questions id in rendered table & showInMultipleColumns, Bug#9233", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              choices: [1, 2],
              showInMultipleColumns: true
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    const col1Id = matrix.visibleRows[0].cells[0].question.id;
    let table = matrix.renderedTable;
    expect(table.rows[0].cells[0].id, "There is -error postfix in error cell, #1").toBe(col1Id + "-error");
    expect(table.rows[1].cells[0].id, "Use question id, #1").toBe(col1Id + "-index0");
    expect(table.rows[1].cells[1].id, "Use question id, #2").toBe(col1Id + "-index1");
  });
  test("A matrix row validation works incorrectly when using valueName, Bug#9758", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "columns": [{ "name": "column1" }],
          "cellType": "text",
          "rowCount": 1
        },
        {
          "type": "matrixdynamic",
          "name": "matrix1",
          "valueName": "matrix",
          "columns": [
            {
              "name": "column2",
              "validators": [
                {
                  "type": "expression",
                  "text": "error",
                  "expression": "{row.column1} = {row.column2}"
                }
              ],
              "defaultValueExpression": "{row.column1}"
            }
          ],
          "cellType": "text",
          "rowCount": 1
        }
      ]
    });
    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const matrix2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    matrix1.visibleRows[0].getQuestionByColumnName("column1").value = 1;
    expect(matrix1.visibleRows[0].getQuestionByColumnName("column1").value, "column1 value is correct").toBe(1);
    expect(matrix2.visibleRows[0].getQuestionByColumnName("column2").value, "column2 value is correct").toBe(1);
    expect(matrix2.validate(), "matrix2 is valid").toBe(true);
  });
  test("The Set Value trigger doesn't work on subsequent runs, Bug#10017", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "toggleMatrix",
          title: "Do you want to add the row?",
          isRequired: true,
          choices: ["Yes", "No"],
        },
        {
          type: "matrixdynamic",
          name: "matrix",
          resetValueIf: "{toggleMatrix} = 'No'",
          columns: [
            { name: "col1" },
            { name: "col2" },
          ],
          rowCount: 0,
          cellType: "text",
        },
      ],
      triggers: [
        {
          type: "setvalue",
          expression: "{toggleMatrix} = 'Yes'",
          setToName: "matrix",
          setValue: [
            {
              col1: "Value 1",
              col2: "Value 2",
            },
          ],
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "matrix visible rows #1").toBe(0);
    expect(matrix.isEmpty(), "matrix value #1").toBe(true);
    survey.setValue("toggleMatrix", "Yes");
    expect(matrix.visibleRows.length, "matrix visible rows #2").toBe(1);
    expect(matrix.value, "matrix value #2").toEqualValues([{ col1: "Value 1", col2: "Value 2" }]);
    survey.setValue("toggleMatrix", "No");
    expect(matrix.visibleRows.length, "matrix visible rows #3").toBe(0);
    expect(matrix.isEmpty(), "matrix value #3").toBe(true);
    survey.setValue("toggleMatrix", "Yes");
    expect(matrix.visibleRows.length, "matrix visible rows #4").toBe(1);
    expect(matrix.value, "matrix value #4").toEqualValues([{ col1: "Value 1", col2: "Value 2" }]);
    survey.setValue("toggleMatrix", "No");
    expect(matrix.visibleRows.length, "matrix visible rows #5").toBe(0);
    expect(matrix.isEmpty(), "matrix value #5").toBe(true);
    matrix.value = [{ col1: "Value A", col2: "Value B" }, { col1: "Value C", col2: "Value D" }];
    expect(matrix.visibleRows.length, "matrix visible rows #6").toBe(2);
    expect(matrix.value, "matrix value #6").toEqualValues([{ col1: "Value A", col2: "Value B" }, { col1: "Value C", col2: "Value D" }]);
    survey.setValue("toggleMatrix", "Yes");
    expect(matrix.visibleRows.length, "matrix visible rows #7").toBe(1);
    expect(matrix.value, "matrix value #7").toEqualValues([{ col1: "Value 1", col2: "Value 2" }]);
  });
  test("The Set Value trigger doesn't work on subsequent runs, Bug#10017", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            { name: "col1" },
            { name: "col2" },
          ],
          rowCount: 0,
          cellType: "text",
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.renderedTable.showAddRow).toBeTruthy();
    expect(matrix.renderedTable.showAddRowOnBottom).toBeTruthy();
    survey.setDesignMode(true);
    matrix.resetRenderedTable();
    expect(matrix.renderedTable.showAddRow).toBeFalsy();
    expect(matrix.renderedTable.showAddRowOnBottom).toBeFalsy();
  });
  test("matrixdynamic.getValueGetterContext()", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          columns: [
            { cellType: "dropdown", name: "col1", defaultValue: 1, choices: [{ value: 1, text: "item1" }] }
          ]
        }]
    });
    survey.setValue("var1", "b");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const getter = new ValueGetter();
    const context = survey.getValueGetterContext();
    expect(matrix.visibleRows.length, "There are two rows").toBe(2);
    expect(getter.getValue("matrix[1].col1", context), "#1").toBe(1);
    expect(getter.getDisplayValue("matrix[1].col1", context,), "text #1").toBe("item1");
    expect(matrix.visibleRows.length, "There are two rows: header and data row").toBe(2);
    const rowContext = matrix.visibleRows[1].getValueGetterContext();
    expect(getter.getValue("row.col1", rowContext), "row #1").toBe(1);
    expect(getter.getDisplayValue("row.col1", rowContext), "row text #1").toBe("item1");
    expect(getter.getValue("var1", rowContext), "row #2").toBe("b");
    expect(getter.getValue("matrix[0].col1", rowContext), "row #3").toBe(1);
  });
  test("visibleIf, column resetIf & minRowCount and it is in dynamic panel, Bug#10289", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 2,
          templateElements: [
            {
              type: "matrixdynamic",
              name: "matrix",
              visibleIf: "{q1}!='a'",
              minRowCount: 2,
              columns: [
                { cellType: "text", name: "col1", resetValueIf: "{q1}='a'" },
                { cellType: "text", name: "col2", resetValueIf: "{q1}='a'" }
              ]
            }
          ]
        },
      ]
    });
    const panels = (<QuestionPanelDynamicModel>survey.getQuestionByName("panel")).panels;
    const matrix1 = panels[0].getQuestionByName("matrix");
    const matrix2 = panels[1].getQuestionByName("matrix");
    expect(matrix1.isVisible, "matrix1.isVisible #1").toBe(true);
    expect(matrix2.isVisible, "matrix2.isVisible #1").toBe(true);
    expect(matrix1.visibleRows.length, "matrix1.visibleRows.length #1").toBe(2);
    expect(matrix2.visibleRows.length, "matrix2.visibleRows.length #1").toBe(2);
    matrix1.value = [{ col1: "Value 1", col2: "Value 2" }, { col1: "Value 1", col2: "Value 2" }];
    matrix2.value = [{ col1: "Value 3", col2: "Value 4" }, { col1: "Value 3", col2: "Value 4" }];
    survey.setValue("q1", "a");
    expect(matrix1.isVisible, "matrix1.isVisible #2").toBe(false);
    expect(matrix2.isVisible, "matrix2.isVisible #2").toBe(false);
    expect(matrix1.visibleRows.length, "matrix1.visibleRows.length #2").toBe(2);
    expect(matrix2.visibleRows.length, "matrix2.visibleRows.length #2").toBe(2);
    survey.setValue("q1", "b");
    expect(matrix1.isVisible, "matrix1.isVisible #3").toBe(true);
    expect(matrix2.isVisible, "matrix2.isVisible #3").toBe(true);
    expect(matrix1.visibleRows.length, "matrix1.visibleRows.length #3").toBe(2);
    expect(matrix2.visibleRows.length, "matrix2.visibleRows.length #3").toBe(2);
  });
  test("defaultValueExpression should work correctly with non-existing columns, Bug#10303", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "question1",
          "templateElements": [
            {
              "type": "matrixdynamic",
              "name": "question2",
              "columns": [
                {
                  "name": "a"
                },
                {
                  "name": "b",
                  "defaultValueExpression": "iif({row.aa} empty, 0, 1)"
                }
              ],
              "cellType": "text"
            }
          ],
          "panelCount": 1
        }
      ] });
    expect(survey.data, "The default value is correct").toEqualValues({ question1: [{ question2: [{ b: 0 }, { b: 0 }] }] });
  });
  test("SurveyError.notificationType & validate in matrices,Issue#9085", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "matrix", rowCount: 2,
          columns: [
            { name: "col1", cellType: "text", validators: [{ type: "numeric", maxValue: 5, notificationType: "warning" }, { type: "numeric", maxValue: 10 }] },
            { name: "col2", cellType: "text" }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    const cell1 = rows[0].getQuestionByColumnName("col1");
    const cell2 = rows[1].getQuestionByColumnName("col1");
    cell1.value = 7;
    cell2.value = 12;
    let erroredQuestionName = "";
    const callbackFunc = (res: boolean, question: Question) => {
      erroredQuestionName = question?.name || "";
    };
    expect(survey.currentPage.validate(true, true, callbackFunc), "There is an error").toBe(false);
    expect(erroredQuestionName, "The matrix question is returned").toBe("col1");
    expect(cell1.errors.length, "There is no error, cell1").toBe(1);
    expect(cell1["hasCssError"](), "There is no css error, cell1").toBe(false);
    expect(cell1["hasCssError"](true), "There is a warning, cell1").toBe(true);
    expect(cell2.errors.length, "There is an error, cell2").toBe(2);
    expect(cell2["hasCssError"](), "There is css error, cell2").toBe(true);
    expect(cell2["hasCssError"](true), "There is css error, cell2").toBe(true);
    expect(cell2.getPropertyValue("currentNotificationType"), "the currentNotificationType is error").toBe("error");
    expect(cell1.wasRendered, "cell1 was rendered, #1").toBe(true);
    cell2.value = 8;
    expect(cell2.errors.length, "There is a warning, cell2").toBe(1);
    expect(cell2.errors[0].notificationType, "it is a warning").toBe("warning");
    expect(cell2.errors[0].isWarning, "it is a warning").toBe(true);
    expect(cell2.errors[0].isError, "it is not an error").toBe(false);
    expect(cell1.wasRendered, "cell1 was rendered, #2").toBe(true);
    expect(cell2.getPropertyValue("currentNotificationType"), "the currentNotificationType is warning").toBe("warning");
    expect(cell2["hasCssError"](), "There is css error, cell2").toBe(false);
    expect(cell2["hasCssError"](true), "There is a css warning, cell2").toBe(true);
    expect(survey.tryComplete(), "There is no error, complete the survey").toBe(true);
    expect(survey.data, "The data is correct").toEqualValues({ matrix: [{ col1: 7 }, { col1: 8 }] });
  });
  test("Detail panel, do not create detail panels on value-changing validation", () => {
    var survey = new SurveyModel({
      checkErrorsMode: "onValueChanging",
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 3,
          detailPanelMode: "underRow",
          columns: [{ name: "col1" }],
          detailElements: [{ type: "text", name: "q1", isRequired: true }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.visibleRows;
    expect(rows.length, "There are 3 rows").toBe(3);
    expect(rows[0].detailPanel, "detail panel is not created for row 0").toBeNull();
    expect(rows[1].detailPanel, "detail panel is not created for row 1").toBeNull();
    expect(rows[2].detailPanel, "detail panel is not created for row 2").toBeNull();
    matrix.removeRow(2);
    rows = matrix.visibleRows;
    expect(rows.length, "There are 2 rows after removal").toBe(2);
    expect(rows[0].detailPanel, "detail panel is still not created for row 0 after removal").toBeNull();
    expect(rows[1].detailPanel, "detail panel is still not created for row 1 after removal").toBeNull();
  });
  test("SurveyError.notificationType & validate in matrices, Bug#10436", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "matrix", rowCount: 3,
          columns: [
            { name: "col1", cellType: "dropdown", defaultValueExpression: "1", choices: [{ value: 1, text: "item 1" }] }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    rows[0].getQuestionByColumnName("col1").clearValueFromUI();
    rows[1].getQuestionByColumnName("col1").clearValueFromUI();
    rows[2].getQuestionByColumnName("col1").clearValueFromUI();
    expect(rows[0].getQuestionByColumnName("col1").isEmpty(), "row 0 is empty").toBe(true);
    expect(rows[1].getQuestionByColumnName("col1").isEmpty(), "row 1 is empty").toBe(true);
    expect(rows[2].getQuestionByColumnName("col1").isEmpty(), "row 2 is empty").toBe(true);
  });
  test("Panel dynamic vs prevRow & nextRow in expression, Issue#10606", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "columns": [
            {
              "cellType": "text",
              "name": "col1"
            },
            {
              "cellType": "expression",
              "name": "col2",
              "expression": "{row.col1} + {prevRow.col1} + {nextRow.col1}"
            }
          ],
          "rowCount": 4
        }
      ]
    });

    const dp = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rows = dp.visibleRows;
    dp.visibleRows[0].getQuestionByName("col1").value = 10;
    dp.visibleRows[1].getQuestionByName("col1").value = 20;
    dp.visibleRows[2].getQuestionByName("col1").value = 30;
    dp.visibleRows[3].getQuestionByName("col1").value = 40;
    expect(rows[0].getQuestionByName("col2").value, "row 0: only nextRow").toBe(10 + 20);
    expect(rows[1].getQuestionByName("col2").value, "row 1: prevRow & nextRow").toBe(10 + 20 + 30);
    expect(rows[2].getQuestionByName("col2").value, "row 2: prevRow & nextRow").toBe(20 + 30 + 40);
    expect(rows[3].getQuestionByName("col2").value, "row 3: only prevRow").toBe(30 + 40);
  });
  test("Use -1 as the last row in the expression, Issue#10607", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "matrix", rowCount: 3,
          columns: [
            { name: "col1", cellType: "text" }
          ]
        },
        { type: "expression", name: "expr", expression: "{matrix[-1].col1}" }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    survey.setValue("matrix", [{ col1: "row1" }, { col1: "row2" }, { col1: "row3" }]);
    const rows = matrix.visibleRows;
    expect(survey.getValue("expr"), "The last row value is correct").toBe("row3");
    rows[2].getQuestionByColumnName("col1").value = "row3-modified";
    expect(survey.getValue("expr"), "The last row value is correct after modification").toBe("row3-modified");
  });
  test("Matrix is not re-create rows on setting value after the matrix value is empty array, Bug#10622", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "matrix", rowCount: 2,
          columns: [
            { name: "col1", cellType: "text", defaultValue: "abc" }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.removeRow(0);
    expect(matrix.visibleRows.length, "There is one default row").toBe(1);
    matrix.addRow();
    matrix.visibleRows[1].getQuestionByColumnName("col1").value = "def";
    expect(matrix.value, "The value is correct before setting empty array").toEqualValues([{ col1: "abc" }, { col1: "def" }]);
    expect(matrix.renderedTable.rows.length, "There are two data rows before setting empty array").toBe(4);
    matrix.removeRow(1);
    matrix.removeRow(0);
    expect(matrix.value, "The value is empty array").toEqualValues([]);
    expect(matrix.visibleRows.length, "There is no rows").toBe(0);
    expect(matrix.renderedTable.rows.length, "There are no data rows").toBe(0);
    matrix.value = [{ col1: "row1" }];
    expect(matrix.visibleRows.length, "There is one row after setting value").toBe(1);
    expect(matrix.visibleRows[0].getQuestionByColumnName("col1").value, "The row value is correct").toBe("row1");
    expect(matrix.renderedTable.rows.length, "There is one data row").toBe(2);
  });

  test("The displayValue function doesn't work when an expression column is located before the target column Bug#10697", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 1,
          columns: [
            {
              name: "a",
              defaultValueExpression: "displayValue('b')",
              cellType: "text"
            },
            {
              name: "b",
              cellType: "dropdown",
              choices: [
                {
                  value: "e1",
                  text: "item1"
                },
                {
                  value: "e2",
                  text: "item2"
                }
              ]
            }
          ],
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const row = matrix.visibleRows[0];
    const a = row.getQuestionByName("a");
    const b = row.getQuestionByName("b");
    b.value = "e1";
    expect(a.value, "Default value set correct").toBe("item1");
    b.value = "e2";
    expect(a.value, "Default value set correct #2").toBe("item2");
  });
  test("ProcessValue.hasValue for column object in design mode", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "a",
            },
            {
              name: "b",
            }
          ],
        }
      ]
    });
    survey.setDesignMode(true);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const colContext = matrix.columns[0].getValueGetterContext();
    const processValue = new ProcessValue(colContext);
    expect(processValue.hasValue("row.a"), "there is row a").toBe(true);
    expect(processValue.hasValue("row.c"), "there is no row c").toBe(false);
    matrix.rowCount = 0;
    expect(processValue.hasValue("row.a"), "there is row a, #2").toBe(true);
    expect(processValue.hasValue("row.c"), "there is no row c, #2").toBe(false);
  });
  test("ProcessValue.hasValue to access matrix array in design mode", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "a",
            },
            {
              name: "b",
            }
          ],
        },
        { type: "text", name: "q2" }
      ]
    });
    survey.setDesignMode(true);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q2Context = q2.getValueGetterContext();
    const processValue = new ProcessValue(q2Context);
    expect(processValue.hasValue("q1[0].a"), "there is row a").toBe(true);
    expect(processValue.hasValue("q1[0].c"), "there is no row c").toBe(false);
    matrix.rowCount = 0;
    expect(processValue.hasValue("q1[0].a"), "there is row a, #2").toBe(true);
    expect(processValue.hasValue("q1[0].c"), "there is no row c, #2").toBe(false);
  });
  test("Assign empty array to survey matrix", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "choices",
          defaultValue: [{ value: 1, text: "item1" }],
          rowCount: 0,
          columns: [
            { cellType: "text", name: "value" },
            { cellType: "text", name: "text" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
    expect(matrix.visibleRows.length, "There are 1 row").toBe(1);
    survey.setValue("choices", []);
    expect(matrix.visibleRows.length, "There are 0 rows").toBe(0);
  });

  test("Matrix dynamic: cell value changes must update matrix.value when detail panel has same-named questions", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 0,
          columns: [
            { name: "name", visible: false },
            { name: "title" }
          ],
          detailPanelMode: "underRow",
          detailElements: [
            { type: "text", name: "name", visible: false },
            { type: "text", name: "title", visible: false },
            { type: "text", name: "extra" }
          ]
        }
      ]
    });

    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.addRow();

    const row = matrix.visibleRows[0];
    row.getQuestionByName("name").value = "name1";
    row.getQuestionByName("title").value = "name1";
    expect(matrix.value[0], "Initial values are set correctly").toEqualValues({ name: "name1", title: "name1" });

    row.showDetailPanel();

    // After opening detail panel, cell value change should still update matrix.value
    row.getQuestionByName("title").value = "Name1";

    // BUG: matrix.value[0].title is "name1" (stale detail panel value) instead of "Name1"
    expect(matrix.value[0].title, "matrix.value is updated after cell value change with detail panel open").toBe("Name1");
  });
  test("onMatrixCellValueChanged event should have oldValue and value in options", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            { name: "col1", cellType: "dropdown", choices: [1, 2, 3] },
            { name: "col2", cellType: "text" }
          ],
          rows: ["Row1", "Row2"]
        }
      ]
    });
    var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    var changedLog: Array<{ columnName: string, value: any, oldValue: any }> = [];
    survey.onMatrixCellValueChanged.add(function (survey, options) {
      changedLog.push({
        columnName: options.columnName,
        value: options.value,
        oldValue: options.oldValue
      });
    });
    var rows = matrix.visibleRows;

    // Set initial value for col1 in Row1
    rows[0].cells[0].question.value = 1;
    expect(changedLog.length, "One change logged").toBe(1);
    expect(changedLog[0].columnName, "Changed col1").toBe("col1");
    expect(changedLog[0].value, "New value is 1").toBe(1);
    expect(changedLog[0].oldValue, "Old value is undefined for first change").toBeUndefined();

    // Change col1 value from 1 to 2
    rows[0].cells[0].question.value = 2;
    expect(changedLog.length, "Two changes logged").toBe(2);
    expect(changedLog[1].value, "New value is 2").toBe(2);
    expect(changedLog[1].oldValue, "Old value is 1").toBe(1);

    // Change col1 value from 2 to 3
    rows[0].cells[0].question.value = 3;
    expect(changedLog.length, "Three changes logged").toBe(3);
    expect(changedLog[2].value, "New value is 3").toBe(3);
    expect(changedLog[2].oldValue, "Old value is 2").toBe(2);

    // Clear value (set to null)
    rows[0].cells[0].question.clearValue();
    expect(changedLog.length, "Four changes logged").toBe(4);
    expect(changedLog[3].value, "New value is null").toBeUndefined();
    expect(changedLog[3].oldValue, "Old value is 3").toBe(3);

    // Set value for a text column
    rows[0].cells[1].question.value = "text1";
    expect(changedLog.length, "Five changes logged").toBe(5);
    expect(changedLog[4].columnName, "Changed col2").toBe("col2");
    expect(changedLog[4].value, "New text value").toBe("text1");
    expect(changedLog[4].oldValue, "Old text value is undefined").toBeUndefined();

    // Change text column value
    rows[0].cells[1].question.value = "text2";
    expect(changedLog.length, "Six changes logged").toBe(6);
    expect(changedLog[5].value, "New text value is text2").toBe("text2");
    expect(changedLog[5].oldValue, "Old text value is text1").toBe("text1");
  });

  test("isUnique error should appear in second matrix with validators when duplicate values are set, bug#11155", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "matrixdynamic",
              name: "matrix1",
              columns: [
                {
                  name: "b",
                  cellType: "text",
                  isUnique: true
                },
                {
                  name: "c",
                  cellType: "text"
                }
              ]
            },
            {
              type: "matrixdynamic",
              name: "matrix2",
              columns: [
                {
                  name: "b",
                  cellType: "text",
                  isUnique: true,
                  validators: [
                    {
                      type: "expression",
                      text: "'{row.c} empty'",
                      expression: "{row.c} empty"
                    }
                  ]
                },
                {
                  name: "c",
                  cellType: "text"
                }
              ]
            }
          ]
        }
      ],
      checkErrorsMode: "onValueChanged"
    });

    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    const matrix2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix2");
    const rows1 = matrix1.visibleRows;
    const rows2 = matrix2.visibleRows;

    // Set duplicate values in matrix1
    const cell1_row0 = rows1[0].getQuestionByColumnName("b");
    const cell1_row1 = rows1[1].getQuestionByColumnName("b");
    cell1_row0.value = "abc";
    cell1_row1.value = "abc";

    expect(cell1_row0.errors.length, "matrix1 row0 cell 'b' has unique error").toBe(1);
    expect(cell1_row1.errors.length, "matrix1 row1 cell 'b' has unique error").toBe(1);

    // Set duplicate values in matrix2
    const cell2_row0 = rows2[0].getQuestionByColumnName("b");
    const cell2_row1 = rows2[1].getQuestionByColumnName("b");
    cell2_row0.value = "abc";
    cell2_row1.value = "abc";

    expect(cell2_row0.errors.length, "matrix2 row0 cell 'b' has unique error").toBe(1);
    expect(cell2_row1.errors.length, "matrix2 row1 cell 'b' should have unique error").toBe(1);
  });
});
