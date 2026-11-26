import type { IQuestion, IElement, ISurvey, ISurveyImpl, ISurveyData, ISurveyDataElement, ITextProcessor } from "../base-interfaces";
import type { PanelModelBase } from "../panel";
import type { SurveyModel } from "../survey";
import type { IObjectValueContext, IValueGetterContext } from "../conditions/conditionProcessValue";
import type { Question } from "../question";
import { Helpers } from "../helpers";
import { IDataScope, IDataKeyLevel, getElementDataScope, isKnownDataKey, forEachChoicePanel } from "./data-key-index";
import { ElementIndex } from "./element-index";
import { ObjectKeyKind, asScopeObject, setObjectKey } from "./data-object-utils";
import { PanelDataScopeValueGetterContext } from "./data-scope-contexts";
import { INameScope, ElementKind, findElementInNameScope, isNameScopeMode, isQuestionElement } from "./name-scope";

// The nested-data module, split by what changes together: data-nesting-key.ts (the dataNesting rule),
// element-index.ts (a scope's key index), data-key-index.ts (the key hashes, IDataScope, the unknown-key rule),
// record-key-level.ts (the static keys of a template's records), data-object-utils.ts (plain-object paths, the
// keep-empty rule), data-scope-contexts.ts / data-scope-metadata.ts (the expression contexts, the design-time
// chain); this file: the runtime scopes and the survey as their host.

export function getDataScopeHost(survey: ISurvey): SurveyModel {
  return !!survey ? <SurveyModel>survey : undefined;
}
// The nearest active scope of an element's data; null when its value is a key of the survey data or of a record.
export function getActiveDataScope(data: any): PanelDataScope {
  return data instanceof PanelDataScope ? data.getActiveScope() : null;
}
// The root scope an element's data ends at: a record item (a dynamic panel's item, a matrix row), or
// null for the survey data.
export function getRecordDataScope(data: any): ObjectDataScope {
  while(data instanceof PanelDataScope) {
    data = data.parentData;
  }
  return data instanceof ObjectDataScope ? data : null;
}
// The scope whose instance holds an element with this data: the nearest active scope, the record item it is
// inside, or a composite's content scope; null for the root.
export function getKeyHolderScope(data: any): ObjectDataScope {
  const active = getActiveDataScope(data);
  if (!!active) return active;
  const record = getRecordDataScope(data);
  if (!!record) return record;
  return !!data && data.isQuestion === true && typeof data.getContentDataScope === "function" ? data.getContentDataScope() : null;
}
// The survey whose keepEmptyValues decides for a value written through data; null inside a record: a record item
// removes every empty value, so a nesting container or a composite inside one keeps none either.
export function getEmptyValuesSurvey(data: any, survey: ISurvey): ISurvey {
  while(data instanceof PanelDataScope || !!data && data.isQuestion === true) {
    data = data instanceof PanelDataScope ? data.parentData : data.data;
  }
  return data instanceof ObjectDataScope ? null : survey;
}

// The instance half of a data scope: the index of its keys (ElementIndex), built on the first read. ObjectDataScope
// adds the object half: the values as keys of one object. The survey's root (SurveyRootDataScope) keeps the root's
// keys, and the survey stays the root IDataScope.
export abstract class DataKeysScope implements IDataKeyLevel {
  protected abstract getScopeElements(): Array<IElement>;
  // Whether the scope holds this question's value (the walk reached it through panels that do not nest).
  protected abstract isScopeQuestion(q: Question): boolean;
  // The index of this scope's keys: its questions and the active containers directly inside it. An element appended
  // last is added in place; any other change of the scope's elements drops it, and the next read builds it again.
  private keyIndex: ElementIndex;
  public getDataKeyIndex(): ElementIndex {
    if (!this.keyIndex) {
      this.keyIndex = this.buildDataKeyIndex();
    }
    return this.keyIndex;
  }
  protected buildDataKeyIndex(): ElementIndex {
    const res = new ElementIndex();
    this.walkScope(res, this.getScopeElements());
    return res;
  }
  public resetDataKeyIndex(): void {
    this.keyIndex = undefined;
  }
  protected get builtDataKeyIndex(): ElementIndex {
    return this.keyIndex;
  }
  // The unknown-key rule (IDataScope): an element's key, a question's comment or totals key.
  public isKnownKey(key: string): boolean {
    return isKnownDataKey(this.getDataKeyIndex(), key);
  }
  // The active containers on a key.
  public getInner(key: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    return this.getDataKeyIndex().getScopes(key, caseInsensitive);
  }
  // The one walk of a scope's elements, in document order: the questions whose values it holds and the active
  // containers directly inside it. Every element it reaches is held by name too, the panels that hold no data
  // included. A select question's choice panels are walked right after it, as panels that do not nest: their
  // questions are keys of the scope that holds the select question.
  protected walkScope(index: ElementIndex, elements: Array<IElement>): void {
    const named = (el: ISurveyDataElement): void => {
      if (this.isScopeName(el)) index.add(<any>el);
    };
    const walk = (elements: Array<IElement>): void => {
      for (let i = 0; i < elements.length; i++) {
        const el: any = elements[i];
        if (el.isPanel || el.isPage) {
          const scope = (<PanelModelBase>el).getDataScope();
          named(el);
          if (!!scope && scope.isActive && this.isOwnDataScope(scope)) {
            index.addKeyed(scope.owner, scope.key);
          } else {
            walk(el.elements);
          }
        } else if (el.isQuestion && this.isScopeQuestion(<Question>el)) {
          named(el);
          index.addKeyed(<Question>el, (<Question>el).getValueName());
          forEachChoicePanel(el, (panel: any): void => walk(panel.elements));
        }
      }
    };
    walk(elements);
  }
  // Whether an active scope the walk reaches is one of this scope's keys: its parent active scope is this one.
  protected isOwnDataScope(scope: PanelDataScope): boolean {
    return scope.getParentActiveScope() === <any>this;
  }
  // A matrix row holds its cells by key, not by name: only its detail panel is a name scope.
  protected isScopeName(el: ISurveyDataElement): boolean {
    return true;
  }
  public dataKeyElementAdded(el: IElement): void {
    const index = this.keyIndex;
    if (!index) return;
    if (this.isLastScopeElement(el)) {
      this.walkScope(index, [el]);
    } else {
      this.resetDataKeyIndex();
    }
  }
  // Whether el comes after every other element of the scope in document order: it, and each panel above it up
  // to the scope's elements, is the last element of its parent.
  private isLastScopeElement(el: IElement): boolean {
    const top = this.getScopeElements();
    const last = top[top.length - 1];
    let cur: any = el;
    while(!!cur) {
      if (cur === last) return true;
      const parent = cur.parent;
      const elements = !!parent ? parent.elements : null;
      if (!elements || elements[elements.length - 1] !== cur) return false;
      cur = parent;
    }
    return false;
  }
  // The index's elements in order, copied: a callback may change the scope.
  protected getIndexElements(): Array<ISurveyDataElement> {
    return [].concat(this.getDataKeyIndex().elements);
  }
}

// The values of a group of elements kept as keys of one object: a question reads
// object[valueName], its comment object[valueName + commentSuffix]. PanelDataScope keeps the object under its
// key in its parent's data; a composite question keeps it as its value (CompositeDataScope, question_custom.ts); a
// record item (a dynamic panel's item, a matrix row) keeps it as its record (QuestionRecordItem, question_records.ts).
export abstract class ObjectDataScope extends DataKeysScope implements INameScope {
  protected abstract getObject(): any;
  getValue(name: string): any {
    return this.getObjectKey(this.getObject(), name);
  }
  getComment(name: string): string {
    return this.getValue(Helpers.getCommentKey(name)) || "";
  }
  protected getObjectKey(obj: any, name: string): any {
    return !!obj ? Helpers.getUnbindValue(obj[name]) : undefined;
  }
  public findOwnElement(name: string, isKind: ElementKind, caseInsensitive?: boolean, exactFirst?: boolean): any {
    return this.getDataKeyIndex().find(name, isKind, caseInsensitive, exactFirst);
  }
  // A question of this scope, by a bare name or a path of names below it.
  public findScopeQuestion(name: string): Question {
    return findElementInNameScope(this, name, isQuestionElement);
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

const noKeys = new ElementIndex();
// The data of the elements of a nesting panel or page: they read and write parentData.getValue(key)[name]. It
// composes over the parent's ISurveyData, so a container inside a container needs no special code. The scope is
// inactive (passes every call through to the parent) while the owner has no key: the owner keeps one scope once it
// has had a key, and switching nesting on or off does not re-attach its elements.
export class PanelDataScope extends ObjectDataScope implements ISurveyImpl, ISurveyData, IObjectValueContext, IDataScope {
  private parentImpl: ISurveyImpl;
  constructor(public readonly owner: PanelModelBase) {
    super();
  }
  // Read live: the owner's place is stored at attach, the rest is a property read.
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
  // The scope whose object holds this scope's key: the nearest active scope above it, or the record item it is
  // inside; null in the survey data. No panel in a composite gets a scope yet: its parent would be an ObjectDataScope.
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
  // ["page1", "address"]; inside a record from the record (["address"]): a survey path would need the record's
  // index, which a sort, a filter or a page changes.
  public getDataPath(): Array<string> {
    const parent = this.getParentActiveScope();
    const res = parent instanceof PanelDataScope ? parent.getDataPath() : [];
    if (this.isActive) res.push(this.key);
    return res;
  }
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
  setValue(name: string, newValue: any, locNotification: boolean | "text", allowNotifyValueChanged?: boolean, writer?: IQuestion): any {
    const data = this.parentData;
    if (!data) return;
    if (!this.isActive) return data.setValue(name, newValue, locNotification, allowNotifyValueChanged, writer);
    // The kind matters for an empty value only. By key: a question whose value name equals a container key
    // here (allowed at runtime, a linter error) shares the container's object and gets its rule.
    const isContainer = Helpers.isValueEmpty(newValue) && this.getDataKeyIndex().getScopes(name).length > 0;
    this.setObjectValue(name, newValue, isContainer ? "container" : "value", locNotification, allowNotifyValueChanged, writer);
  }
  private setObjectValue(name: string, newValue: any, kind: ObjectKeyKind, locNotification: boolean | "text", allowNotifyValueChanged: boolean, writer: IQuestion): void {
    const data = this.parentData;
    if (!data) return;
    // A copy of the stored object with one key changed: the scope never rebuilds it from its questions, so keys no
    // question owns (and another container's on the key) are kept. An empty object goes as is: the parent removes it.
    const survey = Helpers.isValueEmpty(newValue) ? getEmptyValuesSurvey(this, this.getSurvey()) : null;
    data.setValue(this.key, setObjectKey(this.getObject(), name, newValue, survey, kind), locNotification, allowNotifyValueChanged, writer);
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
    // A comment write reports the first question on the value name, as SurveyModel.setComment does.
    const question = this.getDataKeyIndex().getQuestions(name)[0];
    // An empty comment key is removed whatever keepEmptyValues says, as SurveyModel.setComment does.
    this.setObjectValue(Helpers.getCommentKey(name), newValue, "comment", locNotification, true, question);
  }
  getFilteredProperties(): any {
    return !!this.parentData ? this.parentData.getFilteredProperties() : {};
  }
  // A scope that holds data answers for its own questions first, by a bare name or a path below it; then the
  // scopes around it.
  findQuestionByName(name: string): IQuestion {
    if (this.isActive && isNameScopeMode(this.getSurvey())) {
      const res = this.findScopeQuestion(name);
      if (!!res) return res;
    }
    return !!this.parentData ? this.parentData.findQuestionByName(name) : null;
  }
  //IObjectValueContext
  // An inactive scope resolves as its parent does. An active one answers with its own questions and the
  // containers inside it first, then falls back to the parent.
  getValueGetterContext(): IValueGetterContext {
    if (this.isActive) return new PanelDataScopeValueGetterContext([this]);
    return this.getParentValueGetterContext();
  }
  public getParentValueGetterContext(): IValueGetterContext {
    return this.parentData?.getValueGetterContext();
  }
  // The stored object, as an expression reads it.
  public getObjectValue(): any {
    const data = this.parentData;
    return !!data ? data.getValue(this.key) : undefined;
  }
  // The root answers from the question's data path: two containers on one key share their object.
  public getQuestionsSharingValue(question: Question): Array<Question> {
    return getDataScopeHost(this.getSurvey())?.getQuestionsSharingValue(question) || [];
  }
  // An inactive scope holds no keys and keeps no instance: its elements are its active parent's. The shared empty
  // instance is only read.
  public getDataKeyIndex(): ElementIndex {
    if (this.isActive) return super.getDataKeyIndex();
    this.resetDataKeyIndex();
    return noKeys;
  }
  protected getScopeElements(): Array<IElement> {
    return this.isActive ? this.owner.elements : [];
  }
  protected isScopeQuestion(q: Question): boolean {
    return q.getValueScope() === this;
  }
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
