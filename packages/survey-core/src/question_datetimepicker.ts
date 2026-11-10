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

function toISODate(val: any): Date {
  return parseISODate(typeof val === "string" ? val.substring(0, 10) : val);
}

export class QuestionDateTimePickerModel extends Question {
  private inputElement: HTMLInputElement;
  private maskInputAdapter: InputElementAdapter;
  private doNotUpdateInputValue: boolean = false;
  private calendarValue: CalendarModel;
  private popupModelValue: PopupModel;
  private editorButtonsValue: ActionContainer;

  constructor(name: string) {
    super(name);
    this.setPropertyValue("maskSettings", this.createMaskSettings());
    this.calendarValue = new CalendarModel();
    this.calendarValue.onValueChanged.add((_, options) => {
      this.value = !!options.value ? Helpers.convertDateToString(options.value) : undefined;
    });
    this.calendarValue.onSelectionCompleted.add(() => {
      this.popupModel.hide();
    });
  }
  public getType(): string {
    return "datetimepicker";
  }
  public getValueType(): QuestionValueType {
    return "string";
  }

  @property({ defaultValue: "date" }) pickerType: string;
  @property({ defaultValue: false }) range: boolean;
  @property({ defaultValue: true }) allowClear: boolean;
  @property({ localizable: true }) placeholder: string;
  @property() minValueExpression: string;
  @property() maxValueExpression: string;
  @property({ localizable: { defaultStr: "minError", markdown: true } }) minErrorText: string;
  @property({ localizable: { defaultStr: "maxError", markdown: true } }) maxErrorText: string;
  @property() _inputValue: string;

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

  public get maskSettings(): InputMaskBase {
    return this.getPropertyValue("maskSettings");
  }
  public set maskSettings(val: InputMaskBase) {
    if (!val) return;
    this.maskSettings.fromJSON(val.toJSON());
    this.updateInputValue();
  }
  private createMaskSettings(): InputMaskBase {
    const mask = Serializer.createClass("datetimemask");
    mask.owner = this;
    mask.onPropertyChanged.add((_, options) => {
      this.onNestedPropertyChanged.fire(this, { name: "maskSettings", newValue: options.newValue, nestedName: options.name });
      this.updateInputValue();
    });
    return mask;
  }

  public get calendar(): CalendarModel {
    return this.calendarValue;
  }
  public get popupModel(): PopupModel {
    if (!this.popupModelValue) {
      this.popupModelValue = new PopupModel("sv-calendar", { model: this.calendar },
        { verticalPosition: "bottom", horizontalPosition: "center", showPointer: false });
      this.popupModelValue.positionMode = "fixed";
      this.popupModelValue.isFocusedContainer = false;
      this.popupModelValue.locale = this.getLocale();
      this.popupModelValue.onVisibilityChanged.add((_, options: { isVisible: boolean }) => {
        if (options.isVisible) {
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
          iconName: this.cssClasses?.calendarButtonIconId || "icon-calendar",
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
    return this.allowClear && !this.isEmpty() && !this.isReadOnly;
  }
  private updateEditorButtons(): void {
    if (!this.editorButtonsValue) return;
    this.editorButtonsValue.actions.forEach(action => action.setEnabled(!this.isInputReadOnly));
    this.editorButtonsValue.getActionById("clear").setVisible(this.isClearButtonVisible);
  }
  public clearInput(): void {
    this._inputValue = undefined;
    this.clearValueFromUI();
    this.updateInputValue();
    this.updateCalendarValue();
  }

  public get inputValue(): string {
    return this._inputValue || this.maskSettings.getMaskedValue("");
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
  private updateInputValue(): void {
    if (this.doNotUpdateInputValue) return;
    const value = this.value;
    this._inputValue = this.maskSettings.getMaskedValue(value);
    if (!!this.maskInputAdapter) {
      this.maskInputAdapter.updateInputElementValue(value);
    }
  }
  private updateCalendarValue(): void {
    const date = toISODate(this.value);
    this.calendar.value = date;
    if (!!date) {
      this.calendar.viewDate = date;
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
      this.updateInputValue();
    }
    super.onSetData();
  }
  public localeChanged(): void {
    super.localeChanged();
    this.maskSettings.localeChanged();
    this.updateInputValue();
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
    if (["value", "allowClear"].indexOf(name) > -1) {
      this.updateEditorButtons();
    }
  }

  public onSurveyLoad(): void {
    super.onSurveyLoad();
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
  }

  private isMaskInputIncomplete(): boolean {
    if (!this.isEmpty()) return false;
    const inputVal = this._inputValue;
    return !!inputVal && inputVal !== this.maskSettings.getMaskedValue("");
  }
  private get isValueLessMin(): boolean {
    const min = toISODate(this.renderedMin);
    const value = toISODate(this.value);
    return !!min && !!value && value.getTime() < min.getTime();
  }
  private get isValueGreaterMax(): boolean {
    const max = toISODate(this.renderedMax);
    const value = toISODate(this.value);
    return !!max && !!value && value.getTime() > max.getTime();
  }
  private getMinMaxErrorText(errorText: string, value: string): string {
    if (Helpers.isValueEmpty(value)) return errorText;
    return errorText.replace("{0}", this.maskSettings.getMaskedValue(Helpers.convertDateToString(toISODate(value))));
  }
  private createMinMaxError(getText: () => string): SurveyError {
    const error = new CustomError(getText(), this);
    error.onUpdateErrorTextCallback = err => { err.text = getText(); };
    return error;
  }
  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged, fireCallback);
    if (this.isMaskInputIncomplete()) {
      const reqIdx = errors.findIndex(e => e.getErrorType() === "required");
      if (reqIdx >= 0) errors.splice(reqIdx, 1);
      errors.push(new PatternIncompleteError(null, this));
    }
    if (this.isValueLessMin) {
      errors.push(this.createMinMaxError(() => this.getMinMaxErrorText(this.minErrorText, this.renderedMin)));
    }
    if (this.isValueGreaterMax) {
      errors.push(this.createMinMaxError(() => this.getMinMaxErrorText(this.maxErrorText, this.renderedMax)));
    }
  }
  protected verifyValueCore(val: any, context: IVerifyDataContext): boolean {
    if (!super.verifyValueCore(val, context)) return false;
    if (Helpers.isValueEmpty(val) || !!parseISODate(val)) return true;
    if (context.checks.reportInvalidValueTypes) {
      context.addIssue("invalidValueType", undefined, val, this);
    }
    return false;
  }

  protected onBlurCore(event: any): void {
    if (!!event && !!event.target && event.target.value !== undefined) {
      this.inputValue = event.target.value;
    }
    super.onBlurCore(event);
  }
  public onKeyUp = (event: any): void => {
    const text = event?.target?.value;
    if (typeof text === "string" && !!this.maskSettings.getUnmaskedValue(text)) {
      this.inputValue = text;
    }
  };
  public afterRenderQuestionElement(el: HTMLElement): void {
    if (!!el) {
      this.inputElement = el instanceof HTMLInputElement ? el : el.querySelector("input");
      if (!!this.inputElement) {
        this.maskInputAdapter = new InputElementAdapter(this.maskSettings, this.inputElement, this.value);
      }
    }
    super.afterRenderQuestionElement(el);
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    if (!!this.maskInputAdapter) {
      this.maskInputAdapter.dispose();
      this.maskInputAdapter = undefined;
    }
    this.inputElement = undefined;
    super.beforeDestroyQuestionElement(el);
  }
  public dispose(): void {
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
    { name: "placeholder", serializationProperty: "locPlaceholder" },
    {
      name: "maskSettings:masksettings",
      className: "datetimemask",
      onGetValue: (obj: any): any => obj.maskSettings.getData(),
      onSerializeValue: (obj: any): any => {
        const data = obj.maskSettings.getData();
        return Object.keys(data).length > 0 ? data : undefined;
      },
      onSetValue: (obj: any, value: any): void => {
        obj.maskSettings.setData(value);
      }
    },
    { name: "allowClear:boolean", default: true }
  ],
  () => new QuestionDateTimePickerModel(""),
  "question"
);
QuestionFactory.Instance.registerQuestion("datetimepicker", (name: string) => {
  return new QuestionDateTimePickerModel(name);
});
