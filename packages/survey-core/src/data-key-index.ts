import type { ISurveyDataElement } from "./base-interfaces";
import type { Question } from "./question";
import type { PanelDataScope, IPanelDataScopeOwner } from "./panel-data-scope";
import { HashTable } from "./helpers";
import { settings } from "./settings";

// A data scope (decisions R6): the survey, the root, or an active PanelDataScope. Its elements' values are
// keys of its data, found through its index; getDataPath() gives the keys from the survey data down to it.
export interface IDataScope {
  getDataKeyIndex(): DataKeyIndex;
  getDataPath(): Array<string>;
  getValue(name: string): any;
  getComment(name: string): string;
  // The unknown-key rule (D6): clearIncorrectValues(true) keeps a known key, setData() reports another.
  isKnownKey(key: string): boolean;
}
// A key an element of the index owns, or a question's comment or totals key: the part of the unknown-key
// rule every scope shares.
export function isKnownDataKey(index: DataKeyIndex, key: string): boolean {
  if (index.getElements(key).length > 0) return true;
  return [settings.commentSuffix, settings.matrix.totalsSuffix].some(suffix =>
    !!suffix && key.endsWith(suffix) && index.getQuestions(key.substring(0, key.length - suffix.length)).length > 0);
}
// The scope of an index entry that is a container; null for a question.
export function getElementDataScope(el: ISurveyDataElement): PanelDataScope {
  return !el.isQuestion ? (<IPanelDataScopeOwner>el).getDataScope() : null;
}

const noElements: Array<any> = Object.freeze(<Array<any>>[]) as Array<any>;
// One kind of element under its keys, exact and lower-case. Null-prototype hashes (Bug#11858).
class DataKeyHash {
  private exact: HashTable<Array<ISurveyDataElement>> = Object.create(null);
  private lower: HashTable<Array<ISurveyDataElement>> = Object.create(null);
  // Whether el was not under key yet.
  public add(key: string, el: ISurveyDataElement): boolean {
    if (!DataKeyHash.addTo(this.exact, key, el)) return false;
    DataKeyHash.addTo(this.lower, key.toLowerCase(), el);
    return true;
  }
  // Whether el was under key.
  public remove(key: string, el: ISurveyDataElement): boolean {
    if (!DataKeyHash.removeFrom(this.exact, key, el)) return false;
    DataKeyHash.removeFrom(this.lower, key.toLowerCase(), el);
    return true;
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

// The keys of one data scope and the elements that own them (decisions R2): the questions whose value
// scope it is, under their value name, and the active containers directly inside it, under their key. Two
// elements may share a key (D4). A key is found exact or lower-case; for one key the questions come first.
// elements holds every element of the index once, in the order added. A scope's index is built by a walk, so
// its elements keep document order. The survey's root index is kept up element by element instead: its
// questions are added and removed one by one and, once a container nests, synced with the pages after the
// data shape changed, and its containers are added again after clearContainers() then; its elements are in
// the order added, not in document order.
export class DataKeyIndex {
  private questions = new DataKeyHash();
  private containers = new DataKeyHash();
  public readonly elements: Array<ISurveyDataElement> = [];
  // An element without a key is in elements only (a walk reaches a question with no name). An element already
  // under the key is not added again.
  public add(key: string, el: ISurveyDataElement): void {
    if (!!key && !this.getHash(el).add(key, el)) return;
    this.elements.push(el);
  }
  public remove(key: string, el: ISurveyDataElement): void {
    if (!!key && !this.getHash(el).remove(key, el)) return;
    const index = this.elements.indexOf(el);
    if (index > -1) {
      this.elements.splice(index, 1);
    }
  }
  public clearQuestions(): void {
    this.questions = new DataKeyHash();
    this.removeElements(true);
  }
  public clearContainers(): void {
    this.containers = new DataKeyHash();
    this.removeElements(false);
  }
  // In place: elements is read-only for the callers that hold it.
  private removeElements(isQuestion: boolean): void {
    const elements = this.elements;
    let count = 0;
    for (let i = 0; i < elements.length; i++) {
      if (!!elements[i].isQuestion !== isQuestion) elements[count++] = elements[i];
    }
    elements.length = count;
  }
  private getHash(el: ISurveyDataElement): DataKeyHash {
    return el.isQuestion ? this.questions : this.containers;
  }
  public getElements(key: string, caseInsensitive?: boolean): Array<ISurveyDataElement> {
    const questions = this.questions.get(key, caseInsensitive);
    const containers = this.containers.get(key, caseInsensitive);
    return containers.length === 0 ? questions : questions.concat(containers);
  }
  // The list as stored: read it, do not change it.
  public getQuestions(key: string, caseInsensitive?: boolean): Array<Question> {
    return <Array<Question>><any>this.questions.get(key, caseInsensitive);
  }
  public getScopes(key: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    return this.containers.get(key, caseInsensitive).map(el => getElementDataScope(el));
  }
}

// The one walk of a scope's elements (ObjectDataScope): add gets each element, with its key when withKeys is
// set (a question's getValueName() is the walk's main cost).
export type DataScopeWalk = (add: (el: ISurveyDataElement, key: string) => void, withKeys: boolean) => void;
// How a scope finds the elements of its keys. ObjectDataScope picks one of the two strategies below.
export interface IDataScopeLookup {
  getIndex(): DataKeyIndex;
  // The index's elements: read them, do not change them.
  getElements(): Array<ISurveyDataElement>;
  // The questions and the active scopes directly inside on a key, as new arrays.
  getQuestions(name: string, caseInsensitive?: boolean): Array<Question>;
  getScopes(name: string, caseInsensitive?: boolean): Array<PanelDataScope>;
}
// Walks on every read and builds no hashes for a lookup by key: a scope with no data shape version to cache
// an index by (a record item, a composite's content), which answers every {row.x} / {panel.x} this way.
export class WalkingDataScopeLookup implements IDataScopeLookup {
  constructor(private walk: DataScopeWalk) { }
  public getIndex(): DataKeyIndex {
    const res = new DataKeyIndex();
    this.walk((el: ISurveyDataElement, key: string): void => res.add(key, el), true);
    return res;
  }
  public getElements(): Array<ISurveyDataElement> {
    const res: Array<ISurveyDataElement> = [];
    this.walk((el: ISurveyDataElement): void => { res.push(el); }, false);
    return res;
  }
  public getQuestions(name: string, caseInsensitive?: boolean): Array<Question> {
    return <Array<Question>><any>this.getByKey(name, caseInsensitive, true);
  }
  public getScopes(name: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    return this.getByKey(name, caseInsensitive, false).map(el => getElementDataScope(el));
  }
  // One walk that compares the keys.
  private getByKey(name: string, caseInsensitive: boolean, isQuestion: boolean): Array<ISurveyDataElement> {
    const res: Array<ISurveyDataElement> = [];
    if (!name) return res;
    const key = caseInsensitive ? name.toLowerCase() : name;
    this.walk((el: ISurveyDataElement, elKey: string): void => {
      if (!!el.isQuestion === isQuestion && !!elKey && (caseInsensitive ? elKey.toLowerCase() : elKey) === key) res.push(el);
    }, true);
    return res;
  }
}
// Reads an index built by the walk and kept until the survey's data shape version changes (every write reads
// it, shape changes are rare). getVersion gives undefined without a survey host: the index is built on every
// read then.
export class IndexedDataScopeLookup implements IDataScopeLookup {
  private index: DataKeyIndex;
  private version: number;
  constructor(private walk: DataScopeWalk, private getVersion: () => number) { }
  public getIndex(): DataKeyIndex {
    const version = this.getVersion();
    if (!this.index || version === undefined || version !== this.version) {
      const res = new DataKeyIndex();
      this.walk((el: ISurveyDataElement, key: string): void => res.add(key, el), true);
      this.index = res;
      this.version = version;
    }
    return this.index;
  }
  public getElements(): Array<ISurveyDataElement> {
    return this.getIndex().elements;
  }
  public getQuestions(name: string, caseInsensitive?: boolean): Array<Question> {
    return this.getIndex().getQuestions(name, caseInsensitive).slice();
  }
  public getScopes(name: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    return this.getIndex().getScopes(name, caseInsensitive);
  }
}
