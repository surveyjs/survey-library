import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";
import { Action } from "../actions/action";
import { AdaptiveActionContainer } from "../actions/adaptive-container";
import { isContainerVisible, isElementVisible } from "./utils";

interface IDimensions {
  scroll: number;
  offset: number;
}

export class ResponsivityManager {
  private resizeObserver: ResizeObserver = undefined;
  private isInitialized = false;
  protected minDimensionConst = 56;
  private separatorSize = 17;
  private separatorAddConst = 1;
  private paddingSizeConst = 8;
  private dotsSizeConst = 48;
  private dotsIconClass = ".sv-dots";
  private iconClass = ".sv-svg-icon";

  protected recalcMinDimensionConst = true;

  public getComputedStyle = (elt: Element): CSSStyleDeclaration => {
    return DomDocumentHelper.getComputedStyle(elt);
  }

  constructor(
    public container: HTMLDivElement,
    private model: AdaptiveActionContainer,
    private itemsSelector: string,
    private dotsItemSize: number = null,
    private delayedUpdateFunction: (callback: () => void) => void = (callback: () => void) => { if (queueMicrotask) queueMicrotask(callback); else callback(); }
  ) {
    this.model.updateCallback = (isResetInitialized: boolean) => {
      if (isResetInitialized) {
        this.isInitialized = false;
      }
      setTimeout(() => { this.process(); }, 1);
    };
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        DomWindowHelper.requestAnimationFrame((): void | undefined => {
          this.process();
        });
      });
      this.resizeObserver.observe(this.container.parentElement);
    }
  }

  protected getDimensions(element: HTMLElement): IDimensions {
    return {
      scroll: element.scrollWidth,
      offset: element.offsetWidth,
    };
  }

  protected getAvailableSpace(): number {
    const style: CSSStyleDeclaration = this.getComputedStyle(this.container);
    let space = this.container.offsetWidth;
    if (style.boxSizing === "border-box") {
      space -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    return space;
  }

  protected calcItemSize(item: HTMLDivElement): number {
    return item.offsetWidth || item.getBoundingClientRect().width;
  }

  private calcMinDimension(currentAction: Action, item?: HTMLDivElement) {
    let iconSize;
    if (!!item && (!currentAction.iconSize || currentAction.iconSize === "auto")) {
      const iconElement: HTMLDivElement = item.querySelector(this.iconClass);
      iconSize = iconElement && this.calcItemSize(iconElement);
    } else if (currentAction.iconSize && typeof (currentAction.iconSize) === "number" && this.recalcMinDimensionConst) {
      iconSize = currentAction.iconSize;
    }

    let minDimensionConst = !!iconSize ? (iconSize + 2 * this.paddingSizeConst) : this.minDimensionConst;
    return currentAction.canShrink
      ? minDimensionConst +
      (currentAction.needSeparator ? this.separatorSize : 0)
      : currentAction.maxDimension;
  }

  private calcItemsSizes() {
    if (!this.container || this.isInitialized) return;
    const actions = this.model.actions;
    const _items = this.container.querySelectorAll(this.itemsSelector);
    (_items || []).forEach((item: HTMLDivElement, index: number) => {
      let currentAction = actions[index];
      if (!!currentAction) {
        this.calcActionDimensions(currentAction, item);
      }
    });
  }
  protected calcActionDimensions(currentAction: Action, item: HTMLDivElement) {
    currentAction.maxDimension = this.calcItemSize(item);
    currentAction.minDimension = this.calcMinDimension(currentAction, item);
  }
  private get isContainerVisible(): boolean {
    return !!this.container && isContainerVisible(this.container);
  }

  private process(): void {
    if (this.isContainerVisible && !this.model.isResponsivenessDisabled) {
      if (!this.isInitialized) {
        this.model.setActionsMode("large");
      }
      const processResponsiveness = () => {
        let dotsItemSize = this.dotsItemSize;
        if (!this.dotsItemSize) {
          const dotsItemElement: HTMLDivElement = this.container?.querySelector(this.dotsIconClass);
          dotsItemSize = dotsItemElement && this.calcItemSize(dotsItemElement) || this.dotsSizeConst;
        }
        this.model.fit(this.getAvailableSpace(), dotsItemSize);
      };
      if (!this.isInitialized) {
        const callback = () => {
          if (!this.container) {
            return;
          }
          this.calcItemsSizes();
          this.isInitialized = true;
          processResponsiveness();
        };
        if (this.delayedUpdateFunction) {
          this.delayedUpdateFunction(callback);
        } else {
          callback();
        }
      } else {
        processResponsiveness();
      }
    }
  }

  public dispose(): void {
    this.model.updateCallback = undefined;
    if (!!this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.resizeObserver = undefined;
    this.container = undefined;
  }
}

export class VerticalResponsivityManager extends ResponsivityManager {
  constructor(
    container: HTMLDivElement,
    model: AdaptiveActionContainer,
    itemsSelector: string,
    dotsItemSize?: number,
    minDimension = 40,
    delayedUpdateFunction?: (callback: () => void) => void
  ) {
    super(container, model, itemsSelector, dotsItemSize, delayedUpdateFunction);
    this.minDimensionConst = minDimension;
    this.recalcMinDimensionConst = false;
  }

  protected getDimensions(): IDimensions {
    return {
      scroll: this.container.scrollHeight,
      offset: this.container.offsetHeight,
    };
  }

  protected getAvailableSpace(): number {
    const style: CSSStyleDeclaration = this.getComputedStyle(this.container);
    let space: number = this.container.offsetHeight;
    if (style.boxSizing === "border-box") {
      space -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    }
    return space;
  }

  protected calcItemSize(item: HTMLDivElement): number {
    return item.offsetHeight;
  }
  protected calcActionDimensions(currentAction: Action, item: HTMLDivElement) {
    currentAction.maxDimension = this.calcItemSize(item);
    currentAction.minDimension = this.calcItemSize(item);
  }
}
