import * as ko from "knockout";
import { PopupUtils } from "./popup-utils";
import { surveyLocalization } from "../../../surveyStrings";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export class PopupModel {
  constructor(
    public contentComponentName: string,
    public contentComponentData: any,
    public contentTemplateName: string,
    public verticalPosition: "top" | "bottom" | "middle" = "bottom",
    public horizontalPosition: "left" | "right" | "center" = "left",
    public showPointer: boolean = true,
    public isModal: boolean = false,
    public onCancel = () => {},
    public onApply = () => {},
    public onHide = () => {},
    public onShow = () => {},
    public cssClass: string = ""    
  ) {

  }

  public toggleVisibility() {
    this.onToggleVisibility && this.onToggleVisibility();
  }
  public onToggleVisibility: () => void;
}

export class PopupViewModel {
  public top: any = ko.observable();
  public left: any = ko.observable();
  public popupDirection: any = ko.observable<string>();
  public pointerTarget: any = ko.observable<object>({});
  public isVisible: any = ko.observable(false);

  private container: HTMLElement;
  private showSubscription: any;

  constructor(
    public contentComponentName: string,
    public contentComponentData: any,
    public contentTemplateName: string,
    public verticalPosition: "top" | "bottom" | "middle",
    public horizontalPosition: "left" | "right" | "center",
    public showPointer: boolean,
    public isModal: boolean = false,
    public onCancel = () => {},
    public onApply = () => {},
    public onHide = () => {},
    public onShow = () => {},
    public cssClass: string = "",
    private targetElement: HTMLElement,
    public model: PopupModel
  ) {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.innerHTML = template;
    ko.applyBindings(this, this.container);

    this.showSubscription = this.isVisible.subscribe((isVisible: any) => {
      this.onIsVisibleChanged(isVisible);
    });

    this.model.onToggleVisibility = () => {
      this.isVisible(!this.isVisible());
    };
  }

  public get styleClass(): string {
    var css = this.cssClass;
    if (this.showPointer) {
      css += " sv-popup--show-pointer";
      css += ` sv-popup--${this.popupDirection()}`;
    }

    return css;
  }

  private onIsVisibleChanged(isVisible: boolean) {
    if (isVisible) {
      this.setupPopup();
      this.onShow();
    } else {
      this.onHide();
    }
  }

  private setupPopup() {
    const rect = this.targetElement.getBoundingClientRect();
    const popupContainer = <HTMLElement>this.container.children[0].children[0];
    this.popupDirection(
      PopupUtils.calculatePopupDirection(
        this.verticalPosition,
        this.horizontalPosition
      )
    );
    //AM: hang up: page selector inside 'test survey' page causes infinite loop here
    //do {
      var height = popupContainer.offsetHeight;
      var width = popupContainer.offsetWidth;
      const pos = PopupUtils.calculatePosition(
        rect,
        height,
        width,
        this.verticalPosition,
        this.horizontalPosition,
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
            this.verticalPosition,
            this.horizontalPosition
          )
        );
      }
    //} while (
    //  popupContainer.offsetWidth != width ||
    //  popupContainer.offsetHeight != height
    //);
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
    this.model.onToggleVisibility = undefined;
    this.showSubscription.dispose();
    ko.cleanNode(this.container);
    this.container.remove();
  }
}

ko.components.register("sv-popup", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const model = params.model;
      const viewModel = new PopupViewModel(
        model.contentComponentName,
        model.contentComponentData,
        model.contentTemplateName,
        model.verticalPosition,
        model.horizontalPosition,
        model.showPointer,
        model.isModal,
        model.onCancel,
        model.onApply,
        model.onHide,
        model.onShow,
        model.cssClass,
        componentInfo.element.parentElement,
        model
      );
      return viewModel;
    },
  },
  template: "<div></div>",
});
