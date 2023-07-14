import { property } from "./jsonobject";
import { PopupUtils, IPosition } from "./utils/popup";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { PopupModel } from "./popup";
import { PopupBaseViewModel } from "./popup-view-model";
import { IsTouch } from "./utils/devices";
import { settings } from "./settings";

export class PopupDropdownViewModel extends PopupBaseViewModel {
  private scrollEventCallBack = (event: any) => {
    if(this.isOverlay && IsTouch) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    this.hidePopup();
  }
  private static readonly tabletSizeBreakpoint = 600;
  private calculateIsTablet (windowWidth: number, windowHeight: number) {
    const width = Math.min(windowWidth, windowHeight);
    this.isTablet = width >= PopupDropdownViewModel.tabletSizeBreakpoint;
  }
  private resizeEventCallback = () => {
    const visualViewport = window.visualViewport;
    document.documentElement.style.setProperty("--sv-popup-overlay-height", `${visualViewport.height * visualViewport.scale}px`);
  }
  private resizeWindowCallback = () => {
    if(!this.isOverlay) {
      this.updatePosition(true, false);
    }
  };
  private clientY: number = 0;
  @property() private isTablet = false;
  private touchStartEventCallback = (event: any) => {
    this.clientY = event.touches[0].clientY;
  }
  private touchMoveEventCallback = (event: any) => {
    this.preventScrollOuside(event, this.clientY - event.changedTouches[0].clientY);
  }

  private _updatePosition() {
    if(!this.targetElement) return;
    const targetElementRect = this.targetElement.getBoundingClientRect();
    const popupContainer = <HTMLElement>this.container?.querySelector(this.containerSelector);
    if(!popupContainer) return;
    const fixedPopupContainer = <HTMLElement>this.container?.querySelector(this.fixedPopupContainer) as HTMLElement;
    const scrollContent = <HTMLElement>popupContainer.querySelector(this.scrollingContentSelector);
    const popupComputedStyle = window.getComputedStyle(popupContainer);
    const marginLeft = (parseFloat(popupComputedStyle.marginLeft) || 0);
    const marginRight = (parseFloat(popupComputedStyle.marginRight) || 0);
    let height = popupContainer.offsetHeight - scrollContent.offsetHeight + scrollContent.scrollHeight;
    const width = popupContainer.getBoundingClientRect().width;
    this.model.setWidthByTarget && (this.minWidth = targetElementRect.width + "px");
    let verticalPosition = this.model.verticalPosition;

    let actualHorizontalPosition = this.getActualHorizontalPosition();

    if (!!window) {
      const heightValues = [height, window.innerHeight * 0.9, window.visualViewport?.height];
      height = Math.ceil(Math.min(...heightValues.filter((each) => typeof each === "number")));
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
      actualHorizontalPosition
    );
    const pos = PopupUtils.calculatePosition(
      targetElementRect,
      height,
      width + marginLeft + marginRight,
      verticalPosition,
      actualHorizontalPosition,
      this.showHeader,
      this.model.positionMode
    );

    if (!!window) {
      const newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(
        pos.top,
        height,
        window.innerHeight
      );
      if (!!newVerticalDimensions.height) {
        this.height = newVerticalDimensions.height + "px";
        pos.top = newVerticalDimensions.top;
      }

      const newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(
        pos.left,
        width,
        window.innerWidth,
        actualHorizontalPosition,
        this.model.positionMode,
        { left: marginLeft, right: marginRight }
      );
      if (!!newHorizontalDimensions) {
        this.width = newHorizontalDimensions.width ? newHorizontalDimensions.width + "px" : undefined;
        pos.left = newHorizontalDimensions.left;
      }
    }
    if(!!fixedPopupContainer) {
      const rect = fixedPopupContainer.getBoundingClientRect();
      pos.top -= rect.top;
      pos.left -= rect.left;
    }
    this.left = pos.left + "px";
    this.top = pos.top + "px";

    if (this.showHeader) {
      this.pointerTarget = PopupUtils.calculatePointerTarget(
        targetElementRect,
        pos.top,
        pos.left,
        verticalPosition,
        actualHorizontalPosition,
        marginLeft,
        marginRight
      );
      this.pointerTarget.top += "px";
      this.pointerTarget.left += "px";
    }
  }

  protected getActualHorizontalPosition(): "left" | "center" | "right" {
    let actualHorizontalPosition = this.model.horizontalPosition;
    let isRtl = !!document && document.defaultView.getComputedStyle(document.body).direction == "rtl";
    if(isRtl) {
      if(this.model.horizontalPosition === "left") {
        actualHorizontalPosition = "right";
      } else if(this.model.horizontalPosition === "right") {
        actualHorizontalPosition = "left";
      }
    }
    return actualHorizontalPosition;
  }

  protected getStyleClass(): CssClassBuilder {
    return super.getStyleClass()
      .append("sv-popup--dropdown", !this.isOverlay)
      .append("sv-popup--tablet", this.isTablet && this.isOverlay)
      .append("sv-popup--show-pointer", !this.isOverlay && this.showHeader)
      .append(`sv-popup--${this.popupDirection}`, !this.isOverlay && this.showHeader);
  }
  protected getShowHeader(): boolean {
    return this.model.showPointer && !this.isOverlay;
  }
  protected getPopupHeaderTemplate(): string {
    return "popup-pointer";
  }

  @property({ defaultValue: "left" }) popupDirection: string;
  @property({ defaultValue: { left: "0px", top: "0px" } }) pointerTarget: IPosition;

  constructor(model: PopupModel, public targetElement?: HTMLElement) {
    super(model);
    this.model.onRecalculatePosition.add((_, options: { isResetHeight: boolean }) => {
      if(!this.isOverlay) {
        this.updatePosition(options.isResetHeight);
      }
    });
  }
  public setComponentElement(componentRoot: HTMLElement, targetElement?: HTMLElement | null): void {
    super.setComponentElement(componentRoot);

    if(!!componentRoot && !!componentRoot.parentElement && !this.isModal) {
      this.targetElement = targetElement || componentRoot.parentElement;
    }
  }
  public updateOnShowing(): void {
    const { root } = settings.environment;
    this.prevActiveElement = <HTMLElement>root.activeElement;

    if (this.isOverlay) {
      this.resetDimensionsAndPositionStyleProperties();
    } else {
      this.updatePosition(true, false);
    }

    this.switchFocus();
    window.addEventListener("resize", this.resizeWindowCallback);
    if(this.shouldCreateResizeCallback) {
      window.visualViewport.addEventListener("resize", this.resizeEventCallback);
      if(this.container) {
        this.container.addEventListener("touchstart", this.touchStartEventCallback);
        this.container.addEventListener("touchmove", this.touchMoveEventCallback);
      }
      this.calculateIsTablet(window.innerWidth, window.innerHeight);
      this.resizeEventCallback();
    }
    window.addEventListener("scroll", this.scrollEventCallBack);
  }
  private get shouldCreateResizeCallback(): boolean {
    return !!window.visualViewport && this.isOverlay && IsTouch;
  }

  public updatePosition(isResetHeight: boolean, isDelayUpdating = true): void {
    if(isResetHeight) {
      this.height = "auto";
    }

    if(isDelayUpdating) {
      setTimeout(() => {
        this._updatePosition();
      }, 1);
    } else {
      this._updatePosition();
    }
  }

  public updateOnHiding(): void {
    super.updateOnHiding();
    window.removeEventListener("resize", this.resizeWindowCallback);
    if(this.shouldCreateResizeCallback) {
      window.visualViewport.removeEventListener("resize", this.resizeEventCallback);
      if(this.container) {
        this.container.removeEventListener("touchstart", this.touchStartEventCallback);
        this.container.removeEventListener("touchmove", this.touchMoveEventCallback);
      }
    }
    window.removeEventListener("scroll", this.scrollEventCallBack);

    if(!this.isDisposed) {
      this.top = undefined;
      this.left = undefined;
      this.height = undefined;
      this.width = undefined;
      this.minWidth = undefined;
    }
  }
}