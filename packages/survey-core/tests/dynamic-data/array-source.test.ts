import { describe, test, expect } from "vitest";
import { ArrayDynamicDataSource, hasFixedMembership } from "../../src/dynamic-data/dynamic-data-sources";

describe("ArrayDynamicDataSource", () => {
  test("fromArray reads the array it wraps", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }, { a: 2 }]);
    expect(source.read().length).toBe(2);
    expect(source.read()[1].a).toBe(2);
    expect(source.array).toBe(source.read());
  });
  test("fromArray without an argument starts empty", () => {
    const source = ArrayDynamicDataSource.fromArray();
    expect(source.read()).toEqual([]);
  });
  test("a non-array value reads as empty", () => {
    const source = new ArrayDynamicDataSource(() => <any>"not an array", (): void => { });
    expect(source.read()).toEqual([]);
    const undefinedSource = new ArrayDynamicDataSource(() => undefined, (): void => { });
    expect(undefinedSource.read()).toEqual([]);
  });
  test("insert builds a new array", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }]);
    const before = source.array;
    source.insert({ a: 2 }, 1);
    const after = source.array;
    expect(after).not.toBe(before);
    expect(before.length).toBe(1);
    expect(after.map((r: any) => r.a)).toEqual([1, 2]);
  });
  test("insert at the start and out of range", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }]);
    source.insert({ a: 0 }, 0);
    source.insert({ a: 9 }, 100);
    source.insert({ a: -1 }, -5);
    expect(source.array.map((r: any) => r.a)).toEqual([-1, 0, 1, 9]);
  });
  test("update builds a new array and replaces the record", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }, { a: 2 }]);
    const before = source.array;
    source.update(1, { a: 22 });
    const after = source.array;
    expect(after).not.toBe(before);
    expect(before[1].a).toBe(2);
    expect(after[1].a).toBe(22);
  });
  test("update out of range changes nothing", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }]);
    const before = source.array;
    source.update(5, { a: 5 });
    source.update(-1, { a: 5 });
    expect(source.array).toBe(before);
  });
  test("remove builds a new array", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }, { a: 2 }, { a: 3 }]);
    const before = source.array;
    source.remove(1);
    const after = source.array;
    expect(after).not.toBe(before);
    expect(before.length).toBe(3);
    expect(after.map((r: any) => r.a)).toEqual([1, 3]);
  });
  test("remove out of range changes nothing", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }]);
    const before = source.array;
    source.remove(4);
    source.remove(-1);
    expect(source.array).toBe(before);
  });
  test("move builds a new array", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }, { a: 2 }, { a: 3 }]);
    const before = source.array;
    source.move(0, 2);
    const after = source.array;
    expect(after).not.toBe(before);
    expect(before.map((r: any) => r.a)).toEqual([1, 2, 3]);
    expect(after.map((r: any) => r.a)).toEqual([2, 3, 1]);
  });
  test("move out of range or onto itself changes nothing", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }, { a: 2 }]);
    const before = source.array;
    source.move(0, 0);
    source.move(0, 5);
    source.move(-1, 1);
    expect(source.array).toBe(before);
  });
  test("the getter/setter pair is the only access to the storage", () => {
    const holder: { items: Array<any> } = { items: [{ a: 1 }] };
    const assigned: Array<Array<any>> = [];
    const source = new ArrayDynamicDataSource(() => holder.items, (arr: Array<any>): void => {
      assigned.push(arr);
      holder.items = arr;
    });
    source.insert({ a: 2 }, 1);
    source.update(0, { a: 11 });
    source.remove(1);
    expect(assigned.length).toBe(3);
    expect(holder.items.map((r: any) => r.a)).toEqual([11]);
  });
  test("the source never keeps a captured array: a replaced storage is picked up", () => {
    const holder: { items: Array<any> } = { items: [{ a: 1 }] };
    const source = new ArrayDynamicDataSource(() => holder.items, (arr: Array<any>): void => { holder.items = arr; });
    holder.items = [{ a: 5 }, { a: 6 }];
    expect(source.read().length).toBe(2);
    expect(source.read()[0].a).toBe(5);
  });
});

describe("ArrayDynamicDataSource: element identity and fixed membership", () => {
  // An owner that writes back only the elements that changed (the fixed matrix) relies on this.
  test("update and batch keep the identity of every element they do not replace", () => {
    const first = { a: 1 };
    const second = { a: 2 };
    const third = { a: 3 };
    const source = ArrayDynamicDataSource.fromArray([first, second, third]);
    const replaced = { a: 22 };
    source.update(1, replaced);
    const afterUpdate = source.array;
    expect(afterUpdate[0] === first && afterUpdate[2] === third, "#1: update keeps the untouched elements").toBe(true);
    expect(afterUpdate[1] === replaced, "#1: and stores the new one as it is").toBe(true);
    const replacedAgain = { a: 33 };
    source.batch((): void => {
      source.update(2, replacedAgain);
      source.update(0, first);
    });
    const afterBatch = source.array;
    expect(afterBatch[0] === first && afterBatch[1] === replaced && afterBatch[2] === replacedAgain, "#2: a batch keeps them too").toBe(true);
  });
});
describe("ArrayDynamicDataSource: isBatching", () => {
  test("isBatching is true only inside a batch, a nested one included", () => {
    let local: Array<any> = [{ a: 1 }];
    const source = new ArrayDynamicDataSource((): Array<any> => local, (arr: Array<any>): void => { local = arr; });
    const isBatchOpen = (): boolean => source["isBatching"];
    const states: Array<boolean> = [isBatchOpen()];
    source.batch((): void => {
      states.push(isBatchOpen());
      source.batch((): void => { states.push(isBatchOpen()); });
      states.push(isBatchOpen());
    });
    states.push(isBatchOpen());
    expect(states, "#1").toEqual([false, true, true, true, false]);
    expect((() => {
      try {
        source.batch((): void => { throw new Error("stop"); });
      } catch(e) {
        return isBatchOpen();
      }
    })(), "#2: a batch that throws closes").toBe(false);
  });
});
describe("ArrayDynamicDataSource: count, readAt and the padding of an owner's minimum count", () => {
  interface IPaddedStore {
    stored: Array<any>;
    minCount: number;
    defaultCalls: number;
    writes: Array<Array<any>>;
    source: ArrayDynamicDataSource;
  }
  function createPadded(stored: Array<any>, minCount: number): IPaddedStore {
    const res: IPaddedStore = <any>{ stored: stored, minCount: minCount, defaultCalls: 0, writes: [] };
    res.source = new ArrayDynamicDataSource((): Array<any> => res.stored, (arr: Array<any>): void => { res.stored = arr; res.writes.push(arr); }, {
      getMinCount: (): number => res.minCount,
      getDefaultRecord: (): any => { res.defaultCalls++; return { d: 1 }; }
    });
    return res;
  }
  test("without options, read, count and readAt give the stored array, its length and its elements", () => {
    const stored = [{ a: 1 }, { a: 2 }];
    const source = new ArrayDynamicDataSource((): Array<any> => stored, (): void => { });
    expect(source.read() === stored, "#1").toBe(true);
    expect(source.count, "#2").toBe(2);
    expect(source.readAt(1) === stored[1], "#3").toBe(true);
    expect(source.readAt(2), "#4").toBeUndefined();
    expect(source.readAt(-1), "#5").toBeUndefined();
    expect(hasFixedMembership(source), "#6: it inserts").toBe(false);
    const empty = new ArrayDynamicDataSource((): Array<any> => <any>"not an array", (): void => { });
    expect(empty.count, "#7: a non-array value counts as empty").toBe(0);
  });
  test("read() returns the stored array when it is long enough, else a padded copy of distinct records", () => {
    const store = createPadded([{ a: 1 }, { a: 2 }], 2);
    expect(store.source.read() === store.stored, "#1: long enough, the array itself").toBe(true);
    expect(store.defaultCalls, "#2: no default record is asked for").toBe(0);
    store.minCount = 4;
    const records = store.source.read();
    expect(records === store.stored, "#3: a copy").toBe(false);
    expect(store.stored.length, "#4: the stored array is not changed").toBe(2);
    expect(records, "#5").toEqual([{ a: 1 }, { a: 2 }, { d: 1 }, { d: 1 }]);
    expect(records[0] === store.stored[0], "#6: the stored records themselves").toBe(true);
    expect(records[2] === records[3], "#7: the padded records are distinct copies").toBe(false);
    expect(store.defaultCalls, "#8: one default record per read").toBe(1);
    store.minCount = 1;
    expect(store.source.read() === store.stored, "#9: never truncated").toBe(true);
  });
  test("count is the stored length padded up to the minimum, readAt reads a padded position without composing", () => {
    const store = createPadded([{ a: 1 }], 3);
    expect(store.source.count, "#1").toBe(3);
    expect(store.source.readAt(0) === store.stored[0], "#2: a stored record").toBe(true);
    expect(store.defaultCalls, "#3: neither count nor a stored index asks for the default record").toBe(0);
    expect(store.source.readAt(1), "#4: a padded position, the default record").toEqual({ d: 1 });
    expect(store.defaultCalls, "#5").toBe(1);
    const shared = { s: 1 };
    expect(store.source.readAt(2, shared) === shared, "#6: the passed record, not a copy").toBe(true);
    expect(store.source.readAt(2, null), "#7: a passed null is a record too").toBeNull();
    expect(store.defaultCalls, "#8").toBe(1);
    expect(store.source.readAt(3), "#9: beyond count").toBeUndefined();
    expect(store.source.readAt(-1), "#10").toBeUndefined();
    store.stored = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
    expect(store.source.count, "#11: a longer array counts itself").toBe(4);
    expect(store.source.readAt(3), "#12").toEqual({ a: 4 });
  });
  test("a padding source without a default record pads with undefined", () => {
    const source = new ArrayDynamicDataSource((): Array<any> => [], (): void => { }, { getMinCount: (): number => 2 });
    expect(source.read(), "#1").toEqual([undefined, undefined]);
    expect(source.count, "#2").toBe(2);
    expect(source.readAt(1), "#3").toBeUndefined();
  });
  test("inside a batch, count and readAt follow the batch array without padding it again", () => {
    const store = createPadded([{ a: 1 }, { a: 2 }, { a: 3 }], 3);
    store.source.batch((): void => {
      store.source.remove(0);
      expect(store.source.count, "#1: the removal counts").toBe(2);
      expect(store.source.readAt(1), "#2").toEqual({ a: 3 });
      expect(store.source.readAt(2), "#3: not padded again").toBeUndefined();
      expect(store.source.read(), "#4").toEqual([{ a: 2 }, { a: 3 }]);
    });
    expect(store.writes.length, "#5: one write").toBe(1);
    expect(store.stored, "#6: the owner gets the two records").toEqual([{ a: 2 }, { a: 3 }]);
  });
  test("a batch starts from the padded array", () => {
    const store = createPadded([{ a: 1 }, { a: 2 }], 3);
    store.source.batch((): void => {
      expect(store.source.count, "#1").toBe(3);
      store.source.update(2, { a: 3 });
    });
    expect(store.stored, "#2: three records are stored").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
    store.minCount = 5;
    store.source.update(4, { a: 5 });
    expect(store.stored, "#3: a single write materializes the padding too").toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { d: 1 }, { a: 5 }]);
  });
  test("padRecords pads an array in place by the same rule", () => {
    const store = createPadded([], 3);
    const records = [{ a: 1 }];
    expect(store.source.padRecords(records) === records, "#1: the same array").toBe(true);
    expect(records, "#2").toEqual([{ a: 1 }, { d: 1 }, { d: 1 }]);
    expect(records[1] === records[2], "#3: distinct copies").toBe(false);
    const long = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
    store.source.padRecords(long);
    expect(long.length, "#4: never truncated").toBe(4);
  });
});
