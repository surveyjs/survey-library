import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";

/* A question with its own records reads a record and its counts through its records source, and the
   record list over that source gives the same answers: outside a write, inside a batch of the list,
   from the value events of a single write and after an assignment from outside. */

type RecordsQuestion = QuestionMatrixDynamicModel | QuestionPanelDynamicModel | QuestionMatrixDropdownModel;
// What a reader passes for a padded record (the duplicate scan does).
const DEFAULT_RECORD = { isDefault: true };
interface IReadEntry {
  index: number;
  read: any;
  readWithDefault: any;
  listRecord: any;
}
interface IReadState {
  counts: Array<number>;
  sourceCount: number;
  isBatching: boolean;
  storedLength: number;
  minCount: number;
  entries: Array<IReadEntry>;
}
function captureReads(q: RecordsQuestion): IReadState {
  const list = q["dataListValue"];
  const source = q["recordsSource"];
  const stored = q.value;
  const res: IReadState = {
    counts: [q["loadedRecordCount"], q["storedRecordCount"], list.loadedCount, list.count],
    sourceCount: source.count,
    isBatching: source["isBatching"],
    storedLength: Array.isArray(stored) ? stored.length : 0,
    minCount: q.getType() === "matrixdynamic" ? (<QuestionMatrixDynamicModel>q).rowCount : 0,
    entries: []
  };
  for (let i = -1; i <= list.count; i++) {
    res.entries.push({ index: i, read: q["getListRecordAt"](i), readWithDefault: q["getListRecordAt"](i, DEFAULT_RECORD), listRecord: list.getRecord(i) });
  }
  return res;
}
/* Outside a batch a padded position of the Dynamic Matrix reads a new default record on every read,
   and the passed default record when one is given. Inside a batch the padding is in the array being
   built, so the list and the source read the same instance there, whatever is passed. */
function checkReads(state: IReadState, label: string): void {
  const sourceCount = state.sourceCount;
  expect(state.counts, label + ": loadedRecordCount, storedRecordCount, list.loadedCount and list.count").toEqual([sourceCount, sourceCount, sourceCount, sourceCount]);
  state.entries.forEach((entry: IReadEntry): void => {
    const isPadded = !state.isBatching && entry.index >= state.storedLength && entry.index < state.minCount;
    const at = label + ", index " + entry.index;
    if (isPadded) {
      expect(entry.read, at + ": a padded record").toEqual(entry.listRecord);
      expect(entry.readWithDefault === DEFAULT_RECORD, at + ": the passed default record").toBe(true);
    } else {
      expect(entry.read === entry.listRecord, at + ": the record the list reads").toBe(true);
      expect(entry.readWithDefault === entry.listRecord, at + ": the record the list reads, a default passed").toBe(true);
    }
  });
}
function expectSameReads(q: RecordsQuestion, label: string): IReadState {
  const state = captureReads(q);
  checkReads(state, label);
  return state;
}

function createDynamicMatrix(): { survey: SurveyModel, q: QuestionMatrixDynamicModel } {
  const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 4, columns: [{ name: "a", cellType: "text" }] }] });
  survey.data = { m: [{ a: 1 }, { a: 2 }] };
  const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
  // The two rows added read padded: the stored value keeps its two records until a write.
  q.rowCount = 4;
  return { survey: survey, q: q };
}
function createDynamicPanel(): { survey: SurveyModel, q: QuestionPanelDynamicModel } {
  const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "m", templateElements: [{ type: "text", name: "a" }] }] });
  survey.data = { m: [{ a: 1 }, { a: 2 }, { a: 3 }] };
  const q = <QuestionPanelDynamicModel>survey.getQuestionByName("m");
  return { survey: survey, q: q };
}
function createMultiSelectMatrix(): { survey: SurveyModel, q: QuestionMatrixDropdownModel } {
  const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", rows: ["r1", "r2", "r3"], columns: [{ name: "a", cellType: "text" }] }] });
  survey.data = { m: { r1: { a: 1 }, r3: { a: 3 } } };
  const q = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
  return { survey: survey, q: q };
}
const creators: Array<{ name: string, create: () => { survey: SurveyModel, q: RecordsQuestion }, canInsert: boolean }> = [
  { name: "Dynamic Matrix", create: createDynamicMatrix, canInsert: true },
  { name: "Dynamic Panel", create: createDynamicPanel, canInsert: true },
  { name: "Multi-Select Matrix", create: createMultiSelectMatrix, canInsert: false }
];

describe("a question reads its own records and counts through its source, as its list does", () => {
  test("the Dynamic Matrix pads up to rowCount, the list reads its question's source", () => {
    const { q } = createDynamicMatrix();
    const list = q["dataList"];
    expect(q.value.length, "#1: two stored records").toBe(2);
    expect(q.rowCount, "#2: four rows").toBe(4);
    expect(list.source === q["recordsSource"], "#3: one source").toBe(true);
    expect(q["recordsSource"].count, "#4").toBe(4);
  });
  creators.forEach(({ name, create, canInsert }) => {
    test(name + ": outside a write", () => {
      const { q } = create();
      q["dataList"].getVisibleIndexes();
      expectSameReads(q, "outside");
    });
    test(name + ": inside a batch that updates a record" + (canInsert ? " and inserts one" : ""), () => {
      const { q } = create();
      const list = q["dataList"];
      const states: Array<IReadState> = [];
      list.batch((): void => {
        list.setRecord(0, { a: 20 });
        states.push(captureReads(q));
        if (canInsert) {
          list.add({ a: 30 }, 1);
          states.push(captureReads(q));
        }
      });
      checkReads(states[0], "updated");
      expect(states[0].entries[1].read, "the written record").toEqual({ a: 20 });
      expect(states[0].isBatching, "inside the source's batch").toBe(true);
      if (canInsert) {
        checkReads(states[1], "inserted");
        expect(states[1].entries[2].read, "the inserted record").toEqual({ a: 30 });
        expect(states[1].sourceCount, "one more record").toBe(states[0].sourceCount + 1);
      }
      expectSameReads(q, "after the batch");
    });
    test(name + ": read from the value events of a single write", () => {
      const { survey, q } = create();
      const list = q["dataList"];
      const states: Array<IReadState> = [];
      survey.onValueChanging.add((_, options) => { if (options.name === "m") states.push(captureReads(q)); });
      survey.onValueChanged.add((_, options) => { if (options.name === "m") states.push(captureReads(q)); });
      list.setRecord(0, { a: 40 });
      expect(states.length, "both events").toBe(2);
      checkReads(states[0], "onValueChanging");
      checkReads(states[1], "onValueChanged");
      expect(states[1].entries[1].read, "the written record").toEqual({ a: 40 });
    });
    test(name + ": after an outside assignment", () => {
      const { survey, q } = create();
      q["dataList"].getVisibleIndexes();
      const value = q.getType() === "matrixdropdown" ? { r2: { a: 7 } } : [{ a: 7 }];
      survey.setValue("m", value);
      const state = expectSameReads(q, "assigned");
      expect(state.entries.map(e => e.read), "the assigned records").toEqual(q.getType() === "matrixdropdown" ?
        [undefined, undefined, { a: 7 }, undefined, undefined] : [undefined, { a: 7 }, undefined]);
    });
  });
  test("the Multi-Select Matrix: a record written inside a batch reads back through the question", () => {
    const { q } = createMultiSelectMatrix();
    const list = q["dataList"];
    let inside: any;
    list.batch((): void => {
      list.setRecord(0, { a: 2 });
      inside = q["getListRecordAt"](0);
    });
    expect(inside, "#1: the written record").toEqual({ a: 2 });
    expect(q.value.r1, "#2: stored after the batch").toEqual({ a: 2 });
  });
  test("a removal inside a batch: the Dynamic Matrix's rowCount has not counted down, the counts follow the batch", () => {
    const { q } = createDynamicMatrix();
    const list = q["dataList"];
    let state: IReadState;
    let rowCount: number;
    list.batch((): void => {
      list.remove(0);
      state = captureReads(q);
      rowCount = q.rowCount;
    });
    expect(rowCount, "#1: rowCount inside the batch").toBe(4);
    expect(state.sourceCount, "#2: the batch array is one record shorter").toBe(3);
    checkReads(state, "removed");
    expectSameReads(q, "after the removal");
  });
  test("a removal inside a batch of the Dynamic Panel", () => {
    const { q } = createDynamicPanel();
    const list = q["dataList"];
    let state: IReadState;
    list.batch((): void => {
      list.remove(1);
      state = captureReads(q);
    });
    expect(state.sourceCount, "#1").toBe(2);
    checkReads(state, "removed");
    expect(state.entries.map(e => e.read), "#2").toEqual([undefined, { a: 1 }, { a: 3 }, undefined]);
    expectSameReads(q, "after the removal");
  });
});
