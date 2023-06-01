import * as ko from "knockout";
import { createPopupModalViewModel, PopupBaseViewModel, settings, IDialogOptions, createDialogOptions, createPopupViewModel } from "survey-core";
import { ImplementorBase } from "../../kobase";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export class PopupViewModel {
  constructor(public popupViewModel: PopupBaseViewModel) {
    popupViewModel.initializePopupContainer();
    new ImplementorBase(popupViewModel.model);
    new ImplementorBase(popupViewModel);
    popupViewModel.container.innerHTML = template;
    popupViewModel.model.onVisibilityChanged.add(this.visibilityChangedHandler);
    ko.applyBindings(popupViewModel, popupViewModel.container);
  }
  dispose() {
    ko.cleanNode(this.popupViewModel.container);
    this.popupViewModel.model.onVisibilityChanged.remove(this.visibilityChangedHandler);
    this.popupViewModel.unmountPopupContainer();
    this.popupViewModel.container = undefined;
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
        componentInfo.element.parentElement,
        componentInfo.element.nodeType === Node.COMMENT_NODE ? componentInfo.element.nextElementSibling.children[0] : componentInfo.element.children[0].children[0]
      );
      return new PopupViewModel(viewModel);
    },
  },
  template: "<div data-bind='allowBindings: false'><div></div></div>",
});

ko.bindingHandlers.allowBindings = {
  init: function(elem, valueAccessor) {
    var shouldAllowBindings = ko.unwrap(valueAccessor());
    return { controlsDescendantBindings: !shouldAllowBindings };
  }
};