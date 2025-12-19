import { ItemValue } from "./itemvalue";
import { Question } from "./question";
import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { settings } from "./settings";
import { getLocaleString } from "./surveyStrings";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { updateListCssValues } from "./utils/utils";
import { DropdownListModel } from "./dropdownListModel";
import { SurveyModel } from "./survey";
import { ISurveyImpl } from "./base-interfaces";
import { IsTouch } from "./utils/devices";
import { ITheme } from "./themes";
import { DomDocumentHelper } from "./global_variables_utils";
import { HashTable } from "./helpers";

function getColorFromProperty(varName: string) {
  if ("function" === typeof getComputedStyle) {
    const style = getComputedStyle(DomDocumentHelper.getDocumentElement());
    return style.getPropertyValue && style.getPropertyValue(varName);
  }
  return "";
}

function getRGBColor(themeVariables: any, colorName: string, varName: string) {
  let str: string = !!themeVariables && themeVariables[colorName] as any;
  if (!str) str = getColorFromProperty(varName);
  if (!str) return null;
  const canvasElement = DomDocumentHelper.createElement("canvas") as HTMLCanvasElement;
  if (!canvasElement) return null;
  var ctx = canvasElement.getContext("2d");
  ctx.fillStyle = str;

  if (ctx.fillStyle == "#000000") {
    ctx.fillStyle = getColorFromProperty(varName);
  }
  const newStr = ctx.fillStyle;

  if (newStr.startsWith("rgba")) {
    return newStr.substring(5, newStr.length - 1).split(",").map(c => +(c.trim()));
  }
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newStr);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
    1
  ] : null;
}
interface IRatingItemOwner extends ILocalizableOwner {
  getItemStyle(item: RatingItem): any;
  getItemClass(item: RatingItem): string;
  getDescription(item: RatingItem): LocalizableString;
}

export class RatingItem extends ItemValue {
  constructor(value: any, text?: string) {
    super(value, text);
  }

  public getType(): string {
    return "ratingitem";
  }
  private get ratingOwner(): IRatingItemOwner { return this.locOwner as IRatingItemOwner; }

  @property({ defaultValue: "" }) highlight: "none" | "highlighted" | "unhighlighted";

  public get style(): any {
    return this.getPropertyValue("style", undefined, () => this.ratingOwner?.getItemStyle(this));
  }

  public get className(): string {
    return this.getPropertyValue("className", undefined, () => this.ratingOwner?.getItemClass(this));
  }

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (["style", "className"].indexOf(name) === -1) {
      this.resetVisuals();
    }
  }

  public resetVisuals(): void {
    this.resetPropertyValue("style");
    this.resetPropertyValue("className");
  }

  public get description(): LocalizableString {
    return this.ratingOwner?.getDescription(this);
  }

  public getLocText(): LocalizableString {
    return this.description || super.getLocText();
  }
}

/**
 * A class that describes the Rating Scale question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))
 */
export class QuestionRatingModel extends Question implements IRatingItemOwner {
  constructor(name: string) {
    super(name);

    this.createItemValues("rateValues");
    this.registerSychProperties(["rateValues"],
      () => {
        this.autoGenerate = this.rateValues.length == 0;
        this.setIconsToRateValues();
        this.resetRenderedItems();
      });
    this.registerSychProperties(["autoGenerate"],
      () => {
        if (!this.autoGenerate && this.rateValues.length === 0) {
          this.setArray("rateValues", this.rateValues, this.visibleRateValues, false, false);
        }
        if (this.autoGenerate) {
          this.rateValues.splice(0, this.rateValues.length);
          this.updateRateMax();
        }
        this.resetRenderedItems();
      });

    this.initPropertyDependencies();
  }

  private resetItemsVisuals() {
    const items = this.getPropertyValue("visibleChoices");
    if (Array.isArray(items)) {
      items.forEach(item => item.resetVisuals());
    }
  }

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    const resetItemsVisualProps = ["cssClassesValue", "isReadOnly", "isVisible", "errors"];
    if (resetItemsVisualProps.indexOf(name) > -1) {
      this.resetItemsVisuals();
    }
    const resetReadOnlyTextProps = ["value", "renderAs", "placeholder", "choices", "visibleChoices"];
    if (resetReadOnlyTextProps.indexOf(name) > -1) {
      this.resetReadOnlyText();
    }
    const resetItemsProps = (["rateMin", "rateMax",
      "minRateDescription", "maxRateDescription", "rateStep", "displayRateDescriptionsAsExtremeItems",
      "rateType", "rateValues"]);
    if (resetItemsProps.indexOf(name) > -1) {
      if (name === "rateType" || name === "rateValues") {
        this.setIconsToRateValues();
      }
      this.resetRenderedItems();
      if (name === "rateType") {
        this.updateRateCount();
      }
    }
    if (name === "rateColorMode" || name === "scaleColorMode") {
      this.updateColors((this.survey as SurveyModel).themeVariables);
    }
    if (name === "displayMode") {
      this.updateRenderAsBasedOnDisplayMode(false);
    }
  }
  private setIconsToRateValues() {
    if (this.rateType == "smileys") {
      this.rateValues.map(item => item.icon = this.getItemSmiley(item));
    }
  }

  public locStrsChanged(): void {
    super.locStrsChanged();
    this.resetReadOnlyText();
    this.dropdownListModelValue?.locStrsChanged();
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    if (this.jsonObj.rateMin !== undefined && this.jsonObj.rateCount !== undefined && this.jsonObj.rateMax === undefined) {
      this.updateRateMax();
    }
    if (this.jsonObj.rateMax !== undefined && this.jsonObj.rateCount !== undefined && this.jsonObj.rateMin === undefined) {
      this.updateRateMin();
    }
    if (this.jsonObj.autoGenerate === undefined && this.jsonObj.rateValues !== undefined)this.autoGenerate = !this.jsonObj.rateValues.length;
    this.updateRateCount();
    this.setIconsToRateValues();
  }
  private useRateValues() {
    return !!this.rateValues.length && !this.autoGenerate;
  }
  private updateRateMax() {
    this.rateMax = this.rateMin + this.rateStep * (this.rateCount - 1);
  }
  private updateRateMin() {
    this.rateMin = this.rateMax - this.rateStep * (this.rateCount - 1);
  }
  private updateRateCount() {
    let newCount = 0;
    if (this.useRateValues()) {
      newCount = this.rateValues.length;
    } else {
      newCount = Math.trunc((this.rateMax - this.rateMin) / (this.rateStep || 1)) + 1;
    }
    if (newCount > 10 && this.rateType == "smileys") {
      newCount = 10;
    }
    this.rateCount = newCount;
    if (this.rateValues.length > newCount)this.rateValues.splice(newCount, this.rateValues.length - newCount);
  }
  initPropertyDependencies() {
    this.registerSychProperties(["rateCount"],
      () => {
        if (!this.useRateValues()) {
          this.rateMax = this.rateMin + this.rateStep * (this.rateCount - 1);
        } else {
          if (this.rateCount < this.rateValues.length) {
            if (this.rateCount >= 10 && this.rateType == "smileys") return;
            this.rateValues.splice(this.rateCount, this.rateValues.length - this.rateCount);
          } else {
            for (let i = this.rateValues.length; i < this.rateCount; i++) {
              this.rateValues.push(new RatingItem(getLocaleString("choices_Item") + (i + 1)));
            }
          }
        }
      });
    this.registerSychProperties(["rateMin", "rateMax", "rateStep", "rateValues"],
      () => {
        this.updateRateCount();
      });
  }

  @property({ defaultValue: false }) inputHasValue: boolean;

  public get showSelectedItemLocText(): boolean {
    return !this.readOnly && !this.inputHasValue && !!this.selectedItemLocText;
  }
  public get selectedItemLocText(): LocalizableString {
    return !this.readOnly && this.visibleRateValues.filter(v => v.value == this.value)[0]?.locText;
  }

  @property() autoGenerate: boolean;

  /**
   * A list of rate values.
   *
   * This property accepts an array of objects with the following structure:
   *
   * ```js
   * {
   *   "value": any, // A value to be saved in survey results
   *   "text": string, // A display text. This property supports Markdown. When `text` is undefined, `value` is used.
   *   "customProperty": any // Any property that you find useful.
   * }
   * ```
   *
   * If you add custom properties, refer to the following help topic to learn how to serialize them into JSON: [Add Custom Properties to Property Grid](https://surveyjs.io/survey-creator/documentation/property-grid#add-custom-properties-to-the-property-grid).
   *
   * To enable Markdown support for the `text` property, implement Markdown-to-HTML conversion in the [onTextMarkdown](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onTextMarkdown) event handler. For an example, refer to the following demo: [Convert Markdown to HTML with markdown-it](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/).
   *
   * If you need to specify only the `value` property, you can set the `rateValues` property to an array of numbers, for example, `[ 3, 6, 10 ]`. These values are both saved in survey results and used as display text.
   *
   * If you do not specify the `rateValues` property, rate values are generated automatically based upon the [`rateMin`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMin), [`rateMax`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMax), [`rateStep`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateStep), and [`rateCount`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateCount) property values.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))
   */
  public get rateValues(): Array<any> {
    return this.getPropertyValue("rateValues");
  }
  public set rateValues(val: Array<any>) {
    this.setPropertyValue("rateValues", val);
  }
  public selectItem(item: ItemValue): void {
    if (!this.isReadOnly && !!item) {
      this.value = item.value;
    }
  }
  /**
   * Specifies the first rate value in the generated sequence of rate values. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.
   *
   * Default value: 1
   *
   * [View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))
   * @see rateMax
   * @see rateStep
   * @see rateCount
   */
  public get rateMin(): number {
    return this.getPropertyValue("rateMin");
  }
  public set rateMin(val: number) {
    this.setPropertyValue("rateMin", val);
  }
  /**
   * Specifies the last rate value in the generated sequence of rate values. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.
   *
   * Default value: 5
   *
   * [View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))
   * @see rateMin
   * @see rateStep
   * @see rateCount
   */
  public get rateMax(): number {
    return this.getPropertyValue("rateMax");
  }
  public set rateMax(val: number) {
    this.setPropertyValue("rateMax", val);
  }
  /**
   * Specifies a step with which to generate rate values. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.
   *
   * Default value: 1
   *
   * [View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))
   * @see rateMin
   * @see rateMax
   * @see rateCount
   */
  public get rateStep(): number {
    return this.getPropertyValue("rateStep");
  }
  public set rateStep(val: number) {
    this.setPropertyValue("rateStep", val);
  }
  /**
   * Specifies the number of rate values you want to generate. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.
   *
   * Set the [`rateMin`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMin) or [`rateMax`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMax) property to specify the first or the last rate value. Use the [`rateStep`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateStep) property to specify a step with which to generate rate values.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))
   */
  @property() rateCount: number;

  private static colorsCalculated: boolean = false;

  private static badColor: Array<number>;
  private static normalColor: Array<number>;
  private static goodColor: Array<number>;

  private static badColorLight: Array<number>;
  private static normalColorLight: Array<number>;
  private static goodColorLight: Array<number>;

  private updateColors(themeVariables: any) {
    if (this.colorMode === "monochrome") return;
    if (!DomDocumentHelper.isAvailable()) return;
    if (QuestionRatingModel.colorsCalculated) return;

    QuestionRatingModel.badColor = getRGBColor(themeVariables, "--sjs-special-red", "--sd-rating-bad-color");
    QuestionRatingModel.normalColor = getRGBColor(themeVariables, "--sjs-special-yellow", "--sd-rating-normal-color");
    QuestionRatingModel.goodColor = getRGBColor(themeVariables, "--sjs-special-green", "--sd-rating-good-color");
    QuestionRatingModel.badColorLight = getRGBColor(themeVariables, "--sjs-special-red-light", "--sd-rating-bad-color-light");
    QuestionRatingModel.normalColorLight = getRGBColor(themeVariables, "--sjs-special-yellow-light", "--sd-rating-normal-color-light");
    QuestionRatingModel.goodColorLight = getRGBColor(themeVariables, "--sjs-special-green-light", "--sd-rating-good-color-light");

    this.colorsCalculated = true;
    this.resetRenderedItems();
  }

  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!this.useRateValues) return super.getDisplayValueCore(keysAsText, value);
    var res = ItemValue.getTextOrHtmlByValue(this.visibleRateValues, value);
    return !!res ? res : value;
  }
  get visibleRateValues(): RatingItem[] {
    return this.visibleChoices;
  }
  protected supportEmptyValidation(): boolean { return this.isDropdown; }
  private get isDropdown(): boolean { return this.renderAs === "dropdown"; }
  public itemValuePropertyChanged(item: ItemValue, name: string, oldValue: any, newValue: any): void {
    const reactedProps = ["value", "text", "icon", "visibleIf", "enableIf"];
    if (!this.useRateValues() && reactedProps.indexOf(name) >= 0) {
      this.autoGenerate = false;
    }
    super.itemValuePropertyChanged(item, name, oldValue, newValue);
  }

  protected runConditionCore(properties: HashTable<any>): void {
    super.runConditionCore(properties);
    this.runRateItesmCondition(properties);
  }
  protected runRateItesmCondition(properties: HashTable<any>): void {
    if (!this.useRateValues()) return;
    let isChanged = false;
    if (this.survey?.areInvisibleElementsShowing) {
      this.rateValues.forEach(item => {
        isChanged = isChanged || !item.isVisible;
        item.setIsVisible(item, true);
      });
    } else {
      isChanged = ItemValue.runConditionsForItems(this.rateValues, undefined, undefined, properties, true);
    }
    if (isChanged) {
      this.resetRenderedItems();
      if (!this.isEmpty() && !this.isReadOnly) {
        const item = ItemValue.getItemByValue(this.rateValues, this.value);
        if (item && !item.isVisible) {
          this.clearValue();
        }
      }
    }
  }
  private getRateValuesCore(): Array<RatingItem> {
    const values = !this.useRateValues() ? this.createRateValues() : this.rateValues;
    const items = new Array<RatingItem>();
    values.forEach(item => {
      if (item.isVisible) {
        items.push(item);
      }
    });
    return items;
  }
  private calculateRateValues(): Array<RatingItem> {
    let rateValues = this.getRateValuesCore();
    if (this.rateType == "smileys" && rateValues.length > 10) rateValues = rateValues.slice(0, 10);
    return rateValues;
  }

  public getDescription(e: RatingItem): LocalizableString {

    if (this.isLoadingFromJson) return undefined;
    if (!this.displayRateDescriptionsAsExtremeItems && !this.isDropdown) return undefined;
    const rateValues = this.visibleChoices;
    const idx = rateValues.indexOf(e);
    if (idx == 0) return this.minRateDescription && this.locMinRateDescription;
    if (idx == rateValues.length - 1) return this.maxRateDescription && this.locMaxRateDescription;

    return undefined;
  }

  private resetRenderedItems() {
    if (this.autoGenerate) {
      const rateValues = this.createRateValues();
      this.rateMax = rateValues[rateValues.length - 1].value;
    }
    this.resetPropertyValue("visibleChoices");
  }

  /**
   * @deprecated Use `visibleChoices` instead.
   */
  public get renderedRateItems(): RatingItem[] {
    return this.visibleChoices;
  }
  public get visibleChoices(): RatingItem[] {
    return this.getPropertyValue("visibleChoices", undefined, () => this.calculateRateValues());
  }
  protected updateVisibleChoices(): void {
    this.resetRenderedItems();
  }

  private createRateValues() {
    var res = [];
    var value = this.rateMin;
    var step = this.rateStep;
    while(value <= this.rateMax &&
      res.length < settings.ratingMaximumRateValueCount) {

      let item = new RatingItem(value, "");
      item.locOwner = this;
      item.ownerPropertyName = "rateValues";
      res.push(item);
      value = this.correctValue(value + step, step);
    }
    return res;
  }

  private correctValue(value: number, step: number): number {
    if (!value) return value;
    if (Math.round(value) == value) return value;
    var fr = 0;
    while(Math.round(step) != step) {
      step *= 10;
      fr++;
    }
    return parseFloat(value.toFixed(fr));
  }
  public getType(): string {
    return "rating";
  }
  protected getItemValueType() {
    return "ratingitem";
  }
  protected getFirstInputElementId(): string {
    return this.inputId + "_0";
  }
  public getInputId(index: number): string {
    return this.inputId + "_" + index;
  }
  public get questionName() {
    return this.name + "_" + this.id;
  }
  supportAutoAdvance(): boolean {
    return this.isMouseDown === true || this.isDropdown;
  }
  public supportOther(): boolean {
    return false;
  }
  protected getPlainDataCalculatedValue(propName: string): any {
    const res = super.getPlainDataCalculatedValue(propName);
    if (res !== undefined || !this.useRateValues || this.isEmpty()) return res;
    const item = <any>ItemValue.getItemByValue(this.visibleRateValues, this.value);
    return item ? item[propName] : undefined;
  }
  /**
   * Specifies a description for the minimum (first) rate value.
   * @see rateDescriptionLocation
   * @see displayRateDescriptionsAsExtremeItems
   * @see rateValues
   * @see rateMin
   */
  public get minRateDescription(): string {
    return this.getLocStringText(this.locMinRateDescription);
  }
  public set minRateDescription(val: string) {
    this.setLocStringText(this.locMinRateDescription, val);
  }
  get locMinRateDescription(): LocalizableString {
    return this.getOrCreateLocStr("minRateDescription", true, false, (strLoc: LocalizableString) => {
      strLoc.onStringChanged.add(() => {
        this.setPropertyValue("hasMinRateDescription", !strLoc.isEmpty);
      });
    });
  }
  /**
   * Specifies a description for the maximum (last) rate value.
   * @see rateDescriptionLocation
   * @see displayRateDescriptionsAsExtremeItems
   * @see rateValues
   * @see rateMax
   */
  public get maxRateDescription(): string {
    return this.getLocStringText(this.locMaxRateDescription);
  }
  public set maxRateDescription(val: string) {
    this.setLocStringText(this.locMaxRateDescription, val);
  }
  get locMaxRateDescription(): LocalizableString {
    return this.getOrCreateLocStr("maxRateDescription", true, false, (strLoc: LocalizableString) => {
      strLoc.onStringChanged.add(() => {
        this.setPropertyValue("hasMaxRateDescription", !strLoc.isEmpty);
      });
    });
  }
  public get hasMinRateDescription(): boolean {
    return this.getPropertyValue("hasMinRateDescription", undefined, () => !!this.minRateDescription);
  }
  public get hasMaxRateDescription(): boolean {
    return this.getPropertyValue("hasMaxRateDescription", undefined, () => !!this.maxRateDescription);
  }
  get hasMinLabel(): boolean {
    return !this.displayRateDescriptionsAsExtremeItems && !!this.hasMinRateDescription;
  }
  get hasMaxLabel(): boolean {
    return !this.displayRateDescriptionsAsExtremeItems && !!this.hasMaxRateDescription;
  }

  /**
  * Specifies whether to display [`minRateDescription`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#minRateDescription) and [`maxRateDescription`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#maxRateDescription) values as captions for buttons that correspond to the extreme (first and last) rate values.
  *
  * Default value: `false`
  *
  * If this property is disabled, the `minRateDescription` and `maxRateDescription` values are displayed as plain non-clickable texts.
  *
  * If any of the `minRateDescription` and `maxRateDescription` properties is empty, the corresponding rate value's `value` or `text` is displayed as a button caption.
  * @see rateDescriptionLocation
  * @see rateMin
  * @see rateMax
  * @see rateValues
  */
  @property() displayRateDescriptionsAsExtremeItems: boolean;

  /**
  * Specifies whether to display rate values as buttons or items in a drop-down list.
  *
  * Possible values:
  *
  * - `"buttons"` - Displays rate values as buttons in a row.
  * - `"dropdown"` - Displays rate values as items in a drop-down list.
  * - `"auto"` (default) - Selects between the `"buttons"` and `"dropdown"` modes based on the available width. When the width is insufficient to display buttons, the question displays a dropdown.
  *
  * [View Demo](https://surveyjs.io/form-library/examples/ui-adaptation-modes-for-rating-scale/ (linkStyle))
  * @see rateType
  */
  @property() displayMode: "dropdown" | "buttons" | "auto";
  private updateRenderAsBasedOnDisplayMode(isOnChange?: boolean): void {
    if (this.isDesignMode) {
      if (isOnChange || this.isDropdown) {
        this.renderAs = "default";
      }
    } else {
      if (isOnChange || this.displayMode !== "auto") {
        this.renderAs = this.displayMode === "dropdown" ? "dropdown" : "default";
      }
    }
  }
  public onSurveyLoad(): void {
    super.onSurveyLoad();
    if (this.isDropdown && this.displayMode === "auto") {
      this.displayMode = "dropdown";
    } else {
      this.updateRenderAsBasedOnDisplayMode();
    }
  }
  /**
  * Specifies the alignment of [`minRateDescription`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#minRateDescription) and [`maxRateDescription`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#maxRateDescription) texts.
  *
  * Possible values:
  *
  * - `"leftRight"` (default) - Aligns `minRateDescription` to the left of rate values and `maxRateDescription` to their right.
  * - `"top"` - Displays the descriptions above the minimum and maximum rate values.
  * - `"bottom"` - Displays both descriptions below the minimum and maximum rate values.
  * - `"topBottom"` - Displays `minRateDescription` above the minimum rate value and `maxRateDescription` below the maximum rate value.
  * @see displayRateDescriptionsAsExtremeItems
  */
  @property() rateDescriptionLocation: "leftRight" | "top" | "bottom" | "topBottom";

  /**
   * Specifies the visual representation of rate values.
   *
   * Possible values:
   *
   * - `"labels"` (default) - Displays rate values as buttons with labels.
   * - `"stars"` - Displays rate values as stars.
   * - `"smileys"` - Displays rate values as smiley faces.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))
   * @see scaleColorMode
   * @see rateColorMode
   * @see displayMode
   */
  @property() rateType: "labels" | "stars" | "smileys";

  public get rateDisplayMode() {
    return this.rateType;
  }
  public set rateDisplayMode(val: "labels" | "stars" | "smileys") {
    this.rateType = val;
  }
  /**
   * Specifies how to colorize the smiley face rating scale. Applies only if [`rateType`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateType) is `"smileys"`.
   *
   * Possible values:
   *
   * - `"monochrome"` (default) - Displays emojis in monochrome.
   * - `"colored"` - Displays emojis in color.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))
   * @see rateColorMode
   */
  @property() scaleColorMode: "monochrome" | "colored";
  /**
   * Specifies how to colorize the selected emoji. Applies only if [`rateType`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateType) is `"smileys"`.
   *
   * Possible values:
   *
   * - `"default"` - Displays the selected emoji in default survey color.
   * - `"scale"` (default) - Inherits the color from the scale.
   * @see scaleColorMode
   */
  @property() rateColorMode: "default" | "scale";

  public get isStar() {
    return this.rateType == "stars";
  }
  public get isSmiley() {
    return this.rateType == "smileys";
  }
  getDefaultItemComponent(): string {
    if (this.isDropdown) return "sv-rating-dropdown-item";
    if (this.isStar) return "sv-rating-item-star";
    if (this.isSmiley) return "sv-rating-item-smiley";
    return "sv-rating-item";
  }
  /**
   * The name of a component used to render items.
   */
  public get itemComponent(): string {
    return this.getPropertyValue("itemComponent", this.getDefaultItemComponent());
  }
  public set itemComponent(value: string) {
    this.setPropertyValue("itemComponent", value);
  }

  protected valueToData(val: any): any {
    if (this.useRateValues()) {
      var item = ItemValue.getItemByValue(this.visibleChoices, val);
      return !!item ? item.value : val;
    }
    return !isNaN(val) ? parseFloat(val) : val;
  }
  public setValueFromClick(value: any) {
    if (this.isReadOnlyAttr) return;
    if (this.value === ((typeof (this.value) === "string") ? value : parseFloat(value))) {
      this.clearValue(true);
    } else {
      this.value = value;
    }
    for (let i: number = 0; i < this.visibleChoices.length; i++) {
      this.visibleChoices[i].highlight = "none";
    }
  }
  public onItemMouseIn(item: RatingItem) {
    if (IsTouch) return;
    if (this.isReadOnly || !item.isEnabled || this.isDesignMode) return;
    let high = true;
    let selected = !this.isEmpty();
    if (this.rateType !== "stars") {
      item.highlight = "highlighted";
      return;
    }
    for (let i: number = 0; i < this.visibleChoices.length; i++) {
      this.visibleChoices[i].highlight = high && !selected && "highlighted" || !high && selected && "unhighlighted" || "none";
      if (this.visibleChoices[i] == item) high = false;
      if (this.visibleChoices[i].value == this.value) selected = false;
    }
  }
  public onItemMouseOut(item: RatingItem) {
    if (IsTouch) return;
    this.visibleChoices.forEach(item => item.highlight = "none");
    this.resetItemsVisuals();
  }

  public get itemSmallMode() {
    return !this.isSingleInputActive && this.inMatrixMode && settings.matrix.rateSize == "small";
  }

  public get ratingRootCss(): string {
    const hasLabel = this.hasMaxLabel || this.hasMinLabel;
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootWrappable, this.displayMode == "buttons" || (!!this.survey && this.survey.isDesignMode) || (this.displayMode == "auto" && !this.supportResponsiveness()))
      .append(this.cssClasses.rootLabelsTop, hasLabel && this.rateDescriptionLocation == "top")
      .append(this.cssClasses.rootLabelsBottom, hasLabel && this.rateDescriptionLocation == "bottom")
      .append(this.cssClasses.rootLabelsDiagonal, hasLabel && this.rateDescriptionLocation == "topBottom")
      .append(this.cssClasses.itemSmall, this.itemSmallMode && this.rateType != "labels")
      .toString();
  }

  public get itemStarIcon(): string {
    return this.itemSmallMode ? "icon-rating-star-small" : "icon-rating-star";
  }
  public get itemStarIconAlt(): string {
    return this.itemStarIcon + "-2";
  }

  public getItemSmiley(item: ItemValue) {
    const icons = ["terrible", "very-poor", "poor", "not-good", "average", "normal", "good", "very-good", "excellent", "perfect"];
    const priority = ["very-good", "not-good", "normal", "good", "average", "excellent", "poor", "perfect", "very-poor", "terrible"];
    const count = this.useRateValues() ? this.rateValues.length : this.rateMax - this.rateMin + 1;
    const selectedPriority = priority.slice(0, count);
    const selectedIcons = icons.filter(i => selectedPriority.indexOf(i) != -1);
    if (!this.useRateValues()) {
      return selectedIcons[item.value - this.rateMin];
    } else {
      return selectedIcons[this.rateValues.indexOf(item)];
    }
  }

  public getItemSmileyIconName(item: ItemValue) {
    return "icon-" + this.getItemSmiley(item);
  }

  private getRenderedItemColor(index: number, light: boolean): string {
    let startColor = light ? QuestionRatingModel.badColorLight : QuestionRatingModel.badColor;
    let endColor = light ? QuestionRatingModel.goodColorLight : QuestionRatingModel.goodColor;
    const normalIndex = (this.rateCount - 1) / 2.0;
    const middleColor = light ? QuestionRatingModel.normalColorLight : QuestionRatingModel.normalColor;
    if (index < normalIndex) {
      endColor = middleColor;
    } else {
      startColor = middleColor;
      index -= normalIndex;
    }
    if (!startColor || !endColor) return null;
    const curColor = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      curColor[i] = startColor[i] + (endColor[i] - startColor[i]) * index / normalIndex;
      if (i < 3) curColor[i] = Math.trunc(curColor[i]);
    }
    return "rgba(" + curColor[0] + ", " + curColor[1] + ", " + curColor[2] + ", " + curColor[3] + ")";
  }

  public getItemStyle(item: RatingItem) {
    if (this.scaleColorMode === "monochrome" && this.rateColorMode == "default" ||
      this.isPreviewStyle ||
      this.isReadOnlyStyle) return {};
    const index = this.visibleRateValues.indexOf(item);
    const color = this.getRenderedItemColor(index, false);
    const colorLight = item.highlight == "highlighted" && this.scaleColorMode === "colored" && this.getRenderedItemColor(index, true);
    return colorLight ? { "--sd-rating-item-color": color, "--sd-rating-item-color-light": colorLight } : { "--sd-rating-item-color": color };
  }

  public getItemClass(item: RatingItem): string {
    let isSelected = this.value == item.value;
    if (this.isStar) {
      if (!this.useRateValues()) {
        isSelected = this.value >= item.value;
      } else {
        isSelected = this.rateValues.indexOf(this.rateValues.filter(i => i.value == this.value)[0]) >= this.rateValues.indexOf(item);
      }
    }
    const isDisabled = this.isReadOnly || !item.isEnabled;
    const allowHover = !isDisabled && (this.value != item.value) && !(!!this.survey && this.survey.isDesignMode);

    const isHighlighted = this.isStar && item.highlight == "highlighted";
    const isUnhighlighted = this.isStar && item.highlight == "unhighlighted";

    let itemClass = this.cssClasses.item;
    let itemSelectedClass = this.cssClasses.selected;
    let itemDisabledClass = this.cssClasses.itemDisabled;
    let itemReadOnlyClass = this.cssClasses.itemReadOnly;
    let itemPreviewClass = this.cssClasses.itemPreview;
    let itemHoverClass = this.cssClasses.itemHover;
    let itemitemOnErrorClass = this.cssClasses.itemOnError;
    let itemHighlightedClass = null;
    let itemUnhighlightedClass = null;
    let itemScaleColoredClass = null;
    let itemRateColoredClass = null;
    let itemSmallClass = null;

    if (this.isStar) {
      itemClass = this.cssClasses.itemStar;
      itemSelectedClass = this.cssClasses.itemStarSelected;
      itemDisabledClass = this.cssClasses.itemStarDisabled;
      itemReadOnlyClass = this.cssClasses.itemStarReadOnly;
      itemPreviewClass = this.cssClasses.itemStarPreview;
      itemHoverClass = this.cssClasses.itemStarHover;
      itemitemOnErrorClass = this.cssClasses.itemStarOnError;
      itemHighlightedClass = this.cssClasses.itemStarHighlighted;
      itemUnhighlightedClass = this.cssClasses.itemStarUnhighlighted;
      itemSmallClass = this.cssClasses.itemStarSmall;
    }
    if (this.isSmiley) {
      itemClass = this.cssClasses.itemSmiley;
      itemSelectedClass = this.cssClasses.itemSmileySelected;
      itemDisabledClass = this.cssClasses.itemSmileyDisabled;
      itemReadOnlyClass = this.cssClasses.itemSmileyReadOnly;
      itemPreviewClass = this.cssClasses.itemSmileyPreview;
      itemHoverClass = this.cssClasses.itemSmileyHover;
      itemitemOnErrorClass = this.cssClasses.itemSmileyOnError;
      itemHighlightedClass = this.cssClasses.itemSmileyHighlighted;
      itemScaleColoredClass = this.cssClasses.itemSmileyScaleColored;
      itemRateColoredClass = this.cssClasses.itemSmileyRateColored;
      itemSmallClass = this.cssClasses.itemSmileySmall;
    }

    const hasFixedSize =
      !this.isStar &&
      !this.isSmiley &&
      (!this.displayRateDescriptionsAsExtremeItems ||
        this.useRateValues() && item != this.rateValues[0] && item != this.rateValues[this.rateValues.length - 1] ||
        !this.useRateValues() && item.value != this.rateMin && item.value != this.rateMax
      ) &&
      item.locText.calculatedText.length <= 2 &&
      Number.isInteger(Number(item.locText.calculatedText));

    const options: any = { item: item, css: "" };

    options.css = new CssClassBuilder()
      .append(itemClass)
      .append(itemSelectedClass, isSelected)
      .append(itemDisabledClass, this.isDisabledStyle)
      .append(itemReadOnlyClass, this.isReadOnlyStyle)
      .append(itemPreviewClass, this.isPreviewStyle)
      .append(itemHoverClass, allowHover)
      .append(itemHighlightedClass, isHighlighted)
      .append(itemScaleColoredClass, this.scaleColorMode == "colored")
      .append(itemRateColoredClass, this.rateColorMode == "scale" && isSelected)
      .append(itemUnhighlightedClass, isUnhighlighted)
      .append(itemitemOnErrorClass, this.hasCssError())
      .append(itemSmallClass, this.itemSmallMode)
      .append(this.cssClasses.itemFixedSize, hasFixedSize)
      .toString();

    if (!!this.survey) {
      this.survey.updateChoiceItemCss(this, options);
    }

    return options.css;
  }
  //methods for mobile view
  public getControlClass(): string {
    this.isEmpty();
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.hasCssError())
      .append(this.cssClasses.controlDisabled, this.isDisabledStyle)
      .append(this.cssClasses.controlReadOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.controlPreview, this.isPreviewStyle)
      .toString();
  }
  public get placeholder(): string {
    return this.getLocStringText(this.locPlaceholder);
  }
  public set placeholder(val: string) {
    this.setLocStringText(this.locPlaceholder, val);
  }
  get locPlaceholder(): LocalizableString {
    return this.getOrCreateLocStr("ratingOptionsCaption", false, true);
  }
  get allowClear(): boolean {
    return true;
  }
  get searchEnabled(): boolean {
    return false;
  }
  public get renderedValue(): any {
    return this.value;
  }
  public set renderedValue(val: any) {
    this.value = val;
  }
  public isItemSelected(item: ItemValue): boolean {
    return item.value == this.value;
  }
  public get readOnlyText(): string {
    return this.locReadOnlyText.calculatedText;
  }
  public get locReadOnlyText(): LocalizableString {
    return this.getOrCreateLocStr("readOnlyText", true, false, (locStr: LocalizableString) => {
      locStr.onGetTextCallback = (): string => {
        return this.displayValue || this.placeholder;
      };
    });
  }
  private resetReadOnlyText(): void {
    this.resetPropertyValue("readOnlyText");
  }
  public needResponsiveWidth() {
    const rateStep = this.getPropertyValue("rateStep");
    const rateMax = this.getPropertyValue("rateMax");
    const rateMin = this.getPropertyValue("rateMin");
    return this.displayMode != "dropdown" && !!(this.hasMinRateDescription ||
      this.hasMaxRateDescription ||
      (rateStep && (rateMax - rateMin) / rateStep > 9));
  }

  // TODO: return responsiveness after design improvement
  protected supportResponsiveness(): boolean {
    return !this.inMatrixMode;
  }
  protected onBeforeSetCompactRenderer(): void {
    if (!this.isDisposed && !this.dropdownListModelValue) {
      this.dropdownListModelValue = new DropdownListModel(this);
    }
  }
  protected getCompactRenderAs(): string {
    return (this.displayMode == "buttons") ? "default" : "dropdown";
  }
  protected getDesktopRenderAs(): string {
    return (this.displayMode == "dropdown") ? "dropdown" : "default";
  }

  private dropdownListModelValue: DropdownListModel;
  public set dropdownListModel(val: DropdownListModel) {
    this.dropdownListModelValue = val;
    this.updateElementCss();
  }
  public get dropdownListModel(): DropdownListModel {
    if (this.isDropdown) {
      this.onBeforeSetCompactRenderer();
    }
    return this.dropdownListModelValue;
  }
  protected onBlurCore(event: any): void {
    this.dropdownListModel?.onBlur(event);
    super.onBlurCore(event);
  }
  protected updateCssClasses(res: any, css: any) {
    super.updateCssClasses(res, css);
    updateListCssValues(res, css);
  }
  protected calcCssClasses(css: any): any {
    const classes = super.calcCssClasses(css);
    if (this.dropdownListModelValue) {
      this.dropdownListModelValue.updateCssClasses(classes.popup, classes.list);
    }
    return classes;
  }
  public themeChanged(theme: ITheme): void {
    this.colorsCalculated = false;
    this.updateColors(theme.cssVariables);
  }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean) {
    super.setSurveyImpl(value, isLight);
    if (!this.survey) return;
    this.updateColors((this.survey as SurveyModel).themeVariables);
    this.updateRenderAsBasedOnDisplayMode();
  }
  public dispose(): void {
    super.dispose();
    if (!!this.dropdownListModelValue) {
      this.dropdownListModelValue.dispose();
      this.dropdownListModelValue = undefined;
    }
  }

  //a11y
  public get a11yInputAriaRole(): string | null {
    return this.isDropdown ? "combobox" : null;
  }
  public get isNewA11yStructure(): boolean {
    return true;
  }
  public get a11y_input_ariaRole(): string {
    return "radiogroup";
  }
  // EO a11y
}

Serializer.addClass(
  "ratingitem",
  [],
  function (value: any) { return new RatingItem(value, ""); },
  "itemvalue"
);
Serializer.addClass(
  "rating",
  [
    { name: "showCommentArea:switch", layout: "row", visible: true, category: "general" },
    {
      name: "rateType",
      alternativeName: "rateDisplayMode",
      default: "labels",
      category: "rateValues",
      choices: ["labels", "stars", "smileys"],
      visibleIndex: 1
    },
    {
      name: "scaleColorMode",
      category: "rateValues",
      default: "monochrome",
      choices: ["monochrome", "colored"],
      visibleIf: function (obj: any) {
        return obj.rateType == "smileys";
      },
      visibleIndex: 2
    },
    {
      name: "rateColorMode",
      category: "rateValues",
      default: "scale",
      choices: ["default", "scale"],
      visibleIf: function (obj: any) {
        return obj.rateType == "smileys" && obj.scaleColorMode == "monochrome";
      },
      visibleIndex: 3
    },
    {
      name: "autoGenerate",
      category: "rateValues",
      default: true,
      choices: [true, false],
      visibleIndex: 5
    },
    {
      name: "rateCount:number",
      default: 5,
      category: "rateValues",
      visibleIndex: 4,
      onSettingValue: (obj: any, val: any): any => {
        if (val < 2) return 2;
        if (val > settings.ratingMaximumRateValueCount && val > obj.rateValues.length) return settings.ratingMaximumRateValueCount;
        if (val > 10 && obj.rateType == "smileys") return 10;
        return val;
      },
    },
    {
      name: "rateValues:ratingitem[]",
      baseValue: function () {
        return getLocaleString("choices_Item");
      },
      category: "rateValues",
      visibleIf: function (obj: any) {
        return !obj.autoGenerate;
      },
      visibleIndex: 6
    },
    {
      name: "rateMin:number", default: 1,
      onSettingValue: (obj: any, val: any): any => {
        return val > obj.rateMax - obj.rateStep ? obj.rateMax - obj.rateStep : val;
      },
      visibleIf: function (obj: any) {
        return !!obj.autoGenerate;
      },
      visibleIndex: 7
    },
    {
      name: "rateMax:number", default: 5,
      onSettingValue: (obj: any, val: any): any => {
        return val < obj.rateMin + obj.rateStep ? obj.rateMin + obj.rateStep : val;
      },
      visibleIf: function (obj: any) {
        return !!obj.autoGenerate;
      },
      visibleIndex: 8
    },
    {
      name: "rateStep:number", default: 1, minValue: 0.1,
      onSettingValue: (obj: any, val: any): any => {
        if (val <= 0) val = 1;
        if (val > obj.rateMax - obj.rateMin)
          val = obj.rateMax - obj.rateMin;
        return val;
      },
      visibleIf: function (obj: any) {
        return !!obj.autoGenerate;
      },
      visibleIndex: 9
    },
    {
      name: "minRateDescription",
      alternativeName: "mininumRateDescription",
      serializationProperty: "locMinRateDescription",
      visibleIndex: 18
    },
    {
      name: "maxRateDescription",
      alternativeName: "maximumRateDescription",
      serializationProperty: "locMaxRateDescription",
      visibleIndex: 19
    },
    {
      name: "displayRateDescriptionsAsExtremeItems:boolean",
      default: false,
      visibleIndex: 21,
      visibleIf: function (obj: any) {
        return obj.rateType == "labels";
      }
    },
    {
      name: "rateDescriptionLocation",
      default: "leftRight",
      choices: ["leftRight", "top", "bottom", "topBottom"],
      visibleIndex: 20
    },
    {
      name: "displayMode",
      default: "auto",
      choices: ["auto", "buttons", "dropdown"],
      visibleIndex: 0
    },
    { name: "itemComponent", visible: false,
      defaultFunc: (obj: any): any => {
        if (!obj) return "sv-rating-item";
        if (!!obj.getOriginalObj) obj = obj.getOriginalObj();
        return obj.getDefaultItemComponent();
      } }
  ],
  function () {
    return new QuestionRatingModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("rating", (name) => {
  return new QuestionRatingModel(name);
});
