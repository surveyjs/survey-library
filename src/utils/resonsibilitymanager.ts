import { HtmlConditionItem } from "../expressionItems";

export class ResponsibilityManager {
  private previousSpace = 0;
  private previousItemCount = Number.MAX_VALUE;
  private _itemSizes: Array<number> = undefined;
  public getItemSizes: () => Array<number>;
  constructor(
    protected container: HTMLDivElement,
    private model: any,
    private dotsItemSize: number = 56
  ) {}
  getComputedStyle: any = window.getComputedStyle.bind(window);

  protected getFullSpace() {
    var style = this.getComputedStyle(this.container);
    var widthWithMargins =
      this.container.offsetWidth +
      parseFloat(style.marginLeft) +
      parseFloat(style.marginRight);
    return widthWithMargins;
  }

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

export class VerticalResponsibilityManager extends ResponsibilityManager {
  protected getAvailableSpace() {
    var style = this.getComputedStyle(this.container);
    var width = this.container.offsetHeight;
    if (style.boxSizing == "border-box") {
      width -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    }
    return width;
  }

  protected getFullSpace() {
    var style = this.getComputedStyle(this.container);
    return (
      this.container.offsetHeight +
      parseFloat(style.marginTop) +
      parseFloat(style.marginBottom)
    );
  }
  protected getDimensions() {
    return {
      scrollDimension: this.container.scrollHeight,
      offsetDimension: this.container.offsetHeight,
    };
  }
}
