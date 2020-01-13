import { QuestionFactory } from "./questionfactory";
import { Serializer } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString } from "./localizablestring";
import { Helpers } from "./helpers";
import { EmailValidator, SurveyValidator } from "./validator";

/**
 * A Model for an input text question.
 */
export class QuestionTextModel extends Question {
  constructor(public name: string) {
    super(name);
    this.createLocalizableString("placeHolder", this);
  }
  protected isTextValue(): boolean {
    return this.inputType == "text";
  }
  public getType(): string {
    return "text";
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
  }
  public getValidators(): Array<SurveyValidator> {
    var validators = super.getValidators();
    if (
      this.inputType === "email" &&
      !this.validators.some(v => v.getType() === "emailvalidator")
    ) {
      validators.push(new EmailValidator());
    }
    return validators;
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return true;
  }
  /**
   * The maximim text length. If it is -1, defaul value, then the survey maxTextLength property will be used.
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
  isEmpty(): boolean {
    return super.isEmpty() || this.value === "";
  }
  supportGoNextPageAutomatic() {
    return true;
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
  protected addSupportedValidators(supportedValidators: Array<string>) {
    super.addSupportedValidators(supportedValidators);
    supportedValidators.push("numeric", "text", "regex", "email");
  }
}

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
        "week"
      ]
    },
    { name: "size:number", default: 25 },
    { name: "maxLength:number", default: -1 },
    { name: "placeHolder", serializationProperty: "locPlaceHolder" }
  ],
  function() {
    return new QuestionTextModel("");
  },
  "question"
);

QuestionFactory.Instance.registerQuestion("text", name => {
  return new QuestionTextModel(name);
});
