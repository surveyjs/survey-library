import { ILocalizableOwner, LocalizableString } from "../localizablestring";
import { Base, ComputedUpdater } from "../base";
import { surveyLocalization } from "../surveyStrings";
import { property } from "../jsonobject";
import { IListModel, ListModel } from "../list";
import { IPopupOptionsBase, PopupModel } from "../popup";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { defaultActionBarCss } from "./container";

export type actionModeType = "large" | "small" | "popup" | "removed";

/**
 * An action item.
 *
 * Action items are used in the Toolbar, matrix rows, titles of pages, panels, questions, and other survey elements.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
 */
export interface IAction {
  /**
   * A unique action item identifier.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   */
  id?: string;
  /**
   * Specifies the action item's visibility.
   * @see enabled
   * @see active
   */
  visible?: boolean | ComputedUpdater<boolean>;
  /**
   * The action item's title.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   * @see showTitle
   * @see disableShrink
   */
  title?: string;
  locTitle?: LocalizableString;
  locTitleName?: string;
  /**
   * The action item's tooltip.
   */
  tooltip?: string;
  locTooltipName?: string;
  /**
   * Specifies whether users can interact with the action item.
   * @see active
   * @see visible
   */
  enabled?: boolean | ComputedUpdater<boolean>;
  enabledIf?: () => boolean;
  /**
   * Specifies the visibility of the action item's title.
   * @see title
   * @see disableShrink
   */
  showTitle?: boolean;
  /**
   * A function that is executed when users click the action item.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   */
  action?: (context?: any) => void;
  onFocus?: (isMouse: boolean, event: any) => void;
  /**
   * One or several CSS classes that you want to apply to the outer `<div>` element.
   *
   * In the markup, an action item is rendered as an `<input>` wrapped in a `<div>`. The `css` property applies classes to the `<div>`.
   *
   * To apply several classes, separate them with a space character: `"myclass1 myclass2"`.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   * @see innerCss
   */
  css?: string;
  /**
   * One or several CSS classes that you want to apply to the inner `<input>` element.
   *
   * In the markup, an action item is rendered as an `<input>` wrapped in a `<div>`. The `innerCss` property applies classes to the `<input>`.
   *
   * To apply several classes, separate them with a space character: `"myclass1 myclass2"`.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   * @see css
   */
  innerCss?: string;
  /**
   * The action item's data object. Use it to pass required data to a custom template or component.
   */
  data?: any;
  popupModel?: any; //TODO: temp, use data instead
  needSeparator?: boolean; //TODO: temp
  /**
   * Specifies whether the action item is active.
   *
   * Use this property as a flag to specify different action item appearances in different states.
   * @see enabled
   * @see visible
   */
  active?: boolean;
  pressed?: boolean;
  /**
   * Specifies the name of a template used to render the action item.
   * @see component
   */
  template?: string;
  /**
   * Specifies the name of a component used to render the action item.
   */
  component?: string;
  /**
   * The action item's icon name.
   * @see iconSize
   */
  iconName?: string;
  /**
   * The action item's icon size in pixels.
   * @see iconName
   */
  iconSize?: number | string;
  /**
   * The action item's location in a matrix question's row.
   *
   * The following values are available:
   *
   * - `"start"` - The action item is located at the beginning of the row.
   * - `"end"` - The action is located at the end of the row.
   */
  location?: string;
  /**
   * Set this property to `true` if you want to disable keyboard navigation for the action item (sets the `tabIndex` attribute to -1).
   */
  disableTabStop?: boolean;

  /**
   * Set this property to `true` if you want the item's `title` to be always visible.
   * If you set it to `false`, the `title` hides when the screen space is limited, and the item displays only the icon.
   * @see title
   * @see iconName
   */
  disableShrink?: boolean;
  disableHide?: boolean;
  mode?: actionModeType;
  /**
   * A number that specifies the action's position relative to other actions.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   */
  visibleIndex?: number;
  needSpace?: boolean;
  ariaChecked?: boolean;
  ariaExpanded?: boolean;
  ariaRole?: string;
  elementId?: string;
  items?: Array<IAction>;
  markerIconName?: string;
  markerIconSize?: number;
  showPopup?: () => void;
  hidePopup?: () => void;
}

export interface IActionDropdownPopupOptions extends IListModel, IPopupOptionsBase {
}
export function createDropdownActionModel(actionOptions: IAction, dropdownOptions: IActionDropdownPopupOptions, locOwner?: ILocalizableOwner): Action {
  dropdownOptions.locOwner = locOwner;
  return createDropdownActionModelAdvanced(actionOptions, dropdownOptions, dropdownOptions);
}
export function createDropdownActionModelAdvanced(actionOptions: IAction, listOptions: IListModel, popupOptions?: IPopupOptionsBase): Action {
  const originalSelectionChanged = listOptions.onSelectionChanged;
  listOptions.onSelectionChanged = (item: Action, ...params: any[]) => {
    if (newAction.hasTitle) { newAction.title = item.title; }
    if (originalSelectionChanged) {
      originalSelectionChanged(item, params);
    }
  };
  const popupModel: PopupModel = createPopupModelWithListModel(listOptions, popupOptions);

  const newActionOptions = Object.assign({}, actionOptions, {
    component: "sv-action-bar-item-dropdown",
    popupModel: popupModel,
    action: (action: IAction, isUserAction: boolean) => {
      !!(actionOptions.action) && actionOptions.action();
      popupModel.isFocusedContent = popupModel.isFocusedContent || !isUserAction;
      popupModel.show();
    },
  });
  const newAction: Action = new Action(newActionOptions);
  newAction.data = popupModel.contentComponentData?.model;

  return newAction;
}

export function createPopupModelWithListModel(listOptions: IListModel, popupOptions: IPopupOptionsBase): PopupModel {
  const listModel: ListModel = new ListModel(listOptions as any);
  listModel.onSelectionChanged = (item: Action) => {
    if (listOptions.onSelectionChanged) {
      listOptions.onSelectionChanged(item);
    }
    popupModel.hide();
  };

  const _popupOptions = popupOptions || {};
  _popupOptions.onDispose = () => { listModel.dispose(); };
  const popupModel: PopupModel = new PopupModel("sv-list", { model: listModel }, _popupOptions);
  popupModel.isFocusedContent = listModel.showFilter;
  popupModel.onShow = () => {
    if (!!_popupOptions.onShow) _popupOptions.onShow();
    listModel.scrollToSelectedItem();
  };

  return popupModel;
}

export function getActionDropdownButtonTarget(container: HTMLElement): HTMLElement {
  return container?.previousElementSibling as HTMLElement;
}

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
  @property() data: any;
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
  @property({ defaultValue: "button" }) ariaRole: string;
  public id: string;
  public removePriority: number;
  @property() iconName: string;
  @property({ defaultValue: 24 }) iconSize: number;
  @property() markerIconName: string;
  @property() markerIconSize: number = 16;
  @property() css?: string
  minDimension: number;
  maxDimension: number;

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
  public set cssClasses(val: any) {
    this.cssClassesValue = val;
  }
  public get cssClasses() {
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
    return new CssClassBuilder()
      .append(this.cssClasses.item)
      .append(this.cssClasses.itemWithTitle, this.hasTitle)
      .append(this.cssClasses.itemAsIcon, !this.hasTitle)
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

export class Action extends BaseAction implements IAction, ILocalizableOwner {
  private locTitleValue: LocalizableString;
  public updateCallback: (isResetInitialized: boolean) => void;
  private raiseUpdate(isResetInitialized: boolean = false) {
    this.updateCallback && this.updateCallback(isResetInitialized);
  }
  constructor(public innerItem: IAction) {
    super();
    this.locTitle = !!innerItem ? innerItem["locTitle"] : null;
    //Object.assign(this, item) to support IE11
    if (!!innerItem) {
      for (var key in innerItem) {
        if (key === "locTitle" || key === "title" && !!this.locTitle && !!this.title) continue;
        (<any>this)[key] = (<any>innerItem)[key];
      }
    }
    if (!!this.locTitleName) {
      this.locTitleChanged();
    }
    this.registerFunctionOnPropertyValueChanged("_title", () => {
      this.raiseUpdate(true);
    });
    this.locStrChangedInPopupModel();
  }
  private createLocTitle(): LocalizableString {
    return this.createLocalizableString("title", this, true);
  }
  public setSubItems(options: IListModel): void {
    this.markerIconName = "icon-next_16x16";
    this.component = "sv-list-item-group";
    this.items = [...options.items];
    const listOptions = Object.assign({}, options);
    listOptions.searchEnabled = false;
    const popupModel = createPopupModelWithListModel(
      listOptions,
      { horizontalPosition: "right", showPointer: false, canShrink: false }
    );
    popupModel.cssClass = "sv-popup-inner";
    this.popupModel = popupModel;
  }

  location?: string;
  @property() id: string;
  @property({
    defaultValue: true, onSet: (_, target: Action) => {
      target.raiseUpdate();
    }
  }) private _visible: boolean;
  @property({
    onSet: (_, target: Action) => {
      target.locTooltipChanged();
    }
  }) locTooltipName?: string;
  @property() private _enabled: boolean;
  @property() action: (context?: any, isUserAction?: boolean) => void;
  @property() onFocus: (isMouse: boolean, event: any) => void;
  @property() _component: string;
  @property() items: any;
  @property({
    onSet: (val, target) => {
      if (target.locTitleValue.text === val) return;
      target.locTitleValue.text = val;
    }
  }) _title: string;
  protected getLocTitle(): LocalizableString {
    return this.locTitleValue;
  }
  protected setLocTitle(val: LocalizableString): void {
    if (!val && !this.locTitleValue) {
      val = this.createLocTitle();
    }
    if (!!this.locTitleValue) {
      this.locTitleValue.onStringChanged.remove(this.locTitleChanged);
    }
    this.locTitleValue = val;
    this.locTitleValue.onStringChanged.add(this.locTitleChanged);
    this.locTitleChanged();
  }
  protected getTitle(): string {
    return this._title;
  }
  protected setTitle(val: string): void {
    this._title = val;
  }
  public get locTitleName(): string {
    return this.locTitle.localizationName;
  }
  public set locTitleName(val: string) {
    this.locTitle.localizationName = val;
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.locTooltipChanged();
    this.locStrChangedInPopupModel();
  }
  public doAction(args: any): boolean {
    const evt = !!args.originalEvent ? args.originalEvent : args;
    this.action(this, evt.isTrusted);
    evt.preventDefault();
    evt.stopPropagation();
    return true;
  }
  private isMouseDown: boolean;
  public doMouseDown() : void {
    this.isMouseDown = true;
  }
  public doFocus(args: any): void {
    if(!!this.onFocus) {
      const evt = !!args.originalEvent ? args.originalEvent : args;
      this.onFocus(this.isMouseDown, evt);
    }
    this.isMouseDown = false;
  }
  private locStrChangedInPopupModel(): void {
    if (!this.popupModel || !this.popupModel.contentComponentData || !this.popupModel.contentComponentData.model) return;
    const model = this.popupModel.contentComponentData.model;
    if (Array.isArray(model.actions)) {
      const actions: Array<any> = model.actions;
      actions.forEach(item => {
        if (!!(<any>item).locStrsChanged) {
          (<any>item).locStrsChanged();
        }
      });
    }
  }
  private locTitleChanged = () => {
    const val = this.locTitle.renderedHtml;
    this.setPropertyValue("_title", !!val ? val : undefined);
  }
  private locTooltipChanged(): void {
    if (!this.locTooltipName) return;
    this.tooltip = surveyLocalization.getString(this.locTooltipName, this.locTitle.locale);
  }

  //ILocalizableOwner
  getLocale(): string { return this.owner ? this.owner.getLocale() : ""; }
  getMarkdownHtml(text: string, name: string): string { return this.owner ? this.owner.getMarkdownHtml(text, name) : undefined; }
  getProcessedText(text: string): string { return this.owner ? this.owner.getProcessedText(text) : text; }
  getRenderer(name: string): string { return this.owner ? this.owner.getRenderer(name) : null; }
  getRendererContext(locStr: LocalizableString): any { return this.owner ? this.owner.getRendererContext(locStr) : locStr; }

  public setVisible(val: boolean): void {
    this._visible = val;
  }
  public getVisible(): boolean {
    return this._visible;
  }

  public enabledIf?: () => boolean;
  public setEnabled(val: boolean): void {
    this._enabled = val;
  }
  public getEnabled(): boolean {
    if (this.enabledIf) return this.enabledIf();
    return this._enabled;
  }
  public setComponent(val: string): void {
    this._component = val;
  }
  public getComponent(): string {
    return this._component;
  }
  public dispose(): void {
    this.updateCallback = undefined;
    this.action = undefined;
    super.dispose();
    if (this.popupModel) {
      this.popupModel.dispose();
    }
    if (!!this.locTitleValue) {
      this.locTitleValue.onStringChanged.remove(this.locTitleChanged);
      this.locTitleChanged = undefined;
    }
  }
}

export class ActionDropdownViewModel {
  private popupModel: any;
  private funcKey = "sv-dropdown-action";
  constructor(private item: Action) {
    this.setupPopupCallbacks();
  }
  private setupPopupCallbacks() {
    const popupModel = this.popupModel = this.item.popupModel;
    if (!popupModel) return;
    popupModel.registerPropertyChangedHandlers(["isVisible"], () => {
      if (!popupModel.isVisible) {
        this.item.pressed = false;
      } else {
        this.item.pressed = true;
      }
    }, this.funcKey);
  }
  private removePopupCallbacks() {
    if (!!this.popupModel) {
      this.popupModel.unregisterPropertyChangedHandlers(["isVisible"], this.funcKey);
    }
  }
  public dispose(): void {
    this.removePopupCallbacks();
  }
}
