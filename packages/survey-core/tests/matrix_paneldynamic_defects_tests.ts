import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";
import { FunctionFactory } from "../src/functionsfactory";
import { ItemValue } from "../src/itemvalue";
import { ISurveyImpl } from "../src/base-interfaces";
import { QuestionTextModel } from "../src/question_text";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { ArrayDynamicDataSource } from "../src/dynamic-data/dynamic-data-sources";

function createSurvey(elements: Array<any>): SurveyModel {
  return new SurveyModel({ elements: elements });
}
function isTableCreated(matrix: QuestionMatrixDynamicModel | QuestionMatrixDropdownModel): boolean {
  return !!matrix["getPropertyValueWithoutDefault"]("renderedTable");
}
// A function a condition calls; it throws once when the test asks it to.
function useThrowingFunction(name: string): { throwNext: () => void } {
  let isThrowing = false;
  FunctionFactory.Instance.register(name, (): boolean => {
    if (isThrowing) {
      isThrowing = false;
      throw new Error(name);
    }
    return true;
  });
  return { throwNext: (): void => { isThrowing = true; } };
}

describe("matrix: read-only change", () => {
  test("readOnly set while the matrix is updating does not throw", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "c1", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.beginUpdate();
    expect(() => { matrix.readOnly = true; }, "#1").not.toThrow();
    matrix.endUpdate();
    expect(matrix.visibleRows[0].cells[0].question.isReadOnly, "#2").toBe(true);
  });
  test("survey.readOnly does not build the rows of a matrix that was never rendered", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "c", cellType: "text", defaultValue: "x" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const changed: Array<string> = [];
    survey.onValueChanged.add((_, options) => { changed.push(options.name); });
    survey.readOnly = true;
    // The records of the rows, with the column defaults, are written on first rendering (Bug#12147), not by the read-only change.
    expect(survey.data, "#1: no defaults written").toEqual({ m: [{ c: "x" }, { c: "x" }] });
    expect(changed, "#2: no value change").toEqual([]);
    expect(matrix.visibleRows[0].cells[0].question.isReadOnly, "#3: the rows built later are read-only").toBe(true);
  });
  test("the rows that exist follow the read-only change", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "c", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const cell = matrix.visibleRows[1].cells[0].question;
    matrix.readOnly = true;
    expect(cell.isReadOnly, "#1").toBe(true);
    matrix.readOnly = false;
    expect(cell.isReadOnly, "#2").toBe(false);
  });
});

describe("matrix column: loading from JSON", () => {
  test("loading a matrix does not add cellType to the caller's column JSON", () => {
    const json = { elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "a", choices: [1, 2] }] }] };
    const survey = new SurveyModel(json);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(json.elements[0].columns[0], "#1: the caller's JSON").toEqual({ name: "a", choices: [1, 2] });
    expect(matrix.columns[0].cellType, "#2: the column still takes the matrix cell type").toBe("dropdown");
    expect(matrix.columns[0].choices.length, "#3").toBe(2);
    expect(matrix.toJSON().columns, "#4: serialized as before").toEqual([{ name: "a", cellType: "dropdown", choices: [1, 2] }]);
  });
  test("matrix.fromJSON does not add cellType to the caller's column JSON", () => {
    const matrix = new QuestionMatrixDynamicModel("m");
    const json = { columns: [{ name: "a", choices: [1, 2] }] };
    matrix.fromJSON(json);
    expect(json.columns[0], "#1").toEqual({ name: "a", choices: [1, 2] });
    expect(matrix.columns[0].cellType, "#2").toBe("dropdown");
  });
  test("a column without an owner loads JSON with choices", () => {
    const column = new MatrixDropdownColumn("a");
    expect(() => column.fromJSON({ name: "a", choices: [1, 2] }), "#1").not.toThrow();
    expect(column.name, "#2").toBe("a");
  });
});

describe("dynamic panel: the state of a new panel", () => {
  const createPanel = (json: any): QuestionPanelDynamicModel => {
    const survey = createSurvey([Object.assign({ type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "a" }] }, json)]);
    return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
  };
  const states = (panel: QuestionPanelDynamicModel): Array<string> => panel.panels.map(p => p.state);
  const firstExpanded = { panelsState: "firstExpanded", templateTitle: "P {panelIndex}" };
  test("firstExpanded: a runtime panelCount, addPanel and a JSON load give the same states", () => {
    const loaded = createPanel(Object.assign({ panelCount: 3 }, firstExpanded));
    expect(states(loaded), "#1: JSON load").toEqual(["expanded", "collapsed", "collapsed"]);
    const counted = createPanel(Object.assign({ panelCount: 0 }, firstExpanded));
    counted.panels;
    counted.panelCount = 3;
    expect(states(counted), "#2: runtime panelCount").toEqual(["expanded", "collapsed", "collapsed"]);
    const added = createPanel(Object.assign({ panelCount: 0 }, firstExpanded));
    added.panels;
    added.addPanel();
    added.addPanel();
    added.addPanel();
    expect(states(added), "#3: addPanel").toEqual(["expanded", "collapsed", "collapsed"]);
  });
  test("a panel the respondent adds is expanded whatever panelsState says", () => {
    const first = createPanel(Object.assign({ panelCount: 1 }, firstExpanded));
    first.addPanelUI();
    expect(states(first), "#1: firstExpanded").toEqual(["expanded", "expanded"]);
    const collapsed = createPanel({ panelCount: 1, panelsState: "collapsed", templateTitle: "P" });
    collapsed.addPanelUI();
    expect(states(collapsed), "#2: collapsed").toEqual(["collapsed", "expanded"]);
  });
  test("panels without templateTitle: every path gives the JSON-load state", () => {
    const collapsed = createPanel({ panelCount: 1, panelsState: "collapsed" });
    collapsed.panels;
    collapsed.panelCount = 2;
    expect(states(collapsed), "#1: collapsed, runtime add").toEqual(["default", "default"]);
    const expanded = createPanel({ panelCount: 0, panelsState: "expanded" });
    expanded.panels;
    expanded.panelCount = 2;
    expect(states(expanded), "#2: expanded, runtime add").toEqual(["expanded", "expanded"]);
    expect(states(createPanel({ panelCount: 2, panelsState: "expanded" })), "#3: expanded, JSON load").toEqual(["expanded", "expanded"]);
    const paged = createPanel({ panelCount: 0, panelsState: "expanded", pageSize: 5 });
    paged.panels;
    paged.addPanel();
    expect(states(paged), "#4: expanded, paged add").toEqual(["expanded"]);
  });
});

describe("matrix: answers and auto-advance walk the visible rows", () => {
  test("isAnswered ignores a hidden unanswered row", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: ["a", { value: "b", visibleIf: "false" }], columns: [{ name: "c", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.visibleRows[0].cells[0].question.value = "1";
    expect(matrix.visibleRows.length, "#1").toBe(1);
    expect(matrix.isAnswered, "#2").toBe(true);
  });
  test("auto-advance treats a cell answered 0 as answered", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: ["r1"], columns: [{ name: "c1", cellType: "dropdown", choices: [0, 1] }] }]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.visibleRows[0].cells[0].question.value = 0;
    expect(matrix.supportAutoAdvance(), "#1").toBe(true);
  });
  test("auto-advance ignores a hidden unanswered row", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: [{ value: "a", visibleIf: "false" }, "b"], columns: [{ name: "c1", cellType: "dropdown", choices: [1, 2] }] }]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.visibleRows[0].cells[0].question.value = 2;
    expect(matrix.supportAutoAdvance(), "#1").toBe(true);
  });
});

describe("matrix: the rendered table is not created by headless calls", () => {
  const createMatrix = (): QuestionMatrixDynamicModel => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2, detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "d" }], columns: [{ name: "a", cellType: "text" }] }]);
    return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
  };
  test("addRow and removeRow leave the table uncreated", () => {
    const matrix = createMatrix();
    matrix.addRow();
    expect(isTableCreated(matrix), "#1: addRow").toBe(false);
    matrix.removeRow(0);
    expect(isTableCreated(matrix), "#2: removeRow").toBe(false);
    expect(matrix.rowCount, "#3").toBe(2);
  });
  test("showing a detail panel leaves the table uncreated", () => {
    const matrix = createMatrix();
    matrix.visibleRows[0].showDetailPanel();
    expect(matrix.visibleRows[0].isDetailPanelShowing, "#1").toBe(true);
    expect(isTableCreated(matrix), "#2").toBe(false);
  });
  test("an existing table is still updated in place", () => {
    const matrix = createMatrix();
    const table = matrix.renderedTable;
    const count = table.rows.length;
    matrix.addRow();
    expect(matrix.renderedTable === table, "#1: the same table").toBe(true);
    expect(table.rows.length > count, "#2: the row is added to it").toBe(true);
    const afterAdd = table.rows.length;
    matrix.removeRow(0);
    expect(matrix.renderedTable === table, "#3: the same table").toBe(true);
    expect(table.rows.length < afterAdd, "#4: the row is removed from it").toBe(true);
  });
});

describe("matrix: the design row", () => {
  test("the design row of an empty dynamic matrix holds a plain value and is created once", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c1", cellType: "text", visibleIf: "{row.c1} = 1" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const before = matrix.rowCounter;
    const ctx1: any = matrix.getDesignRowContext();
    const ctx2: any = matrix.getDesignRowContext();
    expect(ctx1.row.editingObj instanceof ItemValue, "#1: not an ItemValue").toBe(false);
    expect(!!ctx1.row.editingObj, "#2: no object is edited").toBe(false);
    expect(ctx2.row === ctx1.row, "#3: the same row").toBe(true);
    expect(matrix.rowCounter - before, "#4: one row is created").toBe(1);
  });
  test("the design row follows the columns and goes with the matrix", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c1", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row1: any = (<any>matrix.getDesignRowContext()).row;
    const cell1 = row1.cells[0].question;
    matrix.addColumn("c2");
    const row2: any = (<any>matrix.getDesignRowContext()).row;
    expect(row2 === row1, "#1: a new row").toBe(false);
    expect(row2.cells.length, "#2: it has the new column").toBe(2);
    expect(cell1.isDisposed, "#3: the old row is disposed").toBe(true);
    const cell2 = row2.cells[0].question;
    matrix.dispose();
    expect(cell2.isDisposed, "#4: disposed with the matrix").toBe(true);
  });
  test("the design row of an empty dropdown matrix", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "matrixdropdown", name: "m", columns: [{ name: "c1", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const ctx1: any = matrix.getDesignRowContext();
    const ctx2: any = matrix.getDesignRowContext();
    expect(!!ctx1.row.editingObj, "#1").toBe(false);
    expect(ctx2.row === ctx1.row, "#2").toBe(true);
  });
});

describe("matrix: removeRowUI by number", () => {
  test("removeRowUI(1) on three rows focuses the row now at index 1", () => {
    vi.useFakeTimers();
    try {
      const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 3, columns: [{ name: "a", cellType: "text" }] }]);
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      const focusAdd = vi.spyOn(matrix, "focusAddBUtton").mockImplementation(() => { });
      const focusCell = vi.spyOn(matrix.renderedTable, "focusActionCell").mockImplementation(() => { });
      const third = matrix.visibleRows[2];
      matrix.removeRowUI(1);
      vi.advanceTimersByTime(20);
      expect(matrix.rowCount, "#1").toBe(2);
      expect(focusAdd, "#2").not.toHaveBeenCalled();
      expect(focusCell, "#3").toHaveBeenCalledTimes(1);
      expect(focusCell.mock.calls[0][0] === third, "#4: the row now at index 1").toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("dynamic panel without a survey or a parent chain", () => {
  test("getPanelActions without a survey returns the actions", () => {
    const q = new QuestionPanelDynamicModel("q");
    q.templateElements.push(new QuestionTextModel("a"));
    q.panelCount = 1;
    const actions = q.getPanelActions(q.panels[0]);
    expect(actions.length > 0, "#1").toBe(true);
  });
  test("getValueChangingOptions for a question without a parent", () => {
    const q = new QuestionPanelDynamicModel("q");
    q.templateElements.push(new QuestionTextModel("a"));
    q.panelCount = 1;
    expect(q.getValueChangingOptions(new QuestionTextModel("x")), "#1").toBeUndefined();
  });
});

describe("a throw inside user code does not leave a matrix flag set", () => {
  test("matrixCellCreating: the rows are built on the next read", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "a", cellType: "text" }] }]);
    let isThrown = false;
    survey.onMatrixCellCreating.add(() => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("cell");
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(() => matrix.visibleRows, "#1").toThrow("cell");
    expect(matrix.visibleRows.length, "#2").toBe(2);
  });
  test("detail panel creation: a later showDetailPanel works", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
      detailElements: [{ type: "text", name: "d" }], columns: [{ name: "a", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    let isThrown = false;
    matrix.onCreateDetailPanelCallback = () => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("panel");
    };
    const row = matrix.visibleRows[0];
    expect(() => row.showDetailPanel(), "#1").toThrow("panel");
    row.showDetailPanel();
    expect(row.isDetailPanelShowing, "#2").toBe(true);
    expect(row.detailPanel.questions.length, "#3").toBe(1);
  });
  test("onMatrixRowAdded: the rendered table is reset afterwards", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "a", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    let isThrown = false;
    survey.onMatrixRowAdded.add(() => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("added");
    });
    matrix.renderedTable;
    expect(() => matrix.addRow(), "#1").toThrow("added");
    const table = matrix.renderedTable;
    matrix.showHeader = false;
    expect(matrix.renderedTable === table, "#2: a new table").toBe(false);
  });
  test("onMatrixRowRemoved: the rendered table is reset afterwards", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "a", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    let isThrown = false;
    survey.onMatrixRowRemoved.add(() => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("removed");
    });
    matrix.renderedTable;
    expect(() => matrix.removeRow(0), "#1").toThrow("removed");
    const table = matrix.renderedTable;
    matrix.showHeader = false;
    expect(matrix.renderedTable === table, "#2: a new table").toBe(false);
  });
  test("cell conditions: a cell visibility change is followed afterwards", () => {
    const func = useThrowingFunction("throwOnceInCellCondition");
    try {
      const survey = createSurvey([{ type: "text", name: "q1" },
        { type: "matrixdynamic", name: "m", rowCount: 1, columns: [
          { name: "a", cellType: "text", visibleIf: "throwOnceInCellCondition({q1})" }, { name: "b", cellType: "text" }] }]);
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      matrix.renderedTable;
      func.throwNext();
      expect(() => survey.setValue("q1", 1), "#1").toThrow("throwOnceInCellCondition");
      const table = matrix.renderedTable;
      matrix.visibleRows[0].cells[1].question.visible = false;
      expect(matrix.columns[1].isColumnVisible, "#2: the column has no visible cell").toBe(false);
      expect(matrix.renderedTable === table, "#3: a new table").toBe(false);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceInCellCondition");
    }
  });
});

// A template question that throws once when it joins a panel of the question, at the test's request.
class QuestionThrowingOnAttachModel extends QuestionTextModel {
  static throwFor: (q: QuestionThrowingOnAttachModel) => boolean;
  getType(): string { return "throwingonattach"; }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    const throwFor = QuestionThrowingOnAttachModel.throwFor;
    if (!!throwFor && throwFor(this)) {
      QuestionThrowingOnAttachModel.throwFor = undefined;
      throw new Error("attach");
    }
    super.setSurveyImpl(value, isLight);
  }
}
Serializer.addClass("throwingonattach", [], () => new QuestionThrowingOnAttachModel(""), "text");

describe("a throw while panels are created does not leave the dynamic panel's value frozen", () => {
  const createPanel = (json: any): { survey: SurveyModel, panel: QuestionPanelDynamicModel } => {
    const survey = createSurvey([Object.assign({ type: "paneldynamic", name: "p", templateElements: [{ type: "throwingonattach", name: "a" }] }, json)]);
    return { survey: survey, panel: <QuestionPanelDynamicModel>survey.getQuestionByName("p") };
  };
  const throwInPanelOf = (panel: QuestionPanelDynamicModel): void => {
    QuestionThrowingOnAttachModel.throwFor = (q: QuestionThrowingOnAttachModel): boolean => !!q.parent && q.parent !== panel.template;
  };
  const checkValue = (survey: SurveyModel, panel: QuestionPanelDynamicModel): void => {
    panel.value = [{ a: 1 }];
    expect(survey.data, "the value is written").toEqual({ p: [{ a: 1 }] });
    survey.setValue("p", [{ a: 2 }, { a: 3 }]);
    expect(panel.value, "the value is read").toEqual([{ a: 2 }, { a: 3 }]);
  };
  test("panelCount raised at runtime", () => {
    const { survey, panel } = createPanel({ panelCount: 1 });
    panel.panels;
    throwInPanelOf(panel);
    try {
      expect(() => { panel.panelCount = 2; }, "#1").toThrow("attach");
    } finally {
      QuestionThrowingOnAttachModel.throwFor = undefined;
    }
    checkValue(survey, panel);
  });
  test("an add on a paged question", () => {
    const { survey, panel } = createPanel({ panelCount: 1, pageSize: 5 });
    panel.panels;
    throwInPanelOf(panel);
    try {
      expect(() => panel.addPanel(), "#1").toThrow("attach");
    } finally {
      QuestionThrowingOnAttachModel.throwFor = undefined;
    }
    checkValue(survey, panel);
  });
  test("a template change", () => {
    const { survey, panel } = createPanel({ panelCount: 1 });
    panel.panels;
    throwInPanelOf(panel);
    try {
      expect(() => panel.template.addNewQuestion("text", "b"), "#1").toThrow("attach");
    } finally {
      QuestionThrowingOnAttachModel.throwFor = undefined;
    }
    checkValue(survey, panel);
  });
  test("a condition of the new panels", () => {
    const func = useThrowingFunction("throwOnceInPanelCondition");
    try {
      const survey = createSurvey([{ type: "text", name: "q1" }, { type: "paneldynamic", name: "p", panelCount: 1,
        templateElements: [{ type: "text", name: "a", visibleIf: "throwOnceInPanelCondition({q1})" }] }]);
      const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
      panel.panels;
      func.throwNext();
      expect(() => { panel.panelCount = 2; }, "#1").toThrow("throwOnceInPanelCondition");
      checkValue(survey, panel);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceInPanelCondition");
    }
  });
  test("onDynamicPanelAdded in the first build: validate() reports the errors", () => {
    // On the second page: the first build runs when the panels are read, not on load.
    const survey = new SurveyModel({ pages: [{ elements: [{ type: "text", name: "q0" }] },
      { elements: [{ type: "paneldynamic", name: "p", panelCount: 1, templateElements: [{ type: "text", name: "a", isRequired: true }] }] }] });
    let isThrown = false;
    survey.onDynamicPanelAdded.add(() => {
      if (isThrown) return;
      isThrown = true;
      throw new Error("first build");
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect(() => panel.panels, "#1").toThrow("first build");
    expect(panel.validate(), "#2").toBe(false);
  });
});

describe("a throw while the panel count follows an assigned value does not leave later assignments ignored", () => {
  test("a condition of the new panels throws: the next value assigned is stored", () => {
    const func = useThrowingFunction("throwOnceInAssignedPanelCondition");
    try {
      const survey = createSurvey([{ type: "text", name: "q1" }, { type: "paneldynamic", name: "p", panelCount: 1,
        templateElements: [{ type: "text", name: "a", visibleIf: "throwOnceInAssignedPanelCondition({q1})" }] }]);
      const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
      panel.panels;
      func.throwNext();
      expect(() => { panel.value = [{ a: 1 }, { a: 2 }, { a: 3 }]; }, "#1").toThrow("throwOnceInAssignedPanelCondition");
      panel.value = [{ a: "x" }];
      expect(panel.value, "#2").toEqual([{ a: "x" }]);
      expect(survey.data, "#3").toEqual({ p: [{ a: "x" }] });
      expect(panel.panels.length, "#4").toBe(1);
    } finally {
      FunctionFactory.Instance.unregister("throwOnceInAssignedPanelCondition");
    }
  });
  test("a new panel throws when it is created: the next value from the survey is stored", () => {
    const survey = createSurvey([{ type: "paneldynamic", name: "p", panelCount: 1, templateElements: [{ type: "throwingonattach", name: "a" }] }]);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.panels;
    QuestionThrowingOnAttachModel.throwFor = (q: QuestionThrowingOnAttachModel): boolean => !!q.parent && q.parent !== panel.template;
    try {
      expect(() => { panel.value = [{ a: 1 }, { a: 2 }, { a: 3 }]; }, "#1").toThrow("attach");
    } finally {
      QuestionThrowingOnAttachModel.throwFor = undefined;
    }
    survey.setValue("p", [{ a: "x" }]);
    expect(panel.value, "#2").toEqual([{ a: "x" }]);
    expect(survey.data, "#3").toEqual({ p: [{ a: "x" }] });
    expect(panel.panels.length, "#4").toBe(1);
  });
});

describe("a throw while the dynamic matrix's row count follows an assigned value does not change how the next value is taken", () => {
  const createMatrix = (json: any): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } => {
    const survey = createSurvey([Object.assign({ type: "matrixdynamic", name: "m", rowCount: 2 }, json)]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    return { survey: survey, matrix: matrix };
  };
  const throwOnNextCell = (): void => {
    QuestionThrowingOnAttachModel.throwFor = (): boolean => true;
  };
  test("valueChangedCallback throws while the survey assigns the value: the next value below minRowCount is padded with defaultRowValue", () => {
    const { survey, matrix } = createMatrix({ minRowCount: 2, defaultRowValue: { c: "d" }, columns: [{ name: "c", cellType: "text" }] });
    let isThrowing = true;
    matrix.valueChangedCallback = (): void => {
      if (!isThrowing) return;
      isThrowing = false;
      throw new Error("callback");
    };
    expect(() => survey.setValue("m", [{ c: 1 }, { c: 2 }, { c: 3 }]), "#1").toThrow("callback");
    survey.setValue("m", [{ c: "x" }]);
    expect(matrix.value, "#2").toEqual([{ c: "x" }, { c: "d" }]);
    expect(survey.data, "#3").toEqual({ m: [{ c: "x" }, { c: "d" }] });
    expect(matrix.rowCount, "#4").toBe(2);
  });
  test("a cell throws while the assigned value rebuilds the rows: the next value below minRowCount is padded with defaultRowValue", () => {
    const { survey, matrix } = createMatrix({ minRowCount: 2, defaultRowValue: { c: "d" }, columns: [{ name: "c", cellType: "throwingonattach" }] });
    throwOnNextCell();
    try {
      expect(() => { matrix.value = [{ c: 1 }, { c: 2 }, { c: 3 }, { c: 4 }]; }, "#1").toThrow("attach");
    } finally {
      QuestionThrowingOnAttachModel.throwFor = undefined;
    }
    survey.setValue("m", [{ c: "x" }]);
    expect(matrix.value, "#2").toEqual([{ c: "x" }, { c: "d" }]);
    expect(survey.data, "#3").toEqual({ m: [{ c: "x" }, { c: "d" }] });
    expect(matrix.rowCount, "#4").toBe(2);
  });
  test("a cell throws while the assigned value rebuilds the rows: the next value below the initial row count keeps the rows", () => {
    const { survey, matrix } = createMatrix({ columns: [{ name: "c", cellType: "throwingonattach" }] });
    throwOnNextCell();
    try {
      expect(() => { matrix.value = [{ c: 1 }, { c: 2 }, { c: 3 }, { c: 4 }]; }, "#1").toThrow("attach");
    } finally {
      QuestionThrowingOnAttachModel.throwFor = undefined;
    }
    matrix.value = [{ c: "x" }];
    expect(matrix.value, "#2").toEqual([{ c: "x" }]);
    expect(survey.data, "#3").toEqual({ m: [{ c: "x" }] });
    expect(matrix.rowCount, "#4").toBe(4);
    expect(matrix.visibleRows.length, "#5").toBe(4);
  });
});

describe("matrix: nested beginUpdate", () => {
  test("one endUpdate per beginUpdate unlocks the matrix", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "c1", cellType: "text" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const update = vi.spyOn(<any>matrix, "updateColumnsAndRows");
    matrix.beginUpdate();
    matrix.beginUpdate();
    matrix.endUpdate();
    expect(matrix.visibleRows === null, "#1: still locked").toBe(true);
    expect(update, "#2: nothing run yet").not.toHaveBeenCalled();
    matrix.endUpdate();
    expect(matrix.visibleRows.length, "#3: unlocked").toBe(2);
    expect(update, "#4: run once").toHaveBeenCalledTimes(1);
    matrix.endUpdate();
    expect(matrix.visibleRows.length, "#5: an extra endUpdate does not lock it").toBe(2);
    matrix.beginUpdate();
    expect(matrix.visibleRows === null, "#6: and the next beginUpdate locks it").toBe(true);
    matrix.endUpdate();
    expect(matrix.visibleRows.length, "#7").toBe(2);
  });
});

describe("matrix: expression validation of choices", () => {
  test("validateExpressions reports the choices of a dropdown matrix", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: ["r1"], columns: [{ name: "c1" }],
      choices: [{ value: 1, visibleIf: "unknownFuncOfChoice({unknownVar}) = 1" }] }]);
    const result = survey.validateExpressions({ functions: true, variables: true, semantics: true });
    expect(result.map(e => [e.obj.getType(), e.propertyName]), "#1").toEqual([["itemvalue", "visibleIf"]]);
  });
});

describe("matrix column: isRequired is stored once", () => {
  const createMatrix = (): QuestionMatrixDynamicModel => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 2,
      columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "boolean" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    matrix.renderedTable;
    return matrix;
  };
  test("isRequired: one change, one notification and one table reset", () => {
    const matrix = createMatrix();
    const changed = vi.spyOn(matrix, "onColumnPropertyChanged");
    const reset = vi.spyOn(matrix, "resetRenderedTable");
    matrix.columns[0].isRequired = true;
    expect(changed.mock.calls.map(c => c[1]), "#1").toEqual(["isRequired"]);
    expect(reset, "#2").toHaveBeenCalledTimes(1);
    expect(matrix.visibleRows[0].cells[0].question.isRequired, "#3").toBe(true);
  });
  test("isRequired: the column reads the template question", () => {
    const matrix = createMatrix();
    const column = matrix.columns[0];
    column.isRequired = true;
    column.templateQuestion.isRequired = false;
    expect(column.isRequired, "#1").toBe(false);
    expect(matrix.visibleRows[0].cells[0].question.isRequired, "#2").toBe(false);
  });
  test("toJSON of a column with isRequired or a custom renderAs is unchanged", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m",
      columns: [{ name: "c1", cellType: "text", isRequired: true }, { name: "c2", cellType: "boolean", renderAs: "my-renderer" }, { name: "c3" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.toJSON().columns, "#1").toEqual([{ name: "c1", cellType: "text", isRequired: true },
      { name: "c2", cellType: "boolean", renderAs: "my-renderer" }, { name: "c3" }]);
    expect(matrix.columns[0].isRequired, "#2").toBe(true);
    expect(matrix.columns[1].renderAs, "#3").toBe("my-renderer");
    expect(matrix.columns[2].isRequired, "#4: the default").toBe(false);
  });
  test("a boolean column loaded with renderAs checkbox gives it to its cells, Creator reads it", () => {
    const survey = createSurvey([{ type: "matrixdynamic", name: "m", rowCount: 1,
      columns: [{ name: "c", cellType: "boolean", renderAs: "checkbox" }] }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.columns[0].renderAs, "#1").toBe("checkbox");
    expect(matrix.visibleRows[0].cells[0].question.renderAs, "#2").toBe("checkbox");
  });
});

describe("matrix column: the first cell that loads choices wins", () => {
  test("a cell of the rebuilt rows does not apply its loaded choices again", () => {
    const survey = createSurvey([{ type: "matrixdropdown", name: "m", rows: ["r1", "r2"],
      columns: [{ name: "c", cellType: "checkbox", showInMultipleColumns: true, choices: [1, 2] }] }]);
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const cells = matrix.visibleRows.map(row => <any>row.cells[0].question);
    const changed = vi.spyOn(matrix, "onShowInMultipleColumnsChanged");
    cells[0].choices = [1, 2, 3];
    cells[0].loadedChoicesFromServerCallback();
    const applied = changed.mock.calls.length;
    expect(applied > 0, "#1: the first cell applies its choices").toBe(true);
    expect(matrix.columns[0].choices.length, "#2").toBe(3);
    const newCell = <any>matrix.visibleRows[0].cells[0].question;
    cells[1].loadedChoicesFromServerCallback();
    newCell.loadedChoicesFromServerCallback();
    expect(changed.mock.calls.length, "#3: no one else applies them").toBe(applied);
  });
});

describe("Bug#12147 a Dynamic Matrix keeps its empty rows in the value, as a Dynamic Panel keeps its empty panels", () => {
  function createSurveyWithBoth(matrixJson: any = {}, panelJson: any = {}): { survey: SurveyModel, m: QuestionMatrixDynamicModel, p: QuestionPanelDynamicModel } {
    const survey = new SurveyModel({ elements: [
      Object.assign({ type: "matrixdynamic", name: "m", columns: [{ name: "q", cellType: "text" }] }, matrixJson),
      Object.assign({ type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "q" }] }, panelJson)
    ] });
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const p = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    m.visibleRows;
    return { survey, m, p };
  }
  // The matrix gives the value the panel gives, and m.value is what the survey holds.
  function checkSame(survey: SurveyModel, m: QuestionMatrixDynamicModel, p: QuestionPanelDynamicModel, expected: any, msg: string): void {
    expect(m.value, msg + ": m.value").toEqual(expected);
    expect(p.value, msg + ": p.value").toEqual(expected);
    expect(survey.getValue("m"), msg + ": survey m").toEqual(expected);
    expect(survey.getValue("p"), msg + ": survey p").toEqual(expected);
  }
  function setCell(m: QuestionMatrixDynamicModel, rowIndex: number, val: any): void {
    m.visibleRows[rowIndex].cells[0].question.value = val;
  }
  function setPanel(p: QuestionPanelDynamicModel, panelIndex: number, val: any): void {
    p.panels[panelIndex].getQuestionByName("q").value = val;
  }
  test("no rows / panels: no value", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 0 }, { panelCount: 0 });
    checkSame(survey, m, p, undefined, "#1");
    expect(survey.data, "#2").toEqual({});
  });
  test("untouched rows / panels: empty records", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 2 }, { panelCount: 2 });
    checkSame(survey, m, p, [{}, {}], "#1");
    expect(survey.data, "#2").toEqual({ m: [{}, {}], p: [{}, {}] });
  });
  test("untouched rows: the value is written on first rendering, before the rows are built", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "q", cellType: "text" }] },
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [{ type: "text", name: "q" }] }
    ] });
    const changed: Array<string> = [];
    survey.onValueChanged.add((_, options) => { changed.push(options.name); });
    expect(survey.data, "#1: no rows built").toEqual({ m: [{}, {}], p: [{}, {}] });
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    m.visibleRows;
    expect(survey.data, "#2: rows built").toEqual({ m: [{}, {}], p: [{}, {}] });
    expect(changed, "#3: nothing changes after the construction").toEqual([]);
  });
  test("untouched rows on the second page: written when the page is shown, with the value event, as the panel", () => {
    const survey = new SurveyModel({ pages: [
      { elements: [{ type: "text", name: "t" }] },
      { elements: [
        { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "q", cellType: "text" }] },
        { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [{ type: "text", name: "q" }] }
      ] }
    ] });
    const changed: Array<string> = [];
    survey.onValueChanged.add((_, options) => { changed.push(options.name); });
    expect(survey.data, "#1").toEqual({});
    survey.nextPage();
    expect(survey.data, "#2").toEqual({ m: [{}, {}], p: [{}, {}] });
    expect(changed.sort(), "#3").toEqual(["m", "p"]);
  });
  test("a matrix with defaultValueExpression is written on first rendering as a default value and follows the expression", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", rowCount: 2, columns: [{ name: "q", cellType: "text" }] },
      { type: "matrixdynamic", name: "m2", rowCount: 2, defaultValueExpression: "{m1}", columns: [{ name: "q", cellType: "text" }] }
    ] });
    const m1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
    const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    setCell(m1, 0, "v");
    expect(m2.value, "#1").toEqual([{ q: "v" }, {}]);
    setCell(m1, 1, "w");
    expect(m2.value, "#2").toEqual([{ q: "v" }, { q: "w" }]);
  });
  test("a hidden untouched matrix and panel leave nothing in the completed data", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 2 }, { panelCount: 2 });
    m.visible = false;
    p.visible = false;
    survey.doComplete();
    expect(survey.data, "#1").toEqual({});
  });
  test("clearValue: m.value is what the survey holds", () => {
    const { survey, m } = createSurveyWithBoth({ rowCount: 2 });
    setCell(m, 0, "v");
    m.clearValue();
    expect(m.value, "#1").toBeUndefined();
    expect(survey.getValue("m"), "#2").toBeUndefined();
    survey.data = {};
    expect(m.value, "#3").toEqual(survey.getValue("m"));
  });
  test("survey.data replaced: an untouched matrix keeps its rows, as the panel keeps its panels", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 2 }, { panelCount: 2 });
    survey.data = { other: 1 };
    expect(m.rowCount, "#1").toBe(2);
    expect(p.panelCount, "#2").toBe(2);
    expect(m.value, "#3").toBeUndefined();
    expect(survey.getValue("m"), "#4").toBeUndefined();
    survey.clear();
    expect(m.rowCount, "#5").toBe(2);
  });
  test("the rowCount setter stores the records at once, as the panelCount setter", () => {
    let { survey, m, p } = createSurveyWithBoth({ rowCount: 1 }, { panelCount: 1 });
    const changed: Array<string> = [];
    survey.onValueChanged.add((_, options) => { changed.push(options.name); });
    m.rowCount = 3;
    p.panelCount = 3;
    checkSame(survey, m, p, [{}, {}, {}], "#1: untouched, grown");
    expect(changed, "#1: one event each").toEqual(["m", "p"]);
    setCell(m, 2, "v");
    setPanel(p, 2, "v");
    checkSame(survey, m, p, [{}, {}, { q: "v" }], "#1: a write");
    ({ survey, m, p } = createSurveyWithBoth({ rowCount: 1 }, { panelCount: 1 }));
    setCell(m, 0, "v");
    setPanel(p, 0, "v");
    m.rowCount = 3;
    p.panelCount = 3;
    checkSame(survey, m, p, [{ q: "v" }, {}, {}], "#2: answered, grown");
    m.rowCount = 1;
    p.panelCount = 1;
    checkSame(survey, m, p, [{ q: "v" }], "#3: shrunk");
  });
  test("rowCountExpression and panelCountExpression store the records at once", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 0, rowCountExpression: "{n}" }, { panelCount: 0, panelCountExpression: "{n}" });
    survey.setValue("n", 3);
    checkSame(survey, m, p, [{}, {}, {}], "#1");
    survey.setValue("n", 1);
    checkSame(survey, m, p, [{}], "#2");
  });
  test("a count expression on the second page: the records are stored when the page is shown", () => {
    const survey = new SurveyModel({ pages: [
      { elements: [{ type: "text", name: "n" }] },
      { elements: [
        { type: "matrixdynamic", name: "m", rowCount: 0, rowCountExpression: "{n}", columns: [{ name: "q", cellType: "text" }] },
        { type: "paneldynamic", name: "p", panelCount: 0, panelCountExpression: "{n}", templateElements: [{ type: "text", name: "q" }] }
      ] }
    ] });
    survey.setValue("n", 2);
    expect(survey.data, "#1: not shown yet").toEqual({ n: 2 });
    survey.nextPage();
    expect(survey.data, "#2").toEqual({ n: 2, m: [{}, {}], p: [{}, {}] });
  });
  test("one value write and one onValueChanged per addRow / addPanel", () => {
    const check = (matrixJson: any, panelJson: any, add: (m: QuestionMatrixDynamicModel, p: QuestionPanelDynamicModel) => void, expected: any, msg: string): void => {
      const { survey, m, p } = createSurveyWithBoth(Object.assign({ rowCount: 1 }, matrixJson), Object.assign({ panelCount: 1 }, panelJson));
      setCell(m, 0, "a");
      setPanel(p, 0, "a");
      const changed: Array<string> = [];
      survey.onValueChanged.add((_, options) => { changed.push(options.name); });
      add(m, p);
      checkSame(survey, m, p, expected, msg);
      expect(changed, msg + ": one event each").toEqual(["m", "p"]);
    };
    check({}, {}, (m, p) => { m.addRow(); p.addPanel(); }, [{ q: "a" }, {}], "#1: plain");
    check({ defaultRowValue: { q: "d" } }, { defaultPanelValue: { q: "d" } }, (m, p) => { m.addRow(); p.addPanel(); }, [{ q: "a" }, { q: "d" }], "#2: a default record");
    check({}, {}, (m, p) => { m.addRowByIndex({}, 0); p.addPanel(0); }, [{}, { q: "a" }], "#3: at a position");
  });
  test("a handler that assigns the value while a row / panel is added wins", () => {
    const check = (matrixJson: any, panelJson: any, add: (m: QuestionMatrixDynamicModel, p: QuestionPanelDynamicModel) => void, msg: string): void => {
      const { survey, m, p } = createSurveyWithBoth(Object.assign({ rowCount: 1 }, matrixJson), Object.assign({ panelCount: 1 }, panelJson));
      let isDone: any = {};
      survey.onValueChanged.add((_, options) => {
        if (isDone[options.name] || (options.name !== "m" && options.name !== "p")) return;
        isDone[options.name] = true;
        survey.setValue(options.name, [{ q: "x" }]);
      });
      add(m, p);
      checkSame(survey, m, p, [{ q: "x" }], msg);
      expect(m.visibleRows.length, msg + ": rows").toBe(1);
      expect(p.panels.length, msg + ": panels").toBe(1);
    };
    check({}, {}, (m, p) => { m.addRow(); p.addPanel(); }, "#1: plain");
    check({ defaultRowValue: { q: "d" } }, { defaultPanelValue: { q: "d" } }, (m, p) => { m.addRow(); p.addPanel(); }, "#2: a default record");
    check({}, {}, (m, p) => { m.addRowByIndex({}, 0); p.addPanel(0); }, "#3: at a position");
  });
  test("count growth: the stored records and the shown rows / panels agree (default records, column defaults, expressions)", () => {
    const { survey, m, p } = createSurveyWithBoth(
      { rowCount: 1, defaultRowValue: { q: "d" }, columns: [{ name: "q", cellType: "text" }, { name: "c", cellType: "text", defaultValue: "cd" }, { name: "e", cellType: "expression", expression: "{rowIndex}" }] },
      { panelCount: 1, defaultPanelValue: { q: "d" }, templateElements: [{ type: "text", name: "q" }, { type: "text", name: "c", defaultValue: "cd" }, { type: "expression", name: "e", expression: "{panelIndex}" }] });
    m.rowCount = 3;
    p.panelCount = 3;
    expect(m.value, "#1: matrix value").toEqual([{ q: "d", c: "cd", e: 1 }, { q: "d", c: "cd", e: 2 }, { q: "d", c: "cd", e: 3 }]);
    expect(m.visibleRows.map(row => row.value), "#2: rows").toEqual(m.value);
    expect(p.value, "#3: panel value").toEqual([{ q: "d", c: "cd", e: 0 }, { q: "d", c: "cd", e: 1 }, { q: "d", c: "cd", e: 2 }]);
    expect(p.panels.map(panel => panel.getValue()), "#4: panels").toEqual(p.value);
    expect(survey.data, "#5").toEqual({ m: m.value, p: p.value });
  });
  test("paging: rowCount growth stores every record and keeps the page", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 3, pageSize: 2, columns: [{ name: "q", cellType: "text" }] }] });
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    m.visibleRows;
    m.pageIndex = 1;
    m.rowCount = 7;
    expect(m.value, "#1").toEqual([{}, {}, {}, {}, {}, {}, {}]);
    expect(m.pageCount, "#2").toBe(4);
    expect(m.pageIndex, "#3").toBe(1);
  });
  test("a panel with defaultValueExpression keeps following it after its first rendering, as the matrix", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "src", panelCount: 1, templateElements: [{ type: "text", name: "q" }] },
      { type: "matrixdynamic", name: "m", rowCount: 2, defaultValueExpression: "{src}", columns: [{ name: "q", cellType: "text" }] },
      { type: "paneldynamic", name: "p", panelCount: 2, defaultValueExpression: "{src}", templateElements: [{ type: "text", name: "q" }] }
    ] });
    const src = <QuestionPanelDynamicModel>survey.getQuestionByName("src");
    setPanel(src, 0, "x");
    expect(survey.getValue("m"), "#1: m").toEqual([{ q: "x" }]);
    expect(survey.getValue("p"), "#1: p").toEqual([{ q: "x" }]);
    setPanel(src, 0, "y");
    expect(survey.getValue("m"), "#2: m").toEqual([{ q: "y" }]);
    expect(survey.getValue("p"), "#2: p").toEqual([{ q: "y" }]);
  });
  test("a detach stores the records of the authored count, for both", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 3 }, { panelCount: 3 });
    m.dataSource = ArrayDynamicDataSource.fromArray([{ q: "a" }]);
    p.dataSource = ArrayDynamicDataSource.fromArray([{ q: "a" }]);
    expect(survey.data, "#1: attached").toEqual({});
    m.dataSource = undefined;
    p.dataSource = undefined;
    checkSame(survey, m, p, [{}, {}, {}], "#2: detached");
  });
  test("a data source: no records are stored on a count change, an add or first rendering", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "q", cellType: "text" }] },
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [{ type: "text", name: "q" }] }
    ] });
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const p = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    const mSource = ArrayDynamicDataSource.fromArray([{ q: "a" }]);
    const pSource = ArrayDynamicDataSource.fromArray([{ q: "a" }]);
    m.dataSource = mSource;
    p.dataSource = pSource;
    m.addRow();
    p.addPanel();
    expect(survey.data, "#1").toEqual({});
    expect(mSource.count, "#2: m source").toBe(2);
    expect(pSource.count, "#2: p source").toBe(2);
  });
  test("a detail panel question set and cleared keeps the empty records", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 2, detailPanelMode: "underRow",
      columns: [{ name: "q", cellType: "text" }], detailElements: [{ type: "text", name: "d" }] }] });
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    m.visibleRows[1].showDetailPanel();
    const d = m.visibleRows[1].detailPanel.getQuestionByName("d");
    d.value = "v";
    expect(survey.data, "#1").toEqual({ m: [{}, { d: "v" }] });
    d.clearValue();
    expect(survey.data, "#2").toEqual({ m: [{}, {}] });
  });
  test("the plain data of an untouched matrix follows its value, as the panel's", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 2 }, { panelCount: 2 });
    const plain = survey.getPlainData();
    const mData = plain.filter((item: any) => item.name === "m")[0];
    const pData = plain.filter((item: any) => item.name === "p")[0];
    expect(mData.value, "#1").toEqual([{}, {}]);
    expect(pData.value, "#2").toEqual([{}, {}]);
    expect(m.isEmpty(), "#3").toBe(true);
  });
  test("a cell set and cleared keeps the empty records", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 2 }, { panelCount: 2 });
    setCell(m, 1, "v");
    setPanel(p, 1, "v");
    checkSame(survey, m, p, [{}, { q: "v" }], "#1");
    setCell(m, 1, "");
    setPanel(p, 1, "");
    checkSame(survey, m, p, [{}, {}], "#2");
    expect(survey.data, "#3").toEqual({ m: [{}, {}], p: [{}, {}] });
  });
  test("the only answered row removed: the empty records stay", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 3 }, { panelCount: 3 });
    setCell(m, 2, "v");
    setPanel(p, 2, "v");
    m.removeRow(2, false);
    p.removePanel(2, false);
    expect(m.rowCount, "#1").toBe(2);
    expect(p.panelCount, "#2").toBe(2);
    checkSame(survey, m, p, [{}, {}], "#3");
    expect(survey.data, "#4").toEqual({ m: [{}, {}], p: [{}, {}] });
  });
  test("survey.data with empty records, a cell set and cleared: the records stay", () => {
    const { survey, m, p } = createSurveyWithBoth();
    survey.data = { m: [{}, {}], p: [{}, {}] };
    setCell(m, 0, "v");
    setPanel(p, 0, "v");
    setCell(m, 0, "");
    setPanel(p, 0, "");
    checkSame(survey, m, p, [{}, {}], "#1");
    expect(survey.data, "#2").toEqual({ m: [{}, {}], p: [{}, {}] });
  });
  test("addRow keeps the trailing empty records", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 1 }, { panelCount: 1 });
    setCell(m, 0, "v");
    setPanel(p, 0, "v");
    m.addRow();
    p.addPanel();
    expect(m.rowCount, "#1").toBe(2);
    checkSame(survey, m, p, [{ q: "v" }, {}], "#2");
    m.addRow();
    p.addPanel();
    expect(m.rowCount, "#3").toBe(3);
    checkSame(survey, m, p, [{ q: "v" }, {}, {}], "#4");
    expect(survey.data, "#5").toEqual({ m: [{ q: "v" }, {}, {}], p: [{ q: "v" }, {}, {}] });
  });
  test("addRow on a matrix with no rows", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 0 }, { panelCount: 0 });
    m.addRow();
    p.addPanel();
    m.addRow();
    p.addPanel();
    expect(m.rowCount, "#1").toBe(2);
    checkSame(survey, m, p, [{}, {}], "#2");
    expect(survey.data, "#3").toEqual({ m: [{}, {}], p: [{}, {}] });
  });
  test("the cases that work today stay", () => {
    let { survey, m, p } = createSurveyWithBoth({ rowCount: 3 }, { panelCount: 3 });
    setCell(m, 1, "v");
    setPanel(p, 1, "v");
    checkSame(survey, m, p, [{}, { q: "v" }, {}], "#1: a middle cell");
    ({ survey, m, p } = createSurveyWithBoth({ rowCount: 2 }, { panelCount: 2 }));
    m.addRow();
    p.addPanel();
    setCell(m, 0, "v");
    setPanel(p, 0, "v");
    checkSame(survey, m, p, [{ q: "v" }, {}, {}], "#2: added, then the first cell");
    ({ survey, m, p } = createSurveyWithBoth());
    survey.data = { m: [{}, { q: "v" }, {}], p: [{}, { q: "v" }, {}] };
    checkSame(survey, m, p, [{}, { q: "v" }, {}], "#3: survey.data");
    ({ survey, m, p } = createSurveyWithBoth({ rowCount: 2, defaultRowValue: { q: "d" } }, { panelCount: 2, defaultPanelValue: { q: "d" } }));
    checkSame(survey, m, p, [{ q: "d" }, { q: "d" }], "#4: the default row value");
  });
  test("minRowCount: 2, a cell set and cleared", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 2, minRowCount: 2 }, { panelCount: 2, minPanelCount: 2 });
    setCell(m, 0, "v");
    setPanel(p, 0, "v");
    setCell(m, 0, "");
    setPanel(p, 0, "");
    checkSame(survey, m, p, [{}, {}], "#1");
    expect(survey.data, "#2").toEqual({ m: [{}, {}], p: [{}, {}] });
  });
  test("a matrix inside a dynamic panel, a cell set and cleared", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "outer", panelCount: 1,
      templateElements: [{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "q", cellType: "text" }] }] }] });
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const m = <QuestionMatrixDynamicModel>outer.panels[0].getQuestionByName("m");
    setCell(m, 1, "v");
    expect(survey.data, "#1").toEqual({ outer: [{ m: [{}, { q: "v" }] }] });
    setCell(m, 1, "");
    expect(m.value, "#2").toEqual([{}, {}]);
    expect(survey.data, "#3").toEqual({ outer: [{ m: [{}, {}] }] });
  });
  test("an all-empty matrix is still empty: required fails, not answered", () => {
    const { survey, m, p } = createSurveyWithBoth({ rowCount: 2, isRequired: true }, { panelCount: 2, isRequired: true });
    checkSame(survey, m, p, [{}, {}], "#1");
    expect(m.isEmpty(), "#2").toBe(true);
    expect(p.isEmpty(), "#3").toBe(true);
    expect(m.isAnswered, "#4").toBe(false);
    expect(p.isAnswered, "#5").toBe(false);
    expect(m.validate(), "#6").toBe(false);
    expect(p.validate(), "#7").toBe(false);
  });
  test("design mode writes no value", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "q", cellType: "text" }] },
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [{ type: "text", name: "q" }] }
    ] });
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows;
    expect(survey.data, "#1").toEqual({});
  });
});
