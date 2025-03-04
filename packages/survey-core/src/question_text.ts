import { QuestionFactory } from "./questionfactory";
import { Serializer, property } from "./jsonobject";
import { LocalizableString, LocalizableStrings } from "./localizablestring";
import { Helpers, HashTable, createDate } from "./helpers";
import { EmailValidator } from "./validator";
import { SurveyError } from "./survey-error";
import { CustomError } from "./error";
import { settings } from "./settings";
import { QuestionTextBase } from "./question_textbase";
import { ExpressionRunner } from "./conditions";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { InputElementAdapter } from "./mask/input_element_adapter";
import { InputMaskBase } from "./mask/mask_base";
import { getAvailableMaskTypeChoices, IInputMask } from "./mask/mask_utils";

/**
 * A class that describes the Single-Line Input question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-text/ (linkStyle))
 */
export class QuestionTextModel extends QuestionTextBase {
  private locDataListValue: LocalizableStrings;
  private minValueRunner: ExpressionRunner;
  private maxValueRunner: ExpressionRunner;
  private maskInputAdapter: InputElementAdapter;

  private createMaskAdapter() {
    if (!!this.input && !this.maskTypeIsEmpty) {
      this.maskInputAdapter = new InputElementAdapter(this.maskInstance as InputMaskBase, this.input, this.value);
    }
  }
  private deleteMaskAdapter() {
    if (this.maskInputAdapter) {
      this.maskInputAdapter.dispose();
      this.maskInputAdapter = undefined;
    }
  }
  private updateMaskAdapter() {
    this.deleteMaskAdapter();
    this.createMaskAdapter();
  }
  onSetMaskType(newValue: string) {
    this.setNewMaskSettingsProperty();
    this.updateMaskAdapter();
  }

  /**
   * Specifies the type of a mask applied to the input.
   *
   * Possible values:
   *
   * - `"none"` (default)
   * - `"numeric"`
   * - `"currency"`
   * - `"datetime"`
   * - `"pattern"`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
   * @see maskSettings
   */
  @property({
    onSet: (newValue: string, target: QuestionTextModel) => { target.onSetMaskType(newValue); }
  }) maskType: string;
  /**
   * Specifies text alignment within the input field.
   *
   * Possible values:
   *
   * - `"left"` - Aligns input text to the left side.
   * - `"right"` - Aligns input text to the right side.
   * - `"auto"` (default) - Applies right alignment if a [numeric or currency input mask](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType) is specified. Otherwise, applies left alignment.
   */
  @property() inputTextAlignment: "left" | "right" | "auto";

  get maskTypeIsEmpty(): boolean {
    switch (this.inputType) {
      case "tel":
      case "text": return this.maskType === "none";
      default: return true;
    }
  }

  /**
   * An object with properties that configure the mask applied to the input.
   *
   * Available properties depend on the specified [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType) and belong to corresponding classes. Refer to the class APIs for a full list of properties:
   *
   * | `maskType` | Class |
   * | ---------- | ----- |
   * | `"numeric"` | [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/api-reference/inputmasknumeric) |
   * | `"currency"` | [`InputMaskCurrency`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskcurrency) |
   * | `"datetime"` | [`InputMaskDateTime`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskdatetime) |
   * | `"pattern"` | [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern) |
   *
   * [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
   */
  public get maskSettings(): InputMaskBase {
    return this.getPropertyValue("maskSettings");
  }
  public set maskSettings(val: InputMaskBase) {
    if (!val) return;
    this.setNewMaskSettingsProperty();
    this.maskSettings.fromJSON(val.toJSON());
    this.updateMaskAdapter();
  }
  private setNewMaskSettingsProperty() {
    this.setPropertyValue("maskSettings", this.createMaskSettings());
  }
  protected createMaskSettings(): InputMaskBase {
    let maskClassName = (!this.maskType || this.maskType === "none") ? "masksettings" : (this.maskType + "mask");
    if(!Serializer.findClass(maskClassName)) {
      maskClassName = "masksettings";
    }
    const inputMask = Serializer.createClass(maskClassName);
    inputMask.owner = this.survey;
    return inputMask;
  }

  constructor(name: string) {
    super(name);
    this.createLocalizableString("minErrorText", this, true, "minError");
    this.createLocalizableString("maxErrorText", this, true, "maxError");
    this.setNewMaskSettingsProperty();
    this.locDataListValue = new LocalizableStrings(this);
    this.locDataListValue.onValueChanged = (oldValue: any, newValue: any) => {
      this.propertyValueChanged("dataList", oldValue, newValue);
    };
    this.registerPropertyChangedHandlers(
      ["min", "max", "inputType", "minValueExpression", "maxValueExpression"],
      () => {
        this.setRenderedMinMax();
      }
    );
    this.registerPropertyChangedHandlers(["inputType", "inputSize"], () => {
      this.resetInputSize();
      this.resetRenderedPlaceholder();
    });
  }
  protected isTextValue(): boolean {
    return this.isDateInputType || ["text", "number", "password"].indexOf(this.inputType) > -1;
  }
  public getType(): string {
    return "text";
  }
  public onSurveyLoad(): void {
    super.onSurveyLoad();
    this.setRenderedMinMax();
  }
  /**
   * A value passed on to the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) attribute of the underlying `<input>` element.
   *
   * Default value: `"text"`
   */
  public get inputType(): string {
    return this.getPropertyValue("inputType");
  }
  public set inputType(val: string) {
    val = val.toLowerCase();
    if (val === "datetime_local" || val === "datetime") val = "datetime-local";
    this.setPropertyValue("inputType", val.toLowerCase());
    if (!this.isLoadingFromJson) {
      this.min = undefined;
      this.max = undefined;
      this.step = undefined;
    }
    this.updateMaskAdapter();
  }
  public getMaxLength(): any {
    if(!this.isTextInput) return null;
    return super.getMaxLength();
  }
  protected runConditionCore(values: HashTable<any>, properties: HashTable<any>): void {
    super.runConditionCore(values, properties);
    if (!!this.minValueExpression || !!this.maxValueExpression) {
      this.setRenderedMinMax(values, properties);
    }
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!this.maskTypeIsEmpty && !Helpers.isValueEmpty(value)) return this.maskInstance.getMaskedValue(value);
    return super.getDisplayValueCore(keysAsText, value);
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return true;
  }
  /**
   * A value passed on to the [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size) attribute of the underlying `<input>` element.
   */
  public get inputSize(): number {
    return this.getPropertyValue("inputSize");
  }
  public set inputSize(val: number) {
    this.setPropertyValue("inputSize", val);
  }
  /**
   * @deprecated Use the [`inputSize`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#inputSize) property instead.
   */
  public get size(): number {
    return this.inputSize;
  }
  public set size(val: number) {
    this.inputSize = val;
  }
  public get isTextInput(): boolean {
    return (
      ["text", "search", "tel", "url", "email", "password"].indexOf(
        this.inputType
      ) > -1
    );
  }
  public get renderedInputSize(): number {
    return this.getPropertyValue("renderedInputSize", undefined, () => {
      const size = this.calInputSize();
      return size > 0 ? size : undefined;
    });
  }
  public get inputWidth(): string {
    return this.getPropertyValue("inputWidth", undefined, () => {
      return this.calInputSize() > 0 ? "auto" : "";
    });
  }
  private calInputSize(): number {
    if(!this.isTextInput) return 0;
    let size = this.inputSize > 0 ? this.inputSize : 0;
    if (size < 1 && this.parent && !!(<any>this.parent)["inputSize"]) {
      size = (<any>this.parent)["inputSize"];
    }
    return size;
  }
  public resetInputSize(): void {
    this.resetPropertyValue("renderedInputSize");
    this.resetPropertyValue("inputWidth");
  }
  /**
   * A value passed on to the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) attribute of the underlying `<input>` element.
   */
  public get autocomplete(): string {
    return this.getPropertyValue("autocomplete", null);
  }
  public set autocomplete(val: string) {
    this.setPropertyValue("autocomplete", val);
  }
  /**
   * A value passed on to the [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/min) attribute of the underlying `<input>` element.
   * @see minValueExpression
   */
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
  /**
   * A value passed on to the [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/max) attribute of the underlying `<input>` element.
   * @see maxValueExpression
   */
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
  /**
   * The minimum value specified as an expression. For example, `"minValueExpression": "today(-1)"` sets the minimum value to yesterday.
   * @see min
   */
  public get minValueExpression(): string {
    return this.getPropertyValue("minValueExpression", "");
  }
  public set minValueExpression(val: string) {
    this.setPropertyValue("minValueExpression", val);
  }
  /**
   * The maximum value specified as an expression. For example, `"maxValueExpression": "today(1)"` sets the maximum value to tomorrow.
   * @see max
   */
  public get maxValueExpression(): string {
    return this.getPropertyValue("maxValueExpression", "");
  }
  public set maxValueExpression(val: string) {
    this.setPropertyValue("maxValueExpression", val);
  }
  public get renderedMin(): any {
    return this.getPropertyValue("renderedMin");
  }
  public get renderedMax(): any {
    return this.getPropertyValue("renderedMax");
  }
  /**
   * An error message to display when the question value is less than the minimum accepted value.
   * @see min
   * @see minValueExpression
   */
  public get minErrorText(): string {
    return this.getLocalizableStringText("minErrorText");
  }
  public set minErrorText(val: string) {
    this.setLocalizableStringText("minErrorText", val);
  }
  get locMinErrorText(): LocalizableString {
    return this.getLocalizableString("minErrorText");
  }
  /**
   * An error message to display when the question value exceeds the maximum accepted value.
   * @see max
   * @see maxValueExpression
   */
  public get maxErrorText(): string {
    return this.getLocalizableStringText("maxErrorText");
  }
  public set maxErrorText(val: string) {
    this.setLocalizableStringText("maxErrorText", val);
  }
  get locMaxErrorText(): LocalizableString {
    return this.getLocalizableString("maxErrorText");
  }

  /**
   * Returns `true` if the specified `inputType` supports the `min` and `max` properties.
   * @see inputType
   * @see min
   * @see max
   */
  public get isMinMaxType(): boolean {
    return isMinMaxType(this);
  }

  @property() _inputValue: string;
  public get maskInstance(): IInputMask {
    return this.maskSettings;
  }
  public get inputValue(): string {
    if (!this._inputValue && !this.maskTypeIsEmpty) return this.maskInstance.getMaskedValue("");
    return this._inputValue;
  }
  public set inputValue(val: string) {
    let value = val;
    this._inputValue = val;
    if(!this.maskTypeIsEmpty) {
      value = this.maskInstance.getUnmaskedValue(val);
      this._inputValue = this.maskInstance.getMaskedValue(value);
      if(!!value && this.maskSettings.saveMaskedValue) {
        value = this.maskInstance.getMaskedValue(value);
      }
    }
    this.value = value;
  }

  protected onChangeQuestionValue(newValue: any): void {
    super.onChangeQuestionValue(newValue);
    this.updateInputValue();
  }

  private updateInputValue() {
    if (this.maskTypeIsEmpty) {
      this._inputValue = this.value;
    } else if (this.maskSettings.saveMaskedValue) {
      this._inputValue = !!this.value ? this.value : this.maskInstance.getMaskedValue("");
    } else {
      this._inputValue = this.maskInstance.getMaskedValue(this.value);
    }
  }
  private hasToConvertToUTC(val: any): boolean {
    return settings.storeUtcDates && this.isDateTimeLocaleType() && !!val;
  }
  private createDate(val?: number | string | Date): Date {
    return createDate("question-text", val);
  }
  protected valueForSurveyCore(val: any): any {
    if(this.hasToConvertToUTC(val)) {
      val = this.createDate(val).toISOString();
    }
    return super.valueForSurveyCore(val);
  }
  protected valueFromDataCore(val: any): any {
    if(this.hasToConvertToUTC(val)) {
      const d = this.createDate(val);
      const locale_d = this.createDate(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
      let res = locale_d.toISOString();
      val = res.substring(0, res.length - 2);
    }
    return super.valueFromDataCore(val);
  }
  private dateValidationMessage: string;
  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged, fireCallback);
    if (isOnValueChanged) return;
    if (this.isValueLessMin) {
      const minError = new CustomError(
        this.getMinMaxErrorText(
          this.minErrorText,
          this.getCalculatedMinMax(this.renderedMin)
        ),
        this
      );
      minError.onUpdateErrorTextCallback = err => { err.text = this.getMinMaxErrorText(
        this.minErrorText,
        this.getCalculatedMinMax(this.renderedMin)
      ); };
      errors.push(minError);
    }
    if (this.isValueGreaterMax) {
      const maxError = new CustomError(
        this.getMinMaxErrorText(
          this.maxErrorText,
          this.getCalculatedMinMax(this.renderedMax)
        ),
        this
      );
      maxError.onUpdateErrorTextCallback = err => { err.text = this.getMinMaxErrorText(
        this.maxErrorText,
        this.getCalculatedMinMax(this.renderedMax)
      ); };
      errors.push(maxError);
    }
    if(!!this.dateValidationMessage) {
      errors.push(new CustomError(this.dateValidationMessage, this));
    }

    const valName = this.getValidatorTitle();
    const emailValidator = new EmailValidator();
    emailValidator.errorOwner = this;
    if (
      this.inputType === "email" &&
      !this.validators.some((v) => v.getType() === "emailvalidator")
    ) {
      const validateResult = emailValidator.validate(this.value, valName);

      if (!!validateResult && !!validateResult.error) {
        errors.push(validateResult.error);
      }
    }
  }

  protected canSetValueToSurvey(): boolean {
    if (!this.isMinMaxType) return true;
    const isValid = !this.isValueLessMin && !this.isValueGreaterMax;
    if((!isValid || this.errors.length > 0) && !!this.survey &&
      (this.survey.isValidateOnValueChanging || this.survey.isValidateOnValueChanged)) {
      this.hasErrors();
    }
    return isValid;
  }
  protected convertFuncValuetoQuestionValue(val: any): any {
    let type = this.maskTypeIsEmpty ? this.inputType : this.maskSettings.getTypeForExpressions();
    return Helpers.convertValToQuestionVal(val, type);
  }
  private getMinMaxErrorText(errorText: string, value: any): string {
    if (Helpers.isValueEmpty(value)) return errorText;
    let errorValue = value.toString();
    if(this.inputType === "date" && !!value.toDateString) {
      errorValue = value.toDateString();
    }
    return errorText.replace("{0}", errorValue);
  }
  private get isValueLessMin(): boolean {
    return (
      !this.isValueEmpty(this.renderedMin) && !this.isEmpty() &&
      this.getCalculatedMinMax(this.value) <
        this.getCalculatedMinMax(this.renderedMin)
    );
  }
  private get isValueGreaterMax(): boolean {
    return (
      !this.isValueEmpty(this.renderedMax) && !this.isEmpty() &&
      this.getCalculatedMinMax(this.value) >
        this.getCalculatedMinMax(this.renderedMax)
    );
  }
  private get isDateInputType(): boolean {
    return this.inputType === "date" || this.isDateTimeLocaleType();
  }
  private isDateTimeLocaleType(): boolean {
    return this.inputType === "datetime-local";
  }
  private getCalculatedMinMax(minMax: any): any {
    if (this.isValueEmpty(minMax)) return minMax;
    return this.isDateInputType ? this.createDate(minMax) : minMax;
  }
  private setRenderedMinMax(
    values: HashTable<any> = null,
    properties: HashTable<any> = null
  ) {
    this.minValueRunner = this.getDefaultRunner(this.minValueRunner, this.minValueExpression);
    this.setValueAndRunExpression(
      this.minValueRunner,
      this.min,
      (val) => {
        if (!val && this.isDateInputType && !!settings.minDate) {
          val = settings.minDate;
        }
        this.setPropertyValue("renderedMin", val);
      },
      values,
      properties
    );
    this.maxValueRunner = this.getDefaultRunner(this.maxValueRunner, this.maxValueExpression);
    this.setValueAndRunExpression(
      this.maxValueRunner,
      this.max,
      (val) => {
        if (!val && this.isDateInputType) {
          val = !!settings.maxDate ? settings.maxDate : "2999-12-31";
        }
        this.setPropertyValue("renderedMax", val);
      },
      values,
      properties
    );
  }

  /**
   * A value passed on to the [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/step) attribute of the underlying `<input>` element.
   */
  public get step(): string {
    return this.getPropertyValue("step");
  }
  public set step(val: string) {
    this.setPropertyValue("step", val);
  }
  public get renderedStep(): string {
    if(this.isValueEmpty(this.step)) {
      return this.inputType !== "number" ? undefined : "any";
    }
    return this.step;
  }
  protected getIsInputTextUpdate(): boolean {
    return this.maskTypeIsEmpty ? super.getIsInputTextUpdate() : false;
  }
  supportAutoAdvance(): boolean {
    return !this.getIsInputTextUpdate() && !this.isDateInputType;
  }
  public supportGoNextPageError(): boolean {
    return !this.isDateInputType;
  }
  /**
   * An array of predefined options from which users can select. This property configures an HTML [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) element and associates it with the underlying `input` element.
   */
  public get dataList(): Array<string> {
    return this.locDataList.value;
  }
  public set dataList(val: Array<string>) {
    this.locDataList.value = val;
  }
  get locDataList(): LocalizableStrings {
    return this.locDataListValue;
  }
  public get dataListId(): string {
    return this.locDataList.hasValue() ? this.id + "_datalist" : undefined;
  }
  protected setNewValue(newValue: any): void {
    newValue = this.correctValueType(newValue);
    if(!!newValue) {
      this.dateValidationMessage = undefined;
    }
    super.setNewValue(newValue);
  }
  protected correctValueType(newValue: any): any {
    if (!newValue) return newValue;
    if (this.inputType === "number" || this.inputType === "range") {
      return Helpers.isNumber(newValue) ? Helpers.getNumber(newValue) : "";
    }
    if(this.inputType === "month") {
      const d = this.createDate(newValue);
      const isUtc = d.toISOString().indexOf(newValue) == 0 && newValue.indexOf("T") == -1;
      const month = isUtc ? d.getUTCMonth() : d.getMonth();
      const year = isUtc ? d.getUTCFullYear() : d.getFullYear();
      const m = month + 1;
      return year + "-" + (m < 10 ? "0" : "") + m;
    }
    return newValue;
  }
  protected hasPlaceholder(): boolean {
    return !this.isReadOnly && this.inputType !== "range";
  }
  protected getControlCssClassBuilder(): CssClassBuilder {
    const maxLength = this.getMaxLength();
    return super.getControlCssClassBuilder()
      .append(this.cssClasses.constrolWithCharacterCounter, !!maxLength)
      .append(this.cssClasses.characterCounterBig, maxLength > 99);
  }
  public isReadOnlyRenderDiv(): boolean {
    return this.isReadOnly && settings.readOnly.textRenderMode === "div";
  }
  get inputStyle(): any {
    var style: any = {};
    style.width = this.inputWidth;
    this.updateTextAlign(style);
    return style;
  }
  private updateTextAlign(style: any) {
    if (this.inputTextAlignment !== "auto") {
      style.textAlign = this.inputTextAlignment;
    } else if (!this.maskTypeIsEmpty && this.maskSettings.getTextAlignment() !== "auto") {
      style.textAlign = this.maskSettings.getTextAlignment();
    }
  }
  //web-based methods
  private _isWaitingForEnter = false;

  private updateValueOnEvent(event: any) {
    const newValue = event.target.value;
    if (!this.isTwoValueEquals(this.value, newValue)) {
      this.inputValue = newValue;
    }
  }
  onCompositionUpdate = (event: any) => {
    if(this.isInputTextUpdate) {
      setTimeout(() => {
        this.updateValueOnEvent(event);
      }, 1);
    }
    this.updateRemainingCharacterCounter(event.target.value);
  };
  public onKeyUp = (event: any) => {
    this.updateDateValidationMessage(event);
    if(this.isInputTextUpdate) {
      if (!this._isWaitingForEnter || event.keyCode === 13) {
        this.updateValueOnEvent(event);
        this._isWaitingForEnter = false;
      }
    } else {
      if (event.keyCode === 13) {
        this.updateValueOnEvent(event);
      }
    }
    this.updateRemainingCharacterCounter(event.target.value);
  };
  private updateDateValidationMessage(event: any): void {
    this.dateValidationMessage = this.isDateInputType && !!event.target ? event.target.validationMessage : undefined;
  }
  public onKeyDown = (event: any) => {
    this.onKeyDownPreprocess && this.onKeyDownPreprocess(event);
    if (this.isInputTextUpdate) {
      this._isWaitingForEnter = event.keyCode === 229;
    }
    this.onTextKeyDownHandler(event);
  }
  public onChange = (event: any): void => {
    this.updateDateValidationMessage(event);
    const elementIsFocused = event.target === settings.environment.root.activeElement;
    if (elementIsFocused) {
      if (this.isInputTextUpdate) {
        this.updateValueOnEvent(event);
      }
    } else {
      this.updateValueOnEvent(event);
    }
    this.updateRemainingCharacterCounter(event.target.value);
  };
  protected onBlurCore(event: any): void {
    this.updateDateValidationMessage(event);
    this.updateValueOnEvent(event);
    this.updateRemainingCharacterCounter(event.target.value);
    super.onBlurCore(event);
  }
  protected onFocusCore(event: any): void {
    this.updateRemainingCharacterCounter(event.target.value);
    super.onFocusCore(event);
  }
  public afterRenderQuestionElement(el: HTMLElement) {
    if (!!el) {
      this.input = el instanceof HTMLInputElement ? el : el.querySelector("input");
      this.createMaskAdapter();
    }
    super.afterRenderQuestionElement(el);
  }
  public beforeDestroyQuestionElement(el: HTMLElement) {
    this.deleteMaskAdapter();
    this.input = undefined;
  }
}

const minMaxTypes = [
  "number",
  "range",
  "date",
  "datetime-local",
  "month",
  "time",
  "week",
];

export function isMinMaxType(obj: any): boolean {
  const t = !!obj ? obj.inputType : "";
  if(!t) return false;
  return minMaxTypes.indexOf(t) > -1;
}
function getWeekTimeNumber(str: string, delimiter: string): number {
  const strs = str.split(delimiter);
  if(strs.length !== 2) return -1;
  if(!Helpers.isNumber(strs[0]) || !Helpers.isNumber(strs[1])) return -1;
  return parseFloat(strs[0]) * 60 + parseFloat(strs[1]);
}
function isMinBiggerWeekTime(minStr: string, maxStr: string, delimiter: string): boolean {
  const min = getWeekTimeNumber(minStr, delimiter);
  const max = getWeekTimeNumber(maxStr, delimiter);
  if(min < 0 || max < 0) return false;
  return min > max;
}
function getCorrectMinMax(obj: QuestionTextBase, min: any, max: any, isMax: boolean): any {
  let val = isMax ? max : min;
  if(!isMinMaxType(obj)) return val;
  if(Helpers.isValueEmpty(min) || Helpers.isValueEmpty(max)) return val;
  if(obj.inputType.indexOf("date") === 0 || obj.inputType === "month") {
    const isMonth = obj.inputType === "month";
    const reason = "question-text-minmax";
    const dMin = createDate(reason, isMonth ? min + "-01" : min);
    const dMax = createDate(reason, isMonth ? max + "-01" : max);
    if(!dMin || !dMax) return val;
    if(dMin > dMax) return isMax ? min : max;
  }
  if(obj.inputType === "week" || obj.inputType === "time") {
    const delimiter = obj.inputType === "week" ? "-W": ":";
    if(isMinBiggerWeekTime(min, max, delimiter)) return isMax ? min : max;
    return val;
  }
  if(obj.inputType === "number") {
    if(!Helpers.isNumber(min) || !Helpers.isNumber(max)) return val;
    if(Helpers.getNumber(min) > Helpers.getNumber(max)) return isMax ? min : max;
  }
  if(typeof min === "string" || typeof max === "string") return val;
  if(min > max) return isMax ? min : max;
  return val;
}

function propertyEditorMinMaxUpdate(obj: QuestionTextBase, propertyEditor: any): void {
  if(!!obj && !!obj.inputType) {
    propertyEditor.inputType = obj.inputType !== "range" ? obj.inputType : "number";
    propertyEditor.textUpdateMode = "onBlur";
  }
}

Serializer.addClass(
  "text",
  [
    {
      name: "inputType",
      default: "text",
      choices: settings.questions.inputTypes,
    },
    {
      name: "inputSize:number", alternativeName: "size", minValue: 0, dependsOn: "inputType",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.isTextInput;
      }
    },
    {
      name: "textUpdateMode",
      default: "default",
      choices: ["default", "onBlur", "onTyping"],
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.isTextInput;
      },
    },
    {
      name: "autocomplete",
      alternativeName: "autoComplete",
      choices: settings.questions.dataList,
    },
    {
      name: "min",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return isMinMaxType(obj);
      },
      onPropertyEditorUpdate: function(obj: any, propertyEditor: any) {
        propertyEditorMinMaxUpdate(obj, propertyEditor);
      },
      onSettingValue: (obj: any, val: any): any => {
        return getCorrectMinMax(obj, val, obj.max, false);
      },
    },
    {
      name: "max",
      dependsOn: "inputType",
      nextToProperty: "*min",
      visibleIf: function(obj: any) {
        return isMinMaxType(obj);
      },
      onSettingValue: (obj: any, val: any): any => {
        return getCorrectMinMax(obj, obj.min, val, true);
      },
      onPropertyEditorUpdate: function(obj: any, propertyEditor: any) {
        propertyEditorMinMaxUpdate(obj, propertyEditor);
      },
    },
    {
      name: "minValueExpression:expression",
      category: "logic",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return isMinMaxType(obj);
      },
    },
    {
      name: "maxValueExpression:expression",
      category: "logic",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return isMinMaxType(obj);
      },
    },
    {
      name: "minErrorText",
      serializationProperty: "locMinErrorText",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return isMinMaxType(obj);
      },
    },
    {
      name: "maxErrorText",
      serializationProperty: "locMaxErrorText",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return isMinMaxType(obj);
      },
    },
    { name: "inputTextAlignment", default: "auto", choices: ["left", "right", "auto"] },
    {
      name: "maskType",
      default: "none",
      visibleIndex: 0,
      dependsOn: "inputType",
      visibleIf: (obj: any) => {
        return obj.inputType === "text" || obj.inputType === "tel";
      },
      choices: (obj: any) => {
        const choices = getAvailableMaskTypeChoices();
        return choices;
      }
    },
    {
      name: "maskSettings:masksettings",
      className: "masksettings",
      visibleIndex: 1,
      dependsOn: ["inputType", "maskType"],
      visibleIf: (obj: any) => {
        return obj.inputType === "text" || obj.inputType === "tel";
      },
      onGetValue: function (obj: any) {
        return obj.maskSettings.getData();
      },
      onSetValue: function (obj: any, value: any) {
        obj.maskSettings.setData(value);
      },
    },
    {
      name: "step:number",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.inputType === "number" || obj.inputType === "range";
      },
    },
    {
      name: "maxLength:number",
      default: -1,
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.isTextInput;
      },
    },
    {
      name: "placeholder",
      alternativeName: "placeHolder",
      serializationProperty: "locPlaceholder",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.isTextInput;
      },
    },
    {
      name: "dataList:string[]",
      serializationProperty: "locDataList",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.inputType === "text";
      },
    },
  ],
  function() {
    return new QuestionTextModel("");
  },
  "textbase"
);

QuestionFactory.Instance.registerQuestion("text", (name) => {
  return new QuestionTextModel(name);
});
