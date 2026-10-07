// The data half of the page validation: record remaps, duplicate keys and the page state. The class
// that validates the objects (DynamicDataPageValidation) is question-side: question_records_page_validation.ts.
import { Helpers } from "../helpers";
import { DynamicDataList } from "./dynamic-data-list";

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
function getRecordsRemapByKey(oldRecords: Array<any>, newRecords: Array<any>, keyField: string): (index: number) => number {
  const getKey = (record: any): any => !!record && typeof record === "object" ? record[keyField] : undefined;
  // A Map and not a plain object: the keys are data, and "__proto__" in an object is the prototype.
  const positions = new Map<any, number>();
  for (let i = 0; i < newRecords.length; i++) {
    const key = getKey(newRecords[i]);
    if (key === undefined || key === null || positions.has(key)) return undefined;
    positions.set(key, i);
  }
  const res = oldRecords.map((record: any): number => {
    const key = getKey(record);
    if (key === undefined || key === null) return undefined;
    return positions.has(key) ? positions.get(key) : -1;
  });
  return (index: number): number => index >= 0 && index < res.length ? res[index] : undefined;
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

/* The group key of a value the duplicate checks compare by: one String() key, so that 1 and "1" are
   one key, with strings folded by toLocaleLowerCase when the comparison is not case-sensitive. What
   is empty, and so takes no part, each check decides before it asks for the key. */
export function getDuplicateKey(value: any, caseSensitive: boolean): string {
  if (!caseSensitive && typeof value === "string") {
    value = value.toLocaleLowerCase();
  }
  return String(value);
}

/* The off-page half of a duplicate check (layer 2): the records are scanned without an object
   (O(records)) and grouped by String(value); a group of two or more gives the page of its latest
   visible record, which is where the error goes. A group with no visible record gives no page: it
   has no record to put the error on. Returns the pages, without repeats.
   The questions differ in which records take part and how values compare, and each call site spells
   its options out: includeHidden - owner-hidden records take part too (the matrix); includeFilteredOut -
   the records the filter excludes take part too, otherwise only the visible ones are scanned; caseSensitive -
   false folds strings with toLocaleLowerCase. Empty means what Base.isValueEmpty means: a
   whitespace-only string is empty. The groups are a Map: the keys are respondent input, and
   "__proto__" in a plain object is the prototype, not a group. */
export function findDuplicatePages(list: DynamicDataList, readKey: (index: number) => any,
  options: { caseSensitive: boolean, includeHidden: boolean, includeFilteredOut?: boolean }): Array<number> {
  const visiblePos: { [index: number]: number } = {};
  const visible = list.getVisibleIndexes();
  visible.forEach((index: number, pos: number): void => { visiblePos[index] = pos; });
  const groups = new Map<string, { count: number, target: number }>();
  const count = options.includeFilteredOut !== false ? list.loadedCount : visible.length;
  for (let j = 0; j < count; j++) {
    const i = options.includeFilteredOut !== false ? j : visible[j];
    if (!options.includeHidden && !list.isRecordVisible(i)) continue;
    const val = readKey(i);
    if (Helpers.isValueEmpty(typeof val === "string" ? val.trim() : val)) continue;
    const key = getDuplicateKey(val, options.caseSensitive);
    let group = groups.get(key);
    if (!group) {
      group = { count: 0, target: -1 };
      groups.set(key, group);
    }
    group.count++;
    const pos = visiblePos[i];
    if (pos !== undefined && pos > group.target) group.target = pos;
  }
  const pages: Array<number> = [];
  groups.forEach((group: { count: number, target: number }): void => {
    if (group.count < 2 || group.target < 0) return;
    const page = list.getPageOfVisibleIndex(group.target);
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
