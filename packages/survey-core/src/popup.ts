import { Base, EventBase } from "./base";
import { IAction } from "./actions/action";
import { property } from "./jsonobject";
import { VerticalPosition, HorizontalPosition, PositionMode } from "./utils/popup";
import { ConsoleWarnings } from "./console-warnings";

export interface IPopupOptionsBase {
  onHide?: () => void;
  onShow?: () => void;
  onCancel?: () => void;
  onDispose?: () => void;
  cssClass?: string;
  title?: string;
  verticalPosition?: VerticalPosition;
  horizontalPosition?: HorizontalPosition;
  showPointer?: boolean;
  isModal?: boolean;
  canShrink?: boolean;
  displayMode?: "popup" | "overlay";
}
export interface IDialogOptions extends IPopupOptionsBase {
  componentName: string;
  data: any;
  onApply: () => boolean;
  isFocusedContent?: boolean;
}

export class PopupModel<T = any> extends Base implements IPopupOptionsBase {
  public setWidthByTarget: boolean;
  public focusFirstInputSelector = "";
  public locale: string;
  public onCancel: () => void = () => { };
  public onApply: () => boolean = () => { return true; };
  public onHide: () => void = () => { };
  public onShow: () => void = () => { };
  public onDispose: () => void = () => { };

  @property() contentComponentName: string;
  @property() contentComponentData: T;
  @property({ defaultValue: "bottom" }) verticalPosition: VerticalPosition;
  @property({ defaultValue: "left" }) horizontalPosition: HorizontalPosition;
  @property({ defaultValue: true }) showPointer: boolean;
  @property({ defaultValue: false }) isModal: boolean;
  @property({ defaultValue: true }) canShrink: boolean;
  @property({ defaultValue: true }) isFocusedContent: boolean;
  @property({ defaultValue: true }) isFocusedContainer: boolean;
  @property({ defaultValue: "" }) cssClass: string;
  @property({ defaultValue: "" }) title: string;
  @property({ defaultValue: "auto" }) overlayDisplayMode: "auto" | "tablet-dropdown-overlay" | "dropdown-overlay" | "plain";
  @property({ defaultValue: "popup" }) displayMode: "popup" | "overlay";
  @property({ defaultValue: "flex" }) positionMode: PositionMode;

  public onVisibilityChanged: EventBase<PopupModel> = this.addEvent<PopupModel>();
  public onFooterActionsCreated: EventBase<Base> = this.addEvent<Base>();
  public onRecalculatePosition: EventBase<Base> = this.addEvent<Base>();

  private refreshInnerModel(): void {
    const innerModel = (this.contentComponentData as any)["model"];
    innerModel && innerModel.refresh && innerModel.refresh();
  }

  constructor(
    contentComponentName: string,
    contentComponentData: T,
    option1?: IPopupOptionsBase | any,
    option2?: any
  ) {
    super();
    this.contentComponentName = contentComponentName;
    this.contentComponentData = contentComponentData;
    if (!!option1 && typeof option1 === "string") {
      this.verticalPosition = option1 as VerticalPosition;
      this.horizontalPosition = option2;
    } else if (!!option1) {
      const popupOptions = option1 as IPopupOptionsBase;
      for (var key in popupOptions) {
        (<any>this)[key] = (<any>popupOptions)[key];
      }
    }
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
  }
  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
  public show(): void {
    if (!this.isVisible)
      this.isVisible = true;
  }
  public hide(): void {
    if (this.isVisible)
      this.isVisible = false;
  }
  public recalculatePosition(isResetHeight: boolean): void {
    this.onRecalculatePosition.fire(this, { isResetHeight: isResetHeight });
  }
  public updateFooterActions(footerActions: Array<IAction>): Array<IAction> {
    const options = { actions: footerActions };
    this.onFooterActionsCreated.fire(this, options);
    return options.actions;
  }
  public updateDisplayMode(menuType: "dropdown" | "popup" | "overlay"): void {
    switch (menuType) {
      case "dropdown": {
        this.displayMode = "popup";
        break;
      }
      case "popup": {
        this.displayMode = "overlay";
        this.overlayDisplayMode = "tablet-dropdown-overlay";
        break;
      }
      case "overlay": {
        this.displayMode = "overlay";
        this.overlayDisplayMode = "dropdown-overlay";
        break;
      }
    }
  }
  public onHiding(): void {
    this.refreshInnerModel();
    this.onHide();
  }
  public dispose(): void {
    super.dispose();
    this.onDispose();
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
  ConsoleWarnings.warn("The `showModal()` and `createDialogOptions()` methods are obsolete. Use the `showDialog()` method instead.");

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