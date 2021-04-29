import { Base } from "./base";
import { property } from "./jsonobject";
import { surveyLocalization } from "./surveyStrings";
import {
  PopupUtils,
  VerticalPosition,
  HorizontalPosition,
  IPosition,
} from "./utils/popup";

export class PopupModel extends Base {
  @property() contentComponentName: string;
  @property() contentComponentData: any;
  @property({ defaultValue: "bottom" }) verticalPosition: VerticalPosition;
  @property({ defaultValue: "left" }) horizontalPosition: HorizontalPosition;
  @property({ defaultValue: false }) showPointer: boolean;
  @property({ defaultValue: false }) isModal: boolean;
  @property({ defaultValue: () => {} }) onCancel: () => void;
  @property({ defaultValue: () => {} }) onApply: () => void;
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
    onApply = () => {},
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

  //@property({ defaultValue: false }) isVisible: boolean;
  public get isVisible(): boolean {
    return this.getPropertyValue("isVisible", false);
  }
  public set isVisible(value: boolean) {
    if (this.isVisible === value) {
      return;
    }

    this.setPropertyValue("isVisible", value);

    this.onVisibilityChanged && this.onVisibilityChanged();

    if (this.isVisible) {
      this.onShow();
    } else {
      this.onHide();
    }
  }

  public toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
  public onVisibilityChanged: () => void;
}

export class PopupViewModel extends Base {
  // PopupBase
  @property({ defaultValue: 0 }) top: string | number;
  @property({ defaultValue: 0 }) left: string | number;
  @property({ defaultValue: "left" }) popupDirection: string;
  @property({ defaultValue: { left: "0px", top: "0px" } })
  pointerTarget: IPosition;
  public container: HTMLElement;

  constructor(public model: PopupModel, public targetElement?: HTMLElement) {
    super();
    this.model.onVisibilityChanged = () => {
      this.onIsVisibleChanged(this.isVisible);
    };
  }
  //
  public get isVisible(): boolean {
    return this.model.isVisible;
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
    var css = this.model.cssClass;
    if (this.isModal) {
      css += " sv-popup--modal";
    } else if (this.showPointer) {
      css += " sv-popup--show-pointer";
      css += ` sv-popup--${this.popupDirection}`;
    }

    return css;
  }

  private onIsVisibleChanged(isVisible: boolean) {
    if (isVisible) {
      if (this.isModal) {
        setTimeout(() => {
          this.setupModalPopup();
        }, 1);
      } else {
        setTimeout(() => {
          this.setupModelessPopup();
        }, 1);
      }
    }
  }

  private setupModalPopup() {
    const background = <HTMLElement>this.container.children[0];
    const container = <HTMLElement>background.children[0];
    this.left = (background.offsetWidth - container.offsetWidth) / 2 + "px";
    this.top = (background.offsetHeight - container.offsetHeight) / 2 + "px";
  }
  private setupModelessPopup() {
    const rect = this.targetElement.getBoundingClientRect();
    const background = <HTMLElement>this.container.children[0];
    const popupContainer = <HTMLElement>background.children[0];
    this.popupDirection = PopupUtils.calculatePopupDirection(
      this.model.verticalPosition,
      this.model.horizontalPosition
    );
    //AM: hang up: page selector inside 'test survey' page causes infinite loop here
    //do {
    var height = popupContainer.offsetHeight;
    var width = popupContainer.offsetWidth;
    const pos = PopupUtils.calculatePosition(
      rect,
      height,
      width,
      this.model.verticalPosition,
      this.model.horizontalPosition,
      this.showPointer
    );
    this.left = pos.left + "px";
    this.top = pos.top + "px";

    if (this.showPointer) {
      this.pointerTarget = PopupUtils.calculatePointerTarget(
        rect,
        pos.top,
        pos.left,
        this.model.verticalPosition,
        this.model.horizontalPosition
      );
    }
    this.pointerTarget.top += "px";
    this.pointerTarget.left += "px";
    //} while (
    //  popupContainer.offsetWidth != width ||
    //  popupContainer.offsetHeight != height
    //);
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
    this.model.onApply();
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

  public initializePopupContainer() {
    const container: HTMLElement = document.createElement("div");
    this.container = container;
    document.body.appendChild(this.container);
  }
  public destroyPopupContainer() {
    this.container.remove();
    this.container = undefined;
  }
}
