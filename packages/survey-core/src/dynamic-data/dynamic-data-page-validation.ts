// No validation runs here: this file holds the duplicate grouping the records' uniqueness checks share
// (getDuplicateKey, groupByDuplicateKey, findDuplicatePages) and the page state a paged question hands
// to the ancestor that rebuilds it (IDynamicDataPageState). The page validation itself is question-side:
// RecordsPageValidation in question_records_page_validation.ts.
import { Helpers } from "../helpers";

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
  // A Date has no own keys: by content it would be "{}" whatever its time.
  if (value instanceof Date) return "d" + value.getTime();
  if (Array.isArray(value)) return "[" + value.map((item: any): string => getContentKey(item, caseSensitive)).join(",") + "]";
  if (!!value && typeof value === "object") {
    const keys = Object.keys(value).filter((key: string): boolean => value[key] !== undefined).sort();
    return "{" + keys.map((key: string): string => JSON.stringify(key) + ":" + getContentKey(value[key], caseSensitive)).join(",") + "}";
  }
  return value === undefined ? "undefined" : JSON.stringify(foldKeyText(value, caseSensitive));
}

/* The entries grouped by the duplicate key of their value (getDuplicateKey), in the order of their
   first entries; an empty value takes no part - empty as Base.isValueEmpty means it, so a
   whitespace-only string is empty - unless isEmpty decides it per entry. caseSensitive false folds
   strings with toLocaleLowerCase. One grouping for the duplicate check on the page and the scan off
   it. The groups are a Map: the keys are respondent input, and "__proto__" in a plain object is the
   prototype, not a group. */
export function groupByDuplicateKey<T>(entries: Array<T>, getValue: (entry: T) => any, caseSensitive: boolean,
  isEmpty?: (entry: T) => boolean): Array<Array<T>> {
  const groups = new Map<string, Array<T>>();
  entries.forEach((entry: T): void => {
    const val = getValue(entry);
    if (!!isEmpty ? isEmpty(entry) : Helpers.isValueEmpty(val, true)) return;
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
   gives the page of its latest visible record, and the check on that page marks every object of the
   group there. A group with no visible record gives no page: it has no record to put the error on.
   Returns the pages, without repeats. */
export function findDuplicatePages(list: { getVisibleIndexes(): Array<number>, getPageOfVisibleIndex(visibleIndex: number): number },
  indexes: Array<number>, readKey: (index: number) => any, caseSensitive: boolean): Array<number> {
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
