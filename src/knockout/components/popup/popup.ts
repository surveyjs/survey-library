import * as ko from "knockout";
import { createPopupModalViewModel, PopupBaseViewModel } from "survey-core";
import { ImplementorBase } from "../../kobase";
import { settings } from "survey-core";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export class PopupViewModel {
  constructor(public popupViewModel: PopupBaseViewModel) {
    if (!popupViewModel.container)
      popupViewModel.initializePopupContainer();
    new ImplementorBase(popupViewModel.model);
    new ImplementorBase(popupViewModel);
    popupViewModel.container.innerHTML = template;
    popupViewModel.model.onVisibilityChanged = (isVisible: boolean) => {
      if (isVisible) {
        ko.tasks.runEarly();
        popupViewModel.updateOnShowing();
      }
    };
    ko.applyBindings(popupViewModel, popupViewModel.container);
  }
  dispose() {
    ko.cleanNode(this.popupViewModel.container);
    this.popupViewModel.destroyPopupContainer();
  }
}

export function showModal(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  cssClass?: string,
  title?: string,
  displayMode: "popup"|"overlay" = "popup"
) {
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(componentName, data, onApply, onCancel,
    () => {
      viewModel.dispose();
    }, undefined, cssClass, title, displayMode);
  var viewModel = new PopupViewModel(popupViewModel);
  popupViewModel.model.isVisible = true;
}

settings.showModal = showModal;

ko.components.register("sv-popup", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new PopupBaseViewModel(
        ko.unwrap(params.model),
        componentInfo.element.parentElement
      );
      return new PopupViewModel(viewModel);
    },
  },
  template: "<div></div>",
});
