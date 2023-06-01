import { IDialogOptions, PopupModel } from "./popup";
import { PopupDropdownViewModel } from "./popup-dropdown-view-model";
import { PopupModalViewModel } from "./popup-modal-view-model";
import { PopupBaseViewModel } from "./popup-view-model";

export function createPopupModalViewModel(options: IDialogOptions): PopupBaseViewModel {
  const popupModel = new PopupModel(
    options.componentName,
    options.data,
    "top",
    "left",
    false,
    true,
    options.onCancel,
    options.onApply,
    options.onHide,
    options.onShow,
    options.cssClass,
    options.title
  );
  popupModel.displayMode = options.displayMode || "popup";
  const popupViewModel: PopupBaseViewModel = new PopupModalViewModel(popupModel);
  popupViewModel.initializePopupContainer();
  return popupViewModel;
}

export function createPopupViewModel(model: PopupModel, targetElement?: HTMLElement, containerElement?: HTMLElement): PopupBaseViewModel {
  if(model.isModal) {
    return new PopupModalViewModel(model, containerElement);
  } else {
    return new PopupDropdownViewModel(model, targetElement, containerElement);
  }
}
