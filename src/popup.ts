import { Base, EventBase } from "./base";
import { property } from "./jsonobject";
import { surveyLocalization } from "./surveyStrings";
import { PopupUtils, VerticalPosition, HorizontalPosition, IPosition, PositionMode } from "./utils/popup";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export interface IPopupOptionsBase {
  onHide?: () => void;
  onShow?: () => void;
  onApply?: () => boolean;
  onCancel?: () => void;
  cssClass?: string;
  title?: string;
  verticalPosition?: VerticalPosition;
  horizontalPosition?: HorizontalPosition;
  showPointer?: boolean;
  isModal?: boolean;
  displayMode?: "popup" | "overlay";
}
export interface IDialogOptions extends IPopupOptionsBase{
  componentName: string;
  data: any;
  onApply: () => boolean;
}
export interface IPopupModel<T = any> extends IDialogOptions {
  contentComponentName: string;
  contentComponentData: T;
}

export class PopupModel<T = any> extends Base {
  public setWidthByTarget: boolean;
  public focusFirstInputSelector = "";

  @property() contentComponentName: string;
  @property() contentComponentData: T;
  @property({ defaultValue: "bottom" }) verticalPosition: VerticalPosition;
  @property({ defaultValue: "left" }) horizontalPosition: HorizontalPosition;
  @property({ defaultValue: false }) showPointer: boolean;
  @property({ defaultValue: false }) isModal: boolean;
  @property({ defaultValue: true }) isFocusedContent: boolean;
  @property({ defaultValue: () => { } }) onCancel: () => void;
  @property({ defaultValue: () => { return true; } }) onApply: () => boolean;
  @property({ defaultValue: () => { } }) onHide: () => void;
  @property({ defaultValue: () => { } }) onShow: () => void;
  @property({ defaultValue: "" }) cssClass: string;
  @property({ defaultValue: "" }) title: string;
  @property({ defaultValue: "popup" }) displayMode: "popup" | "overlay";
  @property({ defaultValue: "flex" }) positionMode: PositionMode;

  public onVisibilityChanged: EventBase<PopupModel> = this.addEvent<PopupModel>();
  public onTargetModified: EventBase<Base> = this.addEvent<Base>();

  constructor(
    contentComponentName: string,
    contentComponentData: T,
    verticalPosition: VerticalPosition = "bottom",
    horizontalPosition: HorizontalPosition = "left",
    showPointer: boolean = true,
    isModal: boolean = false,
    onCancel = () => { },
    onApply = () => { return true; },
    onHide = () => { },
    onShow = () => { },
    cssClass: string = "",
    title: string = ""
  ) {
    super();
    this.contentComponentName = contentComponentName;
    this.contentComponentData = contentComponentData;
    this.verticalPosition = verticalPosition;
    this.horizontalPosition = horizontalPosition;
    this.showPointer = showPointer;
    this.isModal = isModal;
    this.onCancel = onCancel;
    this.onApply = onApply;
    this.onHide = onHide;
    this.onShow = onShow;
    this.cssClass = cssClass;
    this.title = title;
  }
  public get isVisible(): boolean {
    return this.getPropertyValue("isVisible", false);
  }
  public set isVisible(value: boolean) {
    if (this.isVisible === value) {
      return;
    }
    this.setPropertyValue("isVisible", value);
    this.onVisibilityChanged.fire(this, { model: this, isVisible: value });
    if (this.isVisible) {
      const innerModel = (this.contentComponentData as any)["model"];
      innerModel && innerModel.refresh && innerModel.refresh();
      this.onShow();
    } else {
      this.onHide();
    }
  }
  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
  public targetModified(): void {
    this.onTargetModified.fire(this, {});
  }
}

export function createDialogOptions(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  onHide = () => { },
  onShow = () => { },
  cssClass?: string,
  title?: string,
  displayMode: "popup" | "overlay" = "popup"): IDialogOptions {
  return <IDialogOptions>{
    componentName: componentName,
    data: data,
    onApply: onApply,
    onCancel: onCancel,
    onHide: onHide,
    onShow: onShow,
    cssClass: cssClass,
    title: title,
    displayMode: displayMode
  };
}

export function createPopupModalViewModel(options: IDialogOptions) {
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
  const popupViewModel: PopupBaseViewModel = new PopupBaseViewModel(popupModel, undefined);
  popupViewModel.initializePopupContainer();
  return popupViewModel;
}

const FOCUS_INPUT_SELECTOR = "input:not(:disabled):not([readonly]):not([type=hidden]),select:not(:disabled):not([readonly]),textarea:not(:disabled):not([readonly]), button:not(:disabled):not([readonly]), [tabindex]:not([tabindex^=\"-\"])";

export class PopupBaseViewModel extends Base {
  private isAutoScroll = true;
  private prevActiveElement: HTMLElement;
  private scrollEventCallBack = () => {
    if(!this.isAutoScroll) {
      this.hidePopup();
    } else {
      this.isAutoScroll = false;
    }
  }

  @property({ defaultValue: "0px" }) top: string;
  @property({ defaultValue: "0px" }) left: string;
  @property({ defaultValue: "auto" }) height: string;
  @property({ defaultValue: "auto" }) width: string;
  @property({ defaultValue: "auto" }) minWidth: string;
  @property({ defaultValue: false }) isVisible: boolean;
  @property({ defaultValue: "left" }) popupDirection: string;
  @property({ defaultValue: { left: "0px", top: "0px" } })
  pointerTarget: IPosition;
  public container: HTMLElement;

  private hidePopup() {
    this.model.isVisible = false;
    this.isAutoScroll = true;
  }
  private setupModel(model: PopupModel) {
    if (!!this.model) {
      this.model.registerPropertyChangedHandlers(["isVisible"], "PopupBaseViewModel");
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

  constructor(model: PopupModel, public targetElement?: HTMLElement) {
    super();
    this.model = model;
    this.model.onTargetModified.add((_, options: { }) => {
      this.updatePosition(false);
    });
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
  public get showPointer(): boolean {
    return this.model.showPointer && !this.isOverlay && !this.isModal;
  }
  public get isModal(): boolean {
    return this.model.isModal;
  }
  public get isFocusedContent(): boolean {
    return this.model.isFocusedContent;
  }
  public get showFooter(): boolean {
    return this.isModal || this.isOverlay;
  }
  public get isOverlay(): boolean {
    return this.model.displayMode === "overlay";
  }
  public get styleClass(): string {
    return new CssClassBuilder()
      .append(this.model.cssClass)
      .append("sv-popup--modal", this.isModal && !this.isOverlay)
      .append("sv-popup--dropdown", !this.isModal && !this.isOverlay)
      .append("sv-popup--show-pointer", !this.isModal && !this.isOverlay && this.showPointer)
      .append(`sv-popup--${this.popupDirection}`, !this.isModal && !this.isOverlay && this.showPointer)
      .append(`sv-popup--${this.model.displayMode}`, this.isOverlay)
      .toString();
  }
  public onKeyDown(event: any) {
    if (event.key === "Tab" || event.keyCode === 9) {
      this.trapFocus(event);
    } else if (event.key === "Escape" || event.keyCode === 27) {
      if (this.isModal) {
        this.model.onCancel();
      }
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

  public updateOnShowing() {
    this.prevActiveElement = <HTMLElement>document.activeElement;
    if (this.isOverlay) {
      this.top = null;
      this.left = null;
      this.height = null;
      this.width = null;
      this.minWidth = null;
    } else if(!this.isModal) {
      this.updatePosition();
    }

    if(this.isFocusedContent) {
      this.focusFirstInput();
    }
    if (!this.isModal) {
      window.addEventListener("scroll", this.scrollEventCallBack);
    }
  }
  public updateOnHiding() {
    this.prevActiveElement && this.prevActiveElement.focus();
    if (!this.isModal) {
      window.removeEventListener("scroll", this.scrollEventCallBack);
    }
    if(!this.isDisposed) {
      this.top = undefined;
      this.left = undefined;
      this.height = undefined;
      this.width = undefined;
      this.minWidth = undefined;
    }
  }

  private updatePosition(onShowing = true) {
    if(!this.targetElement) return;
    const targetElementRect = this.targetElement.getBoundingClientRect();
    const background = <HTMLElement>this.container.children[0];
    const popupContainer = <HTMLElement>background.children[0];
    const scrollContent = <HTMLElement>background.children[0].querySelector(".sv-popup__scrolling-content");
    const popupComputedStyle = window.getComputedStyle(popupContainer);
    const marginLeft = (parseFloat(popupComputedStyle.marginLeft) || 0);
    const marginRight = (parseFloat(popupComputedStyle.marginRight) || 0);
    let height = popupContainer.offsetHeight - scrollContent.offsetHeight + scrollContent.scrollHeight;
    const width = popupContainer.getBoundingClientRect().width;
    this.model.setWidthByTarget && (this.minWidth = targetElementRect.width + "px");
    if(onShowing) {
      this.height = "auto";
    }
    let verticalPosition = this.model.verticalPosition;
    if (!!window) {
      height = Math.ceil(Math.min(height, window.innerHeight * 0.9));
      verticalPosition = PopupUtils.updateVerticalPosition(
        targetElementRect,
        height,
        this.model.verticalPosition,
        this.model.showPointer,
        window.innerHeight
      );
    }
    this.popupDirection = PopupUtils.calculatePopupDirection(
      verticalPosition,
      this.model.horizontalPosition
    );
    const pos = PopupUtils.calculatePosition(
      targetElementRect,
      height,
      width + marginLeft + marginRight,
      verticalPosition,
      this.model.horizontalPosition,
      this.showPointer,
      this.model.positionMode
    );

    if (!!window) {
      const newVerticalDimensions = PopupUtils.updateVerticalDimensions(
        pos.top,
        height,
        window.innerHeight
      );
      if (!!newVerticalDimensions) {
        this.height = newVerticalDimensions.height + "px";
        pos.top = newVerticalDimensions.top;
      }

      const newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(
        pos.left,
        width,
        window.innerWidth,
        this.model.horizontalPosition,
        this.model.positionMode,
        { left: marginLeft, right: marginRight }
      );
      if (!!newHorizontalDimensions) {
        this.width = newHorizontalDimensions.width ? newHorizontalDimensions.width + "px" : undefined;
        pos.left = newHorizontalDimensions.left;
      }
    }
    this.left = pos.left + "px";
    this.top = pos.top + "px";

    if (this.showPointer) {
      this.pointerTarget = PopupUtils.calculatePointerTarget(
        targetElementRect,
        pos.top,
        pos.left,
        verticalPosition,
        this.model.horizontalPosition,
        marginLeft,
        marginRight
      );
    }
    this.pointerTarget.top += "px";
    this.pointerTarget.left += "px";
  }
  private focusFirstInput() {
    setTimeout(() => {
      if (!this.container) return;

      var el = this.container.querySelector(this.model.focusFirstInputSelector || FOCUS_INPUT_SELECTOR);
      if (!!el) (<HTMLElement>el).focus();
      else (<HTMLElement>this.container.children[0]).focus();
    }, 100);
  }
  public clickOutside() {
    if (this.isModal) {
      return;
    }
    this.hidePopup();
  }
  public cancel() {
    this.model.onCancel();
    this.hidePopup();
  }
  public apply() {
    if (!!this.model.onApply && !this.model.onApply()) return;
    this.hidePopup();
  }
  public get cancelButtonText() {
    return this.getLocalizationString("modalCancelButtonText");
  }
  public get applyButtonText() {
    return this.getLocalizationString("modalApplyButtonText");
  }
  public dispose() {
    super.dispose();
    this.unmountPopupContainer();
    this.container = undefined;
    this.model.onVisibilityChanged.clear();
    this.model.onTargetModified.clear();
  }
  public initializePopupContainer() {
    if (!this.container) {
      const container: HTMLElement = document.createElement("div");
      this.container = container;
    }
    document.body.appendChild(this.container);
  }
  public unmountPopupContainer() {
    this.container.remove();
  }
}
