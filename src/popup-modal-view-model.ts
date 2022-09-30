import { CssClassBuilder } from "./utils/cssClassBuilder";
import { PopupModel } from "./popup";
import { PopupBaseViewModel } from "./popup-view-model";

export class PopupModalViewModel extends PopupBaseViewModel {
  constructor(model: PopupModel) {
    super(model);
  }
  public apply(): void {
    if (!!this.model.onApply && !this.model.onApply()) return;
    this.hidePopup();
  }

  public get showFooter(): boolean {
    return true;
  }
  public get cancelButtonText(): string {
    return this.getLocalizationString("modalCancelButtonText");
  }
  public get applyButtonText(): string {
    return this.getLocalizationString("modalApplyButtonText");
  }
  public get styleClass(): string {
    return new CssClassBuilder()
      .append(this.model.cssClass)
      .append("sv-popup--modal", !this.isOverlay)
      .append(`sv-popup--${this.model.displayMode}`, this.isOverlay)
      .toString();
  }

  public clickOutside(): void {
    return;
  }

  public onKeyDown(event: any): void {
    if(event.key === "Escape" || event.keyCode === 27) {
      this.model.onCancel();
    }
    super.onKeyDown(event);
  }
}