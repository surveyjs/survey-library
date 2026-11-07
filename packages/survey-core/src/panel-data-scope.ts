import type { IQuestion, IElement, ISurvey, ISurveyImpl, ISurveyData, ITextProcessor } from "./base-interfaces";
import type { IObjectValueContext, IValueGetterContext } from "./conditions/conditionProcessValue";
import type { Question } from "./question";
import { Helpers } from "./helpers";

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
export interface IPanelDataScopeOwner {
  getDataScopeKey(): string;
  elements: Array<IElement>;
}
// A panel or page that hands a scope to its elements (see PanelModelBase.getDataScope()).
interface IPanelWithDataScope {
  getDataScope(): PanelDataScope;
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
    const question = this.findDataQuestion(name);
    this.setValue(Helpers.getCommentKey(name), newValue, locNotification, true, !!question ? question.name : undefined);
  }
  getFilteredProperties(): any {
    return !!this.parentData ? this.parentData.getFilteredProperties() : {};
  }
  findQuestionByName(name: string): IQuestion {
    return !!this.parentData ? this.parentData.findQuestionByName(name) : null;
  }
  //IObjectValueContext
  // Expressions inside the scope resolve as at the parent for now (nested-data prompt 04 adds the scope).
  getValueGetterContext(): IValueGetterContext {
    const data: any = this.parentData;
    return !!data && typeof data.getValueGetterContext === "function" ? data.getValueGetterContext() : undefined;
  }
  // The survey calls these for a root-level scope after its key is written.
  // The questions read their values from the stored object again; the scopes inside follow.
  public updateValuesFromData(): void {
    this.forEachDataChild((q: Question) => {
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
    }, (scope: PanelDataScope) => scope.updateValuesFromData());
  }
  public notifyValueChanged(): void {
    this.forEachDataChild((q: Question) => q.onSurveyValueChanged(this.getValue(q.getValueName())),
      (scope: PanelDataScope) => scope.notifyValueChanged());
  }
  // The questions of the scope (directly or through panels that hand down this scope) and the scopes
  // directly inside it.
  public forEachDataChild(onQuestion: (q: Question) => void, onScope?: (scope: PanelDataScope) => void): void {
    this.forEachDataChildCore(this.owner.elements, onQuestion, onScope);
  }
  private forEachDataChildCore(elements: Array<IElement>, onQuestion: (q: Question) => void, onScope: (scope: PanelDataScope) => void): void {
    for (let i = 0; i < elements.length; i++) {
      const el: any = elements[i];
      if (el.isPanel) {
        const scope = (<IPanelWithDataScope>el).getDataScope();
        if (!!scope && scope.parentData === this) {
          if (!!onScope) onScope(scope);
        } else {
          this.forEachDataChildCore(el.elements, onQuestion, onScope);
        }
      } else if (el.isQuestion && el.data === this) {
        onQuestion(<Question>el);
      }
    }
  }
  private findDataQuestion(valueName: string): Question {
    let res: Question = null;
    this.forEachDataChild((q: Question) => {
      if (!res && q.getValueName() === valueName) res = q;
    });
    return res;
  }
  private isTwoValueEquals(x: any, y: any): boolean {
    return Helpers.checkIfValuesEqual(x, y, { ignoreOrder: false, caseSensitive: true, trimStrings: false, doNotConvertNumbers: true });
  }
}
