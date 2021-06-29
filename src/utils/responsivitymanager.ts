import { AdaptiveElement } from "../action-bar";

interface IDimensions {
  scroll: number;
  offset: number;
}

export class ResponsivityManager {
  private resizeObserver: ResizeObserver = undefined;
  private isInilized = false;
  protected minDimensionConst = 56;

  public getComputedStyle: (
    elt: Element
  ) => CSSStyleDeclaration = window.getComputedStyle.bind(window);

  constructor(
    protected container: HTMLDivElement,
    private model: AdaptiveElement,
    private itemsSelector: string,
    private dotsItemSize: number = 48
  ) {
    this.resizeObserver = new ResizeObserver((_) => this.process());
    this.resizeObserver.observe(this.container.parentElement);
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

  private calcItemsSizes() {
    this.container
      .querySelectorAll(this.itemsSelector)
      .forEach((item: HTMLDivElement, index: number) => {
        this.model.visibleItems[index].maxDimension = this.calcItemSize(item);
        this.model.visibleItems[index].minDimension = this.model.visibleItems[index].canShrink ? this.minDimensionConst : this.model.visibleItems[index].maxDimension;
      });
  }

  private getVisibleItemsCount(size: number): number {
    const itemsSizes: number[] = this.model.items.map((item) => item.minDimension);
    let currSize: number = 0;
    for (var i = 0; i < itemsSizes.length; i++) {
      currSize += itemsSizes[i];
      if (currSize > size) return i;
    }
    return i;
  }

  private updateItemMode(dimension: number, minSize: number, maxSize: number) {
    const items = this.model.items;
    for (let index = items.length - 1; index >= 0; index--) {
      if (minSize <= dimension && dimension < maxSize) {
        maxSize -= (items[index].maxDimension - items[index].minDimension);
        items[index].mode = "small";
      } else {
        items[index].mode = "large";
      }
    }
  }

  public fit(dimension: number) {
    if(dimension <= 0) return;
    
    this.model.removeDotsButton();
    let minSize = 0;
    let maxSize = 0;

    this.model.items.forEach((item) => {
      minSize += item.minDimension;
      maxSize += item.maxDimension;
    });

    if (dimension >= maxSize) {
      this.model.items.forEach((item) => (item.mode = "large"));
    } else if (dimension < minSize) {
      this.model.items.forEach((item) => (item.mode = "small"));
      this.model.showFirstN(this.getVisibleItemsCount(dimension - this.dotsItemSize));
    } else {
      this.updateItemMode(dimension, minSize, maxSize);
    }
  }

  private process(): void {
    if (!this.isInilized) {
      this.calcItemsSizes();
      this.isInilized = true;
    }
    this.fit(this.getAvailableSpace());
  }

  public dispose(): void {
    this.resizeObserver.disconnect();
  }
}

export class VerticalResponsivityManager extends ResponsivityManager {
  protected minDimensionConst = 40;

  constructor(
    container: HTMLDivElement,
    model: AdaptiveElement,
    itemsSelector: string,
    dotsItemSize?: number
  ) {
    super(container, model, itemsSelector, dotsItemSize);
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
