import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { DragDropMatrixRows } from "../src/dragdrop/matrix-rows";

import { describe, test, expect, vi } from "vitest";
describe("Drag and Drop Matrix Row Tests", () => {
  test("Clear the isGhostRow marker", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic",
        name: "test",
        rowCount: 2,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],

      }]
    });
    survey.setDesignMode(true);
    const matrixQuestion = survey.getAllQuestions()[0] as QuestionMatrixDynamicModel;
    const renderedTable = matrixQuestion.renderedTable;
    const dd = matrixQuestion.dragDropMatrixRows;

    expect(renderedTable.rows[1].isGhostRow, "Row 0 isGhostRow marker is clear initially").toBe(false);
    dd.dragInit(<any>{}, renderedTable.rows[1].row, matrixQuestion);
    expect(renderedTable.rows[1].isGhostRow, "Row 0 marked as being dragged").toBe(true);
    dd.clear();
    expect(renderedTable.rows[1].isGhostRow, "Row 0 isGhostRow marker is reset").toBe(false);
  });

  test("matrix.lockedRowCount", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic",
        name: "test",
        rowCount: 2,
        allowRowReorder: true,
        columns: [
          { cellType: "text", name: "value" },
          { cellType: "text", name: "text" },
        ],

      }]
    });
    const matrixQuestion = survey.getAllQuestions()[0] as QuestionMatrixDynamicModel;
    matrixQuestion.lockedRowCount = 1;
    const rows = matrixQuestion.visibleRows;
    const dd = matrixQuestion.dragDropMatrixRows;
    dd.dragInit(<any>undefined, <any>undefined, matrixQuestion);
    expect(dd.canInsertIntoThisRow(<any>rows[0]), "row0").toBe(false);
    expect(dd.canInsertIntoThisRow(<any>rows[1]), "row1").toBe(true);
  });

  test("doDragOver", () => {
    vi.useFakeTimers();
    try {

      const json = {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "question0",
                "columns": [
                  {
                    "name": "Column 1"
                  },
                  {
                    "name": "Column 2"
                  },
                  {
                    "name": "Column 3"
                  }
                ],
                "choices": [
                  1,
                  2,
                  3,
                  4,
                  5
                ],
                "allowRowReorder": true
              },
              {
                "type": "matrixdynamic",
                "name": "question1",
                "columns": [
                  {
                    "name": "Column 1"
                  },
                  {
                    "name": "Column 2"
                  },
                  {
                    "name": "Column 3"
                  }
                ],
                "detailElements": [
                  {
                    "type": "matrixdynamic",
                    "name": "question2",
                    "columns": [
                      {
                        "name": "Column 1"
                      },
                      {
                        "name": "Column 2"
                      },
                      {
                        "name": "Column 3"
                      }
                    ],
                    "choices": [
                      1,
                      2,
                      3,
                      4,
                      5
                    ],
                    "allowRowReorder": true
                  }
                ],
                "detailPanelMode": "underRow",
                "choices": [
                  1,
                  2,
                  3,
                  4,
                  5
                ],
                "allowRowReorder": true
              }
            ]
          }
        ],
        "headerView": "advanced"
      };
      const survey = new SurveyModel(json);
      const ddHelper = new DragDropMatrixRows(survey);
      survey.onMatrixRowDragOver.add(()=>{});
      expect(Object.keys(ddHelper["matrixRowMap"]).length, "initial state").toBe(0);

      const question0: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("question0")
  );
      const question1: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("question1")
  );
      // need to add show-detail action to every row
      let draggedRow = question0.visibleRows[0];

      const innerRow = question1.visibleRows[0];
      // innerRow.showDetailPanel();
      //let dropRow = innerRow["detailPanelValue"].questions[0].visibleRows[0];
      let dropRow = innerRow;

      ddHelper["parentElement"] = question1;
      ddHelper.draggedElement = draggedRow;
      ddHelper.dropTarget = dropRow;
      ddHelper["doDragOver"]();

      vi.advanceTimersByTime(2000);
      expect(Object.keys(ddHelper["matrixRowMap"]).length, "matrices prepared for drag").toBe(4);
    } finally {
      vi.useRealTimers();
    }
  });
});
