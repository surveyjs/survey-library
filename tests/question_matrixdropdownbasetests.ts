import { Serializer } from "../src/jsonobject";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { SurveyModel } from "../src/survey";

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
  assert.equal(matrix.renderedTable.headerRow.cells[1].className, "sv_matrix_cell_header", "column 1");
  assert.equal(matrix.renderedTable.headerRow.cells[2].className, "sv_matrix_cell_header", "column 2");
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
  assert.equal(renderedTable.rows[1].cells[1].className, "custom-item-cell custom-radio-item-cell");
  assert.equal(renderedTable.rows[1].cells[3].className, "custom-item-cell custom-checkbox-item-cell");
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
  var survey = new SurveyModel({ elements: [
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