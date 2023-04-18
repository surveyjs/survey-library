import { property } from "./jsonobject";
import { ActionContainer } from "./actions/container";
import { Action, BaseAction, IAction } from "./actions/action";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { ElementHelper } from "./element-helper";

export let defaultListCss = {
  root: "sv-list__container",
  item: "sv-list__item",
  searchClearButtonIcon: "sv-list__filter-clear-button",
  loadingIndicator: "sv-list__loading-indicator",
  itemSelected: "sv-list__item--selected",
  itemWithIcon: "sv-list__item--with-icon",
  itemDisabled: "sv-list__item--disabled",
  itemFocused: "sv-list__item--focused",
  itemIcon: "sv-list__item-icon",
  itemSeparator: "sv-list__item-separator",
  itemBody: "sv-list__item-body",
  itemsContainer: "sv-list",
  filter: "sv-list__filter",
  filterIcon: "sv-list__filter-icon",
  filterInput: "sv-list__input",
  emptyContainer: "sv-list__empty-container",
  emptyText: "sv-list__empty-text"
};
export interface IListModel {
  items: Array<IAction>;
  onSelectionChanged: (item: Action, ...params: any[]) => void;
  allowSelection?: boolean;
  selectedItem?: IAction;
  onFilterStringChangedCallback?: (text: string) => void;
}
export class ListModel<T extends BaseAction = Action> extends ActionContainer<T> {
  private listContainerHtmlElement: HTMLElement;
  private loadingIndicatorValue: T;

  @property({
    defaultValue: true,
    onSet: (newValue: boolean, target: ListModel<T>) => {
      target.onSet();
    }
  }) searchEnabled: boolean;
  @property({ defaultValue: false }) showFilter: boolean;
  @property({ defaultValue: false }) isExpanded: boolean;
  @property({}) selectedItem: IAction;
  @property() focusedItem: T;
  @property({
    onSet: (_, target: ListModel<T>) => {
      target.onFilterStringChanged(target.filterString);
    }
  }) filterString: string;
  @property({ defaultValue: false }) hasVerticalScroller: boolean;
  @property({ defaultValue: true }) isAllDataLoaded: boolean;
  @property({ defaultValue: false }) showSearchClearButton: boolean;
  @property({ defaultValue: true }) renderElements: boolean;

  public static INDENT: number = 16;
  public static MINELEMENTCOUNT: number = 10;
  public scrollHandler: (e?: any) => void;
  public areSameItemsCallback: (item1: IAction, item2: IAction) => boolean;

  private hasText(item: T, filterStringInLow: string): boolean {
    if (!filterStringInLow) return true;
    let textInLow = (item.title || "").toLocaleLowerCase();
    return textInLow.indexOf(filterStringInLow.toLocaleLowerCase()) > -1;
  }
  public isItemVisible(item: T): boolean {
    return item.visible && (!this.shouldProcessFilter || this.hasText(item, this.filterString));
  }
  public get visibleItems(): Array<T> {
    return this.visibleActions.filter(item => this.isItemVisible(item));
  }
  private get shouldProcessFilter(): boolean {
    return !this.onFilterStringChangedCallback;
  }
  private onFilterStringChanged(text: string) {
    this.isEmpty = this.renderedActions.filter(action => this.isItemVisible(action)).length === 0;

    if (!!this.onFilterStringChangedCallback) {
      this.onFilterStringChangedCallback(text);
    }
  }
  private scrollToItem(selector: string, ms = 0): void {
    setTimeout(() => {
      if (!this.listContainerHtmlElement) return;

      const item = this.listContainerHtmlElement.querySelector("." + selector);
      if (item) {
        item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      }
    }, ms);
  }

  constructor(
    items: Array<IAction>,
    public onSelectionChanged: (item: T, ...params: any[]) => void,
    public allowSelection: boolean,
    selectedItem?: IAction,
    private onFilterStringChangedCallback?: (text: string) => void,
    public elementId?: string
  ) {
    super();
    this.setItems(items);
    this.selectedItem = selectedItem;
  }

  public setItems(items: Array<IAction>, sortByVisibleIndex = true): void {
    super.setItems(items, sortByVisibleIndex);
    if(this.elementId) {
      this.renderedActions.forEach((action: IAction) => { action.elementId = this.elementId + action.id; });
    }
    if (!this.isAllDataLoaded && !!this.actions.length) {
      this.actions.push(this.loadingIndicator);
    }
  }
  protected onSet(): void {
    this.showFilter = this.searchEnabled && (this.actions || []).length > ListModel.MINELEMENTCOUNT;
    super.onSet();
  }
  protected getDefaultCssClasses() {
    return defaultListCss;
  }

  public onItemClick = (itemValue: T): void => {
    if (this.isItemDisabled(itemValue)) {
      return;
    }
    this.isExpanded = false;
    if (this.allowSelection) {
      this.selectedItem = itemValue;
    }
    if (!!this.onSelectionChanged) {
      this.onSelectionChanged(itemValue);
    }
  };

  public isItemDisabled: (itemValue: T) => boolean = (itemValue: T) => {
    return itemValue.enabled !== undefined && !itemValue.enabled;
  };

  public isItemSelected: (itemValue: T) => boolean = (itemValue: T) => {
    return this.areSameItems(this.selectedItem, itemValue);
  };

  public isItemFocused: (itemValue: T) => boolean = (itemValue: T) => {
    return this.areSameItems(this.focusedItem, itemValue);
  };
  protected areSameItems(item1: IAction, item2: IAction): boolean {
    if(!!this.areSameItemsCallback) return this.areSameItemsCallback(item1, item2);
    return !!item1 && !!item2 && item1.id == item2.id;
  }

  public getItemClass: (itemValue: T) => string = (itemValue: T) => {
    return new CssClassBuilder()
      .append(this.cssClasses.item)
      .append(this.cssClasses.itemWithIcon, !!itemValue.iconName)
      .append(this.cssClasses.itemDisabled, this.isItemDisabled(itemValue))
      .append(this.cssClasses.itemFocused, this.isItemFocused(itemValue))
      .append(this.cssClasses.itemSelected, this.isItemSelected(itemValue))
      .append(itemValue.css)
      .toString();
  };

  public getItemIndent = (itemValue: any) => {
    const level: number = itemValue.level || 0;
    return (level + 1) * ListModel.INDENT + "px";
  };

  public get filterStringPlaceholder(): string {
    return this.getLocalizationString("filterStringPlaceholder");
  }
  public get emptyMessage(): string {
    return this.isAllDataLoaded ? this.getLocalizationString("emptyMessage") : this.loadingText;
  }
  public get scrollableContainer(): HTMLElement {
    return this.listContainerHtmlElement.querySelector("." + this.getDefaultCssClasses().itemsContainer);
  }
  public get loadingText(): string {
    return this.getLocalizationString("loadingFile");
  }
  public get loadingIndicator(): T {
    if (!this.loadingIndicatorValue) {
      this.loadingIndicatorValue = <T><any>(new Action({
        id: "loadingIndicator",
        title: this.loadingText,
        action: () => { },
        css: this.cssClasses.loadingIndicator
      }));
    }
    return this.loadingIndicatorValue;
  }

  public goToItems(event: KeyboardEvent): void {
    if (event.key === "ArrowDown" || event.keyCode === 40) {
      const currentElement = (<HTMLElement>event.target).parentElement;
      const listElement = currentElement.parentElement.querySelector("ul");
      if (!!listElement && !!listElement.firstElementChild) {
        ElementHelper.focusElement(listElement.firstElementChild);
        event.preventDefault();
      }
    }
  }
  public onMouseMove(event: MouseEvent): void {
    this.resetFocusedItem();
  }
  public onKeyDown(event: KeyboardEvent): void {
    const currentElement = <Element>event.target;
    if (event.key === "ArrowDown" || event.keyCode === 40) {
      ElementHelper.focusElement(ElementHelper.getNextElementPreorder(currentElement));
      event.preventDefault();
    } else if (event.key === "ArrowUp" || event.keyCode === 38) {
      ElementHelper.focusElement(ElementHelper.getNextElementPostorder(currentElement));
      event.preventDefault();
    }
  }
  public onPointerDown(event: PointerEvent, item: any) { }
  public refresh(): void { // used in popup
    this.filterString = "";
    this.resetFocusedItem();
  }
  public onClickSearchClearButton(event: any) {
    event.currentTarget.parentElement.querySelector("input").focus();
    this.refresh();
  }
  public resetFocusedItem(): void {
    this.focusedItem = undefined;
  }
  public focusFirstVisibleItem(): void {
    this.focusedItem = this.visibleItems[0];
  }
  public focusLastVisibleItem(): void {
    this.focusedItem = this.visibleItems[this.visibleItems.length - 1];
  }
  public initFocusedItem() {
    this.focusedItem = this.visibleItems.filter(item => item.visible && this.isItemSelected(item))[0];
    if (!this.focusedItem) {
      this.focusFirstVisibleItem();
    }
  }
  public focusNextVisibleItem(): void {
    if (!this.focusedItem) {
      this.initFocusedItem();
    } else {
      const items = this.visibleItems;
      const currentFocusedItemIndex = items.indexOf(this.focusedItem);
      const nextItem = items[currentFocusedItemIndex + 1];
      if (nextItem) {
        this.focusedItem = nextItem;
      } else {
        this.focusFirstVisibleItem();
      }
    }
  }
  public focusPrevVisibleItem(): void {
    if (!this.focusedItem) {
      this.initFocusedItem();
    } else {
      const items = this.visibleItems;
      const currentFocusedItemIndex = items.indexOf(this.focusedItem);
      const prevItem = items[currentFocusedItemIndex - 1];
      if (prevItem) {
        this.focusedItem = prevItem;
      } else {
        this.focusLastVisibleItem();
      }
    }
  }
  public selectFocusedItem(): void {
    !!this.focusedItem && this.onItemClick(this.focusedItem);
  }
  public initListContainerHtmlElement(htmlElement: HTMLElement): void {
    this.listContainerHtmlElement = htmlElement;
  }
  public onLastItemRended(item: T): void {
    if (this.isAllDataLoaded) return;

    if (item === this.actions[this.actions.length - 1] && !!this.listContainerHtmlElement) {
      this.hasVerticalScroller = ElementHelper.hasVerticalScroller(this.scrollableContainer);
    }
  }
  public scrollToFocusedItem(): void {
    this.scrollToItem(this.getDefaultCssClasses().itemFocused);
  }
  public scrollToSelectedItem(): void {
    this.scrollToItem(this.getDefaultCssClasses().itemSelected, 110);
  }

  public addScrollEventListener(handler: (e?: any) => void): void {
    if (!!handler) {
      this.scrollHandler = handler;
    }
    if (!!this.scrollHandler) {
      this.scrollableContainer.addEventListener("scroll", this.scrollHandler);
    }
  }
  public removeScrollEventListener(): void {
    if (!!this.scrollHandler) {
      this.scrollableContainer.removeEventListener("scroll", this.scrollHandler);
    }
  }

  dispose(): void {
    super.dispose();
    if(!!this.loadingIndicatorValue) {
      this.loadingIndicatorValue.dispose();
    }
  }
}
