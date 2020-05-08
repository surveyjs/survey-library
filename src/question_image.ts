import { QuestionNonValue } from "./questionnonvalue";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";

/**
 * A Model for image question. This question hasn't any functionality and can be used to improve the appearance of the survey.
 */
export class QuestionImageModel extends QuestionNonValue {
  constructor(public name: string) {
    super(name);
  }
  public getType(): string {
    return "image";
  }
  public get isCompositeQuestion(): boolean {
    return false;
  }
  /**
   * The image URL.
   */
  public get imageLink(): string {
    return this.getPropertyValue("imageLink");
  }
  public set imageLink(val: string) {
    this.setPropertyValue("imageLink", val);
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

Serializer.addClass(
  "image",
  [
    { name: "imageLink" },
    {
      name: "contentMode",
      default: "image",
      choices: ["image", "video"]
    },
    {
      name: "imageFit",
      default: "contain",
      choices: ["none", "contain", "cover", "fill"]
    },
    { name: "imageHeight:number", default: 150, minValue: 0 },
    { name: "imageWidth:number", default: 200, minValue: 0 }
  ],
  function() {
    return new QuestionImageModel("");
  },
  "nonvalue"
);

QuestionFactory.Instance.registerQuestion("image", name => {
  return new QuestionImageModel(name);
});
