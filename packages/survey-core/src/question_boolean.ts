import { QuestionFactory } from "./questionfactory";
import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { Question } from "./question";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { preventDefaults } from "./utils/dom-utils";
import { ActionContainer } from "./actions/container";
import { DomDocumentHelper } from "./global_variables_utils";
import { RendererFactory } from "./rendererFactory";

function isBooleanDisplayMode(val: string): boolean {
  return val === "radio" || val === "checkbox" || val === "switch";
}
function isEmptyRenderAs(val: string): boolean {
  return !val || val === "default";
}
function isCustomRenderAs(val: string): boolean {
  return !isEmptyRenderAs(val) && !isBooleanDisplayMode(val);
}

/**
 * A class that describes the Yes/No (Boolean) question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-boolean/ (linkStyle))
 */
export class QuestionBooleanModel extends Question {
  public getType(): string {
    return "boolean";
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return true;
  }
  supportAutoAdvance(): boolean {
    return this.getRenderAsValue() !== "checkbox";
  }
  public get isIndeterminate(): boolean {
    return this.isEmpty();
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
  private setBooleanValue(val: any) {
    if (this.isValueEmpty(val)) {
      this.value = undefined;
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
    if ((this.isLabelRendered && !this.showTitle || this.isValueEmpty(original.text)) && !this.isValueEmpty(this.locLabel.text)) return this.locLabel;
    return original;
  }
  public get labelRenderedAriaID(): string {
    return this.isLabelRendered ? this.ariaTitleId : null;
  }

  public beforeDestroyQuestionElement(el: HTMLElement): void {
    super.beforeDestroyQuestionElement(el);
    this.leftAnswerElement = undefined;
  }

  /**
   * @deprecated Use the [`title`](https://surveyjs.io/form-library/documentation/api-reference/boolean-question-model#title) property instead.
   * @hidden
   */
  @property({ localizable: true }) label: string;

  @property({ defaultValue: false, onSet: (val: boolean, target: QuestionBooleanModel) => {
    if (val) target.setPropertyValue("titleLocation", "hidden");
  } }) useTitleAsLabel: boolean;

  get isLabelRendered(): boolean {
    return this.titleLocation === "hidden" || this.useTitleAsLabel;
  }
  get canRenderLabelDescription(): boolean {
    return this.isLabelRendered && this.hasDescription && (this.hasDescriptionUnderTitle || this.hasDescriptionUnderInput);
  }
  /**
   * Gets or sets a text label that corresponds to a positive answer.
   *
   * Default value: "Yes"
   *
   * [View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))
   * @see valueTrue
   * @see valueFalse
   */
  @property({ localizable: { defaultStr: "booleanCheckedLabel", markdown: true } }) labelTrue: string;
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
    return this.swapOrder ? this.locLabelTrue : this.locLabelFalse;
  }
  get locLabelRight(): LocalizableString {
    return this.swapOrder ? this.locLabelFalse : this.locLabelTrue;
  }

  /**
   * Gets or sets a text label that corresponds to a negative answer.
   *
   * Default value: "No"
   *
   * [View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))
   * @see valueTrue
   * @see valueFalse
   */
  @property({ localizable: { defaultStr: "booleanUncheckedLabel", markdown: true } }) labelFalse: string;
  /**
   * A value to save in survey results when respondents give a positive answer.
   *
   * Default value: `true`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))
   * @see labelTrue
   * @see labelFalse
   */
  @property()
    valueTrue: any;
  /**
   * A value to save in survey results when respondents give a negative answer.
   *
   * Default value: `false`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/yes-no-question/ (linkStyle))
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
    if (this.isDefaultValueSet("true", this.valueTrue))this.setBooleanValue(true);
    if (this.isDefaultValueSet("false", this.valueFalse))this.setBooleanValue(false);
    const val = this.defaultValue;
    if (val === "indeterminate" || val === null || val === undefined)this.setBooleanValue(undefined);
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
      .append(css.itemIsLabelRendered, !!this.isLabelRendered)
      .toString();
  }

  public getItemCss(): string {
    return this.getItemCssValue(this.cssClasses);
  }
  public getSwitchButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.switchButton)
      .append(this.cssClasses.switchButtonChecked, !!this.booleanValue)
      .append(this.cssClasses.switchButtonReadOnly, this.isReadOnlyStyle)
      .toString();
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
        itemIndeterminate: this.cssClasses.checkboxItemIndeterminate,
        itemIsLabelRendered: this.cssClasses.checkboxIsLabelRendered
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

  updateValueFromSurvey(newValue: any, clearData: boolean = false): void {
    super.updateValueFromSurvey(newValue, clearData);
  }

  protected onValueChanged(): void {
    super.onValueChanged();
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
      isRtl = DomDocumentHelper.isRtlDirection(this.survey.rootElement);
    }
    let value = isRtl ? !isRightClick : isRightClick;
    // When swapOrder is true, the visual order is reversed (Yes on left, No on right)
    // So we need to invert the boolean value to match the visual expectation
    if (this.swapOrder) {
      value = !value;
    }
    this.booleanValue = value;
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
    const key = event.key;
    if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
      if (this.isInputReadOnly) {
        preventDefaults(event);
        return false;
      }
      if (key === "ArrowLeft" || key === "ArrowRight") {
        event.stopPropagation();
        this.calculateBooleanValueByEvent(event, key === "ArrowRight");
      }
    }
    return true;
  }
  /* #endregion */

  public getRadioItemClass(css: any, value: any): string {
    let className = undefined;
    if (css.radioItem) {
      className = css.radioItem;
    }
    if (css.radioItemChecked && value === this.value) {
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

  /**
   * Specifies the visual representation of the Yes/No question.
   *
   * Possible values:
   *
   * - `"segmented"` (default) - Displays a toggle switch on wide screens and radio buttons on narrow screens.
   * - `"radio"` - Displays Yes/No answers as radio buttons.
   * - `"checkbox"` - Displays a single checkbox.
   * - `"switch"` - Displays a switch control with the question title.
   * - `"custom"` - Set automatically when the `renderAs` property contains a custom renderer name.
   * @since 3.0.0
   */
  @property() displayMode: "segmented" | "radio" | "checkbox" | "switch" | "custom";
  private customRenderAs: string;
  private saveCustomRenderAs(renderAs: string): void {
    if (isCustomRenderAs(renderAs)) {
      this.customRenderAs = renderAs;
    }
  }
  private getRenderAsValue(): string {
    if (!isEmptyRenderAs(this.renderAs)) return this.renderAs;
    const displayMode = this.displayMode;
    if (displayMode === "custom" && this.customRenderAs) return this.customRenderAs;
    return isBooleanDisplayMode(displayMode) ? displayMode : "default";
  }
  public getComponentName(): string {
    return RendererFactory.Instance.getRenderer(this.getType(), this.getRenderAsValue());
  }
  public onSurveyLoad(): void {
    super.onSurveyLoad();
    const renderAs = this.renderAs;
    if (isEmptyRenderAs(renderAs)) return;
    if (isBooleanDisplayMode(renderAs)) {
      this.displayMode = <"radio" | "checkbox" | "switch">renderAs;
      this.renderAs = "default";
    } else {
      this.customRenderAs = renderAs;
      this.displayMode = "custom";
    }
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "displayMode") {
      this.updateRenderAsOnDisplayModeChanged(oldValue, newValue);
    }
    if (name === "renderAs" && this.displayMode === "custom") {
      this.saveCustomRenderAs(newValue);
    }
  }
  private updateRenderAsOnDisplayModeChanged(oldValue: string, newValue: string): void {
    if (newValue === "custom") {
      if (this.customRenderAs) {
        this.renderAs = this.customRenderAs;
      }
      return;
    }
    if (oldValue === "custom") {
      this.saveCustomRenderAs(this.renderAs);
      this.renderAs = "default";
    } else if (isBooleanDisplayMode(this.renderAs)) {
      this.renderAs = "default";
    }
  }
  protected supportResponsiveness(): boolean {
    return true;
  }
  protected getCompactRenderAs(): string {
    const displayMode = this.displayMode;
    return isBooleanDisplayMode(displayMode) ? displayMode : "radio";
  }
  protected getDesktopRenderAs(): string {
    const displayMode = this.displayMode;
    return isBooleanDisplayMode(displayMode) ? displayMode : "default";
  }
  protected createActionContainer(allowAdaptiveActions?: boolean): ActionContainer {
    return super.createActionContainer(this.getRenderAsValue() !== "checkbox");
  }

  protected getIsTitleRenderedAsString(): boolean { return false; }

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
    { name: "showCommentArea:switch", visible: true },
    { name: "label:text", serializationProperty: "locLabel", isSerializable: false, visible: false },
    {
      name: "labelTrue",
      serializationProperty: "locLabelTrue",
    },
    {
      name: "labelFalse",
      serializationProperty: "locLabelFalse",
    },
    "valueTrue",
    "valueFalse",
    { name: "swapOrder:boolean" },
    {
      name: "displayMode",
      default: "segmented",
      choices: ["segmented", "radio", "checkbox", "switch"],
      isSerializableFunc: (obj: any) => obj.displayMode !== "custom"
    },
    {
      name: "renderAs",
      default: "default",
      visible: false,
      isSerializableFunc: (obj: any) => isCustomRenderAs(obj.renderAs)
    },
    { name: "useTitleAsLabel", default: false, visible: false },
  ],
  function () {
    return new QuestionBooleanModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("boolean", (name) => {
  return new QuestionBooleanModel(name);
});
