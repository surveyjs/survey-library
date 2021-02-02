import { Base } from "./base";
import { property } from "./jsonobject";
import { PopupModel } from "./popup";

export interface IActionBarItem {
  /**
   * Unique string id
   */
  id: string;
  /**
   * Set this property to false to make the toolbar item invisible.
   */
  visible?: boolean;
  /**
   * Toolbar item title
   */
  title?: string;
  /**
   * Toolbar item tooltip
   */
  tooltip?: string;
  /**
   * Set this property to false to disable the toolbar item.
   */
  enabled?: boolean;
  /**
   * Set this property to false to hide the toolbar item title.
   */
  showTitle?: boolean;
  /**
   * A callback that calls on toolbar item click.
   */
  action?: (context?: any) => void;
  /**
   * Toolbar item css class
   */
  css?: string;
  /**
   * Toolbar inner element css class
   */
  innerCss?: string;
  /**
   * Toolbar item data object. Used as data for custom template or component rendering
   */
  data?: any;
  popupModel?: any; //TODO: temp, use data instead
  /**
   * Set this property to true to activate the toolbar item (page)
   */
  active?: (() => boolean) | boolean;
  /**
   * Toolbar item template name
   */
  template?: string;
  /**
   * Toolbar item component name
   */
  component?: string;
  /**
   * Toolbar item icon name
   */
  iconName?: string;
  /**
   * Toolbar item child items. Can be used as contianer for options
   */
  items?: any;
}

export class ActionBarItem extends Base implements IActionBarItem {
  constructor(item: IActionBarItem) {
    super();
    Object.assign(this, item);
  }
  @property() id: string;
  @property() visible?: boolean;
  @property() title?: string;
  @property() tooltip?: string;
  @property() enabled?: boolean;
  @property() showTitle?: boolean;
  @property() action?: (context?: any) => void;
  @property() css?: string;
  @property() innerCss?: string;
  @property() data?: any;
  @property() popupModel?: any;
  @property() active?: boolean | (() => boolean);
  @property() template?: string;
  @property() component?: string;
  @property() iconName?: string;
  @property() items?: any;
}

export class AdaptiveActionBarItemWrapper
  extends Base
  implements IActionBarItem {
  constructor(private owner: AdaptiveElement, private item: IActionBarItem) {
    super();
  }

  public get wrappedItem(): IActionBarItem {
    return this.item;
  }

  private unwrap<T>(value: T | (() => T)): T {
    if (typeof value !== "function") {
      return value;
    } else {
      return (<() => T>value)();
    }
  }
  public get id(): string {
    return this.item.id;
  }
  public get visible(): boolean {
    return this.unwrap(this.item.visible);
  }
  public get title(): string {
    return this.unwrap(this.item.title);
  }
  public get tooltip(): string {
    return this.unwrap(this.item.tooltip);
  }
  public get enabled(): boolean {
    return this.unwrap(this.item.enabled);
  }
  public get showTitle(): boolean {
    return (
      this.owner.showTitles &&
      (this.item.showTitle || this.item.showTitle === undefined)
    );
  }

  public action(context?: any) {
    this.item.action && this.item.action(context);
  }
  public get css(): string {
    return this.unwrap(this.item.css);
  }
  public get innerCss(): string {
    return this.unwrap(this.item.innerCss);
  }
  public get data(): any {
    return this.unwrap(this.item.data);
  }
  public get popupModel(): any {
    return this.unwrap(this.item.popupModel);
  }
  public get active(): boolean {
    return this.unwrap(this.item.active);
  }
  public get template(): string {
    return this.item.template;
  }
  public get component(): string {
    return this.unwrap(this.item.component);
  }
  public get iconName(): string {
    return this.unwrap(this.item.iconName);
  }
  public get items(): any {
    return this.unwrap(this.item.items);
  }
  @property({ defaultValue: true }) isVisible: boolean;
  @property() needSeparator: boolean;
}

export abstract class AdaptiveElement extends Base {
  @property({ defaultValue: true }) showTitles: boolean;

  protected dotsItem: AdaptiveActionBarItemWrapper; // (...) button

  constructor() {
    super();
    this.createNewArray("items");
    this.createNewArray("invisibleItems");
    this.dotsItem = new AdaptiveActionBarItemWrapper(
      this,
      new ActionBarItem({
        id: "dotsItem-id",
        component: "sv-action-bar-item-dropdown",
        css: "sv-dots",
        innerCss: "sv-dots__item",
        iconName: "icon-dots",
        showTitle: false,
        action: (item: any) => {
          this.dotsItemPopupModel.toggleVisibility();
        },

        popupModel: this.dotsItemPopupModel,
      })
    );
  }

  public get hasItems(): boolean {
    return (this.items || []).length > 0;
  }

  public get items(): Array<AdaptiveActionBarItemWrapper> {
    return this.getPropertyValue("items");
  }
  public set items(value: AdaptiveActionBarItemWrapper[]) {
    this.items.splice(0, this.items.length, ...(value || []));
  }
  public get invisibleItems(): AdaptiveActionBarItemWrapper[] {
    return this.getPropertyValue("invisibleItems");
  }
  public set invisibleItems(value: AdaptiveActionBarItemWrapper[]) {
    this.invisibleItems.splice(0, this.invisibleItems.length, ...(value || []));
  }

  public invisibleItemSelected(item: AdaptiveActionBarItemWrapper): void {
    if (!!item && typeof item.action === "function") {
      item.action();
    }
  }

  protected dotsItemPopupModel: PopupModel = new PopupModel("sv-list", {
    onItemSelect: (item: AdaptiveActionBarItemWrapper) => {
      this.invisibleItemSelected(item);
      this.dotsItemPopupModel.toggleVisibility();
    },
    items: () => this.invisibleItems,
  });

  public showFirstN(visibleItemsCount: number) {
    let leftItemsToShow = visibleItemsCount;
    const invisibleItems: AdaptiveActionBarItemWrapper[] = [];
    this.items.forEach((item) => {
      if (item === this.dotsItem) {
        return;
      }
      item.isVisible = leftItemsToShow > 0;
      if (leftItemsToShow <= 0) {
        invisibleItems.push(item);
      }
      leftItemsToShow--;
    });
    this.invisibleItems = invisibleItems;
    var index = this.items.indexOf(this.dotsItem);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    if (visibleItemsCount < this.items.length) {
      this.items.splice(visibleItemsCount, 0, this.dotsItem);
    }
  }

  public get canShrink(): boolean {
    return this.showTitles;
  }
  public readonly canGrow = true;
  public shrink() {
    this.showTitles = false;
  }
  public grow() {
    this.showTitles = true;
  }
}
