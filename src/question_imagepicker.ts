import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { ItemValue } from "./itemvalue";

/**
 * A Model for a select image question.
 */
export class QuestionImagePickerModel extends QuestionCheckboxBase {
  constructor(public name: string) {
    super(name);
  }
  public getType(): string {
    return "imagepicker";
  }
  supportGoNextPageAutomatic() {
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
   * Show label under the image.
   */
  public get showLabel(): boolean {
    return this.getPropertyValue("showLabel", false);
  }
  public set showLabel(newValue: boolean) {
    this.setPropertyValue("showLabel", newValue);
  }
  protected getValueCore() {
    return super.getValueCore() || (this.multiSelect && []) || undefined;
  }
  /**
   * The image height.
   */
  public get imageHeight(): string {
    return this.getPropertyValue("imageHeight", 150);
  }
  public set imageHeight(val: string) {
    this.setPropertyValue("imageHeight", val);
  }
  /**
   * The image width.
   */
  public get imageWidth(): string {
    return this.getPropertyValue("imageWidth", 200);
  }
  public set imageWidth(val: string) {
    this.setPropertyValue("imageWidth", val);
  }
  /**
   * The image fit mode.
   */
  public get imageFit(): string {
    return this.getPropertyValue("imageFit", "contain");
  }
  public set imageFit(val: string) {
    this.setPropertyValue("imageFit", val);
  }
}

JsonObject.metaData.addClass("imageitemvalues", [], null, "itemvalue");
JsonObject.metaData.addProperty("imageitemvalues", {
  name: "imageLink"
});

JsonObject.metaData.addClass(
  "imagepicker",
  [
    { name: "hasOther", visible: false },
    { name: "otherText", visible: false },
    { name: "optionsCaption", visible: false },
    { name: "otherErrorText", visible: false },
    { name: "storeOthersAsComment", visible: false },
    {
      name: "imageFit",
      default: "contain",
      choices: ["none", "contain", "cover", "fill"]
    },
    { name: "imageHeight:number", default: 150 },
    { name: "imageWidth:number", default: 200 }
  ],
  function() {
    return new QuestionImagePickerModel("");
  },
  "checkboxbase"
);
JsonObject.metaData.addProperty("imagepicker", {
  name: "showLabel:boolean",
  default: false
});
JsonObject.metaData.addProperty("imagepicker", {
  name: "colCount:number",
  default: 0,
  choices: [0, 1, 2, 3, 4, 5]
});
JsonObject.metaData.addProperty("imagepicker", {
  name: "multiSelect:boolean",
  default: false
});
JsonObject.metaData.addProperty("imagepicker", {
  name: "choices:imageitemvalues",
  onGetValue: function(obj) {
    return ItemValue.getData(obj.choices);
  },
  onSetValue: function(obj, value) {
    obj.choices = value;
  }
});

QuestionFactory.Instance.registerQuestion("imagepicker", name => {
  var q = new QuestionImagePickerModel(name);
  //q.choices = QuestionFactory.DefaultChoices;
  return q;
});
