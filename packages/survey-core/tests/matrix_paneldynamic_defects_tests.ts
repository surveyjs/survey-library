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
    expect(survey.data, "#1: no defaults written").toEqual({});
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
    const paged = createPanel({ panelCount: 0, panelsState: "expanded", panelsPerPage: 5 });
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
    const { survey, panel } = createPanel({ panelCount: 1, panelsPerPage: 5 });
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

describe("matrix column: isRequired and renderAs are stored once", () => {
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
  test("renderAs: one change, one notification", () => {
    const matrix = createMatrix();
    const changed = vi.spyOn(matrix, "onColumnPropertyChanged");
    matrix.columns[1].renderAs = "checkbox";
    expect(changed.mock.calls.map(c => c[1]), "#1").toEqual(["renderAs"]);
    expect(matrix.visibleRows[0].cells[1].question.renderAs, "#2").toBe("checkbox");
  });
  test("renderAs: the column reads the template question", () => {
    const matrix = createMatrix();
    const column = matrix.columns[1];
    column.renderAs = "checkbox";
    column.templateQuestion.renderAs = "default";
    expect(column.renderAs, "#1").toBe("default");
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
  test("a boolean column loaded with renderAs checkbox serializes as the boolean question does", () => {
    const survey = createSurvey([{ type: "boolean", name: "b", renderAs: "checkbox" },
      { type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "boolean", renderAs: "checkbox" }] }]);
    const question = survey.getQuestionByName("b");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(question.toJSON(), "#1: the question").toEqual({ name: "b", displayMode: "checkbox" });
    expect(matrix.toJSON().columns, "#2: the column").toEqual([{ name: "c", cellType: "boolean", displayMode: "checkbox" }]);
    expect(matrix.columns[0].renderAs, "#3").toBe(question.renderAs);
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
