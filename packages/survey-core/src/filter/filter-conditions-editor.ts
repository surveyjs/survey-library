import { SurveyModel } from "../survey";
import { PanelModel } from "../panel";
import { Question } from "../question";
import { Serializer } from "../jsonobject";
import { Helpers } from "../helpers";
import { ItemValue } from "../itemvalue";
import { Action } from "../actions/action";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-filter-fields";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { getLocaleString } from "../surveyStrings";
import { getConditionOperatorTitle, getFilterFieldDefaultOperator, isFilterConditionValueRequired } from "./filter-conditions";
import {
  FilterFieldEditorKind, IFilterFieldListItem, getFilterFieldListItems, getFilterFieldSelection, getFilterSelectionCondition
} from "./filter-field-kinds";
import { filterUIStrings } from "./filter-ui-strings";
// The question types the editor itself creates, whatever the fields are made of: the operator
// dropdown, the checkbox anyof/noneof switch to, the radiogroup a checkbox field's contains edits
// with, the text a typeless or expression field edits with and the tagbox a long list of values
// edits with. Serializer.createClass answers null for a type nobody imported, so they are imported
// here and not left to the rest of the bundle. Any other value editor type is a template question's
// own, so its class is already registered.
import "../question_dropdown";
import "../question_checkbox";
import "../question_radiogroup";
import "../question_text";
import "../question_tagbox";

// What the editor reads from the control it edits for. Only the control's public API, so the
// editor holds no filter logic of its own: operators, value editors and the conditions the fields
// start with all come from the control. QuestionFilterModel satisfies it as it is.
export interface IFilterConditionsEditorOwner {
  getFieldByName(name: string): IDynamicDataFilterField;
  getFieldCondition(name: string): IFilterCondition;
  getFieldOperators(name: string): Array<string>;
  getFieldEditorKind(name: string): FilterFieldEditorKind;
  getValueEditorJson(name: string, operator: string): any;
  getLocale(): string;
  isRawExpression: boolean;
}
export interface IFilterConditionsEditorOptions {
  // The editor survey is display-only and reports no change.
  readOnly?: boolean;
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
  // Each field edits in the form its kind gives it (getFilterFieldEditorKind): checkboxes or a
  // tagbox for a list of values, Yes and No for a boolean, a dropdown for a single pick - and an
  // operator next to a value where the kind is "condition", or where the field's condition is one
  // the kind cannot show. The Filters dialog's fields. Without it every field is an operator and a
  // value, as in a fast mode popup.
  useFieldKinds?: boolean;
  // Called after every change the respondent makes to a field - not for the prefill, not for
  // setConditions(), not for the search box. The Filters dialog counts the records again on it.
  onFieldChanged?: () => void;
  // Called by apply() with every condition the editor holds, in the order of its fields - or with
  // undefined when no field was changed since the editor opened or was last applied, only the
  // search box: the fields then hold only their prefill, which the owner must not write back - and
  // with the search text, undefined when there is no search box. Both modes write on their own
  // command - the advanced dialog's Apply, a fast mode popup's Apply - and listen here; without it
  // apply() has nothing to do.
  onApply?: (conditions: Array<IFilterCondition> | undefined, searchString?: string) => void;
}
// A checkbox list of values shows this many until "Show More" is clicked - with Select All above
// them, five rows, as in the mockup.
export const filterEditorVisibleChoiceCount = 4;
// A list of more values than this - or one the respondent may type values into - edits with a
// tagbox instead of checkboxes.
export const filterEditorMaxCheckboxChoiceCount = 10;

// A SurveyModel-backed editor of field conditions: one panel per field, with an operator dropdown
// and a value question the operator decides, or - with useFieldKinds - the one list question the
// field's kind gives it. The questions are named by the field's index (f0_operator, f0_value) and
// never by the field: the survey keys its data by question name, and a valueName can be a dotted
// path ("mt.city") that a name must not be.
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
  // Per field: the kind of the list question it edits with, or undefined for an operator and a value.
  private listKinds: Array<FilterFieldEditorKind> = [];
  // Per field: "Show More" was clicked, and its own action that says so.
  private expanded: Array<boolean> = [];
  private moreActions: Array<Action> = [];

  constructor(private owner: IFilterConditionsEditorOwner, names: Array<string>, private options: IFilterConditionsEditorOptions = {}) {
    this.names = (names || []).filter((name: string): boolean => !!owner.getFieldByName(name));
    this.surveyValue = this.createSurvey();
    // Prefilled before the survey is listened to: what the editor opens with is not a change.
    this.names.forEach((name: string, index: number): void => { this.buildField(index, this.owner.getFieldCondition(name)); });
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
  // Every condition the editor holds, in the order of its fields.
  public getConditions(): Array<IFilterCondition> {
    const res: Array<IFilterCondition> = [];
    this.names.forEach((_: string, index: number): void => {
      const condition = this.getConditionAt(index);
      if (!!condition) res.push(condition);
    });
    return res;
  }
  // The fields show these conditions - a preset turned on in the Filters dialog, or everything
  // cleared - as the editor's new starting point: not a change of the respondent's, nothing is
  // reported, and the fields count as untouched again.
  public setConditions(conditions: Array<IFilterCondition>): void {
    if (this.isDisposedValue) return;
    this.runUpdate((): void => {
      this.names.forEach((name: string, index: number): void => {
        const field = this.owner.getFieldByName(name);
        const condition = !!field ? (conditions || []).filter((c: IFilterCondition): boolean => c.field === field.valueName)[0] : undefined;
        this.buildField(index, condition);
      });
    });
    this.isFieldModified = false;
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
    const conditions: Array<IFilterCondition> = this.isFieldModified ? this.getConditions() : undefined;
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
    this.moreActions.forEach((action: Action): void => { if (!!action) action.dispose(); });
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
    if (!!this.options.useFieldKinds) {
      survey.onShowingChoiceItem.add((_: SurveyModel, opt: any): void => {
        const index = this.getFieldIndex(opt.question);
        if (index < 0 || !this.canShowMore(index, opt.question) || this.expanded[index]) return;
        opt.visible = opt.visible && opt.question.choices.indexOf(opt.item) < filterEditorVisibleChoiceCount;
      });
    }
    return survey;
  }
  // The panel groups a field's editors, and is titled by the field only where the editor shows
  // several fields (showFieldTitles): opened from a fast mode badge, the badge names it. The title is
  // the field's text in the control's locale as it is now - an editor lives as long as the popup or
  // the dialog it is shown in. The editors themselves are added by buildField().
  private createPanelJson(name: string, index: number): any {
    const res: any = { type: "panel", name: this.getPanelName(index) };
    if (this.options.showFieldTitles) {
      const field = this.owner.getFieldByName(name);
      res.title = (!!field.locTitle && field.locTitle.calculatedText) || field.name;
    }
    return res;
  }
  // Builds the field's editors for a condition: the list question its kind gives it, or an operator
  // and a value. Run again by setConditions(), so the field can change from one form to the other.
  // A preset that does not decompose gives no condition for any field (getFieldCondition), so the
  // editor opens empty then - there is nothing about its text a field editor could show.
  private buildField(index: number, condition: IFilterCondition): void {
    const name = this.names[index];
    const field = this.owner.getFieldByName(name);
    const panel = this.getPanel(index);
    const kind = this.getListKind(name, field, condition);
    panel.blockAnimations();
    try {
      [].concat(panel.elements).forEach((element: Question): void => {
        panel.removeElement(element);
        element.dispose();
      });
      this.surveyValue.clearValue(this.getOperatorName(index));
      this.surveyValue.clearValue(this.getValueName(index));
      this.listKinds[index] = kind;
      if (!!kind) {
        this.createListQuestion(index, field, kind, condition);
      } else {
        this.createConditionQuestions(index, name, field, condition);
      }
    } finally {
      panel.releaseAnimations();
    }
    this.updateMoreAction(index);
  }
  // The kind of list question the field edits with, or undefined for an operator and a value: when
  // the editor does not use the field kinds, for a "condition" field, and for a condition the kind's
  // list cannot show (noneof over a "multi" field, greater over a boolean) - shown as it is instead
  // of hidden.
  private getListKind(name: string, field: IDynamicDataFilterField, condition: IFilterCondition): FilterFieldEditorKind {
    if (!this.options.useFieldKinds) return undefined;
    const kind = this.owner.getFieldEditorKind(name);
    if (!kind || kind === "condition") return undefined;
    if (!!condition && getFilterFieldSelection(field, kind, condition) === undefined) return undefined;
    return kind;
  }
  // A field the author allowed a single operator has nothing to pick, so its operator dropdown is
  // hidden - it still holds the operator - and the value editor is all there is. With useFieldKinds
  // (the Filters dialog) the two stand in one row.
  private createConditionQuestions(index: number, name: string, field: IDynamicDataFilterField, condition: IFilterCondition): void {
    const locale = this.owner.getLocale();
    const operators = this.owner.getFieldOperators(name).map((op: string): any =>
      ({ value: op, text: getConditionOperatorTitle(op, locale) }));
    const json: any = { type: "dropdown", name: this.getOperatorName(index), titleLocation: "hidden",
      choices: operators, allowClear: false, visible: operators.length > 1 };
    if (!!this.options.useFieldKinds) {
      json.minWidth = "0px";
    }
    this.getPanel(index).addElement(this.createQuestion(json));
    const operator = !!condition ? condition.operator : getFilterFieldDefaultOperator(field);
    this.getOperatorQuestion(index).value = operator;
    const question = this.createValueQuestion(index, operator, this.owner.getValueEditorJson(name, operator));
    if (!!condition && isFilterConditionValueRequired(operator)) {
      question.value = condition.value;
    }
  }
  // The field's values as checkboxes (with Select All, the first filterEditorVisibleChoiceCount shown
  // until "Show More"), a tagbox for a long list or one that takes typed values, two checkboxes for a
  // boolean, a dropdown for a single pick. A value of the condition that is none of the field's (typed
  // in, or written by hand into a preset) is listed after them and checked: the filter holds nothing
  // the editor hides.
  private createListQuestion(index: number, field: IDynamicDataFilterField, kind: FilterFieldEditorKind, condition: IFilterCondition): void {
    const items = getFilterFieldListItems(field, this.owner.getLocale());
    const selection = getFilterFieldSelection(field, kind, condition) || [];
    const extras = selection.filter((value: any): boolean =>
      !items.some((item: IFilterFieldListItem): boolean => Helpers.isTwoValueEquals(item.value, value)));
    const choices = items.map((item: IFilterFieldListItem): any => ({ value: item.value, text: item.text }))
      .concat(extras.map((value: any): any => ({ value: value, text: value === undefined || value === null ? "" : value.toString() })));
    const template: any = field.templateQuestion;
    const allowCustom = !!template && template.allowCustomChoices === true;
    let json: any;
    if (kind === "single") {
      json = { type: "dropdown", allowClear: true };
    } else if (kind === "boolean") {
      json = { type: "checkbox", colCount: 1 };
    } else if (allowCustom || items.length > filterEditorMaxCheckboxChoiceCount) {
      json = { type: "tagbox", allowCustomChoices: allowCustom };
    } else {
      json = { type: "checkbox", colCount: 1, showSelectAllItem: true };
    }
    json.name = this.getValueName(index);
    json.titleLocation = "hidden";
    json.choices = choices;
    const question = this.createQuestion(json);
    this.getPanel(index).addElement(question);
    if (selection.length > 0) {
      question.value = kind === "single" ? selection[0] : [].concat(selection);
    }
  }
  // "Show More" under a checkbox list that is longer than filterEditorVisibleChoiceCount; an action
  // of the field's panel footer, made once and shown while the field edits with such a list.
  private canShowMore(index: number, question: any): boolean {
    return this.listKinds[index] === "multi" && !!question && question.getType() === "checkbox" &&
      question.choices.length > filterEditorVisibleChoiceCount;
  }
  private updateMoreAction(index: number): void {
    if (!this.options.useFieldKinds) return;
    let action = this.moreActions[index];
    if (!action) {
      action = new Action({ id: "sv-filter-show-more", appearance: { style: "brand", mode: "tertiary" },
        action: (): void => { this.toggleMore(index); } });
      this.moreActions[index] = action;
      this.getPanel(index).footerActions.push(action);
    }
    this.expanded[index] = false;
    const question = this.getValueQuestion(index);
    action.visible = this.canShowMore(index, question);
    action.title = filterUIStrings.showMore;
    // The choices were made visible while the question was being added, before it could be told
    // apart as this field's list.
    if (action.visible) {
      question.surveyChoiceItemVisibilityChange();
    }
  }
  private toggleMore(index: number): void {
    this.expanded[index] = !this.expanded[index];
    this.moreActions[index].title = this.expanded[index] ? filterUIStrings.showLess : filterUIStrings.showMore;
    this.getValueQuestion(index).surveyChoiceItemVisibilityChange();
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
      if (!!this.options.onFieldChanged) {
        this.options.onFieldChanged();
      }
      return;
    }
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
    if (!!this.options.useFieldKinds) {
      json.startWithNewLine = false;
      json.minWidth = "0px";
    }
    const question = this.createQuestion(json);
    this.getPanel(index).addElement(question);
    return question;
  }
  // Should never fall back - every type the editor asks for is a registered one - but a missing
  // class must not leave the field with no editor at all.
  private createQuestion(json: any): Question {
    const question: Question = Serializer.createClass(json.type) || Serializer.createClass("text");
    question.fromJSON(json);
    return question;
  }
  private getConditionAt(index: number): IFilterCondition {
    const field = this.owner.getFieldByName(this.names[index]);
    if (!field) return undefined;
    const kind = this.listKinds[index];
    if (!!kind) {
      const list = this.getValueQuestion(index);
      if (!list || list.isEmpty()) return undefined;
      const values = kind === "single" ? [list.value] : this.normalizeValue(list, list.value);
      return getFilterSelectionCondition(field, kind, values);
    }
    const operator = this.getOperatorQuestion(index).value;
    if (!operator) return undefined;
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
  private getFieldIndex(question: Question): number {
    for (let i = 0; i < this.names.length; i++) {
      if (question.name === this.getValueName(i)) return i;
    }
    return -1;
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
