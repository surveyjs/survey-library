import { Base } from "./base";
import { QuestionFactory } from "./questionfactory";
import { JsonObject } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for a boolean question.
 */
export class QuestionBooleanModel extends Question {
  constructor(public name: string) {
    super(name);
    this.createLocalizableString("label", this, true);
  }
  public getType(): string {
    return "boolean";
  }
  /**
   * Returns true if the question check will be rendered in indeterminate mode. value is empty.
   */
  public get isIndeterminate(): boolean {
    return this.isEmpty();
  }
  public get hasTitle(): boolean {
    return this.showTitle;
  }
  supportGoNextPageAutomatic() {
    return true;
  }
  /**
   * Get/set question value in 3 modes: indeterminate (value is empty), true (check is set) and false (check is unset).
   * @see valueTrue
   * @see valueFalse
   */
  public get checkedValue(): any {
    if (this.isEmpty()) return null;
    return this.value == this.getValueTrue();
  }
  public set checkedValue(val: any) {
    if (this.isValueEmpty(val)) {
      this.value = null;
    } else {
      this.value = val == true ? this.getValueTrue() : this.getValueFalse();
    }
  }
  /**
   * Set the default state of the check: "indeterminate" - default (value is empty/null), "true" - value equals valueTrue or true, "false" - value equals valueFalse or false.
   */
  public get defaultValue(): any {
    return this.getPropertyValue("defaultValue", "indeterminate");
  }
  public set defaultValue(val: any) {
    this.setPropertyValue("defaultValue", val);
    this.updateValueWithDefaults();
  }
  public getDefaultValue(): any {
    if (this.defaultValue == "indeterminate") return null;
    return this.defaultValue == "true"
      ? this.getValueTrue()
      : this.getValueFalse();
  }
  /**
   * The checkbox label. If it is empty and showTitle is false then title is rendered
   * @see showTitle
   * @see title
   */
  public get label(): string {
    return this.getLocalizableStringText("label");
  }
  public set label(val: string) {
    this.setLocalizableStringText("label", val);
  }
  get locLabel(): LocalizableString {
    return this.getLocalizableString("label");
  }
  get locDisplayLabel(): LocalizableString {
    if (this.locLabel.text) return this.locLabel;
    return this.showTitle ? this.locLabel : this.locTitle;
  }
  /**
   * Set this property to true to show the question title. It is hidden by default.
   */
  public get showTitle(): boolean {
    return this.getPropertyValue("showTitle");
  }
  public set showTitle(val: boolean) {
    this.setPropertyValue("showTitle", val);
  }
  /**
   * Set this property, if you want to have a different value from true when check is set.
   */
  public get valueTrue(): any {
    return this.getPropertyValue("valueTrue");
  }
  public set valueTrue(val: any) {
    this.setPropertyValue("valueTrue", val);
  }
  /**
   * Set this property, if you want to have a different value from false when check is unset.
   */
  public get valueFalse(): any {
    return this.getPropertyValue("valueFalse");
  }
  public set valueFalse(val: any) {
    this.setPropertyValue("valueFalse", val);
  }
  private getValueTrue(): any {
    return this.valueTrue ? this.valueTrue : true;
  }
  private getValueFalse(): any {
    return this.valueFalse ? this.valueFalse : false;
  }
  protected setDefaultValue() {
    if (this.defaultValue == "true") this.checkedValue = true;
    if (this.defaultValue == "false") this.checkedValue = false;
    if (this.defaultValue == "indeterminate") this.value = null;
  }
}

JsonObject.metaData.addClass(
  "boolean",
  [
    {
      name: "defaultValue:dropdown",
      alternativeName: "booleanDefaultValue",
      default: "indeterminate",
      choices: ["indeterminate", "false", "true"]
    },
    { name: "label:text", serializationProperty: "locLabel" },
    "showTitle:boolean",
    "valueTrue",
    "valueFalse"
  ],
  function() {
    return new QuestionBooleanModel("");
  },
  "question"
);

QuestionFactory.Instance.registerQuestion("boolean", name => {
  return new QuestionBooleanModel(name);
});
