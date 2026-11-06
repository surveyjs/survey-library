import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { SurveyModel } from "../survey";
import { PanelModel } from "../panel";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { FilterItem } from "./filter-item";
import { FilterConditionsEditor, IFilterConditionsEditorOwner } from "./filter-conditions-editor";
import { FilterAIRequest, FilterAIResult } from "./filter-ai";
import { filterPresetTitleMaxLength } from "./filter-preset-dialog";
import { filterUIStrings } from "./filter-ui-strings";
// The question type the description is typed in; imported here, as the other dialogs import theirs.
import "../question_comment";

// The longest description: the mockup's counter.
export const filterAIPromptMaxLength = 500;

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

export interface IFilterAIPromptOptions {
  // the description the field starts with
  prompt?: string;
  // the filter exists: the request is "modify" from the start (an AI preset in Edit Presets)
  isModify?: boolean;
  // the caption over the field once there is a filter; aiPromptChange when not given
  modifyTitle?: string;
  locale: string;
  // the filter as it is now, which "modify" sends
  getConditions: () => Array<IFilterCondition>;
  onAnswer: (conditions: Array<IFilterCondition>, title: string) => void;
}

// The description of a filter and its request button - "Create new filter", then "Make Changes" -
// with the request's state: busy while the model answers, and what went wrong. The description is
// what the filter is for: it stays in the field after an answer and is sent again, with the filter
// as it is, by Make Changes. Owns the request and disposes it.
export class FilterAIPrompt extends Base {
  @property({ defaultValue: false }) isBusy: boolean;
  // "" while nothing went wrong
  @property({ defaultValue: "" }) errorText: string;
  // There is a filter to change: the caption and the button say so, and a request is "modify".
  @property({ defaultValue: false }) isModify: boolean;
  private formValue: SurveyModel;
  private requestActionValue: Action;

  constructor(private aiRequest: FilterAIRequest, private options: IFilterAIPromptOptions) {
    super();
    this.isModify = !!options.isModify;
    this.formValue = new SurveyModel({ showNavigationButtons: false, showQuestionNumbers: "off",
      elements: [{ type: "comment", name: "prompt", titleLocation: "hidden", maxLength: filterAIPromptMaxLength, textUpdateMode: "onTyping" }] });
    this.formValue.locale = options.locale;
    // Inside the dialog with no frames of its own, as the fields' editors are.
    this.formValue.isCompact = true;
    this.formValue.setValue("prompt", options.prompt || "");
    this.formValue.onValueChanged.add((): void => { this.updateAction(); });
    this.requestActionValue = new Action({ id: "sv-filter-ai-request", iconName: "icon-sparkle-24x24", iconSize: "auto",
      action: (): void => { this.request(); } });
    this.updateAction();
  }
  public getType(): string { return "filteraiprompt"; }
  public get form(): SurveyModel { return this.formValue; }
  public get prompt(): string { return this.formValue.getValue("prompt") || ""; }
  public get promptTitle(): string {
    return !this.isModify ? filterUIStrings.aiPromptNew : (this.options.modifyTitle || filterUIStrings.aiPromptChange);
  }
  public get requestAction(): Action { return this.requestActionValue; }
  // Asks the model: a new filter, or the filter as it is for the description as it is now. Nothing
  // while a request runs or for a blank description.
  public request(): void {
    const prompt = this.prompt.trim();
    if (this.isDisposed || this.isBusy || !prompt) return;
    this.isBusy = true;
    this.errorText = "";
    this.updateAction();
    const done = (res: FilterAIResult): void => { this.onResult(res); };
    if (this.isModify) {
      this.aiRequest.modify(prompt, this.options.getConditions(), done);
    } else {
      this.aiRequest.generate(prompt, done);
    }
  }
  // Stops waiting: the answer of the request, if it comes, is ignored.
  public cancel(): void {
    this.aiRequest.cancel();
    this.isBusy = false;
    this.updateAction();
  }
  public dispose(): void {
    this.aiRequest.dispose();
    this.requestActionValue.dispose();
    this.formValue.dispose();
    super.dispose();
  }

  private onResult(res: FilterAIResult): void {
    if (this.isDisposed) return;
    this.isBusy = false;
    if (res.status === "answer") {
      this.errorText = "";
      this.isModify = true;
      this.options.onAnswer(res.conditions, res.title);
    } else if (res.status === "empty") {
      this.errorText = res.explanation || filterUIStrings.aiEmpty;
    } else {
      this.errorText = filterUIStrings.aiError;
    }
    this.updateAction();
  }
  private updateAction(): void {
    const action = this.requestActionValue;
    if (!action) return;
    action.title = this.isModify ? filterUIStrings.aiMakeChanges : filterUIStrings.aiCreate;
    action.enabled = !this.isBusy && !!this.prompt.trim();
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
        this.aiTitle = title || "";
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
      options.titleActions.push(new Action({ id: "sv-filter-ai-remove", iconName: "icon-delete-24x24", iconSize: "auto",
        title: filterUIStrings.aiRemoveField, showTitle: false, action: (): void => { this.removeField(key); } }));
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
