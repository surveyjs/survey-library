// The data half of the page validation: record remaps, duplicate keys and the page state. The class
// that validates the objects (DynamicDataPageValidation) is question-side: question_records_page_validation.ts.
import { Helpers } from "../helpers";
import { DynamicDataList } from "./dynamic-data-list";
import { createKeyRemap } from "./dynamic-data-record-remap";

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
  const isSame = (a: any, b: any): boolean => !DynamicDataList.isValueChanged(a, b);
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

/* The group key of a value the duplicate checks compare by, in two namespaces that never meet. A
   scalar is one String() key, so that 1 and "1" are one key; an object or an array is keyed by its
   content - object keys sorted, array items in order. Strings are folded by toLocaleLowerCase when
   the comparison is not case-sensitive. The keys only group values in memory. What is empty, and so
   takes no part, each check decides before it asks for the key. */
export function getDuplicateKey(value: any, caseSensitive: boolean): string {
  if (!!value && typeof value === "object") return "o" + getContentKey(value, caseSensitive);
  return "s" + String(foldKeyText(value, caseSensitive));
}
function foldKeyText(value: any, caseSensitive: boolean): any {
  return !caseSensitive && typeof value === "string" ? value.toLocaleLowerCase() : value;
}
function getContentKey(value: any, caseSensitive: boolean): string {
  if (Array.isArray(value)) return "[" + value.map((item: any): string => getContentKey(item, caseSensitive)).join(",") + "]";
  if (!!value && typeof value === "object") {
    const keys = Object.keys(value).filter((key: string): boolean => value[key] !== undefined).sort();
    return "{" + keys.map((key: string): string => JSON.stringify(key) + ":" + getContentKey(value[key], caseSensitive)).join(",") + "}";
  }
  return value === undefined ? "undefined" : JSON.stringify(foldKeyText(value, caseSensitive));
}

/* The entries grouped by the duplicate key of their value (getDuplicateKey), in the order of their
   first entries; an empty value takes no part - empty as Base.isValueEmpty means it, so a
   whitespace-only string is empty. caseSensitive false folds strings with toLocaleLowerCase. One
   grouping for the duplicate check on the page and the scan off it. The groups are a Map: the keys
   are respondent input, and "__proto__" in a plain object is the prototype, not a group. */
export function groupByDuplicateKey<T>(entries: Array<T>, getValue: (entry: T) => any, caseSensitive: boolean): Array<Array<T>> {
  const groups = new Map<string, Array<T>>();
  entries.forEach((entry: T): void => {
    const val = getValue(entry);
    if (Helpers.isValueEmpty(typeof val === "string" ? val.trim() : val)) return;
    const key = getDuplicateKey(val, caseSensitive);
    let group = groups.get(key);
    if (!group) {
      group = [];
      groups.set(key, group);
    }
    group.push(entry);
  });
  const res: Array<Array<T>> = [];
  groups.forEach((group: Array<T>): void => { res.push(group); });
  return res;
}
/* The off-page half of a duplicate check (layer 2): the records that take part (indexes, as the
   question names them) are scanned without an object (O(records)) and grouped; a group of two or more
   gives the page of its latest visible record, which is where the error goes. A group with no visible
   record gives no page: it has no record to put the error on. Returns the pages, without repeats. */
export function findDuplicatePages(list: DynamicDataList, indexes: Array<number>, readKey: (index: number) => any,
  caseSensitive: boolean): Array<number> {
  const visiblePos: { [index: number]: number } = {};
  list.getVisibleIndexes().forEach((index: number, pos: number): void => { visiblePos[index] = pos; });
  const pages: Array<number> = [];
  groupByDuplicateKey(indexes, readKey, caseSensitive).forEach((group: Array<number>): void => {
    if (group.length < 2) return;
    let target = -1;
    group.forEach((index: number): void => {
      const pos = visiblePos[index];
      if (pos !== undefined && pos > target) target = pos;
    });
    if (target < 0) return;
    const page = list.getPageOfVisibleIndex(target);
    if (pages.indexOf(page) < 0) pages.push(page);
  });
  return pages;
}

/* What a paged question hands to the ancestor that rebuilds the object holding it, and gets back
   when that object is created again for the same outer record: the records edited and not validated
   yet, the page it was on, and - one level down - the same for the paged questions nested in its own
   records. It belongs to the records and not to the object, so it has to outlive the object. */
export interface IDynamicDataPageState {
  pageIndex: number;
  edited: Array<number>;
  nested: { [recordIndex: number]: { [valueName: string]: IDynamicDataPageState } };
}
