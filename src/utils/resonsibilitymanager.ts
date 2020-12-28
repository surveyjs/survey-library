export class ResponsibilityManager {
  private previousSpace = 0;

  constructor(
    private container: HTMLDivElement,
    private model: any,
    private itemSize: number = 56
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
    var width = this.container.offsetWidth;
    if (style.boxSizing == "border-box") {
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    return width;
  }
  protected getDimensions() {
    return {
      scrollDimension: this.container.scrollWidth,
      offsetDimension: this.container.offsetWidth,
    };
  }

  process() {
    if (!!this.container) {
      var dimensions = this.getDimensions();
      let delta = dimensions.scrollDimension - dimensions.offsetDimension;
      var fullSpace = this.getFullSpace();
      if (delta > 5 || fullSpace - this.previousSpace > this.itemSize) {
        if (delta > 5) {
          if (this.model.canShrink) {
            this.model.shrink();
          } else {
            this.model.showFirstN(
              Math.floor(this.getAvailableSpace() / this.itemSize) - 1
            );
          }
        } else {
          if (this.model.canGrow) {
            this.model.grow();
          }
          this.model.showFirstN(Number.MAX_VALUE);
        }
        this.previousSpace = fullSpace;
      }
    }
  }
}
