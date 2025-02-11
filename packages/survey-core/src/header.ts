import { Base, ArrayChanges } from "./base";
import { HorizontalAlignment, VerticalAlignment } from "./base-interfaces";
import { DomDocumentHelper } from "./global_variables_utils";
import { Serializer, property } from "./jsonobject";
import { SurveyModel } from "./survey";
import { ITheme } from "./themes";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { wrapUrlForBackgroundImage } from "./utils/utils";

export class CoverCell {
  static CLASSNAME = "sv-header__cell";

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
    const result = new CssClassBuilder()
      .append(CoverCell.CLASSNAME)
      .append(`${CoverCell.CLASSNAME}--${this.positionX}`)
      .append(`${CoverCell.CLASSNAME}--${this.positionY}`)
      .append(CoverCell.CLASSNAME + "--empty", this.isEmpty)
      .toString();

    return result;
  }
  get style(): any {
    const result: any = {};
    result["gridColumn"] = this.calcColumn(this.positionX);
    result["gridRow"] = this.calcRow(this.positionY);
    result["width"] = !!this.width ? this.width + "px" : undefined;
    return result;
  }
  get contentStyle(): any {
    const result: any = {};
    result["textAlign"] = this.calcAlignText(this.positionX);
    result["alignItems"] = this.calcAlignItems(this.positionX);
    result["justifyContent"] = this.calcJustifyContent(this.positionY);
    result["maxWidth"] = this.contentMaxWidth;
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
  get isEmpty(): boolean {
    return !this.showLogo && !this.showTitle && !this.showDescription;
  }
  get textAreaWidth(): string {
    return this.cover.renderedTextAreaWidth;
  }
  get width(): number {
    if (this.cover.width) {
      return Math.ceil(this.cover.width / 3);
    }
    return undefined;
  }
  get contentMaxWidth(): string {
    return this.cover.getContentMaxWidth(this);
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
  private updateHeaderClasses(): void {
    const backgroundColorNone = !this.backgroundColor || this.backgroundColor === "transparent";
    const backgroundColorAccent = this.backgroundColor === "var(--sjs-primary-backcolor)";
    const backgroundColorCustom = !backgroundColorNone && !backgroundColorAccent;
    this.headerClasses = new CssClassBuilder()
      .append("sv-header")
      .append("sv-header--height-auto", !this.renderedHeight)
      .append("sv-header__without-background", backgroundColorNone && !this.backgroundImage)
      .append("sv-header__background-color--none", backgroundColorNone && !this.titleColor && !this.descriptionColor)
      .append("sv-header__background-color--accent", backgroundColorAccent && !this.titleColor && !this.descriptionColor)
      .append("sv-header__background-color--custom", backgroundColorCustom && !this.titleColor && !this.descriptionColor)
      .append("sv-header__overlap", this.overlapEnabled)
      .toString();
  }
  private updateContentClasses(): void {
    const surveyWidthMode = !!this.survey && this.survey.calculateWidthMode();
    this.maxWidth = this.inheritWidthFrom === "survey" && !!surveyWidthMode && surveyWidthMode === "static" && this.survey.renderedWidth;
    this.contentClasses = new CssClassBuilder()
      .append("sv-header__content")
      .append("sv-header__content--static", this.inheritWidthFrom === "survey" && !!surveyWidthMode && surveyWidthMode === "static")
      .append("sv-header__content--responsive", this.inheritWidthFrom === "container" || (!!surveyWidthMode && surveyWidthMode === "responsive"))
      .toString();
  }
  private updateBackgroundImageClasses(): void {
    this.backgroundImageClasses = new CssClassBuilder()
      .append("sv-header__background-image")
      .append("sv-header__background-image--contain", this.backgroundImageFit === "contain")
      .append("sv-header__background-image--tile", this.backgroundImageFit === "tile")
      .toString();
  }
  public fromTheme(theme: ITheme): void {
    super.fromJSON(theme.header || {});
    if (!!theme.cssVariables) {
      this.backgroundColor = theme.cssVariables["--sjs-header-backcolor"];
      this.titleColor = theme.cssVariables["--sjs-font-headertitle-color"];
      this.descriptionColor = theme.cssVariables["--sjs-font-headerdescription-color"];
    }
    this.init();
  }
  private init() {
    this.renderBackgroundImage = wrapUrlForBackgroundImage(this.backgroundImage);
    this.updateHeaderClasses();
    this.updateContentClasses();
    this.updateBackgroundImageClasses();
  }

  constructor() {
    super();
    ["top", "middle", "bottom"].forEach((positionY: VerticalAlignment) =>
      ["left", "center", "right"].forEach((positionX: HorizontalAlignment) => this.cells.push(new CoverCell(this, positionX, positionY)))
    );
    this.init();
  }

  public getType(): string {
    return "cover";
  }

  public cells: CoverCell[] = [];
  @property() public height: number;
  @property() public mobileHeight: number;
  @property() public inheritWidthFrom: "survey" | "container";
  @property() public textAreaWidth: number;
  @property() public textGlowEnabled: boolean;
  @property() public overlapEnabled: boolean;
  @property({ defaultValue: "transparent" }) public backgroundColor: string;
  @property() public titleColor: string;
  @property() public descriptionColor: string;
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
  @property() headerClasses: string;
  @property() contentClasses: string;
  @property() width: number;
  @property() maxWidth: string;
  @property() backgroundImageClasses: string;

  public get renderedHeight(): string {
    if (this.survey && !this.survey.isMobile || !this.survey) {
      return this.height ? this.height + "px" : undefined;
    }
    if (this.survey && this.survey.isMobile) {
      return this.mobileHeight ? this.mobileHeight + "px" : undefined;
    }
    return undefined;
  }
  public get renderedTextAreaWidth(): string {
    return this.textAreaWidth ? this.textAreaWidth + "px" : undefined;
  }
  public get isEmpty(): boolean {
    return !this.survey.hasLogo && !this.survey.hasTitle && !this.survey.renderedHasDescription;
  }
  public get survey(): SurveyModel {
    return this._survey;
  }
  public set survey(newValue: SurveyModel) {
    if (this._survey === newValue) return;

    this._survey = newValue;
    if (!!newValue) {
      this.updateContentClasses();
      this._survey.onPropertyChanged.add((sender: any, options: any) => {
        if (options.name == "widthMode" || options.name == "width") {
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
  protected propertyValueChanged(name: string, oldValue: any, newValue: any, arrayChanges?: ArrayChanges, target?: Base): void {
    super.propertyValueChanged(name, oldValue, newValue);
    if (name === "height" || name === "backgroundColor" || name === "backgroundImage" || name === "overlapEnabled") {
      this.updateHeaderClasses();
    }
    if (name === "inheritWidthFrom") {
      this.updateContentClasses();
    }
    if (name === "backgroundImageFit") {
      this.updateBackgroundImageClasses();
    }
  }

  // public calculateActualHeight(logoHeight: number, titleHeight: number, descriptionHeight: number): number {
  //   const positionsY = ["top", "middle", "bottom"];
  //   const logoIndex = positionsY.indexOf(this.logoPositionY);
  //   const titleIndex = positionsY.indexOf(this.titlePositionY);
  //   const descriptionIndex = positionsY.indexOf(this.descriptionPositionY);
  //   const positionsX = ["left", "center", "right"];
  //   const logoIndexX = positionsX.indexOf(this.logoPositionX);
  //   const titleIndexX = positionsX.indexOf(this.titlePositionX);
  //   const descriptionIndexX = positionsX.indexOf(this.descriptionPositionX);
  //   const heights = [
  //     [0, 0, 0],
  //     [0, 0, 0],
  //     [0, 0, 0]
  //   ];
  //   heights[logoIndex][logoIndexX] = logoHeight;
  //   heights[titleIndex][titleIndexX] += titleHeight;
  //   heights[descriptionIndex][descriptionIndexX] += descriptionHeight;
  //   return heights.reduce((total, rowArr) => total + Math.max(...rowArr), 0);
  // }

  public getContentMaxWidth(cell: CoverCell): string {
    if (cell.isEmpty || cell.showLogo) {
      return undefined;
    }
    const cellIndex = this.cells.indexOf(cell);
    const rowIndex = Math.floor(cellIndex / 3);
    const colIndex = cellIndex % 3;
    if (colIndex == 1) {
      if (!this.cells[rowIndex * 3].isEmpty || !this.cells[rowIndex * 3 + 2].isEmpty) {
        return "100%";
      }
    } else if (colIndex == 0) {
      let rightFreeCells = 0;
      let index = colIndex + 1;
      while (index < 3 && this.cells[rowIndex * 3 + index].isEmpty) {
        if (this.cells[rowIndex * 3 + index].isEmpty) {
          rightFreeCells++;
        }
        index++;
      }
      return (100 * (rightFreeCells + 1)) + "%";
    } else if (colIndex == 2) {
      let leftFreeCells = 0;
      let index = colIndex - 1;
      while (index > 0 && this.cells[rowIndex * 3 + index].isEmpty) {
        if (this.cells[rowIndex * 3 + index].isEmpty) {
          leftFreeCells++;
        }
        index--;
      }
      return (100 * (leftFreeCells + 1)) + "%";
    }
    return undefined;
  }

  public processResponsiveness(): void {
    if (this.survey && this.survey.rootElement) {
      if (!this.survey.isMobile) {
        const headerEl = this.survey.rootElement.querySelectorAll(".sv-header__content")[0];
        if (!headerEl) return;

        let elWidth = headerEl.getBoundingClientRect().width;
        const headerComputedStyle = DomDocumentHelper.getComputedStyle(headerEl);
        const paddingLeft = (parseFloat(headerComputedStyle.paddingLeft) || 0);
        const paddingRight = (parseFloat(headerComputedStyle.paddingRight) || 0);
        const columnGap = (parseFloat(headerComputedStyle.columnGap) || 0);
        this.width = elWidth - paddingLeft - paddingRight - 2 * columnGap;
      }
    }
  }

  get hasBackground(): boolean {
    return !!this.backgroundImage || this.backgroundColor !== "transparent";
  }
}

Serializer.addClass(
  "cover",
  [
    { name: "height:number", minValue: 0, default: 0 },
    { name: "mobileHeight:number", minValue: 0, default: 0 },
    { name: "inheritWidthFrom", default: "survey" },
    { name: "textAreaWidth:number", minValue: 0, default: 0 },
    { name: "textGlowEnabled:boolean" },
    { name: "overlapEnabled:boolean" },
    { name: "backgroundImage:file" },
    { name: "backgroundImageOpacity:number", minValue: 0, maxValue: 1, default: 1 },
    { name: "backgroundImageFit", default: "cover", choices: ["cover", "fill", "contain"] },
    { name: "logoPositionX", default: "left" },
    { name: "logoPositionY", default: "bottom" },
    { name: "titlePositionX", default: "left" },
    { name: "titlePositionY", default: "bottom" },
    { name: "descriptionPositionX", default: "left" },
    { name: "descriptionPositionY", default: "bottom" }

  ],
  function () {
    return new Cover();
  },
);