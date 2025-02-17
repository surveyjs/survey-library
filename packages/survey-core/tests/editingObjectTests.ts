import { SurveyModel } from "../src/survey";
import { Base, Event, ArrayChanges } from "../src/base";
import { QuestionTextModel } from "../src/question_text";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { ExpressionValidator } from "../src/validator";
import {
  QuestionCompositeModel,
  ComponentCollection,
} from "../src/question_custom";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionBooleanModel } from "../src/question_boolean";
import { Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { QuestionMatrixModel } from "../src/question_matrix";
import { Question } from "../src/question";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { SurveyTriggerComplete } from "../src/trigger";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionCommentModel } from "../src/question_comment";

export default QUnit.module("Survey.editingObj Tests");

QUnit.test("Serializer.getObjPropertyValue/setObjPropertyValue", function (
  assert
) {
  var question = new QuestionTextModel("q1");
  question.title = "My title";
  assert.equal(
    Serializer.getObjPropertyValue(question, "name"),
    "q1",
    "Get question name correctly"
  );
  assert.equal(
    Serializer.getObjPropertyValue(question, "title"),
    "My title",
    "Get question title correctly"
  );
  Serializer.setObjPropertyValue(question, "name", "q2");
  Serializer.setObjPropertyValue(question, "title", "My title 2");
  assert.equal(
    Serializer.getObjPropertyValue(question, "name"),
    "q2",
    "Set question name correctly"
  );
  assert.equal(
    Serializer.getObjPropertyValue(question, "title"),
    "My title 2",
    "Set question title correctly"
  );
  var item = new ItemValue("item1");
  assert.equal(item.value, "item1", "property value set correctly");
  assert.equal(
    Serializer.getObjPropertyValue(item, "value"),
    "item1",
    "Get item value correctly"
  );
  assert.notOk(
    Serializer.getObjPropertyValue(item, "text"),
    "item text is empty"
  );
  item.text = "Item 1";
  assert.equal(
    Serializer.getObjPropertyValue(item, "text"),
    "Item 1",
    "Get item text correctly"
  );
});

QUnit.test(
  "Serializer.getObjPropertyValue/setObjPropertyValue for bindings",
  function (assert) {
    var question = new QuestionMatrixDynamicModel("q1");
    Serializer.setObjPropertyValue(question, "bindings", {
      rowCount: "q2",
    });
    assert.equal(
      question.bindings.getValueNameByPropertyName("rowCount"),
      "q2",
      "set correctly"
    );
  }
);
QUnit.test("Serializer.getObjPropertyValue/setObjPropertyValue for arrays", function (assert) {
  Serializer.addProperty("question", { name: "tagbox:set", choices: [1, 2, 3, 4] });
  const question = new QuestionTextModel("q1");
  const val = [1, 2];
  Serializer.setObjPropertyValue(question, "tagbox", val);
  assert.deepEqual(question.tagbox, [1, 2], "set correctly");
  val.splice(0, 1);
  assert.deepEqual(question.tagbox, [1, 2], "do not change on chaning array outside");
  Serializer.removeProperty("question", "tagbox");
});
QUnit.test(
  "Serializer.getObjPropertyValue doesn't work correctly for multipletext item",
  function (assert) {
    var question = new QuestionMultipleTextModel("q1");
    question.addItem("item1");
    assert.equal(
      Serializer.getObjPropertyValue(question.items[0], "name"),
      "item1",
      "Get item name correctly"
    );
  }
);
QUnit.test(
  "Serializer.getObjPropertyValue doesn't work correctly for multipletext item + validators",
  function (assert) {
    var question = new QuestionMultipleTextModel("q1");
    var item = question.addItem("item1");
    item.validators.push(new ExpressionValidator());
    assert.equal(
      Serializer.getObjPropertyValue(item, "validators")[0].getType(),
      "expressionvalidator",
      "validators returns correctly"
    );
  }
);
QUnit.test(
  "Serializer.getObjPropertyValue  for matrix dynamic columns",
  function (assert) {
    var question = new QuestionMatrixDynamicModel("q1");
    question.addColumn("column1");
    assert.equal(
      Serializer.getObjPropertyValue(question.columns[0], "name"),
      "column1",
      "Get column name correctly"
    );
  }
);

QUnit.test("Edit object property using the survey", function (assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel();
  survey.editingObj = question;
  assert.equal(
    survey.getValue("name"),
    "q1",
    "Get survey value from the object directly"
  );
  survey.setValue("name", "q2");
  assert.equal(question.name, "q2", "The question name was changed via survey");
  question.isRequired = true;
  survey.clearValue("isRequired");
  assert.equal(
    question.isRequired,
    false,
    "isRequired property is default again"
  );
});
QUnit.test("Expression based on object properties", function (assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "text", name: "inputType" },
      { type: "text", name: "min", visibleIf: "{inputType} = 'text'" },
    ],
  });
  survey.editingObj = question;
  assert.equal(survey.getValue("inputType"), "text", "Get the default value");
  var minQuestion = survey.getQuestionByName("min");
  assert.equal(
    minQuestion.isVisible,
    true,
    "min property should be visible by default"
  );
});
QUnit.test("React on property change", function (assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "text", name: "inputType" },
      { type: "text", name: "min", visibleIf: "{inputType} = 'text'" },
    ],
  });
  survey.editingObj = question;
  var minQuestion = survey.getQuestionByName("min");
  assert.equal(
    minQuestion.isVisible,
    true,
    "min property should be visible by default"
  );
  question.inputType = "color";
  assert.equal(minQuestion.isVisible, false, "min property is invisible now");
  question.inputType = "text";
  assert.equal(minQuestion.isVisible, true, "min property is visible again");
});
QUnit.test("property value is changed on set", function (assert) {
  var question = new QuestionRatingModel("q1");
  question.rateMin = 3;
  var survey = new SurveyModel({
    elements: [
      { type: "text", inputType: "number", name: "rateMin" },
      { type: "text", inputType: "number", name: "rateMax" }
    ]
  });
  survey.editingObj = question;
  const rateMax = survey.getQuestionByName("rateMax");
  rateMax.value = -1;
  assert.equal(question.rateMax, 4, "Do not set 1, revert to 4");
  assert.equal(rateMax.value, 4, "Change editor value as well");
});
QUnit.test("Edit question title property", function (assert) {
  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "comment", name: "title" },
    ],
  });
  survey.editingObj = question;
  assert.equal(question.title, "q1", "the default title value");
  assert.notOk(survey.getValue("title"), "The value is empty");
  survey.setValue("title", "q1 title");
  assert.equal(question.title, "q1 title", "set title property correctly");
  survey.setValue("title", "");
  assert.equal(question.title, "q1", "get title property from name");
  question.locTitle.text = "Question 1";
  assert.equal(
    survey.getQuestionByName("title").value,
    "Question 1",
    "Update text on changing locTitle.text"
  );
});
QUnit.test("Edit survey title property with isLocalizable=false", function (assert) {
  const prop = Serializer.findProperty("survey", "title");
  prop.isLocalizable = false;

  const editableSurvey = new SurveyModel({
    locale: "de",
    title: "default-value"
  });
  const survey = new SurveyModel({
    elements: [
      { type: "comment", name: "title" },
    ],
  });
  survey.editingObj = editableSurvey;
  assert.equal(editableSurvey.title, "default-value", "editableSurvey.title loaded correctly");
  assert.deepEqual(editableSurvey.locTitle.getJson(), "default-value", "editableSurvey.locTitle.getJson()");
  assert.equal(editableSurvey.locTitle.text, "default-value", "editableSurvey.locTitle.text");
  assert.equal(Serializer.getObjPropertyValue(editableSurvey, "title"), "default-value", "Serializer.getObjPropertyValue");
  const question = survey.getQuestionByName("title");
  assert.equal(question.value, "default-value", "editor has correct value");

  prop.isLocalizable = true;
});
QUnit.test("Edit question title property, setup initial value", function (
  assert
) {
  var question = new QuestionTextModel("q1");
  question.title = "My title";
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "comment", name: "title" },
    ],
  });
  survey.editingObj = question;
  assert.equal(survey.getValue("title"), "My title", "The title set correctly");
  survey.clearValue("title");
  assert.equal(question.title, "q1", "Reset question title");
});
QUnit.test("Edit columns in matrix", function (assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2", "Column 2");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        columns: [
          { cellType: "text", name: "name" },
          { cellType: "text", name: "title" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new MatrixDropdownColumn("col3");
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  const rows = matrix.visibleRows;
  let cellCreatedCallbackCounter = 0;
  matrix.onCellCreatedCallback = () => {
    cellCreatedCallbackCounter ++;
  };
  assert.equal(rows.length, 2, "Two columns");
  assert.equal(
    rows[0].cells[0].value,
    "col1",
    "Name set correctly"
  );
  assert.notOk(rows[0].cells[1].value, "Title is empty");
  assert.equal(
    rows[1].cells[1].value,
    "Column 2",
    "Set title correctly"
  );
  rows[0].cells[1].value = "title1";
  assert.equal(question.columns[0].title, "title1", "Edit title correctly");
  assert.equal(cellCreatedCallbackCounter, 0, "new cells are not created yet");
  matrix.addRow();
  assert.equal(cellCreatedCallbackCounter, 2, "two cells are created");
  assert.equal(question.columns.length, 3, "We have 3 columns");
  assert.equal(question.columns[2].name, "col3", "column has correct name");
  assert.equal(
    question.columns[2].getType(),
    "matrixdropdowncolumn",
    "column added with correct type"
  );
});
QUnit.test("Edit columns in matrix, check for empty titles", function (assert) {
  const question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  const createSurveyAndSetColumn = (column: MatrixDropdownColumn): SurveyModel => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "name"
        },
        {
          type: "text",
          name: "title"
        },
      ],
    });
    survey.editingObj = column;
    return survey;
  };
  let survey = createSurveyAndSetColumn(question.columns[0]);
  assert.equal(survey.getQuestionByName("name").value, "col1", "column.name #1");
  assert.notOk(survey.getQuestionByName("title").value, "column.title #1");

  survey = createSurveyAndSetColumn(question.columns[1]);
  assert.equal(survey.getQuestionByName("name").value, "col2", "column.name #2");
  assert.notOk(survey.getQuestionByName("title").value, "column.title #2");

  survey = createSurveyAndSetColumn(question.columns[0]);
  assert.equal(survey.getQuestionByName("name").value, "col1", "column.name #3");
  assert.notOk(survey.getQuestionByName("title").value, "column.title #3");

  survey = createSurveyAndSetColumn(question.columns[1]);
  assert.equal(survey.getQuestionByName("name").value, "col2", "column.name #4");
  assert.notOk(survey.getQuestionByName("title").value, "column.title #4");

  survey = createSurveyAndSetColumn(question.columns[0]);
  assert.equal(survey.getQuestionByName("name").value, "col1", "column.name #5");
  assert.notOk(survey.getQuestionByName("title").value, "column.title #5");
});
QUnit.test("allowRowsDragAndDrop and editingObj", function (assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  question.addColumn("col3");
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        allowRowsDragAndDrop: true,
        columns: [
          { cellType: "text", name: "name" },
          { cellType: "text", name: "title" },
        ],
      },
    ],
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  survey.editingObj = question;

  assert.equal(matrix.value.length, 3);
  assert.equal(matrix.value[0].name, "col1");
  assert.equal(matrix.value[1].name, "col2");
  assert.equal(matrix.value[2].name, "col3");

  let rows = matrix.visibleRows;
  let table = matrix.renderedTable;
  const row0Id = rows[0].id;
  const row1Id = rows[1].id;
  const row2Id = rows[2].id;
  let cellCreatedCallbackCounter = 0;
  matrix.onCellCreatedCallback = () => {
    cellCreatedCallbackCounter ++;
  };

  matrix.moveRowByIndex(0, 2);

  assert.equal(matrix.value.length, 3);
  assert.equal(matrix.value[0].name, "col2");
  assert.equal(matrix.value[1].name, "col3");
  assert.equal(matrix.value[2].name, "col1");

  rows = matrix.visibleRows;
  assert.equal(rows[0].id, row1Id, "row1 is not re-created, #1");
  assert.equal(rows[1].id, row2Id, "row2 is not re-created, #1");
  assert.equal(rows[2].id, row0Id, "row0 is not re-created, #1");
  assert.strictEqual(matrix.renderedTable, table, "rendered table is not recreated, #1");
  table = matrix.renderedTable;
  assert.equal(table.rows[1].cells[1].question.value, "col2", "renderedTable:Row0Cell0, #1");
  assert.equal(table.rows[3].cells[1].question.value, "col3", "renderedTable:Row1Cell0, #1");
  assert.equal(table.rows[5].cells[1].question.value, "col1", "renderedTable:Row1Cell0, #1");

  matrix.moveRowByIndex(1, 0);
  assert.equal(matrix.value.length, 3);
  assert.equal(matrix.value[0].name, "col3");
  assert.equal(matrix.value[1].name, "col2");
  assert.equal(matrix.value[2].name, "col1");
  rows = matrix.visibleRows;
  assert.equal(rows[0].id, row2Id, "row1 is not re-created, #2");
  assert.equal(rows[1].id, row1Id, "row2 is not re-created, #2");
  assert.equal(rows[2].id, row0Id, "row0 is not re-created, #2");
  assert.strictEqual(matrix.renderedTable, table, "rendered table is not recreated, #2");
  table = matrix.renderedTable;
  assert.equal(table.rows[1].cells[1].question.value, "col3", "renderedTable:Row0Cell0, #2");
  assert.equal(table.rows[3].cells[1].question.value, "col2", "renderedTable:Row1Cell0, #2");
  assert.equal(table.rows[5].cells[1].question.value, "col1", "renderedTable:Row1Cell0, #2");
  assert.equal(cellCreatedCallbackCounter, 0, "new cell is not created");
});
QUnit.test(
  "Edit columns in matrix, where there is no columns from the beginning",
  function (assert) {
    var question = new QuestionMatrixDynamicModel("q1");
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "columns",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "name" },
            { cellType: "text", name: "title" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("columns")
    );
    matrix.onGetValueForNewRowCallBack = (
      sender: QuestionMatrixDynamicModel
    ): any => {
      var item = new MatrixDropdownColumn("col1");
      matrix.value.push(item);
      return item;
    };
    survey.editingObj = question;
    matrix.addRow();
    assert.equal(matrix.visibleRows.length, 1, "Two columns");
    assert.equal(
      matrix.visibleRows[0].cells[0].value,
      "col1",
      "Name set correctly"
    );
    matrix.visibleRows[0].cells[1].value = "title1";
    assert.equal(question.columns.length, 1, "We have one column now");
    assert.equal(question.columns[0].name, "col1", "Edit name correctly");
    assert.equal(question.columns[0].title, "title1", "Edit title correctly");
  }
);
QUnit.test("Edit columns in matrix, column isRequired and isUnique", function (
  assert
) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        columns: [
          {
            cellType: "text",
            name: "name",
            isRequired: true,
            isUnique: true,
          },
          { cellType: "text", name: "title" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  survey.editingObj = question;
  assert.equal(matrix.visibleRows.length, 2, "Two columns");
  assert.equal(
    matrix.visibleRows[0].cells[0].value,
    "col1",
    "Name set correctly"
  );
  var rows = matrix.visibleRows;
  var nameQuestion = rows[0].cells[0].question;
  assert.equal(nameQuestion.isRequired, true, "cell question is required");
  nameQuestion.value = "";
  assert.equal(nameQuestion.isEmpty(), true, "reset name in editing matrix");
  assert.equal(nameQuestion.errors.length, 1, "required error");
  assert.equal(
    question.columns[0].name,
    "col1",
    "do not set empty value into column"
  );
  nameQuestion.value = "col2";
  assert.equal(
    nameQuestion.value,
    "col2",
    "set duplicated name in editing matrix"
  );
  assert.equal(nameQuestion.errors.length, 1, "duplicate error");
  assert.equal(
    question.columns[0].name,
    "col1",
    "do not set duplcated value into column"
  );
  nameQuestion.value = "col3";
  assert.equal(nameQuestion.errors.length, 0, "no errors");
  assert.equal(
    question.columns[0].name,
    "col3",
    "set name property into column"
  );
});
QUnit.test("Edit choices in matrix", function (assert) {
  var question = new QuestionDropdownModel("q1");
  question.choices = [{ value: "item1" }, { value: "item2", text: "Item 2" }];
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],
      },
    ],
  });
  survey.editingObj = question;
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ItemValue("val");
    matrix.value.push(item);
    return item;
  };
  assert.equal(matrix.visibleRows.length, 2, "two choice");
  assert.equal(
    matrix.visibleRows[0].cells[0].value,
    "item1",
    "set value property from choice"
  );
  assert.notOk(
    matrix.visibleRows[0].cells[1].value,
    "text property is empty in the first choice"
  );
  matrix.addRow();
  assert.notOk(
    matrix.visibleRows[0].cells[1].value,
    "text property is empty in the first choice is still empty"
  );
  assert.equal(
    matrix.visibleRows[1].cells[1].value,
    "Item 2",
    "set text property from choice"
  );
  matrix.visibleRows[0].cells[1].value = "Item 1";
  assert.equal(
    question.choices[0].text,
    "Item 1",
    "set text property from matrix"
  );
});
QUnit.test("Edit choices in matrix and localization", function (assert) {
  var question = new QuestionDropdownModel("q1");
  question.choices = [{ value: "item1" }, { value: "item2", text: "Item 2" }];
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],
      },
    ],
  });
  survey.editingObj = question;
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  const cell = matrix.visibleRows[1].cells[1];
  const itemValue = <ItemValue>question.choices[1];
  assert.equal(cell.value, "Item 2", "Initial");
  itemValue.text = "Item 2_1";
  assert.equal(cell.value, "Item 2_1", "Change #3");
  itemValue.locText.setLocaleText("default", "Item 2_2");
  assert.equal(cell.value, "Item 2_2", "Change #2");
  itemValue.locText.setLocaleText("de", "Item 2_3-de");
  assert.equal(cell.value, "Item 2_2", "Ignore change");
});
QUnit.test("Do not re-create rows and rendered table on adding new choice item", function (assert) {
  var question = new QuestionDropdownModel("q1");
  question.choices = [{ value: "item1" }, { value: "item2", text: "Item 2" }];
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],
      },
    ],
  });
  survey.editingObj = question;
  survey.onMatrixAllowRemoveRow.add((sender, options) => {
    assert.ok(options.row.editingObj, "Editing object is set");
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  assert.equal(matrix.visibleRows.length, 2, "two choice");
  const firstRowId = matrix.visibleRows[0].id;
  question.choices.push(new ItemValue("item3"));
  assert.equal(matrix.visibleRows[0].id, firstRowId, "row is not recreated");
  assert.equal(matrix.visibleRows.length, 3, "three choice");
});
QUnit.test("Edit choices in matrix", function (assert) {
  var question = new QuestionDropdownModel("q1");
  question.choices = [{ value: "item1" }, { value: "item2", text: "Item 2" }];
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],
      },
    ],
  });
  survey.editingObj = question;
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  assert.equal(matrix.visibleRows.length, 2, "two choice");
  assert.equal(
    matrix.visibleRows[0].cells[1].question.isEmpty(),
    true,
    "by default value is empty"
  );
  question.choices[0].locText.text = "My Text";
  assert.equal(
    matrix.visibleRows[0].cells[1].question.value,
    "My Text",
    "Update text accordingly"
  );
  question.choices[0].locText.text = "item1";
  assert.equal(matrix.visibleRows[0].cells[1].question.value, "item1", "Do not reset tedt");
});

QUnit.test("Edit choices in matrix with custom property", function (assert) {
  Serializer.addProperty("itemvalue", "imageLink");
  var question = new QuestionMatrixDynamicModel("q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
          { cellType: "text", name: "imageLink" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ItemValue("val");
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "one choice");
  matrix.visibleRows[0].cells[2].value = "imageVal";
  assert.equal(
    question.choices[0].imageLink,
    "imageVal",
    "set custom property from matrix"
  );
  question.choices[0].imageLink = "imageVal1";
  assert.equal(
    matrix.visibleRows[0].cells[2].value,
    "imageVal1",
    "set custom property from question"
  );
  Serializer.removeProperty("itemvalue", "imageLink");
});
QUnit.test("Edit choices in matrix + detailPanel + hasError", function (assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value", isRequired: true },
          { cellType: "text", name: "text" },
        ],
        detailPanelMode: "underRowSingle",
        detailElements: [{ type: "text", name: "value", isRequired: true }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ItemValue("val");
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  question.choices.push(new ItemValue(null));
  var rows = matrix.visibleRows;
  assert.equal(matrix.hasErrors(), true, "value is null");
  rows[0].cells[0].value = "item1";
  assert.equal(matrix.hasErrors(), false, "value is not null");
});
QUnit.test("Edit choices in matrix + detailPanel + addChoice", function (assert) {
  var question = new QuestionDropdownModel("q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value", isRequired: true },
          { cellType: "text", name: "text" },
        ],
        detailPanelMode: "underRowSingle",
        detailElements: [{ type: "text", name: "value", isRequired: true }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ItemValue("val");
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  question.choices.push(new ItemValue("val1"));
  let rows = matrix.visibleRows;
  rows[0].showDetailPanel();
  question.choices.push(new ItemValue("val3", "text3"));
  rows = matrix.visibleRows;
  assert.equal(rows.length, 2, "There are 2 rows");
  rows[1].showDetailPanel();
  const table = matrix.renderedTable;
  assert.equal(table.rows.length, 5, "There are 2 rows in rendred table");
  assert.equal(table.rows[1].row.id, rows[0].id, "row0.id is correct");
  assert.equal(table.rows[3].row.id, rows[1].id, "row1.id is correct");
  assert.equal(table.rows[4].isDetailRow, true, "The last row is detail row");
  assert.equal(table.rows[4].row.id, rows[1].id, "ros1.id in detail row");
});
QUnit.test("Edit custom choices in matrix with custom property", function (
  assert
) {
  Serializer.addClass("itemvalues_ex", [], null, "itemvalue");
  Serializer.addProperty("itemvalues_ex", "imageLink");
  Serializer.addProperty("text", { name: "test:itemvalues_ex[]" });
  var property = Serializer.findProperty("text", "test");
  property.type = "itemvalues_ex[]";

  var question = new QuestionTextModel("q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "test",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
          { cellType: "text", name: "imageLink" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("test");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = Serializer.createClass("itemvalues_ex");
    item.owner = matrix.value;
    matrix.value.push(item);
    return item;
  };
  survey.editingObj = question;
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "one choice");
  matrix.visibleRows[0].cells[2].value = "imageVal";
  assert.equal(
    question.test[0].imageLink,
    "imageVal",
    "set custom property from matrix"
  );
  question.test[0].imageLink = "imageVal1";
  assert.equal(
    matrix.visibleRows[0].cells[2].value,
    "imageVal1",
    "set custom property from question"
  );
  Serializer.removeProperty("text", "test");
  Serializer.removeProperty("itemvalues_ex", "imageLink");
  Serializer.removeClass("itemvalues_ex");
});

QUnit.test("Edit rateValues in matrix", function (assert) {
  var question = new QuestionRatingModel("q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "rateValues",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("rateValues")
  );
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ItemValue("item1");
    matrix.value.push(item);
    return item;
  };

  survey.editingObj = question;
  assert.equal(matrix.visibleRows.length, 0, "They are empty by default");
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "New value is added into matrix");
  assert.equal(
    question.rateValues.length,
    1,
    "New value is added into property"
  );
  assert.equal(
    question.rateValues[0].value,
    "item1",
    "The value added correctly"
  );
});

QUnit.test("Edit validators in matrix", function (assert) {
  var question = new QuestionTextModel("q1");
  //question.validators.push(new ExpressionValidator());
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "validators",
        rowCount: 0,
        columns: [
          {
            cellType: "dropdown",
            name: "validatorType",
            choices: [{ value: "expressionvalidator", text: "expression" }],
          },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("validators")
  );
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ExpressionValidator();
    item["validatorType"] = item.getType();
    sender.value.push(item);
    //question.validators.push(item);
    return item;
  };
  survey.editingObj = question;
  assert.strictEqual(
    matrix.value,
    question.validators,
    "matrix value and validators array is the same object"
  );
  assert.equal(matrix.visibleRows.length, 0, "visibleRows is empty");
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "visibleRows has a row");
  assert.equal(question.validators.length, 1, "Validator is here");
  assert.equal(
    question.validators[0]["validatorType"],
    "expressionvalidator",
    "validator is correct"
  );
  matrix.getDisplayValue(true);
  assert.equal(
    question.validators[0]["validatorType"],
    "expressionvalidator",
    "validator is correct after calling getDisplayValue"
  );
});

QUnit.test("Composite: create from code", function (assert) {
  var json = {
    name: "propertygrid_restful",
    createElements: function (panel, question) {
      panel.fromJSON({
        elements: [
          { type: "text", name: "url", title: question.title + "_url" },
        ],
      });
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "propertygrid_restful", name: "choicesByUrl" }],
  });
  var counter = 0;
  survey.onValueChanging.add(function (sender, options) {
    counter++;
  });
  var question = new QuestionDropdownModel("q1");
  question.choicesByUrl.url = "myUrl";
  survey.editingObj = question;
  assert.equal(counter, 0, "We do not change anything");
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var urlQ = q.contentPanel.questions[0];
  assert.equal(urlQ.value, "myUrl", "Url set correctly from question");
  assert.equal(urlQ.title, "choicesByUrl_url");
  urlQ.value = "myUrl2";
  assert.equal(question.choicesByUrl.url, "myUrl2", "Url set correctly into question");
  assert.equal(counter, 1, "We change url");
  urlQ.value = "";
  assert.notOk(question.choicesByUrl.url, "Url is empty");
  assert.equal(counter, 2, "We change url again");
  urlQ.value = "abc";
  assert.equal(question.choicesByUrl.url, "abc", "Url set correctly into question #2");
  question.choicesByUrl.url = "myUrl3";
  assert.equal(urlQ.value, "myUrl3", "Url set correctly from question #2");
  ComponentCollection.Instance.clear();
});

QUnit.test("simple validation, checkErrorsMode: onValueChanging", function (
  assert
) {
  var question = new QuestionDropdownModel("q1");
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [
      { type: "text", name: "name" },
      { type: "comment", name: "title" },
    ],
  });
  survey.onValidateQuestion.add(function (sender, options) {
    if (options.name !== "name") return;
    options.error = options.value.length != 3 ? "require3symbols" : null;
  });
  survey.editingObj = question;
  var nameQuestion = survey.getQuestionByName("name");
  nameQuestion.value = "q2";
  assert.equal(question.name, "q1", "We have old value");
  assert.equal(nameQuestion.value, "q2", "We have new value in prop grid");
  assert.equal(nameQuestion.errors.length, 1, "There is one error");
  nameQuestion.value = "qq2";
  assert.equal(question.name, "qq2", "We have new value");
  assert.equal(nameQuestion.errors.length, 0, "There is no errors");
});
QUnit.test("Validate in matrix, checkErrorsMode: onValueChanging", function (
  assert
) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        columns: [
          { cellType: "text", name: "name" },
          { cellType: "text", name: "title" },
        ],
      },
    ],
  });
  survey.onMatrixCellValidate.add(function (sender, options) {
    if (options.columnName != "name") return;
    options.error = options.value.length != 4 ? "Error in name" : null;
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  var row = matrix.visibleRows[0];
  survey.editingObj = question;
  matrix.visibleRows[0].cells[0].value = "col33";
  assert.equal(
    row.cells[0].value,
    "col33",
    "keep incorrect value in question cell"
  );
  assert.equal(row.cells[0].question.errors.length, 1, "There is an error");
  assert.equal(question.columns[0].name, "col1", "column name is not changed");
  matrix.visibleRows[0].cells[0].value = "col3";
  assert.equal(row.cells[0].question.errors.length, 0, "There is no errors");
  assert.equal(question.columns[0].name, "col3", "column name is changed");
});
QUnit.test("Edit question string[] property type", function (assert) {
  var question = new QuestionTextModel("q1");
  question.dataList = ["item1", "item2"];
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [{ type: "comment", name: "dataList" }],
  });
  var dataListQuestion = survey.getQuestionByName("dataList");
  dataListQuestion.valueFromDataCallback = function (val: any): any {
    if (!Array.isArray(val)) return "";
    return val.join("\n");
  };
  dataListQuestion.valueToDataCallback = function (val: any): any {
    if (!val) return [];
    return val.split("\n");
  };
  survey.editingObj = question;
  assert.deepEqual(
    survey.getValue("dataList"),
    ["item1", "item2"],
    "string[] property get correctly value"
  );
  assert.equal(dataListQuestion.value, "item1\nitem2");
  dataListQuestion.value = "item1\nitem2\nitem3";
  assert.equal(question.dataList.length, 3, "There are three items now");
  assert.equal(question.dataList[2], "item3", "The third item is 'item3'");
  question.locDataList.setLocaleText(null, "abc\ndef");
  assert.equal(dataListQuestion.value, "abc\ndef", "Update edited question correctly");
});
QUnit.test("Edit custom array that returns values onGetValue", function (
  assert
) {
  Serializer.addProperty("page", {
    name: "pages:surveypages",
    className: "page",
    category: "general",
    displayName: "Page order",
    onGetValue: function (obj) {
      return !!obj && !!obj.survey ? obj.survey.pages : [];
    },
    onSetValue: function (obj) {
      //Do nothing
    },
    isSerializable: false,
  });
  var survey = new SurveyModel();
  survey.addNewPage("page1");
  survey.addNewPage("page2");
  survey.addNewPage("page3");
  survey.currentPage = survey.pages[0];

  var editSurvey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [
      {
        type: "matrixdynamic",
        name: "pages",
        columns: [{ cellType: "text", name: "name" }],
        rowCount: 0,
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>(
    editSurvey.getQuestionByName("pages")
  );
  editSurvey.editingObj = survey.pages[0];
  var pages = editSurvey.getValue("pages");
  assert.ok(pages);
  assert.equal(pages.length, 3);
  var rows = matrix.visibleRows;
  assert.equal(rows.length, 3, "There are 3 pages");
  Serializer.removeProperty("page", "pages");
});
QUnit.test("Edit matrix dynamic column", function (assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  var column = question.addColumn("col1", "Column 1");
  column.cellType = "checkbox";
  column["showSelectAllItem"] = true;
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "name",
        isRequired: true,
      },
      {
        type: "comment",
        name: "title",
      },
      {
        type: "boolean",
        name: "hasSelectAll",
      },
    ],
  });
  survey.editingObj = column;
  assert.equal(
    survey.getQuestionByName("name").value,
    "col1",
    "column name value is set correctly"
  );
  assert.equal(
    survey.getQuestionByName("title").value,
    "Column 1",
    "column title value is set correctly"
  );
  assert.equal(
    survey.getQuestionByName("hasSelectAll").value,
    true,
    "column hasSelectAll value is set correctly"
  );
  survey.getQuestionByName("name").value = "col2";
  survey.getQuestionByName("title").value = "Column 2";
  survey.getQuestionByName("hasSelectAll").value = false;
  assert.equal(column.name, "col2", "column name changed correctly");
  assert.equal(column.title, "Column 2", "column title changed correctly");
  assert.equal(
    column["hasSelectAll"],
    false,
    "column hasSelectAll changed correctly"
  );
});
QUnit.test("Edit choices in matrix dynamic column", function (assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  var column = question.addColumn("col1", "Column 1");
  column.cellType = "checkbox";
  column["choices"] = [1, 2, 3, 4, 5];
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],
      },
    ],
  });
  survey.editingObj = column;
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  assert.equal(matrix.rowCount, 5, "There are 5 items");
  column["choices"].push(new ItemValue(6));
  assert.equal(matrix.rowCount, 6, "There are 6 items now");
  matrix.visibleRows[0].cells[0].value = "Item 1";
  assert.equal(column["choices"][0].value, "Item 1", "value changed in matrix");
});
QUnit.test("Edit choices in matrix dynamic column, unique in detail panel", function (assert) {
  const question = new QuestionDropdownModel("q1");
  question.choices = ["Item1", "Item2", "Item3"];
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        keyName: "value",
        columns: [
          { cellType: "text", name: "text" }
        ],
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "value" }]
      },
    ]
  });
  survey.editingObj = question;
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  assert.equal(matrix.rowCount, 3, "There are 3 items");
  const rows = matrix.visibleRows;
  rows[0].showDetailPanel();
  const row0Q = rows[0].detailPanel.getQuestionByName("value");
  assert.equal(row0Q.value, "Item1", "value is set");
  row0Q.value = "Item2";
  assert.equal(row0Q.errors.length, 1, "Has an error");
  assert.equal(rows[1].isDetailPanelShowing, true, "Show the second panel");
  row0Q.value = "Item4";
  assert.equal(row0Q.errors.length, 0, "No errors");
  assert.equal(question.choices[0].value, "Item4", "value is changed");
});
QUnit.test("Edit choices in matrix dynamic column, check errors", function (assert) {
  const question = new QuestionDropdownModel("q1");
  question.choices = ["Item1", "Item2", "Item3"];
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        keyName: "value",
        columns: [
          { cellType: "text", name: "value", isRequired: true, isUnique: true },
          { cellType: "text", name: "text" }
        ]
      },
    ],
    checkErrorsMode: "onValueChanging"
  });
  survey.editingObj = question;
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  assert.equal(matrix.rowCount, 3, "There are 3 items");
  const rows = matrix.visibleRows;
  const row0Q = rows[0].cells[0].question;
  const row1Q = rows[1].cells[0].question;
  row0Q.value = "Item2";
  assert.equal(row0Q.errors.length, 1, "row0Q errors, #1");
  assert.equal(row1Q.errors.length, 1, "row1Q errors, #1");
  row0Q.clearValue();
  assert.equal(row0Q.errors.length, 1, "row0Q errors, #2");
  assert.equal(row1Q.errors.length, 1, "row1Q errors, #2");
  row0Q.value = "Item2";
  assert.equal(row0Q.errors.length, 1, "row0Q errors, #3");
  assert.equal(row1Q.errors.length, 1, "row1Q errors, #3");
  row1Q.value = "Item4";
  assert.equal(row0Q.errors.length, 0, "row0Q errors, #4");
  assert.equal(row1Q.errors.length, 0, "row1Q errors, #4");
});
QUnit.test("Edit choices in matrix dynamic column, set correct value", function (assert) {
  const question = new QuestionDropdownModel("q1");
  question.choices = ["Item1", "Item2", "Item3"];
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        keyName: "value",
        columns: [
          { cellType: "text", name: "value", isRequired: true, isUnique: true }
        ]
      },
    ],
    checkErrorsMode: "onValueChanging"
  });
  survey.editingObj = question;
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  assert.equal(matrix.rowCount, 3, "There are 3 items");
  const rows = matrix.visibleRows;
  rows[1].cells[0].question.value = "Item1";
  rows[0].cells[0].question.value = "Item2";
  assert.equal(question.choices[0].value, "Item2", "choice 0");
  assert.equal(question.choices[1].value, "Item1", "choice 1");
});
QUnit.test("Call onMatrixCellCreated correctly, Bug#8873", function (assert) {
  const question = new QuestionDropdownModel("q1");
  question.choices = ["Item1", "Item2", "Item3"];
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "choices",
        rowCount: 0,
        keyName: "value",
        columns: [
          { cellType: "text", name: "value", isRequired: true, isUnique: true },
          { cellType: "text", name: "text" }
        ]
      },
    ],
    checkErrorsMode: "onValueChanging"
  });
  survey.editingObj = question;
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
  assert.equal(matrix.visibleRows.length, 3, "There are 3 items");
  let cellCreatedCounter: number = 0;
  survey.onMatrixCellCreated.add((sender, options) => {
    cellCreatedCounter ++;
    if(options.columnName === "text") {
      options.cellQuestion.placeholder = options.row.getQuestionByName("value").value;
    }
  });
  question.choices.splice(2, 1);
  assert.equal(matrix.visibleRows.length, 2, "There are 2 items");
  assert.equal(cellCreatedCounter, 0, "no cells created");
  question.choices.push(new ItemValue("Item 4"));
  assert.equal(matrix.visibleRows.length, 3, "There are 3 items again");
  assert.equal(cellCreatedCounter, 2, "two cells created");
  assert.equal(matrix.visibleRows[2].cells[1].question.placeholder, "Item 4", "placeholder is set");
});

QUnit.test("Edit question.page property", function (assert) {
  var questionSurvey = new SurveyModel();
  questionSurvey.addNewPage("page1");
  questionSurvey.addNewPage("page2");
  var question = questionSurvey.pages[0].addNewQuestion("text", "q1");
  var survey = new SurveyModel({
    elements: [
      {
        type: "dropdown",
        name: "page",
        choices: ["page1", "page2"],
      },
    ],
  });
  var pageQuestion = survey.getQuestionByName("page");
  pageQuestion.valueFromDataCallback = (val: any): any => {
    return !!val ? val.name : "";
  };
  pageQuestion.valueToDataCallback = (val: any): any => {
    if (!val) return undefined;
    return questionSurvey.getPageByName(val);
  };
  survey.editingObj = question;
  assert.equal(pageQuestion.value, "page1", "Set page from question correctly");
  pageQuestion.value = "page2";
  assert.equal(question.page.name, "page2", "Set question.page from survey");
});
QUnit.test("Dispose editing survey correctly", function (assert) {
  var questionSurvey = new SurveyModel();
  questionSurvey.addNewPage("page1");
  var question = questionSurvey.pages[0].addNewQuestion("text", "q1");
  var json = {
    elements: [
      {
        type: "text",
        name: "name",
      },
    ],
  };
  var survey1 = new SurveyModel(json);
  var survey2 = new SurveyModel(json);
  survey1.editingObj = question;
  survey2.editingObj = question;
  question.name = "q2";
  assert.equal(
    survey1.getQuestionByName("name").value,
    "q2",
    "react on changing in survey1"
  );
  assert.equal(
    survey2.getQuestionByName("name").value,
    "q2",
    "react on changing in survey2"
  );
  survey1.dispose();
  question.name = "q3";
  assert.equal(
    survey1.getQuestionByName("name").value,
    "q2",
    "do not react on changing in survey1"
  );
  assert.equal(
    survey2.getQuestionByName("name").value,
    "q3",
    "react on changing in survey2"
  );
});
QUnit.test("Change locale", function (assert) {
  var localeSurvey = new SurveyModel();
  var json = {
    elements: [
      {
        type: "text",
        name: "locale",
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.editingObj = localeSurvey;
  survey.getQuestionByName("locale").value = "de";
  assert.equal(localeSurvey.locale, "de", "Locale has been changed");
  localeSurvey.locale = "";
});
QUnit.test(
  "Do not call notification on changing properties that are not exists in Serialization",
  function (assert) {
    var questionSurvey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }],
    });
    var json = {
      elements: [
        {
          type: "text",
          name: "name",
        },
      ],
    };
    var q1 = questionSurvey.getQuestionByName("q1");
    var survey = new SurveyModel(json);
    var counter = 0;
    survey.onValueChanged.add((sender: Base, options: any) => {
      counter++;
    });
    survey.editingObj = q1;
    //change cssClasses value
    var cssClasses = q1.cssClasses;
    assert.equal(counter, 0, "Do not send any notifications");
  }
);
QUnit.test("Do not set directly array objects", function (assert) {
  var editingSurvey = new SurveyModel();
  editingSurvey.addNewPage("page1");
  editingSurvey.addNewPage("page2");
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "pages",
        rowCount: 0,
        columns: [{ cellType: "text", name: "name" }],
      },
    ],
  });
  survey.editingObj = editingSurvey;
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("pages");
  assert.equal(matrix.rowCount, 2, "There are 2 pages");
  matrix.removeRow(1);
  assert.equal(editingSurvey.pages.length, 1, "There is one page now");
});

QUnit.test("Do not break reactive array in original object", function (assert) {
  var question = new QuestionMatrixModel("q1");
  question.addColumn("col1");
  question.addColumn("col2");
  var colCountOnChanged = {};
  var reactiveFunc = (hash: any, key: any): void => {
    var val: any = hash[key];
    if (typeof val === "function") {
      val = val();
    }
    if (Array.isArray(val)) {
      val["onArrayChanged"] = (arrayChanges: ArrayChanges) => {
        colCountOnChanged[key] = val.length;
      };
    }
  };
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "columns",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],
      },
    ],
  });
  question.iteratePropertiesHash((hash: any, key: any) => {
    reactiveFunc(hash, key);
  });
  survey.editingObj = question;
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
  matrix.onGetValueForNewRowCallBack = (
    sender: QuestionMatrixDynamicModel
  ): any => {
    var item = new ItemValue("val");
    matrix.value.push(item);
    return item;
  };
  assert.equal(matrix.rowCount, 2, "There are 2 columns");
  assert.equal(Array.isArray(matrix.value), true, "Value is Array");
  assert.strictEqual(matrix.value, question.columns, "Edting value is correct");

  matrix.iteratePropertiesHash((hash: any, key: any) => {
    reactiveFunc(hash, key);
  });
  matrix.addRow();
  matrix.addRow();
  assert.equal(matrix.rowCount, 4, "There are 4 columns");
  assert.equal(
    colCountOnChanged["columns"],
    4,
    "There are 4 columns in notification"
  );
  assert.notOk(colCountOnChanged["value"], "We do not iterate by value");
});

QUnit.test("Value property editor test", function (assert) {
  var propertyGridValueJSON = {
    name: "propertygrid_value",
    showInToolbox: false,
    questionJSON: {
      type: "html",
      html: "empty",
    },
    onValueChanged: (question: Question, name: string, newValue: any) => {
      var displayValue = question.isEmpty()
        ? "empty"
        : JSON.stringify(question.value);
      question.contentQuestion.html = displayValue;
    },
  };

  ComponentCollection.Instance.add(propertyGridValueJSON);
  var question = new QuestionCheckboxModel("q1");
  question.choices = [
    { value: 1, text: "Item 1" },
    { value: 2, text: "Item 2" },
  ];
  var survey = new SurveyModel({
    elements: [
      {
        type: "propertygrid_value",
        name: "defaultValue",
      },
    ],
  });
  survey.editingObj = question;
  var editQuestion = survey.getQuestionByName("defaultValue");
  var htmlQuestion = editQuestion.contentQuestion;
  assert.equal(htmlQuestion.html, "empty");
  question.defaultValue = [1, 2];
  assert.equal(htmlQuestion.html, "[1,2]");
  question.defaultValue = undefined;
  assert.equal(htmlQuestion.html, "empty");

  ComponentCollection.Instance.clear();
});

QUnit.test("Check column min width property is set correctly to editor", function (assert) {
  const question = new QuestionMatrixDynamicModel("q1");
  question.addColumn("col1");
  const column = question.columns[0];
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "minWidth"
      },
    ],
  });
  survey.editingObj = column;
  const editor = survey.getAllQuestions()[0];
  const property = Serializer.findProperty(column.getType(), "minWidth");
  assert.equal(editor.value, "300px");
  property.onPropertyEditorUpdate(column, editor);
  assert.equal(editor.value, "");
});
QUnit.test("Allow to set empty string into localization string & string property with default value", function (assert) {
  const question = new QuestionDropdownModel("q1");
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "placeholder" },
      { type: "text", name: "minWidth" },
      { type: "text", name: "valueName" },
    ],
  });
  survey.editingObj = question;
  const placeholderQuestion = survey.getQuestionByName("placeholder");
  const minWidthQuestion = survey.getQuestionByName("minWidth");
  const valueNameQuestion = survey.getQuestionByName("valueName");
  assert.equal(placeholderQuestion.value, "Select...", "placeholder - default value");
  assert.equal(minWidthQuestion.value, "300px", "minWidth - default value");
  assert.notOk(valueNameQuestion.value, "valueName is empty by default");
  placeholderQuestion.value = "";
  minWidthQuestion.value = "";
  valueNameQuestion.value = "";
  assert.strictEqual(placeholderQuestion.value, "", "placeholder question value is empty");
  assert.strictEqual(minWidthQuestion.value, "", "minWidth question value is empty");
  assert.strictEqual(question.placeholder, "", "dropdown.placeholder value is empty");
  assert.strictEqual(question.minWidth, "", "dropdown.minWidth value is empty");
  assert.deepEqual(question.toJSON(), {
    name: "q1", placeholder: "", minWidth: ""
  });
  const q2 = Serializer.createClass("dropdown");
  q2.fromJSON({
    name: "q2", placeholder: "", minWidth: ""
  });
  assert.equal(q2.name, "q2", "set the name correctly");
  assert.strictEqual(q2.placeholder, "", "q2.placeholder value is empty");
  assert.strictEqual(q2.minWidth, "", "q2.minWidth value is empty");
});
QUnit.test("Edit triggers array", function (assert) {
  const survey = new SurveyModel();

  const editSurvey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "triggers",
        columns: [{ cellType: "text", name: "type" }],
        rowCount: 0,
      },
    ],
  });
  editSurvey.onMatrixCellCreated.add((sender, options) => {
    const obj = options.row.editingObj;
    if(obj) {
      options.cell.value = obj.getType();
    }
  });
  const matrix = <QuestionMatrixDynamicModel>(
    editSurvey.getQuestionByName("triggers")
  );
  editSurvey.editingObj = survey;
  assert.equal(matrix.visibleRows.length, 0, "There is no triggers");
  survey.triggers.push(new SurveyTriggerComplete());
  assert.equal(matrix.visibleRows.length, 1, "There is one trigger");
  assert.equal(matrix.visibleRows[0].cells[0].value, "completetrigger", "correct trigger type");
});
QUnit.test("multipletextitem title in detail panel", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "multipletext", name: "q1", items: [{ name: "item1" }] }
    ]
  });
  const question = survey.getQuestionByName("q1");
  const editSurvey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "items",
        columns: [{ cellType: "text", name: "name" }, { cellType: "text", name: "title" }],
        rowCount: 0,
        detailPanelMode: "underRowSingle",
        detailElements: [{ type: "text", name: "title" }]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>(editSurvey.getQuestionByName("items"));
  editSurvey.editingObj = question;
  assert.equal(matrix.visibleRows.length, 1, "One item");
  const row = matrix.visibleRows[0];
  const titleCell = row.cells[1].question;
  row.showDetailPanel();
  const titleQuestion = row.detailPanel.getQuestionByName("title");
  assert.notOk(titleCell.value, "cell #1");
  assert.notOk(titleQuestion.value, "question #1");
  titleQuestion.value = "Item 1";
  assert.equal(titleCell.value, "Item 1", "cell #2");
  assert.equal(titleQuestion.value, "Item 1", "question #2");
  assert.equal(question.items[0].title, "Item 1", "item title #1");
  titleQuestion.value = "";
  assert.notOk(titleCell.value, "cell #3");
  assert.notOk(titleQuestion.value, "question #3");
});
QUnit.test("reset property value", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "boolean", name: "q1" }
    ]
  });
  const question = <QuestionBooleanModel>survey.getQuestionByName("q1");
  const editSurvey = new SurveyModel({
    elements: [
      {
        type: "comment",
        name: "labelTrue"
      }
    ]
  });
  const comment = <QuestionMatrixDynamicModel>(editSurvey.getQuestionByName("labelTrue"));
  editSurvey.editingObj = question;
  assert.equal(comment.value, "Yes", "value #1");
  question.labelTrue = "abc";
  assert.equal(comment.value, "abc", "value #2");
  question.resetPropertyValue("labelTrue");
  assert.equal(question.labelTrue, "Yes", "labelTrue value");
  assert.equal(comment.value, "Yes", "value #3");
});
QUnit.test("paneldynamic. templateVisibleIf", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "paneldynamic", name: "q2", templateVisibleIf: "{q1} = 'a'" }
    ]
  });
  const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q2");
  const editSurvey = new SurveyModel({
    elements: [
      {
        type: "comment",
        name: "templateVisibleIf"
      }
    ]
  });
  const comment = <QuestionMatrixDynamicModel>(editSurvey.getQuestionByName("templateVisibleIf"));
  editSurvey.editingObj = question;
  assert.equal(comment.value, "{q1} = 'a'", "value #1");
  question.templateVisibleIf = "{q1} = 'b'";
  assert.equal(comment.value, "{q1} = 'b'", "value #2");
  comment.value = "{q1} = 'c'";
  assert.equal(question.templateVisibleIf, "{q1} = 'c'", "property value #1");
});
QUnit.test("survey, complete text & locale", function (assert) {
  const survey = new SurveyModel({
    completedHtml: "html:default",
    description: "text:default",
  });
  const editSurvey = new SurveyModel({
    elements: [
      {
        type: "comment",
        name: "completedHtml"
      },
      {
        type: "comment",
        name: "description"
      }
    ]
  });
  const commentHtml = <QuestionCommentModel>(editSurvey.getQuestionByName("completedHtml"));
  const commentText = <QuestionCommentModel>(editSurvey.getQuestionByName("description"));
  editSurvey.editingObj = survey;
  assert.equal(commentHtml.value, "html:default", "comment #1");
  assert.equal(commentText.value, "text:default", "commentText #1");
  survey.locale = "de";
  assert.equal(commentHtml.value, "html:default", "comment #2");
  assert.equal(commentText.value, "text:default", "commentText #2");
  commentHtml.value = "html:de";
  commentText.value = "text:de";
  assert.equal(survey.completedHtml, "html:de", "completedHtml #1");
  assert.equal(survey.description, "text:de", "description #1");
  survey.locale = "";
  assert.equal(survey.completedHtml, "html:default", "completedHtml #2");
  assert.equal(commentHtml.value, "html:default", "comment  #3");
  assert.equal(survey.description, "text:default", "description #2");
  assert.equal(commentText.value, "text:default", "commentText  #3");
  survey.locale = "fr";
  commentHtml.value = "html:fr";
  commentText.value = "text:fr";
  survey.locale = "de";
  assert.equal(survey.completedHtml, "html:de", "completedHtml #3");
  assert.equal(commentHtml.value, "html:de", "comment #4");
  assert.equal(survey.description, "text:de", "description #3");
  assert.equal(commentText.value, "text:de", "commentText #4");
});
QUnit.test("Column visible property", function (assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  const column = question.addColumn("col1");
  column.visible = false;
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "name" },
      { type: "boolean", name: "visible" },
    ],
  });
  survey.editingObj = column;
  assert.equal(column.visible, false, "column visible property");
  assert.equal(Serializer.getObjPropertyValue(column, "visible"), false, "Serializer.getObjPropertyValue");
  const nameQuestion = survey.getQuestionByName("name");
  const visibleQuestion = survey.getQuestionByName("visible");
  assert.equal(nameQuestion.value, "col1", "column name");
  assert.equal(visibleQuestion.value, false, "column visible");
  visibleQuestion.value = true;
  assert.equal(visibleQuestion.value, true, "column visible, #2");
  assert.equal(column.visible, true, "column visible property, #2");
  assert.equal(Serializer.getObjPropertyValue(column, "visible"), true, "Serializer.getObjPropertyValue, #2");
  column.visible = false;
  assert.equal(visibleQuestion.value, false, "column visible, #3");
  assert.equal(column.visible, false, "column visible property, #3");
  assert.equal(Serializer.getObjPropertyValue(column, "visible"), false, "Serializer.getObjPropertyValue, #3");
});
QUnit.test("Multiple text item, onPropertyValueChanged", function (assert) {
  const question = new QuestionMultipleTextModel("q1");
  const item = question.addItem("item1");
  const logs = new Array<string>();
  item.onPropertyChanged.add((sender, options) => {
    logs.push(options.name);
  });
  item.name = "item2";
  item.title = "Item 2";
  item.validators.push(new ExpressionValidator("{q1}=1"));
  assert.deepEqual(logs, ["name", "title", "validators"], "#1");
});
