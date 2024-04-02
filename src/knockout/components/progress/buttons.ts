import * as ko from "knockout";
import { ProgressButtons, ProgressButtonsResponsivityManager, IProgressButtonsViewModel, SurveyModel } from "survey-core";
const template: any = require("html-loader?interpolate!val-loader!./buttons.html");

export class ProgressButtonsViewModel implements IProgressButtonsViewModel {
  private respManager: ProgressButtonsResponsivityManager;
  private hasScroller = ko.observable(false);
  public canShowHeader = ko.observable(false);
  public canShowFooter = ko.observable(false);
  public canShowItemTitles = ko.observable(true);
  constructor(private model: ProgressButtons, private element: HTMLElement, public container: string = "center", public survey: SurveyModel) {
    this.respManager = new ProgressButtonsResponsivityManager(model, element, this);
  }
  onResize(canShowItemTitles: boolean): void {
    this.canShowItemTitles(canShowItemTitles);
    this.canShowHeader(!this.canShowItemTitles());
  }
  onUpdateScroller(hasScroller: boolean): void {
    this.hasScroller(hasScroller);
  }
  onUpdateSettings(): void {
    this.canShowItemTitles(this.model.showItemTitles);
    this.canShowFooter(!this.model.showItemTitles);
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
    this.respManager.dispose();
  }
}

ko.components.register("sv-progress-buttons", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new ProgressButtonsViewModel(
        params.model,
        componentInfo.element.nextElementSibling,
        params.container,
        params.survey
      );
      setTimeout(() => (params.model as ProgressButtons)?.processResponsiveness(0), 10);
      return viewModel;
    },
  },
  template: template
});
