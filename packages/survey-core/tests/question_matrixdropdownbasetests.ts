import { Serializer } from "../src/jsonobject";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { SurveyModel } from "../src/survey";
import { Helpers } from "../src/helpers";
import { MatrixDropdownRowModel, QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { ItemValue } from "../src/itemvalue";
import { settings } from "../src/settings";
import { setOldTheme } from "./oldTheme";
import { Question } from "../src/question";
import { ProcessValue, ValueGetter } from "../src/conditions/conditionProcessValue";
import { describe, test, expect } from "vitest";
export * from "../src/localization/german";

describe("Survey_QuestionMatrixDropdownBase", () => {
  test(" 213 123sad d213 sadsd", () => {
    const matrix = new QuestionMatrixDropdownModelBase("q1");

    expect(matrix["generatedVisibleRows"], "generatedVisibleRows is null").toBeNull();
    expect(matrix.getAllErrors(), "getAllErrors method doesn't fall").toEqualValues([]);
  });
  test("allowAdaptiveActions", () => {
    const matrix = new QuestionMatrixDropdownModelBase("q1");
    matrix.detailPanelMode = "underRow";
    expect(matrix.allowAdaptiveActions, "matrix.allowAdaptiveActions").toBe(false);
    expect(matrix.getPanels()[0]["allowAdaptiveActions"], "matrix.panel.allowAdaptiveActions").toBe(true);

    matrix.allowAdaptiveActions = false;
    expect(matrix.allowAdaptiveActions, "matrix.allowAdaptiveActions").toBe(false);
    expect(matrix.getPanels()[0]["allowAdaptiveActions"], "matrix.panel.allowAdaptiveActions").toBe(false);
    matrix.detailPanelMode = "none";
    matrix.allowAdaptiveActions = true;
    expect(matrix.allowAdaptiveActions, "matrix.allowAdaptiveActions, #1").toBe(true);
    matrix.allowAdaptiveActions = false;
    expect(matrix.allowAdaptiveActions, "matrix.allowAdaptiveActions, #2").toBe(false);
  });

  test("verticalLayout when isMobile set 'true'", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          rowCount: 2,
          transposeData: true,
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
    matrix.renderedTable;
    expect(!!matrix.getPropertyValue("renderedTable")).toBeTruthy();
    expect(matrix.isColumnLayoutHorizontal).toBeFalsy();
    matrix.isMobile = true;
    expect(matrix.isColumnLayoutHorizontal).toBeTruthy();
    expect(!!matrix.getPropertyValue("renderedTable")).toBeFalsy();
  });
  test("Change templateQuestion on changing cellType faster reacting onPropertyChanged", () => {
    const column = new MatrixDropdownColumn("col1");
    expect(column.cellType).toBe("default");
    expect(column.templateQuestion.getType()).toBe("dropdown");
    column.registerPropertyChangedHandlers(["cellType"], () => {
      expect(column.cellType).toBe("text");
      expect(column.templateQuestion.getType()).toBe("text");
    });
    column.cellType = "text";
  });
  test("visible attribute for min property  should return true for text question with inputType number/month", () => {
    const column = new MatrixDropdownColumn("col1");
    expect(column.cellType).toBe("default");
    const property = Serializer.findProperty("text", "min");
    expect(property.visibleIf(column), "cell type is default").toBe(false);
    column.cellType = "text";
    expect(property.visibleIf(column), "inputType is text").toBe(false);
    (<any>column).inputType = "number";
    expect(property.visibleIf(column), "inputType is number").toBe(true);
    (<any>column).inputType = "month";
    expect(property.visibleIf(column), "inputType is month").toBe(true);
    (<any>column).inputType = "text";
    expect(property.visibleIf(column), "inputType is text").toBe(false);
  });
  test("table vertical align and alternate rows", () => {
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

    expect(matrix.getTableCss(), "table css is rootVerticalAlignMiddleClass").toBe("rootClass rootVerticalAlignMiddleClass");
    matrix.verticalAlign = "top";
    expect(matrix.getTableCss(), "default table css is rootVerticalAlignTopClass").toBe("rootClass rootVerticalAlignTopClass");
    matrix.alternateRows = true;
    expect(matrix.getTableCss(), "table css is rootAlternateRowsClass rootVerticalAlignMiddleClass").toBe("rootClass rootAlternateRowsClass rootVerticalAlignTopClass");
  });

  test("table autocolumn width", () => {
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

    expect(matrix.getTableCss(), "matrix").toBe("rootClass rootColumnsAutoWidth");
    expect(matrixd.getTableCss(), "matrixd").toBe("rootClass rootColumnsAutoWidth");

    matrixd.columns[0].width = "100px";
    expect(matrixd.getTableCss(), "matrixd").toBe("rootClass");

    matrixd.columns[0].width = "";
    survey.setIsMobile(true);
    expect(matrix.getTableCss(), "matrix mobile").toBe("rootClass");
    expect(matrixd.getTableCss(), "matrixd mobile").toBe("rootClass");
  });

  test("column.templateQuestion has set parentQuestion", () => {
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
    expect(matrix.columns[0].templateQuestion.parentQuestion.name, "question name is set").toBe("matrix");
    const matrix2 = new QuestionMatrixDropdownModelBase("q1");
    const col = matrix2.addColumn("col1");
    expect(col.templateQuestion.parentQuestion.name, "column created from code has parentQuestion").toBe("q1");
  });
  test("column cell css classes by column cellType test", () => {
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
    expect(matrix.renderedTable.headerRow.cells.length).toBe(6);
    expect(matrix.renderedTable.headerRow.cells[0].className, "empty column").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
    expect(matrix.renderedTable.headerRow.cells[1].className, "column 1").toBe("sv_matrix_cell_header sv_matrix_cell--radiogroup");
    expect(matrix.renderedTable.headerRow.cells[2].className, "column 2").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
    expect(matrix.renderedTable.headerRow.cells[3].className, "column 3").toBe("sv_matrix_cell_header sv_matrix_cell--checkbox");
    expect(matrix.renderedTable.headerRow.cells[4].className, "column 4").toBe("sv_matrix_cell_header sv_matrix_cell--comment");
    expect(matrix.renderedTable.headerRow.cells[5].className, "column 5").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");

  });

  test("column cell css classes for vertical layout", () => {
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
    expect(matrix.renderedTable.headerRow.cells.length).toBe(3);
    const cssHeader = survey.css.matrixdropdown.headerCell;
    expect(matrix.renderedTable.headerRow.cells[1].className, "column 1").toBe(cssHeader);
    expect(matrix.renderedTable.headerRow.cells[2].className, "column 2").toBe(cssHeader);
  });

  test("column cell css classes by matrix cellType test", () => {
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
    expect(matrix.renderedTable.headerRow.cells.length).toBe(6);
    expect(matrix.renderedTable.headerRow.cells[0].className, "empty column").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
    expect(matrix.renderedTable.headerRow.cells[1].className, "column 1").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
    expect(matrix.renderedTable.headerRow.cells[2].className, "column 2").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
    expect(matrix.renderedTable.headerRow.cells[3].className, "column 3").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
    expect(matrix.renderedTable.headerRow.cells[4].className, "column 4").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
    expect(matrix.renderedTable.headerRow.cells[5].className, "column 5").toBe("sv_matrix_cell_header sv_matrix_cell--dropdown");
  });
  test("Incorrect default value in matrix dropdown", () => {
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
    expect(!!matrix.getPropertyValue("renderedTable")).toBeTruthy();
  });
  test("Incorrect default value in matrix dynamic", () => {
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
    expect(!!matrix.getPropertyValue("renderedTable")).toBeTruthy();
  });
  test("matrix dropdown getElementsInDesign", () => {
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
    expect(elements.length).toBe(2);
    expect(elements[0]).toBe(matrix.columns[0]);
    expect(elements[1]).toBe(matrix.columns[1]);
  });
  test("Check matrixdropdown cells cssClasses with showInMultipleColumns", () => {
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
    expect(renderedTable.headerRow.cells[1].className).toBe("custom-header-cell");
    expect(renderedTable.rows[1].cells[1].className).toBe("sv_matrix_cell custom-item-cell custom-radio-item-cell");
    expect(renderedTable.rows[1].cells[3].className).toBe("sv_matrix_cell custom-item-cell custom-checkbox-item-cell");
  });
  test("Check matrixdropdown cells cssClasses with showInMultipleColumns", () => {
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
    expect(columnName, "The event raised correctly").toBe("col1");
    matrix.columns.push(new MatrixDropdownColumn("col2"));
    expect(columnName, "The event raised correctly on adding into array").toBe("col2");
  });

  test("Check matrixdropdown default column min widths", () => {
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
    expect(question.getColumnWidth(question.columns[0])).toBe("240px");
    expect(question.getColumnWidth(question.columns[1])).toBe("200px");

    question.columnMinWidth = "300px";
    expect(question.getColumnWidth(question.columns[0])).toBe("300px");
    expect(question.getColumnWidth(question.columns[1])).toBe("300px");

    question.columns[0].minWidth = "320px";
    question.columns[1].minWidth = "340px";

    expect(question.getColumnWidth(question.columns[0])).toBe("320px");
    expect(question.getColumnWidth(question.columns[1])).toBe("340px");

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

  test("getCellWrapper name and data", () => {
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
    expect(survey.reason, "Total cell component name").toBe("name->row-footer");
    matrix.getCellWrapperComponentData(totalCell);
    expect(survey.reason, "Total cell component data").toBe("data->row-footer");

    var ordinaryRow = matrix.visibleRows[0];
    var ordinaryCell = ordinaryRow.cells[0];
    matrix.getCellWrapperComponentName(ordinaryCell);
    expect(survey.reason, "Ordinary cell component name").toBe("name->cell");
    matrix.getCellWrapperComponentData(ordinaryCell);
    expect(survey.reason, "Ordinary cell component data").toBe("data->cell");
  });
  test("Rows with value = 0, Bug#6370", () => {
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
    expect(matrix.visibleRows.length, "Three rows has been created").toBe(3);
    expect(matrix.visibleRows[0].rowName, "The rowName is 0").toBe(0);
    matrix.visibleRows[0].cells[0].question.value = "val1";
    expect(survey.data, "Set row value correctly").toEqualValues({ q1: { 0: { col1: "val1" } } });
  });
  test("survey.onPropertyValueChangedCallback on column property changed", () => {
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
    expect(counter, "initial").toBe(0);
    column.title = "col title";
    expect(counter, "callback called, #1").toBe(1);
    expect(propertyName, "title is changed, #2").toBe("title");
    column["expression"] = "today()";
    expect(counter, "callback called, #3").toBe(2);
    expect(propertyName, "expression is changed, #4").toBe("expression");
  });
  test("Column width is not loaded, bug in Creator #4303", () => {
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
    expect(matrix.columns.length, "There is one column").toBe(1);
    expect(matrix.columns[0].width, "column width is loaded correctly").toBe("222px");
  });
  test("Error location from survey/matrix/properties", () => {
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
    expect(qCell, "qCell").toBeTruthy();
    expect(qDetail, "qDetail").toBeTruthy();
    expect(qCell.getErrorLocation(), "cell, #1").toBe("bottom");
    expect(qDetail.getErrorLocation(), "question in detail panel, #1").toBe("bottom");
    matrix.errorLocation = "top";
    expect(qCell.getErrorLocation(), "cell, #2").toBe("top");
    expect(qDetail.getErrorLocation(), "question in detail panel, #2").toBe("top");
    matrix.cellErrorLocation = "bottom";
    expect(qCell.getErrorLocation(), "cell, #3").toBe("bottom");
    expect(qDetail.getErrorLocation(), "question in detail panel, #3").toBe("top");
    matrix.cellErrorLocation = "default";
    matrix.detailErrorLocation = "bottom";
    expect(qCell.getErrorLocation(), "cell, #4").toBe("top");
    expect(qDetail.getErrorLocation(), "question in detail panel, #4").toBe("bottom");
  });
  test("Set incorrect value into matrix dropdown", () => {
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
    expect(matrix.isEmpty(), "Do not allow to set incorrect values").toBe(true);
    expect(matrix.value, "matrix value is empty, #1").toBeFalsy();
    survey.data = { matrix: "a string" };
    expect(matrix.isEmpty(), "Do not allow to set incorrect values from data").toBe(true);
    expect(matrix.value, "matrix value is empty, #2").toBeFalsy();
    survey.data = { matrix: { row1: 1 } };
    expect(matrix.isEmpty(), "Set correct value").toBe(false);
  });
  test("column.visible property", () => {
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
    expect(matrix.columns[0].visible, "The default column.visible is true").toBe(true);
    expect(matrix.columns[1].visible, "The second column.visible is false").toBe(false);
    let table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: One column is invisible, #1").toBe(1 + 2);
    expect(table.rows[1].cells.length, "Row: One column is invisible, #1").toBe(1 + 2);
    expect(table.headerRow.cells[2].headers, "The second column is col3, #1").toBe("col3");
    matrix.columns[1].visible = true;
    expect(table).not.toBe(matrix.renderedTable);
    table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: All columns are visible, #2").toBe(1 + 3);
    expect(table.rows[1].cells.length, "Row: All columns are visible, #2").toBe(1 + 3);
    expect(table.headerRow.cells[2].headers, "The second column is col2, #2").toBe("col2");
    matrix.columns[2].visible = false;
    table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: the last column is invisible, #3").toBe(1 + 2);
    expect(table.rows[1].cells.length, "Row: the last column is invisible, #3").toBe(1 + 2);
    expect(table.headerRow.cells[2].headers, "The last column is col2, #3").toBe("col2");
  });
  test("column.visible property and design time", () => {
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
    expect(matrix.columns[0].visible, "Column is visible by default").toBe(true);
    expect(matrix.columns[1].visible, "visible property is false").toBe(false);
    expect(matrix.columns[1].hasVisibleCell, "It is visible").toBe(true);
    let table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: One column is invisible, but it is visible in design-time, #1").toBe(1 + 3);
    expect(table.rows[1].cells.length, "Row: One column is invisible, but it is visible in design-time, #1").toBe(1 + 3);
    expect(table.headerRow.cells[3].headers, "The last column is col3, #1").toBe("col3");
    matrix.columns[2].visible = false;
    table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: Two columns are invisible, but it is visible in design-time, #2").toBe(1 + 3);
    expect(table.rows[1].cells.length, "Row: Two columns are invisible, but it is visible in design-time, #2").toBe(1 + 3);
    expect(table.headerRow.cells[3].headers, "The last column is col3, #2").toBe("col3");
  });
  test("question.resetValueIf, basic functionality", () => {
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
    expect(col2.resetValueIf, "Load from JSON, column").toBe("{row.q1} = 1");
    expect(q2.resetValueIf, "Load from JSON, question").toBe("{row.q1} = 1");
    q2.value = "abc";
    q1.value = 2;
    expect(q2.value, "value is set").toBe("abc");
    q1.value = 1;
    expect(q2.isEmpty(), "value is cleared").toBe(true);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 3;
    expect(q2.value, "value is set, #3").toBe("edf");
  });
  test("question.resetValueIf & quesiton.defaultValueExpression", () => {
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
    expect(q2.value, "value is set directly").toBe("abc");
    q1.value = 1;
    expect(q2.value, "value is set from defaultValueExpression").toBe(3);
    q2.value = "edf";
    expect(q2.value, "value is set directly, #2").toBe("edf");
    q3.value = 4;
    expect(q2.value, "value is set directly, #3").toBe("edf");
  });
  test("question.resetValueIf based on root and row questions", () => {
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
    expect(q2.value, "q2.value #1").toBe("abc");
    q1.value = 1;
    expect(q2.value, "q2.value #2").toBe("abc");
    q4.value = 4;
    expect(q2.isEmpty(), "q2.value #3").toBe(true);
    q2.value = "abc";
    q1.value = 2;
    expect(q2.value, "q2.value #4").toBe("abc");
    q1.value = 1;
    expect(q2.isEmpty(), "q2.value #5").toBe(true);
  });
  test("question.resetValueIf, cycle calls", () => {
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
    expect(q1.value, "q1.value #1").toEqualValues(["dog"]);
    expect(q2.value, "q2.value #1").toEqualValues(["cat"]);
    expect(q3.isEmpty(), "q3.value #1").toBe(true);
    q3.value = ["none"];
    expect(q1.isEmpty(), "q1.value #2").toBe(true);
    expect(q2.isEmpty(), "q2.value #2").toBe(true);
    expect(q3.value, "q3.value #2").toEqualValues(["none"]);
    q1.value = ["dog"];
    expect(q1.value, "q1.value #3").toEqualValues(["dog"]);
    expect(q3.isEmpty(), "q2.value #3").toBe(true);
    expect(q3.isEmpty(), "q3.value #3").toBe(true);
  });
  test("question.setValueIf, basic functionality", () => {
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
    expect(col2.setValueIf, "Load from JSON, column.setValueIf").toBe("{row.q1} = 1");
    expect(q2.setValueIf, "Load from JSON, question.setValueIf").toBe("{row.q1} = 1");
    expect(col2.setValueExpression, "Load from JSON, column.setValueExpression").toBe("{row.q1} + {row.q3}");
    expect(q2.setValueExpression, "Load from JSON, question.setValueExpression").toBe("{row.q1} + {row.q3}");
    q2.value = "abc";
    q1.value = 2;
    q3.value = 3;
    expect(q2.value, "value is set").toBe("abc");
    q1.value = 1;
    expect(q2.value, "value is set correctly").toBe(4);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 5;
    expect(q2.value, "value is set, #3").toBe(1 + 5);
    q2.value = "klm";
    expect(q2.value, "value is set, #4").toBe("klm");
    q1.value = 2;
    expect(q2.value, "value is set, #5").toBe("klm");
    q3.value = 5;
    expect(q2.value, "value is set, #6").toBe("klm");
  });
  test("cell.setValueExpression for matrix on the second page, Bug#9942", () => {
    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "matrixdynamic",
            name: "matrix1",
            valueName: "matrix",
            rowCount: 1,
            columns: [{ name: "q1", cellType: "text" }],
          }
        ]
      },
      {
        elements: [
          {
            type: "matrixdynamic",
            name: "matrix2",
            valueName: "matrix",
            columns: [
              { name: "q2", cellType: "text", setValueExpression: "{row.q1} + {row.q3}" },
              { name: "q3", cellType: "text" },
            ]
          },
        ]
      }
      ]
    });
    const matrix1 = survey.getQuestionByName("matrix1");
    const matrix2 = survey.getQuestionByName("matrix2");
    matrix1.visibleRows[0].cells[0].question.value = 10;
    matrix1.addRow();
    matrix1.visibleRows[1].cells[0].question.value = 20;
    survey.nextPage();
    const rows = matrix2.visibleRows;
    expect(rows.length, "rows count").toBe(2);
    expect(rows[0].getQuestionByName("q2").value, "q2 value, row 1").toBe(10);
    expect(rows[1].getQuestionByName("q2").value, "q2 value, row 2").toBe(20);
    rows[0].getQuestionByName("q3").value = 5;
    expect(rows[0].getQuestionByName("q2").value, "q2 value, row 1").toBe(15);
  });
  test("question.onHidingContent", () => {
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
    expect(counter2, "Close detail").toBe(1);
    row.showDetailPanel();
    row.detailPanel.getQuestionByName("q1").onHidingContent = (): void => { counter2++; };
    survey.doComplete();
    expect(counter1, "cell on complete").toBe(1);
    expect(counter2, "detail questions").toBe(2);
  });
  test("checkIfValueInRowDuplicated has only one duplicated error", () => {
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
    expect(q.errors.length, "One error only").toBe(1);
    expect(q.errors[0].getErrorType(), "Correct error is added").toBe("keyduplicationerror");
  });
  test("Cell question title and question.locTitle.renderedHtml & localization for matrixdropdown", () => {
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
    expect(cellQuestion.title, "Question title is column title").toBe("col1");
    expect(cellQuestion.locTitle.renderedHtml, "Question rendered title is prepared for accessibility").toBe("row item1, column col1");
    survey.locale = "de";
    expect(cellQuestion.title, "Question title is column title, #de").toBe("col1");
    expect(cellQuestion.locTitle.renderedHtml, "Question rendered title is prepared for accessibility, #de").toBe("zeile item1, spalte col1");
  });
  test("Cell question title and question.locTitle.renderedHtml & localizationfor matrixdynamic", () => {
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
    expect(cellQuestion.title, "Question title is column title").toBe("col1");
    expect(cellQuestion.locTitle.renderedHtml, "Question rendered title is prepared for accessibility").toBe("row 1, column col1");
    survey.locale = "de";
    expect(cellQuestion.title, "Question title is column title, #de").toBe("col1");
    expect(cellQuestion.locTitle.renderedHtml, "Question rendered title is prepared for accessibility, #de").toBe("zeile 1, spalte col1");
  });
  test("checkIfValueInRowDuplicated has only one duplicated error", () => {
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
    expect(matrix.columns.length, "There is one column, it is loaded correctly").toBe(1);
  });
  test("checkIfValueInRowDuplicated has only one duplicated error", () => {
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
    expect(panelQuestion.choicesMin, "choicesMin is here").toBe(1);
    expect(panelQuestion.choicesMax, "choicesMax is here").toBe(10);
    expect(panelQuestion.visibleChoices.length, "cell question visibleChoices").toBe(12);
  });
  test("checkIfValueInRowDuplicated has only one duplicated error", () => {
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
    expect(cellQuestion1.getType(), "type #1").toBe("tagbox");
    expect(cellQuestion2.getType(), "type #2").toBe("tagbox");
    expect(cellQuestion1.choices.length, "choices #1").toBe(3);
    expect(cellQuestion2.choices.length, "choices #2").toBe(4);
  });
  test("Do not resetTable for always invisible column", () => {
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
    expect(matrix.renderedTable["$ref"], "Do not recreate the rendered table").toBe("ref1");
  });
  test("survey.onMatrixDetailPanelVisibleChanged event", () => {
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
    expect(qDetail.title, "set title").toBe("Question 1");
    row.hideDetailPanel();
    expect(actions, "check actions").toEqualValues(["show:0", "hide:0"]);
  });
  test("column.visibleIf", () => {
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
    expect(column.isColumnVisible, "column is invisible #1").toBe(false);
    expect(column.hasVisibleCell, "column cells are invisible, #1").toBe(false);
    row0Cell1.value = 1;
    expect(column.isColumnVisible, "column is visible #1").toBe(true);
    expect(row0Cell2.isVisible, "row0Cell2.isVisible #1").toBe(true);
    expect(row1Cell2.isVisible, "row1Cell2.isVisible #1").toBe(false);
    expect(row2Cell2.isVisible, "row2Cell2.isVisible #1").toBe(false);
    row0Cell1.value = 2;
    expect(column.isColumnVisible, "column is invisible #2").toBe(false);
    row1Cell1.value = 1;
    expect(column.isColumnVisible, "column is visible #2").toBe(true);
    expect(row0Cell2.isVisible, "row0Cell2.isVisible #2").toBe(false);
    expect(row1Cell2.isVisible, "row1Cell2.isVisible #2").toBe(true);
    expect(row2Cell2.isVisible, "row2Cell2.isVisible #2").toBe(false);
    row2Cell1.value = 1;
    expect(row0Cell2.isVisible, "row0Cell2.isVisible #2").toBe(false);
    expect(row1Cell2.isVisible, "row1Cell2.isVisible #3").toBe(true);
    expect(row2Cell2.isVisible, "row2Cell2.isVisible #3").toBe(true);
    row0Cell1.value = 1;
    expect(row0Cell2.isVisible, "row0Cell2.isVisible #4").toBe(true);
    expect(row1Cell2.isVisible, "row1Cell2.isVisible #3").toBe(true);
    expect(row2Cell2.isVisible, "row2Cell2.isVisible #3").toBe(true);
  });
  test("defaultValueExpression & regeneration of rows", () => {
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
    expect(matrix.visibleRows[0].cells[0].question.value, "question value #1").toBe(5);
    question.value = 10;
    const id = matrix.visibleRows[0].id;
    expect(matrix.visibleRows[0].cells[0].question.value, "question value #2").toBe(10);
    matrix.addColumn("col2");
    expect(matrix.visibleRows[0].id, "It is a new row").not.toBe(id);
    question.value = 15;
    expect(matrix.visibleRows[0].cells[0].question.value, "question value #3").toBe(15);
  });
  test("defaultValueExpression & using rowvalue in it, #1", () => {
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
    expect(matrix.visibleRows[0].cells[0].question.value, "question value #1").toBe(5);
    question.value = 10;
    const id = matrix.visibleRows[0].id;
    expect(matrix.visibleRows[0].cells[0].question.value, "question value #2").toBe(10);
    matrix.addColumn("col2");
    expect(matrix.visibleRows[0].id, "It is a new row").not.toBe(id);
    question.value = 15;
    expect(matrix.visibleRows[0].cells[0].question.value, "question value #3").toBe(15);
  });
  test("defaultValueExpression & using rowvalue in it, #2", () => {
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
    expect(matrix.visibleRows[0].cells[0].question.value, "cell1 value #1").toBe(5);
    expect(matrix.visibleRows[1].cells[0].question.value, "cell1 value #1").toBe(10);
    matrix.visibleRows[0].cells[1].question.value = 12;
    q1.value = 15;
    q2.value = 20;
    expect(matrix.visibleRows[0].cells[0].question.value, "cell1 value #2").toBe(15);
    expect(matrix.visibleRows[1].cells[0].question.value, "cell1 value #2").toBe(20);
    q1.value = 0;
    expect(matrix.visibleRows.length, "visible rows count #1").toBe(1);
    const id = matrix.visibleRows[0].id;
    q1.value = 30;
    q2.value = 50;
    expect(matrix.visibleRows[0].id, "It is a new row").not.toBe(id);
    expect(matrix.visibleRows.length, "visible rows count #2").toBe(2);
    expect(matrix.visibleRows[0].cells[1].question.value, "Keep value in the standard cell").toBe(12);
    expect(matrix.visibleRows[0].cells[0].question.value, "cell1 value #3").toBe(30);
    expect(matrix.visibleRows[1].cells[0].question.value, "cell1 value #3").toBe(50);
  });
  test("rows enableIf property, #8461", () => {
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
    expect(rows[0].isRowEnabled(), "row1 enabled #1").toBe(false);
    expect(rows[1].isRowEnabled(), "row2 enabled #1").toBe(false);
    const row1Col1Cell = rows[0].getQuestionByName("col1");
    const row1Col2Cell = rows[0].getQuestionByName("col2");
    const row2Col1Cell = rows[1].getQuestionByName("col1");
    const row2Col2Cell = rows[1].getQuestionByName("col2");

    rows[0].showDetailPanel();
    rows[1].showDetailPanel();
    const panel1 = rows[0].detailPanel;
    const panel2 = rows[1].detailPanel;

    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #1").toBe(true);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #1").toBe(true);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #1").toBe(true);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #1").toBe(true);
    expect(panel1.isReadOnly, "panel1 #1").toBe(true);
    expect(panel2.isReadOnly, "panel2 #1").toBe(true);
    q1.value = 11;
    expect(rows[0].isRowEnabled(), "row1 enabled #2").toBe(true);
    expect(rows[1].isRowEnabled(), "row2 enabled #2").toBe(false);
    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #2").toBe(false);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #2").toBe(true);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #2").toBe(true);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #2").toBe(true);
    expect(panel1.isReadOnly, "panel1 #2").toBe(false);
    expect(panel2.isReadOnly, "panel2 #2").toBe(true);
    q2.value = 11;
    expect(rows[0].isRowEnabled(), "row1 enabled #3").toBe(true);
    expect(rows[1].isRowEnabled(), "row2 enabled #3").toBe(true);
    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #3").toBe(false);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #3").toBe(true);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #3").toBe(false);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #3").toBe(true);
    expect(panel1.isReadOnly, "panel1 #3").toBe(false);
    expect(panel2.isReadOnly, "panel2 #3").toBe(false);
    row1Col1Cell.value = 11;
    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #4").toBe(false);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #4").toBe(false);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #4").toBe(false);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #4").toBe(true);
    expect(panel1.isReadOnly, "panel1 #4").toBe(false);
    expect(panel2.isReadOnly, "panel2 #4").toBe(false);
    row2Col1Cell.value = 11;
    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #5").toBe(false);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #5").toBe(false);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #5").toBe(false);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #5").toBe(false);
    expect(panel1.isReadOnly, "panel1 #5").toBe(false);
    expect(panel2.isReadOnly, "panel2 #5").toBe(false);
    q1.value = 1;
    expect(rows[0].isRowEnabled(), "row1 enabled #6").toBe(false);
    expect(rows[1].isRowEnabled(), "row2 enabled #6").toBe(true);
    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #6").toBe(true);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #6").toBe(true);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #6").toBe(false);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #6").toBe(false);
    expect(panel1.isReadOnly, "panel1 #6").toBe(true);
    expect(panel2.isReadOnly, "panel2 #6").toBe(false);
    row2Col1Cell.value = 1;
    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #7").toBe(true);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #7").toBe(true);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #7").toBe(false);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #7").toBe(true);
    expect(panel1.isReadOnly, "panel1 #7").toBe(true);
    expect(panel2.isReadOnly, "panel2 #7").toBe(false);
    matrix.readOnly = true;
    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #8").toBe(true);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #8").toBe(true);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #8").toBe(true);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #8").toBe(true);
    expect(panel1.isReadOnly, "panel1 #8").toBe(true);
    expect(panel2.isReadOnly, "panel2 #8").toBe(true);
    matrix.readOnly = false;
    expect(row1Col1Cell.isReadOnly, "row1Col1Cell #9").toBe(true);
    expect(row1Col2Cell.isReadOnly, "row1Col2Cell #9").toBe(true);
    expect(row2Col1Cell.isReadOnly, "row2Col1Cell #9").toBe(false);
    expect(row2Col2Cell.isReadOnly, "row2Col2Cell #9").toBe(true);
    expect(panel1.isReadOnly, "panel1 #9").toBe(true);
    expect(panel2.isReadOnly, "panel2 #9").toBe(false);
  });
  test("rows enableIf property: disabled attr, #8850", () => {
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
    expect(rows[0].cells[0].question.isDisabledAttr).toBe(false);
    q1.value = 9;
    expect(rows[0].cells[0].question.isDisabledAttr).toBe(true);
  });
  test("showInMultipleColumns & random choices, Bug#8348", () => {
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
    expect(matrix.columns[0].templateQuestion.visibleChoices[0].value, "column tempate").toBe("col5");
    expect(rows[0].cells[1].question.visibleChoices[0].value, "row1 question").toBe("col5");
    expect(rows[1].cells[1].question.visibleChoices[0].value, "row2 question").toBe("col5");
    Helpers.randomizeArray = oldFunc;
  });
  test("Check if errors disappered in the cells in the current row on changing cell value, Bug#8539", () => {
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
    expect(q1.errors.length, "q1 errors #1").toBe(1);
    expect(q2.errors.length, "q2 errors #1").toBe(1);
    q2.value = 1;
    expect(q1.errors.length, "q1 errors #2").toBe(0);
    expect(q2.errors.length, "q2 errors #2").toBe(0);
  });
  test("choices property visibility, Bug#8560", () => {
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
    expect(prop.isVisible("", matrix), "#1").toBe(true);
    matrix.cellType = "text";
    expect(prop.isVisible("", matrix), "#2").toBe(false);
    matrix.cellType = "checkbox";
    expect(prop.isVisible("", matrix), "#3").toBe(true);
    matrix.cellType = "comment";
    expect(prop.isVisible("", matrix), "#4").toBe(false);
  });
  test("Column total properties visibility, Bug#8581", () => {
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
        expect(isPropVisible(name), name + " #" + num.toString()).toBe(val);
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
  test("Column choices from colum and from matrix properties, Bug#8691", () => {
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
    expect(cellQuestion.choices.length, "choices from matrix, #1").toBe(4);
    (<any>column).choices = [5, 6];
    expect(cellQuestion.choices.length, "choices from colum, #1").toBe(2);
    (<any>column).choices = [];
    expect(cellQuestion.choices.length, "choices from matrix, #2").toBe(4);
    (<any>column).choices = [5, 6, 7];
    expect(cellQuestion.choices.length, "choices from colum, #2").toBe(3);
  });
  test("showInMultipleColumns - add choice item", () => {
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
    expect(matrix.columns[0].templateQuestion.visibleChoices.length, "3 items").toBe(3);
    expect(matrix.columns[0].templateQuestion.visibleChoices[2].value, "column tempate").toBe("col3");
    expect(rows[0].cells.length, "3 cells").toBe(4);
    expect(rows[0].cells[1].question.visibleChoices[0].value, "row1 question 1").toBe("col1");
    expect(rows[0].cells[1].question.visibleChoices[2].value, "row1 question 3").toBe("col3");
    expect(rows[1].cells[1].question.visibleChoices[0].value, "row2 question 1").toBe("col1");
    expect(rows[1].cells[1].question.visibleChoices[2].value, "row2 question 3").toBe("col3");

    matrix.columns[0].choices.push(new ItemValue("col4"));
    rows = matrix.renderedTable.rows;
    expect(matrix.columns[0].templateQuestion.visibleChoices.length, "4 items - item should be added").toBe(4);
    expect(matrix.columns[0].templateQuestion.visibleChoices[3].value, "column tempate").toBe("col4");
    expect(rows[0].cells.length, "4 cells - item should be added").toBe(5);
    expect(rows[0].cells[1].question.visibleChoices[0].value, "row1 question 1").toBe("col1");
    expect(rows[0].cells[1].question.visibleChoices[3].value, "row1 question 3").toBe("col4");
    expect(rows[1].cells[1].question.visibleChoices[0].value, "row2 question 1").toBe("col1");
    expect(rows[1].cells[1].question.visibleChoices[3].value, "row2 question 3").toBe("col4");
  });
  test("The Undo operation doesn't work for matrix dropdown column 'choices' property, Bug#8791", () => {
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
      if (name === "choices") {
        counter ++;
        propName = name;
        senderName = sender.name;
        arrayChangesTest = arrayChanges;
      }
    };
    matrix.columns[0].choices.push(new ItemValue("col4"));
    expect(counter, "counter").toBe(1);
    expect(propName, "propName").toBe("choices");
    expect(senderName, "senderName").toBe("column1");
    expect(arrayChangesTest, "arrayChanges").toBeTruthy();
  });
  test("Support columnsVisibleIf property, Bug#8796", () => {
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
    expect(matrix.columns[0].isColumnVisible, "The default column.visible is true").toBe(true);
    expect(matrix.columns[1].isColumnVisible, "The second column.visible is false").toBe(false);
    expect(matrix.columns[2].isColumnVisible, "The third column.visible is true").toBe(true);
    let table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: One column is invisible, #1").toBe(1 + 2);
    expect(table.rows[1].cells.length, "Row: One column is invisible, #1").toBe(1 + 2);
    expect(table.headerRow.cells[2].headers, "The second column is col3, #1").toBe("col3");

    survey.setValue("q1", ["col1", "col2", "col3"]);
    expect(matrix.columns[1].isColumnVisible, "The second column.visible is true, #2").toBe(true);
    expect(table.uniqueId, "The table is re-rendered").not.toBe(matrix.renderedTable.uniqueId);
    table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: All columns are visible, #2").toBe(1 + 3);
    expect(table.rows[1].cells.length, "Row: All columns are visible, #2").toBe(1 + 3);
    expect(table.headerRow.cells[2].headers, "The second column is col2, #2").toBe("col2");

    survey.setValue("q1", ["col1", "col2"]);
    expect(matrix.columns[2].isColumnVisible, "The third column.visible is false, #3").toBe(false);
    table = matrix.renderedTable;
    expect(table.headerRow.cells.length, "Header: the last column is invisible, #3").toBe(1 + 2);
    expect(table.rows[1].cells.length, "Row: the last column is invisible, #3").toBe(1 + 2);
    expect(table.headerRow.cells[2].headers, "The last column is col2, #3").toBe("col2");
  });
  test("rowVisibleIf & rowIndex, Bug#8796", () => {
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
    expect(matrix.visibleRows.length, "The first row is visible only").toBe(1);
    matrix.addRow();
    matrix.addRow();
    expect(matrix.visibleRows.length, "The first row is visible only, #2").toBe(1);
    expect(matrix.value, "matrix.data").toEqualValues([{ no: 1, column2: 1 }, { no: 2, column2: 2 }, { no: 3, column2: 3 }, { no: 4, column2: 4 }]);
  });
  test("isQuestion answered & design time", () => {
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
    expect(matrix.renderedTable, "create rendered table").toBeTruthy();
    expect(matrix.isAnswered, "Matrix is not answered").toBe(false);
    const rows = matrix.visibleRows;
    expect(rows[0].cells[0].question.isAnswered, "[0, 0]").toBe(false);
    expect(rows[0].cells[1].question.isAnswered, "[0, 1]").toBe(false);
    expect(rows[1].cells[0].question.isAnswered, "[1, 0]").toBe(false);
    expect(rows[1].cells[1].question.isAnswered, "[1, 1]").toBe(false);
  });
  test("Serialize empty column title, #9007", () => {
    settings.serialization.matrixDropdownColumnSerializeTitle = true;

    const matrix = new QuestionMatrixDropdownModel("q1");
    matrix.addColumn("col1");
    matrix.addColumn("col2", "Column2");
    expect(matrix.toJSON(), "Serialize empty title").toEqualValues({
      name: "q1",
      columns: [{ name: "col1", title: "col1" }, { name: "col2", title: "Column2" }]
    });

    settings.serialization.matrixDropdownColumnSerializeTitle = false;
  });
  test("column.defaultDisplayValue", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          cellType: "text",
          type: "matrixdropdown",
          name: "q1",
          "columns": [{ name: "col1", defaultDisplayValue: { default: "col1-default", de: "col1-de" } }],
          rows: ["Row 1", "Row 2"]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
    const rows = matrix.visibleRows;
    const qCell1 = rows[0].cells[0].question;
    const qCell2 = rows[1].cells[0].question;
    expect(qCell1.displayValue, "displayValue, #1").toBe("col1-default");
    expect(qCell2.displayValue, "displayValue, #2").toBe("col1-default");
    qCell1.value = "col1-value";
    survey.locale = "de";
    expect(qCell1.displayValue, "displayValue, #3").toBe("col1-value");
    expect(qCell2.displayValue, "displayValue, #4").toBe("col1-de");
  });
  test("scroll on error", () => {
    const survey = new SurveyModel({
      elements: [
        {
          cellType: "text",
          type: "matrixdropdown",
          name: "q1",
          "columns": [{ name: "col1" }, { name: "col2", isRequired: true }],
          rows: ["Row 1", "Row 2"]
        }
      ]
    });
    let errorName = "";
    survey.onScrollToTop.add((sender, options) => {
      errorName = options.element.name;
    });
    expect(survey.tryComplete(), "can't complete").toBe(false);
    expect(errorName, "focus on question").toBe("col2");
  });
  test("survey.onAfterRenderMatrixCell event", () => {
    const survey = new SurveyModel({
      elements: [
        {
          cellType: "text",
          type: "matrixdropdown",
          name: "q1",
          "columns": [{ name: "col1" }],
          rows: ["Row 1", "Row 2"]
        }
      ]
    });
    let questionName: string = "";
    survey.onAfterRenderMatrixCell.add((survey: SurveyModel, options: any) => {
      questionName = options.question.name;
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
    const rows = matrix.visibleRows;
    const qCell1 = rows[0].cells[0].question;
    survey.matrixAfterCellRender({ cellQuestion: qCell1 });
    expect(questionName, "question name is correct").toBe("q1");
  });
  test("update cells questions patterns, Bug#9767", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [{ name: "col1", cellType: "text" }],
          rows: ["Row 1", "Row 2"]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
    const col1 = matrix.columns[0];
    const rows = matrix.visibleRows;
    const qCell1 = rows[0].cells[0].question;
    col1.maskType = "pattern";
    col1.maskSettings.pattern = "99999";
    expect(qCell1.maskType, "cell Question maskType is pattern").toBe("pattern");
    expect(qCell1.maskSettings.pattern, "cell Question maskSettings.pattern is 99999").toBe("99999");
  });
  test("detail panel & nested question wasRendered", () => {
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
    const question = row.getQuestionByName("q1");
    expect(row.detailPanel.wasRendered, "panel was rendered").toBe(true);
    expect(question.wasRendered, "panel question was rendered").toBe(true);
  });
  test("Value expressions not working for member with the same name as root name. Bug#9967", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "matrixdropdown",
          "name": "same_name",
          "cellType": "text",
          "columns": [{ "name": "value" }],
          "rows": ["same_name"]
        },
        {
          "type": "expression",
          "name": "exp",
          "expression": "{same_name.same_name.value}"
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("same_name");
    const row = matrix.visibleRows[0];
    row.getQuestionByName("value").value = "test";
    expect(survey.getQuestionByName("exp").value, "Expression works with the same name as root name").toBe("test");
  });
  test("survey.onValidateQuestion, Bug#10011", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          isRequired: true,
          columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text", isRequired: true }],
          rowCount: 3
        }
      ]
    });
    const questionNames: Array<string> = [];
    survey.onValidateQuestion.add(function(survey, options) {
      questionNames.push(options.question.name);
    });
    survey.tryComplete();
    expect(questionNames, "We should validate matrix and all its cells").toEqualValues(["col1", "col2", "col1", "col2", "col1", "col2", "matrix"]);
  });
  test("Incorrect encoding of number mask in the error of a marix cell, Bug#10034", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "text",
          "name": "q1",
          "defaultValueExpression": "30001.99",
          "maskType": "numeric"
        },
        {
          "type": "matrixdropdown",
          "name": "matrix",
          "columns": [
            {
              "name": "q2",
              "cellType": "text",
              "isRequired": true,
              "validators": [
                {
                  "type": "expression",
                  "text": "{q1}",
                  "expression": "{q2} > {q1}"
                }
              ],
              "maskType": "numeric"
            }
          ],
          "rows": [
            "row1"
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
    const row = matrix.visibleRows[0];
    const qCell1 = row.cells[0].question;
    qCell1.value = 1;
    matrix.validate(true);
    expect(qCell1.errors.length, "There is an error").toBe(1);
    expect(qCell1.errors[0].locText.calculatedText, "Error calculatedText is correct").toBe("30,001.99");
  });
  test("Update rowValue on changing cellType, Bug#10038", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "rowCount": 1,
          "defaultRowValue": { col1: 1, col2: 2 },
          "columns": [
            {
              "name": "col1"
            },
            {
              "name": "col2",
              "cellType": "text",
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
    matrix.columns[0].cellType = "file";
    expect(matrix.defaultRowValue, "defaultRowValue, #1").toEqualValues({ col2: 2 });
    matrix.columns[1].cellType = "file";
    expect(matrix.defaultRowValue, "defaultRowValue, #2").toBeUndefined();
  });
  test("matrixdropdown.getValueGetterContext()", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            { cellType: "dropdown", name: "col1", defaultValue: 1, choices: [{ value: 1, text: "item1" }] }
          ],
          rows: ["row1", "row2"]
        }]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "There are two rows: header and data row").toBe(2);
    const getter = new ValueGetter();
    const context = survey.getValueGetterContext();
    expect(getter.getValue("matrix.row2.col1", context), "#1").toBe(1);
    expect(getter.getDisplayValue("matrix.row2.col1", context), "text #1").toBe("item1");
  });
  test("Expression vs saveMaskedValue, Bug#10095, related to Bug#10056 ", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "rowCount": 2,
          "columns": [
            {
              "name": "col1",
              "cellType": "text",
              "maskType": "numeric",
              "maskSettings": {
                "saveMaskedValue": true,
                "decimalSeparator": ",",
                "thousandsSeparator": "."
              },
              "totalType": "sum",
            },
            {
              "name": "col2",
              "cellType": "text",
              "maskType": "numeric",
              "maskSettings": {
                "saveMaskedValue": true,
                "decimalSeparator": ",",
                "thousandsSeparator": "."
              },
              "totalType": "sum",
            },
            {
              "name": "col3",
              "cellType": "expression",
              "expression": "{row.col1} + {row.col2}",
              "totalType": "sum",
            },
          ],
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const row1 = matrix.visibleRows[0];
    const row2 = matrix.visibleRows[1];
    row1.cells[0].question.value = "1.000,4";
    row1.cells[1].question.value = "2.000,6";
    expect(row1.cells[2].question.value, "row1 col3 value").toBe(3001);
    row2.cells[0].question.value = "3.000,4";
    row2.cells[1].question.value = "4.000,6";
    expect(row2.cells[2].question.value, "row2 col3 value").toBe(7001);
    const totalRow = matrix.visibleTotalRow;
    expect(totalRow.cells[0].question.value, "col1 total value").toBe(4000.8);
    expect(totalRow.cells[1].question.value, "col2 total value").toBe(6001.2);
    expect(totalRow.cells[2].question.value, "col3 total value").toBe(10002);
    expect(survey.data, "matrix value").toEqualValues({ matrix: [
      { col1: "1.000,4", col2: "2.000,6", col3: 3001 },
      { col1: "3.000,4", col2: "4.000,6", col3: 7001 }],
    "matrix-total": {
      "col1": 4000.8,
      "col2": 6001.2,
      "col3": 10002
    } });
  });
  test("defaultValueExpression vs saveMaskedValue, Bug#10095, related to Bug#10056 ", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "rowCount": 2,
          "columns": [
            {
              "name": "col1",
              "cellType": "text",
              "maskType": "numeric",
              "maskSettings": {
                "saveMaskedValue": true,
                "decimalSeparator": ",",
                "thousandsSeparator": "."
              },
              "totalType": "sum",
            },
            {
              "name": "col2",
              "cellType": "text",
              "maskType": "numeric",
              "maskSettings": {
                "saveMaskedValue": true,
                "decimalSeparator": ",",
                "thousandsSeparator": "."
              },
              "totalType": "sum",
            },
            {
              "name": "col3",
              "cellType": "text",
              "defaultValueExpression": "{row.col1} + {row.col2}",
              "maskType": "numeric",
              "maskSettings": {
                "saveMaskedValue": true,
                "decimalSeparator": ",",
                "thousandsSeparator": "."
              },
              "totalType": "sum",
            },
          ],
        }
      ]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const row1 = matrix.visibleRows[0];
    const row2 = matrix.visibleRows[1];
    row1.cells[0].question.value = "1.000,4";
    row1.cells[1].question.value = "2.000,6";
    expect(row1.cells[2].question.value, "row1 col3 value").toBe("3.001");
    row2.cells[0].question.value = "3.000,4";
    row2.cells[1].question.value = "4.000,6";
    expect(row2.cells[2].question.value, "row2 col3 value").toBe("7.001");
    const totalRow = matrix.visibleTotalRow;
    expect(totalRow.cells[0].question.value, "col1 total value").toBe(4000.8);
    expect(totalRow.cells[1].question.value, "col2 total value").toBe(6001.2);
    expect(totalRow.cells[2].question.value, "col3 total value").toBe(10002);
    expect(survey.data, "matrix value").toEqualValues({ matrix: [
      { col1: "1.000,4", col2: "2.000,6", col3: "3.001" },
      { col1: "3.000,4", col2: "4.000,6", col3: "7.001" }],
    "matrix-total": {
      "col1": 4000.8,
      "col2": 6001.2,
      "col3": 10002
    } });
  });
  test("Process text for question with value, no value and non existing for question in detail matrix", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", defaultValue: "val" }, { type: "text", name: "q2" },
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1", cellType: "text" }],
          rows: ["row1"],
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "q4", title: "{q1}+{q2}+{q3}" }]
        }
      ]
    });
    const row = <MatrixDropdownRowModel>survey.getQuestionByName("matrix").visibleRows[0];
    row.showDetailPanel();
    const q4 = row.detailPanel.getQuestionByName("q4");
    expect(q4.locTitle.textOrHtml, "show value, show empty string, show as it is").toBe("val++{q3}");
  });
  test("question valueName vs two matrices & question triggers", () => {
    const survey = new SurveyModel({
      "elements": [
        { type: "matrixdropdown",
          name: "matrix1",
          valueName: "matrixA",
          rows: ["row1", "row2"],
          columns: [
            { name: "col1", cellType: "text", resetValueIf: "{row.col2} = 'a'" },
            { name: "col2", cellType: "radiogroup", choices: ["a", "b"] }
          ]
        },
        { type: "matrixdropdown",
          name: "matrix2",
          valueName: "matrixA",
          rows: ["row1", "row2"],
          columns: [
            { name: "col2", cellType: "radiogroup", choices: ["a", "b"] },
            { name: "col3", cellType: "text", resetValueIf: "{row.col2} = 'a'" },
            { name: "col4", cellType: "text" }
          ]
        },
        { type: "matrixdropdown",
          name: "matrix3",
          valueName: "matrixA",
          rows: ["row1", "row2"],
          columns: [
            { name: "col5", cellType: "text", resetValueIf: "{row.col2} = 'a'" }
          ]
        }
      ]
    });
    const matrix1 = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix1");
    const matrix2 = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix2");
    const matrix3 = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix3");
    const rows1 = matrix1.visibleRows;
    const rows2 = matrix2.visibleRows;
    const rows3 = matrix3.visibleRows;
    rows1[0].getQuestionByName("col1").value = "m1_r1_col1";
    rows1[1].getQuestionByName("col1").value = "m1_r2_col1";
    rows2[0].getQuestionByName("col3").value = "m2_r1_col2";
    rows2[1].getQuestionByName("col3").value = "m2_r2_col2";
    rows3[0].getQuestionByName("col5").value = "m3_r1_col5";
    rows3[1].getQuestionByName("col5").value = "m3_r2_col5";
    rows1[0].getQuestionByName("col2").value = "a";
    rows2[1].getQuestionByName("col2").value = "a";
    expect(rows1[0].getQuestionByName("col1").isEmpty(), "Check value for matrix1, row1, col1").toBe(true);
    expect(rows1[1].getQuestionByName("col1").isEmpty(), "Check value for matrix1, row2, col1").toBe(true);
    expect(rows2[0].getQuestionByName("col3").isEmpty(), "Check value for matrix2, row1, col3").toBe(true);
    expect(rows2[1].getQuestionByName("col3").isEmpty(), "Check value for matrix2, row2, col3").toBe(true);
    expect(rows3[0].getQuestionByName("col5").isEmpty(), "Check value for matrix3, row1, col5").toBe(true);
    expect(rows3[1].getQuestionByName("col5").isEmpty(), "Check value for matrix3, row2, col5").toBe(true);
  });
  test("Do not send data notification on creating detail panel, Bug#10253", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "columns": [
            {
              "name": "col1",
              "cellType": "text"
            }
          ],
          "detailElements": [
            {
              "type": "text",
              "name": "q1",
              "isRequired": true
            },
            {
              "type": "text",
              "name": "q2",
              "isRequired": true
            }
          ],
          "detailPanelMode": "underRowSingle"
        }
      ],
      "checkErrorsMode": "onValueChanged"
    });
    let counter = 0;
    survey.onValueChanged.add((sender, options) => { counter ++; });
    survey.data = {
      "matrix": [
        { "col1": "val1", "q1": "q1-val1", "q2": "q2-val1" },
        { "col1": "val2", "q1": "q1-val2", "q2": "q2-val2" }
      ]
    };
    const row = <MatrixDropdownRowModel>survey.getQuestionByName("matrix").visibleRows[0];
    row.showDetailPanel();
    expect(counter, "#1").toBe(0);
    survey.tryComplete();
    expect(survey.state, "survey.state").toBe("completed");
    expect(counter, "#2").toBe(0);
  });
  test("Close previous panels before showing the current panel, detailPanelMode is 'underRowSingle'", () => {
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
            }
          ],
          "detailElements": [
            {
              "type": "text",
              "name": "q1",
              "isRequired": true
            }
          ],
          "detailPanelMode": "underRowSingle"
        }
      ]
    });
    const logs = new Array<any>();
    survey.onMatrixDetailPanelVisibleChanged.add((survey, options) => {
      logs.push({ rowIndex: options.rowIndex, isVisible: options.visible });
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    rows[0].showDetailPanel();
    rows[1].showDetailPanel();
    rows[2].showDetailPanel();
    rows[0].showDetailPanel();
    rows[0].hideDetailPanel();
    expect(logs, "The detail panel visibility log is correct").toEqualValues([
      { rowIndex: 0, isVisible: true },
      { rowIndex: 0, isVisible: false },
      { rowIndex: 1, isVisible: true },
      { rowIndex: 1, isVisible: false },
      { rowIndex: 2, isVisible: true },
      { rowIndex: 2, isVisible: false },
      { rowIndex: 0, isVisible: true },
      { rowIndex: 0, isVisible: false }
    ]);
  });
  test("matrices getPanelInDesignMode", () => {
    const q1 = new QuestionMatrixDropdownModel("q1");
    expect(q1.getPanelInDesignMode(), "#1").toBeFalsy();
    q1.detailPanelMode = "underRow";
    expect(q1.getPanelInDesignMode(), "#2").toBeTruthy();
    expect(q1.getPanelInDesignMode(), "#3").toBe(q1.detailPanel);
    q1.detailPanelMode = "none";
    expect(q1.getPanelInDesignMode(), "#4").toBeFalsy();
    q1.detailPanelMode = "underRowSingle";
    expect(q1.getPanelInDesignMode(), "#5").toBeTruthy();
    expect(q1.getPanelInDesignMode(), "#6").toBe(q1.detailPanel);
  });
  test("survey.showInvisibleElements property, do not hide columns when true, Bug#10631", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "q1",
          "columns": [
            {
              "name": "col1"
            },
            {
              "name": "col2",
              "visibleIf": "{row.col1} = 1"
            },
            {
              "name": "col3",
              "visibleIf": "{row.col2} = 1"
            }
          ],
          "cellType": "text",
          "rows": [
            "row1",
            {
              "value": "row2",
              "visibleIf": "{q1.row1.col1} = 1"
            }
          ]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
    expect(matrix.visibleColumns.length, "There is one visible column, #1").toBe(1);
    expect(matrix.visibleRows.length, "There is one visible row, #1").toBe(1);
    survey.showInvisibleElements = true;
    expect(matrix.visibleColumns.length, "There are three visible columns").toBe(3);
    const rows = matrix.visibleRows;
    expect(rows[0].cells[1].question.isVisible, "row 1, cell 2 is visible").toBe(true);
    expect(rows[0].cells[2].question.isVisible, "row 1, cell 3 is visible").toBe(true);
    expect(rows.length, "There are two visible rows").toBe(2);
    survey.showInvisibleElements = false;
    expect(matrix.visibleColumns.length, "There is one visible column, #2").toBe(1);
    expect(matrix.visibleRows.length, "There is one visible row, #2").toBe(1);
  });
  test("Access column properties, #10532", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            { name: "col1", title: "Item 1: {$self.name}", score: 10 },
            { name: "col2", title: "Item 2: {$self.name}", score: 20 }
          ],
          rows: ["row1", "row2"]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const col1 = q1.columns[0];
    const col2 = q1.columns[1];
    expect(col1.locTitle.renderedHtml, "process {$self.name} for col1").toBe("Item 1: col1");
    expect(col2.locTitle.renderedHtml, "process {$self.name} for col2").toBe("Item 2: col2");
  });
  test("Clear value on hidden questions in cell, Bug#10603", () => {
    const survey = new SurveyModel({
      clearInvisibleValues: "onHiddenContainer",
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "q1",
          "columns": [
            {
              "name": "col1"
            },
            {
              "name": "col2",
              "visibleIf": "{row.col1} = 1"
            },
            {
              "name": "col3",
              "visibleIf": "{row.col2} = 2"
            }
          ],
          "cellType": "text",
          "rows": ["row1", "row2"]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
    const rows = matrix.visibleRows;
    expect(rows[0].cells[1].question.isVisible, "row 1, cell 2 is invisible, #1").toBe(false);
    rows[0].cells[0].question.value = 1;
    rows[0].cells[1].question.value = 2;
    rows[0].cells[2].question.value = 3;
    expect(rows[0].cells[1].question.isVisible, "row 1, cell 2 is visible, #2").toBe(true);
    expect(matrix.value, "matrix.value #2").toEqualValues({ row1: { col1: 1, col2: 2, col3: 3 } });
    rows[0].cells[0].question.value = 2;
    expect(rows[0].cells[1].question.isVisible, "row 1, cell 2 is invisible, #3").toBe(false);
    expect(rows[0].cells[2].question.isVisible, "row 1, cell 3 is invisible, #3").toBe(false);
    expect(rows[0].cells[1].question.isEmpty(), "cell 2 value is cleared, #3").toBe(true);
    expect(rows[0].cells[2].question.isEmpty(), "cell 3 value is cleared, #3").toBe(true);
    expect(matrix.value, "matrix.value #3").toEqualValues({ row1: { col1: 2 } });
  });
  test("Clear value on hidden questions in cell, Bug#10603", () => {
    const survey = new SurveyModel({
      clearInvisibleValues: "onHiddenContainer",
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "q1",
          "columns": [
            {
              "name": "col1"
            },
            {
              "name": "col2",
              "visibleIf": "{row.col1} = 1"
            },
            {
              "name": "col3",
              "visibleIf": "{row.col2} = 2"
            }
          ],
          "cellType": "text",
          "rows": ["row1", {
            "value": "row2",
            "visibleIf": "{q1.row1.col1} = 1"
          }]
        }
      ]
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
    matrix.value = { row1: { col1: 1, col2: 2, col3: 3 }, row2: { col1: 1, col2: 2, col3: 4 } };
    const rows = matrix.visibleRows;
    rows[0].cells[0].question.value = 2;
    expect(matrix.value, "matrix.value #2").toEqualValues({ row1: { col1: 2 } });
  });
  test("Detail elements serialization", () => {
    const survey = new SurveyModel({
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
    expect(matrix.toJSON().detailElements, "detailElements serialization").toEqualValues([{ type: "text", name: "q1" }]);
  });
  test("Create detailPanel on demand", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1" }],
          rows: [0]
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
    const obj = matrix as any;
    expect(obj.detailPanelValue, "detail panel is not created").toBeUndefined();
    matrix.toJSON();
    expect(obj.detailPanelValue, "detail panel is not created after toJSON").toBeUndefined();
    matrix.validate();
    expect(obj.detailPanelValue, "detail panel is not created after validation").toBeUndefined();
    expect(matrix.detailPanel.elements.length, "detail panel elements length is 0").toBe(0);
    expect(obj.detailPanelValue, "detail panel is not created after toJSON").not.toBeUndefined();
  });
  test("Create root choices on demand", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1" }],
          rows: [0]
        },
      ],
    });
    const matrix = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("matrix");
    expect(matrix.getPropertyValue("choices"), "choices are empty initially").toBeUndefined();
    matrix.toJSON();
    expect(matrix.getPropertyValue("choices"), "choices are empty after toJSON").toBeUndefined();
    matrix.choices = [1, 2, 3];
    expect(matrix.getPropertyValue("choices"), "choices are set").not.toBeUndefined();
  });
  test("ProcessValue.hasValue to access matrix rows & columns in design mode", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "a",
            },
            {
              name: "b",
            }
          ],
          rows: ["row1", "row2"]
        },
        { type: "text", name: "q2" }
      ]
    });
    survey.setDesignMode(true);
    const q2 = survey.getQuestionByName("q2");
    const q2Context = q2.getValueGetterContext();
    const processValue = new ProcessValue(q2Context);
    expect(processValue.hasValue("q1.row1.a"), "#1").toBe(true);
    expect(processValue.hasValue("q1.row1.c"), "#2").toBe(false);
    expect(processValue.hasValue("q1.row2.b"), "#3").toBe(true);
    expect(processValue.hasValue("q1.row3.b"), "#4").toBe(false);
  });

  test("generate column names", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown",
        name: "q1",
        columns: [{ title: "col1" }, { name: "question1", title: "col2" }, { title: "col3" }],
        rows: ["row1", "row2"]
      }],
    });
    const result = survey.toJSON();
    expect(result.pages[0].elements[0].columns[0].name, "name is generated for column 1").toBe("question2");
    expect(result.pages[0].elements[0].columns[1].name, "name is generated for column 2").toBe("question1");
    expect(result.pages[0].elements[0].columns[2].name, "name is generated for column 3").toBe("question3");
  });
  test("matrixdropdown: removing or adding a single row updates renderedTable incrementally, Bug#11212", () => {
    const matrix = new QuestionMatrixDropdownModel("q1");
    matrix.addColumn("col1");
    matrix.rows = ["row1", "row2", "row3"];

    expect(matrix.visibleRows.length, "There are 3 rows initially").toBe(3);

    const renderedTable: any = matrix.renderedTable;
    const originalCreateRenderedRow = renderedTable.createRenderedRow;
    let createRenderedRowCallCount = 0;
    renderedTable.createRenderedRow = function (cssClasses: any, isDetailRow: boolean = false) {
      createRenderedRowCallCount++;
      return originalCreateRenderedRow.call(this, cssClasses, isDetailRow);
    };

    // Data rows are at odd indices (each data row is preceded by an error row).
    const getRowText = (dataIdx: number): string => {
      const r = matrix.renderedTable.rows[dataIdx * 2 + 1];
      return r && r.cells[0] && r.cells[0].locTitle ? r.cells[0].locTitle.renderedHtml : "";
    };
    const getRenderedRowName = (dataIdx: number): string => matrix.renderedTable.rows[dataIdx * 2 + 1].row?.rowName;

    expect(getRowText(0), "initial: rendered data row 0 text is row1").toBe("row1");
    expect(getRowText(1), "initial: rendered data row 1 text is row2").toBe("row2");
    expect(getRowText(2), "initial: rendered data row 2 text is row3").toBe("row3");

    matrix.rows.splice(1, 1);

    expect(matrix.rows.length, "matrix dropdown row is removed").toBe(2);
    expect(matrix.visibleRows.length, "There are 2 visible rows after remove").toBe(2);
    expect(matrix.renderedTable, "rendered table is not recreated after removing a row").toBe(renderedTable);
    expect(matrix.renderedTable.uniqueId, "renderedTable.uniqueId is the same after removing a row").toBe(renderedTable.uniqueId);
    expect(matrix.renderedTable.rows.length, "There are 2 rendered rows (with errors) after remove").toBe(2 * 2);
    expect(createRenderedRowCallCount, "createRenderedRow is not called on removing a row").toBe(0);
    expect(getRowText(0), "after remove: rendered data row 0 text is row1").toBe("row1");
    expect(getRowText(1), "after remove: rendered data row 1 text is row3").toBe("row3");
    expect(getRenderedRowName(0), "after remove: rendered data row 0 maps to row1").toBe("row1");
    expect(getRenderedRowName(1), "after remove: rendered data row 1 maps to row3").toBe("row3");

    matrix.rows.push(new ItemValue("row4"));
    expect(matrix.rows.length, "matrix dropdown row is added").toBe(3);
    expect(matrix.visibleRows.length, "There are 3 visible rows after add").toBe(3);
    expect(matrix.renderedTable, "rendered table is not recreated after adding a row").toBe(renderedTable);
    expect(matrix.renderedTable.uniqueId, "renderedTable.uniqueId is the same after adding a row").toBe(renderedTable.uniqueId);
    expect(matrix.renderedTable.rows.length, "There are 3 rendered rows (with errors) after add").toBe(3 * 2);
    expect(createRenderedRowCallCount, "createRenderedRow is called only for the new data row").toBe(1);
    expect(getRowText(0), "after add: rendered data row 0 text is row1").toBe("row1");
    expect(getRowText(1), "after add: rendered data row 1 text is row3").toBe("row3");
    expect(getRowText(2), "after add: rendered data row 2 text is row4").toBe("row4");
    expect(getRenderedRowName(2), "after add: rendered data row 2 maps to row4").toBe("row4");

    matrix.rows.splice(1, 0, new ItemValue("row5"));
    expect(matrix.rows.length, "matrix dropdown row is inserted after first row").toBe(4);
    expect(matrix.rows[1].value, "inserted row is at index 1").toBe("row5");
    expect(matrix.visibleRows.length, "There are 4 visible rows after insert").toBe(4);
    expect(matrix.visibleRows[1].rowName, "second visible row is row5").toBe("row5");
    expect(matrix.renderedTable, "rendered table is not recreated after inserting a row").toBe(renderedTable);
    expect(matrix.renderedTable.uniqueId, "renderedTable.uniqueId is the same after inserting a row").toBe(renderedTable.uniqueId);
    expect(matrix.renderedTable.rows.length, "There are 4 rendered rows (with errors) after insert").toBe(4 * 2);
    expect(createRenderedRowCallCount, "createRenderedRow is called only for the new data row on insert").toBe(2);
    expect(getRowText(0), "after insert: rendered data row 0 text is row1").toBe("row1");
    expect(getRowText(1), "after insert: rendered data row 1 text is row5").toBe("row5");
    expect(getRowText(2), "after insert: rendered data row 2 text is row3").toBe("row3");
    expect(getRowText(3), "after insert: rendered data row 3 text is row4").toBe("row4");
    expect(getRenderedRowName(0), "after insert: data row 0 maps to row1").toBe("row1");
    expect(getRenderedRowName(1), "after insert: data row 1 maps to row5").toBe("row5");
    expect(getRenderedRowName(2), "after insert: data row 2 maps to row3").toBe("row3");
    expect(getRenderedRowName(3), "after insert: data row 3 maps to row4").toBe("row4");
  });
});
