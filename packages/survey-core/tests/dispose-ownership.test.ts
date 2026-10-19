import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { Base } from "../src/base";
import { ItemValue } from "../src/itemvalue";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { PanelModel } from "../src/panel";
import { Action } from "../src/actions/action";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { MatrixDropdownRowModelBase } from "../src/question_matrixdropdownbase";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

function createSurvey(elements: Array<any>): SurveyModel {
  return new SurveyModel({ elements: elements });
}
function createMatrix(json: any): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } {
  const survey = createSurvey([Object.assign({ type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }, json)]);
  return { survey: survey, matrix: <QuestionMatrixDynamicModel>survey.getQuestionByName("m") };
}
function createPanelDynamic(json: any): { survey: SurveyModel, question: QuestionPanelDynamicModel } {
  const survey = createSurvey([Object.assign({ type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "a" }] }, json)]);
  return { survey: survey, question: <QuestionPanelDynamicModel>survey.getQuestionByName("pd") };
}
function cellOf(row: MatrixDropdownRowModelBase): Question {
  return row.cells[0].question;
}
function isRowDisposed(row: MatrixDropdownRowModelBase): boolean {
  return row.cells.length > 0 && row.cells.every(cell => cell.question.isDisposed);
}
// The handlers registerPropertyChangedHandlers keeps: onPropertyChanged.length does not see them.
function removeActionOf(question: QuestionPanelDynamicModel, panel: PanelModel): Action {
  return <Action>question.getRemovePanelAction(panel);
}
function propChangeHandlerCount(obj: Base): number {
  const list = obj["onPropChangeFunctions"];
  return Array.isArray(list) ? list.length : 0;
}

describe("matrix rows that leave are disposed", () => {
  test("removeRow disposes the removed row and keeps the others", () => {
    const { matrix } = createMatrix({ rowCount: 3 });
    const rows = matrix.visibleRows.slice();
    matrix.removeRow(1);
    expect(isRowDisposed(rows[1]), "#1: the removed row").toBe(true);
    expect(isRowDisposed(rows[0]) || isRowDisposed(rows[2]), "#2: the rows that stay").toBe(false);
    expect(matrix.visibleRows, "#3").toEqual([rows[0], rows[2]]);
  });
  test("the removed row is still alive in onMatrixRowRemoved", () => {
    const { survey, matrix } = createMatrix({ rowCount: 2 });
    const rows = matrix.visibleRows.slice();
    cellOf(rows[1]).value = "b";
    const log: Array<any> = [];
    survey.onMatrixRowRemoved.add((_, options) => { log.push([options.row === rows[1], cellOf(options.row).isDisposed, options.row.value.c]); });
    matrix.removeRow(1);
    expect(log, "#1").toEqual([[true, false, "b"]]);
    expect(isRowDisposed(rows[1]), "#2: disposed once the removal is over").toBe(true);
  });
  test("removeRowByIndex disposes the row object that leaves", () => {
    const { matrix } = createMatrix({ rowCount: 3 });
    const rows = matrix.visibleRows.slice();
    rows.forEach((row, i) => cellOf(row).value = "v" + i);
    matrix.removeRowByIndex(0);
    // The record moves to the end and the row count goes down: the last row object leaves.
    expect(matrix.value, "#1").toEqual([{ c: "v1" }, { c: "v2" }]);
    const left = rows.filter(row => matrix.visibleRows.indexOf(row) < 0);
    expect(left.length, "#2").toBe(1);
    expect(isRowDisposed(left[0]), "#3").toBe(true);
    expect(matrix.visibleRows.some(row => isRowDisposed(row)), "#4").toBe(false);
  });
  test("a lower rowCount disposes the rows it cuts off", () => {
    const { matrix } = createMatrix({ rowCount: 3 });
    const rows = matrix.visibleRows.slice();
    rows.forEach((row, i) => cellOf(row).value = "v" + i);
    matrix.rowCount = 1;
    expect(rows.map(row => isRowDisposed(row)), "#1").toEqual([false, true, true]);
    cellOf(rows[2]).value = "ghost";
    expect(matrix.value, "#2: a write to a dropped row changes nothing").toEqual([{ c: "v0" }]);
  });
  test("dropdown matrix: removing an item from rows disposes its row and keeps the other row objects", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: ["a", "b", "c"], columns: [{ name: "c", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const rows = matrix.visibleRows.slice();
    matrix.rows.splice(1, 1);
    expect(matrix.visibleRows, "#1: the incremental path keeps the rows").toEqual([rows[0], rows[2]]);
    expect(rows.map(row => isRowDisposed(row)), "#2").toEqual([false, true, false]);
  });
  test("an edited array: a removed row that is not put back is disposed, a moved one is reused", () => {
    const edited = new QuestionDropdownModel("q1");
    edited.choices = ["a", "b", "c"];
    const { survey, matrix } = createMatrix({ rowCount: 0, valueName: "choices", columns: [{ name: "value", cellType: "text" }] });
    survey.editingObj = edited;
    const rows = matrix.visibleRows.slice();
    // A move is a remove followed by an insert of the same object: the row goes back.
    const moved = edited.choices.splice(0, 1)[0];
    edited.choices.splice(1, 0, moved);
    expect(matrix.visibleRows[1], "#1: the row is reused").toBe(rows[0]);
    expect(isRowDisposed(rows[0]), "#2").toBe(false);
    edited.choices.splice(2, 1);
    expect(isRowDisposed(rows[2]), "#3: kept for a move until the next change").toBe(false);
    edited.choices.push(new ItemValue("d"));
    expect(isRowDisposed(rows[2]), "#4: a row that is not put back").toBe(true);
    expect(matrix.visibleRows.some(row => isRowDisposed(row)), "#5").toBe(false);
    edited.choices.splice(0, 1);
    survey.dispose();
    expect(isRowDisposed(rows[1]), "#6: the row kept for a move goes with the survey").toBe(true);
  });
  test("question.dispose and survey.dispose dispose the rows", () => {
    const first = createMatrix({ rowCount: 2 });
    const rows1 = first.matrix.visibleRows.slice();
    first.matrix.dispose();
    expect(rows1.map(row => isRowDisposed(row)), "#1: question.dispose").toEqual([true, true]);
    const second = createMatrix({ rowCount: 2 });
    const rows2 = second.matrix.visibleRows.slice();
    second.survey.dispose();
    expect(rows2.map(row => isRowDisposed(row)), "#2: survey.dispose").toEqual([true, true]);
  });
});

describe("matrix rows that leave wait for the rerender while a UI renders the matrix", () => {
  const removals: Array<{ name: string, remove: (matrix: QuestionMatrixDynamicModel) => void, index: number }> = [
    { name: "removeRow", remove: m => m.removeRow(1), index: 1 },
    { name: "a lower rowCount", remove: m => { m.rowCount = 1; }, index: 2 }
  ];
  removals.forEach(item => {
    test(item.name + ": disposed after the next rerender", () => {
      const { matrix } = createMatrix({ rowCount: 3 });
      const rows = matrix.visibleRows.slice();
      matrix.enableOnElementRerenderedEvent();
      item.remove(matrix);
      expect(isRowDisposed(rows[item.index]), "#1: not before the rerender").toBe(false);
      matrix.afterRerender();
      expect(isRowDisposed(rows[item.index]), "#2: after it").toBe(true);
    });
    test(item.name + ": released when the UI stops rendering the matrix", () => {
      const { matrix } = createMatrix({ rowCount: 3 });
      const rows = matrix.visibleRows.slice();
      matrix.enableOnElementRerenderedEvent();
      item.remove(matrix);
      matrix.disableOnElementRerenderedEvent();
      expect(isRowDisposed(rows[item.index])).toBe(true);
    });
    test(item.name + ": released by question.dispose before any rerender", () => {
      const { matrix } = createMatrix({ rowCount: 3 });
      const rows = matrix.visibleRows.slice();
      matrix.enableOnElementRerenderedEvent();
      item.remove(matrix);
      matrix.dispose();
      expect(isRowDisposed(rows[item.index])).toBe(true);
    });
  });
  test("dropdown matrix: a row removed from rows is disposed after the next rerender", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: ["a", "b"], columns: [{ name: "c", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const rows = matrix.visibleRows.slice();
    matrix.enableOnElementRerenderedEvent();
    matrix.rows.splice(1, 1);
    expect(isRowDisposed(rows[1]), "#1").toBe(false);
    matrix.afterRerender();
    expect(isRowDisposed(rows[1]), "#2").toBe(true);
  });
});

describe("a matrix row that leaves while its cell is writing", () => {
  const removals: Array<{ name: string, remove: (matrix: QuestionMatrixDynamicModel) => void }> = [
    { name: "removeRow", remove: m => m.removeRow(1) },
    { name: "a lower rowCount", remove: m => { m.rowCount = 1; } }
  ];
  [false, true].forEach(hasUI => {
    removals.forEach(item => {
      test(item.name + " from the cell's own write" + (hasUI ? ", with a UI" : "") + ": the setter finishes, the row goes after the write", () => {
        const { survey, matrix } = createMatrix({ rowCount: 2 });
        const rows = matrix.visibleRows.slice();
        const cell = cellOf(rows[1]);
        if (hasUI) matrix.enableOnElementRerenderedEvent();
        const log: Array<boolean> = [];
        // onValueChanged runs inside the write the cell makes through the matrix.
        survey.onValueChanged.add((_, options) => {
          if (options.name !== "m" || matrix.rowCount < 2 || options.value[1]?.c !== "remove") return;
          item.remove(matrix);
          log.push(cell.isDisposed);
        });
        expect(() => { cell.value = "remove"; }, "#1").not.toThrow();
        expect(log, "#2: alive inside the write").toEqual([false]);
        expect(matrix.visibleRows, "#3").toEqual([rows[0]]);
        expect(cell.isDisposed, "#4").toBe(!hasUI);
        if (hasUI) {
          matrix.afterRerender();
          expect(cell.isDisposed, "#5: after the rerender").toBe(true);
        }
      });
    });
  });
});

describe("the total row", () => {
  const createTotalMatrix = () => createMatrix({ rowCount: 2, columns: [{ name: "c", cellType: "text", totalType: "sum" }] });
  test("a total row the columns replace is disposed", () => {
    const { matrix } = createTotalMatrix();
    const total = matrix.visibleTotalRow;
    matrix.addColumn("c2");
    expect(isRowDisposed(total), "#1").toBe(true);
    expect(matrix.visibleTotalRow, "#2").not.toBe(total);
    expect(isRowDisposed(matrix.visibleTotalRow), "#3").toBe(false);
  });
  test("a total row dropped when no column has a total is disposed", () => {
    const { matrix } = createTotalMatrix();
    const total = matrix.visibleTotalRow;
    matrix.columns[0].totalType = "none";
    expect(matrix.visibleTotalRow, "#1").toBeNull();
    expect(isRowDisposed(total), "#2").toBe(true);
  });
  test("a replaced total row waits for the rerender while a UI renders the matrix", () => {
    const { matrix } = createTotalMatrix();
    const total = matrix.visibleTotalRow;
    matrix.enableOnElementRerenderedEvent();
    matrix.addColumn("c2");
    expect(isRowDisposed(total), "#1").toBe(false);
    matrix.afterRerender();
    expect(isRowDisposed(total), "#2").toBe(true);
  });
  test("question.dispose and survey.dispose dispose the total row", () => {
    const first = createTotalMatrix();
    const total1 = first.matrix.visibleTotalRow;
    first.matrix.dispose();
    expect(isRowDisposed(total1), "#1").toBe(true);
    const second = createTotalMatrix();
    const total2 = second.matrix.visibleTotalRow;
    second.survey.dispose();
    expect(isRowDisposed(total2), "#2").toBe(true);
  });
});

describe("detail panels", () => {
  const createDetailMatrix = (rowCount: number = 2) => createMatrix({ rowCount: rowCount, detailPanelMode: "underRow",
    detailElements: [{ type: "text", name: "d" }] });
  test("hideDetailPanel(true) disposes the panel it drops; hideDetailPanel() keeps it", () => {
    const { matrix } = createDetailMatrix();
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    const panel = row.detailPanel;
    row.hideDetailPanel();
    expect(panel.isDisposed, "#1: hidden, kept").toBe(false);
    row.showDetailPanel();
    expect(row.detailPanel, "#2").toBe(panel);
    row.hideDetailPanel(true);
    expect(panel.isDisposed, "#3: dropped").toBe(true);
    row.showDetailPanel();
    expect(row.detailPanel.isDisposed, "#4: a new one").toBe(false);
  });
  test("hideDetailPanel(true) while a UI renders the matrix: the panel is disposed after the next rerender", () => {
    const { matrix } = createDetailMatrix();
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    const panel = row.detailPanel;
    matrix.enableOnElementRerenderedEvent();
    row.hideDetailPanel(true);
    expect(panel.isDisposed, "#1").toBe(false);
    matrix.afterRerender();
    expect(panel.isDisposed, "#2").toBe(true);
    row.showDetailPanel();
    const second = row.detailPanel;
    row.hideDetailPanel(true);
    matrix.disableOnElementRerenderedEvent();
    expect(second.isDisposed, "#3: the UI stops rendering the matrix").toBe(true);
    matrix.enableOnElementRerenderedEvent();
    row.showDetailPanel();
    const third = row.detailPanel;
    row.hideDetailPanel(true);
    matrix.dispose();
    expect(third.isDisposed, "#4: question.dispose before any rerender").toBe(true);
  });
  test("a removed row disposes its detail panel, after the rerender while a UI renders the matrix", () => {
    const { matrix } = createDetailMatrix(3);
    const rows = matrix.visibleRows.slice();
    rows[0].showDetailPanel();
    rows[1].showDetailPanel();
    const panels = [rows[0].detailPanel, rows[1].detailPanel];
    matrix.removeRow(0);
    expect(panels[0].isDisposed, "#1: no UI").toBe(true);
    matrix.enableOnElementRerenderedEvent();
    matrix.removeRow(0);
    expect(panels[1].isDisposed, "#2: not before the rerender").toBe(false);
    matrix.afterRerender();
    expect(panels[1].isDisposed, "#3: after it").toBe(true);
  });
  test("the rows' detail panels go with question.dispose and survey.dispose", () => {
    const first = createDetailMatrix();
    const row1 = first.matrix.visibleRows[0];
    row1.showDetailPanel();
    const panel1 = row1.detailPanel;
    first.matrix.dispose();
    expect(panel1.isDisposed, "#1: question.dispose").toBe(true);
    const second = createDetailMatrix();
    const row2 = second.matrix.visibleRows[0];
    row2.showDetailPanel();
    const panel2 = row2.detailPanel;
    second.survey.dispose();
    expect(panel2.isDisposed, "#2: survey.dispose").toBe(true);
  });
  test("design mode: a row shows the template detail panel, and a row that leaves does not dispose it", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 2, detailPanelMode: "underRow",
      columns: [{ name: "c", cellType: "text" }], detailElements: [{ type: "text", name: "d" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    expect(row.detailPanel, "#1").toBe(matrix.detailPanel);
    row.hideDetailPanel(true);
    expect(matrix.detailPanel.isDisposed, "#2: hideDetailPanel(true)").toBe(false);
    row.showDetailPanel();
    matrix.rowCount = 0;
    expect(isRowDisposed(row), "#3").toBe(true);
    expect(matrix.detailPanel.isDisposed, "#4: the row leaves").toBe(false);
    expect(matrix.detailPanel.elements.length, "#5").toBe(1);
  });
});

describe("what the matrix holds goes with it", () => {
  test("matrix.dispose disposes the rendered table, the detail panel template and the toolbar", () => {
    const { matrix } = createMatrix({ rowCount: 1, detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] });
    matrix.visibleRows;
    const table = matrix.renderedTable;
    const template = matrix.detailPanel;
    const toolbar = matrix.toolbar;
    matrix.dispose();
    expect([table.isDisposed, template.isDisposed, toolbar.isDisposed]).toEqual([true, true, true]);
  });
  test("survey.dispose disposes the rendered table and the detail panel template of a matrix", () => {
    const { survey, matrix } = createMatrix({ rowCount: 1, detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] });
    matrix.visibleRows;
    const table = matrix.renderedTable;
    const toolbar = matrix.toolbar;
    survey.dispose();
    expect([table.isDisposed, matrix.detailPanel.isDisposed, toolbar.isDisposed]).toEqual([true, true, true]);
  });
  test("dropdown matrix: dispose takes its rendered table", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: ["a"], columns: [{ name: "c", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const table = matrix.renderedTable;
    survey.dispose();
    expect(table.isDisposed).toBe(true);
  });
});

describe("what the dynamic panel holds goes with it", () => {
  test("question.dispose disposes the live panels, the footer toolbar, the tabbed menu and the actions", () => {
    const { question } = createPanelDynamic({ panelCount: 2, displayMode: "tab" });
    const panels = question.panels.slice();
    const toolbar = question.footerToolbar;
    const menu: any = question.tabbedMenu;
    const tabs = menu.actions.slice();
    const removeActions = panels.map(panel => removeActionOf(question, panel));
    question.dispose();
    expect(panels.map(panel => panel.isDisposed), "#1: panels").toEqual([true, true]);
    expect(panels[0].questions[0].isDisposed, "#2: their questions").toBe(true);
    expect([toolbar.isDisposed, menu.isDisposed], "#3").toEqual([true, true]);
    expect(tabs.length, "#4").toBe(2);
    expect(tabs.map((tab: any) => tab.isDisposed), "#5: tabs").toEqual([true, true]);
    expect(removeActions.map(action => action.isDisposed), "#6: remove actions").toEqual([true, true]);
    expect(question.template.isDisposed, "#7").toBe(true);
  });
  test("survey.dispose disposes the live panels, the tabbed menu and the actions", () => {
    const { survey, question } = createPanelDynamic({ panelCount: 2, displayMode: "tab" });
    const panels = question.panels.slice();
    const menu: any = question.tabbedMenu;
    const tabs = menu.actions.slice();
    const removeActions = panels.map(panel => removeActionOf(question, panel));
    survey.dispose();
    expect(panels.map(panel => panel.isDisposed), "#1").toEqual([true, true]);
    expect(menu.isDisposed, "#2").toBe(true);
    expect(tabs.concat(removeActions).every((action: any) => action.isDisposed), "#3").toBe(true);
  });
  test("design mode: dispose does not dispose the template twice", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "paneldynamic", name: "pd", panelCount: 2, templateElements: [{ type: "text", name: "a" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const disposeSpy = vi.spyOn(question.template, "dispose");
    question.dispose();
    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });
});

describe("dynamic panels that leave wait for the rerender (control)", () => {
  test("removePanel while a UI renders the question: disposed after the next rerender", () => {
    const { question } = createPanelDynamic({ panelCount: 3 });
    const panels = question.panels.slice();
    question.enableOnElementRerenderedEvent();
    question.removePanel(1);
    expect(panels[1].isDisposed, "#1").toBe(false);
    question.afterRerender();
    expect(panels[1].isDisposed, "#2").toBe(true);
    question.removePanel(0);
    question.disableOnElementRerenderedEvent();
    expect(panels[0].isDisposed, "#3: the UI stops rendering the question").toBe(true);
    question.enableOnElementRerenderedEvent();
    question.removePanel(0);
    question.dispose();
    expect(panels[2].isDisposed, "#4: question.dispose before any rerender").toBe(true);
  });
  [false, true].forEach(hasUI => {
    test("removePanel from the panel question's own write" + (hasUI ? ", with a UI" : "") + ": the setter finishes, the panel goes after the write", () => {
      const { survey, question } = createPanelDynamic({ panelCount: 2 });
      const panels = question.panels.slice();
      const inner = panels[1].questions[0];
      if (hasUI) question.enableOnElementRerenderedEvent();
      const log: Array<boolean> = [];
      // onValueChanged runs inside the write the panel question makes through the dynamic panel.
      survey.onValueChanged.add((_, options) => {
        if (options.name !== "pd" || question.panelCount < 2 || options.value[1]?.a !== "remove") return;
        question.removePanel(1);
        log.push(panels[1].isDisposed);
      });
      expect(() => { inner.value = "remove"; }, "#1").not.toThrow();
      expect(log, "#2: alive inside the write").toEqual([false]);
      expect(question.panels, "#3").toEqual([panels[0]]);
      expect(panels[1].isDisposed, "#4").toBe(!hasUI);
      if (hasUI) {
        question.afterRerender();
        expect(panels[1].isDisposed, "#5").toBe(true);
      }
    });
  });
});

describe("remove-panel and tab actions go with their panels", () => {
  test("the remove actions of removed panels are disposed, and the question's handlers return to their count", () => {
    const { question } = createPanelDynamic({ panelCount: 1 });
    question.panels;
    const before = propChangeHandlerCount(question);
    const actions: Array<any> = [];
    for (let cycle = 0; cycle < 3; cycle++) {
      for (let i = 0; i < 5; i++) {
        question.addPanel();
        const action = removeActionOf(question, question.panels[question.panels.length - 1]);
        action.visible;
        action.enabled;
        actions.push(action);
      }
      expect(propChangeHandlerCount(question), "#1: the actions listen to the question").toBeGreaterThan(before);
      for (let i = 0; i < 5; i++) {
        question.removePanel(question.panels.length - 1);
      }
      expect(propChangeHandlerCount(question), "#2: cycle " + cycle).toBe(before);
    }
    expect(actions.filter(action => action.isDisposed).length, "#3").toBe(15);
  });
  test("a lower panelCount disposes the panels it cuts off, with their remove actions", () => {
    const { question } = createPanelDynamic({ panelCount: 3 });
    const panels = question.panels.slice();
    const actions = panels.map(panel => removeActionOf(question, panel));
    actions.forEach(action => action.visible);
    question.panelCount = 1;
    expect(panels.map(panel => panel.isDisposed), "#1").toEqual([false, true, true]);
    expect(actions.map(action => action.isDisposed), "#2").toEqual([false, true, true]);
  });
  test("an emptied value builds the panels anew: the old ones are disposed, with their remove actions", () => {
    const { question } = createPanelDynamic({ panelCount: 2 });
    question.value = [{ a: 1 }, { a: 2 }];
    const panels = question.panels.slice();
    const actions = panels.map(panel => removeActionOf(question, panel));
    actions.forEach(action => action.visible);
    question.clearValue();
    expect(question.panels.some(panel => panels.indexOf(panel) > -1), "#1: new panels").toBe(false);
    expect(panels.map(panel => panel.isDisposed), "#2").toEqual([true, true]);
    expect(actions.map(action => action.isDisposed), "#3").toEqual([true, true]);
  });
  test("a lower panelCount while a UI renders the question: the panels go after the next rerender", () => {
    const { question } = createPanelDynamic({ panelCount: 2 });
    const panels = question.panels.slice();
    question.enableOnElementRerenderedEvent();
    question.panelCount = 1;
    expect(panels[1].isDisposed, "#1").toBe(false);
    question.afterRerender();
    expect(panels[1].isDisposed, "#2").toBe(true);
  });
  test("tab actions replaced by the tabbed menu are disposed, and the question's handlers return to their count", () => {
    const { question } = createPanelDynamic({ panelCount: 1, displayMode: "tab" });
    const readTabs = (): Array<any> => {
      const tabs = (<any>question.tabbedMenu).actions.slice();
      tabs.forEach((tab: any) => { tab.active; tab.disableHide; });
      return tabs;
    };
    readTabs();
    const before = propChangeHandlerCount(question);
    const dropped: Array<any> = [];
    for (let cycle = 0; cycle < 3; cycle++) {
      for (let i = 0; i < 4; i++) question.addPanel();
      const tabs = readTabs();
      expect(tabs.length, "#1").toBe(5);
      for (let i = 0; i < 4; i++) question.removePanel(question.panels.length - 1);
      readTabs();
      dropped.push(...tabs.slice(1));
      expect(propChangeHandlerCount(question), "#2: cycle " + cycle).toBe(before);
    }
    expect(dropped.every(tab => tab.isDisposed), "#3").toBe(true);
  });
});

describe("the deferred dispose belongs to the records questions", () => {
  test("a plain question, panel and page hold no state for objects that wait for a rerender", () => {
    const survey = createSurvey([{ type: "panel", name: "p", elements: [{ type: "text", name: "q" }] }]);
    const elements: Array<any> = [survey.getQuestionByName("q"), survey.getPanelByName("p"), survey.pages[0]];
    elements.forEach((el: any, i: number) => {
      expect(el["objectsAwaitingRerender"], "#1." + i).toBeUndefined();
      expect(el["onRerenderedDisposeObjects"], "#2." + i).toBeUndefined();
      el.enableOnElementRerenderedEvent();
      el.afterRerender();
      el.disableOnElementRerenderedEvent();
    });
    survey.dispose();
    expect(elements.map(el => el.isDisposed), "#3").toEqual([true, true, true]);
  });
});

describe("template element handlers", () => {
  test("clearing the value does not add a handler to a template element", () => {
    const { question } = createPanelDynamic({ panelCount: 1 });
    question.panels;
    const element = <Question>question.template.elements[0];
    const start = element.onPropertyChanged.length;
    for (let i = 0; i < 5; i++) {
      question.value = [{ a: i }];
      question.clearValue();
      expect(element.onPropertyChanged.length, "#" + i).toBe(start);
    }
  });
  test("an element that leaves the template loses the question's handler; a nested one too", () => {
    const { question } = createPanelDynamic({ panelCount: 1 });
    question.panels;
    const element = new QuestionTextModel("b");
    const before = element.onPropertyChanged.length;
    question.template.addElement(element);
    expect(element.onPropertyChanged.length, "#1: joins").toBe(before + 1);
    question.clearValue();
    question.template.removeElement(element);
    expect(element.onPropertyChanged.length, "#2: leaves").toBe(before);
    question.template.addElement(element);
    expect(element.onPropertyChanged.length, "#3: joins again").toBe(before + 1);
    question.template.removeElement(element);

    const inner = new PanelModel("inner");
    question.template.addElement(inner);
    const nested = new QuestionTextModel("c");
    const nestedBefore = nested.onPropertyChanged.length;
    inner.addElement(nested);
    expect(nested.onPropertyChanged.length, "#4: nested joins").toBe(nestedBefore + 1);
    inner.removeElement(nested);
    expect(nested.onPropertyChanged.length, "#5: nested leaves").toBe(nestedBefore);
    inner.addElement(nested);
    const innerBefore = inner.onPropertyChanged.length;
    question.template.removeElement(inner);
    expect(inner.onPropertyChanged.length, "#6: the panel leaves").toBe(innerBefore - 1);
    expect(nested.onPropertyChanged.length, "#7: with its element").toBe(nestedBefore);
  });
  test("a property change on an element that left the template does not reach the question", () => {
    const { question } = createPanelDynamic({ panelCount: 1 });
    question.panels;
    const element = <Question>question.template.elements[0];
    question.template.removeElement(element);
    const spy = vi.spyOn(question as any, "onTemplateElementPropertyChanged");
    element.title = "changed";
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("a column's replaced template question", () => {
  test("is disposed and no longer reaches the column or the matrix; the new one does", () => {
    const { matrix } = createMatrix({ rowCount: 1 });
    matrix.visibleRows;
    const column = matrix.columns[0];
    const spy = vi.spyOn(matrix, "onColumnPropertyChanged");
    const olds: Array<Question> = [];
    ["dropdown", "checkbox", "text"].forEach(cellType => {
      olds.push(column.templateQuestion);
      column.cellType = cellType;
    });
    expect(olds.map(q => q.isDisposed), "#1").toEqual([true, true, true]);
    expect(column.templateQuestion.isDisposed, "#2").toBe(false);
    spy.mockClear();
    olds[2].title = "old";
    expect(spy, "#3: the old one").not.toHaveBeenCalled();
    expect(column.title, "#4").toBe("c");
    column.templateQuestion.title = "new";
    expect(spy, "#5: the new one").toHaveBeenCalled();
    expect(column.title, "#6").toBe("new");
  });
  test("a matrix cellType change disposes the templates of its default columns", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const old = matrix.columns[0].templateQuestion;
    matrix.cellType = "text";
    expect(matrix.columns[0].templateQuestion.getType(), "#1").toBe("text");
    expect(old.isDisposed, "#2").toBe(true);
  });
});

describe("a row that edits an object", () => {
  const createRow = (): MatrixDropdownRowModelBase => {
    const { matrix } = createMatrix({ rowCount: 1, columns: [{ name: "text", cellType: "text" }] });
    return matrix.visibleRows[0];
  };
  test("an object replaced by another object loses the row's handler", () => {
    const row = createRow();
    const a = new ItemValue("a", "A");
    const b = new ItemValue("b", "B");
    const a0 = a.onPropertyChanged.length;
    const b0 = b.onPropertyChanged.length;
    row.value = a;
    expect(a.onPropertyChanged.length, "#1").toBe(a0 + 1);
    row.value = b;
    expect([a.onPropertyChanged.length, b.onPropertyChanged.length], "#2").toEqual([a0, b0 + 1]);
    expect(row.editingObj, "#3").toBe(b);
    a.text = "changed";
    expect(cellOf(row).value, "#4: a change on the old object").toBe("B");
    b.text = "BB";
    expect(cellOf(row).value, "#5: a change on the new object").toBe("BB");
  });
  [{ name: "a plain object", value: { text: "plain" }, cell: "plain" }, { name: "null", value: null, cell: undefined }].forEach(item => {
    test("an object replaced by " + item.name + " loses the row's handler, and the row edits nothing", () => {
      const row = createRow();
      const a = new ItemValue("a", "A");
      const a0 = a.onPropertyChanged.length;
      row.value = a;
      row.value = item.value;
      expect(a.onPropertyChanged.length, "#1").toBe(a0);
      expect(row.editingObj, "#2").toBeFalsy();
      a.text = "changed";
      expect(cellOf(row).value, "#3").toBe(item.cell);
    });
  });
  test("the same object assigned twice keeps one handler", () => {
    const row = createRow();
    const a = new ItemValue("a", "A");
    const a0 = a.onPropertyChanged.length;
    row.value = a;
    row.value = a;
    expect(a.onPropertyChanged.length).toBe(a0 + 1);
  });
  test("a row that leaves loses its handler on the object it edits", () => {
    const createEdited = () => {
      const edited = new QuestionDropdownModel("q1");
      edited.choices = ["a", "b", "c"];
      const { survey, matrix } = createMatrix({ rowCount: 0, valueName: "choices", columns: [{ name: "text", cellType: "text" }] });
      const items = edited.choices.slice();
      const counts = items.map(item => item.onPropertyChanged.length);
      survey.editingObj = edited;
      matrix.visibleRows;
      return { survey: survey, matrix: matrix, items: items, counts: counts };
    };
    const handlers = (items: Array<ItemValue>): Array<number> => items.map(item => item.onPropertyChanged.length);
    const first = createEdited();
    expect(handlers(first.items), "#1").toEqual(first.counts.map(c => c + 1));
    first.matrix.rowCount = 2;
    expect(handlers(first.items), "#2: a row cut off").toEqual([first.counts[0] + 1, first.counts[1] + 1, first.counts[2]]);
    first.survey.dispose();
    expect(handlers(first.items), "#3: survey.dispose").toEqual(first.counts);
    const second = createEdited();
    second.matrix.dispose();
    expect(handlers(second.items), "#4: question.dispose").toEqual(second.counts);
  });
});
