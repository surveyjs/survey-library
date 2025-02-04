import { property } from "./jsonobject";
import { ActionContainer } from "./actions/container";
import { Action, BaseAction, IAction } from "./actions/action";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { ElementHelper } from "./element-helper";
import { classesToSelector, getFirstVisibleChild } from "./utils/utils";
import { settings } from "./settings";
import { ILocalizableOwner } from "./localizablestring";

export let defaultListCss = {
  root: "sv-list__container",
  item: "sv-list__item",
  searchClearButtonIcon: "sv-list__filter-clear-button",
  loadingIndicator: "sv-list__loading-indicator",
  itemSelected: "sv-list__item--selected",
  itemGroup: "sv-list__item--group",
  itemGroupSelected: "sv-list__item--group-selected",
  itemWithIcon: "sv-list__item--with-icon",
  itemDisabled: "sv-list__item--disabled",
  itemFocused: "sv-list__item--focused",
  itemHovered: "sv-list__item--hovered",
  itemTextWrap: "sv-list__item-text--wrap",
  itemIcon: "sv-list__item-icon",
  itemMarkerIcon: "sv-list-item__marker-icon",
  itemSeparator: "sv-list__item-separator",
  itemBody: "sv-list__item-body",
  itemsContainer: "sv-list",
  itemsContainerFiltering: "sv-list--filtering",
  filter: "sv-list__filter",
  filterIcon: "sv-list__filter-icon",
  filterInput: "sv-list__input",
  emptyContainer: "sv-list__empty-container",
  emptyText: "sv-list__empty-text"
};
export interface IListModel {
  items: Array<IAction>;
  onSelectionChanged?: (item: IAction, ...params: any[]) => void;
  allowSelection?: boolean;
  searchEnabled?: boolean;
  selectedItem?: IAction;
  elementId?: string;
  locOwner?: ILocalizableOwner;
  cssClasses?: any;
  onFilterStringChangedCallback?: (text: string) => void;
  onTextSearchCallback?: (item: IAction, textToSearch: string) => boolean;
}
export class ListModel<T extends BaseAction = Action> extends ActionContainer<T> {
  private listContainerHtmlElement: HTMLElement;
  private loadingIndicatorValue: T;
  private onFilterStringChangedCallback: (text: string) => void;
  private onTextSearchCallback: (item: IAction, textToSearch: string) => boolean;

  @property({
    defaultValue: true,
    onSet: (newValue: boolean, target: ListModel<T>) => {
      target.onSet();
    }
  }) searchEnabled: boolean;
  @property({ defaultValue: false }) showFilter: boolean;
  @property({ defaultValue: false }) forceShowFilter: boolean;
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
  @property({ defaultValue: false }) textWrapEnabled: boolean;
  @property({ defaultValue: "sv-list-item-content" }) itemComponent: string;

  public static INDENT: number = 16;
  public static MINELEMENTCOUNT: number = 10;
  public scrollHandler: (e?: any) => void;
  public areSameItemsCallback: (item1: IAction, item2: IAction) => boolean;

  private hasText(item: T, filterStringInLow: string): boolean {
    if (!filterStringInLow) return true;
    const text = item.title || "";
    if (this.onTextSearchCallback) return this.onTextSearchCallback(item, filterStringInLow);
    let textInLow = text.toLocaleLowerCase();
    textInLow = settings.comparator.normalizeTextCallback(textInLow, "filter");
    return textInLow.indexOf(filterStringInLow.toLocaleLowerCase()) > -1;
  }
  public isItemVisible(item: T): boolean {
    return item.visible && (!this.shouldProcessFilter || this.hasText(item, this.filterString));
  }

  protected getRenderedActions(): Array<T> {
    let actions = super.getRenderedActions();

    if (this.filterString) {
      let newActions: Array<T> = [];
      actions.forEach(action => {
        newActions.push(action);
        if (action.items) {
          action.items.forEach(item => {
            const a = new Action(item);
            if (!a.iconName) { a.iconName = action.iconName; }
            newActions.push(a as IAction as T);
          });
        }
      });
      return newActions;
    }

    return actions;
  }
  public get visibleItems(): Array<T> {
    return this.visibleActions.filter(item => this.isItemVisible(item));
  }
  private get shouldProcessFilter(): boolean {
    return !this.onFilterStringChangedCallback;
  }
  private onFilterStringChanged(text: string) {
    if (!!this.onFilterStringChangedCallback) {
      this.onFilterStringChangedCallback(text);
    }
    this.updateIsEmpty();
  }
  private updateIsEmpty(): void {
    this.isEmpty = this.renderedActions.filter(action => this.isItemVisible(action)).length === 0;
  }
  private scrollToItem(classes: string, ms = 0): void {
    setTimeout(() => {
      if (!this.listContainerHtmlElement) return;

      const item = this.listContainerHtmlElement.querySelector(classesToSelector(classes));
      if (item) {
        setTimeout(() => {
          item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
        }, ms);
      }
    }, ms);
  }

  constructor(
    items: Array<IAction> | IListModel,
    public onSelectionChanged?: (item: T, ...params: any[]) => void,
    public allowSelection?: boolean,
    selectedItem?: IAction,
    public elementId?: string
  ) {
    super();
    if (Object.keys(items).indexOf("items") !== -1) {
      const options = (items as any) as IListModel;
      Object.keys(options).forEach((key: keyof IListModel) => {
        switch (key) {
          case "items":
            this.setItems(options.items);
            break;
          case "onFilterStringChangedCallback":
            this.setOnFilterStringChangedCallback(options.onFilterStringChangedCallback);
            break;
          case "onTextSearchCallback":
            this.setOnTextSearchCallback(options.onTextSearchCallback);
            break;
          default:
            (this as any)[key] = options[key];
        }
      });
      this.updateActionsIds();
    } else {
      this.setItems(items as Array<IAction>);
      this.selectedItem = selectedItem;
    }
  }
  public setOnFilterStringChangedCallback(callback: (text: string) => void): void {
    this.onFilterStringChangedCallback = callback;
  }
  public setOnTextSearchCallback(callback: (item: T, textToSearch: string) => boolean): void {
    this.onTextSearchCallback = callback;
  }
  public setItems(items: Array<IAction>, sortByVisibleIndex = true): void {
    super.setItems(items, sortByVisibleIndex);
    this.updateActionsIds();
    if (!this.isAllDataLoaded && !!this.actions.length) {
      this.actions.push(this.loadingIndicator);
    }
  }
  private updateActionsIds(): void {
    if (this.elementId) {
      this.renderedActions.forEach((action: IAction) => { action.elementId = this.elementId + action.id; });
    }
  }
  public setSearchEnabled(newValue: boolean): void {
    this.searchEnabled = newValue;
    this.showSearchClearButton = newValue;
  }
  protected onSet(): void {
    this.showFilter = this.searchEnabled && (this.forceShowFilter || (this.actions || []).length > ListModel.MINELEMENTCOUNT);
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
    const action = (itemValue as IAction).action;
    if (!!action) {
      action(itemValue);
    }
  };

  protected popupAfterShowCallback(itemValue: T) {
    this.addScrollEventListener(() => {
      itemValue.hidePopup();
    });
  }

  public onItemHover = (itemValue: T): void => {
    this.mouseOverHandler(itemValue);
  }
  public onItemLeave(itemValue: T) {
    itemValue.hidePopupDelayed(this.subItemsHideDelay);
  }

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
    if (!!this.areSameItemsCallback) return this.areSameItemsCallback(item1, item2);
    return !!item1 && !!item2 && item1.id == item2.id;
  }

  public getListClass: () => string = () => {
    return new CssClassBuilder()
      .append(this.cssClasses.itemsContainer)
      .append(this.cssClasses.itemsContainerFiltering, !!this.filterString && this.visibleActions.length !== this.visibleItems.length)
      .toString();
  }
  public getItemClass: (itemValue: T) => string = (itemValue: T) => {
    const isSelected = this.isItemSelected(itemValue);
    return new CssClassBuilder()
      .append(this.cssClasses.item)
      .append(this.cssClasses.itemWithIcon, !!itemValue.iconName)
      .append(this.cssClasses.itemDisabled, this.isItemDisabled(itemValue))
      .append(this.cssClasses.itemFocused, this.isItemFocused(itemValue))
      .append(this.cssClasses.itemSelected, !itemValue.hasSubItems && isSelected)
      .append(this.cssClasses.itemGroup, itemValue.hasSubItems)
      .append(this.cssClasses.itemGroupSelected, itemValue.hasSubItems && isSelected)

      .append(this.cssClasses.itemHovered, itemValue.isHovered)
      .append(this.cssClasses.itemTextWrap, this.textWrapEnabled)
      .append(itemValue.css)
      .toString();
  };

  // public getItemIndent = (itemValue: any) => {
  //   const level: number = itemValue.level || 0;
  //   return (level + 1) * ListModel.INDENT + "px";
  // };

  public getItemStyle = (itemValue: any) => {
    const level: number = itemValue.level || 0;
    return {
      "--sjs-list-item-level": level + 1
    };
  };

  public get filterStringPlaceholder(): string {
    return this.getLocalizationString("filterStringPlaceholder");
  }
  public get emptyMessage(): string {
    return this.isAllDataLoaded ? this.getLocalizationString("emptyMessage") : this.loadingText;
  }
  public get scrollableContainer(): HTMLElement {
    return this.listContainerHtmlElement.querySelector(classesToSelector(this.cssClasses.itemsContainer));
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
      const firstChild = getFirstVisibleChild(listElement);
      if (!!listElement && !!firstChild) {
        ElementHelper.focusElement(firstChild);
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
    if(this.filterString !== "") {
      this.filterString = "";
    } else {
      this.updateIsEmpty();
    }
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
    this.scrollToItem(this.cssClasses.itemFocused);
  }
  public scrollToSelectedItem(): void {
    if (!!this.selectedItem && this.selectedItem.items && this.selectedItem.items.length > 0) {
      this.scrollToItem(this.cssClasses.itemGroupSelected, 110);
    } else {
      this.scrollToItem(this.cssClasses.itemSelected, 110);
    }
  }

  public addScrollEventListener(handler: (e?: any) => void): void {
    if (!!handler) {
      this.removeScrollEventListener();
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

  public dispose(): void {
    super.dispose();
    if (!!this.loadingIndicatorValue) {
      this.loadingIndicatorValue.dispose();
    }
    this.listContainerHtmlElement = undefined;
  }
}
