import { ILocalizableOwner, LocalizableString } from "../localizablestring";
import { Base } from "../base";
import { property } from "../jsonobject";
import { actionModeType, IAction } from "./action-interfaces";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { ActionBarCssClasses, defaultActionBarCss } from "./default-action-bar-css";

export abstract class BaseAction extends Base implements IAction {
  items?: IAction[];
  private static renderedId = 1;
  private static getNextRendredId(): number { return BaseAction.renderedId++; }
  private cssClassesValue: any;
  private rendredIdValue = BaseAction.getNextRendredId();
  private ownerValue: ILocalizableOwner;
  @property() tooltip: string;
  @property() showTitle: boolean;
  @property() innerCss: string;
  @property() active: boolean;
  @property() pressed: boolean;
  private _data: any;
  public get data() {
    return this._data;
  }
  public set data(val: any) {
    this._data = val;
  }
  @property() popupModel: any;
  @property() needSeparator: boolean;
  @property() template: string;
  @property({ defaultValue: "large" }) mode: actionModeType;
  @property() visibleIndex: number;
  @property() disableTabStop: boolean;
  @property() disableShrink: boolean;
  @property() disableHide: boolean;
  @property({ defaultValue: false }) needSpace: boolean;
  @property() ariaChecked: boolean;
  @property() ariaExpanded: boolean;
  @property() ariaLabelledBy: string;
  @property({ defaultValue: "button" }) ariaRole: string;
  private idValue: string;
  public get id(): string { return this.getId(); }
  public set id(val: string) { this.setId(val); }
  protected getId(): string { return this.idValue; }
  protected setId(val: string): void { this.idValue = val; }
  @property() iconName: string;
  @property({ defaultValue: 24 }) iconSize: number | string;
  @property() markerIconName: string;
  @property() css?: string;
  minDimension: number;
  maxDimension: number;
  public addVisibilityChangedCallback(callback: (action: BaseAction) => void) {}
  public removeVisibilityChangedCallback(callback: (action: BaseAction) => void) {}
  public get renderedId(): number { return this.rendredIdValue; }
  public get owner(): ILocalizableOwner { return this.ownerValue; }
  public set owner(val: ILocalizableOwner) {
    if (val !== this.owner) {
      this.ownerValue = val;
      this.locStrsChanged();
    }
  }
  public get visible(): boolean {
    return this.getVisible();
  }
  public set visible(val: boolean) {
    this.setVisible(val);
  }
  public get enabled() {
    return this.getEnabled();
  }
  public set enabled(val: boolean) {
    this.setEnabled(val);
  }
  public get component(): string {
    return this.getComponent();
  }
  public set component(val: string) {
    this.setComponent(val);
  }
  public get locTitle(): LocalizableString {
    return this.getLocTitle();
  }
  public set locTitle(val: LocalizableString) {
    this.setLocTitle(val);
  }
  public get title(): string {
    return this.getTitle();
  }
  public set title(val: string) {
    this.setTitle(val);
  }
  public get titles(): { [locale: string]: string } {
    return this.locTitle.getJson();
  }
  public set titles(val: { [locale: string]: string }) {
    this.locTitle.setJson(val);
  }
  public set cssClasses(val: ActionBarCssClasses) {
    this.cssClassesValue = val;
  }
  public get cssClasses(): Readonly<ActionBarCssClasses> {
    return this.cssClassesValue || defaultActionBarCss;
  }
  public get isVisible() {
    return this.visible && this.mode !== "popup" && this.mode !== "removed";
  }
  public get disabled(): boolean {
    return this.enabled !== undefined && !this.enabled;
  }
  public get canShrink() {
    return !this.disableShrink && !!this.iconName;
  }
  public get hasTitle(): boolean {
    return (
      ((this.mode != "small" &&
        (this.showTitle || this.showTitle === undefined)) ||
        !this.iconName) &&
      !!this.title
    );
  }
  public get hasSubItems(): boolean {
    return !!this.items && this.items.length > 0;
  }
  public getActionBarItemTitleCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.itemTitle)
      .append(this.cssClasses.itemTitleWithIcon, !!this.iconName)
      .toString();
  }
  public getActionBarItemCss(): string {
    const hasTitle = this.hasTitle;
    return new CssClassBuilder()
      .append(this.cssClasses.item)
      .append(this.cssClasses.itemWithTitle, hasTitle)
      .append(this.cssClasses.itemAsIcon, !hasTitle)
      .append(this.cssClasses.itemActive, !!this.active)
      .append(this.cssClasses.itemPressed, !!this.pressed)
      .append(this.innerCss)
      .toString();
  }
  public getActionRootCss(): string {
    return new CssClassBuilder()
      .append("sv-action")
      .append(this.css)
      .append("sv-action--space", this.needSpace)
      .append("sv-action--hidden", !this.isVisible)
      .toString();
  }
  public getTooltip(): string {
    return this.tooltip || this.title;
  }
  public getIsTrusted(args: any): boolean {
    if (!!args.originalEvent) {
      return args.originalEvent.isTrusted;
    }
    return args.isTrusted;
  }
  public showPopup(): void {
    if (!!this.popupModel) {
      this.popupModel.show();
    }
  }
  public hidePopup(): void {
    if (!!this.popupModel) {
      this.popupModel.hide();
    }
  }

  @property({ defaultValue: false }) isPressed: boolean;
  @property({ defaultValue: false }) isHovered: boolean;

  private showPopupTimeout: any;
  private hidePopupTimeout: any;
  private clearPopupTimeouts() {
    if (this.showPopupTimeout) clearTimeout(this.showPopupTimeout);
    if (this.hidePopupTimeout) clearTimeout(this.hidePopupTimeout);
  }
  public showPopupDelayed(delay: number) {

    this.clearPopupTimeouts();
    this.showPopupTimeout = setTimeout(() => {
      this.clearPopupTimeouts();

      this.showPopup();

    }, delay);
  }

  public hidePopupDelayed(delay: number) {
    if (this.popupModel?.isVisible) {

      this.clearPopupTimeouts();
      this.hidePopupTimeout = setTimeout(() => {
        this.clearPopupTimeouts();

        this.hidePopup();
        this.isHovered = false;

      }, delay);
    } else {
      this.clearPopupTimeouts();
      this.isHovered = false;
    }
  }

  protected abstract getEnabled(): boolean;
  protected abstract setEnabled(val: boolean): void;
  protected abstract getVisible(): boolean;
  protected abstract setVisible(val: boolean): void;
  protected abstract getLocTitle(): LocalizableString;
  protected abstract setLocTitle(val: LocalizableString): void;
  protected abstract getTitle(): string;
  protected abstract setTitle(val: string): void;
  protected abstract getComponent(): string;
  protected abstract setComponent(val: string): void;
}
