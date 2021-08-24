import { ListModel } from "../list";
import { PopupModel } from "../popup";
import { Action, IAction } from "./action";
import { ActionContainer } from "./container";

export class AdaptiveActionContainer<T extends Action = Action> extends ActionContainer<T> {
  protected dotsItem: Action;
  protected dotsItemPopupModel: PopupModel;

  private invisibleItemsListModel: ListModel = new ListModel(
    [],
    (item: T) => {
      this.invisibleItemSelected(item);
      this.dotsItemPopupModel.toggleVisibility();
    },
    false
  );

  private invisibleItemSelected(item: T): void {
    if (!!item && typeof item.action === "function") {
      item.action();
    }
  }

  private sortItems(items: Array<T>) {
    return []
      .concat(items.filter((item) => item.visibleIndex >= 0 || item.visibleIndex === undefined))
      .sort((firstItem, secondItem) => {
        return firstItem.visibleIndex - secondItem.visibleIndex;
      });
  }

  private hideItemsGreaterN(visibleItemsCount: number) {
    const invisibleItems: Action[] = [];
    this.visibleActions.forEach((item) => {
      if (visibleItemsCount <= 0) {
        item.mode = "popup";
        invisibleItems.push(item);
      }
      visibleItemsCount--;
    });
    this.invisibleItemsListModel.items = invisibleItems;
  }

  private getVisibleItemsCount(availableSize: number): number {
    const itemsSizes: number[] = this.visibleActions.map((item) => item.minDimension);
    let currSize: number = 0;
    for (var i = 0; i < itemsSizes.length; i++) {
      currSize += itemsSizes[i];
      if (currSize > availableSize) return i;
    }
    return i;
  }

  private updateItemMode(availableSize: number, itemsSize: number) {
    const items = this.visibleActions;
    for (let index = items.length - 1; index >= 0; index--) {
      if (itemsSize > availableSize) {
        itemsSize -= items[index].maxDimension - items[index].minDimension;
        items[index].mode = "small";
      } else {
        items[index].mode = "large";
      }
    }
  }

  constructor() {
    super();
    this.dotsItemPopupModel = new PopupModel("sv-list", {
      model: this.invisibleItemsListModel
    });
    this.dotsItem = new Action({
      id: "dotsItem-id",
      component: "sv-action-bar-item-dropdown",
      css: "sv-dots",
      innerCss: "sv-dots__item",
      iconName: "icon-dots",
      visible: false,
      action: (item: any) => {
        this.dotsItemPopupModel.toggleVisibility();
      },
      popupModel: this.dotsItemPopupModel
    });
  }
  protected onSet() {
    this.actions.forEach(action => action.updateCallback = () => this.raiseUpdate(false));
    super.onSet();
  }

  protected onPush(item: T) {
    item.updateCallback = () => this.raiseUpdate(false);
    super.onPush(item);
  }

  protected getRenderedActions(): Array<T> {
    return this.actions.concat([<T>this.dotsItem]);
  }

  public setItems(items: Array<IAction>, sortByVisibleIndex = true) {
    const actions: Array<T> = <any>items.map((item) => (item instanceof Action ? item : new Action(item)));
    if (sortByVisibleIndex) {
      this.actions = this.sortItems(actions);
    } else {
      this.actions = actions;
    }
  }

  public fit(dimension: number, dotsItemSize: number) {
    if (dimension <= 0) return;

    this.dotsItem.visible = false;
    let minSize = 0;
    let maxSize = 0;
    const items = this.visibleActions;

    items.forEach((item) => {
      minSize += item.minDimension;
      maxSize += item.maxDimension;
    });

    if (dimension >= maxSize) {
      items.forEach((item) => (item.mode = "large"));
    } else if (dimension < minSize) {
      items.forEach((item) => (item.mode = "small"));
      this.hideItemsGreaterN(this.getVisibleItemsCount(dimension - dotsItemSize));
      this.dotsItem.visible = true;
    } else {
      this.updateItemMode(dimension, maxSize);
    }
  }
}