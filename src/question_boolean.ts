import { QuestionFactory } from "./questionfactory";
import { property, Serializer } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString } from "./localizablestring";
import { surveyLocalization } from "./surveyStrings";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { preventDefaults } from "./utils/utils";

/**
 * A class that describes the Boolean question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-boolean/ (linkStyle))
 */
export class QuestionBooleanModel extends Question {
  constructor(name: string) {
    super(name);
    this.createLocalizableString("labelFalse", this, true, "booleanUncheckedLabel");
    this.createLocalizableString("labelTrue", this, true, "booleanCheckedLabel");
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
  public get isIndeterminate(): boolean {
    return this.isEmpty();
  }
  public get hasTitle(): boolean {
    return true;
  }
  /**
   * Gets or sets the question value as a Boolean value.
   *
   * If you set the `valueTrue` and `valueFalse` properties, the `value` property contains their values instead of Boolean values. This may be inconvenient when you operate the question value in code. To access the standard Boolean values, use the `checkedValue` property.
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
  public get defaultValue(): any {
    return this.getPropertyValue("defaultValue");
  }
  public set defaultValue(val: any) {
    if (val === true) val = "true";
    if (val === false) val = "false";
    if (val === undefined) val = "indeterminate";
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

  @property({ localizable: true })
  label: string;

  get locDisplayLabel(): LocalizableString {
    if (this.locLabel.text) return this.locLabel;
    return this.showTitle ? this.locLabel : this.locTitle;
  }

  /**
   * Gets or sets a text label that corresponds to a positive answer.
   *
   * Default value: "Yes"
   * @see valueTrue
   * @see valueFalse
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
  get isDeterminated() {
    return this.checkedValue !== null;
  }

  /**
   * Gets or sets a text label that corresponds to a negative answer.
   *
   * Default value: "No"
   * @see valueTrue
   * @see valueFalse
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

  @property()
  showTitle: boolean;

  /**
   * A value to save in survey results when respondents give a positive answer.
   *
   * Default value: `true`
   * @see labelTrue
   * @see labelFalse
   */
  @property()
  valueTrue: any;
  /**
   * A value to save in survey results when respondents give a negative answer.
   *
   * Default value: `false`
   * @see labelTrue
   * @see labelFalse
   */
  @property()
  valueFalse: any;

  private getValueTrue(): any {
    return this.valueTrue ? this.valueTrue : true;
  }
  private getValueFalse(): any {
    return this.valueFalse ? this.valueFalse : false;
  }
  protected setDefaultValue(): void {
    if (this.isDefaultValueSet("true", this.valueTrue)) this.setCheckedValue(true);
    if (this.isDefaultValueSet("false", this.valueFalse)) this.setCheckedValue(false);
    if (this.defaultValue == "indeterminate") this.setCheckedValue(null);
  }
  private isDefaultValueSet(defaultValueCheck: any, valueTrueOrFalse: any) : boolean {
    return this.defaultValue == defaultValueCheck || (valueTrueOrFalse !== undefined && this.defaultValue === valueTrueOrFalse);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (value == this.getValueTrue()) return this.locLabelTrue.textOrHtml;
    return this.locLabelFalse.textOrHtml;
  }
  private getItemCssValue(css: any): string {
    return new CssClassBuilder()
      .append(css.item)
      .append(css.itemOnError, this.errors.length > 0)
      .append(css.itemDisabled, this.isReadOnly)
      .append(css.itemChecked, !!this.checkedValue)
      .append(css.itemIndeterminate, this.checkedValue === null)
      .toString();
  }

  public getItemCss(): string {
    return this.getItemCssValue(this.cssClasses);
  }
  public getCheckboxItemCss() {
    return this.getItemCssValue(
      {
        item: this.cssClasses.checkboxItem,
        itemOnError: this.cssClasses.checkboxItemOnError,
        itemDisabled: this.cssClasses.checkboxItemDisabled,
        itemChecked: this.cssClasses.checkboxItemChecked,
        itemIndeterminate: this.cssClasses.checkboxItemIndeterminate
      }
    );
  }

  public getLabelCss(checked: boolean): string {
    return new CssClassBuilder()
      .append(this.cssClasses.label)
      .append(this.cssClasses.disabledLabel, this.checkedValue === !checked || this.isReadOnly)
      .toString();
  }

  public get svgIcon(): string {
    if(this.checkedValue && this.cssClasses.svgIconCheckedId) return this.cssClasses.svgIconCheckedId;
    if(this.checkedValue === null && this.cssClasses.svgIconIndId) return this.cssClasses.svgIconIndId;
    if(!this.checkedValue && this.cssClasses.svgIconUncheckedId) return this.cssClasses.svgIconUncheckedId;
    return this.cssClasses.svgIconId;
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
  protected setQuestionValue(
    newValue: any,
    updateIsAnswered: boolean = true
  ) {
    if (newValue === "true" && this.valueTrue !== "true") newValue = true;
    if (newValue === "false" && this.valueFalse !== "false") newValue = false;
    if (newValue === "indeterminate") newValue = null;
    super.setQuestionValue(newValue, updateIsAnswered);
  }
  /* #region web-based methods */
  public onLabelClick(event: any, value: boolean) {
    if (this.allowClick) {
      preventDefaults(event);
      this.checkedValue = value;
    }
    return true;
  }
  private calculateCheckedValueByEvent(event: any, isRightClick: boolean) {
    var isRtl = document.defaultView.getComputedStyle(event.target).direction == "rtl";
    this.checkedValue = isRtl ? !isRightClick : isRightClick;
  }
  public onSwitchClickModel(event: any) {
    if (this.allowClick) {
      preventDefaults(event);
      var isRightClick =
        event.offsetX / event.target.offsetWidth > 0.5;
      this.calculateCheckedValueByEvent(event, isRightClick);
      return;
    }
    return true;
  }
  public onKeyDownCore(event: any): boolean {
    if(event.key === "ArrowLeft" || event.key === "ArrowRight") {
      preventDefaults(event);
      this.calculateCheckedValueByEvent(event, event.key === "ArrowRight");
      return;
    }
    return true;
  }
  /* #endregion */

  public getRadioItemClass(css: any, value: any): string {
    let className = undefined;
    if(css.radioItem) {
      className = css.radioItem;
    }
    if(css.radioItemChecked && value === this.value) {
      className = (className?className+" ":"") + css.radioItemChecked;
    }
    return className;
  }

  protected supportResponsiveness(): boolean {
    return true;
  }
  protected getCompactRenderAs(): string {
    return "radio";
  }
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
  function () {
    return new QuestionBooleanModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("boolean", (name) => {
  return new QuestionBooleanModel(name);
});
