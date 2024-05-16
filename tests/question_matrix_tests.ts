import { Helpers } from "../src/helpers";
import { QuestionMatrixModel } from "../src/question_matrix";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_QuestionMatrix");

QUnit.test("Matrix Question isAllRowRequired property", function (assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.hasErrors(), false, "There is no errors by default");
  matrix.isAllRowRequired = true;
  assert.equal(matrix.hasErrors(), true, "There is no errors by default");
});
QUnit.test(
  "Matrix Question isAllRowRequired property, value is zero, Bug#2332",
  function (assert) {
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
      isAllRowRequired: true,
    });
    var rows = matrix.visibleRows;
    assert.equal(matrix.hasErrors(), true, "is Required error");
    rows[0].value = 0;
    assert.equal(matrix.hasErrors(), true, "isAllRowRequired error");
    rows[1].value = 0;
    assert.deepEqual(
      matrix.value,
      { item1: 0, item2: 0 },
      "value set correctly"
    );
    assert.equal(rows[0].value, 0, "First row value set correctly");
    assert.equal(rows[1].value, 0, "Second row value set correctly");
    assert.equal(matrix.hasErrors(), false, "There is no errors");
  }
);
QUnit.test("Matrix Question eachRowUnique property", function (assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.validate(), true, "validate #1");
  matrix.eachRowUnique = true;
  assert.equal(matrix.validate(), true, "validate #2");
  matrix.value = { row1: "col1" };
  assert.equal(matrix.validate(), true, "validate #3");
  matrix.value = { row2: "col1" };
  assert.equal(matrix.validate(), true, "validate #4");
  matrix.value = { row1: "col1", row2: "col1" };
  assert.equal(matrix.validate(), false, "validate #5");
  matrix.value = { row1: "col1", row2: "col2" };
  assert.equal(matrix.validate(), true, "validate #6");
  matrix.value = { row1: "col2", row2: "col2" };
  assert.equal(matrix.validate(), false, "validate #7");
});
QUnit.test("matrix row, rowClasses property, isAllRowRequired", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrix",
        name: "q1",
        columns: ["col1", "col2"],
        rows: ["row1", "row2"],
        isAllRowRequired: true,
      },
    ],
  });
  survey.css = { matrix: { row: "row", rowError: "row_error" } };
  var question = <QuestionMatrixModel>survey.getQuestionByName("q1");
  assert.ok(question.cssClasses.row, "Row class is not empty");
  assert.equal(question.visibleRows[0].rowClasses, "row", "Set row class");
  question.validate();
  assert.equal(question.visibleRows[0].rowClasses, "row row_error", "Error for the first row");
  question.visibleRows[0].value = "col1";
  assert.equal(question.visibleRows[0].rowClasses, "row", "first row value is set");
  assert.equal(question.visibleRows[1].rowClasses, "row row_error", "Error for the second row");
});
QUnit.test("matrix row, rowClasses property, eachRowUnique", function (assert) {
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
  assert.ok(question.cssClasses.row, "Row class is not empty");
  assert.equal(question.hasErrorInRow(question.visibleRows[0]), false, "hasErrorInRow(0)");
  assert.equal(question.visibleRows[0].hasError, false, "visibleRows[0].hasError");
  assert.equal(question.visibleRows[0].rowClasses, "row", "Set row class");
  question.value = { row1: "col1", row2: "col1" };
  question.validate();
  assert.equal(question.hasErrorInRow(question.visibleRows[0]), false, "hasErrorInRow(0) #1");
  assert.equal(question.visibleRows[0].hasError, false, "visibleRows[0].hasError #1");
  assert.equal(question.visibleRows[0].rowClasses, "row", "first row #1");
  assert.equal(question.hasErrorInRow(question.visibleRows[1]), true, "hasErrorInRow(1) #1");
  assert.equal(question.visibleRows[1].hasError, true, "visibleRows[1].hasError #1");
  assert.equal(question.visibleRows[1].rowClasses, "row row_error", "second row #1");
  question.visibleRows[1].value = "col2";
  assert.equal(question.hasErrorInRow(question.visibleRows[0]), false, "hasErrorInRow(0) #2");
  assert.equal(question.visibleRows[0].hasError, false, "visibleRows[0].hasError #2");
  assert.equal(question.visibleRows[0].rowClasses, "row", "first row #2");
  assert.equal(question.hasErrorInRow(question.visibleRows[1]), false, "hasErrorInRow(1) #2");
  assert.equal(question.visibleRows[1].hasError, false, "visibleRows[1].hasError #2");
  assert.equal(question.visibleRows[1].rowClasses, "row", "second row #2");
});
QUnit.test("matrix row, rowClasses property, #7889", function (assert) {
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
  assert.ok(question.cssClasses.row, "Row class is not empty");
  assert.equal(question.hasErrorInRow(question.visibleRows[0]), false, "hasErrorInRow(0), #1");
  assert.equal(question.visibleRows[0].hasError, false, "visibleRows[0].hasError, #1");
  assert.equal(question.hasErrorInRow(question.visibleRows[1]), false, "hasErrorInRow(1), #2");
  assert.equal(question.visibleRows[1].hasError, false, "visibleRows[1].hasError, #2");
  assert.equal(question.hasErrorInRow(question.visibleRows[2]), false, "hasErrorInRow(2), #3");
  assert.equal(question.visibleRows[2].hasError, false, "visibleRows[2].hasError, #3");
  question.visibleRows[0].cellClick(question.columns[0]);
  assert.deepEqual(question.value, { row1: "col1" }, "value is set #4");
  assert.equal(question.hasErrorInRow(question.visibleRows[0]), false, "hasErrorInRow(0), #5");
  assert.equal(question.visibleRows[0].hasError, false, "visibleRows[0].hasError, #5");
  assert.equal(question.hasErrorInRow(question.visibleRows[1]), false, "hasErrorInRow(1), #6");
  assert.equal(question.visibleRows[1].hasError, false, "visibleRows[1].hasError, #6");
  assert.equal(question.hasErrorInRow(question.visibleRows[2]), false, "hasErrorInRow(2), #7");
  assert.equal(question.visibleRows[2].hasError, false, "visibleRows[2].hasError, #7");
});
QUnit.test("check row randomization in design mode", (assert) => {

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
  Helpers.randomizeArray = (array: Array<any>): Array<any> => {
    randomizedCount++;
    return array;
  };

  randomizedCount = 0;
  survey.setDesignMode(false);
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 1);

  survey.setDesignMode(true);
  randomizedCount = 0;
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 0);

  q1.rowsOrder = "initial";

  randomizedCount = 0;
  survey.setDesignMode(false);
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 0);

  survey.setDesignMode(true);
  randomizedCount = 0;
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 0);

});
QUnit.test("rows, ItemValue.enableIf", (assert) => {
  const survey = new SurveyModel({
    elements: [
      { type: "matrix", name: "q1", columns: ["col1"], rows: [{ value: "row1", enableIf: "{q2} = 1" }, "row2"] },
      { type: "text", name: "q2" }
    ]
  });
  const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const row = q1.visibleRows[0];
  assert.equal(q1.rows[0].isEnabled, false, "First row test isEnabled, #1");
  assert.equal(row.isReadOnly, true, "First visible row test isReadOnly, #1");
  assert.equal(q1.rows[1].isEnabled, true, "Second row test isEnabled, #1");
  q2.value = 1;
  assert.equal(q1.rows[0].isEnabled, true, "First row test isEnabled, #2");
  assert.equal(row.isReadOnly, false, "First visible row test isReadOnly, #2");
  q2.value = 2;
  assert.equal(q1.rows[0].isEnabled, false, "First row test isEnabled, #3");
  assert.equal(row.isReadOnly, true, "First visible row test isReadOnly, #3");
});
QUnit.test("rows.class, ItemValue.enableIf", (assert) => {
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

  assert.equal(row.isReadOnly, true, "First visible row test isReadOnly, #1");
  assert.equal(row.rowClasses.indexOf("disable_val") === -1, false, "css #1");
  assert.equal(q1.value, undefined, "q1.value #1");
  row.cellClick(q1.columns[0]);
  assert.equal(q1.value, undefined, "q1.value #2");
  row.value = "col1";
  assert.equal(q1.value, undefined, "q1.value #2");
  q2.value = 1;
  assert.equal(row.isReadOnly, false, "First visible row test isReadOnly, #2");
  assert.equal(row.rowClasses.indexOf("disable_val") === -1, true, "css #2");
  row.cellClick(q1.columns[0]);
  assert.deepEqual(q1.value, { row1: "col1" }, "q1.value #3");
  row.value = "col2";
  assert.deepEqual(q1.value, { row1: "col2" }, "q1.value #4");
  q2.value = 2;
  assert.equal(row.isReadOnly, true, "First visible row test isReadOnly, #3");
  assert.equal(row.rowClasses.indexOf("disable_val") === -1, false, "css #3");

  const secondRow = q1.visibleRows[1];
  assert.equal(secondRow.isReadOnly, false, "Second visible row test isReadOnly, #1");
  assert.equal(secondRow.rowClasses.indexOf("disable_val") === -1, true, "Second row css #1");
  survey.mode = "display";
  assert.equal(secondRow.isReadOnly, true, "Second visible row test isReadOnly, #2");
  assert.equal(secondRow.rowClasses.indexOf("disable_val") === -1, false, "Second row css #2");

  if(prevCssValue) {
    survey.css.matrix.rowReadOnly = prevCssValue;
  }
});
QUnit.test("matrix isAllRowRequired & getItemClass #7963", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrix",
        name: "q1",
        columns: ["col1", "col2"],
        rows: ["row1", "row2"],
        isAllRowRequired: true
      },
    ],
  });
  const itemError = "required_row_error";
  survey.css = { matrix: { row: "row", rowError: "row_error", itemOnError: itemError } };
  const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
  question.validate(true);
  const row = question.visibleRows[0];
  const column = question.columns[1];
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, true, "itemError exists");
  question.value = { row1: "col1" };
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, false, "itemError doesn't exist");
});
QUnit.test("matrix isRequired & getItemClass #7963", function (assert) {
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
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, true, "itemError exists");
  question.value = { row2: "col1" };
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, false, "itemError doesn't exist");
});
QUnit.test("matrix isAllRowRequired & isRequired & getItemClass #7963", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrix",
        name: "q1",
        columns: ["col1", "col2"],
        rows: ["row1", "row2"],
        isRequired: true,
        isAllRowRequired: true
      },
    ],
  });
  const itemError = "required_row_error";
  survey.css = { matrix: { row: "row", rowError: "row_error", itemOnError: itemError } };
  const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
  question.validate(true);
  const row = question.visibleRows[0];
  const column = question.columns[1];
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, true, "itemError exists, #1");
  question.value = { row2: "col1" };
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, true, "itemError exists, #2");
  question.value = { row1: "col1" };
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, false, "itemError doesn't exist");
});
QUnit.test("matrix isAllRowRequired  & getItemClass", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrix",
        name: "q1",
        columns: ["col1", "col2"],
        rows: ["row1", "row2"],
        isAllRowRequired: true
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
  assert.equal(question.getItemClass(row, column1).indexOf(itemError) > -1, false, "itemError doesn't exist in column 1, #1");
  assert.equal(question.getItemClass(row, column2).indexOf(itemError) > -1, false, "itemError doesn't exist in column 2, #1");
  survey.completeLastPage();
  assert.equal(survey.state, "running", "There is an error");
  row = question.visibleRows[1];
  assert.equal(question.getItemClass(row, column1).indexOf(itemError) > -1, true, "itemError exists in column 1, #2");
  assert.equal(question.getItemClass(row, column2).indexOf(itemError) > -1, true, "itemError exists in column 2, #2");
  row = question.visibleRows[1];
  row.cellClick(column2);
  row = question.visibleRows[1];
  assert.equal(question.getItemClass(row, column1).indexOf(itemError) > -1, false, "itemError doesn't exist in column 1, #3");
  assert.equal(question.getItemClass(row, column2).indexOf(itemError) > -1, false, "itemError doesn't exist in column 2, #3");
});
