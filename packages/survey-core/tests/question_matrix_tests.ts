import { Helpers } from "../src/helpers";
import { QuestionMatrixModel } from "../src/question_matrix";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_QuestionMatrix");

QUnit.test("Matrix Question eachRowRequired property", function (assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.hasErrors(), false, "There is no errors by default");
  matrix.eachRowRequired = true;
  assert.equal(matrix.hasErrors(), true, "There is no errors by default");
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
    assert.equal(matrix.hasErrors(), true, "is Required error");
    rows[0].value = 0;
    assert.equal(matrix.hasErrors(), true, "eachRowRequired error");
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
    if(options.text === "text!!") {
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