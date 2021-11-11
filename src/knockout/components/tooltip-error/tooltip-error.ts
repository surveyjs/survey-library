import * as ko from "knockout";
import { Question, TooltipManager } from "survey-core";
const template = require("html-loader?interpolate!val-loader!./tooltip-error.html");

export class TooltipErrorViewModel {
  private tooltipManager: TooltipManager;
  constructor(public question: Question) {
  }
  public afterRender (elements: HTMLElement[]): void {
    this.tooltipManager = new TooltipManager(elements[1]);
  }
  dispose(): void {
    this.tooltipManager.dispose();
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
