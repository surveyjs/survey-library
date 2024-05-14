import * as ko from "knockout";
import { createPopupModalViewModel, PopupBaseViewModel, settings, IDialogOptions, createDialogOptions, createPopupViewModel } from "survey-core";
import { ImplementorBase } from "../../kobase";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export class PopupViewModel {
  private _popupImplementor: ImplementorBase;
  private _popupModelImplementor: ImplementorBase;
  constructor(public popupViewModel: PopupBaseViewModel) {
    this._popupModelImplementor = new ImplementorBase(popupViewModel.model);
    this._popupImplementor = new ImplementorBase(popupViewModel);
    popupViewModel.onVisibilityChanged.add(this.visibilityChangedHandler);
  }
  public dispose(): void {
    this._popupModelImplementor.dispose();
    this._popupModelImplementor = undefined;
    this._popupImplementor.dispose();
    this._popupImplementor = undefined;
    this.popupViewModel.resetComponentElement();
    this.popupViewModel.onVisibilityChanged.remove(this.visibilityChangedHandler);
    this.popupViewModel.dispose();
    this.visibilityChangedHandler = undefined;
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
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(dialogOptions, rootElement);
  const onVisibilityChangedCallback = (_: PopupBaseViewModel, options: { isVisible: boolean }) => {
    if(!options.isVisible) {
      popupViewModel.onVisibilityChanged.remove(onVisibilityChangedCallback);
      ko.cleanNode(popupViewModel.container);
      popupViewModel.container.remove();
      popupViewModel.dispose();
      viewModel.dispose();
    }
  };
  popupViewModel.onVisibilityChanged.add(onVisibilityChangedCallback);
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
