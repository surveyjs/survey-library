import * as ko from "knockout";
import { PanelModel, SurveyModel } from "survey-core";
const template = require("html-loader?interpolate!val-loader!./panel-footer.html");

export class PanelFooterViewModel {
  constructor(public model: PanelModel, public targetElement: HTMLElement) {}
  public cancelPreview = () => {
    this.model.cancelPreview();
  }
}

ko.components.register("sv-panel-footer", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new PanelFooterViewModel(
        params.panel,
        componentInfo.element.parentElement
      );
      return viewModel;
    },
  },
  template: template,
});
