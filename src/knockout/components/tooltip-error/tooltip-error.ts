import * as ko from "knockout";
import { Question, TooltipManager } from "survey-core";
const template = require("html-loader?interpolate!val-loader!./tooltip-error.html");

export class TooltipErrorViewModel {
  private tooltipManager: TooltipManager;
  constructor(public question: Question) {
  }
  public afterRender = (elements: HTMLElement[]): void => {
    const tooltipElement = elements.filter((el)=> el instanceof HTMLElement)[0];
    this.tooltipManager = new TooltipManager(tooltipElement);
    ko.utils.domNodeDisposal.addDisposeCallback(elements[1], ()=> {
      this.tooltipManager.dispose();
    });
  }
}

ko.components.register("sv-tooltip-error", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new TooltipErrorViewModel(params.question);
    },
  },
  template: template,
});
