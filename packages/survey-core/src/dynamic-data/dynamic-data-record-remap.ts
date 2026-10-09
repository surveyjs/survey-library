import { IDynamicDataListChange } from "./dynamic-data-interfaces";

/* A record index names a record only as long as nothing is inserted, removed or moved in front of
   it. Everything that keeps record indexes across the list's own writes - the frozen membership of
   the list, the objects of the questions, the edited set of layer 2 - renumbers them with these
   rules. The removed record maps to -1: a caller that keeps it drops it, one that holds an object
   for it marks the object as having no record. */

export function insertRemap(at: number): (index: number) => number {
  return (i: number): number => i >= at ? i + 1 : i;
}
export function removeRemap(index: number): (index: number) => number {
  return (i: number): number => i === index ? -1 : (i > index ? i - 1 : i);
}
export function moveRemap(from: number, to: number): (index: number) => number {
  return (i: number): number => {
    if (i === from) return to;
    if (from < i && i <= to) return i - 1;
    if (to <= i && i < from) return i + 1;
    return i;
  };
}
// undefined for a change that does not renumber records: recordChanged, reset, loading, pageChanged.
export function getRecordRemap(change: IDynamicDataListChange): (index: number) => number {
  if (change.type === "recordAdded") return insertRemap(change.index);
  if (change.type === "recordRemoved") return removeRemap(change.index);
  if (change.type === "recordMoved") return moveRemap(change.from, change.to);
  return undefined;
}
/* The part of a list change a question follows by record index: an edit marks the record edited, an
   insert, remove or move renumbers the question's own objects (remapObjects) and then the edited set.
   validation is the edited set of layer 2, when the question has one. */
export function applyRecordChange(change: IDynamicDataListChange,
  validation: { markEdited(index: number): void, onRecordRemap(remap: (index: number) => number): void },
  remapObjects: (remap: (index: number) => number) => void): void {
  if (change.type === "recordChanged") {
    if (!!validation) validation.markEdited(change.index);
    return;
  }
  const remap = getRecordRemap(change);
  if (!remap) return;
  remapObjects(remap);
  if (!!validation) validation.onRecordRemap(remap);
}
/* Where each old record is among the new ones, by key: getKey reads a record's key and normalizes it
   (the Multi-Select Matrix compares its row values as strings, a data source compares typed keys).
   Duplicates: byOccurrence pairs the n-th old record of a key with the n-th new one; otherwise there
   is no map (undefined) when two new records share a key or one has none, and the caller decides
   another way. A record whose key is gone maps to -1; an old record without a key, and an index out
   of range, to -1 by occurrence and to undefined otherwise. */
export function createKeyRemap(oldRecords: Array<any>, newRecords: Array<any>, getKey: (record: any) => any,
  byOccurrence: boolean): (index: number) => number {
  // A Map and not a plain object: the keys are data, and "__proto__" in an object is the prototype.
  const positions = new Map<any, Array<number>>();
  for (let i = 0; i < newRecords.length; i++) {
    const key = getKey(newRecords[i]);
    const isMissing = key === undefined || key === null;
    if (!byOccurrence && (isMissing || positions.has(key))) return undefined;
    if (isMissing) continue;
    if (!positions.has(key)) positions.set(key, []);
    positions.get(key).push(i);
  }
  const notFound = byOccurrence ? -1 : undefined;
  const occurrences = new Map<any, number>();
  const res = oldRecords.map((record: any): number => {
    const key = getKey(record);
    if (key === undefined || key === null) return notFound;
    const occurrence = byOccurrence && occurrences.has(key) ? occurrences.get(key) : 0;
    occurrences.set(key, occurrence + 1);
    const indexes = positions.get(key);
    return !!indexes && occurrence < indexes.length ? indexes[occurrence] : -1;
  });
  return (index: number): number => index >= 0 && index < res.length ? res[index] : notFound;
}
