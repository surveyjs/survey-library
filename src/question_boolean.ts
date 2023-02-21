import { QuestionFactory } from "./questionfactory";
import { property, Serializer } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString } from "./localizablestring";
import { surveyLocalization } from "./surveyStrings";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { preventDefaults } from "./utils/utils";
import { ActionContainer } from "./actions/container";

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
   * If you set the `valueTrue` and `valueFalse` properties, the `value` property contains their values instead of Boolean values. This may be inconvenient when you operate the question value in code. To access the standard Boolean values, use the `booleanValue` property.
   * @see valueTrue
   * @see valueFalse
   */
  public get booleanValue(): any {
    if (this.isEmpty()) return null;
    return this.value == this.getValueTrue();
  }
  public set booleanValue(val: any) {
    if (this.isReadOnly) {
      return;
    }
    this.setBooleanValue(val);
  }
  @property() booleanValueRendered: boolean;

  public get checkedValue(): any { return this.booleanValue; }
  public set checkedValue(val: any) { this.booleanValue = val; }
  private setBooleanValue(val: any) {
    if (this.isValueEmpty(val)) {
      this.value = null;
      this.booleanValueRendered = null;
    } else {
      this.value = val == true ? this.getValueTrue() : this.getValueFalse();
      this.booleanValueRendered = val;
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
    const original = this.getLocalizableString("title");
    if (!this.isValueEmpty(this.locLabel.text) && (this.isValueEmpty(original.text) || this.isLabelRendered && !this.showTitle)) return this.locLabel;
    return original;
  }
  public get labelRenderedAriaID(): string {
    return this.isLabelRendered ? this.ariaTitleId : null;
  }

  //Obsolete
  @property() showTitle: boolean;
  //Obsolete, use title
  @property({ localizable: true }) label: string;
  get isLabelRendered(): boolean {
    return this.titleLocation === "hidden";
  }
  get canRenderLabelDescription(): boolean {
    return this.isLabelRendered && this.hasDescription && (this.hasDescriptionUnderTitle || this.hasDescriptionUnderInput);
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
    return this.booleanValue !== null;
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

  public getValueTrue(): any {
    return this.valueTrue !== undefined ? this.valueTrue : true;
  }
  public getValueFalse(): any {
    return this.valueFalse !== undefined ? this.valueFalse : false;
  }
  protected setDefaultValue(): void {
    if (this.isDefaultValueSet("true", this.valueTrue)) this.setBooleanValue(true);
    if (this.isDefaultValueSet("false", this.valueFalse)) this.setBooleanValue(false);
    if (this.defaultValue == "indeterminate") this.setBooleanValue(null);
  }
  private isDefaultValueSet(defaultValueCheck: any, valueTrueOrFalse: any): boolean {
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
      .append(css.itemChecked, !!this.booleanValue)
      .append(css.itemIndeterminate, this.booleanValue === null)
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
      .append(this.cssClasses.disabledLabel, this.booleanValue === !checked || this.isReadOnly)
      .toString();
  }

  public get svgIcon(): string {
    if (this.booleanValue && this.cssClasses.svgIconCheckedId) return this.cssClasses.svgIconCheckedId;
    if (this.booleanValue === null && this.cssClasses.svgIconIndId) return this.cssClasses.svgIconIndId;
    if (!this.booleanValue && this.cssClasses.svgIconUncheckedId) return this.cssClasses.svgIconUncheckedId;
    return this.cssClasses.svgIconId;
  }

  public get allowClick(): boolean {
    return this.isIndeterminate && !this.isInputReadOnly;
  }

  public getCheckedLabel(): LocalizableString {
    if (this.booleanValue === true) {
      return this.locLabelTrue;
    } else if (this.booleanValue === false) {
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
      this.booleanValue = value;
    }
    return true;
  }
  private calculateBooleanValueByEvent(event: any, isRightClick: boolean) {
    var isRtl = document.defaultView.getComputedStyle(event.target).direction == "rtl";
    this.booleanValue = isRtl ? !isRightClick : isRightClick;
  }
  public onSwitchClickModel(event: any) {
    if (this.allowClick) {
      preventDefaults(event);
      var isRightClick =
        event.offsetX / event.target.offsetWidth > 0.5;
      this.calculateBooleanValueByEvent(event, isRightClick);
      return;
    }
    return true;
  }
  public onKeyDownCore(event: any): boolean {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      preventDefaults(event);
      this.calculateBooleanValueByEvent(event, event.key === "ArrowRight");
      return;
    }
    return true;
  }
  /* #endregion */

  public getRadioItemClass(css: any, value: any): string {
    let className = undefined;
    if (css.radioItem) {
      className = css.radioItem;
    }
    if (css.radioItemChecked && value === this.booleanValue) {
      className = (className ? className + " " : "") + css.radioItemChecked;
    }
    return className;
  }

  protected supportResponsiveness(): boolean {
    return true;
  }
  protected getCompactRenderAs(): string {
    return "radio";
  }
  protected createActionContainer(allowAdaptiveActions?: boolean): ActionContainer {
    return super.createActionContainer(this.renderAs !== "checkbox");
  }
}

Serializer.addClass(
  "boolean",
  [
    { name: "showCommentArea:switch", layout: "row", visible: true, category: "general" },
    { name: "label:text", serializationProperty: "locLabel", isSerializable: false, visible: false },
    {
      name: "labelTrue:text",
      serializationProperty: "locLabelTrue",
    },
    {
      name: "labelFalse:text",
      serializationProperty: "locLabelFalse",
    },
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
