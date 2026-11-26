import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionRecordsModel } from "../../src/question_records";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownRenderedCell } from "../../src/question_matrixdropdownrendered";
import "../../src/question_paneldynamic";
import "../../src/question_filter";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { ListModel } from "../../src/list";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

// getDataView(): the view in force - the authored filter and every bound Filter Control, combined as a
// paged read carries them, and the sort - for the matrix and the panel alike. Every test calls the new
// member, so each one fails at the base; the sortCriteria and read sort assertions only pin what the
// base already does.

const records = (): Array<any> => [{ c1: "a", n: 1 }, { c1: "b", n: 2 }, { c1: "c", n: 3 }, { c1: "d", n: 4 }];
const columns = [{ name: "c1", title: "Name", cellType: "text" }, { name: "n", title: "Number", cellType: "text", inputType: "number" }];
const templateElements = [{ type: "text", name: "c1", title: "Name" }, { type: "text", name: "n", title: "Number", inputType: "number" }];
const types = ["matrixdynamic", "paneldynamic"];

function questionJson(type: string, json?: any): any {
  const base = type === "matrixdynamic" ? { type: type, name: "q", columns: columns } : { type: type, name: "q", templateElements: templateElements };
  return Object.assign(base, json);
}
function createSurvey(type: string, json?: any, controls: Array<string> = []): SurveyModel {
  const elements = [questionJson(type, json)].concat(controls.map((name: string): any => ({ type: "filter", name: name, targetQuestion: "q" })));
  return new SurveyModel({ elements: elements });
}
const questionOf = (survey: SurveyModel): QuestionRecordsModel => <QuestionRecordsModel>survey.getQuestionByName("q");
const plainSort = (q: QuestionRecordsModel): Array<any> => q.sortCriteria.map((item: any): any => ({ field: item.field, direction: item.direction }));
const hasList = (q: QuestionRecordsModel): boolean => !!(<any>q)._dataList;
const viewOfRequest = (request: IDynamicDataReadRequest): any => ({ filter: request.filter, sort: request.sort });

/* A server that pages, filters and sorts as its capabilities say: it understands "{field} > number"
   and nothing else, and keeps a copy of every request it was asked. */
class KeepingSource implements IDynamicDataSource {
  public requests: Array<IDynamicDataReadRequest> = [];
  constructor(public capabilities: IDynamicDataSourceCapabilities) { }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult {
    this.requests.push(JSON.parse(JSON.stringify(request)));
    let view = records();
    const parts = /^\(?\{(\w+)\}\s*>\s*(\d+)\)?$/.exec(request.filter || "");
    if (!!parts) view = view.filter((record: any): boolean => record[parts[1]] > Number(parts[2]));
    const size = request.take > 0 ? request.take : view.length;
    return { records: view.slice(request.skip, request.skip + size), total: view.length };
  }
  // The one read a change sent: never a count read, which the test does not take.
  public takeOne(): IDynamicDataReadRequest {
    expect(this.requests.length, "one read per change").toBe(1);
    return this.requests.splice(0, 1)[0];
  }
}

// The sort bar, as sort-bar.test.ts drives it: a pick selects the item and the bar runs.
function sortBarList(q: QuestionRecordsModel, id: string): ListModel {
  const levels = q.recordsBar.sortActions.actions.filter((item: Action): boolean => item.component === "sv-sort-bar-level")
    .map((item: Action): ActionContainer => <ActionContainer>item.data);
  const action = levels.map((level: ActionContainer): Action => level.getActionById(id)).filter((item: Action): boolean => !!item)[0];
  return <ListModel>action.data;
}
function pick(list: ListModel, title: string): void {
  const item = list.actions.filter((action: Action): boolean => action.title === title)[0];
  expect(item, "no item " + title).toBeTruthy();
  list.onItemClick(item);
}
const pickField = (q: QuestionRecordsModel, title: string): void => pick(sortBarList(q, "sv-sort-field"), title);
const pickDirection = (q: QuestionRecordsModel, title: string): void => pick(sortBarList(q, "sv-sort-direction"), title);
function header(matrix: QuestionMatrixDynamicModel, name: string): QuestionMatrixDropdownRenderedCell {
  return matrix.renderedTable.headerRow.cells.filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !!cell.column && cell.column.name === name)[0];
}

describe("getDataView: the filter in force", () => {
  types.forEach((type: string): void => {
    test(type + ": local data - the authored filter, a control filter and both, bracketed as a read carries them", () => {
      const survey = createSurvey(type, { defaultValue: records() }, ["f1"]);
      const q = questionOf(survey);
      const f1: any = survey.getQuestionByName("f1");
      q.filterExpression = "{n} > 1";
      expect(q.getDataView(), "#1: authored only").toEqual({ filter: "{n} > 1", sort: [] });
      q.filterExpression = "";
      f1.setFieldCondition("n", "greater", 2);
      const control = f1.filterExpression;
      expect(control, "#2: the control has a filter").toBeTruthy();
      expect(q.filterExpression, "#3: filterExpression keeps its meaning").toBe("");
      expect(q.getDataView(), "#4: control only").toEqual({ filter: control, sort: [] });
      q.filterExpression = "{n} > 1";
      expect(q.getDataView(), "#5: both").toEqual({ filter: "({n} > 1) and (" + control + ")", sort: [] });
    });
    test(type + ": two Filter Controls on one source, in the order they were first applied, and with an authored filter", () => {
      const survey = createSurvey(type, { defaultValue: records() }, ["f1", "f2"]);
      const q = questionOf(survey);
      const f1: any = survey.getQuestionByName("f1");
      const f2: any = survey.getQuestionByName("f2");
      f2.setFieldCondition("c1", "notequal", "c");
      f1.setFieldCondition("n", "greater", 1);
      const c1 = f1.filterExpression;
      const c2 = f2.filterExpression;
      expect(q.getDataView().filter, "#1").toBe("(" + c2 + ") and (" + c1 + ")");
      q.filterExpression = "{n} < 9";
      expect(q.getDataView().filter, "#2").toBe("({n} < 9) and ((" + c2 + ") and (" + c1 + "))");
    });
  });
});

describe("getDataView: a source that is read whole", () => {
  types.forEach((type: string): void => {
    const sources: Array<{ name: string, capabilities: IDynamicDataSourceCapabilities, json: any }> = [
      { name: "a source that does not page", capabilities: {}, json: {} },
      { name: "a source that pages and sorts but does not filter", capabilities: { paging: true, sorting: true }, json: { pageSize: 2 } }
    ];
    sources.forEach((item: { name: string, capabilities: IDynamicDataSourceCapabilities, json: any }): void => {
      test(type + ": " + item.name + " - the read carries no view, the member still returns it", () => {
        const survey = createSurvey(type, Object.assign({ filterExpression: "{n} > 1", sortCriteria: [{ field: "n", direction: "desc" }] }, item.json));
        const q = questionOf(survey);
        const source = new KeepingSource(item.capabilities);
        q.dataSource = source;
        expect(source.requests.length > 0, "#1: read").toBe(true);
        expect(source.requests.map(viewOfRequest), "#2: pins the base").toEqual(source.requests.map((): any => ({ filter: "", sort: [] })));
        expect(q.getDataView(), "#3").toEqual({ filter: "{n} > 1", sort: [{ field: "n", direction: "desc" }] });
      });
    });
  });
});

describe("getDataView: a source that pages and runs the whole view", () => {
  types.forEach((type: string): void => {
    test(type + ": after each change the member equals the window read that change sent; a count preview leaves it", async () => {
      const survey = createSurvey(type, { pageSize: 2, allowSort: true }, ["f1"]);
      const q = questionOf(survey);
      const f1: any = survey.getQuestionByName("f1");
      const source = new KeepingSource({ paging: true, filtering: true, sorting: true });
      q.dataSource = source;
      expect(q.getDataView(), "#1: the load").toEqual(viewOfRequest(source.takeOne()));
      q.filterExpression = "{n} > 1";
      expect(q.getDataView(), "#2: an authored filter").toEqual(viewOfRequest(source.takeOne()));
      expect(q.getDataView().filter, "#2a").toBe("{n} > 1");
      f1.setFieldCondition("c1", "notequal", "c");
      const control = f1.filterExpression;
      expect(q.getDataView(), "#3: a control filter").toEqual(viewOfRequest(source.takeOne()));
      expect(q.getDataView().filter, "#3a").toBe("({n} > 1) and (" + control + ")");
      q.sortCriteria = <any>[{ field: "n", direction: "desc" }];
      expect(q.getDataView(), "#4: a sort").toEqual(viewOfRequest(source.takeOne()));
      expect(q.getDataView().sort, "#4a").toEqual([{ field: "n", direction: "desc" }]);
      q.pageIndex = 1;
      const pageRead = source.takeOne();
      expect(pageRead.skip, "#5: a page move").toBe(2);
      expect(q.getDataView(), "#5a").toEqual(viewOfRequest(pageRead));
      const before = q.getDataView();
      const count = await q.getControlFilterCount((<any>f1).controlFilterKey, "{n} > 2");
      expect(count, "#6: the count was read").toBeDefined();
      expect(source.requests.length, "#7: one count read").toBe(1);
      expect(source.requests[0].take, "#7a").toBe(1);
      expect(q.getDataView(), "#8: unchanged").toEqual(before);
    });
  });
});

describe("getDataView: the sort", () => {
  types.forEach((type: string): void => {
    test(type + ": set by JSON, then by a sort-bar pick: equals sortCriteria and the sort of the read each change sent", () => {
      const json: any = { pageSize: 2, allowSort: true, sortCriteria: [{ field: "n", direction: "desc" }] };
      if (type === "matrixdynamic") json.showSortBar = "always";
      const survey = createSurvey(type, json);
      const q = questionOf(survey);
      const source = new KeepingSource({ paging: true, filtering: true, sorting: true });
      q.dataSource = source;
      expect(q.getDataView().sort, "#1: JSON").toEqual([{ field: "n", direction: "desc" }]);
      expect(q.getDataView().sort, "#1a").toEqual(source.takeOne().sort);
      pickDirection(q, "Low - High");
      expect(plainSort(q), "#2: pins the base").toEqual([{ field: "n", direction: "asc" }]);
      expect(q.getDataView().sort, "#2a").toEqual(plainSort(q));
      expect(q.getDataView().sort, "#2b").toEqual(source.takeOne().sort);
      pickField(q, "Name");
      expect(plainSort(q).map((item: any): string => item.field), "#3: pins the base").toEqual(["c1"]);
      expect(q.getDataView().sort, "#3a").toEqual(plainSort(q));
      expect(q.getDataView().sort, "#3b").toEqual(source.takeOne().sort);
    });
  });
  test("matrixdynamic: a header click - the panel has no sortable headers", () => {
    const survey = createSurvey("matrixdynamic", { pageSize: 2, allowSort: true });
    const matrix = <QuestionMatrixDynamicModel>questionOf(survey);
    const source = new KeepingSource({ paging: true, filtering: true, sorting: true });
    matrix.dataSource = source;
    source.takeOne();
    header(matrix, "n").toggleSort();
    expect(plainSort(matrix).map((item: any): string => item.field), "#1: pins the base").toEqual(["n"]);
    expect(matrix.getDataView().sort, "#2").toEqual(plainSort(matrix));
    expect(matrix.getDataView().sort, "#3").toEqual(source.takeOne().sort);
    header(matrix, "n").toggleSort();
    expect(matrix.getDataView().sort, "#4: the other direction").toEqual(plainSort(matrix));
    expect(matrix.getDataView().sort, "#5").toEqual(source.takeOne().sort);
  });
});

describe("getDataView: nothing in force, and copies", () => {
  types.forEach((type: string): void => {
    test(type + ": nothing set - an empty view, and asking creates no list", () => {
      const q = questionOf(createSurvey(type, { defaultValue: records() }));
      expect(hasList(q), "#1").toBe(false);
      expect(q.getDataView(), "#2").toEqual({ filter: "", sort: [] });
      expect(hasList(q), "#3").toBe(false);
    });
    test(type + ": the returned sort is a copy - of the array and of its items", () => {
      const survey = createSurvey(type, { pageSize: 2, sortCriteria: [{ field: "n", direction: "desc" }] });
      const q = questionOf(survey);
      const source = new KeepingSource({ paging: true, filtering: true, sorting: true });
      q.dataSource = source;
      source.takeOne();
      const view = q.getDataView();
      view.sort.push({ field: "c1", direction: "asc" });
      view.sort[0].direction = "asc";
      expect(q.getDataView().sort, "#1").toEqual([{ field: "n", direction: "desc" }]);
      q.pageIndex = 1;
      expect(source.takeOne().sort, "#2: the next read").toEqual([{ field: "n", direction: "desc" }]);
    });
  });
});
