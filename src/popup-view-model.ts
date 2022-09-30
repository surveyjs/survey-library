import { Base } from "./base";
import { property } from "./jsonobject";
import { PopupModel } from "./popup";

export const FOCUS_INPUT_SELECTOR = "input:not(:disabled):not([readonly]):not([type=hidden]),select:not(:disabled):not([readonly]),textarea:not(:disabled):not([readonly]), button:not(:disabled):not([readonly]), [tabindex]:not([tabindex^=\"-\"])";

export class PopupBaseViewModel extends Base {
  private prevActiveElement: HTMLElement;

  @property({ defaultValue: false }) isVisible: boolean;

  public container: HTMLElement;

  protected hidePopup(): void {
    this.model.isVisible = false;
  }
  private setupModel(model: PopupModel) {
    if (!!this.model) {
      this.model.unregisterPropertyChangedHandlers(["isVisible"], "PopupBaseViewModel");
    }
    this._model = model;
    const onIsVisibleChangedHandler = () => {
      if (!model.isVisible) {
        this.updateOnHiding();
      }
      this.isVisible = model.isVisible;
    };
    model.registerPropertyChangedHandlers(["isVisible"], onIsVisibleChangedHandler, "PopupBaseViewModel");
    onIsVisibleChangedHandler();
  }

  private _model: PopupModel;
  public get model() {
    return this._model;
  }
  public set model(model: PopupModel) {
    this.setupModel(model);
  }

  constructor(model: PopupModel) {
    super();
    this.model = model;
  }
  public get title(): string {
    return this.model.title;
  }
  public get contentComponentName(): string {
    return this.model.contentComponentName;
  }
  public get contentComponentData(): any {
    return this.model.contentComponentData;
  }
  public get isModal(): boolean {
    return this.model.isModal;
  }
  public get isFocusedContent(): boolean {
    return this.model.isFocusedContent;
  }
  public get showFooter(): boolean {
    return this.isOverlay;
  }
  public get isOverlay(): boolean {
    return this.model.displayMode === "overlay";
  }
  public onKeyDown(event: any): void {
    if (event.key === "Tab" || event.keyCode === 9) {
      this.trapFocus(event);
    } else if (event.key === "Escape" || event.keyCode === 27) {
      this.hidePopup();
    }
  }
  private trapFocus(event: any) {
    const focusableElements = this.container.querySelectorAll(FOCUS_INPUT_SELECTOR);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        (<HTMLElement>lastFocusableElement).focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        (<HTMLElement>firstFocusableElement).focus();
        event.preventDefault();
      }
    }
  }

  public switchFocus(): void {
    if(this.isFocusedContent) {
      this.focusFirstInput();
    }
  }

  public updateOnShowing(): void {
    this.prevActiveElement = <HTMLElement>document.activeElement;
  }
  public updateOnHiding(): void {
    this.prevActiveElement && this.prevActiveElement.focus();
  }
  private focusFirstInput() {
    setTimeout(() => {
      if (!this.container) return;

      var el = this.container.querySelector(this.model.focusFirstInputSelector || FOCUS_INPUT_SELECTOR);
      if (!!el) (<HTMLElement>el).focus();
      else (<HTMLElement>this.container.children[0]).focus();
    }, 100);
  }
  public clickOutside(): void {
    this.hidePopup();
  }
  public cancel(): void {
    this.model.onCancel();
    this.hidePopup();
  }
  public dispose(): void {
    super.dispose();
    this.unmountPopupContainer();
    this.container = undefined;
    this.model.onVisibilityChanged.clear();
    this.model.onTargetModified.clear();
  }
  public initializePopupContainer(): void {
    if (!this.container) {
      const container: HTMLElement = document.createElement("div");
      this.container = container;
    }
    document.body.appendChild(this.container);
  }
  public unmountPopupContainer(): void {
    this.container.remove();
  }
}
