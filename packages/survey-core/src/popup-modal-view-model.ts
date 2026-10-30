import { CssClassBuilder, toCssClasses } from "./utils/cssClassBuilder";
import { PopupModel } from "./popup";
import { PopupBaseViewModel } from "./popup-view-model";
import { IAction } from "./actions/action";
import { defaultActionBarCss } from "./actions/actionBarCss";

export class PopupModalViewModel extends PopupBaseViewModel {
  protected getStyleClass(): CssClassBuilder {
    const displayMode = this.model.getDisplayMode();
    return super.getStyleClass()
      .append("sv-popup--modal-popup", displayMode === "modal-popup")
      .append("sv-popup--modal-overlay", displayMode === "modal-overlay");
  }
  protected getShowFooter(): boolean {
    return true;
  }
  protected createFooterActionBar(): void {
    super.createFooterActionBar();
    this.footerToolbar.setCssClasses({ item: toCssClasses("sv-popup__body-footer-item", defaultActionBarCss.item) });
    this.footerToolbar.setActionsAppearance({ style: "brand", mode: "secondary", size: "medium" });
    this.footerToolbar.containerCss = "sv-modal-footer-action-bar";
    let footerActions = [
      <IAction>{
        id: "cancel",
        visibleIndex: 10,
        title: this.cancelButtonText,
        innerCss: "sv-popup__button sv-popup__button--cancel",
        action: () => { this.cancel(); }
      },
      <IAction>{
        id: "apply",
        visibleIndex: 20,
        title: this.applyButtonText,
        innerCss: "sv-popup__button sv-popup__button--apply",
        appearance: { mode: "primary" },
        action: () => { this.apply(); }
      }
    ];

    footerActions = this.model.updateFooterActions(footerActions);
    this.footerToolbarValue.setItems(footerActions);
  }

  constructor(model: PopupModel) {
    super(model);
  }

  public get applyButtonText(): string {
    return this.getLocalizationString("modalApplyButtonText");
  }
  public apply(): void {
    if (!!this.model.onApply && !this.model.onApply()) return;
    this.hidePopup();
  }

  public clickOutside(): void {
    return;
  }
  public onKeyDown(event: any): void {
    if (event.key === "Escape" || event.keyCode === 27) {
      // A popup opened inside the modal - the list of a dropdown - closes on its own Escape: the modal stays.
      const isNestedPopupShown = this.isNestedPopupShownOnKey !== undefined ? this.isNestedPopupShownOnKey : this.hasShownNestedPopup();
      this.isNestedPopupShownOnKey = undefined;
      if (this.isInNestedPopup(event.target) || isNestedPopupShown) return;
      this.model.onCancel();
    }
    super.onKeyDown(event);
  }
  private isInNestedPopup(target: any): boolean {
    if (!target || typeof target.closest !== "function" || !this.container) return false;
    const popup = target.closest(this.popupSelector);
    const ownPopup = this.container.querySelector(this.popupSelector);
    return !!popup && !!ownPopup && popup !== ownPopup;
  }
  /* A dropdown editor of a survey in the modal keeps the focus while its list is open, and closes the list on
     Escape without stopping the key. Whether a list was shown is read as the key goes down (in the capture phase):
     a renderer may hide the list before the key reaches the modal. */
  private isNestedPopupShownOnKey: boolean;
  private onKeyDownCapture = (): void => {
    this.isNestedPopupShownOnKey = this.hasShownNestedPopup();
  };
  private hasShownNestedPopup(): boolean {
    if (!this.container) return false;
    const ownPopup = this.container.querySelector(this.popupSelector);
    if (!ownPopup) return false;
    const popups: Array<HTMLElement> = Array.prototype.slice.call(ownPopup.querySelectorAll(this.popupSelector));
    return popups.some((popup: HTMLElement): boolean => popup.style.display !== "none");
  }

  private onScrollOutsideCallback = (event: WheelEvent) => {
    this.preventScrollOuside(event, event.deltaY);
  };

  public updateOnShowing(): void {
    if (this.container) {
      this.container.addEventListener("wheel", this.onScrollOutsideCallback, { passive: false });
      this.container.addEventListener("keydown", this.onKeyDownCapture, true);
    }
    super.updateOnShowing();
  }
  public updateOnHiding(): void {
    if (this.container) {
      this.container.removeEventListener("wheel", this.onScrollOutsideCallback);
      this.container.removeEventListener("keydown", this.onKeyDownCapture, true);
    }
    super.updateOnHiding();
  }
}