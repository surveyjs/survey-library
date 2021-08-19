import { ListModel } from "../list";
import { PopupModel } from "../popup";
import { Action, IAction } from "./action";
import { ActionContainer } from "./container";

export class AdaptiveActionContainer<T extends Action = Action, V extends IAction = IAction> extends ActionContainer<T> {
  protected dotsItem: Action; // (...) button
  public dotsItemPopupModel: PopupModel;

  public get visibleItems(): Array<Action> {
    return this.actions.filter((item) => item.mode !== "popup");
  }

  public setItems(items: Array<V>, sortByVisibleIndex = true) {
    const actions: Array<T> = <any>items.map((item) => (item instanceof Action ? item : new Action(item)));
    actions.forEach(action => action.updateCallback = () => this.raiseUpdate());
    if (sortByVisibleIndex) {
      this.actions = this.sortItems(actions);
    } else {
      this.actions = actions;
    }

  }
  private sortItems(items: Array<T>) {
    return []
      .concat(items.filter((item) => item.visibleIndex >= 0 || item.visibleIndex === undefined))
      .sort((firstItem, secondItem) => {
        return firstItem.visibleIndex - secondItem.visibleIndex;
      });
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
      // showTitle: true,
      // title: "...",
      visible: false,
      action: (item: any) => {
        this.dotsItemPopupModel.toggleVisibility();
      },
      popupModel: this.dotsItemPopupModel
    });
  }

  public get hasItems(): boolean {
    return (this.actions || []).length > 0;
  }

  public invisibleItemSelected(item: T): void {
    if (!!item && typeof item.action === "function") {
      item.action();
    }
  }

  protected onSet() {
    this.removeDotsButton();
    this.actions.push(<any>this.dotsItem);
    super.onSet();
  }
  protected onPush(item: T) {
    if(item !== this.dotsItem) {
      this.removeDotsButton();
      this.actions.push(<any>this.dotsItem);
    }
    super.onPush(item);
  }

  protected invisibleItemsListModel: ListModel = new ListModel(
    [],
    (item: T) => {
      this.invisibleItemSelected(item);
      this.dotsItemPopupModel.toggleVisibility();
    },
    false
  );

  public showFirstN(visibleItemsCount: number) {
    let leftItemsToShow = visibleItemsCount;
    const invisibleItems: Action[] = [];
    this.actions.filter(action => action.visible).forEach((item) => {
      if (item === this.dotsItem) {
        return;
      }
      if (leftItemsToShow <= 0) {
        item.mode = "popup";
        invisibleItems.push(item);
      }
      leftItemsToShow--;
    });
    this.invisibleItemsListModel.items = invisibleItems;
  }

  public removeDotsButton() {
    var index = this.actions.indexOf(<any>this.dotsItem);
    if (index !== -1) {
      this.actions.splice(index, 1);
    }
  }
  public hideDotsButton() {
    this.dotsItem.visible = false;
  }
  public showDotsButton() {
    this.dotsItem.visible = true;
  }
}
