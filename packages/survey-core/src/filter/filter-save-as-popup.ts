import { Base } from "../base";
import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { SurveyModel } from "../survey";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { FilterPreset, filterPresetTitleMaxLength, getFilterPresetTitleError } from "./filter-preset";
import { filterPopupFooterAppearance } from "./filter-field-popup";
import { getLocaleString } from "../surveyStrings";
// The name is a text question: registered with the serializer before a survey of one is made.
import "../question_text";

// What "Save as..." reads from the control and calls on it: the control's public API only.
export interface IFilterSaveAsPopupOwner {
  visiblePresets: Array<FilterPreset>;
  ownConditions: Array<IFilterCondition>;
  ownRawExpression: string;
  addPresetFromConditions(title: string, conditions: Array<IFilterCondition>, options?: { expression?: string }): FilterPreset;
  togglePreset(preset: FilterPreset | string): void;
  getLocale(): string;
  cssClasses: any;
}

// The content of the popup "Save as..." opens: the new preset's name and Save, which adds a preset
// of the respondent's own with the conditions they set and turns it on. The name is checked as a
// preset dialog checks it - given, not too long and no other preset's - and an error keeps the popup
// open. The name is a text question of a small survey of its own, drawn as an editor page, so its
// error shows as a question's does. Made when the popup shows, disposed when it hides.
export class FilterSaveAsPopup extends Base {
  private surveyValue: SurveyModel;
  private footerToolbarValue: ActionContainer;

  constructor(private owner: IFilterSaveAsPopupOwner, private close: () => void) {
    super();
    // The name in a panel, as a preset dialog's is: a question that is not in a panel gets a frame.
    const name = getLocaleString("filterPresetName", owner.getLocale());
    const survey = new SurveyModel({ showNavigationButtons: false, showQuestionNumbers: "off", elements: [
      { type: "panel", name: "presetName", elements: [
        { type: "text", name: "presetTitle", title: name, titleLocation: "hidden",
          placeholder: name, maxLength: filterPresetTitleMaxLength, textUpdateMode: "onTyping" }] }] });
    survey.locale = owner.getLocale();
    // Inside the popup with no frame of its own, as a popup's operator and value are.
    survey.isCompact = true;
    survey.onValidateQuestion.add((_: SurveyModel, options: any): void => {
      options.error = getFilterPresetTitleError(options.value, this.getTitles(), this.owner.getLocale());
    });
    this.surveyValue = survey;
    this.footerToolbarValue = new ActionContainer();
    this.footerToolbarValue.setActionsAppearance(filterPopupFooterAppearance);
    this.footerToolbarValue.setItems([new Action({ id: "sv-filter-save-as-save", title: getLocaleString("filterSaveAsSave", owner.getLocale()),
      action: (): void => { this.save(); } })], false);
  }
  public getType(): string { return "filtersaveaspopup"; }
  // The survey of the name: what a renderer draws as an editor page.
  public get survey(): SurveyModel { return this.surveyValue; }
  // Save.
  public get footerToolbar(): ActionContainer { return this.footerToolbarValue; }
  // The control's classes (the "filter" entry of the theme): the popup is drawn outside the
  // control's own markup.
  public get cssClasses(): any { return this.owner.cssClasses; }
  // Adds the preset and closes the popup; with a name that will not do, shows why and stays open.
  // Nothing once the popup is gone: a second click can arrive after the first one closed it.
  public save(): boolean {
    if (this.isDisposed || !this.surveyValue.validate(true)) return false;
    const title = (this.surveyValue.getValue("presetTitle") || "").toString().trim();
    // A filter applied as a text the fields cannot show is saved as that text.
    const raw = this.owner.ownRawExpression;
    const preset = this.owner.addPresetFromConditions(title, this.owner.ownConditions || [], raw !== undefined ? { expression: raw } : undefined);
    if (!preset) return false;
    this.owner.togglePreset(preset);
    this.close();
    return true;
  }
  public dispose(): void {
    this.footerToolbarValue.dispose();
    this.surveyValue.dispose();
    super.dispose();
  }
  private getTitles(): Array<string> {
    return this.owner.visiblePresets.map((preset: FilterPreset): string => preset.title);
  }
}
