import { Base, ComputedUpdater } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { SurveyModel } from "../survey";
import { PanelModel } from "../panel";
import { Question } from "../question";
import { getLocaleString } from "../surveyStrings";
import { toCssClasses } from "../utils/cssClassBuilder";
import { setUpDialogSurvey } from "../utils/dialog-survey";
import { IFilterCondition, IFilterPresetEdit } from "../interfaces/ui-interfaces";
import { FilterPreset, filterPresetTitleMaxLength, getFilterPresetTitleError } from "./filter-preset";
import { FilterConditionsEditor, IFilterConditionsEditorOwner, createFilterEditorOwner } from "./filter-conditions-editor";
import { getFilterFieldTitle } from "../dynamic-data/dynamic-data-filter-fields";
import { ExpressionRunner } from "../expressions/expressionRunner";
import { makeFilterAITitle } from "./filter-ai";
import type { FilterAIRequest } from "./filter-ai";
import { FilterAIPrompt } from "./filter-ai-prompt";
import { FilterExpressionPanel } from "./filter-expression-panel";
import { setupApplyOnEnter } from "./filter-enter-key";
// The question types the form is made of; imported here, as FilterConditionsEditor imports its own.
import "../question_text";
import "../question_tagbox";

// What the preset dialogs read from the control and call on it: the control's public API only.
export interface IFilterPresetDialogOwner extends IFilterConditionsEditorOwner {
  visiblePresets: Array<FilterPreset>;
  getAllFieldKeys(): Array<string>;
  addPresetFromConditions(title: string, conditions: Array<IFilterCondition>, options?: { expression?: string }): FilterPreset;
  parseExpressionConditions(text: string): Array<IFilterCondition> | null;
  getConditionsExpression(conditions: Array<IFilterCondition>): string;
  // a preset's filter may be written or changed with AI
  canRequestAI: boolean;
  createAIRequest(): FilterAIRequest;
  cssClasses: any;
  isMobile?: boolean;
}
// A preset as a dialog edits it: its title, and its conditions - or, null, the preset is edited as
// text, which expression holds: one that does not decompose always is, any other when the respondent
// asks for it (editAsText).
export interface IFilterPresetBuffer {
  preset?: FilterPreset;
  title: string;
  conditions: Array<IFilterCondition> | null;
  expression?: string;
}

// The New Preset dialog: the preset's name and what it contains - a tagbox of the fields, in the order
// they were picked - and the fields' editors under it, in the form of their kinds as in the Filters
// dialog - or, for a preset edited as text, the text in place of the tagbox (FilterExpressionPanel),
// "Switch to Expression" and "Switch to Fields" in the titles switching between the two. Two surveys: the
// form (the name and the tagbox or the text), made anew for every preset shown, and the dialog's
// survey (survey), which lives as long as the dialog: the fields' FilterConditionsEditor adds its
// panels to its "fields" panel - the frame - and is made anew whenever the set of fields changes,
// then the AI description (aiPrompt) while the application answers AI requests. A renderer watches
// the form and editor properties. Nothing reaches the control until apply(), which checks the preset
// - a title that is given, not too long and no other preset's, and at least one condition or a text
// that parses - and says whether the dialog may close. Made when the dialog opens, disposed when it
// closes.
export class FilterPresetDialog extends Base {
  @property() form: SurveyModel;
  // The fields' editors; undefined while no field is picked.
  @property() editor: FilterConditionsEditor;
  // The text shown is the fields' kind of text: "Edit as fields" can show it as fields.
  @property({ defaultValue: false }) canEditAsFields: boolean;
  // The description and its request button - Create, Edit - while the application answers AI requests
  // and the preset may be changed (canAskAI); undefined otherwise. In the dialog's survey, after the
  // fields' frame. Made anew, empty, for another preset; the same preset drawn anew (an answer, Edit as
  // Expression) keeps it - the description typed and a request it may be waiting for. The description
  // is what the filter needs or what to change in it, not part of the preset: typing it changes nothing.
  @property() aiPrompt: FilterAIPrompt;
  private aiPromptBuffer: IFilterPresetBuffer;
  protected buffer: IFilterPresetBuffer;
  // The text of a preset edited as text, in the form.
  private expressionPanel: FilterExpressionPanel;
  private surveyValue: SurveyModel;
  private fieldsPanelValue: PanelModel;

  // New Preset starts with the conditions - or with the text, when one is given: the Filters dialog's
  // preset that does not decompose.
  constructor(protected owner: IFilterPresetDialogOwner, conditions?: Array<IFilterCondition>, expression?: string) {
    super();
    this.surveyValue = this.createSurvey();
    setupApplyOnEnter(this.surveyValue, (): void => { this.doEnterKey(); });
    if (!!(expression || "").trim()) {
      this.showBuffer({ title: "", conditions: null, expression: expression.trim() });
    } else if (conditions !== undefined) {
      this.showBuffer({ title: "", conditions: [].concat(conditions || []) });
    }
  }
  public getType(): string { return "filterpresetdialog"; }
  public get title(): string { return this.getString("filterAddPresetTitle"); }
  // The dialog lives while it is open: its captions are in the control's locale of that time.
  protected getString(name: string): string { return getLocaleString(name, this.owner.getLocale()); }
  // Whether the preset shown may be changed; a dialog that adds one always may.
  public get isReadOnly(): boolean { return false; }
  // The preset shown is edited as text.
  public get isTextMode(): boolean { return !!this.buffer && this.buffer.conditions === null; }
  // Whether the dialog's survey has anything to draw: the fields' editors or the AI description. A
  // renderer draws it only then.
  public get hasSurveyContent(): boolean { return !!this.editor || !!this.aiPrompt; }
  // Not while Create or Edit waits for the model: the answer would come for a dialog that is gone.
  public get canApply(): boolean {
    return !this.aiPrompt || !this.aiPrompt.isBusy;
  }
  // The preset as text: what the fields hold, as the fields write it.
  public editAsText(): void {
    if (this.isDisposed || !this.buffer || this.isTextMode || this.isReadOnly) return;
    this.saveBuffer();
    this.buffer.expression = this.owner.getConditionsExpression(this.buffer.conditions);
    this.buffer.conditions = null;
    this.showBuffer(this.buffer);
  }
  // The text as fields - only while it is the fields' kind of text (canEditAsFields).
  public editAsFields(): void {
    if (this.isDisposed || !this.isTextMode || this.isReadOnly) return;
    this.saveBuffer();
    const conditions = this.owner.parseExpressionConditions(this.buffer.expression);
    if (conditions === null) return;
    this.buffer.conditions = conditions;
    this.buffer.expression = undefined;
    this.showBuffer(this.buffer);
  }
  // The control's classes (the "filter" entry of the theme): the dialog is drawn outside the
  // control's own markup.
  public get cssClasses(): any { return this.owner.cssClasses || {}; }
  public get contentCss(): string { return toCssClasses(this.cssClasses.modalContent, this.cssClasses.presetContent); }
  public get formCss(): string { return toCssClasses(this.cssClasses.editor, this.cssClasses.presetForm); }
  public get editorCss(): string { return toCssClasses(this.cssClasses.editor, this.cssClasses.modalEditor); }
  // What a renderer draws under the form: the fields' editors in their frame and the AI description.
  // Its page is empty while there is neither.
  public get survey(): SurveyModel { return this.surveyValue; }
  // The control's isMobile, which may change while the dialog is open (a rotation, a resize).
  public setIsMobile(isMobile: boolean): void {
    if (this.isDisposed) return;
    this.surveyValue.setIsMobile(!!isMobile);
  }
  // Set by whoever shows the dialog: applies it the way its Apply does. Enter in the name or in a
  // field's text box calls it; the text of a preset is multi-line and keeps Enter for a new line.
  public onEnterKey: () => void;
  private doEnterKey(): void {
    if (!this.isDisposed && !!this.onEnterKey) {
      this.onEnterKey();
    }
  }
  // Checks the preset and adds it. false keeps the dialog open, with the errors shown in the form.
  public apply(): boolean {
    if (this.isDisposed || !this.canApply) return false;
    this.saveBuffer();
    if (!this.validateBuffer()) return false;
    if (this.isTextMode) {
      this.owner.addPresetFromConditions(this.buffer.title.trim(), [], { expression: this.buffer.expression });
    } else {
      this.owner.addPresetFromConditions(this.buffer.title.trim(), this.buffer.conditions);
    }
    return true;
  }
  // The dialog's survey goes last: the editor and the description take their panels out of it first.
  // The form before its text: the text's panel leaves a disposed survey alone, and taking it out of a
  // live one would report a change of the form.
  public dispose(): void {
    this.setAIPrompt(undefined, undefined);
    [this.editor, this.form, this.expressionPanel].forEach((part: { dispose(): void }): void => {
      if (!!part) part.dispose();
    });
    super.dispose();
    this.surveyValue.dispose();
  }

  // Shows a preset: a new form and new editors for it, the old form disposed once replaced. No
  // preset, no form.
  protected showBuffer(buffer: IFilterPresetBuffer): void {
    const oldForm = this.form;
    const oldPanel = this.expressionPanel;
    this.expressionPanel = undefined;
    this.buffer = buffer;
    this.form = !!buffer ? this.createForm() : undefined;
    this.replaceEditor();
    this.updateCanEditAsFields();
    if (!!oldForm) oldForm.dispose();
    if (!!oldPanel) oldPanel.dispose();
    this.updateAIPrompt(buffer);
  }
  // Whether the preset shown gets the AI description: one that may be changed, while the application
  // answers AI requests.
  protected canAskAI(buffer: IFilterPresetBuffer): boolean {
    return !!buffer && !this.isReadOnly && this.owner.canRequestAI;
  }
  // Reads what the form and the editors hold back into the preset shown.
  protected saveBuffer(): void {
    if (!this.buffer || !this.form) return;
    this.buffer.title = this.form.getValue("presetTitle") || "";
    if (this.buffer.conditions !== null) {
      this.buffer.conditions = !!this.editor ? this.editor.getConditions() : [];
    } else if (!!this.expressionPanel) {
      this.buffer.expression = this.expressionPanel.text;
    }
  }
  protected validateBuffer(): boolean {
    return this.form.validate(true, true);
  }
  // The titles the preset's may not repeat.
  protected getOtherTitles(): Array<string> {
    return this.owner.visiblePresets.map((preset: FilterPreset): string => preset.title);
  }
  // Called after every change the respondent makes in the form or the editors, and after an AI answer.
  protected onChanged(): void { }

  // The fields' tagbox; none while the preset is edited as text.
  private get fieldsQuestion(): Question { return !!this.form ? this.form.getQuestionByName("presetFields") : undefined; }
  // The fields the tagbox picks, in the order they were picked.
  private getPickedKeys(): Array<string> {
    const question = this.fieldsQuestion;
    const keys: Array<string> = !!question && Array.isArray(question.value) ? question.value : [];
    return keys.filter((key: string): boolean => !!key);
  }
  // The fields the conditions are on, in the order the Filters dialog shows them.
  private getConditionKeys(conditions: Array<IFilterCondition>): Array<string> {
    return this.owner.getAllFieldKeys().filter((key: string): boolean => {
      const field = this.owner.getFieldByName(key);
      return !!field && conditions.some((c: IFilterCondition): boolean => c.field === field.valueName);
    });
  }
  // The dialog's survey, in the outer survey's look (setUpDialogSurvey): a "fields" panel that holds
  // the fields' panels and is their frame (css.presetFields). The fields' panels are nested in it, but
  // drawn as they were on a page of their own: with the frame classes, which the editor's styles
  // reset, and not the nested ones.
  private createSurvey(): SurveyModel {
    const survey = new SurveyModel();
    setUpDialogSurvey(survey, { locale: this.owner.getLocale(), isMobile: !!this.owner.isMobile });
    const page = survey.addNewPage("page1");
    const fields = new PanelModel("fields");
    this.fieldsPanelValue = fields;
    survey.onUpdatePanelCssClasses.add((_: SurveyModel, options: any): void => {
      const classes = options.cssClasses.panel;
      if (options.panel === fields) {
        classes.container = toCssClasses(classes.container, (this.owner.cssClasses || {}).presetFields);
      } else if (options.panel.parent === fields) {
        classes.nested = classes.withFrame;
      }
    });
    page.addElement(fields);
    return survey;
  }
  // The editor for the fields picked now. The old one goes first: the new one's panels and values
  // have the same names in the same survey. The survey is read-only for a preset that is.
  private replaceEditor(): void {
    const page = this.surveyValue.pages[0];
    page.blockAnimations();
    this.fieldsPanelValue.blockAnimations();
    try {
      const old = this.editor;
      this.editor = undefined;
      if (!!old) old.dispose();
      this.surveyValue.mode = this.isReadOnly ? "display" : "edit";
      this.editor = !!this.buffer ? this.createEditor() : undefined;
    } finally {
      this.fieldsPanelValue.releaseAnimations();
      page.releaseAnimations();
    }
  }
  private createForm(): SurveyModel {
    // The title in a panel of its own, as the fields' tagbox is: a question that is not in a panel gets
    // a frame, and the mockup has none.
    const elements: Array<any> = [{ type: "panel", name: "presetName", title: this.getString("filterPresetName"), elements: [
      { type: "text", name: "presetTitle", titleLocation: "hidden", maxLength: filterPresetTitleMaxLength, textUpdateMode: "onTyping",
        autocomplete: "off" }] }];
    if (this.buffer.conditions !== null) {
      // The tagbox's hidden title is its accessible name.
      elements.push({ type: "panel", name: "contains", title: this.getString("filterPresetFieldsLabel"), elements: [
        { type: "tagbox", name: "presetFields", title: this.getString("filterPresetFieldsLabel"), titleLocation: "hidden",
          choices: this.getFieldChoices() }] });
    }
    // Before the elements exist: a panel asks for its title actions when it is first drawn.
    const onGetTitleActions = (_: SurveyModel, options: any): void => { this.addModeAction(options); };
    const form = new SurveyModel({ showNavigationButtons: false, showQuestionNumbers: "off", elements: elements });
    setupApplyOnEnter(form, (): void => { this.doEnterKey(); });
    form.onGetPanelTitleActions.add(onGetTitleActions);
    form.locale = this.owner.getLocale();
    // Inside the dialog with no frames of its own, as the fields' editors are.
    form.isCompact = true;
    if (this.isReadOnly) {
      form.mode = "display";
    }
    form.setValue("presetTitle", this.buffer.title);
    if (this.buffer.conditions === null) {
      this.expressionPanel = new FilterExpressionPanel(form, this.buffer.expression || "", { title: this.getString("filterPresetExpressionLabel"),
        readOnly: this.isReadOnly, index: form.pages[0].elements.length, onChanged: (): void => { this.updateCanEditAsFields(); } });
    }
    if (this.buffer.conditions !== null) {
      const keys = this.getConditionKeys(this.buffer.conditions);
      if (keys.length > 0) form.setValue("presetFields", keys);
    }
    // Listened to once it is filled: what it opens with is not a change.
    form.onValueChanged.add((_: SurveyModel, options: any): void => { this.onFormChanged(options.name); });
    form.onValidateQuestion.add((_: SurveyModel, options: any): void => {
      if (options.name === "presetTitle") options.error = this.getTitleError(options.value);
    });
    form.onValidatePanel.add((_: SurveyModel, options: any): void => {
      if (options.name === "contains" && this.buffer.conditions.length === 0) options.error = this.getString("filterPresetNoConditions");
    });
    return form;
  }
  // "Switch to Expression" in the title of the tagbox, "Switch to Fields" in the title of the text - a
  // link, as Show More is - where the preset may be changed. One of each per form: a panel's title toolbar
  // disposes its actions with the form.
  private addModeAction(options: any): void {
    if (this.isReadOnly) return;
    const name = options.panel.name;
    if (name !== "contains" && name !== "expression") return;
    const isText = name === "contains";
    const action = new Action({ id: isText ? "sv-filter-preset-edit-as-text" : "sv-filter-preset-edit-as-fields",
      title: this.getString(isText ? "filterEditAsText" : "filterEditAsFields"), innerCss: (this.owner.cssClasses || {}).link,
      appearance: { style: "brand", mode: "tertiary", size: "x-small" },
      action: (): void => { if (isText) { this.editAsText(); } else { this.editAsFields(); } } });
    if (!isText) {
      action.enabled = <any>new ComputedUpdater<boolean>((): boolean => this.canEditAsFields);
    }
    options.titleActions.push(action);
  }
  private notifyChanged(): void {
    if (!!this.aiPrompt) {
      this.aiPrompt.refresh();
    }
    this.onChanged();
  }
  // The same preset drawn anew keeps its description; another one gets a new, empty one. The old
  // description goes before the new one is made: both are the "prompt" value of the dialog's survey.
  // Its panel is added after the "fields" panel, so it stays last whenever the editor is made anew.
  private updateAIPrompt(buffer: IFilterPresetBuffer): void {
    if (buffer === this.aiPromptBuffer && !!this.aiPrompt && this.canAskAI(buffer)) {
      this.aiPrompt.refresh();
      return;
    }
    this.setAIPrompt(undefined, undefined);
    if (this.canAskAI(buffer)) {
      this.setAIPrompt(buffer, this.createAIPrompt(buffer));
    }
  }
  private createAIPrompt(buffer: IFilterPresetBuffer): FilterAIPrompt {
    return new FilterAIPrompt(this.owner.createAIRequest(), { survey: this.surveyValue, css: this.owner.cssClasses,
      getExpression: (): string => this.getFilterText(),
      onAnswer: (expression: string, title: string): void => { this.onAIAnswer(buffer, expression, title); } });
  }
  private setAIPrompt(buffer: IFilterPresetBuffer, prompt: FilterAIPrompt): void {
    const old = this.aiPrompt;
    this.aiPromptBuffer = buffer;
    this.aiPrompt = prompt;
    if (!!old) old.dispose();
  }
  // The filter the dialog holds now, as text: what Edit sends; "" for none.
  private getFilterText(): string {
    if (!this.buffer) return "";
    if (this.isTextMode) return ((!!this.expressionPanel ? this.expressionPanel.text : this.buffer.expression) || "").trim();
    const conditions = !!this.editor ? this.editor.getConditions() : [];
    return conditions.length > 0 ? this.owner.getConditionsExpression(conditions) : "";
  }
  // The model's filter is the preset's now - as fields where it decomposes, as text otherwise - and an
  // empty name is the model's title (makeFilterAITitle): an edit like any other.
  private onAIAnswer(buffer: IFilterPresetBuffer, expression: string, title: string): void {
    if (this.isDisposed || buffer !== this.buffer) return;
    this.saveBuffer();
    const conditions = this.owner.parseExpressionConditions(expression);
    buffer.conditions = conditions;
    buffer.expression = conditions === null ? expression : undefined;
    if (!(buffer.title || "").trim()) {
      buffer.title = makeFilterAITitle(title, this.getFieldTitlesOf(expression), this.getOtherTitles());
    }
    this.showBuffer(buffer);
    this.notifyChanged();
  }
  // The titles of the fields a text names, in the order the Filters dialog shows the fields.
  private getFieldTitlesOf(expression: string): Array<string> {
    const names = new ExpressionRunner(expression).getVariables();
    return this.owner.getAllFieldKeys().map((key: string) => this.owner.getFieldByName(key))
      .filter((field: any): boolean => !!field && names.indexOf(field.valueName) > -1)
      .map((field: any): string => getFilterFieldTitle(field));
  }
  private updateCanEditAsFields(): void {
    this.canEditAsFields = this.isTextMode && !!this.expressionPanel && this.owner.parseExpressionConditions(this.expressionPanel.text) !== null;
  }
  // Every field, by its title, in the order the Filters dialog shows them.
  private getFieldChoices(): Array<any> {
    return this.owner.getAllFieldKeys().map((key: string): any => {
      const field = this.owner.getFieldByName(key);
      return { value: key, text: getFilterFieldTitle(field) };
    });
  }
  private onFormChanged(name: string): void {
    if (name === "presetFields") {
      this.updateEditor();
    }
    this.notifyChanged();
  }
  // The fields picked changed: the editors are made anew for them, each keeping the condition it had;
  // a field that is new to them starts empty, one taken out takes its condition away.
  private updateEditor(): void {
    const keys = this.getPickedKeys();
    const conditions = !!this.editor ? this.editor.getConditions() : (this.buffer.conditions || []);
    const valueNames = keys.map((key: string): string => this.owner.getFieldByName(key).valueName);
    this.buffer.conditions = conditions.filter((c: IFilterCondition): boolean => valueNames.indexOf(c.field) > -1);
    this.replaceEditor();
  }
  private createEditor(): FilterConditionsEditor {
    const keys = !!this.form ? this.getPickedKeys() : [];
    if (keys.length === 0 || this.buffer.conditions === null) return undefined;
    // The fields start with the preset's conditions, not the filter's.
    const editorOwner = createFilterEditorOwner(this.owner, (): Array<IFilterCondition> => this.buffer.conditions || []);
    return new FilterConditionsEditor(editorOwner, keys, { survey: this.surveyValue, panel: this.fieldsPanelValue,
      readOnly: this.isReadOnly, showFieldTitles: true,
      useFieldKinds: true, linkCss: (this.owner.cssClasses || {}).link, onFieldChanged: (): void => { this.notifyChanged(); } });
  }
  protected getTitleError(value: any, otherTitles: Array<string> = this.getOtherTitles()): string {
    return getFilterPresetTitleError(value, otherTitles, this.owner.getLocale());
  }
}

// What the Edit Preset dialog reads from the control and calls on it besides what adding takes.
export interface IFilterEditPresetDialogOwner extends IFilterPresetDialogOwner {
  getEditablePresets(): Array<FilterPreset>;
  getPresetConditions(name: string): Array<IFilterCondition> | null;
  canEditPreset(preset: FilterPreset): boolean;
  canDeletePreset(preset: FilterPreset): boolean;
  applyPresetEdits(edits: Array<IFilterPresetEdit>): void;
}

// The Edit Preset dialog: the preset picked in the Filters dialog (Edit Selected..., Edit... at its
// text), if the respondent may change or delete it (getEditablePresets), in New Preset's form - read-only
// where it may not be edited, as text where it does not decompose. Delete, where the preset may be
// deleted (canDelete), takes it away at once (deletePreset) and the dialog closes. Apply checks the
// preset and writes it as one change (applyPresetEdits) - once the respondent changed it: a preset nobody
// touched is what the control has, so an authored title longer than a typed one may be, or one two
// authored presets share, does not keep the dialog open. Nothing reaches the control before either.
export class FilterEditPresetDialog extends FilterPresetDialog {
  private isTouched: boolean;

  constructor(owner: IFilterEditPresetDialogOwner, presetName: string) {
    super(owner);
    this.isTouched = false;
    const preset = owner.getEditablePresets().filter((i: FilterPreset): boolean => i.name === presetName)[0];
    if (!!preset) {
      const conditions = owner.getPresetConditions(preset.name);
      this.showBuffer({ preset: preset, title: preset.title, conditions: conditions,
        expression: conditions === null ? (preset.expression || "").trim() : undefined });
    }
  }
  public getType(): string { return "filtereditpresetdialog"; }
  public get title(): string { return this.getString("filterEditPreset"); }
  // The preset edited; undefined for a name that is no preset the respondent may change or delete:
  // there is nothing to show then, and the control does not open the dialog.
  public get preset(): FilterPreset { return !!this.buffer ? this.buffer.preset : undefined; }
  public get isReadOnly(): boolean {
    return !!this.preset && !this.editOwner.canEditPreset(this.preset);
  }
  // Whether the footer has Delete, in Cancel's place.
  public get canDelete(): boolean { return !!this.preset && this.editOwner.canDeletePreset(this.preset); }
  // Deletes the preset, whatever was typed and while Edit waits for the model too; true when it did -
  // the dialog closes then.
  public deletePreset(): boolean {
    if (this.isDisposed || !this.canDelete) return false;
    this.editOwner.applyPresetEdits([{ name: this.preset.name, isDeleted: true }]);
    return true;
  }
  // Checks the preset and writes it. false keeps the dialog open: while Edit waits for the model
  // (canApply), and with the errors shown in the form.
  public apply(): boolean {
    if (this.isDisposed || !this.canApply) return false;
    if (!this.preset || this.isReadOnly || !this.isTouched) return true;
    this.saveBuffer();
    if (!this.validateBuffer()) return false;
    const edit: IFilterPresetEdit = { name: this.preset.name, title: this.buffer.title.trim() };
    if (this.isTextMode) {
      edit.expression = (this.buffer.expression || "").trim();
    } else {
      edit.conditions = this.buffer.conditions;
    }
    this.editOwner.applyPresetEdits([edit]);
    return true;
  }

  // The preset may keep its own title.
  protected getOtherTitles(): Array<string> {
    const preset = this.preset;
    return this.owner.visiblePresets.filter((i: FilterPreset): boolean => i !== preset).map((i: FilterPreset): string => i.title);
  }
  protected onChanged(): void {
    this.isTouched = true;
  }

  private get editOwner(): IFilterEditPresetDialogOwner { return <IFilterEditPresetDialogOwner>this.owner; }
}
