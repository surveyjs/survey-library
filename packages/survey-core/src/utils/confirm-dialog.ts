import { LocalizableString } from "../localizablestring";
import { settings } from "../settings";
import { IConfirmDialogOptions, IDialogOptions } from "../popup";
import { getLocaleString } from "../surveyStrings";
import { PopupBaseViewModel } from "../popup-view-model";

export function confirmAction(message: string): boolean {
  if (!!settings && !!settings.confirmActionFunc)
    return settings.confirmActionFunc(message);
  return confirm(message);
}

export function confirmActionAsync(options: IConfirmDialogOptions): void {
  const callbackFunc = (res: boolean): void => {
    if (res) options.funcOnYes();
    else if (!!options.funcOnNo) options.funcOnNo();
  };
  if (!!settings && !!settings.confirmActionFunc) {
    callbackFunc(confirmAction(options.message));
    return;
  }
  if (!!settings && !!settings.confirmActionAsync) {
    settings.confirmActionAsync(options.message, callbackFunc, options);
  } else {
    showConfirmDialog(options.message, callbackFunc, options);
  }
}

export function showConfirmDialog(message: string, callback: (res: boolean) => void, options: IConfirmDialogOptions = {}): boolean {
  const locStr = new LocalizableString(undefined, false);
  locStr.defaultValue = message || options.message;
  const popupViewModel: PopupBaseViewModel = settings.showDialog(<IDialogOptions>{
    componentName: "sv-string-viewer",
    data: { model: locStr },
    onApply: () => {
      callback(true);
      return true;
    },
    onCancel: () => {
      callback(false);
      return false;
    },
    displayMode: "popup",
    isFocusedContent: false,
    cssClass: options.cssClass || "sv-popup--confirm"
  }, options.rootElement);
  const toolbar = popupViewModel.footerToolbar;
  const applyBtn = toolbar.getActionById("apply");
  const cancelBtn = toolbar.getActionById("cancel");
  cancelBtn.title = getLocaleString("cancel", options.locale);
  applyBtn.title = options.applyTitle || getLocaleString("ok", options.locale);
  applyBtn.innerCss = "sd-btn--danger";
  configConfirmDialog(popupViewModel);
  return true;
}

export function configConfirmDialog(popupViewModel: PopupBaseViewModel): void {
  popupViewModel.width = "min-content";
}

if (!settings.confirmActionAsync) {
  settings.confirmActionAsync = (message: string, callback: (res: boolean) => void, options?: IConfirmDialogOptions): void => {
    showConfirmDialog(message, callback, options);
  };
}