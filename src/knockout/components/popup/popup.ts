import * as ko from "knockout";
import { createPopupModalViewModel, PopupBaseViewModel, settings, IDialogOptions, createDialogOptions, createPopupViewModel } from "survey-core";
import { ImplementorBase } from "../../kobase";
const template = require("./popup.html");

export class PopupViewModel {
  constructor(public popupViewModel: PopupBaseViewModel) {
    popupViewModel.initializePopupContainer();
    new ImplementorBase(popupViewModel.model);
    new ImplementorBase(popupViewModel);
    popupViewModel.container.innerHTML = template;
    popupViewModel.model.onVisibilityChanged.add((_, option: { isVisible: boolean }) => {
      if (option.isVisible) {
        ko.tasks.runEarly();
        popupViewModel.updateOnShowing();
      }
    });
    ko.applyBindings(popupViewModel, popupViewModel.container);
  }
  dispose() {
    ko.cleanNode(this.popupViewModel.container);
    this.popupViewModel.dispose();
  }
}

// replace to showDialog then delete
export function showModal(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  cssClass?: string,
  title?: string,
  displayMode: "popup" | "overlay" = "popup"
): PopupBaseViewModel {
  const options = createDialogOptions(
    componentName,
    data,
    onApply,
    onCancel,
    undefined,
    undefined,
    cssClass,
    title,
    displayMode
  );
  return showDialog(options);
}
export function showDialog(dialogOptions: IDialogOptions): PopupBaseViewModel {
  dialogOptions.onHide = () => { viewModel.dispose(); };
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(dialogOptions);
  var viewModel = new PopupViewModel(popupViewModel);
  popupViewModel.model.isVisible = true;
  return popupViewModel;
}

settings.showModal = showModal;

ko.components.register("sv-popup", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = createPopupViewModel(
        ko.unwrap(params.model),
        componentInfo.element.parentElement
      );
      return new PopupViewModel(viewModel);
    },
  },
  template: "<div></div>",
});
