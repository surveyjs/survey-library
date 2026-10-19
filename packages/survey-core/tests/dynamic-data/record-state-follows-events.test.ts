import { describe, test, expect, afterEach, vi } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { Question } from "../../src/question";
import { PanelModel } from "../../src/panel";
import { settings } from "../../src/settings";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource, IDynamicDataSourceCapabilities
} from "../../src/dynamic-data/dynamic-data-interfaces";

/* Which record index the records question keeps survives which event. Each state is read from the
   private field that holds it; each event is fired through the public API, or through the question's
   list where the API does more than the list change: the Dynamic Panel has no move of its own, and
   its addPanel selects the new panel in carousel mode. The tests record what the question does today;
   a "doubt" comment names a cell whose answer may not be the one intended.

   The states: the records the objects were built for (and the names their nested states are kept
   under), the current and the announced record of the Dynamic Panel, the position a move is going
   to, the held remove targets, the hidden-answer states, the focus kept for a read, the page
   validation's edited set and nested states, and the window offset and the old-source flag of the
   current record. The events: a list insert, remove or move; a reload commit; an assignment from
   outside; a source swap; dispose; a page change; a failed read; a sort change; a filter change.

   Left out, because the cell cannot happen:
   - The current record, the announced record, the position a move is going to, the window offset and
     the old-source flag on the Dynamic Matrix: only the Dynamic Panel shows one record at a time.
   - The position a move is going to, the focus kept for a read, the window offset and the old-source
     flag against an assignment from outside: these states exist only while a data source is
     assigned, and a question with a data source does not take an assignment from outside
     (updateValueFromSurvey and setNewValue skip it).
   - A list move on a source that pages itself: the question refuses the move and reports it
     (refuseOperationOfSource). */

async function flush(): Promise<void> {
  for (let i = 0; i < 20; i++) await new Promise(r => setTimeout(r, 0));
}
function records(count: number): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) res.push({ id: i, name: "n" + i });
  return res;
}
const template = [{ type: "text", name: "id" }, { type: "text", name: "name" }];
const columns = [{ name: "id", cellType: "text" }, { name: "name", cellType: "text" }];
function createPanel(json: any, data?: Array<any>, surveyJson?: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel(Object.assign({
    elements: [Object.assign({ type: "paneldynamic", name: "q", templateElements: template }, json)]
  }, surveyJson));
  if (!!data) survey.data = { q: data };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("q");
}
function createMatrix(json: any, data?: Array<any>, surveyJson?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel(Object.assign({
    elements: [Object.assign({ type: "matrixdynamic", name: "q", rowCount: 0, columns: columns }, json)]
  }, surveyJson));
  if (!!data) survey.data = { q: data };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
}
const ids = (value: Array<any>): Array<any> => (value || []).map((r: any) => !!r ? r.id : undefined);

// The two questions behind one face, for the cells that exist on both.
interface IKind {
  name: string;
  create(json: any, data?: Array<any>, surveyJson?: any): Question;
  items(q: Question): Array<any>;
  remove(q: Question, index: number, confirm?: boolean): void;
  insertFirst(q: Question, record: any): void;
  move(q: Question, from: number, to: number): void;
  setValue(q: Question, field: string, position: number, value: any): void;
}
const panelKind: IKind = {
  name: "paneldynamic",
  create: createPanel,
  items: (q: Question): Array<any> => (<QuestionPanelDynamicModel>q).panels.map((p: PanelModel) => p.data),
  remove: (q: Question, index: number, confirm?: boolean): void => { (<QuestionPanelDynamicModel>q).removePanel(index, confirm); },
  insertFirst: (q: Question, record: any): void => {
    const panel = (<QuestionPanelDynamicModel>q).addPanel(0);
    Object.keys(record).forEach(key => panel.getQuestionByName(key).value = record[key]);
  },
  move: (q: Question, from: number, to: number): void => { q["dataList"].move(from, to); },
  setValue: (q: Question, field: string, position: number, value: any): void => {
    (<QuestionPanelDynamicModel>q).panels[position].getQuestionByName(field).value = value;
  }
};
const matrixKind: IKind = {
  name: "matrixdynamic",
  create: createMatrix,
  items: (q: Question): Array<any> => (<QuestionMatrixDynamicModel>q).visibleRows,
  remove: (q: Question, index: number, confirm?: boolean): void => { (<QuestionMatrixDynamicModel>q).removeRow(index, confirm); },
  insertFirst: (q: Question, record: any): void => { (<QuestionMatrixDynamicModel>q).addRowByIndex(record, 0); },
  move: (q: Question, from: number, to: number): void => { (<QuestionMatrixDynamicModel>q).moveRowByIndex(from, to); },
  setValue: (q: Question, field: string, position: number, value: any): void => {
    (<QuestionMatrixDynamicModel>q).visibleRows[position].getQuestionByColumnName(field).value = value;
  }
};
const kinds = [matrixKind, panelKind];
const panelItems = (q: QuestionPanelDynamicModel): Array<any> => panelKind.items(q).slice();

// The states, read from the fields that hold them.
const builtIndex = (q: Question, item: any): number => q["getBuiltRecordIndex"](item);
const builtStateKey = (q: Question, item: any): any => !!q["builtStateKeys"] ? q["builtStateKeys"].get(item) : undefined;
const current = (q: Question): number => q["currentRecordIndex"];
const announced = (q: Question): number => q["announcedRecordIndex"];
const pending = (q: Question): number => q["pendingVisibleIndex"];
const held = (q: Question): Array<number> => !!q["heldRemoveTargets"] ? q["heldRemoveTargets"].map((t: any) => t.recordIndex) : undefined;
const focusIndex = (q: Question): number => q["focusIndexAfterRead"];
const edited = (q: Question): Array<number> => !!q["_pageValidation"] ? q["_pageValidation"]["edited"] : undefined;
const nestedKeys = (q: Question): Array<string> => !!q["_pageValidation"] ? Object.keys(q["_pageValidation"]["nested"]) : undefined;
// The records whose kept nested state has the inner matrix on its page 1: where the state of record 0 went.
const movedNestedKeys = (q: Question): Array<string> => !!q["_pageValidation"]
  ? Object.keys(q["_pageValidation"]["nested"]).filter((key: string) => q["_pageValidation"]["nested"][key].inner.pageIndex === 1) : undefined;
const windowOffset = (q: Question): number => q["currentRecordWindowOffset"];
const isOfOldSource = (q: Question): boolean => q["isCurrentRecordOfOldSource"];

/* A keyed source. It answers at once until hold() is called; then every read waits for release() or
   fail(). paging: the source pages itself; otherwise the list pages what it answered with. */
class TestSource implements IDynamicDataSource {
  public keyField: string = "id";
  public capabilities: IDynamicDataSourceCapabilities;
  private waiting: Array<{ answer: () => void, fail: () => void }> = [];
  private isHolding: boolean = false;
  constructor(public data: Array<any>, paging: boolean = false) {
    this.capabilities = { paging: paging, filtering: false, sorting: false };
  }
  public read(request: IDynamicDataReadRequest): IDynamicDataReadResult | Promise<IDynamicDataReadResult> {
    const answer = (): IDynamicDataReadResult => {
      const take = request.take > 0 ? request.take : this.data.length;
      return { records: this.data.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)), total: this.data.length };
    };
    if (!this.isHolding) return answer();
    return new Promise<IDynamicDataReadResult>((resolve, reject) => {
      this.waiting.push({ answer: () => resolve(answer()), fail: () => reject(new Error("read failed")) });
    });
  }
  public hold(): void { this.isHolding = true; }
  public release(): void { this.waiting.splice(0).forEach(w => w.answer()); }
  public fail(): void { this.waiting.splice(0).forEach(w => w.fail()); }
  public insert(record: any, index: number): any {
    this.data.splice(index, 0, Object.assign({}, record));
    return Object.assign({}, record);
  }
  public update(key: any, record: any): void {
    const at = this.data.findIndex(r => r.id === key);
    if (at > -1)this.data[at] = Object.assign({}, record);
  }
  public remove(key: any): void {
    const at = this.data.findIndex(r => r.id === key);
    if (at > -1)this.data.splice(at, 1);
  }
}
// A record another writer added to the source: the next read brings it back in front.
const insertInSource = (source: TestSource, record: any): void => { source.data.unshift(record); };
// A source whose first read waits: the swap shows on its own, before any read of the new source commits.
const waitingSource = (data: Array<any>, paging: boolean = false): TestSource => {
  const res = new TestSource(data, paging);
  res.hold();
  return res;
};

let restoreConfirm: () => void = undefined;
// A removal that asks for a confirmation keeps waiting: the confirmation is never answered.
function holdConfirmations(): void {
  const old = settings.confirmActionAsync;
  settings.confirmActionAsync = (): boolean => true;
  restoreConfirm = (): void => { settings.confirmActionAsync = old; };
}
afterEach(() => {
  if (!!restoreConfirm) restoreConfirm();
  restoreConfirm = undefined;
});

// A record whose template holds a paged matrix: the panel built for it keeps state under its record.
const nestedTemplate = [{ type: "text", name: "id" },
  { type: "matrixdynamic", name: "inner", rowCount: 0, pageSize: 1, columns: [{ name: "a", cellType: "text" }] }];
const nestedRecords = (count: number): Array<any> => records(count).map((r: any) => ({ id: r.id, inner: [{ a: "x" }, { a: "y" }] }));

describe("the records the objects were built for", () => {
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": a list insert, remove and move", () => {
      const q = kind.create({ pageSize: 10 }, records(3));
      let items = kind.items(q).slice();
      expect(items.map(item => builtIndex(q, item)), "#1").toEqual([0, 1, 2]);
      kind.remove(q, 0);
      /* doubt: the removed record's object leaves the objects before the remap runs, so it keeps its
         record; remapBuiltItems says such an object keeps -1. */
      expect(builtIndex(q, items[0]), "#2: the removed record's object").toBe(0);
      expect([builtIndex(q, items[1]), builtIndex(q, items[2])], "#3: the others are renumbered").toEqual([0, 1]);
      items = kind.items(q).slice();
      kind.insertFirst(q, { id: 9 });
      expect(items.map(item => builtIndex(q, item)), "#4: an insert in front").toEqual(kind === matrixKind ? [0, 1] : [1, 2]);
      items = kind.items(q).slice();
      expect(ids(q.value), "#5").toEqual([9, 1, 2]);
      kind.move(q, 0, 2);
      expect(ids(q.value), "#6").toEqual([1, 2, 9]);
      // The matrix's rows stay where they are and take the records of their positions (followRecordMove).
      expect(items.map(item => builtIndex(q, item)), "#7: a move").toEqual(kind === matrixKind ? [0, 1, 2] : [2, 0, 1]);
    });
  });
  test("paneldynamic: a list remove renames the state keys of a source that pages itself", async () => {
    const source = new TestSource(records(6), true);
    const q = createPanel({ pageSize: 3 });
    q.dataSource = source;
    await flush();
    const items = panelItems(q);
    expect(items.map(item => builtStateKey(q, item)), "#1: the keys of the records").toEqual(["k0", "k1", "k2"]);
    q.removePanel(0);
    expect(items.map(item => builtIndex(q, item)), "#2: renumbered; the removed one left first").toEqual([0, 0, 1]);
    expect(items.map(item => builtStateKey(q, item)), "#3: the keys stay with their records").toEqual(["k0", "k1", "k2"]);
  });
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": a reload commit", async () => {
      const source = new TestSource(records(3));
      const q = kind.create({ pageSize: 10 });
      q.dataSource = source;
      await flush();
      const items = kind.items(q).slice();
      insertInSource(source, { id: 9 });
      q.refreshDataSource();
      await flush();
      // Renumbered only while an object holds a paged question (remapKeptRecordIndexes).
      expect(items.map(item => builtIndex(q, item)), "#1: the old objects keep their records").toEqual([0, 1, 2]);
      expect(kind.items(q).map(item => builtIndex(q, item)), "#2: the new objects").toEqual([0, 1, 2, 3]);
    });
  });
  test("paneldynamic: a reload commit renumbers the panels that hold a paged question", async () => {
    const source = new TestSource(nestedRecords(3));
    const q = createPanel({ pageSize: 10, templateElements: nestedTemplate });
    q.dataSource = source;
    await flush();
    const items = panelItems(q);
    insertInSource(source, { id: 9, inner: [] });
    q.refreshDataSource();
    await flush();
    expect(items.map(item => builtIndex(q, item)), "#1: they follow their records").toEqual([1, 2, 3]);
  });
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": an assignment from outside", () => {
      const q = kind.create({ pageSize: 10 }, records(3));
      const items = kind.items(q).slice();
      q.survey.setValue("q", [{ id: 9 }].concat(records(3)));
      expect(items.map(item => builtIndex(q, item)), "#1").toEqual([0, 1, 2]);
    });
  });
  test("paneldynamic: an assignment from outside renumbers the panels that hold a paged question", () => {
    const q = createPanel({ pageSize: 10, templateElements: nestedTemplate }, nestedRecords(3));
    const items = panelItems(q);
    q.survey.setValue("q", [{ id: 9, inner: [] }].concat(nestedRecords(3)));
    expect(items.map(item => builtIndex(q, item)), "#1").toEqual([1, 2, 3]);
  });
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": a source swap", async () => {
      const q = kind.create({ pageSize: 10 }, records(3));
      const items = kind.items(q).slice();
      q.dataSource = new TestSource(records(2));
      await flush();
      expect(items.map(item => builtIndex(q, item)), "#1: the old objects keep their records").toEqual([0, 1, 2]);
      expect(kind.items(q).map(item => builtIndex(q, item)), "#2").toEqual([0, 1]);
    });
    test(kind.name + ": dispose", () => {
      const q = kind.create({ pageSize: 10 }, records(3));
      const items = kind.items(q).slice();
      q.dispose();
      expect(items.map(item => builtIndex(q, item)), "#1").toEqual([0, 1, 2]);
    });
    test(kind.name + ": a page change", () => {
      const q = kind.create({ pageSize: 2 }, records(4));
      const items = kind.items(q).slice();
      q["pageIndex"] = 1;
      expect(items.map(item => builtIndex(q, item)), "#1: the left objects keep their records").toEqual([0, 1]);
      expect(kind.items(q).map(item => builtIndex(q, item)), "#2").toEqual([2, 3]);
    });
    test(kind.name + ": a failed read", async () => {
      const source = new TestSource(records(4), true);
      const q = kind.create({ pageSize: 2 });
      q.dataSource = source;
      await flush();
      const items = kind.items(q).slice();
      source.hold();
      q["pageIndex"] = 1;
      source.fail();
      await flush();
      expect(kind.items(q), "#1: the page in force stays").toEqual(items);
      expect(items.map(item => builtIndex(q, item)), "#2").toEqual([0, 1]);
    });
    test(kind.name + ": a sort change", () => {
      const q = kind.create({ pageSize: 10 }, records(3));
      const items = kind.items(q).slice();
      q["sortBy"] = "id-";
      expect(items.map(item => builtIndex(q, item)), "#1: the old objects keep their records").toEqual([0, 1, 2]);
      expect(kind.items(q).map(item => builtIndex(q, item)), "#2").toEqual([2, 1, 0]);
    });
    test(kind.name + ": a filter change", () => {
      const q = kind.create({ pageSize: 10 }, records(3));
      const items = kind.items(q).slice();
      q["filterExpression"] = "{id} != 1";
      expect(items.map(item => builtIndex(q, item)), "#1: the old objects keep their records").toEqual([0, 1, 2]);
      expect(kind.items(q).map(item => builtIndex(q, item)), "#2").toEqual([0, 2]);
    });
  });
});

// The Dynamic Panel only: carousel mode shows one record at a time.
describe("the current and the announced record", () => {
  const createCarousel = (json: any, data?: Array<any>): QuestionPanelDynamicModel => createPanel(Object.assign({ displayMode: "carousel" }, json), data);
  test("a list insert, remove and move", () => {
    const q = createCarousel({ pageSize: 10 }, records(4));
    q.currentIndex = 1;
    expect([current(q), announced(q)], "#1").toEqual([1, 1]);
    q.removePanel(0);
    expect([current(q), announced(q)], "#2: a remove in front").toEqual([0, 0]);
    // Through the list: addPanel in carousel mode selects the new panel.
    q["dataList"].add({ id: 9 }, 0);
    expect([current(q), announced(q)], "#3: an insert in front").toEqual([1, 1]);
    q["dataList"].move(1, 3);
    expect([current(q), announced(q)], "#4: a move of the record").toEqual([3, 3]);
  });
  test("a reload commit", async () => {
    const source = new TestSource(records(4));
    const q = createCarousel({ pageSize: 10 });
    q.dataSource = source;
    await flush();
    q.currentIndex = 1;
    insertInSource(source, { id: 9 });
    q.refreshDataSource();
    await flush();
    expect([current(q), announced(q)], "#1: by key").toEqual([2, 2]);
  });
  test("an assignment from outside", () => {
    const q = createCarousel({ pageSize: 10 }, records(4));
    q.currentIndex = 1;
    q.survey.setValue("q", [{ id: 9 }].concat(records(4)));
    // Not renumbered: without paging the current panel keeps its position, and the index a storage position.
    expect([current(q), announced(q)], "#1").toEqual([1, 1]);
  });
  test("a source swap", () => {
    const q = createCarousel({ pageSize: 10 }, records(4));
    q.currentIndex = 1;
    const source = new TestSource(records(4));
    source.hold();
    q.dataSource = source;
    expect([current(q), announced(q)], "#1: cleared").toEqual([-1, -1]);
  });
  test("dispose", () => {
    const q = createCarousel({ pageSize: 10 }, records(4));
    q.currentIndex = 1;
    q.dispose();
    // doubt: dispose clears the current record and leaves the announced one.
    expect([current(q), announced(q)], "#1").toEqual([-1, 1]);
  });
  test("a page change", () => {
    const q = createCarousel({ pageSize: 2 }, records(4));
    q.currentIndex = 1;
    q.pageIndex = 1;
    // The page's rebuild selects its first panel.
    expect([current(q), announced(q)], "#1").toEqual([2, 2]);
  });
  test("a failed read", async () => {
    const source = new TestSource(records(4), true);
    const q = createCarousel({ pageSize: 2 });
    q.dataSource = source;
    await flush();
    q.currentIndex = 1;
    source.hold();
    q.pageIndex = 1;
    source.fail();
    await flush();
    expect([current(q), announced(q)], "#1").toEqual([1, 1]);
  });
  test("a sort change", () => {
    const q = createCarousel({ pageSize: 10 }, records(4));
    q.currentIndex = 1;
    q.sortBy = "id-";
    expect([current(q), announced(q)], "#1: the record stays current").toEqual([1, 1]);
    expect(q.currentIndex, "#2: at its new position").toBe(2);
  });
  test("a filter change", () => {
    const q = createCarousel({ pageSize: 10 }, records(4));
    q.currentIndex = 1;
    q.filterExpression = "{id} != 0";
    expect([current(q), announced(q)], "#1: the record stays current").toEqual([1, 1]);
    q.filterExpression = "{id} != 1";
    expect([current(q), announced(q)], "#2: filtered out, the first visible panel takes over").toEqual([0, 0]);
  });
});

/* The Dynamic Panel only. A move to a record on another page of a source that pages itself keeps the
   position until the read of that page commits. */
describe("the position a move is going to", () => {
  const createMoving = async (): Promise<{ q: QuestionPanelDynamicModel, source: TestSource }> => {
    const source = new TestSource(records(6), true);
    const q = createPanel({ displayMode: "carousel", pageSize: 2 });
    q.dataSource = source;
    await flush();
    source.hold();
    q.currentIndex = 3;
    expect(pending(q), "the move waits for the read of page 1").toBe(3);
    return { q: q, source: source };
  };
  test("a list insert and remove", async () => {
    const { q } = await createMoving();
    q.removePanel(0);
    expect(pending(q), "#1: a remove").toBe(3);
    q["dataList"].add({ id: 9 }, 0);
    expect(pending(q), "#2: an insert").toBe(3);
  });
  test("a reload commit", async () => {
    const { q, source } = await createMoving();
    source.release();
    await flush();
    expect(pending(q), "#1: taken by the rebuild").toBeUndefined();
    expect(q.currentIndex, "#2").toBe(3);
  });
  test("a source swap", async () => {
    const { q } = await createMoving();
    q.dataSource = waitingSource(records(6), true);
    expect(pending(q), "#1").toBeUndefined();
  });
  test("dispose", async () => {
    const { q } = await createMoving();
    q.dispose();
    expect(pending(q), "#1").toBeUndefined();
  });
  test("a page change", async () => {
    const { q } = await createMoving();
    q.pageIndex = 2;
    // doubt: a page set from code does not supersede the move; the commit of the new page takes its position.
    expect(pending(q), "#1").toBe(3);
  });
  test("a failed read", async () => {
    const { q, source } = await createMoving();
    source.fail();
    await flush();
    expect(pending(q), "#1").toBeUndefined();
  });
  test("a sort change", async () => {
    const { q } = await createMoving();
    q.sortBy = "id-";
    expect(pending(q), "#1").toBe(3);
  });
  test("a filter change", async () => {
    const { q } = await createMoving();
    q.filterExpression = "{id} != 1";
    expect(pending(q), "#1").toBe(3);
  });
});

/* The Dynamic Panel only. The window offset the current record was taken in, and whether it names a
   record of a replaced source. */
describe("the window offset and the old-source flag of the current record", () => {
  const createOnPage = async (keyField: string = "id"): Promise<{ q: QuestionPanelDynamicModel, source: TestSource }> => {
    const source = new TestSource(records(6), true);
    source.keyField = keyField;
    const q = createPanel({ displayMode: "carousel", pageSize: 2 });
    q.dataSource = source;
    await flush();
    q.pageIndex = 1;
    await flush();
    q.currentIndex = 3;
    expect([current(q), windowOffset(q), isOfOldSource(q)], "the second record of page 1").toEqual([1, 2, false]);
    return { q: q, source: source };
  };
  test("a list insert and remove", async () => {
    const { q } = await createOnPage();
    q.removePanel(2);
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#1: a remove in front").toEqual([0, 2, false]);
  });
  test("a reload commit", async () => {
    const { q, source } = await createOnPage();
    q.currentIndex = 2;
    expect(current(q), "#1: the first record of the window").toBe(0);
    source.data.splice(2, 2, source.data[3], source.data[2]);
    q.refreshDataSource();
    await flush();
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#2: followed by key").toEqual([1, 2, false]);
  });
  test("a reload commit without a key at another window offset loses the record", async () => {
    const { q } = await createOnPage(undefined);
    q.pageIndex = 0;
    await flush();
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#1: the page's first panel is current").toEqual([0, 0, false]);
  });
  test("a source swap, then the first read of the new source", async () => {
    const { q } = await createOnPage();
    const source = new TestSource(records(6), true);
    source.hold();
    q.dataSource = source;
    // The unread window's rebuild selects no panel and takes the new list's offset.
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#1").toEqual([-1, 0, true]);
    source.release();
    await flush();
    expect(isOfOldSource(q), "#2: the commit clears the flag").toBe(false);
  });
  test("dispose", async () => {
    const { q } = await createOnPage();
    q.dispose();
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#1").toEqual([-1, 2, false]);
  });
  test("a page change", async () => {
    const { q } = await createOnPage();
    q.pageIndex = 2;
    await flush();
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#1: the page's first panel is current").toEqual([0, 4, false]);
  });
  test("a failed read", async () => {
    const { q, source } = await createOnPage();
    source.hold();
    q.pageIndex = 2;
    source.fail();
    await flush();
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#1").toEqual([1, 2, false]);
  });
  test("a sort change", async () => {
    const { q } = await createOnPage();
    q.sortBy = "id-";
    await flush();
    // The source cannot sort: the list reads it whole, and the record keeps its key across the reload.
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#1").toEqual([3, 0, false]);
  });
  test("a filter change", async () => {
    const { q } = await createOnPage();
    q.filterExpression = "{id} != 0";
    await flush();
    // The source cannot filter: the list reads it whole, and the record keeps its key across the reload.
    expect([current(q), windowOffset(q), isOfOldSource(q)], "#1").toEqual([3, 0, false]);
  });
});

// A removal the respondent has to confirm, of a record without an object (another page), names it by index.
describe("the held remove targets", () => {
  const createHolding = (kind: IKind): Question => {
    holdConfirmations();
    const q = kind.create({ pageSize: 2 }, records(5));
    kind.items(q);
    kind.remove(q, 4, true);
    expect(held(q), "the record of another page is held").toEqual([4]);
    return q;
  };
  const createRemoteHolding = async (kind: IKind): Promise<{ q: Question, source: TestSource }> => {
    holdConfirmations();
    const source = new TestSource(records(5));
    const q = kind.create({ pageSize: 2 });
    q.dataSource = source;
    await flush();
    kind.remove(q, 4, true);
    expect(held(q), "the record of another page is held").toEqual([4]);
    return { q: q, source: source };
  };
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": a list insert, remove and move", () => {
      const q = createHolding(kind);
      kind.remove(q, 0);
      expect(held(q), "#1: a remove in front").toEqual([3]);
      kind.insertFirst(q, { id: 9 });
      expect(held(q), "#2: an insert in front").toEqual([4]);
      kind.move(q, 4, 0);
      expect(held(q), "#3: a move of the record").toEqual([0]);
    });
    test(kind.name + ": a reload commit", async () => {
      const { q } = await createRemoteHolding(kind);
      q.refreshDataSource();
      await flush();
      expect(held(q), "#1: dropped").toBeUndefined();
    });
    test(kind.name + ": an assignment from outside", () => {
      const q = createHolding(kind);
      q.survey.setValue("q", records(6));
      expect(held(q), "#1: dropped").toBeUndefined();
    });
    test(kind.name + ": a source swap", () => {
      const q = createHolding(kind);
      q.dataSource = waitingSource(records(5));
      expect(held(q), "#1: dropped").toBeUndefined();
    });
    test(kind.name + ": dispose", () => {
      const q = createHolding(kind);
      q.dispose();
      expect(held(q), "#1").toEqual([4]);
    });
    test(kind.name + ": a page change", () => {
      const q = createHolding(kind);
      q["pageIndex"] = 1;
      expect(held(q), "#1").toEqual([4]);
    });
    test(kind.name + ": a failed read", async () => {
      const { q, source } = await createRemoteHolding(kind);
      source.hold();
      q.refreshDataSource();
      source.fail();
      await flush();
      expect(held(q), "#1").toEqual([4]);
    });
    test(kind.name + ": a sort change", () => {
      const q = createHolding(kind);
      q["sortBy"] = "id-";
      expect(held(q), "#1").toEqual([4]);
    });
    test(kind.name + ": a filter change", () => {
      const q = createHolding(kind);
      q["filterExpression"] = "{id} != 1";
      expect(held(q), "#1").toEqual([4]);
    });
  });
});

/* The flags the clean-up under onHidden keeps for the records under paging in memory, by record index.
   Records 1 and 3 have their "t" hidden. The walk that writes them runs on every condition run; it is
   stopped once they are taken (showInvisibleElements), so that what an event does to them shows. It
   never runs while a source is assigned: for a reload and a failed read the states are taken before
   the source is. */
describe("the hidden-answer states", () => {
  const hiddenStates = (q: Question): Array<string> => !!q["hiddenAnswerStates"]
    ? Array.from(q["hiddenAnswerStates"].entries()).map(([key, state]: [any, any]) => key + ":" + (state.t === 3 ? "shown" : "hidden")).sort()
    : undefined;
  const hiddenRecords = (count: number): Array<any> => records(count).map((r: any) => ({ id: r.id % 2 === 1 ? r.id + 20 : r.id, t: "t" + r.id }));
  const kept = ["0:shown", "1:hidden", "2:shown", "3:hidden"];
  const createWithStates = (kind: IKind, data: Array<any> = hiddenRecords(4)): Question => {
    const q = kind.create(kind === panelKind
      ? { pageSize: 2, templateElements: [{ type: "text", name: "id" }, { type: "text", name: "t", visibleIf: "{panel.id} < 10" }] }
      : { pageSize: 2, columns: [{ name: "id", cellType: "text" }, { name: "t", cellType: "text", visibleIf: "{row.id} < 10" }] },
    data, { clearInvisibleValues: "onHidden" });
    kind.items(q);
    expect(hiddenStates(q), "the states of every record").toEqual(kept);
    return q;
  };
  const freeze = (q: Question): void => { (<SurveyModel>q.survey).showInvisibleElements = true; };
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": a list insert, remove and move", () => {
      const q = createWithStates(kind);
      freeze(q);
      kind.remove(q, 0);
      expect(hiddenStates(q), "#1: a remove in front").toEqual(["0:hidden", "1:shown", "2:hidden"]);
      kind.insertFirst(q, { id: 9 });
      expect(hiddenStates(q), "#2: an insert in front").toEqual(["1:hidden", "2:shown", "3:hidden"]);
      kind.move(q, 1, 3);
      expect(hiddenStates(q), "#3: a move").toEqual(["1:shown", "2:hidden", "3:hidden"]);
    });
    test(kind.name + ": a reload commit", async () => {
      const q = createWithStates(kind);
      const source = new TestSource(records(4));
      q.dataSource = source;
      await flush();
      insertInSource(source, { id: 9 });
      q.refreshDataSource();
      await flush();
      // doubt: a reload leaves the states of the old storage as they were.
      expect(hiddenStates(q), "#1").toEqual(kept);
    });
    test(kind.name + ": an assignment from outside", () => {
      let q = createWithStates(kind);
      freeze(q);
      q.survey.setValue("q", [{ id: 9 }].concat(hiddenRecords(4)));
      // doubt: by position, not by record - an insert in front leaves each state at its old index.
      expect(hiddenStates(q), "#1: one record more").toEqual(kept);
      q = createWithStates(kind);
      freeze(q);
      q.survey.setValue("q", hiddenRecords(2));
      // The matrix rebuilds its rows for any other count than the same or one more (keepsHiddenAnswerStates).
      expect(hiddenStates(q), "#2: two records fewer").toEqual(kind === panelKind ? ["0:shown", "1:hidden"] : []);
      q = createWithStates(kind);
      freeze(q);
      q.survey.setValue("q", hiddenRecords(6));
      expect(hiddenStates(q), "#3: two records more").toEqual(kind === panelKind ? kept : []);
    });
    test(kind.name + ": a source swap", () => {
      const q = createWithStates(kind);
      q.dataSource = new TestSource(records(2));
      // doubt: the states of the old storage stay.
      expect(hiddenStates(q), "#1").toEqual(kept);
    });
    test(kind.name + ": dispose", () => {
      const q = createWithStates(kind);
      q.dispose();
      expect(hiddenStates(q), "#1").toEqual(kept);
    });
    test(kind.name + ": a page change", () => {
      const q = createWithStates(kind);
      freeze(q);
      q["pageIndex"] = 1;
      expect(hiddenStates(q), "#1").toEqual(kept);
    });
    test(kind.name + ": a failed read", async () => {
      const q = createWithStates(kind);
      const source = new TestSource(records(4));
      source.hold();
      q.dataSource = source;
      source.fail();
      await flush();
      expect(hiddenStates(q), "#1").toEqual(kept);
    });
    test(kind.name + ": a sort change", () => {
      const q = createWithStates(kind);
      freeze(q);
      q["sortBy"] = "id-";
      expect(hiddenStates(q), "#1").toEqual(kept);
    });
    test(kind.name + ": a filter change", () => {
      const q = createWithStates(kind);
      freeze(q);
      q["filterExpression"] = "{id} != 2";
      expect(hiddenStates(q), "#1").toEqual(kept);
    });
  });
});

/* A removal from the UI on a page a source that pages itself reads again: the position is focused
   again once that read commits. */
describe("the focus kept for a read", () => {
  const removeUI = (q: Question, position: number): void => {
    if (q instanceof QuestionPanelDynamicModel) {
      q.removePanelUI(q.panels[position]);
    } else {
      (<QuestionMatrixDynamicModel>q).removeRowUI((<QuestionMatrixDynamicModel>q).visibleRows[position]);
    }
  };
  const createFocusing = async (kind: IKind): Promise<{ q: Question, source: TestSource }> => {
    const source = new TestSource(records(6), true);
    const q = kind.create({ pageSize: 3 });
    q.dataSource = source;
    await flush();
    source.hold();
    removeUI(q, 1);
    expect(focusIndex(q), "the refill of the page is pending").toBe(1);
    // removeRowUI focuses the next row after 10 ms, and that timer throws on a matrix disposed before it fires: it runs first.
    await new Promise(r => setTimeout(r, 20));
    return { q: q, source: source };
  };
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": a list insert and remove", async () => {
      const { q } = await createFocusing(kind);
      q["dataList"].add({ id: 9 }, 0);
      expect(focusIndex(q), "#1: an insert").toBe(1);
      removeUI(q, 0);
      expect(focusIndex(q), "#2: another removal from the UI keeps its own position").toBe(0);
    });
    test(kind.name + ": a reload commit", async () => {
      const { q, source } = await createFocusing(kind);
      const focused = vi.spyOn(<any>q, "focusItemAfterRead");
      source.release();
      await flush();
      expect(focusIndex(q), "#1: taken").toBeUndefined();
      expect(focused.mock.calls, "#2: focused once").toEqual([[1]]);
    });
    test(kind.name + ": a source swap", async () => {
      const { q } = await createFocusing(kind);
      const source = new TestSource(records(6), true);
      source.hold();
      q.dataSource = source;
      // doubt: the position kept for the old source's read stays, and the new source's first read takes it.
      expect(focusIndex(q), "#1").toBe(1);
      const focused = vi.spyOn(<any>q, "focusItemAfterRead");
      source.release();
      await flush();
      expect(focusIndex(q), "#2").toBeUndefined();
      expect(focused.mock.calls, "#3").toEqual([[1]]);
    });
    test(kind.name + ": dispose", async () => {
      const { q } = await createFocusing(kind);
      q.dispose();
      expect(focusIndex(q), "#1").toBe(1);
    });
    test(kind.name + ": a page change", async () => {
      const { q } = await createFocusing(kind);
      q["pageIndex"] = 1;
      expect(focusIndex(q), "#1: dropped").toBeUndefined();
    });
    test(kind.name + ": a failed read", async () => {
      const { q, source } = await createFocusing(kind);
      source.fail();
      await flush();
      expect(focusIndex(q), "#1: dropped").toBeUndefined();
    });
    test(kind.name + ": a sort change", async () => {
      const { q } = await createFocusing(kind);
      q["sortBy"] = "id-";
      expect(focusIndex(q), "#1").toBe(1);
    });
    test(kind.name + ": a filter change", async () => {
      const { q } = await createFocusing(kind);
      q["filterExpression"] = "{id} != 4";
      expect(focusIndex(q), "#1").toBe(1);
    });
  });
});

/* A carousel removal of the only panel of the last page of a source that pages itself keeps both
   positions: the successor on the previous page and the focus for the refill that page waits for. */
describe("a page change and a failed read, with a focus kept and a move pending", () => {
  const createBoth = async (): Promise<{ q: QuestionPanelDynamicModel, source: TestSource }> => {
    const source = new TestSource(records(5), true);
    const q = createPanel({ displayMode: "carousel", pageSize: 2 });
    q.dataSource = source;
    await flush();
    q.pageIndex = 2;
    await flush();
    source.hold();
    q.removePanelUI(q.panels[0]);
    expect([focusIndex(q), pending(q), q.pageIndex], "both are kept, the previous page is read").toEqual([0, 3, 1]);
    return { q: q, source: source };
  };
  test("a page change drops the focus and keeps the move", async () => {
    const { q } = await createBoth();
    q.pageIndex = 0;
    expect([focusIndex(q), pending(q)], "#1").toEqual([undefined, 3]);
  });
  test("a failed read drops both", async () => {
    const { q, source } = await createBoth();
    source.fail();
    await flush();
    expect([focusIndex(q), pending(q)], "#1").toEqual([undefined, undefined]);
  });
});

/* The page validation's edited set (an edit of a record the list pages in memory) and the states of the
   paged questions nested in a record (kept when the object of the record goes). */
describe("the page validation", () => {
  const createEdited = (kind: IKind, count: number = 6): Question => {
    const q = kind.create({ pageSize: 2 }, records(count));
    kind.items(q);
    kind.setValue(q, "name", 1, "edited");
    expect(edited(q), "the edited record").toEqual([1]);
    return q;
  };
  // The inner matrix of record 0 is on its page 1 when the page of record 0 is left: its state is kept under record 0.
  const createNested = (kind: IKind): Question => {
    const q = kind === panelKind
      ? createPanel({ pageSize: 1, templateElements: nestedTemplate }, nestedRecords(4))
      : createMatrix({ pageSize: 1, detailPanelMode: "underRow", detailElements: [nestedTemplate[1]] }, nestedRecords(4));
    const item = kind.items(q)[0];
    if (kind === matrixKind) item.showDetailPanel();
    const inner = <QuestionMatrixDynamicModel>(kind === panelKind ? item.panel : item.detailPanel).getQuestionByName("inner");
    inner.visibleRows;
    inner.pageIndex = 1;
    q["pageIndex"] = 1;
    expect(nestedKeys(q), "the state kept under record 0").toEqual(["0"]);
    return q;
  };
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": a list insert, remove and move", () => {
      const q = createEdited(kind);
      kind.remove(q, 0);
      expect(edited(q), "#1: a remove in front").toEqual([0]);
      kind.move(q, 0, 2);
      expect(edited(q), "#2: a move of the record").toEqual([2]);
      q["dataList"].add({ id: 9 }, 0);
      expect(edited(q), "#3: an insert in front").toEqual([3]);
      const n = createNested(kind);
      n["dataList"].add({ id: 9 }, 0);
      expect(movedNestedKeys(n), "#4: the nested states, an insert").toEqual(["1"]);
      n["dataList"].move(1, 3);
      expect(movedNestedKeys(n), "#5: a move").toEqual(["3"]);
      n["dataList"].remove(3);
      expect(movedNestedKeys(n), "#6: a remove of the record").toEqual([]);
    });
    test(kind.name + ": a reload commit, the list paging in memory", async () => {
      const source = new TestSource(kind === panelKind ? nestedRecords(4) : records(4));
      const q = kind.create(kind === panelKind ? { pageSize: 1, templateElements: nestedTemplate } : { pageSize: 2 });
      q.dataSource = source;
      await flush();
      kind.setValue(q, "id", 0, 0);
      q["dataList"].setValue(1, "name", "edited");
      expect(edited(q), "#1").toEqual([1]);
      insertInSource(source, { id: 9 });
      q.refreshDataSource();
      await flush();
      expect(edited(q), "#2: followed by key").toEqual([2]);
    });
    test(kind.name + ": a reload commit, a source that pages itself", async () => {
      // The source cannot sort: under a sort the list reads it whole and pages it in memory.
      const source = new TestSource(records(4), true);
      const q = kind.create({ pageSize: 2 });
      q.dataSource = source;
      await flush();
      q["sortBy"] = "id";
      await flush();
      q["dataList"].setValue(1, "name", "edited");
      expect(edited(q), "#1").toEqual([1]);
      q["sortBy"] = "";
      await flush();
      expect(edited(q), "#2: a page of the source names other records").toEqual([]);
    });
    test(kind.name + ": an assignment from outside", () => {
      const q = createEdited(kind);
      q.survey.setValue("q", [{ id: 9 }].concat(q.value));
      expect(edited(q), "#1: followed by content").toEqual([2]);
      const n = createNested(kind);
      n.survey.setValue("q", [{ id: 9, inner: [] }].concat(n.value));
      expect(movedNestedKeys(n), "#2: the nested states").toEqual(["1"]);
    });
    test(kind.name + ": a source swap", () => {
      const q = createEdited(kind);
      q.dataSource = waitingSource(records(2));
      expect(edited(q), "#1: dropped").toEqual([]);
      const n = createNested(kind);
      n.dataSource = waitingSource(records(2));
      expect(movedNestedKeys(n), "#2: dropped").toEqual([]);
      /* doubt: the rebuild for the new source's window keeps the state of the object on the old page
         under its old record index, after the swap dropped the states (the matrix row of that page has
         no detail panel, so it keeps nothing). */
      expect(nestedKeys(n), "#3").toEqual(kind === panelKind ? ["1"] : []);
    });
    test(kind.name + ": dispose", () => {
      const q = createEdited(kind);
      q.dispose();
      expect(edited(q), "#1").toEqual([1]);
      const n = createNested(kind);
      n.dispose();
      expect(movedNestedKeys(n), "#2").toEqual(["0"]);
    });
    test(kind.name + ": a page change", () => {
      const q = createEdited(kind);
      q["pageIndex"] = 1;
      expect(edited(q), "#1: a page change from code validates nothing").toEqual([1]);
      const n = createNested(kind);
      n["pageIndex"] = 2;
      expect(movedNestedKeys(n), "#2").toEqual(["0"]);
    });
    test(kind.name + ": a failed read", async () => {
      const source = new TestSource(records(4));
      const q = kind.create({ pageSize: 2 });
      q.dataSource = source;
      await flush();
      q["dataList"].setValue(1, "name", "edited");
      source.hold();
      q.refreshDataSource();
      source.fail();
      await flush();
      expect(edited(q), "#1").toEqual([1]);
    });
    test(kind.name + ": a sort change", () => {
      const q = createEdited(kind);
      q["sortBy"] = "id-";
      expect(edited(q), "#1").toEqual([1]);
      const n = createNested(kind);
      n["sortBy"] = "id-";
      expect(movedNestedKeys(n), "#2").toEqual(["0"]);
    });
    test(kind.name + ": a filter change", () => {
      const q = createEdited(kind);
      q["filterExpression"] = "{id} != 2";
      expect(edited(q), "#1").toEqual([1]);
      const n = createNested(kind);
      n["filterExpression"] = "{id} != 2";
      expect(movedNestedKeys(n), "#2").toEqual(["0"]);
    });
  });
});

/* A record the remap cannot place: every new record no old one maps to may be the edited one, so each
   of them is in the edited set afterwards. */
describe("an edited record the remap cannot place", () => {
  kinds.forEach((kind: IKind) => {
    test(kind.name + ": an assignment from outside that changes two records next to each other", () => {
      const q = kind.create({ pageSize: 2 }, records(4));
      kind.items(q);
      kind.setValue(q, "name", 1, "edited");
      expect(edited(q), "#1").toEqual([1]);
      const value = q.value.slice();
      value[1] = { id: 1, name: "a" };
      value[2] = { id: 2, name: "b" };
      q.survey.setValue("q", value);
      expect(edited(q), "#2: the two records of the changed part").toEqual([1, 2]);
    });
    test(kind.name + ": a reload whose records share a key", async () => {
      const source = new TestSource(records(4));
      const q = kind.create({ pageSize: 2 });
      q.dataSource = source;
      await flush();
      q["dataList"].setValue(1, "name", "edited");
      expect(edited(q), "#1").toEqual([1]);
      // No lookup by key: the content decides, and the middle of the records changed.
      source.data[1] = { id: 1, name: "a" };
      source.data[2] = { id: 1, name: "b" };
      q.refreshDataSource();
      await flush();
      expect(edited(q), "#2: the two records of the changed part").toEqual([1, 2]);
    });
  });
});
