import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { ItemValue } from "./itemvalue";
import { Helpers } from "./helpers";

/**
 * A Model for a select image question.
 */
export class QuestionImagePickerModel extends QuestionCheckboxBase {
  constructor(public name: string) {
    super(name);
    this.colCount = 0;
  }
  public getType(): string {
    return "imagepicker";
  }
  supportGoNextPageAutomatic() {
    return true;
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
  /**
   * Multi select option. If set to true, then allows to select multiple images.
   */
  public get multiSelect(): boolean {
    return this.getPropertyValue("multiSelect", false);
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
    if (Helpers.isValueEmpty(val)) return false;
    if (!this.multiSelect) return Helpers.isTwoValueEquals(val, item.value);
    if (!Array.isArray(val)) return false;
    for (var i = 0; i < val.length; i++) {
      if (Helpers.isTwoValueEquals(val[i], item.value)) return true;
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
    return this.getPropertyValue("showLabel", false);
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
    if (Helpers.isValueEmpty(val) || Array.isArray(val)) return val;
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
  public get imageHeight(): string {
    return this.getPropertyValue("imageHeight");
  }
  public set imageHeight(val: string) {
    this.setPropertyValue("imageHeight", val);
  }
  /**
   * The image width.
   */
  public get imageWidth(): string {
    return this.getPropertyValue("imageWidth");
  }
  public set imageWidth(val: string) {
    this.setPropertyValue("imageWidth", val);
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
}

Serializer.addClass("imageitemvalue", [], undefined, "itemvalue");
Serializer.addProperty("imageitemvalue", {
  name: "imageLink",
});

Serializer.addClass(
  "imagepicker",
  [
    { name: "hasOther", visible: false },
    { name: "otherText", visible: false },
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
  ],
  function () {
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
