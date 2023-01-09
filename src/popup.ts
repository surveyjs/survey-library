import { Base, EventBase } from "./base";
import { property } from "./jsonobject";
import { VerticalPosition, HorizontalPosition, PositionMode } from "./utils/popup";

export interface IPopupOptionsBase {
  onHide?: () => void;
  onShow?: () => void;
  onApply?: () => boolean;
  onCancel?: () => void;
  cssClass?: string;
  title?: string;
  verticalPosition?: VerticalPosition;
  horizontalPosition?: HorizontalPosition;
  showPointer?: boolean;
  isModal?: boolean;
  displayMode?: "popup" | "overlay";
}
export interface IDialogOptions extends IPopupOptionsBase{
  componentName: string;
  data: any;
  onApply: () => boolean;
}
export interface IPopupModel<T = any> extends IDialogOptions {
  contentComponentName: string;
  contentComponentData: T;
}

export class PopupModel<T = any> extends Base {
  public setWidthByTarget: boolean;
  public focusFirstInputSelector = "";

  @property() contentComponentName: string;
  @property() contentComponentData: T;
  @property({ defaultValue: "bottom" }) verticalPosition: VerticalPosition;
  @property({ defaultValue: "left" }) horizontalPosition: HorizontalPosition;
  @property({ defaultValue: false }) showPointer: boolean;
  @property({ defaultValue: false }) isModal: boolean;
  @property({ defaultValue: true }) isFocusedContent: boolean;
  @property({ defaultValue: () => { } }) onCancel: () => void;
  @property({ defaultValue: () => { return true; } }) onApply: () => boolean;
  @property({ defaultValue: () => { } }) onHide: () => void;
  @property({ defaultValue: () => { } }) onShow: () => void;
  @property({ defaultValue: "" }) cssClass: string;
  @property({ defaultValue: "" }) title: string;
  @property({ defaultValue: "popup" }) displayMode: "popup" | "overlay";
  @property({ defaultValue: "flex" }) positionMode: PositionMode;

  public onVisibilityChanged: EventBase<PopupModel> = this.addEvent<PopupModel>();
  public onRecalculatePosition: EventBase<Base> = this.addEvent<Base>();

  constructor(
    contentComponentName: string,
    contentComponentData: T,
    verticalPosition: VerticalPosition = "bottom",
    horizontalPosition: HorizontalPosition = "left",
    showPointer: boolean = true,
    isModal: boolean = false,
    onCancel = () => { },
    onApply = () => { return true; },
    onHide = () => { },
    onShow = () => { },
    cssClass: string = "",
    title: string = ""
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
    this.title = title;
  }
  public get isVisible(): boolean {
    return this.getPropertyValue("isVisible", false);
  }
  public set isVisible(value: boolean) {
    if (this.isVisible === value) {
      return;
    }
    this.setPropertyValue("isVisible", value);
    this.onVisibilityChanged.fire(this, { model: this, isVisible: value });
    if (this.isVisible) {
      const innerModel = (this.contentComponentData as any)["model"];
      innerModel && innerModel.refresh && innerModel.refresh();
      this.onShow();
    } else {
      this.onHide();
    }
  }
  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
  public recalculatePosition(isResetHeight: boolean): void {
    this.onRecalculatePosition.fire(this, { isResetHeight: isResetHeight });
  }
}

export function createDialogOptions(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  onHide = () => { },
  onShow = () => { },
  cssClass?: string,
  title?: string,
  displayMode: "popup" | "overlay" = "popup"): IDialogOptions {
  return <IDialogOptions>{
    componentName: componentName,
    data: data,
    onApply: onApply,
    onCancel: onCancel,
    onHide: onHide,
    onShow: onShow,
    cssClass: cssClass,
    title: title,
    displayMode: displayMode
  };
}