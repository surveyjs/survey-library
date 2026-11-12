import { HashTable, Helpers } from "./helpers";
import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { LocalizableString } from "./localizablestring";
import { Question, QuestionValueType, IVerifyDataContext } from "./question";
import { QuestionFactory } from "./questionfactory";
import { SurveyError } from "./survey-error";
import { CustomError, PatternIncompleteError } from "./error";
import { InputMaskBase } from "./mask/mask_base";
import { InputElementAdapter } from "./mask/input_element_adapter";
import { PopupModel } from "./popup";
import { Action } from "./actions/action";
import { ActionContainer } from "./actions/container";
import { CalendarModel } from "./calendar/calendar";
import { parseISODate } from "./calendar/date-utils";
import { toCssClasses } from "./utils/cssClassBuilder";

function toISODate(val: any): Date {
  return parseISODate(typeof val === "string" ? val.substring(0, 10) : val);
}
function isRangeValue(val: any): boolean {
  return Array.isArray(val) && val.length === 2 && !!parseISODate(val[0]) && !!parseISODate(val[1]) && val[0] <= val[1];
}

export class QuestionDateTimePickerModel extends Question {
  private inputElements: Array<HTMLInputElement> = [];
  private maskInputAdapters: Array<InputElementAdapter> = [];
  private endMaskValue: InputMaskBase;
  private doNotUpdateInputValue: boolean = false;
  private calendarValue: CalendarModel;
  private popupModelValue: PopupModel;
  private editorButtonsValue: ActionContainer;

  constructor(name: string) {
    super(name);
    this.setPropertyValue("maskSettings", this.createMaskSettings());
    this.calendarValue = new CalendarModel();
    this.calendarValue.onValueChanged.add((_, options) => {
      this.value = this.calendarToQuestionValue(options.value);
    });
    this.calendarValue.onRangeStartSelected.add((_, options) => {
      this._startInputValue = this.maskSettings.getMaskedValue(Helpers.convertDateToString(options.date));
      this._endInputValue = undefined;
      this.onRangeInputChanged();
    });
    this.calendarValue.onSelectionCompleted.add(() => {
      this.popupModel.hide();
    });
  }
  public getType(): string {
    return "datetimepicker";
  }
  public getValueType(): QuestionValueType {
    return this.range ? "array" : "string";
  }

  @property({ defaultValue: "date" }) pickerType: string;
  @property({ defaultValue: false }) range: boolean;
  @property({ defaultValue: true }) allowClear: boolean;
  @property({ localizable: true }) placeholder: string;
  @property({ localizable: true }) startPlaceholder: string;
  @property({ localizable: true }) endPlaceholder: string;
  @property() pattern: string;
  @property() minValueExpression: string;
  @property() maxValueExpression: string;
  @property({ localizable: { defaultStr: "minError", markdown: true } }) minErrorText: string;
  @property({ localizable: { defaultStr: "maxError", markdown: true } }) maxErrorText: string;
  @property({ localizable: { defaultStr: "dateRangeError", markdown: true } }) rangeErrorText: string;
  @property() _inputValue: string;
  @property() _startInputValue: string;
  @property() _endInputValue: string;

  public get min(): string {
    return this.getPropertyValue("min");
  }
  public set min(val: string) {
    if (this.isValueExpression(val)) {
      this.minValueExpression = val.substring(1);
      return;
    }
    this.setPropertyValue("min", val);
  }
  public get max(): string {
    return this.getPropertyValue("max");
  }
  public set max(val: string) {
    if (this.isValueExpression(val)) {
      this.maxValueExpression = val.substring(1);
      return;
    }
    this.setPropertyValue("max", val);
  }
  public get renderedMin(): string {
    return this.getPropertyValue("renderedMin");
  }
  public get renderedMax(): string {
    return this.getPropertyValue("renderedMax");
  }

  // The mask is internal: only the pattern is serialized, min and max come from the question.
  // The question changes the mask explicitly instead of listening to it, because a change of
  // the format and a change of the limits need different updates.
  public get maskSettings(): InputMaskBase {
    return this.getPropertyValue("maskSettings");
  }
  private createMaskSettings(): InputMaskBase {
    const mask = Serializer.createClass("datetimemask");
    mask.owner = this;
    return mask;
  }
  // Each input element adapter keeps its own entry state in the mask, so the end field gets a copy of maskSettings.
  private get endMask(): InputMaskBase {
    if (!this.endMaskValue) {
      const mask = Serializer.createClass("datetimemask");
      mask.owner = this;
      mask.setData(this.maskSettings.getData());
      this.endMaskValue = mask;
    }
    return this.endMaskValue;
  }
  private applyPattern(): void {
    (<any>this.maskSettings).pattern = this.pattern || undefined;
  }
  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    this.applyPattern();
    this.onMaskFormatChanged();
  }
  private disposeEndMask(): void {
    if (!!this.endMaskValue) {
      this.endMaskValue.dispose();
      this.endMaskValue = undefined;
    }
  }
  private onMaskFormatChanged(): void {
    this.disposeEndMask();
    this.updateInputValue();
    if (this.maskInputAdapters.length > 0) {
      this.createMaskAdapters();
    }
  }
  // The masks read min and max on every input, and the adapters refresh themselves on a mask
  // property change, so the limits do not recreate the adapters and do not break an entry in progress.
  private updateMaskLimits(): void {
    const min = this.toMaskLimit(this.renderedMin);
    const max = this.toMaskLimit(this.renderedMax);
    [<any>this.maskSettings, <any>this.endMaskValue].forEach(mask => {
      if (!mask) return;
      if (mask.min !== min) mask.min = min;
      if (mask.max !== max) mask.max = max;
    });
  }
  private toMaskLimit(val: string): string {
    const date = toISODate(val);
    return !!date ? Helpers.convertDateToString(date) : undefined;
  }

  public get calendar(): CalendarModel {
    return this.calendarValue;
  }
  public getRootClass(): string {
    return toCssClasses(
      this.cssClasses.root,
      this.range && this.cssClasses.rootRange,
      this.hasCssError() && this.cssClasses.onError,
      this.isDisabledStyle && this.cssClasses.rootDisabled,
      this.isReadOnlyStyle && this.cssClasses.rootReadOnly,
      this.isPreviewStyle && this.cssClasses.rootPreview
    );
  }
  public getControlClass(): string {
    return this.cssClasses.control;
  }
  public get startInputId(): string {
    return this.inputId;
  }
  public get endInputId(): string {
    return this.inputId + "_end";
  }
  public get rangeSeparatorText(): string {
    return "\u2013";
  }
  private getRenderedText(text: string): string {
    return this.hasInputText(text) ? text : "";
  }
  public get renderedInputValue(): string {
    return this.getRenderedText(this._inputValue);
  }
  public get renderedStartInputValue(): string {
    return this.getRenderedText(this._startInputValue);
  }
  public get renderedEndInputValue(): string {
    return this.getRenderedText(this._endInputValue);
  }
  public get renderedPlaceholder(): string {
    return this.placeholder || this.emptyInputText;
  }
  public get renderedStartPlaceholder(): string {
    return this.startPlaceholder || this.emptyInputText;
  }
  public get renderedEndPlaceholder(): string {
    return this.endPlaceholder || this.emptyInputText;
  }
  public get popupModel(): PopupModel {
    if (!this.popupModelValue) {
      this.popupModelValue = new PopupModel("sv-calendar", { model: this.calendar },
        { verticalPosition: "bottom", horizontalPosition: "center", showPointer: false });
      this.popupModelValue.cssClass = this.cssClasses?.popup || "";
      this.popupModelValue.positionMode = "fixed";
      this.popupModelValue.isFocusedContainer = false;
      this.popupModelValue.locale = this.getLocale();
      this.popupModelValue.onVisibilityChanged.add((_, options: { isVisible: boolean }) => {
        if (options.isVisible) {
          this.updateCalendarValue();
          this.calendar.resetView();
        }
        const button = this.editorButtons.getActionById("calendar");
        if (!!button) {
          button.popupActive = options.isVisible;
        }
      });
    }
    return this.popupModelValue;
  }
  public togglePopup(): void {
    if (this.popupModel.isVisible) {
      this.popupModel.hide();
    } else if (!this.isInputReadOnly) {
      this.popupModel.show();
    }
  }

  public get locOpenCalendarCaption(): LocalizableString {
    return this.getLocalizableString("openCalendarCaption") || this.createLocalizableString("openCalendarCaption", this, false, true);
  }
  public get locClearCaption(): LocalizableString {
    return this.getLocalizableString("clearCaption") || this.createLocalizableString("clearCaption", this, false, true);
  }
  public get editorButtons(): ActionContainer {
    if (!this.editorButtonsValue) {
      const container = new ActionContainer();
      container.locOwner = this;
      container.containerCss = this.cssClasses?.group;
      container.setActionsAppearance({ mode: "tertiary", style: "neutral", size: "small" });
      container.setItems([
        new Action({
          id: "clear",
          css: "sd-editor-clean-button",
          iconName: this.cssClasses?.cleanButtonIconId || "icon-cancel-24x24",
          iconSize: "auto",
          showTitle: false,
          locTitle: this.locClearCaption,
          disableTabStop: true,
          enabled: !this.isInputReadOnly,
          visible: this.isClearButtonVisible,
          action: () => this.clearInput()
        }),
        new Action({
          id: "calendar",
          css: "sd-editor-calendar-button",
          iconName: this.cssClasses?.calendarButtonIconId || "icon-calendar-24x24",
          iconSize: "auto",
          showTitle: false,
          locTitle: this.locOpenCalendarCaption,
          disableTabStop: true,
          enabled: !this.isInputReadOnly,
          action: () => this.togglePopup()
        })
      ]);
      this.editorButtonsValue = container;
    }
    return this.editorButtonsValue;
  }
  private get isClearButtonVisible(): boolean {
    if (!this.allowClear || this.isReadOnly) return false;
    if (!this.isEmpty()) return true;
    return this.range && (this.hasInputText(this._startInputValue) || this.hasInputText(this._endInputValue));
  }
  private updateEditorButtons(): void {
    if (!this.editorButtonsValue) return;
    this.editorButtonsValue.actions.forEach(action => action.setEnabled(!this.isInputReadOnly));
    this.editorButtonsValue.getActionById("clear").setVisible(this.isClearButtonVisible);
  }
  public clearInput(): void {
    this._inputValue = undefined;
    this._startInputValue = undefined;
    this._endInputValue = undefined;
    this.clearValueFromUI();
    this.updateInputValue();
    this.updateCalendarValue();
    this.updateEditorButtons();
  }

  private get emptyInputText(): string {
    return this.maskSettings.getMaskedValue("");
  }
  private hasInputText(text: string): boolean {
    return !!text && text !== this.emptyInputText;
  }
  // The ISO date of a complete and correct entry; undefined otherwise.
  private getInputISODate(text: string): string {
    if (!text) return undefined;
    const value = this.maskSettings.getUnmaskedValue(text);
    return !!value && !!parseISODate(value) ? value : undefined;
  }
  private isInputIncomplete(text: string): boolean {
    return this.hasInputText(text) && !this.getInputISODate(text);
  }
  private normalizeInputText(text: string): string {
    const iso = this.getInputISODate(text);
    return !!iso ? this.maskSettings.getMaskedValue(iso) : text;
  }

  public get inputValue(): string {
    return this._inputValue || this.emptyInputText;
  }
  public set inputValue(val: string) {
    let value: string = this.maskSettings.getUnmaskedValue(val);
    const isIncomplete = !value;
    this._inputValue = isIncomplete ? val : this.maskSettings.getMaskedValue(value);
    if (isIncomplete) value = undefined;
    if (!Helpers.isTwoValueEquals(this.value, value, false, true, false)) {
      this.doNotUpdateInputValue = isIncomplete;
      this.value = value;
      this.doNotUpdateInputValue = false;
    }
  }
  public get startInputValue(): string {
    return this._startInputValue || this.emptyInputText;
  }
  public set startInputValue(val: string) {
    this._startInputValue = this.normalizeInputText(val);
    this.onRangeInputChanged(this.getInputISODate(val));
  }
  public get endInputValue(): string {
    return this._endInputValue || this.emptyInputText;
  }
  public set endInputValue(val: string) {
    this._endInputValue = this.normalizeInputText(val);
    this.onRangeInputChanged(this.getInputISODate(val));
  }
  // The fields are drafts: the value is [start, end] only while both are complete and ordered.
  private onRangeInputChanged(viewISODate?: string): void {
    const start = this.getInputISODate(this._startInputValue);
    const end = this.getInputISODate(this._endInputValue);
    const value = !!start && !!end && start <= end ? [start, end] : undefined;
    if (!Helpers.isTwoValueEquals(this.value, value, false, true, false)) {
      this.doNotUpdateInputValue = true;
      this.value = value;
      this.doNotUpdateInputValue = false;
    }
    this.updateCalendarValue(viewISODate);
    this.updateEditorButtons();
  }
  private updateInputValue(): void {
    if (this.doNotUpdateInputValue) return;
    const value = this.value;
    if (this.range) {
      const hasValue = Array.isArray(value);
      this._startInputValue = hasValue ? this.maskSettings.getMaskedValue(value[0]) : undefined;
      this._endInputValue = hasValue ? this.maskSettings.getMaskedValue(value[1]) : undefined;
    } else {
      this._inputValue = this.maskSettings.getMaskedValue(typeof value === "string" ? value : "");
    }
    this.updateMaskAdapterValues();
  }
  private calendarToQuestionValue(val: any): any {
    if (Array.isArray(val)) return val.map(date => Helpers.convertDateToString(date));
    return !!val ? Helpers.convertDateToString(val) : undefined;
  }
  private updateCalendarValue(viewISODate?: string): void {
    if (this.range) {
      const value = isRangeValue(this.value) ? this.value : undefined;
      const start = this.getInputISODate(this._startInputValue);
      const hasEnd = !!this.getInputISODate(this._endInputValue);
      this.calendar.value = !!value ? [toISODate(value[0]), toISODate(value[1])] : undefined;
      this.calendar.setRangeStart(!value && !!start && !hasEnd ? toISODate(start) : undefined);
      const viewDate = toISODate(viewISODate);
      if (!!viewDate) {
        this.calendar.viewDate = viewDate;
      }
      return;
    }
    const date = toISODate(this.value);
    this.calendar.value = date;
    if (!!date) {
      this.calendar.viewDate = date;
    }
  }
  private onRangeChanged(): void {
    this.calendar.range = this.range;
    if (this.isLoadingFromJson) return;
    this._inputValue = undefined;
    this._startInputValue = undefined;
    this._endInputValue = undefined;
    const val = this.value;
    let newValue: any = undefined;
    if (this.range) {
      if (!!parseISODate(val)) newValue = [val, val];
    } else if (Array.isArray(val) && !!parseISODate(val[0])) {
      newValue = val[0];
    }
    if (!Helpers.isTwoValueEquals(this.value, newValue)) {
      this.value = newValue;
    }
    this.updateInputValue();
    this.updateCalendarValue();
    this.updateEditorButtons();
    if (this.maskInputAdapters.length > 0) {
      this.createMaskAdapters();
    }
  }
  protected onChangeQuestionValue(newValue: any): void {
    super.onChangeQuestionValue(newValue);
    this.updateInputValue();
    this.updateCalendarValue();
    this.updateEditorButtons();
  }
  protected onSetData(): void {
    if (this.maskSettings.updateFormatFromSurvey()) {
      this.onMaskFormatChanged();
    }
    super.onSetData();
  }
  public localeChanged(): void {
    // The drafts are read in the current format before the mask switches to the new one.
    const drafts = [this.getInputISODate(this._startInputValue), this.getInputISODate(this._endInputValue)];
    super.localeChanged();
    this.maskSettings.localeChanged();
    this.onMaskFormatChanged();
    if (this.range) {
      this._startInputValue = !!drafts[0] ? this.maskSettings.getMaskedValue(drafts[0]) : undefined;
      this._endInputValue = !!drafts[1] ? this.maskSettings.getMaskedValue(drafts[1]) : undefined;
    }
    if (!!this.popupModelValue) {
      this.popupModelValue.locale = this.getLocale();
    }
  }
  protected onReadOnlyChanged(): void {
    super.onReadOnlyChanged();
    if (this.isInputReadOnly && !!this.popupModelValue) {
      this.popupModelValue.hide();
    }
    this.updateEditorButtons();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (["min", "max", "minValueExpression", "maxValueExpression"].indexOf(name) > -1) {
      this.setRenderedMinMax();
    }
    if (name === "range") {
      this.onRangeChanged();
    }
    if (name === "pattern") {
      this.applyPattern();
      this.onMaskFormatChanged();
    }
    if (["value", "allowClear"].indexOf(name) > -1) {
      this.updateEditorButtons();
    }
  }

  public onSurveyLoad(): void {
    super.onSurveyLoad();
    this.calendar.range = this.range;
    this.setRenderedMinMax();
    this.updateInputValue();
    this.updateCalendarValue();
    this.updateEditorButtons();
  }
  protected runConditionCore(properties: HashTable<any>): void {
    super.runConditionCore(properties);
    if (!!this.minValueExpression || !!this.maxValueExpression) {
      this.setRenderedMinMax(properties);
    }
  }
  private setRenderedMinMax(properties: HashTable<any> = null): void {
    const setMin = (val: any): void => {
      this.setPropertyValue("renderedMin", Helpers.convertValToQuestionVal(val, "date"));
      this.calendar.min = toISODate(this.renderedMin);
    };
    const setMax = (val: any): void => {
      this.setPropertyValue("renderedMax", Helpers.convertValToQuestionVal(val, "date"));
      this.calendar.max = toISODate(this.renderedMax);
    };
    if (!this.runExpressionByProperty("minValueExpression", properties, setMin)) {
      setMin(this.min);
    }
    if (!this.runExpressionByProperty("maxValueExpression", properties, setMax)) {
      setMax(this.max);
    }
    this.updateMaskLimits();
  }

  private isMaskInputIncomplete(): boolean {
    if (this.range) return this.isInputIncomplete(this._startInputValue) || this.isInputIncomplete(this._endInputValue);
    return this.isEmpty() && this.hasInputText(this._inputValue);
  }
  private get isRangeReversed(): boolean {
    if (!this.range) return false;
    const start = this.getInputISODate(this._startInputValue);
    const end = this.getInputISODate(this._endInputValue);
    return !!start && !!end && start > end;
  }
  // The dates to check against min and max: the value, or both complete fields in range mode.
  private getCheckedDates(): Array<Date> {
    const dates = this.range
      ? [this.getInputISODate(this._startInputValue), this.getInputISODate(this._endInputValue)]
      : [this.value];
    return dates.map(val => toISODate(val)).filter(date => !!date);
  }
  private get isValueLessMin(): boolean {
    const min = toISODate(this.renderedMin);
    return !!min && this.getCheckedDates().some(date => date.getTime() < min.getTime());
  }
  private get isValueGreaterMax(): boolean {
    const max = toISODate(this.renderedMax);
    return !!max && this.getCheckedDates().some(date => date.getTime() > max.getTime());
  }
  private getMinMaxErrorText(errorText: string, value: string): string {
    if (Helpers.isValueEmpty(value)) return errorText;
    return errorText.replace("{0}", this.maskSettings.getMaskedValue(Helpers.convertDateToString(toISODate(value))));
  }
  private createUpdatableError(getText: () => string): SurveyError {
    const error = new CustomError(getText(), this);
    error.onUpdateErrorTextCallback = err => { err.text = getText(); };
    return error;
  }
  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged, fireCallback);
    const removeRequiredError = (): void => {
      const reqIdx = errors.findIndex(e => e.getErrorType() === "required");
      if (reqIdx >= 0) errors.splice(reqIdx, 1);
    };
    if (this.isMaskInputIncomplete()) {
      removeRequiredError();
      errors.push(new PatternIncompleteError(null, this));
    } else if (this.isRangeReversed) {
      removeRequiredError();
      errors.push(this.createUpdatableError(() => this.rangeErrorText));
    }
    if (this.isValueLessMin) {
      errors.push(this.createUpdatableError(() => this.getMinMaxErrorText(this.minErrorText, this.renderedMin)));
    }
    if (this.isValueGreaterMax) {
      errors.push(this.createUpdatableError(() => this.getMinMaxErrorText(this.maxErrorText, this.renderedMax)));
    }
  }
  protected verifyValueCore(val: any, context: IVerifyDataContext): boolean {
    if (!super.verifyValueCore(val, context)) return false;
    if (Helpers.isValueEmpty(val)) return true;
    if (this.range ? isRangeValue(val) : !!parseISODate(val)) return true;
    if (context.checks.reportInvalidValueTypes) {
      context.addIssue("invalidValueType", undefined, val, this);
    }
    return false;
  }

  private setInputText(target: any, text: string): void {
    if (!this.range) {
      this.inputValue = text;
      return;
    }
    const index = this.inputElements.indexOf(target);
    if (index === 0) {
      this.startInputValue = text;
    } else if (index === 1) {
      this.endInputValue = text;
    }
  }
  protected onBlurCore(event: any): void {
    const target = event?.target;
    if (!!target && typeof target.value === "string") {
      this.setInputText(target, target.value);
    }
    super.onBlurCore(event);
  }
  public onKeyUp = (event: any): void => {
    const target = event?.target;
    if (!!target && typeof target.value === "string" && !!this.getInputISODate(target.value)) {
      this.setInputText(target, target.value);
    }
  };
  private createMaskAdapters(): void {
    this.deleteMaskAdapters();
    const elements = this.inputElements;
    if (this.range) {
      const value = Array.isArray(this.value) ? this.value : [];
      if (!!elements[0]) {
        this.maskInputAdapters.push(new InputElementAdapter(this.maskSettings, elements[0], value[0]));
      }
      if (!!elements[1]) {
        this.maskInputAdapters.push(new InputElementAdapter(this.endMask, elements[1], value[1]));
      }
    } else if (!!elements[0]) {
      this.maskInputAdapters.push(new InputElementAdapter(this.maskSettings, elements[0], this.value));
    }
  }
  private deleteMaskAdapters(): void {
    this.maskInputAdapters.forEach(adapter => adapter.dispose());
    this.maskInputAdapters = [];
  }
  private updateMaskAdapterValues(): void {
    if (this.maskInputAdapters.length === 0) return;
    const values = this.range ? (Array.isArray(this.value) ? this.value : []) : [this.value];
    this.maskInputAdapters.forEach((adapter, index) => adapter.updateInputElementValue(values[index]));
  }
  public afterRenderQuestionElement(el: HTMLElement): void {
    if (!!el) {
      const inputs = el instanceof HTMLInputElement ? [el] : Array.prototype.slice.call(el.querySelectorAll("input"));
      this.inputElements = inputs.slice(0, 2);
      this.createMaskAdapters();
    }
    super.afterRenderQuestionElement(el);
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    this.deleteMaskAdapters();
    this.inputElements = [];
    super.beforeDestroyQuestionElement(el);
  }
  public dispose(): void {
    this.deleteMaskAdapters();
    this.disposeEndMask();
    if (!!this.popupModelValue) {
      this.popupModelValue.dispose();
      this.popupModelValue = undefined;
    }
    if (!!this.editorButtonsValue) {
      this.editorButtonsValue.dispose();
      this.editorButtonsValue = undefined;
    }
    this.calendarValue.dispose();
    super.dispose();
  }
}

function getCorrectMinMax(min: any, max: any, isMax: boolean): any {
  const val = isMax ? max : min;
  const dMin = toISODate(min);
  const dMax = toISODate(max);
  if (!dMin || !dMax) return val;
  if (dMin.getTime() > dMax.getTime()) return isMax ? min : max;
  return val;
}
const isRangeMode = (obj: any): boolean => !!obj && !!obj.range;

Serializer.addClass(
  "datetimepicker",
  [
    { name: "pickerType", default: "date", choices: ["date"] },
    { name: "range:boolean", default: false },
    {
      name: "min",
      onSettingValue: (obj: any, val: any): any => getCorrectMinMax(val, obj.max, false)
    },
    {
      name: "max",
      nextToProperty: "*min",
      onSettingValue: (obj: any, val: any): any => getCorrectMinMax(obj.min, val, true)
    },
    "minValueExpression:expression",
    "maxValueExpression:expression",
    { name: "minErrorText", serializationProperty: "locMinErrorText" },
    { name: "maxErrorText", serializationProperty: "locMaxErrorText" },
    { name: "rangeErrorText", serializationProperty: "locRangeErrorText", dependsOn: "range", visibleIf: isRangeMode },
    { name: "placeholder", serializationProperty: "locPlaceholder" },
    { name: "startPlaceholder", serializationProperty: "locStartPlaceholder", dependsOn: "range", visibleIf: isRangeMode },
    { name: "endPlaceholder", serializationProperty: "locEndPlaceholder", dependsOn: "range", visibleIf: isRangeMode },
    "pattern",
    { name: "allowClear:boolean", default: true }
  ],
  () => new QuestionDateTimePickerModel(""),
  "question"
);
QuestionFactory.Instance.registerQuestion("datetimepicker", (name: string) => {
  return new QuestionDateTimePickerModel(name);
});
