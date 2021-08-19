import { Base } from "./base";
import { property } from "./jsonobject";
import { surveyLocalization } from "./surveyStrings";
import {
  PopupUtils,
  VerticalPosition,
  HorizontalPosition,
  IPosition
} from "./utils/popup";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export class PopupModel extends Base {
  @property() contentComponentName: string;
  @property() contentComponentData: any;
  @property({ defaultValue: "bottom" }) verticalPosition: VerticalPosition;
  @property({ defaultValue: "left" }) horizontalPosition: HorizontalPosition;
  @property({ defaultValue: false }) showPointer: boolean;
  @property({ defaultValue: false }) isModal: boolean;
  @property({ defaultValue: () => {} }) onCancel: () => void;
  @property({ defaultValue: () => {return true;} }) onApply: () => boolean;
  @property({ defaultValue: () => {} }) onHide: () => void;
  @property({ defaultValue: () => {} }) onShow: () => void;
  @property({ defaultValue: "" }) cssClass: string;
  constructor(
    contentComponentName: string,
    contentComponentData: any,
    verticalPosition: VerticalPosition = "bottom",
    horizontalPosition: HorizontalPosition = "left",
    showPointer: boolean = true,
    isModal: boolean = false,
    onCancel = () => {},
    onApply = () => {return true;},
    onHide = () => {},
    onShow = () => {},
    cssClass: string = ""
  ) {
    super();
    this.contentComponentName = contentComponentName;
    this.contentComponentData = contentComponentData;
    this.verticalPosition = verticalPosition;
    this.horizontalPosition = horizontalPosition;
    this.showPointer = showPointer;
    this.isModal = isModal;
    this.onCancel = onCancel;
    this.onApply = onApply;
    this.onHide = onHide;
    this.onShow = onShow;
    this.cssClass = cssClass;
  }
  public get isVisible(): boolean {
    return this.getPropertyValue("isVisible", false);
  }
  public set isVisible(value: boolean) {
    if (this.isVisible === value) {
      return;
    }
    this.setPropertyValue("isVisible", value);
    this.onVisibilityChanged && this.onVisibilityChanged(value);
    if (this.isVisible) {
      this.onShow();
    } else {
      this.onHide();
    }
  }
  public toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
  public onVisibilityChanged: (isVisible: boolean) => void;
}

export function createPopupModalViewModel(
    componentName: string,
    data: any,
    onApply: () => boolean,
    onCancel?: () => void,
    onHide = () => {},
    onShow = () => {},
    cssClass?: string
  ) {
    const popupModel = new PopupModel(
      componentName,
      data,
      "top",
      "left",
      false,
      true,
      onCancel,
      onApply,
      onHide,
      onShow,
      cssClass
    );
    const popupViewModel: PopupBaseViewModel = new PopupBaseViewModel(
      popupModel,
      undefined
    );
    popupViewModel.initializePopupContainer();
    return popupViewModel;
}

const FOCUS_INPUT_SELECTOR =
  "input:not(:disabled):not([readonly]):not([type=hidden]),select:not(:disabled):not([readonly]),textarea:not(:disabled):not([readonly]), button:not(:disabled):not([readonly])";

export class PopupBaseViewModel extends Base {
  @property({ defaultValue: "0px" }) top: string;
  @property({ defaultValue: "0px" }) left: string;
  @property({ defaultValue: "auto" }) height: string;
  @property({ defaultValue: false }) isVisible: boolean;
  @property({ defaultValue: "left" }) popupDirection: string;
  @property({ defaultValue: { left: "0px", top: "0px" } })
  pointerTarget: IPosition;
  public container: HTMLElement;
  constructor(public model: PopupModel, public targetElement?: HTMLElement) {
    super();
    this.model.registerFunctionOnPropertyValueChanged("isVisible", () => {
      this.isVisible = this.model.isVisible;
    });
  }
  public get contentComponentName(): string {
    return this.model.contentComponentName;
  }
  public get contentComponentData(): any {
    return this.model.contentComponentData;
  }
  public get showPointer(): boolean {
    return this.model.showPointer;
  }
  public get isModal(): boolean {
    return this.model.isModal;
  }
  public get styleClass(): string {
    return new CssClassBuilder()
      .append(this.model.cssClass)
      .append("sv-popup--modal", this.isModal)
      .append("sv-popup--show-pointer", !this.isModal && this.showPointer)
      .append(`sv-popup--${this.popupDirection}`, !this.isModal && this.showPointer)
      .toString()
  }
  public onKeyDown(event: any) {
    if (event.key === "Tab" || event.keyCode === 9) {
      this.trapFocus(event);
    } else if (event.key === "Escape" || event.keyCode === 27) {
      if (this.isModal) {
        this.model.onCancel();
      }
      this.model.isVisible = false;
    }
  }
  private trapFocus(event: any) {
    const focusableElements = this.container.querySelectorAll(
      FOCUS_INPUT_SELECTOR
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        (<HTMLElement>lastFocusableElement).focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        (<HTMLElement>firstFocusableElement).focus();
        event.preventDefault();
      }
    }
  }
  public updateOnShowing() {
    if (!this.isModal) {
      this.updatePosition();
    }
    this.focusFirstInput();
  }
  private updatePosition() {
    const rect = this.targetElement.getBoundingClientRect();
    const background = <HTMLElement>this.container.children[0];
    const popupContainer = <HTMLElement>background.children[0];
    const scrollContent = <HTMLElement>background.children[0].children[1];
    const height =
      popupContainer.offsetHeight -
      scrollContent.offsetHeight +
      scrollContent.scrollHeight;
    const width = popupContainer.offsetWidth;
    this.height = "auto";
    let verticalPosition = this.model.verticalPosition;
    if (!!window) {
      verticalPosition = PopupUtils.updateVerticalPosition(
        rect,
        height,
        this.model.verticalPosition,
        this.model.showPointer,
        window.innerHeight
      );
    }
    this.popupDirection = PopupUtils.calculatePopupDirection(
      verticalPosition,
      this.model.horizontalPosition
    );
    const pos = PopupUtils.calculatePosition(
      rect,
      height,
      width,
      verticalPosition,
      this.model.horizontalPosition,
      this.showPointer
    );

    if (!!window) {
      const newVerticalDimensions = PopupUtils.updateVerticalDimensions(
        pos.top,
        height,
        window.innerHeight
      );
      if (!!newVerticalDimensions) {
        this.height = newVerticalDimensions.height + "px";
        pos.top = newVerticalDimensions.top;
      }
    }
    this.left = pos.left + "px";
    this.top = pos.top + "px";

    if (this.showPointer) {
      this.pointerTarget = PopupUtils.calculatePointerTarget(
        rect,
        pos.top,
        pos.left,
        verticalPosition,
        this.model.horizontalPosition
      );
    }
    this.pointerTarget.top += "px";
    this.pointerTarget.left += "px";
  }
  private focusFirstInput() {
    setTimeout(() => {
      var el = this.container.querySelector(FOCUS_INPUT_SELECTOR);
      if (!!el) (<HTMLElement>el).focus();
      else (<HTMLElement>this.container.children[0]).focus();
    }, 100);
  }
  public clickOutside() {
    if (this.isModal) {
      return;
    }
    this.model.isVisible = false;
  }
  public cancel() {
    this.model.onCancel();
    this.model.isVisible = false;
  }
  public apply() {
    if (!!this.model.onApply && !this.model.onApply()) return;
    this.model.isVisible = false;
  }
  public get cancelButtonText() {
    return surveyLocalization.getString("modalCancelButtonText");
  }
  public get applyButtonText() {
    return surveyLocalization.getString("modalApplyButtonText");
  }
  public dispose() {
    super.dispose();
    this.model.onVisibilityChanged = undefined;
  }
  public createPopupContainer() {
    const container: HTMLElement = document.createElement("div");
    this.container = container;
  }
  public mountPopupContainer() {
    document.body.appendChild(this.container);
  }
  public initializePopupContainer() {
    this.createPopupContainer();
    this.mountPopupContainer();
  }
  public destroyPopupContainer() {
    this.container.remove();
    this.container = undefined;
  }
}
