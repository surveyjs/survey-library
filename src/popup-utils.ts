import { IDialogOptions, PopupModel } from "./popup";
import { PopupDropdownViewModel } from "./popup-dropdown-view-model";
import { PopupModalViewModel } from "./popup-modal-view-model";
import { PopupBaseViewModel } from "./popup-view-model";
import { ISurveyEnvironment } from "./base-interfaces";

export function createPopupModalViewModel(options: IDialogOptions, environment: ISurveyEnvironment = document): PopupBaseViewModel {
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
  const popupViewModel: PopupBaseViewModel = new PopupModalViewModel(popupModel, environment);
  popupViewModel.initializePopupContainer();
  return popupViewModel;
}

export function createPopupViewModel(model: PopupModel, targetElement?: HTMLElement, environment: ISurveyEnvironment = document): PopupBaseViewModel {
  if(model.isModal) {
    return new PopupModalViewModel(model, environment);
  } else {
    return new PopupDropdownViewModel(model, environment, targetElement);
  }
}
