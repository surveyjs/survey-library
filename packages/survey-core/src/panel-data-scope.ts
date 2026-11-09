import type { IQuestion, IElement, ISurvey, ISurveyImpl, ISurveyData, ISurveyDataElement, ITextProcessor } from "./base-interfaces";
import type { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo } from "./conditions/conditionProcessValue";
import { ValueGetterContextCore } from "./conditions/conditionProcessValue";
import type { Question } from "./question";
import { Helpers, HashTable } from "./helpers";
import { settings } from "./settings";

// The dataNesting modes that nest a container without a valueName under its name, and the container
// kinds each applies to (decisions N3).
const byNameModes: { [mode: string]: Array<string> } = {
  panel: ["panel"],
  page: ["page"],
  panelAndPage: ["panel", "page"]
};
// The rule of decisions N3: the key a container stores its elements' values under, or "" when it does
// not nest. kind is "panel" or "page", "record" for a panel inside a dynamic panel's or a detail panel's
// record, "" for a container that never nests (the single-page container, a record panel itself, a
// composite's content).
//   "none": never; "auto" (and an unknown mode): under valueName;
//   "panel" / "page" / "panelAndPage": under valueName, else name for the containers of that kind.
// No by-name mode lists "record": inside a record only an explicit valueName nests (RN3). Where a container
// is, is the owner's: PanelModelBase.getDataScopeKey().
export function getDataNestingKey(dataNesting: string, kind: string, valueName: string, name: string): string {
  if (dataNesting === "none" || !kind) return "";
  if (!!valueName) return valueName;
  const kinds = byNameModes[dataNesting];
  return !!kinds && kinds.indexOf(kind) > -1 ? name || "" : "";
}

// The panel or page that owns a scope. A type, not an import of PanelModelBase: panel.ts imports this file.
export interface IPanelDataScopeOwner extends ISurveyDataElement {
  getDataScopeKey(): string;
  getDataScope(): PanelDataScope;
  elements: Array<IElement>;
}
// The survey's counter of data shape changes (SurveyModel.getDataShapeVersion()): an index built at one
// version is current until the counter changes.
interface IDataShapeVersionOwner {
  getDataShapeVersion(): number;
}
function getDataShapeVersion(survey: ISurvey): number {
  const owner: any = survey;
  return !!owner && typeof owner.getDataShapeVersion === "function" ? (<IDataShapeVersionOwner>owner).getDataShapeVersion() : undefined;
}
// The nearest active scope of an element's data, or null when its value is a key of the survey data (or of
// a record): SurveyElement.getValueScope().
export function getActiveDataScope(data: any): PanelDataScope {
  return data instanceof PanelDataScope ? data.getActiveScope() : null;
}
// The root scope an element's data ends at: a record item (a dynamic panel's item, a matrix row, RN1), or
// null for the survey data.
export function getRecordDataScope(data: any): ObjectDataScope {
  while(data instanceof PanelDataScope) {
    data = data.parentData;
  }
  return data instanceof ObjectDataScope ? data : null;
}
// The survey whose data.keepEmptyValues decides for a value written through data (an element's ISurveyData,
// or a scope); null inside a record (a dynamic panel's item, a matrix row): a record item removes every empty
// value, and records are a survey-settings follow-up, so a nesting container or a composite inside one keeps
// none either. The walk goes up through the scopes and through a custom question (its content's data).
export function getEmptyValuesSurvey(data: any, survey: ISurvey): ISurvey {
  while(data instanceof PanelDataScope || !!data && data.isQuestion === true) {
    data = data instanceof PanelDataScope ? data.parentData : data.data;
  }
  return data instanceof ObjectDataScope ? null : survey;
}
// Whether an element's data is a record item itself (not a scope inside one).
export function isRecordData(data: any): boolean {
  return data instanceof ObjectDataScope && !(data instanceof PanelDataScope);
}
// A key's value as a scope's object: an object, not an array; undefined for another value.
export function asScopeObject(val: any): any {
  return !!val && typeof val === "object" && !Array.isArray(val) ? val : undefined;
}
// The scope of an index entry that is a container; null for a question.
export function getElementDataScope(el: ISurveyDataElement): PanelDataScope {
  return !el.isQuestion ? (<IPanelDataScopeOwner>el).getDataScope() : null;
}

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

const noElements: Array<any> = Object.freeze(<Array<any>>[]) as Array<any>;
// One kind of element under its keys, exact and lower-case. Null-prototype hashes (Bug#11858).
class DataKeyHash {
  private exact: HashTable<Array<ISurveyDataElement>> = Object.create(null);
  private lower: HashTable<Array<ISurveyDataElement>> = Object.create(null);
  public add(key: string, el: ISurveyDataElement): void {
    DataKeyHash.addTo(this.exact, key, el);
    DataKeyHash.addTo(this.lower, key.toLowerCase(), el);
  }
  public remove(key: string, el: ISurveyDataElement): void {
    DataKeyHash.removeFrom(this.exact, key, el);
    DataKeyHash.removeFrom(this.lower, key.toLowerCase(), el);
  }
  // The list as stored, or a shared empty one: callers only read it.
  public get(key: string, caseInsensitive?: boolean): Array<ISurveyDataElement> {
    if (!key) return noElements;
    return (caseInsensitive ? this.lower[key.toLowerCase()] : this.exact[key]) || noElements;
  }
  private static addTo(hash: HashTable<Array<ISurveyDataElement>>, key: string, el: ISurveyDataElement): void {
    const list = hash[key];
    if (!list) {
      hash[key] = [el];
    } else if (list.indexOf(el) < 0) {
      list.push(el);
    }
  }
  private static removeFrom(hash: HashTable<Array<ISurveyDataElement>>, key: string, el: ISurveyDataElement): void {
    const list = hash[key];
    const index = !!list ? list.indexOf(el) : -1;
    if (index < 0) return;
    list.splice(index, 1);
    if (list.length === 0) delete hash[key];
  }
}

// The keys of one data scope and the elements that own them (decisions R2): the questions whose value
// scope it is, under their value name, and the active containers directly inside it, under their key. Two
// elements may share a key (D4). A key is found exact or lower-case; for one key the questions come first.
// A scope's index is built by a walk (add): elements keeps document order. The survey's root index uses
// addKey only and leaves elements empty: its questions are added and removed one by one (removeKey), its
// containers are added again after clearContainers() once the data shape changed.
export class DataKeyIndex {
  private questions = new DataKeyHash();
  private containers = new DataKeyHash();
  public readonly elements: Array<ISurveyDataElement> = [];
  public add(key: string, el: ISurveyDataElement): void {
    this.elements.push(el);
    this.addKey(key, el);
  }
  public addKey(key: string, el: ISurveyDataElement): void {
    if (!key) return;
    this.getHash(el).add(key, el);
  }
  public removeKey(key: string, el: ISurveyDataElement): void {
    if (!key) return;
    this.getHash(el).remove(key, el);
  }
  public clearQuestions(): void {
    this.questions = new DataKeyHash();
  }
  public clearContainers(): void {
    this.containers = new DataKeyHash();
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

// The keys of one level of the records a template builds (RN3): its questions under their value names and its
// nesting panels under their keys (PanelModelBase.getRecordDataNestingKey), each with the level of its own
// keys. Built from the elements whatever they are attached to: a dynamic panel's template, a matrix's detail
// panel template, or the panel of one record. The owner-level rules of the records read it.
export class RecordKeyLevel {
  public readonly index = new DataKeyIndex();
  private levels = new Map<ISurveyDataElement, RecordKeyLevel>();
  constructor(elements: Array<IElement>) {
    this.addElements(elements);
  }
  private addElements(elements: Array<IElement>): void {
    (elements || []).forEach((el: any): void => {
      if (el.isPanel) {
        const key = el.getRecordDataNestingKey();
        if (!key) {
          this.addElements(el.elements);
        } else {
          this.index.add(key, el);
          this.levels.set(el, new RecordKeyLevel(el.elements));
        }
      } else if (el.isQuestion) {
        this.index.add(el.getValueName(), el);
      }
    });
  }
  // The levels of the nesting panels on a key: panels sharing a key share its object (D4).
  public getLevels(key: string, caseInsensitive?: boolean): Array<RecordKeyLevel> {
    return this.index.getElements(key, caseInsensitive).filter(el => !el.isQuestion).map(el => this.levels.get(el));
  }
  public getQuestion(key: string, caseInsensitive?: boolean): Question {
    return this.index.getQuestions(key, caseInsensitive)[0] || undefined;
  }
  public isKnownKey(key: string): boolean {
    return isKnownDataKey(this.index, key);
  }
  // The paths of the keys no element of the levels knows inside the objects of obj's nesting keys:
  // [["address", "foo"]]. obj's own keys are the owner's rule (isRecordKeyUnknown).
  public getNestedUnknownPaths(obj: any): Array<Array<string>> {
    const res: Array<Array<string>> = [];
    const collect = (levels: Array<RecordKeyLevel>, val: any, path: Array<string>): void => {
      const inner = asScopeObject(val);
      if (!inner) return;
      Object.keys(inner).forEach(key => {
        const next: Array<RecordKeyLevel> = [];
        levels.forEach(level => next.push(...level.getLevels(key)));
        if (next.length > 0) {
          collect(next, inner[key], path.concat([key]));
        } else if (!levels.some(level => level.isKnownKey(key))) {
          res.push(path.concat([key]));
        }
      });
    };
    const record = asScopeObject(obj);
    if (!!record) {
      Object.keys(record).forEach(key => {
        const levels = this.getLevels(key);
        if (levels.length > 0) collect(levels, record[key], [key]);
      });
    }
    return res;
  }
}
// Whether a panel among the elements, at any depth, nests in the records built from them (RN3).
export function hasRecordDataNesting(elements: Array<IElement>): boolean {
  return (elements || []).some((el: any): boolean => el.isPanel && (!!el.getRecordDataNestingKey() || hasRecordDataNesting(el.elements)));
}
// Removes the keys at the paths from obj, in place, copying the objects on the way; an object that becomes
// empty goes too (D6).
export function deleteObjectPaths(obj: any, paths: Array<Array<string>>): void {
  paths.forEach(path => {
    const objects: Array<any> = [obj];
    let cur = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const next = asScopeObject(cur[path[i]]);
      if (!next) return;
      cur = cur[path[i]] = Object.assign({}, next);
      objects.push(cur);
    }
    delete cur[path[path.length - 1]];
    for (let i = objects.length - 1; i > 0; i--) {
      if (Object.keys(objects[i]).length > 0) break;
      delete objects[i - 1][path[i - 1]];
    }
  });
}

// What a key of an object holds, for data.keepEmptyValues (decisions K1-K3): "value" a question's value,
// "comment" a comment key (never kept, K2), "container" the object of a nesting container inside (K3).
export type ObjectKeyKind = "value" | "comment" | "container";
// K3: with data.keepEmptyValues on, a container's object is removed only when it has no keys left. One that
// still has keys stays, even deep empty ({ street: "" }) and in a system clear. undefined when the rule does
// not apply (no survey, the key off, or the value is no object): the caller's own rule decides. The survey asks
// it for a root container's key, an outer scope for the key of a container inside it.
export function isContainerObjectKept(survey: ISurvey, value: any): boolean {
  const obj = asScopeObject(value);
  if (!obj || !survey || !survey.getSettings().data.keepEmptyValues) return undefined;
  return Object.keys(obj).length > 0;
}
function isEmptyObjectKeyKept(value: any, survey: ISurvey, kind: ObjectKeyKind): boolean {
  if (!survey || kind === "comment") return false;
  const kept = kind === "container" ? isContainerObjectKept(survey, value) : undefined;
  return kept !== undefined ? kept : survey.isEmptyValueKept(value);
}
// A copy of obj with one key set, or removed when the value is empty. The other keys are kept, including keys
// no question owns. With a survey, an empty value stays when the survey keeps it (data.keepEmptyValues, K1);
// without one (no survey, a record) every empty value is removed.
export function setObjectKey(obj: any, name: string, value: any, survey?: ISurvey, kind: ObjectKeyKind = "value"): any {
  const res = Object.assign({}, obj);
  if (Helpers.isValueEmpty(value) && !isEmptyObjectKeyKept(value, survey, kind)) {
    delete res[name];
  } else {
    res[name] = Helpers.getUnbindValue(value);
  }
  return res;
}

// The values of a group of elements kept as keys of one object (decisions N8): a question reads
// object[valueName], its comment object[valueName + commentSuffix]. PanelDataScope keeps the object under its
// key in its parent's data; a composite question keeps it as its value (CompositeDataScope, question_custom.ts); a
// record item (a dynamic panel's item, a matrix row) keeps it as its record (QuestionRecordItem, question_records.ts).
export abstract class ObjectDataScope {
  // The object as stored, or undefined when there is none.
  protected abstract getObject(): any;
  // The elements the index walk starts from.
  protected abstract getScopeElements(): Array<IElement>;
  // Whether the object holds this question's value (the walk reached it through panels that do not nest).
  protected abstract isScopeQuestion(q: Question): boolean;
  // The survey's data shape version: an index built at one version is current until the version changes.
  // undefined builds the index on every read.
  protected getIndexVersion(): number {
    return undefined;
  }
  getValue(name: string): any {
    return this.getObjectKey(this.getObject(), name);
  }
  getComment(name: string): string {
    return this.getValue(Helpers.getCommentKey(name)) || "";
  }
  protected getObjectKey(obj: any, name: string): any {
    return !!obj ? Helpers.getUnbindValue(obj[name]) : undefined;
  }
  private indexValue: DataKeyIndex;
  private indexVersion: number;
  // The index of this scope's keys: its questions and the active containers directly inside it.
  public getDataKeyIndex(): DataKeyIndex {
    const version = this.getIndexVersion();
    if (!this.indexValue || version === undefined || version !== this.indexVersion) {
      this.indexValue = this.buildIndex();
      this.indexVersion = version;
    }
    return this.indexValue;
  }
  private buildIndex(): DataKeyIndex {
    const res = new DataKeyIndex();
    this.walkScope((el: ISurveyDataElement, key: string): void => res.add(key, el), true);
    return res;
  }
  // The questions whose values this scope's object holds (directly, or through panels that do not nest)
  // and the active containers directly inside it: the one walk of a container's elements, in document order.
  // withKeys: add gets each element's key (a question's getValueName() is the walk's main cost).
  private walkScope(add: (el: ISurveyDataElement, key: string) => void, withKeys: boolean): void {
    const walk = (elements: Array<IElement>): void => {
      for (let i = 0; i < elements.length; i++) {
        const el: any = elements[i];
        if (el.isPanel) {
          const scope = (<IPanelDataScopeOwner>el).getDataScope();
          if (!!scope && scope.isActive && scope.getParentActiveScope() === <any>this) {
            add(scope.owner, withKeys ? scope.key : undefined);
          } else {
            walk(el.elements);
          }
        } else if (el.isQuestion && this.isScopeQuestion(<Question>el)) {
          add(<Question>el, withKeys ? (<Question>el).getValueName() : undefined);
        }
      }
    };
    walk(this.getScopeElements());
  }
  // The index's elements. A scope whose index is rebuilt on every read (no version) walks without building
  // the key hashes: the loops read the elements only.
  protected getIndexElements(): Array<ISurveyDataElement> {
    if (this.getIndexVersion() !== undefined) return this.getDataKeyIndex().elements;
    const res: Array<ISurveyDataElement> = [];
    this.walkScope((el: ISurveyDataElement): void => { res.push(el); }, false);
    return res;
  }
  // The index's questions on a key, as a new array. A scope with no version compares the keys during one walk
  // and builds no hashes: a record item answers every {row.x} / {panel.x} this way.
  protected getIndexQuestions(name: string, caseInsensitive?: boolean): Array<Question> {
    if (this.getIndexVersion() !== undefined) return this.getDataKeyIndex().getQuestions(name, caseInsensitive).slice();
    const res: Array<Question> = [];
    if (!name) return res;
    const key = caseInsensitive ? name.toLowerCase() : name;
    this.walkScope((el: ISurveyDataElement, elKey: string): void => {
      if (el.isQuestion && !!elKey && (caseInsensitive ? elKey.toLowerCase() : elKey) === key) res.push(<Question>el);
    }, true);
    return res;
  }
  // The active scopes directly inside this one on a key. A scope with no version compares the keys during one
  // walk, as getIndexQuestions does.
  protected getIndexScopes(name: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    if (this.getIndexVersion() !== undefined) return this.getDataKeyIndex().getScopes(name, caseInsensitive);
    const res: Array<PanelDataScope> = [];
    if (!name) return res;
    const key = caseInsensitive ? name.toLowerCase() : name;
    this.walkScope((el: ISurveyDataElement, elKey: string): void => {
      if (!el.isQuestion && !!elKey && (caseInsensitive ? elKey.toLowerCase() : elKey) === key) res.push(getElementDataScope(el));
    }, true);
    return res;
  }
  // The questions read their values from the stored object again; the scopes inside follow.
  public updateValuesFromData(): void {
    this.updateValuesFrom(this.getObject());
  }
  // The questions read their values from obj; the scopes inside read theirs from obj's key, by this scope's
  // rule (updateQuestionFrom): a record pushed into its questions reaches the questions of its nesting panels.
  public updateValuesFrom(obj: any): void {
    this.updateValuesFromCore(obj, this);
  }
  private updateValuesFromCore(obj: any, updater: ObjectDataScope): void {
    this.getIndexElements().forEach(el => {
      const inner = getElementDataScope(el);
      if (!!inner) {
        inner.updateValuesFromCore(asScopeObject(!!obj ? obj[inner.key] : undefined), updater);
      } else {
        updater.updateQuestionFrom(<Question>el, obj);
      }
    });
  }
  protected updateQuestionFrom(q: Question, obj: any): void {
    const valueName = q.getValueName();
    const val = this.getObjectKey(obj, valueName);
    if (!this.isScopeValueEqual(q.value, val)) {
      q.updateValueFromSurvey(val, false);
    }
    if (q.requireUpdateCommentValue) {
      const comment = this.getObjectKey(obj, Helpers.getCommentKey(valueName)) || "";
      if (!this.isScopeValueEqual(q.comment, comment)) {
        q.updateCommentFromSurvey(comment);
      }
    }
  }
  public notifyValueChanged(): void {
    this.notifyValueChangedFrom(this.getObject());
  }
  // Each question gets onSurveyValueChanged with its key of obj; the scopes inside notify from their own
  // stored objects.
  public notifyValueChangedFrom(obj: any): void {
    this.getIndexElements().forEach(el => {
      const inner = getElementDataScope(el);
      if (!!inner) {
        inner.notifyValueChanged();
      } else {
        el.onSurveyValueChanged(this.getObjectKey(obj, el.getValueName()));
      }
    });
  }
  // The questions of this scope and of the scopes inside it, in document order.
  public forEachQuestion(callback: (q: Question) => void): void {
    this.getIndexElements().forEach(el => {
      const inner = getElementDataScope(el);
      if (!!inner) {
        inner.forEachQuestion(callback);
      } else {
        callback(<Question>el);
      }
    });
  }
  // Not isTwoValueEquals: a matrix row (a record item, question_records.ts) has its own rule under that name.
  protected isScopeValueEqual(x: any, y: any): boolean {
    return Helpers.checkIfValuesEqual(x, y, { ignoreOrder: false, caseSensitive: true, trimStrings: false, doNotConvertNumbers: true });
  }
}

// The data of the elements of a nesting panel or page: they read and write parentData.getValue(key)[name].
// It composes over the parent's ISurveyData (the survey or the scope of an outer container), so a
// container inside a container needs no special code.
// The scope is inactive (passes every call through to the parent) while the owner has no key (no
// valueName, dataNesting "none", or a by-name mode that does not apply to it): the owner keeps one scope
// once it has had a key, and switching nesting on or off does not re-attach its elements.
export class PanelDataScope extends ObjectDataScope implements ISurveyImpl, ISurveyData, IObjectValueContext, IDataScope {
  private parentImpl: ISurveyImpl;
  constructor(public readonly owner: IPanelDataScopeOwner) {
    super();
  }
  public get key(): string {
    return this.owner.getDataScopeKey();
  }
  public get isActive(): boolean {
    return !!this.key;
  }
  public setParent(impl: ISurveyImpl): void {
    this.parentImpl = impl;
  }
  public get parentData(): ISurveyData {
    return !!this.parentImpl ? this.parentImpl.getSurveyData() : null;
  }
  public get parentScope(): PanelDataScope {
    const data = this.parentData;
    return data instanceof PanelDataScope ? data : null;
  }
  // The one parent link (RN2): the scope whose object holds this scope's key. The nearest active scope above
  // it, or the record item it is inside (a dynamic panel's item, a matrix row: a root scope, RN1); null when
  // the key is a key of the survey data. Prompt 11's step 2 (a composite's content) plugs in here.
  public getParentActiveScope(): ObjectDataScope {
    const data: any = this.parentData;
    if (data instanceof PanelDataScope) return data.isActive ? data : data.getParentActiveScope();
    return data instanceof ObjectDataScope ? data : null;
  }
  // The scope whose object holds the values of this scope's questions: this one, or the nearest
  // active one above it. Null when the values are keys of the survey data or of a record.
  public getActiveScope(): PanelDataScope {
    if (this.isActive) return this;
    const parent = this.getParentActiveScope();
    return parent instanceof PanelDataScope ? parent : null;
  }
  // The keys from the survey data down to this scope's object: ["page1", "address"]. Inside a record they
  // start at the record (RN4): ["address"]. A survey path would need the record's index, which a sort, a
  // filter or a page changes.
  public getDataPath(): Array<string> {
    const parent = this.getParentActiveScope();
    const res = parent instanceof PanelDataScope ? parent.getDataPath() : [];
    if (this.isActive) res.push(this.key);
    return res;
  }
  // The scope's object as stored, or undefined when the key holds no object.
  protected getObject(): any {
    const data = this.parentData;
    if (!data) return undefined;
    return asScopeObject(data.getValue(this.key));
  }
  //ISurveyImpl
  getSurveyData(): ISurveyData {
    return this;
  }
  getSurvey(): ISurvey {
    return !!this.parentImpl ? this.parentImpl.getSurvey() : null;
  }
  getTextProcessor(): ITextProcessor {
    return !!this.parentImpl ? this.parentImpl.getTextProcessor() : null;
  }
  //ISurveyData
  getValue(name: string): any {
    if (!this.isActive) return !!this.parentData ? this.parentData.getValue(name) : undefined;
    return super.getValue(name);
  }
  setValue(name: string, newValue: any, locNotification: boolean | "text", allowNotifyValueChanged?: boolean, questionName?: string): any {
    const data = this.parentData;
    if (!data) return;
    if (!this.isActive) return data.setValue(name, newValue, locNotification, allowNotifyValueChanged, questionName);
    // The kind matters for an empty value only. By key: a question whose value name equals a container key
    // here (D4, a linter error) shares the container's object and gets its rule.
    const isContainer = Helpers.isValueEmpty(newValue) && this.getDataKeyIndex().getScopes(name).length > 0;
    this.setObjectValue(name, newValue, isContainer ? "container" : "value", locNotification, allowNotifyValueChanged, questionName);
  }
  private setObjectValue(name: string, newValue: any, kind: ObjectKeyKind, locNotification: boolean | "text", allowNotifyValueChanged: boolean, questionName: string): void {
    const data = this.parentData;
    if (!data) return;
    // A copy of the stored object with one key changed: the scope never rebuilds the object from its
    // questions, so keys no question owns (and the keys of another container with the same key) are kept.
    // An empty object is written as is: the survey (or the outer scope) removes an empty value.
    const survey = Helpers.isValueEmpty(newValue) ? getEmptyValuesSurvey(this, this.getSurvey()) : null;
    data.setValue(this.key, setObjectKey(this.getObject(), name, newValue, survey, kind), locNotification, allowNotifyValueChanged, questionName);
  }
  getComment(name: string): string {
    if (!this.isActive) return !!this.parentData ? this.parentData.getComment(name) : "";
    return super.getComment(name);
  }
  setComment(name: string, newValue: string, locNotification: boolean | "text"): any {
    if (!this.isActive) {
      const data = this.parentData;
      return !!data ? data.setComment(name, newValue, locNotification) : undefined;
    }
    if (this.getComment(name) === (newValue || "")) return;
    const question = this.getDataKeyIndex().getQuestions(name)[0];
    // K2: an empty comment key is removed whatever data.keepEmptyValues says, as SurveyModel.setComment does.
    this.setObjectValue(Helpers.getCommentKey(name), newValue, "comment", locNotification, true, !!question ? question.name : undefined);
  }
  getFilteredProperties(): any {
    return !!this.parentData ? this.parentData.getFilteredProperties() : {};
  }
  findQuestionByName(name: string): IQuestion {
    return !!this.parentData ? this.parentData.findQuestionByName(name) : null;
  }
  //IObjectValueContext
  // An inactive scope resolves as its parent does. An active one answers with its own questions and the
  // containers inside it first, then falls back to the parent (design-01 1.1).
  getValueGetterContext(): IValueGetterContext {
    if (this.isActive) return new PanelDataScopeValueGetterContext([this]);
    return this.getParentValueGetterContext();
  }
  public getParentValueGetterContext(): IValueGetterContext {
    const data: any = this.parentData;
    return !!data && typeof data.getValueGetterContext === "function" ? data.getValueGetterContext() : undefined;
  }
  // The stored object, as an expression reads it.
  public getObjectValue(): any {
    const data = this.parentData;
    return !!data ? data.getValue(this.key) : undefined;
  }
  public isKnownKey(key: string): boolean {
    return isKnownDataKey(this.getDataKeyIndex(), key);
  }
  // The index of this active scope's keys is built on its first read after the survey's data shape changed
  // (SurveyModel.dataShapeChanged()): shape changes are rare, and every write reads it.
  protected getIndexVersion(): number {
    return getDataShapeVersion(this.getSurvey());
  }
  protected getScopeElements(): Array<IElement> {
    return this.isActive ? this.owner.elements : [];
  }
  protected isScopeQuestion(q: Question): boolean {
    return q.getValueScope() === this;
  }
  // The survey calls updateValuesFromData() and notifyValueChanged() for a root-level scope after its key is
  // written (through the container's ISurveyDataElement members).
  // Whether the question's value is in this scope's object, directly or in the object of a scope inside it.
  public containsQuestion(question: Question): boolean {
    let scope: ObjectDataScope = getActiveDataScope(question.data);
    while(scope instanceof PanelDataScope) {
      if (scope === this) return true;
      scope = scope.getParentActiveScope();
    }
    return false;
  }
}

// The name step of a context over the keys of one data level, ignoring letter case: a question of the level
// (by value name; an empty question still answers), then an inner level (by key), then, for a comment key
// ({kind-Comment}), the comment a question of the level stores. The metadata mode (getQuestionByVariable)
// gives the question instead of the comment. A scope's context (PanelDataScopeValueGetterContext) and a
// records template's level (RecordKeyLevelValueGetterContext) share it.
abstract class DataLevelValueGetterContext extends ValueGetterContextCore {
  protected isSearchNameRevert(): boolean { return true; }
  protected abstract findQuestion(name: string): Question;
  protected abstract findInnerContext(name: string): IValueGetterContext;
  protected abstract getCommentValue(owner: Question): any;
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    const postfix = settings.expressionVariables.unwrapPostfix;
    if (!!postfix && name.endsWith(postfix)) {
      name = name.substring(0, name.length - postfix.length);
      if (res.isMetadata) res.isUnwrapped = true;
    }
    const question = this.findQuestion(name);
    if (!!question) {
      res.isFound = true;
      res.obj = question;
      res.context = question.getValueGetterContext();
      return;
    }
    const inner = this.findInnerContext(name);
    if (!!inner) {
      res.isFound = true;
      res.context = inner;
      return;
    }
    const baseName = getNameOfCommentName(name);
    const owner = !!baseName ? this.findQuestion(baseName) : null;
    if (!!owner) {
      // The stored comment, as a top-level {q-Comment} reads the raw data key; the metadata mode names the
      // question instead.
      res.isFound = true;
      if (res.isMetadata) {
        res.obj = owner;
        res.isComment = true;
        return;
      }
      res.value = this.getCommentValue(owner);
    }
  }
}

// The expression context of the active scopes that share one key (D4, one scope unless two containers
// share it), with DataLevelValueGetterContext's name step. A path with no items left ({address}) gives the
// stored object.
// As an inner element's context (the scope's getValueGetterContext) an unanswered name falls back to the
// parent's context through getRootObj; reached through a path from outside ({address.street}) it answers
// the rest of the path only, and the survey falls back to the raw data.
export class PanelDataScopeValueGetterContext extends DataLevelValueGetterContext {
  constructor(private scopes: Array<PanelDataScope>) {
    super();
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    if (params.path.length === 0) return { isFound: true, value: this.scopes[0].getObjectValue(), context: this };
    return super.getValue(params);
  }
  getRootObj(): IObjectValueContext {
    return <IObjectValueContext><any>this.scopes[0].parentData;
  }
  // The changed names a write reports, as the parent's context gives them: inside a record, the record's
  // (QuestionRecordItemGetterContext.getContextKeys), so an inner question's {street} re-runs on a write of the
  // record. The survey's context gives none.
  getContextKeys(keys?: any): { [key: string]: any } {
    const root = this.getRootObj();
    const ctx = !!root && typeof root.getValueGetterContext === "function" ? root.getValueGetterContext() : undefined;
    return !!ctx && typeof ctx.getContextKeys === "function" ? ctx.getContextKeys(keys) : {};
  }
  // The scopes' indexes, letter case ignored: a question of the first scope that has one wins.
  protected findQuestion(name: string): Question {
    for (let i = 0; i < this.scopes.length; i++) {
      const res = this.scopes[i].getDataKeyIndex().getQuestions(name, true);
      if (res.length > 0) return res[0];
    }
    return null;
  }
  protected findInnerContext(name: string): IValueGetterContext {
    const inner: Array<PanelDataScope> = [];
    this.scopes.forEach(scope => inner.push(...scope.getDataKeyIndex().getScopes(name, true)));
    return inner.length > 0 ? new PanelDataScopeValueGetterContext(inner) : undefined;
  }
  protected getCommentValue(owner: Question): any {
    return owner.getValueScope().getValue(Helpers.getCommentKey(owner.getValueName()));
  }
}
// The levels a records template's nesting panels build (RecordKeyLevel), as an expression context of the
// metadata mode at design time: a template's nesting panel has no scope (place "template"), so its keys come
// from the template's elements. It holds no values. rootObj: where an unanswered name goes on to.
export class RecordKeyLevelValueGetterContext extends DataLevelValueGetterContext {
  constructor(private levels: Array<RecordKeyLevel>, private rootObj?: IObjectValueContext) {
    super();
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    if (params.path.length === 0) return { isFound: true, value: undefined, context: this };
    return super.getValue(params);
  }
  getRootObj(): IObjectValueContext {
    return this.rootObj;
  }
  protected findQuestion(name: string): Question {
    for (let i = 0; i < this.levels.length; i++) {
      const res = this.levels[i].getQuestion(name, true);
      if (!!res) return res;
    }
    return null;
  }
  protected findInnerContext(name: string): IValueGetterContext {
    const inner: Array<RecordKeyLevel> = [];
    this.levels.forEach(level => inner.push(...level.getLevels(name, true)));
    return inner.length > 0 ? new RecordKeyLevelValueGetterContext(inner) : undefined;
  }
  protected getCommentValue(owner: Question): any {
    return undefined;
  }
}
// The metadata mode's start context of an element inside a records template (design time): the element's own
// context, then the levels of the template's nesting panels around it, innermost first, then the template's
// record, then the records question's own metadata context (an outer template's levels come after an inner
// template's record). A matrix's detail panel template has no data: the matrix's design row stands for its
// record. A matrix column goes on to its matrix's metadata context. The element's own context otherwise.
// A panel's own expressions run in its parent's scope, so its levels start at its parent; a template panel's
// own expressions run in its record.
export function getMetadataValueGetterContext(el: any): IValueGetterContext {
  const cxt: IValueGetterContext = el.getValueGetterContext();
  if (!!el.colOwner) return withOwnerRoot(cxt, el.colOwner);
  const template = isTemplatePanel(el) ? el : getRecordTemplatePanel(el);
  if (!template) return cxt;
  const chain = getRecordTemplateKeyLevels(el, template);
  const record: IObjectValueContext = !el.data ? getDesignRecordObj(template) : (el.isQuestion ?
    (!!cxt && !!cxt.getRootObj ? cxt.getRootObj() : undefined) : { getValueGetterContext: () => cxt });
  let root: IObjectValueContext = !record ? record :
    { getValueGetterContext: () => withOwnerRoot(record.getValueGetterContext(), template.getRecordsOwner()) };
  for (let i = chain.length - 1; i >= 0; i--) {
    const levels = chain[i];
    const next = root;
    root = { getValueGetterContext: () => new RecordKeyLevelValueGetterContext(levels, next) };
  }
  const first = root;
  if (!el.isQuestion || !cxt) return !!first ? first.getValueGetterContext() : cxt;
  return { getValue: params => cxt.getValue(params), getRootObj: () => first };
}
// A context that goes on, when a name is not found, to the owner's metadata context: each step moves to a
// records question strictly outside the template, so the chain ends at the survey.
function withOwnerRoot(cxt: IValueGetterContext, owner: any): IValueGetterContext {
  if (!cxt || !owner) return cxt;
  return { getValue: params => cxt.getValue(params),
    getRootObj: () => ({ getValueGetterContext: () => getMetadataValueGetterContext(owner) }) };
}
function isTemplatePanel(panel: any): boolean {
  return !!panel && typeof panel.isRecordTemplatePanel === "function" && panel.isRecordTemplatePanel();
}
// The records template around an element, or null.
function getRecordTemplatePanel(el: any): any {
  let panel = el.parent;
  while(!!panel && !isTemplatePanel(panel)) panel = panel.parent;
  return panel || null;
}
// The record of a template with no data (a matrix's detail panel template): the matrix's design row.
function getDesignRecordObj(template: any): IObjectValueContext {
  const owner: any = template.getRecordsOwner();
  if (!owner || typeof owner.getDesignRowContext !== "function") return undefined;
  return { getValueGetterContext: () => owner.getDesignRowContext() };
}
// The levels of the template's nesting panels around an element, innermost first; empty when no panel around
// it nests in the records.
function getRecordTemplateKeyLevels(el: any, template: any): Array<Array<RecordKeyLevel>> {
  const panels: Array<any> = [];
  let panel = el === template ? null : el.parent;
  while(!!panel && panel !== template) {
    panels.unshift(panel);
    panel = panel.parent;
  }
  const res: Array<Array<RecordKeyLevel>> = [];
  let levels = [new RecordKeyLevel(template.elements)];
  for (let i = 0; i < panels.length && levels.length > 0; i++) {
    const key = panels[i].getRecordDataNestingKey();
    if (!key) continue;
    const next: Array<RecordKeyLevel> = [];
    levels.forEach(level => next.push(...level.getLevels(key)));
    levels = next;
    if (levels.length > 0) res.unshift(levels);
  }
  return res;
}
// The value name a comment key names, ignoring letter case ({Kind-comment} -> "Kind"); "" for another name.
export function getNameOfCommentName(name: string): string {
  const suffix = settings.commentSuffix;
  if (!suffix || name.length <= suffix.length) return "";
  return name.toLowerCase().endsWith(suffix.toLowerCase()) ? name.substring(0, name.length - suffix.length) : "";
}
