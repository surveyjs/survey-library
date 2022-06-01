import { setTimeout } from "timers";
import { Action } from "../actions/action";
import { AdaptiveActionContainer } from "../actions/adaptive-container";
import { isContainerVisible } from "./utils";

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
  protected recalcMinDimensionConst = true;

  public getComputedStyle: (
    elt: Element
  ) => CSSStyleDeclaration = window.getComputedStyle.bind(window);

  constructor(
    protected container: HTMLDivElement,
    private model: AdaptiveActionContainer,
    private itemsSelector: string,
    private dotsItemSize: number = 48,
  ) {

    this.model.updateCallback = (isResetInitialized: boolean) => {
      if(isResetInitialized)
        this.isInitialized = false;
      else
        setTimeout(() => { this.process(); }, 1);
    };
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver((_) => this.process());
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
    return item.offsetWidth;
  }

  private calcMinDimension(currentAction: Action) {
    let minDimensionConst = this.minDimensionConst;
    if(currentAction.iconSize && this.recalcMinDimensionConst) {
      minDimensionConst = 2 * currentAction.iconSize + this.paddingSizeConst;
    }
    return currentAction.canShrink
      ? minDimensionConst +
      (currentAction.needSeparator ? this.separatorSize : 0)
      : currentAction.maxDimension;
  }

  private calcItemsSizes() {
    const actions = this.model.actions;
    this.container
      .querySelectorAll(this.itemsSelector)
      .forEach((item: HTMLDivElement, index: number) => {
        let currentAction = actions[index];
        currentAction.maxDimension = this.calcItemSize(item);
        currentAction.minDimension = this.calcMinDimension(currentAction);
      });
  }
  private get isContainerVisible(): boolean {
    return isContainerVisible(this.container);
  }
  private process(): void {
    if (this.isContainerVisible && !this.model.isResponsivenessDisabled) {
      if (!this.isInitialized) {
        this.model.setActionsMode("large");
        this.calcItemsSizes();
        this.isInitialized = true;
      }
      this.model.fit(this.getAvailableSpace(), this.dotsItemSize);
    }
  }

  public dispose(): void {
    this.model.updateCallback = undefined;
    if (!!this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

export class VerticalResponsivityManager extends ResponsivityManager {
  constructor(
    container: HTMLDivElement,
    model: AdaptiveActionContainer,
    itemsSelector: string,
    dotsItemSize?: number,
    minDimension = 40
  ) {
    super(container, model, itemsSelector, dotsItemSize);
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
}
