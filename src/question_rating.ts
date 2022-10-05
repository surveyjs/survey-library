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

export class RenderedRatingItem extends Base {
  public get value(): number {
    return this.itemValue.getPropertyValue("value");
  }
  public get locText(): LocalizableString {
    return this.locString || this.itemValue.locText;
  }
  constructor(public itemValue: ItemValue, private locString: LocalizableString = null) {
    super();
  }
}

/**
 * A Model for a rating question.
 */
export class QuestionRatingModel extends Question {
  constructor(name: string) {
    super(name);
    this.createItemValues("rateValues");
    this.createRenderedRateItems();
    this.createLocalizableString("ratingOptionsCaption", this, false, true);
    this.onPropertyChanged.add((sender: any, options: any) => {
      if (
        options.name == "rateMin" ||
        options.name == "rateMax" ||
        options.name == "minRateDescription" ||
        options.name == "maxRateDescription" ||
        options.name == "rateStep" ||
        options.name == "displayRateDescriptionsAsExtremeItems"
      ) {
        this.createRenderedRateItems();
      }
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
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.hasMinRateDescription = !!this.minRateDescription;
    this.hasMaxRateDescription = !!this.maxRateDescription;
    this.createRenderedRateItems();
  }
  /**
   * The list of rate items. Every item has value and text. If text is empty, the value is rendered. The item text supports markdown. If it is empty the array is generated by using rateMin, rateMax and rateStep properties.
   * @see rateMin
   * @see rateMax
   * @see rateStep
   */
  public get rateValues(): Array<any> {
    return this.getPropertyValue("rateValues");
  }
  public set rateValues(val: Array<any>) {
    this.setPropertyValue("rateValues", val);
    this.createRenderedRateItems();
  }
  /**
   * This property is used to generate rate values if rateValues array is empty. It is the first value in the rating. The default value is 1.
   * @see rateValues
   * @see rateMax
   * @see rateStep
   */
  public get rateMin(): number {
    return this.getPropertyValue("rateMin");
  }
  public set rateMin(val: number) {
    this.setPropertyValue("rateMin", val);
  }
  /**
   * This property is used to generate rate values if rateValues array is empty. It is the last value in the rating. The default value is 5.
   * @see rateValues
   * @see rateMin
   * @see rateStep
   */
  public get rateMax(): number {
    return this.getPropertyValue("rateMax");
  }
  public set rateMax(val: number) {
    this.setPropertyValue("rateMax", val);
  }
  /**
   * This property is used to generate rate values if rateValues array is empty. It is the step value. The number of rate values are (rateMax - rateMin) / rateStep. The default value is 1.
   * @see rateValues
   * @see rateMin
   * @see rateMax
   */
  public get rateStep(): number {
    return this.getPropertyValue("rateStep");
  }
  public set rateStep(val: number) {
    this.setPropertyValue("rateStep", val);
  }
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
    if (this.rateValues.length === 0 && newValue !== undefined) this.setPropertyValue("rateValues", this.visibleRateValues);
    super.itemValuePropertyChanged(item, name, oldValue, newValue);
  }
  private createRenderedRateItems() {
    let rateValues = [];
    if (this.rateValues.length > 0) {
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
  public supportComment(): boolean {
    return true;
  }
  public supportOther(): boolean {
    return false;
  }
  /**
   * The description of minimum (first) item.
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
   * The description of maximum (last) item.
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
  * Specifies whether a Rating question displays the [minRateDescription](https://surveyjs.io/Documentation/Library?id=questionratingmodel#minRateDescription) and [maxRateDescription](https://surveyjs.io/Documentation/Library?id=questionratingmodel#maxRateDescription) property texts as buttons that correspond to the extreme (first and last) rate items. If any of these properties is empty, the corresponding rate item's value/text is used for display.
  * When the `displayRateDescriptionsAsExtremeItems` property is disabled, the texts defined through the [minRateDescription](https://surveyjs.io/Documentation/Library?id=questionratingmodel#minRateDescription) and [maxRateDescription](https://surveyjs.io/Documentation/Library?id=questionratingmodel#maxRateDescription) properties are displayed as plain non-clickable texts.
  * @see minRateDescription
  * @see maxRateDescription
  * @see rateMin
  * @see rateMax
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
  @property({ defaultValue: "auto", onSet: (val, target) => { } }) displayMode: "dropdown" | "buttons" | "auto";

  protected valueToData(val: any): any {
    if (this.rateValues.length > 0) {
      var item = ItemValue.getItemByValue(this.rateValues, val);
      return !!item ? item.value : val;
    }
    return !isNaN(val) ? parseFloat(val) : val;
  }
  /**
   * Click value again to clear.
   */
  public setValueFromClick(value: any) {
    if (this.value === parseFloat(value)) {
      this.clearValue();
    } else {
      this.value = value;
    }
  }

  public get ratingRootCss(): string {
    return ((this.displayMode == "buttons" || (!!this.survey && this.survey.isDesignMode)) && this.cssClasses.rootWrappable) ?
      this.cssClasses.rootWrappable : this.cssClasses.root;
  }

  public getItemClass(item: ItemValue) {
    const isSelected = this.value == item.value;
    const isDisabled = this.isReadOnly || !item.isEnabled;
    const allowHover = !isDisabled && !isSelected && !(!!this.survey && this.survey.isDesignMode);

    return new CssClassBuilder()
      .append(this.cssClasses.item)
      .append(this.cssClasses.selected, this.value == item.value)
      .append(this.cssClasses.itemDisabled, this.isReadOnly)
      .append(this.cssClasses.itemHover, allowHover)
      .append(this.cssClasses.itemOnError, this.errors.length > 0)
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
  public get renderedValue(): boolean {
    return this.value;
  }
  public set renderedValue(val: any) {
    this.value = val;
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
      rateValues.length > 0 ||
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
}
Serializer.addClass(
  "rating",
  [
    { name: "hasComment:switch", layout: "row" },
    {
      name: "commentText",
      dependsOn: "hasComment",
      visibleIf: function (obj: any) {
        return obj.hasComment;
      },
      serializationProperty: "locCommentText",
      layout: "row",
    },
    {
      name: "commentPlaceholder",
      alternativeName: "commentPlaceHolder",
      serializationProperty: "locCommentPlaceholder",
      dependsOn: "hasComment",
      visibleIf: function (obj: any) {
        return obj.hasComment;
      },
    },
    {
      name: "rateValues:itemvalue[]",
      baseValue: function () {
        return surveyLocalization.getString("choices_Item");
      },
    },
    { name: "rateMin:number", default: 1,
      onSettingValue: (obj: any, val: any): any => {
        return val > obj.rateMax - obj.rateStep ? obj.rateMax - obj.rateStep: val;
      }
    },
    { name: "rateMax:number", default: 5,
      onSettingValue: (obj: any, val: any): any => {
        return val < obj.rateMin + obj.rateStep ? obj.rateMin + obj.rateStep: val;
      }
    },
    { name: "rateStep:number", default: 1, minValue: 0.1,
      onSettingValue: (obj: any, val: any): any => {
        if (val <= 0) val = 1;
        if (val > obj.rateMax - obj.rateMin)
          val = obj.rateMax - obj.rateMin;
        return val;
      }
    },
    {
      name: "minRateDescription",
      alternativeName: "mininumRateDescription",
      serializationProperty: "locMinRateDescription",
    },
    {
      name: "maxRateDescription",
      alternativeName: "maximumRateDescription",
      serializationProperty: "locMaxRateDescription",
    },
    { name: "displayRateDescriptionsAsExtremeItems:boolean", default: false },
    {
      name: "displayMode",
      default: "auto",
      choices: ["auto", "buttons", "dropdown"],
    }
  ],
  function () {
    return new QuestionRatingModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("rating", (name) => {
  return new QuestionRatingModel(name);
});
