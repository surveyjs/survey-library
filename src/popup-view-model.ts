import { Base } from "./base";
import { property } from "./jsonobject";
import { PopupModel } from "./popup";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { ActionContainer } from "./actions/container";
import { IAction } from "./actions/action";
import { settings, ISurveyEnvironment } from "./settings";
import { getElement } from "./utils/utils";

export const FOCUS_INPUT_SELECTOR = "input:not(:disabled):not([readonly]):not([type=hidden]),select:not(:disabled):not([readonly]),textarea:not(:disabled):not([readonly]), button:not(:disabled):not([readonly]), [tabindex]:not([tabindex^=\"-\"])";

export class PopupBaseViewModel extends Base {
  protected popupSelector = ".sv-popup";
  protected containerSelector = ".sv-popup__container";
  protected scrollingContentSelector = ".sv-popup__scrolling-content";
  protected prevActiveElement: HTMLElement;
  protected footerToolbarValue: ActionContainer;

  @property({ defaultValue: "0px" }) top: string;
  @property({ defaultValue: "0px" }) left: string;
  @property({ defaultValue: "auto" }) height: string;
  @property({ defaultValue: "auto" }) width: string;
  @property({ defaultValue: "auto" }) minWidth: string;
  @property({ defaultValue: false }) isVisible: boolean;
  @property() locale: string;

  public get container(): HTMLElement {
    return this.containerElement || this.createdContainer;
  }
  private containerElement: HTMLElement;
  private createdContainer: HTMLElement;

  public getLocale(): string {
    if(!!this.locale) return this.locale;
    return super.getLocale();
  }
  protected hidePopup(): void {
    this.model.isVisible = false;
  }
  protected getStyleClass(): CssClassBuilder {
    return new CssClassBuilder()
      .append(this.model.cssClass)
      .append(`sv-popup--${this.model.displayMode}`, this.isOverlay);
  }
  protected getShowFooter(): boolean {
    return this.isOverlay;
  }
  protected getShowHeader(): boolean {
    return false;
  }
  protected getPopupHeaderTemplate(): string {
    return undefined;
  }
  protected createFooterActionBar(): void {
    this.footerToolbarValue = new ActionContainer();
    this.footerToolbar.updateCallback = (isResetInitialized: boolean) => {
      this.footerToolbarValue.actions.forEach(action => action.cssClasses = {
        item: "sv-popup__body-footer-item sv-popup__button sd-btn"
      });
    };
    let footerActions = [<IAction>{
      id: "cancel",
      visibleIndex: 10,
      title: this.cancelButtonText,
      innerCss: "sv-popup__button--cancel sd-btn",
      action: () => { this.cancel(); }
    }];

    footerActions = this.model.updateFooterActions(footerActions);
    this.footerToolbarValue.setItems(footerActions);
  }
  protected resetDimensionsAndPositionStyleProperties(): void {
    const nullableValue = "inherit";
    this.top = nullableValue;
    this.left = nullableValue;
    this.height = nullableValue;
    this.width = nullableValue;
    this.minWidth = nullableValue;
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
  public get isFocusedContainer(): boolean {
    return this.model.isFocusedContainer;
  }
  public get showFooter(): boolean {
    return this.getShowFooter();
  }
  public get showHeader(): boolean {
    return this.getShowHeader();
  }
  public get popupHeaderTemplate(): string {
    return this.getPopupHeaderTemplate();
  }

  public get isOverlay(): boolean {
    return this.model.displayMode === "overlay";
  }
  public get styleClass(): string {
    return this.getStyleClass().toString();
  }
  public get cancelButtonText(): string {
    return this.getLocalizationString("modalCancelButtonText");
  }
  public get footerToolbar(): ActionContainer {
    if(!this.footerToolbarValue) {
      this.createFooterActionBar();
    }
    return this.footerToolbarValue;
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
      if (settings.environment.root.activeElement === firstFocusableElement) {
        (<HTMLElement>lastFocusableElement).focus();
        event.preventDefault();
      }
    } else {
      if (settings.environment.root.activeElement === lastFocusableElement) {
        (<HTMLElement>firstFocusableElement).focus();
        event.preventDefault();
      }
    }
  }

  public switchFocus(): void {
    if(this.isFocusedContent) {
      this.focusFirstInput();
    } else if(this.isFocusedContainer) {
      this.focusContainer();
    }
  }

  public updateOnShowing(): void {
    this.prevActiveElement = <HTMLElement>settings.environment.root.activeElement;

    if (this.isOverlay) {
      this.resetDimensionsAndPositionStyleProperties();
    }

    this.switchFocus();
  }

  public updateOnHiding(): void {
    if (this.isFocusedContent && this.prevActiveElement) {
      this.prevActiveElement.focus();
    }
  }
  private focusContainer() {
    if (!this.container) return;
    const popup = (<HTMLElement>this.container.querySelector(this.popupSelector));
    popup?.focus();
  }
  private focusFirstInput() {
    setTimeout(() => {
      if (!this.container) return;
      var el = this.container.querySelector(this.model.focusFirstInputSelector || FOCUS_INPUT_SELECTOR);
      if (!!el) (<HTMLElement>el).focus();
      else this.focusContainer();
    }, 100);
  }
  public clickOutside(event?: Event): void {
    this.hidePopup();
    event?.stopPropagation();
  }
  public cancel(): void {
    this.model.onCancel();
    this.hidePopup();
  }
  public dispose(): void {
    super.dispose();
    if(!!this.createdContainer) {
      this.createdContainer.remove();
      this.createdContainer = undefined;
    }
    if(!!this.footerToolbarValue) {
      this.footerToolbarValue.dispose();
    }
  }
  public initializePopupContainer(): void {
    if (!this.container) {
      const container: HTMLElement = document.createElement("div");
      this.createdContainer = container;
      getElement(settings.environment.popupMountContainer).appendChild(container);
    }
  }
  public setComponentElement(componentRoot: HTMLElement, targetElement?: HTMLElement | null): void {
    if(!!componentRoot) {
      this.containerElement = componentRoot;
    }
  }
  protected preventScrollOuside(event: any, deltaY: number): void {
    let currentElement = event.target;
    while (currentElement !== this.container) {
      if (window.getComputedStyle(currentElement).overflowY === "auto" && currentElement.scrollHeight !== currentElement.offsetHeight) {
        const { scrollHeight, scrollTop, clientHeight } = currentElement;
        if (!(deltaY > 0 && Math.abs(scrollHeight - clientHeight - scrollTop) < 1) && !(deltaY < 0 && scrollTop <= 0)) {
          return;
        }
      }
      currentElement = currentElement.parentElement;
    }
    event.preventDefault();
  }
}
