import { AdaptiveElement } from "../action-bar";

interface IDimensions {
    scroll: number,
    offset: number
}

export class ResponsivityManager {
  private IGNORE_SHRINK_LIMIT_PX: number = 1;
  private previousParentOffset = 0;
  private previousVisibleItemsCount: number = Number.MAX_VALUE;
  private _itemSizes: Array<number> = undefined;
  public getItemSizes: () => Array<number>;
  public getComputedStyle: (elt: Element) => CSSStyleDeclaration = window.getComputedStyle.bind(window);

  constructor(
    protected container: HTMLDivElement,
    private model: AdaptiveElement,
    private dotsItemSize: number = 48
  ) {}

  protected getAvailableSpace(): number {
    const style: CSSStyleDeclaration = this.getComputedStyle(this.container);
    let width = this.container.offsetWidth - this.dotsItemSize;
    if (style.boxSizing === "border-box") {
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    return width;
  }

  protected getDimensions(element: HTMLElement): IDimensions {
    return {
      scroll: element.scrollWidth,
      offset: element.offsetWidth
    };
  }

  private getVisibleItemsCount(size: number): number {
    const itemSizes: number[] = this.itemSizes;
    let currSize = this.itemSizes[0];
    let i = 1;
    for (; i < itemSizes.length; i++) {
      if (currSize + itemSizes[i] > size) return i;
      currSize += itemSizes[i];
    }
    return i;
  }

  private get itemSizes() {
    if (!this._itemSizes) {
      this._itemSizes = this.getItemSizes();
    }
    return this._itemSizes;
  }

  public process() {
    if (!!this.container) {
      const scrollOffset: IDimensions = this.getDimensions(this.container);
      let hiddenWidth: number = scrollOffset.scroll - scrollOffset.offset;
      if (this.previousVisibleItemsCount < Number.MAX_VALUE) {
        hiddenWidth -= this.dotsItemSize;
      }
      const parentOffsetWidth: number = this.getDimensions(this.container.parentElement).offset;
      if (parentOffsetWidth === this.previousParentOffset) return;
      if (hiddenWidth > this.IGNORE_SHRINK_LIMIT_PX) {
        if (this.model.canShrink) this.model.shrink();
        const count: number = this.getVisibleItemsCount(this.getAvailableSpace());
        if (this.previousVisibleItemsCount !== count) {
          this.model.showFirstN(count);
          this.previousVisibleItemsCount = count;
        }
      } else {
        if (this.model.canGrow && hiddenWidth <= 0.0 &&
          parentOffsetWidth - this.previousParentOffset > this.dotsItemSize
        ) {
          this.model.grow();
        }
        this.model.showFirstN(Number.MAX_VALUE);
        this.previousVisibleItemsCount = Number.MAX_VALUE;
      }
      this.previousParentOffset = parentOffsetWidth;
    }
  }
}

export class VerticalResponsivityManager extends ResponsivityManager {
  constructor(
    container: HTMLDivElement,
    model: AdaptiveElement,
    dotsItemSize?: number
  ) {
    super(container, model, dotsItemSize);
  }

  protected getAvailableSpace(): number {
    const style: CSSStyleDeclaration = this.getComputedStyle(this.container);
    let width: number = this.container.offsetHeight;
    if (style.boxSizing === "border-box") {
      width -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    }
    return width;
  }

  protected getDimensions(): IDimensions {
    return {
      scroll: this.container.scrollHeight,
      offset: this.container.offsetHeight,
    };
  }
}
