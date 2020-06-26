import { SurveyModel } from "../src/survey";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { EmailValidator } from "../src/validator";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { MatrixDropdownColumn } from "../src/question_matrixdropdownbase";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { JsonObject, Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { FunctionFactory } from "../src/functionsfactory";
import { Question } from "../src/question";
import { ExpressionValidator } from "../src/validator";
import { QuestionExpressionModel } from "../src/question_expression";
import { QuestionFactory } from "../src/questionfactory";

export default QUnit.module("Survey_QuestionMatrixDynamic");

QUnit.test("Matrixdropdown cells tests", function (assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");
  question.rows = ["row1", "row2", "row3"];
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.choices = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  question.value = { row2: { column1: 2 } };
  var visibleRows = question.visibleRows;
  assert.equal(visibleRows.length, 3, "There are three rows");
  assert.equal(
    visibleRows[0].cells.length,
    2,
    "There are two cells in each row"
  );
  assert.equal(
    visibleRows[2].cells.length,
    2,
    "There are two cells in each row"
  );
  var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
  assert.deepEqual(
    ItemValue.getData(q1.choices),
    ItemValue.getData(question.choices),
    "get choices from matrix"
  );
  assert.deepEqual(
    ItemValue.getData(q2.choices),
    ItemValue.getData(question.columns[1]["choices"]),
    "get choices from column"
  );
  assert.equal(visibleRows[0].cells[1].value, null, "value is not set");
  assert.equal(visibleRows[1].cells[0].value, 2, "value was set");

  question.value = null;
  visibleRows[0].cells[1].value = 4;
  assert.deepEqual(
    question.value,
    { row1: { column2: 4 } },
    "set the cell value correctly"
  );
  visibleRows[0].cells[1].value = null;
  assert.deepEqual(question.value, null, "set to null if all cells are null");
});
QUnit.test("Matrixdynamic cells tests", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
  question.rowCount = 3;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.choices = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  question.value = [{}, { column1: 2 }, {}];
  var visibleRows = question.visibleRows;
  assert.equal(visibleRows.length, 3, "There are three rows");
  assert.equal(
    visibleRows[0].cells.length,
    2,
    "There are two cells in each row"
  );
  assert.equal(
    visibleRows[2].cells.length,
    2,
    "There are two cells in each row"
  );
  var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
  assert.deepEqual(
    ItemValue.getData(q1.choices),
    ItemValue.getData(question.choices),
    "get choices from matrix"
  );
  assert.deepEqual(
    ItemValue.getData(q2.choices),
    ItemValue.getData(question.columns[1]["choices"]),
    "get choices from column"
  );
  assert.equal(visibleRows[0].cells[1].value, null, "value is not set");
  assert.equal(visibleRows[1].cells[0].value, 2, "value was set");

  question.value = null;
  visibleRows[1].cells[1].value = 4;
  assert.deepEqual(
    question.value,
    [{}, { column2: 4 }, {}],
    "set the cell value correctly"
  );
  visibleRows[1].cells[1].value = null;
  assert.deepEqual(
    question.value,
    [],
    "set to null if all cells are null - array is empty"
  );
});
QUnit.test(
  "Matrixdynamic make the question empty on null cell value, Bug #608",
  function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    var visibleRows = question.visibleRows;
    visibleRows[1].cells[0].question.value = 2;
    assert.deepEqual(
      question.value,
      [{}, { column1: 2 }, {}],
      "The value set correctly"
    );
    visibleRows[1].cells[0].question.value = null;
    assert.deepEqual(
      question.value,
      [],
      "Clear the question value if all cells are empty - empty array"
    );
  }
);

QUnit.test("Matrixdynamic set null value, Bug Editor #156", function (assert) {
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
      assert.deepEqual(question.value, [{}, {}, {}], "Set null value correctly");
      */
  var visibleRows = question.visibleRows;
  assert.equal(visibleRows.length, 3, "There shoud be 3 rows");
});

QUnit.test("Matrixdropdown value tests after cells generation", function (
  assert
) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");
  question.rows = ["row1", "row2", "row3"];
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.choices = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  var visibleRows = question.visibleRows;
  question.value = { row2: { column1: 2 } };
  assert.equal(visibleRows[1].cells[0].value, 2, "value was set");
});
QUnit.test("Matrixdynamic value tests after cells generation", function (
  assert
) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 3;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.choices = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  var visibleRows = question.visibleRows;
  question.value = [{}, { column1: 2 }, {}];
  assert.equal(visibleRows[1].cells[0].value, 2, "value was set");
});
QUnit.test("Matrixdynamic set text to rowCount property, bug #439", function (
  assert
) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  new JsonObject().toObject({ type: "matrixdynamic", rowCount: "1" }, question);
  assert.equal(question.rowCount, 1, "Row count should be 1");
  question.addRow();
  assert.equal(question.rowCount, 2, "Row count should b 2 now");
});
QUnit.test("Matrixdynamic add/remove rows", function (assert) {
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
  assert.equal(question.rowCount, 2, "one row is removed");
  assert.deepEqual(question.value, [], "value is null now - array is empty");
  assert.equal(
    survey.getValue("q1"),
    null,
    "survey value is underfined or null"
  );
  question.addRow();
  assert.equal(question.rowCount, 3, "one row is added");
});
QUnit.test("Matrixdynamic isRequireConfirmOnRowDelete", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.name = "q1";
  page.addQuestion(question);
  question.rowCount = 3;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.value = [{}, { column1: 2 }, {}];
  assert.equal(
    question.isRequireConfirmOnRowDelete(0),
    false,
    "empty row, confirmDelete = false"
  );
  assert.equal(
    question.isRequireConfirmOnRowDelete(1),
    false,
    "non empty row, confirmDelete = false"
  );
  question.confirmDelete = true;
  assert.equal(
    question.isRequireConfirmOnRowDelete(0),
    false,
    "empty row, confirmDelete = true"
  );
  assert.equal(
    question.isRequireConfirmOnRowDelete(1),
    true,
    "non empty row, confirmDelete = true"
  );
});
QUnit.test("Matrixdynamic required column", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "No errors");
  question.columns[0].isRequired = true;
  assert.equal(rows.length, 2, "There are two rows");
  assert.equal(
    question.hasErrors(),
    true,
    "column1 should not be empty. All rows are empty"
  );
  assert.equal(
    question.getAllErrors().length,
    2,
    "There are totally two errors"
  );
  question.value = [{ column1: 2 }, {}];
  assert.equal(
    rows[0].cells[0].question.value,
    2,
    "The first cell has value 2"
  );
  assert.equal(
    question.hasErrors(),
    true,
    "column1 should not be empty. the second row is empty"
  );
  assert.equal(
    question.getAllErrors().length,
    1,
    "There are totally one errors"
  );
  question.value = [{ column1: 2 }, { column1: 3 }];
  assert.equal(
    question.hasErrors(),
    false,
    "column1 should not be empty. all values are set"
  );
  assert.equal(
    question.getAllErrors().length,
    0,
    "There are totally no errors"
  );
});
QUnit.test("Matrixdynamic column.validators", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "No errors");
  question.columns[0].validators.push(new EmailValidator());
  question.rowCount = 0;
  question.rowCount = 2;
  var rows = question.visibleRows;
  question.value = [{ column1: "aaa" }, {}];
  assert.equal(question.hasErrors(), true, "column1 should has valid e-mail");
  question.value = [{ column1: "aaa@aaa.com" }, {}];
  assert.equal(question.hasErrors(), false, "column1 has valid e-mail");
});
QUnit.test("Matrixdynamic duplicationError", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.keyName = "column1";
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "No errors");
  question.value = [{ column1: "val1" }, {}];
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors, row[0].column1=val1"
  );
  question.value = [{ column1: "val1" }, { column1: "val1" }];
  assert.equal(
    question.hasErrors(),
    true,
    "There is the error, row[0].column1=val1 and row[1].column2=val1"
  );
  assert.equal(
    question.visibleRows[0].getQuestionByColumnName("column1").errors.length,
    0,
    "There is no errors in the first row"
  );
  assert.equal(
    question.visibleRows[1].getQuestionByColumnName("column1").errors.length,
    1,
    "There is one error in the second row"
  );
  question.value = [{ column1: "val1" }, { column1: "val2" }];
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors, row[0].column1=val1 and row[1].column2=val2"
  );
});
QUnit.test("Matrixdynamic hasOther column", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.choices = [1, 2, 3];
  question.rowCount = 1;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns[0].hasOther = true;
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "Everything is fine so far");
  rows[0].cells[0].question.value = "other";
  assert.equal(question.hasErrors(), true, "Should set other value");
});
QUnit.test("Matrixdynamic adjust rowCount on setting the value", function (
  assert
) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 0;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.value = [{}, { column1: 2 }, {}];
  assert.equal(question.rowCount, 3, "It should be 3 rowCount");
  question.value = [{}, { column1: 2 }, {}, {}];
  assert.equal(question.rowCount, 4, "It should be 4 rowCount");
  question.value = [{ column1: 2 }];
  assert.equal(question.rowCount, 1, "RowCount is 1");
});
QUnit.test("Matrixdynamic minRowCount/maxRowCount", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.minRowCount = 3;
  question.maxRowCount = 5;
  assert.equal(question.rowCount, 3, "row count is min row count");
  question.rowCount = 5;
  assert.equal(question.rowCount, 5, "row count is 5");
  question.maxRowCount = 4;
  assert.equal(question.rowCount, 4, "row count is max row count");
  question.addRow();
  assert.equal(question.rowCount, 4, "row count is still max row count");
  question.minRowCount = 5;
  assert.equal(question.maxRowCount, 5, "maxRowCount = minRowCount");
  assert.equal(question.rowCount, 5, "row count is still max row count = 5");
});
QUnit.test("Matrixdynamic do not re-create the rows", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  var firstRowId = question.visibleRows[0].id;
  assert.notOk(
    firstRowId.indexOf("unde") > -1,
    "there should not be undefined in the row index"
  );
  var rowCount = question.visibleRows.length;
  question.addRow();
  assert.equal(question.visibleRows.length, rowCount + 1, "Add one row");
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after row adding"
  );
  question.removeRow(question.rowCount - 1);
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after row removing"
  );
  question.rowCount = 10;
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after row count increasing"
  );
  question.rowCount = 1;
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after row count decreasing"
  );
  question.value = [{ col1: 2 }];
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after setting value"
  );
});

QUnit.test("Matrixdynamic change column properties on the fly", function (
  assert
) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.addColumn("col1");
  var rows = question.visibleRows;
  assert.equal(
    rows[0].cells[0].question.getType(),
    "dropdown",
    "the default cell type is 'dropdown'"
  );
  assert.equal(
    (<QuestionDropdownModel>rows[0].cells[0].question).choices.length,
    question.choices.length,
    "By use question.choices by default"
  );
  question.columns[0]["choices"] = [1, 2, 3, 4, 5, 6, 7];
  assert.equal(
    (<QuestionDropdownModel>rows[0].cells[0].question).choices.length,
    question.columns[0]["choices"].length,
    "Use column choices if set"
  );
});

QUnit.test("Matrixdynamic customize cell editors", function (assert) {
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
  survey.onMatrixCellValueChanged.add(function (survey, options) {
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
  assert.equal(q2.visible, false, "col2 is invisible if col1 is empty");
  q1.value = 1;
  assert.equal(
    q2.choices[0].value,
    "item1",
    "col1 = 1, col2.choices = ['item1', 'item2']"
  );
  q1.value = 2;
  assert.equal(
    q2.choices[0].value,
    "item3",
    "col1 = 2, col2.choices = ['item3', 'item4']"
  );
  q1.value = null;
  assert.equal(q2.visible, false, "col2 is invisible if col1 = null");
  matrix.addRow();
  assert.equal(
    (<QuestionDropdownModel>rows[1].cells[1].question).visible,
    false,
    "row2. col2 is invisible if col1 = null"
  );
});

QUnit.test(
  "MatrixCellCreated set cell value https://github.com/surveyjs/surveyjs/issues/1259#issuecomment-413947851",
  function (assert) {
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
    assert.equal(matrix.visibleRows.length, 1, "one row");
    assert.deepEqual(
      matrix.value,
      [{ col2: "A" }], //[{ col1: "B", col2: "A" }],
      "col1 is B, col2 is A"
    );
  }
);

//QUnit.test("Matrixdynamic validate cell values - do not allow to have the same value", function (assert) {
QUnit.test(
  "Matrixdynamic validate cell values - onMatrixCellValueChanged",
  function (assert) {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    var cellQuestions = [];
    survey.onMatrixCellCreated.add(function (survey, options) {
      cellQuestions.push(options.cellQuestion);
    });
    survey.onMatrixCellValidate.add(function (survey, options) {
      if (options.value == "notallow") {
        options.error = "This cell is not allow";
      }
    });
    var rows = matrix.visibleRows;
    assert.equal(
      cellQuestions.length,
      2,
      "There are 2 cell questions in the array"
    );
    cellQuestions[0].value = "notallow";
    matrix.hasErrors(true);
    assert.equal(cellQuestions[0].errors.length, 1, "There is an error");
    cellQuestions[0].value = "allow";
    matrix.hasErrors(true);
    assert.equal(cellQuestions[0].errors.length, 0, "There is no errors");
  }
);

QUnit.test(
  "Matrixdynamic validate cell values - do not allow to have the same value",
  function (assert) {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
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
      options.getCellQuestion("col1").hasErrors(true);
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
    assert.equal(
      cellQuestions.length,
      2,
      "There are 2 cell questions in the array"
    );
    cellQuestions[0].value = 1;
    assert.equal(cellQuestions[1].errors.length, 0, "There is now errors");
    cellQuestions[1].value = 1;
    assert.equal(cellQuestions[1].errors.length, 1, "There is an error");
    cellQuestions[1].value = 2;
    assert.equal(cellQuestions[1].errors.length, 0, "There no errors again");
  }
);
QUnit.test(
  "Matrixdynamic onMatrixValueChanging - control the value in the cell",
  function (assert) {
    var json = {
      questions: [
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
    assert.equal(
      matrix.visibleRows[0].cells[1].question.value,
      "3",
      "Value is 3"
    );
    matrix.visibleRows[0].cells[0].question.value = "No";
    assert.equal(
      matrix.visibleRows[0].cells[1].question.value,
      "3",
      "Value is still 3"
    );
  }
);

QUnit.test("Matrixdropdown different cell types", function (assert) {
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
    assert.equal(
      row.cells[i].question.getType(),
      col.name,
      "Expected " + col.name + ", but was" + row.cells[i].question.getType()
    );
  }
});
QUnit.test("Matrixdropdown boolean cellType", function (assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");

  question.columns.push(new MatrixDropdownColumn("col1"));
  question.columns.push(new MatrixDropdownColumn("col2"));
  question.cellType = "boolean";

  question.rows = ["row1"];
  var visibleRows = question.visibleRows;
  visibleRows[0].cells[0].question.value = true;
  visibleRows[0].cells[1].question.value = false;
  assert.deepEqual(
    question.value,
    { row1: { col1: true, col2: false } },
    "Boolean field set value correctly"
  );
});
QUnit.test("Matrixdropdown booleanDefaultValue", function (assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");

  question.columns.push(new MatrixDropdownColumn("col1"));
  question.columns.push(new MatrixDropdownColumn("col2"));
  question.cellType = "boolean";
  question.columns[0]["defaultValue"] = "true";
  question.columns[1]["defaultValue"] = "false";

  question.rows = ["row1"];
  var visibleRows = question.visibleRows;
  assert.deepEqual(
    question.value,
    { row1: { col1: true, col2: false } },
    "Boolean field set value correctly"
  );
});

QUnit.test("Matrixdropdown defaultValue", function (assert) {
  var survey = new SurveyModel({
    questions: [
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
  assert.deepEqual(
    question.value,
    { row1: { col1: 1 } },
    "default value has been assign"
  );
});

QUnit.test("matrixdynamic.defaultValue - check the complex property", function (
  assert
) {
  var survey = new SurveyModel({
    questions: [
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
  assert.deepEqual(
    survey.getValue("matrix"),
    [
      { col1: 1, col2: 2 },
      { col1: 3, col2: 4 },
    ],
    "set complex defaultValue correctly"
  );
});

QUnit.test("Matrixdropdown isRequiredInAllRows", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("dropdown"));
  var rows = question.visibleRows;
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors in the matrix. Null is possible"
  );
  assert.equal(rows[0].isEmpty, true, "There is no error in the first row");
  assert.equal(rows[1].isEmpty, true, "There is no error in the second row");
  question.minRowCount = 2;
  assert.equal(
    question.hasErrors(),
    true,
    "Error, value in all rows are required"
  );
});
QUnit.test("Matrixdropdown supportGoNextPageAutomatic property", function (
  assert
) {
  var question = new QuestionMatrixDropdownModel("matrix");
  question.rows = ["row1", "row2"];
  question.columns.push(new MatrixDropdownColumn("col1"));
  question.columns.push(new MatrixDropdownColumn("col2"));
  var rows = question.visibleRows;
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "There is no value in rows"
  );
  question.value = { row1: { col1: 1, col2: 11 } };
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "There is no value in the second row"
  );
  question.value = { row1: { col1: 1, col2: 11 }, row2: { col1: 2, col2: 22 } };
  assert.equal(
    question.supportGoNextPageAutomatic(),
    true,
    "All row values are set"
  );
  question.value = { row1: { col1: 1 }, row2: { col1: 2, col2: 22 } };
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "The first row is not set completely"
  );
});

QUnit.test(
  "Matrixdropdown supportGoNextPageAutomatic always false for checkbox",
  function (assert) {
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

    assert.equal(question.columns.length, 2, "There were two columns");
  }
);

QUnit.test("Matrixdropdown set columns", function (assert) {
  var question = new QuestionMatrixDropdownModel("matrix");
  question.rows = ["row1", "row2"];
  question.columns.push(new MatrixDropdownColumn("col1"));
  question.columns.push(new MatrixDropdownColumn("col2"));

  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "There is no value in rows"
  );
  question.value = { row1: { col1: 1, col2: 11 } };
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "Checkbox doesn't support gotNextPageAutomatic"
  );
});

QUnit.test("Matrixdynamic column.visibleIf", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.columns.push(new MatrixDropdownColumn("column3"));
  question.columns[0]["choices"] = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  question.columns[2]["choices"] = [7, 8, 9, 10];
  question.columns[2].isRequired = true;

  question.columns[1].visibleIf = "{row.column1} = 2";
  question.columns[2].visibleIf = "{a} = 5";

  var visibleRows = question.visibleRows;
  var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
  var q3 = <QuestionDropdownModel>visibleRows[0].cells[2].question;

  var values = { a: 3 };
  question.runCondition(values, null);
  assert.equal(q1.visible, true, "1. q1 visibleIf is empty");
  assert.equal(q2.visible, false, "1. q2 visibleIf depends on column1 - false");
  assert.equal(
    q3.visible,
    false,
    "1. q3 visibleIf depends on external data - false"
  );
  assert.equal(
    question.hasErrors(),
    false,
    "1. q3 required column is invisible."
  );

  values = { a: 5 };
  question.runCondition(values, null);
  assert.equal(
    q3.visible,
    true,
    "2. q3 visibleIf depends on external data - true"
  );

  q1.value = 2;
  question.runCondition(values, null);
  assert.equal(q2.visible, true, "3. q2 visibleIf depends on column1 - true");
});
QUnit.test("Matrixdynamic column.enableIf", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
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

  var values = { a: 3 };
  question.runCondition(values, null);
  assert.equal(q1.isReadOnly, false, "1. q1 enableIf is empty");
  assert.equal(
    q2.isReadOnly,
    true,
    "1. q2 enableIf depends on column1 - false"
  );
  assert.equal(
    q3.isReadOnly,
    true,
    "1. q3 enableIf depends on external data - false"
  );
  values = { a: 5 };
  question.runCondition(values, null);
  assert.equal(
    q3.isReadOnly,
    false,
    "2. q3 enableIf depends on external data - true"
  );

  q1.value = 2;
  question.runCondition(values, null);
  assert.equal(
    q2.isReadOnly,
    false,
    "3. q2 enableIf depends on column1 - true"
  );
});
QUnit.test("Matrixdynamic column.requiredIf", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
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

  var values = { a: 3 };
  question.runCondition(values, null);
  assert.equal(q1.isRequired, false, "1. q1 requiredIf is empty");
  assert.equal(
    q2.isRequired,
    false,
    "1. q2 requireIf depends on column1 - false"
  );
  assert.equal(
    q3.isRequired,
    false,
    "1. q3 requiredIf depends on external data - false"
  );
  values = { a: 5 };
  question.runCondition(values, null);
  assert.equal(
    q3.isRequired,
    true,
    "2. q3 requiredIf depends on external data - true"
  );

  q1.value = 2;
  question.runCondition(values, null);
  assert.equal(
    q2.isRequired,
    true,
    "3. q2 requiredIf depends on column1 - true"
  );
});
QUnit.test(
  "Matrixdynamic column.visibleIf, load from json and add item",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
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
    assert.equal(q_0_1.visible, false, "Initial the question is invisible");
    matrix.addRow();
    var q_1_1 = <QuestionDropdownModel>rows[1].cells[1].question;
    assert.equal(
      q_1_1.visible,
      false,
      "Initial the question in the added row is invisible"
    );
  }
);
QUnit.test(
  "Matrixdynamic column.visibleIf, hide column if all cells are invisible",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
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
    assert.equal(
      matrix.columns[0].hasVisibleCell,
      false,
      "The first column is invisible"
    );
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      false,
      "The second column is invisible"
    );
    survey.setValue("q2", 1);
    assert.equal(
      matrix.columns[0].hasVisibleCell,
      true,
      "The first column is visible"
    );
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      false,
      "The second column is still invisible"
    );
    matrix.visibleRows[0].cells[0].question.value = 1;
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      true,
      "The second column is visible now"
    );
    matrix.visibleRows[1].cells[0].question.value = 1;
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      true,
      "The second column is visible now, #2"
    );
    matrix.visibleRows[0].cells[0].question.value = 2;
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      true,
      "The second column is visible now, #3"
    );
    matrix.visibleRows[1].cells[0].question.value = 2;
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      false,
      "The second column is invisible now"
    );
    survey.setValue("q2", 2);
    assert.equal(
      matrix.columns[0].hasVisibleCell,
      false,
      "The first column is invisible now"
    );
    //assert.equal(matrix.renderedTable.headerRow.cells.length, 0, "There is no cells headers");
    //assert.equal(matrix.renderedTable.rows[0].cells.length, 0, "There is no cells in rows");
  }
);

QUnit.test("MatrixDropdownColumn cell question", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  var column = question.addColumn("col1");
  assert.equal(
    column.templateQuestion.getType(),
    "dropdown",
    "The default type is dropdown"
  );
  question.cellType = "radiogroup";
  assert.equal(
    column.templateQuestion.getType(),
    "radiogroup",
    "The default type is radiogroup"
  );
  column.cellType = "checkbox";
  assert.equal(
    column.templateQuestion.getType(),
    "checkbox",
    "The question type is checkbox"
  );
});

QUnit.test("MatrixDropdownColumn properties are in questions", function (
  assert
) {
  var column = new MatrixDropdownColumn("col1");
  column.title = "some text";
  assert.equal(column.templateQuestion.name, "col1", "name set into question");
  assert.equal(
    column.templateQuestion.title,
    "some text",
    "title into question"
  );
  column.cellType = "checkbox";
  assert.equal(
    column.templateQuestion.getType(),
    "checkbox",
    "cell type is changed"
  );
  assert.equal(
    column.templateQuestion.name,
    "col1",
    "name is still in question"
  );
  assert.equal(
    column.templateQuestion.title,
    "some text",
    "title is still in question"
  );
});
QUnit.test(
  "MatrixDropdownColumn add/remove serialization properties",
  function (assert) {
    var column = new MatrixDropdownColumn("col1");
    assert.ok(
      column["optionsCaption"],
      "optionsCaption property has been created"
    );
    assert.ok(
      column["locOptionsCaption"],
      "Serialization property has been created for optionsCaption"
    );
    column.cellType = "text";
    assert.notOk(
      column["optionsCaption"],
      "optionsCaption property has been removed"
    );
    assert.notOk(
      column["locOptionsCaption"],
      "Serialization property has been removed for optionsCaption"
    );
  }
);
QUnit.test("MatrixDropdownColumn cellType property, choices", function (
  assert
) {
  var prop = Serializer.findProperty("matrixdropdowncolumn", "cellType");
  assert.ok(prop, "Property is here");
  assert.equal(prop.choices.length, 9, "There are 9 cell types by default");
  assert.equal(prop.choices[0], "default", "The first value is default");
  assert.equal(prop.choices[1], "dropdown", "The second value is default");
});

QUnit.test(
  "MatrixDropdownColumn copy local choices into cell question",
  function (assert) {
    var question = new QuestionMatrixDynamicModel("matrix");
    question.choices = [1, 2, 3];
    var column = question.addColumn("col1");
    column["choices"] = [4, 5];
    question.rowCount = 1;
    var rows = question.visibleRows;
    assert.equal(
      rows[0].cells[0].question["choices"].length,
      2,
      "There are 2 choices"
    );
    assert.equal(
      rows[0].cells[0].question["choices"][0].value,
      4,
      "The first value is 4"
    );
  }
);

QUnit.test("MatrixDropdownColumn load choices from json", function (assert) {
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
  assert.equal(
    rows[0].cells[1].question["choices"].length,
    3,
    "There are 3 choices"
  );
  assert.equal(
    rows[0].cells[1].question["choices"][0].value,
    5,
    "The first value is 5"
  );
});

QUnit.test(
  "MatrixDynamic do not generate an error on setting a non-array value",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var question = new QuestionMatrixDynamicModel("matrix");
    page.addElement(question);
    question.addColumn("col1");
    question.rowCount = 1;
    survey.setValue("matrix", "sometext");
    assert.equal(question.value, "sometext", "It does not generate the error");
  }
);

QUnit.test("matrixDynamic.addConditionObjectsByContext", function (assert) {
  var objs = [];
  var question = new QuestionMatrixDynamicModel("matrix");
  question.title = "Matrix";
  question.addColumn("col1", "Column 1");
  question.addColumn("col2");
  question.addConditionObjectsByContext(objs, null);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
        question: "matrix",
      },
      { name: "matrix[0].col2", text: "Matrix[0].col2", question: "matrix" },
    ],
    "addConditionObjectsByContext work correctly for matrix dynamic"
  );
  objs = [];
  question.addConditionObjectsByContext(objs, question.columns[0]);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
        question: "matrix",
      },
      { name: "matrix[0].col2", text: "Matrix[0].col2", question: "matrix" },
      { name: "row.col2", text: "row.col2", question: "matrix" },
    ],
    "addConditionObjectsByContext work correctly for matrix dynamic with context"
  );
});
QUnit.test("matrixDropdown.addConditionObjectsByContext", function (assert) {
  var objs = [];
  var question = new QuestionMatrixDropdownModel("matrix");
  question.addColumn("col1", "Column 1");
  question.addColumn("col2");
  question.rows = ["row1", "row2"];
  question.title = "Matrix";
  question.rows[0].text = "Row 1";
  question.addConditionObjectsByContext(objs, null);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
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
    ],
    "addConditionObjectsByContext work correctly for matrix dropdown"
  );
  objs = [];
  question.addConditionObjectsByContext(objs, question.columns[0]);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
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
      { name: "row.col2", text: "row.col2", question: "matrix" },
    ],
    "addConditionObjectsByContext work correctly for matrix dropdown with context"
  );
});

QUnit.test("matrixDynamic.getConditionJson", function (assert) {
  var names = [];
  var question = new QuestionMatrixDynamicModel("matrix");
  question.addColumn("col1");
  question.addColumn("col2");
  question.columns[0]["choices"] = [1, 2];
  question.columns[1].cellType = "checkbox";
  question.columns[1]["choices"] = [1, 2, 3];
  question.rowCount = 2;
  var json = question.getConditionJson("equals", "[0].col1");
  assert.deepEqual(json.choices, [1, 2], "column 1 get choices");
  assert.equal(json.type, "dropdown", "column 1 get type");
  json = question.getConditionJson("equals", "row.col2");
  assert.deepEqual(json.choices, [1, 2, 3], "column 2 get choices");
  assert.equal(json.type, "checkbox", "column 2 get type");
  json = question.getConditionJson("contains", "[0].col2");
  assert.equal(json.type, "radiogroup", "column 2 get type for contains");
});

QUnit.test("matrixDynamic.clearInvisibleValues", function (assert) {
  var names = [];
  var question = new QuestionMatrixDynamicModel("matrix");
  question.addColumn("col1");
  question.addColumn("col2");
  question.columns[0]["choices"] = [1, 2];
  question.columns[1]["choices"] = [1, 2, 3];
  question.rowCount = 2;
  question.value = [
    { col1: 1, col2: 4 },
    { col4: 1, col2: 2 },
  ];
  question.clearIncorrectValues();
  assert.deepEqual(
    question.value,
    [{ col1: 1 }, { col2: 2 }],
    "clear unexisting columns and values"
  );
});

QUnit.test("matrixDropdown.clearInvisibleValues", function (assert) {
  var names = [];
  var question = new QuestionMatrixDropdownModel("matrix");
  question.addColumn("col1");
  question.addColumn("col2");
  question.columns[0]["choices"] = [1, 2];
  question.columns[1]["choices"] = [1, 2, 3];
  question.rows = ["row1", "row2"];
  question.value = {
    row1: { col1: 1, col2: 4 },
    row0: { col1: 1 },
    row2: { col4: 1, col2: 2 },
  };
  question.clearIncorrectValues();
  assert.deepEqual(
    question.value,
    { row1: { col1: 1 }, row2: { col2: 2 } },
    "clear unexisting columns and values"
  );
});

QUnit.test("Matrixdropdown column.index", function (assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");
  question.rows = ["row1"];
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.columns.push(new MatrixDropdownColumn("column3"));
  for (var i = 0; i < question.columns.length; i++) {
    assert.equal(
      question.columns[i].index,
      i,
      "column.index is correct after push"
    );
  }
  question.columns.splice(1, 1);
  assert.equal(question.columns.length, 2, "now 2 columns");
  for (var i = 0; i < question.columns.length; i++) {
    assert.equal(
      question.columns[i].index,
      i,
      "column.index is correct after removing"
    );
  }
});
QUnit.test("Matrixdynamic allowAddRows property", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  assert.equal(question.allowAddRows, true, "allowAddRows is true by default");
  assert.equal(question.canAddRow, true, "canAddRow is true");
  question.allowAddRows = false;
  assert.equal(question.canAddRow, false, "canAddRow is false");
});
QUnit.test("Matrixdynamic allowRemoveRows property", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  assert.equal(
    question.allowRemoveRows,
    true,
    "allowRemoveRows is true by default"
  );
  assert.equal(question.canRemoveRows, true, "canRemoveRows is true");
  question.allowRemoveRows = false;
  assert.equal(question.canRemoveRows, false, "canRemoveRows is false");
});
QUnit.test("Matrixdynamic addRowLocation", function (assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  assert.equal(
    question.isAddRowOnTop,
    false,
    "columnsLocation='horizontal', addRowLocation='default', #1"
  );
  assert.equal(
    question.isAddRowOnBottom,
    true,
    "columnsLocation='horizontal', addRowLocation='default', #2"
  );
  question.addRowLocation = "top";
  assert.equal(
    question.isAddRowOnTop,
    true,
    "columnsLocation='horizontal', addRowLocation='top', #1"
  );
  assert.equal(
    question.isAddRowOnBottom,
    false,
    "columnsLocation='horizontal', addRowLocation='top', #2"
  );
  question.addRowLocation = "bottom";
  assert.equal(
    question.isAddRowOnTop,
    false,
    "columnsLocation='horizontal', addRowLocation='bottom', #1"
  );
  assert.equal(
    question.isAddRowOnBottom,
    true,
    "columnsLocation='horizontal', addRowLocation='bottom', #2"
  );
  question.addRowLocation = "topBottom";
  assert.equal(
    question.isAddRowOnTop,
    true,
    "columnsLocation='horizontal', addRowLocation='topBottom', #1"
  );
  assert.equal(
    question.isAddRowOnBottom,
    true,
    "columnsLocation='horizontal', addRowLocation='topBottom', #2"
  );
  question.columnsLocation = "vertical";
  question.addRowLocation = "default";
  assert.equal(
    question.isAddRowOnTop,
    true,
    "columnsLocation='vertical', addRowLocation='default', #1"
  );
  assert.equal(
    question.isAddRowOnBottom,
    false,
    "columnsLocation='vertical', addRowLocation='default', #2"
  );
  question.addRowLocation = "top";
  assert.equal(
    question.isAddRowOnTop,
    true,
    "columnsLocation='vertical', addRowLocation='top', #1"
  );
  assert.equal(
    question.isAddRowOnBottom,
    false,
    "columnsLocation='vertical', addRowLocation='top', #2"
  );
  question.addRowLocation = "bottom";
  assert.equal(
    question.isAddRowOnTop,
    false,
    "columnsLocation='vertical', addRowLocation='bottom', #1"
  );
  assert.equal(
    question.isAddRowOnBottom,
    true,
    "columnsLocation='vertical', addRowLocation='bottom', #2"
  );
  question.addRowLocation = "topBottom";
  assert.equal(
    question.isAddRowOnTop,
    true,
    "columnsLocation='vertical', addRowLocation='topBottom', #1"
  );
  assert.equal(
    question.isAddRowOnBottom,
    true,
    "columnsLocation='vertical', addRowLocation='topBottom', #2"
  );
});

QUnit.test("matrix.rowsVisibleIf", function (assert) {
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
  assert.equal(qBestCar.visibleRows.length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.visibleRows.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.visibleRows.length, 3, "3 cars are selected");
  qBestCar.rowsVisibleIf = "";
  assert.equal(qBestCar.visibleRows.length, 4, "there is no filter");
});

/* Very likely we do not need this functional.
QUnit.test("matrix.rowsVisibleIf, use 'row.' context", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var matrix = new QuestionMatrixDropdownModel("bestCar");
  matrix.addColumn("col1");
  matrix.addColumn("col2");
  matrix.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  matrix.rowsVisibleIf = "{row.col2} != 1";
  page.addElement(matrix);
  assert.equal(matrix.visibleRows.length, 4, "all rows are shown");
  matrix.value = [{ Audi: { col2: 1 } }];
  assert.equal(matrix.visibleRows.length, 3, "Audi is hidden");
  matrix.value = [{ Audi: { col2: 1 } }, { BMW: { col2: 1 } }];
  assert.equal(matrix.visibleRows.length, 2, "Audi and BMW is hidden");
  matrix.value = null;
  assert.equal(matrix.visibleRows.length, 4, "all rows are shown again");
});
*/
QUnit.test(
  "matrix.rowsVisibleIf, clear value on making the value invisible",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionMatrixDropdownModel("bestCar");
    qBestCar.cellType = "text";
    qBestCar.addColumn("col1");
    qBestCar.addColumn("col2");
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = { BMW: { col1: 1 }, Audi: { col2: 2 } };
    assert.deepEqual(
      qBestCar.value,
      { BMW: { col1: 1 }, Audi: { col2: 2 } },
      "Audi is selected"
    );
    survey.setValue("cars", ["BMW"]);
    assert.deepEqual(qBestCar.value, { BMW: { col1: 1 } }, "Audi is removed");
    survey.setValue("cars", ["Mercedes"]);
    assert.deepEqual(qBestCar.isEmpty(), true, "All checks are removed");
  }
);

QUnit.test(
  "matrix.defaultRowValue, apply from json and then from UI",
  function (assert) {
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
    assert.deepEqual(
      question.value,
      [
        { column1: "val1", column3: "val3" },
        { column1: "val1", column3: "val3" },
      ],
      "defaultRowValue set correctly on json loading"
    );
    question.addRow();
    assert.deepEqual(
      question.value,
      [
        { column1: "val1", column3: "val3" },
        { column1: "val1", column3: "val3" },
        { column1: "val1", column3: "val3" },
      ],
      "defaultRowValue set correclty on adding row"
    );
  }
);

QUnit.test(
  "matrix.defaultRowValue, defaultValue has higher priority than defaultRowValue",
  function (assert) {
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
    assert.deepEqual(
      question.value,
      [
        { column1: "val2", column3: "val5" },
        { column2: "val2", column3: "val4" },
      ],
      "defaultValue is used"
    );
  }
);

QUnit.test("rowIndex variable, in text processing", function (assert) {
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
  assert.equal(rows[0].cells[0].question.value, 1, "The first row has index 1");
  assert.equal(rows[1].cells[0].question.value, 2, "The first row has index 2");
});

QUnit.test("row property in custom function", function (assert) {
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
  assert.equal(
    rows[0].cells[1].question.value,
    "abcabc",
    "Custom function with row property works correctly"
  );
  FunctionFactory.Instance.unregister("rowCustomFunc");
});

QUnit.test(
  "Complete example with totals and expressions: invoice example",
  function (assert) {
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
    var visibleTotalRow = question.visibleTotalRow;
    assert.equal(rows[0].cells[2].question.value, 0, "By default price is 0");
    rows[0].cells[1].question.value = "item1";
    assert.equal(rows[0].cells[2].question.value, 10, "Price is ten now");
    rows[0].cells[3].question.value = 5;
    assert.equal(
      rows[0].cells[4].question.value,
      10 * 5,
      "row totals calculated correctly"
    );

    question.addRow();
    assert.equal(rows.length, 2, "There are two rows now");
    rows[1].cells[3].question.value = 3;
    rows[1].cells[1].question.value = "item2";
    assert.equal(
      rows[1].cells[2].question.value,
      20,
      "Price is 20 for second row"
    );
    assert.equal(
      rows[1].cells[4].question.value,
      20 * 3,
      "row totals calculated correctly for the second row"
    );

    var totalRow = question.renderedTable.footerRow;
    assert.equal(totalRow.cells[3].question.value, 8, "5 + 3 items");
    assert.equal(
      totalRow.cells[4].question.value,
      10 * 5 + 20 * 3,
      "total for items"
    );
    var totalWihtVatQuestion = survey.getQuestionByName("total");
    assert.equal(
      totalWihtVatQuestion.value,
      (10 * 5 + 20 * 3) * 1.2,
      "total for items + VAT"
    );

    FunctionFactory.Instance.unregister("getItemPrice");
    Serializer.removeProperty("itemvalue", "price");
  }
);

QUnit.test("Expression with two columns doesn't work, bug#1199", function (
  assert
) {
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
  var val = question.value;
  var rows = question.visibleRows;
  assert.equal(val.B.tot, 10, "Expression equals 10");
});

QUnit.test(
  "defaultValue: false doesn't work for boolean column after removing row, bug#1266",
  function (assert) {
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
    assert.equal(rows.length, 2, "There are two rows");
    assert.deepEqual(
      question.value,
      [{ col1: false }, { col1: false }],
      "defaultValue set correctly"
    );
    question.removeRow(1);
    rows = question.visibleRows;
    assert.equal(rows.length, 1, "There is one row");
    assert.deepEqual(
      question.value,
      [{ col1: false }],
      "defaultValue is still there for the first row"
    );
  }
);

QUnit.test("Test defaultValueFromLastRow property", function (assert) {
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
  question.defaultValueFromLastRow = true;
  question.addRow();
  question.visibleRows;
  assert.equal(question.isEmpty(), true, "It is empty");
  question.value = [{ col1: 1, col2: 2 }];
  question.addRow();
  assert.deepEqual(
    question.value,
    [
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2 },
    ],
    "defaultValueFromLastRow is working"
  );
  question.defaultRowValue = { col1: 11, col3: 3 };
  question.addRow();
  assert.deepEqual(
    question.value,
    [
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2, col3: 3 },
    ],
    "defaultValueFromLastRow is merging with defaultRowValue"
  );
});

QUnit.test("Text preprocessing with capital questions", function (assert) {
  var json = {
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
  };
  var survey = new SurveyModel(json);
  survey.data = { Q11: { R11: { C11: "val11" } }, q1: { r1: { c1: "val1" } } };
  var q11 = <QuestionMatrixDropdownModel>survey.getQuestionByName("Q11");
  var q1 = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
  assert.equal(
    q1.rows[0].locText.renderedHtml,
    "val1 -- r1",
    "lowcase name is fine"
  );
  assert.equal(
    q11.rows[0].locText.renderedHtml,
    "val11 -- r11",
    "uppercase name is fine"
  );
});

QUnit.test(
  "Text preprocessing with dot in question, column and row names",
  function (assert) {
    var json = {
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
    };
    var survey = new SurveyModel(json);
    survey.data = { "q.1": { "r.1": { "c.1": "val1" } } };
    var q1 = <Question>survey.getQuestionByName("q1");
    assert.equal(q1.locTitle.renderedHtml, "val1", "work with dots fine");
  }
);

QUnit.test(
  "Shared matrix value name, Bug: Bug# https://surveyjs.answerdesk.io/ticket/details/T1322",
  function (assert) {
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
    assert.equal(q1.visibleRows.length, 2, "q1 - two rows are by default");
    assert.equal(q2.visibleRows.length, 2, "q2 - two rows are by default");

    var newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    q1.value = newValue;
    assert.deepEqual(q1.value, newValue, "set correctly to the first question");
    assert.deepEqual(
      q2.value,
      newValue,
      "shared correctly to the second question"
    );
    var rowsChangedCounter = 0;
    q2.visibleRowsChangedCallback = function () {
      rowsChangedCounter++;
    };
    q1.addRow();
    q1.visibleRows[3].cells[0].value = 4;
    newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }, { col1: 4 }];
    assert.equal(rowsChangedCounter, 1, "q2 rows should be rebuilt");
    assert.deepEqual(
      q2.visibleRows.length,
      4,
      "There are  4 rows in the second question"
    );
    assert.deepEqual(
      q1.value,
      newValue,
      "2. set correctly to the first question"
    );
    assert.deepEqual(
      q2.value,
      newValue,
      "2. shared correctly to the second question"
    );
  }
);

QUnit.test(
  "Copy matrix value on trigger, Bug# https://surveyjs.answerdesk.io/ticket/details/T1322",
  function (assert) {
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
    assert.equal(q1.visibleRows.length, 2, "q1 - two rows are by default");
    assert.equal(q2.visibleRows.length, 2, "q2 - two rows are by default");
    var newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    q1.value = newValue;
    assert.deepEqual(q1.value, newValue, "set correctly to the first question");
    var rowsChangedCounter = 0;
    q2.visibleRowsChangedCallback = function () {
      rowsChangedCounter++;
    };
    survey.setValue("copyValue", true);
    assert.equal(rowsChangedCounter, 1, "q2 rows should be rebuilt");
    assert.deepEqual(
      q2.value,
      newValue,
      "set correctly to the second question on trigger"
    );
  }
);
QUnit.test("columnsVisibleIf produce the bug, Bug#1540", function (assert) {
  var json = {
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
                optionsCaption: "not specified",
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
  assert.equal(
    survey.getQuestionByName("group_clinician_user_attributes").name,
    "group_clinician_user_attributes",
    "There is no exception"
  );
});

QUnit.test("column.choicesEnableIf", function (assert) {
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
  assert.equal(
    col2Q.choicesEnableIf,
    "{row.col1} contains {item}",
    "The choicesEnableIf property is set"
  );
  assert.ok(
    col2TemplateQ.loadingOwner,
    "loading owner is set to template question"
  );
  assert.ok(col2Q.loadingOwner, "loading owner is set to question");
  assert.equal(
    col2TemplateQ.isLoadingFromJson,
    false,
    "We are not loading from JSON template question"
  );
  assert.equal(
    col2Q.isLoadingFromJson,
    false,
    "We are not loading from JSON cell question"
  );
  matrix.columns[1].startLoadingFromJson();
  assert.equal(
    col2TemplateQ.isLoadingFromJson,
    true,
    "We are loading from JSON the template question"
  );
  assert.equal(
    col2Q.isLoadingFromJson,
    true,
    "We are loading from JSON the cell question"
  );
  matrix.columns[1].endLoadingFromJson();

  assert.equal(col2Q.choices.length, 4, "There are 4 choices");
  assert.equal(col2Q.choices[0].isEnabled, false, "First choice is disabled");
  assert.equal(col2Q.choices[1].isEnabled, false, "Second choice is disabled");
  col1Q.value = [1, 2];
  assert.equal(col2Q.choices[0].isEnabled, true, "First choice is enabled now");
  assert.equal(
    col2Q.choices[1].isEnabled,
    true,
    "The second choice is enabled now"
  );
  assert.equal(
    col2Q.choices[2].isEnabled,
    false,
    "The third choice is still disabled"
  );
});

QUnit.test(
  "register function on visibleChoices change calls many times, Bug#1622",
  function (assert) {
    var json = {
      questions: [
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
    question.registerFunctionOnPropertyValueChanged(
      "visibleChoices",
      function () {
        counter++;
      }
    );
    matrix.columns[0].choices = ["1", "2", "3"];
    assert.deepEqual(question.choices.length, 3, "Choices set correctly");
    assert.equal(counter, 1, "There was only one change");
  }
);
QUnit.test(
  "customwidget.readOnlyChangedCallback doesn't work correctly, https://surveyjs.answerdesk.io/ticket/details/T1869",
  function (assert) {
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
    assert.equal(rows.length, 1, "rows are created");
    assert.equal(isFitValue, true, "cell text question is a custom widget");
    assert.equal(isReadOnly, true, "cell text question is readonly");
    CustomWidgetCollection.Instance.clear();
  }
);

QUnit.test("Values from invisible rows should be removed, #1644", function (
  assert
) {
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
  survey.data = { q1: 2, q2: { row1: "col1", row2: "col2" } };
  survey.doComplete();
  assert.deepEqual(
    survey.data,
    { q1: 2, q2: { row2: "col2" } },
    "Remove value for invisible row"
  );
});

QUnit.test("matrix.hasTotal property", function (assert) {
  var matrix = new QuestionMatrixDropdownModel("q1");
  matrix.addColumn("col1");
  assert.equal(matrix.hasTotal, false, "There is no total");
  matrix.columns[0].totalType = "sum";
  assert.equal(matrix.hasTotal, true, "There is total now, totalType");
  matrix.columns[0].totalType = "none";
  assert.equal(matrix.hasTotal, false, "There is no total again");
  matrix.columns[0].totalExpression = "sumInArray({q1}, 'col1')";
  assert.equal(matrix.hasTotal, true, "There is total, total expression");
});

QUnit.test("Test matrix.totalValue, expression question", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var matrix = new QuestionMatrixDropdownModel("q1");
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
  assert.ok(row, "Total row is not empty");
  assert.equal(row.cells.length, 3, "There are three cells here");
  var question = row.cells[0].question;
  assert.equal(
    question.getType(),
    "expression",
    "We can have only expression type cells in total"
  );
  assert.equal(
    question.expression,
    "sumInArray({self}, 'col1')",
    "Set expression correctly"
  );
  assert.equal(question.value, 1 + 2 + 4, "Calculated correctly");
  assert.equal(
    row.cells[1].value,
    10 + 20 + 40,
    "Calculated correctly, the second cell"
  );
  assert.equal(
    row.cells[2].value,
    1 + 2 + 4 + 10 + 20 + 40,
    "Calculated correctly, {row.col1} + {row.col2}"
  );
  assert.deepEqual(
    matrix.totalValue,
    { col1: 7, col2: 70, col3: 77 },
    "Total value calculated correctly"
  );
  assert.deepEqual(
    survey.getValue("q1-total"),
    { col1: 7, col2: 70, col3: 77 },
    "Total value set into survey correctly"
  );
});

QUnit.test("Test totals, different value types", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var matrix = new QuestionMatrixDropdownModel("q1");
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
  var row = matrix.visibleTotalRow;
  var question = row.cells[0].question;
  assert.equal(question.value, 3, "There are 3 values");
  matrix.columns[0].totalType = "min";
  survey.setValue("q2", 1);
  assert.equal(question.value, 1, "Min is 1");
  matrix.columns[0].totalType = "max";
  survey.setValue("q2", 2);
  assert.equal(question.value, 3, "Max is 3");
  matrix.columns[0].totalType = "avg";
  survey.setValue("q2", 3);
  assert.equal(question.value, 2, "Average is 2");
  matrix.columns[0].totalType = "sum";
  matrix.columns[0].totalFormat = "Sum: {0}";
  matrix.columns[0].totalDisplayStyle = "currency";
  survey.setValue("q2", 4);
  assert.equal(
    question.displayValue,
    "Sum: $6.00",
    "Use total column properties"
  );
});

QUnit.test("Test totals, load from JSON", function (assert) {
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
  assert.equal(question.value, 0, "The initial value is zero");
});

QUnit.test(
  "enableIf for new rows, Bug# https://surveyjs.answerdesk.io/ticket/details/T2065",
  function (assert) {
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
    assert.equal(
      matrix.visibleRows[0].cells[0].question.isReadOnly,
      true,
      "It is readOnly by default"
    );
    survey.setValue("q", "a");
    assert.equal(
      matrix.visibleRows[0].cells[0].question.isReadOnly,
      false,
      "It is not readOnly now"
    );
    matrix.addRow();
    assert.equal(
      matrix.visibleRows[2].cells[0].question.isReadOnly,
      false,
      "New added row is not readonly"
    );
    survey.clearValue("q");
    assert.equal(
      matrix.visibleRows[0].cells[0].question.isReadOnly,
      true,
      "The first row is readOnly again"
    );
    assert.equal(
      matrix.visibleRows[2].cells[0].question.isReadOnly,
      true,
      "The last row is readOnly"
    );
  }
);

QUnit.test("matrix dropdown + renderedTable.headerRow", function (assert) {
  var matrix = new QuestionMatrixDropdownModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rows = ["row1", "row2", "row3"];
  assert.equal(matrix.renderedTable.showHeader, true, "Header is shown");
  var cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "rows + 2 column");
  assert.equal(cells[0].hasTitle, true, "header rows");
  assert.equal(cells[0].locTitle.renderedHtml, "", "Nothing to render");
  assert.equal(cells[0].minWidth, "", "minWidth is empty for row header");
  assert.equal(cells[0].width, "", "width is empty for row header");
  assert.equal(cells[1].hasTitle, true, "col1");
  assert.equal(cells[1].hasQuestion, false, "no question");
  assert.equal(cells[1].minWidth, "", "col1.minWidth");
  assert.notOk(cells[1].isRemoveRow, "do not have remove row");
  assert.equal(cells[1].locTitle.renderedHtml, "col1", "col1");
  assert.equal(cells[2].locTitle.renderedHtml, "col2", "col2");
  assert.equal(cells[2].minWidth, "100px", "col2.minWidth");

  matrix.rowTitleWidth = "400px";
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells[0].width, "400px", "col1 width get from rowTitleWidth");

  matrix.showHeader = false;
  assert.equal(matrix.renderedTable.showHeader, false, "Header is not shown");
  assert.notOk(!!matrix.renderedTable.headerRow, "Header row is null");

  matrix.columnLayout = "vertical";
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "3 rows");
  assert.equal(cells[0].locTitle.renderedHtml, "row1", "row1");
  assert.equal(cells[2].locTitle.renderedHtml, "row3", "row1");

  matrix.showHeader = true;
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 4, "3 rows + columns");
  assert.equal(cells[0].locTitle.renderedHtml, "", "empty for header");
  assert.equal(cells[1].locTitle.renderedHtml, "row1", "row1");
  assert.equal(cells[3].locTitle.renderedHtml, "row3", "row1");
});

QUnit.test("matrix dynamic + renderedTable.headerRow", function (assert) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rowCount = 3;
  assert.equal(matrix.renderedTable.showHeader, true, "Header is shown");
  var cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "2 column + remove row");
  assert.equal(cells[0].hasTitle, true, "col1");
  assert.equal(cells[0].hasQuestion, false, "no question");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1");
  assert.notOk(cells[0].isRemoveRow, "do not have remove row");
  assert.equal(cells[1].locTitle.renderedHtml, "col2", "col2");
  assert.equal(cells[2].locTitle.renderedHtml, "", "remove row");
  assert.equal(cells[2].hasTitle, true, "remove row");
  matrix.minRowCount = 3;
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 2, "2 column");
  assert.equal(cells[0].hasTitle, true, "col1");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1");
  assert.equal(cells[1].locTitle.renderedHtml, "col2", "col2");
  matrix.addRow();
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "2 column + removeRow");
  matrix.showHeader = false;
  assert.equal(matrix.renderedTable.showHeader, false, "Header is not shown");
  assert.notOk(!!matrix.renderedTable.headerRow, "Header row is null");

  matrix.columnLayout = "vertical";
  assert.equal(
    matrix.renderedTable.showHeader,
    false,
    "Header is not shown, columnLayout is vertical"
  );
  matrix.showHeader = true;
  assert.equal(
    matrix.renderedTable.showHeader,
    false,
    "Header is not shown, columnLayout is still vertical"
  );
});

QUnit.test("matrix dropdown + renderedTable.rows", function (assert) {
  var matrix = new QuestionMatrixDropdownModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rows = ["row1", "row2", "row3"];
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "There are 3 rows");
  var cells = rows[0].cells;
  assert.equal(cells.length, 3, "rows + 2 column");
  assert.equal(cells[0].hasTitle, true, "header rows");
  assert.equal(cells[0].locTitle.renderedHtml, "row1", "row1");
  assert.equal(cells[1].hasTitle, false, "col1");
  assert.equal(cells[1].hasQuestion, true, "col1 question");
  assert.equal(cells[1].question.getType(), "text", "col1.cellType");
  assert.notOk(cells[1].isRemoveRow, "col1 do not have remove row");

  assert.equal(cells[2].hasTitle, false, "col2");
  assert.equal(cells[2].hasQuestion, true, "col2 question");
  assert.equal(cells[2].question.getType(), "dropdown", "col2.cellType");
  assert.notOk(cells[2].isRemoveRow, "col1 do not have remove row");

  cells = rows[2].cells;
  assert.equal(cells[0].locTitle.renderedHtml, "row3", "row3");
  assert.equal(cells[1].question.getType(), "text", "col1.cellType");
  assert.equal(cells[2].question.getType(), "dropdown", "col2.cellType");

  matrix.columnLayout = "vertical";
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 2, "2 columns");
  cells = rows[0].cells;
  assert.equal(cells.length, 4, "column + 3 rows");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1 title");
  assert.equal(cells[0].hasQuestion, false, "col1 title, no question");
  assert.equal(cells[1].question.getType(), "text", "row1.col1 cellType-text");
  assert.equal(cells[1].cell.column.name, "col1", "row1.col1 correct column");
  assert.equal(cells[3].question.getType(), "text", "row3.col1 cellType-text");
  assert.equal(cells[3].cell.column.name, "col1", "row3.col1 correct column");
  cells = rows[1].cells;
  assert.equal(cells[0].locTitle.renderedHtml, "col2", "col2 title");
  assert.equal(
    cells[1].question.getType(),
    "dropdown",
    "row1.col2 cellType-text"
  );
  assert.equal(cells[1].cell.column.name, "col2", "row1.col2 correct column");
  assert.equal(
    cells[3].question.getType(),
    "dropdown",
    "row3.col2 cellType-text"
  );
  assert.equal(cells[3].cell.column.name, "col2", "row3.col2 correct column");
});

QUnit.test("matrix dynamic + renderedTable.rows", function (assert) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rowCount = 3;
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "There are 3 rows");
  var cells = rows[0].cells;
  assert.equal(cells.length, 3, "2 column + remove");
  assert.equal(cells[0].hasTitle, false, "col1");
  assert.equal(cells[0].hasQuestion, true, "col1 question");
  assert.equal(cells[0].question.getType(), "text", "col1.cellType");
  assert.notOk(cells[0].isRemoveRow, "col1 do not have remove row");
  assert.ok(cells[0].row, "col1 has row property set");

  assert.equal(cells[1].hasTitle, false, "col2");
  assert.equal(cells[1].hasQuestion, true, "col2 question");
  assert.equal(cells[1].question.getType(), "dropdown", "col2.cellType");
  assert.notOk(cells[1].isRemoveRow, "col2 do not have remove row");

  assert.equal(cells[2].hasTitle, false, "remove row");
  assert.equal(cells[2].hasQuestion, false, "col2 question");
  assert.equal(cells[2].isRemoveRow, true, "is Remove row");
  assert.ok(!!cells[2].row, "is Remove has row property");

  cells = rows[2].cells;
  assert.equal(cells[0].question.getType(), "text", "col1.cellType");
  assert.equal(cells[1].question.getType(), "dropdown", "col2.cellType");
  assert.equal(cells[2].isRemoveRow, true, "is Remove row");

  matrix.minRowCount = 3;
  cells = matrix.renderedTable.rows[0].cells;
  assert.equal(cells.length, 2, "2 columns only");
  matrix.minRowCount = 2;
  cells = matrix.renderedTable.rows[0].cells;
  assert.equal(cells.length, 3, "2 columns + remove again");

  matrix.columnLayout = "vertical";
  rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "2 columns + remove");
  cells = rows[0].cells;
  assert.equal(cells.length, 4, "column + 3 rows");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1 title");
  assert.equal(cells[0].hasQuestion, false, "col1 title, no question");
  assert.equal(cells[1].question.getType(), "text", "row1.col1 cellType-text");
  assert.equal(cells[1].cell.column.name, "col1", "row1.col1 correct column");
  assert.ok(cells[1].row, "col1 has row property set");
  assert.equal(cells[3].question.getType(), "text", "row3.col1 cellType-text");
  assert.equal(cells[3].cell.column.name, "col1", "row3.col1 correct column");
  cells = rows[1].cells;
  assert.equal(cells[0].locTitle.renderedHtml, "col2", "col2 title");
  assert.equal(
    cells[1].question.getType(),
    "dropdown",
    "row1.col2 cellType-text"
  );
  assert.equal(cells[1].cell.column.name, "col2", "row1.col2 correct column");
  assert.equal(
    cells[3].question.getType(),
    "dropdown",
    "row3.col2 cellType-text"
  );
  assert.equal(cells[3].cell.column.name, "col2", "row3.col2 correct column");

  cells = rows[2].cells;
  assert.equal(cells.length, 4, "column + 3 rows");
  assert.equal(cells[0].locTitle.renderedHtml, "", "for column header");
  assert.notOk(cells[0].isRemoveRow, "not a remove button");
  assert.equal(cells[1].isRemoveRow, true, "row1: it is a remove row");
  assert.ok(cells[1].row, "row1: it has a row");
  assert.equal(cells[3].isRemoveRow, true, "row3: it is a remove row");
  assert.ok(cells[3].row, "row3: it has a row");

  matrix.minRowCount = 3;
  rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 2, "2 columns");

  matrix.showHeader = false;
  cells = matrix.renderedTable.rows[0].cells;
  assert.equal(cells.length, 3, "3 rows");
  assert.equal(cells[0].question.getType(), "text", "row1.col1 cellType-text");
  assert.equal(cells[2].question.getType(), "text", "row3.col1 cellType-text");
});

QUnit.test("matrix dropdown + renderedTable + totals", function (assert) {
  var matrix = new QuestionMatrixDropdownModel("q1");
  matrix.totalText = "ABC:";
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.columns[0].totalType = "count";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rows = ["row1", "row2", "row3"];

  assert.equal(matrix.renderedTable.showFooter, true, "Footer is shown");
  assert.ok(matrix.renderedTable.footerRow, "Footer row exists");
  matrix.columns[0].totalType = "none";

  assert.equal(matrix.renderedTable.showFooter, false, "Footer is not shown");
  assert.notOk(matrix.renderedTable.footerRow, "Footer row not exists");

  matrix.columns[0].totalType = "count";
  matrix.columnLayout = "vertical";
  assert.equal(
    matrix.renderedTable.showFooter,
    false,
    "Footer is not shown, columnLayout is vertical"
  );
  assert.notOk(
    matrix.renderedTable.footerRow,
    "Footer row not exists, columnLayout is vertical"
  );
  assert.equal(
    matrix.renderedTable.headerRow.cells[4].locTitle.renderedHtml,
    "ABC:",
    "total text"
  );
  matrix.columnLayout = "horizontal";
  assert.equal(
    matrix.renderedTable.showFooter,
    true,
    "Footer is not shown again"
  );
  assert.ok(matrix.renderedTable.footerRow, "Footer row exists");

  var cells = matrix.renderedTable.footerRow.cells;
  assert.equal(cells.length, 3, "rowHeader + 2 columns");
  assert.equal(cells[0].hasTitle, true, "header rows");
  assert.equal(cells[0].locTitle.renderedHtml, "ABC:", "footer rows");
  assert.equal(cells[0].hasQuestion, false, "footer rows, no question");
  assert.equal(cells[1].hasTitle, false, "total, not title");
  assert.equal(
    cells[1].question.getType(),
    "expression",
    "total, it is expression"
  );
  assert.equal(cells[2].hasTitle, false, "total, not title");
  assert.equal(
    cells[2].question.getType(),
    "expression",
    "total, it is expression"
  );

  matrix.columnLayout = "vertical";
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 2, "2 columns");
  cells = rows[0].cells;
  assert.equal(cells.length, 5, "column + 3 rows + total");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1 title");
  assert.equal(cells[0].hasQuestion, false, "col1 title, no question");
  assert.equal(cells[1].question.getType(), "text", "row1.col1 cellType-text");
  assert.equal(cells[1].cell.column.name, "col1", "row1.col1 correct column");
  assert.equal(cells[3].question.getType(), "text", "row3.col1 cellType-text");
  assert.equal(cells[3].cell.column.name, "col1", "row3.col1 correct column");
  assert.equal(cells[4].question.getType(), "expression", "total, question");
  assert.equal(cells[4].hasTitle, false, "total, no title");
});

QUnit.test("matrix dynamic + renderedTable + totals", function (assert) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.columns[0].totalType = "count";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rowCount = 3;

  var cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "2 columns + total");
  assert.equal(cells[0].hasTitle, true, "header, col1");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "header, col1");
  assert.equal(cells[1].locTitle.renderedHtml, "col2", "header, col2");
  assert.equal(cells[2].hasTitle, true, "header total");
  assert.equal(
    cells[2].locTitle.renderedHtml,
    "",
    "header total, empty string"
  );

  matrix.columnLayout = "vertical";
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "2 columns + remove");
  cells = rows[2].cells;
  assert.equal(cells.length, 5, "column + 3 rows + total");
  assert.equal(cells[0].locTitle.renderedHtml, "", "for column header");
  assert.notOk(cells[0].isRemoveRow, "not a remove button");
  assert.equal(cells[1].isRemoveRow, true, "row1: it is a remove row");
  assert.ok(cells[1].row, "row1: it has a row");
  assert.equal(cells[3].isRemoveRow, true, "row3: it is a remove row");
  assert.ok(cells[3].row, "row3: it has a row");
  assert.equal(cells[4].locTitle.renderedHtml, "", "for total");
});

QUnit.test("matrix dynamic + renderedTable + add/remove rows", function (
  assert
) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.columns[0].totalType = "count";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rowCount = 3;

  assert.equal(matrix.renderedTable.rows.length, 3, "There are 3 rows");
  var firstRowId = matrix.renderedTable.rows[0].id;
  var thirdRowId = matrix.renderedTable.rows[2].id;
  matrix.addRow();
  assert.equal(matrix.renderedTable.rows.length, 4, "There are 4 rows");
  assert.equal(
    matrix.renderedTable.rows[0].id,
    firstRowId,
    "Do not recreate row1 Id"
  );
  assert.equal(
    matrix.renderedTable.rows[2].id,
    thirdRowId,
    "Do not recreate row3 Id"
  );
  matrix.removeRow(1);
  assert.equal(
    matrix.renderedTable.rows.length,
    3,
    "There are 4 rows after remove"
  );
  assert.equal(
    matrix.renderedTable.rows[0].id,
    firstRowId,
    "Do not recreate row1 Id on remove"
  );
  assert.equal(
    matrix.renderedTable.rows[1].id,
    thirdRowId,
    "Do not recreate row3 Id on remove"
  );
});

QUnit.test(
  "matrix dynamic + renderedTable + optionsCaption and columnColCount",
  function (assert) {
    var matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    matrix.addColumn("col3");
    matrix.addColumn("col4");
    matrix.columns[1].cellType = "radiogroup";
    matrix.columns[2].optionsCaption = "col2 options";
    matrix.columns[3].cellType = "radiogroup";
    matrix.columns[3].colCount = 2;
    matrix.rowCount = 3;

    assert.equal(matrix.renderedTable.rows.length, 3, "There are 3 rows");
    matrix.optionsCaption = "My Caption";
    assert.equal(
      matrix.renderedTable.rows[0].cells[0].question["optionsCaption"],
      "My Caption",
      "options caption get from matrix"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[2].question["optionsCaption"],
      "col2 options",
      "options caption get from column"
    );
    matrix.columnColCount = 3;
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].question["colCount"],
      3,
      "question col count get from matrix"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[3].question["colCount"],
      2,
      "question col count get from column"
    );
  }
);

QUnit.test("matrix.rowsVisibleIf + renderedTable", function (assert) {
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
  assert.equal(
    qBestCar.renderedTable.rows.length,
    0,
    "cars are not selected yet"
  );
  qCars.value = ["BMW"];
  assert.equal(qBestCar.renderedTable.rows.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.renderedTable.rows.length, 3, "3 cars are selected");
  qBestCar.rowsVisibleIf = "";
  assert.equal(qBestCar.renderedTable.rows.length, 4, "there is no filter");
});
QUnit.test(
  "Matrixdynamic column.visibleIf, hide column if all cells are invisible + rendered table",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
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
    assert.equal(
      table.headerRow.cells.length,
      2,
      "Header: There is one visible column + Remove button"
    );
    assert.equal(
      table.rows[0].cells.length,
      2,
      "Rows: There is one visible column + Remove button"
    );
    assert.equal(
      table.footerRow.cells.length,
      2,
      "Footer: There is one visible column + Remove button"
    );
    matrix.columnLayout = "vertical";
    var rows = matrix.renderedTable.rows;
    assert.equal(rows.length, 2, "Only one column is shown + remove button");
  }
);

QUnit.test(
  "Matrix validation in cells and async functions in expression",
  function (assert) {
    var returnResult: (res: any) => void;
    function asyncFunc(params: any): any {
      returnResult = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

    var question = new QuestionMatrixDynamicModel("q1");
    question.rowCount = 1;
    var column = question.addColumn("col1");
    column.validators.push(new ExpressionValidator("asyncFunc() = 1"));
    var rows = question.visibleRows;
    question.hasErrors();
    var onCompletedAsyncValidatorsCounter = 0;
    question.onCompletedAsyncValidators = (hasErrors: boolean) => {
      onCompletedAsyncValidatorsCounter++;
    };
    assert.equal(
      question.isRunningValidators,
      true,
      "We have one running validator"
    );
    assert.equal(
      onCompletedAsyncValidatorsCounter,
      0,
      "onCompletedAsyncValidators is not called yet"
    );
    returnResult(1);
    assert.equal(question.isRunningValidators, false, "We are fine now");
    assert.equal(
      onCompletedAsyncValidatorsCounter,
      1,
      "onCompletedAsyncValidators is called"
    );

    FunctionFactory.Instance.unregister("asyncFunc");
  }
);

QUnit.test(
  "onValueChanged doesn't called on adding new row with calculated column, #1845",
  function (assert) {
    var rowCount = 0;
    function newIndexFor(params) {
      if (!params[0]) {
        rowCount++;
      }
      return params[0] || rowCount;
    }
    FunctionFactory.Instance.register("newIndexFor", newIndexFor);
    var survey = new SurveyModel({
      questions: [
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
    assert.equal(counter, 1, "onValueChanged has been called");
  }
);
QUnit.test("survey.onMatrixAllowRemoveRow", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdynamic",
        name: "q1",
        rowCount: 3,
        columns: ["1", "2"],
      },
    ],
  });
  survey.onMatrixAllowRemoveRow.add(function (sender, options) {
    options.allow = options.rowIndex % 2 == 0;
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  assert.equal(matrix.canRemoveRows, true, "The row can be removed");
  var table = matrix.renderedTable;
  assert.equal(
    table.rows[0].cells[2].isRemoveRow,
    true,
    "The first row can be removed"
  );
  assert.equal(
    table.rows[1].cells[2].isRemoveRow,
    false,
    "The second row can't be removed"
  );
  assert.equal(
    table.rows[2].cells[2].isRemoveRow,
    true,
    "The third row can be removed"
  );
});

QUnit.test(
  "two shared matrixdynamic - should be no errors, Bug #T3121 (https://surveyjs.answerdesk.io/ticket/details/T3121)",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
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
    assert.deepEqual(matrixDynamic.value, test_qualita, "Value set correctly");
  }
);

QUnit.test(
  "Totals in row using total in matrix, Bug #T3162 (https://surveyjs.answerdesk.io/ticket/details/T3162)",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
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
    var matrix = <QuestionMatrixDropdownModel>(
      survey.getQuestionByName("matrix")
    );
    var rows = matrix.visibleRows;
    rows[0].cells[0].value = 100;
    rows[0].cells[1].value = 100;
    assert.equal(rows[0].cells[2].value, 200, "cell1 + cell2");
    assert.equal(rows[0].cells[3].value, 1, "(cell1 + cell2)/total");
  }
);

QUnit.test(
  "The row numbers is incorrect after setting the value: survey.data, Bug #1958",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
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
    assert.equal(rows.length, 1, "we reset the number of rows to 1.");

    matrix.addRow();
    matrix.addRow();
    survey.data = { teachersRate: [{ subject: 1, explains: 0 }] };
    rows = matrix.visibleRows;
    assert.equal(rows.length, 1, "we reset the number of rows to 1 again.");
  }
);

QUnit.test(
  "Change question in rendered cell on changing column type, Bug https://github.com/surveyjs/survey-creator/issues/690",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
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

    assert.equal(
      matrix.renderedTable.rows[0].cells[0].question.getType(),
      "dropdown",
      "Default cell type"
    );

    matrix.columns[0].cellType = "radiogroup";
    assert.equal(
      matrix.renderedTable.rows[0].cells[0].question.getType(),
      "radiogroup",
      "Cell type should be changed"
    );
  }
);

QUnit.test(
  "Column.totalformat property doesn't changed on changing survey locale",
  function (assert) {
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
    assert.equal(
      matrix.renderedTable.footerRow.cells.length,
      2,
      "There are two cells in the footer row"
    );
    assert.equal(
      <QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ),
      "Total column 1: 10",
      "total for en locale is correct"
    );
    survey.locale = "de";
    assert.equal(
      <QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ),
      "Total Spalt 1: 10",
      "total for de locale is correct"
    );
    survey.locale = "fr";
    assert.equal(
      <QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ),
      "Total colonne 1: 10",
      "total for fr locale is correct"
    );
    survey.locale = "";
    assert.equal(
      <QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ),
      "Total column 1: 10",
      "total for en locale again is correct"
    );
  }
);

QUnit.test(
  "Changing rows in matrix dropdown doesn't update the table",
  function (assert) {
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
    assert.equal(matrix.renderedTable.rows.length, 2, "There are two rows");
    matrix.rows.push(new ItemValue("row2"));
    assert.equal(
      matrix.renderedTable.rows.length,
      3,
      "There are three rows now"
    );
    matrix.rows.splice(0, 1);
    assert.equal(
      matrix.renderedTable.rows.length,
      2,
      "There are two rows again"
    );
  }
);
QUnit.test("showInMultipleColumns property", function (assert) {
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
  assert.equal(
    matrix.renderedTable.headerRow.cells.length,
    1 + 3,
    "header: row value + 3 columns"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells.length,
    1 + 3,
    "first row: row value + 3 columns"
  );
  assert.equal(
    matrix.renderedTable.footerRow.cells.length,
    1 + 3,
    "footer: row value + 3 columns"
  );
  assert.equal(
    matrix.renderedTable.headerRow.cells[2].locTitle.renderedHtml,
    "col2",
    "Column header"
  );
  matrix.columns[1].showInMultipleColumns = true;
  assert.equal(
    matrix.renderedTable.headerRow.cells.length,
    1 + 2 + 3,
    "header: row value + 2 columns + showInMultipleColumns column"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells.length,
    1 + 2 + 3,
    "first row: row value + 2 columns + showInMultipleColumns column"
  );
  assert.equal(
    matrix.renderedTable.footerRow.cells.length,
    1 + 2 + 3,
    "footer:  row value + 2 columns + showInMultipleColumns column"
  );
  assert.equal(
    matrix.renderedTable.headerRow.cells[2].locTitle.renderedHtml,
    "1",
    "Column header, first choice"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].isCheckbox,
    true,
    "first row, first choice: it is checkbox"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].isChoice,
    true,
    "first row, first choice: isChoice"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].choiceValue,
    "1",
    "first row, first choice: choiceValue = 1"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[1].showErrorOnTop,
    true,
    "first row, text question: showErrorOnTop"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[1].showErrorOnBottom,
    false,
    "first row, text question: showErrorOnBottom"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].showErrorOnTop,
    true,
    "first row, first choice: showErrorOnTop"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].showErrorOnBottom,
    false,
    "first row, first choice: showErrorOnBottom"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[3].showErrorOnTop,
    false,
    "first row, second choice: showErrorOnTop"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[3].showErrorOnBottom,
    false,
    "first row, second choice: showErrorOnBottom"
  );
  assert.equal(
    matrix.renderedTable.footerRow.cells[2].isChoice,
    false,
    "footer cell:  isChoice should be false"
  );
});
QUnit.test(
  "showInMultipleColumns property + columnLayout = 'vertical'",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columnLayout: "vertical",
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
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 2 + 1,
      "header: column header + 2 rows + total"
    );
    assert.equal(
      matrix.renderedTable.rows.length,
      2 + 3,
      "rows.length = 2 columns + showInMultipleColumns column"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[0].locTitle.renderedHtml,
      "1",
      "header for showInMultipleColumns column"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].isChoice,
      true,
      "showInMultipleColumns, first choice: isChoice"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].choiceValue,
      "1",
      "showInMultipleColumns, first choice: choiceValue"
    );
    assert.equal(
      matrix.renderedTable.rows[1 + 2].cells[0].locTitle.renderedHtml,
      "3",
      "header for showInMultipleColumns column, third choice"
    );
    assert.equal(
      matrix.renderedTable.rows[1 + 2].cells[1].isChoice,
      true,
      "showInMultipleColumns, third choice: isChoice"
    );
    assert.equal(
      matrix.renderedTable.rows[1 + 2].cells[1].choiceValue,
      "3",
      "showInMultipleColumns, third choice: choiceValue"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, update on visibleChoices change",
  function (assert) {
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
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 2 + 3,
      "header: row value + 3 columns"
    );
    matrix.columns[1].choices.push(new ItemValue(4));
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 2 + 4,
      "header: row value + 4 columns"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, using default choices and cellType",
  function (assert) {
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
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 2 + 3,
      "header: row value + 3 columns"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, using default choices and cellType",
  function (assert) {
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
    assert.equal(rows.length, 2, "There are two rows");
    assert.equal(
      rows[1].getQuestionByColumnName("col1").value,
      "1",
      "Set the value correctly"
    );
  }
);

QUnit.test(
  "showInMultipleColumns property, using default choices and cellType, Bug #2151",
  function (assert) {
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

    assert.equal(matrix.renderedTable.rows.length, 2, "There are two rows");
    assert.equal(
      matrix.renderedTable.footerRow.cells[3].question.value,
      0,
      "Summary is 0"
    );
    var totalBoolQuestion = matrix.renderedTable.footerRow.cells[4].question;
    assert.equal(
      totalBoolQuestion.value,
      null,
      "There is no question value for boolean column"
    );
    assert.equal(
      totalBoolQuestion.getType(),
      "expression",
      "Total question for boolean column is expression"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, columnLayout: 'vertical' and other is empty value, Bug #2200",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columnLayout: "vertical",
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              hasOther: true,
              showInMultipleColumns: true,
              choices: [1, 2],
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

    assert.equal(
      matrix.renderedTable.rows.length,
      3,
      "There are two choices + other"
    );
    matrix.value = { row1: { col1: "other" } };
    assert.equal(matrix.hasErrors(), true, "There is error");
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].isChoice,
      true,
      "The first cell is checkbox"
    );
    assert.equal(
      matrix.renderedTable.rows[2].cells[1].isChoice,
      true,
      "The third cell is checkbox"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].isFirstChoice,
      true,
      "The first cell is firstchoice"
    );
    assert.equal(
      matrix.renderedTable.rows[2].cells[1].isFirstChoice,
      false,
      "The third cell is not firstchoice"
    );
    assert.equal(
      matrix.renderedTable.rows[2].cells[1].choiceIndex,
      2,
      "The third cell choiceIndex is not 0"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].showErrorOnTop,
      true,
      "Show errors for the first cell"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].showErrorOnTop,
      false,
      "Do not show errors for the second cell"
    );
    assert.equal(
      matrix.renderedTable.rows[2].cells[1].showErrorOnTop,
      false,
      "Do not show errors for the third cell"
    );
  }
);
QUnit.test(
  "Filter choices on value change in the next column, Bug #2182",
  function (assert) {
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
    assert.equal(q2.visibleChoices.length, 0, "There is no visible choices");
    q1.value = 1;
    assert.equal(q2.visibleChoices.length, 1, "There is 'A' item");
    q1.value = 2;
    assert.equal(q2.visibleChoices.length, 2, "There is 'B' and 'C' items");
  }
);
QUnit.test(
  "Survey.checkErrorsMode=onValueChanged, some errors should be shown onNextPage only, multipletext",
  function (assert) {
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
    assert.equal(
      rows[0].cells[1].question.errors.length,
      0,
      "There is no errors yet in the cell, first row, second column"
    );
    assert.equal(
      rows[1].cells[0].question.errors.length,
      0,
      "There is no errors yet in the cell, second row, first column"
    );
    survey.completeLastPage();
    assert.equal(
      rows[0].cells[1].question.errors.length,
      1,
      "There is error in the cell, first row, second column"
    );
    assert.equal(
      rows[1].cells[0].question.errors.length,
      1,
      "There is error in the cell, second row, first column"
    );
    rows[0].cells[0].value = 2;
    assert.equal(
      rows[0].cells[1].question.errors.length,
      1,
      "The error in the cell is not fixed, first row, second column"
    );
    assert.equal(
      rows[1].cells[0].question.errors.length,
      1,
      "The error in the cell is not fixed, first column"
    );
    rows[0].cells[1].value = 1;
    assert.equal(
      rows[0].cells[1].question.errors.length,
      0,
      "The error in the cell is gone, first row, second column"
    );
    assert.equal(
      rows[1].cells[0].question.errors.length,
      1,
      "The error in the cell is not fixed, first column, #2"
    );
    rows[1].cells[0].value = 1;
    assert.equal(
      rows[1].cells[0].question.errors.length,
      0,
      "The error in the cell is gone, first column, #2"
    );
  }
);
