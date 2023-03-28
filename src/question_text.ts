import { QuestionFactory } from "./questionfactory";
import { Serializer } from "./jsonobject";
import { LocalizableString, LocalizableStrings } from "./localizablestring";
import { Helpers, HashTable } from "./helpers";
import { EmailValidator, SurveyValidator } from "./validator";
import { SurveyError } from "./survey-error";
import { CustomError } from "./error";
import { settings } from "./settings";
import { QuestionTextBase } from "./question_textbase";
import { ExpressionRunner } from "./conditions";
import { SurveyModel } from "./survey";

/**
 * A class that describes the Text question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-text/ (linkStyle))
 */
export class QuestionTextModel extends QuestionTextBase {
  private locDataListValue: LocalizableStrings;
  private minValueRunner: ExpressionRunner;
  private maxValueRunner: ExpressionRunner;
  constructor(name: string) {
    super(name);
    this.createLocalizableString("minErrorText", this, true, "minError");
    this.createLocalizableString("maxErrorText", this, true, "maxError");
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
    this.registerPropertyChangedHandlers(["inputType", "size"], () => {
      this.updateInputSize();
      this.calcRenderedPlaceholder();
    });
  }
  protected isTextValue(): boolean {
    return ["text", "number", "password"].indexOf(this.inputType) > -1;
  }
  public getType(): string {
    return "text";
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    this.setRenderedMinMax();
    this.updateInputSize();
  }
  /**
   * A value passed on to the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) attribute of the underlying `<input>` element.
   */
  public get inputType(): string {
    return this.getPropertyValue("inputType");
  }
  public set inputType(val: string) {
    val = val.toLowerCase();
    if (val == "datetime_local") val = "datetime-local";
    this.setPropertyValue("inputType", val.toLowerCase());
    if (!this.isLoadingFromJson) {
      this.min = undefined;
      this.max = undefined;
      this.step = undefined;
    }
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    if (!!this.minValueExpression || !!this.maxValueExpression) {
      this.setRenderedMinMax(values, properties);
    }
  }
  public getValidators(): Array<SurveyValidator> {
    var validators = super.getValidators();
    if (
      this.inputType === "email" &&
      !this.validators.some((v) => v.getType() === "emailvalidator")
    ) {
      validators.push(new EmailValidator());
    }
    return validators;
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return true;
  }
  /**
   * A value passed on to the [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size) attribute of the underlying `<input>` element.
   */
  public get size(): number {
    return this.getPropertyValue("size");
  }
  public set size(val: number) {
    this.setPropertyValue("size", val);
  }
  public get isTextInput() {
    return (
      ["text", "search", "tel", "url", "email", "password"].indexOf(
        this.inputType
      ) > -1
    );
  }
  public get inputSize(): number {
    return this.getPropertyValue("inputSize", 0);
  }
  public get renderedInputSize(): number {
    return this.getPropertyValue("inputSize") || null;
  }
  public get inputWidth(): string {
    return this.getPropertyValue("inputWidth");
  }
  public updateInputSize() {
    var size = this.isTextInput && this.size > 0 ? this.size : 0;
    if (
      this.isTextInput &&
      size < 1 &&
      this.parent &&
      !!(<any>this.parent)["itemSize"]
    ) {
      size = (<any>this.parent)["itemSize"];
    }
    this.setPropertyValue("inputSize", size);
    this.setPropertyValue("inputWidth", size > 0 ? "auto" : "");
  }
  /**
   * A value passed on to the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) attribute of the underlying `<input>` element.
   */
  public get autocomplete(): string {
    return this.getPropertyValue("autocomplete", "");
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
  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
    super.onCheckForErrors(errors, isOnValueChanged);
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
  }
  protected canSetValueToSurvey(): boolean {
    if (!this.isMinMaxType) return true;
    const isValid = !this.isValueLessMin && !this.isValueGreaterMax;
    if(this.inputType === "number" && !!this.survey &&
      (this.survey.isValidateOnValueChanging || this.survey.isValidateOnValueChanged)) {
      this.hasErrors();
    }
    return isValid;
  }
  protected convertFuncValuetoQuestionValue(val: any): any {
    let inpuType = this.inputType.replace("-local", "");
    return Helpers.convertValToQuestionVal(val, inpuType);
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
    return this.inputType === "date" || this.inputType === "datetime-local";
  }
  private getCalculatedMinMax(minMax: any): any {
    if (this.isValueEmpty(minMax)) return minMax;
    return this.isDateInputType ? new Date(minMax) : minMax;
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
  supportGoNextPageAutomatic() {
    return ["date", "datetime", "datetime-local"].indexOf(this.inputType) < 0;
  }
  public supportGoNextPageError() {
    return ["date", "datetime", "datetime-local"].indexOf(this.inputType) < 0;
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
  protected canRunValidators(isOnValueChanged: boolean): boolean {
    return (
      this.errors.length > 0 ||
      !isOnValueChanged ||
      this.supportGoNextPageError()
    );
  }
  protected setNewValue(newValue: any) {
    newValue = this.correctValueType(newValue);
    super.setNewValue(newValue);
  }
  protected correctValueType(newValue: any): any {
    if (!newValue) return newValue;
    if (this.inputType == "number" || this.inputType == "range") {
      return Helpers.isNumber(newValue) ? Helpers.getNumber(newValue) : "";
    }
    return newValue;
  }
  protected hasPlaceHolder(): boolean {
    return !this.isReadOnly && this.inputType !== "range";
  }
  public isReadOnlyRenderDiv(): boolean {
    return this.isReadOnly && settings.readOnlyTextRenderMode === "div";
  }
  get inputStyle(): any {
    var style: any = {};
    style.width = this.inputWidth;
    return style;
  }
  //web-based methods
  private _isWaitingForEnter = false;
  private updateValueOnEvent(event: any) {
    const newValue = event.target.value;
    if (!Helpers.isTwoValueEquals(this.value, newValue)) {
      this.value = newValue;
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
    if(this.isInputTextUpdate) {
      if (!this._isWaitingForEnter || event.keyCode === 13) {
        this.updateValueOnEvent(event);
        if (event.keyCode === 13) {
          (this.survey as SurveyModel).questionEditFinishCallback(this, event);
        }
        this._isWaitingForEnter = false;
      }
    } else {
      if (event.keyCode === 13) {
        this.updateValueOnEvent(event);
        (this.survey as SurveyModel).questionEditFinishCallback(this, event);
      }
    }
    this.updateRemainingCharacterCounter(event.target.value);
  };
  public onKeyDown = (event: any) => {
    if(this.isInputTextUpdate) {
      this._isWaitingForEnter = event.keyCode === 229;
    }
  }
  public onChange = (event: any): void => {
    if (event.target === document.activeElement) {
      if (this.isInputTextUpdate) {
        this.updateValueOnEvent(event);
      }
    } else {
      this.updateValueOnEvent(event);
    }
    this.updateRemainingCharacterCounter(event.target.value);
  };
  public onBlur = (event: any): void => {
    this.updateValueOnEvent(event);
    this.updateRemainingCharacterCounter(event.target.value);
  };
  public onFocus = (event: any): void => {
    this.updateRemainingCharacterCounter(event.target.value);
  }
}

const minMaxTypes = [
  "number",
  "range",
  "date",
  "datetime",
  "datetime-local",
  "month",
  "time",
  "week",
];

function isMinMaxType(obj: any): boolean {
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
    const dMin = new Date(isMonth ? min + "-1" : min);
    const dMax = new Date(isMonth ? max + "-1" : max);
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

Serializer.addClass(
  "text",
  [
    {
      name: "inputType",
      default: "text",
      choices: settings.questions.inputTypes,
    },
    {
      name: "size:number",
      minValue: 0,
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.isTextInput;
      },
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
        if(!!obj && !!obj.inputType) {
          propertyEditor.inputType = obj.inputType !== "range" ? obj.inputType : "number";
        }
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
        if(!!obj && !!obj.inputType) {
          propertyEditor.inputType = obj.inputType !== "range" ? obj.inputType : "number";
        }
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
