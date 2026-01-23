import { IDialogOptions } from "./popup";
import { createPopupModalViewModel } from "./popup-utils";
import { PopupBaseViewModel } from "./popup-view-model";

export class PopupModalManager {
  private modals: Array<PopupBaseViewModel> = [];
  public onModalsChangedCallback: (modals: Readonly<Array<PopupBaseViewModel>>, addedModals: Array<PopupBaseViewModel>, removedModals: Array<PopupBaseViewModel>) => void;
  private onModalsChanged(addedModals: Array<PopupBaseViewModel> = [], removedModals: Array<PopupBaseViewModel> = []) {
    this.onModalsChangedCallback && this.onModalsChangedCallback(this.modals, addedModals, removedModals);
  }
  public addModal(modal: PopupBaseViewModel) {
    const onVisibilityChangedCallback = (
      _: PopupBaseViewModel,
      options: { isVisible: boolean }
    ) => {
      if (!options.isVisible) {
        const index = this.modals.indexOf(modal);
        if (index >= 0) {
          this.modals.splice(index, 1);
        }
        modal.onVisibilityChanged.remove(onVisibilityChangedCallback);
        this.onModalsChanged(undefined, [modal]);
        modal.dispose();
      }
    };
    modal.onVisibilityChanged.add(onVisibilityChangedCallback);
    modal.model.isVisible = true;
    this.modals.push(modal);
    this.onModalsChanged([modal]);
  }
  public addDialog(dialogOptions: IDialogOptions, rootElement?: HTMLElement) {
    const modal: PopupBaseViewModel = createPopupModalViewModel(
      dialogOptions,
      rootElement
    );
    this.addModal(modal);
    return modal;
  }
  getModals(): Readonly<Array<PopupBaseViewModel>> {
    return this.modals;
  }
  clear() {
    const modals = this.modals;
    this.modals = [];
    this.onModalsChanged(undefined, modals);
    for (const modal of modals) {
      modal.dispose();
    }
  }
}