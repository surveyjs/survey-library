import { IDynamicDataListChange } from "./dynamic-data-interfaces";
import { isRecordValueChanged } from "./dynamic-data-channel";

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
/* How the records of an array assigned from outside map onto the records it replaced: a sibling on
   the same valueName inserted, removed or moved one, or changed one in place. The common prefix and
   suffix stay where they are (the suffix shifted by the count difference); inside the part that
   changed a single record changed in place keeps its index, removed records map to -1, and a record
   moved from one end of that part to the other follows it. Anything else maps to undefined: the
   caller treats every record of the changed part as its own (a superset is safe - it only costs a
   validation more).
   keyField: the records name themselves (a keyed data source). A record then maps to wherever its
   key is now, whatever else moved, and to -1 when its key is gone; a record without a key maps to
   undefined. When the new records cannot be looked up by key - one has none, or two share one - the
   content comparison above decides instead. */
export function getReplacedRecordsRemap(oldRecords: Array<any>, newRecords: Array<any>, keyField?: string): (index: number) => number {
  const byKey = !!keyField ? getRecordsRemapByKey(oldRecords, newRecords, keyField) : undefined;
  return byKey || getRecordsRemapByContent(oldRecords, newRecords);
}
// Typed keys: 1 and "1" are two records.
function getRecordsRemapByKey(oldRecords: Array<any>, newRecords: Array<any>, keyField: string): (index: number) => number {
  return createKeyRemap(oldRecords, newRecords, (record: any): any => !!record && typeof record === "object" ? record[keyField] : undefined, false);
}
function getRecordsRemapByContent(oldRecords: Array<any>, newRecords: Array<any>): (index: number) => number {
  const oldLen = oldRecords.length;
  const newLen = newRecords.length;
  const isSame = (a: any, b: any): boolean => !isRecordValueChanged(a, b);
  let prefix = 0;
  while(prefix < oldLen && prefix < newLen && isSame(oldRecords[prefix], newRecords[prefix])) prefix++;
  let suffix = 0;
  while(suffix < oldLen - prefix && suffix < newLen - prefix &&
    isSame(oldRecords[oldLen - 1 - suffix], newRecords[newLen - 1 - suffix])) suffix++;
  const oldMid = oldLen - prefix - suffix;
  const newMid = newLen - prefix - suffix;
  const delta = newLen - oldLen;
  const isRangeSame = (oldFrom: number, newFrom: number, length: number): boolean => {
    for (let i = 0; i < length; i++) {
      if (!isSame(oldRecords[oldFrom + i], newRecords[newFrom + i])) return false;
    }
    return true;
  };
  let movedToEnd = false;
  let movedToStart = false;
  if (oldMid === newMid && oldMid > 1) {
    const last = prefix + oldMid - 1;
    movedToEnd = isSame(oldRecords[prefix], newRecords[last]) && isRangeSame(prefix + 1, prefix, oldMid - 1);
    movedToStart = !movedToEnd && isSame(oldRecords[last], newRecords[prefix]) && isRangeSame(prefix, prefix + 1, oldMid - 1);
  }
  return (index: number): number => {
    // Not a record of the old array - a row the matrix padded it with: there is nothing to place.
    if (index < 0 || index >= oldLen) return undefined;
    if (index < prefix) return index;
    if (index >= oldLen - suffix) return index + delta;
    if (newMid === 0) return -1;
    if (oldMid === 1 && newMid === 1) return prefix;
    const last = prefix + oldMid - 1;
    if (movedToEnd) return index === prefix ? last : index - 1;
    if (movedToStart) return index === last ? prefix : index + 1;
    return undefined;
  };
}
