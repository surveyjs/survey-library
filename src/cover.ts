import { Base } from "./base";
import { HorizontalAlignment, VerticalAlignment } from "./base-interfaces";
import { Serializer, property } from "./jsonobject";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { wrapUrlForBackgroundImage } from "./utils/utils";

export class Cover extends Base {
  private calcRow(positionY: VerticalAlignment): any {
    return positionY === "top" ? 1 : (positionY === "middle" ? 2 : 3);
  }
  private calcColumn(positionX: HorizontalAlignment): any {
    return positionX === "left" ? 1 : (positionX === "center" ? 2 : 3);
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
  private calcJustifyContent(positionX: HorizontalAlignment) {
    return positionX === "left" ? "flex-start" : (positionX === "center" ? "center" : "flex-end");
  }
  private calcAlignItems(positionY: VerticalAlignment) {
    return positionY === "top" ? "flex-start" : (positionY === "middle" ? "center" : "flex-end");
  }
  private getLogoStyle() {
    const result = <any>{ };
    result["gridColumn"] = this.calcColumn(this.logoPositionX);
    result["gridRow"] = this.calcRow(this.logoPositionY);
    result["justifyContent"] = this.calcJustifyContent(this.logoPositionX);
    result["alignItems"] = this.calcAlignItems(this.logoPositionY);
    return result;
  }
  private getTitleStyle() {
    const result = <any>{ };
    result["maxWidth"] = this.renderedTextWidth;
    result["gridColumn"] = this.calcColumn(this.titlePositionX);
    result["gridRow"] = this.calcRow(this.titlePositionY);
    result["justifyContent"] = this.calcJustifyContent(this.titlePositionX);
    result["alignItems"] = this.calcAlignItems(this.titlePositionY);
    return result;
  }
  private getDescriptionStyle() {
    const result = <any>{ };
    result["maxWidth"] = this.renderedTextWidth;
    result["gridColumn"] = this.calcColumn(this.descriptionPositionX);
    result["gridRow"] = this.calcRow(this.descriptionPositionY);
    result["justifyContent"] = this.calcJustifyContent(this.descriptionPositionX);
    result["alignItems"] = this.calcAlignItems(this.descriptionPositionY);
    return result;
  }
  private updateElementStyles() {
    this.logoStyle = this.getLogoStyle();
    this.titleStyle = this.getTitleStyle();
    this.descriptionStyle = this.getDescriptionStyle();

    if(this.logoStyle.gridRow === this.titleStyle.gridRow && this.logoStyle.gridColumn === this.titleStyle.gridColumn) {
      this.titleStyle = Object.assign({}, this.titleStyle, { gridRow: this.titleStyle.gridRow + 1 });
      this.descriptionStyle = Object.assign({}, this.descriptionStyle, { gridRow: this.descriptionStyle.gridRow + 1 });
    }
    if(this.logoStyle.gridRow === this.descriptionStyle.gridRow && this.logoStyle.gridColumn === this.descriptionStyle.gridColumn) {
      this.descriptionStyle = Object.assign({}, this.descriptionStyle, { gridRow: this.descriptionStyle.gridRow + 1 });
    }
    if(this.titleStyle.gridRow === this.descriptionStyle.gridRow && this.titleStyle.gridColumn === this.descriptionStyle.gridColumn) {
      this.descriptionStyle = Object.assign({}, this.descriptionStyle, { gridRow: this.descriptionStyle.gridRow + 1 });
    }
  }

  constructor() {
    super();
    this.renderBackgroundImage = wrapUrlForBackgroundImage(this.backgroundImage);
    this.updateElementStyles();
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
  @property() logoStyle: { gridColumn: number, gridRow: number };
  @property() titleStyle: { gridColumn: number, gridRow: number };
  @property() descriptionStyle: { gridColumn: number, gridRow: number };

  public get renderedHeight(): string {
    return this.height ? this.height + "px" : undefined;
  }
  public get renderedTextWidth(): string {
    return this.textWidth ? this.textWidth + "px" : undefined;
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
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    if(["logoPositionX", "logoPositionY", "titlePositionX", "titlePositionY", "descriptionPositionX", "descriptionPositionY"].indexOf(name) !== -1) {
      this.updateElementStyles();
    }
  }
}

Serializer.addClass(
  "cover",
  [
    { name: "height:number", minValue: 0, default: 256 },
    { name: "areaWidth", default: "survey" },
    { name: "textWidth:number", minValue: 0, default: 512 },
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