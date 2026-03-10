import { Action } from "./action";

export class ActionDropdownViewModel {
  private popupModel: any;
  private funcKey = "sv-dropdown-action";
  constructor(private item: Action) {
    this.setupPopupCallbacks();
  }
  private setupPopupCallbacks() {
    const popupModel = this.popupModel = this.item.popupModel;
    if (!popupModel) return;
    popupModel.registerPropertyChangedHandlers(["isVisible"], () => {
      if (!popupModel.isVisible) {
        this.item.pressed = false;
      } else {
        this.item.pressed = true;
      }
    }, this.funcKey);
  }
  private removePopupCallbacks() {
    if (!!this.popupModel) {
      this.popupModel.unregisterPropertyChangedHandlers(["isVisible"], this.funcKey);
    }
  }
  public dispose(): void {
    this.removePopupCallbacks();
  }
}
