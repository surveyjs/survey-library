import { QuestionFactory } from "./questionfactory";
import { Serializer } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString, LocalizableStrings } from "./localizablestring";
import { Helpers } from "./helpers";
import { EmailValidator, SurveyValidator } from "./validator";

/**
 * A Model for an input text question.
 */
export class QuestionTextModel extends Question {
  private locDataListValue: LocalizableStrings;
  constructor(public name: string) {
    super(name);
    this.createLocalizableString("placeHolder", this);
    this.locDataListValue = new LocalizableStrings(this);
    this.registerFunctionOnPropertiesValueChanged(
      ["min", "max", "inputType", "minValueExpression", "maxValueExpression"],
      () => {
        this.setRenderedMinMax();
      }
    );
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
  /**
   * Gets or sets a value that specifies how the question updates it's value.
   *
   * The following options are available:
   * - `default` - get the value from survey.textUpdateMode
   * - `onBlur` - the value is updated after an input loses the focus.
   * - `onTyping` - update the value of text questions, "text" and "comment", on every key press.
   *
   * Note, that setting to "onTyping" may lead to a performance degradation, in case you have many expressions in the survey.
   * @see survey.textUpdateMode
   */
  public get textUpdateMode(): string {
    return this.getPropertyValue("textUpdateMode");
  }
  public set textUpdateMode(val: string) {
    this.setPropertyValue("textUpdateMode", val);
  }
  public get isSurveyInputTextUpdate(): boolean {
    if (this.textUpdateMode == "default")
      return !!this.survey ? this.survey.isUpdateValueTextOnTyping : false;
    return this.textUpdateMode == "onTyping";
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
   * The maximum text length. If it is -1, defaul value, then the survey maxTextLength property will be used.
   * If it is 0, then the value is unlimited
   * @see SurveyModel.maxTextLength
   */
  public get maxLength(): number {
    return this.getPropertyValue("maxLength");
  }
  public set maxLength(val: number) {
    this.setPropertyValue("maxLength", val);
  }
  public getMaxLength(): any {
    return Helpers.getMaxLength(
      this.maxLength,
      this.survey ? this.survey.maxTextLength : -1
    );
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
  public get minValueExpression(): string {
    return this.getPropertyValue("minValueExpression", "");
  }
  public set minValueExpression(val: string) {
    this.setPropertyValue("minValueExpression", val);
  }
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
  private setRenderedMinMax() {
    this.setPropertyValue(
      "renderedMin",
      this.getValueAndRunExpression(this.min, this.minValueExpression)
    );
    var val = this.getValueAndRunExpression(this.max, this.maxValueExpression);
    if (
      !val &&
      (this.inputType === "date" || this.inputType === "datetime-local")
    ) {
      val = "2999-12-31";
    }
    this.setPropertyValue("renderedMax", val);
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
  isEmpty(): boolean {
    return super.isEmpty() || this.value === "";
  }
  supportGoNextPageAutomatic() {
    return ["date", "datetime", "datetime-local"].indexOf(this.inputType) < 0;
  }
  public supportGoNextPageError() {
    return ["date", "datetime", "datetime-local"].indexOf(this.inputType) < 0;
  }
  /**
   * The input place holder.
   */
  public get placeHolder(): string {
    return this.getLocalizableStringText("placeHolder");
  }
  public set placeHolder(val: string) {
    this.setLocalizableStringText("placeHolder", val);
  }
  get locPlaceHolder(): LocalizableString {
    return this.getLocalizableString("placeHolder");
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
    return !this.locDataList.isEmpty ? this.id + "_datalist" : "";
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
    { name: "size:number", default: 25 },
    {
      name: "textUpdateMode",
      default: "default",
      choices: ["default", "onBlur", "onTyping"],
      dependsOn: "inputType",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return obj.inputType == "text";
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
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return minMaxTypes.indexOf(obj.inputType) !== -1;
      },
      onPropertyEditorUpdate: function (obj: any, propertyEditor: any) {
        propertyEditor.inputType = obj.inputType;
      },
    },
    {
      name: "max",
      dependsOn: "inputType",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return minMaxTypes.indexOf(obj.inputType) !== -1;
      },
      onPropertyEditorUpdate: function (obj: any, propertyEditor: any) {
        propertyEditor.inputType = obj.inputType;
      },
    },
    {
      name: "minValueExpression:expression",
      category: "logic",
      dependsOn: "inputType",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return minMaxTypes.indexOf(obj.inputType) !== -1;
      },
    },
    {
      name: "maxValueExpression:expression",
      category: "logic",
      dependsOn: "inputType",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return minMaxTypes.indexOf(obj.inputType) !== -1;
      },
    },
    {
      name: "step:number",
      dependsOn: "inputType",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return obj.inputType === "number";
      },
    },
    { name: "maxLength:number", default: -1 },
    {
      name: "placeHolder",
      serializationProperty: "locPlaceHolder",
      dependsOn: "inputType",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return obj.inputType === "text";
      },
    },
    {
      name: "dataList:string[]",
      serializationProperty: "locDataList",
      dependsOn: "inputType",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return obj.inputType === "text";
      },
    },
  ],
  function () {
    return new QuestionTextModel("");
  },
  "question"
);

QuestionFactory.Instance.registerQuestion("text", (name) => {
  return new QuestionTextModel(name);
});
