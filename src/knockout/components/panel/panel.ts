import * as ko from "knockout";
import { PanelModel } from "survey-core";
const template = require("html-loader?interpolate!val-loader!./panel.html");

export class PanelViewModel {
  constructor(public question: PanelModel, public targetElement: HTMLElement) {}
}

ko.components.register("sv-panel", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new PanelViewModel(
        params.question,
        componentInfo.element.parentElement
      );
      return viewModel;
    },
  },
  template: template,
});
