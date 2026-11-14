import type { IQuestion, IElement, IPanel, ISurvey, ISurveyImpl, ISurveyData, ISurveyDataElement, ITextProcessor } from "./base-interfaces";
import type { Base } from "./base";
import type { PanelModelBase } from "./panel";
import type { IExpressionVariableInfo } from "./survey";
import type { IObjectValueContext, IValueGetterContext } from "./conditions/conditionProcessValue";
import type { Question } from "./question";
import { Helpers } from "./helpers";
import { IDataScope, IDataKeys, DataKeyIndex, getElementDataScope, isKnownDataKey } from "./data-key-index";
import { ObjectKeyKind, asScopeObject, setObjectKey } from "./data-object-utils";
import { PanelDataScopeValueGetterContext } from "./data-scope-contexts";

// The nested-data module is split by what changes together:
//   data-nesting-key.ts: the dataNesting rule (getDataNestingKey);
//   data-key-index.ts: a scope's key index;
//   record-key-level.ts: the static keys of the records a template builds;
//   data-object-utils.ts: plain-object paths and the keep-empty rule;
//   data-scope-contexts.ts / data-scope-metadata.ts: the expression contexts and the design-time chain;
//   this file: the runtime scopes and the survey as their host.

// The panel or page that owns a scope. A type, not an import of PanelModelBase: panel.ts imports this file.
export interface IPanelDataScopeOwner extends ISurveyDataElement {
  getDataScopeKey(): string;
  getDataScope(): PanelDataScope;
  elements: Array<IElement>;
}
// The survey as the root data scope, and its members the nested-data code calls: SurveyModel implements them.
// They are not on ISurvey, so an ISurvey that is not a SurveyModel (a partial survey object in a test) needs
// none of them.
export interface ISurveyDataScopeHost extends IDataScope {
  readonly dataNesting: string;
  isDataScopeUsed(): boolean;
  dataScopeUsed(): void;
  dataScopeChanged(panel?: PanelModelBase): void;
  getNewGeneratedName(elements: Array<any>, baseName: string): string;
  getAllPanels(visibleOnly?: boolean, includeDesignTime?: boolean): Array<IPanel>;
  getQuestionByVariable(name: string, context?: Base): IExpressionVariableInfo;
  getExpressionVariableName(name: string): string;
}
// The survey as the host of its data scopes, or undefined for a survey object without the members. The only
// place that checks for them (isDataScopeUsed stands for all): a caller uses the optional chain and does
// nothing without a host.
export function getDataScopeHost(survey: ISurvey): ISurveyDataScopeHost {
  const host: any = survey;
  return !!host && typeof host.isDataScopeUsed === "function" ? <ISurveyDataScopeHost>host : undefined;
}
// The nearest active scope of an element's data, or null when its value is a key of the survey data (or of
// a record): SurveyElement.getValueScope().
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
// The survey whose data.keepEmptyValues decides for a value written through data (an element's ISurveyData,
// or a scope); null inside a record (a dynamic panel's item, a matrix row): a record item removes every empty
// value, and records are a survey-settings follow-up, so a nesting container or a composite inside one keeps
// none either. The walk goes up through the scopes and through a custom question (its content's data).
// Here and not with the object utilities: it tells the scopes apart.
export function getEmptyValuesSurvey(data: any, survey: ISurvey): ISurvey {
  while(data instanceof PanelDataScope || !!data && data.isQuestion === true) {
    data = data instanceof PanelDataScope ? data.parentData : data.data;
  }
  return data instanceof ObjectDataScope ? null : survey;
}

// The values of a group of elements kept as keys of one object: a question reads
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
  getValue(name: string): any {
    return this.getObjectKey(this.getObject(), name);
  }
  getComment(name: string): string {
    return this.getValue(Helpers.getCommentKey(name)) || "";
  }
  protected getObjectKey(obj: any, name: string): any {
    return !!obj ? Helpers.getUnbindValue(obj[name]) : undefined;
  }
  // The index of this scope's keys: its questions and the active containers directly inside it. Built by a
  // walk on every call: a caller that reads it more than once keeps it.
  public getDataKeyIndex(): DataKeyIndex {
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
  // The index's elements, by a walk that reads no keys.
  protected getIndexElements(): Array<ISurveyDataElement> {
    const res: Array<ISurveyDataElement> = [];
    this.walkScope((el: ISurveyDataElement): void => { res.push(el); }, false);
    return res;
  }
  // The index's questions on a key, and the active scopes directly inside this one on a key: one walk that
  // compares the keys, no hashes.
  protected getIndexQuestions(name: string, caseInsensitive?: boolean): Array<Question> {
    return <Array<Question>><any>this.getIndexElementsByKey(name, caseInsensitive, true);
  }
  protected getIndexScopes(name: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    return this.getIndexElementsByKey(name, caseInsensitive, false).map(el => getElementDataScope(el));
  }
  private getIndexElementsByKey(name: string, caseInsensitive: boolean, isQuestion: boolean): Array<ISurveyDataElement> {
    const res: Array<ISurveyDataElement> = [];
    if (!name) return res;
    const key = caseInsensitive ? name.toLowerCase() : name;
    this.walkScope((el: ISurveyDataElement, elKey: string): void => {
      if (!!el.isQuestion === isQuestion && !!elKey && (caseInsensitive ? elKey.toLowerCase() : elKey) === key) res.push(el);
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
  public get parentScope(): PanelDataScope {
    const data = this.parentData;
    return data instanceof PanelDataScope ? data : null;
  }
  // The one parent link: the scope whose object holds this scope's key. The nearest active scope above it, or
  // the record item it is inside (a dynamic panel's item, a matrix row: a root scope); null when the key is a
  // key of the survey data. A composite's content never reaches here yet: no panel inside a composite gets a
  // scope; once one does, the CompositeDataScope is its parent through the ObjectDataScope branch.
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
  // start at the record: ["address"]. A survey path would need the record's index, which a sort, a
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
    // here (allowed at runtime, a linter error) shares the container's object and gets its rule.
    const isContainer = Helpers.isValueEmpty(newValue) && this.getIndexScopes(name).length > 0;
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
    const question = this.getIndexQuestions(name)[0];
    // An empty comment key is removed whatever data.keepEmptyValues says, as SurveyModel.setComment does.
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
  public isKnownKey(key: string, index?: IDataKeys): boolean {
    return isKnownDataKey(index || this.getDataKeyIndex(), key);
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
