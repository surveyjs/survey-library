import * as ko from "knockout";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export class PopupViewModel {
  private container: HTMLElement;
  public top = ko.observable();
  public left = ko.observable();
  private showSubscription: ko.Computed<void>;
  constructor(
    public contentComponentName: string,
    public contentComponentData: any,
    public isVisible: ko.Observable<boolean>,
    public verticalPosition: "top" | "bottom" | "middle",
    public horizontalPosition: "left" | "right" | "center",
    public showPointer: boolean,
    targetElement: HTMLElement
  ) {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.innerHTML = template;
    ko.applyBindings(this, this.container);

    this.showSubscription = ko.computed(() => {
      const rect = targetElement.getBoundingClientRect();
      let width: number = (<HTMLElement>this.container.
        children[0].children[0]).offsetWidth;
      if (this.isVisible()) {
        if (horizontalPosition == "center") {
          this.left((rect.left + rect.right - width) / 2);
        } else if (horizontalPosition == "left") {
          this.left(rect.left - width);
        } else {
          this.left(rect.right);
        }

        let height: number = (<HTMLElement>this.container.
          children[0].children[0]).offsetHeight;
        if (verticalPosition == "bottom") {
          this.top(rect.bottom);
        } else if (verticalPosition == "middle") {
          this.top((rect.bottom + rect.top) / 2 - height / 2);
        } else {
          this.top(rect.top - height);
        }
      }
    });
  }

  public get styleClass(): string {
    let css = "";
    if (this.showPointer) {
      css += " sv-popup--show-pointer";
    }
    css += ` sv-popup--${this.horizontalPosition}`;
    css += ` sv-popup--${this.verticalPosition}`;
    return css;
  }

  public dispose(): any {
    this.showSubscription.dispose();
    ko.cleanNode(this.container);
    this.container.remove();
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
        componentInfo.element.parentElement
      );
      return viewModel;
    },
  },
  template: "<div></div>",
});
