import { ItemValue } from "./itemvalue";
import { Question } from "./question";
import { property, propertyArray, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { settings } from "./settings";
import { surveyLocalization } from "./surveyStrings";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { Base } from "./base";
import { HtmlConditionItem } from "./expressionItems";
import { mergeValues } from "./utils/utils";
import { DropdownListModel } from "./dropdownListModel";

export class RenderedRatingItem extends Base {
  private onStringChangedCallback() {
    this.text = this.itemValue.text;
  }
  public get value(): number {
    return this.itemValue.getPropertyValue("value");
  }
  @property({ defaultValue: "" }) highlight: "none" | "highlighted" | "unhighlighted";

  public get locText(): LocalizableString {
    return this.locString || this.itemValue.locText;
  }
  @property({ defaultValue: "" }) text: string;
  constructor(public itemValue: ItemValue, private locString: LocalizableString = null) {
    super();
    this.locText.onStringChanged.add(this.onStringChangedCallback.bind(this));
    this.onStringChangedCallback();
  }
}

/**
 * A Model for a rating question.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-rating/ (linkStyle))
 */
export class QuestionRatingModel extends Question {
  constructor(name: string) {
    super(name);
    this.createItemValues("rateValues");
    this.createRenderedRateItems();
    this.createLocalizableString("ratingOptionsCaption", this, false, true);
    this.registerFunctionOnPropertiesValueChanged(["rateMin", "rateMax",
      "minRateDescription", "maxRateDescription", "rateStep", "displayRateDescriptionsAsExtremeItems"],
    () => this.createRenderedRateItems());
    this.registerFunctionOnPropertiesValueChanged(["rateDisplayMode"],
      () => {
        this.setIconsToRateValues();
        this.createRenderedRateItems();
      });
    this.registerFunctionOnPropertiesValueChanged(["rateValues"],
      () => {
        this.autoGenerate = false;
        this.setIconsToRateValues();
        this.createRenderedRateItems();
      });
    this.registerFunctionOnPropertiesValueChanged(["autoGenerate"],
      () => {
        if (!this.autoGenerate && this.rateValues.length === 0) {
          this.setPropertyValue("rateValues", this.visibleRateValues);
        }
        if (this.autoGenerate) this.updateRateMax();
        this.createRenderedRateItems();
      });
    this.createLocalizableString(
      "minRateDescription",
      this,
      true
    );
    this.createLocalizableString(
      "maxRateDescription",
      this,
      true
    );
    this.initPropertyDependencies();
  }
  private jsonObj: any;
  private setIconsToRateValues() {
    if (this.rateType == "smileys")
      this.rateValues.map(item => item.icon = this.getItemSmiley(item));
  }

  startLoadingFromJson(jsonObj: any) {
    super.startLoadingFromJson(jsonObj);
    this.jsonObj = jsonObj;
  }

  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.hasMinRateDescription = !!this.minRateDescription;
    this.hasMaxRateDescription = !!this.maxRateDescription;
    if (this.jsonObj.rateMin !== undefined && this.jsonObj.rateCount !== undefined && this.jsonObj.rateMax === undefined) {
      this.updateRateMax();
    }
    if (this.jsonObj.rateMax !== undefined && this.jsonObj.rateCount !== undefined && this.jsonObj.rateMin === undefined) {
      this.updateRateMin();
    }
    if (this.jsonObj.autoGenerate === undefined && this.jsonObj.rateValues !== undefined) this.autoGenerate = !this.jsonObj.rateValues.length;
    this.updateRateCount();
    this.createRenderedRateItems();
  }

  private _syncPropertiesChanging: boolean = false;
  private registerSychProperties(names: Array<string>, func: any) {
    this.registerFunctionOnPropertiesValueChanged(names,
      () => {
        if (!this._syncPropertiesChanging) {
          this._syncPropertiesChanging = true;
          func();
          this._syncPropertiesChanging = false;
        }
      });
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
    if (this.useRateValues()) {
      this.rateCount = this.rateValues.length;
    }
    else {
      this.rateCount = Math.trunc((this.rateMax - this.rateMin) / (this.rateStep || 1)) + 1;
    }
  }
  initPropertyDependencies() {
    this.registerSychProperties(["rateCount"],
      () => {
        if (!this.useRateValues()) {
          this.rateMax = this.rateMin + this.rateStep * (this.rateCount - 1);
        } else {
          if (this.rateCount < this.rateValues.length) {
            this.rateValues.splice(this.rateCount, this.rateValues.length - this.rateCount);
          } else {
            for (let i = this.rateValues.length; i < this.rateCount; i++) this.rateValues.push(new ItemValue(undefined));
          }
        }
      });
    this.registerSychProperties(["rateMin", "rateMax", "rateStep", "rateValues"],
      () => {
        this.updateRateCount();
      });
  }

  @property({ defaultValue: true }) autoGenerate: boolean;

  /**
   * A list of rate values.
   *
   * This property accepts an array of objects with the following structure:
   *
   * ```js
   * {
   *   "value": any, // A value to be saved in survey results
   *   "text": String, // A display text. This property supports Markdown. When `text` is undefined, `value` is used.
   *   "customProperty": any // Any property that you find useful.
   * }
   * ```
   *
   * If you add custom properties, refer to the following help topic to learn how to serialize them into JSON: [Add Custom Properties to Property Grid](https://surveyjs.io/survey-creator/documentation/property-grid#add-custom-properties-to-the-property-grid).
   *
   * To enable Markdown support for the `text` property, implement Markdown-to-HTML conversion in the [onTextMarkdown](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onTextMarkdown) event handler. For an example, refer to the following demo: [Convert Markdown to HTML with Showdown](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/).
   *
   * If you need to specify only the `value` property, you can set the `rateValues` property to an array of numbers, for example, `[ 3, 6, 10 ]`. These values are both saved in survey results and used as display text.
   *
   * If you do not specify the `rateValues` property, rate values are generated automatically based upon the [`rateMin`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMin), [`rateMax`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMax), [`rateStep`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateStep), and [`rateCount`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateCount) property values.
   */
  public get rateValues(): Array<any> {
    return this.getPropertyValue("rateValues");
  }
  public set rateValues(val: Array<any>) {
    this.setPropertyValue("rateValues", val);
    this.createRenderedRateItems();
  }
  /**
   * Specifies the first rate value in the generated sequence of rate values. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.
   *
   * Default value: 1
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
   */
  @property({ defaultValue: 5 }) rateCount: number;

  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    var res = ItemValue.getTextOrHtmlByValue(this.visibleRateValues, value);
    return !!res ? res : value;
  }
  get visibleRateValues(): ItemValue[] {
    return this.renderedRateItems.map(i => i.itemValue);
  }

  public itemValuePropertyChanged(
    item: ItemValue,
    name: string,
    oldValue: any,
    newValue: any
  ) {
    if (!this.useRateValues() && newValue !== undefined) this.autoGenerate = false;
    super.itemValuePropertyChanged(item, name, oldValue, newValue);
  }
  private createRenderedRateItems() {
    let rateValues = [];
    if (this.useRateValues()) {
      rateValues = this.rateValues;
    }
    else {
      var res = [];
      var value = this.rateMin;
      var step = this.rateStep;
      while (
        value <= this.rateMax &&
        res.length < settings.ratingMaximumRateValueCount
      ) {
        let item = new ItemValue(value);
        item.locOwner = this;
        item.ownerPropertyName = "rateValues";
        res.push(item);
        value = this.correctValue(value + step, step);
      }
      rateValues = res;
    }

    if (this.rateType == "smileys" && rateValues.length > 10) rateValues = rateValues.slice(0, 10);

    this.renderedRateItems = rateValues.map((v, i) => {
      if (this.displayRateDescriptionsAsExtremeItems) {
        if (i == 0) return new RenderedRatingItem(v, this.minRateDescription && this.locMinRateDescription || v.locText);
        if (i == rateValues.length - 1) return new RenderedRatingItem(v, this.maxRateDescription && this.locMaxRateDescription || v.locText);
      }
      return new RenderedRatingItem(v);
    });
  }
  @propertyArray() renderedRateItems: Array<RenderedRatingItem>;

  private correctValue(value: number, step: number): number {
    if (!value) return value;
    if (Math.round(value) == value) return value;
    var fr = 0;
    while (Math.round(step) != step) {
      step *= 10;
      fr++;
    }
    return parseFloat(value.toFixed(fr));
  }
  public getType(): string {
    return "rating";
  }
  protected getFirstInputElementId(): string {
    return this.inputId + "_0";
  }
  public getInputId(index: number): string {
    return this.inputId + "_" + index;
  }
  supportGoNextPageAutomatic() {
    return true;
  }
  public supportOther(): boolean {
    return false;
  }
  /**
   * Specifies a description for the minimum (first) rate value.
   * @see rateValues
   * @see rateMin
   * @see displayRateDescriptionsAsExtremeItems
   */
  public get minRateDescription(): string {
    return this.getLocalizableStringText("minRateDescription");
  }
  public set minRateDescription(val: string) {
    this.setLocalizableStringText("minRateDescription", val);
    this.hasMinRateDescription = !!this.minRateDescription;
  }
  get locMinRateDescription(): LocalizableString {
    return this.getLocalizableString("minRateDescription");
  }
  /**
   * Specifies a description for the maximum (last) rate value.
   * @see rateValues
   * @see rateMax
   * @see displayRateDescriptionsAsExtremeItems
   */
  public get maxRateDescription(): string {
    return this.getLocalizableStringText("maxRateDescription");
  }
  public set maxRateDescription(val: string) {
    this.setLocalizableStringText("maxRateDescription", val);
    this.hasMaxRateDescription = !!this.maxRateDescription;
  }
  get locMaxRateDescription(): LocalizableString {
    return this.getLocalizableString("maxRateDescription");
  }
  @property({ defaultValue: false }) hasMinRateDescription: boolean;
  @property({ defaultValue: false }) hasMaxRateDescription: boolean;

  get hasMinLabel(): boolean {
    return !this.displayRateDescriptionsAsExtremeItems && !!this.hasMinRateDescription;
  }
  get hasMaxLabel(): boolean {
    return !this.displayRateDescriptionsAsExtremeItems && !!this.hasMaxRateDescription;
  }

  /**
  * Specifies whether to display `minRateDescription` and `maxRateDescription` values as captions for buttons that correspond to the extreme (first and last) rate values.
  *
  * Default value: `false`
  *
  * If this property is disabled, the `minRateDescription` and `maxRateDescription` values are displayed as plain non-clickable texts.
  *
  * If any of the `minRateDescription` and `maxRateDescription` properties is empty, the corresponding rate value's `value` or `text` is displayed as a button caption.
  * @see minRateDescription
  * @see maxRateDescription
  * @see rateMin
  * @see rateMax
  * @see rateValues
  */
  @property({ defaultValue: false }) displayRateDescriptionsAsExtremeItems: boolean;

  /**
  * Specifies how a Rating question displays rate values.
  *
  * Possible values:
  *
  * - `"buttons"` - Displays rate values as buttons in a row.
  * - `"dropdown"` - Displays rate values as items in a drop-down list.
  * - `"auto"` (default) - Selects between the `"buttons"` and `"dropdown"` modes based on the available width. When the width is insufficient to display buttons, the question displays a dropdown.
  */
  @property({
    defaultValue: "auto", onSet: (val: string, target: QuestionRatingModel) => {
      if (!target.isDesignMode) {
        if (val === "dropdown") {
          target.renderAs = "dropdown";
        } else {
          target.renderAs = "default";
        }
      }
    }
  }) displayMode: "dropdown" | "buttons" | "auto";

  @property({ defaultValue: "labels" }) rateDisplayMode: "labels" | "stars" | "smileys";

  public get rateType() {
    return this.rateDisplayMode;
  }
  public set rateType(val: "labels" | "stars" | "smileys") {
    this.rateDisplayMode = val;
  }
  @property({ defaultValue: "monochrome" }) smileysColorMode: "monochrome" | "colored";
  public get isStar() {
    return this.rateType == "stars";
  }
  public get isSmiley() {
    return this.rateType == "smileys";
  }
  public get itemComponentName() {
    if (this.isStar) return "sv-rating-item-star";
    if (this.isSmiley) return "sv-rating-item-smiley";
    return "sv-rating-item";
  }

  protected valueToData(val: any): any {
    if (this.useRateValues()) {
      var item = ItemValue.getItemByValue(this.rateValues, val);
      return !!item ? item.value : val;
    }
    return !isNaN(val) ? parseFloat(val) : val;
  }
  public setValueFromClick(value: any) {
    if (this.value === parseFloat(value)) {
      this.clearValue();
    } else {
      this.value = value;
    }
  }
  public onItemMouseIn(item: RenderedRatingItem) {
    if (this.isReadOnly || !item.itemValue.isEnabled) return;
    let high = true;
    let selected = this.value != null;
    for (let i: number = 0; i < this.renderedRateItems.length; i++) {
      this.renderedRateItems[i].highlight = high && !selected && "highlighted" || !high && selected && "unhighlighted" || "none";
      if (this.renderedRateItems[i] == item) high = false;
      if (this.renderedRateItems[i].itemValue.value == this.value) selected = false;
    }
  }
  public onItemMouseOut(item: RenderedRatingItem) {
    this.renderedRateItems.forEach(item => item.highlight = "none");
  }

  public get ratingRootCss(): string {
    return ((this.displayMode == "buttons" || (!!this.survey && this.survey.isDesignMode)) && this.cssClasses.rootWrappable) ?
      this.cssClasses.rootWrappable : this.cssClasses.root;
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

  public getItemClass(item: ItemValue, highlight: "none" | "highlighted" | "unhighlighted" = "none") {
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
    const renderedItem = this.renderedRateItems.filter(i => i.itemValue == item)[0];
    const isHighlighted = this.isStar && renderedItem?.highlight == "highlighted";
    const isUnhighlighted = this.isStar && renderedItem?.highlight == "unhighlighted";
    let itemClass = this.cssClasses.item;
    let itemSelectedClass = this.cssClasses.selected;
    let itemDisabledClass = this.cssClasses.itemDisabled;
    let itemHoverClass = this.cssClasses.itemHover;
    let itemitemOnErrorClass = this.cssClasses.itemOnError;
    let itemHighlightedClass = null;
    let itemUnhighlightedClass = null;

    if (this.isStar) {
      itemClass = this.cssClasses.itemStar;
      itemSelectedClass = this.cssClasses.itemStarSelected;
      itemDisabledClass = this.cssClasses.itemStarDisabled;
      itemHoverClass = this.cssClasses.itemStarHover;
      itemitemOnErrorClass = this.cssClasses.itemStarOnError;
      itemHighlightedClass = this.cssClasses.itemStarHighlighted;
      itemUnhighlightedClass = this.cssClasses.itemStarUnhighlighted;
    }
    if (this.isSmiley) {
      itemClass = this.cssClasses.itemSmiley;
      itemSelectedClass = this.cssClasses.itemSmileySelected;
      itemDisabledClass = this.cssClasses.itemSmileyDisabled;
      itemHoverClass = this.cssClasses.itemSmileyHover;
      itemitemOnErrorClass = this.cssClasses.itemSmileyOnError;
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

    return new CssClassBuilder()
      .append(itemClass)
      .append(itemSelectedClass, isSelected)
      .append(itemDisabledClass, this.isReadOnly)
      .append(itemHoverClass, allowHover)
      .append(itemHighlightedClass, isHighlighted)
      .append(itemUnhighlightedClass, isUnhighlighted)
      .append(itemitemOnErrorClass, this.errors.length > 0)
      .append(this.cssClasses.itemFixedSize, hasFixedSize)
      .toString();
  }
  //methods for mobile view
  public getControlClass(): string {
    this.isEmpty();
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.errors.length > 0)
      .append(this.cssClasses.controlDisabled, this.isReadOnly)
      .toString();
  }
  public get placeholder(): string {
    return this.getLocalizableStringText("ratingOptionsCaption");
  }
  public set placeholder(val: string) {
    this.setLocalizableStringText("ratingOptionsCaption", val);
  }
  get locPlaceholder(): LocalizableString {
    return this.getLocalizableString("ratingOptionsCaption");
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
  public get visibleChoices(): ItemValue[] {
    return this.visibleRateValues;
  }
  public get readOnlyText() {
    return (this.displayValue || this.placeholder);
  }

  public needResponsiveWidth() {
    const rateValues = this.getPropertyValue("rateValues");
    const rateStep = this.getPropertyValue("rateStep");
    const rateMax = this.getPropertyValue("rateMax");
    const rateMin = this.getPropertyValue("rateMin");
    return this.displayMode != "dropdown" && !!(this.hasMinRateDescription ||
      this.hasMaxRateDescription ||
      (rateStep && (rateMax - rateMin) / rateStep > 9));
  }

  // TODO: return responsiveness after design improvement
  protected supportResponsiveness(): boolean {
    return true;
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
    return this.dropdownListModelValue;
  }
  protected updateCssClasses(res: any, css: any) {
    super.updateCssClasses(res, css);
    if(!!this.dropdownListModel) {
      const listCssClasses = {};
      mergeValues(css.list, listCssClasses);
      mergeValues(res.list, listCssClasses);
      res["list"] = listCssClasses;
    }
  }
  protected calcCssClasses(css: any): any {
    const classes = super.calcCssClasses(css);
    if(this.dropdownListModel) {
      this.dropdownListModel.updateCssClasses(classes.popup, classes.list);
    }
    return classes;
  }
}
Serializer.addClass(
  "rating",
  [
    { name: "showCommentArea:switch", layout: "row", visible: true, category: "general" },
    {
      name: "rateDisplayMode",
      alternativeName: "rateType",
      default: "labels",
      category: "rateValues",
      choices: ["labels", "stars", "smileys"],
      visibleIndex: 0
    },
    {
      name: "autoGenerate",
      displayName: "How to specify rate values?",
      category: "rateValues",
      default: true,
      choices: [{ value: true, text: "Generate" }, { value: false, text: "Enter manually" }],
      visibleIndex: 2
    },
    {
      name: "rateCount:number",
      default: 5,
      category: "rateValues",
      visibleIndex: 1
    },
    {
      name: "rateValues:itemvalue[]",
      baseValue: function () {
        return surveyLocalization.getString("choices_Item");
      },
      category: "rateValues",
      visibleIf: function (obj: any) {
        return !obj.autoGenerate;
      },
      visibleIndex: 3
    },
    {
      name: "rateMin:number", default: 1,
      onSettingValue: (obj: any, val: any): any => {
        return val > obj.rateMax - obj.rateStep ? obj.rateMax - obj.rateStep : val;
      },
      visibleIf: function (obj: any) {
        return !!obj.autoGenerate;
      },
      visibleIndex: 4
    },
    {
      name: "rateMax:number", default: 5,
      onSettingValue: (obj: any, val: any): any => {
        return val < obj.rateMin + obj.rateStep ? obj.rateMin + obj.rateStep : val;
      },
      visibleIf: function (obj: any) {
        return !!obj.autoGenerate;
      },
      visibleIndex: 5
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
      visibleIndex: 6
    },
    {
      name: "minRateDescription",
      alternativeName: "mininumRateDescription",
      serializationProperty: "locMinRateDescription",
      visibleIndex: 17
    },
    {
      name: "maxRateDescription",
      alternativeName: "maximumRateDescription",
      serializationProperty: "locMaxRateDescription",
      visibleIndex: 18
    },
    { name: "displayRateDescriptionsAsExtremeItems:boolean", default: false, visibleIndex: 19 },
    {
      name: "displayMode",
      default: "auto",
      choices: ["auto", "buttons", "dropdown"],
      visibleIndex: 20
    },
  ],
  function () {
    return new QuestionRatingModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("rating", (name) => {
  return new QuestionRatingModel(name);
});
