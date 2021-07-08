import { ListModel } from "../list";
import { PopupModel } from "../popup";
import { Action, IAction } from "./action";
import { ActionContainer } from "./container";

export class AdaptiveActionContainer extends ActionContainer<Action> {

    protected dotsItem: Action; // (...) button
    public dotsItemPopupModel: PopupModel;
  
    public get visibleItems(): Array<Action> {
      return this.actions.filter((item) => item.mode !== "popup");
    }
  
    public setItems(items: Array<Action>) {
      this.actions = this.sortItems(items);
    }
    private sortItems(items: Array<IAction>) {
      return []
        .concat(
          items.filter(
            (item) => item.visibleIndex >= 0 || item.visibleIndex === undefined
          )
        )
        .sort((firstItem, secondItem) => {
          return firstItem.visibleIndex - secondItem.visibleIndex;
        });
    }

    constructor() {
      super();
      this.dotsItemPopupModel = new PopupModel("sv-list", {
        model: this.invisibleItemsListModel,
      });
      this.dotsItem = new Action({
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
        });
    }
  
    public get hasItems(): boolean {
      return (this.actions || []).length > 0;
    }
  
    public invisibleItemSelected(item: Action): void {
      if (!!item && typeof item.action === "function") {
        item.action();
      }
    }
  
    protected invisibleItemsListModel: ListModel = new ListModel(
      [],
      (item: Action) => {
        this.invisibleItemSelected(item);
        this.dotsItemPopupModel.toggleVisibility();
      },
      false
    );
  
    public showFirstN(visibleItemsCount: number) {
      let leftItemsToShow = visibleItemsCount;
      const invisibleItems: Action[] = [];
      this.actions.forEach((item) => {
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
      this.addDotsButton(visibleItemsCount);
    }
  
    public removeDotsButton() {
      var index = this.actions.indexOf(this.dotsItem);
      if (index !== -1) {
        this.actions.splice(index, 1);
      }
    }
  
    private addDotsButton(newIndex: number) {
      if (newIndex < this.actions.length) {
        this.actions.splice(newIndex, 0, this.dotsItem);
      }
    }
  }
  