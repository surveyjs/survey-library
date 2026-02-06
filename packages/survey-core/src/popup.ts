import { Base, EventBase } from "./base";
import { IAction } from "./actions/action";
import { property } from "./jsonobject";
import { VerticalPosition, HorizontalPosition, PositionMode } from "./utils/popup";
import { calculateIsTablet, IsTouch } from "./utils/devices";

type DisplayPopupMode = "modal-popup" | "modal-overlay" | "menu-overlay" | "menu-popup-overlay" | "menu-popup";
export interface IPopupOptionsBase {
  onBlur?: () => void;
  onHide?: () => void;
  /**
   * A callback function executed when the dialog is opened.
   */
  onShow?: () => void;
  /**
   * A callback function executed when users click the Cancel button in the dialog.
   */
  onCancel?: () => void;
  onDispose?: () => void;
  getTargetCallback?: (container: HTMLElement) => HTMLElement;
  getAreaCallback?: (container: HTMLElement) => HTMLElement;
  /**
   * A CSS class to apply to the root element of the dialog for custom styling.
   */
  cssClass?: string;
  /**
   * The dialog's title.
   */
  title?: string;
  verticalPosition?: VerticalPosition;
  horizontalPosition?: HorizontalPosition;
  showPointer?: boolean;
  isModal?: boolean;
  canShrink?: boolean;
  displayMode?: "popup" | "overlay";
}
/**
 * An interface used to configure the content and behavior of a modal dialog displayed via the [`showDialog()`](https://surveyjs.io/form-library/documentation/api-reference/settings#showDialog) method.
 *
 * [View Demo](https://surveyjs.io/survey-creator/examples/add-modal-property-editor-to-property-grid/ (linkStyle))
 */
export interface IDialogOptions extends IPopupOptionsBase {
  /**
   * The name of the component to render inside the dialog.
   *
   * This component should be registered in the component collection used by the application (e.g., in `ReactElementFactory` for React and HTML/JS/CSS, `AngularComponentFactory` for Angular, or `app.component()` for Vue.js).
   */
  componentName: string;
  /**
   * An object with component props.
   */
  data: any;
  /**
   * A callback function executed when users click the Apply button in the dialog.
   *
   * This function should return `true` to close the dialog or `false` to keep it open (for example, if validation fails).
   * @returns `true` to close the dialog or `false` to keep it open.
   * @see onCancel
   */
  onApply: () => boolean;
  isFocusedContent?: boolean;
  showCloseButton?: boolean;
}

export class PopupModel<T = any> extends Base implements IPopupOptionsBase {
  public setWidthByTarget: boolean;
  public focusFirstInputSelector = "";
  public locale: string;
  public onCancel: () => void = () => { };
  public onApply: () => boolean = () => { return true; };
  public onHide: () => void = () => { };
  public onShow: () => void = () => { };
  public onBlur: () => void = () => { };
  public onDispose: () => void = () => { };
  public getTargetCallback?: (container: HTMLElement) => HTMLElement;
  public getAreaCallback?: (container: HTMLElement) => HTMLElement;

  @property() contentComponentName: string;
  @property() contentComponentData: T;
  @property({ defaultValue: "bottom" }) verticalPosition: VerticalPosition;
  @property({ defaultValue: "left" }) horizontalPosition: HorizontalPosition;
  @property({ defaultValue: true }) showPointer: boolean;
  @property({ defaultValue: false }) showCloseButton: boolean;
  @property({ defaultValue: false }) isModal: boolean;
  @property({ defaultValue: true }) canShrink: boolean;
  @property({ defaultValue: true }) isFocusedContent: boolean;
  @property({ defaultValue: true }) isFocusedContainer: boolean;
  @property({ defaultValue: "" }) cssClass: string;
  @property({ defaultValue: "" }) title: string;
  @property({ defaultValue: "auto" }) overlayDisplayMode: "auto" | "tablet-dropdown-overlay" | "dropdown-overlay" | "plain";
  @property({ defaultValue: "popup" }) displayMode: "popup" | "overlay";
  @property({ defaultValue: "flex" }) positionMode: PositionMode;
  @property({ defaultValue: false }) isVisible: boolean;

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
    options?: IPopupOptionsBase
  ) {
    super();
    this.contentComponentName = contentComponentName;
    this.contentComponentData = contentComponentData;
    if (!!options) {
      for (var key in options) {
        (<any>this)[key] = (<any>options)[key];
      }
    }
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "isVisible") {
      this.onVisibilityChanged.fire(this, { model: this, isVisible: newValue });
    }
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

  public getDisplayMode(): DisplayPopupMode {
    if (this.isModal) {
      return this.displayMode === "popup" ? "modal-popup" : "modal-overlay";
    } else {
      if (this.displayMode === "popup") {
        return "menu-popup";
      } else {
        let result: DisplayPopupMode;
        switch(this.overlayDisplayMode) {
          case "plain": {
            result = "menu-popup";
            break;
          }
          case "dropdown-overlay": {
            result = "menu-overlay";
            break;
          }
          case "tablet-dropdown-overlay": {
            result = "menu-popup-overlay";
            break;
          }
          case "auto": {
            if (!IsTouch) {
              result = "menu-popup"; // desktop
            } else {
              result = "menu-popup-overlay"; //tablet
            }
            break;
          }
        }
        return result;
      }
    }
  }

  public updateDisplayMode(menuType: "dropdown" | "popup" | "overlay"): boolean {
    let newDisplayMode;
    let newOverlayDisplayMode;

    switch(menuType) {
      case "dropdown": {
        newDisplayMode = "popup";
        newOverlayDisplayMode = "auto";
        break;
      }
      case "popup": {
        newDisplayMode = "overlay";
        newOverlayDisplayMode = "tablet-dropdown-overlay";
        break;
      }
      case "overlay": {
        newDisplayMode = "overlay";
        newOverlayDisplayMode = "dropdown-overlay";
        break;
      }
    }

    if (this.displayMode !== newDisplayMode) {
      const isDropdown = menuType === "dropdown";
      this.setWidthByTarget = isDropdown;
      this.isFocusedContent = !isDropdown;
    }

    if (this.displayMode !== newDisplayMode || this.overlayDisplayMode !== newOverlayDisplayMode) {
      this.displayMode = newDisplayMode;
      this.overlayDisplayMode = newOverlayDisplayMode;
      return true;
    } else {
      return false;
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
