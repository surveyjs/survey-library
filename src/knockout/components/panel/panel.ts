import * as ko from "knockout";
import { PanelModel } from "survey-core";
const template = require("html-loader?interpolate!val-loader!./panel.html");

export class PanelViewModel {
  constructor(public panel: PanelModel, public targetElement: HTMLElement) {}
}

ko.components.register("sv-panel", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new PanelViewModel(
        params.panel,
        componentInfo.element.parentElement
      );
      return viewModel;
    },
  },
  template: template,
});
