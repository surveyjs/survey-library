import { QuestionFactory } from "./questionfactory";
import { JsonObject } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for an input text question.
 */
export class QuestionTextModel extends Question {
  constructor(public name: string) {
    super(name);
    this.createLocalizableString("placeHolder", this);
  }
  public getType(): string {
    return "text";
  }
  /**
   * Use this property to change the default input type.
   */
  public get inputType(): string {
    return this.getPropertyValue("inputType", "text");
  }
  public set inputType(val: string) {
    val = val.toLowerCase();
    if (val == "datetime_local") val = "datetime-local";
    this.setPropertyValue("inputType", val.toLowerCase());
  }
  /**
   * The text input size
   */
  public get size(): number {
    return this.getPropertyValue("size", 25);
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
      return this.isNumber(newValue) ? parseFloat(newValue) : "";
    }
    return newValue;
  }
  private isNumber(value): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
}

JsonObject.metaData.addClass(
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
