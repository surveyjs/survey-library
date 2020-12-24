import * as ko from "knockout";
import { PopupUtils } from "./popup-utils";
import { surveyLocalization } from "../../../surveyStrings";
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
    public contentTemplateName: string,
    public isVisible: ko.Observable<boolean>,
    public verticalPosition: "top" | "bottom" | "middle",
    public horizontalPosition: "left" | "right" | "center",
    public showPointer: boolean,
    public isModal: boolean = false,
    public onCancel = () => {},
    public onApply = () => {},
    public onHide = () => {},
    public onShow = () => {},
    public cssClass: string = "",
    targetElement: HTMLElement
  ) {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.innerHTML = template;
    ko.applyBindings(this, this.container);

    this.showSubscription = ko.computed(() => {
      const rect = targetElement.getBoundingClientRect();
      const popupContainer = <HTMLElement>(
        this.container.children[0].children[0]
      );

      this.popupDirection(
        PopupUtils.calculatePopupDirection(verticalPosition, horizontalPosition)
      );

      if (this.isVisible()) {
        do {
          var height = popupContainer.offsetHeight;
          var width = popupContainer.offsetWidth;
          const pos = PopupUtils.calculatePosition(
            rect,
            height,
            width,
            verticalPosition,
            horizontalPosition,
            this.showPointer
          );
          this.left(pos.left);
          this.top(pos.top);

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
        } while (
          popupContainer.offsetWidth != width ||
          popupContainer.offsetHeight != height
        );
        this.onShow();
      } else {
        this.onHide();
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

  public clickOutside() {
    if (this.isModal) return;
    this.isVisible(false);
  }

  public cancel() {
    this.onCancel();
    this.isVisible(false);
  }

  public apply() {
    this.onApply();
    this.isVisible(false);
  }

  public get cancelButtonText() {
    return surveyLocalization.getString("modalCancelButtonText");
  }

  public get applyButtonText() {
    return surveyLocalization.getString("modalApplyButtonText");
  }

  public dispose() {
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
        params.contentTemplateName,
        params.isVisible,
        params.verticalPosition,
        params.horizontalPosition,
        params.showPointer,
        params.isModal,
        params.onCancel,
        params.onApply,
        params.onHide,
        params.onShow,
        params.cssClass,
        componentInfo.element.parentElement
      );
      return viewModel;
    },
  },
  template: "<div></div>",
});
