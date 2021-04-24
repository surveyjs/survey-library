import { AdaptiveElement } from "../action-bar";

interface IDimensions {
    scroll: number,
    offset: number
}

export class ResponsivityManager {
  private IGNORE_SHRINK_LIMIT_PX: number = 1;
  private previousParentOffset = 0;
  private previousVisibleItemsCount: number = Number.MAX_VALUE;
  private _itemsSizes: number[] = undefined;
  private resizeObserver: ResizeObserver = undefined;
  public getComputedStyle: (elt: Element) => CSSStyleDeclaration = window.getComputedStyle.bind(window);

  constructor(
    protected container: HTMLDivElement,
    private model: AdaptiveElement,
    private itemsSelector: string,
    private dotsItemSize: number = 48
  ) {
    this.resizeObserver = new ResizeObserver(_ => this.process());
    this.resizeObserver.observe(this.container.parentElement);
  }

  protected getDimensions(element: HTMLElement): IDimensions {
    return {
      scroll: element.scrollWidth,
      offset: element.offsetWidth
    };
  }

  protected getAvailableSpace(): number {
    const style: CSSStyleDeclaration = this.getComputedStyle(this.container);
    let space = this.container.offsetWidth - this.dotsItemSize;
    if (style.boxSizing === 'border-box') {
      space -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    return space;
  }

  protected calcItemSize(item: HTMLDivElement): number {
    return item.offsetWidth;
  }

  private calcItemsSizes(): number[] {
    const sizes: number[] = [];
    this.container.querySelectorAll(this.itemsSelector)
      .forEach((item: HTMLDivElement) => {
        sizes.push(this.calcItemSize(item));
      });
    return sizes;
  }

  public get itemsSizes(): number[]  {
    if (typeof this._itemsSizes === 'undefined') {
      this._itemsSizes = this.calcItemsSizes();
    }
    return this._itemsSizes;
  }

  private getVisibleItemsCount(size: number): number {
    const itemsSizes: number[] = this.itemsSizes;
    let currSize: number = itemsSizes[0];
    let i = 1;
    for (; i < itemsSizes.length; i++) {
      if (currSize + itemsSizes[i] > size) return i;
      currSize += itemsSizes[i];
    }
    return i;
  }

  private process(): void {
    const scrollOffset: IDimensions = this.getDimensions(this.container);
    let hiddenWidth: number = scrollOffset.scroll - scrollOffset.offset;
    if (this.previousVisibleItemsCount < Number.MAX_VALUE) {
      hiddenWidth -= this.dotsItemSize;
    }
    const parentOffsetWidth: number = this.getDimensions(this.container.parentElement).offset;
    if (parentOffsetWidth === this.previousParentOffset) return;
    if (hiddenWidth > this.IGNORE_SHRINK_LIMIT_PX) {
      if (this.model.canShrink) {
        this._itemsSizes = undefined;
        this.model.shrink();
      }
      const count: number = this.getVisibleItemsCount(this.getAvailableSpace());
      if (this.previousVisibleItemsCount !== count) {
        this.model.showFirstN(count);
        this.previousVisibleItemsCount = count;
      }
    } else {
      if (this.model.canGrow && hiddenWidth <= 0.0 &&
        parentOffsetWidth - this.previousParentOffset > this.dotsItemSize
      ) {
        this._itemsSizes = undefined;
        this.model.grow();
      }
      this.model.showFirstN(Number.MAX_VALUE);
      this.previousVisibleItemsCount = Number.MAX_VALUE;
    }
    this.previousParentOffset = parentOffsetWidth;
  }

  public dispose(): void {
    this.resizeObserver.disconnect();
  }
}

export class VerticalResponsivityManager extends ResponsivityManager {
  constructor(container: HTMLDivElement, model: AdaptiveElement,
    itemsSelector: string, dotsItemSize?: number) {
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
    if (style.boxSizing === 'border-box') {
      space -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    }
    return space;
  }

  protected calcItemSize(item: HTMLDivElement): number {
    return item.offsetHeight;
  }
}
