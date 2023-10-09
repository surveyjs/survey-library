import { Base } from "./base";
import { HorizontalAlignment, VerticalAlignment } from "./base-interfaces";
import { Serializer, property } from "./jsonobject";
import { SurveyModel } from "./survey";
import { ITheme } from "./themes";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { wrapUrlForBackgroundImage } from "./utils/utils";

export class CoverCell {
  static CLASSNAME = "sv-cover__cell";
  private calcRow(positionY: VerticalAlignment): any {
    return positionY === "top" ? 1 : (positionY === "middle" ? 2 : 3);
  }
  private calcColumn(positionX: HorizontalAlignment): any {
    return positionX === "left" ? 1 : (positionX === "center" ? 2 : 3);
  }
  private calcAlignItems(positionX: HorizontalAlignment) {
    return positionX === "left" ? "flex-start" : (positionX === "center" ? "center" : "flex-end");
  }
  private calcAlignText(positionX: HorizontalAlignment) {
    return positionX === "left" ? "start" : (positionX === "center" ? "center" : "end");
  }
  private calcJustifyContent(positionY: VerticalAlignment) {
    return positionY === "top" ? "flex-start" : (positionY === "middle" ? "center" : "flex-end");
  }

  constructor(private cover: Cover, private positionX: HorizontalAlignment, private positionY: VerticalAlignment) {
  }
  get survey(): SurveyModel {
    return this.cover.survey;
  }
  get css(): string {
    const result = `${CoverCell.CLASSNAME} ${CoverCell.CLASSNAME}--${this.positionX} ${CoverCell.CLASSNAME}--${this.positionY}`;
    return result;
  }
  get style(): any {
    const result: any = {};
    result["gridColumn"] = this.calcColumn(this.positionX);
    result["gridRow"] = this.calcRow(this.positionY);
    return result;
  }
  get contentStyle(): any {
    const result: any = {};
    result["textAlign"] = this.calcAlignText(this.positionX);
    result["alignItems"] = this.calcAlignItems(this.positionX);
    result["justifyContent"] = this.calcJustifyContent(this.positionY);
    return result;
  }
  get showLogo(): boolean {
    return this.survey.hasLogo && this.positionX === this.cover.logoPositionX && this.positionY === this.cover.logoPositionY;
  }
  get showTitle(): boolean {
    return this.survey.hasTitle && this.positionX === this.cover.titlePositionX && this.positionY === this.cover.titlePositionY;
  }
  get showDescription(): boolean {
    return this.survey.renderedHasDescription && this.positionX === this.cover.descriptionPositionX && this.positionY === this.cover.descriptionPositionY;
  }
  get textAreaWidth(): string {
    if (!this.cover.textAreaWidth) {
      return "";
    }
    return "" + this.cover.textAreaWidth + "px";
  }
}

export class Cover extends Base {
  private _survey: SurveyModel;

  private calcBackgroundSize(backgroundImageFit: "cover" | "fill" | "contain" | "tile"): string {
    if (backgroundImageFit === "fill") {
      return "100% 100%";
    }
    if (backgroundImageFit === "tile") {
      return "auto";
    }
    return backgroundImageFit;
  }
  private updateCoverClasses(): void {
    this.coverClasses = new CssClassBuilder()
      .append("sv-cover")
      .append("sv-conver__without-background", (!this.backgroundColor || this.backgroundColor === "trasparent") && !this.backgroundImage)
      .append("sv-conver__overlap", this.overlapEnabled)
      .toString();
  }
  private updateContentClasses(): void {
    this.contentClasses = new CssClassBuilder()
      .append("sv-conver__content")
      .append("sv-conver__content--static", this.inheritWidthFrom === "survey" && !!this.survey && this.survey.calculateWidthMode() === "static")
      .append("sv-conver__content--responsive", this.inheritWidthFrom === "page" || (!!this.survey && this.survey.calculateWidthMode() === "responsive"))
      .toString();
  }
  private updateBackgroundImageClasses(): void {
    this.backgroundImageClasses = new CssClassBuilder()
      .append("sv-cover__background-image")
      .append("sv-cover__background-image--contain", this.backgroundImageFit === "contain")
      .append("sv-cover__background-image--tile", this.backgroundImageFit === "tile")
      .toString();
  }
  public fromTheme(theme: ITheme): void {
    super.fromJSON(theme.cover);
    if(!!theme.cssVariables) {
      this.backgroundColor = theme.cssVariables["--sjs-cover-backcolor"];
    }
  }

  constructor() {
    super();
    this.renderBackgroundImage = wrapUrlForBackgroundImage(this.backgroundImage);
    ["top", "middle", "bottom"].forEach((positionY: VerticalAlignment) =>
      ["left", "center", "right"].forEach((positionX: HorizontalAlignment) => this.cells.push(new CoverCell(this, positionX, positionY)))
    );
    this.updateCoverClasses();
    this.updateContentClasses();
    this.updateBackgroundImageClasses();
  }

  public getType(): string {
    return "cover";
  }

  public cells: CoverCell[] = [];
  @property() public height: number;
  @property() public inheritWidthFrom: "survey" | "page";
  @property() public textAreaWidth: number;
  @property() public textGlowEnabled: boolean;
  @property() public overlapEnabled: boolean;
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
  @property() coverClasses: string;
  @property() contentClasses: string;
  @property() backgroundImageClasses: string;

  public get renderedHeight(): string {
    return this.height ? this.height + "px" : undefined;
  }
  public get renderedtextAreaWidth(): string {
    return this.textAreaWidth ? this.textAreaWidth + "px" : undefined;
  }
  public get survey(): SurveyModel {
    return this._survey;
  }
  public set survey(newValue: SurveyModel) {
    this._survey = newValue;
    if(!!newValue) {
      this.updateContentClasses();
      this._survey.onPropertyChanged.add((sender: any, options: any) => {
        if (options.name == "widthMode") {
          this.updateContentClasses();
        }
      });
    }
  }

  public get backgroundImageStyle() {
    if (!this.backgroundImage) return null;
    return {
      opacity: this.backgroundImageOpacity,
      backgroundImage: this.renderBackgroundImage,
      backgroundSize: this.calcBackgroundSize(this.backgroundImageFit),
    };
  }
  protected propertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.propertyValueChanged(name, oldValue, newValue);
    if (name === "backgroundColor" || name === "backgroundImage" || name === "overlapEnabled") {
      this.updateCoverClasses();
    }
    if (name === "inheritWidthFrom") {
      this.updateContentClasses();
    }
    if (name === "backgroundImageFit") {
      this.updateBackgroundImageClasses();
    }
  }
}

Serializer.addClass(
  "cover",
  [
    { name: "height:number", minValue: 0, default: 256 },
    { name: "inheritWidthFrom", default: "survey" },
    { name: "textAreaWidth:number", minValue: 0, default: 512 },
    { name: "textGlowEnabled:boolean" },
    { name: "overlapEnabled:boolean" },
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