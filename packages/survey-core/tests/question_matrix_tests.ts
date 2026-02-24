import { Helpers } from "../src/helpers";
import { QuestionMatrixModel } from "../src/question_matrix";
import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";

export default QUnit.module("Survey_QuestionMatrix");

QUnit.test("Matrix Question eachRowRequired property", function (assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.validate(), true, "There is no errors by default");
  matrix.eachRowRequired = true;
  assert.equal(matrix.validate(), false, "There is no errors by default");
});
QUnit.test(
  "Matrix Question eachRowRequired property, value is zero, Bug#2332",
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
      eachRowRequired: true,
    });
    var rows = matrix.visibleRows;
    assert.equal(matrix.validate(), false, "is Required error");
    rows[0].value = 0;
    assert.equal(matrix.validate(), false, "eachRowRequired error");
    rows[1].value = 0;
    assert.deepEqual(
      matrix.value,
      { item1: 0, item2: 0 },
      "value set correctly"
    );
    assert.equal(rows[0].value, 0, "First row value set correctly");
    assert.equal(rows[1].value, 0, "Second row value set correctly");
    assert.equal(matrix.validate(), true, "There is no errors");
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
QUnit.test("matrix row, rowClasses property, eachRowRequired", function (assert) {
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
QUnit.test("matrix row, cellClick&isChecked", function (assert) {
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
  assert.equal(rows.length, 3, "rows 3");
  assert.equal(rows[0].value, undefined, "row1 value is empty");
  assert.equal(rows[0].isChecked(question.columns[0]), false, "row1 isChecked col1 #1");
  assert.equal(rows[0].isChecked(question.columns[1]), false, "row1 isChecked col2 #1");
  rows[0].cellClick(question.columns[1]);
  assert.equal(rows[0].value, "col2", "row1 value is col2");
  assert.equal(rows[0].isChecked(question.columns[0]), false, "row1 isChecked col1 #2");
  assert.equal(rows[0].isChecked(question.columns[1]), true, "row1 isChecked col2 #2");
  rows[1].cellClick(question.columns[0]);
  assert.equal(rows[1].value, "col1", "row2 value is col1");
  assert.equal(rows[1].isChecked(question.columns[0]), true, "row2 isChecked col1 #1");
  assert.equal(rows[1].isChecked(question.columns[1]), false, "row2 isChecked col2 #1");
  assert.deepEqual(question.value, { row1: "col2", row2: "col1" }, "value is set correctly");
});
QUnit.test("matrix row, cellClick&isChecked, isMultiSelect", function (assert) {
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
  assert.ok(question.isMultiSelect, "isMultiSelect is true");
  const rows = question.visibleRows;
  assert.equal(rows.length, 3, "rows 3");
  assert.deepEqual(rows[0].value, undefined, "row1 value is empty");
  assert.equal(rows[0].isChecked(question.columns[0]), false, "row1 isChecked col1 #1");
  assert.equal(rows[0].isChecked(question.columns[1]), false, "row1 isChecked col2 #1");
  rows[0].cellClick(question.columns[1]);
  assert.deepEqual(rows[0].value, ["col2"], "row1 value is col2");
  assert.equal(rows[0].isChecked(question.columns[0]), false, "row1 isChecked col1 #2");
  assert.equal(rows[0].isChecked(question.columns[1]), true, "row1 isChecked col2 #2");
  rows[0].cellClick(question.columns[0]);
  assert.deepEqual(rows[0].value, ["col2", "col1"], "row1 value is col2, col1");
  assert.equal(rows[0].isChecked(question.columns[0]), true, "row1 isChecked col1 #3");
  assert.equal(rows[0].isChecked(question.columns[1]), true, "row1 isChecked col2 #3");
  rows[1].cellClick(question.columns[0]);
  assert.deepEqual(rows[1].value, ["col1"], "row2 value is col1");
  assert.equal(rows[1].isChecked(question.columns[0]), true, "row2 isChecked col1 #1");
  assert.equal(rows[1].isChecked(question.columns[1]), false, "row2 isChecked col2 #1");
  assert.deepEqual(question.value, { row1: ["col2", "col1"], row2: ["col1"] }, "value is set correctly, #1");
  rows[0].cellClick(question.columns[1]);
  assert.equal(rows[0].isChecked(question.columns[0]), true, "row1 isChecked col1 #3");
  assert.equal(rows[0].isChecked(question.columns[1]), false, "row1 isChecked col2 #3");
  rows[1].cellClick(question.columns[0]);
  assert.equal(rows[1].isChecked(question.columns[0]), false, "row2 isChecked col1 #2");
  assert.equal(rows[1].isChecked(question.columns[1]), false, "row2 isChecked col2 #2");
  assert.equal(rows[1].value, undefined, "row2 value is set correctly, #2");
  assert.deepEqual(question.value, { row1: ["col1"] }, "value is set correctly, #2");
  assert.deepEqual(survey.data, { q1: { row1: ["col1"] } }, "survey.data, #1");
  survey.doComplete();
  assert.deepEqual(survey.data, { q1: { row1: ["col1"] } }, "survey.data, #2");
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
  const oldFunc = Helpers.randomizeArray;
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

  q1.rowOrder = "initial";

  randomizedCount = 0;
  survey.setDesignMode(false);
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 0);

  survey.setDesignMode(true);
  randomizedCount = 0;
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 0);

  Helpers.randomizeArray = oldFunc;
});
QUnit.test("check row randomization with seed", (assert) => {
  const survey = new SurveyModel({
    pages: [
      {
        name: "p1",
        elements: [
          {
            type: "matrix",
            name: "q1",
            columns: [
              "Column 1",
              "Column 2"
            ],
            rows: [
              "r1",
              "r2",
              "r3",
              "r4",
              "r5",
              "r6",
              "r7",
              "r8",
              "r9",
            ],
            rowsOrder: "random"
          }
        ]
      }
    ]
  });
  survey.randomSeed = 12345;
  const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.visibleRows.map(e => e.name), ["r8", "r4", "r2", "r5", "r7", "r1", "r6", "r9", "r3"], "Row order for seed 12345");
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
  survey.readOnly = true;
  assert.equal(secondRow.isReadOnly, true, "Second visible row test isReadOnly, #2");
  assert.equal(secondRow.rowClasses.indexOf("disable_val") === -1, false, "Second row css #2");

  if (prevCssValue) {
    survey.css.matrix.rowReadOnly = prevCssValue;
  }
});
QUnit.test("matrix eachRowRequired & getItemClass #7963", function (assert) {
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
QUnit.test("matrix eachRowRequired & isRequired & getItemClass #7963", function (assert) {
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
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, true, "itemError exists, #1");
  question.value = { row2: "col1" };
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, true, "itemError exists, #2");
  question.value = { row1: "col1" };
  assert.equal(question.getItemClass(row, column).indexOf(itemError) > -1, false, "itemError doesn't exist");
});
QUnit.test("matrix eachRowRequired  & getItemClass", function (assert) {
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
  assert.equal(question.getItemClass(row, column1).indexOf(itemError) > -1, false, "itemError doesn't exist in column 1, #1");
  assert.equal(question.getItemClass(row, column2).indexOf(itemError) > -1, false, "itemError doesn't exist in column 2, #1");
  survey.tryComplete();
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
QUnit.test("matrix eachRowRequired  & getItemClass", function (assert) {
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
  assert.equal(question.getItemClass(row, column1).indexOf(itemError) > -1, false, "itemError doesn't exist in column 1, #1");
  assert.equal(question.getItemClass(row, column2).indexOf(itemError) > -1, false, "itemError doesn't exist in column 2, #1");
});
QUnit.test("matrix eachRowRequired  & row visibleIf, Bug#10395.1", function (assert) {
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
  assert.equal(question.visibleRows.length, 1, "There is one visible row");
  question.visibleRows[0].value = "col1";
  assert.equal(question.validate(), true, "There is no errors");
});
QUnit.test("matrix eachRowRequired  & row visibleIf, Bug#10395.2", function (assert) {
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
  assert.equal(question.visibleRows.length, 1, "There is one visible row");
  question.visibleRows[0].value = "col1";
  assert.equal(question.validate(), true, "There is no errors");
});
QUnit.test("matrix eachRowRequired  & row visibleIf, Bug#10395.2", function (assert) {
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
  assert.equal(question.visibleRows.length, 1, "There is one visible row");
  assert.equal(question.validate(), true, "There is no errors");
});
QUnit.test("hideIfRowsEmpty & question visibleIf, bug#8459", function (assert) {
  const survey = new SurveyModel({
    elements: [{ type: "matrix", name: "q1", visibleIf: "{a}=1", hideIfRowsEmpty: true, rows: [{ value: "row1", visibleIf: "{b}=2" }] }],
  });
  const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
  assert.equal(question.isVisible, false, "#1");
  survey.setValue("a", 1);
  assert.equal(question.isVisible, false, "#2");
  survey.setValue("b", 2);
  assert.equal(question.isVisible, true, "#3");
  survey.setValue("a", 2);
  assert.equal(question.isVisible, false, "#4");
  survey.setValue("a", 1);
  assert.equal(question.isVisible, true, "#5");
  survey.setValue("b", 1);
  assert.equal(question.isVisible, false, "#6");
  survey.setValue("b", 2);
  assert.equal(question.isVisible, true, "#7");
});
QUnit.test("row visibleIf, bug#10265", function (assert) {
  const survey = new SurveyModel({
    elements: [{ type: "matrix", name: "q1",
      rows: [{ value: "row1", visibleIf: "{var1}=2" }, "row2"] }],
    calculatedValues: [{ name: "var1", expression: "1" }],
  });
  const calcValue = survey.calculatedValues[0];
  assert.equal(calcValue.value, 1, "calcValue.value is 1");
  const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
  assert.equal(question.rows.length, 2, "There are two rows");
  assert.equal(question.visibleRows.length, 1, "There is one visible row");
  calcValue.expression = "2";
  assert.equal(calcValue.value, 2, "calcValue.value is 2");
  assert.equal(question.visibleRows.length, 2, "There are two visible row after expression change");
});
QUnit.test("row visibleIf, bug#10222", function (assert) {
  const survey = new SurveyModel({
    elements: [{ type: "matrix", name: "q1",
      rows: [{ value: "row1", visibleIf: "{var1}=2" }, "row2"] }],
    calculatedValues: [{ name: "var1", expression: "2" }],
  });
  const calcValue = survey.calculatedValues[0];
  assert.equal(calcValue.value, 2, "calcValue.value is 2");
  const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
  assert.equal(question.rows.length, 2, "There are two rows");
  assert.equal(question.visibleRows.length, 2, "There is one visible row");
  calcValue.expression = "1";
  assert.equal(calcValue.value, 1, "calcValue.value is 1");
  assert.equal(question.visibleRows.length, 1, "There is one visible row after expression change");
});
QUnit.test("check displayMode property", function (assert) {
  const survey = new SurveyModel({ elements: { type: "matrix", name: "q1", rows: [{ value: "row1" }] } });
  const question = <QuestionMatrixModel>survey.getAllQuestions()[0];
  survey.css = { question: { mobile: "test_mobile" } };
  question.isMobile = true;
  assert.equal(question.displayMode, "auto");
  assert.ok(question.isMobile);
  assert.ok(question.getRootCss().includes("test_mobile"));
  question.isMobile = false;
  assert.notOk(question.isMobile);
  assert.notOk(question.getRootCss().includes("test_mobile"));

  question.isMobile = true;
  question.displayMode = "table";
  assert.notOk(question.isMobile);
  assert.notOk(question.getRootCss().includes("test_mobile"));
  question.isMobile = false;
  assert.notOk(question.isMobile);
  assert.notOk(question.getRootCss().includes("test_mobile"));

  question.isMobile = true;
  question.displayMode = "list";
  assert.ok(question.isMobile);
  assert.ok(question.getRootCss().includes("test_mobile"));
  question.isMobile = false;
  assert.ok(question.isMobile);
  assert.ok(question.getRootCss().includes("test_mobile"));
});
QUnit.test(
  "Matrix Question getFirstInputElementId - https://surveyjs.answerdesk.io/ticket/details/T2048",
  function (assert) {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    matrix.value = { row1: "col2", row2: "col3", row3: "col1" };

    assert.equal(
      matrix["getFirstInputElementId"](),
      matrix.inputId + "_row1_0",
      "First row name 0th control"
    );
  }
);

QUnit.test("Rubric Matrix Question cells load from JSON", function (assert) {
  let survey = new SurveyModel({
    elements: [{
      type: "matrix",
      name: "matrix",
      columns: ["col1"],
      rows: ["row1"]
    }]
  });
  var matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
  assert.equal(matrix.hasCellText, false, "There is no cell text");
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
  assert.equal(matrix.hasCellText, true, "There is cell text");
});

QUnit.test("Rubric Matrix Question cells get/set cell text", function (assert) {
  var matrix = new QuestionMatrixModel("q1");
  let counter = 0;
  matrix.registerPropertyChangedHandlers(["cells"], () => {
    counter++;
  });
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.hasCellText, false, "There is no cell text");
  assert.equal(counter, 0, "no changes in cells");
  matrix.setCellText(0, 0, "cell11");
  assert.equal(counter, 1, "one change in cells");
  assert.equal(matrix.hasCellText, true, "There is cell text");
  assert.equal(
    matrix.getCellText(0, 0),
    "cell11",
    "get/set by index works correctly"
  );
  matrix.setCellText(0, 0, "");
  assert.equal(counter, 2, "second cells change");
  assert.equal(matrix.cells.isEmpty, true, "Cells are emtpy");
  assert.equal(matrix.hasCellText, false, "There is no cell text again");
});
QUnit.test("Rubric Matrix Question cells get cell displayText", function (
  assert
) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.setCellText(0, 0, "cell11");
  assert.equal(
    matrix.getCellDisplayText(0, 0),
    "cell11",
    "get cell text by indexes"
  );
  assert.equal(
    matrix.getCellDisplayText(matrix.rows[0], matrix.columns[0]),
    "cell11",
    "get cell text by objects"
  );
  assert.equal(
    matrix.getCellDisplayText(matrix.rows[0], matrix.columns[1]),
    "col2",
    "get column text by indexes"
  );
  assert.equal(
    matrix.getCellDisplayText(matrix.rows[0], matrix.columns[1]),
    "col2",
    "get column text by objects"
  );
});

QUnit.test("Rubric Matrix Question cells serialize/deserialize", function (
  assert
) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.setCellText(0, 0, "cell11");
  matrix.setCellText(0, 1, "cell12");
  matrix.setCellText(1, 1, "cell22");
  var json = matrix.toJSON();
  assert.deepEqual(
    json,
    {
      name: "q1",
      rows: ["row1", "row2"],
      columns: ["col1", "col2"],
      cells: {
        row1: { col1: "cell11", col2: "cell12" },
        row2: { col2: "cell22" },
      },
    },
    "serialized correctly"
  );
  var matrix2 = new QuestionMatrixModel("q2");
  matrix2.fromJSON(json);
  assert.equal(
    matrix2.getCellText(0, 0),
    "cell11",
    "deserialized correctly, cell11"
  );
  assert.equal(
    matrix2.getCellText(0, 1),
    "cell12",
    "deserialized correctly, cell12"
  );
  assert.equal(
    matrix2.getCellText(1, 1),
    "cell22",
    "deserialized correctly, cell22"
  );
});
QUnit.test("Rubric Matrix Question cells default row", function (assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.setDefaultCellText(1, "defaultCell2");
  matrix.setCellText(0, 0, "cell11");

  assert.equal(matrix.getCellDisplayText(0, 0), "cell11", "Use cell text");
  assert.equal(matrix.getCellDisplayText(0, 1), "defaultCell2", "Use default row cell text");
  assert.equal(matrix.getCellDisplayText(1, 0), "col1", "Use rows text");
  var json = matrix.toJSON();
  assert.deepEqual(
    json,
    {
      name: "q1",
      rows: ["row1", "row2"],
      columns: ["col1", "col2"],
      cells: {
        default: { col2: "defaultCell2" },
        row1: { col1: "cell11" },
      },
    },
    "serialized correctly"
  );
  var matrix2 = new QuestionMatrixModel("q2");
  matrix2.fromJSON(json);
  assert.equal(
    matrix2.getCellText(0, 0),
    "cell11",
    "deserialized correctly, cell11"
  );
  assert.equal(
    matrix2.getDefaultCellText(1),
    "defaultCell2",
    "deserialized default cell correctly, defaultCell2"
  );
});
QUnit.test("Rubric Matrix Question cells and onTextMarkdown, Bug#5306", function (
  assert
) {
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
  assert.equal(cellLocStr.textOrHtml, "text!!");
  survey.onTextMarkdown.add((sender, options) => {
    if (options.text === "text!!") {
      options.html = "!!text";
    }
  });
  assert.equal(cellLocStr.textOrHtml, "!!text");
});
QUnit.test("Rubric Matrix Question cells. Allow to change text value via cell editing, Bug#8871 #1", function (
  assert
) {
  const survey = new SurveyModel({
    elements: [{
      type: "matrix",
      name: "matrix",
      columns: [{ value: "col1", text: "Column 1" }, "col2"],
      rows: ["row1", "row2"]
    }]
  });
  const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
  assert.equal(matrix.cells.isEmpty, true, "It is empty");
  const cell0_0 = matrix.cells.getCellDisplayLocText(matrix.rows[0].value, matrix.columns[0].value);
  assert.equal(cell0_0.textOrHtml, "Column 1", "the value is in column");
  cell0_0.setLocaleText("", "Cell[0, 0]");
  assert.equal(matrix.cells.isEmpty, false, "It is not empty");
  assert.deepEqual(matrix.cells.getJson(), { row1: { col1: "Cell[0, 0]" } }, "cells value");
  cell0_0.setLocaleText("", "");
  assert.equal(matrix.cells.isEmpty, true, "It is empty again");
});
QUnit.test("Update loc strings on changing values, Bug#8871 #2", function (
  assert
) {
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
  assert.equal(cell0_0.textOrHtml, "col1", "0_0 #1");
  assert.equal(cell1_1.textOrHtml, "col2", "1_1 #1");
  matrix.cells.setJson({ row1: { col1: "cells[0,0]" }, row2: { col2: "cells[1,1]" } });
  assert.equal(cell0_0.textOrHtml, "cells[0,0]", "0_0 #2");
  assert.equal(cell1_1.textOrHtml, "cells[1,1]", "1_1 #2");
  matrix.cells.setJson({ row2: { col2: "cells[11,11]" } });
  assert.equal(cell0_0.textOrHtml, "col1", "0_0 #3");
  assert.equal(cell1_1.textOrHtml, "cells[11,11]", "1_1 #3");
  assert.equal((<any>matrix).isValueSurveyElement(matrix.cells), true, "cells is Survey element");
  assert.equal((<any>matrix).isValueSurveyElement(matrix.bindings), true, "bindings is Survey element");
  assert.equal((<any>matrix).isValueSurveyElement({ id: 5, text: "abc" }), false, "an object is not Survey element");
});
QUnit.test("Do not copy default rows value, Bug#8871 #3", function (
  assert
) {
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
  assert.deepEqual(matrix.cells.getJson(), { default: { col1: "col1_default", col2: "col2_default" },
    row1: { col1: "col1" }, row2: { col2: "col2" } });
});
QUnit.test("Support locales in matrix cells, Bug#9593", function (
  assert
) {
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
  assert.deepEqual(matrix.cells.getJson(), {
    row1: { col1: { default: "cell00", fr: "cell00_fr" } },
    row2: { col2: { default: "cell11", fr: "cell11_fr" } } }, "#1");
  matrix.cells.setJson({
    row1: { col2: { default: "cell01", fr: "cell01_fr" } },
    row2: { col1: { default: "cell10", fr: "cell10_fr" } } });
  assert.equal(matrix.cells.getCellDisplayLocText(0, 1).getLocaleText("fr"), "cell01_fr", "getlocale text #2");
  assert.equal(matrix.cells.getCellDisplayLocText(1, 0).getLocaleText("fr"), "cell10_fr", "getlocale text #2");
  assert.equal(matrix.cells.getCellText(0, 0), "col1", "get text #0.0");
  assert.equal(matrix.cells.getCellText(0, 1), "cell01", "get text #0.1");
  assert.equal(matrix.cells.getCellText(1, 0), "cell10", "get text #1.0");
  assert.equal(matrix.cells.getCellText(1, 1), "col2", "get text #1.1");
});
QUnit.test("Changing isMultiSelect on the fly - correct values", function (assert) {
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
  assert.deepEqual(matrix.value, { row1: ["col1"], row2: ["col2"] }, "value #1");
  matrix.value = { row1: "col2", row2: "col1" };
  assert.deepEqual(matrix.value, { row1: ["col2"], row2: ["col1"] }, "value #2");
  matrix.cellType = "radio";
  assert.deepEqual(matrix.value, { row1: "col2", row2: "col1" }, "value  #3");
  matrix.value = { row1: ["col2", "col3"], row2: ["col3", "col1"] };
  assert.deepEqual(matrix.value, { row1: "col2", row2: "col3" }, "value  #4");
  matrix.value = undefined;
  matrix.cellType = "checkbox";
  assert.equal(matrix.value, undefined, "value is undefined #1");
  matrix.cellType = "radio";
  assert.equal(matrix.value, undefined, "value is undefined #2");
  matrix.value = null;
  matrix.cellType = "checkbox";
  assert.equal(matrix.value, null, "value is null #1");
  matrix.cellType = "radio";
  assert.equal(matrix.value, null, "value is null #2");
  matrix.value = { row1: "col1", row2: "col2" };
  survey.setValue("matrix", undefined);
  assert.equal(matrix.value, undefined, "value is undefined #3");
  matrix.cellType = "checkbox";
  matrix.value = { row1: ["col2", "col3"], row2: ["col3", "col1"] };
  survey.setValue("matrix", undefined);
  assert.equal(matrix.value, undefined, "value is undefined #4");
});
QUnit.test("isMultiSelect default value is not array", function (assert) {
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
  assert.deepEqual(matrix.value, { row1: ["col1"], row2: ["col2"] }, "default value is array");
});
QUnit.test("isMultiSelect default value is array", function (assert) {
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
  assert.deepEqual(matrix.value, { row1: "col2", row2: "col1" }, "default value is not array");
});
QUnit.test("set incorrect cellType", function (assert) {
  const matrix = new QuestionMatrixModel("matrix");
  assert.equal(matrix.cellType, "radio", "cellType #1");
  matrix.cellType = "checkbox";
  assert.equal(matrix.cellType, "checkbox", "cellType #2");
  matrix.cellType = "dropdown";
  assert.equal(matrix.cellType, "radio", "cellType #3, incorrect value is not set");
});
QUnit.test("isExclusive property for the column in single matrix, Issue#10357", function (assert) {
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
  assert.equal(col2.isExclusive, true, "isExclusive #1");
  matrix.value = { row1: ["col1", "col3"], row2: ["col3"] };
  matrix.cellClick(matrix.visibleRows[0], col2);
  matrix.cellClick(matrix.visibleRows[1], col2);
  assert.deepEqual(matrix.value, { row1: ["col2"], row2: ["col2"] }, "value after click on exclusive column, #1");
  matrix.cellClick(matrix.visibleRows[0], col2);
  matrix.cellClick(matrix.visibleRows[1], col2);
  assert.deepEqual(matrix.value, { }, "value after click on exclusive column, #2");
  matrix.cellClick(matrix.visibleRows[0], col2);
  matrix.cellClick(matrix.visibleRows[1], col2);
  assert.deepEqual(matrix.value, { row1: ["col2"], row2: ["col2"] }, "value after click on exclusive column, #3");
  matrix.cellClick(matrix.visibleRows[0], col1);
  matrix.cellClick(matrix.visibleRows[0], col3);
  matrix.cellClick(matrix.visibleRows[1], col1);
  matrix.cellClick(matrix.visibleRows[1], col3);
  assert.deepEqual(matrix.value, { row1: ["col1", "col3"], row2: ["col1", "col3"] }, "value after click on exclusive column, #4");

  col2.isExclusive = false;
  matrix.value = { row1: ["col1", "col3"], row2: ["col3"] };
  matrix.cellClick(matrix.visibleRows[0], col2);
  matrix.cellClick(matrix.visibleRows[1], col2);
  assert.deepEqual(matrix.value, { row1: ["col1", "col3", "col2"], row2: ["col3", "col2"] }, "value after click on non-exclusive column");
});
QUnit.test("Show isExclusive property when matrix cellType is checkbox, Issue#10357", function (assert) {
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
  assert.ok(prop, "isExclusive property is here");
  assert.equal(prop.isVisible("", matrix.columns[0]), true, "isExclusive is visible for checkbox");
  matrix.cellType = "radio";
  assert.equal(prop.isVisible("", matrix.columns[0]), false, "isExclusive is invisible for radio");
  matrix.cellType = "checkbox";
  assert.equal(prop.isVisible("", matrix.columns[0]), true, "isExclusive is visible for checkbox again");
});
QUnit.test("Add obj into options of onProcessDynamicText event, Issue#9604", function (assert) {
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
  assert.equal(col1.locTitle.renderedHtml, "Item 1: 10", "process {$self.score} for col1");
  assert.equal(col2.locTitle.renderedHtml, "Item 2: 20", "process {$self.score} for col2");
  q1.columns[0].score = 30;
  q1.columns[1].score = 40;
  assert.equal(col1.locTitle.renderedHtml, "Item 1: 30", "process {$self.score} for col1 after change");
  assert.equal(col2.locTitle.renderedHtml, "Item 2: 40", "process {$self.score} for col2 after change");

  Serializer.removeProperty("itemvalue", "score");
});
