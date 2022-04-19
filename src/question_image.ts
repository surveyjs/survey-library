import { QuestionNonValue } from "./questionnonvalue";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";

const youtubeTags = ["youtube.com", "youtu.be"];
const videoSuffics = [".mp4", ".mov", ".wmv", ".flv", ".avi", ".mkv"];

/**
 * A Model for image question. This question hasn't any functionality and can be used to improve the appearance of the survey.
 */
export class QuestionImageModel extends QuestionNonValue {
  constructor(name: string) {
    super(name);
    this.createLocalizableString("imageLink", this, false);
    this.createLocalizableString("text", this, false);
    this.registerFunctionOnPropertiesValueChanged(["contentMode", "imageLink"], () => this.calculateRenderedMode());
  }
  public getType(): string {
    return "image";
  }
  public get isCompositeQuestion(): boolean {
    return false;
  }
  public onSurveyLoad(): void {
    super.onSurveyLoad();
    this.calculateRenderedMode();
  }
  /**
   * The image URL.
   */
  public get imageLink(): string {
    return this.getLocalizableStringText("imageLink");
  }
  public set imageLink(val: string) {
    this.setLocalizableStringText("imageLink", val);
  }
  get locImageLink(): LocalizableString {
    return this.getLocalizableString("imageLink");
  }
  /**
   * The image alt text.
   */
  public get text(): string {
    return this.getLocalizableStringText("text");
  }
  public set text(val: string) {
    this.setLocalizableStringText("text", val);
  }
  get locText(): LocalizableString {
    return this.getLocalizableString("text");
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
  public get renderedHeight(): string {
    return this.imageHeight ? this.imageHeight + "px" : undefined;
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
  public get renderedWidth(): string {
    return this.imageWidth ? this.imageWidth + "px" : undefined;
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
  /**
   * The rendered mode.
   */
  public get renderedMode(): string {
    return this.getPropertyValue("renderedMode", "image");
  }

  public getImageCss(): string {
    const imageHeightProperty = Serializer.findProperty("image", "imageHeight");
    const imageWidthProperty = Serializer.findProperty("image", "imageWidth");
    const isDefaultSize = imageHeightProperty.isDefaultValue(this.imageHeight) && imageWidthProperty.isDefaultValue(this.imageWidth);

    return new CssClassBuilder()
      .append(this.cssClasses.image)
      .append(this.cssClasses.adaptive, isDefaultSize)
      .toString();
  }

  private setRenderedMode(val: string) {
    this.setPropertyValue("renderedMode", val);
  }
  protected calculateRenderedMode() {
    if (this.contentMode !== "auto") {
      this.setRenderedMode(this.contentMode);
    } else {
      if (this.isYoutubeVideo()) {
        this.setRenderedMode("youtube");
      } else if (this.isVideo()) {
        this.setRenderedMode("video");
      } else {
        this.setRenderedMode("image");
      }
    }
  }
  private isYoutubeVideo(): boolean {
    let link = this.imageLink;
    if (!link) return false;
    link = link.toLowerCase();
    for (let i = 0; i < youtubeTags.length; i++) {
      if (link.indexOf(youtubeTags[i]) !== -1) return true;
    }
    return false;
  }
  private isVideo(): boolean {
    let link = this.imageLink;
    if (!link) return false;
    link = link.toLowerCase();
    for (let i = 0; i < videoSuffics.length; i++) {
      if (link.endsWith(videoSuffics[i])) return true;
    }
    return false;
  }
}

Serializer.addClass(
  "image",
  [
    { name: "imageLink", serializationProperty: "locImageLink" },
    { name: "text", serializationProperty: "locText" },
    {
      name: "contentMode",
      default: "auto",
      choices: ["auto", "image", "video", "youtube"],
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
    return new QuestionImageModel("");
  },
  "nonvalue"
);

QuestionFactory.Instance.registerQuestion("image", (name) => {
  return new QuestionImageModel(name);
});
