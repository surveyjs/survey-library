import type { ISurveyDataElement } from "./base-interfaces";
import type { Question } from "./question";
import type { PanelDataScope } from "./panel-data-scope";
import type { PanelModelBase } from "./panel";
import type { ElementIndex } from "./element-index";
import { HashTable } from "./helpers";
import { settings } from "./settings";
import { asScopeObject } from "./data-object-utils";

// A data scope: the survey, the root, or an active PanelDataScope. Its elements' values are
// keys of its data, found through its index; getDataPath() gives the keys from the survey data down to it.
export interface IDataScope {
  getDataKeyIndex(): ElementIndex;
  getDataPath(): Array<string>;
  getValue(name: string): any;
  getComment(name: string): string;
  // The unknown-key rule: clearIncorrectValues(true) keeps a known key, setData() reports another.
  isKnownKey(key: string): boolean;
  // The questions that hold the same value as question, question included: a scope that holds no data passes
  // the call on, in the end to the survey.
  getQuestionsSharingValue(question: Question): Array<Question>;
}
// A key an element of the index owns, or a question's comment or totals key: the part of the unknown-key
// rule every scope shares.
export function isKnownDataKey(index: ElementIndex, key: string): boolean {
  if (index.getElements(key).length > 0) return true;
  return [settings.commentSuffix, settings.matrix.totalsSuffix].some(suffix =>
    !!suffix && key.endsWith(suffix) && index.getQuestions(key.substring(0, key.length - suffix.length)).length > 0);
}
// One level of the keys of an object: a data scope (PanelDataScope, or the survey's own keys) or a records level
// (RecordKeyLevel). getInner gives the levels of a key that names inner levels: the containers on the key.
export interface IDataKeyLevel {
  getInner(key: string, caseInsensitive?: boolean): Array<IDataKeyLevel>;
  isKnownKey(key: string): boolean;
}
// The levels that share one key read as one: the inner levels on the key of all of them.
export function getInnerLevels<T>(levels: Array<{ getInner(key: string, caseInsensitive?: boolean): Array<T> }>, key: string, caseInsensitive?: boolean): Array<T> {
  const res: Array<T> = [];
  levels.forEach(level => res.push(...level.getInner(key, caseInsensitive)));
  return res;
}
// The keys of obj that no level knows, and inside the objects of the keys that name inner levels, at any depth.
// path: the keys from where the caller starts to obj; onUnknown gets the key's path, its value and the object
// that holds it. onInner, when given, goes down a key's object itself (walkInner) and may do something around
// it; the key's object is read when walkInner runs. Returns whether a key was unknown.
export function forEachUnknownKey(levels: Array<IDataKeyLevel>, obj: any, path: Array<string>,
  onUnknown: (path: Array<string>, value: any, owner: any) => void,
  onInner?: (path: Array<string>, owner: any, walkInner: () => boolean) => boolean): boolean {
  const owner = asScopeObject(obj);
  if (!owner) return false;
  let res = false;
  Object.keys(owner).forEach(key => {
    const inner = getInnerLevels(levels, key);
    if (inner.length > 0) {
      const keyPath = path.concat([key]);
      const walkInner = (): boolean => forEachUnknownKey(inner, owner[key], keyPath, onUnknown, onInner);
      const isChanged = !!onInner ? onInner(keyPath, owner, walkInner) : walkInner();
      res = res || isChanged;
    } else if (!levels.some(level => level.isKnownKey(key))) {
      res = true;
      onUnknown(path.concat([key]), owner[key], owner);
    }
  });
  return res;
}
export function getElementDataScope(el: ISurveyDataElement): PanelDataScope {
  return !el.isQuestion ? (<PanelModelBase>el).getDataScope() : null;
}
// The created choice panels of a select question or of a custom question's content question (getPanels() creates
// none), only those that share the question's data: a matrix cell's stay on the survey.
export function forEachChoicePanel(el: any, callback: (panel: PanelModelBase) => void): void {
  if (!el.isQuestion) return;
  const select = el.contentQuestion || el;
  if (typeof select.supportElementsInChoice !== "function" || !select.supportElementsInChoice()) return;
  select.getPanels().forEach((panel: PanelModelBase): void => {
    if ((panel.data || null) === (el.data || null)) callback(panel);
  });
}

const noElements: Array<any> = Object.freeze(<Array<any>>[]) as Array<any>;
// Elements under their keys, exact and lower-case: the names of an ElementIndex, or one kind of its keys.
// Null-prototype hashes (Bug#11858).
export class DataKeyHash<T = ISurveyDataElement> {
  private exact: HashTable<Array<T>> = Object.create(null);
  private lower: HashTable<Array<T>> = Object.create(null);
  // Whether el was not under key yet.
  public add(key: string, el: T): boolean {
    if (!DataKeyHash.addTo(this.exact, key, el)) return false;
    DataKeyHash.addTo(this.lower, key.toLowerCase(), el);
    return true;
  }
  // As add, at el's rank in each list: before the first element ranked after it. An undefined rank goes last.
  public insert(key: string, el: T, rank: (el: T) => number): void {
    if (!DataKeyHash.insertInto(this.exact, key, el, rank)) return;
    DataKeyHash.insertInto(this.lower, key.toLowerCase(), el, rank);
  }
  // The lower-case list is left alone when el is not under the exact key: another key may differ in case only.
  public remove(key: string, el: T): void {
    if (DataKeyHash.removeFrom(this.exact, key, el)) {
      DataKeyHash.removeFrom(this.lower, key.toLowerCase(), el);
    }
  }
  // Whether no key holds an element: a key whose last element is removed is deleted.
  public isEmpty(): boolean {
    return Object.keys(this.exact).length === 0;
  }
  // The list as stored, or a shared empty one: callers only read it.
  public get(key: string, caseInsensitive?: boolean): Array<T> {
    if (!key) return noElements;
    return (caseInsensitive ? this.lower[key.toLowerCase()] : this.exact[key]) || noElements;
  }
  private static addTo<T>(hash: HashTable<Array<T>>, key: string, el: T): boolean {
    const list = hash[key];
    if (!list) {
      hash[key] = [el];
      return true;
    }
    if (list.indexOf(el) > -1) return false;
    list.push(el);
    return true;
  }
  private static insertInto<T>(hash: HashTable<Array<T>>, key: string, el: T, rank: (el: T) => number): boolean {
    const list = hash[key];
    if (!list) {
      hash[key] = [el];
      return true;
    }
    if (list.indexOf(el) > -1) return false;
    const elRank = rank(el);
    let index = list.length;
    if (elRank !== undefined) {
      while(index > 0 && !(rank(list[index - 1]) <= elRank)) index--;
    }
    list.splice(index, 0, el);
    return true;
  }
  private static removeFrom<T>(hash: HashTable<Array<T>>, key: string, el: T): boolean {
    const list = hash[key];
    const index = !!list ? list.indexOf(el) : -1;
    if (index < 0) return false;
    list.splice(index, 1);
    if (list.length === 0) delete hash[key];
    return true;
  }
}
