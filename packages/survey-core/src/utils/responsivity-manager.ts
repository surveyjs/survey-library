import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";
import { AdaptiveActionContainer } from "../actions/adaptive-container";
import type { Action } from "../actions/action";
import { isContainerVisible } from "./dom-utils";

export class ResponsivityManager {
  private resizeObserver: ResizeObserver = undefined;
  private isInitialized = false;
  private isResizeObserverStarted: boolean = false;

  public getComputedStyle = (elt: Element): CSSStyleDeclaration => {
    return DomDocumentHelper.getComputedStyle(elt);
  };
  constructor(
    public container: HTMLDivElement, private model: AdaptiveActionContainer, public afterInitializeCallback?: () => void) {
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        DomWindowHelper.requestAnimationFrame((): void | undefined => {
          this.isResizeObserverStarted = true;
          this.process();
        });
      });
      this.resizeObserver.observe(this.container.parentElement);
    }
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
    if (computedStyle.display == "flex") {
      const gap = parseFloat(computedStyle.rowGap);
      return !isNaN(gap) ? gap : 0;
    }
    return 0;
  }

  protected calcItemSize(item: HTMLElement): number {
    return item.offsetWidth || item.getBoundingClientRect().width;
  }

  // Measures the sizes the actions' flags ask for; with onlyLarge, the large ones only.
  private updateItemsDimensions(actions: Array<Action>, callback: () => void, onlyLarge?: boolean) {
    if (!this.container) return;
    let actionsCounter = actions.length;
    if (actionsCounter == 0) {
      callback();
    }
    const onItemDimensionsUpdated = () => {
      if (--actionsCounter <= 0) {
        callback();
      }
    };
    actions.forEach(action => {
      const needUpdateMaxDimension = action.needUpdateMaxDimension;
      const needUpdateMinDimension = !onlyLarge && action.needUpdateMinDimension;
      const modeToCalculate = needUpdateMinDimension ? (needUpdateMaxDimension ? undefined : "small") : "large";
      action.updateDimensions((el) => this.calcItemSize(el), () => {
        action.needUpdateMaxDimension = false;
        if (needUpdateMinDimension) {
          action.needUpdateMinDimension = false;
        }
        onItemDimensionsUpdated();
      }, modeToCalculate);
    });
  }
  private get isContainerVisible(): boolean {
    return !!this.container && isContainerVisible(this.container);
  }
  protected shouldProcessResponsiveness () {
    return this.isContainerVisible && !this.model.isResponsivenessDisabled && !this.isDisposed;
  }
  // The flags of the actions tell the sizes to measure; a bar not initialized yet measures every rendered action.
  // Reads go first: an action shown large is measured as it is, with nothing rendered. When the large sizes fit,
  // fit() needs nothing else, and the small modes and the hidden dots item are measured only once the bar does not
  // fit: each of them is rendered to be measured, a write that the next read pays for with a forced layout (four per
  // bar, 1,200 for the "Edit" bars of a 300-page preview).
  private process(): void {
    if (!this.shouldProcessResponsiveness()) return;
    if (!this.isInitialized) {
      this.model.renderedActions.forEach(action => {
        action.needUpdateMaxDimension = true;
        action.needUpdateMinDimension = true;
      });
    }
    const shownLarge = this.model.renderedActions.filter(action => action.needUpdateMaxDimension && action.isVisible && action.mode === "large");
    this.updateItemsDimensions(shownLarge, () => {
      if (!this.shouldProcessResponsiveness()) {
        this.afterFit();
        return;
      }
      const options = { availableSpace: this.getAvailableSpace(), gap: this.getGap() };
      if (this.model.fitsWithLargeSizes(options)) {
        this.model.fit(options);
        this.afterFit();
        return;
      }
      const toMeasure = this.model.renderedActions.filter(action => action.needUpdateMaxDimension || action.needUpdateMinDimension);
      this.updateItemsDimensions(toMeasure, () => {
        if (this.shouldProcessResponsiveness()) {
          this.model.fit({ availableSpace: this.getAvailableSpace(), gap: this.getGap() });
        }
        this.afterFit();
      });
    }, true);
  }
  private afterFit(): void {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.afterInitializeCallback && this.afterInitializeCallback();
    }
  }
  private isDisposed: boolean = false;
  public update(forceUpdate: boolean) {
    if (!this.isResizeObserverStarted) return;
    if (!this.model.isResponsivenessDisabled) {
      if (forceUpdate) {
        this.isInitialized = false;
      }
      this.process();
    }
  }
  public dispose(): void {
    this.isDisposed = true;
    if (!!this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.isResizeObserverStarted = false;
    this.resizeObserver = undefined;
    this.container = undefined;
  }
}

export class VerticalResponsivityManager extends ResponsivityManager {
  constructor(container: HTMLDivElement, model: AdaptiveActionContainer) {
    super(container, model);
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
