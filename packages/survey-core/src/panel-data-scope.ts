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
// not nest. kind is "panel" or "page" ("" for a container that never nests, the single-page container).
//   "none": never; "auto" (and an unknown mode): under valueName;
//   "panel" / "page" / "panelAndPage": under valueName, else name for the containers of that kind.
// The records rule (N5) is the owner's: PanelModelBase.getDataScopeKey().
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
// The question's data scope: the nearest active scope above it, or null when its value is a top-level
// key of the survey data. The one test of an inner question (nested data).
export function getQuestionDataScope(question: IQuestion): PanelDataScope {
  const data: any = (<any>question).data;
  return data instanceof PanelDataScope ? data.getActiveScope() : null;
}
// The scope of an index entry that is a container; null for a question.
export function getElementDataScope(el: ISurveyDataElement): PanelDataScope {
  return !el.isQuestion ? (<IPanelDataScopeOwner>el).getDataScope() : null;
}

// The keys of one data scope and the elements that own them (decisions R2): the questions whose data is
// the scope, under their value name, and the active containers directly inside it, under their key. Two
// elements may share a key (D4). A key is found exact or lower-case; elements keeps document order.
export class DataKeyIndex {
  private exact: HashTable<Array<ISurveyDataElement>> = Object.create(null);
  private lower: HashTable<Array<ISurveyDataElement>> = Object.create(null);
  public readonly elements: Array<ISurveyDataElement> = [];
  public add(key: string, el: ISurveyDataElement): void {
    this.elements.push(el);
    if (!key) return;
    DataKeyIndex.addToHash(this.exact, key, el);
    DataKeyIndex.addToHash(this.lower, key.toLowerCase(), el);
  }
  private static addToHash(hash: HashTable<Array<ISurveyDataElement>>, key: string, el: ISurveyDataElement): void {
    const list = hash[key];
    if (!!list) {
      list.push(el);
    } else {
      hash[key] = [el];
    }
  }
  public getElements(key: string, caseInsensitive?: boolean): Array<ISurveyDataElement> {
    if (!key) return [];
    const res = caseInsensitive ? this.lower[key.toLowerCase()] : this.exact[key];
    return res || [];
  }
  public getQuestions(key: string, caseInsensitive?: boolean): Array<Question> {
    return <Array<Question>><any>this.getElements(key, caseInsensitive).filter(el => el.isQuestion);
  }
  public getScopes(key: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    const res: Array<PanelDataScope> = [];
    this.getElements(key, caseInsensitive).forEach(el => {
      const scope = getElementDataScope(el);
      if (!!scope) res.push(scope);
    });
    return res;
  }
}

// The data of the elements of a nesting panel or page: they read and write parentData.getValue(key)[name].
// It composes over the parent's ISurveyData (the survey or the scope of an outer container), so a
// container inside a container needs no special code.
// The scope is inactive (passes every call through to the parent) while the owner has no key (no
// valueName, dataNesting "none", or a by-name mode that does not apply to it): the owner keeps one scope
// once it has had a key, and switching nesting on or off does not re-attach its elements.
export class PanelDataScope implements ISurveyImpl, ISurveyData, IObjectValueContext {
  private parentImpl: ISurveyImpl;
  constructor(public readonly owner: IPanelDataScopeOwner) { }
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
  // The scope whose object holds the values of this scope's questions: this one, or the nearest
  // active one above it. Null when the values are top-level keys of the survey data.
  public getActiveScope(): PanelDataScope {
    if (this.isActive) return this;
    const parent = this.parentScope;
    return !!parent ? parent.getActiveScope() : null;
  }
  // The keys from the survey data down to this scope's object: ["page1", "address"].
  public getDataPath(): Array<string> {
    const parent = this.parentScope;
    const res = !!parent ? parent.getDataPath() : [];
    if (this.isActive) res.push(this.key);
    return res;
  }
  // The scope's object as stored, or undefined when the key holds no object.
  private getObject(): any {
    const data = this.parentData;
    if (!data) return undefined;
    const val = data.getValue(this.key);
    return !!val && typeof val === "object" && !Array.isArray(val) ? val : undefined;
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
    const obj = this.getObject();
    return !!obj ? Helpers.getUnbindValue(obj[name]) : undefined;
  }
  setValue(name: string, newValue: any, locNotification: boolean | "text", allowNotifyValueChanged?: boolean, questionName?: string): any {
    const data = this.parentData;
    if (!data) return;
    if (!this.isActive) return data.setValue(name, newValue, locNotification, allowNotifyValueChanged, questionName);
    // A copy of the stored object with one key changed: the scope never rebuilds the object from its
    // questions, so keys no question owns (and the keys of another container with the same key) are kept.
    const obj = Object.assign({}, this.getObject());
    if (Helpers.isValueEmpty(newValue)) {
      delete obj[name];
    } else {
      obj[name] = Helpers.getUnbindValue(newValue);
    }
    // An empty object is written as is: the survey (or the outer scope) removes an empty value.
    data.setValue(this.key, obj, locNotification, allowNotifyValueChanged, questionName);
  }
  getComment(name: string): string {
    if (!this.isActive) return !!this.parentData ? this.parentData.getComment(name) : "";
    const res = this.getValue(Helpers.getCommentKey(name));
    return res || "";
  }
  setComment(name: string, newValue: string, locNotification: boolean | "text"): any {
    if (!this.isActive) {
      const data = this.parentData;
      return !!data ? data.setComment(name, newValue, locNotification) : undefined;
    }
    if (this.getComment(name) === (newValue || "")) return;
    const question = this.getIndex().getQuestions(name)[0];
    this.setValue(Helpers.getCommentKey(name), newValue, locNotification, true, !!question ? question.name : undefined);
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
  // The index of this active scope's keys. Built on its first read after the survey's data shape changed
  // (SurveyModel.dataShapeChanged()): shape changes are rare, and every write reads it.
  private indexValue: DataKeyIndex;
  private indexVersion: number;
  public getIndex(): DataKeyIndex {
    const version = getDataShapeVersion(this.getSurvey());
    if (!this.indexValue || version === undefined || version !== this.indexVersion) {
      this.indexValue = this.buildIndex();
      this.indexVersion = version;
    }
    return this.indexValue;
  }
  // The questions whose values this scope's object holds (directly, or through panels that do not nest)
  // and the active containers directly inside it: the one walk of a container's elements.
  private buildIndex(): DataKeyIndex {
    const res = new DataKeyIndex();
    const walk = (elements: Array<IElement>): void => {
      for (let i = 0; i < elements.length; i++) {
        const el: any = elements[i];
        if (el.isPanel) {
          const scope = (<IPanelDataScopeOwner>el).getDataScope();
          if (!!scope && scope.isActive && scope.getParentActiveScope() === this) {
            res.add(scope.key, scope.owner);
          } else {
            walk(el.elements);
          }
        } else if (el.isQuestion && getQuestionDataScope(el) === this) {
          res.add((<Question>el).getValueName(), <Question>el);
        }
      }
    };
    if (this.isActive) walk(this.owner.elements);
    return res;
  }
  public getParentActiveScope(): PanelDataScope {
    const parent = this.parentScope;
    return !!parent ? parent.getActiveScope() : null;
  }
  // The survey calls these for a root-level scope after its key is written (through the container's
  // ISurveyDataElement members). The questions read their values from the stored object again; the
  // scopes inside follow.
  public updateValuesFromData(): void {
    this.getIndex().elements.forEach(el => {
      const inner = getElementDataScope(el);
      if (!!inner) {
        inner.updateValuesFromData();
        return;
      }
      const q = <Question>el;
      const valueName = q.getValueName();
      const val = this.getValue(valueName);
      if (!this.isTwoValueEquals(q.value, val)) {
        q.updateValueFromSurvey(val, false);
      }
      if (q.requireUpdateCommentValue) {
        const comment = this.getComment(valueName);
        if (!this.isTwoValueEquals(q.comment, comment)) {
          q.updateCommentFromSurvey(comment);
        }
      }
    });
  }
  public notifyValueChanged(): void {
    this.getIndex().elements.forEach(el => {
      const inner = getElementDataScope(el);
      if (!!inner) {
        inner.notifyValueChanged();
      } else {
        el.onSurveyValueChanged(this.getValue(el.getValueName()));
      }
    });
  }
  // The questions of this scope and of the scopes inside it, in document order.
  public forEachQuestion(callback: (q: Question) => void): void {
    this.getIndex().elements.forEach(el => {
      const inner = getElementDataScope(el);
      if (!!inner) {
        inner.forEachQuestion(callback);
      } else {
        callback(<Question>el);
      }
    });
  }
  // Whether the question's value is in this scope's object, directly or in the object of a scope inside it.
  public containsQuestion(question: Question): boolean {
    let scope = getQuestionDataScope(question);
    while(!!scope) {
      if (scope === this) return true;
      scope = scope.getParentActiveScope();
    }
    return false;
  }
  private isTwoValueEquals(x: any, y: any): boolean {
    return Helpers.checkIfValuesEqual(x, y, { ignoreOrder: false, caseSensitive: true, trimStrings: false, doNotConvertNumbers: true });
  }
}

// The expression context of the active scopes that share one key (D4, one scope unless two containers
// share it). A name is answered, ignoring letter case, by a question of the scopes (by value name; an
// empty question still answers), then by an active scope directly inside them (by key), then, for a
// comment key ({kind-Comment}), by the comment a question of the scopes stores. A path with no items
// left ({address}) gives the stored object.
// As an inner element's context (the scope's getValueGetterContext) an unanswered name falls back to the
// parent's context through getRootObj; reached through a path from outside ({address.street}) it answers
// the rest of the path only, and the survey falls back to the raw data.
export class PanelDataScopeValueGetterContext extends ValueGetterContextCore {
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
  protected isSearchNameRevert(): boolean { return true; }
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    const postfix = settings.expressionVariables.unwrapPostfix;
    if (!!postfix && name.endsWith(postfix)) {
      name = name.substring(0, name.length - postfix.length);
    }
    const question = this.findQuestion(name);
    if (!!question) {
      res.isFound = true;
      res.obj = question;
      res.context = question.getValueGetterContext();
      return;
    }
    const inner: Array<PanelDataScope> = [];
    this.scopes.forEach(scope => inner.push(...scope.getIndex().getScopes(name, true)));
    if (inner.length > 0) {
      res.isFound = true;
      res.context = new PanelDataScopeValueGetterContext(inner);
      return;
    }
    const baseName = getNameOfCommentName(name);
    const owner = !!baseName ? this.findQuestion(baseName) : null;
    if (!!owner) {
      // The stored comment, as a top-level {q-Comment} reads the raw data key.
      res.isFound = true;
      res.value = (<PanelDataScope>owner.data).getActiveScope().getValue(Helpers.getCommentKey(owner.getValueName()));
    }
  }
  // The scopes' indexes, letter case ignored: a question of the first scope that has one wins.
  private findQuestion(name: string): Question {
    for (let i = 0; i < this.scopes.length; i++) {
      const res = this.scopes[i].getIndex().getQuestions(name, true);
      if (res.length > 0) return res[0];
    }
    return null;
  }
}
// The value name a comment key names, ignoring letter case ({Kind-comment} -> "Kind"); "" for another name.
export function getNameOfCommentName(name: string): string {
  const suffix = settings.commentSuffix;
  if (!suffix || name.length <= suffix.length) return "";
  return name.toLowerCase().endsWith(suffix.toLowerCase()) ? name.substring(0, name.length - suffix.length) : "";
}
