import { Base } from "./base";
import { HorizontalAlignment, VerticalAlignment } from "./base-interfaces";
import { Serializer, property } from "./jsonobject";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { wrapUrlForBackgroundImage } from "./utils/utils";

export class Cover extends Base {
  constructor() {
    super();
    this.renderBackgroundImage = wrapUrlForBackgroundImage(this.backgroundImage);
  }

  public getType(): string {
    return "cover";
  }
  public survey: SurveyModel;
  @property() public height: number;
  @property() public areaWidth: "survey" | "container";
  @property() public textWidth: number;
  @property() public invertText: boolean;
  @property() public glowText: boolean;
  @property() public overlap: boolean;
  @property() public backgroundColor: string;
  @property({
    onSet: (newVal: string, target: Cover) => {
      target.renderBackgroundImage = wrapUrlForBackgroundImage(newVal);
    }
  }) public backgroundImage: string;
  @property() public renderBackgroundImage: string;
  @property() public backgroundImageFit: "cover" | "fill" | "contain" | "tile";
  @property() public backgroundImageOpacity: number;
  @property() public logoPositionX: HorizontalAlignment;
  @property() public logoPositionY: VerticalAlignment;
  @property() public titlePositionX: HorizontalAlignment;
  @property() public titlePositionY: VerticalAlignment;
  @property() public descriptionPositionX: HorizontalAlignment;
  @property() public descriptionPositionY: VerticalAlignment;

  public get renderedHeight(): string {
    return this.height ? this.height + "px" : undefined;
  }
  public get renderedTextWidth(): string {
    return this.textWidth ? this.textWidth + "px" : undefined;
  }

  public get logoStyle() {
    const result = <any>{ order: 1 };
    result["align-self"] = this.calcAlignSelf(this.logoPositionX);
    result["order"] = this.calcOrder(this.logoPositionY);
    result["align-items"] = this.logoPositionY === "middle" ? "center" : (this.logoPositionY === "bottom" ? "flex-end": undefined);
    return result;
  }
  public get titleStyle() {
    const result = <any>{ order: 2 };
    result["align-self"] = this.calcAlignSelf(this.titlePositionX);
    result["order"] = this.calcOrder(this.titlePositionY);
    return result;
  }
  public get descriptionStyle() {
    const result = <any>{ order: 3 };
    result["align-self"] = this.calcAlignSelf(this.descriptionPositionX);
    result["order"] = this.calcOrder(this.descriptionPositionY);
    return result;
  }

  public get contentClasses(): string {
    return new CssClassBuilder()
      .append("sv-conver__content")
      .append("sv-conver__content--static", this.areaWidth === "survey" && this.survey.calculateWidthMode() === "static")
      .append("sv-conver__content--responsive", this.areaWidth === "container" || this.survey.calculateWidthMode() === "responsive")
      .toString();
  }

  public get backgroundImageClasses(): string {
    return new CssClassBuilder()
      .append("sv-cover__background-image")
      .append("sv-cover__background-image--contain", this.backgroundImageFit === "contain")
      .append("sv-cover__background-image--tile", this.backgroundImageFit === "tile")
      .toString();
  }
  public get backgroundImageStyle() {
    if(!this.backgroundImage) return null;
    return {
      opacity: this.backgroundImageOpacity,
      backgroundImage: this.renderBackgroundImage,
      backgroundSize: this.calcBackgroundSize(this.backgroundImageFit),
    };
  }

  private calcBackgroundSize(backgroundImageFit: "cover" | "fill" | "contain" | "tile") : string {
    if(backgroundImageFit === "fill") {
      return "100% 100%";
    }
    if(backgroundImageFit === "tile") {
      return "contain";
    }
    return backgroundImageFit;
  }
  private calcAlignSelf(positionX: HorizontalAlignment) {
    return positionX === "left" ? "flex-start" : (positionX === "center" ? "center" : "flex-end");
  }
  private calcOrder(positionY: VerticalAlignment) {
    return positionY === "top" ? 1 : (positionY === "middle" ? 2 : 3);
  }
}

Serializer.addClass(
  "cover",
  [
    { name: "height:number", minValue: 0 },
    { name: "areaWidth", default: "survey" },
    { name: "textWidth:number", minValue: 0 },
    { name: "invertText:boolean" },
    { name: "glowText:boolean" },
    { name: "overlap:boolean" },
    { name: "backgroundColor" },
    { name: "backgroundImage" },
    { name: "backgroundImageOpacity:number", minValue: 0, maxValue: 1, default: 1 },
    { name: "backgroundImageFit", default: "cover", choices: ["cover", "fill", "contain"] },
    { name: "logoPositionX", default: "right" },
    { name: "logoPositionY", default: "top" },
    { name: "titlePositionX", default: "left" },
    { name: "titlePositionY", default: "bottom" },
    { name: "descriptionPositionX", default: "left" },
    { name: "descriptionPositionY", default: "bottom" }

  ],
  function () {
    return new Cover();
  },
);