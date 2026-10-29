import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { SurveyModel } from "../survey";
import { PanelModel } from "../panel";
import { Question } from "../question";
import { getLocaleString } from "../surveyStrings";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { FilterItem } from "./filter-item";
import { FilterConditionsEditor, IFilterConditionsEditorOwner } from "./filter-conditions-editor";
import { filterUIStrings } from "./filter-ui-strings";
// The question types the form is made of; imported here, as FilterConditionsEditor imports its own.
import "../question_text";
import "../question_dropdown";

// What the preset dialogs read from the control and call on it: the control's public API only.
export interface IFilterPresetDialogOwner extends IFilterConditionsEditorOwner {
  visibleItems: Array<FilterItem>;
  getAllFieldKeys(): Array<string>;
  addItem(title: string, conditions: Array<IFilterCondition>): FilterItem;
}
// The longest title a preset may get: the mockup's counter.
export const filterPresetTitleMaxLength = 32;

// A preset as a dialog edits it: its title, and its conditions - null for a preset that does not
// decompose, which has none to edit.
export interface IFilterPresetBuffer {
  item?: FilterItem;
  title: string;
  conditions: Array<IFilterCondition> | null;
}

// The Add New Preset dialog: the preset's title and what it contains - a dropdown per field, "+ Add"
// for one more and the "x" of a dropdown for one less - and the fields' editors under them, in the
// form of their kinds as in the Filters dialog. Two editor surveys: the form (the title and the
// dropdowns) and the fields' FilterConditionsEditor, made anew whenever the set of fields changes.
// Both are replaced and never reused, so a renderer watches the form and editor properties. Nothing
// reaches the control until apply(), which checks the preset - a title that is given, not too long
// and no other preset's, and at least one condition - and says whether the dialog may close. Made
// when the dialog opens, disposed when it closes.
export class FilterPresetDialog extends Base {
  @property() form: SurveyModel;
  // The fields' editors; undefined while no field is picked.
  @property() editor: FilterConditionsEditor;
  protected buffer: IFilterPresetBuffer;
  private addFieldAction: Action;
  private rowCount: number = 0;

  constructor(protected owner: IFilterPresetDialogOwner, conditions?: Array<IFilterCondition>) {
    super();
    if (conditions !== undefined) {
      this.showBuffer({ title: "", conditions: [].concat(conditions || []) });
    }
  }
  public getType(): string { return "filterpresetdialog"; }
  public get title(): string { return filterUIStrings.addPresetTitle; }
  // Whether the preset shown may be changed; a dialog that adds one always may.
  public get isReadOnly(): boolean { return false; }
  // Checks the preset and adds it. false keeps the dialog open, with the errors shown in the form.
  public apply(): boolean {
    if (this.isDisposed) return false;
    this.saveBuffer();
    if (!this.validateBuffer()) return false;
    this.owner.addItem(this.buffer.title.trim(), this.buffer.conditions);
    return true;
  }
  public dispose(): void {
    [this.editor, this.form, this.addFieldAction].forEach((part: { dispose(): void }): void => {
      if (!!part) part.dispose();
    });
    super.dispose();
  }

  // Shows a preset: a new form and new editors for it, the old ones disposed once replaced.
  protected showBuffer(buffer: IFilterPresetBuffer): void {
    const oldForm = this.form;
    const oldEditor = this.editor;
    this.buffer = buffer;
    this.form = this.createForm();
    this.editor = this.createEditor();
    if (!!oldEditor) oldEditor.dispose();
    if (!!oldForm) oldForm.dispose();
  }
  // Reads what the form and the editors hold back into the preset shown.
  protected saveBuffer(): void {
    if (!this.buffer || !this.form) return;
    this.buffer.title = this.form.getValue("presetTitle") || "";
    if (this.buffer.conditions !== null) {
      this.buffer.conditions = !!this.editor ? this.editor.getConditions() : [];
    }
  }
  protected validateBuffer(): boolean {
    return this.form.validate(true, true);
  }
  // The titles the preset's may not repeat.
  protected getOtherTitles(): Array<string> {
    return this.owner.visibleItems.map((item: FilterItem): string => item.title);
  }
  // Called after every change the respondent makes in the form or the editors.
  protected onChanged(): void { }

  private get containsPanel(): PanelModel { return <PanelModel>this.form.getPanelByName("contains"); }
  private get rows(): Array<Question> { return !!this.containsPanel ? <Array<Question>>this.containsPanel.elements : []; }
  // The fields the rows pick, in their order.
  private getRowKeys(): Array<string> {
    return this.rows.map((row: Question): string => row.value).filter((key: string): boolean => !!key);
  }
  // The fields the conditions are on, in the order the Filters dialog shows them.
  private getConditionKeys(conditions: Array<IFilterCondition>): Array<string> {
    return this.owner.getAllFieldKeys().filter((key: string): boolean => {
      const field = this.owner.getFieldByName(key);
      return !!field && conditions.some((c: IFilterCondition): boolean => c.field === field.valueName);
    });
  }
  private createForm(): SurveyModel {
    const elements: Array<any> = [{ type: "text", name: "presetTitle", title: filterUIStrings.presetName,
      maxLength: filterPresetTitleMaxLength, textUpdateMode: "onTyping" }];
    if (this.buffer.conditions !== null) {
      elements.push({ type: "panel", name: "contains", title: filterUIStrings.presetContains });
    }
    const form = new SurveyModel({ showNavigationButtons: false, showQuestionNumbers: "off", elements: elements });
    form.locale = this.owner.getLocale();
    // Inside the dialog with no frames of its own, as the fields' editors are.
    form.isCompact = true;
    // A panel with no question in it is hidden, and Contains starts with no rows when there is no
    // condition: its title and "+ Add" have to stay. The form has nothing else to hide.
    form.showInvisibleElements = true;
    if (this.isReadOnly) {
      form.mode = "display";
    }
    form.setValue("presetTitle", this.buffer.title);
    const panel = <PanelModel>form.getPanelByName("contains");
    if (!!panel) {
      this.rowCount = 0;
      this.getConditionKeys(this.buffer.conditions).forEach((key: string): void => { this.addRow(panel, key); });
      // An action of each form's own: the panel's footer disposes its actions with the form.
      this.addFieldAction = new Action({ id: "sv-filter-preset-add-field", title: filterUIStrings.addField, iconName: "icon-add-24x24",
        iconSize: "auto", appearance: { style: "neutral", mode: "secondary" }, action: (): void => { this.addEmptyRow(); } });
      panel.footerActions.push(this.addFieldAction);
    }
    // Listened to once it is filled: what it opens with is not a change.
    form.onValueChanged.add((_: SurveyModel, options: any): void => { this.onFormChanged(options.name); });
    form.onValidateQuestion.add((_: SurveyModel, options: any): void => {
      if (options.name === "presetTitle") options.error = this.getTitleError(options.value);
    });
    form.onValidatePanel.add((_: SurveyModel, options: any): void => {
      if (options.name === "contains" && this.buffer.conditions.length === 0) options.error = filterUIStrings.presetNoConditions;
    });
    this.updateRows(form);
    return form;
  }
  // A dropdown of fields; the respondent picks one, or the "x" takes the row away.
  private addRow(panel: PanelModel, key?: string): void {
    this.rowCount++;
    panel.blockAnimations();
    try {
      const row = <Question>panel.addNewQuestion("dropdown", "field" + this.rowCount);
      row.titleLocation = "hidden";
      (<any>row).allowClear = true;
      (<any>row).choices = this.getFieldChoices([]);
      if (!!key) {
        row.value = key;
      }
    } finally {
      panel.releaseAnimations();
    }
  }
  private addEmptyRow(): void {
    this.addRow(this.containsPanel);
    this.updateRows(this.form);
  }
  private removeRow(row: Question): void {
    const panel = this.containsPanel;
    panel.blockAnimations();
    try {
      panel.removeElement(row);
      row.dispose();
    } finally {
      panel.releaseAnimations();
    }
  }
  // Each dropdown offers the fields no other row picked; "+ Add" is there while a field is left over.
  private updateRows(form: SurveyModel): void {
    const panel = <PanelModel>form.getPanelByName("contains");
    if (!panel) return;
    const rows = <Array<Question>>panel.elements;
    const picked = rows.map((row: Question): string => row.value);
    rows.forEach((row: Question): void => {
      (<any>row).choices = this.getFieldChoices(picked.filter((key: string): boolean => key !== row.value));
    });
    this.addFieldAction.visible = !this.isReadOnly && rows.length < this.owner.getAllFieldKeys().length;
  }
  private getFieldChoices(exclude: Array<string>): Array<any> {
    return this.owner.getAllFieldKeys().filter((key: string): boolean => exclude.indexOf(key) < 0).map((key: string): any => {
      const field = this.owner.getFieldByName(key);
      return { value: key, text: (!!field.locTitle && field.locTitle.calculatedText) || field.name };
    });
  }
  private onFormChanged(name: string): void {
    const row = this.form.getQuestionByName(name);
    if (!!row && row.parent === this.containsPanel) {
      if (row.isEmpty()) {
        this.removeRow(row);
      }
      this.updateRows(this.form);
      this.updateEditor();
    }
    this.onChanged();
  }
  // The rows changed: the editors are made anew for the fields they pick now, each keeping the
  // condition it had; a field that is new to them starts empty.
  private updateEditor(): void {
    const keys = this.getRowKeys();
    const conditions = !!this.editor ? this.editor.getConditions() : (this.buffer.conditions || []);
    const valueNames = keys.map((key: string): string => this.owner.getFieldByName(key).valueName);
    this.buffer.conditions = conditions.filter((c: IFilterCondition): boolean => valueNames.indexOf(c.field) > -1);
    const old = this.editor;
    this.editor = this.createEditor();
    if (!!old) old.dispose();
  }
  private createEditor(): FilterConditionsEditor {
    const keys = !!this.form ? this.getRowKeys() : [];
    if (keys.length === 0 || this.buffer.conditions === null) return undefined;
    return new FilterConditionsEditor(this.createEditorOwner(), keys, { readOnly: this.isReadOnly, showFieldTitles: true,
      useFieldKinds: true, onFieldChanged: (): void => { this.onChanged(); } });
  }
  // The control, except that the fields start with the preset's conditions and not the filter's.
  private createEditorOwner(): IFilterConditionsEditorOwner {
    const owner = this.owner;
    return {
      getFieldByName: (name: string) => owner.getFieldByName(name),
      getFieldCondition: (name: string): IFilterCondition => {
        const field = owner.getFieldByName(name);
        return !!field ? (this.buffer.conditions || []).filter((c: IFilterCondition): boolean => c.field === field.valueName)[0] : undefined;
      },
      getFieldOperators: (name: string) => owner.getFieldOperators(name),
      getFieldEditorKind: (name: string) => owner.getFieldEditorKind(name),
      getValueEditorJson: (name: string, operator: string) => owner.getValueEditorJson(name, operator),
      getLocale: () => owner.getLocale(),
      isRawExpression: false
    };
  }
  private getTitleError(value: any): string {
    const locale = this.owner.getLocale();
    const title = (value || "").toString().trim();
    if (!title) return getLocaleString("requiredError", locale);
    if (title.length > filterPresetTitleMaxLength) {
      return getLocaleString("textMaxLength", locale).replace("{0}", filterPresetTitleMaxLength.toString());
    }
    const key = title.toLocaleLowerCase();
    const isTaken = this.getOtherTitles().some((other: string): boolean => (other || "").trim().toLocaleLowerCase() === key);
    return isTaken ? filterUIStrings.presetTitleExists : undefined;
  }
}
