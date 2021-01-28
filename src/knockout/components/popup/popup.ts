import * as ko from "knockout";
import { PopupUtils } from "./popup-utils";
import { surveyLocalization } from "../../../surveyStrings";
const template = require("html-loader?interpolate!val-loader!./popup.html");

export class PopupModel {
  constructor(
    public contentComponentName: string,
    public contentComponentData: any,
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
  public top = ko.observable();
  public left = ko.observable();
  public popupDirection = ko.observable<string>();
  public pointerTarget = ko.observable<object>({});
  public isVisible = ko.observable(false);

  protected container: HTMLElement;
  protected showSubscription: ko.Subscription;

  constructor(
   public model: PopupModel,
   private targetElement: HTMLElement    
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
  //
  public get contentComponentName(): string {
    return this.model.contentComponentName;
  }
  public get contentComponentData(): any {
    return this.model.contentComponentData;
  }
  public get verticalPosition(): "top" | "bottom" | "middle" {
    return this.model.verticalPosition;
  }
  public get horizontalPosition(): "left" | "right" | "center" {
    return this.model.horizontalPosition;
  }
  public get showPointer(): boolean {
    return this.model.showPointer;
  }
  public get isModal(): boolean {
    return this.model.isModal;
  }
  public get onCancel() {
    return this.model.onCancel;
  }
  public get onApply() {
    return this.model.onApply;
  }
  public get onHide() {
    return this.model.onHide;
  }
  public get onShow() {
    return this.model.onShow;
  }
  public get cssClass(): string {
    return this.model.cssClass;
  }
  //
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
    if (this.isModal) {
      this.setupModalPopup();
    }
    else {
      this.setupModelessPopup();
    }
  }
  private setupModalPopup() {
    setTimeout(() => {
      const background = <HTMLElement>this.container.children[0];
      const container = <HTMLElement>this.container.children[0].children[0];
      this.left((background.offsetWidth - container.offsetWidth) / 2 + "px");
      this.top((background.offsetHeight - container.offsetHeight) / 2 + "px");
    }, 1);
  }
  private setupModelessPopup() {
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
    if (this.isModal) {
      return;
    }
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
    this.showSubscription = undefined;
    ko.cleanNode(this.container);
    this.container.remove();
    this.container = undefined;
  }

  public static showModal(componentName: string, data: any, onApply: () => void, onCancel?: () => void) {
    const popupModel = new PopupModel(
      componentName,
      data,
      "top",
      "left",
      false,
      true,
      onCancel,
      onApply
    );

    const popupViewModel: PopupViewModel = new PopupViewModel(popupModel, undefined);    
    popupViewModel.isVisible(true);
  }
}

ko.components.register("sv-popup", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new PopupViewModel(
        params.model,
        componentInfo.element.parentElement
      );
      return viewModel;
    },
  },
  template: "<div></div>",
});
