import { ResponsivityManager } from "../utils/responsivity-manager";
import { ListModel } from "../list";
import { Action, actionModeType, createDropdownActionModelAdvanced, IAction } from "./action";
import { ActionContainer } from "./container";
import { getLocaleString } from "../surveyStrings";

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
        item.mode = "popup";
        hiddenItems.push(item.innerItem);
      }
      visibleItemsCount--;
    });
    this.hiddenItemsListModel.setItems(hiddenItems);
  }

  private getActionsToHide() {
    return this.visibleActions.filter(action => !action.disableHide);
  }

  private updateItemMode(availableSpace: number, maxItemsSize: number) {
    const items = this.visibleActions;
    for (let index = items.length - 1; index >= 0; index--) {
      if (maxItemsSize > availableSpace && !items[index].disableShrink) {
        maxItemsSize -= items[index].maxDimension - items[index].minDimension;
        items[index].mode = "small";
      } else {
        items[index].mode = "large";
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
      tooltip: getLocaleString("more"),
    }, {
      items: [],
      allowSelection: false
    });
  }
  public get hiddenItemsListModel(): ListModel {
    return this.dotsItem.data as ListModel;
  }

  protected onSet(): void {
    this.actions.forEach(action => action.updateCallback = (isResetInitialized: boolean) => this.raiseUpdate(isResetInitialized));
    super.onSet();
  }

  protected onPush(item: T): void {
    item.updateCallback = (isResetInitialized: boolean) => this.raiseUpdate(isResetInitialized);
    super.onPush(item);
  }

  protected getRenderedActions(): Array<T> {
    if (this.actions.length === 1 && !!this.actions[0].iconName)
      return this.actions;
    return this.actions.concat([<T>this.dotsItem]);
  }

  protected raiseUpdate(isResetInitialized: boolean): void {
    if (!this.isResponsivenessDisabled) {
      super.raiseUpdate(isResetInitialized);
    }
  }
  protected getActionMinDimension(action: Action): number {
    return action.disableShrink ? action.maxDimension : action.minDimension;
  }

  private getVisibleItemsCount(options: { availableSpace: number, gap?: number }): number {
    let { availableSpace, gap } = options;
    availableSpace -= this.dotsItem.minDimension + gap;
    let currentItemsSize = 0;
    if(this.visibleActions[0].disableHide) {
      availableSpace += gap;
    } else {
      currentItemsSize -= gap;
    }
    this.visibleActions
      .filter((action) => action.disableHide)
      .forEach(action => {
        return availableSpace -= (this.getActionMinDimension(action) + gap);
      });
    const actionsToHide = this.getActionsToHide();
    for(let i = 0; i < actionsToHide.length; i++) {
      currentItemsSize += this.getActionMinDimension(actionsToHide[i]) + gap;
      if (currentItemsSize > availableSpace) {
        return i;
      }
    }
  }

  public fit(options: { availableSpace: number, gap?: number }): void {
    if (options.availableSpace <= 0) return;
    options.gap = options.gap ?? 0;
    const { availableSpace, gap } = options;

    this.dotsItem.visible = false;
    const actions = this.visibleActions;
    let minSize = - 1 * options.gap;
    let maxSize = - 1 * options.gap;
    actions.forEach((action) => {
      minSize += this.getActionMinDimension(action) + gap;
      maxSize += action.maxDimension + gap;
    });
    if (availableSpace >= maxSize) {
      this.setActionsMode("large");
    } else if (availableSpace < minSize) {
      this.setActionsMode("small");
      this.hideItemsGreaterN(this.getVisibleItemsCount(options));
      this.dotsItem.visible = !!this.hiddenItemsListModel.actions.length;
    } else {
      this.updateItemMode(options.availableSpace, maxSize);
    }
  }
  public initResponsivityManager(container: HTMLDivElement): void {
    if (!!this.responsivityManager) {
      if (this.responsivityManager.container == container) {
        return;
      }
      this.responsivityManager.dispose();
    }
    this.responsivityManager = new ResponsivityManager(
      container, this,
    );
  }
  public resetResponsivityManager(): void {
    if (!!this.responsivityManager) {
      this.responsivityManager.dispose();
      this.responsivityManager = undefined;
    }
  }
  public setActionsMode(mode: actionModeType): void {
    this.actions.forEach((action) => {
      if(mode == "small" && action.disableShrink) {
        action.mode = "large";
      } else {
        action.mode = mode;
      }
    });
  }
  public dispose(): void {
    super.dispose();
    this.dotsItem.data.dispose();
    this.dotsItem.dispose();
    this.resetResponsivityManager();
  }
}