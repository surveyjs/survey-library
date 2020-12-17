import * as ko from "knockout";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export class PopupViewModel {
  public top = ko.observable();
  public left = ko.observable();
  public popupDirection = ko.observable<string>();
  public pointerTarget = ko.observable<object>({});

  private container: HTMLElement;
  private showSubscription: ko.Computed<void>;

  constructor(
    public contentComponentName: string,
    public contentComponentData: any,
    public isVisible: ko.Observable<boolean>,
    public verticalPosition: "top" | "bottom" | "middle",
    public horizontalPosition: "left" | "right" | "center",
    public showPointer: boolean,
    public onHide: () => any,
    public cssClass: string = "",
    targetElement: HTMLElement
  ) {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.innerHTML = template;
    ko.applyBindings(this, this.container);

    this.showSubscription = ko.computed(() => {
      const rect = targetElement.getBoundingClientRect();
      const height = (<HTMLElement>this.container.children[0].children[0])
        .offsetHeight;
      const width = (<HTMLElement>this.container.children[0].children[0])
        .offsetWidth;
      var pos = PopupUtils.calculatePosition(
        rect,
        height,
        width,
        verticalPosition,
        horizontalPosition,
        this.showPointer
      );
      this.left(pos.left);
      this.top(pos.top);

      this.popupDirection(
        PopupUtils.calculatePopupDirection(verticalPosition, horizontalPosition)
      );

      if (this.isVisible()) {
        if (this.showPointer) {
          this.pointerTarget(
            PopupUtils.calculatePointerTarget(
              rect,
              pos.top,
              pos.left,
              verticalPosition,
              horizontalPosition
            )
          );
        }
      }else {
        if (typeof this.onHide === "function") this.onHide();
      }
    });
  }

  public get styleClass(): string {
    var css = this.cssClass;
    if (this.showPointer) {
      css += " sv-popup--show-pointer";
      css += ` sv-popup--${this.popupDirection()}`;
    }

    return css;
  }

  public dispose() {
    this.showSubscription.dispose();
    ko.cleanNode(this.container);
    this.container.remove();
  }
}

export class PopupUtils {
  public static calculatePosition(
    targetRect: ClientRect,
    height: number,
    width: number,
    verticalPosition: string,
    horizontalPosition: string,
    showPointer: boolean
  ) {
    if (horizontalPosition == "center")
      var left = (targetRect.left + targetRect.right - width) / 2;
    else if (horizontalPosition == "left") left = targetRect.left - width;
    else left = targetRect.right;

    if (verticalPosition == "middle")
      var top = (targetRect.top + targetRect.bottom - height) / 2;
    else if (verticalPosition == "top") top = targetRect.top - height;
    else top = targetRect.bottom;

    if (showPointer) {
      if (horizontalPosition != "center" && verticalPosition != "middle") {
        if (verticalPosition == "top") {
          top = top + targetRect.height;
        } else {
          top = top - targetRect.height;
        }
      }
    }

    return { left: left, top: top };
  }

  public static calculatePopupDirection(
    verticalPosition: string,
    horizontalPosition: string
  ) {
    var popupDirection: string;
    if (horizontalPosition == "center" && verticalPosition != "middle") {
      popupDirection = verticalPosition;
    } else if (horizontalPosition != "center") {
      popupDirection = horizontalPosition;
    }
    return popupDirection;
  }

  //called when showPointer  is true
  public static calculatePointerTarget(
    targetRect: ClientRect,
    top: number,
    left: number,
    verticalPosition: string,
    horizontalPosition: string
  ) {
    var targetPos: any = {};
    if (horizontalPosition != "center") {
      targetPos.top = targetRect.top + targetRect.height / 2;
      targetPos.left = (<any>targetRect)[horizontalPosition];
    } else if (verticalPosition != "middle") {
      targetPos.top = (<any>targetRect)[verticalPosition];
      targetPos.left = targetRect.left + targetRect.width / 2;
    }
    targetPos.left = targetPos.left - left;
    targetPos.top = targetPos.top - top;
    return targetPos;
  }
}

ko.components.register("sv-popup", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new PopupViewModel(
        params.contentComponentName,
        params.contentComponentData,
        params.isVisible,
        params.verticalPosition,
        params.horizontalPosition,
        params.showPointer,
        params.onHide,
        params.cssClass,
        componentInfo.element.parentElement
      );
      return viewModel;
    },
  },
  template: "<div></div>",
});
