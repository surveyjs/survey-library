import { ResponsivityManager } from "../utils/responsivity-manager";
import { ListModel } from "../list";
import { Action, actionModeType, createDropdownActionModelAdvanced, IAction } from "./action";
import { ActionContainer } from "./container";
import { surveyLocalization } from "../surveyStrings";

export class AdaptiveActionContainer<T extends Action = Action> extends ActionContainer<T> {
  public dotsItem: Action;
  private responsivityManager: ResponsivityManager;
  public minVisibleItemsCount: number = 0;
  public isResponsivenessDisabled = false;

  private hideItemsGreaterN(visibleItemsCount: number) {
    const actionsToHide = this.getActionsToHide();
    visibleItemsCount = Math.max(visibleItemsCount, this.minVisibleItemsCount - (this.visibleActions.length - actionsToHide.length));
    const hiddenItems: IAction[] = [];
    actionsToHide.forEach((item) => {
      if (visibleItemsCount <= 0) {
        if(item.removePriority) {
          item.mode = "removed";
        } else {
          item.mode = "popup";
          hiddenItems.push(item.innerItem);
        }
      }
      visibleItemsCount--;
    });
    this.hiddenItemsListModel.setItems(hiddenItems);
  }

  private getActionsToHide() {
    return this.visibleActions.filter(action => !action.disableHide).sort((a, b) => a.removePriority || 0 - b.removePriority || 0);
  }

  private getVisibleItemsCount(availableSize: number): number {
    this.visibleActions.filter((action) => action.disableHide).forEach(action => availableSize -= action.minDimension);
    const itemsSizes: number[] = this.getActionsToHide().map((item) => item.minDimension);
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
    if (itemsSize > availableSize) {
      const hidableItems = this.visibleActions.filter(a => a.removePriority);
      hidableItems.sort((a, b) => a.removePriority - b.removePriority);
      for (let index = 0; index < hidableItems.length; index++) {
        if (itemsSize > availableSize) {
          itemsSize -= items[index].disableShrink ? hidableItems[index].maxDimension : hidableItems[index].minDimension;
          hidableItems[index].mode = "removed";
        }
      }
    }
  }

  private static ContainerID = 1;

  constructor() {
    super();

    this.dotsItem = createDropdownActionModelAdvanced({
      id: "dotsItem-id" + AdaptiveActionContainer.ContainerID++,
      css: "sv-dots",
      innerCss: "sv-dots__item",
      iconName: "icon-more",
      visible: false,
      tooltip: surveyLocalization.getString("more"),
    }, {
      items: [],
      allowSelection: false
    });
  }
  public get hiddenItemsListModel(): ListModel {
    return this.dotsItem.data as ListModel;
  }

  protected onSet() {
    this.actions.forEach(action => action.updateCallback = (isResetInitialized: boolean) => this.raiseUpdate(isResetInitialized));
    super.onSet();
  }

  protected onPush(item: T) {
    item.updateCallback = (isResetInitialized: boolean) => this.raiseUpdate(isResetInitialized);
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
      this.dotsItem.visible = !!this.hiddenItemsListModel.actions.length;
    } else {
      this.updateItemMode(dimension, maxSize);
    }
  }
  public initResponsivityManager(container: HTMLDivElement, delayedUpdateFunction?: (callback: () => void) => void): void {
    this.responsivityManager = new ResponsivityManager(
      container, this,
      ":scope > .sv-action:not(.sv-dots) > .sv-action__content", null,
      delayedUpdateFunction
    );
  }
  public resetResponsivityManager(): void {
    if (!!this.responsivityManager) {
      this.responsivityManager.dispose();
      this.responsivityManager = undefined;
    }
  }
  public setActionsMode(mode: actionModeType) {
    this.actions.forEach((action) => {
      if(mode == "small" && action.disableShrink) return;
      action.mode = mode;
    });
  }
  public dispose(): void {
    super.dispose();
    this.dotsItem.data.dispose();
    this.dotsItem.dispose();
    this.resetResponsivityManager();
  }
}