import * as ko from "knockout";
import { createPopupModalViewModel, PopupBaseViewModel, settings, IDialogOptions, createDialogOptions, createPopupViewModel } from "survey-core";
import { ImplementorBase } from "../../kobase";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export class PopupViewModel {
  constructor(public popupViewModel: PopupBaseViewModel) {
    new ImplementorBase(popupViewModel.model);
    new ImplementorBase(popupViewModel);
    popupViewModel.model.onVisibilityChanged.add(this.visibilityChangedHandler);
  }
  dispose() {
    this.popupViewModel.model.onVisibilityChanged.remove(this.visibilityChangedHandler);
  }
  visibilityChangedHandler = (s: any, option: { isVisible: boolean }) => {
    if (option.isVisible) {
      ko.tasks.runEarly();
      this.popupViewModel.updateOnShowing();
    }
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
  displayMode: "popup" | "overlay" = "popup",
  container?: HTMLElement
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
  return showDialog(options, container);
}
export function showDialog(dialogOptions: IDialogOptions, rootElement?: HTMLElement): PopupBaseViewModel {
  dialogOptions.onHide = () => {
    viewModel.dispose();
    ko.cleanNode(popupViewModel.container);
    popupViewModel.dispose();
  };
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(dialogOptions, rootElement);
  var viewModel = new PopupViewModel(popupViewModel);
  popupViewModel.container.innerHTML = template;
  ko.applyBindings(viewModel, popupViewModel.container);
  popupViewModel.model.isVisible = true;
  return popupViewModel;
}

settings.showModal = showModal;
settings.showDialog = showDialog;

ko.components.register("sv-popup", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const container = componentInfo.element.nodeType === Node.COMMENT_NODE ? componentInfo.element.nextElementSibling : componentInfo.element;
      const viewModel = createPopupViewModel(ko.unwrap(params.model));
      viewModel.setComponentElement(container, params.getTarget ? params.getTarget(container) : undefined);
      return new PopupViewModel(viewModel);
    },
  },
  template: template
});
