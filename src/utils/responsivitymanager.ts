import { AdaptiveElement } from "../action-bar";

export class ResponsivityManager {
  private previousSpace = 0;
  private previousItemCount = Number.MAX_VALUE;
  private _itemSizes: Array<number> = undefined;
  public getItemSizes: () => Array<number>;
  constructor(
    protected container: HTMLDivElement,
    private model: AdaptiveElement,
    private dotsItemSize: number = 48
  ) {}
  getComputedStyle: any = window.getComputedStyle.bind(window);

  protected getAvailableSpace() {
    var style = this.getComputedStyle(this.container);
    var width = this.container.offsetWidth - this.dotsItemSize;
    if (style.boxSizing == "border-box") {
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    return width;
  }

  protected getDimensions(element: HTMLElement) {
    return {
      scrollDimension: element.scrollWidth,
      offsetDimension: element.offsetWidth,
    };
  }

  private getItemsCount(size: number) {
    var sum = 0;
    var itemSizes = this.itemSizes;
    for (var i = 0; i < itemSizes.length && size >= sum; i++) {
      sum += itemSizes[i];
    }
    if (i == this.itemSizes.length && this.dotsItemSize >= this.itemSizes[0]) {
      return i;
    }
    return i - 1;
  }

  get itemSizes() {
    if (!this._itemSizes) {
      this._itemSizes = this.getItemSizes();
    }
    return this._itemSizes;
  }

  process() {
    if (!!this.container) {
      var dimensions = this.getDimensions(this.container);
      var delta = dimensions.scrollDimension - dimensions.offsetDimension;
      if (this.previousItemCount < Number.MAX_VALUE) {
        delta -= this.dotsItemSize;
      }
      var parentSpace = this.getDimensions(this.container.parentElement)
        .offsetDimension;
      if (parentSpace != this.previousSpace) {
        if (delta > 5) {
          if (this.model.canShrink) {
            this.model.shrink();
          }
          var count = this.getItemsCount(this.getAvailableSpace());
          if (this.previousItemCount != count) {
            this.model.showFirstN(count);
            this.previousItemCount = count;
          }
        } else {
          if (
            this.model.canGrow &&
            delta <= 0 &&
            parentSpace - this.previousSpace > this.dotsItemSize
          ) {
            this.model.grow();
          }
          this.model.showFirstN(Number.MAX_VALUE);
          this.previousItemCount = Number.MAX_VALUE;
        }
        this.previousSpace = parentSpace;
      }
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

  protected getAvailableSpace() {
    var style = this.getComputedStyle(this.container);
    var width = this.container.offsetHeight;
    if (style.boxSizing == "border-box") {
      width -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    }
    return width;
  }

  protected getDimensions() {
    return {
      scrollDimension: this.container.scrollHeight,
      offsetDimension: this.container.offsetHeight,
    };
  }
}
