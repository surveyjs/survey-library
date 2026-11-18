import type { ISurveyDataElement } from "./base-interfaces";
import type { Question } from "./question";
import type { PanelDataScope } from "./panel-data-scope";
import type { PanelModelBase } from "./panel";
import type { ElementIndex } from "./element-index";
import { HashTable } from "./helpers";
import { settings } from "./settings";

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
  // the call on, in the end to the survey (SurveyRootDataScope.getQuestionsSharingValue).
  getQuestionsSharingValue(question: Question): Array<Question>;
}
// A key an element of the index owns, or a question's comment or totals key: the part of the unknown-key
// rule every scope shares.
export function isKnownDataKey(index: ElementIndex, key: string): boolean {
  if (index.getElements(key).length > 0) return true;
  return [settings.commentSuffix, settings.matrix.totalsSuffix].some(suffix =>
    !!suffix && key.endsWith(suffix) && index.getQuestions(key.substring(0, key.length - suffix.length)).length > 0);
}
// The scope of an index entry that is a container; null for a question.
export function getElementDataScope(el: ISurveyDataElement): PanelDataScope {
  return !el.isQuestion ? (<PanelModelBase>el).getDataScope() : null;
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
