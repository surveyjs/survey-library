import * as ko from "knockout";
import { Base, RendererFactory, Serializer, SurveyModel, property } from "survey-core";
import { HorizontalAlignment, VerticalAlignment } from "../../../base-interfaces";
import { ImplementorBase } from "src/knockout/kobase";

const template = require("./cover.html");

export class Cover extends Base {
  constructor() {
    super();
  }

  public getType(): string {
    return "cover";
  }
  public survey: SurveyModel;
  @property() public height: string;
  @property() public areaWidth: "survey" | "container";
  @property() public textWidth: string;
  @property() public invertText: boolean;
  @property() public glowText: boolean;
  @property() public overlap: boolean;
  @property() public backgroundColor: string;
  @property() public backgroundImage: string;
  @property() public logoPositionX: HorizontalAlignment;
  @property() public logoPositionY: VerticalAlignment;
  @property() public titlePositionX: HorizontalAlignment;
  @property() public titlePositionY: VerticalAlignment;
  @property() public descriptionPositionX: HorizontalAlignment;
  @property() public descriptionPositionY: VerticalAlignment;

  public get logoStyle() {
    const result = { order: 1 };
    result["align-self"] = this.calcAlignSelf(this.logoPositionX);
    return result;
  }
  public get titleStyle() {
    const result = { order: 2 };
    result["align-self"] = this.calcAlignSelf(this.titlePositionX);
    return result;
  }
  public get descriptionStyle() {
    const result = { order: 3 };
    result["align-self"] = this.calcAlignSelf(this.descriptionPositionX);
    return result;
  }

  private calcAlignSelf(positionX: HorizontalAlignment) {
    return positionX === "left" ? "flex-start" : (positionX === "center" ? "center" : "flex-end");
  }
}

Serializer.addClass(
  "cover",
  [
    { name: "height" },
    { name: "areaWidth", default: "survey" },
    { name: "textWidth" },
    { name: "invertText:boolean" },
    { name: "glowText:boolean" },
    { name: "overlap:boolean" },
    { name: "backgroundColor" },
    { name: "backgroundImage" },
    { name: "logoPositionX", default: "right" },
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

ko.components.register("sv-cover", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      params.model.survey = params.survey;
      new ImplementorBase(params.model);
      return params;
    },
  },
  template: template,
});
