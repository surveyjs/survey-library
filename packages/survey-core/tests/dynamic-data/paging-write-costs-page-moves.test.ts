import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { PanelModel } from "../../src/panel";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { QuestionRecordsModel } from "../../src/question_records";
import { HashTable, Helpers } from "../../src/helpers";
import { ConditionRunner } from "../../src/conditions/conditionRunner";
import { createIndexes } from "../../src/dynamic-data/dynamic-data-records";
import { IDynamicDataSource } from "../../src/dynamic-data/dynamic-data-interfaces";
import { records } from "./paging-write-costs-helpers";

/* The per-write costs that remain once only the page is built. These are performance items: the
   tests count calls, they do not measure time. */

afterEach(() => {
  vi.restoreAllMocks();
});

describe("page moves leak nothing", () => {
  const createMatrix = (extra?: any): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "q", rowCount: 0, pageSize: 5,
      columns: [{ name: "a", cellType: "text" }] }, extra)] });
    survey.data = { q: records(50, (i: number): any => ({ a: i })) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.renderedTable;
    return { survey: survey, matrix: matrix };
  };
  const movePages = (matrix: QuestionMatrixDynamicModel, count: number): void => {
    for (let i = 0; i < count; i++) {
      matrix.pageIndex = (matrix.pageIndex + 1) % matrix.pageCount;
      matrix.renderedTable;
    }
  };
  test("page moves leave no listeners of dropped rows", () => {
    const { matrix } = createMatrix();
    movePages(matrix, 1);
    const afterFirst = matrix.locRemoveRowText.onStringChanged.length;
    movePages(matrix, 100);
    expect(matrix.locRemoveRowText.onStringChanged.length, "#1").toBe(afterFirst);
  });
  test("page moves of a matrix with a detail panel leave no survey property handlers", () => {
    const { survey, matrix } = createMatrix({ detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] });
    const countHandlers = (): number => {
      const hash = (<any>survey).onPropChangeFunctions;
      return Array.isArray(hash) ? hash.length : 0;
    };
    movePages(matrix, 1);
    const afterFirst = countHandlers();
    movePages(matrix, 100);
    expect(countHandlers() - afterFirst <= 5, "#1: " + (countHandlers() - afterFirst)).toBe(true);
  });
  describe("the input actions of rendered cells", () => {
    const columns = [{ name: "a", cellType: "text" }, { name: "b", cellType: "comment" }];
    const countHandlers = (survey: SurveyModel): number => (<any>survey).onPropChangeFunctions.length;
    // Rendering a text or a comment cell reads its input actions, and only rendering does.
    const renderCells = (matrix: QuestionMatrixDynamicModel): void => {
      matrix.visibleRows.forEach((row: any): void => {
        row.cells.forEach((cell: any): void => { cell.question.inputActionsContainer; });
      });
    };
    test("page moves leave no survey property handlers", () => {
      const { survey, matrix } = createMatrix({ columns: columns });
      renderCells(matrix);
      const rendered = countHandlers(survey);
      for (let i = 0; i < 20; i++) {
        i % 2 === 0 ? matrix.nextPage() : matrix.prevPage();
        renderCells(matrix);
      }
      expect(countHandlers(survey), "#1").toBe(rendered);
    });
    test("sorts of a paged matrix leave no survey property handlers", () => {
      const { survey, matrix } = createMatrix({ columns: columns });
      renderCells(matrix);
      const rendered = countHandlers(survey);
      for (let i = 0; i < 20; i++) {
        matrix.sort("a", i % 2 === 0 ? "desc" : "asc");
        renderCells(matrix);
      }
      expect(countHandlers(survey), "#1").toBe(rendered);
    });
    test("sorts of a matrix without paging leave no survey property handlers", () => {
      const { survey, matrix } = createMatrix({ columns: columns, pageSize: 0 });
      renderCells(matrix);
      const rendered = countHandlers(survey);
      for (let i = 0; i < 20; i++) {
        matrix.sort("a", i % 2 === 0 ? "desc" : "asc");
        renderCells(matrix);
      }
      expect(countHandlers(survey), "#1").toBe(rendered);
    });
    test("sorts and page moves of a dynamic panel leave no survey property handlers", () => {
      const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelCount: 0, pageSize: 5,
        templateElements: [{ type: "text", name: "a" }, { type: "comment", name: "b" }] }] });
      survey.data = { q: records(50, (i: number): any => ({ a: i })) };
      const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
      const renderPanels = (): void => {
        panel.panels.forEach((item: PanelModel): void => {
          item.questions.forEach((q: any): void => { q.inputActionsContainer; });
        });
      };
      renderPanels();
      const rendered = countHandlers(survey);
      for (let i = 0; i < 20; i++) {
        panel.sort("a", i % 2 === 0 ? "desc" : "asc");
        renderPanels();
        i % 2 === 0 ? panel.nextPage() : panel.prevPage();
        renderPanels();
      }
      expect(countHandlers(survey), "#1").toBe(rendered);
    });
  });
});

describe("the validation of a paged records question: its objects, the question, then the records off the page", () => {
  test("the records off the page are checked only when the question and its objects pass", () => {
    const kinds: Array<any> = [
      { type: "matrixdynamic", name: "q", rowCount: 0, pageSize: 1, columns: [{ name: "a", cellType: "text" }] },
      { type: "paneldynamic", name: "q", pageSize: 1, templateElements: [{ type: "text", name: "a" }] }
    ];
    kinds.forEach(json => {
      const offPage = vi.spyOn(<any>QuestionRecordsModel.prototype, "validateOffPage");
      const survey = new SurveyModel({ elements: [Object.assign({ validators: [{ type: "expression", expression: "{flag} != 1" }] }, json)] });
      survey.data = { q: [{ a: 1 }, { a: 2 }] };
      const question: any = survey.getQuestionByName("q");
      if (json.type === "paneldynamic") question.panels; else question.visibleRows;
      survey.setValue("flag", 1);
      survey.validate(true);
      expect(offPage.mock.calls.length, json.type + ": the question has an error").toBe(0);
      survey.setValue("flag", 2);
      survey.validate(true);
      expect(offPage.mock.calls.length > 0, json.type + ": everything passes").toBe(true);
      offPage.mockRestore();
    });
  });
});

describe("the focus kept for a re-read after a removal from the UI", () => {
  // A keyed source whose reads wait until release() is called.
  const createSource = (): { source: IDynamicDataSource, release: () => void } => {
    const records = [{ id: 1, col1: "a" }, { id: 2, col1: "b" }, { id: 3, col1: "c" }];
    const pending: Array<() => void> = [];
    let isHolding = false;
    const source: any = {
      keyField: "id",
      read: (): any => {
        const answer = { records: records.map(record => Object.assign({}, record)), total: records.length };
        if (!isHolding) return Promise.resolve(answer);
        return new Promise<any>(resolve => { pending.push(() => resolve(answer)); });
      },
      update: (): Promise<void> => Promise.resolve(),
      remove: (key: any): Promise<void> => { records.splice(records.findIndex(r => r.id === key), 1); return Promise.resolve(); }
    };
    return { source: source, release: (): void => { isHolding = true; pending.splice(0).forEach(answer => answer()); } };
  };
  // setImmediate because setTimeout(0) takes about 12 ms on Windows.
  const flushAll = async (): Promise<void> => { for (let i = 0; i < 20; i++) await new Promise(r => setImmediate(r)); };
  test("a cancelled removal while a read is pending keeps no focus position for that read", async () => {
    const matrixFocused = vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "focusItemAfterRead");
    const panelFocused = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "focusItemAfterRead");
    try {
      const matrixSurvey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "col1" }] }] });
      const matrix = <QuestionMatrixDynamicModel>matrixSurvey.getQuestionByName("q");
      const matrixSource = createSource();
      matrix.dataSource = matrixSource.source;
      await flushAll();
      matrixSurvey.onMatrixRowRemoving.add((_, options) => { options.allow = false; });
      matrixSource.release();
      matrix.refreshDataSource();
      matrix.removeRowUI(matrix.visibleRows[1]);
      matrixSource.release();
      await flushAll();
      expect(matrix.visibleRows.length, "#1: nothing was removed").toBe(3);
      expect(matrixFocused.mock.calls.length, "#2").toBe(0);
      const panelSurvey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "col1" }] }] });
      const panel = <QuestionPanelDynamicModel>panelSurvey.getQuestionByName("q");
      const panelSource = createSource();
      panel.dataSource = panelSource.source;
      await flushAll();
      panelSurvey.onDynamicPanelRemoving.add((_, options) => { options.allow = false; });
      panelSource.release();
      panel.refreshDataSource();
      panel.removePanelUI(panel.panels[1]);
      panelSource.release();
      await flushAll();
      expect(panel.panels.length, "#3").toBe(3);
      expect(panelFocused.mock.calls.length, "#4").toBe(0);
    } finally {
      matrixFocused.mockRestore();
      panelFocused.mockRestore();
    }
  });
});

/* The clean-up of incorrect answers reads the records without the list; only a record it changes is
   written, and a write is what creates the list. */
describe("a read that needs no list creates none", () => {
  const createPanel = (data: any): { survey: SurveyModel, question: QuestionPanelDynamicModel } => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "panel",
      templateElements: [{ type: "text", name: "q1" }] }] });
    survey.data = { panel: data };
    return { survey: survey, question: <QuestionPanelDynamicModel>survey.getQuestionByName("panel") };
  };
  test("clearIncorrectValues on a Dynamic Panel without paging, a sort, a filter or a source reads its records without a list", () => {
    const { survey, question } = createPanel([{ q1: "a" }, { q1: "b" }]);
    expect(question.panels.length, "#1").toBe(2);
    expect(question["dataListValue"], "#2: no list before").toBe(undefined);
    survey.clearIncorrectValues();
    expect(question.value, "#3: nothing to clear").toEqual([{ q1: "a" }, { q1: "b" }]);
    expect(question["dataListValue"], "#4: still no list").toBe(undefined);
  });
  test("an unknown key is still cleared", () => {
    const { survey, question } = createPanel([{ q1: "a", unknown: 1 }, { q1: "b" }]);
    expect(question.panels.length, "#1").toBe(2);
    survey.clearIncorrectValues();
    expect(question.value, "#2: the unknown key is gone").toEqual([{ q1: "a" }, { q1: "b" }]);
  });
});

/* The plain data of a paged matrix names every visible record; a record without a row takes its visible
   index from its position in the walk, not from a search of the visible records. */
describe("the plain data of a paged matrix reads the view once", () => {
  const createMatrix = (count: number): QuestionMatrixDynamicModel => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", pageSize: 10,
      columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: records(count, (i: number): any => ({ a: "v" + i })) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.visibleRows;
    return matrix;
  };
  test("the visible indexes are read as often for 500 records as for 50", () => {
    const reads = (count: number): number => {
      const matrix = createMatrix(count);
      const spy = vi.spyOn(DynamicDataList.prototype, "getVisibleIndexes");
      try {
        const data = matrix.getPlainData();
        expect(data.data.length, "every visible record, " + count).toBe(count);
        expect(data.data[count - 1].title, "the last record's text, " + count).toBe("row " + count);
        return spy.mock.calls.length;
      } finally {
        spy.mockRestore();
      }
    };
    expect(reads(500), "#1").toBe(reads(50));
  });
});

/* Three paged Dynamic Panels on one value, behind an intro page, as on a survey whose records come after a
   start page. The first template reads x, which only the second template computes: the read builds the
   second question's page (getValueFromBindedQuestions). The values the new panels compute are stored as
   one write of the question that built them, and the others receive it as an update in place. */
describe("siblings on one value: a page build updates the records in place", () => {
  const siblingTemplates: HashTable<Array<any>> = {
    p1: [{ type: "text", name: "a" }, { type: "expression", name: "e1", expression: "{panel.x} + 1" }],
    p2: [{ type: "text", name: "a" }, { type: "expression", name: "x", expression: "{panel.a} * 2" }],
    p3: [{ type: "text", name: "a" }, { type: "expression", name: "e3", expression: "{panel.a} + 3" }]
  };
  const siblingNames = ["p1", "p2", "p3"];
  // bound: false gives each question a value of its own - what each question does alone.
  // computedPages: the records of that many first pages already hold their computed values.
  function createSiblings(options: { paged?: boolean, bound?: boolean, computedPages?: number } = {}): SurveyModel {
    const paged = options.paged !== false;
    const bound = options.bound !== false;
    const survey = new SurveyModel({ pages: [{ elements: [{ type: "html", name: "intro" }] }].concat(siblingNames.map((name: string) => ({
      elements: [{ type: "paneldynamic", name: name, valueName: bound ? "recs" : name + "Recs", pageSize: paged ? 10 : 0,
        templateElements: siblingTemplates[name] }] }))) });
    const data = records(100, (i: number): any => i < 10 * (options.computedPages || 0) ? { a: i, x: 2 * i, e1: 2 * i + 1, e3: i + 3 } : { a: i });
    if (bound) {
      survey.data = { recs: data };
    } else {
      const copy = (): Array<any> => data.map((record: any) => Object.assign({}, record));
      survey.data = { p1Recs: copy(), p2Recs: copy(), p3Recs: copy() };
    }
    return survey;
  }
  const sibling = (survey: SurveyModel, name: string): QuestionPanelDynamicModel => <QuestionPanelDynamicModel>survey.getQuestionByName(name);
  // What the built panels show next to the records the survey stores for their page.
  const panelValues = (question: QuestionPanelDynamicModel): Array<any> => question.panels.map((panel: PanelModel) => panel.getQuestionByName("a").value);
  const pageRecordValues = (question: QuestionPanelDynamicModel): Array<any> =>
    question.value.slice(question.pageIndex * 10, question.pageIndex * 10 + 10).map((record: any) => record.a);
  function countBuilds(): { panels: HashTable<number>, rebuilds: HashTable<number>, reset: () => void } {
    const proto = <any>QuestionPanelDynamicModel.prototype;
    const res = { panels: <HashTable<number>>{}, rebuilds: <HashTable<number>>{}, reset: (): void => { res.panels = {}; res.rebuilds = {}; } };
    const create = proto.createAndSetupNewPanelObject;
    vi.spyOn(proto, "createAndSetupNewPanelObject").mockImplementation(function (this: any, ...args: Array<any>): any {
      res.panels[this.name] = (res.panels[this.name] || 0) + 1;
      return create.apply(this, args);
    });
    const rebuild = proto.rebuildFromDataList;
    vi.spyOn(proto, "rebuildFromDataList").mockImplementation(function (this: any, ...args: Array<any>): any {
      res.rebuilds[this.name] = (res.rebuilds[this.name] || 0) + 1;
      return rebuild.apply(this, args);
    });
    return res;
  }
  // Each decision a receiver makes while a sibling stores its in-place write: "writer>receiver:result".
  function recordInPlaceDecisions(): Array<string> {
    const res: Array<string> = [];
    const proto = <any>QuestionRecordsModel.prototype;
    const decide = proto.isInPlaceWriteOfSibling;
    vi.spyOn(proto, "isInPlaceWriteOfSibling").mockImplementation(function (this: any, ...args: Array<any>): boolean {
      const isInPlace = decide.apply(this, args);
      const writers = siblingNames.filter((name: string) => name !== this.name && !!(<any>this.survey.getQuestionByName(name)).inPlaceWrite);
      if (writers.length > 0) res.push(writers.join("+") + ">" + this.name + ":" + isInPlace);
      return isInPlace;
    });
    return res;
  }
  function countRecordWrites(survey: SurveyModel): { count: number } {
    const res = { count: 0 };
    survey.onValueChanged.add((_: SurveyModel, options: any): void => { if (options.name === "recs") res.count++; });
    return res;
  }

  const scenarios: Array<{ name: string, setup: (survey: SurveyModel) => void, run: (survey: SurveyModel) => void }> = [
    { name: "validate()", setup: (): void => {}, run: (survey: SurveyModel): void => { survey.validate(false); } },
    { name: "every page in turn", setup: (): void => {}, run: (survey: SurveyModel): void => { for (let i = 1; i <= 3; i++) survey.currentPageNo = i; } },
    { name: "getPlainData()", setup: (): void => {}, run: (survey: SurveyModel): void => { survey.getPlainData(); } },
    { name: "prevPage() after every page",
      setup: (survey: SurveyModel): void => { for (let i = 1; i <= 3; i++) survey.currentPageNo = i; }, run: (survey: SurveyModel): void => { survey.prevPage(); } },
    { name: "nextPage() from the second question's page",
      setup: (survey: SurveyModel): void => { survey.currentPageNo = 1; survey.currentPageNo = 2; }, run: (survey: SurveyModel): void => { survey.nextPage(); } }
  ];
  scenarios.forEach((scenario) => {
    test(scenario.name + ": each question builds its page once, as it does on a value of its own", () => {
      const builds = countBuilds();
      const measure = (bound: boolean): { panels: HashTable<number>, rebuilds: HashTable<number> } => {
        const survey = createSiblings({ bound: bound });
        scenario.setup(survey);
        builds.reset();
        scenario.run(survey);
        return { panels: Object.assign({}, builds.panels), rebuilds: Object.assign({}, builds.rebuilds) };
      };
      const alone = measure(false);
      const shared = measure(true);
      expect(shared.panels, "#1: the panels created").toEqual(alone.panels);
      expect(shared.rebuilds, "#2: the page builds").toEqual(alone.rebuilds);
    });
  });
  test("validate(): 10 panels and one page build per question, and no question places the records by their content", () => {
    const builds = countBuilds();
    const remaps = vi.spyOn(<any>QuestionRecordsModel.prototype, "createAssignmentRemap");
    const survey = createSiblings();
    builds.reset();
    survey.validate(false);
    expect(builds.panels, "#1").toEqual({ p1: 10, p2: 10, p3: 10 });
    expect(builds.rebuilds, "#2: the first build only").toEqual({ p1: 1, p2: 1, p3: 1 });
    expect(remaps.mock.calls.length, "#3").toBe(0);
  });
  test("validate(): the records a page build computed equal the unpaged ones, and the other records stay as loaded", () => {
    // Under paging an expression question computes only for a record with a panel: the comparison is
    // over the records the questions built.
    const paged = createSiblings();
    const unpaged = createSiblings({ paged: false });
    paged.validate(false);
    unpaged.validate(false);
    const built: Array<number> = [];
    siblingNames.forEach((name: string) => {
      (<any>sibling(paged, name)).dataList.getMaterializedIndexes().forEach((index: number) => { if (built.indexOf(index) < 0) built.push(index); });
    });
    expect(built.sort((a: number, b: number) => a - b), "#1: the first page of each question").toEqual(createIndexes(10));
    const pagedRecords = paged.getValue("recs");
    const unpagedRecords = unpaged.getValue("recs");
    built.forEach((index: number) => { expect(pagedRecords[index], "#2: record " + index).toEqual(unpagedRecords[index]); });
    // Bug#12156: a record without a panel computes the expression fields of the three questions too.
    for (let i = 10; i < 100; i++) {
      expect(pagedRecords[i], "#3: record " + i).toEqual(unpagedRecords[i]);
    }
  });
  test("Bug#12156: the first question computes the expression fields of the three in one write, and a page build writes nothing", () => {
    const survey = createSiblings();
    const writes = countRecordWrites(survey);
    survey.data = { recs: records(100, (i: number): any => ({ a: i })) };
    expect(writes.count, "#1: one write for the three questions").toBe(1);
    expect(survey.getValue("recs")[50], "#2").toEqual({ a: 50, x: 100, e1: 101, e3: 53 });
    writes.count = 0;
    survey.validate(false);
    expect(writes.count, "#3: the panels compute the stored values").toBe(0);
  });
  // Both questions have built panels for the first page: the panels of the third one are not built.
  function createBuiltSiblings(): SurveyModel {
    const survey = createSiblings();
    survey.currentPageNo = 2;
    survey.currentPageNo = 1;
    return survey;
  }
  test("Bug#12156: the expression fields an edit changes reach the siblings as an update in place: their panels and their edited records stay", () => {
    const survey = createBuiltSiblings();
    const p1 = sibling(survey, "p1");
    const p2 = sibling(survey, "p2");
    p1.panels[3].getQuestionByName("a").value = 1003;
    expect((<any>p1).getPageState().edited, "#1").toEqual([3]);
    const builds = countBuilds();
    const decisions = recordInPlaceDecisions();
    p1.panels[4].getQuestionByName("a").value = 1004;
    // x is computed by the second question's panel, e1 by the first one's; e3 has no panel.
    expect(Helpers.isArraysEqual(decisions.filter((decision: string) => decision.indexOf("p1>") !== 0), []), "#2: only the first question writes in place").toBe(true);
    expect(decisions.indexOf("p1>p2:true") > -1 && decisions.indexOf("p1>p3:true") > -1, "#3: " + JSON.stringify(decisions)).toBe(true);
    expect(decisions.filter((decision: string) => decision.indexOf(":false") > -1), "#4").toEqual([]);
    expect(builds.rebuilds, "#5: no question builds").toEqual({});
    expect((<any>p1).getPageState().edited, "#6").toEqual([3, 4]);
    expect(panelValues(p2), "#7").toEqual(pageRecordValues(p2));
    expect(survey.getValue("recs")[4], "#8").toEqual({ a: 1004, x: 2008, e1: 2009, e3: 1007 });
  });
  test("an add and a remove inside the writer's own change reach the siblings by their content", () => {
    const survey = createSiblings({ computedPages: 1 });
    survey.currentPageNo = 1;
    const p1 = sibling(survey, "p1");
    const p2 = sibling(survey, "p2");
    p1.panels[3].getQuestionByName("a").value = 1003;
    const remaps = vi.spyOn(<any>QuestionRecordsModel.prototype, "createAssignmentRemap");
    p2.addPanel(0);
    expect(remaps.mock.instances.indexOf(p1) > -1, "#1: the first question places the records").toBe(true);
    expect((<any>p1).getPageState().edited, "#2: the edited record moved to 4, the inserted one is new").toEqual([0, 4]);
    expect(panelValues(p1), "#3").toEqual(pageRecordValues(p1));
    expect(panelValues(p1)[4], "#4").toBe(1003);
    remaps.mockClear();
    p2.removePanel(p2.panels[0]);
    expect(remaps.mock.instances.indexOf(p1) > -1, "#5").toBe(true);
    expect((<any>p1).getPageState().edited, "#6").toEqual([3]);
    expect(panelValues(p1), "#7").toEqual(pageRecordValues(p1));
  });
  test("a value assigned by a handler while the panels are built is stored as an assignment from outside", () => {
    const survey = createSiblings({ computedPages: 1 });
    survey.currentPageNo = 1;
    const p2 = sibling(survey, "p2");
    let isAssigned = false;
    survey.onQuestionCreated.add((_: SurveyModel, options: any): void => {
      if (isAssigned || options.question.parentQuestion !== p2) return;
      isAssigned = true;
      // The first record moves to the end.
      const value = [].concat(survey.getValue("recs"));
      p2.value = value.slice(1).concat(value.slice(0, 1));
    });
    const decisions = recordInPlaceDecisions();
    p2.pageIndex = 1;
    expect(isAssigned, "#1").toBe(true);
    expect(decisions.filter((decision: string) => decision.indexOf("p2>") === 0), "#2: the second question makes no in-place write").toEqual([]);
    // The records hold their expression fields already (Bug#12156): the page build writes nothing, and the
    // handler's assignment is all the siblings receive.
    ["p1", "p3"].forEach((name: string) => {
      expect(panelValues(sibling(survey, name)), "#3: " + name).toEqual(pageRecordValues(sibling(survey, name)));
    });
    expect(survey.getValue("recs")[99].a, "#4").toBe(0);
  });
  test("Bug#12156: an onValueChanging handler that moves a record during the in-place write of the expression fields: both writes reach the siblings from outside", () => {
    const survey = createBuiltSiblings();
    const p1 = sibling(survey, "p1");
    const p2 = sibling(survey, "p2");
    let calls = 0;
    survey.onValueChanging.add((_: SurveyModel, options: any): void => {
      if (options.name !== "recs" || calls > 0 || !(<any>p1).inPlaceWrite) return;
      calls++;
      const value = [].concat(survey.getValue("recs"));
      survey.setValue("recs", value.slice(1).concat(value.slice(0, 1)));
    });
    const decisions = recordInPlaceDecisions();
    p1.panels[4].getQuestionByName("a").value = 1004;
    expect(calls, "#1").toBe(1);
    const fromFirst = decisions.filter((decision: string) => decision.indexOf("p1>p2:") === 0);
    expect(fromFirst.length > 0, "#2").toBe(true);
    expect(fromFirst.filter((decision: string) => decision === "p1>p2:true"), "#3: the second question's records are the handler's, not the ones the write replaced").toEqual([]);
    expect(panelValues(p2), "#4").toEqual(pageRecordValues(p2));
    expect(panelValues(p1), "#5").toEqual(pageRecordValues(p1));
  });
  /* Bug#12156: the expression fields are written when no question sharing the value has a write of its
     own open (QuestionRecordsModel.runOwedExpressionFields), so their in-place write is never owed to
     one. An insert from outside made inside that write is placed by content. */
  test("Bug#12156: the in-place write of the expression fields is owed to no question, and an insert from outside inside it is placed by content", () => {
    const owed: Array<string> = [];
    const proto = <any>QuestionRecordsModel.prototype;
    const owe = proto.oweOutsideAssignment;
    vi.spyOn(proto, "oweOutsideAssignment").mockImplementation(function (this: any, ...args: Array<any>): void {
      owed.push(this.name + ":" + args[2]);
      owe.apply(this, args);
    });
    const remaps = vi.spyOn(proto, "createAssignmentRemap");
    let survey = createSiblings();
    survey.validate(false);
    expect(owed, "#1: the page builds write nothing").toEqual([]);
    expect(remaps.mock.calls.length, "#2").toBe(0);

    survey = createBuiltSiblings();
    const p1 = sibling(survey, "p1");
    const p2 = sibling(survey, "p2");
    owed.length = 0;
    p1.panels[3].getQuestionByName("a").value = 1003;
    expect(owed.filter((entry: string) => entry.indexOf(":true") > -1), "#3: an edit's in-place write is owed to no question").toEqual([]);
    expect(survey.getValue("recs")[3].e3, "#4").toBe(1006);
    let calls = 0;
    survey.onValueChanged.add((_: SurveyModel, options: any): void => {
      if (options.name !== "recs" || calls > 0 || !(<any>p1).inPlaceWrite) return;
      calls++;
      survey.setValue("recs", [{ a: -1 }].concat(survey.getValue("recs")));
    });
    remaps.mockClear();
    p1.panels[4].getQuestionByName("a").value = 1004;
    expect(calls, "#5: the handler ran inside the in-place write").toBe(1);
    expect(remaps.mock.instances.indexOf(p2) > -1, "#6: the second question places the records by their content").toBe(true);
    expect(panelValues(p1), "#7").toEqual(pageRecordValues(p1));
    expect(panelValues(p2), "#8").toEqual(pageRecordValues(p2));
    expect(panelValues(p2)[0], "#9").toBe(-1);
  });
});

describe("the completion pass judges only the questions a record answers", () => {
  /* q1 and q2 are in a panel that shows for show = 'yes'; q3 reads only a survey variable; q4 and q5 read the
     record. q1 and q4 are answered in the even records, q3 in every fourth one from 1, q5 has only its
     comment in every tenth one from 1, and q2 is never answered. */
  const json = (paged: boolean): any => ({ elements: [{ type: "paneldynamic", name: "pd", pageSize: paged ? 10 : 0, templateElements: [
    { type: "text", name: "show" }, { type: "text", name: "k" },
    { type: "panel", name: "grp", visibleIf: "{panel.show} = 'yes'", elements: [
      { type: "text", name: "q1", visibleIf: "{panel.k} > 0" }, { type: "text", name: "q2", visibleIf: "{panel.k} > 1" }] },
    { type: "text", name: "q3", visibleIf: "{flag} = 1" },
    { type: "text", name: "q4", visibleIf: "{panel.k} > 3" },
    { type: "text", name: "q5", visibleIf: "{panel.k} > 4", showCommentArea: true }] }] });
  const createRecord = (i: number): any => {
    const record: any = { show: i % 3 === 0 ? "yes" : "no", k: i % 6 };
    if (i % 2 === 0) {
      record.q1 = "v1";
      record.q4 = "v4";
    }
    if (i % 4 === 1) record.q3 = "v3";
    if (i % 10 === 1) record["q5-Comment"] = "c5";
    return record;
  };
  test("the conditions of the records without a panel: one per answered question and per panel around one, a survey-only one once", () => {
    const survey = new SurveyModel(json(true));
    survey.data = { pd: records(100, createRecord) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels;
    // The helper's rules (createRecordElementVisibility, clearValueInRecordsWithoutPanel), per record without
    // a panel: an answered question with a visibleIf is judged once; the panel around q1 is judged once
    // with it; an unanswered question is not judged. A judged condition runs, except the one that reads no
    // record variable (q3's), which runs once for the walk.
    let judged = 0;
    let q3Judged = 0;
    for (let i = 10; i < 100; i++) {
      const record = createRecord(i);
      if (record.q1 !== undefined) judged += 2;
      if (record.q3 !== undefined) { judged++; q3Judged++; }
      if (record.q4 !== undefined) judged++;
      if (record["q5-Comment"] !== undefined) judged++;
    }
    const expectedRuns = judged - q3Judged + 1;
    let isInPass = false;
    let isWalking = false;
    const proto = <any>QuestionPanelDynamicModel.prototype;
    const clear = proto.clearValueInRecordsWithoutPanel;
    vi.spyOn(proto, "clearValueInRecordsWithoutPanel").mockImplementation(function (this: any, ...args: Array<any>): void {
      isInPass = true;
      try {
        clear.apply(this, args);
      } finally {
        isInPass = false;
      }
    });
    const walk = proto.collectRecordChangesWithoutObjects;
    vi.spyOn(proto, "collectRecordChangesWithoutObjects").mockImplementation(function (this: any, ...args: Array<any>): any {
      isWalking = isInPass;
      try {
        return walk.apply(this, args);
      } finally {
        isWalking = false;
      }
    });
    let judgedInWalk = 0;
    const beforeRunning = survey.beforeExpressionRunning;
    vi.spyOn(survey, "beforeExpressionRunning").mockImplementation(function (this: SurveyModel, ...args: Array<any>): string {
      if (isWalking) judgedInWalk++;
      return beforeRunning.apply(this, <any>args);
    });
    let runsInWalk = 0;
    const runContext = ConditionRunner.prototype.runContext;
    vi.spyOn(ConditionRunner.prototype, "runContext").mockImplementation(function (this: ConditionRunner, ...args: Array<any>): any {
      if (isWalking) runsInWalk++;
      return runContext.apply(this, <any>args);
    });
    survey.completeLastPage();
    expect(judgedInWalk, "#1: the judged elements").toBe(judged);
    expect(runsInWalk, "#2: the condition runs").toBe(expectedRuns);
  });
  test("the records at completion equal the unpaged ones", () => {
    const complete = (paged: boolean): any => {
      const survey = new SurveyModel(json(paged));
      survey.data = { pd: records(100, createRecord) };
      (<QuestionPanelDynamicModel>survey.getQuestionByName("pd")).panels;
      survey.completeLastPage();
      return survey.data;
    };
    expect(complete(true), "#1").toEqual(complete(false));
  });
});
