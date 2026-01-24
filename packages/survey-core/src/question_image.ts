import { QuestionNonValue } from "./questionnonvalue";
import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { getRenderedStyleSize, getRenderedSize } from "./utils/utils";
import { Helpers } from "./helpers";

const videoSuffics = [".mp4", ".mov", ".wmv", ".flv", ".avi", ".mkv"];
const youtubeUrl = "https://www.youtube.com/";
const youtubeEmbed = "embed";

/**
  * A class that describes the Image question type. Unlike other question types, Image cannot have a title or value.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-image/ (linkStyle))
 */
export class QuestionImageModel extends QuestionNonValue {
  @property({ defaultValue: false }) contentNotLoaded: boolean;

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "contentMode" || name === "imageLink") {
      this.calculateRenderedMode();
    }
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
   * Specifies an image or video URL.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-image-and-video-to-survey/ (linkStyle))
   * @see contentMode
   */
  @property({ localizable: { onCreate: (obj: QuestionImageModel, locStr: LocalizableString) => {
    locStr.onGetTextCallback = (text: string): string => {
      return getCorrectImageLink(text, obj.contentMode == "youtube");
    };
  } } }) imageLink: string;
  /**
   * Specifies a value for the `alt` attribute of the underlying `<img>` element.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-image-and-video-to-survey/ (linkStyle))
   */
  @property({ localizable: true }) altText: string;
  /**
   * Specifies the height of a container for the image or video. Accepts positive numbers and CSS values.
   *
   * Default value: 150
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-image-and-video-to-survey/ (linkStyle))
   *
   * > Use the [`imageFit`](#imageFit) property to specify how to fit the image or video into the container.
   * @see imageWidth
   */
  @property() imageHeight: string;

  public get renderedStyleHeight(): string {
    return this.imageHeight ? getRenderedStyleSize(this.imageHeight) : undefined;
  }

  public get renderedHeight(): number {
    return this.imageHeight ? getRenderedSize(this.imageHeight) : undefined;
  }
  /**
   * Specifies the width of a container for the image or video. Accepts positive numbers and CSS values.
   *
   * Default value: 200
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-image-and-video-to-survey/ (linkStyle))
   *
   * > Use the [`imageFit`](#imageFit) property to specify how to fit the image or video into the container.
   * @see imageHeight
   */
  @property() imageWidth: string;

  public get renderedStyleWidth(): string {
    return this.imageWidth ? getRenderedStyleSize(this.imageWidth) : undefined;
  }
  public get renderedWidth(): number {
    return this.imageWidth ? getRenderedSize(this.imageWidth) : undefined;
  }
  /**
   * Specifies how to resize the image or video to fit it into its container.
   *
   * Refer to the [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property description for information on accepted values.
   * @see imageHeight
   * @see imageWidth
   */
  @property() imageFit: string;
  /**
   * Specifies the type of content that the Image question displays.
   *
   * Possible values:
   *
   * - `"image"` - An image in one of the following formats: JPEG, GIF, PNG, APNG, SVG, BMP, ICO.
   * - `"video"` - A video in one of the following formats: MP4, MOV, WMV, FLV, AVI, MKV.
   * - `"youtube"` - A link to a YouTube video.
   * - `"auto"` (default) - Selects one of the above based on the [`imageLink`](https://surveyjs.io/form-library/documentation/questionimagemodel#imageLink) property.
   */
  @property({ onSet: (val, obj) => {
    if (val === "video") {
      obj.showLabel = true;
    }
  } }) contentMode: string;
  /**
   * Returns the type of content that the Image question displays: `"image"`, `"video"`, or `"youtube"`.
   * @see contentMode
   */
  public get renderedMode(): string {
    return this.getPropertyValue("renderedMode", "image");
  }

  public get ariaInvalid() {
    return null;
  }
  public get ariaLabel () {
    return null;
  }
  public get renderedAltText() {
    return this.altText || this.title;
  }

  public getImageCss(): string {
    const imageHeightProperty = this.getPropertyByName("imageHeight");
    const imageWidthProperty = this.getPropertyByName("imageWidth");
    const isDefaultSize = imageHeightProperty.isDefaultValue(this.imageHeight) && imageWidthProperty.isDefaultValue(this.imageWidth);

    return new CssClassBuilder()
      .append(this.cssClasses.image)
      .append(this.cssClasses.adaptive, isDefaultSize)
      .toString();
  }

  public onLoadHandler(): void {
    this.contentNotLoaded = false;
  }
  public onErrorHandler(): void {
    this.contentNotLoaded = true;
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
    return Helpers.isUrlYoutubeVideo(this.imageLink);
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

function getCorrectImageLink(val: string, isYouTube: boolean): string {
  if (!val || !Helpers.isUrlYoutubeVideo(val)) return isYouTube ? "" : val;
  let res = val.toLocaleLowerCase();
  if (res.indexOf(youtubeEmbed) > -1) return val;
  let id = "";
  for (var i = val.length - 1; i >= 0; i --) {
    if (val[i] === "=" || val[i] === "/") break;
    id = val[i] + id;
  }
  return youtubeUrl + youtubeEmbed + "/" + id;
}

Serializer.addClass(
  "image",
  [
    { name: "imageLink:file", serializationProperty: "locImageLink" },
    { name: "altText", serializationProperty: "locAltText", alternativeName: "text", category: "general" },
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
    { name: "imageHeight", default: "150" },
    { name: "imageWidth", default: "200" },
  ],
  function () {
    return new QuestionImageModel("");
  },
  "nonvalue"
);

QuestionFactory.Instance.registerQuestion("image", (name) => {
  return new QuestionImageModel(name);
});
