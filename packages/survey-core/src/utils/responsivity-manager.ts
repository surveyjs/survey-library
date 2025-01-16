import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";
import { Action } from "../actions/action";
import { AdaptiveActionContainer } from "../actions/adaptive-container";
import { classesToSelector, isContainerVisible } from "./utils";
import { debounce } from "./taskmanager";

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
  private debouncedProcess = debounce(() => {
    this.process();
  })
  constructor(
    public container: HTMLDivElement, private model: AdaptiveActionContainer) {
    this.model.updateCallback =
    (isResetInitialized: boolean) => {
      if (isResetInitialized) {
        this.isInitialized = false;
      }
      this.debouncedProcess.run();
    };
    if (typeof ResizeObserver !== "undefined") {
      let skipCallbackInResizeObserver = true;
      this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        if(skipCallbackInResizeObserver) { skipCallbackInResizeObserver = false; return; }
        DomWindowHelper.requestAnimationFrame((): void | undefined => {
          this.process();
        });
      });
      this.resizeObserver.observe(this.container.parentElement);
      if(this.shouldProcessResponsiveness()) {
        this.process();
      } else {
        skipCallbackInResizeObserver = false;
      }
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

  private updateItemsDimensions(callback: () => void) {
    if (!this.container) return;
    const actionsToUpdateDimension = this.isInitialized
      ? this.model.renderedActions.filter(action => action.needUpdateMaxDimension || action.needUpdateMinDimension)
      : this.model.renderedActions;
    let actionsCounter = actionsToUpdateDimension.length;
    if(actionsCounter == 0) {
      callback();
    }
    const onItemDimensionsUpdated = () => {
      if(--actionsCounter<= 0) {
        callback();
      }
    };
    actionsToUpdateDimension.forEach(action => {
      const needUpdateMaxDimension = !this.isInitialized || action.needUpdateMaxDimension;
      const needUpdateMinDimension = !this.isInitialized || action.needUpdateMinDimension;
      const modeToCalculate = needUpdateMinDimension ? (needUpdateMaxDimension ? undefined : "small") : "large";
      action.updateDimensions((el) => this.calcItemSize(el), () => {
        action.needUpdateMaxDimension = false;
        action.needUpdateMinDimension = false;
        onItemDimensionsUpdated();
      }, modeToCalculate);
    });
  }
  private get isContainerVisible(): boolean {
    return !!this.container && isContainerVisible(this.container);
  }
  private shouldProcessResponsiveness () {
    return this.isContainerVisible && !this.model.isResponsivenessDisabled && !this.isDisposed;
  }
  private process(): void {
    if (this.shouldProcessResponsiveness()) {
      this.updateItemsDimensions(() => {
        if(this.shouldProcessResponsiveness()) {
          this.model.fit({ availableSpace: this.getAvailableSpace(), gap: this.getGap() });
        }
        this.isInitialized = true;
      });
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
