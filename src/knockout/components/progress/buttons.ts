import * as ko from "knockout";
import { PageModel, ProgressButtons } from "survey-core";
const template: any = require("html-loader?interpolate!val-loader!./buttons.html");

export class ProgressButtonsViewModel {
  private hasScroller = ko.observable(false);
  private updateScroller: any = undefined;
  public canShowHeader = ko.observable(false);
  public canShowFooter = ko.observable(false);
  public canShowItemTitles = ko.observable(true);
  constructor(private model: ProgressButtons, private element: HTMLElement, public container: string = "center") {
    this.updateScroller = setInterval(() => {
      this.hasScroller(model.isListContainerHasScroller(element));
    }, 100);
    if (!model.showItemTitles) {
      this.canShowFooter(true);
      this.canShowItemTitles(false);
    }
    this.processResponsiveness(model, {} as any);
    this.model.onResize.add(this.processResponsiveness);
  }
  private timer: any;
  private prevWidth: number;
  private processResponsiveness = (model: ProgressButtons, options: { width: number }) => {
    if (!model.showItemTitles) {
      this.model.adjustConnectors(this.element);
      return;
    }
    this.model.clearConnectorsWidth(this.element);
    if (model.survey.isMobile) {
      this.prevWidth = options.width;
      this.canShowItemTitles(false);
      this.canShowHeader(!this.canShowItemTitles());
      return;
    }
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (this.prevWidth === undefined || this.prevWidth < options.width && !this.canShowItemTitles() || this.prevWidth > options.width && this.canShowItemTitles()) {
        this.prevWidth = options.width;
        this.canShowItemTitles(model.isCanShowItemTitles(this.element));
        this.canShowHeader(!this.canShowItemTitles());
        this.timer = undefined;
      }
    }, 10);
  }
  public getScrollButtonCss(isLeftScroll: boolean): any {
    return this.model.getScrollButtonCss(this.hasScroller(), isLeftScroll);
  }
  public clickScrollButton(
    listContainerElement: Element,
    isLeftScroll: boolean
  ): void {
    listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
  }
  public dispose(): void {
    clearTimeout(this.timer);
    this.model.onResize.remove(this.processResponsiveness);
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined;
    }
  }
}

ko.components.register("sv-progress-buttons", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new ProgressButtonsViewModel(
        params.model,
        componentInfo.element.nextElementSibling,
        params.container
      );
    },
  },
  template: template
});
