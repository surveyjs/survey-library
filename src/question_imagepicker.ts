import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { ItemValue } from "./itemvalue";
import { Helpers } from "./helpers";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { settings } from "./settings";
import { classesToSelector } from "./utils/utils";

export class ImageItemValue extends ItemValue implements ILocalizableOwner {
  constructor(
    value: any,
    text: string = null,
    protected typeName = "imageitemvalue"
  ) {
    super(value, text, typeName);
    this.createLocalizableString("imageLink", this, false);
  }
  public getType(): string {
    return !!this.typeName ? this.typeName : "itemvalue";
  }
  /**
   * The image or video link property.
   */
  public get imageLink(): string {
    return this.getLocalizableStringText("imageLink");
  }
  public set imageLink(val: string) {
    this.setLocalizableStringText("imageLink", val);
  }
  private aspectRatio: number;

  get locImageLink(): LocalizableString {
    return this.getLocalizableString("imageLink");
  }
  getLocale(): string {
    return !!this.locOwner ? this.locOwner.getLocale() : "";
  }
  getMarkdownHtml(text: string, name: string): string {
    return !!this.locOwner ? this.locOwner.getMarkdownHtml(text, name) : text;
  }
  getRenderer(name: string): string {
    return !!this.locOwner ? this.locOwner.getRenderer(name) : null;
  }
  getRendererContext(locStr: LocalizableString): any {
    return !!this.locOwner ? this.locOwner.getRendererContext(locStr) : locStr;
  }
  getProcessedText(text: string): string {
    return !!this.locOwner ? this.locOwner.getProcessedText(text) : text;
  }
}

/**
 * A Model for a select image question.
 */
export class QuestionImagePickerModel extends QuestionCheckboxBase {
  constructor(name: string) {
    super(name);
    this.colCount = 0;
    this.registerFunctionOnPropertiesValueChanged(["minImageWidth", "maxImageWidth", "minImageHeight", "maxImageHeight", "visibleChoices", "isResponsive"], ()=>{
      if(!!this._width) {
        this.processResponsiveness(0, this._width);
      }
    });
    this.registerFunctionOnPropertiesValueChanged(["imageWidth", "imageHeight"], () => {
      this.calcIsReponsive();
    });
    this.calcIsReponsive();
  }
  public getType(): string {
    return "imagepicker";
  }
  supportGoNextPageAutomatic(): boolean {
    return !this.multiSelect;
  }
  public get hasSingleInput(): boolean {
    return false;
  }
  protected getItemValueType() {
    return "imageitemvalue";
  }
  public get isCompositeQuestion(): boolean {
    return true;
  }
  public supportOther(): boolean {
    return false;
  }
  public supportNone(): boolean {
    return false;
  }
  public isAnswerCorrect(): boolean {
    if(!this.multiSelect) return super.isAnswerCorrect();
    return Helpers.isArrayContainsEqual(this.value, this.correctAnswer);
  }
  /**
   * Multi select option. If set to true, then allows to select multiple images.
   */
  public get multiSelect(): boolean {
    return this.getPropertyValue("multiSelect");
  }
  public set multiSelect(newValue: boolean) {
    this.setPropertyValue("multiSelect", newValue);
  }
  /**
   * Returns true if item is checked
   * @param item image picker item value
   */
  public isItemSelected(item: ItemValue): boolean {
    var val = this.value;
    if (this.isValueEmpty(val)) return false;
    if (!this.multiSelect) return this.isTwoValueEquals(val, item.value);
    if (!Array.isArray(val)) return false;
    for (var i = 0; i < val.length; i++) {
      if (this.isTwoValueEquals(val[i], item.value)) return true;
    }
    return false;
  }
  public clearIncorrectValues() {
    if (this.multiSelect) {
      var val = this.value;
      if (!val) return;
      if (!Array.isArray(val) || val.length == 0) {
        this.clearValue();
        return;
      }
      var newValue = [];
      for (var i = 0; i < val.length; i++) {
        if (!this.hasUnknownValue(val[i], true)) {
          newValue.push(val[i]);
        }
      }
      if (newValue.length == val.length) return;
      if (newValue.length == 0) {
        this.clearValue();
      } else {
        this.value = newValue;
      }
    } else {
      super.clearIncorrectValues();
    }
  }

  /**
   * Show label under the image.
   */
  public get showLabel(): boolean {
    return this.getPropertyValue("showLabel");
  }
  public set showLabel(newValue: boolean) {
    this.setPropertyValue("showLabel", newValue);
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    if (!this.isDesignMode && this.multiSelect) {
      this.createNewArray("renderedValue");
      this.createNewArray("value");
    }
  }
  protected getValueCore() {
    var value = super.getValueCore();
    if (value !== undefined) {
      return value;
    }
    if (this.multiSelect) {
      return [];
    }
    return value;
  }
  private convertValToArrayForMultSelect(val: any): any {
    if (!this.multiSelect) return val;
    if (this.isValueEmpty(val) || Array.isArray(val)) return val;
    return [val];
  }
  protected renderedValueFromDataCore(val: any): any {
    return this.convertValToArrayForMultSelect(val);
  }
  protected rendredValueToDataCore(val: any): any {
    return this.convertValToArrayForMultSelect(val);
  }
  /**
   * The image height.
   */
  public get imageHeight() {
    return this.getPropertyValue("imageHeight");
  }
  public set imageHeight(val: number) {
    this.setPropertyValue("imageHeight", val);
  }
  @property({}) private responsiveImageHeight: number;
  public get renderedImageHeight() {
    const height = this.isResponsive ? this.responsiveImageHeight : this.imageHeight;
    return height ? height + "px" : undefined;
  }
  /**
   * The image width.
   */

  public get imageWidth() {
    return this.getPropertyValue("imageWidth");
  }
  public set imageWidth(val: number) {
    this.setPropertyValue("imageWidth", val);
  }

  @property({}) private responsiveImageWidth: number;
  public get renderedImageWidth() {
    const width = this.isResponsive ? this.responsiveImageWidth : this.imageWidth;
    return width ? width + "px" : undefined;
  }
  /**
   * The image fit mode.
   */
  public get imageFit(): string {
    return this.getPropertyValue("imageFit");
  }
  public set imageFit(val: string) {
    this.setPropertyValue("imageFit", val);
  }
  /**
   * The content mode.
   */
  public get contentMode(): string {
    return this.getPropertyValue("contentMode");
  }
  public set contentMode(val: string) {
    this.setPropertyValue("contentMode", val);
    if (val === "video") {
      this.showLabel = true;
    }
  }
  protected convertDefaultValue(val: any): any {
    return val;
  }
  public get hasColumns(): boolean {
    return false;
  }
  public get inputType() {
    return this.multiSelect ? "checkbox" : "radio";
  }
  //responsive mode
  @property({}) private isResponsiveValue = false;
  @property({}) public maxImageWidth: number;
  @property({}) public minImageWidth: number;
  @property({}) public maxImageHeight: number;
  @property({}) public minImageHeight: number;

  private get isResponsive() {
    return this.isResponsiveValue && this.isDefaultV2Theme;
  }
  private calcIsReponsive() {
    const isImageWidthDefault = Serializer.findProperty("imagepicker", "imageHeight").isDefaultValue(this.imageHeight);
    const isImageHeightDefault = Serializer.findProperty("imagepicker", "imageWidth").isDefaultValue(this.imageWidth);
    this.isResponsiveValue = isImageWidthDefault && isImageHeightDefault && this.colCount === 0;
  }

  protected getObservedElementSelector(): string {
    return classesToSelector(this.cssClasses.root);
  }
  protected supportResponsiveness(): boolean {
    return true;
  }
  protected needResponsiveness() {
    return this.supportResponsiveness() && this.isDefaultV2Theme && this.contentMode == "image";
  }

  private _width: number;

  private onImageLoaded = (item: ImageItemValue, event: any) => {
    const img: HTMLImageElement = event.target;
    item["aspectRatio"] = img.naturalWidth / img.naturalHeight;
    this._width && this.processResponsiveness(0, this._width);
  }

  protected processResponsiveness(_: number, availableWidth: number): void {
    this._width = availableWidth;
    availableWidth = Math.floor(availableWidth - 1);
    if(this.colCount === 0 && this.isResponsive) {
      const itemsCount = this.choices.length + (this.isDesignMode ? 1 : 0);
      const gap = this.gapBetweenItems || 0;
      const minWidth = this.minImageWidth;
      const maxWidth = this.maxImageWidth;
      const maxHeight = this.maxImageHeight;
      const minHeight = this.minImageHeight;
      let width: number;
      if ((gap + minWidth) * itemsCount - gap > availableWidth) {
        let itemsInRow = Math.floor(availableWidth / (minWidth + gap));
        if((itemsInRow + 1) * (minWidth + gap) - gap <= availableWidth) itemsInRow ++;
        width = Math.floor((availableWidth - gap * (itemsInRow - 1)) / itemsInRow);
        this.responsiveImageWidth = width;
      } else {
        width = Math.floor(((availableWidth - gap * (itemsCount - 1)) / itemsCount));
        this.responsiveImageWidth = (width > maxWidth ? maxWidth : width);
      }
      let height: number = Number.MIN_VALUE;
      this.choices.forEach((item:ImageItemValue) => {
        const tempHeight = width / item["aspectRatio"];
        height = tempHeight > height ? tempHeight : height;
      });
      if(height > maxHeight) {
        this.responsiveImageHeight = maxHeight;
      } else if (height < minHeight) {
        this.responsiveImageHeight = minHeight;
      } else {
        this.responsiveImageHeight = height;
      }
    }
  }
  private gapBetweenItems: number;
  public afterRender(el: HTMLElement): void {
    super.afterRender(el);
    const variables = this.survey.getCss().variables;
    if(!!variables) {
      this.gapBetweenItems = Number.parseInt(window.getComputedStyle(el).getPropertyValue(variables.imagepickerGapBetweenItems)) || 0;
    }
  }
}
Serializer.addClass(
  "imageitemvalue",
  [],
  (value: any) => new ImageItemValue(value),
  "itemvalue"
);
Serializer.addProperty("imageitemvalue", {
  name: "imageLink",
  serializationProperty: "locImageLink",
});

Serializer.addClass(
  "imagepicker",
  [
    { name: "hasOther", visible: false },
    { name: "otherText", visible: false },
    { name: "hasNone", visible: false },
    { name: "noneText", visible: false },
    { name: "optionsCaption", visible: false },
    { name: "otherErrorText", visible: false },
    { name: "storeOthersAsComment", visible: false },
    {
      name: "contentMode",
      default: "image",
      choices: ["image", "video"],
    },
    {
      name: "imageFit",
      default: "contain",
      choices: ["none", "contain", "cover", "fill"],
    },
    { name: "imageHeight:number", default: 150, minValue: 0 },
    { name: "imageWidth:number", default: 200, minValue: 0 },
    { name: "minImageWidth:number", default: 200, minValue: 0 },
    { name: "minImageHeight:number", default: 133, minValue: 0 },
    { name: "maxImageWidth:number", default: 400, minValue: 0 },
    { name: "maxImageHeight:number", default: 266, minValue: 0 },

  ],
  function() {
    return new QuestionImagePickerModel("");
  },
  "checkboxbase"
);
Serializer.addProperty("imagepicker", {
  name: "showLabel:boolean",
  default: false,
});
Serializer.addProperty("imagepicker", {
  name: "colCount:number",
  default: 0,
  choices: [0, 1, 2, 3, 4, 5],
});
Serializer.addProperty("imagepicker", {
  name: "multiSelect:boolean",
  default: false,
});
Serializer.addProperty("imagepicker", {
  name: "choices:imageitemvalue[]",
});

QuestionFactory.Instance.registerQuestion("imagepicker", (name) => {
  var q = new QuestionImagePickerModel(name);
  //q.choices = QuestionFactory.DefaultChoices;
  return q;
});
