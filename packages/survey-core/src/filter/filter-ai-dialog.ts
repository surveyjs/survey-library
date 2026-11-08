import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { SurveyModel } from "../survey";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { setUpDialogSurvey } from "../utils/dialog-survey";
import { toCssClasses } from "../utils/cssClassBuilder";
import { FilterItem } from "./filter-item";
import { FilterConditionsEditor, IFilterConditionsEditorOwner, createFilterEditorOwner } from "./filter-conditions-editor";
import { getFilterFieldTitle } from "../dynamic-data/dynamic-data-filter-fields";
import type { FilterAIRequest } from "./filter-ai";
import { FilterAIPrompt } from "./filter-ai-prompt";
import { filterPresetTitleMaxLength, isFilterPresetTitleTaken } from "./filter-preset-dialog";
import { filterUIStrings } from "./filter-ui-strings";
export { FilterAIPrompt, filterAIPromptMaxLength } from "./filter-ai-prompt";
export type { IFilterAIPromptOptions } from "./filter-ai-prompt";

// The title of a preset made with AI: the model's, or the titles of the fields it filters by, cut to
// a preset's length; one another preset has (compared as Add New Preset compares them) gets " 2",
// " 3"..., the title cut further so the number still fits.
export function makeFilterAITitle(title: string, fieldTitles: Array<string>, otherTitles: Array<string>): string {
  const max = filterPresetTitleMaxLength;
  const base = ((title || "").trim() || fieldTitles.filter((t: string): boolean => !!t).join(", ")).substring(0, max).trim();
  const isTaken = (t: string): boolean => isFilterPresetTitleTaken(t, otherTitles);
  if (!isTaken(base)) return base;
  for (let n = 2; ; n++) {
    const suffix = " " + n;
    const res = base.substring(0, max - suffix.length).trim() + suffix;
    if (!isTaken(res)) return res;
  }
}

// What the Create custom filter dialog reads from the control and calls on it: the control's public API.
export interface IFilterAIDialogOwner extends IFilterConditionsEditorOwner {
  getAllFieldKeys(): Array<string>;
  visibleItems: Array<FilterItem>;
  cssClasses: any;
  isMobile?: boolean;
  addItem(title: string, conditions: Array<IFilterCondition>, options?: { kind?: "fields" | "ai", prompt?: string }): FilterItem;
  createAIRequest(): FilterAIRequest;
}

// The Create custom filter dialog: the description (FilterAIPrompt), and the model's filter as the
// editors of the fields it is on - each with a trash that takes its condition away - which the
// respondent may change before Apply adds the filter as an AI preset. Nothing reaches the control
// until apply(). Made when the dialog opens, disposed when it closes.
// All of it is one survey (the survey property), which the dialog host draws as any survey - no
// renderer has a component of its own for it: the fields' panels first, made anew for every answer
// and every field taken away, then the description's panel.
export class FilterAIDialog extends Base {
  // undefined while there is no filter
  @property() editor: FilterConditionsEditor;
  @property({ defaultValue: false }) hasConditions: boolean;
  private surveyValue: SurveyModel;
  private aiPromptValue: FilterAIPrompt;
  private aiTitle: string = "";
  private createdItemValue: FilterItem;

  constructor(private owner: IFilterAIDialogOwner) {
    super();
    this.surveyValue = this.createSurvey();
    this.aiPromptValue = new FilterAIPrompt(owner.createAIRequest(), { survey: this.surveyValue, css: owner.cssClasses,
      getConditions: (): Array<IFilterCondition> => this.conditions,
      onAnswer: (conditions: Array<IFilterCondition>, title: string): void => {
        // An answer to Make Changes that names no title keeps the one the model gave before.
        if (!!title) {
          this.aiTitle = title;
        }
        this.showConditions(conditions);
      } });
  }
  public getType(): string { return "filteraidialog"; }
  public get title(): string { return filterUIStrings.aiDialogTitle; }
  // What the dialog shows: the fields' panels and the description's.
  public get survey(): SurveyModel { return this.surveyValue; }
  public get aiPrompt(): FilterAIPrompt { return this.aiPromptValue; }
  public get conditions(): Array<IFilterCondition> { return !!this.editor ? this.editor.getConditions() : []; }
  // A filter to add, and no request running.
  public get canApply(): boolean { return !this.aiPromptValue.isBusy && this.hasConditions; }
  public get createdItem(): FilterItem { return this.createdItemValue; }
  // The trash of a field: the filter without its condition.
  public removeField(key: string): void {
    const field = this.owner.getFieldByName(key);
    if (!field) return;
    this.showConditions(this.conditions.filter((c: IFilterCondition): boolean => c.field !== field.valueName));
  }
  // Adds the filter as the respondent's AI preset; false keeps the dialog open.
  public apply(): boolean {
    if (this.isDisposed || !this.canApply) return false;
    const conditions = this.conditions;
    const fieldTitles = this.editor.fieldNames.map((key: string): string => {
      const field = this.owner.getFieldByName(key);
      return getFilterFieldTitle(field);
    });
    const otherTitles = this.owner.visibleItems.map((item: FilterItem): string => item.title);
    const title = makeFilterAITitle(this.aiTitle, fieldTitles, otherTitles);
    this.createdItemValue = this.owner.addItem(title, conditions, { kind: "ai", prompt: this.aiPromptValue.prompt.trim() });
    return !!this.createdItemValue;
  }
  public dispose(): void {
    this.aiPromptValue.dispose();
    const editor = this.editor;
    this.editor = undefined;
    if (!!editor) editor.dispose();
    super.dispose();
    this.surveyValue.dispose();
  }

  // The control's isMobile, which may change while the dialog is open (a rotation, a resize).
  public setIsMobile(isMobile: boolean): void {
    if (this.isDisposed) return;
    this.surveyValue.setIsMobile(!!isMobile);
  }

  // As the records' Sort by dialog's survey (setUpDialogSurvey), following the control's isMobile.
  // The root carries the classes the other dialogs' editors are drawn in.
  private createSurvey(): SurveyModel {
    const owner = this.owner;
    const css = owner.cssClasses || {};
    const survey = new SurveyModel();
    setUpDialogSurvey(survey, { css: { root: toCssClasses(survey.css.root, css.editor, css.modalEditor) },
      locale: owner.getLocale(), isMobile: !!owner.isMobile });
    survey.addNewPage("page1");
    // Listened to before the panels are drawn: a panel asks for its title actions when it renders.
    survey.onGetPanelTitleActions.add((_: SurveyModel, options: any): void => {
      const editor = this.editor;
      const key = !!editor ? editor.getFieldKeyByPanel(options.panel) : undefined;
      if (key === undefined) return;
      // The mockup's 16px bin, muted, as the presets' pencil is.
      options.titleActions.push(new Action({ id: "sv-filter-ai-remove", iconName: "icon-delete-16x16", iconSize: "auto",
        title: filterUIStrings.aiRemoveField, showTitle: false, appearance: { style: "neutral", mode: "tertiary-muted", size: "x-small" },
        action: (): void => { this.removeField(key); } }));
    });
    return survey;
  }
  // The fields the conditions are on, in the order the Filters dialog shows them, each starting with
  // its condition. The old editor's panels go first: the new ones have the same names. One editor
  // swapped for another in place, not panels that leave and come.
  private showConditions(conditions: Array<IFilterCondition>): void {
    const keys = this.owner.getAllFieldKeys().filter((key: string): boolean => {
      const field = this.owner.getFieldByName(key);
      return !!field && conditions.some((c: IFilterCondition): boolean => c.field === field.valueName);
    });
    const page = this.surveyValue.pages[0];
    page.blockAnimations();
    try {
      const old = this.editor;
      this.editor = undefined;
      if (!!old) old.dispose();
      this.editor = keys.length > 0 ? this.createEditor(keys, conditions) : undefined;
    } finally {
      page.releaseAnimations();
    }
    this.updateState();
  }
  private createEditor(keys: Array<string>, conditions: Array<IFilterCondition>): FilterConditionsEditor {
    const owner = this.owner;
    const editorOwner = createFilterEditorOwner(owner, (): Array<IFilterCondition> => conditions);
    return new FilterConditionsEditor(editorOwner, keys, { survey: this.surveyValue, showFieldTitles: true, useFieldKinds: true,
      linkCss: (owner.cssClasses || {}).link, onFieldChanged: (): void => { this.updateState(); } });
  }
  private updateState(): void {
    this.hasConditions = this.conditions.length > 0;
  }
}
