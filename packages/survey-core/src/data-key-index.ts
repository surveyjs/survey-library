import type { ISurveyDataElement } from "./base-interfaces";
import type { Question } from "./question";
import type { PanelDataScope, IPanelDataScopeOwner } from "./panel-data-scope";
import { HashTable } from "./helpers";
import { settings } from "./settings";

// A data scope: the survey, the root, or an active PanelDataScope. Its elements' values are
// keys of its data, found through its index; getDataPath() gives the keys from the survey data down to it.
export interface IDataScope {
  getDataKeyIndex(): IDataKeys;
  getDataPath(): Array<string>;
  getValue(name: string): any;
  getComment(name: string): string;
  // The unknown-key rule: clearIncorrectValues(true) keeps a known key, setData() reports another. index: this
  // scope's index, when the caller has built it already.
  isKnownKey(key: string, index?: IDataKeys): boolean;
}
// A key an element of the index owns, or a question's comment or totals key: the part of the unknown-key
// rule every scope shares.
export function isKnownDataKey(index: IDataKeys, key: string): boolean {
  if (index.getElements(key).length > 0) return true;
  return [settings.commentSuffix, settings.matrix.totalsSuffix].some(suffix =>
    !!suffix && key.endsWith(suffix) && index.getQuestions(key.substring(0, key.length - suffix.length)).length > 0);
}
// The scope of an index entry that is a container; null for a question.
export function getElementDataScope(el: ISurveyDataElement): PanelDataScope {
  return !el.isQuestion ? (<IPanelDataScopeOwner>el).getDataScope() : null;
}

const noElements: Array<any> = Object.freeze(<Array<any>>[]) as Array<any>;
// Elements under their keys, exact and lower-case: one kind of a scope's index, or the survey's value-name
// hash of its questions. Null-prototype hashes (Bug#11858).
export class DataKeyHash {
  private exact: HashTable<Array<ISurveyDataElement>> = Object.create(null);
  private lower: HashTable<Array<ISurveyDataElement>> = Object.create(null);
  // Whether el was not under key yet.
  public add(key: string, el: ISurveyDataElement): boolean {
    if (!DataKeyHash.addTo(this.exact, key, el)) return false;
    DataKeyHash.addTo(this.lower, key.toLowerCase(), el);
    return true;
  }
  // The lower-case list is left alone when el is not under the exact key: another key may differ in case only.
  public remove(key: string, el: ISurveyDataElement): void {
    if (DataKeyHash.removeFrom(this.exact, key, el)) {
      DataKeyHash.removeFrom(this.lower, key.toLowerCase(), el);
    }
  }
  // The list as stored, or a shared empty one: callers only read it.
  public get(key: string, caseInsensitive?: boolean): Array<ISurveyDataElement> {
    if (!key) return noElements;
    return (caseInsensitive ? this.lower[key.toLowerCase()] : this.exact[key]) || noElements;
  }
  private static addTo(hash: HashTable<Array<ISurveyDataElement>>, key: string, el: ISurveyDataElement): boolean {
    const list = hash[key];
    if (!list) {
      hash[key] = [el];
      return true;
    }
    if (list.indexOf(el) > -1) return false;
    list.push(el);
    return true;
  }
  private static removeFrom(hash: HashTable<Array<ISurveyDataElement>>, key: string, el: ISurveyDataElement): boolean {
    const list = hash[key];
    const index = !!list ? list.indexOf(el) : -1;
    if (index < 0) return false;
    list.splice(index, 1);
    if (list.length === 0) delete hash[key];
    return true;
  }
}

// What a scope's keys give: the elements on a key, the questions on it, the active scopes directly inside on
// it. For one key the questions come first.
export interface IDataKeys {
  getElements(key: string, caseInsensitive?: boolean): Array<ISurveyDataElement>;
  // The list as stored: read it, do not change it.
  getQuestions(key: string, caseInsensitive?: boolean): Array<Question>;
  getScopes(key: string, caseInsensitive?: boolean): Array<PanelDataScope>;
}
// The keys of one data scope and the elements that own them, built by a walk of the scope: the questions
// whose value scope it is, under their value name, and the active containers directly inside it, under their
// key. Two elements may share a key: questions sharing a valueName, containers sharing one object, or a
// question and a container (allowed at runtime, a linter error). A key is found exact or lower-case.
// elements holds every element of the index once, in the order added: document order.
export class DataKeyIndex implements IDataKeys {
  private questions = new DataKeyHash();
  private containers = new DataKeyHash();
  public readonly elements: Array<ISurveyDataElement> = [];
  // An element without a key is in elements only (a walk reaches a question with no name). An element already
  // under the key is not added again.
  public add(key: string, el: ISurveyDataElement): void {
    if (!!key && !(el.isQuestion ? this.questions : this.containers).add(key, el)) return;
    this.elements.push(el);
  }
  public getElements(key: string, caseInsensitive?: boolean): Array<ISurveyDataElement> {
    const questions = this.questions.get(key, caseInsensitive);
    const containers = this.containers.get(key, caseInsensitive);
    return containers.length === 0 ? questions : questions.concat(containers);
  }
  public getQuestions(key: string, caseInsensitive?: boolean): Array<Question> {
    return <Array<Question>><any>this.questions.get(key, caseInsensitive);
  }
  public getScopes(key: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    return this.containers.get(key, caseInsensitive).map(el => getElementDataScope(el));
  }
}
