import * as ko from "knockout";
import { SurveyModel } from "../../../survey";
import { PageModel } from "../../../page";
var template = require("html-loader?interpolate!val-loader!./buttons.html");

export class ProgressButtonsViewModel {
  private hasScroller = ko.observable(false);
  private updateScroller: any = undefined;
  constructor (private model: SurveyModel, private element: any) {
    this.updateScroller = setInterval(() => {
      let listContainerElement: HTMLElement = this.element.querySelector(
        "." + model.css.progressButtonsListContainer);
      if (!!listContainerElement) {
        this.hasScroller(listContainerElement.scrollWidth > listContainerElement.offsetWidth);
      }
    }, 100);
  }
  public getListElementCss(index: any): string {
    if (index() >= this.model.visiblePages.length) return;
    let elementCss: string = this.model.visiblePages[index()].passed ?
      this.model.css.progressButtonsListElementPassed : "";
    if (this.model.currentPageNo === index()) {
      elementCss += !!elementCss ? " " : "";
      elementCss += this.model.css.progressButtonsListElementCurrent;
    }
    return elementCss;
  }
  public clickListElement(page: PageModel): void {
    if (page.visibleIndex < this.model.currentPageNo) {
      this.model.currentPageNo = page.visibleIndex;
    }
    else if (page.visibleIndex > this.model.currentPageNo) {
      let i: number = this.model.currentPageNo;
      for (; i < page.visibleIndex; i++) {
        if (this.model.visiblePages[i].hasErrors(true, true)) break;
        this.model.visiblePages[i].passed = true;
      }
      this.model.currentPageNo = i;
    }
  }
  public getScrollButtonCss(isLeftScroll: boolean) {
    return ko.computed(function() {
      let scrollCss: string = isLeftScroll ?
        this.model.css.progressButtonsImageButtonLeft :
        this.model.css.progressButtonsImageButtonRight;
      if (!this.hasScroller()) scrollCss += " " + this.model.css.progressButtonsImageButtonHidden;
      return scrollCss;
    }, this);
  }
  public clickScrollButton(listContainerElement: Element, isLeftScroll: boolean) {
    listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
  }
  public dispose() {
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined;
    }
  }
};

ko.components.register("survey-progress-buttons", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new ProgressButtonsViewModel(params.model, componentInfo.element.nextElementSibling);
    },
  },
  template: template
});