import { QuestionFactory } from "./questionfactory";
import { property, Serializer } from "./jsonobject";
import { Question } from "./question";
import { LocalizableString } from "./localizablestring";
import { surveyLocalization } from "./surveyStrings";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { preventDefaults } from "./utils/utils";
import { ActionContainer } from "./actions/container";
import { DomDocumentHelper } from "./global_variables_utils";

/**
 * A class that describes the Yes/No (Boolean) question type.
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
  supportGoNextPageAutomatic(): boolean {
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
    if (this.isReadOnly || this.isDesignMode) {
      return;
    }
    this.setBooleanValue(val);
  }
  @property() booleanValueRendered: boolean;

  public get checkedValue(): any { return this.booleanValue; }
  public set checkedValue(val: any) { this.booleanValue = val; }
  private setBooleanValue(val: any) {
    if (this.isValueEmpty(val)) {
      this.value = undefined;
      this.booleanValueRendered = undefined;
    } else {
      this.value = val == true ? this.getValueTrue() : this.getValueFalse();
      this.booleanValueRendered = val;
    }
    this.updateThumbMargin();
  }
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
    const val = this.defaultValue;
    if (val === "indeterminate" || val === undefined || val === null) return undefined;
    return val == "true" ? this.getValueTrue() : this.getValueFalse();
  }
  public get locTitle(): LocalizableString {
    const original = this.getLocalizableString("title");
    if (!this.isValueEmpty(this.locLabel.text) && (this.isValueEmpty(original.text) || this.isLabelRendered && !this.showTitle)) return this.locLabel;
    return original;
  }
  public get labelRenderedAriaID(): string {
    return this.isLabelRendered ? this.ariaTitleId : null;
  }

  @property() leftAnswerElement: HTMLElement;
  @property() thumbMargin: string;

  public updateThumbMargin(): void {
    if (!this.isIndeterminate && this.leftAnswerElement) {
      if (!this.swapOrder && this.value === this.getValueTrue() || this.swapOrder && this.value === this.getValueFalse()) {
        const el = this.leftAnswerElement;
        setTimeout(() => {
          this.thumbMargin = el.clientWidth + (this.swapOrder ? 4 : 2) + "px";
        }, 50);
      }
    }
    this.thumbMargin = undefined;
  }

  public afterRender(el: HTMLElement) {
    super.afterRender(el);
    this.leftAnswerElement = el.querySelectorAll("." + this.cssClasses.sliderGhost)[0] as HTMLElement;
    this.updateThumbMargin();
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    super.beforeDestroyQuestionElement(el);
    this.leftAnswerElement = undefined;
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
  public get labelTrue(): string {
    return this.getLocalizableStringText("labelTrue");
  }
  public set labelTrue(val: string) {
    this.setLocalizableStringText("labelTrue", val);
  }
  get locLabelTrue(): LocalizableString {
    return this.getLocalizableString("labelTrue");
  }
  get isDeterminated(): boolean {
    return this.booleanValue !== null && this.booleanValue !== undefined;
  }

  /**
   * Specifies whether to swap the order of the Yes and No answers.
   *
   * Default value: `false`
   *
   * By default, the order is [ "No", "Yes"]. Enable this property to reorder the answers as follows: [ "Yes", "No" ].
   */
  @property({ defaultValue: false }) swapOrder: boolean;
  get locLabelLeft(): LocalizableString {
    return this.swapOrder ? this.getLocalizableString("labelTrue") : this.getLocalizableString("labelFalse");
  }
  get locLabelRight(): LocalizableString {
    return this.swapOrder ? this.getLocalizableString("labelFalse") : this.getLocalizableString("labelTrue");
  }

  /**
   * Gets or sets a text label that corresponds to a negative answer.
   *
   * Default value: "No"
   * @see valueTrue
   * @see valueFalse
   */
  public get labelFalse(): string {
    return this.getLocalizableStringText("labelFalse");
  }
  public set labelFalse(val: string) {
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
    const val = this.defaultValue;
    if (val === "indeterminate" || val === null || val === undefined) this.setBooleanValue(undefined);
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
      .append(css.itemOnError, this.hasCssError())
      .append(css.itemDisabled, this.isDisabledStyle)
      .append(css.itemReadOnly, this.isReadOnlyStyle)
      .append(css.itemPreview, this.isPreviewStyle)
      .append(css.itemHover, !this.isDesignMode)
      .append(css.itemChecked, !!this.booleanValue)
      .append(css.itemExchanged, !!this.swapOrder)
      .append(css.itemIndeterminate, !this.isDeterminated)
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
        itemDisable: this.cssClasses.checkboxItemDisabled,
        itemReadOnly: this.cssClasses.checkboxItemReadOnly,
        itemPreview: this.cssClasses.checkboxItemPreview,
        itemChecked: this.cssClasses.checkboxItemChecked,
        itemIndeterminate: this.cssClasses.checkboxItemIndeterminate
      }
    );
  }

  public getLabelCss(checked: boolean): string {
    return new CssClassBuilder()
      .append(this.cssClasses.label)
      .append(this.cssClasses.disabledLabel, this.booleanValue === !checked || this.isDisabledStyle)
      .append(this.cssClasses.labelReadOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.labelPreview, this.isPreviewStyle)
      .append(this.cssClasses.labelTrue, !this.isIndeterminate && checked === !this.swapOrder)
      .append(this.cssClasses.labelFalse, !this.isIndeterminate && checked === this.swapOrder)
      .toString();
  }

  public get svgIcon(): string {
    if (this.booleanValue && this.cssClasses.svgIconCheckedId) return this.cssClasses.svgIconCheckedId;
    if (!this.isDeterminated && this.cssClasses.svgIconIndId) return this.cssClasses.svgIconIndId;
    if (!this.booleanValue && this.cssClasses.svgIconUncheckedId) return this.cssClasses.svgIconUncheckedId;
    return this.cssClasses.svgIconId;
  }

  public get itemSvgIcon(): string {
    if (this.isPreviewStyle && this.cssClasses.itemPreviewSvgIconId) {
      return this.cssClasses.itemPreviewSvgIconId;
    }
    return this.cssClasses.itemSvgIconId;
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
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    if (newValue === "true" && this.valueTrue !== "true") newValue = true;
    if (newValue === "false" && this.valueFalse !== "false") newValue = false;
    if (newValue === "indeterminate" || newValue === null) newValue = undefined;
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
    let isRtl = false;
    if (DomDocumentHelper.isAvailable()) {
      isRtl = DomDocumentHelper.getComputedStyle(event.target).direction == "rtl";
    }
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
      event.stopPropagation();
      this.calculateBooleanValueByEvent(event, event.key === "ArrowRight");
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
    if (this.isDisabledStyle) {
      className += " " + css.radioItemDisabled;
    }
    if (this.isReadOnlyStyle) {
      className += " " + css.radioItemReadOnly;
    }
    if (this.isPreviewStyle) {
      className += " " + css.radioItemPreview;
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

  //a11y
  public get isNewA11yStructure(): boolean {
    return true;
  }
  public get a11y_input_ariaRole(): string {
    return "switch";
  }
  // EO a11y
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
    { name: "swapOrder:boolean", category: "general" },
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
