import { Helpers } from "../src/helpers";
import { QuestionMatrixModel } from "../src/question_matrix";
import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";

import { describe, test, expect } from "vitest";
describe("Survey_QuestionMatrix", () => {
  test("Matrix Question eachRowRequired property", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    expect(matrix.validate(), "There is no errors by default").toBe(true);
    matrix.eachRowRequired = true;
    expect(matrix.validate(), "There is no errors by default").toBe(false);
  });
  test("Matrix Question eachRowRequired property, value is zero, Bug#2332", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.fromJSON({
      type: "matrix",
      name: "question",
      isRequired: true,
      columns: [
        {
          value: 0,
          text: "No",
        },
        {
          value: 1,
          text: "Maybe",
        },
        {
          value: 2,
          text: "Yes",
        },
      ],
      rows: ["item1", "item2"],
      eachRowRequired: true,
    });
    var rows = matrix.visibleRows;
    expect(matrix.validate(), "is Required error").toBe(false);
    rows[0].value = 0;
    expect(matrix.validate(), "eachRowRequired error").toBe(false);
    rows[1].value = 0;
    expect(matrix.value, "value set correctly").toEqual({ item1: 0, item2: 0 });
    expect(rows[0].value, "First row value set correctly").toBe(0);
    expect(rows[1].value, "Second row value set correctly").toBe(0);
    expect(matrix.validate(), "There is no errors").toBe(true);
  });
  test("Matrix Question eachRowUnique property", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    expect(matrix.validate(), "validate #1").toBe(true);
    matrix.eachRowUnique = true;
    expect(matrix.validate(), "validate #2").toBe(true);
    matrix.value = { row1: "col1" };
    expect(matrix.validate(), "validate #3").toBe(true);
    matrix.value = { row2: "col1" };
    expect(matrix.validate(), "validate #4").toBe(true);
    matrix.value = { row1: "col1", row2: "col1" };
    expect(matrix.validate(), "validate #5").toBe(false);
    matrix.value = { row1: "col1", row2: "col2" };
    expect(matrix.validate(), "validate #6").toBe(true);
    matrix.value = { row1: "col2", row2: "col2" };
    expect(matrix.validate(), "validate #7").toBe(false);
  });
  test("matrix row, rowClasses property, eachRowRequired", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2"],
          eachRowRequired: true,
        },
      ],
    });
    survey.css = { matrix: { row: "row", rowError: "row_error" } };
    var question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.cssClasses.row, "Row class is not empty").toBeTruthy();
    expect(question.visibleRows[0].rowClasses, "Set row class").toBe("row");
    question.validate();
    expect(question.visibleRows[0].rowClasses, "Error for the first row").toBe("row row_error");
    question.visibleRows[0].value = "col1";
    expect(question.visibleRows[0].rowClasses, "first row value is set").toBe("row");
    expect(question.visibleRows[1].rowClasses, "Error for the second row").toBe("row row_error");
  });
  test("matrix row, rowClasses property, eachRowUnique", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2"],
          eachRowUnique: true,
        },
      ],
    });
    survey.css = { matrix: { row: "row", rowError: "row_error" } };
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.cssClasses.row, "Row class is not empty").toBeTruthy();
    expect(question.hasErrorInRow(question.visibleRows[0]), "hasErrorInRow(0)").toBe(false);
    expect(question.visibleRows[0].hasError, "visibleRows[0].hasError").toBe(false);
    expect(question.visibleRows[0].rowClasses, "Set row class").toBe("row");
    question.value = { row1: "col1", row2: "col1" };
    question.validate();
    expect(question.hasErrorInRow(question.visibleRows[0]), "hasErrorInRow(0) #1").toBe(false);
    expect(question.visibleRows[0].hasError, "visibleRows[0].hasError #1").toBe(false);
    expect(question.visibleRows[0].rowClasses, "first row #1").toBe("row");
    expect(question.hasErrorInRow(question.visibleRows[1]), "hasErrorInRow(1) #1").toBe(true);
    expect(question.visibleRows[1].hasError, "visibleRows[1].hasError #1").toBe(true);
    expect(question.visibleRows[1].rowClasses, "second row #1").toBe("row row_error");
    question.visibleRows[1].value = "col2";
    expect(question.hasErrorInRow(question.visibleRows[0]), "hasErrorInRow(0) #2").toBe(false);
    expect(question.visibleRows[0].hasError, "visibleRows[0].hasError #2").toBe(false);
    expect(question.visibleRows[0].rowClasses, "first row #2").toBe("row");
    expect(question.hasErrorInRow(question.visibleRows[1]), "hasErrorInRow(1) #2").toBe(false);
    expect(question.visibleRows[1].hasError, "visibleRows[1].hasError #2").toBe(false);
    expect(question.visibleRows[1].rowClasses, "second row #2").toBe("row");
  });
  test("matrix row, rowClasses property, #7889", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2", "row3"],
          eachRowUnique: true,
        },
      ],
    });
    survey.css = { matrix: { row: "row", rowError: "row_error" } };
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.cssClasses.row, "Row class is not empty").toBeTruthy();
    expect(question.hasErrorInRow(question.visibleRows[0]), "hasErrorInRow(0), #1").toBe(false);
    expect(question.visibleRows[0].hasError, "visibleRows[0].hasError, #1").toBe(false);
    expect(question.hasErrorInRow(question.visibleRows[1]), "hasErrorInRow(1), #2").toBe(false);
    expect(question.visibleRows[1].hasError, "visibleRows[1].hasError, #2").toBe(false);
    expect(question.hasErrorInRow(question.visibleRows[2]), "hasErrorInRow(2), #3").toBe(false);
    expect(question.visibleRows[2].hasError, "visibleRows[2].hasError, #3").toBe(false);
    question.visibleRows[0].cellClick(question.columns[0]);
    expect(question.value, "value is set #4").toEqual({ row1: "col1" });
    expect(question.hasErrorInRow(question.visibleRows[0]), "hasErrorInRow(0), #5").toBe(false);
    expect(question.visibleRows[0].hasError, "visibleRows[0].hasError, #5").toBe(false);
    expect(question.hasErrorInRow(question.visibleRows[1]), "hasErrorInRow(1), #6").toBe(false);
    expect(question.visibleRows[1].hasError, "visibleRows[1].hasError, #6").toBe(false);
    expect(question.hasErrorInRow(question.visibleRows[2]), "hasErrorInRow(2), #7").toBe(false);
    expect(question.visibleRows[2].hasError, "visibleRows[2].hasError, #7").toBe(false);
  });
  test("matrix row, cellClick&isChecked", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2", "row3"]
        },
      ],
    });
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const rows = question.visibleRows;
    expect(rows.length, "rows 3").toBe(3);
    expect(rows[0].value, "row1 value is empty").toBeUndefined();
    expect(rows[0].isChecked(question.columns[0]), "row1 isChecked col1 #1").toBe(false);
    expect(rows[0].isChecked(question.columns[1]), "row1 isChecked col2 #1").toBe(false);
    rows[0].cellClick(question.columns[1]);
    expect(rows[0].value, "row1 value is col2").toBe("col2");
    expect(rows[0].isChecked(question.columns[0]), "row1 isChecked col1 #2").toBe(false);
    expect(rows[0].isChecked(question.columns[1]), "row1 isChecked col2 #2").toBe(true);
    rows[1].cellClick(question.columns[0]);
    expect(rows[1].value, "row2 value is col1").toBe("col1");
    expect(rows[1].isChecked(question.columns[0]), "row2 isChecked col1 #1").toBe(true);
    expect(rows[1].isChecked(question.columns[1]), "row2 isChecked col2 #1").toBe(false);
    expect(question.value, "value is set correctly").toEqual({ row1: "col2", row2: "col1" });
  });
  test("matrix row, cellClick&isChecked, isMultiSelect", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2", "row3"],
          cellType: "checkbox"
        },
      ],
    });
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.isMultiSelect, "isMultiSelect is true").toBeTruthy();
    const rows = question.visibleRows;
    expect(rows.length, "rows 3").toBe(3);
    expect(rows[0].value, "row1 value is empty").toEqual(undefined);
    expect(rows[0].isChecked(question.columns[0]), "row1 isChecked col1 #1").toBe(false);
    expect(rows[0].isChecked(question.columns[1]), "row1 isChecked col2 #1").toBe(false);
    rows[0].cellClick(question.columns[1]);
    expect(rows[0].value, "row1 value is col2").toEqual(["col2"]);
    expect(rows[0].isChecked(question.columns[0]), "row1 isChecked col1 #2").toBe(false);
    expect(rows[0].isChecked(question.columns[1]), "row1 isChecked col2 #2").toBe(true);
    rows[0].cellClick(question.columns[0]);
    expect(rows[0].value, "row1 value is col2, col1").toEqual(["col2", "col1"]);
    expect(rows[0].isChecked(question.columns[0]), "row1 isChecked col1 #3").toBe(true);
    expect(rows[0].isChecked(question.columns[1]), "row1 isChecked col2 #3").toBe(true);
    rows[1].cellClick(question.columns[0]);
    expect(rows[1].value, "row2 value is col1").toEqual(["col1"]);
    expect(rows[1].isChecked(question.columns[0]), "row2 isChecked col1 #1").toBe(true);
    expect(rows[1].isChecked(question.columns[1]), "row2 isChecked col2 #1").toBe(false);
    expect(question.value, "value is set correctly, #1").toEqual({ row1: ["col2", "col1"], row2: ["col1"] });
    rows[0].cellClick(question.columns[1]);
    expect(rows[0].isChecked(question.columns[0]), "row1 isChecked col1 #3").toBe(true);
    expect(rows[0].isChecked(question.columns[1]), "row1 isChecked col2 #3").toBe(false);
    rows[1].cellClick(question.columns[0]);
    expect(rows[1].isChecked(question.columns[0]), "row2 isChecked col1 #2").toBe(false);
    expect(rows[1].isChecked(question.columns[1]), "row2 isChecked col2 #2").toBe(false);
    expect(rows[1].value, "row2 value is set correctly, #2").toBeNull();
    expect(question.value, "value is set correctly, #2").toEqual({ row1: ["col1"] });
    expect(survey.data, "survey.data, #1").toEqual({ q1: { row1: ["col1"] } });
    survey.doComplete();
    expect(survey.data, "survey.data, #2").toEqual({ q1: { row1: ["col1"] } });
  });

  test("check row randomization in design mode", () => {

    var json = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrix",
              "name": "question1",
              "columns": [
                "Column 1",
                "Column 2"
              ],
              "rows": [
                "Row 1",
                "Row 2",
                "Row 3",
                "Row 4"
              ],
              "rowsOrder": "random"
            }
          ]
        }
      ]
    };
    const survey = new SurveyModel(json);
    const q1 = <QuestionMatrixModel>survey.getQuestionByName("question1");
    const rows = q1.getRows();

    var randomizedCount: number = 0;
    const oldFunc = Helpers.randomizeArray;
    Helpers.randomizeArray = (array: Array<any>): Array<any> => {
      randomizedCount++;
      return array;
    };

    randomizedCount = 0;
    survey.setDesignMode(false);
    q1["sortVisibleRows"](rows);
    expect(randomizedCount).toBe(1);

    survey.setDesignMode(true);
    randomizedCount = 0;
    q1["sortVisibleRows"](rows);
    expect(randomizedCount).toBe(0);

    q1.rowOrder = "initial";

    randomizedCount = 0;
    survey.setDesignMode(false);
    q1["sortVisibleRows"](rows);
    expect(randomizedCount).toBe(0);

    survey.setDesignMode(true);
    randomizedCount = 0;
    q1["sortVisibleRows"](rows);
    expect(randomizedCount).toBe(0);

    Helpers.randomizeArray = oldFunc;
  });
  test("rows, ItemValue.enableIf", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrix", name: "q1", columns: ["col1"], rows: [{ value: "row1", enableIf: "{q2} = 1" }, "row2"] },
        { type: "text", name: "q2" }
      ]
    });
    const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const row = q1.visibleRows[0];
    expect(q1.rows[0].isEnabled, "First row test isEnabled, #1").toBe(false);
    expect(row.isReadOnly, "First visible row test isReadOnly, #1").toBe(true);
    expect(q1.rows[1].isEnabled, "Second row test isEnabled, #1").toBe(true);
    q2.value = 1;
    expect(q1.rows[0].isEnabled, "First row test isEnabled, #2").toBe(true);
    expect(row.isReadOnly, "First visible row test isReadOnly, #2").toBe(false);
    q2.value = 2;
    expect(q1.rows[0].isEnabled, "First row test isEnabled, #3").toBe(false);
    expect(row.isReadOnly, "First visible row test isReadOnly, #3").toBe(true);
  });
  test("rows.class, ItemValue.enableIf", () => {
    const survey = new SurveyModel();
    const prevCssValue = survey.css.matrix.rowReadOnly;
    survey.css.matrix.rowReadOnly = "disable_val";
    survey.fromJSON({
      elements: [
        { type: "matrix", name: "q1", columns: ["col1", "col2"], rows: [{ value: "row1", enableIf: "{q2} = 1" }, "row2"] },
        { type: "text", name: "q2" }
      ]
    });
    const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");

    const row = q1.visibleRows[0];

    expect(row.isReadOnly, "First visible row test isReadOnly, #1").toBe(true);
    expect(row.rowClasses.indexOf("disable_val") === -1, "css #1").toBe(false);
    expect(q1.value, "q1.value #1").toBeUndefined();
    row.cellClick(q1.columns[0]);
    expect(q1.value, "q1.value #2").toBeUndefined();
    row.value = "col1";
    expect(q1.value, "q1.value #2").toBeUndefined();
    q2.value = 1;
    expect(row.isReadOnly, "First visible row test isReadOnly, #2").toBe(false);
    expect(row.rowClasses.indexOf("disable_val") === -1, "css #2").toBe(true);
    row.cellClick(q1.columns[0]);
    expect(q1.value, "q1.value #3").toEqual({ row1: "col1" });
    row.value = "col2";
    expect(q1.value, "q1.value #4").toEqual({ row1: "col2" });
    q2.value = 2;
    expect(row.isReadOnly, "First visible row test isReadOnly, #3").toBe(true);
    expect(row.rowClasses.indexOf("disable_val") === -1, "css #3").toBe(false);

    const secondRow = q1.visibleRows[1];
    expect(secondRow.isReadOnly, "Second visible row test isReadOnly, #1").toBe(false);
    expect(secondRow.rowClasses.indexOf("disable_val") === -1, "Second row css #1").toBe(true);
    survey.readOnly = true;
    expect(secondRow.isReadOnly, "Second visible row test isReadOnly, #2").toBe(true);
    expect(secondRow.rowClasses.indexOf("disable_val") === -1, "Second row css #2").toBe(false);

    if (prevCssValue) {
      survey.css.matrix.rowReadOnly = prevCssValue;
    }
  });
  test("matrix eachRowRequired & getItemClass #7963", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2"],
          eachRowRequired: true
        },
      ],
    });
    const itemError = "required_row_error";
    survey.css = { matrix: { row: "row", rowError: "row_error", itemOnError: itemError } };
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    question.validate(true);
    const row = question.visibleRows[0];
    const column = question.columns[1];
    expect(question.getItemClass(row, column).indexOf(itemError) > -1, "itemError exists").toBe(true);
    question.value = { row1: "col1" };
    expect(question.getItemClass(row, column).indexOf(itemError) > -1, "itemError doesn't exist").toBe(false);
  });
  test("matrix isRequired & getItemClass #7963", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2"],
          isRequired: true
        },
      ],
    });
    const itemError = "required_row_error";
    survey.css = { matrix: { row: "row", rowError: "row_error", itemOnError: itemError } };
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    question.validate(true);
    const row = question.visibleRows[0];
    const column = question.columns[1];
    expect(question.getItemClass(row, column).indexOf(itemError) > -1, "itemError exists").toBe(true);
    question.value = { row2: "col1" };
    expect(question.getItemClass(row, column).indexOf(itemError) > -1, "itemError doesn't exist").toBe(false);
  });
  test("matrix eachRowRequired & isRequired & getItemClass #7963", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2"],
          isRequired: true,
          eachRowRequired: true
        },
      ],
    });
    const itemError = "required_row_error";
    survey.css = { matrix: { row: "row", rowError: "row_error", itemOnError: itemError } };
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    question.validate(true);
    const row = question.visibleRows[0];
    const column = question.columns[1];
    expect(question.getItemClass(row, column).indexOf(itemError) > -1, "itemError exists, #1").toBe(true);
    question.value = { row2: "col1" };
    expect(question.getItemClass(row, column).indexOf(itemError) > -1, "itemError exists, #2").toBe(true);
    question.value = { row1: "col1" };
    expect(question.getItemClass(row, column).indexOf(itemError) > -1, "itemError doesn't exist").toBe(false);
  });
  test("matrix eachRowRequired  & getItemClass", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2"],
          eachRowRequired: true
        },
      ],
    });
    const itemError = "required_row_error";
    survey.css = { matrix: { row: "row", rowError: "row_error", itemOnError: itemError } };
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const column1 = question.columns[0];
    const column2 = question.columns[1];
    question.visibleRows[0].cellClick(column1);
    let row = question.visibleRows[1];
    expect(question.getItemClass(row, column1).indexOf(itemError) > -1, "itemError doesn't exist in column 1, #1").toBe(false);
    expect(question.getItemClass(row, column2).indexOf(itemError) > -1, "itemError doesn't exist in column 2, #1").toBe(false);
    survey.tryComplete();
    expect(survey.state, "There is an error").toBe("running");
    row = question.visibleRows[1];
    expect(question.getItemClass(row, column1).indexOf(itemError) > -1, "itemError exists in column 1, #2").toBe(true);
    expect(question.getItemClass(row, column2).indexOf(itemError) > -1, "itemError exists in column 2, #2").toBe(true);
    row = question.visibleRows[1];
    row.cellClick(column2);
    row = question.visibleRows[1];
    expect(question.getItemClass(row, column1).indexOf(itemError) > -1, "itemError doesn't exist in column 1, #3").toBe(false);
    expect(question.getItemClass(row, column2).indexOf(itemError) > -1, "itemError doesn't exist in column 2, #3").toBe(false);
  });
  test("matrix eachRowRequired  & getItemClass", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2"],
          eachRowRequired: true
        },
      ],
      triggers: [{ type: "complete", expression: "{q2} = 1" }]
    });
    const itemError = "required_row_error";
    survey.css = { matrix: { row: "row", rowError: "row_error", itemOnError: itemError } };
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const column1 = question.columns[0];
    const column2 = question.columns[1];
    question.visibleRows[0].cellClick(column1);
    let row = question.visibleRows[1];
    expect(question.getItemClass(row, column1).indexOf(itemError) > -1, "itemError doesn't exist in column 1, #1").toBe(false);
    expect(question.getItemClass(row, column2).indexOf(itemError) > -1, "itemError doesn't exist in column 2, #1").toBe(false);
  });
  test("matrix eachRowRequired  & row visibleIf, Bug#10395.1", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1"],
          rows: ["row1", { value: "row2", visibleIf: "false" }],
          eachRowRequired: true
        },
      ]
    });
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.visibleRows.length, "There is one visible row").toBe(1);
    question.visibleRows[0].value = "col1";
    expect(question.validate(), "There is no errors").toBe(true);
  });
  test("matrix eachRowRequired  & row visibleIf, Bug#10395.2", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [{ name: "col1", cellType: "text" }],
          rows: ["row1", { value: "row2", visibleIf: "false" }],
          eachRowRequired: true
        },
      ]
    });
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.visibleRows.length, "There is one visible row").toBe(1);
    question.visibleRows[0].value = "col1";
    expect(question.validate(), "There is no errors").toBe(true);
  });
  test("matrix eachRowRequired  & row visibleIf, Bug#10395.2", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [{ name: "col1", cellType: "text", isUnique: true }],
          rows: ["row1", { value: "row2", visibleIf: "false" }],
          eachRowRequired: true
        },
      ]
    });
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    question.value = { row1: "val1", row2: "val1" };
    expect(question.visibleRows.length, "There is one visible row").toBe(1);
    expect(question.validate(), "There is no errors").toBe(true);
  });
  test("hideIfRowsEmpty & question visibleIf, bug#8459", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrix", name: "q1", visibleIf: "{a}=1", hideIfRowsEmpty: true, rows: [{ value: "row1", visibleIf: "{b}=2" }] }],
    });
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.isVisible, "#1").toBe(false);
    survey.setValue("a", 1);
    expect(question.isVisible, "#2").toBe(false);
    survey.setValue("b", 2);
    expect(question.isVisible, "#3").toBe(true);
    survey.setValue("a", 2);
    expect(question.isVisible, "#4").toBe(false);
    survey.setValue("a", 1);
    expect(question.isVisible, "#5").toBe(true);
    survey.setValue("b", 1);
    expect(question.isVisible, "#6").toBe(false);
    survey.setValue("b", 2);
    expect(question.isVisible, "#7").toBe(true);
  });
  test("row visibleIf, bug#10265", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrix", name: "q1",
        rows: [{ value: "row1", visibleIf: "{var1}=2" }, "row2"] }],
      calculatedValues: [{ name: "var1", expression: "1" }],
    });
    const calcValue = survey.calculatedValues[0];
    expect(calcValue.value, "calcValue.value is 1").toBe(1);
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.rows.length, "There are two rows").toBe(2);
    expect(question.visibleRows.length, "There is one visible row").toBe(1);
    calcValue.expression = "2";
    expect(calcValue.value, "calcValue.value is 2").toBe(2);
    expect(question.visibleRows.length, "There are two visible row after expression change").toBe(2);
  });
  test("row visibleIf, bug#10222", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrix", name: "q1",
        rows: [{ value: "row1", visibleIf: "{var1}=2" }, "row2"] }],
      calculatedValues: [{ name: "var1", expression: "2" }],
    });
    const calcValue = survey.calculatedValues[0];
    expect(calcValue.value, "calcValue.value is 2").toBe(2);
    const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.rows.length, "There are two rows").toBe(2);
    expect(question.visibleRows.length, "There is one visible row").toBe(2);
    calcValue.expression = "1";
    expect(calcValue.value, "calcValue.value is 1").toBe(1);
    expect(question.visibleRows.length, "There is one visible row after expression change").toBe(1);
  });
  test("check displayMode property", () => {
    const survey = new SurveyModel({ elements: { type: "matrix", name: "q1", rows: [{ value: "row1" }] } });
    const question = <QuestionMatrixModel>survey.getAllQuestions()[0];
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
  test("Matrix Question getFirstInputElementId - https://surveyjs.answerdesk.io/ticket/details/T2048", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    matrix.value = { row1: "col2", row2: "col3", row3: "col1" };

    expect(matrix["getFirstInputElementId"](), "First row name 0th control").toBe(matrix.inputId + "_row1_0");
  });

  test("Rubric Matrix Question cells load from JSON", () => {
    let survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1"],
        rows: ["row1"]
      }]
    });
    var matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    expect(matrix.hasCellText, "There is no cell text").toBe(false);
    survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1"],
        rows: ["row1"],
        cells: { default: { col1: "text" } }
      }]
    });
    matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    expect(matrix.hasCellText, "There is cell text").toBe(true);
  });

  test("Rubric Matrix Question cells get/set cell text", () => {
    var matrix = new QuestionMatrixModel("q1");
    let counter = 0;
    matrix.registerPropertyChangedHandlers(["cells"], () => {
      counter++;
    });
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    expect(matrix.hasCellText, "There is no cell text").toBe(false);
    expect(counter, "no changes in cells").toBe(0);
    matrix.setCellText(0, 0, "cell11");
    expect(counter, "one change in cells").toBe(1);
    expect(matrix.hasCellText, "There is cell text").toBe(true);
    expect(matrix.getCellText(0, 0), "get/set by index works correctly").toBe("cell11");
    matrix.setCellText(0, 0, "");
    expect(counter, "second cells change").toBe(2);
    expect(matrix.cells.isEmpty, "Cells are emtpy").toBe(true);
    expect(matrix.hasCellText, "There is no cell text again").toBe(false);
  });
  test("Rubric Matrix Question cells get cell displayText", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    matrix.setCellText(0, 0, "cell11");
    expect(matrix.getCellDisplayText(0, 0), "get cell text by indexes").toBe("cell11");
    expect(matrix.getCellDisplayText(matrix.rows[0], matrix.columns[0]), "get cell text by objects").toBe("cell11");
    expect(matrix.getCellDisplayText(matrix.rows[0], matrix.columns[1]), "get column text by indexes").toBe("col2");
    expect(matrix.getCellDisplayText(matrix.rows[0], matrix.columns[1]), "get column text by objects").toBe("col2");
  });

  test("Rubric Matrix Question cells serialize/deserialize", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    matrix.setCellText(0, 0, "cell11");
    matrix.setCellText(0, 1, "cell12");
    matrix.setCellText(1, 1, "cell22");
    var json = matrix.toJSON();
    expect(json, "serialized correctly").toEqual({
      name: "q1",
      rows: ["row1", "row2"],
      columns: ["col1", "col2"],
      cells: {
        row1: { col1: "cell11", col2: "cell12" },
        row2: { col2: "cell22" },
      },
    });
    var matrix2 = new QuestionMatrixModel("q2");
    matrix2.fromJSON(json);
    expect(matrix2.getCellText(0, 0), "deserialized correctly, cell11").toBe("cell11");
    expect(matrix2.getCellText(0, 1), "deserialized correctly, cell12").toBe("cell12");
    expect(matrix2.getCellText(1, 1), "deserialized correctly, cell22").toBe("cell22");
  });
  test("Rubric Matrix Question cells default row", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    matrix.setDefaultCellText(1, "defaultCell2");
    matrix.setCellText(0, 0, "cell11");

    expect(matrix.getCellDisplayText(0, 0), "Use cell text").toBe("cell11");
    expect(matrix.getCellDisplayText(0, 1), "Use default row cell text").toBe("defaultCell2");
    expect(matrix.getCellDisplayText(1, 0), "Use rows text").toBe("col1");
    var json = matrix.toJSON();
    expect(json, "serialized correctly").toEqual({
      name: "q1",
      rows: ["row1", "row2"],
      columns: ["col1", "col2"],
      cells: {
        default: { col2: "defaultCell2" },
        row1: { col1: "cell11" },
      },
    });
    var matrix2 = new QuestionMatrixModel("q2");
    matrix2.fromJSON(json);
    expect(matrix2.getCellText(0, 0), "deserialized correctly, cell11").toBe("cell11");
    expect(matrix2.getDefaultCellText(1), "deserialized default cell correctly, defaultCell2").toBe("defaultCell2");
  });
  test("Rubric Matrix Question cells and onTextMarkdown, Bug#5306", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1"],
        rows: ["row1"],
        cells: { row1: { col1: "text!!" } }
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    const cellLocStr = matrix.cells.getCellDisplayLocText(0, 0);
    expect(cellLocStr.textOrHtml).toBe("text!!");
    survey.onTextMarkdown.add((sender, options) => {
      if (options.text === "text!!") {
        options.html = "!!text";
      }
    });
    expect(cellLocStr.textOrHtml).toBe("!!text");
  });
  test("Rubric Matrix Question cells. Allow to change text value via cell editing, Bug#8871 #1", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: [{ value: "col1", text: "Column 1" }, "col2"],
        rows: ["row1", "row2"]
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    expect(matrix.cells.isEmpty, "It is empty").toBe(true);
    const cell0_0 = matrix.cells.getCellDisplayLocText(matrix.rows[0].value, matrix.columns[0].value);
    expect(cell0_0.textOrHtml, "the value is in column").toBe("Column 1");
    cell0_0.setLocaleText("", "Cell[0, 0]");
    expect(matrix.cells.isEmpty, "It is not empty").toBe(false);
    expect(matrix.cells.getJson(), "cells value").toEqual({ row1: { col1: "Cell[0, 0]" } });
    cell0_0.setLocaleText("", "");
    expect(matrix.cells.isEmpty, "It is empty again").toBe(true);
  });
  test("Update loc strings on changing values, Bug#8871 #2", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1", "col2"],
        rows: ["row1", "row2"]
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    const cell0_0 = matrix.cells.getCellDisplayLocText(matrix.rows[0].value, matrix.columns[0].value);
    const cell1_1 = matrix.cells.getCellDisplayLocText(1, 1);
    expect(cell0_0.textOrHtml, "0_0 #1").toBe("col1");
    expect(cell1_1.textOrHtml, "1_1 #1").toBe("col2");
    matrix.cells.setJson({ row1: { col1: "cells[0,0]" }, row2: { col2: "cells[1,1]" } });
    expect(cell0_0.textOrHtml, "0_0 #2").toBe("cells[0,0]");
    expect(cell1_1.textOrHtml, "1_1 #2").toBe("cells[1,1]");
    matrix.cells.setJson({ row2: { col2: "cells[11,11]" } });
    expect(cell0_0.textOrHtml, "0_0 #3").toBe("col1");
    expect(cell1_1.textOrHtml, "1_1 #3").toBe("cells[11,11]");
    expect((<any>matrix).isValueSurveyElement(matrix.cells), "cells is Survey element").toBe(true);
    expect((<any>matrix).isValueSurveyElement(matrix.bindings), "bindings is Survey element").toBe(true);
    expect((<any>matrix).isValueSurveyElement({ id: 5, text: "abc" }), "an object is not Survey element").toBe(false);
  });
  test("Do not copy default rows value, Bug#8871 #3", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1", "col2"],
        rows: ["row1", "row2"]
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    matrix.cells.setJson({ default: { col1: "col1_default", col2: "col2_default" },
      row1: { col1: "col1", col2: "col2_default" },
      row2: { col1: "col1_default", col2: "col2" } });
    expect(matrix.cells.getJson()).toEqual({ default: { col1: "col1_default", col2: "col2_default" },
      row1: { col1: "col1" }, row2: { col2: "col2" } });
  });
  test("Support locales in matrix cells, Bug#9593", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1", "col2"],
        rows: ["row1", "row2"]
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    matrix.cells.setCellText(0, 0, "cell00");
    matrix.cells.setCellText(1, 1, "cell11");
    matrix.cells.getCellDisplayLocText(0, 0).setLocaleText("fr", "cell00_fr");
    matrix.cells.getCellDisplayLocText(1, 1).setLocaleText("fr", "cell11_fr");
    expect(matrix.cells.getJson(), "#1").toEqual({
      row1: { col1: { default: "cell00", fr: "cell00_fr" } },
      row2: { col2: { default: "cell11", fr: "cell11_fr" } } });
    matrix.cells.setJson({
      row1: { col2: { default: "cell01", fr: "cell01_fr" } },
      row2: { col1: { default: "cell10", fr: "cell10_fr" } } });
    expect(matrix.cells.getCellDisplayLocText(0, 1).getLocaleText("fr"), "getlocale text #2").toBe("cell01_fr");
    expect(matrix.cells.getCellDisplayLocText(1, 0).getLocaleText("fr"), "getlocale text #2").toBe("cell10_fr");
    expect(matrix.cells.getCellText(0, 0), "get text #0.0").toBe("col1");
    expect(matrix.cells.getCellText(0, 1), "get text #0.1").toBe("cell01");
    expect(matrix.cells.getCellText(1, 0), "get text #1.0").toBe("cell10");
    expect(matrix.cells.getCellText(1, 1), "get text #1.1").toBe("col2");
  });
  test("Changing isMultiSelect on the fly - correct values", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1", "col2", "col3"],
        rows: ["row1", "row2"]
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    matrix.value = { row1: "col1", row2: "col2" };
    matrix.cellType = "checkbox";
    expect(matrix.value, "value #1").toEqual({ row1: ["col1"], row2: ["col2"] });
    matrix.value = { row1: "col2", row2: "col1" };
    expect(matrix.value, "value #2").toEqual({ row1: ["col2"], row2: ["col1"] });
    matrix.cellType = "radio";
    expect(matrix.value, "value  #3").toEqual({ row1: "col2", row2: "col1" });
    matrix.value = { row1: ["col2", "col3"], row2: ["col3", "col1"] };
    expect(matrix.value, "value  #4").toEqual({ row1: "col2", row2: "col3" });
    matrix.value = undefined;
    matrix.cellType = "checkbox";
    expect(matrix.value, "value is undefined #1").toBeUndefined();
    matrix.cellType = "radio";
    expect(matrix.value, "value is undefined #2").toBeUndefined();
    matrix.value = null;
    matrix.cellType = "checkbox";
    expect(matrix.value, "value is null #1").toBeUndefined();
    matrix.cellType = "radio";
    expect(matrix.value, "value is null #2").toBeUndefined();
    matrix.value = { row1: "col1", row2: "col2" };
    survey.setValue("matrix", undefined);
    expect(matrix.value, "value is undefined #3").toBeUndefined();
    matrix.cellType = "checkbox";
    matrix.value = { row1: ["col2", "col3"], row2: ["col3", "col1"] };
    survey.setValue("matrix", undefined);
    expect(matrix.value, "value is undefined #4").toBeUndefined();
  });
  test("isMultiSelect default value is not array", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1", "col2", "col3"],
        rows: ["row1", "row2"],
        defaultValue: { row1: "col1", row2: "col2" },
        cellType: "checkbox"
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    expect(matrix.value, "default value is array").toEqual({ row1: ["col1"], row2: ["col2"] });
  });
  test("isMultiSelect default value is array", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: ["col1", "col2", "col3"],
        rows: ["row1", "row2"],
        defaultValue: { row1: ["col2", "col1"], row2: ["col1", "col3"] }
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    expect(matrix.value, "default value is not array").toEqual({ row1: "col2", row2: "col1" });
  });
  test("set incorrect cellType", () => {
    const matrix = new QuestionMatrixModel("matrix");
    expect(matrix.cellType, "cellType #1").toBe("radio");
    matrix.cellType = "checkbox";
    expect(matrix.cellType, "cellType #2").toBe("checkbox");
    matrix.cellType = "dropdown";
    expect(matrix.cellType, "cellType #3, incorrect value is not set").toBe("radio");
  });
  test("isExclusive property for the column in single matrix, Issue#10357", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: [
          { value: "col1" },
          { value: "col2", isExclusive: true },
          { value: "col3" }
        ],
        rows: ["row1", "row2"],
        cellType: "checkbox"
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    const col1 = matrix.columns[0];
    const col2 = matrix.columns[1];
    const col3 = matrix.columns[2];
    expect(col2.isExclusive, "isExclusive #1").toBe(true);
    matrix.value = { row1: ["col1", "col3"], row2: ["col3"] };
    matrix.cellClick(matrix.visibleRows[0], col2);
    matrix.cellClick(matrix.visibleRows[1], col2);
    expect(matrix.value, "value after click on exclusive column, #1").toEqual({ row1: ["col2"], row2: ["col2"] });
    matrix.cellClick(matrix.visibleRows[0], col2);
    matrix.cellClick(matrix.visibleRows[1], col2);
    expect(matrix.value, "value after click on exclusive column, #2").toEqual({ });
    matrix.cellClick(matrix.visibleRows[0], col2);
    matrix.cellClick(matrix.visibleRows[1], col2);
    expect(matrix.value, "value after click on exclusive column, #3").toEqual({ row1: ["col2"], row2: ["col2"] });
    matrix.cellClick(matrix.visibleRows[0], col1);
    matrix.cellClick(matrix.visibleRows[0], col3);
    matrix.cellClick(matrix.visibleRows[1], col1);
    matrix.cellClick(matrix.visibleRows[1], col3);
    expect(matrix.value, "value after click on exclusive column, #4").toEqual({ row1: ["col1", "col3"], row2: ["col1", "col3"] });

    col2.isExclusive = false;
    matrix.value = { row1: ["col1", "col3"], row2: ["col3"] };
    matrix.cellClick(matrix.visibleRows[0], col2);
    matrix.cellClick(matrix.visibleRows[1], col2);
    expect(matrix.value, "value after click on non-exclusive column").toEqual({ row1: ["col1", "col3", "col2"], row2: ["col3", "col2"] });
  });
  test("Show isExclusive property when matrix cellType is checkbox, Issue#10357", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "matrix",
        columns: [
          { value: "col1" },
          { value: "col2", isExclusive: true },
          { value: "col3" }
        ],
        rows: ["row1", "row2"],
        cellType: "checkbox"
      }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    const prop = Serializer.findProperty("matrixcolumn", "isExclusive");
    expect(prop, "isExclusive property is here").toBeTruthy();
    expect(prop.isVisible("", matrix.columns[0]), "isExclusive is visible for checkbox").toBe(true);
    matrix.cellType = "radio";
    expect(prop.isVisible("", matrix.columns[0]), "isExclusive is invisible for radio").toBe(false);
    matrix.cellType = "checkbox";
    expect(prop.isVisible("", matrix.columns[0]), "isExclusive is visible for checkbox again").toBe(true);
  });
  test("Add obj into options of onProcessDynamicText event, Issue#9604", () => {
    Serializer.addProperty("itemvalue", "score:number");

    const survey = new SurveyModel();
    survey.onProcessDynamicText.add((survey, options) => {
      if (options.name === "score") {
        options.value = (<any>options.element).score;
      }
    });
    survey.fromJSON({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: [
            { value: 1, text: "Item 1: {score}", score: 10 },
            { value: 2, text: "Item 2: {$self.score}", score: 20 }
          ],
          rows: ["row1", "row2"]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const col1 = q1.columns[0];
    const col2 = q1.columns[1];
    expect(col1.locTitle.renderedHtml, "process {$self.score} for col1").toBe("Item 1: 10");
    expect(col2.locTitle.renderedHtml, "process {$self.score} for col2").toBe("Item 2: 20");
    q1.columns[0].score = 30;
    q1.columns[1].score = 40;
    expect(col1.locTitle.renderedHtml, "process {$self.score} for col1 after change").toBe("Item 1: 30");
    expect(col2.locTitle.renderedHtml, "process {$self.score} for col2 after change").toBe("Item 2: 40");

    Serializer.removeProperty("itemvalue", "score");
  });
  test("getPlainData returns display texts for matrix with cellType checkbox, Bug#11175", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrix",
        name: "q1",
        columns: [
          { value: "a", text: "Option A" },
          { value: "b", text: "Option B" }
        ],
        rows: [
          { value: "r1", text: "Row 1" }
        ],
        cellType: "checkbox"
      }]
    });
    survey.data = { q1: { r1: ["a"] } };
    const plainData = survey.getPlainData();
    const qData = plainData[0];
    expect(qData.displayValue, "displayValue should contain display texts, not values").toEqual({ "Row 1": ["Option A"] });
    const rowData = qData.data[0];
    expect(rowData.title, "row title").toBe("Row 1");
    expect(rowData.displayValue, "row displayValue should contain display texts").toEqual(["Option A"]);
  });
});
