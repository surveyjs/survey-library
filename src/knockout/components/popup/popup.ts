import * as ko from "knockout";
import { PopupModel, PopupViewModel } from "../../../popup";
import { ImplementorBase } from "../../kobase";
import { settings } from "../../../settings";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export function showModal(
  componentName: string,
  data: any,
  onApply: () => void,
  onCancel?: () => void
) {
  const popupModel = new PopupModel(
    componentName,
    data,
    "top",
    "left",
    false,
    true,
    onCancel,
    onApply
  );

  const popupViewModel: PopupViewModel = new PopupViewModel(
    popupModel,
    undefined
  );
  popupModel.onHide = () => {
    ko.cleanNode(popupViewModel.container);
    popupViewModel.destroyPopupContainer();
  };
  popupViewModel.initializePopupContainer();
  popupViewModel.container.innerHTML = template;

  // <ko specific>
  new ImplementorBase(popupViewModel);
  new ImplementorBase(popupViewModel.model);
  ko.applyBindings(popupViewModel, popupViewModel.container);
  // </ko specific>

  popupViewModel.model.isVisible = true;
}
// function showDropDownMenu(items: any[], target: HTMLElement) {
//   const popupModel = new PopupModel(
//     "sv-list",
//     new ListModel(items, undefined, false) /*, "top", "left", true*/
//   );
//   const popupViewModel: PopupViewModel = new PopupViewModel(popupModel, target);
//   popupViewModel.model.isVisible = true;
// }

settings.showModal = showModal;

ko.components.register("sv-popup", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new PopupViewModel(
        params.model,
        componentInfo.element.parentElement
      );

      viewModel.initializePopupContainer();
      viewModel.container.innerHTML = template;

      // <ko specific>
      new ImplementorBase(viewModel);
      new ImplementorBase(params.model);
      ko.applyBindings(viewModel, viewModel.container);
      // </ko specific>

      ko.utils.domNodeDisposal.addDisposeCallback(componentInfo.element, () => {
        ko.cleanNode(viewModel.container);
        viewModel.destroyPopupContainer();
      });

      return viewModel;
    },
  },
  template: "<div></div>",
});
