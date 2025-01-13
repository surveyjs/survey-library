import { DomDocumentHelper } from "./global_variables_utils";
import { IDialogOptions, IPopupOptionsBase, PopupModel } from "./popup";
import { PopupDropdownViewModel } from "./popup-dropdown-view-model";
import { PopupModalViewModel } from "./popup-modal-view-model";
import { PopupBaseViewModel } from "./popup-view-model";

export function createPopupModalViewModel(options: IDialogOptions, rootElement?: HTMLElement): PopupBaseViewModel {
  const popupOptions: IPopupOptionsBase = { ...options };
  popupOptions.verticalPosition = "top";
  popupOptions.horizontalPosition = "left";
  popupOptions.showPointer = false;
  popupOptions.isModal = true;
  popupOptions.displayMode = options.displayMode || "popup";
  const popupModel = new PopupModel(options.componentName, options.data, popupOptions);
  popupModel.isFocusedContent = options.isFocusedContent ?? true;
  const popupViewModel: PopupBaseViewModel = new PopupModalViewModel(popupModel);
  if(!!rootElement && !!rootElement.appendChild) {
    var container: HTMLElement = DomDocumentHelper.createElement("div");
    rootElement.appendChild(container);
    popupViewModel.setComponentElement(container);
  }
  if(!popupViewModel.container) {
    popupViewModel.initializePopupContainer();
  }
  const onVisibilityChangedCallback = (sender: PopupBaseViewModel, options: { isVisible: boolean }) => {
    if(!options.isVisible) {
      if(!!container) {
        popupViewModel.resetComponentElement();
      }
    }
    popupViewModel.onVisibilityChanged.remove(onVisibilityChangedCallback);
  };
  popupViewModel.onVisibilityChanged.add(onVisibilityChangedCallback);
  return popupViewModel;
}

export function createPopupViewModel(model: PopupModel): PopupBaseViewModel {
  if(model.isModal) {
    return new PopupModalViewModel(model);
  } else {
    return new PopupDropdownViewModel(model);
  }
}
