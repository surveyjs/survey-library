import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";
import { Action } from "../actions/action";
import { AdaptiveActionContainer } from "../actions/adaptive-container";
import { classesToSelector, isContainerVisible } from "./utils";

interface IDimensions {
  scroll: number;
  offset: number;
}

export class ResponsivityManager {
  private resizeObserver: ResizeObserver = undefined;
  private isInitialized = false;

  public getComputedStyle = (elt: Element): CSSStyleDeclaration => {
    return DomDocumentHelper.getComputedStyle(elt);
  }

  constructor(
    public container: HTMLDivElement, private model: AdaptiveActionContainer) {
    this.model.updateCallback = (isResetInitialized: boolean) => {
      if (isResetInitialized) {
        this.isInitialized = false;
      }
      this.process();
    };
    if (typeof ResizeObserver !== "undefined") {
      let isFirst = true;
      this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        if(isFirst) { isFirst = false; return; }
        DomWindowHelper.requestAnimationFrame((): void | undefined => {
          this.process();
        });
      });
      this.resizeObserver.observe(this.container.parentElement);
      this.process();
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
  protected getGap(): number {
    const computedStyle = this.getComputedStyle(this.container);
    if(computedStyle.display == "flex") {
      const gap = parseFloat(computedStyle.rowGap);
      return !isNaN(gap) ? gap : 0;
    }
    return 0;
  }

  protected calcItemSize(item: HTMLElement): number {
    return item.offsetWidth || item.getBoundingClientRect().width;
  }

  private calcItemsSizes(callback: () => void) {
    if (!this.container || this.isInitialized) return;
    const actions = this.model.renderedActions;
    let actionsCounter = actions.length;
    actions.forEach((action: Action) => {
      const actionForCalc = this.model.actionsRepo.getAction(action.component);
      if(actionForCalc) {
        actionForCalc.getLargeRootElement().querySelector("span").innerHTML = action.title;
        // actionForCalc.getTitleElement().innerHTML = action.locTitle.renderedHtml;
        action.minDimension = this.calcItemSize(actionForCalc.getSmallRootElement());
        action.maxDimension = this.calcItemSize(actionForCalc.getLargeRootElement());
      }
    });
    callback();
  }
  private get isContainerVisible(): boolean {
    return !!this.container && isContainerVisible(this.container);
  }

  private process(): void {
    if (this.isContainerVisible && !this.model.isResponsivenessDisabled && !this.isDisposed) {
      const processResponsiveness = () => {
        this.model.fit({ availableSpace: this.getAvailableSpace(), gap: this.getGap() });
      };
      if (!this.isInitialized) {
        this.calcItemsSizes(() => {
          processResponsiveness();
          this.isInitialized = true;
        });
      } else {
        processResponsiveness();
      }
    }
  }
  private isDisposed: boolean = false;
  public dispose(): void {
    this.isDisposed = true;
    this.model.updateCallback = undefined;
    if (!!this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.resizeObserver = undefined;
    this.container = undefined;
  }
}

export class VerticalResponsivityManager extends ResponsivityManager {
  constructor(container: HTMLDivElement, model: AdaptiveActionContainer) {
    super(container, model);
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
