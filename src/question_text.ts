import { QuestionFactory } from "./questionfactory";
import { Serializer } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString, LocalizableStrings } from "./localizablestring";
import { Helpers, HashTable } from "./helpers";
import { EmailValidator, SurveyValidator } from "./validator";
import { SurveyError } from "./survey-error";
import { surveyLocalization } from "./surveyStrings";
import { CustomError } from "./error";
import { settings } from "./settings";
import { QuestionTextBase } from "./question_textbase";
import { CssClassBuilder } from "./utils/cssClassBuilder";

/**
 * A Model for an input text question.
 */
export class QuestionTextModel extends QuestionTextBase {
  private locDataListValue: LocalizableStrings;
  constructor(name: string) {
    super(name);
    this.createLocalizableString("minErrorText", this, true, "minError");
    this.createLocalizableString("maxErrorText", this, true, "maxError");
    this.locDataListValue = new LocalizableStrings(this);
    this.locDataListValue.onValueChanged = (oldValue: any, newValue: any) => {
      this.propertyValueChanged("dataList", oldValue, newValue);
    };
    this.registerFunctionOnPropertiesValueChanged(
      ["min", "max", "inputType", "minValueExpression", "maxValueExpression"],
      () => {
        this.setRenderedMinMax();
      }
    );
    this.registerFunctionOnPropertiesValueChanged(["inputType", "size"], () => {
      this.updateInputSize();
      this.calcRenderedPlaceHolder();
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
   * Use this property to change the default input type.
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
   * The text input size
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
   * Text auto complete
   */
  public get autoComplete(): string {
    return this.getPropertyValue("autoComplete", "");
  }
  public set autoComplete(val: string) {
    this.setPropertyValue("autoComplete", val);
  }
  /**
   * The minimum value
   */
  public get min(): string {
    return this.getPropertyValue("min");
  }
  public set min(val: string) {
    if (this.isValueExpression(val)) {
      this.minValueExpression = val.substr(1);
      return;
    }
    this.setPropertyValue("min", val);
  }
  /**
   * The maximum value
   */
  public get max(): string {
    return this.getPropertyValue("max");
  }
  public set max(val: string) {
    if (this.isValueExpression(val)) {
      this.maxValueExpression = val.substr(1);
      return;
    }
    this.setPropertyValue("max", val);
  }
  /**
   * The minimum value that you can setup as expression, for example today(-1) = yesterday;
   */
  public get minValueExpression(): string {
    return this.getPropertyValue("minValueExpression", "");
  }
  public set minValueExpression(val: string) {
    this.setPropertyValue("minValueExpression", val);
  }
  /**
   * The maximum value that you can setup as expression, for example today(1) = tomorrow;
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
   * The text that shows when value is less than min property.
   * @see min
   * @see maxErrorText
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
   * The text that shows when value is greater than man property.
   * @see max
   * @see minErrorText
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
   * Readonly property that returns true if the current inputType allows to set min and max properties
   * @see inputType
   * @see min
   * @see max
   */
  public get isMinMaxType(): boolean {
    return minMaxTypes.indexOf(this.inputType) > -1;
  }
  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
    super.onCheckForErrors(errors, isOnValueChanged);
    if (isOnValueChanged || this.canSetValueToSurvey()) return;
    if (this.isValueLessMin) {
      errors.push(
        new CustomError(
          this.getMinMaxErrorText(
            this.minErrorText,
            this.getCalculatedMinMax(this.renderedMin)
          ),
          this
        )
      );
    }
    if (this.isValueGreaterMax) {
      errors.push(
        new CustomError(
          this.getMinMaxErrorText(
            this.maxErrorText,
            this.getCalculatedMinMax(this.renderedMax)
          ),
          this
        )
      );
    }
  }
  protected canSetValueToSurvey(): boolean {
    if (!this.isMinMaxType) return true;
    if (this.isValueLessMin) return false;
    if (this.isValueGreaterMax) return false;
    return true;
  }
  private getMinMaxErrorText(errorText: string, value: any): string {
    if (!value) return errorText;
    return errorText.replace("{0}", value.toString());
  }
  private get isValueLessMin(): boolean {
    return (
      !this.isValueEmpty(this.renderedMin) &&
      this.getCalculatedMinMax(this.value) <
        this.getCalculatedMinMax(this.renderedMin)
    );
  }
  private get isValueGreaterMax(): boolean {
    return (
      !this.isValueEmpty(this.renderedMax) &&
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
    this.setValueAndRunExpression(
      this.minValueExpression,
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
    this.setValueAndRunExpression(
      this.maxValueExpression,
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
   * The step value
   */
  public get step(): string {
    return this.getPropertyValue("step");
  }
  public set step(val: string) {
    this.setPropertyValue("step", val);
  }
  public get renderedStep(): string {
    return this.isValueEmpty(this.step) ? "any" : this.step;
  }
  supportGoNextPageAutomatic() {
    return ["date", "datetime", "datetime-local"].indexOf(this.inputType) < 0;
  }
  public supportGoNextPageError() {
    return ["date", "datetime", "datetime-local"].indexOf(this.inputType) < 0;
  }
  /**
   * The list of recommended options available to choose.
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
    return this.locDataList.hasValue() ? this.id + "_datalist" : "";
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
      return Helpers.isNumber(newValue) ? parseFloat(newValue) : "";
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
    if (!!this.inputWidth) {
      style.width = this.inputWidth;
    }
    return style;
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

Serializer.addClass(
  "text",
  [
    {
      name: "inputType",
      default: "text",
      choices: [
        "color",
        "date",
        "datetime",
        "datetime-local",
        "email",
        "month",
        "number",
        "password",
        "range",
        "tel",
        "text",
        "time",
        "url",
        "week",
      ],
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
      name: "autoComplete",
      dataList: [
        "name",
        "honorific-prefix",
        "given-name",
        "additional-name",
        "family-name",
        "honorific-suffix",
        "nickname",
        "organization-title",
        "username",
        "new-password",
        "current-password",
        "organization",
        "street-address",
        "address-line1",
        "address-line2",
        "address-line3",
        "address-level4",
        "address-level3",
        "address-level2",
        "address-level1",
        "country",
        "country-name",
        "postal-code",
        "cc-name",
        "cc-given-name",
        "cc-additional-name",
        "cc-family-name",
        "cc-number",
        "cc-exp",
        "cc-exp-month",
        "cc-exp-year",
        "cc-csc",
        "cc-type",
        "transaction-currency",
        "transaction-amount",
        "language",
        "bday",
        "bday-day",
        "bday-month",
        "bday-year",
        "sex",
        "url",
        "photo",
        "tel",
        "tel-country-code",
        "tel-national",
        "tel-area-code",
        "tel-local",
        "tel-local-prefix",
        "tel-local-suffix",
        "tel-extension",
        "email",
        "impp",
      ],
    },
    {
      name: "min",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return !!obj && obj.isMinMaxType;
      },
      onPropertyEditorUpdate: function(obj: any, propertyEditor: any) {
        propertyEditor.inputType = obj.inputType;
      },
    },
    {
      name: "max",
      dependsOn: "inputType",
      nextToProperty: "*min",
      visibleIf: function(obj: any) {
        return !!obj && obj.isMinMaxType;
      },
      onPropertyEditorUpdate: function(obj: any, propertyEditor: any) {
        propertyEditor.inputType = obj.inputType;
      },
    },
    {
      name: "minValueExpression:expression",
      category: "logic",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return !!obj && obj.isMinMaxType;
      },
    },
    {
      name: "maxValueExpression:expression",
      category: "logic",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return !!obj && obj.isMinMaxType;
      },
    },
    {
      name: "minErrorText",
      serializationProperty: "locMinErrorText",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return !!obj && obj.isMinMaxType;
      },
    },
    {
      name: "maxErrorText",
      serializationProperty: "locMaxErrorText",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return !!obj && obj.isMinMaxType;
      },
    },
    {
      name: "step:number",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.inputType === "number";
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
      name: "placeHolder",
      serializationProperty: "locPlaceHolder",
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
