import { describe, test, expect, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { Question } from "../../src/question";
import { PanelModel } from "../../src/panel";
import { FunctionFactory } from "../../src/functionsfactory";
import { settings } from "../../src/settings";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { DragDropMatrixRows } from "../../src/dragdrop/matrix-rows";
import { Helpers } from "../../src/helpers";
import { ItemValue } from "../../src/itemvalue";
import {
  getPageState, setPageState, flush, records, createPanelSurvey, createPanel, matrixColumns, createMatrixSurvey,
  createMatrix, panelIds, rowIds, countCreatedRows, range, PagedSource
} from "./page-window-helpers";

/* With paging on, the panels and rows that exist are the current page, for an in-memory list as for
   a data source that pages itself. */

describe("Page window: the edited records under siblings, tabs and asynchronous pages", () => {
  const results: Array<(res: any) => void> = [];
  function asyncEditedPageFunc(params: any): any {
    results.push(this.returnResult);
    return false;
  }
  afterEach(() => {
    FunctionFactory.Instance.unregister("asyncEditedPageFunc");
  });
  const settle = (): void => {
    // A continuation may start validators of its own: settle until nothing is left.
    for (let i = 0; i < 10 && results.length > 0; i++) {
      results.splice(0, results.length).forEach(setResult => setResult(1));
    }
  };
  test("layer 2 goes on to the remaining edited pages once an asynchronous page settles", () => {
    results.length = 0;
    FunctionFactory.Instance.register("asyncEditedPageFunc", asyncEditedPageFunc, true);
    const data = records(15);
    delete data[10].name;
    const survey = createPanelSurvey({ pageSize: 5, templateElements: [{ type: "text", name: "id" },
      { type: "text", name: "name", isRequired: true, validators: [{ type: "expression", expression: "asyncEditedPageFunc({panel.id}) = 1" }] },
      { type: "text", name: "note" }] }, data);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    question.panels[0].getQuestionByName("note").value = "edited";
    question.pageIndex = 2;
    question.panels[0].getQuestionByName("note").value = "edited";
    question.pageIndex = 0;
    results.length = 0;
    survey.tryComplete();
    settle();
    expect(survey.state, "#1: page 2 was checked after the asynchronous page 1").toBe("running");
    expect(question.pageIndex, "#2: and shown").toBe(2);
    expect(question.panels[0].getQuestionByName("name").errors.length, "#3").toBe(1);
  });
  test("a tab Next validates the panel it leaves only: the other edited records of the page stay tracked", () => {
    const data = records(20);
    delete data[3].name;
    const survey = createPanelSurvey({ displayMode: "tab", pageSize: 5,
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }] }, data);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.currentIndex = 3;
    question.currentPanel.getQuestionByName("note").value = "edited";
    question.currentIndex = 0;
    expect(question.goToNextPanel(), "#1").toBe(true);
    question.pageIndex = 1;
    expect(survey.tryComplete(), "#2: record 3 is still checked").toBe(false);
    expect(question.currentIndex, "#3").toBe(3);
  });
  test("a sibling's append keeps the edited records of the other question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", pageSize: 5, templateElements: [{ type: "text", name: "id" }] },
        { type: "paneldynamic", name: "B", valueName: "rec", pageSize: 5,
          templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }] }
      ]
    });
    survey.data = { rec: records(20) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    b.panels[2].getQuestionByName("name").value = "";
    b.pageIndex = 1;
    a.addPanel();
    expect(b.panelCount, "#1").toBe(21);
    expect(survey.tryComplete(), "#2: B still checks record 2").toBe(false);
    expect(b.pageIndex, "#3").toBe(0);
  });
  test("a sibling's insert in front of an edited record moves it along", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", pageSize: 5, templateElements: [{ type: "text", name: "id" }] },
        { type: "paneldynamic", name: "B", valueName: "rec", pageSize: 5,
          templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] }
      ]
    });
    survey.data = { rec: records(20) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    b.panels[4].getQuestionByName("name").value = "";
    b.pageIndex = 2;
    a.addPanel(0);
    expect(survey.tryComplete(), "#1: the edited record is record 5 now").toBe(false);
    expect(b.pageIndex, "#2: its page").toBe(1);
    expect(b.panels[0].getQuestionByName("id").value, "#3").toBe(4);
  });
  test("a key named like an Object.prototype member is compared too", () => {
    const data = records(100);
    data[40].name = "__proto__";
    data[70].name = "__proto__";
    const survey = createPanelSurvey({ pageSize: 20, keyName: "name" }, data);
    expect(survey.tryComplete(), "#1: the panel").toBe(false);
    const msurvey = createMatrixSurvey({ pageSize: 20, keyName: "name" }, data);
    (<QuestionMatrixDynamicModel>msurvey.getQuestionByName("md")).visibleRows;
    expect(msurvey.tryComplete(), "#2: the matrix").toBe(false);
  });
  test("a sibling's remove in front of an edited record moves it back", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "A", valueName: "rec", pageSize: 5, templateElements: [{ type: "text", name: "id" }] },
        { type: "paneldynamic", name: "B", valueName: "rec", pageSize: 5,
          templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] }
      ]
    });
    survey.data = { rec: records(20) };
    const a = <QuestionPanelDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionPanelDynamicModel>survey.getQuestionByName("B");
    b.pageIndex = 1;
    b.panels[0].getQuestionByName("name").value = "";
    b.pageIndex = 3;
    a.removePanel(0);
    expect(b.panelCount, "#1").toBe(19);
    expect(survey.tryComplete(), "#2: the edited record is record 4 now").toBe(false);
    expect(b.pageIndex, "#3: its page").toBe(0);
    expect(b.panels[4].getQuestionByName("id").value, "#4").toBe(5);
  });
  test("a sibling's append keeps the edited rows of the other matrix", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "A", valueName: "rec", rowCount: 0, pageSize: 5, columns: [{ name: "id", cellType: "text" }] },
        { type: "matrixdynamic", name: "B", valueName: "rec", rowCount: 0, pageSize: 5,
          columns: [{ name: "id", cellType: "text" }, { name: "name", cellType: "text", isRequired: true }] }
      ]
    });
    survey.data = { rec: records(20) };
    const a = <QuestionMatrixDynamicModel>survey.getQuestionByName("A");
    const b = <QuestionMatrixDynamicModel>survey.getQuestionByName("B");
    b.visibleRows[2].getQuestionByColumnName("name").value = "";
    b.pageIndex = 1;
    a.addRow();
    // A matrix value holds no empty row: the append reaches B with the first cell value.
    a.visibleRows[a.visibleRows.length - 1].getQuestionByColumnName("id").value = 20;
    expect(b.rowCount, "#1").toBe(21);
    expect(survey.tryComplete(), "#2: B still checks record 2").toBe(false);
    expect(b.pageIndex, "#3").toBe(0);
  });
  test("a matrix key named like an Object.prototype member on one page is compared, not thrown on", () => {
    const data = records(10);
    data[2].name = "__proto__";
    data[5].name = "__proto__";
    const survey = createMatrixSurvey({ keyName: "name" }, data);
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("md")).visibleRows;
    expect(survey.tryComplete(), "#1").toBe(false);
  });
});

/* An assignment from outside - survey.setValue, a sibling on the same valueName - has the edited set
   follow its records. valueChangedCallback fires inside the assignment, and a write through the list
   made there is an assignment of its own: the outer one still follows its records afterwards. */
describe("Page window: an assignment made while another one is running", () => {
  test("panel: the outer assignment still moves the edited set along", () => {
    const survey = createPanelSurvey({ pageSize: 2, templateElements: [{ type: "text", name: "id" }, { type: "text", name: "a" }] },
      records(6, (i: number) => ({ id: "r" + i })));
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.pageIndex = 1;
    question.panels[1].getQuestionByName("a").value = "x";
    question.pageIndex = 0;
    expect(getPageState(question).edited, "#1: record 3 is edited and off the page").toEqual([3]);
    let calls = 0;
    // Fired inside Question.setQuestionValue: the write through the list is an assignment of its own.
    question.valueChangedCallback = (): void => {
      calls++;
      if (calls === 1) question["dataList"].setValue(0, "a", "zz");
    };
    const data = [].concat(survey.getValue("pd"));
    data.splice(1, 1);
    survey.setValue("pd", data);
    expect(calls, "#2: the outer assignment and the nested one").toBe(2);
    expect(getPageState(question).edited, "#3: the edited record is record 2 now; record 0 was written").toEqual([0, 2]);
  });
  test("matrix: the outer assignment still moves the edited set along", () => {
    const survey = createMatrixSurvey({ pageSize: 2, columns: [{ name: "id", cellType: "text" }, { name: "a", cellType: "text" }] },
      records(6, (i: number) => ({ id: "r" + i })));
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    question.pageIndex = 1;
    question.visibleRows[1].getQuestionByName("a").value = "x";
    question.pageIndex = 0;
    expect(getPageState(question).edited, "#1: record 3 is edited and off the page").toEqual([3]);
    let calls = 0;
    question.valueChangedCallback = (): void => {
      calls++;
      if (calls === 1) question["dataList"].setValue(5, "a", "zz");
    };
    // Records 2 and 3 change places; the count stays.
    const data = [].concat(survey.getValue("md"));
    data.splice(2, 2, data[3], data[2]);
    survey.setValue("md", data);
    expect(calls, "#2: the outer assignment and the nested one").toBe(2);
    /* Wider than the panel's: the nested write changed a record of the part the content remap
       compares, so the change cannot be placed and the whole changed part is marked. */
    expect(getPageState(question).edited, "#3").toEqual([2, 3, 4, 5]);
    expect(getPageState(question).edited.indexOf(2) > -1, "#4: the index the edited record has now").toBe(true);
  });
});

// A question without a data source has every capability, and asking it does not create its list.
describe("Page window: the capabilities of a question without a list", () => {
  test("matrix: canAddRow, canRemoveRows and isMatrixReadOnly create no list", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 2, columns: [{ name: "col1" }] }]
    });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(question.canAddRow, "#1").toBe(true);
    expect(question.canRemoveRows, "#2").toBe(true);
    expect(question.isMatrixReadOnly(), "#3").toBe(false);
    expect(!!(<any>question).dataListValue, "#4: the reads created nothing").toBe(false);
  });
  test("panel: canAddPanel and canRemovePanel create no list", () => {
    const question = new QuestionPanelDynamicModel("panel");
    question.template.addNewQuestion("text", "col1");
    expect(question.canAddPanel, "#1").toBe(true);
    expect(question.canRemovePanel, "#2: there is no panel to remove").toBe(false);
    expect(!!(<any>question).dataListValue, "#3: the reads created nothing").toBe(false);
  });
});

/* Only a full validation that fires its callbacks visits the pages that hold edited records (layer
   2); a validation on a value change and a quiet one stay on the page. */
describe("Page window: which validation visits the pages of the edited records", () => {
  [false, true].forEach((isMatrix: boolean): void => {
    const kind = isMatrix ? "matrix" : "panel";
    const setup = (checkErrorsMode?: string): { survey: SurveyModel, question: any, editOnPage: () => void } => {
      const data = records(12);
      const json = { templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }, { type: "text", name: "note" }],
        columns: [{ name: "id", cellType: "text" }, { name: "name", cellType: "text", isRequired: true }, { name: "note", cellType: "text" }] };
      const survey = isMatrix ? createMatrixSurvey(Object.assign({ pageSize: 5 }, { columns: json.columns }), data)
        : createPanelSurvey(Object.assign({ pageSize: 5 }, { templateElements: json.templateElements }), data);
      if (!!checkErrorsMode) survey.checkErrorsMode = <any>checkErrorsMode;
      const question: any = survey.getQuestionByName(isMatrix ? "md" : "pd");
      const objects = (): Array<any> => isMatrix ? question.visibleRows : question.panels;
      question.pageIndex = 1;
      objects()[1].getQuestionByName("name").value = "";
      question.pageIndex = 0;
      expect(getPageState(question).edited, "an invalid edited record off the page").toEqual([6]);
      return { survey: survey, question: question, editOnPage: (): void => { objects()[0].getQuestionByName("note").value = "typed"; } };
    };
    test(kind + ": a validation on a value change stays on the page", () => {
      const { question, editOnPage } = setup("onValueChanged");
      editOnPage();
      expect(question.pageIndex, "#1: an edit on the page, the page stays").toBe(0);
      expect(getPageState(question).edited, "#2").toEqual([0, 6]);
      const value = question.value.map((record: any): any => Object.assign({}, record));
      value[1].note = "assigned";
      question.value = value;
      expect(question.pageIndex, "#3: an assignment of the value, the page stays").toBe(0);
      expect(getPageState(question).edited, "#4").toEqual([0, 6]);
    });
    test(kind + ": a validation that fires no callback stays on the page and reports the edited record's error", () => {
      const { question } = setup();
      expect(question.validate(false), "#1: the edited record of another page has an error").toBe(false);
      expect(question.pageIndex, "#2: the page stays").toBe(0);
      expect(question.validate(true), "#3: a full validation finds the edited record").toBe(false);
      expect(question.pageIndex, "#4: on its page").toBe(1);
    });
  });
});

/* A paged matrix nested in a paged dynamic panel hands its page and its edited set to the outer
   question when the outer panel is rebuilt, and gets them back in the new panel. */
describe("Page window: the page state of a nested paged matrix", () => {
  const nestedJson = {
    elements: [{
      type: "paneldynamic", name: "outer", pageSize: 2,
      templateElements: [{ type: "text", name: "id" }, {
        type: "matrixdynamic", name: "items", rowCount: 0, pageSize: 4,
        columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]
      }]
    }]
  };
  test("the matrix comes back on its page with its edited set, and one on page 0 stays there", () => {
    const survey = new SurveyModel(nestedJson);
    survey.data = { outer: records(6, (i: number) => ({ id: i, items: records(12, (j: number) => ({ a: "a" + j })) })) };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const matrixOf = (id: number): QuestionMatrixDynamicModel => {
      const panel = outer.panels.filter(p => p.getQuestionByName("id").value === id)[0];
      return <QuestionMatrixDynamicModel>panel.getQuestionByName("items");
    };
    const matrix = matrixOf(1);
    const other = matrixOf(0);
    matrix.pageIndex = 2;
    matrix.visibleRows[1].getQuestionByName("b").value = "x";
    expect(getPageState(matrix), "#1").toEqual({ pageIndex: 2, edited: [9], nested: {} });
    expect(getPageState(other), "#2").toEqual({ pageIndex: 0, edited: [], nested: {} });
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(matrixOf(1) === matrix, "#3: the matrix was rebuilt").toBe(false);
    expect(matrixOf(1).pageIndex, "#4: on its page again").toBe(2);
    expect(getPageState(matrixOf(1)), "#5: with its edited set").toEqual({ pageIndex: 2, edited: [9], nested: {} });
    expect(matrixOf(1).visibleRows[1].getQuestionByName("b").value, "#6").toBe("x");
    expect(matrixOf(0) === other, "#7").toBe(false);
    expect(matrixOf(0).pageIndex, "#8: page 0 stays page 0").toBe(0);
    expect(getPageState(matrixOf(0)), "#9").toEqual({ pageIndex: 0, edited: [], nested: {} });
  });
  test("a page state restored into a rebuilt panel and changed there leaves the state its ancestor keeps alone", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "outer", pageSize: 1,
        templateElements: [{
          type: "paneldynamic", name: "middle", pageSize: 1,
          templateElements: [{ type: "matrixdynamic", name: "inner", rowCount: 0, pageSize: 1, columns: [{ name: "a", cellType: "text" }] }]
        }]
      }]
    });
    const middleRecords = (): Array<any> => records(2, (j: number) => ({ inner: records(3, (k: number) => ({ a: j + "-" + k })) }));
    survey.data = { outer: [{ middle: middleRecords() }, { middle: middleRecords() }] };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const middleOf = (): QuestionPanelDynamicModel => <QuestionPanelDynamicModel>outer.panels[0].getQuestionByName("middle");
    const middle = middleOf();
    middle.pageIndex = 1;
    outer.pageIndex = 1;
    const kept = (<any>outer)._pageValidation.getNestedStates(0)["middle"];
    const keptCopy = JSON.parse(JSON.stringify(kept));
    outer.pageIndex = 0;
    const rebuilt = middleOf();
    expect(rebuilt === middle, "#1: the middle panel was rebuilt").toBe(false);
    expect(rebuilt.pageIndex, "#2: on its page again").toBe(1);
    (<QuestionMatrixDynamicModel>rebuilt.panels[0].getQuestionByName("inner")).pageIndex = 2;
    rebuilt.pageIndex = 0;
    expect(getPageState(rebuilt).nested[1].inner.pageIndex, "#3: the rebuilt panel keeps the inner page").toBe(2);
    expect(kept, "#4: the state the outer panel keeps did not change").toEqual(keptCopy);
  });
  test("an outside assignment that inserts a record in front of the page keeps the matrix of each record on its page", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "p", pageSize: 1,
        templateElements: [{ type: "text", name: "id" }, { type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 1, columns: [{ name: "a", cellType: "text" }] }]
      }]
    });
    const r0 = { id: "r0", m: [{ a: "r0-0" }, { a: "r0-1" }, { a: "r0-2" }] };
    const r1 = { id: "r1", m: [{ a: "r1-0" }, { a: "r1-1" }] };
    survey.data = { p: [r0, r1] };
    const p = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    const shown = (): Array<any> => {
      const panel = p.panels[0];
      const m = <QuestionMatrixDynamicModel>panel.getQuestionByName("m");
      return [panel.getQuestionByName("id").value, m.pageIndex];
    };
    (<QuestionMatrixDynamicModel>p.panels[0].getQuestionByName("m")).pageIndex = 2;
    p.pageIndex = 1;
    expect(shown(), "#1").toEqual(["r1", 0]);
    survey.setValue("p", [{ id: "x", m: [{ a: "x-0" }] }, r0, r1]);
    expect(shown(), "#2: page 1 holds r0 now, with its matrix on its page").toEqual(["r0", 2]);
    p.pageIndex = 2;
    expect(shown(), "#3").toEqual(["r1", 0]);
    p.pageIndex = 1;
    expect(shown(), "#4: r0's matrix is still on its page").toEqual(["r0", 2]);
    p.pageIndex = 0;
    expect(shown(), "#5: the inserted record starts on page 0").toEqual(["x", 0]);
  });
  test("a state with page 0 leaves the page alone and does not drop a move that waits for its validators", () => {
    const results: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("asyncPageStateFunc", function (): any {
      results.push(this.returnResult);
      return false;
    }, true);
    try {
      const question = createMatrix({
        pageSize: 2,
        columns: [{ name: "id", cellType: "text", validators: [{ type: "expression", expression: "asyncPageStateFunc() = 1" }] },
          { name: "name", cellType: "text" }]
      }, records(6));
      expect(question.visibleRows.length, "#1: the page is built").toBe(2);
      expect(question.nextPage(), "#2").toBe(true);
      expect(question.isPageMovePending, "#3: the move waits for its validators").toBe(true);
      setPageState(question, { pageIndex: 0, edited: [4], nested: {} });
      expect(question.isPageMovePending, "#4: still pending").toBe(true);
      expect(getPageState(question).edited, "#5: the edited set was taken").toEqual([4]);
      results.splice(0, results.length).forEach(setResult => setResult(1));
      expect(question.isPageMovePending, "#6").toBe(false);
      expect(question.pageIndex, "#7: the late result moves the page").toBe(1);
    } finally {
      FunctionFactory.Instance.unregister("asyncPageStateFunc");
    }
  });
});

/* The matrix scans every unique column for a pair both of whose records have no row: owner-hidden
   records take part, strings compare as the matrix's useCaseSensitiveComparison says, and a padded
   record is read as the default row value it will get. */
describe("Page window: matrix duplicates off the page", () => {
  test("every unique column is scanned: the pages of both pairs are visited in page order", () => {
    const data = records(20, (i: number) => ({ id: "k" + i, name: "n" + i }));
    data[13].name = "n8";
    data[17].id = "k16";
    const survey = createMatrixSurvey({ pageSize: 5, keyName: "name",
      columns: [{ name: "id", cellType: "text", isUnique: true }, { name: "name", cellType: "text" }] }, data);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.visibleRows;
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2: the keyName pair goes on page 2").toBe(2);
    expect(matrix.visibleRows[3].getQuestionByName("name").errors.length, "#3: on record 13").toBe(1);
    matrix.visibleRows[3].getQuestionByName("name").value = "n13";
    matrix.pageIndex = 0;
    expect(survey.tryComplete(), "#4").toBe(false);
    expect(matrix.pageIndex, "#5: the isUnique pair is on page 3").toBe(3);
    expect(matrix.visibleRows[2].getQuestionByName("id").errors.length, "#6: on record 17").toBe(1);
  });
  test("strings compare as useCaseSensitiveComparison says", () => {
    const create = (caseSensitive: boolean): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } => {
      const data = records(20);
      data[17].name = "N12";
      const survey = createMatrixSurvey({ pageSize: 5, keyName: "name" }, data);
      const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
      matrix.useCaseSensitiveComparison = caseSensitive;
      matrix.visibleRows;
      return { survey: survey, matrix: matrix };
    };
    const insensitive = create(false);
    expect(insensitive.survey.tryComplete(), "#1: n12 and N12 are a pair").toBe(false);
    expect(insensitive.matrix.pageIndex, "#2").toBe(3);
    const sensitive = create(true);
    expect(sensitive.survey.tryComplete(), "#3: they differ").toBe(true);
  });
  test("an owner-hidden record does not take part, as a hidden row does not without paging", () => {
    const data = records(20, (i: number) => ({ id: i, name: "n" + i, hide: i === 17 }));
    data[17].name = "n12";
    const survey = createMatrixSurvey({ pageSize: 5, keyName: "name", rowsVisibleIf: "{row.hide} != true" }, data);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.visibleRows;
    expect(matrix["dataList"].visibleCount, "#1: record 17 is hidden").toBe(19);
    expect(survey.tryComplete(), "#2: no pair").toBe(true);
    const unpaged = createMatrixSurvey({ keyName: "name", rowsVisibleIf: "{row.hide} != true" }, data);
    expect(unpaged.tryComplete(), "#3: the same without paging").toBe(true);
  });
  test("padded records are read as the default row value", () => {
    // A value assigned shorter than rowCount after the rows are built keeps rowCount (the rowCount setter
    // stores the records, and a build writes the default row value back).
    const survey = createMatrixSurvey({ rowCount: 12, pageSize: 5, keyName: "name", defaultRowValue: { name: "same" } });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.visibleRows;
    matrix.value = records(10);
    expect(matrix.rowCount, "#1: rowCount").toBe(12);
    expect(matrix.getPropertyValueWithoutDefault("value").length, "#1: records 10 and 11 are padded, not stored").toBe(10);
    expect(matrix.pageIndex, "#2").toBe(0);
    expect(survey.tryComplete(), "#3: the two padded records are a pair").toBe(false);
    expect(matrix.pageIndex, "#4").toBe(2);
    expect(matrix.visibleRows[1].getQuestionByName("name").errors.length, "#5: on record 11").toBe(1);
  });
  test("without a key and without unique columns no field is unique and no page is visited for duplicates", () => {
    const data = records(10, (i: number) => ({ id: "same", name: "same" }));
    const matrix = createMatrix({ pageSize: 5 }, data);
    const panel = createPanel({ pageSize: 5 }, data);
    [matrix, panel].forEach((question: Question, i: number): void => {
      expect(question["getRecordUniqueness"]().fields, "#" + i + ": no field").toEqual([]);
      expect(question["getOffPageDuplicatePages"](), "#" + i + ": no page").toEqual([]);
      expect((<SurveyModel>question.survey).tryComplete(), "#" + i + ": equal values are no duplicates").toBe(true);
    });
  });
});

/* A dynamic panel that pages keeps the page states of the paged questions nested in its panels
   under their records while the panels are rebuilt. */
describe("Page window: the nested page states a rebuilt panel keeps", () => {
  // A list that pages creates the page validation with its first change; a sort rebuilds the panels
  // of one that does not.
  test("a rebuild without a nested paged question keeps no state at all", () => {
    const question = createPanel({}, records(5));
    expect(panelIds(question), "#1").toEqual(range(0, 4));
    question.sort([{ field: "id", direction: "desc" }]);
    expect(panelIds(question), "#2: the panels were rebuilt").toEqual([4, 3, 2, 1, 0]);
    expect((<any>question)._pageValidation, "#3: no page validation was created").toBeUndefined();
  });
  test("a record whose nested question stopped paging drops the state it had", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "outer", pageSize: 2,
        templateElements: [{ type: "text", name: "id" }, {
          type: "matrixdynamic", name: "items", rowCount: 0, pageSize: 4,
          columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]
        }]
      }]
    });
    survey.data = { outer: records(6, (i: number) => ({ id: i, items: records(12, (j: number) => ({ a: "a" + j })) })) };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const matrixOf = (id: number): QuestionMatrixDynamicModel => {
      const panel = outer.panels.filter(p => p.getQuestionByName("id").value === id)[0];
      return <QuestionMatrixDynamicModel>panel.getQuestionByName("items");
    };
    matrixOf(1).pageIndex = 2;
    matrixOf(1).visibleRows[1].getQuestionByName("b").value = "x";
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(matrixOf(1).pageIndex, "#1: the state came back").toBe(2);
    matrixOf(1).pageSize = 0;
    expect(getPageState(matrixOf(1)), "#2: a matrix that does not page has no state").toBeUndefined();
    outer.pageIndex = 1;
    outer.pageIndex = 0;
    expect(matrixOf(1).pageSize, "#3: the new matrix pages again").toBe(4);
    expect(matrixOf(1).pageIndex, "#4: the old state is not handed back").toBe(0);
    expect(getPageState(matrixOf(1)), "#5").toEqual({ pageIndex: 0, edited: [], nested: {} });
  });
});

/* A record added under paging that the view does not show - rowsVisibleIf or templateVisibleIf
   hides it. The two questions differ here, and both are kept as they are: the matrix stays on its
   page, the panel goes to page 0 (the visible index -1 is on page 0). */
describe("Page window: an added record the view does not show", () => {
  test("matrix: the page stays, the record is tracked as edited", () => {
    const matrix = createMatrix({ pageSize: 2, rowsVisibleIf: "{row.name} notempty" }, records(6));
    matrix.visibleRows;
    matrix.pageIndex = 1;
    matrix.addRow();
    expect(matrix.rowCount, "#1").toBe(7);
    expect(matrix["dataList"].visibleCount, "#2: the new record is hidden").toBe(6);
    expect(matrix.pageIndex, "#3: the page stays").toBe(1);
    expect(rowIds(matrix), "#4").toEqual([2, 3]);
    expect(getPageState(matrix).edited, "#5").toEqual([6]);
  });
  test("panel: the question stays on its page, as the matrix does, and returns no panel", () => {
    const question = createPanel({ pageSize: 2, templateVisibleIf: "{panel.name} notempty" }, records(6));
    question.pageIndex = 1;
    const added: Array<any> = [];
    question.survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panel); });
    const res = question.addPanel();
    expect(question.panelCount, "#1").toBe(7);
    expect(question["dataList"].visibleCount, "#2: the new record is hidden").toBe(6);
    expect(question.pageIndex, "#3: the page stays").toBe(1);
    expect(panelIds(question), "#4").toEqual([2, 3]);
    expect(res, "#5: no panel").toBeNull();
    expect(added, "#6: and onDynamicPanelAdded is not raised").toEqual([]);
    expect(getPageState(question).edited, "#7").toEqual([6]);
  });
  test("panel in tab mode: the page and the current panel stay", () => {
    const question = createPanel({ pageSize: 2, displayMode: "tab", templateVisibleIf: "{panel.name} notempty" }, records(6));
    question.currentIndex = 3;
    expect(question.pageIndex, "#1").toBe(1);
    question.addPanel();
    expect(question.pageIndex, "#2").toBe(1);
    expect(question.currentIndex, "#3").toBe(3);
    expect(question.currentPanel.getQuestionByName("id").value, "#4").toBe(3);
  });
});

/* What an added record does to the objects that exist: the objects in front of an appended one are
   kept; an insert in front of objects moves them onto other records, and they are rebuilt. */
describe("Page window: the objects an added record keeps", () => {
  test("matrix: an added record rowsVisibleIf hides gets no row and raises no onMatrixRowAdded", () => {
    const survey = createMatrixSurvey({ pageSize: 2, rowsVisibleIf: "{row.name} notempty" }, records(6));
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.visibleRows;
    matrix.pageIndex = 1;
    const added: Array<any> = [];
    survey.onMatrixRowAdded.add((_, options) => { added.push(options.row); });
    matrix.addRow();
    expect(matrix.rowCount, "#1").toBe(7);
    expect(rowIds(matrix), "#2: the page stays").toEqual([2, 3]);
    expect(added.length, "#3: no row, no event").toBe(0);
  });
  test("panel: an append on the page in force keeps the panels, their state and their questions", () => {
    const survey = createPanelSurvey({ pageSize: 5, templateTitle: "Item {panelIndex}", defaultPanelValue: { name: "new" },
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name", isRequired: true }] },
    [{ id: 0, name: "n0" }, { id: 1 }]);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const before = question.panels.slice();
    before[0].collapse();
    before[1].validate(true);
    expect(before[1].getQuestionByName("name").errors.length, "#0").toBe(1);
    const created: Array<string> = [];
    survey.onQuestionCreated.add((_, options) => { created.push(options.question.name); });
    const added: Array<any> = [];
    survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panel); });
    const res = question.addPanel();
    expect(question.panels.length, "#1").toBe(3);
    expect(before.every((panel, i) => question.panels[i] === panel), "#2: the panels in front are kept").toBe(true);
    expect(before[0].isCollapsed, "#3: the collapsed panel stays collapsed").toBe(true);
    expect(before[1].getQuestionByName("name").errors.length, "#4: the error stays shown").toBe(1);
    expect(before.every(panel => !panel.isDisposed), "#5: no panel is disposed").toBe(true);
    expect(created, "#6: only the new panel's questions are created").toEqual(["id", "name"]);
    expect(added.length === 1 && added[0] === res, "#7: one onDynamicPanelAdded with the new panel").toBe(true);
    expect(res.getQuestionByName("name").value, "#8: the returned panel holds the new record").toBe("new");
    expect(question.panels[2] === res, "#9").toBe(true);
    expect(question.renderedPanels.indexOf(res) > -1, "#10: it is rendered").toBe(true);
  });
  ["tab", "carousel"].forEach((mode: string): void => {
    test(mode + ": an append on the page in force keeps the panels and selects the new one", () => {
      const question = createPanel({ displayMode: mode, pageSize: 5, defaultPanelValue: { name: "new" } }, records(2));
      question.currentIndex = 1;
      const before = question.panels.slice();
      const res = question.addPanel();
      expect(before.every((panel, i) => question.panels[i] === panel), "#1: the panels are kept").toBe(true);
      expect(question.currentPanel === res, "#2: the new panel is current").toBe(true);
      expect(question.currentIndex, "#3").toBe(2);
      expect(res.getQuestionByName("name").value, "#4").toBe("new");
      expect(question.renderedPanels.length === 1 && question.renderedPanels[0] === res, "#5: and rendered").toBe(true);
    });
  });
});

describe("Page window: record visibility from an expression needs paging", () => {
  [false, true].forEach((isMatrix: boolean): void => {
    test((isMatrix ? "matrix" : "panel") + ": a record the expression hides leaves the visible count, without paging and with it", () => {
      const question: any = isMatrix ? createMatrix({ rowsVisibleIf: "{row.id} != {hideId}" }, records(4), [{ type: "text", name: "hideId" }])
        : createPanel({ templateVisibleIf: "{panel.id} != {hideId}" }, records(4), [{ type: "text", name: "hideId" }]);
      if (isMatrix) question.visibleRows;
      const list = question["dataList"];
      question.survey.setValue("hideId", 2);
      expect(list.visibleCount, "#2: the objects decide the flags").toBe(3);
      question.pageSize = 2;
      question.survey.setValue("hideId", 1);
      expect(list.visibleCount, "#4").toBe(3);
    });
  });
});

describe("Fixed matrix pages its rows", () => {
  const sevenRows = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"];
  const createFixed = (json?: any, data?: any, surveyJson?: any): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel(Object.assign({
      elements: [Object.assign({
        type: "matrixdropdown", name: "matrix", pageSize: 3, rows: sevenRows,
        columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }]
      }, json)]
    }, surveyJson));
    if (!!data) {
      survey.data = { matrix: data };
    }
    return { survey: survey, matrix: <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix") };
  };
  const names = (rows: Array<any>): Array<string> => rows.map(row => row.rowName);
  const allAnswered = (): any => {
    const res: any = {};
    sevenRows.forEach((name, i) => { res[name] = { a: "a" + (i + 1), b: i + 1 }; });
    return res;
  };
  test("pageSize loads from JSON, is written back, and the default is not written", () => {
    const { matrix } = createFixed();
    expect(matrix.pageSize, "#1").toBe(3);
    expect(matrix.toJSON().pageSize, "#2").toBe(3);
    const { matrix: unpaged } = createFixed({ pageSize: 0 });
    expect(unpaged.toJSON().pageSize, "#3: the default is not written").toBeUndefined();
    expect(unpaged.visibleRows.length, "#4: without paging every row is built").toBe(7);
  });
  test("the rows are the page, and the visible index is global", () => {
    const { matrix } = createFixed();
    expect(names(matrix.visibleRows), "#1: page 0").toEqual(["r1", "r2", "r3"]);
    expect(matrix.pageCount, "#2").toBe(3);
    expect(matrix.nextPage(), "#3").toBe(true);
    expect(names(matrix.visibleRows), "#3: page 1").toEqual(["r4", "r5", "r6"]);
    expect(matrix.visibleRows.map(row => row.visibleIndex), "#4: global positions").toEqual([3, 4, 5]);
    expect(matrix.renderedTable.rows.filter(row => row.row && !row.isDetailRow).map(row => row.row.rowName), "#5: the rendered page").toEqual(["r4", "r5", "r6"]);
    matrix.nextPage();
    expect(names(matrix.visibleRows), "#6: the one-row last page").toEqual(["r7"]);
    expect(matrix.visibleRows.map(row => row.getIndex()), "#7: it names its record").toEqual([6]);
  });
  test("a cell edit on another page writes the row's own key", () => {
    const { survey, matrix } = createFixed(undefined, { r1: { a: "1" } });
    let changes = 0;
    survey.onValueChanged.add(() => changes++);
    matrix.nextPage();
    expect(changes, "#1: a page move writes nothing").toBe(0);
    matrix.visibleRows[1].cells[0].question.value = "five";
    expect(matrix.value, "#2").toEqual({ r1: { a: "1" }, r5: { a: "five" } });
    matrix.prevPage();
    expect(matrix.visibleRows[0].cells[0].question.value, "#3: page 0").toBe("1");
    matrix.nextPage();
    expect(matrix.visibleRows[1].cells[0].question.value, "#4: back on page 1").toBe("five");
    expect(changes, "#5: one write for the one edit").toBe(1);
  });
  test("rowsVisibleIf and a row's visibleIf cut the page from the visible records, and hidden records keep their answers", () => {
    const { survey, matrix } = createFixed({
      rows: ["r1", { value: "r2", visibleIf: "{show2} = true" }, "r3", "r4", "r5", "r6", "r7"],
      rowsVisibleIf: "{item} != 'r4'"
    }, { r2: { a: "2" }, r4: { a: "4" }, r6: { a: "6" } });
    expect(names(matrix.visibleRows), "#1: r2 and r4 are hidden").toEqual(["r1", "r3", "r5"]);
    expect(matrix.pageCount, "#2: five visible records").toBe(2);
    matrix.nextPage();
    expect(names(matrix.visibleRows), "#3").toEqual(["r6", "r7"]);
    survey.setValue("show2", true);
    expect(matrix.pageCount, "#4: r2 is visible").toBe(2);
    matrix.prevPage();
    expect(names(matrix.visibleRows), "#5").toEqual(["r1", "r2", "r3"]);
    expect(matrix.value, "#6: the hidden record keeps its answer").toEqual({ r2: { a: "2" }, r4: { a: "4" }, r6: { a: "6" } });
  });
  test("a row whose visible flag is off has no page slot", () => {
    const { matrix } = createFixed();
    matrix.rows[1].setIsVisible(false);
    matrix.rows[2].setIsVisible(false);
    matrix.runCondition({});
    expect(names(matrix.visibleRows), "#1").toEqual(["r1", "r4", "r5"]);
    expect(matrix.pageCount, "#2").toBe(2);
  });
  test("hideIfRowsEmpty counts the visible records, not the rows of the page", () => {
    const { survey, matrix } = createFixed({ hideIfRowsEmpty: true, rowsVisibleIf: "{hide} notcontains {item}" });
    expect(matrix.isVisible, "#1").toBe(true);
    survey.setValue("hide", ["r1", "r2", "r3"]);
    expect(names(matrix.visibleRows), "#2: page 0 is the next visible records").toEqual(["r4", "r5", "r6"]);
    expect(matrix.isVisible, "#2: some records are visible").toBe(true);
    survey.setValue("hide", sevenRows);
    expect(matrix.isVisible, "#3: none is").toBe(false);
    survey.setValue("hide", ["r1"]);
    expect(matrix.isVisible, "#4").toBe(true);
  });
  test("clearIncorrectValues keeps the answers of the rows off the page", () => {
    const { matrix } = createFixed(undefined, { r1: { a: "1" }, r5: { a: "5" }, r7: { a: "7" }, zz: { a: "z" } });
    matrix.clearIncorrectValues();
    expect(matrix.value, "#1: the unknown key goes, the off-page rows stay").toEqual({ r1: { a: "1" }, r5: { a: "5" }, r7: { a: "7" } });
  });
  test("clearIncorrectValues keeps the answers of numeric row values", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdropdown", name: "matrix", rows: [0, 1], columns: [{ name: "a", cellType: "text" }] }]
    });
    survey.data = { matrix: { 0: { a: "zero" }, 1: { a: "one" } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    matrix.clearIncorrectValues();
    expect(matrix.value, "#1: the keys are strings, the row values numbers").toEqual({ 0: { a: "zero" }, 1: { a: "one" } });
  });
  test("the value-level results cover every visible record, not the page", () => {
    const { survey, matrix } = createFixed({ rowsVisibleIf: "{item} != 'r2'" }, allAnswered());
    const expected: any = allAnswered();
    delete expected.r2;
    expect(matrix.visibleRows.length, "#0: one page").toBe(3);
    expect(matrix.getFilteredData(), "#1: getFilteredData").toEqual(expected);
    // A matrix contributes its stored answer to the survey's filtered values, as it does without paging.
    expect(survey.getFilteredValues().matrix, "#2: the survey's filtered values").toEqual(allAnswered());
    const display = matrix.getDisplayValue(true);
    expect(Object.keys(display), "#3: getDisplayValue").toEqual(["r1", "r3", "r4", "r5", "r6", "r7"]);
    expect(display.r7, "#3").toEqual({ a: "a7", b: 7 });
    const plain = matrix.getPlainData().data;
    expect(plain.map((item: any) => item.name), "#4: getPlainData").toEqual(["r1", "r3", "r4", "r5", "r6", "r7"]);
    expect(plain[5].title, "#4: the row title").toBe("r7");
    expect(plain[5].data.map((cell: any) => cell.value), "#4: the cells of a row off the page").toEqual(["a7", 7]);
    expect(plain[5].data[0].title, "#4: the cell title is the cell's").toBe(plain[0].data[0].title.replace("r1", "r7"));
    expect(matrix.getProgressInfo(), "#5: getProgressInfo").toEqual({ questionCount: 12, answeredQuestionCount: 12, requiredQuestionCount: 0, requiredAnsweredQuestionCount: 0 });
  });
  test("a paged dynamic matrix: the same results cover every visible record", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 7, pageSize: 3, rowsVisibleIf: "{row.b} != 2", columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }] }]
    });
    const data = sevenRows.map((name, i) => ({ a: "a" + (i + 1), b: i + 1 }));
    survey.data = { matrix: data };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const expected = data.filter(record => record.b !== 2);
    expect(matrix.visibleRows.length, "#0").toBe(3);
    expect(matrix.getFilteredData(), "#1").toEqual(expected);
    expect(survey.getFilteredValues().matrix, "#2: the stored answer").toEqual(data);
    expect(matrix.getDisplayValue(true).length, "#3: the display value keeps every record").toBe(7);
    expect(matrix.getPlainData().data.map((item: any) => item.name), "#4").toEqual(["row1", "row3", "row4", "row5", "row6", "row7"]);
    expect(matrix.getProgressInfo().questionCount, "#5").toBe(12);
  });
  test("a total covers every visible row on any page", () => {
    const { matrix } = createFixed({ columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", inputType: "number", totalType: "sum" }] }, allAnswered());
    expect(matrix.visibleRows.length, "#0").toBe(3);
    expect(matrix.totalValue.b, "#1: page 0").toBe(28);
    matrix.nextPage();
    expect(matrix.totalValue.b, "#2: page 1").toBe(28);
  });
  test("rowOrder random: the pages are the randomized order cut in threes", () => {
    const { survey, matrix } = createFixed({ rowOrder: "random" });
    survey.randomSeed = 12345;
    const order = names(matrix.rows.map(item => ({ rowName: item.value })));
    expect(names(matrix.visibleRows), "#1: page 0").toEqual(order.slice(0, 3));
    matrix.nextPage();
    expect(names(matrix.visibleRows), "#2: page 1").toEqual(order.slice(3, 6));
    matrix.nextPage();
    expect(names(matrix.visibleRows), "#3: page 2").toEqual(order.slice(6));
    expect(order.join(), "#4: the order is randomized").not.toBe(sevenRows.join());
  });
  test("a detail panel closes with its page, and its event passes the row's position in the whole view", () => {
    const { survey, matrix } = createFixed({ detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] });
    const events: Array<any> = [];
    survey.onMatrixDetailPanelVisibleChanged.add((_, options) => { events.push({ rowIndex: options.rowIndex, name: options.row.rowName, visible: options.visible }); });
    matrix.visibleRows[1].showDetailPanel();
    expect(events, "#1").toEqual([{ rowIndex: 1, name: "r2", visible: true }]);
    matrix.nextPage();
    matrix.visibleRows[2].showDetailPanel();
    expect(events[1], "#2: the position in the whole view").toEqual({ rowIndex: 5, name: "r6", visible: true });
    matrix.prevPage();
    expect(matrix.visibleRows[1].isDetailPanelShowing, "#3: the row was built again, its panel is closed").toBe(false);
  });
  test("transposeData: a page renders as a set of columns", () => {
    const { matrix } = createFixed({ transposeData: true });
    matrix.nextPage();
    const table = matrix.renderedTable;
    expect(table.headerRow.cells.filter(cell => cell.hasTitle).map(cell => cell.locTitle.renderedHtml), "#1: the page's rows are the columns").toEqual(["r4", "r5", "r6"]);
    expect(table.rows.filter(row => !row.isDetailRow && !row.isErrorsRow).length, "#2: one rendered row per matrix column").toBe(2);
  });
  test("single-input mode walks every row and does not page", () => {
    const { survey, matrix } = createFixed({ columns: [{ name: "a", cellType: "text" }] }, undefined, { questionsOnPageMode: "inputPerPage" });
    const titles: Array<string> = [];
    for (let i = 0; i < 7; i++) {
      titles.push(matrix.singleInputLocTitle.textOrHtml);
      survey.performNext();
    }
    expect(titles, "#1: every row").toEqual(sevenRows);
    expect(matrix.pageCount, "#2: no paging while single input is active").toBe(1);
    expect(matrix.visibleRows.length, "#3").toBe(7);
  });
  test("design mode builds every row", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "matrixdropdown", name: "matrix", pageSize: 3, rows: sevenRows, columns: [{ name: "a" }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "#1").toBe(7);
    expect(matrix.pageCount, "#2").toBe(1);
    expect(matrix.pageSize, "#3: the authored value is kept").toBe(3);
  });
  describe("clearing invisible values", () => {
    (<Array<"onHidden" | "onComplete">>["onHidden", "onComplete"]).forEach(mode => {
      test("a hidden row loses its answer on the page and off it, a visible one keeps it, " + mode, () => {
        const { survey, matrix } = createFixed({ rowsVisibleIf: "{hide} notcontains {item}" }, allAnswered(), { clearInvisibleValues: mode });
        survey.setValue("hide", ["r2", "r6"]);
        if (mode === "onComplete") survey.doComplete();
        const expected: any = allAnswered();
        delete expected.r2;
        delete expected.r6;
        expect(matrix.value, "#1: r2 was on the page, r6 off it").toEqual(expected);
      });
    });
  });
  describe("unique columns: only the visible records take part", () => {
    const uniqueColumns = [{ name: "a", cellType: "text", isUnique: true }];
    test("a hidden row with the same value is no duplicate, without paging and off the page", () => {
      [0, 3].forEach(pageSize => {
        [{ rowsVisibleIf: "{item} != 'r6'" }, { rows: ["r1", "r2", "r3", "r4", "r5", { value: "r6", visibleIf: "false" }, "r7"] }].forEach((hide, i) => {
          const { survey, matrix } = createFixed(Object.assign({ pageSize: pageSize, columns: uniqueColumns }, hide), { r2: { a: "x" }, r6: { a: "x" } });
          expect(survey.validate(), "#" + pageSize + "/" + i + ": no duplicate").toBe(true);
          expect(matrix.value, "#" + pageSize + "/" + i + ": the answer is kept").toEqual({ r2: { a: "x" }, r6: { a: "x" } });
        });
      });
    });
    test("a visible duplicate off the page is reported", () => {
      const { survey, matrix } = createFixed({ columns: uniqueColumns }, { r2: { a: "x" }, r6: { a: "x" } });
      expect(survey.validate(), "#1").toBe(false);
      expect(matrix.pageIndex, "#2: the page stays").toBe(0);
      expect(matrix.visibleRows[1].cells[0].question.errors.length, "#3: the error is on the row that exists").toBe(1);
    });
  });
});

describe("Fixed matrix validates every page", () => {
  const sevenRows = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"];
  const requiredA = [{ name: "a", cellType: "text", isRequired: true }];
  const answered = (except?: Array<string>, extra?: any): any => {
    const res: any = {};
    sevenRows.forEach((name, i) => {
      if (!except || except.indexOf(name) < 0) res[name] = Object.assign({ a: "a" + (i + 1) }, extra && extra[name]);
    });
    return res;
  };
  const createFixed = (json: any, data: any, surveyJson?: any): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel(Object.assign({
      elements: [Object.assign({ type: "matrixdropdown", name: "matrix", pageSize: 3, rows: sevenRows, columns: requiredA }, json)]
    }, surveyJson));
    survey.data = { matrix: data };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "the first page is shown").toBe(3);
    return { survey: survey, matrix: matrix };
  };
  const rowNames = (matrix: QuestionMatrixDropdownModel): Array<string> => matrix.visibleRows.map(row => row.rowName);
  const errorRows = (matrix: QuestionMatrixDropdownModel, column: string = "a"): Array<string> =>
    matrix.visibleRows.filter(row => row.getQuestionByName(column).errors.length > 0).map(row => row.rowName);
  test("an empty required cell in a row on a page never opened blocks completion and shows its page", () => {
    const data = answered(["r7"]);
    const { survey, matrix } = createFixed({}, data);
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2: the page of r7").toBe(2);
    expect(errorRows(matrix), "#3: the error is on r7").toEqual(["r7"]);
    expect(matrix.value, "#4: the answer is unchanged").toEqual(data);
  });
  test("a hidden row with an empty required cell does not block completion", () => {
    [{ rows: ["r1", "r2", "r3", "r4", "r5", "r6", { value: "r7", visibleIf: "false" }] }, { rowsVisibleIf: "{item} != 'r7'" }].forEach((hide, i) => {
      const data = answered(["r7"]);
      const { survey, matrix } = createFixed(hide, data);
      expect(survey.tryComplete(), "#" + i + ": completes").toBe(true);
      expect(matrix.value, "#" + i + ": the answer is unchanged").toEqual(data);
    });
  });
  test("every row answered: the survey completes, and the page the respondent was on comes back", () => {
    const data = answered();
    const { survey, matrix } = createFixed({}, data);
    matrix.pageIndex = 1;
    expect(survey.validate(), "#1").toBe(true);
    expect(matrix.pageIndex, "#2: back on page 1").toBe(1);
    expect(survey.tryComplete(), "#3").toBe(true);
    expect(matrix.value, "#4").toEqual(data);
  });
  test("a cell validator that fails for a row off the page", () => {
    const data = answered(undefined, { r5: { a: "bad" } });
    const { survey, matrix } = createFixed({ columns: [{ name: "a", cellType: "text", isRequired: true, validators: [{ type: "expression", expression: "{row.a} != 'bad'" }] }] }, data);
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2").toBe(1);
    expect(errorRows(matrix), "#3").toEqual(["r5"]);
  });
  test("onMatrixCellValidate returns an error for a row off the page", () => {
    const { survey, matrix } = createFixed({}, answered());
    survey.onMatrixCellValidate.add((_, options) => {
      if (options.row.rowName === "r6") options.error = "not r6";
    });
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2").toBe(1);
    expect(errorRows(matrix), "#3").toEqual(["r6"]);
  });
  test("a required question in the detail panel of a row off the page", () => {
    const { survey, matrix } = createFixed({ detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d", isRequired: true }] },
      answered(undefined, { r1: { d: "1" }, r2: { d: "2" }, r3: { d: "3" }, r5: { d: "5" }, r6: { d: "6" }, r7: { d: "7" } }));
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.pageIndex, "#2").toBe(1);
    expect(matrix.visibleRows[0].rowName, "#3").toBe("r4");
    expect(matrix.visibleRows[0].isDetailPanelShowing, "#4: the panel with the error is open").toBe(true);
    expect(matrix.visibleRows[0].detailPanel.getQuestionByName("d").errors.length, "#5").toBe(1);
  });
  describe("unique columns", () => {
    const uniqueColumns = [{ name: "a", cellType: "text", isUnique: true }];
    test("equal values on pages 0 and 1, validated from page 2", () => {
      const { survey, matrix } = createFixed({ columns: uniqueColumns }, { r2: { a: "x" }, r6: { a: "x" } });
      matrix.pageIndex = 2;
      expect(survey.tryComplete(), "#1").toBe(false);
      expect(matrix.pageIndex, "#2: the first page with an error").toBe(0);
      expect(errorRows(matrix), "#3: the error is on the row that exists").toEqual(["r2"]);
    });
    test("the same values with r6 hidden: no duplicate", () => {
      [{ rowsVisibleIf: "{item} != 'r6'" }, { rows: ["r1", "r2", "r3", "r4", "r5", { value: "r6", visibleIf: "false" }, "r7"] }].forEach((hide, i) => {
        const { survey, matrix } = createFixed(Object.assign({ columns: uniqueColumns }, hide), { r2: { a: "x" }, r6: { a: "x" } });
        matrix.pageIndex = 1;
        expect(survey.tryComplete(), "#" + i).toBe(true);
      });
    });
    test("the same values with r2 hidden and r6 on the current page: no error on r6", () => {
      const { survey, matrix } = createFixed({ columns: uniqueColumns, rowsVisibleIf: "{item} != 'r2'" }, { r2: { a: "x" }, r6: { a: "x" } });
      matrix.pageIndex = 1;
      expect(rowNames(matrix), "#1: r6 is on the page").toEqual(["r5", "r6", "r7"]);
      expect(survey.tryComplete(), "#2").toBe(true);
    });
  });
  describe("asynchronous validators", () => {
    const results: Array<{ name: string, setResult: (res: any) => void }> = [];
    const register = (): void => {
      results.length = 0;
      FunctionFactory.Instance.register("fixedAsyncFunc", function (this: any, params: Array<any>): any {
        results.push({ name: params[0], setResult: this.returnResult });
        return false;
      }, true);
    };
    afterEach(() => {
      FunctionFactory.Instance.unregister("fixedAsyncFunc");
    });
    const asyncColumns = [{ name: "a", cellType: "text", validators: [{ type: "expression", expression: "fixedAsyncFunc({row.a}) = 1" }] }];
    const settle = (fail?: string): void => {
      while(results.length > 0) {
        const item = results.shift();
        item.setResult(item.name === fail ? 0 : 1);
      }
    };
    test("a validator that fails for r5: the survey stays and the matrix shows page 1 once it settles", () => {
      register();
      const { survey, matrix } = createFixed({ columns: asyncColumns }, answered());
      survey.tryComplete();
      settle("a5");
      expect(survey.state, "#1: not completed").toBe("running");
      expect(matrix.pageIndex, "#2: the page of r5").toBe(1);
      expect(errorRows(matrix), "#3").toEqual(["r5"]);
    });
    test("the same validator passing: the survey completes after the walk", () => {
      register();
      const { survey } = createFixed({ columns: asyncColumns }, answered());
      survey.tryComplete();
      settle();
      expect(survey.state, "#1").toBe("completed");
    });
  });
  test("a validation on a value change does not walk the pages", () => {
    const { matrix } = createFixed({}, answered(["r7"]), { checkErrorsMode: "onValueChanged" });
    const builds = countCreatedRows(<SurveyModel>matrix.survey, "a");
    matrix.visibleRows[0].cells[0].question.value = "changed";
    expect(builds(), "#1: no other page is built").toBe(0);
    expect(matrix.pageIndex, "#2").toBe(0);
  });
  test("the question's isRequired is checked on the keyed answer", () => {
    const { survey, matrix } = createFixed({ isRequired: true, columns: [{ name: "a", cellType: "text" }] }, undefined);
    expect(survey.tryComplete(), "#1").toBe(false);
    expect(matrix.errors.length, "#2: the question's own error").toBe(1);
    expect(matrix.pageIndex, "#3").toBe(0);
  });
  test("a row the filter excludes, with an empty required cell, does not block completion", () => {
    const { survey, matrix } = createFixed({ filterExpression: "{rowName} != 'r7'" }, answered(["r7"]));
    expect(matrix.pageCount, "#1: six rows in the view").toBe(2);
    expect(survey.tryComplete(), "#2").toBe(true);
  });
  test("equal unique values with r6 filtered out: no duplicate", () => {
    const { survey } = createFixed({ columns: [{ name: "a", cellType: "text", isUnique: true }], filterExpression: "{rowName} != 'r6'" }, { r2: { a: "x" }, r6: { a: "x" } });
    expect(survey.tryComplete(), "#1").toBe(true);
  });
});

describe("Fixed matrix pages its rows under a sort and a filter", () => {
  const rows = [{ value: "r1", text: "Golf" }, { value: "r2", text: "Echo" }, { value: "r3", text: "Alpha" }, { value: "r4", text: "Foxtrot" },
    { value: "r5", text: "Bravo" }, { value: "r6", text: "Delta" }, { value: "r7", text: "Charlie" }];
  const createFixed = (json: any, data: any, surveyJson?: any): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel(Object.assign({
      elements: [Object.assign({ type: "matrixdropdown", name: "matrix", pageSize: 2, rows: rows, columns: [{ name: "a", cellType: "text" }] }, json)]
    }, surveyJson));
    survey.data = { matrix: data };
    return { survey: survey, matrix: <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix") };
  };
  test("an edit writes the row's own key: record index, visible position and page-local position all differ", () => {
    const { matrix } = createFixed({ sortCriteria: [{ field: "rowTitle" }], filterExpression: "{rowName} != 'r3'" }, {});
    // In the view: Bravo r5, Charlie r7, Delta r6, Echo r2, Foxtrot r4, Golf r1.
    matrix.nextPage();
    const row = matrix.visibleRows[1];
    expect(row.rowName, "#1: page 1 holds Delta and Echo").toBe("r2");
    expect([row.getIndex(), row.visibleIndex, row.pageVisibleIndex], "#2: record 1, visible 3, page-local 1").toEqual([1, 3, 1]);
    row.cells[0].question.value = "echo";
    expect(matrix.value, "#3: the row's own key").toEqual({ r2: { a: "echo" } });
  });
  test("a filtered-out row keeps its answer when invisible values are cleared", () => {
    const { survey, matrix } = createFixed({ rowsVisibleIf: "{hide} notcontains {item}", filterExpression: "{rowName} != 'r6'" },
      { r1: { a: "1" }, r5: { a: "5" }, r6: { a: "6" } }, { clearInvisibleValues: "onHidden" });
    expect(matrix.visibleRows.length, "#0").toBe(2);
    survey.setValue("hide", ["r5"]);
    expect(matrix.value, "#1: the hidden r5 goes, the filtered-out r6 stays").toEqual({ r1: { a: "1" }, r6: { a: "6" } });
  });
});
/* A number a caller passes - removePanel(n), addPanel(n), removeRow(n) - and an index an event
   reports keep their meaning under paging: a position in the whole view, never a position on the
   current page. A view change between a request and its answer never makes it act on another record. */
describe("Page window: numbers, confirmations and new records name records across pages", () => {
  const ids = (arr: Array<any>): Array<any> => arr.map(r => !r ? r : r.id);
  test("panel: removePanel(n) of a record on another page removes it, keeps the page and fires no panel event", () => {
    const question = createPanel({ pageSize: 5 }, records(20));
    const removed: Array<number> = [];
    question.survey.onDynamicPanelRemoved.add((_, options) => { removed.push(options.panelIndex); });
    question.removePanel(12);
    expect(ids(question.value).indexOf(12), "#1: record 12 is gone").toBe(-1);
    expect(question.value.length, "#2").toBe(19);
    expect(panelIds(question), "#3: page 0 is as it was").toEqual([0, 1, 2, 3, 4]);
    expect(removed, "#4: the record had no panel").toEqual([]);
    question.pageIndex = 2;
    question.removePanelUI(question.panels[1]);
    expect(removed, "#5: a panel's index is its position in the whole view").toEqual([11]);
    expect(ids(question.value).indexOf(11), "#6: record 11 was that panel's - record 12 is gone").toBe(-1);
  });
  test("panel: addPanel(n) inserts before the record at position n, on whatever page it is", () => {
    const question = createPanel({ pageSize: 5 }, records(20));
    const added: Array<number> = [];
    question.survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panelIndex); });
    const panel = question.addPanel(12);
    expect(ids(question.value)[12], "#1: the new record is at 12").toBeUndefined();
    expect(ids(question.value)[13], "#2").toBe(12);
    expect(question.pageIndex, "#3: its page is shown").toBe(2);
    expect(panel === question.panels[2], "#4: the returned panel is the new record's").toBe(true);
    expect(added, "#5: its position in the whole view").toEqual([12]);
  });
  test("matrix: removeRow(n) of a record on another page removes it and keeps the page; the row events report the whole view", () => {
    const survey = createMatrixSurvey({ pageSize: 5 }, records(20));
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    const removed: Array<number> = [];
    survey.onMatrixRowRemoved.add((_, options) => { removed.push(options.rowIndex); });
    matrix.removeRow(12);
    expect(ids(matrix.value).indexOf(12), "#1: record 12 is gone").toBe(-1);
    expect(rowIds(matrix), "#2: page 0 is as it was").toEqual([0, 1, 2, 3, 4]);
    expect(removed, "#3: the record had no row").toEqual([]);
    matrix.pageIndex = 2;
    matrix.removeRowUI(matrix.visibleRows[1]);
    expect(removed, "#4: the row's position in the whole view").toEqual([11]);
    expect(ids(matrix.value).indexOf(11), "#5: record 11 was that row's - record 12 is gone").toBe(-1);
  });
  test("a sorted, paged question: the numbers and the event indexes are positions in the sorted view", () => {
    const question = createPanel({ pageSize: 5, sortCriteria: [{ field: "id", direction: "desc" }] }, records(20));
    const removed: Array<number> = [];
    question.survey.onDynamicPanelRemoved.add((_, options) => { removed.push(options.panelIndex); });
    expect(panelIds(question), "#1").toEqual([19, 18, 17, 16, 15]);
    question.removePanelUI(question.panels[1]);
    expect(removed, "#2").toEqual([1]);
    expect(ids(question.value).indexOf(18), "#3: the record that panel showed").toBe(-1);
    question.removePanel(10);
    expect(ids(question.value).indexOf(8), "#4: position 10 of the sorted view").toBe(-1);
    expect(question.value.length, "#5").toBe(18);
  });
  test("a source that pages itself refuses a number its window does not hold, and reports it", async () => {
    const source = new PagedSource(records(20));
    const question = createPanel({ pageSize: 5, panelCount: 0 });
    question.panels;
    question.dataSource = source;
    await flush();
    const errors: Array<string> = [];
    question.survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    question.removePanel(12);
    question.addPanel(12);
    await flush();
    expect(source.removes, "#1: nothing was removed").toEqual([]);
    expect(errors, "#2: both refusals are reported").toEqual(["remove", "insert"]);
    expect(panelIds(question), "#3: the window is as it was").toEqual([0, 1, 2, 3, 4]);
    question.removePanel(3);
    await flush();
    expect(source.removes, "#4: a number the window holds is removed, by key").toEqual([3]);
    const matrixSource = new PagedSource(records(20));
    const matrix = createMatrix({ pageSize: 5 });
    matrix.dataSource = matrixSource;
    await flush();
    matrix.removeRow(12);
    await flush();
    expect(matrixSource.removes, "#5: the matrix refuses it too").toEqual([]);
  });
  test("matrix: a row added under paging and a filter is the new record, and stays shown until the view changes", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", pageSize: 2, filterExpression: "{a} > 0",
      columns: [{ name: "a", cellType: "text", inputType: "number" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }];
    let addedRow: any = undefined;
    survey.onMatrixRowAdded.add((_, options) => { addedRow = options.row; });
    matrix.addRow();
    expect(addedRow.value, "#1: the event gets the new, empty row").toEqual({});
    expect(matrix.pageIndex, "#2: the page of the new record").toBe(1);
    expect(matrix.visibleRows.length, "#3: the record before it and the new one").toBe(2);
    expect(matrix.visibleRows[1] === addedRow, "#4: shown although the filter does not accept it").toBe(true);
    addedRow.getQuestionByColumnName("a").value = -5;
    expect(matrix.value, "#5: the edit reached the new record").toEqual([{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: -5 }]);
    expect(matrix.visibleRows.length, "#6: it stays shown").toBe(2);
    matrix.refreshView();
    expect(matrix.visibleRows.map(row => row.value.a), "#7: the next view change applies the filter to it").toEqual([3]);
  });
  test("panel: a panel added under paging and a filter is the new record, and stays shown until the view changes", () => {
    const question = createPanel({ pageSize: 2, filterExpression: "{id} > 0" }, records(4));
    const added: Array<any> = [];
    question.survey.onDynamicPanelAdded.add((_, options) => { added.push(options.panel); });
    const panel = question.addPanel();
    expect(question.pageIndex, "#1: the page of the new record, not page 0").toBe(1);
    expect(panel === question.panels[1], "#2: the returned panel is the new record's").toBe(true);
    expect(added.length === 1 && added[0] === panel, "#3").toBe(true);
    panel.getQuestionByName("id").value = -1;
    expect(question.value[4], "#4: the edit reached the new record").toEqual({ id: -1 });
    expect(panelIds(question), "#5: it stays shown").toEqual([3, -1]);
    question.refreshView();
    expect(panelIds(question), "#6: the next view change applies the filter to it").toEqual([3]);
  });
  const holdConfirmations = (): { answer: (index: number, value: boolean) => void, restore: () => void, count: () => number } => {
    const old = settings.confirmActionAsync;
    const callbacks: Array<(res: boolean) => void> = [];
    settings.confirmActionAsync = (message: string, callback: (res: boolean) => void): boolean => { callbacks.push(callback); return true; };
    return {
      answer: (index: number, value: boolean): void => { callbacks[index](value); },
      restore: (): void => { settings.confirmActionAsync = old; },
      count: (): number => callbacks.length
    };
  };
  test("matrix: confirmDelete on a later page asks about the record of the row, and a page change drops the answer", () => {
    const confirmations = holdConfirmations();
    try {
      const matrix = createMatrix({ pageSize: 2, confirmDelete: true }, [{ id: 0 }, { id: 1 }, {}, { id: 3 }]);
      matrix.nextPage();
      expect(matrix.isRequireConfirmOnRowDelete(2), "#1: record 2 is empty").toBe(false);
      expect(matrix.isRequireConfirmOnRowDelete(0), "#2: record 0 is not").toBe(true);
      matrix.removeRowUI(matrix.visibleRows[1]);
      expect(confirmations.count(), "#3: record 3 asks").toBe(1);
      confirmations.answer(0, true);
      expect(ids(matrix.value), "#4: record 3 is removed").toEqual([0, 1, undefined]);
      matrix.value = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
      matrix.removeRowUI(matrix.visibleRows[1]);
      expect(confirmations.count(), "#5").toBe(2);
      matrix.prevPage();
      confirmations.answer(1, true);
      expect(ids(matrix.value), "#6: the row it asked about is gone from the page: nothing is removed").toEqual([0, 1, 2, 3]);
    } finally {
      confirmations.restore();
    }
  });
  test("panel: confirmDelete on a later page asks about the record of the panel, and a sort drops the answer", () => {
    const confirmations = holdConfirmations();
    try {
      const question = createPanel({ pageSize: 2, confirmDelete: true }, records(4));
      question.nextPage();
      question.removePanelUI(question.panels[1]);
      expect(confirmations.count(), "#1").toBe(1);
      confirmations.answer(0, true);
      expect(ids(question.value), "#2: record 3 is removed").toEqual([0, 1, 2]);
      question.removePanelUI(question.panels[0]);
      question.sort([{ field: "id", direction: "desc" }]);
      confirmations.answer(1, true);
      expect(ids(question.value), "#3: the panel it asked about was replaced: nothing is removed").toEqual([0, 1, 2]);
    } finally {
      confirmations.restore();
    }
  });
  test("paged carousel: Add after the last panel of a page and Remove of the first panel of a page act on their records", () => {
    const question = createPanel({ displayMode: "carousel", pageSize: 3, newPanelPosition: "next" }, records(9));
    question.currentIndex = 2;
    const added = question.addPanelUI();
    expect(question.pageIndex, "#1: the new record is the first of page 1").toBe(1);
    expect(added === question.currentPanel, "#2").toBe(true);
    expect(ids(question.value)[3], "#3").toBeUndefined();
    question.removePanelUI(question.currentPanel);
    expect(ids(question.value), "#4: the new record is removed").toEqual(range(0, 8));
    expect(question.currentPanel.getQuestionByName("id").value, "#5: the record after it is current").toBe(3);
    question.currentIndex = 0;
    question.removePanelUI(question.currentPanel);
    expect(ids(question.value), "#6: record 0 is removed").toEqual(range(1, 8));
    expect(question.currentPanel.getQuestionByName("id").value, "#7").toBe(1);
  });
  test("a sorted and filtered local array is edited and removed by storage index", () => {
    const matrix = createMatrix({ sortCriteria: [{ field: "id", direction: "desc" }], filterExpression: "{id} > 1", pageSize: 2 }, [{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }]);
    expect(rowIds(matrix), "#1: the sorted, filtered page").toEqual([4, 3]);
    matrix.visibleRows[1].getQuestionByName("name").value = "edited";
    expect(matrix.value, "#2: the record of the row").toEqual([{ id: 1 }, { id: 3, name: "edited" }, { id: 2 }, { id: 4 }]);
    matrix.nextPage();
    matrix.removeRowUI(matrix.visibleRows[0]);
    expect(matrix.value, "#3").toEqual([{ id: 1 }, { id: 3, name: "edited" }, { id: 4 }]);
    const stored = [{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }];
    const question = createPanel({ sortCriteria: [{ field: "id", direction: "desc" }], filterExpression: "{id} > 1", pageSize: 2, panelCount: 0 });
    question.panels;
    question.dataSource = ArrayDynamicDataSource.fromArray(stored);
    const source = <ArrayDynamicDataSource>question.dataSource;
    question.panels[1].getQuestionByName("name").value = "edited";
    expect(source.array, "#4: an assigned array source").toEqual([{ id: 1 }, { id: 3, name: "edited" }, { id: 2 }, { id: 4 }]);
    question.removePanelUI(question.panels[0]);
    expect(source.array, "#5").toEqual([{ id: 1 }, { id: 3, name: "edited" }, { id: 2 }]);
  });
  test("a row dragged into another matrix carries its own record under a sort, a filter and a page", () => {
    const transfer = (json: any, pageIndex: number, position: number): { from: any, to: any } => {
      const survey = new SurveyModel({ elements: [
        Object.assign({ type: "matrixdynamic", name: "m1", rowCount: 0, columns: matrixColumns }, json),
        { type: "matrixdynamic", name: "m2", rowCount: 0, columns: matrixColumns }] });
      survey.setValue("m1", records(6));
      const m1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
      const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
      m1.pageIndex = pageIndex;
      const dd: any = new DragDropMatrixRows(survey, null, true);
      dd.parentElement = m1;
      dd.draggedElement = m1.visibleRows[position];
      dd.fromIndex = position;
      dd.toIndex = 0;
      dd.toMatrix = m2;
      dd.doDrop();
      return { from: ids(survey.data.m1), to: survey.data.m2 };
    };
    expect(transfer({ sortCriteria: [{ field: "id", direction: "desc" }] }, 0, 0), "#1: a sort").toEqual({ from: [0, 1, 2, 3, 4], to: [{ id: 5, name: "n5" }] });
    expect(transfer({ filterExpression: "{id} > 2" }, 0, 0), "#2: a filter").toEqual({ from: [0, 1, 2, 4, 5], to: [{ id: 3, name: "n3" }] });
    expect(transfer({ pageSize: 2 }, 1, 1), "#3: a page").toEqual({ from: [0, 1, 2, 4, 5], to: [{ id: 3, name: "n3" }] });
  });
});
/* Records { a: i } in a dynamic panel "p" and a dynamic matrix "m". "e" is an expression - a template
   question or a column - whose result the new objects write back into their records. */
const createStablePanel = (json: any, count: number, expression?: string, surveyJson?: any): QuestionPanelDynamicModel => {
  const elements: Array<any> = [{ type: "text", name: "a", inputType: "number" }];
  if (!!expression) elements.push({ type: "expression", name: "e", expression: expression });
  const extra = !!surveyJson && !!surveyJson.elements ? surveyJson.elements : [];
  const survey = new SurveyModel(Object.assign({}, surveyJson, {
    elements: [Object.assign({ type: "paneldynamic", name: "p", templateElements: elements }, json)].concat(extra) }));
  survey.data = { p: records(count, (i: number) => ({ a: i })) };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
};
const createStableMatrix = (json: any, count: number, expression?: string, surveyJson?: any): QuestionMatrixDynamicModel => {
  const columns: Array<any> = [{ name: "a", cellType: "text", inputType: "number" }];
  if (!!expression) columns.push({ name: "e", cellType: "expression", expression: expression });
  const extra = !!surveyJson && !!surveyJson.elements ? surveyJson.elements : [];
  const survey = new SurveyModel(Object.assign({}, surveyJson, {
    elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0, columns: columns }, json)].concat(extra) }));
  survey.data = { m: records(count, (i: number) => ({ a: i })) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
};
const panelAs = (q: QuestionPanelDynamicModel): Array<any> => q.panels.map((panel: PanelModel) => panel.getQuestionByName("a").value);
const rowAs = (q: QuestionMatrixDynamicModel): Array<any> => q.visibleRows.map(row => row.getQuestionByColumnName("a").value);
const copyRecords = (val: any): Array<any> => JSON.parse(JSON.stringify(val));
/* The view - which records have an object, and in what order - is decided by a filter or a sort
   change, refreshView() or a read, and by an assignment of the value from outside the question. The
   question's own writes - the values its new objects write back, an add, an edit, a page build -
   never decide it: a record the respondent added or edited stays where it is. */
describe("Page window: the question's own writes keep the view", () => {
  test("panel: an add under a filter shows the new record while its expression writes back", () => {
    const q = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 5, "1");
    const panel = q.addPanel();
    expect(q.pageIndex, "#1").toBe(2);
    expect(panelAs(q), "#2: the record before it and the new one").toEqual([4, undefined]);
    expect(!!panel && panel === q.panels[1], "#3: the new panel is returned").toBe(true);
    expect(q.value.length, "#4").toBe(6);
    expect(q.value[5], "#5: the expression's result").toEqual({ e: 1 });
    q.refreshView();
    expect(panelAs(q), "#6: refreshView applies the filter to it").toEqual([4]);
  });
  test("matrix: an add under a filter shows the new record while its expression writes back", () => {
    const q = createStableMatrix({ pageSize: 2, filterExpression: "{a} >= 0" }, 5, "1");
    q.visibleRows;
    q.addRow();
    expect(q.pageIndex, "#1").toBe(2);
    expect(rowAs(q), "#2: the record before it and the new one").toEqual([4, undefined]);
    expect(q.value.length, "#3").toBe(6);
    expect(q.value[5], "#4: the expression's result").toEqual({ e: 1 });
    q.refreshView();
    expect(rowAs(q), "#5: refreshView applies the filter to it").toEqual([4]);
  });
  test("panel: an add under a sort shows the new record on the page that holds it", () => {
    const q = createStablePanel({ pageSize: 2, sortCriteria: [{ field: "a", direction: "desc" }] }, 5, "1");
    q.nextPage();
    expect(panelAs(q), "#1").toEqual([2, 1]);
    q.addPanel(1);
    expect(q.pageIndex, "#2: the page of the new record").toBe(0);
    expect(panelAs(q), "#3: not sorted away").toEqual([4, undefined]);
    q.filterExpression = "{a} >= 0";
    expect(panelAs(q), "#4: a filter change applies the view to it").toEqual([4, 3]);
  });
  test("matrix: an add under a sort shows the new record where it was added", () => {
    const q = createStableMatrix({ pageSize: 2, sortCriteria: [{ field: "a", direction: "desc" }] }, 5, "1");
    q.visibleRows;
    q.nextPage();
    expect(rowAs(q), "#1").toEqual([2, 1]);
    // In front of the record at position 3 of the sorted view, the second row of page 1.
    q.addRowByIndex({ a: 7 }, 3);
    expect(q.pageIndex, "#2").toBe(1);
    expect(rowAs(q), "#3: not sorted away").toEqual([2, 7]);
    q.refreshView();
    expect(rowAs(q), "#4: refreshView sorts it").toEqual([3, 2]);
    const appended = createStableMatrix({ pageSize: 2, sortCriteria: [{ field: "a", direction: "desc" }] }, 5, "1");
    appended.visibleRows;
    appended.nextPage();
    appended.addRow();
    expect(appended.pageIndex, "#5").toBe(2);
    expect(rowAs(appended), "#6: an appended row is shown at the end").toEqual([0, undefined]);
  });
  test("panel: a page move after an edit the filter rejects keeps the membership", () => {
    const q = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 6, "{panel.a} * 2");
    q.panels[0].getQuestionByName("a").value = -5;
    expect(panelAs(q), "#1").toEqual([-5, 1]);
    q.nextPage();
    expect(panelAs(q), "#2: no record is skipped").toEqual([2, 3]);
    q.prevPage();
    expect(panelAs(q), "#3: the edited record is still shown").toEqual([-5, 1]);
    q.refreshView();
    expect(panelAs(q), "#4: refreshView applies the filter to it").toEqual([1, 2]);
  });
  test("matrix: a page move after an edit the filter rejects keeps the membership", () => {
    const q = createStableMatrix({ pageSize: 2, filterExpression: "{a} >= 0" }, 6, "{row.a} * 2");
    q.visibleRows[0].getQuestionByColumnName("a").value = -5;
    expect(rowAs(q), "#1").toEqual([-5, 1]);
    q.pageIndex = 1;
    expect(rowAs(q), "#2: no record is skipped").toEqual([2, 3]);
    q.pageIndex = 0;
    expect(rowAs(q), "#3: the edited record is still shown").toEqual([-5, 1]);
    q.refreshView();
    expect(rowAs(q), "#4: refreshView applies the filter to it").toEqual([1, 2]);
  });
  [undefined, "{panel.a} * 2"].forEach((expression: string) => {
    test("panel: an edit the filter rejects or the sort would move keeps its place on the page, expression: " + expression, () => {
      const filtered = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 6, expression);
      filtered.nextPage();
      filtered.panels[0].getQuestionByName("a").value = -5;
      expect(panelAs(filtered), "#1").toEqual([-5, 3]);
      filtered.filterExpression = "{a} >= 1";
      expect(panelAs(filtered), "#2: a filter change applies the view to it").toEqual([1, 3]);
      const sorted = createStablePanel({ pageSize: 2, sortCriteria: [{ field: "a" }] }, 6, expression);
      sorted.nextPage();
      sorted.panels[0].getQuestionByName("a").value = 100;
      expect(panelAs(sorted), "#3").toEqual([100, 3]);
      sorted.sort([{ field: "a", direction: "desc" }]);
      expect(panelAs(sorted), "#4: a sort change applies the view to it").toEqual([4, 3]);
    });
  });
  [undefined, "{row.a} * 2"].forEach((expression: string) => {
    test("matrix: an edit the filter rejects or the sort would move keeps its place on the page, expression: " + expression, () => {
      const filtered = createStableMatrix({ pageSize: 2, filterExpression: "{a} >= 0" }, 6, expression);
      filtered.visibleRows;
      filtered.nextPage();
      filtered.visibleRows[0].getQuestionByColumnName("a").value = -5;
      expect(rowAs(filtered), "#1").toEqual([-5, 3]);
      filtered.filterExpression = "{a} >= 1";
      expect(rowAs(filtered), "#2: a filter change applies the view to it").toEqual([1, 3]);
      const sorted = createStableMatrix({ pageSize: 2, sortCriteria: [{ field: "a" }] }, 6, expression);
      sorted.visibleRows;
      sorted.nextPage();
      sorted.visibleRows[0].getQuestionByColumnName("a").value = 100;
      expect(rowAs(sorted), "#3").toEqual([100, 3]);
      sorted.sort([{ field: "a", direction: "desc" }]);
      expect(rowAs(sorted), "#4: a sort change applies the view to it").toEqual([4, 3]);
    });
  });
  test("an added record is still shown after a page move away and back, with an expression", () => {
    const panel = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 4, "1");
    panel.addPanel().getQuestionByName("a").value = -1;
    panel.pageIndex = 0;
    panel.pageIndex = 2;
    expect(panelAs(panel), "#1: panel").toEqual([-1]);
    panel.refreshView();
    expect(panelAs(panel), "#2: refreshView applies the filter to it").toEqual([2, 3]);
    const matrix = createStableMatrix({ pageSize: 2, filterExpression: "{a} >= 0" }, 4, "1");
    matrix.visibleRows;
    matrix.addRow();
    matrix.visibleRows[0].getQuestionByColumnName("a").value = -1;
    matrix.pageIndex = 0;
    matrix.pageIndex = 2;
    expect(rowAs(matrix), "#3: matrix").toEqual([-1]);
    matrix.refreshView();
    expect(rowAs(matrix), "#4: refreshView applies the filter to it").toEqual([2, 3]);
  });
});
/* An assignment from outside the question - survey.setValue, question.value, a handler's - made while
   one of the question's own writes is open is followed once that write has ended, also when the write
   ends with an exception: the view is decided again over the assigned value then. */
describe("Page window: an assignment from outside made during the question's own write", () => {
  // The own store of the add that no list write covers: the values the new objects write back.
  const isOwnWriteBack = (q: any, value: any): boolean => !q.dataListValue.isWriting && Array.isArray(value) && value.length === 6;
  [{ name: "question.value", assign: (q: any, v: any) => { q.value = v; } },
    { name: "survey.setValue", assign: (q: any, v: any) => { q.survey.setValue(q.name, v); } }].forEach(way => {
    test("an onValueChanging handler that assigns an unchanged value through " + way.name + " leaves the add the question's own", () => {
      const panel = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 5, "1");
      const matrix = createStableMatrix({ pageSize: 2, filterExpression: "{a} >= 0" }, 5, "1");
      matrix.visibleRows;
      const calls = { p: 0, m: 0 };
      [panel, matrix].forEach((q: any) => {
        q.survey.onValueChanging.add((_, options) => {
          if (options.name !== q.name || calls[q.name] > 0 || !isOwnWriteBack(q, options.value)) return;
          calls[q.name]++;
          way.assign(q, copyRecords(q.value));
        });
      });
      panel.addPanel();
      matrix.addRow();
      expect(calls, "#1: both handlers ran during the write-back").toEqual({ p: 1, m: 1 });
      expect(panelAs(panel), "#2: panel").toEqual([4, undefined]);
      expect(rowAs(matrix), "#3: matrix").toEqual([4, undefined]);
    });
  });
  test("an onValueChanging handler that assigns a changed value makes an outside assignment: the view is decided again", () => {
    const panel = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 5, "1");
    const matrix = createStableMatrix({ pageSize: 2, filterExpression: "{a} >= 0" }, 5, "1");
    matrix.visibleRows;
    const calls = { p: 0, m: 0 };
    [panel, matrix].forEach((q: any) => {
      q.survey.onValueChanging.add((_, options) => {
        if (options.name !== q.name || calls[q.name] > 0 || !isOwnWriteBack(q, options.value)) return;
        calls[q.name]++;
        const v = copyRecords(q.value);
        v[2] = { a: -1 };
        q.survey.setValue(q.name, v);
      });
    });
    panel.addPanel();
    matrix.addRow();
    expect(calls, "#1").toEqual({ p: 1, m: 1 });
    // The question's own store comes after the handler and is the last write; the view is decided
    // again once the add has ended, and the new record, which the add touched, keeps its place.
    expect(panelAs(panel), "#2: panel").toEqual([4, undefined]);
    expect(rowAs(matrix), "#3: matrix").toEqual([4, undefined]);
    panel.refreshView();
    matrix.refreshView();
    expect([panelAs(panel), rowAs(matrix)], "#4: the new record has no {a}").toEqual([[4], [4]]);
  });
  /* survey.onValueChanging runs after the question has stored the value and before the survey has: a
     nested assignment that throws there was stored already, and it is an assignment from outside. */
  test("an onValueChanging handler whose nested assignment throws: the error reaches the caller, and later writes keep their kind", () => {
    const q = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 5, "1");
    let isArmed = true;
    let depth = 0;
    q.survey.onValueChanging.add((_, options) => {
      if (!isArmed || options.name !== "p") return;
      if (depth > 0) throw new Error("handler");
      if (!isOwnWriteBack(q, options.value)) return;
      depth++;
      try {
        const v = copyRecords(q.value);
        v[0] = { a: 10 };
        q.value = v;
      } finally {
        depth--;
      }
    });
    expect(() => q.addPanel(), "#1").toThrow("handler");
    // Record 0 has no panel on the last page: its expression field is computed after the add (Bug#12156).
    expect(q.value[0], "#2: the nested assignment was stored").toEqual({ a: 10, e: 1 });
    isArmed = false;
    const panel = q.addPanel();
    expect(!!panel && panel === q.panels[q.panels.length - 1], "#3: a following add keeps its new record").toBe(true);
    expect(panel.getQuestionByName("a").value, "#4").toBeUndefined();
    const v = copyRecords(q.value);
    v[1] = { a: -9 };
    q.survey.setValue("p", v);
    q.pageIndex = 0;
    expect(panelAs(q), "#5: an assignment from outside is still one").toEqual([10, 2]);
  });
  /* onDynamicPanelValueChanging runs before the question stores the value: for a records question in a
     dynamic panel it is a handler that runs between the entry of an own assignment and its store. */
  test("matrix in a dynamic panel: an onDynamicPanelValueChanging handler that assigns an unchanged value leaves the add the question's own", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "outer", panelCount: 1, templateElements: [
      { type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 2, filterExpression: "{a} >= 0",
        columns: [{ name: "a", cellType: "text", inputType: "number" }, { name: "e", cellType: "expression", expression: "1" }] }] }] });
    survey.data = { outer: [{ m: records(5, (i: number) => ({ a: i })) }] };
    const outer = <QuestionPanelDynamicModel>survey.getQuestionByName("outer");
    const matrix = <QuestionMatrixDynamicModel>outer.panels[0].getQuestionByName("m");
    matrix.visibleRows;
    let calls = 0;
    survey.onDynamicPanelValueChanging.add((_, options) => {
      if (options.name !== "m" || !isOwnWriteBack(matrix, options.value)) return;
      calls++;
      matrix.value = copyRecords(matrix.value);
    });
    matrix.addRow();
    expect(calls > 0, "#1: the handler ran before an own store").toBe(true);
    expect(rowAs(matrix), "#2").toEqual([4, undefined]);
  });
  [{ sortCriteria: undefined, page1: [3, 4] }, { sortCriteria: [{ field: "a", direction: "desc" }], page1: [3, 1] }].forEach(view => {
    [{ name: "survey.setValue", assign: (q: any, v: any) => { q.survey.setValue(q.name, v); } },
      { name: "question.value", assign: (q: any, v: any) => { q.value = v; } }].forEach(way => {
      test("an assignment through " + way.name + " inside an edit's list write is followed after it, " + (view.sortCriteria ? "sorted by a desc" : "not sorted"), () => {
        const json = { filterExpression: "{a} >= 0", sortCriteria: view.sortCriteria };
        const panel = createStablePanel(Object.assign({ pageSize: 2 }, json), 6);
        const matrix = createStableMatrix(Object.assign({ pageSize: 2 }, json), 6);
        [panel, matrix].forEach((q: any) => {
          let isDone = false;
          q.survey.onValueChanged.add((_, options) => {
            if (options.name !== q.name || isDone) return;
            isDone = true;
            const v = copyRecords(q.value);
            v[2] = { a: -1 };
            way.assign(q, v);
          });
        });
        panel.panels[0].getQuestionByName("a").value = 10;
        matrix.visibleRows[0].getQuestionByColumnName("a").value = 10;
        panel.pageIndex = 1;
        matrix.pageIndex = 1;
        expect(panelAs(panel), "#1: panel: the record is filtered out and the page refilled").toEqual(view.page1);
        expect(rowAs(matrix), "#2: matrix").toEqual(view.page1);
        expect(panel.value[2], "#3").toEqual({ a: -1 });
      });
    });
  });
  test("matrix: an assignment inside a list write that runs outside any change of the question's own is followed when the write ends", () => {
    const q = createStableMatrix({ filterExpression: "{a} >= 0", defaultRowValue: { a: 9 } }, 4);
    q.visibleRows;
    let calls = 0;
    q.survey.onValueChanged.add((_, options) => {
      if (options.name !== "m" || calls > 0) return;
      calls++;
      const v = copyRecords(q.value);
      v[1] = { a: -1 };
      q.survey.setValue("m", v);
    });
    q.addRow();
    expect(calls, "#1").toBe(1);
    expect(q.value, "#2").toEqual([{ a: 0 }, { a: -1 }, { a: 2 }, { a: 3 }, { a: 9 }]);
    expect(rowAs(q), "#3: the assigned record is filtered out").toEqual([0, 2, 3, 9]);
  });
  test("matrix: a list write whose handler assigns and throws: the error reaches the caller and the view follows at once", () => {
    const q = createStableMatrix({ filterExpression: "{a} >= 0", defaultRowValue: { a: 9 } }, 4);
    q.visibleRows;
    let isArmed = true;
    q.survey.onValueChanged.add((_, options) => {
      if (options.name !== "m" || !isArmed) return;
      isArmed = false;
      const v = copyRecords(q.value);
      v[1] = { a: -1 };
      q.survey.setValue("m", v);
      throw new Error("handler");
    });
    expect(() => q.addRow(), "#1").toThrow("handler");
    expect((<any>q).dataListValue.isWriting, "#2: the write is closed").toBe(false);
    expect(rowAs(q), "#3: decided again over the assigned value").toEqual([0, 2, 3, 9]);
    q.visibleRows[0].getQuestionByColumnName("a").value = -7;
    expect(rowAs(q), "#4: the next edit keeps its record").toEqual([-7, 2, 3, 9]);
    q.addRow();
    expect(rowAs(q), "#6: and so does the next add").toEqual([-7, 2, 3, 9, 9]);
  });
  test("panel: an assignment inside the count change's batch is followed when the batch ends", () => {
    const q = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 6);
    let calls = 0;
    q.survey.onValueChanged.add((_, options) => {
      if (options.name !== "p" || calls > 0) return;
      calls++;
      const v = copyRecords(q.value);
      v[2] = { a: -1 };
      q.survey.setValue("p", v);
    });
    q.panelCount = 8;
    expect(calls, "#1").toBe(1);
    q.pageIndex = 1;
    expect(panelAs(q), "#2").toEqual([3, 4]);
  });
  [{ name: "survey.setValue", assign: (q: any, v: any) => { q.survey.setValue(q.name, v); }, isThrowing: false },
    { name: "question.value", assign: (q: any, v: any) => { q.value = v; }, isThrowing: false },
    { name: "survey.setValue, then throws", assign: (q: any, v: any) => { q.survey.setValue(q.name, v); }, isThrowing: true }].forEach(way => {
    test("panel: an onDynamicPanelAdded handler that assigns through " + way.name + ": the assigned value wins and the new record stays", () => {
      const q = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 4);
      q.survey.onDynamicPanelAdded.add(() => {
        const v = copyRecords(q.value);
        v[4] = { a: -1 };
        way.assign(q, v);
        if (way.isThrowing) throw new Error("handler");
      });
      if (way.isThrowing) {
        expect(() => q.addPanel(), "#0").toThrow("handler");
      } else {
        q.addPanel();
      }
      expect(q.value[4], "#1").toEqual({ a: -1 });
      expect(q.pageIndex, "#2").toBe(2);
      expect(panelAs(q), "#3: the filter does not accept the new record, the add touched it").toEqual([-1]);
      q.refreshView();
      expect([q.pageIndex, panelAs(q)], "#4: refreshView applies the filter to it").toEqual([1, [2, 3]]);
    });
  });
  test("two assignments made inside one write: the page shows the records the last one left", () => {
    const q = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 6);
    let calls = 0;
    q.survey.onValueChanged.add((_, options) => {
      if (options.name !== "p" || calls > 0) return;
      calls++;
      const v = copyRecords(q.value);
      v[2] = { a: -1 };
      q.survey.setValue("p", v);
      const w = copyRecords(q.value);
      w[3] = { a: -1 };
      q.survey.setValue("p", w);
    });
    q.panels[0].getQuestionByName("a").value = 10;
    q.pageIndex = 1;
    expect(panelAs(q), "#2").toEqual([4, 5]);
  });
  test("an assignment from outside with no write open decides the view at once, the edited record keeps its place", () => {
    const panel = createStablePanel({ pageSize: 2, filterExpression: "{a} >= 0" }, 6);
    panel.panels[0].getQuestionByName("a").value = -5;
    const v = copyRecords(panel.value);
    v[2] = { a: -1 };
    panel.survey.setValue("p", v);
    expect(panelAs(panel), "#1: panel").toEqual([-5, 1]);
    panel.nextPage();
    expect(panelAs(panel), "#2: the untouched record is filtered out").toEqual([3, 4]);
    const matrix = createStableMatrix({ pageSize: 2, filterExpression: "{a} >= 0" }, 6);
    matrix.visibleRows[0].getQuestionByColumnName("a").value = -5;
    const w = copyRecords(matrix.value);
    w[2] = { a: -1 };
    matrix.survey.setValue("m", w);
    expect(rowAs(matrix), "#3: matrix").toEqual([-5, 1]);
    matrix.nextPage();
    expect(rowAs(matrix), "#4").toEqual([3, 4]);
  });
});
/* The records the respondent touched since the view was last decided - added by the question's add,
   or edited through a question that takes input - keep their places when an assignment from outside
   decides the view again: the other records are filtered and sorted. A reload, clearValue(), a filter
   or sort change and refreshView() drop them. */
describe("Page window: the records the respondent touched stay shown", () => {
  interface IStableKind {
    name: string;
    valueName: string;
    create(json: any, count: number, expression?: string, surveyJson?: any): any;
    shown(q: any): Array<any>;
    edit(q: any, position: number, value: any): void;
    sibling: any;
    editSibling(survey: SurveyModel, index: number, value: any): void;
  }
  const kinds: Array<IStableKind> = [
    {
      name: "panel", valueName: "p", create: createStablePanel, shown: panelAs,
      edit: (q, position, value) => { q.panels[position].getQuestionByName("a").value = value; },
      sibling: { type: "paneldynamic", name: "sibling", valueName: "p", templateElements: [{ type: "text", name: "a", inputType: "number" }] },
      editSibling: (survey, index, value) => { (<QuestionPanelDynamicModel>survey.getQuestionByName("sibling")).panels[index].getQuestionByName("a").value = value; }
    },
    {
      name: "matrix", valueName: "m", create: createStableMatrix, shown: rowAs,
      edit: (q, position, value) => { q.visibleRows[position].getQuestionByColumnName("a").value = value; },
      sibling: { type: "matrixdynamic", name: "sibling", valueName: "m", rowCount: 0, columns: [{ name: "a", cellType: "text", inputType: "number" }] },
      editSibling: (survey, index, value) => { (<QuestionMatrixDynamicModel>survey.getQuestionByName("sibling")).visibleRows[index].getQuestionByColumnName("a").value = value; }
    }
  ];
  const assignRecord = (q: any, index: number, record: any): void => {
    const v = copyRecords(q.value);
    v[index] = record;
    q.survey.setValue(q.getValueName(), v);
  };
  kinds.forEach(kind => {
    [{ name: "survey.setValue", setRecordTwo: (q: any) => { assignRecord(q, 2, { a: -1 }); } },
      { name: "a setvalue trigger", setRecordTwo: (q: any) => { q.survey.setValue("go", 1); } },
      { name: "a sibling on the same valueName", setRecordTwo: (q: any) => { kind.editSibling(q.survey, 2, -1); } }].forEach(way => {
      test(kind.name + ": an assignment through " + way.name + " filters the other records and keeps the edited one", () => {
        const value = [{ a: -5 }, { a: 1 }, { a: -1 }, { a: 3 }, { a: 4 }, { a: 5 }];
        const q = kind.create({ filterExpression: "{a} >= 0" }, 6, undefined, {
          elements: [kind.sibling, { type: "text", name: "go" }],
          triggers: [{ type: "setvalue", expression: "{go} = 1", setToName: kind.valueName, setValue: value }]
        });
        if (kind.name === "matrix") (<any>q.survey.getQuestionByName("sibling")).visibleRows;
        kind.edit(q, 0, -5);
        expect(kind.shown(q), "#1").toEqual([-5, 1, 2, 3, 4, 5]);
        way.setRecordTwo(q);
        expect(q.value.map((r: any) => r.a), "#2").toEqual([-5, 1, -1, 3, 4, 5]);
        expect(kind.shown(q), "#3: record 2 is filtered out, the edited record stays").toEqual([-5, 1, 3, 4, 5]);
      });
    });
    [0, 2].forEach(pageSize => {
      const paging = pageSize > 0 ? { pageSize: pageSize } : {};
      test(kind.name + ": an assignment from outside sorts the other records and keeps the edited one, page size " + pageSize, () => {
        const q = kind.create(Object.assign({ sortCriteria: [{ field: "a" }] }, paging), 6);
        kind.edit(q, 0, 100);
        assignRecord(q, 5, { a: -1 });
        expect(kind.shown(q), "#1").toEqual(pageSize > 0 ? [100, -1] : [100, -1, 1, 2, 3, 4]);
        q.refreshView();
        expect(kind.shown(q), "#2: refreshView sorts it").toEqual(pageSize > 0 ? [-1, 1] : [-1, 1, 2, 3, 4, 100]);
      });
      test(kind.name + ": an added record stays through an assignment from outside, page size " + pageSize, () => {
        const q = kind.create(Object.assign({ filterExpression: "{a} >= 0" }, paging), 4);
        if (kind.name === "panel") q.addPanel(); else { q.visibleRows; q.addRow(); }
        q.pageIndex = 0;
        kind.edit(q, 0, 10);
        const all = (): Array<any> => {
          if (pageSize === 0) return kind.shown(q);
          const res: Array<any> = [];
          for (let i = 0; i < q.pageCount; i++) {
            q.pageIndex = i;
            res.push(...kind.shown(q));
          }
          return res;
        };
        assignRecord(q, 4, { a: -3 });
        expect(all(), "#1: the new record has -3 and stays").toEqual([10, 1, 2, 3, -3]);
        assignRecord(q, 1, { a: -1 });
        expect(all(), "#2: an untouched record is filtered out").toEqual([10, 2, 3, -3]);
      });
    });
    test(kind.name + ": a touched record follows an assignment that inserts or removes a record in front of it", () => {
      const q = kind.create({ filterExpression: "{a} >= 0" }, 6);
      kind.edit(q, 2, -5);
      const inserted = [{ a: -9 }].concat(copyRecords(q.value));
      q.survey.setValue(kind.valueName, inserted);
      expect(kind.shown(q), "#1: the inserted record is filtered out, the edited one stays").toEqual([0, 1, -5, 3, 4, 5]);
      assignRecord(q, 2, { a: -1 });
      // The touched record goes back to its position in the view: the record in front of it left.
      expect(kind.shown(q), "#2: the record that took index 2 is not the touched one").toEqual([0, 3, -5, 4, 5]);
      const removed = copyRecords(q.value);
      removed.splice(3, 1);
      q.survey.setValue(kind.valueName, removed);
      expect(kind.shown(q), "#3: an assignment that removes the touched record drops it").toEqual([0, 3, 4, 5]);
      assignRecord(q, 3, { a: -2 });
      expect(kind.shown(q), "#4: the record now at its index is not touched").toEqual([0, 4, 5]);
    });
    test(kind.name + ": an assignment that changes only the touched record keeps it touched", () => {
      const q = kind.create({ filterExpression: "{a} >= 0" }, 6);
      kind.edit(q, 0, -5);
      assignRecord(q, 0, { a: -7 });
      expect(kind.shown(q), "#1").toEqual([-7, 1, 2, 3, 4, 5]);
      assignRecord(q, 3, { a: -1 });
      expect(kind.shown(q), "#2").toEqual([-7, 1, 2, 4, 5]);
    });
    test(kind.name + ": a computed value is not a touch", () => {
      const expression = kind.name === "panel" ? "{k} - {panel.a}" : "{k} - {row.a}";
      const q = kind.create({ filterExpression: "{e} >= 0" }, 0, expression, { elements: [{ type: "text", name: "k" }] });
      q.survey.setValue("k", 10);
      q.survey.setValue(kind.valueName, [0, 1, 2, 3, 4, 5].map((i: number) => ({ a: i, e: 10 - i })));
      expect(kind.shown(q), "#1").toEqual([0, 1, 2, 3, 4, 5]);
      q.survey.setValue("k", 2);
      expect(kind.shown(q), "#2: the recalculation is the question's own write").toEqual([0, 1, 2, 3, 4, 5]);
      const v = copyRecords(q.value);
      v[0].a = 1;
      q.survey.setValue(kind.valueName, v);
      expect(kind.shown(q), "#3: the next assignment from outside filters the recalculated records").toEqual([1, 1, 2]);
    });
    test(kind.name + ": the records a count grows by are not touched", () => {
      const q = kind.create({ filterExpression: "{a} >= 0" }, 3);
      if (kind.name === "panel") q.panelCount = 5; else q.rowCount = 5;
      expect(kind.shown(q), "#1: the padded records join the view").toEqual([0, 1, 2, undefined, undefined]);
      kind.edit(q, 3, 7);
      assignRecord(q, 0, { a: 10 });
      expect(kind.shown(q), "#2: the edited one stays, the padding is filtered out").toEqual([10, 1, 2, 7]);
    });
    [{ name: "survey.data =", reload: (q: any, v: any) => { q.survey.data = { [q.getValueName()]: v }; } },
      { name: "survey.mergeData", reload: (q: any, v: any) => { q.survey.mergeData({ [q.getValueName()]: v }); } },
      { name: "survey.setDataCore with the records it holds", reload: (q: any) => { q.survey.setDataCore({ [q.getValueName()]: copyRecords(q.value) }); } },
      { name: "survey.clear", reload: (q: any, v: any) => { q.survey.clear(); q.survey.setValue(q.getValueName(), v); } },
      { name: "clearValue", reload: (q: any, v: any) => { q.clearValue(); q.survey.setValue(q.getValueName(), v); } }].forEach(way => {
      test(kind.name + ": " + way.name + " decides the view again for the touched records too", () => {
        const q = kind.create({ filterExpression: "{a} >= 0" }, 6);
        kind.edit(q, 0, -5);
        expect(kind.shown(q), "#1").toEqual([-5, 1, 2, 3, 4, 5]);
        way.reload(q, copyRecords(q.value));
        expect(kind.shown(q), "#2").toEqual([1, 2, 3, 4, 5]);
      });
    });
    [{ name: "refreshView()", change: (q: any) => { q.refreshView(); } },
      { name: "a filter change", change: (q: any) => { q.filterExpression = "{a} >= -100"; } },
      { name: "a sort change", change: (q: any) => { q.sort([{ field: "a", direction: "asc" }]); } }].forEach(way => {
      test(kind.name + ": " + way.name + " drops the touched records", () => {
        const q = kind.create({ filterExpression: "{a} >= 0" }, 6);
        kind.edit(q, 0, 7);
        way.change(q);
        assignRecord(q, 0, { a: -500 });
        expect(kind.shown(q).indexOf(-500), "#1: the formerly touched record is filtered out").toBe(-1);
      });
    });
    test(kind.name + ": an add is touched before the handlers of its own write run", () => {
      const isPanel = kind.name === "panel";
      const q = kind.create(isPanel ? { filterExpression: "{a} >= 0" } : { filterExpression: "{a} >= 0", defaultRowValue: { a: -3 } }, 4);
      if (!isPanel) q.visibleRows;
      let calls = 0;
      q.survey.onValueChanged.add((_, options) => {
        if (options.name !== kind.valueName || calls > 0 || !Array.isArray(options.value) || options.value.length !== 5) return;
        calls++;
        const v = copyRecords(q.value);
        v[1] = { a: -1 };
        q.survey.setValue(kind.valueName, v);
      });
      if (isPanel) q.addPanel(); else q.addRow();
      expect(calls, "#1").toBe(1);
      expect(kind.shown(q), "#2: the new record stays, the untouched one is filtered out").toEqual([0, 2, 3, isPanel ? undefined : -3]);
    });
    test(kind.name + ": an add at a position is touched before the handlers of its own write run", () => {
      const isPanel = kind.name === "panel";
      const q = kind.create({ filterExpression: "{a} >= 0" }, 4);
      if (!isPanel) q.visibleRows;
      let calls = 0;
      q.survey.onValueChanged.add((_, options) => {
        if (options.name !== kind.valueName || calls > 0 || !Array.isArray(options.value) || options.value.length !== 5) return;
        calls++;
        const v = copyRecords(q.value);
        const at = v.map((r: any) => r.a).indexOf(2);
        v[at] = { a: -1 };
        q.survey.setValue(kind.valueName, v);
      });
      if (isPanel) q.addPanel(1); else q.addRowByIndex({ a: -3 }, 1);
      expect(calls, "#1").toBe(1);
      const shown = kind.shown(q);
      expect(shown.indexOf(-1), "#2: the untouched record is filtered out").toBe(-1);
      expect(shown.indexOf(isPanel ? undefined : -3) > -1, "#3: the new record stays").toBe(true);
    });
  });
  test("panels follow the view after an assignment from outside when nothing is touched", () => {
    const q = createStablePanel({ filterExpression: "{a} >= 0" }, 6);
    const v = copyRecords(q.value);
    v[2] = { a: -1 };
    q.survey.setValue("p", v);
    expect(panelAs(q), "#1").toEqual([0, 1, 3, 4, 5]);
  });
  test("a touched record that an assignment moves from one end of the records to the other keeps its place", () => {
    const first = createStableMatrix({ sortCriteria: [{ field: "a" }] }, 6);
    first.visibleRows[0].getQuestionByColumnName("a").value = 100;
    expect(rowAs(first), "#1: the edit keeps its place").toEqual([100, 1, 2, 3, 4, 5]);
    first.survey.setValue("m", [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 100 }]);
    expect(rowAs(first), "#2: moved from the first record to the last, it stays first").toEqual([100, 1, 2, 3, 4, 5]);
    const last = createStableMatrix({ sortCriteria: [{ field: "a" }] }, 6);
    last.visibleRows[5].getQuestionByColumnName("a").value = -100;
    expect(rowAs(last), "#3").toEqual([0, 1, 2, 3, 4, -100]);
    last.survey.setValue("m", [{ a: -100 }, { a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]);
    expect(rowAs(last), "#4: moved from the last record to the first, it stays last").toEqual([0, 1, 2, 3, 4, -100]);
  });
});
/* A row of the fixed matrix the respondent edited keeps its place through an answer assignment - its
   own answer may change or go: the row is the record. A rows change keeps it by row name, and a
   removed row leaves the set. */
describe("Page window: an edit through a question with a valueName touches its record", () => {
  const value = (): Array<any> => [{ a: 1, b: "x" }, { a: 2, b: "x" }, { a: 3, b: "z" }];
  const assignKeepingEveryRecord = (q: any): void => {
    const val = copyRecords(q.value);
    val[1].a = 22;
    q.value = val;
  };
  const runMatrix = (detailQuestion: any): Array<Array<any>> => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, filterExpression: "{b} = 'x'",
      columns: [{ name: "a", cellType: "text" }], detailPanelMode: "underRow", detailElements: [detailQuestion] }] });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    q.value = value();
    const rows = q.visibleRows;
    rows[0].showDetailPanel();
    rows[0].detailPanel.getQuestionByName(detailQuestion.name).value = "y";
    const afterEdit = q.visibleRows.map(r => r.getValue("a"));
    assignKeepingEveryRecord(q);
    return [afterEdit, q.visibleRows.map(r => r.getValue("a"))];
  };
  test("matrix: a detail question named after its field keeps the edited record shown after an outside assignment", () => {
    expect(runMatrix({ type: "text", name: "b" }), "#1").toEqual([[1, 2], [1, 22]]);
  });
  test("matrix: a detail question with a valueName keeps the edited record shown after an outside assignment", () => {
    expect(runMatrix({ type: "text", name: "bq", valueName: "b" }), "#1").toEqual([[1, 2], [1, 22]]);
  });
  test("panel: a template question with a valueName keeps the edited record shown after an outside assignment", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", filterExpression: "{b} = 'x'",
      templateElements: [{ type: "text", name: "a" }, { type: "text", name: "bq", valueName: "b" }] }] });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    q.value = value();
    q.panels[0].getQuestionByName("bq").value = "y";
    expect(q.panels.map(p => p.getQuestionByName("a").value), "#1").toEqual([1, 2]);
    assignKeepingEveryRecord(q);
    expect(q.panels.map(p => p.getQuestionByName("a").value), "#2").toEqual([1, 22]);
  });
});

describe("Fixed matrix: the rows the respondent edited stay shown", () => {
  const createSorted = (): { survey: SurveyModel, matrix: QuestionMatrixDropdownModel } => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", sortCriteria: [{ field: "a", direction: "desc" }],
      rows: ["r1", "r2", "r3", "r4"], columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: { r1: { a: "b" }, r2: { a: "c" }, r3: { a: "d" }, r4: { a: "e" } } };
    return { survey: survey, matrix: <QuestionMatrixDropdownModel>survey.getQuestionByName("m") };
  };
  const rowNames = (matrix: QuestionMatrixDropdownModel): Array<string> => matrix.visibleRows.map(row => row.rowName);
  test("an edited row keeps its place through answer assignments that change other rows, its own answer, or drop it", () => {
    const { survey, matrix } = createSorted();
    expect(rowNames(matrix), "#1").toEqual(["r4", "r3", "r2", "r1"]);
    matrix.visibleRows[0].getQuestionByColumnName("a").value = "a";
    expect(rowNames(matrix), "#2: the edit keeps its place").toEqual(["r4", "r3", "r2", "r1"]);
    survey.setValue("m", { r1: { a: "f" }, r2: { a: "c" }, r3: { a: "d" }, r4: { a: "a" } });
    expect(rowNames(matrix), "#3: the others are sorted").toEqual(["r4", "r1", "r3", "r2"]);
    survey.setValue("m", { r1: { a: "f" }, r2: { a: "g" }, r3: { a: "d" }, r4: { a: "0" } });
    expect(rowNames(matrix), "#4: its own answer changed").toEqual(["r4", "r2", "r1", "r3"]);
    survey.setValue("m", { r1: { a: "f" }, r2: { a: "g" }, r3: { a: "h" } });
    expect(rowNames(matrix), "#5: its answer is gone").toEqual(["r4", "r3", "r2", "r1"]);
    matrix.refreshView();
    expect(rowNames(matrix)[0] === "r4", "#6: refreshView sorts it").toBe(false);
  });
  test("a rows change keeps an edited row by its name, and a removed row leaves the set", () => {
    const { survey, matrix } = createSorted();
    matrix.visibleRows[0].getQuestionByColumnName("a").value = "a";
    matrix.rows.splice(0, 0, new ItemValue("r0"));
    survey.setValue("m", Object.assign({}, survey.getValue("m"), { r0: { a: "z" } }));
    expect(rowNames(matrix), "#1: r4 keeps its place").toEqual(["r4", "r0", "r3", "r2", "r1"]);
    matrix.rows.splice(matrix.rows.map(row => row.value).indexOf("r4"), 1);
    matrix.rows.push(new ItemValue("r4"));
    survey.setValue("m", Object.assign({}, survey.getValue("m"), { r1: { a: "y" } }));
    expect(rowNames(matrix), "#2: the row that came back is not touched").toEqual(["r0", "r1", "r3", "r2", "r4"]);
  });
  test("clearValue() drops the edited rows", () => {
    const { survey, matrix } = createSorted();
    matrix.visibleRows[0].getQuestionByColumnName("a").value = "a";
    matrix.clearValue();
    survey.setValue("m", { r1: { a: "b" }, r2: { a: "c" }, r3: { a: "d" }, r4: { a: "a" } });
    expect(rowNames(matrix), "#1").toEqual(["r3", "r2", "r1", "r4"]);
  });
  test("paged: a rows change keeps an edited row of another page by its name, and the validation goes to its page", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", pageSize: 2,
      rows: ["r1", "r2", "r3", "r4"], columns: [{ name: "a", cellType: "text", validators: [{ type: "numeric" }] }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    matrix.nextPage();
    matrix.visibleRows[0].getQuestionByColumnName("a").value = "abc";
    matrix.prevPage();
    expect(matrix.pageIndex, "#1: a move back does not validate").toBe(0);
    matrix.rows.splice(0, 0, new ItemValue("x1"), new ItemValue("x2"));
    expect(survey.validate(), "#2: the edited row is still validated").toBe(false);
    expect(matrix.pageIndex, "#3: on the page of r3").toBe(2);
    expect(rowNames(matrix), "#4").toEqual(["r3", "r4"]);
  });
});
/* What a record contributes without an object. Page size 0 keeps every released result. With paging:
   invisible values are cleared on every page of a local question, value-only; expressions, defaults
   and totals cover the current page and the pages visited (a known limitation); plain data covers the
   current page of a dynamic panel; validation covers the current page and the edited records. */
describe("Page window: record semantics without an object", () => {
  /* The clear decides the visibility of every record over its stored values (one run of the condition
     each) and writes the value; the write re-decides it like any value change of a paged question. The
     cost grows with the record count, linearly, and only when the survey clears invisible values. */
  test("matrix with paging: clearInvisibleValues removes the records rowsVisibleIf hides on every page, value-only", () => {
    FunctionFactory.Instance.register("isShownRecord", function (params: Array<any>): boolean { return params[0] !== "hide"; });
    try {
      const run = (copies: number): any => {
        const survey = new SurveyModel({ clearInvisibleValues: "onComplete", elements: [
          { type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 2, rowsVisibleIf: "isShownRecord({row.a})",
            filterExpression: "{a} != 'out'",
            columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }] }] });
        const data: Array<any> = [];
        for (let i = 0; i < copies; i++) {
          data.push({ a: "x", b: 1 }, { a: "hide", b: 2 }, { a: "y", b: 3 }, { a: "out", b: 4 }, { a: "z", b: 5 }, { a: "hide", b: 6 });
        }
        survey.data = { m: data };
        const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
        matrix.visibleRows[0].getQuestionByName("b").value = 10;
        expect(survey.data.m.length, "an ordinary edit clears nothing").toBe(6 * copies);
        survey.completeLastPage();
        return survey.data.m;
      };
      expect(run(1), "#1: the hidden records are gone, the filtered-out one stays")
        .toEqual([{ a: "x", b: 10 }, { a: "y", b: 3 }, { a: "out", b: 4 }, { a: "z", b: 5 }]);
      expect(run(10).length, "#2").toBe(40);
    } finally {
      FunctionFactory.Instance.unregister("isShownRecord");
    }
  });
  test("matrix over a source that pages itself: clearing invisible values on complete sends nothing to the source", async () => {
    const source = new PagedSource(records(6, i => ({ id: i, name: i % 2 === 0 ? "hide" : "n" + i })));
    const survey = new SurveyModel({ clearInvisibleValues: "onComplete", elements: [
      { type: "matrixdynamic", name: "md", rowCount: 0, pageSize: 3, rowsVisibleIf: "{row.name} != 'hide'", columns: matrixColumns }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("md");
    matrix.dataSource = source;
    await flush();
    const reads = source.reads.length;
    survey.completeLastPage();
    await flush();
    expect(source.removes, "#1: nothing is removed from the source").toEqual([]);
    expect(source.updates, "#2: nothing is updated").toEqual([]);
    expect(source.reads.length, "#3: nothing is read").toBe(reads);
    expect(source.data.length, "#4").toBe(6);
  });
  test("matrix with a filter: displayValue formats every record, the ones the filter excludes included", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", filterExpression: "{c} = 2",
      columns: [{ name: "c", cellType: "dropdown", choices: [{ value: 1, text: "One" }, { value: 2, text: "Two" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ c: 1 }, { c: 2 }];
    expect(matrix.displayValue, "#1").toEqual([{ c: "One" }, { c: "Two" }]);
    expect(matrix.value, "#2: the answer is not changed").toEqual([{ c: 1 }, { c: 2 }]);
    matrix.sort([{ field: "c", direction: "desc" }]);
    expect(matrix.displayValue, "#3: in record order under a sort").toEqual([{ c: "One" }, { c: "Two" }]);
  });
  test("Bug#12156: with paging, expressions and totals cover every record, as without paging", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 0, pageSize: 2,
        columns: [{ name: "a", cellType: "text", inputType: "number" }, { name: "b", cellType: "expression", expression: "{row.a} * 2" }] },
      { type: "expression", name: "s", expression: "sumInArray({m}, 'b')" }] });
    survey.data = { m: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    expect(survey.getValue("s"), "#1: every record, not the page shown only").toBe(30);
    matrix.pageIndex = 2;
    expect(survey.getValue("s"), "#2: a page visit changes nothing").toBe(30);
    matrix.pageIndex = 0;
    expect(survey.data.m.map((r: any) => r.b), "#3: page 1 was never opened and is computed too")
      .toEqual([2, 4, 6, 8, 10]);
    const unpaged = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 0,
        columns: [{ name: "a", cellType: "text", inputType: "number" }, { name: "b", cellType: "expression", expression: "{row.a} * 2" }] },
      { type: "expression", name: "s", expression: "sumInArray({m}, 'b')" }] });
    unpaged.data = { m: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }] };
    (<QuestionMatrixDynamicModel>unpaged.getQuestionByName("m")).visibleRows;
    expect(unpaged.getValue("s"), "#4: page size 0 covers every record").toBe(30);
  });
  test("with paging, a default value is written once per record, not again on a later visit", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", pageSize: 2, panelCount: 0,
      templateElements: [{ type: "text", name: "id" }, { type: "text", name: "d", defaultValueExpression: "'def' + {panelIndex}" }] }] });
    survey.data = { pd: records(6, i => ({ id: i })) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels;
    expect(survey.data.pd.map((r: any) => r.d), "#1: the first page").toEqual(["def0", "def1", undefined, undefined, undefined, undefined]);
    question.panels[0].getQuestionByName("d").value = "changed";
    question.pageIndex = 1;
    question.pageIndex = 0;
    expect(question.panels[0].getQuestionByName("d").value, "#2: a visit does not write the default again").toBe("changed");
    expect(survey.data.pd.map((r: any) => r.d), "#3").toEqual(["changed", "def1", "def2", "def3", undefined, undefined]);
  });
  test("plain data: every record without paging, the current page of a dynamic panel with it", () => {
    const unpaged = createPanel({ panelCount: 0 }, records(5));
    expect(unpaged.getPlainData().data.length, "#1: page size 0").toBe(5);
    const paged = createPanel({ panelCount: 0, pageSize: 2 }, records(5));
    paged.pageIndex = 1;
    expect(paged.getPlainData().data.map((item: any) => item.value.id), "#2: the current page (a known limitation)").toEqual([2, 3]);
  });
  test("without paging, the answers do not depend on the order the panels were visited in, in every display mode", () => {
    const run = (mode: string, order: Array<number>): any => {
      const survey = new SurveyModel({ elements: [
        { type: "paneldynamic", name: "pd", displayMode: mode, templateElements: [
          { type: "text", name: "a", inputType: "number" },
          { type: "text", name: "d", defaultValueExpression: "{panelIndex} * 10" },
          { type: "expression", name: "e", expression: "{panel.a} + {panel.d}" }] },
        { type: "expression", name: "total", expression: "sumInArray({pd}, 'e')" }] });
      survey.data = { pd: [{ a: 1 }, { a: 2 }, { a: 3 }] };
      const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      question.panels;
      order.forEach(i => { if (mode !== "list") question.currentIndex = i; });
      return survey.data;
    };
    ["list", "tab", "carousel"].forEach(mode => {
      const forward = run(mode, [0, 1, 2]);
      expect(run(mode, [2, 0, 1]), mode + ": the visit order does not matter").toEqual(forward);
      expect(forward.total, mode + ": every record is computed").toBe(36);
    });
  });
});
/* Bug#12156: the expression columns of a matrix and the expression questions of a panel template are
   computed for every record in memory, with or without an object, when the question pages or has a
   filter or a sort. Aggregates, sorting and filtering by them give the unpaged result. */
describe("Bug#12156: expression fields of the records without an object", () => {
  const orders = (count: number = 10): Array<any> => {
    const res: Array<any> = [];
    for (let i = 0; i < count; i++) res.push({ qty: i + 1, price: 10 });
    return res;
  };
  const createMatrix = (props: any, expression: string = "{row.qty} * {row.price}", extraColumns: Array<any> = []): { survey: SurveyModel, q: QuestionMatrixDynamicModel } => {
    const survey = new SurveyModel({ elements: [
      Object.assign({ type: "matrixdynamic", name: "orders", rowCount: 0, columns: [
        { name: "qty", cellType: "text", inputType: "number" },
        { name: "price", cellType: "text", inputType: "number" },
        { name: "total", cellType: "expression", expression: expression }].concat(extraColumns) }, props),
      { type: "expression", name: "sum", expression: "sumInArray({orders}, 'total')" }] });
    survey.data = { orders: orders() };
    return { survey: survey, q: <QuestionMatrixDynamicModel>survey.getQuestionByName("orders") };
  };
  const createPanel = (props: any): { survey: SurveyModel, q: QuestionPanelDynamicModel } => {
    const survey = new SurveyModel({ elements: [
      Object.assign({ type: "paneldynamic", name: "orders", panelCount: 0, templateElements: [
        { type: "text", name: "qty", inputType: "number" },
        { type: "text", name: "price", inputType: "number" },
        { type: "expression", name: "total", expression: "{panel.qty} * {panel.price}" }] }, props),
      { type: "expression", name: "sum", expression: "sumInArray({orders}, 'total')" }] });
    survey.data = { orders: orders() };
    return { survey: survey, q: <QuestionPanelDynamicModel>survey.getQuestionByName("orders") };
  };
  const totals = (survey: SurveyModel): Array<any> => survey.data.orders.map((r: any) => r.total);
  const rowTotals = (q: QuestionMatrixDynamicModel): Array<any> => q.visibleRows.map(r => r.getQuestionByColumnName("total").value);
  test("matrix with paging: aggregates, sort and filter read every record", () => {
    const { survey, q } = createMatrix({ pageSize: 3 });
    q.visibleRows;
    expect(survey.getValue("sum"), "#1: sumInArray").toBe(550);
    expect(totals(survey), "#2: every record has total").toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    q.sortCriteria = [{ field: "total", direction: "desc" }];
    expect(rowTotals(q), "#3: sorted by total").toEqual([100, 90, 80]);
    q.filterExpression = "{total} > 50";
    expect([rowTotals(q), q.pageCount], "#4: filtered by total").toEqual([[100, 90, 80], 2]);
  });
  test("panel with paging: sumInArray reads every record", () => {
    const { survey, q } = createPanel({ pageSize: 3 });
    expect(q.panels.length, "#1: one page is built").toBe(3);
    expect(survey.getValue("sum"), "#2: sumInArray").toBe(550);
    expect(totals(survey), "#3: every record has total").toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  });
  test("without paging, a filter or a sort by an expression field in JSON", () => {
    const filtered = createMatrix({ filterExpression: "{total} > 50" });
    expect([rowTotals(filtered.q), filtered.survey.getValue("sum")], "#1: matrix filter").toEqual([[60, 70, 80, 90, 100], 550]);
    const sorted = createMatrix({ sortCriteria: [{ field: "total", direction: "desc" }] });
    expect(rowTotals(sorted.q).slice(0, 3), "#2: matrix sort").toEqual([100, 90, 80]);
    const panel = createPanel({ filterExpression: "{total} > 50" });
    expect([panel.q.panels.length, panel.survey.getValue("sum")], "#3: panel filter").toEqual([5, 550]);
  });
  test("with paging, the records without an object are computed again when what they read changes", () => {
    const { survey, q } = createMatrix({ pageSize: 3 }, "{row.qty} * {row.price} * {rate}");
    survey.setVariable("rate", 1);
    q.visibleRows;
    expect(survey.getValue("sum"), "#1").toBe(550);
    survey.setVariable("rate", 2);
    expect(survey.getValue("sum"), "#2: a survey variable").toBe(1100);
    q.pageIndex = 1;
    q.pageIndex = 0;
    const records = survey.data.orders.map((r: any) => Object.assign({}, r));
    records[4].qty = 100;
    survey.setValue("orders", records);
    expect(survey.data.orders[4].total, "#3: a record of a page visited and left").toBe(2000);
    expect(survey.getValue("sum"), "#4").toBe(1100 - 100 + 2000);
  });
  test("with paging, an expression that reads another expression field of the record", () => {
    const { survey, q } = createMatrix({ pageSize: 3 }, "{row.qty} * {row.price}", [{ name: "dbl", cellType: "expression", expression: "{row.total} * 2" }]);
    q.visibleRows;
    expect(survey.data.orders.map((r: any) => r.dbl), "#1").toEqual([20, 40, 60, 80, 100, 120, 140, 160, 180, 200]);
  });
  test("with paging, a page built later computes the same values and writes nothing", () => {
    const { survey, q } = createMatrix({ pageSize: 3 });
    q.visibleRows;
    const changes: Array<string> = [];
    survey.onValueChanged.add((_, options) => { changes.push(options.name); });
    q.pageIndex = 2;
    expect(rowTotals(q), "#1: the page").toEqual([70, 80, 90]);
    expect(changes, "#2: no value change").toEqual([]);
  });
});
/* A dynamic panel that pages in memory builds panels for one page. Clearing invisible values gives
   the answer the same panel gives without paging: the records without a panel are cleared over their
   stored values, without building one. */
describe("Paged dynamic panel: clearing invisible values gives the unpaged answer", () => {
  const sixRecords = (create: (i: number) => any): Array<any> => records(6, create);
  const secretIfYes = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "{panel.show} = 'yes'" }];
  const showOnThree = (i: number): any => ({ show: i === 3 ? "yes" : "no", secret: "s" + i });
  const onlyThreeKeepsSecret = sixRecords((i: number): any => i === 3 ? { show: "yes", secret: "s3" } : { show: "no" });
  const complete = (panelJson: any, data: Array<any>, surveyJson?: any, extra?: Array<any>,
    before?: (survey: SurveyModel, question: QuestionPanelDynamicModel) => void): SurveyModel => {
    const survey = new SurveyModel(Object.assign({ clearInvisibleValues: "onComplete", elements:
      [Object.assign({ type: "paneldynamic", name: "pd" }, panelJson)].concat(extra || []) }, surveyJson));
    survey.mergeData({ pd: data });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels;
    if (!!before) before(survey, question);
    survey.completeLastPage();
    return survey;
  };
  // The same JSON and data with pageSize 2 and without paging; returns the unpaged answer.
  const expectSameAsUnpaged = (panelJson: any, data: Array<any>, surveyJson?: any, extra?: Array<any>,
    before?: (survey: SurveyModel, question: QuestionPanelDynamicModel) => void): any => {
    const unpaged = complete(panelJson, Helpers.getUnbindValue(data), surveyJson, extra, before).data;
    const paged = complete(Object.assign({ pageSize: 2 }, panelJson), Helpers.getUnbindValue(data), surveyJson, extra, before).data;
    expect(paged, "paged equals unpaged").toEqual(unpaged);
    return unpaged;
  };
  test("a template question hidden by its visibleIf loses its answer in every record", () => {
    expect(expectSameAsUnpaged({ templateElements: secretIfYes }, sixRecords(showOnThree)).pd).toEqual(onlyThreeKeepsSecret);
  });
  test("a visibleIf shared by two template questions calls its function with each question as this.question", () => {
    FunctionFactory.Instance.register("isTemplateQuestionB", function (this: any): boolean { return this.question.name === "b"; });
    try {
      const template = [{ type: "text", name: "a", visibleIf: "isTemplateQuestionB()" }, { type: "text", name: "b", visibleIf: "isTemplateQuestionB()" }];
      expect(expectSameAsUnpaged({ templateElements: template }, sixRecords((i: number): any => ({ a: "a" + i, b: "b" + i }))).pd)
        .toEqual(sixRecords((i: number): any => ({ b: "b" + i })));
    } finally {
      FunctionFactory.Instance.unregister("isTemplateQuestionB");
    }
  });
  test("a question in a template panel hidden by the panel's visibleIf loses its answer in every record", () => {
    const template = [{ type: "text", name: "show" },
      { type: "panel", name: "box", visibleIf: "{panel.show} = 'yes'", elements: [{ type: "text", name: "secret" }] }];
    expect(expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree)).pd).toEqual(onlyThreeKeepsSecret);
  });
  test("a record templateVisibleIf hides keeps its visible answers and loses the invisible ones", () => {
    const template = [{ type: "text", name: "show" }, { type: "text", name: "a" }, { type: "text", name: "secret", visibleIf: "{panel.a} = 'x'" }];
    const data = sixRecords((i: number): any => ({ show: i % 2 === 1 ? "hide" : "no", a: "y", secret: "s" + i }));
    expect(expectSameAsUnpaged({ templateVisibleIf: "{panel.show} != 'hide'", templateElements: template }, data).pd)
      .toEqual(sixRecords((i: number): any => ({ show: i % 2 === 1 ? "hide" : "no", a: "y" })));
  });
  test("clearIfInvisible none keeps every answer", () => {
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "{panel.show} = 'yes'", clearIfInvisible: "none" }];
    expect(expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree)).pd).toEqual(sixRecords(showOnThree));
  });
  test("a hidden dropdown with an other answer loses the value and the comment", () => {
    const template = [{ type: "text", name: "show" },
      { type: "dropdown", name: "sel", choices: [1, 2], showOtherItem: true, visibleIf: "{panel.show} = 'yes'" }];
    const data = sixRecords((i: number): any => ({ show: i === 3 ? "yes" : "no", sel: "other", "sel-Comment": "text" + i }));
    expect(expectSameAsUnpaged({ templateElements: template }, data).pd)
      .toEqual(sixRecords((i: number): any => i === 3 ? { show: "yes", sel: "other", "sel-Comment": "text3" } : { show: "no" }));
  });
  test("a template question hidden by a survey value loses its answer in every record", () => {
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "{top} = 'yes'" }];
    const res = expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree), undefined, [{ type: "text", name: "top" }],
      (survey: SurveyModel): void => { survey.setValue("top", "no"); });
    expect(res.pd).toEqual(sixRecords((i: number): any => ({ show: i === 3 ? "yes" : "no" })));
  });
  test("a template question with visible false loses its answer in every record", () => {
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visible: false }];
    expect(expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree)).pd)
      .toEqual(sixRecords((i: number): any => ({ show: i === 3 ? "yes" : "no" })));
  });
  test("a page visited and left is cleared as a page never opened", () => {
    const visit = (survey: SurveyModel, question: QuestionPanelDynamicModel): void => {
      question.pageIndex = 1;
      question.pageIndex = 0;
    };
    expect(expectSameAsUnpaged({ templateElements: secretIfYes }, sixRecords(showOnThree), undefined, undefined, visit).pd).toEqual(onlyThreeKeepsSecret);
  });
  test("clearInvisibleValues onHidden clears every record at completion", () => {
    expect(expectSameAsUnpaged({ templateElements: secretIfYes }, sixRecords(showOnThree), { clearInvisibleValues: "onHidden" }).pd)
      .toEqual(onlyThreeKeepsSecret);
  });
  test("onHiddenContainer: the dynamic panel hidden clears its value", () => {
    const res = expectSameAsUnpaged({ templateElements: secretIfYes, visibleIf: "{top} != 'hide'" }, sixRecords(showOnThree),
      { clearInvisibleValues: "onHiddenContainer" }, [{ type: "text", name: "top" }],
      (survey: SurveyModel): void => { survey.setValue("top", "hide"); });
    expect(res.pd).toBeUndefined();
  });
  test("onHiddenContainer: a template panel hidden by its visibleIf loses its questions' answers at completion and when the dynamic panel is hidden", () => {
    const template = [{ type: "text", name: "show" },
      { type: "panel", name: "box", visibleIf: "{panel.show} = 'yes'", elements: [{ type: "text", name: "secret" }] }];
    const surveyJson = { clearInvisibleValues: "onHiddenContainer" };
    expect(expectSameAsUnpaged({ templateElements: template }, sixRecords(showOnThree), surveyJson).pd, "#1: at completion").toEqual(onlyThreeKeepsSecret);
    // The dynamic panel keeps its value (clearIfInvisible none): only its records are cleaned up when it is hidden.
    const hideQuestion = (survey: SurveyModel): void => { survey.setValue("top", "hide"); };
    const res = expectSameAsUnpaged({ templateElements: template, visibleIf: "{top} != 'hide'", clearIfInvisible: "none" }, sixRecords(showOnThree),
      { clearInvisibleValues: "onHiddenContainer" }, [{ type: "text", name: "top" }], hideQuestion);
    expect(res.pd, "#2: the dynamic panel is the hidden container of every template question").toEqual(sixRecords((): any => ({})));
  });
  test("a record the filter excludes keeps its hidden answer, paged and unpaged", () => {
    const data = sixRecords(showOnThree);
    data[4].show = "out";
    const res = expectSameAsUnpaged({ templateElements: secretIfYes, filterExpression: "{show} != 'out'" }, data);
    expect(res.pd[4], "#1: excluded, kept").toEqual({ show: "out", secret: "s4" });
    expect(res.pd[5], "#2: shown and hidden, cleared").toEqual({ show: "no" });
  });
  test("a dynamic panel on the start page keeps the hidden answers of its records without a panel", () => {
    const start = (survey: SurveyModel): void => { survey.start(); };
    const res = expectSameAsUnpaged({ templateElements: secretIfYes }, sixRecords(showOnThree), { firstPageIsStartPage: true, pages: [
      { elements: [{ type: "paneldynamic", name: "pd", templateElements: secretIfYes }] }, { elements: [{ type: "text", name: "second" }] }] },
    undefined, start);
    expect(res.pd, "nothing is cleared on the start page").toEqual(sixRecords(showOnThree));
  });
  test("a visible question with the same value name does not keep a hidden template question's answer, paged as unpaged", () => {
    /* A built question keeps its answer when a visible question of the same parent shares its value name
       (survey.hasVisibleQuestionByValueName). A template question has the dynamic panel as its parent
       question, and the survey holds no second question with it: a visible template question with the value
       name does not count, and a question outside the dynamic panel does not either. */
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", valueName: "shared", visibleIf: "{panel.show} = 'yes'" },
      { type: "text", name: "other", valueName: "shared" }];
    const data = sixRecords((i: number): any => ({ show: i === 3 ? "yes" : "no", shared: "s" + i }));
    const cleared = sixRecords((i: number): any => i === 3 ? { show: "yes", shared: "s3" } : { show: "no" });
    expect(expectSameAsUnpaged({ templateElements: template }, data).pd, "#1: a template question with the value name").toEqual(cleared);
    expect(expectSameAsUnpaged({ templateElements: template.slice(0, 2) }, data, undefined, [{ type: "text", name: "top", valueName: "shared" }]).pd,
      "#2: a top-level question with the value name").toEqual(cleared);
  });
  test("a null record among the records without a panel stays null and the others are cleared", () => {
    // Paged only: a panel built for a null record reads its values from null, so the null record stays off the page.
    const data = sixRecords(showOnThree);
    data[4] = null;
    const expected = Helpers.getUnbindValue(onlyThreeKeepsSecret);
    expected[4] = null;
    expect(complete({ pageSize: 2, templateElements: secretIfYes }, data).data.pd).toEqual(expected);
  });
  test("known limitation: a records question nested in a record without a panel keeps the hidden values its own clean-up would clear", () => {
    const nestedPanel = { type: "paneldynamic", name: "inner", templateElements: [{ type: "text", name: "h", visibleIf: "false" }] };
    const nestedMatrix = { type: "matrixdynamic", name: "inner", rowCount: 0, rowsVisibleIf: "{row.c} != 'hide'", columns: [{ name: "c", cellType: "text" }] };
    [{ template: nestedPanel, record: (i: number): any => ({ inner: [{ h: "h" + i }] }), cleared: { inner: [{}] } },
      { template: nestedMatrix, record: (i: number): any => ({ inner: [{ c: "hide" }, { c: "c" + i }] }), cleared: (i: number): any => ({ inner: [{ c: "c" + i }] }) }]
      .forEach((nested: any, k: number) => {
        const res = complete({ pageSize: 2, templateElements: [nested.template] }, sixRecords(nested.record)).data.pd;
        const cleared = (i: number): any => typeof nested.cleared === "function" ? nested.cleared(i) : nested.cleared;
        expect(res.slice(0, 2), "#" + k + ": the records with a panel are cleared").toEqual([cleared(0), cleared(1)]);
        expect(res.slice(2), "#" + k + ": the records without one keep the nested values").toEqual(sixRecords(nested.record).slice(2));
      });
  });
  test("an edit, a page move and a hide under onHidden leave the records without a panel as they are", () => {
    const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [
      { type: "paneldynamic", name: "pd", pageSize: 2, templateElements: secretIfYes }] });
    survey.data = { pd: sixRecords(showOnThree) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels[0].getQuestionByName("show").value = "yes";
    question.panels[0].getQuestionByName("show").value = "no";
    question.pageIndex = 1;
    question.pageIndex = 0;
    expect(survey.data.pd[4], "#2: a record that never had a panel is not touched").toEqual({ show: "no", secret: "s4" });
    expect(survey.data.pd[0], "#3: the object hidden by the edit reacts, as released").toEqual({ show: "no" });
  });
  test("the pass clears the records without a panel and writes the value once", () => {
    FunctionFactory.Instance.register("isShownWhenYes", function (params: Array<any>): boolean { return params[0] === "yes"; });
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "isShownWhenYes({panel.show})" },
      { type: "text", name: "other", visibleIf: "isShownWhenYes({panel.show})" }];
    try {
      const run = (count: number): { writes: number, data: Array<any> } => {
        const survey = new SurveyModel({ clearInvisibleValues: "onComplete", elements: [
          { type: "paneldynamic", name: "pd", pageSize: 2, templateElements: template }] });
        // The page shown holds nothing to clear: the writes counted are the pass's.
        survey.data = { pd: records(count, (i: number): any => ({ show: i < 2 ? "yes" : "no", secret: "s" + i, other: "o" + i })) };
        const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
        question.panels;
        let writes = 0;
        survey.onValueChanged.add((_: SurveyModel, options: any): void => { if (options.name === "pd") writes++; });
        survey.completeLastPage();
        return { writes: writes, data: survey.data.pd };
      };
      const large = run(50);
      expect(large.data.slice(0, 3), "#1").toEqual([{ show: "yes", secret: "s0", other: "o0" }, { show: "yes", secret: "s1", other: "o1" }, { show: "no" }]);
      expect(large.writes, "#3: one value write").toBe(1);
    } finally {
      FunctionFactory.Instance.unregister("isShownWhenYes");
    }
  });
  test("page size 0: the unpaged answer is the released one", () => {
    expect(complete({ templateElements: secretIfYes }, sixRecords(showOnThree)).data.pd).toEqual(onlyThreeKeepsSecret);
  });
  /* onHidden: an object built for a record that already exists - a page move, a view rebuild, the refill
     after a removal - clears no answer because its question becomes hidden in its first condition run.
     Each scenario runs with the view and without it. */
  describe("onHidden: an object built for an existing record keeps its hidden answer", () => {
    const hiddenUnlessOne = [{ type: "text", name: "k" }, { type: "text", name: "t", visibleIf: "{panel.k} = 1" }];
    const runPanel = (view: any, data: Array<any>, change: (survey: SurveyModel, question: QuestionPanelDynamicModel) => void): any => {
      const survey = new SurveyModel({ clearInvisibleValues: "onHidden",
        elements: [Object.assign({ type: "paneldynamic", name: "p", templateElements: hiddenUnlessOne }, view)] });
      survey.data = { p: data };
      const question = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
      question.panels;
      change(survey, question);
      return survey.data.p;
    };
    const expectPanelSameAsPlain = (view: any, data: Array<any>, change: (survey: SurveyModel, question: QuestionPanelDynamicModel) => void): any => {
      const plain = runPanel({}, Helpers.getUnbindValue(data), change);
      expect(runPanel(view, Helpers.getUnbindValue(data), change), "with the view equals without it").toEqual(plain);
      return plain;
    };
    const removeFirst = (survey: SurveyModel, question: QuestionPanelDynamicModel): void => { question.removePanelUI(question.panels[0]); };
    test("paged: a removal brings a record with a hidden answer onto the page", () => {
      const data = [{ k: 1, t: "a" }, { k: 1, t: "b" }, { k: 3, t: "c" }, { k: 3, t: "d" }];
      expect(expectPanelSameAsPlain({ pageSize: 2 }, data, removeFirst)).toEqual([{ k: 1, t: "b" }, { k: 3, t: "c" }, { k: 3, t: "d" }]);
    });
    test("paged: a move to the next page keeps the hidden answers of its records", () => {
      const data = [{ k: 1, t: "a" }, { k: 1, t: "b" }, { k: 3, t: "c" }, { k: 3, t: "d" }];
      expect(expectPanelSameAsPlain({ pageSize: 2 }, data, (survey: SurveyModel, question: QuestionPanelDynamicModel): void => {
        question.pageIndex = 1;
        question.pageIndex = 0;
      })).toEqual(data);
    });
    test("a filter: an outside assignment keeps the hidden answers of the records it shows", () => {
      const data = [{ k: 1, t: "a" }, { k: 0, t: "b" }, { k: 3, t: "c" }];
      const newValue = [{ k: 1, t: "a" }, { k: 3, t: "b" }, { k: 3, t: "c" }];
      expect(expectPanelSameAsPlain({ filterExpression: "{k} != 0" }, data, (survey: SurveyModel): void => {
        survey.setValue("p", Helpers.getUnbindValue(newValue));
      })).toEqual(newValue);
    });
    test("a sort: an outside assignment that moves a record keeps its hidden answer", () => {
      const data = [{ k: 3, t: "c" }, { k: 1, t: "a" }];
      const newValue = [{ k: 3, t: "c" }, { k: 1, t: "a" }, { k: 0, t: "z" }];
      expect(expectPanelSameAsPlain({ sortCriteria: [{ field: "k" }] }, data, (survey: SurveyModel): void => {
        survey.setValue("p", Helpers.getUnbindValue(newValue));
      })).toEqual(newValue);
    });
    test("an answer is still cleared when its question becomes hidden while its panel exists", () => {
      const data = [{ k: 1, t: "a" }, { k: 1, t: "b" }, { k: 3, t: "c" }];
      expect(expectPanelSameAsPlain({ pageSize: 2 }, data, (survey: SurveyModel, question: QuestionPanelDynamicModel): void => {
        question.panels[0].getQuestionByName("k").value = 2;
      })).toEqual([{ k: 2 }, { k: 1, t: "b" }, { k: 3, t: "c" }]);
    });
    test("a paged Dynamic Matrix: a removal brings a row with a hidden cell answer onto the page", () => {
      const run = (view: any): any => {
        const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [Object.assign({ type: "matrixdynamic", name: "m",
          columns: [{ name: "k", cellType: "text" }, { name: "t", cellType: "text", visibleIf: "{row.k} = 1" }] }, view)] });
        survey.data = { m: [{ k: 1, t: "a" }, { k: 1, t: "b" }, { k: 3, t: "c" }, { k: 3, t: "d" }] };
        const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
        matrix.visibleRows;
        matrix.removeRow(0);
        return survey.data.m;
      };
      const plain = run({});
      expect(plain, "#1").toEqual([{ k: 1, t: "b" }, { k: 3, t: "c" }, { k: 3, t: "d" }]);
      expect(run({ pageSize: 2 }), "#2: paged equals unpaged").toEqual(plain);
    });
  });
});
// A confirmation asked about a record on another page names it by its record object.
describe("Page window: a confirmed removal of a record on another page", () => {
  const holdConfirmations = (): { answer: (index: number, value: boolean) => void, restore: () => void } => {
    const old = settings.confirmActionAsync;
    const callbacks: Array<(res: boolean) => void> = [];
    settings.confirmActionAsync = (message: string, callback: (res: boolean) => void): boolean => { callbacks.push(callback); return true; };
    return { answer: (index: number, value: boolean): void => { callbacks[index](value); }, restore: (): void => { settings.confirmActionAsync = old; } };
  };
  test("matrix and panel: the record is removed when it is still there, and the answer is dropped when a write replaced it", () => {
    const confirmations = holdConfirmations();
    try {
      const matrix = createMatrix({ pageSize: 5 }, records(20));
      matrix.removeRow(12, true);
      matrix.removeRow(13, true);
      matrix.value = matrix.value.map((r: any) => r.id === 13 ? Object.assign({}, r, { name: "edited" }) : r);
      confirmations.answer(0, true);
      confirmations.answer(1, true);
      expect(matrix.value.map((r: any) => r.id).indexOf(12), "#1: record 12 is removed").toBe(-1);
      expect(matrix.value.map((r: any) => r.id).indexOf(13) > -1, "#2: record 13 was replaced meanwhile: kept").toBe(true);
      const panel = createPanel({ pageSize: 5 }, records(20));
      panel.removePanel(12, true);
      confirmations.answer(2, true);
      expect(panel.value.map((r: any) => r.id).indexOf(12), "#3: the panel's record 12 is removed").toBe(-1);
      expect(panelIds(panel), "#4: the page is as it was").toEqual([0, 1, 2, 3, 4]);
    } finally {
      confirmations.restore();
    }
  });
  test("matrix: the removal survives the question's own write of the record, and follows an insert in front of it", () => {
    const confirmations = holdConfirmations();
    try {
      const matrix = createMatrix({ pageSize: 2 }, records(4));
      matrix.removeRow(3, true);
      matrix.setRowValue(3, { id: 3, name: "edited" });
      confirmations.answer(0, true);
      expect(matrix.value.map((r: any) => r.id), "#1: the record written by the question is removed").toEqual([0, 1, 2]);
      matrix.removeRow(2, true);
      matrix.addRowByIndex({ id: 9, name: "n9" }, 0);
      confirmations.answer(1, true);
      expect(matrix.value.map((r: any) => r.id), "#2: the record moved by the insert is removed").toEqual([9, 0, 1]);
    } finally {
      confirmations.restore();
    }
  });
  test("panel: the removal follows an insert in front of the record", () => {
    const confirmations = holdConfirmations();
    try {
      const panel = createPanel({ pageSize: 2 }, records(4));
      panel.removePanel(3, true);
      panel.addPanel(0);
      confirmations.answer(0, true);
      expect(panel.value.map((r: any) => r.id), "#1").toEqual([undefined, 0, 1, 2]);
    } finally {
      confirmations.restore();
    }
  });
});
