import { SurveyModel } from "../src/survey";
import { Base } from "../src/base";
import { QuestionTextModel } from "../src/question_text";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { MatrixDynamicRowModel, QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
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
import { ChoiceItem } from "../src/question_baseselect";
import { ActionContainer } from "../src/actions/container";

import { describe, test, expect } from "vitest";
describe("Survey.editingObj Tests", () => {
  test("Serializer.getObjPropertyValue/setObjPropertyValue", () => {
    var question = new QuestionTextModel("q1");
    question.title = "My title";
    expect(Serializer.getObjPropertyValue(question, "name"), "Get question name correctly").toBe("q1");
    expect(Serializer.getObjPropertyValue(question, "title"), "Get question title correctly").toBe("My title");
    Serializer.setObjPropertyValue(question, "name", "q2");
    Serializer.setObjPropertyValue(question, "title", "My title 2");
    expect(Serializer.getObjPropertyValue(question, "name"), "Set question name correctly").toBe("q2");
    expect(Serializer.getObjPropertyValue(question, "title"), "Set question title correctly").toBe("My title 2");
    var item = new ItemValue("item1");
    expect(item.value, "property value set correctly").toBe("item1");
    expect(Serializer.getObjPropertyValue(item, "value"), "Get item value correctly").toBe("item1");
    expect(Serializer.getObjPropertyValue(item, "text"), "item text is empty").toBeFalsy();
    item.text = "Item 1";
    expect(Serializer.getObjPropertyValue(item, "text"), "Get item text correctly").toBe("Item 1");
  });

  test("Serializer.getObjPropertyValue/setObjPropertyValue for bindings", () => {
    var question = new QuestionMatrixDynamicModel("q1");
    Serializer.setObjPropertyValue(question, "bindings", {
      rowCount: "q2",
    });
    expect(question.bindings.getValueNameByPropertyName("rowCount"), "set correctly").toBe("q2");
  });
  test("Serializer.getObjPropertyValue/setObjPropertyValue for arrays", () => {
    Serializer.addProperty("question", { name: "tagbox:set", choices: [1, 2, 3, 4] });
    const question = new QuestionTextModel("q1");
    const val = [1, 2];
    Serializer.setObjPropertyValue(question, "tagbox", val);
    expect(question.tagbox, "set correctly").toEqual([1, 2]);
    val.splice(0, 1);
    expect(question.tagbox, "do not change on chaning array outside").toEqual([1, 2]);
    Serializer.removeProperty("question", "tagbox");
  });
  test("Serializer.getObjPropertyValue doesn't work correctly for multipletext item", () => {
    var question = new QuestionMultipleTextModel("q1");
    question.addItem("item1");
    expect(Serializer.getObjPropertyValue(question.items[0], "name"), "Get item name correctly").toBe("item1");
  });
  test("Serializer.getObjPropertyValue doesn't work correctly for multipletext item + validators", () => {
    var question = new QuestionMultipleTextModel("q1");
    var item = question.addItem("item1");
    item.validators.push(new ExpressionValidator());
    expect(Serializer.getObjPropertyValue(item, "validators")[0].getType(), "validators returns correctly").toBe("expressionvalidator");
  });
  test("Serializer.getObjPropertyValue  for matrix dynamic columns", () => {
    var question = new QuestionMatrixDynamicModel("q1");
    question.addColumn("column1");
    expect(Serializer.getObjPropertyValue(question.columns[0], "name"), "Get column name correctly").toBe("column1");
  });

  test("Edit object property using the survey", () => {
    var question = new QuestionTextModel("q1");
    var survey = new SurveyModel();
    survey.editingObj = question;
    expect(survey.getValue("name"), "Get survey value from the object directly").toBe("q1");
    survey.setValue("name", "q2");
    expect(question.name, "The question name was changed via survey").toBe("q2");
    question.isRequired = true;
    survey.clearValue("isRequired");
    expect(question.isRequired, "isRequired property is default again").toBe(false);
  });
  test("Expression based on object properties", () => {
    var question = new QuestionTextModel("q1");
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "name" },
        { type: "text", name: "inputType" },
        { type: "text", name: "min", visibleIf: "{inputType} = 'text'" },
      ],
    });
    survey.editingObj = question;
    expect(survey.getValue("inputType"), "Get the default value").toBe("text");
    var minQuestion = survey.getQuestionByName("min");
    expect(minQuestion.isVisible, "min property should be visible by default").toBe(true);
  });
  test("React on property change", () => {
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
    expect(minQuestion.isVisible, "min property should be visible by default").toBe(true);
    question.inputType = "color";
    expect(minQuestion.isVisible, "min property is invisible now").toBe(false);
    question.inputType = "text";
    expect(minQuestion.isVisible, "min property is visible again").toBe(true);
  });
  test("property value is changed on set", () => {
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
    expect(question.rateMax, "Do not set 1, revert to 4").toBe(4);
    expect(rateMax.value, "Change editor value as well").toBe(4);
  });
  test("Edit question title property", () => {
    var question = new QuestionTextModel("q1");
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "name" },
        { type: "comment", name: "title" },
      ],
    });
    survey.editingObj = question;
    expect(question.title, "the default title value").toBe("q1");
    expect(survey.getValue("title"), "The value is empty").toBeFalsy();
    survey.setValue("title", "q1 title");
    expect(question.title, "set title property correctly").toBe("q1 title");
    survey.setValue("title", "");
    expect(question.title, "get title property from name").toBe("q1");
    question.locTitle.text = "Question 1";
    expect(survey.getQuestionByName("title").value, "Update text on changing locTitle.text").toBe("Question 1");
  });
  test("Edit survey title property with isLocalizable=false", () => {
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
    expect(editableSurvey.title, "editableSurvey.title loaded correctly").toBe("default-value");
    expect(editableSurvey.locTitle.getJson(), "editableSurvey.locTitle.getJson()").toEqual("default-value");
    expect(editableSurvey.locTitle.text, "editableSurvey.locTitle.text").toBe("default-value");
    expect(Serializer.getObjPropertyValue(editableSurvey, "title"), "Serializer.getObjPropertyValue").toBe("default-value");
    const question = survey.getQuestionByName("title");
    expect(question.value, "editor has correct value").toBe("default-value");

    prop.isLocalizable = true;
  });
  test("Edit question title property for non default locale", () => {
    const editableSurvey = new SurveyModel({
      elements: [{ type: "text", name: "q1", title: "Question 1" }],
    });
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "name" }, { type: "comment", name: "title" }],
    });
    editableSurvey.locale = "de";
    const q1 = <QuestionTextModel>editableSurvey.getQuestionByName("q1");
    survey.editingObj = q1;
    const titleQuestion = survey.getQuestionByName("title");
    expect(titleQuestion.value, "show empty value").toBeFalsy();
    Serializer.findProperty("question", "title").onPropertyEditorUpdate(q1, titleQuestion);
    expect(titleQuestion.placeholder, "set correct placeholder, locale is de").toBe("Question 1");
    titleQuestion.value = "Frage 1";
    expect(q1.locTitle.getLocaleText("de"), "set localized title").toBe("Frage 1");
    expect(q1.locTitle.getLocaleText("default"), "get default title").toBe("Question 1");
    editableSurvey.locale = "";
    Serializer.findProperty("question", "title").onPropertyEditorUpdate(q1, titleQuestion);
    expect(titleQuestion.placeholder, "set correct placeholder, locale is default").toBe("q1");
  });
  test("Edit question title property, setup initial value", () => {
    var question = new QuestionTextModel("q1");
    question.title = "My title";
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "name" },
        { type: "comment", name: "title" },
      ],
    });
    survey.editingObj = question;
    expect(survey.getValue("title"), "The title set correctly").toBe("My title");
    survey.clearValue("title");
    expect(question.title, "Reset question title").toBe("q1");
  });
  test("Edit columns in matrix", () => {
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
    expect(rows.length, "Two columns").toBe(2);
    expect(rows[0].cells[0].value, "Name set correctly").toBe("col1");
    expect(rows[0].cells[1].value, "Title is empty").toBeFalsy();
    expect(rows[1].cells[1].value, "Set title correctly").toBe("Column 2");
    rows[0].cells[1].value = "title1";
    expect(question.columns[0].title, "Edit title correctly").toBe("title1");
    expect(cellCreatedCallbackCounter, "new cells are not created yet").toBe(0);
    matrix.addRow();
    expect(cellCreatedCallbackCounter, "two cells are created").toBe(2);
    expect(question.columns.length, "We have 3 columns").toBe(3);
    expect(question.columns[2].name, "column has correct name").toBe("col3");
    expect(question.columns[2].getType(), "column added with correct type").toBe("matrixdropdowncolumn");
  });
  test("Edit columns in matrix, check for empty titles", () => {
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
    expect(survey.getQuestionByName("name").value, "column.name #1").toBe("col1");
    expect(survey.getQuestionByName("title").value, "column.title #1").toBeFalsy();

    survey = createSurveyAndSetColumn(question.columns[1]);
    expect(survey.getQuestionByName("name").value, "column.name #2").toBe("col2");
    expect(survey.getQuestionByName("title").value, "column.title #2").toBeFalsy();

    survey = createSurveyAndSetColumn(question.columns[0]);
    expect(survey.getQuestionByName("name").value, "column.name #3").toBe("col1");
    expect(survey.getQuestionByName("title").value, "column.title #3").toBeFalsy();

    survey = createSurveyAndSetColumn(question.columns[1]);
    expect(survey.getQuestionByName("name").value, "column.name #4").toBe("col2");
    expect(survey.getQuestionByName("title").value, "column.title #4").toBeFalsy();

    survey = createSurveyAndSetColumn(question.columns[0]);
    expect(survey.getQuestionByName("name").value, "column.name #5").toBe("col1");
    expect(survey.getQuestionByName("title").value, "column.title #5").toBeFalsy();
  });
  test("allowRowReorder and editingObj", () => {
    var question = new QuestionMatrixDynamicModel("q1");
    question.addColumn("col1");
    question.addColumn("col2");
    question.addColumn("col3");
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "columns",
          allowRowReorder: true,
          columns: [
            { cellType: "text", name: "name" },
            { cellType: "text", name: "title" },
          ],
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
    survey.editingObj = question;

    expect(matrix.value.length).toBe(3);
    expect(matrix.value[0].name).toBe("col1");
    expect(matrix.value[1].name).toBe("col2");
    expect(matrix.value[2].name).toBe("col3");

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

    expect(matrix.value.length).toBe(3);
    expect(matrix.value[0].name).toBe("col2");
    expect(matrix.value[1].name).toBe("col3");
    expect(matrix.value[2].name).toBe("col1");

    rows = matrix.visibleRows;
    expect(rows[0].id, "row1 is not re-created, #1").toBe(row1Id);
    expect(rows[1].id, "row2 is not re-created, #1").toBe(row2Id);
    expect(rows[2].id, "row0 is not re-created, #1").toBe(row0Id);
    expect(matrix.renderedTable, "rendered table is not recreated, #1").toBe(table);
    table = matrix.renderedTable;
    expect(table.rows[1].cells[1].question.value, "renderedTable:Row0Cell0, #1").toBe("col2");
    expect(table.rows[3].cells[1].question.value, "renderedTable:Row1Cell0, #1").toBe("col3");
    expect(table.rows[5].cells[1].question.value, "renderedTable:Row1Cell0, #1").toBe("col1");

    matrix.moveRowByIndex(1, 0);
    expect(matrix.value.length).toBe(3);
    expect(matrix.value[0].name).toBe("col3");
    expect(matrix.value[1].name).toBe("col2");
    expect(matrix.value[2].name).toBe("col1");
    rows = matrix.visibleRows;
    expect(rows[0].id, "row1 is not re-created, #2").toBe(row2Id);
    expect(rows[1].id, "row2 is not re-created, #2").toBe(row1Id);
    expect(rows[2].id, "row0 is not re-created, #2").toBe(row0Id);
    expect(matrix.renderedTable, "rendered table is not recreated, #2").toBe(table);
    table = matrix.renderedTable;
    expect(table.rows[1].cells[1].question.value, "renderedTable:Row0Cell0, #2").toBe("col3");
    expect(table.rows[3].cells[1].question.value, "renderedTable:Row1Cell0, #2").toBe("col2");
    expect(table.rows[5].cells[1].question.value, "renderedTable:Row1Cell0, #2").toBe("col1");
    expect(cellCreatedCallbackCounter, "new cell is not created").toBe(0);
  });
  test("Edit matrix dropdown rows in matrix dynamic - removeRow does not call createRenderedRow, Bug#11212", () => {
    const question = new QuestionMatrixDropdownModel("q1");
    question.addColumn("col1");
    question.rows = ["row1", "row2", "row3"];
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "rows",
          columns: [
            { cellType: "text", name: "value" },
            { cellType: "text", name: "text" },
          ],
        },
      ],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("rows");
    survey.editingObj = question;

    expect(matrix.visibleRows.length, "There are 3 rows initially").toBe(3);
    expect(question.rows.length, "matrix dropdown has 3 rows initially").toBe(3);

    const renderedTable: any = matrix.renderedTable;
    const originalCreateRenderedRow = renderedTable.createRenderedRow;
    let createRenderedRowCallCount = 0;
    renderedTable.createRenderedRow = function (cssClasses: any, isDetailRow: boolean = false) {
      createRenderedRowCallCount++;
      return originalCreateRenderedRow.call(this, cssClasses, isDetailRow);
    };

    const questionRenderedTable: any = question.renderedTable;
    const questionOriginalCreateRenderedRow = questionRenderedTable.createRenderedRow;
    let questionCreateRenderedRowCallCount = 0;
    questionRenderedTable.createRenderedRow = function (cssClasses: any, isDetailRow: boolean = false) {
      questionCreateRenderedRowCallCount++;
      return questionOriginalCreateRenderedRow.call(this, cssClasses, isDetailRow);
    };

    matrix.removeRow(1);

    expect(question.rows.length, "matrix dropdown row is removed").toBe(2);
    expect(question.rows[0].value, "first row is row1").toBe("row1");
    expect(question.rows[1].value, "second row is row3").toBe("row3");
    expect(matrix.visibleRows.length, "There are 2 visible rows after remove").toBe(2);
    expect(matrix.renderedTable, "matrix rendered table is not recreated after removeRow").toBe(renderedTable);
    expect(matrix.renderedTable.uniqueId, "matrix renderedTable.uniqueId is the same after removeRow").toBe(renderedTable.uniqueId);
    expect(matrix.renderedTable.rows.length, "There are 2 rendered rows (with errors) after remove").toBe(2 * 2);
    expect(createRenderedRowCallCount, "createRenderedRow is not called on removeRow").toBe(0);

    expect(question.visibleRows.length, "question has 2 visible rows after remove").toBe(2);
    expect(question.renderedTable, "question rendered table is not recreated after single row removal").toBe(questionRenderedTable);
    expect(question.renderedTable.uniqueId, "question renderedTable.uniqueId is the same after removeRow").toBe(questionRenderedTable.uniqueId);
    expect(question.renderedTable.rows.length, "question has 2 rendered rows (with errors) after remove").toBe(2 * 2);
    expect(questionCreateRenderedRowCallCount, "question createRenderedRow is not called on single row removal").toBe(0);

    // Data rows are at odd indices (each data row is preceded by an error row).
    const getQuestionRowText = (dataIdx: number): string => {
      const r = question.renderedTable.rows[dataIdx * 2 + 1];
      return r && r.cells[0] && r.cells[0].locTitle ? r.cells[0].locTitle.renderedHtml : "";
    };
    const getQuestionRowName = (dataIdx: number): string => question.renderedTable.rows[dataIdx * 2 + 1].row?.rowName;
    const getMatrixCellValue = (dataIdx: number, cellIndex: number): any => {
      const cell = matrix.renderedTable.rows[dataIdx * 2 + 1].cells[cellIndex];
      return cell?.question?.value;
    };

    expect(getQuestionRowText(0), "after remove: question rendered data row 0 text is row1").toBe("row1");
    expect(getQuestionRowText(1), "after remove: question rendered data row 1 text is row3").toBe("row3");
    expect(getQuestionRowName(0), "after remove: question rendered data row 0 maps to row1").toBe("row1");
    expect(getQuestionRowName(1), "after remove: question rendered data row 1 maps to row3").toBe("row3");
    expect(getMatrixCellValue(0, 0), "after remove: matrix rendered data row 0 value cell = row1").toBe("row1");
    expect(getMatrixCellValue(1, 0), "after remove: matrix rendered data row 1 value cell = row3").toBe("row3");

    question.rows.push(new ItemValue("row4"));

    expect(question.rows.length, "matrix dropdown row is added").toBe(3);
    expect(question.rows[2].value, "third row is row4").toBe("row4");
    expect(matrix.visibleRows.length, "There are 3 visible rows after add").toBe(3);
    expect(matrix.renderedTable, "matrix rendered table is not recreated after addRow").toBe(renderedTable);
    expect(matrix.renderedTable.uniqueId, "matrix renderedTable.uniqueId is the same after addRow").toBe(renderedTable.uniqueId);

    expect(question.visibleRows.length, "question has 3 visible rows after add").toBe(3);
    expect(question.renderedTable, "question rendered table is not recreated after single row add").toBe(questionRenderedTable);
    expect(question.renderedTable.uniqueId, "question renderedTable.uniqueId is the same after addRow").toBe(questionRenderedTable.uniqueId);
    expect(question.renderedTable.rows.length, "question has 3 rendered rows (with errors) after add").toBe(3 * 2);
    expect(questionCreateRenderedRowCallCount, "question createRenderedRow is called only once for the new data row").toBe(1);

    expect(getQuestionRowText(0), "after add: question rendered data row 0 text is row1").toBe("row1");
    expect(getQuestionRowText(1), "after add: question rendered data row 1 text is row3").toBe("row3");
    expect(getQuestionRowText(2), "after add: question rendered data row 2 text is row4").toBe("row4");
    expect(getQuestionRowName(2), "after add: question rendered data row 2 maps to row4").toBe("row4");
    expect(getMatrixCellValue(0, 0), "after add: matrix rendered data row 0 value cell = row1").toBe("row1");
    expect(getMatrixCellValue(1, 0), "after add: matrix rendered data row 1 value cell = row3").toBe("row3");
    expect(getMatrixCellValue(2, 0), "after add: matrix rendered data row 2 value cell = row4").toBe("row4");
  });
  test("Edit columns in matrix, where there is no columns from the beginning", () => {
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
    expect(matrix.visibleRows.length, "Two columns").toBe(1);
    expect(matrix.visibleRows[0].cells[0].value, "Name set correctly").toBe("col1");
    matrix.visibleRows[0].cells[1].value = "title1";
    expect(question.columns.length, "We have one column now").toBe(1);
    expect(question.columns[0].name, "Edit name correctly").toBe("col1");
    expect(question.columns[0].title, "Edit title correctly").toBe("title1");
  });
  test("Edit columns in matrix, column isRequired and isUnique", () => {
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
    expect(matrix.visibleRows.length, "Two columns").toBe(2);
    expect(matrix.visibleRows[0].cells[0].value, "Name set correctly").toBe("col1");
    var rows = matrix.visibleRows;
    var nameQuestion = rows[0].cells[0].question;
    expect(nameQuestion.isRequired, "cell question is required").toBe(true);
    nameQuestion.value = "";
    expect(nameQuestion.isEmpty(), "reset name in editing matrix").toBe(true);
    expect(nameQuestion.errors.length, "required error").toBe(1);
    expect(question.columns[0].name, "do not set empty value into column").toBe("col1");
    nameQuestion.value = "col2";
    expect(nameQuestion.value, "set duplicated name in editing matrix").toBe("col2");
    expect(nameQuestion.errors.length, "duplicate error").toBe(1);
    expect(question.columns[0].name, "do not set duplcated value into column").toBe("col1");
    nameQuestion.value = "col3";
    expect(nameQuestion.errors.length, "no errors").toBe(0);
    expect(question.columns[0].name, "set name property into column").toBe("col3");
  });
  test("Edit choices in matrix", () => {
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
    expect(matrix.visibleRows.length, "two choice").toBe(2);
    expect(matrix.visibleRows[0].cells[0].value, "set value property from choice").toBe("item1");
    expect(matrix.visibleRows[0].cells[1].value, "text property is empty in the first choice").toBeFalsy();
    matrix.addRow();
    expect(matrix.visibleRows[0].cells[1].value, "text property is empty in the first choice is still empty").toBeFalsy();
    expect(matrix.visibleRows[1].cells[1].value, "set text property from choice").toBe("Item 2");
    matrix.visibleRows[0].cells[1].value = "Item 1";
    expect(question.choices[0].text, "set text property from matrix").toBe("Item 1");
  });
  test("Edit choices in matrix", () => {
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
    expect(cell.value, "Initial").toBe("Item 2");
    itemValue.text = "Item 2_1";
    expect(cell.value, "Change #3").toBe("Item 2_1");
    itemValue.locText.setLocaleText("default", "Item 2_2");
    expect(cell.value, "Change #2").toBe("Item 2_2");
    itemValue.locText.setLocaleText("de", "Item 2_3-de");
    expect(cell.value, "Ignore change").toBe("Item 2_2");
  });
  test("Edit choices in matrix and localization", () => {
    const editableSurvey = new SurveyModel({
      elements: [{ type: "dropdown", name: "q1", choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }] }],
    });
    const question = editableSurvey.getQuestionByName("q1");
    editableSurvey.locale = "de";
    const survey = new SurveyModel({
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
    const cell = <QuestionTextModel>matrix.visibleRows[1].cells[1].question;
    const itemValue = <ItemValue>question.choices[1];
    expect(cell.value, "cell.value, #1").toBeFalsy();
    itemValue.text = "Item 2_1";
    expect(cell.value, "cell.value, #2").toBe("Item 2_1");
    itemValue.locText.setLocaleText("default", "Item 2_2");
    expect(cell.value, "cell.value #3").toBe("Item 2_1");
    itemValue.locText.setLocaleText("de", "Item 2_3-de");
    expect(cell.value, "cell.value #4").toBe("Item 2_3-de");
  });
  test("Do not re-create cell questions on removing a row with editingObj", () => {
    var question = new QuestionMatrixDynamicModel("q1");
    question.addColumn("col1");
    question.addColumn("col2");
    question.addColumn("col3");
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
    survey.editingObj = question;
    var rows = matrix.visibleRows;
    expect(rows.length, "Three columns").toBe(3);
    const row0CellQuestionId = rows[0].cells[0].question.id;
    const row2CellQuestionId = rows[2].cells[0].question.id;
    let cellCreatedCallbackCounter = 0;
    matrix.onCellCreatedCallback = () => {
      cellCreatedCallbackCounter++;
    };
    matrix.removeRow(1);
    expect(question.columns.length, "We have 2 columns").toBe(2);
    expect(question.columns[0].name, "first column is col1").toBe("col1");
    expect(question.columns[1].name, "second column is col3").toBe("col3");
    rows = matrix.visibleRows;
    expect(rows.length, "Two rows remain").toBe(2);
    expect(rows[0].cells[0].question.id, "first row cell question is not re-created").toBe(row0CellQuestionId);
    expect(rows[1].cells[0].question.id, "last row cell question is not re-created").toBe(row2CellQuestionId);
    expect(cellCreatedCallbackCounter, "no new cells are created on row removal").toBe(0);
  });
  test("Do not re-create rows and rendered table on adding new choice item", () => {
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
    survey.onMatrixRenderRemoveButton.add((sender, options) => {
      expect(options.row.editingObj, "Editing object is set").toBeTruthy();
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("choices");
    expect(matrix.visibleRows.length, "two choice").toBe(2);
    const firstRowId = matrix.visibleRows[0].id;
    question.choices.push(new ItemValue("item3"));
    expect(matrix.visibleRows[0].id, "row is not recreated").toBe(firstRowId);
    expect(matrix.visibleRows.length, "three choice").toBe(3);
  });
  test("Edit choices in matrix", () => {
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
    expect(matrix.visibleRows.length, "two choice").toBe(2);
    expect(matrix.visibleRows[0].cells[1].question.isEmpty(), "by default value is empty").toBe(true);
    question.choices[0].locText.text = "My Text";
    expect(matrix.visibleRows[0].cells[1].question.value, "Update text accordingly").toBe("My Text");
    question.choices[0].locText.text = "item1";
    expect(matrix.visibleRows[0].cells[1].question.value, "Do not reset tedt").toBe("item1");
  });

  test("Edit choices in matrix with custom property", () => {
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
    expect(matrix.visibleRows.length, "one choice").toBe(1);
    matrix.visibleRows[0].cells[2].value = "imageVal";
    expect(question.choices[0].imageLink, "set custom property from matrix").toBe("imageVal");
    question.choices[0].imageLink = "imageVal1";
    expect(matrix.visibleRows[0].cells[2].value, "set custom property from question").toBe("imageVal1");
    Serializer.removeProperty("itemvalue", "imageLink");
  });
  test("Edit choices in matrix + detailPanel + hasError", () => {
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
    expect(matrix.validate(), "value is null").toBe(false);
    rows[0].cells[0].value = "item1";
    expect(matrix.validate(), "value is not null").toBe(true);
  });
  test("Edit choices in matrix + detailPanel + addChoice", () => {
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
    expect(rows.length, "There are 2 rows").toBe(2);
    rows[1].showDetailPanel();
    const table = matrix.renderedTable;
    expect(table.rows.length, "There are 2 rows in rendred table").toBe(5);
    expect(table.rows[1].row.id, "row0.id is correct").toBe(rows[0].id);
    expect(table.rows[3].row.id, "row1.id is correct").toBe(rows[1].id);
    expect(table.rows[4].isDetailRow, "The last row is detail row").toBe(true);
    expect(table.rows[4].row.id, "ros1.id in detail row").toBe(rows[1].id);
  });
  test("Edit custom choices in matrix with custom property", () => {
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
    expect(matrix.visibleRows.length, "one choice").toBe(1);
    matrix.visibleRows[0].cells[2].value = "imageVal";
    expect(question.test[0].imageLink, "set custom property from matrix").toBe("imageVal");
    question.test[0].imageLink = "imageVal1";
    expect(matrix.visibleRows[0].cells[2].value, "set custom property from question").toBe("imageVal1");
    Serializer.removeProperty("text", "test");
    Serializer.removeProperty("itemvalues_ex", "imageLink");
    Serializer.removeClass("itemvalues_ex");
  });

  test("Edit rateValues in matrix", () => {
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
    expect(matrix.visibleRows.length, "They are empty by default").toBe(0);
    matrix.addRow();
    expect(matrix.visibleRows.length, "New value is added into matrix").toBe(1);
    expect(question.rateValues.length, "New value is added into property").toBe(1);
    expect(question.rateValues[0].value, "The value added correctly").toBe("item1");
  });

  test("Edit validators in matrix", () => {
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
    expect(matrix.value, "matrix value and validators array is the same object").toBe(question.validators);
    expect(matrix.visibleRows.length, "visibleRows is empty").toBe(0);
    matrix.addRow();
    expect(matrix.visibleRows.length, "visibleRows has a row").toBe(1);
    expect(question.validators.length, "Validator is here").toBe(1);
    expect(question.validators[0]["validatorType"], "validator is correct").toBe("expressionvalidator");
    matrix.getDisplayValue(true);
    expect(question.validators[0]["validatorType"], "validator is correct after calling getDisplayValue").toBe("expressionvalidator");
  });

  test("Composite: create from code", () => {
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
    expect(counter, "We do not change anything").toBe(0);
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var urlQ = q.contentPanel.questions[0];
    expect(urlQ.value, "Url set correctly from question").toBe("myUrl");
    expect(urlQ.title).toBe("choicesByUrl_url");
    urlQ.value = "myUrl2";
    expect(question.choicesByUrl.url, "Url set correctly into question").toBe("myUrl2");
    expect(counter, "We change url").toBe(1);
    urlQ.value = "";
    expect(question.choicesByUrl.url, "Url is empty").toBeFalsy();
    expect(counter, "We change url again").toBe(2);
    urlQ.value = "abc";
    expect(question.choicesByUrl.url, "Url set correctly into question #2").toBe("abc");
    question.choicesByUrl.url = "myUrl3";
    expect(urlQ.value, "Url set correctly from question #2").toBe("myUrl3");
    ComponentCollection.Instance.clear();
  });

  test("simple validation, checkErrorsMode: onValueChanging", () => {
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
    expect(question.name, "We have old value").toBe("q1");
    expect(nameQuestion.value, "We have new value in prop grid").toBe("q2");
    expect(nameQuestion.errors.length, "There is one error").toBe(1);
    nameQuestion.value = "qq2";
    expect(question.name, "We have new value").toBe("qq2");
    expect(nameQuestion.errors.length, "There is no errors").toBe(0);
  });
  test("Validate in matrix, checkErrorsMode: onValueChanging", () => {
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
      options.error = options.value.length != 4 ? "Error in name" : undefined;
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("columns");
    var row = matrix.visibleRows[0];
    survey.editingObj = question;
    matrix.visibleRows[0].cells[0].value = "col33";
    expect(row.cells[0].value, "keep incorrect value in question cell").toBe("col33");
    expect(row.cells[0].question.errors.length, "There is an error").toBe(1);
    expect(question.columns[0].name, "column name is not changed").toBe("col1");
    matrix.visibleRows[0].cells[0].value = "col3";
    expect(row.cells[0].question.errors.length, "There is no errors").toBe(0);
    expect(question.columns[0].name, "column name is changed").toBe("col3");
  });
  test("Edit question string[] property type", () => {
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
    expect(survey.getValue("dataList"), "string[] property get correctly value").toEqual(["item1", "item2"]);
    expect(dataListQuestion.value).toBe("item1\nitem2");
    dataListQuestion.value = "item1\nitem2\nitem3";
    expect(question.dataList.length, "There are three items now").toBe(3);
    expect(question.dataList[2], "The third item is 'item3'").toBe("item3");
    question.locDataList.setLocaleText(null, "abc\ndef");
    expect(dataListQuestion.value, "Update edited question correctly").toBe("abc\ndef");
  });
  test("Edit custom array that returns values onGetValue", () => {
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
    expect(pages).toBeTruthy();
    expect(pages.length).toBe(3);
    var rows = matrix.visibleRows;
    expect(rows.length, "There are 3 pages").toBe(3);
    Serializer.removeProperty("page", "pages");
  });
  test("Edit matrix dynamic column", () => {
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
          name: "showSelectAllItem",
        },
      ],
    });
    survey.editingObj = column;
    expect(survey.getQuestionByName("name").value, "column name value is set correctly").toBe("col1");
    expect(survey.getQuestionByName("title").value, "column title value is set correctly").toBe("Column 1");
    expect(survey.getQuestionByName("showSelectAllItem").value, "column showSelectAllItem value is set correctly").toBe(true);
    survey.getQuestionByName("name").value = "col2";
    survey.getQuestionByName("title").value = "Column 2";
    survey.getQuestionByName("showSelectAllItem").value = false;
    expect(column.name, "column name changed correctly").toBe("col2");
    expect(column.title, "column title changed correctly").toBe("Column 2");
    expect(column["showSelectAllItem"], "column showSelectAllItem changed correctly").toBe(false);
  });
  test("Edit choices in matrix dynamic column", () => {
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
    expect(matrix.rowCount, "There are 5 items").toBe(5);
    column["choices"].push(new ItemValue(6));
    expect(matrix.rowCount, "There are 6 items now").toBe(6);
    matrix.visibleRows[0].cells[0].value = "Item 1";
    expect(column["choices"][0].value, "value changed in matrix").toBe("Item 1");
  });
  test("Edit choices in matrix dynamic column, unique in detail panel", () => {
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
    expect(matrix.rowCount, "There are 3 items").toBe(3);
    const rows = matrix.visibleRows;
    rows[0].showDetailPanel();
    const row0Q = rows[0].detailPanel.getQuestionByName("value");
    expect(row0Q.value, "value is set").toBe("Item1");
    row0Q.value = "Item2";
    expect(row0Q.errors.length, "Has an error").toBe(1);
    expect(rows[1].isDetailPanelShowing, "Show the second panel").toBe(true);
    row0Q.value = "Item4";
    expect(row0Q.errors.length, "No errors").toBe(0);
    expect(question.choices[0].value, "value is changed").toBe("Item4");
  });
  test("Edit choices in matrix dynamic column, check errors", () => {
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
    expect(matrix.rowCount, "There are 3 items").toBe(3);
    const rows = matrix.visibleRows;
    const row0Q = rows[0].cells[0].question;
    const row1Q = rows[1].cells[0].question;
    row0Q.value = "Item2";
    expect(row0Q.errors.length, "row0Q errors, #1").toBe(1);
    expect(row1Q.errors.length, "row1Q errors, #1").toBe(1);
    row0Q.clearValue();
    expect(row0Q.errors.length, "row0Q errors, #2").toBe(1);
    expect(row1Q.errors.length, "row1Q errors, #2").toBe(1);
    row0Q.value = "Item2";
    expect(row0Q.errors.length, "row0Q errors, #3").toBe(1);
    expect(row1Q.errors.length, "row1Q errors, #3").toBe(1);
    row1Q.value = "Item4";
    expect(row0Q.errors.length, "row0Q errors, #4").toBe(0);
    expect(row1Q.errors.length, "row1Q errors, #4").toBe(0);
  });
  test("Edit choices in matrix dynamic column, set correct value", () => {
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
    expect(matrix.rowCount, "There are 3 items").toBe(3);
    const rows = matrix.visibleRows;
    rows[1].cells[0].question.value = "Item1";
    rows[0].cells[0].question.value = "Item2";
    expect(question.choices[0].value, "choice 0").toBe("Item2");
    expect(question.choices[1].value, "choice 1").toBe("Item1");
  });
  test("Call onMatrixCellCreated correctly, Bug#8873", () => {
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
    expect(matrix.visibleRows.length, "There are 3 items").toBe(3);
    let cellCreatedCounter: number = 0;
    survey.onMatrixCellCreated.add((sender, options) => {
      cellCreatedCounter ++;
      if (options.columnName === "text") {
        options.cellQuestion.placeholder = options.row.getQuestionByName("value").value;
      }
    });
    question.choices.splice(2, 1);
    expect(matrix.visibleRows.length, "There are 2 items").toBe(2);
    expect(cellCreatedCounter, "no cells created").toBe(0);
    question.choices.push(new ItemValue("Item 4"));
    expect(matrix.visibleRows.length, "There are 3 items again").toBe(3);
    expect(cellCreatedCounter, "two cells created").toBe(2);
    expect(matrix.visibleRows[2].cells[1].question.placeholder, "placeholder is set").toBe("Item 4");
  });

  test("Edit question.page property", () => {
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
    expect(pageQuestion.value, "Set page from question correctly").toBe("page1");
    pageQuestion.value = "page2";
    expect(question.page.name, "Set question.page from survey").toBe("page2");
  });
  test("Dispose editing survey correctly", () => {
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
    expect(survey1.getQuestionByName("name").value, "react on changing in survey1").toBe("q2");
    expect(survey2.getQuestionByName("name").value, "react on changing in survey2").toBe("q2");
    survey1.dispose();
    question.name = "q3";
    expect(survey1.getQuestionByName("name").value, "do not react on changing in survey1").toBe("q2");
    expect(survey2.getQuestionByName("name").value, "react on changing in survey2").toBe("q3");
  });
  test("Change locale", () => {
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
    expect(localeSurvey.locale, "Locale has been changed").toBe("de");
    localeSurvey.locale = "";
  });
  test("Do not call notification on changing properties that are not exists in Serialization", () => {
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
    expect(counter, "Do not send any notifications").toBe(0);
  });
  test("Do not set directly array objects", () => {
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
    expect(matrix.rowCount, "There are 2 pages").toBe(2);
    matrix.removeRow(1);
    expect(editingSurvey.pages.length, "There is one page now").toBe(1);
  });

  test("Value property editor test", () => {
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
    expect(htmlQuestion.html).toBe("empty");
    question.defaultValue = [1, 2];
    expect(htmlQuestion.html).toBe("[1,2]");
    question.defaultValue = undefined;
    expect(htmlQuestion.html).toBe("empty");

    ComponentCollection.Instance.clear();
  });

  test("Check column min width property is set correctly to editor", () => {
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
    expect(editor.value).toBe("300px");
    property.onPropertyEditorUpdate(column, editor);
    expect(editor.value).toBe("");
  });
  test("Allow to set empty string into localization string & string property with default value", () => {
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
    expect(placeholderQuestion.value, "placeholder - default value").toBe("Select...");
    expect(minWidthQuestion.value, "minWidth - default value").toBe("300px");
    expect(valueNameQuestion.value, "valueName is empty by default").toBeFalsy();
    placeholderQuestion.value = "";
    minWidthQuestion.value = "";
    valueNameQuestion.value = "";
    expect(placeholderQuestion.value, "placeholder question value is empty").toBe("");
    expect(minWidthQuestion.value, "minWidth question value is empty").toBe("");
    expect(question.placeholder, "dropdown.placeholder value is empty").toBe("");
    expect(question.minWidth, "dropdown.minWidth value is empty").toBe("");
    expect(question.toJSON()).toEqual({
      name: "q1", placeholder: "", minWidth: ""
    });
    const q2 = Serializer.createClass("dropdown");
    q2.fromJSON({
      name: "q2", placeholder: "", minWidth: ""
    });
    expect(q2.name, "set the name correctly").toBe("q2");
    expect(q2.placeholder, "q2.placeholder value is empty").toBe("");
    expect(q2.minWidth, "q2.minWidth value is empty").toBe("");
  });
  test("Edit triggers array", () => {
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
      if (obj) {
        options.cell.value = obj.getType();
      }
    });
    const matrix = <QuestionMatrixDynamicModel>(
    editSurvey.getQuestionByName("triggers")
  );
    editSurvey.editingObj = survey;
    expect(matrix.visibleRows.length, "There is no triggers").toBe(0);
    survey.triggers.push(new SurveyTriggerComplete());
    expect(matrix.visibleRows.length, "There is one trigger").toBe(1);
    expect(matrix.visibleRows[0].cells[0].value, "correct trigger type").toBe("completetrigger");
  });
  test("multipletextitem title in detail panel", () => {
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
    expect(matrix.visibleRows.length, "One item").toBe(1);
    const row = matrix.visibleRows[0];
    const titleCell = row.cells[1].question;
    row.showDetailPanel();
    const titleQuestion = row.detailPanel.getQuestionByName("title");
    expect(titleCell.value, "cell #1").toBeFalsy();
    expect(titleQuestion.value, "question #1").toBeFalsy();
    titleQuestion.value = "Item 1";
    expect(titleCell.value, "cell #2").toBe("Item 1");
    expect(titleQuestion.value, "question #2").toBe("Item 1");
    expect(question.items[0].title, "item title #1").toBe("Item 1");
    titleQuestion.value = "";
    expect(titleCell.value, "cell #3").toBeFalsy();
    expect(titleQuestion.value, "question #3").toBeFalsy();
  });
  test("reset property value", () => {
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
    expect(comment.value, "value #1").toBe("Yes");
    question.labelTrue = "abc";
    expect(comment.value, "value #2").toBe("abc");
    question.resetPropertyValue("labelTrue");
    expect(question.labelTrue, "labelTrue value").toBe("Yes");
    expect(comment.value, "value #3").toBe("Yes");
  });
  test("paneldynamic. templateVisibleIf", () => {
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
    expect(comment.value, "value #1").toBe("{q1} = 'a'");
    question.templateVisibleIf = "{q1} = 'b'";
    expect(comment.value, "value #2").toBe("{q1} = 'b'");
    comment.value = "{q1} = 'c'";
    expect(question.templateVisibleIf, "property value #1").toBe("{q1} = 'c'");
  });
  test("survey, complete text & locale", () => {
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
    expect(commentHtml.value, "comment #1").toBe("html:default");
    expect(commentText.value, "commentText #1").toBe("text:default");
    survey.locale = "de";
    expect(commentHtml.value, "comment #2").toBeFalsy();
    expect(commentText.value, "commentText #2").toBeFalsy();
    commentHtml.value = "html:de";
    commentText.value = "text:de";
    expect(survey.completedHtml, "completedHtml #1").toBe("html:de");
    expect(survey.description, "description #1").toBe("text:de");
    survey.locale = "";
    expect(survey.completedHtml, "completedHtml #2").toBe("html:default");
    expect(commentHtml.value, "comment  #3").toBe("html:default");
    expect(survey.description, "description #2").toBe("text:default");
    expect(commentText.value, "commentText  #3").toBe("text:default");
    survey.locale = "fr";
    commentHtml.value = "html:fr";
    commentText.value = "text:fr";
    survey.locale = "de";
    expect(survey.completedHtml, "completedHtml #3").toBe("html:de");
    expect(commentHtml.value, "comment #4").toBe("html:de");
    expect(survey.description, "description #3").toBe("text:de");
    expect(commentText.value, "commentText #4").toBe("text:de");
  });
  test("Column visible property", () => {
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
    expect(column.visible, "column visible property").toBe(false);
    expect(Serializer.getObjPropertyValue(column, "visible"), "Serializer.getObjPropertyValue").toBe(false);
    const nameQuestion = survey.getQuestionByName("name");
    const visibleQuestion = survey.getQuestionByName("visible");
    expect(nameQuestion.value, "column name").toBe("col1");
    expect(visibleQuestion.value, "column visible").toBe(false);
    visibleQuestion.value = true;
    expect(visibleQuestion.value, "column visible, #2").toBe(true);
    expect(column.visible, "column visible property, #2").toBe(true);
    expect(Serializer.getObjPropertyValue(column, "visible"), "Serializer.getObjPropertyValue, #2").toBe(true);
    column.visible = false;
    expect(visibleQuestion.value, "column visible, #3").toBe(false);
    expect(column.visible, "column visible property, #3").toBe(false);
    expect(Serializer.getObjPropertyValue(column, "visible"), "Serializer.getObjPropertyValue, #3").toBe(false);
  });
  test("Multiple text item, onPropertyValueChanged", () => {
    const question = new QuestionMultipleTextModel("q1");
    const item = question.addItem("item1");
    const logs = new Array<string>();
    item.onPropertyChanged.add((sender, options) => {
      logs.push(options.name);
    });
    item.name = "item2";
    item.title = "Item 2";
    item.validators.push(new ExpressionValidator("{q1}=1"));
    expect(logs, "#1").toEqual(["name", "title", "validators"]);

    item.maskType = "pattern";
    expect(logs, "#2").toEqual(["name", "title", "validators", "maskType", "maskSettings"]);
  });
  test("Matirix columns & getObjPropertyValue", () => {
    const column = new MatrixDropdownColumn("col1");
    expect(Serializer.getObjPropertyValue(column, "cellType"), "should return 'default'").toBe("default");
    column.cellType = "text";
    expect(Serializer.getObjPropertyValue(column, "cellType"), "should return 'text'").toBe("text");
  });
  test("Edit choices in matrix, always keep minimum objects", () => {
    var question = new QuestionDropdownModel("q1");
    question.choices = ["item1", "item2", "item3"];
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "choices",
          minRowCount: 2,
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
      var item = new ChoiceItem("val");
      matrix.value.push(item);
      return item;
    };
    expect(matrix.visibleRows.length, "three choice").toBe(3);
    question.choices = [];
    expect(matrix.rowCount, "There are 2 items").toBe(2);
    expect(matrix.visibleRows.length, "two minimum choices").toBe(2);
    expect(question.choices.length, "two choices in question").toBe(2);
    expect(question.choices[0].getType(), "first item is choiceitem").toBe("choiceitem");
    expect(question.choices[1].getType(), "second item is choiceitem").toBe("choiceitem");
  });
  test("Edit choices in matrix, update remove buttons visibility on changing choices", () => {
    var question = new QuestionDropdownModel("q1");
    question.choices = ["item1", "item2", "item3"];
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "choices",
          minRowCount: 2,
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
      var item = new ChoiceItem("val");
      matrix.value.push(item);
      return item;
    };
    const isRowHasRemoveButton = (index: number): boolean => {
      const rows = matrix.renderedTable.rows;
      const cells = rows[index * 2 + 1].cells;
      const item = cells[cells.length - 1].item;
      if (!item) return false;
      const container = <ActionContainer>(item.value);
      return !!container.getActionById("remove-row");
    };
    expect(matrix.visibleRows.length, "three choice").toBe(3);
    expect(matrix.canRemoveRows, "can remove rows").toBe(true);
    expect(isRowHasRemoveButton(0), "first row has remove button").toBe(true);
    expect(isRowHasRemoveButton(1), "second row has remove button").toBe(true);
    expect(isRowHasRemoveButton(2), "third row has remove button").toBe(true);
    question.choices = ["item1", "item2"];
    expect(matrix.visibleRows.length, "two choice").toBe(2);
    expect(matrix.canRemoveRows, "can not remove rows").toBe(false);
    expect(isRowHasRemoveButton(0), "first row has no remove button").toBe(false);
    expect(isRowHasRemoveButton(1), "second row has no remove button").toBe(false);
    question.choices = ["item1", "item2", "item3", "item4"];
    expect(matrix.visibleRows.length, "four choice").toBe(4);
    expect(isRowHasRemoveButton(0), "first row has remove button").toBe(true);
    expect(isRowHasRemoveButton(1), "second row has remove button").toBe(true);
    expect(isRowHasRemoveButton(2), "third row has remove button").toBe(true);
    expect(isRowHasRemoveButton(3), "fourth row has remove button").toBe(true);
  });

  test("Composite question with tagbox and editingObj fires propertyValueChanged on every change, bug11187", () => {
    ComponentCollection.Instance.add({
      name: "testcomposite",
      elementsJSON: [
        { type: "tagbox", name: "tags", choices: ["A", "B", "C"] }
      ]
    });
    Serializer.addProperty("text", { name: "testProp", type: "testPropType" });

    var question = new QuestionTextModel("q1");
    var survey = new SurveyModel({
      elements: [{ type: "testcomposite", name: "testProp" }]
    });
    survey.editingObj = question;

    var compositeQuestion = <QuestionCompositeModel>survey.getQuestionByName("testProp");
    var tagbox = compositeQuestion.contentPanel.getQuestionByName("tags");

    var changeLog: Array<{ name: string, oldValue: any, newValue: any }> = [];
    question.onPropertyChanged.add(function (sender: Base, options: any) {
      if (options.name === "testProp") {
        changeLog.push({ name: options.name, oldValue: JSON.parse(JSON.stringify(options.oldValue || null)), newValue: JSON.parse(JSON.stringify(options.newValue || null)) });
      }
    });

    tagbox.value = ["A"];
    expect(changeLog.length, "First change fires callback").toBe(1);
    expect(changeLog[0].newValue, "First change new value").toEqual({ tags: ["A"] });

    tagbox.value = ["A", "B"];
    expect(changeLog.length, "Second change fires callback").toBe(2);
    expect(changeLog[1].newValue, "Second change new value").toEqual({ tags: ["A", "B"] });

    tagbox.value = ["A", "B", "C"];
    expect(changeLog.length, "Third change fires callback").toBe(3);
    expect(changeLog[2].newValue, "Third change new value").toEqual({ tags: ["A", "B", "C"] });

    Serializer.removeProperty("text", "testProp");
    ComponentCollection.Instance.clear();
  });
});
