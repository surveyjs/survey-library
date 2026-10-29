import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { DragDropMatrixRows } from "../src/dragdrop/matrix-rows";
import { ComputedUpdater } from "../src/base";

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

describe("the row drag from a matrix whose value is shorter than rowCount", () => {
  test("the row moves to the other matrix and is not duplicated", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "m1", rowCount: 3, allowRowReorder: true, columns: [{ name: "a", cellType: "text" }] },
        { type: "matrixdynamic", name: "m2", rowCount: 1, allowRowReorder: true, columns: [{ name: "a", cellType: "text" }] }
      ]
    });
    const from = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
    const to = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    from.value = [{ a: 1 }];
    to.value = [{ a: 9 }];
    const row = from.visibleRows[0];
    const dd: any = new DragDropMatrixRows(survey, null, true);
    dd.parentElement = from;
    dd.draggedElement = row;
    dd.fromIndex = 0;
    dd.toIndex = 1;
    dd.toMatrix = to;
    dd.doDrop();
    expect(from.value, "#1: the source keeps its padded rows").toEqual([{}, {}]);
    expect(from.rowCount, "#2").toBe(2);
    expect(to.value, "#3").toEqual([{ a: 9 }, { a: 1 }]);
  });
});

describe("a row drag whose matrix is disposed during the drag", () => {
  test.each(["matrix", "survey"])("clear() does not throw and builds no table after the %s is disposed", (disposed: string) => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q", allowRowReorder: true, rowCount: 2, columns: ["a"] }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    const dd = matrix.dragDropMatrixRows;
    matrix.renderedTable;
    dd.dragInit(<any>undefined, matrix.visibleRows[1], matrix);
    const createTable = vi.spyOn(<any>matrix, "createRenderedTable");
    (disposed === "matrix" ? matrix : survey).dispose();
    expect(() => dd.clear(), "#1").not.toThrow();
    expect(createTable, "#2: no table is built for the disposed matrix").not.toHaveBeenCalled();
    expect(dd.draggedElement === null, "#3").toBe(true);
  });
});
describe("the dynamic matrix's row reorder from the keyboard", () => {
  const createSurvey = (matrixJson: any = {}): SurveyModel => new SurveyModel({
    elements: [Object.assign({ type: "matrixdynamic", name: "q", allowRowReorder: true, columns: [{ name: "a", cellType: "text" }] }, matrixJson)]
  });
  const key = (name: string): any => ({ key: name, preventDefault: vi.fn() });
  const getDragAction = (matrix: QuestionMatrixDynamicModel, index: number): any =>
    matrix.renderedTable.getRowAction(matrix.visibleRows[index], "drag-drop");
  const logEvents = (survey: SurveyModel, matrix: QuestionMatrixDynamicModel): Array<string> => {
    const log: Array<string> = [];
    const dd = matrix.dragDropMatrixRows;
    dd.onDragStart.add(() => log.push("start"));
    survey.onMatrixRowDragOver.add((_, options) => log.push("over:" + options.row.getValue("a")));
    dd.onDragEnd.add(() => log.push("end"));
    dd.onDragClear.add(() => log.push("clear"));
    survey.onValueChanged.add((_, options) => log.push("value:" + options.name));
    return log;
  };

  test("ArrowUp and ArrowDown on the handle move the record one step, with the events and the value change of a drop", () => {
    const survey = createSurvey();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }, { a: 3 }];
    const log = logEvents(survey, matrix);
    const table = matrix.renderedTable;
    const up = key("ArrowUp");
    matrix.onDragHandleKeyDown(up, matrix.visibleRows[1]);
    expect(matrix.value, "#1").toEqual([{ a: 2 }, { a: 1 }, { a: 3 }]);
    expect(matrix.renderedTable === table, "#1.1: the table is kept, its handles stay rendered for the focus").toBe(true);
    const cellValues = table.rows.filter(r => !!r.row && !r.isErrorsRow && !r.isDetailRow).map(r => r.cells.filter(c => !!c.question)[0].question.value);
    expect(cellValues, "#1.2: the rendered rows show the moved records").toEqual([2, 1, 3]);
    expect(log, "#2: a drag's events around one value change").toEqual(["start", "over:1", "value:q", "end", "clear"]);
    expect(up.preventDefault, "#3").toHaveBeenCalledTimes(1);
    log.length = 0;
    const down = key("ArrowDown");
    matrix.onDragHandleKeyDown(down, matrix.visibleRows[1]);
    expect(matrix.value, "#4").toEqual([{ a: 2 }, { a: 3 }, { a: 1 }]);
    expect(log, "#5: the row passed is the one below").toEqual(["start", "over:3", "value:q", "end", "clear"]);
    expect(down.preventDefault, "#6").toHaveBeenCalledTimes(1);
  });
  test("An arrow past the first or the last row, or another key, moves nothing and is not handled", () => {
    const survey = createSurvey();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }];
    const log = logEvents(survey, matrix);
    const events = [key("ArrowUp"), key("ArrowDown"), key("ArrowLeft")];
    matrix.onDragHandleKeyDown(events[0], matrix.visibleRows[0]);
    matrix.onDragHandleKeyDown(events[1], matrix.visibleRows[1]);
    matrix.onDragHandleKeyDown(events[2], matrix.visibleRows[1]);
    expect(matrix.value, "#1").toEqual([{ a: 1 }, { a: 2 }]);
    expect(log, "#2").toEqual([]);
    events.forEach((event, i) => expect(event.preventDefault, "#3." + i).not.toHaveBeenCalled());
  });
  test("A keyboard move does not cross the locked rows", () => {
    const survey = createSurvey();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.lockedRowCount = 1;
    matrix.value = [{ a: 1 }, { a: 2 }, { a: 3 }];
    expect(!!getDragAction(matrix, 0), "#1: a locked row has no handle").toBe(false);
    const up = key("ArrowUp");
    matrix.onDragHandleKeyDown(up, matrix.visibleRows[1]);
    expect(matrix.value, "#2: the row after the locked one stays").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
    expect(up.preventDefault, "#3").not.toHaveBeenCalled();
    matrix.onDragHandleKeyDown(key("ArrowDown"), matrix.visibleRows[0]);
    expect(matrix.value, "#4: the locked row stays").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
    matrix.onDragHandleKeyDown(key("ArrowUp"), matrix.visibleRows[2]);
    expect(matrix.value, "#5: below the lock a row moves").toEqual([{ a: 1 }, { a: 3 }, { a: 2 }]);
  });
  test("Under paging a keyboard move stays on the page", () => {
    const survey = createSurvey({ pageSize: 2 });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
    matrix.onDragHandleKeyDown(key("ArrowDown"), matrix.visibleRows[1]);
    expect(matrix.value, "#1: the last row of the page does not go to the next page").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    matrix.pageIndex = 1;
    expect(matrix.visibleRows.map(r => r.getValue("a")), "#2").toEqual([3, 4]);
    matrix.onDragHandleKeyDown(key("ArrowUp"), matrix.visibleRows[0]);
    expect(matrix.value, "#3: the first row of the page does not go to the previous page").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    matrix.onDragHandleKeyDown(key("ArrowUp"), matrix.visibleRows[1]);
    expect(matrix.value, "#4").toEqual([{ a: 1 }, { a: 2 }, { a: 4 }, { a: 3 }]);
  });
  test("onMatrixRowDragOver with allow = false refuses a keyboard move", () => {
    const survey = createSurvey();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }];
    const log = logEvents(survey, matrix);
    survey.onMatrixRowDragOver.add((_, options) => { options.allow = false; });
    const table = matrix.renderedTable;
    const up = key("ArrowUp");
    matrix.onDragHandleKeyDown(up, matrix.visibleRows[1]);
    expect(matrix.value, "#1").toEqual([{ a: 1 }, { a: 2 }]);
    expect(log, "#2: as a cancelled drag").toEqual(["start", "over:1", "clear"]);
    expect(up.preventDefault, "#3").not.toHaveBeenCalled();
    expect(matrix.renderedTable === table, "#4: the table is kept, so the focus stays on the handle").toBe(true);
  });
  test("The keyboard moves nothing in a read-only matrix, in design mode or under a record sort", () => {
    const check = (prepare: (survey: SurveyModel, matrix: QuestionMatrixDynamicModel) => void, message: string): void => {
      const survey = createSurvey();
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
      matrix.value = [{ a: 1 }, { a: 2 }];
      prepare(survey, matrix);
      const up = key("ArrowUp");
      matrix.onDragHandleKeyDown(up, matrix.visibleRows[1]);
      expect(matrix.value.map((v: any) => v.a), message).toEqual([1, 2]);
      expect(up.preventDefault, message).not.toHaveBeenCalled();
    };
    check((_, matrix) => { matrix.readOnly = true; }, "read-only");
    check((survey) => { survey.setDesignMode(true); }, "design mode");
    check((_, matrix) => { matrix.sort("a", "asc"); }, "a record sort");
  });
  test("The handle's ariaLabel is \"Move row N\" by the row's position, after a move, an add and a removal", () => {
    const survey = createSurvey();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }, { a: 3 }];
    const labels = (): Array<string> => matrix.visibleRows.map((_, i) => getDragAction(matrix, i).ariaLabel);
    expect(labels(), "#1").toEqual(["Move row 1", "Move row 2", "Move row 3"]);
    matrix.onDragHandleKeyDown(key("ArrowUp"), matrix.visibleRows[2]);
    expect(labels(), "#2: after a move").toEqual(["Move row 1", "Move row 2", "Move row 3"]);
    matrix.addRowByIndex({ a: 0 }, 0);
    expect(labels(), "#3: after an add").toEqual(["Move row 1", "Move row 2", "Move row 3", "Move row 4"]);
    const lastAction = getDragAction(matrix, 3);
    const table = matrix.renderedTable;
    matrix.removeRow(0);
    expect(matrix.renderedTable === table, "#4: a removal keeps the table").toBe(true);
    expect(labels(), "#5: after a removal").toEqual(["Move row 1", "Move row 2", "Move row 3"]);
    expect(lastAction.ariaLabel, "#6: an existing handle is renumbered").toBe("Move row 3");
  });
  test("A host label set in onGetMatrixRowActions follows the row's position", () => {
    const survey = createSurvey();
    survey.onGetMatrixRowActions.add((_, options) => {
      const action = options.actions.filter(a => a.id === "drag-drop")[0];
      if (!action) return;
      action.ariaLabel = <any>new ComputedUpdater(() => "Move sort level " + action.data.getRowNumber());
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }];
    const labels = (): Array<string> => matrix.visibleRows.map((_, i) => getDragAction(matrix, i).ariaLabel);
    expect(labels(), "#1").toEqual(["Move sort level 1", "Move sort level 2"]);
    matrix.addRowByIndex({ a: 0 }, 0);
    expect(labels(), "#2").toEqual(["Move sort level 1", "Move sort level 2", "Move sort level 3"]);
    matrix.removeRow(1);
    expect(labels(), "#3").toEqual(["Move sort level 1", "Move sort level 2"]);
  });
  test("Under paging the handle's number is the row's number in the whole view", () => {
    const survey = createSurvey({ pageSize: 2 });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }, { a: 3 }];
    matrix.pageIndex = 1;
    expect(getDragAction(matrix, 0).ariaLabel).toBe("Move row 3");
  });
});

describe("Escape during a row drag", () => {
  const startDrag = (): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel, popup: HTMLElement, cleanup: () => void } => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q", allowRowReorder: true, columns: [{ name: "a", cellType: "text" }] }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }];
    const popup = document.createElement("div");
    popup.className = "sv-popup sv-popup--modal-popup";
    const rowNode = document.createElement("div");
    rowNode.setAttribute("data-sv-drop-target-matrix-row", matrix.visibleRows[1].id);
    const handle = document.createElement("div");
    rowNode.appendChild(handle);
    popup.appendChild(rowNode);
    document.body.appendChild(popup);
    const doc: any = document;
    const hadElementFromPoint = typeof doc.elementFromPoint === "function";
    const elementFromPoint = doc.elementFromPoint;
    doc.elementFromPoint = () => handle;
    matrix.dragDropMatrixRows.startDrag(<any>{ clientX: 0, clientY: 0, pageX: 0, pageY: 0, target: handle }, matrix.visibleRows[1], matrix, handle);
    const cleanup = () => {
      if (hadElementFromPoint) doc.elementFromPoint = elementFromPoint; else delete doc.elementFromPoint;
      popup.remove();
    };
    return { survey, matrix, popup, cleanup };
  };
  test("Escape cancels the drag only: no bubble listener hears it and the order is kept", () => {
    const { matrix, popup, cleanup } = startDrag();
    try {
      const popupListener = vi.fn();
      const documentListener = vi.fn();
      popup.addEventListener("keydown", popupListener);
      document.addEventListener("keydown", documentListener);
      expect(matrix.dragDropMatrixRows.draggedElement === matrix.visibleRows[1], "#1: the drag is active").toBe(true);
      popup.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", keyCode: 27, bubbles: true } as any));
      expect(popupListener, "#2: the modal's handler does not see it").not.toHaveBeenCalled();
      expect(documentListener, "#3").not.toHaveBeenCalled();
      expect(matrix.dragDropMatrixRows.draggedElement === null, "#4: the drag is cleared").toBe(true);
      expect(matrix.value, "#5").toEqual([{ a: 1 }, { a: 2 }]);
      popup.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", keyCode: 27, bubbles: true } as any));
      expect(popupListener, "#6: without a drag Escape goes on").toHaveBeenCalledTimes(1);
      expect(documentListener, "#7").toHaveBeenCalledTimes(1);
      document.removeEventListener("keydown", documentListener);
    } finally {
      cleanup();
    }
  });
  test("Another key during a drag goes on", () => {
    const { matrix, popup, cleanup } = startDrag();
    try {
      const popupListener = vi.fn();
      popup.addEventListener("keydown", popupListener);
      popup.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true }));
      expect(popupListener, "#1").toHaveBeenCalledTimes(1);
      expect(matrix.dragDropMatrixRows.draggedElement === matrix.visibleRows[1], "#2: the drag goes on").toBe(true);
      popup.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", keyCode: 27, bubbles: true } as any));
    } finally {
      cleanup();
    }
  });
});

describe("A row drag in a modal", () => {
  test("The copy that follows the pointer is placed on the modal, outside the survey in the modal's scrolling content", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q", allowRowReorder: true, columns: [{ name: "a", cellType: "text" }] }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ a: 1 }, { a: 2 }];
    const popup = document.createElement("div");
    popup.className = "sv-popup sv-popup--modal-popup";
    const scrollingContent = document.createElement("div");
    scrollingContent.className = "sv-popup__scrolling-content";
    const root = document.createElement("div");
    const rowNode = document.createElement("div");
    rowNode.setAttribute("data-sv-drop-target-matrix-row", matrix.visibleRows[1].id);
    const handle = document.createElement("div");
    rowNode.appendChild(handle);
    root.appendChild(rowNode);
    scrollingContent.appendChild(root);
    popup.appendChild(scrollingContent);
    document.body.appendChild(popup);
    survey.rootElement = root;
    const rect = (x: number, y: number) => () => <DOMRect>{ x: x, y: y, left: x, top: y, right: x + 500, bottom: y + 300, width: 500, height: 300, toJSON() { return this; } };
    popup.getBoundingClientRect = rect(0, 0);
    root.getBoundingClientRect = rect(200, 100);
    rowNode.getBoundingClientRect = rect(250, 130);
    const docElement = document.documentElement;
    Object.defineProperty(docElement, "clientWidth", { configurable: true, value: 1000 });
    Object.defineProperty(docElement, "clientHeight", { configurable: true, value: 800 });
    const doc: any = document;
    const hadElementFromPoint = typeof doc.elementFromPoint === "function";
    const elementFromPoint = doc.elementFromPoint;
    doc.elementFromPoint = () => handle;
    try {
      matrix.dragDropMatrixRows.startDrag(<any>{ clientX: 300, clientY: 150, pageX: 300, pageY: 150, target: handle }, matrix.visibleRows[1], matrix, handle);
      const shortcut = <HTMLElement>popup.querySelector(".sv-matrixdynamic-dragged-row");
      expect(!!shortcut, "#1: the copy is on the modal").toBe(true);
      expect(shortcut.parentElement === popup, "#2: directly, not in the scrolling content").toBe(true);
      expect(root.querySelector(".sv-matrixdynamic-dragged-row"), "#3: not in the survey").toBeNull();
      expect(shortcut.style.left, "#4: placed against the modal, where the row is").toBe("250px");
      expect(shortcut.style.top, "#5").toBe("130px");
      popup.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", keyCode: 27, bubbles: true } as any));
      expect(popup.querySelector(".sv-matrixdynamic-dragged-row"), "#6: the drag's end removes it").toBeNull();
    } finally {
      if (hadElementFromPoint) doc.elementFromPoint = elementFromPoint; else delete doc.elementFromPoint;
      delete (<any>docElement).clientWidth;
      delete (<any>docElement).clientHeight;
      survey.rootElement = undefined;
      popup.remove();
    }
  });
});
