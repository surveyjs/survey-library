import { Base } from "./base";
import { property } from "./jsonobject";
import { PopupUtils } from "./knockout/components/popup/popup-utils";
import { surveyLocalization } from "./surveyStrings";
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
  ) {}

  public toggleVisibility() {
    this.onToggleVisibility && this.onToggleVisibility();
  }
  public onToggleVisibility: () => void;
}

export class PopupBase extends Base {
  @property() top: string | number = 0;
  @property() left: string | number = 0;
  @property() popupDirection: string = "left";
  @property() pointerTarget: { top: string | number; left: string | number } = {
    left: "0px",
    top: "0px",
  };
  @property() isVisible: boolean = false;

  public container: HTMLElement;

  constructor(public model: PopupModel, public targetElement?: HTMLElement) {
    super();

    this.registerFunctionOnPropertyValueChanged("isVisible", () => {
      this.onIsVisibleChanged(this.isVisible);
    });

    this.model.onToggleVisibility = () => {
      this.isVisible = !this.isVisible;
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
      css += ` sv-popup--${this.popupDirection}`;
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
      setTimeout(() => {
        this.setupModalPopup();
      }, 1);
    } else {
      setTimeout(() => {
        this.setupModelessPopup();
      }, 1);
    }
  }
  private setupModalPopup() {
    const background = <HTMLElement>this.container.children[0];
    const container = <HTMLElement>this.container.children[0].children[0];
    this.left = (background.offsetWidth - container.offsetWidth) / 2 + "px";
    this.top = (background.offsetHeight - container.offsetHeight) / 2 + "px";
  }
  private setupModelessPopup() {
    const rect = this.targetElement.getBoundingClientRect();
    const popupContainer = <HTMLElement>this.container.children[0].children[0];
    this.popupDirection = PopupUtils.calculatePopupDirection(
      this.verticalPosition,
      this.horizontalPosition
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
    this.left = pos.left + "px";
    this.top = pos.top + "px";

    if (this.showPointer) {
      this.pointerTarget = PopupUtils.calculatePointerTarget(
        rect,
        pos.top,
        pos.left,
        this.verticalPosition,
        this.horizontalPosition
      );
    }
    this.pointerTarget.top = this.pointerTarget.top + "px";
    this.pointerTarget.left = this.pointerTarget.left + "px";

    //} while (
    //  popupContainer.offsetWidth != width ||
    //  popupContainer.offsetHeight != height
    //);
  }

  public clickOutside() {
    if (this.isModal) {
      return;
    }
    this.isVisible = false;
  }

  public cancel() {
    this.onCancel();
    this.isVisible = false;
  }

  public apply() {
    this.onApply();
    this.isVisible = false;
  }

  public get cancelButtonText() {
    return surveyLocalization.getString("modalCancelButtonText");
  }

  public get applyButtonText() {
    return surveyLocalization.getString("modalApplyButtonText");
  }
}
