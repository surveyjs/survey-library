import { Base } from "./base";
import { property, propertyArray } from "./jsonobject";
import { ListModel } from "./list";
import { PopupModel } from "./popup";
import { unwrap } from "./utils/utils";

/**
 * Defines an individual action. Action items can be displayed in certain survey elements - in Toolbar (or action bar), in titles (of pages, panels, questions), in matrix rows (as 'expand details' or 'remove row' buttons), and etc.
 */
export interface IActionBarItem {
  /**
   * Unique string id
   */
  id: string;
  /**
   * Set this property to false to make the toolbar item invisible.
   */
  visible?: (() => boolean) | boolean;
  /**
   * Toolbar item title
   */
  title?: (() => string) | string;
  /**
   * Toolbar item tooltip
   */
  tooltip?: string;
  /**
   * Set this property to false to disable the toolbar item.
   */
  enabled?: (() => boolean) | boolean;
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
  css?: (() => string) | string;
  /**
   * Toolbar inner element css class
   */
  innerCss?: string;
  /**
   * Toolbar item data object. Used as data for custom template or component rendering
   */
  data?: any;
  popupModel?: any; //TODO: temp, use data instead
  needSeparator?: boolean; //TODO: temp
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
  iconName?: (() => string) | string;
  /**
   * Toolbar item child items. Can be used as contianer for options
   */
  items?: any;
  /**
   * Gets or sets an action's location in a matrix question's row.
   *
   * The following options are available:
   *
   * - `start` - An action is located at the beginning of a row.
   * - `end` - An action is located at the end of a row.
   */
  location?: string;
  visibleIndex?: number;
}

export class ActionBarItem extends Base implements IActionBarItem {
  constructor(item: IActionBarItem) {
    super();
    Object.assign(this, item);
  }
  location?: string;
  @property() id: string;
  @property() visible?: (() => boolean) | boolean;
  @property() title?: (() => string) | string;
  @property() tooltip?: string;
  @property() enabled?: (() => boolean) | boolean;
  @property() showTitle?: boolean;
  @property() action?: (context?: any) => void;
  @property() css?: (() => string) | string;
  @property() innerCss?: string;
  @property() data?: any;
  @property() popupModel?: any;
  @property() needSeparator?: boolean;
  @property() active?: boolean | (() => boolean);
  @property() template?: string;
  @property() component?: string;
  @property() iconName?: (() => string) | string;
  @property() items?: any;
  @property() visibleIndex?: number;
}

export class AdaptiveActionBarItemWrapper extends Base
  implements IActionBarItem {
  constructor(private owner: AdaptiveElement, private item: IActionBarItem) {
    super();
    this.needSeparator = item.needSeparator;
  }

  public get visibleIndex(): number {
    return this.item.visibleIndex;
  }

  public get wrappedItem(): IActionBarItem {
    return this.item;
  }

  public get id(): string {
    return this.item.id;
  }
  public get visible(): boolean {
    return unwrap(this.item.visible);
  }
  public get title(): string {
    return unwrap(this.item.title);
  }
  public get tooltip(): string {
    return unwrap(this.item.tooltip);
  }
  public get enabled(): boolean {
    return unwrap(this.item.enabled);
  }
  public get disabled(): boolean {
    const isEnabled = this.enabled;
    if (isEnabled === undefined) return false;
    return !isEnabled;
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
  public get css(): (() => string) | string {
    return unwrap(this.item.css);
  }
  public get innerCss(): string {
    return unwrap(this.item.innerCss);
  }
  public get data(): any {
    return unwrap(this.item.data);
  }
  public get popupModel(): any {
    return unwrap(this.item.popupModel);
  }
  public get active(): boolean {
    return unwrap(this.item.active);
  }
  public get template(): string {
    return this.item.template;
  }
  public get component(): string {
    return unwrap(this.item.component);
  }
  public get iconName(): string {
    return unwrap(this.item.iconName);
  }
  public get items(): any {
    return unwrap(this.item.items);
  }
  @property({ defaultValue: true }) isVisible: boolean;
  @property() needSeparator: boolean;
}

export class AdaptiveElement extends Base {
  @property({ defaultValue: true }) showTitles: boolean;
  @propertyArray() items: Array<AdaptiveActionBarItemWrapper>;
  @propertyArray({
    onSet: (val: any, target: AdaptiveElement) => {
      target.invisibleItemsListModel.items = target.invisibleItems;
    },
  })
  invisibleItems: Array<AdaptiveActionBarItemWrapper>;

  protected dotsItem: AdaptiveActionBarItemWrapper; // (...) button
  public dotsItemPopupModel: PopupModel;

  constructor() {
    super();
    this.dotsItemPopupModel = new PopupModel("sv-list", {
      model: this.invisibleItemsListModel,
    });
    this.dotsItem = new AdaptiveActionBarItemWrapper(
      this,
      new ActionBarItem({
        id: "dotsItem-id",
        component: "sv-action-bar-item-dropdown",
        css: "sv-dots",
        innerCss: "sv-dots__item",
        iconName: "icon-dots",
        // showTitle: true,
        // title: "...",
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

  public invisibleItemSelected(item: AdaptiveActionBarItemWrapper): void {
    if (!!item && typeof item.action === "function") {
      item.action();
    }
  }

  protected invisibleItemsListModel: ListModel = new ListModel(
    [],
    (item: AdaptiveActionBarItemWrapper) => {
      this.invisibleItemSelected(item);
      this.dotsItemPopupModel.toggleVisibility();
    },
    false
  );

  public showFirstN(visibleItemsCount: number) {
    let leftItemsToShow = visibleItemsCount;
    const invisibleItems: AdaptiveActionBarItemWrapper[] = [];
    this.items.forEach(item => {
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

export class ActionBar extends AdaptiveElement {
  constructor() {
    super();
  }
  public setItems(items: Array<IActionBarItem>) {
    var setItems = this.wrapItems(items);
    setItems = this.sortItems(setItems);
    this.items = setItems;
  }
  private wrapItems(
    items: Array<IActionBarItem>
  ): Array<AdaptiveActionBarItemWrapper> {
    return items.map((item: IActionBarItem) => {
      return new AdaptiveActionBarItemWrapper(this, item);
    });
  }
  private sortItems(items: Array<IActionBarItem>) {
    return []
      .concat(
        items.filter(
          item => item.visibleIndex >= 0 || item.visibleIndex === undefined
        )
      )
      .sort((firstItem, secondItem) => {
        return firstItem.visibleIndex - secondItem.visibleIndex;
      });
  }
}
