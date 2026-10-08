import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Question } from "../../src/question";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { IValueGetterInfo } from "../../src/conditions/conditionProcessValue";
import { FunctionFactory } from "../../src/functionsfactory";
import { IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource } from "../../src/dynamic-data/dynamic-data-interfaces";

export * from "../../src/question_text";
export * from "../../src/question_expression";
export * from "../../src/question_matrixdropdown";

/* matrixdynamic and paneldynamic behave the same. Every scenario runs for both questions with the
   same records; only the names of the authored properties differ. */
interface IDynamicKind {
  name: string;
  // The authored names of the same thing on the two questions.
  pageSize: string;
  itemCount: string;
  visibleIf: string;
  variable: string;
  // The property that lists the columns / template questions, and one text item of it.
  items: string;
  textItem(name: string, props?: any): any;
  json(extra: any): any;
}
const matrixKind: IDynamicKind = {
  name: "matrixdynamic",
  pageSize: "rowsPerPage",
  itemCount: "rowCount",
  visibleIf: "rowsVisibleIf",
  variable: "row",
  items: "columns",
  textItem: (name: string, props?: any): any => Object.assign({ name: name, cellType: "text" }, props),
  json: (extra: any): any => Object.assign({
    type: "matrixdynamic", name: "q",
    columns: [{ name: "x", cellType: "text" }, { name: "y", cellType: "text" }]
  }, extra)
};
const panelKind: IDynamicKind = {
  name: "paneldynamic",
  pageSize: "panelsPerPage",
  itemCount: "panelCount",
  visibleIf: "templateVisibleIf",
  variable: "panel",
  items: "templateElements",
  textItem: (name: string, props?: any): any => Object.assign({ type: "text", name: name }, props),
  json: (extra: any): any => Object.assign({
    type: "paneldynamic", name: "q",
    templateElements: [{ type: "text", name: "x" }, { type: "text", name: "y" }]
  }, extra)
};
const kinds = [matrixKind, panelKind];

type DynamicQuestion = QuestionMatrixDynamicModel | QuestionPanelDynamicModel;
function createSurvey(kind: IDynamicKind, records: Array<any>, extra: any = {}, elements: Array<any> = []): SurveyModel {
  const props = Object.assign({}, extra);
  props[kind.itemCount] = records.length;
  const survey = new SurveyModel({ elements: [kind.json(props)].concat(elements) });
  survey.data = { q: records };
  return survey;
}
function getQuestion(survey: SurveyModel): DynamicQuestion {
  return <DynamicQuestion>survey.getQuestionByName("q");
}
// What {q[index].name} asks the question's context for.
function readItem(question: Question, index: number, name: string): IValueGetterInfo {
  return question.getValueGetterContext().getValue({ path: [{ name: name }], index: index, isRoot: false });
}
// A row or a panel answers through its question's context; a record read as a value has no question.
function isAnsweredByQuestion(res: IValueGetterInfo): boolean {
  const context: any = !!res ? res.context : undefined;
  if (!context || typeof context.getQuestion !== "function") return false;
  const q = context.getQuestion();
  return !!q && q.isQuestion === true;
}
function records(...values: Array<string>): Array<any> {
  return values.map((x: string): any => ({ x: x, y: x.toUpperCase() }));
}

describe("Dynamic questions: {q[i]} names a record for both questions", () => {
  kinds.forEach((kind: IDynamicKind) => {
    describe(kind.name, () => {
      test("no view: the index is the record", () => {
        const survey = createSurvey(kind, records("a", "b", "c"));
        const question = getQuestion(survey);
        for (let i = 0; i < 3; i++) {
          const res = readItem(question, i, "x");
          expect(res.isFound, "#found " + i).toBe(true);
          expect(res.value, "#value " + i).toBe(["a", "b", "c"][i]);
          expect(isAnsweredByQuestion(res), "#by the row/panel " + i).toBe(true);
        }
        expect(survey.runExpression("{q[1].x}"), "#expression").toBe("b");
      });
      test("a filter hides record 0: the index still counts records", () => {
        const survey = createSurvey(kind, records("a", "b", "c"), { filterExpression: "{x} != 'a'" });
        const question = getQuestion(survey);
        const res0 = readItem(question, 0, "x");
        expect(res0.isFound, "#1").toBe(true);
        expect(res0.value, "#2: record 0, not the first row/panel shown").toBe("a");
        expect(isAnsweredByQuestion(res0), "#3: it has no row/panel, it is read as a value").toBe(false);
        const res1 = readItem(question, 1, "x");
        expect(res1.value, "#4").toBe("b");
        expect(isAnsweredByQuestion(res1), "#5: record 1 has a row/panel and it answers").toBe(true);
        expect(survey.runExpression("{q[2].y}"), "#6").toBe("C");
      });
      /* A cell expression that runs while the matrix builds its rows (allRows answers [] then) reads a
         record that has no row, filtered out here, as a value, as the panel does. The matrix used to
         answer "not found" while building and the first row shown afterwards: 'b'. */
      test("under a filter, an item being built reads a record that has no row/panel", () => {
        const extra: any = { filterExpression: "{x} != 'a'" };
        extra[kind.items] = [kind.textItem("x"), kind.textItem("d", { defaultValueExpression: "{q[0].x}" })];
        const survey = createSurvey(kind, records("a", "b", "c"), extra);
        const question = getQuestion(survey);
        // The matrix builds its rows on demand, the panel its panels at once.
        if (question instanceof QuestionMatrixDynamicModel) expect(question.visibleRows.length, "#0").toBe(2);
        const value = <Array<any>>survey.getValue("q");
        expect(value.map((record: any): any => record.d), "#1: record 0's x for every item built").toEqual([undefined, "a", "a"]);
      });
      test("a descending sort: the index still counts records", () => {
        const survey = createSurvey(kind, records("a", "b", "c"), { sortBy: "x-" });
        const question = getQuestion(survey);
        expect(readItem(question, 0, "x").value, "#1: record 0, not the first one shown").toBe("a");
        expect(readItem(question, 2, "x").value, "#2").toBe("c");
        expect(isAnsweredByQuestion(readItem(question, 0, "x")), "#3: every record has a row/panel").toBe(true);
        expect(survey.runExpression("{q[0].x}"), "#4").toBe("a");
      });
      test("paging: a record off the page is read as a value", () => {
        const extra: any = {};
        extra[kind.pageSize] = 2;
        const survey = createSurvey(kind, records("a", "b", "c", "d"), extra);
        const question = getQuestion(survey);
        const res3 = readItem(question, 3, "x");
        expect(res3.isFound, "#1").toBe(true);
        expect(res3.value, "#2").toBe("d");
        expect(isAnsweredByQuestion(res3), "#3: off the page").toBe(false);
        const res1 = readItem(question, 1, "x");
        expect(res1.value, "#4").toBe("b");
        expect(isAnsweredByQuestion(res1), "#5: on the page").toBe(true);
        expect(survey.runExpression("{q[3].y}"), "#6").toBe("D");
      });
      test("an index past the last record is not found", () => {
        const survey = createSurvey(kind, records("a", "b", "c"));
        expect(readItem(getQuestion(survey), 3, "x").isFound, "#1: no view").toBe(false);
        const extra: any = { filterExpression: "{x} != 'a'" };
        extra[kind.pageSize] = 2;
        const paged = createSurvey(kind, records("a", "b", "c"), extra);
        expect(readItem(getQuestion(paged), 3, "x").isFound, "#2: filter and paging").toBe(false);
        expect(readItem(getQuestion(paged), 2, "x").isFound, "#3: the last record").toBe(true);
      });
      test("an expression elsewhere in the survey follows the record under a filter", () => {
        const data = [{ x: "a", f: "hide" }, { x: "b", f: "" }, { x: "c", f: "" }];
        const survey = createSurvey(kind, data, { filterExpression: "{f} != 'hide'" },
          [{ type: "text", name: "t", visibleIf: "{q[0].x} = 'a'" }]);
        const t = survey.getQuestionByName("t");
        expect(survey.runExpression("{q[0].x}"), "#1").toBe("a");
        expect(t.isVisible, "#2: record 0 is read, not the first one shown").toBe(true);
        survey.setValue("q", [{ x: "z", f: "hide" }, { x: "a", f: "" }, { x: "c", f: "" }]);
        expect(survey.runExpression("{q[0].x}"), "#3").toBe("z");
        expect(t.isVisible, "#4: the value change re-evaluates it").toBe(false);
        survey.setValue("q", [{ x: "a", f: "hide" }, { x: "b", f: "" }, { x: "c", f: "" }]);
        expect(t.isVisible, "#5").toBe(true);
      });
    });
  });
  test("matrix: a padded record off the page is the default row value", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "q", rowCount: 3, rowsPerPage: 2, defaultRowValue: { x: "d" },
        columns: [{ name: "x", cellType: "text" }]
      }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ x: "a" }];
    expect(matrix.rowCount, "#1").toBe(3);
    const res = readItem(matrix, 2, "x");
    expect(res.isFound, "#2").toBe(true);
    expect(res.value, "#3: the padded record").toBe("d");
    expect(isAnsweredByQuestion(res), "#4: off the page, read as a value").toBe(false);
    expect(readItem(matrix, 3, "x").isFound, "#5: past rowCount").toBe(false);
  });
  test("a panel reaches a filtered matrix that shares its valueName through the bound-question path", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix", valueName: "data", rowCount: 3, filterExpression: "{x} != 'a'",
          columns: [{ name: "x", cellType: "text" }, { name: "y", cellType: "text" }]
        },
        {
          type: "paneldynamic", name: "panel", valueName: "data", panelCount: 3,
          templateElements: [
            { type: "text", name: "x" },
            { type: "text", name: "t", visibleIf: "{panel.y} = 'B'" }
          ]
        }
      ]
    });
    survey.data = { data: records("a", "b", "c") };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "#1: the filter hides record 0's row").toBe(2);
    const visibility = panel.panels.map(p => p.getQuestionByName("t").isVisible);
    expect(visibility, "#2: panel 1 reads record 1's y through the matrix, not record 2's").toEqual([false, true, false]);
  });
});

describe("Dynamic questions: the record visibility under paging goes through onExpressionRunning", () => {
  kinds.forEach((kind: IDynamicKind) => {
    describe(kind.name, () => {
      function createPaged(expression: string, onRunning?: (options: any) => void, showInvisible?: boolean): SurveyModel {
        const extra: any = {};
        extra[kind.pageSize] = 2;
        extra[kind.visibleIf] = expression;
        const props = Object.assign({}, extra);
        props[kind.itemCount] = 4;
        const survey = new SurveyModel({ elements: [kind.json(props)] });
        if (showInvisible) survey.showInvisibleElements = true;
        if (onRunning) {
          survey.onExpressionRunning.add((_: SurveyModel, options: any) => {
            if ((<any>options.element).name === "q" && options.propertyName === kind.visibleIf) {
              onRunning(options);
            }
          });
        }
        survey.data = { q: records("a", "b", "c", "d") };
        return survey;
      }
      function pageXs(question: DynamicQuestion): Array<any> {
        if (question instanceof QuestionMatrixDynamicModel) {
          return question.rowsOnPage.map(r => r.getQuestionByName("x").value);
        }
        return question.panelsOnPage.map(p => p.getQuestionByName("x").value);
      }
      const v = kind.variable;
      test("a handler that rewrites the expression hides the record, and the page follows", () => {
        const survey = createPaged("{" + v + ".x} != 'zzz'", (options: any) => {
          options.expression = "{" + v + ".x} != 'a'";
        });
        const question = getQuestion(survey);
        expect(question["dataList"].visibleCount, "#1: record 0 is hidden").toBe(3);
        expect(question.pageCount, "#2").toBe(2);
        expect(pageXs(question), "#3").toEqual(["b", "c"]);
      });
      test("allow = false: every record is visible", () => {
        const survey = createPaged("{" + v + ".x} != 'a'", (options: any) => {
          options.allow = false;
        });
        const question = getQuestion(survey);
        expect(question["dataList"].visibleCount, "#1").toBe(4);
        expect(question.pageCount, "#2").toBe(2);
        expect(pageXs(question), "#3").toEqual(["a", "b"]);
      });
      test("the handler is called, and a value change the expression reads calls it again", () => {
        let counter = 0;
        const survey = createPaged("{" + v + ".x} != {hidden}", () => { counter++; });
        expect(counter, "#1").toBeGreaterThan(0);
        const before = counter;
        survey.setValue("hidden", "b");
        expect(counter, "#2").toBeGreaterThan(before);
        expect(getQuestion(survey)["dataList"].visibleCount, "#3").toBe(3);
      });
      test("no handler: the expression runs as authored", () => {
        const survey = createPaged("{" + v + ".x} != 'a'");
        const question = getQuestion(survey);
        expect(question["dataList"].visibleCount, "#1").toBe(3);
        expect(question.pageCount, "#2").toBe(2);
        expect(pageXs(question), "#3").toEqual(["b", "c"]);
      });
      test("the handler is called while invisible elements are shown", () => {
        let counter = 0;
        const survey = createPaged("{" + v + ".x} != 'a'", () => { counter++; }, true);
        expect(counter, "#1").toBeGreaterThan(0);
        expect(getQuestion(survey)["dataList"].visibleCount, "#2: every record is shown").toBe(4);
      });
    });
  });
});

/* The getter contexts and the record-visibility pass, which matrixdynamic and paneldynamic share
   through common helpers. */
async function flush(times: number = 30): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}
// A source that pages itself (the shape of page-window.test.ts's PagedSource): one read per page.
class PagedSource implements IDynamicDataSource {
  public capabilities = { paging: true, filtering: true, sorting: true };
  constructor(public data: Array<any>) { }
  public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    const take = request.take > 0 ? request.take : this.data.length;
    return Promise.resolve({ records: this.data.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)), total: this.data.length });
  }
}
function ids(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) res.push({ id: i });
  return res;
}
function readPath(question: Question, index: number, path: Array<string>): IValueGetterInfo {
  return question.getValueGetterContext().getValue({ path: path.map(name => ({ name: name })), index: index, isRoot: false });
}
function createDesignSurvey(): SurveyModel {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({ elements: [
    { type: "matrixdynamic", name: "matrix", rowCount: 2, columns: [{ name: "col1", cellType: "text" }] },
    { type: "paneldynamic", name: "panel", panelCount: 2, templateElements: [{ type: "text", name: "q1" }] }
  ] });
  return survey;
}

describe("Dynamic questions: the question-level value getter context", () => {
  test("matrix, design mode: the design row answers any index, past the last row too", () => {
    const matrix = createDesignSurvey().getQuestionByName("matrix");
    const res = readPath(matrix, 5, ["col1"]);
    expect(res.isFound, "#1: design mode wins over the index range").toBe(true);
    expect(res.context.getQuestion().name, "#2: the design row's cell").toBe("col1");
    expect(readPath(matrix, 5, []), "#3: an empty path is the design row's answer too, not the record branch's").toBeUndefined();
    expect(readPath(matrix, 5, ["unknown"]), "#4: an unknown name as well").toBeUndefined();
  });
  test("panel, design mode: a template question answers, an unknown name is not found", () => {
    const panel = createDesignSurvey().getQuestionByName("panel");
    expect(readPath(panel, 5, ["q1"]), "#1").toEqual({ isFound: true });
    expect(readPath(panel, 5, ["unknown"]), "#2").toEqual({ isFound: false });
  });
  test("panel, design mode, an empty path: the design branch is skipped and the record branch answers", () => {
    const panel = createDesignSurvey().getQuestionByName("panel");
    const context = panel.getValueGetterContext();
    const res = context.getValue({ path: [], index: 5, isRoot: false });
    expect(res.isFound, "#1").toBe(false);
    expect(res.context === context, "#2: the record branch's not found").toBe(true);
    expect(readPath(panel, 0, []), "#3: record 0 has a panel, and a panel answers an empty path with nothing").toBeUndefined();
  });
  kinds.forEach((kind: IDynamicKind) => {
    test(kind.name + ": an index past the last record is not found, in the question's own context", () => {
      const question = getQuestion(createSurvey(kind, records("a", "b")));
      const context = question.getValueGetterContext();
      const res = context.getValue({ path: [{ name: "x" }], index: 2, isRoot: false });
      expect(res.isFound, "#1").toBe(false);
      expect(res.value, "#2").toBeUndefined();
      expect(res.context === context, "#3").toBe(true);
    });
    test(kind.name + ": an empty question without an index", () => {
      const question = getQuestion(createSurvey(kind, []));
      expect(question.isEmpty(), "#0").toBe(true);
      const context = question.getValueGetterContext();
      expect(context.getValue({ path: [], index: -1, isRoot: true }), "#1").toEqual({ isFound: true, value: undefined });
      expect(context.getValue({ path: [{ name: "x" }], index: -1, isRoot: true }), "#2").toEqual({ isFound: false, value: undefined });
      const created = context.getValue({ path: [], index: -1, isRoot: true, createObjects: true });
      expect(created.isFound, "#3: createObjects falls through to QuestionValueGetterContext").toBe(true);
      expect(created.context === context, "#4").toBe(true);
      expect(context.getValue({ path: [{ name: "x" }], index: -1, isRoot: true, createObjects: true }), "#5").toBeUndefined();
    });
  });
});

describe("Dynamic questions: the item getter contexts", () => {
  test("paneldynamic and matrixdynamic, page 2: {prev*} and {next*} at both page edges read the records off the page", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelsPerPage: 2, templateElements: [{ type: "text", name: "id" },
        { type: "expression", name: "prev", expression: "{prevPanel.id}" }, { type: "expression", name: "next", expression: "{nextPanel.id}" }] },
      { type: "matrixdynamic", name: "m", rowsPerPage: 2, columns: [{ name: "id", cellType: "text" },
        { name: "prev", cellType: "expression", expression: "{prevRow.id}" }, { name: "next", cellType: "expression", expression: "{nextRow.id}" }] }
    ] });
    survey.data = { p: ids(6), m: ids(6) };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    panel.pageIndex = 1;
    matrix.pageIndex = 1;
    const neighbours = (item: any): Array<any> => [item.getQuestionByName("prev").value, item.getQuestionByName("next").value];
    expect(panel.panels.map(neighbours), "#1: records 1 and 4 have no panel").toEqual([[1, 3], [2, 4]]);
    expect(matrix.visibleRows.map(neighbours), "#2: records 1 and 4 have no row").toEqual([[1, 3], [2, 4]]);
  });
  test("matrixdropdown: {prevRow}, {nextRow} and {visibleRowIndex} come from visibleRows", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "d", rows: ["a", "b", "c"], columns: [
      { name: "c1", cellType: "text" }, { name: "prev", cellType: "expression", expression: "{prevRow.c1}" },
      { name: "vis", cellType: "expression", expression: "{visibleRowIndex}" }, { name: "next", cellType: "expression", expression: "{nextRow.c1}" }] }] });
    survey.data = { d: { a: { c1: 1 }, b: { c1: 2 }, c: { c1: 3 } } };
    const matrix: any = survey.getQuestionByName("d");
    expect(matrix.visibleRows.map((row: any) => matrix.getItemVisibleIndex(row)), "#0: the positions in visibleRows").toEqual([0, 1, 2]);
    const values = matrix.visibleRows.map((row: any) => ["prev", "vis", "next"].map(name => row.getQuestionByName(name).value));
    expect(values, "#1").toEqual([[undefined, 1, 2], [1, 2, 3], [2, 3, undefined]]);
  });
  test("matrix dropdown: a row's previous and next rows skip a hidden row", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "d", rows: ["a", "b", "c"], rowsVisibleIf: "{item} != 'b'", columns: [
      { name: "c1", cellType: "text" }, { name: "prev", cellType: "expression", expression: "{prevRow.c1}" },
      { name: "vis", cellType: "expression", expression: "{visibleRowIndex}" }, { name: "next", cellType: "expression", expression: "{nextRow.c1}" }] }] });
    survey.data = { d: { a: { c1: 1 }, b: { c1: 2 }, c: { c1: 3 } } };
    const matrix: any = survey.getQuestionByName("d");
    expect(matrix.visibleRows.map((row: any) => row.rowName), "#1").toEqual(["a", "c"]);
    const values = matrix.visibleRows.map((row: any) => ["prev", "vis", "next"].map(name => row.getQuestionByName(name).value));
    expect(values, "#2: row b is not a neighbour").toEqual([[undefined, 1, 3], [1, 2, undefined]]);
  });
  test("matrixdynamic: a record item's {rowIndex} is 1-based plus the remote window offset", async () => {
    const survey = createSurvey(matrixKind, records("a", "b", "c", "d"), { rowsPerPage: 2 });
    const matrix = getQuestion(survey);
    expect(isAnsweredByQuestion(readPath(matrix, 3, ["x"])), "#1: record 3 is off the page").toBe(false);
    expect(readPath(matrix, 3, ["rowIndex"]).value, "#2: 1-based").toBe(4);
    const remote = <QuestionMatrixDynamicModel>new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 5,
      rowsVisibleIf: "{rowIndex} != 12", columns: [{ name: "id", cellType: "text" }] }] }).getQuestionByName("m");
    remote.dataSource = new PagedSource(ids(20));
    await flush();
    remote.nextPage();
    await flush();
    remote.nextPage();
    await flush();
    expect(remote["dataList"].windowOffset, "#3").toBe(10);
    expect(remote.visibleRows.map(row => row.getQuestionByName("id").value), "#4: record 11 is row 12 of the whole list").toEqual([10, 12, 13, 14]);
  });
  test("paneldynamic: {panelIndex} is 0-based plus the window offset in the value, +1 in text", async () => {
    const survey = createSurvey(panelKind, records("a", "b", "c", "d"), { panelsPerPage: 2, templateTitle: "N {panelIndex}",
      templateElements: [{ type: "text", name: "x" }, { type: "expression", name: "no", expression: "{panelIndex}" }] });
    const panel = <QuestionPanelDynamicModel>getQuestion(survey);
    panel.pageIndex = 1;
    expect(panel.panels.map(p => p.getQuestionByName("no").value), "#1: the value").toEqual([2, 3]);
    expect(panel.panels.map(p => p.locTitle.renderedHtml), "#2: the text").toEqual(["N 3", "N 4"]);
    expect(readPath(panel, 0, ["panelIndex"]).value, "#3: a record item").toBe(0);
    const remote = <QuestionPanelDynamicModel>new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelCount: 0, panelsPerPage: 5,
      templateVisibleIf: "{panelIndex} != 11", templateElements: [{ type: "text", name: "id" }] }] }).getQuestionByName("p");
    remote.panels;
    remote.dataSource = new PagedSource(ids(20));
    await flush();
    remote.nextPage();
    await flush();
    remote.nextPage();
    await flush();
    expect(remote.panels.map(p => p.getQuestionByName("id").value), "#4: a record item's value is 0-based plus the offset").toEqual([10, 12, 13, 14]);
  });
});

describe("Dynamic questions: the record-visibility pass under paging", () => {
  test("matrixdynamic: the padded records are evaluated as the default row value", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 4, rowsPerPage: 2,
      defaultRowValue: { x: "d" }, rowsVisibleIf: "{row.x} != 'd'", columns: [{ name: "x", cellType: "text" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ x: "a" }, { x: "b" }];
    expect(matrix.rowCount, "#1").toBe(4);
    expect(matrix["dataList"].visibleCount, "#2: records 2 and 3 are padded with x = 'd'").toBe(2);
    expect(matrix.pageCount, "#3").toBe(1);
  });
  test("paneldynamic: a function the templateVisibleIf calls sees the record item as this.panel", () => {
    FunctionFactory.Instance.register("recordPanelX", function (this: any): any {
      return !!this.panel ? this.panel.getValue("x") : undefined;
    });
    try {
      const survey = createSurvey(panelKind, records("a", "b", "c", "d"), { panelsPerPage: 2, templateVisibleIf: "recordPanelX() != 'a'" });
      const question = getQuestion(survey);
      expect(question["dataList"].visibleCount, "#1: record 0 is hidden").toBe(3);
      expect(readItem(question, 1, "x").value, "#2").toBe("b");
    } finally {
      FunctionFactory.Instance.unregister("recordPanelX");
    }
  });
  test("matrixdynamic: a function the rowsVisibleIf calls sees the record item as this.row", () => {
    FunctionFactory.Instance.register("recordRowX", function (this: any): any {
      return !!this.row ? this.row.getValue("x") : undefined;
    });
    try {
      const survey = createSurvey(matrixKind, records("a", "b", "c", "d"), { rowsPerPage: 2, rowsVisibleIf: "recordRowX() != 'a'" });
      const question = getQuestion(survey);
      expect(question["dataList"].visibleCount, "#1: record 0 is hidden").toBe(3);
      expect((<QuestionMatrixDynamicModel>question).rowsOnPage.map(r => r.getValue("x")), "#2: the page starts at record 1").toEqual(["b", "c"]);
    } finally {
      FunctionFactory.Instance.unregister("recordRowX");
    }
  });
  kinds.forEach((kind: IDynamicKind) => {
    test(kind.name + ": showInvisibleElements clears the flags and restores them when it is turned off", () => {
      const extra: any = {};
      extra[kind.pageSize] = 2;
      extra[kind.visibleIf] = "{" + kind.variable + ".x} != 'a'";
      const survey = createSurvey(kind, records("a", "b", "c", "d"), extra);
      const question = getQuestion(survey);
      const list = question["dataList"];
      expect(list.visibleCount, "#1").toBe(3);
      survey.showInvisibleElements = true;
      expect(list.visibleCount, "#2: every record is visible").toBe(4);
      survey.setValue("other", 1);
      survey.showInvisibleElements = false;
      expect(list.visibleCount, "#5: the flags return").toBe(3);
    });
  });
});

describe("Fixed matrix pages its rows: the row context of a record without a row", () => {
  const rows = [{ value: "r1", text: "Apple" }, { value: "r2", text: "Banana" }, { value: "r3", text: "Cherry" },
    { value: "r4", text: "Date" }, { value: "r5", text: "Elder" }, { value: "r6", text: "Fig" }, { value: "r7", text: "Grape" }];
  const createFixed = (json: any): { survey: SurveyModel, matrix: any } => {
    const survey = new SurveyModel({
      elements: [Object.assign({ type: "matrixdropdown", name: "matrix", rowsPerPage: 3, rows: rows, columns: [{ name: "a", cellType: "text" }] }, json),
        { type: "expression", name: "readsR6", expression: "{matrix.r6.a}" }]
    });
    survey.data = { matrix: { r2: { a: "2" }, r6: { a: "six" } } };
    return { survey: survey, matrix: survey.getQuestionByName("matrix") };
  };
  const names = (matrix: any): Array<string> => matrix.visibleRows.map((row: any) => row.rowName);
  test("{rowTitle} decides the visibility of records off the page", () => {
    const { matrix } = createFixed({ rowsVisibleIf: "{rowTitle} notcontains 'e'" });
    expect(names(matrix), "#1: Apple, Cherry, Date, Elder and Grape contain an e").toEqual(["r2", "r6"]);
    expect(matrix.pageCount, "#2").toBe(1);
    expect(matrix.value, "#3: the hidden records keep their answers").toEqual({ r2: { a: "2" }, r6: { a: "six" } });
  });
  test("{item} and {rowName} decide the visibility of records off the page", () => {
    const { survey, matrix } = createFixed({ rowsVisibleIf: "{item} != 'r1' and {rowName} != {skip}" });
    survey.setValue("skip", "r5");
    expect(names(matrix), "#1: page 0").toEqual(["r2", "r3", "r4"]);
    matrix.nextPage();
    expect(names(matrix), "#2: page 1").toEqual(["r6", "r7"]);
  });
  test("a custom function reads the record item as this.row", () => {
    const seen: Array<any> = [];
    FunctionFactory.Instance.register("fixedRecordName", function (this: any) {
      seen.push(this.row.getIndex());
      return this.row.getValueGetterContext().getValue({ name: "", path: [{ name: "rowName" }] }).value;
    });
    try {
      const { matrix } = createFixed({ rowsVisibleIf: "fixedRecordName() != 'r3'" });
      expect(names(matrix), "#1").toEqual(["r1", "r2", "r4"]);
      expect(seen.indexOf(6) > -1, "#2: the record off the page was asked as well").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("fixedRecordName");
    }
  });
  test("{matrix.r6.a} reads the keyed answer while r6 is off the page", () => {
    const { survey, matrix } = createFixed({});
    expect(names(matrix), "#1: r6 is not on the page").toEqual(["r1", "r2", "r3"]);
    expect(survey.getValue("readsR6"), "#2").toBe("six");
    matrix.nextPage();
    matrix.visibleRows[2].cells[0].question.value = "6!";
    matrix.prevPage();
    expect(survey.getValue("readsR6"), "#3: an edit made on r6's page").toBe("6!");
  });
});
