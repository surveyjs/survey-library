import { describe, test, expect } from "vitest";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource, hasFixedMembership, IDynamicDataRow, isLocalSource, LocalDynamicDataSource, RowsDynamicDataSource, SurveyDataDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { IDynamicDataSource } from "../../src/dynamic-data/dynamic-data-interfaces";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDropdownModelBase } from "../../src/question_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";

/* The local sources share one base: the array source has insert, remove and move, the rows source has
   none, and a list over a question's own source has a fixed membership exactly when that source has no
   insert. */

function createRows(values: Array<string>): Array<IDynamicDataRow> {
  return values.map((value: string): IDynamicDataRow => ({ value: value, hasValue: !!value }));
}
function createRowsSource(values: Array<string>, answer: any): { source: RowsDynamicDataSource, stored: () => any } {
  let value = answer;
  const rows = createRows(values);
  const source = new RowsDynamicDataSource((): Array<IDynamicDataRow> => rows, (): any => value,
    (newValue: any): void => { value = newValue; });
  return { source: source, stored: (): any => value };
}
function createArraySource(stored: Array<any>, minCount: number = 0): { source: ArrayDynamicDataSource, stored: () => Array<any> } {
  let local = stored;
  const options = minCount > 0 ? { getMinCount: (): number => minCount, getDefaultRecord: (): any => ({ d: 1 }) } : undefined;
  const source = new ArrayDynamicDataSource((): Array<any> => local, (arr: Array<any>): void => { local = arr; }, options);
  return { source: source, stored: (): Array<any> => local };
}
const MEMBERSHIP_METHODS = ["insert", "remove", "move"];
function getMembershipMethods(source: any): Array<string> {
  return MEMBERSHIP_METHODS.filter((name: string): boolean => name in source);
}

describe("Local sources: the class hierarchy", () => {
  test("the rows source is a local source without insert, remove or move; the array source has all three", () => {
    const rows = createRowsSource(["a", "b"], { a: { x: 1 } }).source;
    const array = createArraySource([{ a: 1 }]).source;
    expect(rows instanceof LocalDynamicDataSource, "#1: rows is local").toBe(true);
    expect(rows instanceof ArrayDynamicDataSource, "#1: rows is not an array source").toBe(false);
    expect(getMembershipMethods(rows), "#2: rows").toEqual([]);
    expect(getMembershipMethods(array), "#2: array").toEqual(MEMBERSHIP_METHODS);
    expect(hasFixedMembership(rows), "#3: rows").toBe(true);
    expect(hasFixedMembership(array), "#3: array").toBe(false);
  });
  [0, 3].forEach((minCount: number) => {
    test("the array source inserts, removes and moves, min count: " + minCount, () => {
      const { source, stored } = createArraySource([{ a: 1 }, { a: 2 }], minCount);
      // The first write stores the padded record that the minimum count adds to the two stored ones.
      const padding = minCount > 0 ? [{ d: 1 }] : [];
      source.insert({ a: 3 }, 1);
      expect(stored(), "#1: insert").toEqual([{ a: 1 }, { a: 3 }, { a: 2 }].concat(padding));
      source.move(0, 2);
      expect(stored(), "#2: move").toEqual([{ a: 3 }, { a: 2 }, { a: 1 }].concat(padding));
      source.remove(1);
      expect(stored(), "#3: remove").toEqual([{ a: 3 }, { a: 1 }].concat(padding));
      expect(source.count, "#4").toBe(2 + padding.length);
      source.batch((): void => {
        source.insert({ a: 4 }, 0);
        source.remove(2);
        source.move(0, 1);
      });
      expect(stored(), "#5: a batch").toEqual(minCount > 0 ? [{ a: 3 }, { a: 4 }, { d: 1 }] : [{ a: 3 }, { a: 4 }]);
    });
  });
  test("count and readAt, inside and outside a batch, for both local sources", () => {
    const array = createArraySource([{ a: 1 }], 3);
    expect([array.source.count, array.source.readAt(0), array.source.readAt(2), array.source.readAt(3)], "#1: array, outside").toEqual([3, { a: 1 }, { d: 1 }, undefined]);
    const insideArray: Array<any> = [];
    array.source.batch((): void => {
      array.source.remove(2);
      array.source.update(0, { a: 10 });
      insideArray.push(array.source.count, array.source.readAt(0), array.source.readAt(2));
      expect(array.stored(), "#2: not stored yet").toEqual([{ a: 1 }]);
    });
    expect(insideArray, "#2: array, inside: the array being built, not padded again").toEqual([2, { a: 10 }, undefined]);
    const rows = createRowsSource(["a", "", "b"], { a: { x: 1 } });
    expect([rows.source.count, rows.source.readAt(0), rows.source.readAt(1), rows.source.readAt(2)], "#3: rows, outside").toEqual([2, { x: 1 }, undefined, undefined]);
    const insideRows: Array<any> = [];
    rows.source.batch((): void => {
      rows.source.update(1, { x: 2 });
      insideRows.push(rows.source.count, rows.source.readAt(1));
      expect(rows.stored(), "#4: not stored yet").toEqual({ a: { x: 1 } });
    });
    expect(insideRows, "#4: rows, inside: the array being built").toEqual([2, { x: 2 }]);
    expect(rows.stored(), "#5: stored after the batch").toEqual({ a: { x: 1 }, b: { x: 2 } });
  });
  test("isLocalSource is true for the three local sources and false for a plain source with the same methods", () => {
    const survey = new SurveyModel();
    const plain: IDynamicDataSource = { read: (): Array<any> => [], insert: (): void => { }, update: (): void => { }, remove: (): void => { } };
    plain["move"] = (): void => { };
    plain["batch"] = (func: () => void): void => func();
    plain["readAt"] = (): any => undefined;
    expect([
      isLocalSource(createArraySource([]).source),
      isLocalSource(new SurveyDataDynamicDataSource(survey, "q1")),
      isLocalSource(createRowsSource(["a"], {}).source),
      isLocalSource(plain)
    ]).toEqual([true, true, true, false]);
  });
});

describe("Local sources: the membership of a list over its owner's own source", () => {
  function createRowsList(): { list: DynamicDataList, stored: () => any, changes: Array<string> } {
    const rows = createRowsSource(["a", "b", "c"], { a: { x: 1 }, b: { x: 2 } });
    const changes: Array<string> = [];
    const list = DynamicDataList.createReadThrough({ getFields: () => [{ name: "x" }], onDataListChanged: (change: any): void => { changes.push(change.type); } },
      (): LocalDynamicDataSource => rows.source);
    // The load's reset is not one of the operations.
    changes.length = 0;
    return { list: list, stored: rows.stored, changes: changes };
  }
  test("over a rows source: fixed, the membership operations leave no trace, and no source can be assigned", () => {
    const { list, stored, changes } = createRowsList();
    const before = stored();
    expect(list.isMembershipFixed, "#1").toBe(true);
    expect(list.add({ x: 9 }), "#2: add").toBe(-1);
    list.remove(0);
    list.ensureCount(5);
    list.truncate(1);
    expect(stored() === before, "#3: nothing stored").toBe(true);
    expect(list.loadedCount, "#3: the count").toBe(3);
    expect(changes, "#3: nothing announced").toEqual([]);
    expect(MEMBERSHIP_METHODS.map((op: any): boolean => list.hasCapability(op)), "#4").toEqual([false, false, false]);
    expect(list.hasCapability("update"), "#4: update").toBe(true);
    expect(() => list.assignSource(ArrayDynamicDataSource.fromArray([{ x: 1 }])), "#5: assignSource").toThrow();
    expect(() => { list.source = ArrayDynamicDataSource.fromArray([{ x: 1 }]); }, "#5: source").toThrow();
    expect(list.isRemote, "#6: nothing assigned").toBe(false);
  });
  test("over an array source: not fixed, and a move is allowed as before", () => {
    const { source, stored } = createArraySource([{ x: 1 }, { x: 2 }]);
    const list = DynamicDataList.createReadThrough({ getFields: () => [{ name: "x" }] }, (): LocalDynamicDataSource => source);
    expect(list.isMembershipFixed, "#1").toBe(false);
    expect(MEMBERSHIP_METHODS.map((op: any): boolean => list.hasCapability(op)), "#2").toEqual([true, true, true]);
    list.move(0, 1);
    expect(stored(), "#3").toEqual([{ x: 2 }, { x: 1 }]);
  });
  test("a local source without move is refused a move", () => {
    class NoMoveSource extends LocalDynamicDataSource {
      protected getStoredCount(): number {
        return this.readStored().length;
      }
      protected readStoredAt(index: number): any {
        return this.readStored()[index];
      }
      public insert(): void { }
    }
    const list = DynamicDataList.createReadThrough({ getFields: () => [{ name: "x" }] },
      (): LocalDynamicDataSource => new NoMoveSource((): Array<any> => [{ x: 1 }, { x: 2 }], (): void => { }));
    expect(list.isMembershipFixed, "#1: it inserts").toBe(false);
    expect(list.hasCapability("move"), "#2").toBe(false);
  });
});

describe("Local sources: the membership of each records question follows from its own source", () => {
  function createQuestions(): Array<{ name: string, q: any, isFixed: boolean }> {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "dynamic", rowCount: 2, columns: [{ name: "a" }] },
      { type: "matrixdropdown", name: "dropdown", rows: ["r1", "r2"], columns: [{ name: "a" }] },
      { type: "paneldynamic", name: "panel", panelCount: 2, templateElements: [{ type: "text", name: "a" }] }
    ] });
    return [
      { name: "matrix base", q: new QuestionMatrixDropdownModelBase("base"), isFixed: true },
      { name: "matrixdropdown", q: survey.getQuestionByName("dropdown"), isFixed: true },
      { name: "matrixdynamic", q: survey.getQuestionByName("dynamic"), isFixed: false },
      { name: "paneldynamic", q: survey.getQuestionByName("panel"), isFixed: false }
    ];
  }
  test("isRecordMembershipFixed is true exactly when the own source has no insert", () => {
    createQuestions().forEach(({ name, q, isFixed }) => {
      const source = q["recordsSource"];
      expect(isLocalSource(source), name + ": a local source").toBe(true);
      expect(typeof source.insert !== "function", name + ": no insert").toBe(isFixed);
      expect(q["isRecordMembershipFixed"](), name + ": isRecordMembershipFixed").toBe(isFixed);
      expect(q["dataList"].isMembershipFixed, name + ": the list").toBe(isFixed);
    });
    expect(createQuestions()[1].q["recordsSource"] instanceof RowsDynamicDataSource, "the Multi-Select Matrix: a rows source").toBe(true);
    expect(createQuestions()[3].q["recordsSource"] instanceof ArrayDynamicDataSource, "the Dynamic Panel: an array source").toBe(true);
  });
  test("the Dynamic Matrix's own source is an array source that pads up to rowCount, and its rows are added, removed and moved", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "a", cellType: "text" }] }] });
    survey.data = { m: [{ a: 1 }] };
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    // survey.data sets rowCount to the value length: raise it again, so that two records read padded.
    q.rowCount = 3;
    const source = q["recordsSource"];
    expect(source instanceof ArrayDynamicDataSource, "#1: an array source").toBe(true);
    expect(q.value, "#2: the stored value is not padded").toEqual([{ a: 1 }]);
    expect(source.count, "#3: counted padded").toBe(3);
    expect(q["dataList"].count, "#3: the list").toBe(3);
    expect(source.readAt(0), "#4").toEqual({ a: 1 });
    expect(source.readAt(2), "#4: a padded record").toEqual({});
    expect(q.visibleRows.length, "#5: the rows").toBe(3);
    q.addRow();
    expect(q.rowCount, "#6: added").toBe(4);
    q.visibleRows[1].getQuestionByColumnName("a").value = 2;
    q.moveRowByIndex(1, 0);
    expect(q.value[0], "#7: moved").toEqual({ a: 2 });
    q.removeRow(0);
    expect(q.rowCount, "#8: removed").toBe(3);
    expect(q.value[0], "#8").toEqual({ a: 1 });
  });
  test("the matrix base holds no record and refuses every list operation", () => {
    const q = new QuestionMatrixDropdownModelBase("base");
    const list: DynamicDataList = q["dataList"];
    expect(q["recordsSource"] instanceof RowsDynamicDataSource, "#1: a rows source").toBe(true);
    expect([q["recordsSource"].count, list.count, list.loadedCount], "#2: no record").toEqual([0, 0, 0]);
    expect(list.add({ a: 1 }), "#3: add").toBe(-1);
    list.remove(0);
    list.move(0, 1);
    list.ensureCount(2);
    list.truncate(0);
    expect(list.setValue(0, "a", 1), "#4: update, out of range").toBe(false);
    expect(list.count, "#5: still no record").toBe(0);
    expect(q.value, "#5: nothing stored").toBeUndefined();
    expect(MEMBERSHIP_METHODS.map((op: any): boolean => list.hasCapability(op)), "#6").toEqual([false, false, false]);
  });
});
