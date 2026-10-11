import { describe, test, expect } from "vitest";
import { RowsDynamicDataSource, IDynamicDataRow, hasFixedMembership } from "../../src/dynamic-data/dynamic-data-sources";
import { Helpers } from "../../src/helpers";

interface IStoredValue {
  rows: Array<IDynamicDataRow>;
  value: any;
  writes: Array<{ value: any, changed: Array<number> }>;
  replaced: Array<() => ((index: number) => number)>;
  source: RowsDynamicDataSource;
}
// A plain row: a value of spaces is no value, as for ItemValue.hasValue.
function createRow(value: any): IDynamicDataRow {
  return { value: value, hasValue: !Helpers.isValueEmpty(value, true) };
}
// A source over plain rows and a local keyed answer; the store is what an owner would do with the new answer.
function createSource(rowValues: Array<any>, value?: any): IStoredValue {
  const res: IStoredValue = <any>{ rows: rowValues.map(createRow), value: value, writes: [], replaced: [] };
  res.source = new RowsDynamicDataSource((): Array<IDynamicDataRow> => res.rows, (): any => res.value,
    (newValue: any, changed: Array<number>): void => {
      res.value = newValue;
      res.writes.push({ value: newValue, changed: changed });
    });
  res.source.onRecordsReplaced = (createRemap: () => ((index: number) => number)): void => { res.replaced.push(createRemap); };
  return res;
}
function remapAll(createRemap: () => ((index: number) => number), count: number): Array<number> {
  const remap = createRemap();
  const res: Array<number> = [];
  for (let i = 0; i < count; i++) res.push(remap(i));
  return res;
}

describe("RowsDynamicDataSource: the records are the rows' answers", () => {
  test("the records are the rows with a value, in rows order, read from the answer itself", () => {
    const answer = { a: { x: 1 }, b: { x: 2 }, other: { x: 3 } };
    const { source } = createSource(["b", "", "a", null, "c", "  ", undefined], answer);
    const records = source.read();
    expect(records.length, "#1: the rows without a value are no records").toBe(3);
    expect(records[0] === answer.b, "#2: the answer's object, not a copy").toBe(true);
    expect(records[1] === answer.a, "#3: in rows order").toBe(true);
    expect(records[2], "#4: a row without an answer reads undefined").toBeUndefined();
    expect(source.items.map((item: IDynamicDataRow): any => item.value), "#5").toEqual(["b", "a", "c"]);
  });
  test("the row says whether it is a record: a row without hasValue is none, whatever its value", () => {
    const stored = createSource(["a", "b"], { a: { x: 1 }, b: { x: 2 } });
    stored.rows[0] = { value: "a", hasValue: false };
    stored.source.rowsChanged();
    expect(stored.source.items.map((item: IDynamicDataRow): any => item.value), "#1").toEqual(["b"]);
    expect(stored.source.read(), "#2").toEqual([{ x: 2 }]);
  });
  test("two rows with one value are two records that read one key", () => {
    const answer = { a: { x: 1 } };
    const { source } = createSource(["a", "b", "a"], answer);
    const records = source.read();
    expect(records.length, "#1").toBe(3);
    expect(records[0] === answer.a && records[2] === answer.a, "#2: both read the key").toBe(true);
    expect(source.hasDuplicateKeys, "#3").toBe(true);
  });
  test("an answer that is not an object reads as no records answered", () => {
    const stored = createSource(["a", "b"], "text");
    expect(stored.source.read(), "#1").toEqual([undefined, undefined]);
    stored.value = undefined;
    expect(stored.source.read(), "#2").toEqual([undefined, undefined]);
  });
  test("the composed array is the same instance until the answer instance or the rows change", () => {
    const stored = createSource(["a", "b"], { a: { x: 1 } });
    const first = stored.source.read();
    expect(stored.source.read() === first, "#1: read again").toBe(true);
    stored.value = Object.assign({}, stored.value);
    const second = stored.source.read();
    expect(second === first, "#2: another answer instance").toBe(false);
    expect(stored.source.read() === second, "#3").toBe(true);
    stored.rows.push(createRow("c"));
    expect(stored.source.read() === second, "#4: the rows are not watched").toBe(true);
    stored.source.rowsChanged();
    const third = stored.source.read();
    expect(third === second, "#5: after rowsChanged()").toBe(false);
    expect(third.length, "#6").toBe(3);
  });
  test("count, readAt, itemAt and hasDuplicateKeys", () => {
    const answer = { 1: { x: 1 }, b: { x: 2 } };
    const { source, rows } = createSource([1, "", "b", "c"], answer);
    expect(source.count, "#1").toBe(3);
    expect(source.readAt(0) === answer[1], "#2: a number row value reads its key").toBe(true);
    expect(source.readAt(1) === answer.b, "#3").toBe(true);
    expect(source.readAt(2), "#4: no answer").toBeUndefined();
    expect(source.readAt(3), "#5: out of range").toBeUndefined();
    expect(source.readAt(-1), "#6: out of range").toBeUndefined();
    expect(source.itemAt(1) === rows[2], "#7: the row of the record").toBe(true);
    expect(source.itemAt(3), "#8").toBeUndefined();
    expect(source.hasDuplicateKeys, "#9").toBe(false);
  });
});

describe("RowsDynamicDataSource: writes", () => {
  test("an update writes its key, keeps the keys that are not rows and passes the changed indexes", () => {
    const answer = { a: { x: 1 }, notRow: 5 };
    const stored = createSource(["a", "b"], answer);
    stored.source.update(1, { x: 2 });
    expect(stored.writes.length, "#1").toBe(1);
    expect(stored.writes[0].changed, "#2").toEqual([1]);
    expect(stored.value, "#3").toEqual({ a: { x: 1 }, notRow: 5, b: { x: 2 } });
    expect(stored.value === answer, "#4: a new answer").toBe(false);
    expect(stored.value.a === answer.a, "#5: a record not written stays the same object").toBe(true);
    expect(answer, "#6: the old answer is not changed").toEqual({ a: { x: 1 }, notRow: 5 });
  });
  test("an empty record deletes its key", () => {
    const stored = createSource(["a", "b"], { a: { x: 1 }, b: { x: 2 } });
    stored.source.update(0, { x: null });
    expect(stored.value, "#1").toEqual({ b: { x: 2 } });
    stored.source.update(1, undefined);
    expect(stored.value, "#2: nothing left is an empty answer; what that means is the owner's").toEqual({});
    expect(stored.writes.map(write => write.changed), "#3").toEqual([[0], [1]]);
  });
  test("an update of one of two rows with one key writes the key", () => {
    const stored = createSource(["a", "b", "a"], { a: { x: 1 } });
    stored.source.update(2, { x: 3 });
    expect(stored.value, "#1").toEqual({ a: { x: 3 } });
    expect(stored.writes[0].changed, "#2").toEqual([2]);
  });
  test("refused, with nothing stored: another length or a moved record; the source has no insert, remove or move", () => {
    const answer = { a: { x: 1 }, b: { x: 2 } };
    const stored = createSource(["a", "b", "c"], answer);
    const records = stored.source.read();
    stored.source["setArray"](records.concat([{ x: 4 }]));
    expect(stored.writes.length, "#1: a longer array").toBe(0);
    stored.source["setArray"](records.slice(0, 2));
    expect(stored.writes.length, "#2: a shorter array").toBe(0);
    stored.source.update(2, answer.a);
    expect(stored.writes.length, "#3: a record moved to another position").toBe(0);
    expect("insert" in stored.source, "#4: no insert").toBe(false);
    expect("remove" in stored.source, "#4: no remove").toBe(false);
    expect("move" in stored.source, "#4: no move").toBe(false);
    expect(stored.value === answer, "#5").toBe(true);
    expect(hasFixedMembership(stored.source), "#6").toBe(true);
  });
  test("an empty record may be written at another position: it is what every unanswered row holds", () => {
    const stored = createSource(["a", "b"], { a: {} });
    stored.source.update(1, stored.value.a);
    expect(stored.writes.length, "#1: written, and the empty record deletes the key").toBe(1);
    expect(stored.value, "#2").toEqual({ a: {} });
  });
  test("a batch of two updates stores once", () => {
    const stored = createSource(["a", "b", "c"], { a: { x: 1 } });
    stored.source.batch(() => {
      stored.source.update(1, { x: 2 });
      stored.source.update(2, { x: 3 });
    });
    expect(stored.writes.length, "#1").toBe(1);
    expect(stored.writes[0].changed, "#2").toEqual([1, 2]);
    expect(stored.value, "#3").toEqual({ a: { x: 1 }, b: { x: 2 }, c: { x: 3 } });
  });
  test("inside a batch, readAt and count read the records being written; after it, the stored answer", () => {
    const stored = createSource(["a", "", "b"], { a: { x: 1 }, b: { x: 2 } });
    const reads: Array<any> = [];
    stored.source.batch(() => {
      stored.source.update(0, { x: 10 });
      reads.push(stored.source.readAt(0), stored.source.readAt(1), stored.source.count);
      expect(stored.value.a, "#1: the answer does not have the write yet").toEqual({ x: 1 });
    });
    expect(reads, "#2: the written record, the other one, and the rows' count").toEqual([{ x: 10 }, { x: 2 }, 2]);
    stored.value = { a: { x: 5 }, b: { x: 2 } };
    expect(stored.source.readAt(0), "#3: the stored answer again").toEqual({ x: 5 });
    expect(stored.source.count, "#4").toBe(2);
  });
});

describe("RowsDynamicDataSource: rowsChanged()", () => {
  test("a row added: onRecordsReplaced fires once, and each old record keeps its key", () => {
    const stored = createSource(["a", "b"], {});
    stored.source.read();
    stored.rows.splice(1, 0, createRow("x"));
    stored.source.rowsChanged();
    expect(stored.replaced.length, "#1").toBe(1);
    expect(remapAll(stored.replaced[0], 2), "#2").toEqual([0, 2]);
    expect(stored.source.count, "#3").toBe(3);
  });
  test("a row removed: its key is gone", () => {
    const stored = createSource(["a", "b", "c"], {});
    stored.source.read();
    stored.rows.splice(1, 1);
    stored.source.rowsChanged();
    expect(stored.replaced.length, "#1").toBe(1);
    expect(remapAll(stored.replaced[0], 3), "#2").toEqual([0, -1, 1]);
  });
  test("the rows reordered", () => {
    const stored = createSource(["a", "b", "c"], {});
    stored.source.read();
    stored.rows.reverse();
    stored.source.rowsChanged();
    expect(remapAll(stored.replaced[0], 3), "#1").toEqual([2, 1, 0]);
  });
  test("a row value renamed: the old key is gone", () => {
    const stored = createSource(["a", "b"], { a: { x: 1 }, b: { x: 2 } });
    stored.source.read();
    stored.rows[0].value = "z";
    stored.source.rowsChanged();
    expect(remapAll(stored.replaced[0], 2), "#1").toEqual([-1, 1]);
    expect(stored.source.read(), "#2: the renamed row reads its new key").toEqual([undefined, { x: 2 }]);
  });
  test("two rows of one key follow by occurrence", () => {
    const stored = createSource(["a", "b", "a"], {});
    stored.source.read();
    stored.rows.splice(0, 0, createRow("c"));
    stored.rows.splice(2, 1);
    stored.source.rowsChanged();
    expect(stored.source.items.map((item: IDynamicDataRow): any => item.value), "#1").toEqual(["c", "a", "a"]);
    expect(remapAll(stored.replaced[0], 3), "#2: the first a to the first a, b gone, the second a to the second a").toEqual([1, -1, 2]);
  });
  test("a key that compares as a string: the number 1 and the string '1' are one key", () => {
    const stored = createSource([1, "b"], {});
    stored.source.read();
    stored.rows[0].value = "1";
    stored.source.rowsChanged();
    expect(remapAll(stored.replaced[0], 2), "#1").toEqual([0, 1]);
  });
});
