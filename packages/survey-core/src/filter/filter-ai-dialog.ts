import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { SurveyModel } from "../survey";
import { PanelModel } from "../panel";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { FilterItem } from "./filter-item";
import { FilterConditionsEditor, IFilterConditionsEditorOwner } from "./filter-conditions-editor";
import type { FilterAIRequest } from "./filter-ai";
import { FilterAIPrompt } from "./filter-ai-prompt";
import { filterPresetTitleMaxLength } from "./filter-preset-dialog";
import { filterUIStrings } from "./filter-ui-strings";
export { FilterAIPrompt, filterAIPromptMaxLength } from "./filter-ai-prompt";
export type { IFilterAIPromptOptions } from "./filter-ai-prompt";

// The title of a preset made with AI: the model's, or the titles of the fields it filters by, cut to
// a preset's length; one another preset has (compared as Add New Preset compares them) gets " 2",
// " 3"..., the title cut further so the number still fits.
export function makeFilterAITitle(title: string, fieldTitles: Array<string>, otherTitles: Array<string>): string {
  const max = filterPresetTitleMaxLength;
  const base = ((title || "").trim() || fieldTitles.filter((t: string): boolean => !!t).join(", ")).substring(0, max).trim();
  const taken = otherTitles.map((t: string): string => (t || "").trim().toLocaleLowerCase());
  const isTaken = (t: string): boolean => taken.indexOf(t.toLocaleLowerCase()) > -1;
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
  addItem(title: string, conditions: Array<IFilterCondition>, options?: { type?: string, prompt?: string }): FilterItem;
  createAIRequest(): FilterAIRequest;
}

// The Create custom filter dialog: the description (FilterAIPrompt), and the model's filter as the
// editors of the fields it is on - each with a trash that takes its condition away - which the
// respondent may change before Apply adds the filter as an AI preset. The editors are made anew for
// every answer and every field taken away, so a renderer watches the editor property. Nothing
// reaches the control until apply(). Made when the dialog opens, disposed when it closes.
export class FilterAIDialog extends Base {
  // undefined while there is no filter
  @property() editor: FilterConditionsEditor;
  @property({ defaultValue: false }) hasConditions: boolean;
  private aiPromptValue: FilterAIPrompt;
  private aiTitle: string = "";
  private createdItemValue: FilterItem;

  constructor(private owner: IFilterAIDialogOwner) {
    super();
    this.aiPromptValue = new FilterAIPrompt(owner.createAIRequest(), { locale: owner.getLocale(),
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
      return (!!field.locTitle && field.locTitle.calculatedText) || field.name;
    });
    const otherTitles = this.owner.visibleItems.map((item: FilterItem): string => item.title);
    const title = makeFilterAITitle(this.aiTitle, fieldTitles, otherTitles);
    this.createdItemValue = this.owner.addItem(title, conditions, { type: "ai", prompt: this.aiPromptValue.prompt.trim() });
    return !!this.createdItemValue;
  }
  public dispose(): void {
    this.aiPromptValue.dispose();
    const editor = this.editor;
    this.editor = undefined;
    if (!!editor) editor.dispose();
    super.dispose();
  }

  // The fields the conditions are on, in the order the Filters dialog shows them, each starting with its condition.
  private showConditions(conditions: Array<IFilterCondition>): void {
    const keys = this.owner.getAllFieldKeys().filter((key: string): boolean => {
      const field = this.owner.getFieldByName(key);
      return !!field && conditions.some((c: IFilterCondition): boolean => c.field === field.valueName);
    });
    const old = this.editor;
    this.editor = keys.length > 0 ? this.createEditor(keys, conditions) : undefined;
    if (!!old) old.dispose();
    this.updateState();
  }
  private createEditor(keys: Array<string>, conditions: Array<IFilterCondition>): FilterConditionsEditor {
    const owner = this.owner;
    const editorOwner: IFilterConditionsEditorOwner = {
      getFieldByName: (name: string) => owner.getFieldByName(name),
      getFieldCondition: (name: string): IFilterCondition => {
        const field = owner.getFieldByName(name);
        return !!field ? conditions.filter((c: IFilterCondition): boolean => c.field === field.valueName)[0] : undefined;
      },
      getFieldOperators: (name: string) => owner.getFieldOperators(name),
      getFieldEditorKind: (name: string) => owner.getFieldEditorKind(name),
      getValueEditorJson: (name: string, operator: string) => owner.getValueEditorJson(name, operator),
      getLocale: () => owner.getLocale(),
      isRawExpression: false
    };
    const editor = new FilterConditionsEditor(editorOwner, keys, { showFieldTitles: true, useFieldKinds: true,
      linkCss: (owner.cssClasses || {}).link, onFieldChanged: (): void => { this.updateState(); } });
    // Listened to before the editor is drawn: a panel asks for its title actions when it renders.
    editor.survey.onGetPanelTitleActions.add((_: SurveyModel, options: any): void => {
      const key = editor.fieldNames[this.getPanelIndex(options.panel)];
      if (key === undefined) return;
      // The mockup's 16px bin, muted, as the presets' pencil is.
      options.titleActions.push(new Action({ id: "sv-filter-ai-remove", iconName: "icon-delete-16x16", iconSize: "auto",
        title: filterUIStrings.aiRemoveField, showTitle: false, appearance: { style: "neutral", mode: "tertiary-muted", size: "x-small" },
        action: (): void => { this.removeField(key); } }));
    });
    return editor;
  }
  // The editor names a field's panel "f" + its index.
  private getPanelIndex(panel: PanelModel): number {
    const match = /^f(\d+)$/.exec(!!panel ? panel.name : "");
    return !!match ? parseInt(match[1], 10) : -1;
  }
  private updateState(): void {
    this.hasConditions = this.conditions.length > 0;
  }
}
