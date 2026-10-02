import { SurveyModel } from "../survey";
import { PanelModel } from "../panel";
import { Question } from "../question";
import { Serializer } from "../jsonobject";
import { Helpers } from "../helpers";
import { ItemValue } from "../itemvalue";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-fields";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { getLocaleString } from "../surveyStrings";
import { getConditionOperatorTitle, getFilterFieldDefaultOperator, isFilterConditionValueRequired } from "./filter-conditions";
// The question types the editor itself creates, whatever the fields are made of: the operator
// dropdown, the checkbox anyof/noneof switch to, the radiogroup a checkbox field's contains edits
// with and the text a typeless or expression field edits with. Serializer.createClass answers null
// for a type nobody imported, so they are imported here and not left to the rest of the bundle.
// Any other value editor type is a template question's own, so its class is already registered.
import "../question_dropdown";
import "../question_checkbox";
import "../question_radiogroup";
import "../question_text";

// What the editor reads from the control it edits for. Only the control's public API, so the
// editor holds no filter logic of its own: operators, value editors and the conditions the fields
// start with all come from the control. QuestionFilterModel satisfies it as it is.
export interface IFilterConditionsEditorOwner {
  getFieldByName(name: string): IDynamicDataFilterField;
  getFieldCondition(name: string): IFilterCondition;
  getFieldOperators(name: string): Array<string>;
  getValueEditorJson(name: string, operator: string): any;
  getLocale(): string;
  isRawExpression: boolean;
}
export interface IFilterConditionsEditorOptions {
  // The editor survey is display-only and reports no change.
  readOnly?: boolean;
  // Called after every change the respondent makes to one field: with the condition the field
  // edits now, or with undefined when it edits none (no value where the operator needs one). The
  // name is the one the field was given to the editor by. A mode that writes every change at once
  // (fast mode) listens here; one that writes on its own command listens to onApply instead.
  onConditionChanged?: (name: string, condition: IFilterCondition) => void;
  // A search box on top of the fields, prefilled with searchString. Its text is not a condition:
  // it is only ever handed to onApply.
  showSearch?: boolean;
  searchString?: string;
  // The search box's placeholder; the library's "Type to search..." when not given.
  searchPlaceholder?: string;
  // Each field's panel titled by the field. A mode that edits one field opened from something that
  // already names it (a fast mode badge) leaves it off; one that edits all of them (advanced mode)
  // needs it, or the fields could not be told apart.
  showFieldTitles?: boolean;
  // Called by apply() with every condition the editor holds, in the order of its fields - or with
  // undefined when no field was changed since the editor opened or was last applied, only the
  // search box: the fields then hold only their prefill, which the owner must not write back - and
  // with the search text, undefined when there is no search box. A mode that writes on its own
  // command (advanced mode) listens here; without it apply() has nothing to do.
  onApply?: (conditions: Array<IFilterCondition> | undefined, searchString?: string) => void;
}

// A SurveyModel-backed editor of field conditions: one untitled panel per field, with an
// operator dropdown and a value question the operator decides. The questions are named by the
// field's index (f0_operator, f0_value) and never by the field: the survey keys its data by
// question name, and a valueName can be a dotted path ("mt.city") that a name must not be.
export class FilterConditionsEditor {
  private surveyValue: SurveyModel;
  private names: Array<string>;
  private isDisposedValue: boolean = false;
  // Set while the editor changes its own questions (a value question recreated for a new
  // operator): those are not the respondent's changes and are not reported one by one.
  private isUpdating: boolean = false;
  // Whether the respondent has changed anything - a field or the search box - since the editor
  // opened or was last applied. See apply().
  private isModifiedValue: boolean = false;
  // The part of it that is a field: a change of the search box alone leaves the fields holding only
  // their prefill, which apply() must not hand on as the respondent's conditions.
  private isFieldModified: boolean = false;

  constructor(private owner: IFilterConditionsEditorOwner, names: Array<string>, private options: IFilterConditionsEditorOptions = {}) {
    this.names = (names || []).filter((name: string): boolean => !!owner.getFieldByName(name));
    this.surveyValue = this.createSurvey();
    // Prefilled before the survey is listened to: what the editor opens with is not a change.
    this.names.forEach((name: string, index: number): void => { this.prefill(name, index); });
    if (this.hasSearch) {
      this.getSearchQuestion().value = this.options.searchString || "";
    }
    this.surveyValue.onValueChanged.add((_: SurveyModel, opt: any): void => { this.onValueChanged(opt.name); });
  }
  public get survey(): SurveyModel { return this.surveyValue; }
  public get fieldNames(): Array<string> { return [].concat(this.names); }
  public get isReadOnly(): boolean { return !!this.options.readOnly; }
  // The control applies a preset that has no conditions to show, so the editor opened empty and
  // the first edit starts from nothing. Read live: once an edit is written, it is no longer so.
  public get isRawExpression(): boolean { return this.owner.isRawExpression; }
  public get isDisposed(): boolean { return this.isDisposedValue; }
  public get hasSearch(): boolean { return !!this.options.showSearch; }
  public get isModified(): boolean { return this.isModifiedValue; }
  // The condition the editor holds for the field now, or undefined when it holds none. A multi-
  // value answer comes in the field's choice order - see normalizeValue().
  public getCondition(name: string): IFilterCondition {
    const index = this.names.indexOf(name);
    return index > -1 ? this.getConditionAt(index) : undefined;
  }
  // Hands everything the editor holds to onApply at once. A field with no condition (no value where
  // the operator needs one) is left out, and the owner drops its condition. Nothing to do for a
  // read-only or a disposed editor, or for a mode that writes every change as it is made. Nor for
  // an editor nobody has changed: what it holds is only the prefill, which can be lossy (a preset
  // that does not decompose opens empty and would be replaced by nothing) or stale (the control
  // moved on to another preset or search while the editor was open), and writing it back would
  // undo a state the respondent never touched here. The same holds for the fields alone when only
  // the search box was changed: the fields are then given as undefined, not as their prefill.
  public apply(): void {
    const onApply = this.options.onApply;
    if (this.isReadOnly || this.isDisposedValue || !onApply || !this.isModifiedValue) return;
    let conditions: Array<IFilterCondition> = undefined;
    if (this.isFieldModified) {
      conditions = [];
      this.names.forEach((_: string, index: number): void => {
        const condition = this.getConditionAt(index);
        if (!!condition) conditions.push(condition);
      });
    }
    // Reset first: once applied, the control holds what the editor does, so applying again with no
    // new change has nothing to write.
    this.isModifiedValue = false;
    this.isFieldModified = false;
    onApply(conditions, this.hasSearch ? (this.getSearchQuestion().value || "") : undefined);
  }
  // Writes nothing and disposes the editor: a cancelled edit has nothing left to show, and an
  // editor left alive could still be applied by mistake. apply() does not dispose - a renderer may
  // keep the editor open after applying it - so after apply() the caller disposes it.
  public cancel(): void {
    this.dispose();
  }
  public dispose(): void {
    if (this.isDisposedValue) return;
    this.isDisposedValue = true;
    this.surveyValue.dispose();
  }

  private createSurvey(): SurveyModel {
    const elements: Array<any> = this.names.map((name: string, index: number): any => this.createPanelJson(name, index));
    if (this.hasSearch) {
      elements.unshift({ type: "text", name: this.getSearchName(), titleLocation: "hidden", textUpdateMode: "onTyping",
        placeholder: this.options.searchPlaceholder || getLocaleString("filterStringPlaceholder", this.owner.getLocale()) });
    }
    const survey = new SurveyModel({
      showNavigationButtons: false,
      showQuestionNumbers: "off",
      elements: elements
    });
    survey.locale = this.owner.getLocale();
    // The editor shows inside another survey, the way Creator embeds its editor surveys: no frames
    // of its own. Its dropdowns' lists keep measuring the window - Creator points them at its own
    // root, which is the whole app, but a survey's root is often much shorter than the screen and
    // a list measured against it lands far from its field.
    survey.isCompact = true;
    if (this.isReadOnly) {
      survey.mode = "display";
    }
    return survey;
  }
  // The panel groups a field's operator and value, and is titled by the field only where the
  // editor shows several fields (showFieldTitles): opened from a fast mode badge, the badge names it.
  // The title is the field's text in the control's locale as it is now - an editor lives as long as
  // the popup or the dialog it is shown in. A field the author allowed a single operator has nothing
  // to pick, so its operator dropdown is hidden - it still holds the operator - and the value editor
  // is all there is.
  private createPanelJson(name: string, index: number): any {
    const locale = this.owner.getLocale();
    const operators = this.owner.getFieldOperators(name).map((op: string): any =>
      ({ value: op, text: getConditionOperatorTitle(op, locale) }));
    const res: any = {
      type: "panel", name: this.getPanelName(index),
      elements: [{ type: "dropdown", name: this.getOperatorName(index), titleLocation: "hidden",
        choices: operators, allowClear: false, visible: operators.length > 1 }]
    };
    if (this.options.showFieldTitles) {
      const field = this.owner.getFieldByName(name);
      res.title = (!!field.locTitle && field.locTitle.calculatedText) || field.name;
    }
    return res;
  }
  // A preset that does not decompose gives no condition for any field (getFieldCondition), so the
  // editor opens empty then - there is nothing about its text a field editor could show.
  private prefill(name: string, index: number): void {
    const condition = this.owner.getFieldCondition(name);
    const operator = !!condition ? condition.operator : getFilterFieldDefaultOperator(this.owner.getFieldByName(name));
    this.getOperatorQuestion(index).value = operator;
    const question = this.createValueQuestion(index, operator, this.owner.getValueEditorJson(name, operator));
    if (!!condition && isFilterConditionValueRequired(operator)) {
      question.value = condition.value;
    }
  }
  private onValueChanged(questionName: string): void {
    if (this.isUpdating || this.isDisposedValue) return;
    this.isModifiedValue = true;
    for (let i = 0; i < this.names.length; i++) {
      const isOperator = questionName === this.getOperatorName(i);
      if (!isOperator && questionName !== this.getValueName(i)) continue;
      this.isFieldModified = true;
      if (isOperator) {
        this.runUpdate((): void => { this.recreateValueQuestion(i); });
      }
      this.notifyConditionChanged(i);
      return;
    }
  }
  private notifyConditionChanged(index: number): void {
    const callback = this.options.onConditionChanged;
    if (this.isReadOnly || !callback) return;
    callback(this.names[index], this.getConditionAt(index));
  }
  // The value question is rebuilt for the new operator: the json differs by operator and not only
  // by type (a dropdown field's anyof edits with a checkbox). What was typed is kept only when the
  // new editor is the same type - an answer of a dropdown is not an answer of a checkbox.
  private recreateValueQuestion(index: number): void {
    const name = this.names[index];
    const operator = this.getOperatorQuestion(index).value;
    const old = this.getValueQuestion(index);
    const json = this.owner.getValueEditorJson(name, operator) || {};
    const isSameType = !!old && old.getType() === json.type;
    const value = isSameType ? old.value : undefined;
    // One editor swapped for another in the same place, not a row that leaves and one that comes:
    // animated, the old row's leave animation outlives the disposed question and the panel's rows
    // stay stuck with an empty row and the new one never entering.
    const panel = this.getPanel(index);
    let question: Question;
    panel.blockAnimations();
    try {
      if (!!old) {
        old.parent.removeElement(old);
        old.dispose();
      }
      this.surveyValue.clearValue(this.getValueName(index));
      question = this.createValueQuestion(index, operator, json);
    } finally {
      panel.releaseAnimations();
    }
    if (!Helpers.isValueEmpty(value)) {
      question.value = value;
    }
  }
  private createValueQuestion(index: number, operator: string, editorJson: any): Question {
    const json = Object.assign({}, editorJson || {});
    json.name = this.getValueName(index);
    json.titleLocation = "hidden";
    json.visible = isFilterConditionValueRequired(operator);
    // Should never happen - every value editor type is a registered one - but a missing class
    // must not leave the field with no value editor at all.
    const question: Question = Serializer.createClass(json.type) || Serializer.createClass("text");
    question.fromJSON(json);
    this.getPanel(index).addElement(question);
    return question;
  }
  private getConditionAt(index: number): IFilterCondition {
    const operator = this.getOperatorQuestion(index).value;
    if (!operator) return undefined;
    const field = this.owner.getFieldByName(this.names[index]);
    if (!field) return undefined;
    if (!isFilterConditionValueRequired(operator)) return { field: field.valueName, operator: operator };
    const question = this.getValueQuestion(index);
    if (!question || question.isEmpty()) return undefined;
    return { field: field.valueName, operator: operator, value: this.normalizeValue(question, question.value) };
  }
  // A multi-value answer (anyof/noneof/allof) is in the order it was clicked, which says nothing
  // about the filter: the same set clicked in another order must be the same condition, or
  // isActiveItemModified - an exact comparison - would take a reclicked preset for an edited one.
  // So it goes in the order of the question's choices; a value no choice has keeps its own order
  // after them.
  private normalizeValue(question: Question, value: any): any {
    const choices: Array<ItemValue> = (<any>question).visibleChoices;
    if (!Array.isArray(value) || !Array.isArray(choices)) return value;
    const rest = [].concat(value);
    const res = [];
    choices.forEach((choice: ItemValue): void => {
      for (let i = 0; i < rest.length; i++) {
        if (Helpers.isTwoValueEquals(rest[i], choice.value)) {
          res.push(rest.splice(i, 1)[0]);
          return;
        }
      }
    });
    return res.concat(rest);
  }
  private runUpdate(fn: () => void): void {
    this.isUpdating = true;
    try {
      fn();
    } finally {
      this.isUpdating = false;
    }
  }
  // Not f-prefixed like the field questions, so it never collides with one of them.
  private getSearchName(): string { return "search"; }
  private getSearchQuestion(): Question { return this.surveyValue.getQuestionByName(this.getSearchName()); }
  private getPanelName(index: number): string { return "f" + index; }
  private getOperatorName(index: number): string { return "f" + index + "_operator"; }
  private getValueName(index: number): string { return "f" + index + "_value"; }
  private getPanel(index: number): PanelModel { return <PanelModel>this.surveyValue.getPanelByName(this.getPanelName(index)); }
  private getOperatorQuestion(index: number): Question { return this.surveyValue.getQuestionByName(this.getOperatorName(index)); }
  private getValueQuestion(index: number): Question { return this.surveyValue.getQuestionByName(this.getValueName(index)); }
}
