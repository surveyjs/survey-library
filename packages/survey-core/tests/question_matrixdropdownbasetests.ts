import { Serializer } from "../src/jsonobject";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { SurveyModel } from "../src/survey";
import { Helpers } from "../src/helpers";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { ItemValue } from "../src/itemvalue";
import { settings } from "../src/settings";
import { setOldTheme } from "./oldTheme";
export * from "../src/localization/german";

export default QUnit.module("Survey_QuestionMatrixDropdownBase");

QUnit.test(" 213 123sad d213 sadsd", function (assert) {
  const matrix = new QuestionMatrixDropdownModelBase("q1");

  assert.equal(matrix["generatedVisibleRows"], null, "generatedVisibleRows is null");
  assert.deepEqual(matrix.getAllErrors(), [], "getAllErrors method doesn't fall");
});
QUnit.test("allowAdaptiveActions", function (assert) {
  const matrix = new QuestionMatrixDropdownModelBase("q1");
  assert.equal(matrix.allowAdaptiveActions, false, "matrix.allowAdaptiveActions");
  assert.equal(matrix.getPanel()["allowAdaptiveActions"], true, "matrix.panel.allowAdaptiveActions");

  matrix.allowAdaptiveActions = false;
  assert.equal(matrix.allowAdaptiveActions, false, "matrix.allowAdaptiveActions");
  assert.equal(matrix.getPanel()["allowAdaptiveActions"], false, "matrix.panel.allowAdaptiveActions");

});

QUnit.test("verticalLayout when isMobile set 'true'", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        rowCount: 2,
        columnLayout: "vertical",
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  matrix.renderedTable;
  assert.ok(!!matrix["renderedTableValue"]);
  assert.notOk(matrix.isColumnLayoutHorizontal);
  matrix.isMobile = true;
  assert.ok(matrix.isColumnLayoutHorizontal);
  assert.notOk(!!matrix["renderedTableValue"]);
});
QUnit.test("Change templateQuestion on changing cellType faster reacting onPropertyChanged", function (assert) {
  const column = new MatrixDropdownColumn("col1");
  assert.equal(column.cellType, "default");
  assert.equal(column.templateQuestion.getType(), "dropdown");
  column.registerPropertyChangedHandlers(["cellType"], () => {
    assert.equal(column.cellType, "text");
    assert.equal(column.templateQuestion.getType(), "text");
  });
  column.cellType = "text";
});
QUnit.test("visible attribute for min property  should return true for text question with inputType number/month", function (assert) {
  const column = new MatrixDropdownColumn("col1");
  assert.equal(column.cellType, "default");
  const property = Serializer.findProperty("text", "min");
  assert.equal(property.visibleIf(column), false, "cell type is default");
  column.cellType = "text";
  assert.equal(property.visibleIf(column), false, "inputType is text");
  (<any>column).inputType = "number";
  assert.equal(property.visibleIf(column), true, "inputType is number");
  (<any>column).inputType = "month";
  assert.equal(property.visibleIf(column), true, "inputType is month");
  (<any>column).inputType = "text";
  assert.equal(property.visibleIf(column), false, "inputType is text");
});
QUnit.test("table vertical align and alternate rows", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
      },
    ],
  });
  setOldTheme(survey);

  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");

  matrix.cssClasses.root = "rootClass";
  matrix.cssClasses.rootAlternateRows = "rootAlternateRowsClass";
  matrix.cssClasses.rootVerticalAlignTop = "rootVerticalAlignTopClass";
  matrix.cssClasses.rootVerticalAlignMiddle = "rootVerticalAlignMiddleClass";

  assert.equal(matrix.getTableCss(), "rootClass rootVerticalAlignMiddleClass", "table css is rootVerticalAlignMiddleClass");
  matrix.verticalAlign = "top";
  assert.equal(matrix.getTableCss(), "rootClass rootVerticalAlignTopClass", "default table css is rootVerticalAlignTopClass");
  matrix.alternateRows = true;
  assert.equal(matrix.getTableCss(), "rootClass rootAlternateRowsClass rootVerticalAlignTopClass", "table css is rootAlternateRowsClass rootVerticalAlignMiddleClass");
});

QUnit.test("table autocolumn width", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrixd",
        columns: ["c"]
      },
      {
        type: "matrix",
        name: "matrix",
      },
    ],
  });

  const matrixd = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrixd");
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");

  matrix.cssClasses.root = "rootClass";
  matrix.cssClasses.columnsAutoWidth = "rootColumnsAutoWidth";
  matrix.cssClasses.rootVerticalAlignMiddle = "";

  matrixd.cssClasses.root = "rootClass";
  matrixd.cssClasses.columnsAutoWidth = "rootColumnsAutoWidth";
  matrixd.cssClasses.rootVerticalAlignMiddle = "";

  assert.equal(matrix.getTableCss(), "rootClass rootColumnsAutoWidth", "matrix");
  assert.equal(matrixd.getTableCss(), "rootClass rootColumnsAutoWidth", "matrixd");

  matrixd.columns[0].width = "100px";
  assert.equal(matrixd.getTableCss(), "rootClass", "matrixd");

  matrixd.columns[0].width = "";
  survey.setIsMobile(true);
  assert.equal(matrix.getTableCss(), "rootClass", "matrix mobile");
  assert.equal(matrixd.getTableCss(), "rootClass", "matrixd mobile");
});

QUnit.test("column.templateQuestion has set parentQuestion", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }]
      },
    ],
  });

  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  assert.equal(matrix.columns[0].templateQuestion.parentQuestion.name, "matrix", "question name is set");
  const matrix2 = new QuestionMatrixDropdownModelBase("q1");
  const col = matrix2.addColumn("col1");
  assert.equal(col.templateQuestion.parentQuestion.name, "q1", "column created from code has parentQuestion");
});
QUnit.test("column cell css classes by column cellType test", function (assert) {
  var survey = new SurveyModel({
    "elements": [
      {
        "type": "matrixdropdown",
        "name": "matrix",
        "title": "Please tells us your opinion about JavaScript MVVM frameworks",
        "horizontalScroll": true,
        "columnMinWidth": "130px",
        "choices": [
          "Excelent",
          "Good",
          "Average",
          "Fair",
          "Poor"
        ],
        "columns": [
          {
            "name": "using",
            "title": "Do you use it?",
            "choices": [
              "Yes", "No"
            ],
            "cellType": "radiogroup"
          },
          {
            "name": "experience",
            "title": "How long do you use it?",
            "cellType": "dropdown",
            "choices": [
              {
                "value": 5,
                "text": "3-5 years"
              }, {
                "value": 2,
                "text": "1-2 years"
              }, {
                "value": 1,
                "text": "less then a year"
              }
            ]
          },
          {
            "name": "strength",
            "title": "What is main strength?",
            "choices": [
              "Easy", "Compact", "Fast", "Powerfull"
            ],
            "cellType": "checkbox"
          },
          {
            "name": "knowledge",
            "title": "Please describe your experience",
            "cellType": "comment"
          }, {
            "name": "rate",
            "title": "Please rate the framework itself"
          }
        ],
        "rows": [
          {
            "value": "angularv1",
            "text": "angularjs v1.x"
          }, {
            "value": "angularv2",
            "text": "angularjs v2"
          }, {
            "value": "knockoutjs"
          }, {
            "value": "reactjs"
          }
        ]
      }
    ]
  });
  setOldTheme(survey);
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  assert.equal(matrix.renderedTable.headerRow.cells.length, 6);
  assert.equal(matrix.renderedTable.headerRow.cells[0].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "empty column");
  assert.equal(matrix.renderedTable.headerRow.cells[1].className, "sv_matrix_cell_header sv_matrix_cell--radiogroup", "column 1");
  assert.equal(matrix.renderedTable.headerRow.cells[2].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "column 2");
  assert.equal(matrix.renderedTable.headerRow.cells[3].className, "sv_matrix_cell_header sv_matrix_cell--checkbox", "column 3");
  assert.equal(matrix.renderedTable.headerRow.cells[4].className, "sv_matrix_cell_header sv_matrix_cell--comment", "column 4");
  assert.equal(matrix.renderedTable.headerRow.cells[5].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "column 5");

});

QUnit.test("column cell css classes for vertical layout", function (assert) {
  var survey = new SurveyModel({
    "elements": [
      {
        "type": "matrixdropdown",
        "name": "question1",
        "columns": [
          {
            "name": "Column 1"
          },
          {
            "name": "Column 2"
          }
        ],
        "columnLayout": "vertical",
        "choices": [
          1,
          2,
          3,
          4,
          5
        ],
        "rows": [
          "Row 1",
          "Row 2"
        ]
      }
    ]
  });

  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("question1");
  assert.equal(matrix.renderedTable.headerRow.cells.length, 3);
  const cssHeader = survey.css.matrixdropdown.headerCell;
  assert.equal(matrix.renderedTable.headerRow.cells[1].className, cssHeader, "column 1");
  assert.equal(matrix.renderedTable.headerRow.cells[2].className, cssHeader, "column 2");
});

QUnit.test("column cell css classes by matrix cellType test", function (assert) {
  var survey = new SurveyModel({
    "elements": [
      {
        "type": "matrixdropdown",
        "name": "matrix",
        "title": "Please tells us your opinion about JavaScript MVVM frameworks",
        "horizontalScroll": true,
        "columnMinWidth": "130px",
        "cellType": "dropdown",
        "choices": [
          "Excelent",
          "Good",
          "Average",
          "Fair",
          "Poor"
        ],
        "columns": [
          {
            "name": "using",
            "title": "Do you use it?",
            "choices": [
              "Yes", "No"
            ],
          },
          {
            "name": "experience",
            "title": "How long do you use it?",
            "choices": [
              {
                "value": 5,
                "text": "3-5 years"
              }, {
                "value": 2,
                "text": "1-2 years"
              }, {
                "value": 1,
                "text": "less then a year"
              }
            ]
          },
          {
            "name": "strength",
            "title": "What is main strength?",
            "choices": [
              "Easy", "Compact", "Fast", "Powerfull"
            ],
          },
          {
            "name": "knowledge",
            "title": "Please describe your experience",
          }, {
            "name": "rate",
            "title": "Please rate the framework itself"
          }
        ],
        "rows": [
          {
            "value": "angularv1",
            "text": "angularjs v1.x"
          }, {
            "value": "angularv2",
            "text": "angularjs v2"
          }, {
            "value": "knockoutjs"
          }, {
            "value": "reactjs"
          }
        ]
      }
    ]
  });
  setOldTheme(survey);
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  assert.equal(matrix.renderedTable.headerRow.cells.length, 6);
  assert.equal(matrix.renderedTable.headerRow.cells[0].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "empty column");
  assert.equal(matrix.renderedTable.headerRow.cells[1].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "column 1");
  assert.equal(matrix.renderedTable.headerRow.cells[2].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "column 2");
  assert.equal(matrix.renderedTable.headerRow.cells[3].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "column 3");
  assert.equal(matrix.renderedTable.headerRow.cells[4].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "column 4");
  assert.equal(matrix.renderedTable.headerRow.cells[5].className, "sv_matrix_cell_header sv_matrix_cell--dropdown", "column 5");
});
QUnit.test("Incorrect default value in matrix dropdown", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        defaultValueExpression: "no",
        columns: [
          {
            name: "col1",
          },
        ],
        rows: [
          "row 1",
          "row 2",
        ]
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  matrix.renderedTable;
  assert.ok(!!matrix["renderedTableValue"]);
});
QUnit.test("Incorrect default value in matrix dynamic", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        defaultValueExpression: "no",
        columns: [
          {
            name: "col1",
          },
        ],
        rowCount: 2
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  matrix.renderedTable;
  assert.ok(!!matrix["renderedTableValue"]);
});
QUnit.test("matrix dropdown getElementsInDesign", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }, { name: "col2" }]
      },
    ],
  });

  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  var elements = matrix.getElementsInDesign();
  assert.equal(elements.length, 2);
  assert.equal(elements[0], matrix.columns[0]);
  assert.equal(elements[1], matrix.columns[1]);
});
QUnit.test("Check matrixdropdown cells cssClasses with showInMultipleColumns", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        rows: ["row1"],
        columns: [
          {
            "name": "col1",
            "cellType": "radiogroup",
            "showInMultipleColumns": true,
            "isRequired": true,
            "choices": [
              "Item 1",
              "Item 2",
            ]
          },
          {
            "name": "col2",
            "cellType": "checkbox",
            "showInMultipleColumns": true,
            "isRequired": true,
            "choices": [
              "Item 1",
              "Item 2",
            ]
          }
        ]
      },
    ],
  });
  setOldTheme(survey);
  survey.css = {
    matrixdropdown: {
      headerCell: "custom-header-cell",
      itemCell: "custom-item-cell",
      radioCell: "custom-radio-item-cell",
      checkboxCell: "custom-checkbox-item-cell"
    }
  };

  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  const renderedTable = matrix.renderedTable;
  assert.equal(renderedTable.headerRow.cells[1].className, "custom-header-cell");
  assert.equal(renderedTable.rows[1].cells[1].className, "sv_matrix_cell custom-item-cell custom-radio-item-cell");
  assert.equal(renderedTable.rows[1].cells[3].className, "sv_matrix_cell custom-item-cell custom-checkbox-item-cell");
});
QUnit.test("Check matrixdropdown cells cssClasses with showInMultipleColumns", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        rows: ["row1"]
      },
    ],
  });
  let columnName = "";
  survey.onMatrixColumnAdded.add((sender, options) => {
    columnName = options.column.name;
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  matrix.addColumn("col1");
  assert.equal(columnName, "col1", "The event raised correctly");
  matrix.columns.push(new MatrixDropdownColumn("col2"));
  assert.equal(columnName, "col2", "The event raised correctly on adding into array");
});

QUnit.test("Check matrixdropdown default column min widths", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        rows: ["row1"],
        columns: [
          {
            "name": "file",
            "cellType": "file",
          },
          {
            "name": "description",
            "cellType": "comment",
          }]
      },
    ],
  });
  const question = <QuestionMatrixDropdownModelBase>survey.getAllQuestions()[0];
  assert.equal(question.getColumnWidth(question.columns[0]), "240px");
  assert.equal(question.getColumnWidth(question.columns[1]), "200px");

  question.columnMinWidth = "300px";
  assert.equal(question.getColumnWidth(question.columns[0]), "300px");
  assert.equal(question.getColumnWidth(question.columns[1]), "300px");

  question.columns[0].minWidth = "320px";
  question.columns[1].minWidth = "340px";

  assert.equal(question.getColumnWidth(question.columns[0]), "320px");
  assert.equal(question.getColumnWidth(question.columns[1]), "340px");

});
class TestElementWrapperSurveyModel extends SurveyModel {
  constructor(json: any) {
    super(json);
  }
  public getElementWrapperComponentName(element: any, reason?: string): string {
    this.reason = "name->" + reason;
    return super.getElementWrapperComponentName(element, reason);
  }
  public getElementWrapperComponentData(element: any, reason?: string): string {
    this.reason = "data->" + reason;
    return super.getElementWrapperComponentData(element, reason);
  }
  public reason?: string;
}

QUnit.test("getCellWrapper name and data", function (assert) {
  var json = {
    elements: [
      {
        type: "matrixdynamic",
        name: "q1",
        columns: [
          {
            name: "Column 1",
            totalType: "sum",
          },
        ],
        rows: ["First"]
      },
    ],
  };
  var survey = new TestElementWrapperSurveyModel(json);
  var matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");

  var totalRow = matrix.visibleTotalRow;
  var totalCell = totalRow.cells[0];
  matrix.getCellWrapperComponentName(totalCell);
  assert.equal(survey.reason, "name->row-footer", "Total cell component name");
  matrix.getCellWrapperComponentData(totalCell);
  assert.equal(survey.reason, "data->row-footer", "Total cell component data");

  var ordinaryRow = matrix.visibleRows[0];
  var ordinaryCell = ordinaryRow.cells[0];
  matrix.getCellWrapperComponentName(ordinaryCell);
  assert.equal(survey.reason, "name->cell", "Ordinary cell component name");
  matrix.getCellWrapperComponentData(ordinaryCell);
  assert.equal(survey.reason, "data->cell", "Ordinary cell component data");
});
QUnit.test("Rows with value = 0, Bug#6370", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [{ name: "col1", cellType: "text" }],
        rows: [0, 1, 2]
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
  assert.equal(matrix.visibleRows.length, 3, "Three rows has been created");
  assert.equal(matrix.visibleRows[0].rowName, 0, "The rowName is 0");
  matrix.visibleRows[0].cells[0].question.value = "val1";
  assert.deepEqual(survey.data, { q1: { 0: { col1: "val1" } } }, "Set row value correctly");
});
QUnit.test("survey.onPropertyValueChangedCallback on column property changed", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "matrixdynamic", name: "q", columns: [{ cellType: "expression", name: "col1" }] }]
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q");
  const column = matrix.columns[0];
  let counter = 0;
  let propertyName;
  survey.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: SurveyModel,
    arrayChanges: any
  ) => {
    counter++;
    propertyName = name;
  };
  assert.equal(counter, 0, "initial");
  column.title = "col title";
  assert.equal(counter, 1, "callback called, #1");
  assert.equal(propertyName, "title", "title is changed, #2");
  column["expression"] = "today()";
  assert.equal(counter, 2, "callback called, #3");
  assert.equal(propertyName, "expression", "expression is changed, #4");
});
QUnit.test("Column width is not loaded, bug in Creator #4303", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [{ name: "col1", width: "222px" }],
        rows: [0, 1, 2]
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
  assert.equal(matrix.columns.length, 1, "There is one column");
  assert.equal(matrix.columns[0].width, "222px", "column width is loaded correctly");
});
QUnit.test("Error location from survey/matrix/properties", function (assert) {
  const survey = new SurveyModel({
    questionErrorLocation: "bottom",
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }],
        rows: [0],
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "q1" }],
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  row.showDetailPanel();
  const qCell = row.cells[0].question;
  const qDetail = row.detailPanel.getQuestionByName("q1");
  assert.ok(qCell, "qCell");
  assert.ok(qDetail, "qDetail");
  assert.equal(qCell.getErrorLocation(), "bottom", "cell, #1");
  assert.equal(qDetail.getErrorLocation(), "bottom", "question in detail panel, #1");
  matrix.errorLocation = "top";
  assert.equal(qCell.getErrorLocation(), "top", "cell, #2");
  assert.equal(qDetail.getErrorLocation(), "top", "question in detail panel, #2");
  matrix.cellErrorLocation = "bottom";
  assert.equal(qCell.getErrorLocation(), "bottom", "cell, #3");
  assert.equal(qDetail.getErrorLocation(), "top", "question in detail panel, #3");
  matrix.cellErrorLocation = "default";
  matrix.detailErrorLocation = "bottom";
  assert.equal(qCell.getErrorLocation(), "top", "cell, #4");
  assert.equal(qDetail.getErrorLocation(), "bottom", "question in detail panel, #4");
});
QUnit.test("Set incorrect value into matrix dropdown", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1", cellType: "text" }],
        rows: ["row1"],
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  matrix.value = "a string";
  matrix.value = 4;
  matrix.value = ["a string"];
  assert.equal(matrix.isEmpty(), true, "Do not allow to set incorrect values");
  assert.notOk(matrix.value, "matrix value is empty, #1");
  survey.data = { matrix: "a string" };
  assert.equal(matrix.isEmpty(), true, "Do not allow to set incorrect values from data");
  assert.notOk(matrix.value, "matrix value is empty, #2");
  survey.data = { matrix: { row1: 1 } };
  assert.equal(matrix.isEmpty(), false, "Set correct value");
});
QUnit.test("column.visible property", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text", visible: false },
          { name: "col3", cellType: "text" }
        ],
        rows: ["row1"],
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  assert.equal(matrix.columns[0].visible, true, "The default column.visible is true");
  assert.equal(matrix.columns[1].visible, false, "The second column.visible is false");
  let table = matrix.renderedTable;
  assert.equal(table.headerRow.cells.length, 1 + 2, "Header: One column is invisible, #1");
  assert.equal(table.rows[1].cells.length, 1 + 2, "Row: One column is invisible, #1");
  assert.equal(table.headerRow.cells[2].headers, "col3", "The second column is col3, #1");
  matrix.columns[1].visible = true;
  assert.notStrictEqual(table, matrix.renderedTable);
  table = matrix.renderedTable;
  assert.equal(table.headerRow.cells.length, 1 + 3, "Header: All columns are visible, #2");
  assert.equal(table.rows[1].cells.length, 1 + 3, "Row: All columns are visible, #2");
  assert.equal(table.headerRow.cells[2].headers, "col2", "The second column is col2, #2");
  matrix.columns[2].visible = false;
  table = matrix.renderedTable;
  assert.equal(table.headerRow.cells.length, 1 + 2, "Header: the last column is invisible, #3");
  assert.equal(table.rows[1].cells.length, 1 + 2, "Row: the last column is invisible, #3");
  assert.equal(table.headerRow.cells[2].headers, "col2", "The last column is col2, #3");
});
QUnit.test("column.visible property and design time", function (assert) {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text", visible: false },
          { name: "col3", cellType: "text" }
        ],
        rows: ["row1"],
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  assert.equal(matrix.columns[0].visible, true, "Column is visible by default");
  assert.equal(matrix.columns[1].visible, false, "visible property is false");
  assert.equal(matrix.columns[1].hasVisibleCell, true, "It is visible");
  let table = matrix.renderedTable;
  assert.equal(table.headerRow.cells.length, 1 + 3, "Header: One column is invisible, but it is visible in design-time, #1");
  assert.equal(table.rows[1].cells.length, 1 + 3, "Row: One column is invisible, but it is visible in design-time, #1");
  assert.equal(table.headerRow.cells[3].headers, "col3", "The last column is col3, #1");
  matrix.columns[2].visible = false;
  table = matrix.renderedTable;
  assert.equal(table.headerRow.cells.length, 1 + 3, "Header: Two columns are invisible, but it is visible in design-time, #2");
  assert.equal(table.rows[1].cells.length, 1 + 3, "Row: Two columns are invisible, but it is visible in design-time, #2");
  assert.equal(table.headerRow.cells[3].headers, "col3", "The last column is col3, #2");
});
QUnit.test("question.resetValueIf, basic functionality", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          { name: "q1", cellType: "text" },
          { name: "q2", cellType: "text", resetValueIf: "{row.q1} = 1" },
          { name: "q3", cellType: "text" },
        ]
      }
    ]
  });
  const matrix = survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  const q1 = row.getQuestionByName("q1");
  const q2 = row.getQuestionByName("q2");
  const q3 = row.getQuestionByName("q3");
  const col2 = matrix.getColumnByName("q2");
  assert.equal(col2.resetValueIf, "{row.q1} = 1", "Load from JSON, column");
  assert.equal(q2.resetValueIf, "{row.q1} = 1", "Load from JSON, question");
  q2.value = "abc";
  q1.value = 2;
  assert.equal(q2.value, "abc", "value is set");
  q1.value = 1;
  assert.equal(q2.isEmpty(), true, "value is cleared");
  q2.value = "edf";
  assert.equal(q2.value, "edf", "value is set, #2");
  q3.value = 3;
  assert.equal(q2.value, "edf", "value is set, #3");
});
QUnit.test("question.resetValueIf & quesiton.defaultValueExpression", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [{
          name: "q1",
          cellType: "text"
        },
        {
          name: "q2",
          cellType: "text",
          resetValueIf: "{row.q1} = 1",
          defaultValueExpression: "iif({row.q3} > 2, {row.q3}, '')"
        },
        {
          name: "q3", cellType: "text"
        }]
      }
    ]
  });
  const matrix = survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  const q1 = row.getQuestionByName("q1");
  const q2 = row.getQuestionByName("q2");
  const q3 = row.getQuestionByName("q3");
  q2.value = "abc";
  q3.value = 3;
  assert.equal(q2.value, "abc", "value is set directly");
  q1.value = 1;
  assert.equal(q2.value, 3, "value is set from defaultValueExpression");
  q2.value = "edf";
  assert.equal(q2.value, "edf", "value is set directly, #2");
  q3.value = 4;
  assert.equal(q2.value, "edf", "value is set directly, #3");
});
QUnit.test("question.resetValueIf based on root and row questions", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          { name: "q1", cellType: "text" },
          { name: "q2", cellType: "text", resetValueIf: "{row.q1} = 1 and {q4}=4" },
          { name: "q3", cellType: "text" },
        ]
      },
      { type: "text", name: "q4" }
    ]
  });
  const matrix = survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  const q1 = row.getQuestionByName("q1");
  const q2 = row.getQuestionByName("q2");
  const q3 = row.getQuestionByName("q3");
  const q4 = survey.getQuestionByName("q4");
  q2.value = "abc";
  assert.equal(q2.value, "abc", "q2.value #1");
  q1.value = 1;
  assert.equal(q2.value, "abc", "q2.value #2");
  q4.value = 4;
  assert.equal(q2.isEmpty(), true, "q2.value #3");
  q2.value = "abc";
  q1.value = 2;
  assert.equal(q2.value, "abc", "q2.value #4");
  q1.value = 1;
  assert.equal(q2.isEmpty(), true, "q2.value #5");
});
QUnit.test("question.resetValueIf, cycle calls", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "matrixdynamic",
        "name": "matrix",
        "rowCount": 1,
        "columns": [
          {
            "name": "dog",
            "cellType": "checkbox",
            "resetValueIf": "{row.none} notempty",
            "choices": ["dog"]
          },
          {
            "name": "cat",
            "cellType": "checkbox",
            "resetValueIf": "{row.none} notempty",
            "choices": ["cat"]
          },
          {
            "name": "none",
            "cellType": "checkbox",
            "resetValueIf": "{row.dog} notempty or {row.cat} notempty",
            "choices": ["none"]
          }]
      }
    ]
  });
  const row = survey.getQuestionByName("matrix").visibleRows[0];
  const q1 = row.getQuestionByName("dog");
  const q2 = row.getQuestionByName("cat");
  const q3 = row.getQuestionByName("none");
  q1.value = ["dog"];
  q2.value = ["cat"];
  assert.deepEqual(q1.value, ["dog"], "q1.value #1");
  assert.deepEqual(q2.value, ["cat"], "q2.value #1");
  assert.equal(q3.isEmpty(), true, "q3.value #1");
  q3.value = ["none"];
  assert.equal(q1.isEmpty(), true, "q1.value #2");
  assert.equal(q2.isEmpty(), true, "q2.value #2");
  assert.deepEqual(q3.value, ["none"], "q3.value #2");
  q1.value = ["dog"];
  assert.deepEqual(q1.value, ["dog"], "q1.value #3");
  assert.equal(q3.isEmpty(), true, "q2.value #3");
  assert.equal(q3.isEmpty(), true, "q3.value #3");
});
QUnit.test("question.setValueIf, basic functionality", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          { name: "q1", cellType: "text" },
          { name: "q2", cellType: "text", setValueIf: "{row.q1} = 1", setValueExpression: "{row.q1} + {row.q3}" },
          { name: "q3", cellType: "text" },
        ]
      }
    ]
  });
  const matrix = survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  const q1 = row.getQuestionByName("q1");
  const q2 = row.getQuestionByName("q2");
  const q3 = row.getQuestionByName("q3");
  const col2 = matrix.getColumnByName("q2");
  assert.equal(col2.setValueIf, "{row.q1} = 1", "Load from JSON, column.setValueIf");
  assert.equal(q2.setValueIf, "{row.q1} = 1", "Load from JSON, question.setValueIf");
  assert.equal(col2.setValueExpression, "{row.q1} + {row.q3}", "Load from JSON, column.setValueExpression");
  assert.equal(q2.setValueExpression, "{row.q1} + {row.q3}", "Load from JSON, question.setValueExpression");
  q2.value = "abc";
  q1.value = 2;
  q3.value = 3;
  assert.equal(q2.value, "abc", "value is set");
  q1.value = 1;
  assert.equal(q2.value, 4, "value is set correctly");
  q2.value = "edf";
  assert.equal(q2.value, "edf", "value is set, #2");
  q3.value = 5;
  assert.equal(q2.value, 1 + 5, "value is set, #3");
  q2.value = "klm";
  assert.equal(q2.value, "klm", "value is set, #4");
  q1.value = 2;
  assert.equal(q2.value, "klm", "value is set, #5");
  q3.value = 5;
  assert.equal(q2.value, "klm", "value is set, #6");
});

QUnit.test("question.onHidingContent", function (assert) {
  const survey = new SurveyModel({
    questionErrorLocation: "bottom",
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }],
        rows: ["item1"],
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "q1" }],
      },
    ],
  });
  let counter1 = 0;
  let counter2 = 0;
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  row.getQuestionByName("col1").onHidingContent = (): void => { counter1++; };
  row.showDetailPanel();
  row.detailPanel.getQuestionByName("q1").onHidingContent = (): void => { counter2++; };
  row.hideDetailPanel();
  assert.equal(counter2, 1, "Close detail");
  row.showDetailPanel();
  row.detailPanel.getQuestionByName("q1").onHidingContent = (): void => { counter2++; };
  survey.doComplete();
  assert.equal(counter1, 1, "cell on complete");
  assert.equal(counter2, 2, "detail questions");
});
QUnit.test("checkIfValueInRowDuplicated has only one duplicated error", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        columns: [{ name: "col1", isUnique: true }]
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  matrix.value = [{ col1: "a" }, { col1: "a" }];
  const row = matrix.visibleRows[0];
  const q = row.getQuestionByColumnName("col1");
  matrix.checkIfValueInRowDuplicated(row, q);
  matrix.checkIfValueInRowDuplicated(row, q);
  matrix.checkIfValueInRowDuplicated(row, q);
  assert.equal(q.errors.length, 1, "One error only");
  assert.equal(q.errors[0].getErrorType(), "keyduplicationerror", "Correct error is added");
});
QUnit.test("Cell question title and question.locTitle.renderedHtml & localization for matrixdropdown", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }],
        rows: ["item1"]
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  const cellQuestion = matrix.visibleRows[0].cells[0].question;
  assert.equal(cellQuestion.title, "col1", "Question title is column title");
  assert.equal(cellQuestion.locTitle.renderedHtml, "row item1, column col1", "Question rendered title is prepared for accessibility");
  survey.locale = "de";
  assert.equal(cellQuestion.title, "col1", "Question title is column title, #de");
  assert.equal(cellQuestion.locTitle.renderedHtml, "zeile item1, spalte col1", "Question rendered title is prepared for accessibility, #de");
});
QUnit.test("Cell question title and question.locTitle.renderedHtml & localizationfor matrixdynamic", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        columns: [{ name: "col1" }],
        rowCount: 1
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  const cellQuestion = matrix.visibleRows[0].cells[0].question;
  assert.equal(cellQuestion.title, "col1", "Question title is column title");
  assert.equal(cellQuestion.locTitle.renderedHtml, "row 1, column col1", "Question rendered title is prepared for accessibility");
  survey.locale = "de";
  assert.equal(cellQuestion.title, "col1", "Question title is column title, #de");
  assert.equal(cellQuestion.locTitle.renderedHtml, "zeile 1, spalte col1", "Question rendered title is prepared for accessibility, #de");
});
QUnit.test("checkIfValueInRowDuplicated has only one duplicated error", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "matrixdynamic",
        "name": "matrix",
        "state": "collapsed",
        "columns": [

          {
            "name": "col1",
            "cellType": "dropdown",
            "choices": ["a", "b"],
            "showOtherItem": true,
            "storeOthersAsComment": true
          }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  assert.equal(matrix.columns.length, 1, "There is one column, it is loaded correctly");
});
QUnit.test("checkIfValueInRowDuplicated has only one duplicated error", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "matrixdynamic",
        "name": "matrix",
        "rowCount": 1,
        "columns": [
          {
            "name": "col1",
            "cellType": "dropdown",
            "choices": ["a", "b"],
            "choicesMin": 1,
            "choicesMax": 10
          }
        ],
        detailPanelMode: "underRow",
        detailElements: [{
          "name": "q1",
          "type": "dropdown",
          "choices": ["a", "b"],
          "choicesMin": 1,
          "choicesMax": 10
        }],
      }
    ]
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  const cellQuestion = <QuestionDropdownModel>row.cells[0].question;
  row.showDetailPanel();
  const panelQuestion = <QuestionDropdownModel>row.detailPanel.questions[0];
  assert.equal(panelQuestion.choicesMin, 1, "choicesMin is here");
  assert.equal(panelQuestion.choicesMax, 10, "choicesMax is here");
  assert.equal(panelQuestion.visibleChoices.length, 12, "cell question visibleChoices");
});
QUnit.test("checkIfValueInRowDuplicated has only one duplicated error", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "matrixdropdown",
        "name": "matrix1",
        "columns": [{ "name": "col1" }],
        "choices": [1, 2, 3],
        "cellType": "tagbox",
        "rows": ["Row 1"]
      },
      {
        "type": "matrixdynamic",
        "name": "matrix2",
        "columns": [{ "name": "col1", "cellType": "tagbox" }],
        "choices": [1, 2, 3, 4],
      }
    ]
  });
  const matrix1 = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix1");
  const matrix2 = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix2");
  const row1 = matrix1.visibleRows[0];
  const row2 = matrix2.visibleRows[0];
  const cellQuestion1 = <QuestionTagboxModel>row1.cells[0].question;
  const cellQuestion2 = <QuestionTagboxModel>row2.cells[0].question;
  assert.equal(cellQuestion1.getType(), "tagbox", "type #1");
  assert.equal(cellQuestion2.getType(), "tagbox", "type #2");
  assert.equal(cellQuestion1.choices.length, 3, "choices #1");
  assert.equal(cellQuestion2.choices.length, 4, "choices #2");
});
QUnit.test("Do not resetTable for always invisible column", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "matrixdynamic",
        "name": "matrix",
        "rowCount": 1,
        "columns": [
          {
            "name": "col1",
            "cellType": "text"
          },
          {
            "name": "col2",
            "cellType": "text",
            "visibleIf": "false"
          }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  const cellQuestion = matrix.visibleRows[0].cells[0].question;
  const table = matrix.renderedTable;
  table["$ref"] = "ref1";
  cellQuestion.value = "test";
  assert.equal(matrix.renderedTable["$ref"], "ref1", "Do not recreate the rendered table");
});
QUnit.test("survey.onMatrixDetailPanelVisibleChanged event", function (assert) {
  const survey = new SurveyModel({
    questionErrorLocation: "bottom",
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }],
        rows: [0],
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "q1" }],
      },
    ],
  });
  const actions = new Array<string>();
  survey.onMatrixDetailPanelVisibleChanged.add((sender, options) => {
    const action = (options.visible ? "show" : "hide") + ":" + options.rowIndex;
    actions.push(action);
    if (options.visible) {
      options.detailPanel.getQuestionByName("q1").title = "Question 1";
    }
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  row.showDetailPanel();
  const qDetail = row.detailPanel.getQuestionByName("q1");
  assert.equal(qDetail.title, "Question 1", "set title");
  row.hideDetailPanel();
  assert.deepEqual(actions, ["show:0", "hide:0"], "check actions");
});
QUnit.test("column.visibleIf", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "matrixdynamic",
        "name": "matrix",
        "rowCount": 3,
        "columns": [
          {
            "name": "col1",
            "cellType": "text"
          },
          {
            "name": "col2",
            "cellType": "text",
            "visibleIf": "{row.col1} = 1"
          }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const column: MatrixDropdownColumn = matrix.columns[1];
  const rows = matrix.visibleRows;
  const row0Cell1 = rows[0].cells[0].question;
  const row1Cell1 = rows[1].cells[0].question;
  const row2Cell1 = rows[2].cells[0].question;
  const row0Cell2 = rows[0].cells[1].question;
  const row1Cell2 = rows[1].cells[1].question;
  const row2Cell2 = rows[2].cells[1].question;
  assert.equal(column.isColumnVisible, false, "column is invisible #1");
  assert.equal(column.hasVisibleCell, false, "column cells are invisible, #1");
  row0Cell1.value = 1;
  assert.equal(column.isColumnVisible, true, "column is visible #1");
  assert.equal(row0Cell2.isVisible, true, "row0Cell2.isVisible #1");
  assert.equal(row1Cell2.isVisible, false, "row1Cell2.isVisible #1");
  assert.equal(row2Cell2.isVisible, false, "row2Cell2.isVisible #1");
  row0Cell1.value = 2;
  assert.equal(column.isColumnVisible, false, "column is invisible #2");
  row1Cell1.value = 1;
  assert.equal(column.isColumnVisible, true, "column is visible #2");
  assert.equal(row0Cell2.isVisible, false, "row0Cell2.isVisible #2");
  assert.equal(row1Cell2.isVisible, true, "row1Cell2.isVisible #2");
  assert.equal(row2Cell2.isVisible, false, "row2Cell2.isVisible #2");
  row2Cell1.value = 1;
  assert.equal(row0Cell2.isVisible, false, "row0Cell2.isVisible #2");
  assert.equal(row1Cell2.isVisible, true, "row1Cell2.isVisible #3");
  assert.equal(row2Cell2.isVisible, true, "row2Cell2.isVisible #3");
  row0Cell1.value = 1;
  assert.equal(row0Cell2.isVisible, true, "row0Cell2.isVisible #4");
  assert.equal(row1Cell2.isVisible, true, "row1Cell2.isVisible #3");
  assert.equal(row2Cell2.isVisible, true, "row2Cell2.isVisible #3");
});
QUnit.test("defaultValueExpression & regeneration of rows", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        defaultValue: 5
      },
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          {
            name: "col1",
            cellType: "text",
            defaultValueExpression: "{q1}"
          }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const question = survey.getQuestionByName("q1");
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 5, "question value #1");
  question.value = 10;
  const id = matrix.visibleRows[0].id;
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 10, "question value #2");
  matrix.addColumn("col2");
  assert.notEqual(matrix.visibleRows[0].id, id, "It is a new row");
  question.value = 15;
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 15, "question value #3");
});
QUnit.test("defaultValueExpression & using rowvalue in it", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        defaultValue: 5
      },
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          {
            name: "col1",
            cellType: "text",
            defaultValueExpression: "{q1}"
          }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const question = survey.getQuestionByName("q1");
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 5, "question value #1");
  question.value = 10;
  const id = matrix.visibleRows[0].id;
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 10, "question value #2");
  matrix.addColumn("col2");
  assert.notEqual(matrix.visibleRows[0].id, id, "It is a new row");
  question.value = 15;
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 15, "question value #3");
});
QUnit.test("defaultValueExpression & using rowvalue in it", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        defaultValue: 5
      },
      {
        type: "text",
        name: "q2",
        defaultValue: 10
      },
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [
          {
            name: "col1",
            cellType: "text",
            defaultValueExpression: "iif({rowvalue} = 'row1', {q1}, iif({rowvalue} = 'row2', {q2}))"
          },
          { name: "col2", cellType: "text" }
        ],
        rows: [
          { value: "row1", visibleIf: "{q1} > 1" },
          { value: "row2", visibleIf: "{q2} > 1" }]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 5, "cell1 value #1");
  assert.equal(matrix.visibleRows[1].cells[0].question.value, 10, "cell1 value #1");
  matrix.visibleRows[0].cells[1].question.value = 12;
  q1.value = 15;
  q2.value = 20;
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 15, "cell1 value #2");
  assert.equal(matrix.visibleRows[1].cells[0].question.value, 20, "cell1 value #2");
  q1.value = 0;
  assert.equal(matrix.visibleRows.length, 1, "visible rows count #1");
  const id = matrix.visibleRows[0].id;
  q1.value = 30;
  q2.value = 50;
  assert.notEqual(matrix.visibleRows[0].id, id, "It is a new row");
  assert.equal(matrix.visibleRows.length, 2, "visible rows count #2");
  assert.equal(matrix.visibleRows[0].cells[1].question.value, 12, "Keep value in the standard cell");
  assert.equal(matrix.visibleRows[0].cells[0].question.value, 30, "cell1 value #3");
  assert.equal(matrix.visibleRows[1].cells[0].question.value, 50, "cell1 value #3");
});
QUnit.test("rows enableIf property, #8461", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1"
      },
      {
        type: "text",
        name: "q2"
      },
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text", enableIf: "{row.col1} > 10" }
        ],
        rows: [
          { value: "row1", enableIf: "{q1} > 10" },
          { value: "row2", enableIf: "{q2} > 10" }],
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "q4" }]
      }
    ]
  });
  const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const rows = matrix.visibleRows;
  assert.equal(rows[0].isRowEnabled(), false, "row1 enabled #1");
  assert.equal(rows[1].isRowEnabled(), false, "row2 enabled #1");
  const row1Col1Cell = rows[0].getQuestionByName("col1");
  const row1Col2Cell = rows[0].getQuestionByName("col2");
  const row2Col1Cell = rows[1].getQuestionByName("col1");
  const row2Col2Cell = rows[1].getQuestionByName("col2");

  rows[0].showDetailPanel();
  rows[1].showDetailPanel();
  const panel1 = rows[0].detailPanel;
  const panel2 = rows[1].detailPanel;

  assert.equal(row1Col1Cell.isReadOnly, true, "row1Col1Cell #1");
  assert.equal(row1Col2Cell.isReadOnly, true, "row1Col2Cell #1");
  assert.equal(row2Col1Cell.isReadOnly, true, "row2Col1Cell #1");
  assert.equal(row2Col2Cell.isReadOnly, true, "row2Col2Cell #1");
  assert.equal(panel1.isReadOnly, true, "panel1 #1");
  assert.equal(panel2.isReadOnly, true, "panel2 #1");
  q1.value = 11;
  assert.equal(rows[0].isRowEnabled(), true, "row1 enabled #2");
  assert.equal(rows[1].isRowEnabled(), false, "row2 enabled #2");
  assert.equal(row1Col1Cell.isReadOnly, false, "row1Col1Cell #2");
  assert.equal(row1Col2Cell.isReadOnly, true, "row1Col2Cell #2");
  assert.equal(row2Col1Cell.isReadOnly, true, "row2Col1Cell #2");
  assert.equal(row2Col2Cell.isReadOnly, true, "row2Col2Cell #2");
  assert.equal(panel1.isReadOnly, false, "panel1 #2");
  assert.equal(panel2.isReadOnly, true, "panel2 #2");
  q2.value = 11;
  assert.equal(rows[0].isRowEnabled(), true, "row1 enabled #3");
  assert.equal(rows[1].isRowEnabled(), true, "row2 enabled #3");
  assert.equal(row1Col1Cell.isReadOnly, false, "row1Col1Cell #3");
  assert.equal(row1Col2Cell.isReadOnly, true, "row1Col2Cell #3");
  assert.equal(row2Col1Cell.isReadOnly, false, "row2Col1Cell #3");
  assert.equal(row2Col2Cell.isReadOnly, true, "row2Col2Cell #3");
  assert.equal(panel1.isReadOnly, false, "panel1 #3");
  assert.equal(panel2.isReadOnly, false, "panel2 #3");
  row1Col1Cell.value = 11;
  assert.equal(row1Col1Cell.isReadOnly, false, "row1Col1Cell #4");
  assert.equal(row1Col2Cell.isReadOnly, false, "row1Col2Cell #4");
  assert.equal(row2Col1Cell.isReadOnly, false, "row2Col1Cell #4");
  assert.equal(row2Col2Cell.isReadOnly, true, "row2Col2Cell #4");
  assert.equal(panel1.isReadOnly, false, "panel1 #4");
  assert.equal(panel2.isReadOnly, false, "panel2 #4");
  row2Col1Cell.value = 11;
  assert.equal(row1Col1Cell.isReadOnly, false, "row1Col1Cell #5");
  assert.equal(row1Col2Cell.isReadOnly, false, "row1Col2Cell #5");
  assert.equal(row2Col1Cell.isReadOnly, false, "row2Col1Cell #5");
  assert.equal(row2Col2Cell.isReadOnly, false, "row2Col2Cell #5");
  assert.equal(panel1.isReadOnly, false, "panel1 #5");
  assert.equal(panel2.isReadOnly, false, "panel2 #5");
  q1.value = 1;
  assert.equal(rows[0].isRowEnabled(), false, "row1 enabled #6");
  assert.equal(rows[1].isRowEnabled(), true, "row2 enabled #6");
  assert.equal(row1Col1Cell.isReadOnly, true, "row1Col1Cell #6");
  assert.equal(row1Col2Cell.isReadOnly, true, "row1Col2Cell #6");
  assert.equal(row2Col1Cell.isReadOnly, false, "row2Col1Cell #6");
  assert.equal(row2Col2Cell.isReadOnly, false, "row2Col2Cell #6");
  assert.equal(panel1.isReadOnly, true, "panel1 #6");
  assert.equal(panel2.isReadOnly, false, "panel2 #6");
  row2Col1Cell.value = 1;
  assert.equal(row1Col1Cell.isReadOnly, true, "row1Col1Cell #7");
  assert.equal(row1Col2Cell.isReadOnly, true, "row1Col2Cell #7");
  assert.equal(row2Col1Cell.isReadOnly, false, "row2Col1Cell #7");
  assert.equal(row2Col2Cell.isReadOnly, true, "row2Col2Cell #7");
  assert.equal(panel1.isReadOnly, true, "panel1 #7");
  assert.equal(panel2.isReadOnly, false, "panel2 #7");
  matrix.readOnly = true;
  assert.equal(row1Col1Cell.isReadOnly, true, "row1Col1Cell #8");
  assert.equal(row1Col2Cell.isReadOnly, true, "row1Col2Cell #8");
  assert.equal(row2Col1Cell.isReadOnly, true, "row2Col1Cell #8");
  assert.equal(row2Col2Cell.isReadOnly, true, "row2Col2Cell #8");
  assert.equal(panel1.isReadOnly, true, "panel1 #8");
  assert.equal(panel2.isReadOnly, true, "panel2 #8");
  matrix.readOnly = false;
  assert.equal(row1Col1Cell.isReadOnly, true, "row1Col1Cell #9");
  assert.equal(row1Col2Cell.isReadOnly, true, "row1Col2Cell #9");
  assert.equal(row2Col1Cell.isReadOnly, false, "row2Col1Cell #9");
  assert.equal(row2Col2Cell.isReadOnly, true, "row2Col2Cell #9");
  assert.equal(panel1.isReadOnly, true, "panel1 #9");
  assert.equal(panel2.isReadOnly, false, "panel2 #9");
});
QUnit.test("rows enableIf property: disabled attr, #8850", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1"
      },
      {
        type: "text",
        name: "q2"
      },
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text" }
        ],
        rows: [
          { value: "row1", enableIf: "{q1} > 10" },
          { value: "row2", enableIf: "{q2} > 10" }],
      }
    ]
  });
  const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
  const q1 = survey.getQuestionByName("q1");
  const rows = matrix.visibleRows;

  q1.value = 11;
  assert.equal(rows[0].cells[0].question.isDisabledAttr, false);
  q1.value = 9;
  assert.equal(rows[0].cells[0].question.isDisabledAttr, true);
});
QUnit.test("showInMultipleColumns & random choices, Bug#8348", function (assert) {
  class HelpTest {
    public static randomizeArray<T>(array: Array<T>): Array<T> {
      return ([].concat(array as any)).reverse();
    }
  }
  const oldFunc = Helpers.randomizeArray;
  Helpers.randomizeArray = HelpTest.randomizeArray;
  const survey = new SurveyModel({
    elements: [
      {
        "type": "matrixdropdown",
        "name": "matrix",
        "columns": [
          {
            "name": "column",
            "cellType": "radiogroup",
            "showInMultipleColumns": true,
            "choices": ["col1", "col2", "col3", "col4", "col5"],
            "choicesOrder": "random"
          }
        ],
        "rows": ["row1", "row2"]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const rows = matrix.renderedTable.rows;
  assert.equal(matrix.columns[0].templateQuestion.visibleChoices[0].value, "col5", "column tempate");
  assert.equal(rows[0].cells[1].question.visibleChoices[0].value, "col5", "row1 question");
  assert.equal(rows[1].cells[1].question.visibleChoices[0].value, "col5", "row2 question");
  Helpers.randomizeArray = oldFunc;
});
QUnit.test("Check if errors disappered in the cells in the current row on changing cell value, Bug#8539", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          {
            name: "col1", cellType: "text",
            validators: [{ type: "expression", expression: "{row.col1} + {row.col2} <= 10" }]
          },
          { name: "col3", cellType: "text" },
          {
            name: "col2", cellType: "text",
            validators: [{ type: "expression", expression: "{row.col1} + {row.col2} <= 10" }]
          }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const row = matrix.visibleRows[0];
  const q1 = row.cells[0].question;
  const q2 = row.cells[2].question;
  q1.value = 7;
  q2.value = 7;
  matrix.validate(true);
  assert.equal(q1.errors.length, 1, "q1 errors #1");
  assert.equal(q2.errors.length, 1, "q2 errors #1");
  q2.value = 1;
  assert.equal(q1.errors.length, 0, "q1 errors #2");
  assert.equal(q2.errors.length, 0, "q2 errors #2");
});
QUnit.test("choices property visibility, Bug#8560", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix"
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const prop = Serializer.findProperty("matrixdynamic", "choices");
  assert.equal(prop.isVisible("", matrix), true, "#1");
  matrix.cellType = "text";
  assert.equal(prop.isVisible("", matrix), false, "#2");
  matrix.cellType = "checkbox";
  assert.equal(prop.isVisible("", matrix), true, "#3");
  matrix.cellType = "comment";
  assert.equal(prop.isVisible("", matrix), false, "#4");
});
QUnit.test("Column total properties visibility, Bug#8581", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        columns: [
          { cellType: "checkbox", name: "col1" }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const column = <MatrixDropdownColumn>matrix.columns[0];
  const isPropVisible = (name: string): boolean => {
    const prop = Serializer.findProperty("matrixdropdowncolumn", name);
    return prop.isVisible("", column);
  };
  const checkPropsVisibility = (names: Array<string>, val: boolean, num: number): void => {
    names.forEach(name => {
      assert.equal(isPropVisible(name), val, name + " #" + num.toString());
    });
  };
  const totalsNames = ["totalType", "totalExpression"];
  const totalsDispNames = ["totalFormat", "totalDisplayStyle", "totalAlignment", "totalCurrency",
    "totalMaximumFractionDigits", "totalMinimumFractionDigits"];
  checkPropsVisibility(totalsNames, true, 1);
  checkPropsVisibility(totalsDispNames, false, 1);
  column.totalExpression = "countInArray({matrix}, 'col1')";
  checkPropsVisibility(totalsNames, true, 2);
  checkPropsVisibility(totalsDispNames, true, 2);
  column.totalExpression = "";
  checkPropsVisibility(totalsNames, true, 3);
  checkPropsVisibility(totalsDispNames, false, 3);
  column.totalType = "count";
  checkPropsVisibility(totalsNames, true, 4);
  checkPropsVisibility(totalsDispNames, true, 4);
  column.totalType = "none";
  checkPropsVisibility(totalsNames, true, 5);
  checkPropsVisibility(totalsDispNames, false, 5);
  column.showInMultipleColumns = true;
  checkPropsVisibility(totalsNames, false, 6);
  checkPropsVisibility(totalsDispNames, false, 6);
  column.showInMultipleColumns = false;
  checkPropsVisibility(totalsNames, true, 7);
  checkPropsVisibility(totalsDispNames, false, 7);
});
QUnit.test("Column choices from colum and from matrix properties, Bug#8691", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          { cellType: "checkbox", name: "col1" }
        ],
        choices: [1, 2, 3, 4]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  const column = <MatrixDropdownColumn>matrix.columns[0];
  const cellQuestion = <QuestionCheckboxModel>matrix.visibleRows[0].cells[0].question;
  assert.equal(cellQuestion.choices.length, 4, "choices from matrix, #1");
  (<any>column).choices = [5, 6];
  assert.equal(cellQuestion.choices.length, 2, "choices from colum, #1");
  (<any>column).choices = [];
  assert.equal(cellQuestion.choices.length, 4, "choices from matrix, #2");
  (<any>column).choices = [5, 6, 7];
  assert.equal(cellQuestion.choices.length, 3, "choices from colum, #2");
});
QUnit.test("showInMultipleColumns - add choice item", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "matrixdropdown",
        "name": "matrix",
        "columns": [
          {
            "name": "column",
            "cellType": "checkbox",
            "showInMultipleColumns": true,
            "choices": ["col1", "col2", "col3"],
          }
        ],
        "choices": [
          1,
          2,
          3,
          4,
          5
        ],
        "rows": ["row1", "row2"]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  let rows = matrix.renderedTable.rows;
  assert.equal(matrix.columns[0].templateQuestion.visibleChoices.length, 3, "3 items");
  assert.equal(matrix.columns[0].templateQuestion.visibleChoices[2].value, "col3", "column tempate");
  assert.equal(rows[0].cells.length, 4, "3 cells");
  assert.equal(rows[0].cells[1].question.visibleChoices[0].value, "col1", "row1 question 1");
  assert.equal(rows[0].cells[1].question.visibleChoices[2].value, "col3", "row1 question 3");
  assert.equal(rows[1].cells[1].question.visibleChoices[0].value, "col1", "row2 question 1");
  assert.equal(rows[1].cells[1].question.visibleChoices[2].value, "col3", "row2 question 3");

  matrix.columns[0].choices.push(new ItemValue("col4"));
  rows = matrix.renderedTable.rows;
  assert.equal(matrix.columns[0].templateQuestion.visibleChoices.length, 4, "4 items - item should be added");
  assert.equal(matrix.columns[0].templateQuestion.visibleChoices[3].value, "col4", "column tempate");
  assert.equal(rows[0].cells.length, 5, "4 cells - item should be added");
  assert.equal(rows[0].cells[1].question.visibleChoices[0].value, "col1", "row1 question 1");
  assert.equal(rows[0].cells[1].question.visibleChoices[3].value, "col4", "row1 question 3");
  assert.equal(rows[1].cells[1].question.visibleChoices[0].value, "col1", "row2 question 1");
  assert.equal(rows[1].cells[1].question.visibleChoices[3].value, "col4", "row2 question 3");
});
QUnit.test("The Undo operation doesn't work for matrix dropdown column 'choices' property, Bug#8791", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "matrixdropdown",
        "name": "matrix",
        "columns": [
          {
            "name": "column1",
            "cellType": "checkbox",
            "choices": ["col1", "col2", "col3"],
          }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  let propName;
  let arrayChangesTest;
  let counter = 0;
  let senderName;
  survey.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: any,
    arrayChanges: any
  ) => {
    if(name === "choices") {
      counter ++;
      propName = name;
      senderName = sender.name;
      arrayChangesTest = arrayChanges;
    }
  };
  matrix.columns[0].choices.push(new ItemValue("col4"));
  assert.equal(counter, 1, "counter");
  assert.equal(propName, "choices", "propName");
  assert.equal(senderName, "column1", "senderName");
  assert.ok(arrayChangesTest, "arrayChanges");
});
QUnit.test("Support columnsVisibleIf property, Bug#8796", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["col1", "col2", "col3"]
      },
      {
        type: "matrixdropdown",
        columnsVisibleIf: "{q1} contains {item}",
        name: "matrix",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text" },
          { name: "col3", cellType: "text" }
        ],
        rows: ["row1"],
      },
    ],
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  survey.setValue("q1", ["col1", "col3"]);
  assert.equal(matrix.columns[0].isColumnVisible, true, "The default column.visible is true");
  assert.equal(matrix.columns[1].isColumnVisible, false, "The second column.visible is false");
  assert.equal(matrix.columns[2].isColumnVisible, true, "The third column.visible is true");
  let table = matrix.renderedTable;
  assert.equal(table.headerRow.cells.length, 1 + 2, "Header: One column is invisible, #1");
  assert.equal(table.rows[1].cells.length, 1 + 2, "Row: One column is invisible, #1");
  assert.equal(table.headerRow.cells[2].headers, "col3", "The second column is col3, #1");

  survey.setValue("q1", ["col1", "col2", "col3"]);
  assert.equal(matrix.columns[1].isColumnVisible, true, "The second column.visible is true, #2");
  assert.notStrictEqual(table, matrix.renderedTable);
  table = matrix.renderedTable;
  assert.equal(table.headerRow.cells.length, 1 + 3, "Header: All columns are visible, #2");
  assert.equal(table.rows[1].cells.length, 1 + 3, "Row: All columns are visible, #2");
  assert.equal(table.headerRow.cells[2].headers, "col2", "The second column is col2, #2");

  survey.setValue("q1", ["col1", "col2"]);
  assert.equal(matrix.columns[2].isColumnVisible, false, "The third column.visible is false, #3");
  table = matrix.renderedTable;
  assert.equal(table.headerRow.cells.length, 1 + 2, "Header: the last column is invisible, #3");
  assert.equal(table.rows[1].cells.length, 1 + 2, "Row: the last column is invisible, #3");
  assert.equal(table.headerRow.cells[2].headers, "col2", "The last column is col2, #3");
});
QUnit.test("rowVisibleIf & rowIndex, Bug#8796", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "matrixdynamic",
        "name": "matrix",
        "rowsVisibleIf": "{row.no} = 1 or {row.no} empty",
        "columns": [
          {
            "name": "no",
            "cellType": "text",
            "defaultValueExpression": "{rowIndex}"
          },
          {
            "name": "column1"
          },
          {
            "name": "column2",
            "cellType": "expression",
            "expression": "{rowIndex}"
          }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
  assert.equal(matrix.visibleRows.length, 1, "The first row is visible only");
  matrix.addRow();
  matrix.addRow();
  assert.equal(matrix.visibleRows.length, 1, "The first row is visible only, #2");
  assert.deepEqual(matrix.value, [{ no: 1, column2: 1 }, { no: 2, column2: 2 }, { no: 3, column2: 3 }, { no: 4, column2: 4 }], "matrix.data");
});
QUnit.test("isQuestion answered & design time", function (assert) {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [
      {
        titleLocation: "hidden",
        cellType: "text",
        "type": "matrixdropdown",
        "name": "m",
        "columns": ["Col 1", "Col 2"],
        "rows": [
          "Row 1",
          "Row 2"
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("m");
  assert.ok(matrix.renderedTable, "create rendered table");
  assert.strictEqual(matrix.isAnswered, false, "Matrix is not answered");
  const rows = matrix.visibleRows;
  assert.strictEqual(rows[0].cells[0].question.isAnswered, false, "[0, 0]");
  assert.strictEqual(rows[0].cells[1].question.isAnswered, false, "[0, 1]");
  assert.strictEqual(rows[1].cells[0].question.isAnswered, false, "[1, 0]");
  assert.strictEqual(rows[1].cells[1].question.isAnswered, false, "[1, 1]");
});
QUnit.test("Serialize empty column title, #9007", function (assert) {
  settings.serialization.matrixDropdownColumnSerializeTitle = true;

  const matrix = new QuestionMatrixDropdownModel("q1");
  matrix.addColumn("col1");
  matrix.addColumn("col2", "Column2");
  assert.deepEqual(matrix.toJSON(), {
    name: "q1",
    columns: [{ name: "col1", title: "col1" }, { name: "col2", title: "Column2" }]
  }, "Serialize empty title");

  settings.serialization.matrixDropdownColumnSerializeTitle = false;
});
