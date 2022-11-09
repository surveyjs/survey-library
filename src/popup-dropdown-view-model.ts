import { property } from "./jsonobject";
import { PopupUtils, IPosition } from "./utils/popup";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { PopupModel } from "./popup";
import { PopupBaseViewModel } from "./popup-view-model";

export class PopupDropdownViewModel extends PopupBaseViewModel {
  private isAutoScroll = true;
  private scrollEventCallBack = () => {
    if(!this.isAutoScroll) {
      this.hidePopup();
    } else {
      this.isAutoScroll = false;
    }
  }

  private _updatePosition() {
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
    let verticalPosition = this.model.verticalPosition;

    let actualHorizontalPosition = this.getActualHorizontalPosition();

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
        actualHorizontalPosition,
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
    }
    this.pointerTarget.top += "px";
    this.pointerTarget.left += "px";
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

  protected hidePopup(): void {
    super.hidePopup();
    this.isAutoScroll = true;
  }

  protected getStyleClass(): CssClassBuilder {
    return super.getStyleClass()
      .append("sv-popup--dropdown", !this.isOverlay)
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
      this.updatePosition(options.isResetHeight);
    });
  }

  public updateOnShowing(): void {
    this.prevActiveElement = <HTMLElement>document.activeElement;

    if (this.isOverlay) {
      this.top = null;
      this.left = null;
      this.height = null;
      this.width = null;
      this.minWidth = null;
    } else {
      this.updatePosition(true, false);
    }

    this.switchFocus();

    window.addEventListener("scroll", this.scrollEventCallBack);
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