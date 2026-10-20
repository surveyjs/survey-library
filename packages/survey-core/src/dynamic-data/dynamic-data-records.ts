import { Helpers } from "../helpers";
import { IDynamicDataReadResult } from "./dynamic-data-interfaces";

/* The record utilities of the data layer, also used by the questions: how two records compare, how an
   answer of a source is read, and when a record is empty. They hold no state and know no list,
   channel or question. */

/* The one comparison of the records: case-sensitive, strings not trimmed. It decides that a record
   changed (DynamicDataList.isValueChanged) and which of its fields did (getChangedFields), so a
   record never changes with no field listed. */
export function isRecordValueChanged(newValue: any, oldValue: any): boolean {
  return !Helpers.isTwoValueEquals(newValue, oldValue, false, true, false);
}
export function getChangedFields(oldRecord: any, newRecord: any): Array<string> {
  const res: Array<string> = [];
  const add = (key: string): void => {
    if (res.indexOf(key) < 0) res.push(key);
  };
  for (const key in oldRecord || {}) {
    if (isRecordValueChanged((newRecord || {})[key], (oldRecord || {})[key])) add(key);
  }
  for (const key in newRecord || {}) {
    if (isRecordValueChanged((newRecord || {})[key], (oldRecord || {})[key])) add(key);
  }
  return res;
}
/* The one place an answer is read: a bare array is { records: array }, and an answer that is neither
   an array nor an object with records holds no records. total and hasMore are passed on as they
   are - whether they mean anything is the reader's to decide.
   isCopied: a source may answer with the array it stores and change it later - a remove that splices
   it -, or the application may: the window takes a copy, so it never shifts under objects already
   built. The records are not copied: every write of the list copies the record it changes. A local
   source's array is not copied: it is the storage itself (DynamicDataList.takeStoredArray). */
export function toReadResult(data: any, isCopied: boolean = false): IDynamicDataReadResult {
  const records = Array.isArray(data) ? data : !!data && typeof data === "object" && Array.isArray(data.records) ? data.records : [];
  const res = !Array.isArray(data) && !!data && typeof data === "object" ? data : {};
  return { records: isCopied ? records.slice() : records, total: res.total, hasMore: res.hasMore };
}
export function createIndexes(count: number): Array<number> {
  const res = new Array<number>(count);
  for (let i = 0; i < count; i++) {
    res[i] = i;
  }
  return res;
}
/* The released rule of a row: a record is empty when it holds no value but undefined or null. One rule
   for an object and for a stored record without one (a cleared cell removes the row's key). */
export function isRecordEmpty(record: any): boolean {
  if (Helpers.isValueEmpty(record)) return true;
  for (const key in record) {
    if (record[key] !== undefined && record[key] !== null) return false;
  }
  return true;
}
