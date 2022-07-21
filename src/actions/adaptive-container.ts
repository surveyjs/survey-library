import { ResponsivityManager } from "../utils/responsivity-manager";
import { ListModel } from "../list";
import { PopupModel } from "../popup";
import { Action, actionModeType, IAction } from "./action";
import { ActionContainer } from "./container";
import { surveyLocalization } from "src/surveyStrings";

export class AdaptiveActionContainer<T extends Action = Action> extends ActionContainer<T> {
  protected dotsItem: Action;
  protected dotsItemPopupModel: PopupModel;
  private responsivityManager: ResponsivityManager;
  public minVisibleItemsCount: number = 0;
  public isResponsivenessDisabled = false;
  protected invisibleItemsListModel: ListModel = new ListModel(
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

  private hideItemsGreaterN(visibleItemsCount: number) {
    const actionsToHide = this.visibleActions.filter(action => !action.disableHide);
    visibleItemsCount = Math.max(visibleItemsCount, this.minVisibleItemsCount) - (this.visibleActions.length - actionsToHide.length);
    const invisibleItems: IAction[] = [];
    actionsToHide.forEach((item) => {
      if (visibleItemsCount <= 0) {
        item.mode = "popup";
        invisibleItems.push(item.innerItem);
      }
      visibleItemsCount--;
    });
    this.invisibleItemsListModel.setItems(invisibleItems);
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
      if (itemsSize > availableSize && !items[index].disableShrink) {
        itemsSize -= items[index].maxDimension - items[index].minDimension;
        items[index].mode = "small";
      } else {
        items[index].mode = "large";
      }
    }
  }

  private static ContainerID = 1;

  constructor() {
    super();
    this.dotsItemPopupModel = new PopupModel("sv-list", {
      model: this.invisibleItemsListModel
    });
    this.dotsItem = new Action({
      id: "dotsItem-id" + AdaptiveActionContainer.ContainerID++,
      component: "sv-action-bar-item-dropdown",
      css: "sv-dots",
      innerCss: "sv-dots__item",
      iconName: "icon-more",
      visible: false,
      tooltip: surveyLocalization.getString("more"),
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
    if (this.actions.length === 1 && !!this.actions[0].iconName)
      return this.actions;
    return this.actions.concat([<T>this.dotsItem]);
  }

  protected raiseUpdate(isResetInitialized: boolean) {
    if (!this.isResponsivenessDisabled) {
      super.raiseUpdate(isResetInitialized);
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
      this.setActionsMode("large");
    } else if (dimension < minSize) {
      this.setActionsMode("small");
      this.hideItemsGreaterN(this.getVisibleItemsCount(dimension - dotsItemSize));
      this.dotsItem.visible = true;
    } else {
      this.updateItemMode(dimension, maxSize);
    }
  }
  public initResponsivityManager(container: HTMLDivElement): void {
    this.responsivityManager = new ResponsivityManager(
      container, this,
      ".sv-action:not(.sv-dots)>.sv-action__content"
    );
  }
  public resetResponsivityManager(): void {
    if (!!this.responsivityManager) {
      this.responsivityManager.dispose();
      this.responsivityManager = undefined;
    }
  }
  public setActionsMode(mode: actionModeType) {
    this.actions.forEach((action) => (action.mode = mode));
  }
  public dispose(): void {
    super.dispose();
    this.resetResponsivityManager();
  }
}