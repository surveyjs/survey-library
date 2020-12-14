import * as ko from "knockout";
import { SurveyModel } from "../../../survey";
import { SurveyProgressButtonsModel } from '../../../surveyProgressButtons';
var template = require("html-loader?interpolate!val-loader!./buttons.html");

export class ProgressButtonsViewModel {
  private progressButtonsModel: SurveyProgressButtonsModel;
  private scrollButtonCssKo: any = undefined;
  private hasScroller: any = ko.observable(false);
  private updateScroller: any = undefined;
  constructor (private model: SurveyModel, private element: any) {
    this.progressButtonsModel = new SurveyProgressButtonsModel(model);
    this.updateScroller = setInterval(() => {
      let listContainerElement: HTMLElement = this.element.querySelector(
        "." + model.css.progressButtonsListContainer);
      if (!!listContainerElement) {
        this.hasScroller(listContainerElement.scrollWidth > listContainerElement.offsetWidth);
      }
    }, 100);
  }
  public getListElementCss(index: any): string {
    return this.progressButtonsModel.getListElementCss(index());
  }
  public clickListElement(index: any): void {
    this.progressButtonsModel.clickListElement(index());
  }
  public getScrollButtonCss(isLeftScroll: boolean): any {
    this.scrollButtonCssKo = ko.computed(() => {
      let scrollCss: string = isLeftScroll ?
        this.model.css.progressButtonsImageButtonLeft :
        this.model.css.progressButtonsImageButtonRight;
      if (!this.hasScroller()) scrollCss += " " + this.model.css.progressButtonsImageButtonHidden;
      return scrollCss;
    }, this);
    return this.scrollButtonCssKo;
  }
  public clickScrollButton(listContainerElement: Element, isLeftScroll: boolean): void {
    listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
  }
  public dispose(): void {
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined;
    }
    if (typeof this.scrollButtonCssKo !== "undefined") {
      this.scrollButtonCssKo.dispose();
      this.scrollButtonCssKo = undefined;
    }
  }
};

ko.components.register("sv-progress-buttons", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new ProgressButtonsViewModel(params.model, componentInfo.element.nextElementSibling);
    },
  },
  template: template
});