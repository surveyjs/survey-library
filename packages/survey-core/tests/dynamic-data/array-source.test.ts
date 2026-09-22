import { describe, test, expect } from "vitest";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";

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
    source.insert(1, { a: 2 });
    const after = source.array;
    expect(after).not.toBe(before);
    expect(before.length).toBe(1);
    expect(after.map((r: any) => r.a)).toEqual([1, 2]);
  });
  test("insert at the start and out of range", () => {
    const source = ArrayDynamicDataSource.fromArray([{ a: 1 }]);
    source.insert(0, { a: 0 });
    source.insert(100, { a: 9 });
    source.insert(-5, { a: -1 });
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
    source.insert(1, { a: 2 });
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

describe("ArrayDynamicDataSource.count", () => {
  test("without a getCount callback count() is the length of one read", () => {
    let readCount = 0;
    const local = [{ a: 1 }, { a: 2 }];
    const source = new ArrayDynamicDataSource((): Array<any> => { readCount++; return local; }, (): void => { });
    expect(source.count(), "#1").toBe(source.read().length);
    readCount = 0;
    expect(source.count(), "#2").toBe(2);
    expect(readCount, "#3: one read per call").toBe(1);
  });
  test("with a getCount callback count() does not read, inside a batch it follows the batch array", () => {
    let readCount = 0;
    let local: Array<any> = [{ a: 1 }];
    const source = new ArrayDynamicDataSource((): Array<any> => { readCount++; return local; },
      (arr: Array<any>): void => { local = arr; }, (): number => 7);
    readCount = 0;
    expect(source.count(), "#1: the callback answers").toBe(7);
    expect(readCount, "#2").toBe(0);
    source.batch((): void => {
      source.insert(1, { a: 2 });
      expect(source.count(), "#3: the batch array").toBe(2);
    });
    expect(local.length, "#4").toBe(2);
  });
});
