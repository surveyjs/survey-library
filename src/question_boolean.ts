import { QuestionFactory } from "./questionfactory";
import { property, Serializer } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString } from "./localizablestring";
import { surveyLocalization } from "./surveyStrings";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { preventDefaults } from "./utils/utils";

/**
 * A Model for a boolean question.
 */
export class QuestionBooleanModel extends Question {
  constructor(name: string) {
    super(name);
    this.createLocalizableString("labelFalse", this, true);
    this.createLocalizableString("labelTrue", this, true);
    this.locLabelFalse.onGetTextCallback = (text: string): string => {
      return !!text
        ? text
        : surveyLocalization.getString("booleanUncheckedLabel");
    };
    this.locLabelTrue.onGetTextCallback = (text: string): string => {
      return !!text
        ? text
        : surveyLocalization.getString("booleanCheckedLabel");
    };
  }
  public getType(): string {
    return "boolean";
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return true;
  }
  supportGoNextPageAutomatic() {
    return this.renderAs !== "checkbox";
  }
  /**
   * Returns true if the question check will be rendered in indeterminate mode. value is empty.
   */
  public get isIndeterminate(): boolean {
    return this.isEmpty();
  }
  public get hasTitle(): boolean {
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
    if (this.isReadOnly) {
      return;
    }
    this.setCheckedValue(val);
  }
  private setCheckedValue(val: any) {
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
    return this.getPropertyValue("defaultValue");
  }
  public set defaultValue(val: any) {
    if (val === true) val = "true";
    if (val === false) val = "false";
    this.setPropertyValue("defaultValue", val);
    this.updateValueWithDefaults();
  }
  public getDefaultValue(): any {
    if (this.defaultValue == "indeterminate") return null;
    if (this.defaultValue === undefined) return null;
    return this.defaultValue == "true"
      ? this.getValueTrue()
      : this.getValueFalse();
  }
  public get locTitle(): LocalizableString {
    return this.showTitle || this.isValueEmpty(this.locLabel.text)
      ? this.getLocalizableString("title")
      : this.locLabel;
  }
  /**
   * The checkbox label. If it is empty and showTitle is false then title is rendered
   * @see showTitle
   * @see title
   */
  @property({ localizable: true })
  label: string;

  get locDisplayLabel(): LocalizableString {
    if (this.locLabel.text) return this.locLabel;
    return this.showTitle ? this.locLabel : this.locTitle;
  }

  /**
   * Set this property, if you want to have a different label for state when check is set.
   */
  public get labelTrue(): any {
    return this.getLocalizableStringText("labelTrue");
  }
  public set labelTrue(val: any) {
    this.setLocalizableStringText("labelTrue", val);
  }
  get locLabelTrue(): LocalizableString {
    return this.getLocalizableString("labelTrue");
  }

  /**
   * Set this property, if you want to have a different label for state when check is unset.
   */
  public get labelFalse(): any {
    return this.getLocalizableStringText("labelFalse");
  }
  public set labelFalse(val: any) {
    this.setLocalizableStringText("labelFalse", val);
  }
  get locLabelFalse(): LocalizableString {
    return this.getLocalizableString("labelFalse");
  }

  /**
   * Set this property to true to show the question title. It is hidden by default.
   */
  @property()
  showTitle: boolean;

  /**
   * Set this property, if you want to have a different value from true when check is set.
   */
  @property()
  valueTrue: any;
  /**
   * Set this property, if you want to have a different value from false when check is unset.
   */
  @property()
  valueFalse: any;

  private getValueTrue(): any {
    return this.valueTrue ? this.valueTrue : true;
  }
  private getValueFalse(): any {
    return this.valueFalse ? this.valueFalse : false;
  }
  protected setDefaultValue() {
    if (this.defaultValue == "true") this.setCheckedValue(true);
    if (this.defaultValue == "false") this.setCheckedValue(false);
    if (this.defaultValue == "indeterminate") this.setCheckedValue(null);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (value == this.getValueTrue()) return this.locLabelTrue.textOrHtml;
    return this.locLabelFalse.textOrHtml;
  }

  public getItemCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.item)
      .append(this.cssClasses.itemOnError, this.errors.length > 0)
      .append(this.cssClasses.itemDisabled, this.isReadOnly)
      .append(this.cssClasses.itemChecked, !!this.checkedValue)
      .append(this.cssClasses.itemIndeterminate, this.checkedValue === null)
      .toString();
  }

  public getLabelCss(checked: boolean): string {
    return new CssClassBuilder()
      .append(this.cssClasses.label)
      .append(this.cssClasses.disabledLabel, this.checkedValue === !checked || this.isReadOnly)
      .toString();
  }

  public get allowClick(): boolean {
    return this.isIndeterminate && !this.isInputReadOnly;
  }

  public getCheckedLabel(): LocalizableString {
    if (this.checkedValue === true) {
      return this.locLabelTrue;
    } else if (this.checkedValue === false) {
      return this.locLabelFalse;
    }
  }

  /* #region web-based methods */
  public onLabelClick(event: any, value: boolean) {
    if (this.allowClick) {
      preventDefaults(event);
      this.checkedValue = value;
    }
    return true;
  }
  public onSwitchClickModel(event: any) {
    if (this.allowClick) {
      preventDefaults(event);
      var isRightClick =
        event.offsetX / event.target.offsetWidth > 0.5;
      var isRtl =
        document.defaultView.getComputedStyle(event.target).direction == "rtl";
      this.checkedValue = isRtl ? !isRightClick : isRightClick;
      return;
    }
    return true;
  }
  /* #endregion */
}

Serializer.addClass(
  "boolean",
  [
    { name: "label:text", serializationProperty: "locLabel" },
    {
      name: "labelTrue:text",
      serializationProperty: "locLabelTrue",
    },
    {
      name: "labelFalse:text",
      serializationProperty: "locLabelFalse",
    },
    "showTitle:boolean",
    "valueTrue",
    "valueFalse",
    { name: "renderAs", default: "default", visible: false },
  ],
  function() {
    return new QuestionBooleanModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("boolean", (name) => {
  return new QuestionBooleanModel(name);
});
